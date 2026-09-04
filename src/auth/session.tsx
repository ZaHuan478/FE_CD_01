/* oxlint-disable react/only-export-components -- session bootstrap and context share one lifecycle */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { apiRequest } from '../api/apiClient'
import { clearAuthentication, isAuthenticated, selectDevelopmentAccount } from './authCredentials'
import { bootstrapKnowledgeDatabase, resetKnowledgeDatabase } from '../database/bootstrap'

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

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export const ROLE_NAMES: Record<string, string> = {
  'ADMIN': 'Quản trị hệ thống',
  'BOM': 'Ban Giám Đốc',
  'HR_ADMIN': 'Quản trị nhân sự',
  'RECRUITER': 'Chuyên viên tuyển dụng',
  'TIMEKEEPER': 'Chuyên viên chấm công',
  'CB_SPECIALIST': 'Chuyên viên C&B / Lương',
  'INSURANCE_OFFICER': 'Chuyên viên bảo hiểm',
  'LINE_MANAGER': 'Trưởng bộ phận',
  'EMPLOYEE': 'Nhân viên',
  'group-admin': 'Quản trị hệ thống',
  'group-bom': 'Ban Giám Đốc',
  'group-hr-admin': 'Quản trị nhân sự',
  'group-recruiter': 'Chuyên viên tuyển dụng',
  'group-attendance': 'Chuyên viên chấm công',
  'group-cb': 'Chuyên viên C&B / Lương',
  'group-insurance': 'Chuyên viên bảo hiểm',
  'group-manager': 'Trưởng bộ phận',
  'group-employee': 'Nhân viên',
  'demo-admin': 'Quản trị hệ thống',
  'demo-bom': 'Ban Giám Đốc',
  'demo-hr-admin': 'Quản trị nhân sự',
  'demo-recruiter': 'Chuyên viên tuyển dụng',
  'demo-attendance': 'Chuyên viên chấm công',
  'demo-cb': 'Chuyên viên C&B / Lương',
  'demo-insurance': 'Chuyên viên bảo hiểm',
  'demo-manager': 'Trưởng bộ phận',
  'demo-employee': 'Nhân viên'
}

export function resolveUserRoleTitle(session: UserSession | null): string {
  if (!session) return ''
  if (session.roleTitle) return session.roleTitle
  for (const groupId of session.groupIds || []) {
    if (ROLE_NAMES[groupId]) return ROLE_NAMES[groupId]
  }
  if (ROLE_NAMES[session.username]) return ROLE_NAMES[session.username]
  if (ROLE_NAMES[session.accountId]) return ROLE_NAMES[session.accountId]
  return 'Thành viên hệ thống'
}

export interface AuthContextType {
  session: UserSession | null
  status: AuthStatus
  roleTitle: string
  login: (accountId: string) => Promise<UserSession>
  logout: () => void
  refreshSession: () => Promise<UserSession | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => {
    return isAuthenticated() ? 'loading' : 'unauthenticated'
  })

  const logout = useCallback(() => {
    clearAuthentication()
    resetKnowledgeDatabase()
    setSession(null)
    setStatus('unauthenticated')
  }, [])

  const refreshSession = useCallback(async (): Promise<UserSession | null> => {
    if (!isAuthenticated()) {
      setSession(null)
      setStatus('unauthenticated')
      return null
    }

    try {
      const user = await apiRequest<UserSession>('/me')
      await bootstrapKnowledgeDatabase()
      setSession(user)
      setStatus('authenticated')
      return user
    } catch {
      // Session is invalid, expired, or backend returned 401
      logout()
      return null
    }
  }, [logout])

  const login = useCallback(async (accountId: string): Promise<UserSession> => {
    selectDevelopmentAccount(accountId)
    setStatus('loading')
    try {
      const user = await apiRequest<UserSession>('/me')
      await bootstrapKnowledgeDatabase()
      setSession(user)
      setStatus('authenticated')
      return user
    } catch (error) {
      logout()
      throw error
    }
  }, [logout])

  useEffect(() => {
    if (isAuthenticated()) {
      void refreshSession()
    } else {
      setStatus('unauthenticated')
    }
  }, [refreshSession])

  const roleTitle = useMemo(() => resolveUserRoleTitle(session), [session])

  const contextValue = useMemo<AuthContextType>(() => ({
    session,
    status,
    roleTitle,
    login,
    logout,
    refreshSession
  }), [session, status, roleTitle, login, logout, refreshSession])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside SessionProvider')
  }
  return context
}

export function useSession(): UserSession {
  const { session, status } = useAuth()
  if (status === 'loading') {
    throw new Error('User session is currently loading')
  }
  if (!session) {
    throw new Error('User session has not been loaded')
  }
  return session
}

export function signOut(): void {
  clearAuthentication()
  resetKnowledgeDatabase()
  window.location.assign('/login')
}
