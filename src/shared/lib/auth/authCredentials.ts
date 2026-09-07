const selectedAccountKey = 'hrm_demo_account_id'
const accessTokenKey = 'hrm_access_token'
const developmentAccountCookie = 'hrm_demo_account_id'

function writeDevelopmentAccountCookie(accountId: string | null): void {
  if (typeof document === 'undefined') return
  if (accountId) {
    document.cookie = `${developmentAccountCookie}=${encodeURIComponent(accountId)}; Path=/; SameSite=Lax`
  } else {
    document.cookie = `${developmentAccountCookie}=; Path=/; Max-Age=0; SameSite=Lax`
  }
}

export const frontendAuthMode = import.meta.env.VITE_AUTH_MODE === 'jwt' ? 'jwt' : 'development'

export function getSelectedDevelopmentAccountId(): string | null {
  return localStorage.getItem(selectedAccountKey)
}

export function selectDevelopmentAccount(accountId: string): void {
  localStorage.setItem(selectedAccountKey, accountId)
  writeDevelopmentAccountCookie(accountId)
}

export function isAuthenticated(): boolean {
  if (frontendAuthMode === 'development') {
    const accountId = getSelectedDevelopmentAccountId()
    if (accountId) writeDevelopmentAccountCookie(accountId)
    return Boolean(accountId)
  }
  return Boolean(sessionStorage.getItem(accessTokenKey))
}

export function clearAuthentication(): void {
  localStorage.removeItem(selectedAccountKey)
  sessionStorage.removeItem(accessTokenKey)
  writeDevelopmentAccountCookie(null)
}

export function getAuthenticationHeaders(): Record<string, string> {
  if (frontendAuthMode === 'development') {
    const accountId = getSelectedDevelopmentAccountId()
    return accountId ? { 'x-user-id': accountId } : {}
  }
  const token = sessionStorage.getItem(accessTokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}
