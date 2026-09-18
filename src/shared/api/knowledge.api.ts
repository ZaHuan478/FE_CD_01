import { apiRequest } from './httpClient'

export interface KnowledgeSummary {
  id: string
  code: string
  title: string
  type: 'procedure' | 'policy' | 'guide' | 'glossary' | 'form' | 'catalog'
  summary: string
  workflowId: string | null
  moduleIds: string[]
  version?: number
}
export interface KnowledgePage {
  data: KnowledgeSummary[]
  pagination: { page: number; pageSize: number; total: number }
}
export interface KnowledgeListParams {
  q?: string
  moduleId?: string
  type?: KnowledgeSummary['type'] | 'all'
  page?: number
  pageSize?: number
}
export interface CreateKnowledgeDocumentBody {
  code: string
  title: string
  type: KnowledgeSummary['type']
  summary: string
  moduleIds: string[]
  content: Record<string, unknown>
  effectiveFrom?: string
  effectiveTo?: string
}
export const knowledgeApi = {
  dataset: (key: string, signal?: AbortSignal) => apiRequest<{ data: unknown }>(`/ui/datasets/${encodeURIComponent(key)}`, { signal }),
  workflows: (signal?: AbortSignal) => apiRequest<{ data: unknown }>('/ui/workflows', { signal }),
  workflow: (id: string, signal?: AbortSignal) => apiRequest<{ data: unknown }>(`/ui/workflows/${encodeURIComponent(id)}`, { signal }),
  // Global search is used by the header quick search. Request the full
  // catalogue page so a published document without a workflow id is not
  // hidden simply because it sorts after the first few workflow records.
  search: (q: string, signal?: AbortSignal, page = 1) => apiRequest<KnowledgePage>(`/knowledge-search?${new URLSearchParams({ q, type: 'procedure', page: String(page), pageSize: '100' })}`, { signal }),
  documents: (moduleId: string, page = 1, signal?: AbortSignal) => apiRequest<KnowledgePage>(`/knowledge-documents?${new URLSearchParams({ moduleId, page: String(page), pageSize: '20' })}`, { signal }),
  catalogDocuments: (params: KnowledgeListParams = {}, signal?: AbortSignal) => {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 20)
    })
    if (params.q?.trim()) query.set('q', params.q.trim())
    if (params.moduleId) query.set('moduleId', params.moduleId)
    if (params.type && params.type !== 'all') query.set('type', params.type)
    return apiRequest<KnowledgePage>(`/knowledge-documents?${query}`, { signal })
  },
  createDocument: (body: CreateKnowledgeDocumentBody) => apiRequest<KnowledgeSummary>('/knowledge-documents', {
    method: 'POST',
    body: JSON.stringify(body)
  }),
  document: (id: string, signal?: AbortSignal) => apiRequest<{ data: KnowledgeSummary & { content: Record<string, unknown> } }>(`/knowledge-documents/${encodeURIComponent(id)}`, { signal })
}
