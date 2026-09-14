import { apiRequest } from './httpClient'

export type GlossaryStatus = 'draft' | 'published' | 'archived'

export interface RelatedTermSummary {
  id: string
  slug: string
  term: string
  vietnameseName: string | null
  shortDefinition: string
}

export interface GlossaryTerm {
  id: string
  slug: string
  term: string
  vietnameseName: string | null
  category: string
  routePath: string | null
  status: GlossaryStatus
  currentPublishedVersion: number | null
  sortOrder: number
  isActive: boolean
  versionNumber?: number
  versionStatus?: GlossaryStatus
  shortDefinition?: string
  detailedDefinition?: string
  aliases?: string[]
  examples?: string[]
  relatedTermSlugs?: string[]
  relatedTerms?: RelatedTermSummary[]
  hasDraftVersion?: boolean
  createdAt: string
  updatedAt: string
}

export interface GlossaryFilterParams {
  q?: string
  category?: string
  letter?: string
  page?: number
  limit?: number
}

export interface GlossaryListResponse {
  items: GlossaryTerm[]
  total: number
  page: number
  limit: number
}

export interface CreateGlossaryTermInput {
  slug: string
  term: string
  vietnameseName?: string | null
  category: string
  routePath?: string | null
  sortOrder?: number
  shortDefinition: string
  detailedDefinition: string
  aliases: string[]
  examples: string[]
  relatedTermSlugs: string[]
}

export type UpdateGlossaryTermInput = Partial<CreateGlossaryTermInput>

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return ''
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  }
  const str = search.toString()
  return str ? `?${str}` : ''
}

export const systemGlossaryApi = {
  list: (params?: GlossaryFilterParams, signal?: AbortSignal) =>
    apiRequest<{ data: GlossaryListResponse }>(`/system-glossary${buildQuery(params as Record<string, string | number | undefined>)}`, { signal }),

  detail: (slug: string, signal?: AbortSignal) =>
    apiRequest<{ data: GlossaryTerm }>(`/system-glossary/${encodeURIComponent(slug)}`, { signal }),

  byGuide: (guideId: string, signal?: AbortSignal) =>
    apiRequest<{ data: GlossaryTerm[] }>(`/system-glossary/by-guide/${encodeURIComponent(guideId)}`, { signal }),

  adminList: (params?: { q?: string; category?: string; status?: string }, signal?: AbortSignal) =>
    apiRequest<{ data: GlossaryTerm[] }>(`/admin/system-glossary${buildQuery(params)}`, { signal }),

  adminDetail: (id: string, signal?: AbortSignal) =>
    apiRequest<{ data: { term: GlossaryTerm; draftVersion?: GlossaryTerm; publishedVersion?: GlossaryTerm } }>(
      `/admin/system-glossary/${encodeURIComponent(id)}`,
      { signal }
    ),

  create: (body: CreateGlossaryTermInput) =>
    apiRequest<{ data: GlossaryTerm }>('/admin/system-glossary', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  update: (id: string, body: UpdateGlossaryTermInput) =>
    apiRequest<{ data: { id: string; success: boolean } }>(
      `/admin/system-glossary/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body)
      }
    ),

  publish: (id: string) =>
    apiRequest<{ data: { id: string; status: 'published' } }>(
      `/admin/system-glossary/${encodeURIComponent(id)}/publish`,
      { method: 'POST' }
    ),

  archive: (id: string) =>
    apiRequest<{ data: { id: string; status: 'archived' } }>(
      `/admin/system-glossary/${encodeURIComponent(id)}/archive`,
      { method: 'POST' }
    ),

  associateGuide: (body: { guideId: string; guideVersionNumber?: number; termIds: string[] }) =>
    apiRequest<{ data: { guideId: string; versionNumber: number; termCount: number; success: boolean } }>(
      '/admin/system-glossary/guide-association',
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    )
}
