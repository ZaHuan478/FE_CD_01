import React, { Suspense, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  Database,
  FileUp,
  LayoutDashboard,
  LockKeyhole,
  Settings,
  ShieldCheck,
  Users
} from 'lucide-react'

import { AdminAccessProvider } from '../../../features/user-module-access/model/AdminAccessContext'
import { useSession } from '../../../features/authentication/model/session'
import { PageIntro, Panel, TableSkeleton } from '../../../shared/ui/molecules/AdminSurface'

const AdminOverview = React.lazy(() => import('../../admin-overview/ui/AdminOverview').then((module) => ({ default: module.AdminOverview })))
const UserManagement = React.lazy(() => import('../../../features/admin-user-management/ui/UserManagement').then((module) => ({ default: module.UserManagement })))
const AccessManagement = React.lazy(() => import('../../../features/admin-user-management/ui/AccessManagement').then((module) => ({ default: module.AccessManagement })))
const CatalogManagement = React.lazy(() => import('../../../features/admin-catalog/ui/CatalogManagement').then((module) => ({ default: module.CatalogManagement })))
const SopImportWorkspace = React.lazy(() => import('../../../features/sop-import/ui/SopImportWorkspace').then((module) => ({ default: module.SopImportWorkspace })))
const MasterDataStudio = React.lazy(() => import('../../master-data-studio/ui/MasterDataStudio').then((module) => ({ default: module.MasterDataStudio })))

export type AdminWorkspaceSection = 'overview' | 'users' | 'access' | 'catalog' | 'imports' | 'master-data' | 'settings'

const navigation: Array<{ id: AdminWorkspaceSection; label: string; icon: typeof LayoutDashboard; to: string }> = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard, to: '/employee-lifecycle?tab=admin&adminSection=overview' },
  { id: 'users', label: 'Người dùng', icon: Users, to: '/employee-lifecycle?tab=admin&adminSection=users' },
  { id: 'access', label: 'Phân quyền', icon: ShieldCheck, to: '/employee-lifecycle?tab=admin&adminSection=access' },
  { id: 'catalog', label: 'Danh mục', icon: BookOpen, to: '/employee-lifecycle?tab=admin&adminSection=catalog' },
  { id: 'imports', label: 'Số hóa tài liệu', icon: FileUp, to: '/employee-lifecycle?tab=admin&adminSection=imports' },
  { id: 'master-data', label: 'Master Data', icon: Database, to: '/employee-lifecycle?tab=admin&adminSection=master-data' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, to: '/employee-lifecycle?tab=admin&adminSection=settings' }
]

interface AdminWorkspaceProps {
  activeSection: AdminWorkspaceSection
  isDarkMode: boolean
}

