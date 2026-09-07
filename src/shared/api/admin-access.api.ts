import { apiRequest } from './httpClient'

export interface AdminUser {
  id: string
  employeeCode: string | null
  username: string
  fullName: string
  email: string | null
  systemRole: 'USER' | 'CONTENT_EDITOR' | 'ADMIN'
  active: boolean
  organization: { company: string | null; division: string | null; department: string | null; team: string | null; jobTitle: string | null; managerAccountId: string | null }
  assignedModuleCount: number
}

export interface AdminModule {
  id: string
  code: string
  title: string
  description: string | null
  moduleType: string
  status: 'draft' | 'published' | 'archived'
  common: boolean
  sortOrder: number
}

export interface UserModuleAccess {
  user: { id: string; fullName: string }
  assignedModuleIds: string[]
  effectiveModuleIds: string[]
  modules: Array<{ id: string; code: string; title: string; common: boolean; sources: string[] }>
}

export const adminAccessApi = {
  users: (signal?: AbortSignal) => apiRequest<{ data: AdminUser[] }>('/admin/users', { signal }),
  userModules: (id: string, signal?: AbortSignal) => apiRequest<{ data: UserModuleAccess }>(`/admin/users/${encodeURIComponent(id)}/module-access`, { signal }),
  replaceUserModules: (id: string, moduleIds: string[]) => apiRequest<{ data: UserModuleAccess }>(`/admin/users/${encodeURIComponent(id)}/module-access`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moduleIds })
  }),
  updateUser: (id: string, body: { active?: boolean; systemRole?: 'USER' | 'CONTENT_EDITOR' | 'ADMIN' }) => apiRequest<{ data: AdminUser }>(`/admin/users/${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }),
  createUser: (body: { username: string; fullName: string; email?: string | null }) => apiRequest<AdminUser>('/accounts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }),
  modules: (signal?: AbortSignal) => apiRequest<{ items: AdminModule[] }>('/modules', { signal }),
  createModule: (body: { code: string; title: string; description?: string; moduleType: string; status: AdminModule['status']; sortOrder: number }) => apiRequest<AdminModule>('/modules', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }),
  updateModule: (id: string, body: { status: AdminModule['status'] }) => apiRequest<AdminModule>(`/modules/${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
}
