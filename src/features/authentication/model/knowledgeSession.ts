import { knowledgeApi } from '../../../shared/api/knowledge.api'
import { configureRuntimeLoader, loadRuntimeDataset, resetRuntimeDatasets } from '../../../shared/lib/runtime-datasets/runtimeData'

export function beginKnowledgeSession(): void {
  resetRuntimeDatasets()
  configureRuntimeLoader(async (key, signal) => {
    if (key === 'workflow.index') return (await knowledgeApi.workflows(signal)).data
    if (key.startsWith('workflow.detail:')) return (await knowledgeApi.workflow(key.slice('workflow.detail:'.length), signal)).data
    return (await knowledgeApi.dataset(key, signal)).data
  })
}

/** Only small shared navigation data; never the full SOP or master-data datasets. */
export function warmKnowledgeNavigation(): void {
  for (const key of ['translations', 'sop.dictionary', 'page.businessNodes', 'coreOperations.config', 'workflow.index']) {
    void loadRuntimeDataset(key)
  }
}
