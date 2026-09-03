import type { PersistedSnapshot } from './types'

const DATABASE_NAME = 'hrm-knowledge-browser'
const STORE_NAME = 'sqlite-snapshots'
const DATABASE_VERSION = 1

function openSnapshotDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onerror = () => reject(request.error ?? new Error('Cannot open IndexedDB'))
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await openSnapshotDatabase()
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode)
      const request = operation(transaction.objectStore(STORE_NAME))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('IndexedDB operation failed'))
      transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
    })
  } finally {
    database.close()
  }
}

export function readSnapshot(id: PersistedSnapshot['id']): Promise<PersistedSnapshot | undefined> {
  return withStore('readonly', (store) => store.get(id))
}

export function writeSnapshot(snapshot: PersistedSnapshot): Promise<IDBValidKey> {
  return withStore('readwrite', (store) => store.put(snapshot))
}

export function deleteSnapshot(id: PersistedSnapshot['id']): Promise<undefined> {
  return withStore('readwrite', (store) => store.delete(id)) as Promise<undefined>
}
