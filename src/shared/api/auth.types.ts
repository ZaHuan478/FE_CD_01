export interface SessionGrant {
  permissionCode: string
  scopeType: 'system' | 'module' | 'sop'
  scopeId: string
}

export interface SessionMenuItem {
  id: string
  code: string
  title: string
  routePath: string | null
  moduleIds: string[]
}

export interface SessionModule {
  id: string
  code: string
  title: string
  moduleType: string
}

export interface UserSession {
  accountId: string
  username: string
  fullName: string
  email: string | null
  groupIds: string[]
  grants: SessionGrant[]
  menuItems: SessionMenuItem[]
  modules: SessionModule[]
  capabilities: string[]
  roleTitle?: string
}

export interface DevelopmentAccount {
  id: string
  username: string
  email: string | null
  fullName: string
  roleTitle: string
  roleDescription: string
  groups: Array<{ code: string; name: string; description: string | null }>
  modules: Array<{ id: string; code: string; title: string }>
}

export interface DevelopmentLoginResult {
  accountId: string
  username: string
  fullName: string
  email: string | null
}
