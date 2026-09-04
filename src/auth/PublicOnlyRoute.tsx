import React from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { useAuth } from './session'
import { FullPageLoading } from '../components/common/FullPageLoading'

export const PublicOnlyRoute: React.FC = () => {
  const { status } = useAuth()
  const [searchParams] = useSearchParams()

  if (status === 'loading') {
    return <FullPageLoading message="Đang kiểm tra phiên làm việc..." />
  }

  if (status === 'authenticated') {
    const rawRedirect = searchParams.get('redirect')
    let target = '/employee-lifecycle'
    if (rawRedirect) {
      try {
        const decoded = decodeURIComponent(rawRedirect)
        if (decoded.startsWith('/') && !decoded.startsWith('//')) {
          target = decoded
        }
      } catch {
        target = '/employee-lifecycle'
      }
    }
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
