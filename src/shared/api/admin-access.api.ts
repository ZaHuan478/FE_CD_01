import { apiRequest } from './httpClient'

export type SystemRole = 'USER' | 'CONTENT_EDITOR' | 'ADMIN' | 'SUPER_ADMIN'
export type SopRoleCode = 'VIEWER' | 'OWNER' | 'EDITOR' | 'REVIEWER' | 'APPROVER'

export interface AdminUser {
  id: string
  employeeCode: string | null
  username: string
  fullName: string
  email: string | null
  systemRole: SystemRole
  active: boolean
  organization: { company: string | null; division: string | null; department: string | null; team: string | null; jobTitle: string | null; managerAccountId: string | null }
  assignedModuleCount: number
}
export type BusinessCluster = 'core' | 'people' | 'organization' | 'platform'
export type ModuleIcon = 'layers' | 'users' | 'briefcase' | 'clipboard' | 'clock' | 'calendar' | 'wallet' | 'shield' | 'book'
export interface AdminModule { id: string; code: string; title: string; description: string | null; moduleType: string; status: 'draft' | 'published' | 'archived'; common: boolean; sortOrder: number; businessCluster?: BusinessCluster; iconKey?: ModuleIcon }
export type ModuleInput = Pick<AdminModule, 'code' | 'title' | 'moduleType'> & Partial<Pick<AdminModule, 'description' | 'status' | 'sortOrder' | 'businessCluster' | 'iconKey'>>
export interface UserModuleAccess { user: { id: string; fullName: string }; assignedModuleIds: string[]; effectiveModuleIds: string[]; modules: Array<{ id: string; code: string; title: string; common: boolean; sources: string[] }> }
export interface PermissionProfile { id: string; code: string; name: string; description: string | null; system: boolean; active: boolean; capabilities: string[]; memberCount: number }
export interface SystemSettings { portalName: string; defaultPageSize: number; reviewDueDays: number; requireReviewBeforePublish: boolean; allowOwnerSelfApproval: boolean }
export interface AuditEvent { id: string; entityType: string; entityId: string; action: string; actor: { id: string; name: string } | null; before: unknown; after: unknown; correlationId: string | null; createdAt: string }
export interface AuditResult { items: AuditEvent[]; pagination: { page: number; pageSize: number; total: number; totalPages: number }; filters: { entityTypes: string[]; actions: string[] } }
export interface SopResource { id: string; code: string; title: string }
export interface SopRoleAssignment { accountId: string; fullName?: string; roleCode: SopRoleCode }

export const adminAccessApi = {
  users: (signal?: AbortSignal) => apiRequest<{ data: AdminUser[] }>('/admin/users', { signal }),
  userModules: (id: string, signal?: AbortSignal) => apiRequest<{ data: UserModuleAccess }>(`/admin/users/${encodeURIComponent(id)}/module-access`, { signal }),
  replaceUserModules: (id: string, moduleIds: string[]) => apiRequest<{ data: UserModuleAccess }>(`/admin/users/${encodeURIComponent(id)}/module-access`, { method: 'PUT', body: JSON.stringify({ moduleIds }) }),
  updateUser: (id: string, body: { active?: boolean; systemRole?: SystemRole; department?: string | null; jobTitle?: string | null }) => apiRequest<{ data: AdminUser }>(`/admin/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createUser: (body: { username: string; fullName: string; email?: string | null }) => apiRequest<AdminUser>('/accounts', { method: 'POST', body: JSON.stringify(body) }),
  bootstrapSuperAdmin: (accountId: string) => apiRequest<{ data: { accountId: string; systemRole: 'SUPER_ADMIN' } }>('/admin/bootstrap-super-admin', { method: 'POST', body: JSON.stringify({ accountId }) }),
  modules: (signal?: AbortSignal) => apiRequest<{ items: AdminModule[] }>('/modules', { signal }),
  createModule: (body: ModuleInput) => apiRequest<AdminModule>('/modules', { method: 'POST', body: JSON.stringify(body) }),
  updateModule: (id: string, body: Partial<ModuleInput>) => apiRequest<AdminModule>(`/modules/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  audit: (query: { page: number; pageSize: number; search?: string; entityType?: string; action?: string }, signal?: AbortSignal) => {
    const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => [key, String(value)]))
    return apiRequest<AuditResult>(`/admin/audit-logs?${params}`, { signal })
  },
  settings: (signal?: AbortSignal) => apiRequest<{ data: SystemSettings }>('/admin/settings', { signal }),
  updateSettings: (body: SystemSettings) => apiRequest<{ data: SystemSettings }>('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),
  profiles: (signal?: AbortSignal) => apiRequest<{ data: PermissionProfile[] }>('/admin/permission-profiles', { signal }),
  createProfile: (body: { code: string; name: string; description?: string | null; capabilities: string[] }) => apiRequest<{ data: PermissionProfile }>('/admin/permission-profiles', { method: 'POST', body: JSON.stringify(body) }),
  updateProfile: (id: string, body: { name: string; description?: string | null; active: boolean; capabilities: string[] }) => apiRequest<{ data: PermissionProfile }>(`/admin/permission-profiles/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) }),
  userProfiles: (id: string, signal?: AbortSignal) => apiRequest<{ data: { accountId: string; profileIds: string[] } }>(`/admin/users/${encodeURIComponent(id)}/permission-profiles`, { signal }),
  replaceUserProfiles: (id: string, profileIds: string[]) => apiRequest<{ data: { accountId: string; profileIds: string[] } }>(`/admin/users/${encodeURIComponent(id)}/permission-profiles`, { method: 'PUT', body: JSON.stringify({ profileIds }) }),
  sopResources: (signal?: AbortSignal) => apiRequest<{ data: SopResource[] }>('/admin/sop-resources', { signal }),
  sopRoles: (id: string, signal?: AbortSignal) => apiRequest<{ data: { sopId: string; assignments: SopRoleAssignment[] } }>(`/admin/sop-resources/${encodeURIComponent(id)}/roles`, { signal }),
  replaceSopRoles: (id: string, assignments: SopRoleAssignment[]) => apiRequest<{ data: { sopId: string; assignments: SopRoleAssignment[] } }>(`/admin/sop-resources/${encodeURIComponent(id)}/roles`, { method: 'PUT', body: JSON.stringify({ assignments: assignments.map(({ accountId, roleCode }) => ({ accountId, roleCode })) }) })
}
