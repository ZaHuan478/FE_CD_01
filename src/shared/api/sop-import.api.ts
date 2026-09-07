import { apiRequest } from './httpClient'

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
  sortOrder: number
  checklist?: string[]
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
  status: 'needs_review' | 'accepted' | 'published' | 'failed'
  file: { name: string; mediaType: string; size: number; checksum: string }
  extractedText: string
  preview: SopImportPreview
  warnings: string[]
  targetSopId: string | null
  targetVersionId: string | null
  createdAt: string
  updatedAt: string
  acceptedAt: string | null
}

export const sopImportApi = {
  list: (signal?: AbortSignal) => apiRequest<{ data: SopImportItem[] }>('/sop-imports', { signal }),
  upload: (form: FormData) => apiRequest<{ data: SopImportItem }>('/sop-imports', {
    method: 'POST', body: form, timeoutMs: 120_000
  }),
  update: (id: string, preview: SopImportPreview) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}`, {
    method: 'PUT', body: JSON.stringify(preview)
  }),
  accept: (id: string) => apiRequest<{ data: { import: SopImportItem; sop: unknown } }>(`/sop-imports/${encodeURIComponent(id)}/accept`, {
    method: 'POST'
  }),
  publish: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/publish`, {
    method: 'POST'
  })
}
