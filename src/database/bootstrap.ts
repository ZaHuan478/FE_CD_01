import { knowledgeDatabase } from './dbClient'
import { installRuntimeDatasets } from './runtimeData'
import type { DatabaseBootstrapResult } from './types'

let bootstrapPromise: Promise<DatabaseBootstrapResult> | null = null

export function bootstrapKnowledgeDatabase(): Promise<DatabaseBootstrapResult> {
  bootstrapPromise ??= knowledgeDatabase.initialize().then((result) => {
    installRuntimeDatasets(result.datasets)
    return result
  })
  return bootstrapPromise
}
