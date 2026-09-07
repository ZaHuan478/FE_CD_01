/* oxlint-disable react/only-export-components -- provider and consumer share one feature boundary */
import { createContext, useContext, type PropsWithChildren } from 'react'
import { useAdminAccess } from '../hooks/useAdminAccess'

type AdminAccessState = ReturnType<typeof useAdminAccess>
const AdminAccessContext = createContext<AdminAccessState | null>(null)

export function AdminAccessProvider({ children }: PropsWithChildren) {
  const value = useAdminAccess()
  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>
}

export function useAdminAccessContext() {
  const value = useContext(AdminAccessContext)
  if (!value) throw new Error('useAdminAccessContext must be used inside AdminAccessProvider')
  return value
}
