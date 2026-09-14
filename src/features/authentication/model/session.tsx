/* oxlint-disable react/only-export-components -- session bootstrap and context share one lifecycle */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { authApi } from '../../../shared/api/auth.api'
import { clearAuthentication, isAuthenticated, selectDevelopmentAccount } from '../../../shared/lib/auth/authCredentials'
import { beginKnowledgeSession, warmKnowledgeNavigation } from './knowledgeSession'
import { resetRuntimeDatasets } from '../../../shared/lib/runtime-datasets/runtimeData'

import type { UserSession } from '../../../entities/user/model/types'
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

import { resolveUserRoleTitle } from '../../../entities/user/model/roles'
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
  const requestVersion = useRef(0)
  const [session, setSession] = useState<UserSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => {
    return isAuthenticated() ? 'loading' : 'unauthenticated'
  })

  const logout = useCallback(() => {
    requestVersion.current++
    clearAuthentication()
    resetRuntimeDatasets()
    setSession(null)
    setStatus('unauthenticated')
  }, [])

  const refreshSession = useCallback(async (): Promise<UserSession | null> => {
    const version = ++requestVersion.current
    setStatus('loading')
    if (!isAuthenticated()) {
      setSession(null)
      setStatus('unauthenticated')
      return null
    }

    try {
      const user = await authApi.getSession()
      if (version !== requestVersion.current) return null
      beginKnowledgeSession()
      warmKnowledgeNavigation()
      setSession(user)
      setStatus('authenticated')
      return user
    } catch {
      // Session is invalid, expired, or backend returned 401
      if (version === requestVersion.current) logout()
      return null
    }
  }, [logout])

  const login = useCallback(async (accountId: string): Promise<UserSession> => {
    const version = ++requestVersion.current
    resetRuntimeDatasets()
    setSession(null)
    selectDevelopmentAccount(accountId)
    setStatus('loading')
    try {
      const user = await authApi.getSession()
      if (version !== requestVersion.current) throw new Error('Phiên đăng nhập đã thay đổi')
      beginKnowledgeSession()
      warmKnowledgeNavigation()
      setSession(user)
      setStatus('authenticated')
      return user
    } catch (error) {
      if (version === requestVersion.current) logout()
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

  useEffect(() => {
    const refreshCatalog = () => { if (isAuthenticated()) void refreshSession() }
    window.addEventListener('sop-catalog-changed', refreshCatalog)
    return () => window.removeEventListener('sop-catalog-changed', refreshCatalog)
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
  resetRuntimeDatasets()
  window.location.assign('/login')
}
