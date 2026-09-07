let runtimeDatasets: Readonly<Record<string, unknown>> | null = null
type DatasetLoader = (key: string, signal: AbortSignal) => Promise<unknown>
let loader: DatasetLoader | null = null
let generation = 0
const pending = new Map<string, Promise<void>>()
const failures = new Map<string, unknown>()
const controllers = new Set<AbortController>()

export function configureRuntimeLoader(next: DatasetLoader): void { loader = next }
export function runtimeGeneration(): number { return generation }

/** Stable derived arrays/objects without retaining data from a previous login. */
export function memoRuntime<T>(selector: () => T): () => T {
  let previousGeneration = -1
  let cached: T
  return () => {
    if (previousGeneration !== generation) {
      const value = selector()
      cached = value
      previousGeneration = generation
    }
    return cached
  }
}

export function installRuntimeDatasets(datasets: Record<string, unknown>): void {
  runtimeDatasets = Object.freeze({ ...datasets })
}

export function resetRuntimeDatasets(): void {
  generation++
  controllers.forEach(controller => controller.abort())
  controllers.clear()
  pending.clear()
  failures.clear()
  runtimeDatasets = null
}

/** Deduplicate per-session reads. Late responses from an old identity are discarded. */
export function loadRuntimeDataset(key: string): Promise<void> {
  if (hasRuntimeDataset(key)) return Promise.resolve()
  if (pending.has(key)) return pending.get(key)!
  if (!loader) return Promise.reject(new Error('Runtime dataset loader has not been configured'))
  const currentGeneration = generation
  const controller = new AbortController()
  controllers.add(controller)
  const task = loader(key, controller.signal).then(value => {
    if (currentGeneration === generation) {
      runtimeDatasets = Object.freeze({ ...runtimeDatasets, [key]: value })
      failures.delete(key)
    }
  }).catch(error => {
    if (currentGeneration === generation) failures.set(key, error)
  }).finally(() => {
    controllers.delete(controller)
    if (currentGeneration === generation) pending.delete(key)
  })
  pending.set(key, task)
  return task
}

export function getRuntimeDataset<T>(key: string): T {
  if (loader && !hasRuntimeDataset(key)) {
    if (failures.has(key)) throw failures.get(key)
    // Read only during render/selectors; the nearest Suspense boundary owns loading UI.
    throw loadRuntimeDataset(key)
  }
  if (!runtimeDatasets) {
    throw new Error(`Runtime datasets have not been initialized before reading dataset: ${key}`)
  }

  if (!(key in runtimeDatasets)) {
    throw new Error(`Dataset is missing from the API bootstrap response: ${key}`)
  }

  return runtimeDatasets[key] as T
}

export function hasRuntimeDataset(key: string): boolean {
  return Boolean(runtimeDatasets && key in runtimeDatasets)
}
