/// <reference lib="webworker" />

import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url'
import { deleteSnapshot, readSnapshot, writeSnapshot } from './snapshotStore'
import type {
  DatabaseBootstrapResult,
  PersistedSnapshot,
  ReleaseManifest,
  WorkerRequest,
  WorkerResponse
} from './types'

const workerScope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope
const channel = new BroadcastChannel('hrm-knowledge-database')

let SQL: SqlJsStatic | null = null
let database: Database | null = null
let manifest: ReleaseManifest | null = null
let snapshot: PersistedSnapshot | null = null

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('')
}

async function loadManifest(): Promise<ReleaseManifest> {
  const response = await fetch('/data/release-manifest.json', { cache: 'no-store' })
  if (!response.ok) throw new Error(`Cannot load SQLite release manifest (${response.status})`)
  return response.json() as Promise<ReleaseManifest>
}

async function loadReleaseBytes(release: ReleaseManifest): Promise<ArrayBuffer> {
  const response = await fetch(`/data/${release.databaseFile}`, { cache: 'force-cache' })
  if (!response.ok) throw new Error(`Cannot load SQLite release database (${response.status})`)
  const bytes = await response.arrayBuffer()
  const actualHash = await sha256Hex(bytes)
  if (actualHash !== release.sha256) throw new Error('SQLite release checksum does not match manifest')
  return bytes
}

function requireDatabase(): Database {
  if (!database) throw new Error('SQLite database is not initialized')
  return database
}

function scalarNumber(sql: string): number {
  const result = requireDatabase().exec(sql)
  return Number(result[0]?.values[0]?.[0] ?? 0)
}

function readDatasets(): Record<string, unknown> {
  const result = requireDatabase().exec('SELECT dataset_key, payload_json FROM app_dataset ORDER BY dataset_key')
  const datasets: Record<string, unknown> = {}
  for (const row of result[0]?.values ?? []) {
    datasets[String(row[0])] = JSON.parse(String(row[1]))
  }
  return datasets
}

function validateDatabase(candidate: Database): void {
  const integrity = candidate.exec('PRAGMA integrity_check')
  if (integrity[0]?.values[0]?.[0] !== 'ok') throw new Error('Imported SQLite file failed integrity check')
  const schema = candidate.exec("SELECT value FROM app_meta WHERE key = 'schema_version'")
  if (!schema[0]?.values[0]?.[0]) throw new Error('Imported file is not an HRM knowledge database')
  const datasetTable = candidate.exec("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='app_dataset'")
  if (Number(datasetTable[0]?.values[0]?.[0]) !== 1) throw new Error('Imported file is missing app_dataset')
}

async function persistDatabase(dirty: boolean): Promise<void> {
  const currentDatabase = requireDatabase()
  const currentManifest = manifest
  if (!currentManifest) throw new Error('Release manifest is unavailable')

  const exported = currentDatabase.export()
  const copiedBytes = exported.buffer.slice(
    exported.byteOffset,
    exported.byteOffset + exported.byteLength
  ) as ArrayBuffer

  const next: PersistedSnapshot = {
    id: 'active',
    bytes: copiedBytes,
    releaseId: snapshot?.releaseId ?? currentManifest.releaseId,
    schemaVersion: currentManifest.schemaVersion,
    baseHash: snapshot?.baseHash ?? currentManifest.sha256,
    revision: (snapshot?.revision ?? 0) + 1,
    dirty,
    savedAt: new Date().toISOString()
  }

  if (snapshot) await writeSnapshot({ ...snapshot, id: 'backup' })
  await writeSnapshot(next)

  snapshot = next
  channel.postMessage({ type: 'snapshot-changed', revision: next.revision })
}

async function refreshFromLatestSnapshot(): Promise<void> {
  const latest = await readSnapshot('active')
  if (!latest || latest.revision <= (snapshot?.revision ?? -1) || !SQL) return
  const candidate = new SQL.Database(new Uint8Array(latest.bytes))
  validateDatabase(candidate)
  database?.close()
  database = candidate
  snapshot = latest
}

async function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  if ('locks' in navigator) {
    return navigator.locks.request('hrm-knowledge-snapshot-write', operation)
  }
  return operation()
}

