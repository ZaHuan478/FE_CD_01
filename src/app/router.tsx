import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DevelopmentLoginPage } from '../pages/login/DevelopmentLoginPage'
import { ProtectedRoute } from './layouts/ProtectedRoute'
import { PublicOnlyRoute } from './layouts/PublicOnlyRoute'
import { NotFoundPage } from '../pages/not-found/NotFoundPage'
import { useAuth } from '../features/authentication/model/session'
import { FullPageLoading } from '../shared/ui/molecules/FullPageLoading'
import { KnowledgeBoundary } from './layouts/KnowledgeBoundary'

const EmployeeLifecycleContent = React.lazy(() =>
  import('../pages/employee-lifecycle/EmployeeLifecyclePage').then((m) => ({ default: m.EmployeeLifecyclePage })
))
const PublishedKnowledgeDocumentContent = React.lazy(() =>
  import('../features/sop-viewer/ui/PublishedKnowledgeDocumentPage').then((m) => ({ default: m.PublishedKnowledgeDocumentPage }))
)

const EmployeeLifecyclePage = () => <KnowledgeBoundary><EmployeeLifecycleContent /></KnowledgeBoundary>
const EmployeeLifecycleAdminPage = () => (
  <Suspense fallback={<FullPageLoading message="Đang mở khu vực quản trị..." />}>
    <EmployeeLifecyclePage />
  </Suspense>
)
const PublishedKnowledgeDocumentPage = () => (
  <KnowledgeBoundary>
    <Suspense fallback={<FullPageLoading message="Đang mở SOP đã công bố..." />}>
      <PublishedKnowledgeDocumentContent />
    </Suspense>
  </KnowledgeBoundary>
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
        <Route path="/employee-lifecycle/knowledge-documents/:documentId" element={<PublishedKnowledgeDocumentPage />} />
        <Route
          path="/employee-lifecycle/sop-imports"
          element={
            <Suspense fallback={<FullPageLoading message="Đang mở không gian số hóa..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route
          path="/employee-lifecycle/document-conversions"
          element={
            <Suspense fallback={<FullPageLoading message="Đang mở không gian chuyển hóa tài liệu..." />}>
              <EmployeeLifecyclePage />
            </Suspense>
          }
        />
        <Route path="/employee-lifecycle/sop-management" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/operation-guide" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/system-guide" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/system-guide/:guideSlug" element={<EmployeeLifecycleAdminPage />} />
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
        <Route path="/employee-lifecycle/admin" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/users" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/access" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/catalog" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/sop-management" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/imports" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/sop-approvals" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/master-data" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/indexing" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/audit" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/settings" element={<EmployeeLifecycleAdminPage />} />
        <Route path="/employee-lifecycle/admin/system-guides" element={<EmployeeLifecycleAdminPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
