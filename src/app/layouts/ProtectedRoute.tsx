import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/authentication/model/session'
import { FullPageLoading } from '../../shared/ui/molecules/FullPageLoading'

export const ProtectedRoute: React.FC = () => {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <FullPageLoading message="Đang xác thực quyền truy cập..." />
  }

  if (status === 'unauthenticated') {
    const currentPath = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />
  }

  return <Outlet />
}
