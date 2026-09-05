import { apiRequest } from './httpClient'
import type { UserSession, DevelopmentAccount, DevelopmentLoginResult } from './auth.types'

export const authApi = {
  getSession: () => apiRequest<UserSession>('/me'),
  listDevelopmentAccounts: () => apiRequest<{ items: DevelopmentAccount[] }>('/auth/development-accounts'),
  loginDevelopment: (identifier: string, password: string) => apiRequest<DevelopmentLoginResult>('/auth/development-login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  })
}
