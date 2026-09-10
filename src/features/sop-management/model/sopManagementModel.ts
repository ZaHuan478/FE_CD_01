import { apiRequest } from '../../../shared/api/httpClient'
export { getErrorMessage } from '../../../shared/api/httpClient'
import type { SopImportPreview } from '../../sop-import/model/sopImportModel'
export type { SopImportPreview }
export interface ManagedSop {
  id: string; documentId: string | null; baseVersion: number; revision: number
  state: 'draft' | 'submitted' | 'reviewed' | 'published' | 'archived' | 'trash'
  preview: SopImportPreview; createdBy: string; editedBy: string; reviewedBy: string | null
  publishedBy: string | null; note: string | null; updatedAt: string
  permissions: { edit: boolean; review: boolean; publish: boolean; reject: boolean; archive: boolean }
}
export type SopAction = 'submit' | 'review' | 'reject' | 'publish' | 'archive' | 'trash' | 'restore'
export const sopManagementApi = {
  list: (q: string, state: string, page: number, signal?: AbortSignal) => apiRequest<{ data: ManagedSop[]; pagination: { total: number; pageSize: number } }>(`/sop-workspace?${new URLSearchParams({ q, state, page: String(page), pageSize: '12' })}`, { signal }),
  get: (id: string, signal?: AbortSignal) => apiRequest<{ data: ManagedSop }>(`/sop-workspace/${encodeURIComponent(id)}`, { signal }),
  create: (body: { documentId: string } | { preview: SopImportPreview }) => apiRequest<{ data: ManagedSop }>('/sop-workspace', { method: 'POST', body: JSON.stringify(body) }),
  save: (item: ManagedSop, preview: SopImportPreview) => apiRequest<{ data: ManagedSop }>(`/sop-workspace/${encodeURIComponent(item.id)}`, { method: 'PUT', body: JSON.stringify({ revision: item.revision, preview }) }),
  action: (item: ManagedSop, action: SopAction, note?: string) => apiRequest<{ data: ManagedSop }>(`/sop-workspace/${encodeURIComponent(item.id)}/actions`, { method: 'POST', body: JSON.stringify({ revision: item.revision, action, note }) })
}
export const stateLabels: Record<ManagedSop['state'], string> = {
  draft: 'Bản nháp', submitted: 'Chờ rà soát', reviewed: 'Chờ công bố', published: 'Đã công bố', archived: 'Đã thu hồi', trash: 'Thùng rác'
}
export function emptySop(moduleId: string): SopImportPreview {
  return { code: '', title: '', definition: '', purpose: '', scope: '', changeLog: '', moduleIds: [moduleId], primaryModuleId: moduleId,
    steps: [{ id: 'step-1', stableKey: 'step-1', code: 'STEP-01', title: 'Bước đầu tiên', nodeKind: 'task', sortOrder: 1, actor: '', description: '' }], transitions: [] }
}
