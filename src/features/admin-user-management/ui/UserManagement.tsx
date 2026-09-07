import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Search, UserRoundCheck, UserRoundX } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../authentication/model/session'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import { Select } from '../../../shared/ui/atoms/Select'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

export function UserManagement() {
  const admin = useAdminAccessContext()
  const { session } = useAuth()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'locked'>('all')
  const [role, setRole] = useState<'all' | 'USER' | 'CONTENT_EDITOR' | 'ADMIN'>('all')
  const [creating, setCreating] = useState(false)
  const highlighted = params.get('user')
  const users = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return admin.users.filter(user => {
      const matchesText = !term || [user.fullName, user.username, user.email ?? '', user.employeeCode ?? ''].some(value => value.toLocaleLowerCase('vi').includes(term))
      const matchesStatus = status === 'all' || (status === 'active' ? user.active : !user.active)
      return matchesText && matchesStatus && (role === 'all' || user.systemRole === role)
    })
  }, [admin.users, query, status, role])

  return <>
    {admin.error && <Feedback type="error" action={<button type="button" onClick={() => void admin.load()} className="font-bold underline">Thử lại</button>}>{admin.error}</Feedback>}
    {admin.notice && <Feedback type="success">{admin.notice}</Feedback>}
    <Panel title="Danh sách tài khoản" description="Tạo tài khoản, kiểm soát trạng thái và vai trò hệ thống." action={<button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}><Plus className="size-4" />Tạo tài khoản</button>}>
      <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(240px,1fr)_180px_160px] dark:border-slate-800">
        <label className="relative"><span className="sr-only">Tìm tài khoản</span><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên, tài khoản, email, mã nhân viên" className={`${adminInputClass} pl-9`} /></label>
        <Select aria-label="Lọc trạng thái" value={status} onChange={event => setStatus(event.target.value as typeof status)}><option value="all">Mọi trạng thái</option><option value="active">Đang hoạt động</option><option value="locked">Đã khóa</option></Select>
        <Select aria-label="Lọc vai trò" value={role} onChange={event => setRole(event.target.value as typeof role)}><option value="all">Mọi vai trò</option><option value="USER">Người dùng</option><option value="CONTENT_EDITOR">Biên tập SOP</option><option value="ADMIN">Quản trị viên</option></Select>
      </div>
      {admin.loading ? <TableSkeleton /> : !users.length ? <EmptyState title="Không có tài khoản phù hợp" description="Thử thay đổi bộ lọc hoặc tạo tài khoản mới." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50"><tr><th className="px-4 py-3">Người dùng</th><th className="px-4 py-3">Vai trò</th><th className="px-4 py-3">Phân hệ</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {users.map(user => <tr key={user.id} className={highlighted === user.id ? 'bg-cyan-50/70 dark:bg-cyan-950/20' : ''}><td className="px-4 py-3"><p className="font-bold">{user.fullName}</p><p className="text-xs text-slate-500">{user.username}{user.email ? ` · ${user.email}` : ''}</p></td><td className="w-44 px-4 py-3"><Select visualSize="compact" aria-label={`Vai trò ${user.fullName}`} value={user.systemRole} disabled={admin.saving || user.id === session?.accountId} onChange={event => void admin.updateUser(user.id, { systemRole: event.target.value as 'USER' | 'CONTENT_EDITOR' | 'ADMIN' })}><option value="USER">Người dùng</option><option value="CONTENT_EDITOR">Biên tập SOP</option><option value="ADMIN">Quản trị viên</option></Select></td><td className="px-4 py-3 font-mono text-xs tabular-nums">{user.systemRole === 'ADMIN' ? 'Tất cả' : user.assignedModuleCount}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${user.active ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>{user.active ? <UserRoundCheck className="size-3.5" /> : <UserRoundX className="size-3.5" />}{user.active ? 'Hoạt động' : 'Đã khóa'}</span></td><td className="px-4 py-3 text-right"><button type="button" disabled={admin.saving || user.id === session?.accountId} onClick={() => void admin.updateUser(user.id, { active: !user.active })} className="text-xs font-bold text-[#155e75] hover:underline disabled:cursor-not-allowed disabled:opacity-40">{user.active ? 'Khóa' : 'Kích hoạt'}</button></td></tr>)}
      </tbody></table></div>}
    </Panel>
    {creating && <CreateUserDialog saving={admin.saving} onClose={() => setCreating(false)} onSubmit={async body => { if (await admin.createUser(body)) setCreating(false) }} />}
  </>
}

function CreateUserDialog({ saving, onClose, onSubmit }: { saving: boolean; onClose: () => void; onSubmit: (body: { username: string; fullName: string; email?: string; systemRole: 'USER' | 'CONTENT_EDITOR' | 'ADMIN' }) => Promise<void> }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ fullName: String(data.get('fullName')), username: String(data.get('username')), email: String(data.get('email')), systemRole: data.get('role') as 'USER' | 'CONTENT_EDITOR' | 'ADMIN' }) }
  return <ModalDialog title="Tạo tài khoản" description="Tài khoản development dùng mật khẩu chung được cấu hình tại backend." onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Họ và tên"><input required name="fullName" className={adminInputClass} /></Field><Field label="Tên đăng nhập"><input required name="username" autoComplete="off" className={adminInputClass} /></Field><Field label="Email"><input name="email" type="email" className={adminInputClass} /></Field><Field label="Vai trò hệ thống"><Select name="role"><option value="USER">Người dùng</option><option value="CONTENT_EDITOR">Biên tập SOP</option><option value="ADMIN">Quản trị viên</option></Select></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang tạo' : 'Tạo tài khoản'}</button></form></ModalDialog>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span>{children}</label> }
