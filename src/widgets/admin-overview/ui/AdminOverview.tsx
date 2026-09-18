import { Link } from 'react-router-dom'
import { BookOpen, Boxes, ChevronRight, FilePenLine, ShieldAlert, UserRoundCheck, Users } from 'lucide-react'
import { useAdminCatalog } from '../../../features/user-module-access/hooks/useAdminCatalog'
import { useAdminAccessContext } from '../../../features/user-module-access/model/AdminAccessContext'
import { EmptyState, Feedback, Panel, TableSkeleton } from '../../../shared/ui/molecules/AdminSurface'
import { AuditLogPanel } from '../../../features/admin-user-management/ui/AuditLogPanel'

export function AdminOverview() {
  const admin = useAdminAccessContext()
  const documents = useAdminCatalog({ page: 1, pageSize: 1 })
  const activeUsers = admin.users.filter(user => user.active).length
  const assignedUsers = admin.users.filter(user => ['ADMIN', 'SUPER_ADMIN'].includes(user.systemRole) || user.assignedModuleCount > 0).length
  const unassigned = admin.users.filter(user => user.active && !['ADMIN', 'SUPER_ADMIN'].includes(user.systemRole) && user.assignedModuleCount === 0)
  const published = admin.modules.filter(module => module.status === 'published').length
  const draft = admin.modules.filter(module => module.status === 'draft').length
  const archived = admin.modules.filter(module => module.status === 'archived').length

  if (admin.loading) return <TableSkeleton rows={8} />
  return <>
    {admin.error && <Feedback type="error" action={<button type="button" onClick={() => void admin.load()} className="font-bold underline">Thử lại</button>}>{admin.error}</Feedback>}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chỉ số quản trị">
      <Metric icon={<Users className="size-5" />} label="Tổng tài khoản" value={admin.users.length} detail={`${activeUsers} đang hoạt động`} />
      <Metric icon={<UserRoundCheck className="size-5" />} label="Đã được phân quyền" value={assignedUsers} detail={`${unassigned.length} chưa có phân hệ`} />
      <Metric icon={<Boxes className="size-5" />} label="Phân hệ" value={admin.modules.length} detail={`${published} công bố · ${draft} nháp · ${archived} lưu trữ`} />
      <Metric icon={<BookOpen className="size-5" />} label="Tài liệu đã công bố" value={documents.loading ? '…' : documents.pagination.total} detail="Đọc trực tiếp từ API tài liệu" />
    </section>

    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
      <div className="grid gap-5">
        <Panel title="Cần xử lý" description="Tài khoản đang hoạt động nhưng chưa được cấp phân hệ.">
          {!unassigned.length ? <EmptyState title="Không có tồn đọng" description="Mọi tài khoản đang hoạt động đều đã có quyền phù hợp." /> : <div className="divide-y divide-slate-100 dark:divide-slate-800">{unassigned.slice(0, 6).map(user => <div key={user.id} className="flex items-center justify-between gap-3 px-4 py-3"><div><p className="text-sm font-bold">{user.fullName}</p><p className="text-xs text-slate-500">{user.username}</p></div><Link to={`/employee-lifecycle/admin/access?user=${user.id}`} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-3 text-xs font-bold text-[#155e75] hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/30">Cấp quyền<ChevronRight className="size-3.5" /></Link></div>)}</div>}
        </Panel>
        <AuditLogPanel compact />
      </div>
      <Panel title="Thao tác nhanh" description="Đi thẳng đến công việc quản trị thường dùng.">
        <div className="grid gap-2 p-3">
          <QuickLink to="/employee-lifecycle/admin/users" icon={<Users className="size-4" />} title="Quản lý tài khoản" detail="Tạo, khóa hoặc đổi vai trò" />
          <QuickLink to="/employee-lifecycle/admin/access" icon={<ShieldAlert className="size-4" />} title="Phân quyền phân hệ" detail="Cấp quyền cho từng người dùng" />
          <QuickLink to="/employee-lifecycle/admin/catalog" icon={<BookOpen className="size-4" />} title="Quản lý danh mục" detail="Phân hệ và tài liệu nghiệp vụ" />
          <QuickLink to="/employee-lifecycle/admin/sop-management" icon={<FilePenLine className="size-4" />} title="Toàn bộ SOP" detail="Xem và xử lý SOP của toàn hệ thống" />
          <QuickLink to="/employee-lifecycle/admin/master-data" icon={<Boxes className="size-4" />} title="Quản lý Master Data" detail="Quản trị tệp dữ liệu danh mục tải lên và đồng bộ" />
        </div>
      </Panel>
    </div>
  </>
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number | string; detail: string }) { return <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950/40 dark:text-cyan-300">{icon}</span><span className="font-mono text-2xl font-black tabular-nums">{value}</span></div><p className="mt-4 text-sm font-black">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article> }
function QuickLink({ to, icon, title, detail }: { to: string; icon: React.ReactNode; title: string; detail: string }) { return <Link to={to} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-slate-800 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/20"><span className="grid size-8 place-items-center rounded-md bg-slate-100 text-[#155e75] dark:bg-slate-800 dark:text-cyan-300">{icon}</span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{title}</span><span className="block truncate text-xs text-slate-500">{detail}</span></span><ChevronRight className="size-4 text-slate-400" /></Link> }


