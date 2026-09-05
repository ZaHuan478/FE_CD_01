let runtimeDatasets: Readonly<Record<string, unknown>> | null = null

export function installRuntimeDatasets(datasets: Record<string, unknown>): void {
  runtimeDatasets = Object.freeze({ ...datasets })
}

export function resetRuntimeDatasets(): void {
  runtimeDatasets = null
}

export function getRuntimeDataset<T>(key: string): T {
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