async function initialize(): Promise<DatabaseBootstrapResult> {
  SQL ??= await initSqlJs({ locateFile: () => wasmUrl })
  manifest = await loadManifest()

  const existing = await readSnapshot('active')
  let updateAvailable = false

  if (!existing || (!existing.dirty && existing.releaseId !== manifest.releaseId)) {
    const bytes = await loadReleaseBytes(manifest)
    snapshot = {
      id: 'active',
      bytes,
      releaseId: manifest.releaseId,
      schemaVersion: manifest.schemaVersion,
      baseHash: manifest.sha256,
      revision: (existing?.revision ?? 0) + 1,
      dirty: false,
      savedAt: new Date().toISOString()
    }
    if (existing) await writeSnapshot({ ...existing, id: 'backup' })
    await writeSnapshot(snapshot)
  } else {
    snapshot = existing
    updateAvailable = existing.releaseId !== manifest.releaseId
  }

  database?.close()
  database = new SQL.Database(new Uint8Array(snapshot.bytes))
  validateDatabase(database)

  let storagePersisted = false
  if (navigator.storage?.persisted) {
    storagePersisted = await navigator.storage.persisted()
    if (!storagePersisted && navigator.storage.persist) {
      storagePersisted = await navigator.storage.persist()
    }
  }

  return {
    datasets: readDatasets(),
    release: manifest,
    local: {
      revision: snapshot.revision,
      dirty: snapshot.dirty,
      updateAvailable,
      storagePersisted
    },
    stats: {
      modules: scalarNumber('SELECT count(*) FROM hr_module'),
      processes: scalarNumber('SELECT count(*) FROM process'),
      versions: scalarNumber('SELECT count(*) FROM process_version'),
      steps: scalarNumber('SELECT count(*) FROM process_step'),
      transitions: scalarNumber('SELECT count(*) FROM process_transition'),
      articles: scalarNumber('SELECT count(*) FROM knowledge_article')
    }
  }
}

async function execute(request: Extract<WorkerRequest, { type: 'execute' }>): Promise<unknown> {
  const runStatement = async () => {
    if (request.persist) await refreshFromLatestSnapshot()
    const db = requireDatabase()
    if (request.persist) db.run('BEGIN IMMEDIATE')
    try {
    const statement = db.prepare(request.sql)
    try {
      if (request.params) statement.bind(request.params)
      const rows: Record<string, unknown>[] = []
      while (statement.step()) rows.push(statement.getAsObject())
      if (request.persist) {
        db.run('COMMIT')
        await persistDatabase(true)
      }
      return rows
    } finally {
      statement.free()
    }
    } catch (error) {
      if (request.persist) {
        try { db.run('ROLLBACK') } catch { /* transaction was not active */ }
      }
      throw error
    }
  }

  return request.persist ? withWriteLock(runStatement) : runStatement()
}

async function importDatabase(bytes: ArrayBuffer): Promise<DatabaseBootstrapResult> {
  await withWriteLock(async () => {
    if (!SQL || !manifest) await initialize()
    await refreshFromLatestSnapshot()
    const candidate = new (SQL as SqlJsStatic).Database(new Uint8Array(bytes))
    validateDatabase(candidate)
    database?.close()
    database = candidate
    snapshot = {
      id: 'active',
      bytes,
      releaseId: String(candidate.exec("SELECT value FROM app_meta WHERE key='release_id'")[0]?.values[0]?.[0] ?? 'imported'),
      schemaVersion: Number(candidate.exec("SELECT value FROM app_meta WHERE key='schema_version'")[0]?.values[0]?.[0] ?? 1),
      baseHash: await sha256Hex(bytes),
      revision: (snapshot?.revision ?? 0) + 1,
      dirty: true,
      savedAt: new Date().toISOString()
    }
    await writeSnapshot(snapshot)
    channel.postMessage({ type: 'snapshot-changed', revision: snapshot.revision })
  })
  return initialize()
}

async function resetDatabase(): Promise<DatabaseBootstrapResult> {
  await withWriteLock(async () => {
    await deleteSnapshot('active')
    database?.close()
    database = null
    snapshot = null
    channel.postMessage({ type: 'snapshot-reset' })
  })
  return initialize()
}

channel.onmessage = (event: MessageEvent<{ type?: string; revision?: number }>) => {
  if (event.data.type !== 'snapshot-changed') return
  if ((event.data.revision ?? 0) <= (snapshot?.revision ?? 0)) return
  void refreshFromLatestSnapshot()
}

workerScope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data
  let response: WorkerResponse
  try {
    let result: unknown
    if (request.type === 'initialize') result = await initialize()
    else if (request.type === 'execute') result = await execute(request)
    else if (request.type === 'export') {
      const exported = requireDatabase().export()
      result = exported.buffer.slice(exported.byteOffset, exported.byteOffset + exported.byteLength)
    } else if (request.type === 'import') result = await importDatabase(request.bytes)
    else result = await resetDatabase()
    response = { id: request.id, ok: true, result }
  } catch (error) {
    response = {
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }

  if (response.result instanceof ArrayBuffer) {
    workerScope.postMessage(response, [response.result])
  } else {
    workerScope.postMessage(response)
  }
}

export {}