export function AdminWorkspace({ activeSection, isDarkMode }: AdminWorkspaceProps) {
  const session = useSession()

  if (session.systemRole !== 'ADMIN') {
    return <Panel><div className="grid min-h-56 place-items-center p-6 text-center"><div><ShieldCheck className="mx-auto size-8 text-slate-400" /><h2 className="mt-3 text-base font-black">Khu vực dành cho quản trị viên</h2><p className="mt-1 text-sm text-slate-500">Tài khoản hiện tại không có quyền mở chức năng quản trị hệ thống.</p></div></div></Panel>
  }

  return <section id="ADMIN" className="animate-fadeIn scroll-mt-28">
    <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <nav aria-label="Chức năng quản trị" className="flex min-w-max items-center gap-1">
        {navigation.map(({ id, label, icon: Icon, to }) => {
          const active = activeSection === id
          return <Link
            key={id}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors sm:text-sm ${active ? 'bg-[#1f5f86] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        })}
      </nav>
    </div>

    <AdminAccessProvider>
      <Suspense fallback={<TableSkeleton rows={8} />}>
        <AdminSectionContent activeSection={activeSection} isDarkMode={isDarkMode} />
      </Suspense>
    </AdminAccessProvider>
  </section>
}

function AdminSectionContent({ activeSection, isDarkMode }: AdminWorkspaceProps) {
  if (activeSection === 'users') return <><PageIntro title="Người dùng" description="Quản lý vòng đời tài khoản và vai trò hệ thống. Tài khoản đang đăng nhập không thể tự khóa hoặc tự hạ quyền." /><UserManagement /></>
  if (activeSection === 'access') return <><PageIntro title="Phân quyền" description="Cấp các phân hệ mà từng người dùng được phép xem. Backend luôn là nguồn quyết định quyền cuối cùng." /><AccessManagement /></>
  if (activeSection === 'catalog') return <><PageIntro title="Danh mục hệ thống" description="Quản lý danh mục phân hệ và tài liệu nghiệp vụ bằng các endpoint riêng, không phụ thuộc vào bootstrap." /><CatalogManagement /></>
  if (activeSection === 'imports') return <><PageIntro title="Upload và số hóa tài liệu" description="Chuyển DOCX hoặc PDF thành SOP có cấu trúc, rà soát kết quả và phê duyệt tài liệu ngay trong khu vực quản trị." /><SopImportWorkspace adminMode /></>
  if (activeSection === 'master-data') return <><PageIntro title="Master Data" description="Tra cứu catalog, quan hệ dữ liệu và hướng dẫn quy trình trong cùng không gian làm việc." /><Panel><MasterDataStudio isDarkMode={isDarkMode} /></Panel></>
  if (activeSection === 'settings') return <AdminSettings />

  return <><PageIntro title="Tổng quan quản trị" description="Theo dõi tài khoản, phân quyền, phân hệ và tài liệu từ các API nghiệp vụ hiện có." /><AdminOverview /></>
}

function AdminSettings() {
  const [params] = useSearchParams()
  if (params.get('section') === 'audit') {
    return <>
      <PageIntro title="Cài đặt" description="Điểm truy cập tập trung cho cấu hình quản trị. Các thay đổi chỉ được bật khi backend có API lưu tương ứng." />
      <Panel title="Nhật ký hệ thống" description="Trạng thái tích hợp AuditLog">
        <div className="flex min-h-52 items-start gap-3 p-5">
          <ShieldCheck className="mt-0.5 size-5 text-slate-400" />
          <div><p className="text-sm font-black">Backend đang ghi, giao diện chưa thể đọc</p><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Cơ sở dữ liệu có bảng AuditLog phục vụ truy vết, nhưng chưa có API danh sách, tìm kiếm và phân trang. Giao diện không hiển thị sự kiện giả.</p></div>
        </div>
      </Panel>
    </>
  }

  return <>
    <PageIntro title="Cài đặt" description="Điểm truy cập tập trung cho cấu hình quản trị. Các thay đổi chỉ được bật khi backend có API lưu tương ứng." />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <SettingCard icon={<Settings className="size-5" />} title="Thiết lập chung" detail="Chưa có API lưu cấu hình. Các tùy chọn đang ở trạng thái chỉ đọc." disabled />
      <SettingLink to="/employee-lifecycle?tab=admin&adminSection=access" icon={<LockKeyhole className="size-5" />} title="Quyền truy cập" detail="Cấu hình quyền phân hệ theo từng tài khoản." />
      <SettingLink to="/employee-lifecycle?tab=admin&adminSection=catalog" icon={<BookOpen className="size-5" />} title="Danh mục nghiệp vụ" detail="Quản lý phân hệ và tài liệu đã công bố." />
      <SettingLink to="/employee-lifecycle?tab=admin&adminSection=master-data" icon={<Database className="size-5" />} title="Master Data" detail="Tra cứu catalog và quan hệ dữ liệu dùng chung." />
      <SettingLink to="/employee-lifecycle?tab=admin&adminSection=settings&section=audit" icon={<ShieldCheck className="size-5" />} title="Nhật ký hệ thống" detail="Kiểm tra trạng thái tích hợp AuditLog." />
    </div>
  </>
}

function SettingCard({ icon, title, detail, disabled }: { icon: ReactNode; title: string; detail: string; disabled?: boolean }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><span className="grid size-9 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950/40 dark:text-cyan-300">{icon}</span><h3 className="mt-4 text-sm font-black">{title}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{detail}</p>{disabled && <span className="mt-4 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800">Chỉ đọc</span>}</article>
}

function SettingLink({ to, ...props }: { to: string; icon: ReactNode; title: string; detail: string }) {
  return <Link to={to} className="rounded-xl outline-none ring-[#155e75] focus-visible:ring-2"><SettingCard {...props} /></Link>
}
