import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookOpenCheck, Database, FilePenLine, Files, GitBranch, LayoutDashboard, ScrollText, Settings, ShieldCheck, Users, Sparkles } from 'lucide-react'
import { AdminAccessProvider } from '../../../features/user-module-access/model/AdminAccessContext'
import { useSession, canApproveSop } from '../../../features/authentication/model/session'
import { PageIntro, Panel, TableSkeleton } from '../../../shared/ui/molecules/AdminSurface'
import { PermissionManagementWorkspace } from '../../../features/admin-user-management/ui/PermissionManagementWorkspace'
import { AuditLogPanel } from '../../../features/admin-user-management/ui/AuditLogPanel'
import { SystemSettingsForm } from '../../../features/admin-user-management/ui/SystemSettingsForm'
import { IndexingDashboard } from '../../../features/admin-indexing/ui/IndexingDashboard'

const AdminOverview = React.lazy(() => import('../../admin-overview/ui/AdminOverview').then(module => ({ default: module.AdminOverview })))
const UserManagement = React.lazy(() => import('../../../features/admin-user-management/ui/UserManagement').then(module => ({ default: module.UserManagement })))
const CatalogManagement = React.lazy(() => import('../../../features/admin-catalog/ui/CatalogManagement').then(module => ({ default: module.CatalogManagement })))
const AdminDocumentsWorkspace = React.lazy(() => import('../../../features/admin-documents/ui/AdminDocumentsWorkspace').then(module => ({ default: module.AdminDocumentsWorkspace })))
const GlobalSopManagementWorkspace = React.lazy(() => import('../../../features/admin-sop-management/ui/GlobalSopManagementWorkspace').then(module => ({ default: module.GlobalSopManagementWorkspace })))
const AdminMasterDataWorkspace = React.lazy(() => import('../../../features/admin-master-data/ui/AdminMasterDataWorkspace').then(module => ({ default: module.AdminMasterDataWorkspace })))
const SopApprovalWorkspace = React.lazy(() => import('../../../features/sop-import/ui/SopApprovalWorkspace').then(module => ({ default: module.SopApprovalWorkspace })))
const AdminSystemGuides = React.lazy(() => import('../../../features/admin-system-guides/ui/AdminSystemGuides').then(module => ({ default: module.AdminSystemGuides })))

export type AdminWorkspaceSection = 'overview' | 'users' | 'access' | 'catalog' | 'sop-management' | 'imports' | 'sop-approvals' | 'master-data' | 'audit' | 'indexing' | 'system-guides' | 'settings'
const navigation: Array<{ id: AdminWorkspaceSection; label: string; icon: typeof LayoutDashboard; superOnly?: boolean }> = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'users', label: 'Người dùng', icon: Users },
  { id: 'access', label: 'Phân quyền', icon: ShieldCheck },
  { id: 'catalog', label: 'Danh mục', icon: BookOpen },
  { id: 'sop-management', label: 'Toàn bộ SOP', icon: FilePenLine },
  { id: 'imports', label: 'Quản lý tài liệu', icon: Files },
  { id: 'sop-approvals', label: 'Duyệt SOP', icon: GitBranch },
  { id: 'master-data', label: 'Master Data', icon: Database },
  { id: 'indexing', label: 'Chỉ mục AI', icon: Sparkles },
  { id: 'audit', label: 'Audit Log', icon: ScrollText },
  { id: 'system-guides', label: 'Hướng dẫn', icon: BookOpenCheck },
  { id: 'settings', label: 'Cài đặt', icon: Settings, superOnly: true }
]

interface AdminWorkspaceProps {
  activeSection: AdminWorkspaceSection
  isDarkMode?: boolean
}

