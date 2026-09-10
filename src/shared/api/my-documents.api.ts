import { apiRequest, parseApiErrorResponse } from './httpClient'
import { apiBaseUrl } from '../config/api'
import { getAuthenticationHeaders } from '../lib/auth/authCredentials'

export interface UserDocumentItem {
  id: string
  originalFileName: string
  displayName: string
  storageKey: string
  mediaType: string
  format: 'docx' | 'pdf'
  fileSize: number
  checksum: string
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sourceImportJobId: string | null
}

export interface ListUserDocumentsResult {
  items: UserDocumentItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ListUserDocumentsOptions {
  search?: string
  format?: 'all' | 'docx' | 'pdf'
  tab?: 'active' | 'trash'
  page?: number
  pageSize?: number
}

export async function fetchDocumentBlob(id: string, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(`${apiBaseUrl}/my-documents/${encodeURIComponent(id)}/file`, {
    headers: getAuthenticationHeaders(),
    signal,
    cache: 'no-store'
  })
  if (!response.ok) {
    throw await parseApiErrorResponse(response)
  }
  return response.blob()
}

export const myDocumentsApi = {
  list: (options: ListUserDocumentsOptions = {}, signal?: AbortSignal) => {
    const params = new URLSearchParams()
    if (options.search?.trim()) params.set('search', options.search.trim())
    if (options.format && options.format !== 'all') params.set('format', options.format)
    if (options.tab) params.set('tab', options.tab)
    if (options.page) params.set('page', String(options.page))
    if (options.pageSize) params.set('pageSize', String(options.pageSize))

    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<{ data: ListUserDocumentsResult }>(`/my-documents${query}`, { signal })
  },

  get: (id: string, signal?: AbortSignal) =>
    apiRequest<{ data: UserDocumentItem }>(`/my-documents/${encodeURIComponent(id)}`, { signal }),

  upload: (form: FormData) =>
    apiRequest<{ data: UserDocumentItem }>('/my-documents', {
      method: 'POST',
      body: form,
      timeoutMs: 120_000
    }),

  rename: (id: string, displayName: string) =>
    apiRequest<{ data: UserDocumentItem }>(`/my-documents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ displayName })
    }),

  delete: (id: string) =>
    apiRequest<{ data: UserDocumentItem }>(`/my-documents/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }),

  restore: (id: string) =>
    apiRequest<{ data: UserDocumentItem }>(`/my-documents/${encodeURIComponent(id)}/restore`, {
      method: 'POST'
    })
}
