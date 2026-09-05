import { bootstrapApi } from '../../../shared/api/bootstrap.api'
import { installRuntimeDatasets, resetRuntimeDatasets } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { KnowledgeBootstrapResult } from '../../../shared/api/bootstrap.types'

let bootstrapPromise: Promise<KnowledgeBootstrapResult> | null = null

export function bootstrapKnowledge(): Promise<KnowledgeBootstrapResult> {
  bootstrapPromise ??= bootstrapApi.get().then((result) => {
    installRuntimeDatasets(result.datasets)
    return result
  }).catch((error) => {
    bootstrapPromise = null
    throw error
  })
  return bootstrapPromise
}

export function resetKnowledgeBootstrap(): void {
  bootstrapPromise = null
  resetRuntimeDatasets()
}
