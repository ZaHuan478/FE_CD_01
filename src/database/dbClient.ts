import type {
  DatabaseBootstrapResult,
  SqlValue,
  WorkerRequest,
  WorkerRequestPayload,
  WorkerResponse
} from './types'

const worker = new Worker(new URL('./db.worker.ts', import.meta.url), { type: 'module' })
let nextRequestId = 1
const pending = new Map<number, {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}>()

worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
  const response = event.data
  const request = pending.get(response.id)
  if (!request) return
  pending.delete(response.id)
  if (response.ok) request.resolve(response.result)
  else request.reject(new Error(response.error ?? 'SQLite worker request failed'))
}

worker.onerror = (event) => {
  const error = new Error(event.message || 'SQLite worker crashed')
  for (const request of pending.values()) request.reject(error)
  pending.clear()
}

function send<T>(message: WorkerRequestPayload, transfer: Transferable[] = []): Promise<T> {
  const id = nextRequestId++
  return new Promise<T>((resolve, reject) => {
    pending.set(id, {
      resolve: resolve as (value: unknown) => void,
      reject
    })
    worker.postMessage({ ...message, id } as WorkerRequest, transfer)
  })
}

export const knowledgeDatabase = {
  initialize: () => send<DatabaseBootstrapResult>({ type: 'initialize' }),

  query: <T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: SqlValue[]
  ) => send<T[]>({ type: 'execute', sql, params }),

  execute: (sql: string, params?: SqlValue[]) =>
    send<Record<string, unknown>[]>({ type: 'execute', sql, params, persist: true }),

  exportFile: () => send<ArrayBuffer>({ type: 'export' }),

  importFile: (bytes: ArrayBuffer) =>
    send<DatabaseBootstrapResult>({ type: 'import', bytes }, [bytes]),

  reset: () => send<DatabaseBootstrapResult>({ type: 'reset' })
}
