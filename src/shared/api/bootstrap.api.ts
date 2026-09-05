import { apiRequest } from './httpClient'
import type { KnowledgeBootstrapResult } from './bootstrap.types'

export const bootstrapApi = {
  get: () => apiRequest<KnowledgeBootstrapResult>('/bootstrap')
}
