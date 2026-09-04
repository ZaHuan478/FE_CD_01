import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DevelopmentLoginPage } from '../auth/DevelopmentLoginPage'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { PublicOnlyRoute } from '../auth/PublicOnlyRoute'
import { NotFoundPage } from '../pages/NotFoundPage'
import { useAuth } from '../auth/session'
import { FullPageLoading } from '../components/common/FullPageLoading'

const EmployeeLifecyclePage = React.lazy(() =>
  import('../pages/employee-lifecycle/EmployeeLifecyclePage').then((m) => ({ default: m.EmployeeLifecyclePage }))
)

const RootRedirect: React.FC = () => {
  const { status } = useAuth()

  if (status === 'loading') {
    return <FullPageLoading message="Đang khởi tạo hệ thống..." />
  }

  if (status === 'authenticated') {
    return <Navigate to="/employee-lifecycle" replace />
  }

  return <Navigate to="/login" replace />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect: if authenticated -> /employee-lifecycle, else -> /login */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public only: login page */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<DevelopmentLoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/employee-lifecycle"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/journey"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/lifecycle"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/operations"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/masterdata"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/reports"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/workbench"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/infographic/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/flowchart/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/raci/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/workflow/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/wireframe/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/erd"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/policies"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/policies/:id"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/admin"
          element={
            <Suspense fallback={<FullPageLoading message="Đang tải dữ liệu phân hệ..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
