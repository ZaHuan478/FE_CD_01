import { apiRequest, parseApiErrorResponse } from './httpClient'
import { apiBaseUrl } from '../config/api'
import { getAuthenticationHeaders } from '../lib/auth/authCredentials'

export async function fetchSopSource(id: string, signal?: AbortSignal): Promise<Blob> {
  const trimmed = id ? id.trim() : ''
  if (!trimmed) {
    throw new Error('ID tài liệu nguồn không hợp lệ hoặc chưa được lưu')
  }
  const response = await fetch(`${apiBaseUrl}/sop-imports/${encodeURIComponent(trimmed)}/source`, {
    headers: getAuthenticationHeaders(), signal, cache: 'no-store'
  })
  if (!response.ok) {
    throw await parseApiErrorResponse(response)
  }
  return response.blob()
}

export type SourceMediaKind =
  | 'embedded_image'
  | 'page_screenshot'
  | 'page_crop'
  | 'diagram'
  | 'unknown'

export interface SourceMedia {
  id: string
  kind: SourceMediaKind
  page?: number
  paragraphIndex?: number
  relationId?: string
  sourceOutlineItemId?: string
  subPath?: string
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  storageKey: string
  previewUrl?: string
  mimeType: string
  checksum: string
  width?: number
  height?: number
  caption?: string
  sortOrder: number
  confidence: number
  assignmentStatus: 'assigned' | 'unassigned' | 'ignored'
  stepStableKey?: string
  stepTitle?: string
}

export type StepMediaRole =
  | 'cover'
  | 'illustration'
  | 'screenshot'
  | 'form'
  | 'diagram'

export interface StepMedia {
  id: string
  sourceMediaId?: string
  storageKey: string
  url?: string
  caption?: string
  role: StepMediaRole
  sourcePage?: number
  sourceSubPath?: string
  sortOrder: number
  confidence?: number
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
  media?: StepMedia[]
  inputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }>
  outputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }>
}

export type SopSourceSemanticKind =
  | 'main_step' | 'action' | 'decision' | 'subprocess' | 'section'
  | 'input_field' | 'checklist' | 'rule' | 'note'

export interface SopSourceOutlineItem {
  id: string
  parentId?: string | null
  level: number
  marker?: string | null
  markerKind: 'named_step' | 'code' | 'number' | 'letter' | 'roman' | 'bullet' | 'heading' | 'paragraph'
  semanticKind: SopSourceSemanticKind
  title: string
  content?: string | null
  page?: number
  lineStart: number
  lineEnd: number
  sortOrder: number
  confidence: number
}

export interface SopSourceStructure {
  schemaVersion: 1 | 2
  adapter: 'pdf-layout' | 'pdf-ocr' | 'docx-html' | 'docx-ocr' | 'plain-text'
  outline: SopSourceOutlineItem[]
  media?: SourceMedia[]
  stats: {
    pageCount: number
    itemCount: number
    lowConfidenceCount: number
    operationalStepCount: number
  }
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
  sourceStructure?: SopSourceStructure
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
  reprocess: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/reprocess`, {
    method: 'POST', timeoutMs: 120_000
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
  }),
  getMedia: (id: string, signal?: AbortSignal) => apiRequest<{
    data: {
      media: SourceMedia[]
      assigned: SourceMedia[]
      unassigned: SourceMedia[]
      ignored: SourceMedia[]
    }
  }>(`/sop-imports/${encodeURIComponent(id)}/media`, { signal }),
  updateMedia: (id: string, mediaId: string, body: {
    targetStepStableKey?: string | null
    caption?: string | null
    role?: StepMediaRole
    sortOrder?: number
    isIgnored?: boolean
    setAsCover?: boolean
  }) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/media/${encodeURIComponent(mediaId)}`, {
    method: 'PATCH', body: JSON.stringify(body)
  }),
  cropMedia: (id: string, body: {
    page: number
    boundingBox: { x: number; y: number; width: number; height: number }
    targetStepStableKey: string
    caption?: string
    role?: StepMediaRole
    imageDataUrl?: string
  }) => apiRequest<{ data: { media: SourceMedia; stepMedia: StepMedia } }>(`/sop-imports/${encodeURIComponent(id)}/media/crops`, {
    method: 'POST', body: JSON.stringify(body)
  }),
  reextractMedia: (id: string) => apiRequest<{ data: SopImportItem }>(`/sop-imports/${encodeURIComponent(id)}/media/reextract`, {
    method: 'POST', timeoutMs: 120_000
  })
}



