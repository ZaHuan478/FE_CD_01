const selectedAccountKey = 'hrm_demo_account_id'
const accessTokenKey = 'hrm_access_token'

export const frontendAuthMode = import.meta.env.VITE_AUTH_MODE === 'jwt' ? 'jwt' : 'development'

export function getSelectedDevelopmentAccountId(): string | null {
  return localStorage.getItem(selectedAccountKey)
}

export function selectDevelopmentAccount(accountId: string): void {
  localStorage.setItem(selectedAccountKey, accountId)
}

export function isAuthenticated(): boolean {
  if (frontendAuthMode === 'development') {
    return Boolean(getSelectedDevelopmentAccountId())
  }
  return Boolean(sessionStorage.getItem(accessTokenKey))
}

export function clearAuthentication(): void {
  localStorage.removeItem(selectedAccountKey)
  sessionStorage.removeItem(accessTokenKey)
}

export function getAuthenticationHeaders(): Record<string, string> {
  if (frontendAuthMode === 'development') {
    const accountId = getSelectedDevelopmentAccountId()
    return accountId ? { 'x-user-id': accountId } : {}
  }
  const token = sessionStorage.getItem(accessTokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}
