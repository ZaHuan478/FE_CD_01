const employeeWorkspaceRoot = '/employee-lifecycle'

export const getCurrentWorkspacePath = (location: { pathname: string; search: string }) =>
  `${location.pathname}${location.search}`

export const withWorkspaceReturn = (target: string, returnTo: string) => {
  const separator = target.includes('?') ? '&' : '?'
  return `${target}${separator}returnTo=${encodeURIComponent(returnTo)}`
}

export const resolveWorkspaceReturn = (searchParams: URLSearchParams, fallback = employeeWorkspaceRoot) => {
  const returnTo = searchParams.get('returnTo')
  if (!returnTo) return fallback

  const isWorkspacePath = returnTo === employeeWorkspaceRoot
    || returnTo.startsWith(`${employeeWorkspaceRoot}?`)
    || returnTo.startsWith(`${employeeWorkspaceRoot}/`)

  return isWorkspacePath ? returnTo : fallback
}
