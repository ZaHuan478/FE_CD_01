import { apiRequest, parseApiErrorResponse } from './httpClient'
import { apiBaseUrl } from '../config/api'
import { getAuthenticationHeaders } from '../lib/auth/authCredentials'

export async function fetchSopSource(id: string, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(`${apiBaseUrl}/sop-imports/${encodeURIComponent(id)}/source`, {
    headers: getAuthenticationHeaders(), signal, cache: 'no-store'
  })
  if (!response.ok) {
    throw await parseApiErrorResponse(response)
  }
  return response.blob()
}

export interface SopImportStep {
  id: string
  stableKey: string
  code: string
  title: string
  objective?: string | null
  description?: string | null
  actor?: string | null
  location?: string | null
  timing?: string | null
  nodeKind: 'start' | 'task' | 'decision' | 'parallel_fork' | 'parallel_join' | 'subprocess' | 'end'
  typeCode?: string | null
  positionX?: number
  positionY?: number
  sortOrder: number
  confidence?: number
  sourceRefs?: Array<{
    lineStart?: number
    lineEnd?: number
    page?: number
    text: string
  }>
  checklist?: string[]
  imageUrl?: string | null
  illustrationPreset?: string | null
  inputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }>
  outputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }>
}

export interface SopImportPreview {
  code: string
  title: string
  category?: string | null
  moduleIds: string[]
  primaryModuleId: string
  definition?: string | null
  purpose?: string | null
  scope?: string | null
  changeLog?: string | null
  steps: SopImportStep[]
  transitions: Array<{
    id?: string; fromStepId?: string | null; toStepId?: string | null
    kind: 'normal' | 'conditional' | 'return' | 'parallel_fork' | 'parallel_join' | 'subprocess'
    condition?: string | null; branchLabel?: string | null; targetSopId?: string | null; sortOrder?: number
  }>
}

export interface SopImportItem {
  id: string
  status: 'needs_review' | 'accepted' | 'published' | 'failed' | 'archived'
  file: { name: string; mediaType: string; size: number; checksum: string }
  extractedText: string
  preview: SopImportPreview
  warnings: string[]
  targetSopId: string | null
  targetVersionId: string | null
  createdBy: string
  audience: {
    mode: 'personal' | 'department' | 'job_title' | 'department_job_title' | 'module'
    department: string | null
    jobTitle: string | null
  }
  createdAt: string
  updatedAt: string
  acceptedAt: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNote: string | null
  sourceDocumentId: string | null
}

export interface CreateDocumentConversionInput {
  documentId: string
  code: string
  title: string
  primaryModuleId: string
  category?: string
  audienceMode?: 'personal' | 'department' | 'job_title' | 'department_job_title' | 'module'
}

export interface SopFlowValidation {
  valid: boolean
  issues: Array<{
    severity: 'error' | 'warning'
    code: string
    message: string
    stepId?: string
    transitionId?: string
  }>
}

export interface SopFlowResult {
  mermaid: string
  validation: SopFlowValidation
  steps?: SopImportStep[]
  transitions?: SopImportPreview['transitions']
}

export const sopImportApi = {
  createFromDocument: (input: CreateDocumentConversionInput) => apiRequest<{ data: SopImportItem }>('/document-conversions', {
    method: 'POST', body: JSON.stringify(input), timeoutMs: 120_000
  }),
  revise: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/revise`, { method: 'POST' }),
  archive: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/archive`, { method: 'POST' }),
  list: (signal?: AbortSignal) => apiRequest<{ data: SopImportItem[] }>('/sop-imports', { signal }),
  get: (id: string, signal?: AbortSignal) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}`, { signal }),
  upload: (form: FormData) => apiRequest<{ data: SopImportItem }>('/sop-imports', {
    method: 'POST', body: form, timeoutMs: 120_000
  }),
  update: (id: string, preview: SopImportPreview) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}`, {
    method: 'PUT', body: JSON.stringify(preview)
  }),
  flow: (id: string, signal?: AbortSignal) => apiRequest<{ data: SopFlowResult }>(`/sop-imports/${encodeURIComponent(id)}/flow`, { signal }),
  validateFlow: (id: string, preview: SopImportPreview) => apiRequest<{ data: SopFlowResult }>(`/sop-imports/${encodeURIComponent(id)}/flow/validate`, {
    method: 'POST', body: JSON.stringify(preview)
  }),
  delete: (id: string) => apiRequest<{ data: { id: string } }>(`/sop-imports/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }),
  accept: (id: string) => apiRequest<{ data: { import: SopImportItem; sop: unknown } }>(`/sop-imports/${encodeURIComponent(id)}/accept`, {
    method: 'POST'
  }),
  review: (id: string, note?: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/review`, {
    method: 'POST', body: JSON.stringify({ note })
  }),
  publish: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/publish`, {
    method: 'POST'
  })
}



