import { apiRequest } from '../api/apiClient'
import { installRuntimeDatasets } from './runtimeData'
import type { DatabaseBootstrapResult } from './types'

let bootstrapPromise: Promise<DatabaseBootstrapResult> | null = null

export function bootstrapKnowledgeDatabase(): Promise<DatabaseBootstrapResult> {
  bootstrapPromise ??= apiRequest<DatabaseBootstrapResult>('/bootstrap').then((result) => {
    installRuntimeDatasets(result.datasets)
    return result
  }).catch((error) => {
    bootstrapPromise = null
    throw error
  })
  return bootstrapPromise
}

export function resetKnowledgeDatabase(): void {
  bootstrapPromise = null
}
