export interface ReleaseManifest {
  releaseId: string
  schemaVersion: number
  databaseFile: string
  sha256: string
  publishedAt: string
}

export interface PersistedSnapshot {
  id: 'active' | 'backup'
  bytes: ArrayBuffer
  releaseId: string
  schemaVersion: number
  baseHash: string
  revision: number
  dirty: boolean
  savedAt: string
}

export interface DatabaseBootstrapResult {
  datasets: Record<string, unknown>
  release: ReleaseManifest
  local: {
    revision: number
    dirty: boolean
    updateAvailable: boolean
    storagePersisted: boolean
  }
  stats: {
    modules: number
    processes: number
    versions: number
    steps: number
    transitions: number
    articles: number
  }
}

export type SqlValue = string | number | Uint8Array | null

export type WorkerRequest =
  | { id: number; type: 'initialize' }
  | { id: number; type: 'execute'; sql: string; params?: SqlValue[]; persist?: boolean }
  | { id: number; type: 'export' }
  | { id: number; type: 'import'; bytes: ArrayBuffer }
  | { id: number; type: 'reset' }

export type WorkerRequestPayload = WorkerRequest extends infer Request
  ? Request extends { id: number }
    ? Omit<Request, 'id'>
    : never
  : never

export interface WorkerResponse<T = unknown> {
  id: number
  ok: boolean
  result?: T
  error?: string
}
