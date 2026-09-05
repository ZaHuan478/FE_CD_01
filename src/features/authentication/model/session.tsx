/* oxlint-disable react/only-export-components -- session bootstrap and context share one lifecycle */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { authApi } from '../../../shared/api/auth.api'
import { clearAuthentication, isAuthenticated, selectDevelopmentAccount } from '../../../shared/lib/auth/authCredentials'
import { bootstrapKnowledge, resetKnowledgeBootstrap } from './bootstrap'

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
  const [session, setSession] = useState<UserSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => {
    return isAuthenticated() ? 'loading' : 'unauthenticated'
  })

  const logout = useCallback(() => {
    clearAuthentication()
    resetKnowledgeBootstrap()
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
      const [user] = await Promise.all([
        authApi.getSession(),
        bootstrapKnowledge()
      ])
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
    resetKnowledgeBootstrap()
    selectDevelopmentAccount(accountId)
    setStatus('loading')
    try {
      const [user] = await Promise.all([
        authApi.getSession(),
        bootstrapKnowledge()
      ])
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
  resetKnowledgeBootstrap()
  window.location.assign('/login')
}
