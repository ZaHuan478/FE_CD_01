import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import initSqlJs from 'sql.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDirectory = join(projectRoot, 'public', 'data')
const manifest = JSON.parse(await readFile(join(dataDirectory, 'release-manifest.json'), 'utf8'))
const databaseBytes = await readFile(join(dataDirectory, manifest.databaseFile))
const actualHash = createHash('sha256').update(databaseBytes).digest('hex')

if (actualHash !== manifest.sha256) {
  throw new Error(`Release checksum mismatch: expected ${manifest.sha256}, received ${actualHash}`)
}

const SQL = await initSqlJs({
  locateFile: (file) => join(projectRoot, 'node_modules', 'sql.js', 'dist', file)
})
const database = new SQL.Database(databaseBytes)

const scalar = (sql) => Number(database.exec(sql)[0]?.values[0]?.[0] ?? 0)
const text = (sql) => String(database.exec(sql)[0]?.values[0]?.[0] ?? '')
const integrity = text('PRAGMA integrity_check')
const foreignKeyErrors = scalar('SELECT count(*) FROM pragma_foreign_key_check')
const schemaVersion = Number(text("SELECT value FROM app_meta WHERE key='schema_version'"))
const releaseId = text("SELECT value FROM app_meta WHERE key='release_id'")
const requiredDatasets = [
  'coreOperations.config',
  'crossFunctional.registry',
  'crossModule.flows',
  'erd.clusters',
  'legacy.data',
  'lifecycle.journey',
  'lifecycleStepper.modules',
  'masterData.catalog',
  'matrix.subsystems',
  'page.businessNodes',
  'policy.registry',
  'sop.dictionary',
  'translations',
  'workflow.sopDatabase'
]

const datasetRows = database.exec('SELECT dataset_key FROM app_dataset ORDER BY dataset_key')[0]?.values ?? []
const datasetKeys = new Set(datasetRows.map((row) => String(row[0])))
const missingDatasets = requiredDatasets.filter((key) => !datasetKeys.has(key))

const result = {
  integrity,
  foreignKeyErrors,
  releaseId,
  schemaVersion,
  checksum: actualHash,
  sizeBytes: databaseBytes.byteLength,
  datasets: datasetKeys.size,
  modules: scalar('SELECT count(*) FROM hr_module'),
  processes: scalar('SELECT count(*) FROM process'),
  versions: scalar('SELECT count(*) FROM process_version'),
  steps: scalar('SELECT count(*) FROM process_step'),
  transitions: scalar('SELECT count(*) FROM process_transition'),
  relations: scalar('SELECT count(*) FROM process_relation'),
  articles: scalar('SELECT count(*) FROM knowledge_article'),
  documents: scalar('SELECT count(*) FROM document'),
  ragChunks: scalar('SELECT count(*) FROM rag_chunk')
}

database.close()

if (integrity !== 'ok') throw new Error(`SQLite integrity check failed: ${integrity}`)
if (foreignKeyErrors !== 0) throw new Error(`SQLite has ${foreignKeyErrors} foreign-key violations`)
if (schemaVersion !== manifest.schemaVersion) throw new Error('Manifest and SQLite schema versions differ')
if (releaseId !== manifest.releaseId) throw new Error('Manifest and SQLite release IDs differ')
if (missingDatasets.length) throw new Error(`SQLite is missing datasets: ${missingDatasets.join(', ')}`)
if (!result.processes || !result.steps || !result.modules) throw new Error('Normalized knowledge tables are empty')
if (schemaVersion >= 2 && (!result.documents || !result.ragChunks)) {
  throw new Error('Schema v2 is missing imported document or RAG data')
}

console.log(JSON.stringify(result, null, 2))
