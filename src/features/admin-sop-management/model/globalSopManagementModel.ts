import { knowledgeApi, type KnowledgePage } from '../../../shared/api/knowledge.api'
import { sopManagementApi, stateLabels, type ManagedSop } from '../../sop-management/model/sopManagementModel'

export type { KnowledgePage, ManagedSop }
export { stateLabels }

export const globalSopManagementApi = {
  listPublished: (query: string, page: number, signal?: AbortSignal) => knowledgeApi.catalogDocuments({ q: query, type: 'procedure', page, pageSize: 12 }, signal),
  listDrafts: (query: string, state: string, page: number, signal?: AbortSignal) => sopManagementApi.list(query, state, page, signal)
}