export function AdminWorkspace({ activeSection }: AdminWorkspaceProps) {
  const session = useSession()
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)
  const isSuper = session.systemRole === 'SUPER_ADMIN'
  const isRagManager = session.capabilities.includes('rag.manage')
  const isApprover = canApproveSop(session)

  if (!isAdmin && !(isRagManager && activeSection === 'indexing')) {
    return (
      <Panel>
        <div className="grid min-h-56 place-items-center p-6 text-center">
          <div>
            <ShieldCheck className="mx-auto size-8 text-slate-400" />
            <h2 className="mt-3 text-base font-black">Khu vực dành cho quản trị viên</h2>
            <p className="mt-1 text-sm text-slate-500">Tài khoản hiện tại không có quyền mở chức năng quản trị này.</p>
          </div>
        </div>
      </Panel>
    )
  }

  const safeSection = !isAdmin
    ? 'indexing'
    : activeSection === 'settings' && !isSuper
    ? 'overview'
    : activeSection === 'sop-approvals' && !isApprover
    ? 'overview'
    : activeSection

  return (
    <section id="ADMIN" className="animate-fadeIn scroll-mt-28">
      <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <nav aria-label="Chức năng quản trị" className="flex min-w-max items-center gap-1">
          {navigation
            .filter((item) => {
              if (item.superOnly && !isSuper) return false
              if (item.id === 'sop-approvals' && !isApprover) return false
              return isAdmin || item.id === 'indexing'
            })
            .map(({ id, label, icon: Icon }) => {
              const active = safeSection === id
              return (
                <Link
                  key={id}
                  to={`/employee-lifecycle/admin/${id === 'overview' ? '' : id}`} /* legacy route alias: adminSection=${id} */
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-[#155e75] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
        </nav>
      </div>

      <AdminAccessProvider>
        <Suspense fallback={<TableSkeleton rows={8} />}>
          <AdminSectionContent activeSection={safeSection} />
        </Suspense>
      </AdminAccessProvider>
    </section>
  )
}

function AdminSectionContent({ activeSection }: AdminWorkspaceProps) {
  const session = useSession()
  const isSuper = session.systemRole === 'SUPER_ADMIN'

  if (activeSection === 'users') {
    return (
      <>
        <PageIntro
          title="Người dùng"
          description={isSuper ? 'Quản lý vòng đời tài khoản và vai trò hệ thống.' : 'Theo dõi tài khoản; thay đổi chỉ dành cho Super Admin.'}
        />
        <UserManagement />
      </>
    )
  }

  if (activeSection === 'access') {
    return (
      <>
        <PageIntro
          title="Phân quyền"
          description="Quản lý quyền phân hệ, nhóm quyền và trách nhiệm Owner, Editor, Reviewer, Approver của SOP."
        />
        <PermissionManagementWorkspace />
      </>
    )
  }

  if (activeSection === 'catalog') {
    return (
      <>
        <PageIntro title="Danh mục hệ thống" description="Quản lý phân hệ và tài liệu nghiệp vụ." />
        <CatalogManagement />
      </>
    )
  }

  if (activeSection === 'sop-management') {
    return (
      <>
        <PageIntro title="Quản lý toàn bộ SOP" description="Admin xem và xử lý toàn bộ SOP đã công bố cùng các hồ sơ SOP của mọi người." />
        <GlobalSopManagementWorkspace />
      </>
    )
  }

  if (activeSection === 'imports') {
    return <AdminDocumentsWorkspace />
  }

  if (activeSection === 'sop-approvals') {
    return (
      <>
        <PageIntro
          title="Duyệt SOP"
          description="Mở các hồ sơ SOP Draft do người dùng gửi, xác nhận rà soát và phê duyệt công bố theo đúng phạm vi phân quyền."
        />
        <SopApprovalWorkspace />
      </>
    )
  }

  if (activeSection === 'master-data') {
    return <AdminMasterDataWorkspace />
  }

  if (activeSection === 'indexing') {
    return <IndexingDashboard />
  }

  if (activeSection === 'audit') {
    return (
      <>
        <PageIntro title="Audit Log" description="Tra cứu người thao tác, hành động và dữ liệu thay đổi." />
        <AuditLogPanel />
      </>
    )
  }

  if (activeSection === 'system-guides') {
    return (
      <>
        <PageIntro title="Hướng dẫn hệ thống" description="Soạn, phiên bản hóa và công bố hướng dẫn sử dụng cho người dùng." />
        <AdminSystemGuides />
      </>
    )
  }

  if (activeSection === 'settings' && isSuper) {
    return (
      <>
        <PageIntro title="Cài đặt" description="Cấu hình quản trị được lưu tại backend và ghi lịch sử thay đổi." />
        <SystemSettingsForm />
      </>
    )
  }

  return (
    <>
      <PageIntro
        title="Tổng quan quản trị"
        description={isSuper ? 'Quản trị toàn hệ thống SOP.' : 'Vận hành nội dung, phê duyệt và theo dõi SOP.'}
      />
      <AdminOverview />
    </>
  )
}
