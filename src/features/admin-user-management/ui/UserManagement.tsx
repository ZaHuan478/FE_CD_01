import { useMemo, useState, type FormEvent } from 'react'
import { Crown, Lock, Plus, Search, Unlock, UserCog, UserRoundCheck, UserRoundX } from 'lucide-react'
import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../authentication/model/session'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { administrationGateway, type AdminUser, type SystemRole } from '../model/administrationGateway'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import { Select } from '../../../shared/ui/atoms/Select'
import { EmptyState, Feedback, Panel, adminInputClass, primaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

const roleLabel: Record<SystemRole, string> = { USER: 'Người dùng', CONTENT_EDITOR: 'Biên tập SOP', ADMIN: 'Admin nội dung', SUPER_ADMIN: 'Super Admin' }

export function UserManagement() {
  const toast = useToast()
  const admin = useAdminAccessContext()
  const { session, refreshSession } = useAuth()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'locked'>('all')
  const [role, setRole] = useState<'all' | SystemRole>('all')
  const [creating, setCreating] = useState(false)
  const [editingProfile, setEditingProfile] = useState<AdminUser | null>(null)
  const [bootstrapping, setBootstrapping] = useState(false)
  const highlighted = params.get('user')
  const isSuper = session?.systemRole === 'SUPER_ADMIN'
  const hasSuper = admin.users.some(user => user.systemRole === 'SUPER_ADMIN')

  const users = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return admin.users.filter(user => {
      const matchesText = !term || [user.fullName, user.username, user.email ?? '', user.employeeCode ?? ''].some(value => value.toLocaleLowerCase('vi').includes(term))
      const matchesStatus = status === 'all' || (status === 'active' ? user.active : !user.active)
      return matchesText && matchesStatus && (role === 'all' || user.systemRole === role)
    })
  }, [admin.users, query, status, role])

  const bootstrap = async (accountId: string) => {
    setBootstrapping(true)
    try {
      await administrationGateway.bootstrapSuperAdmin(accountId)
      await admin.load()
      await refreshSession()
      toast.success('Đã thiết lập Super Admin thành công')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi thiết lập Super Admin'))
    } finally {
      setBootstrapping(false)
    }
  }

  return <>
    {admin.error && <Feedback type="error" action={<button type="button" onClick={() => void admin.load()} className="font-bold underline">Thử lại</button>}>{admin.error}</Feedback>}
    {!hasSuper && session?.systemRole === 'ADMIN' && <Feedback type="info" action={<button type="button" disabled={bootstrapping} onClick={() => void bootstrap(session.accountId)} className="rounded-lg bg-[#155e75] px-3 py-2 text-xs font-bold text-white"><Crown className="mr-1 inline size-4" />{bootstrapping ? 'Đang thiết lập' : 'Đặt tôi làm Super Admin đầu tiên'}</button>}>Hệ thống chưa có Super Admin. Thao tác này chỉ xuất hiện một lần và được ghi Audit Log.</Feedback>}
    <Panel title="Danh sách tài khoản" description={isSuper ? 'Quản lý trạng thái và vai trò hệ thống.' : 'Admin được xem danh sách; chỉ Super Admin được thay đổi tài khoản.'} action={isSuper ? <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}><Plus className="size-4" />Tạo tài khoản</button> : undefined}>
      <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(240px,1fr)_180px_180px] dark:border-slate-800"><label className="relative"><span className="sr-only">Tìm tài khoản</span><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên, tài khoản, email, mã nhân viên" className={`${adminInputClass} pl-9`} /></label><Select aria-label="Lọc trạng thái" value={status} onChange={event => setStatus(event.target.value as typeof status)}><option value="all">Mọi trạng thái</option><option value="active">Đang hoạt động</option><option value="locked">Đã khóa</option></Select><Select aria-label="Lọc vai trò" value={role} onChange={event => setRole(event.target.value as typeof role)}><option value="all">Mọi vai trò</option>{Object.entries(roleLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></div>
      {!users.length ? <EmptyState title="Không có tài khoản phù hợp" description="Thử thay đổi bộ lọc." /> : <div className="overflow-x-auto"><table className="w-full min-w-[1040px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50"><tr><th className="px-4 py-3">Người dùng</th><th className="px-4 py-3">Phòng ban · Chức danh</th><th className="px-4 py-3">Vai trò</th><th className="px-4 py-3">Phân hệ</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{users.map(user => { const locked = !isSuper || admin.saving || user.id === session?.accountId; return <tr key={user.id} className={highlighted === user.id ? 'bg-cyan-50/70 dark:bg-cyan-950/20' : ''}><td className="px-4 py-3"><p className="font-bold">{user.fullName}</p><p className="text-xs text-slate-500">{user.username}{user.email ? ` · ${user.email}` : ''}</p></td><td className="px-4 py-3"><p className="text-xs font-bold">{user.organization.department || 'Chưa có phòng ban'}</p><p className="mt-1 text-xs text-slate-500">{user.organization.jobTitle || 'Chưa có chức danh'}</p></td><td className="w-48 px-4 py-3"><Select visualSize="compact" aria-label={`Vai trò ${user.fullName}`} value={user.systemRole} disabled={locked} onChange={event => void admin.updateUser(user.id, { systemRole: event.target.value as SystemRole })}>{Object.entries(roleLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></td><td className="px-4 py-3 font-mono text-xs">{['ADMIN', 'SUPER_ADMIN'].includes(user.systemRole) ? 'Tất cả' : user.assignedModuleCount}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${user.active ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>{user.active ? <UserRoundCheck className="size-3.5" /> : <UserRoundX className="size-3.5" />}{user.active ? 'Hoạt động' : 'Đã khóa'}</span></td><td className="px-4 py-3 text-right"><AdminActionMenu items={[...(isSuper ? [{ id: 'profile', label: 'Hồ sơ tổ chức', icon: <UserCog className="size-4 text-[#155e75] dark:text-cyan-400" />, disabled: admin.saving, onClick: () => setEditingProfile(user) }] : []), { id: 'toggle-active', label: user.active ? 'Khóa tài khoản' : 'Kích hoạt tài khoản', divider: isSuper, variant: user.active ? ('danger' as const) : ('success' as const), icon: user.active ? <Lock className="size-4 text-rose-600 dark:text-rose-400" /> : <Unlock className="size-4 text-emerald-600 dark:text-emerald-400" />, disabled: locked, onClick: () => void admin.updateUser(user.id, { active: !user.active }) }]} /></td></tr> })}</tbody></table></div>}
    </Panel>{creating && <CreateUserDialog saving={admin.saving} onClose={() => setCreating(false)} onSubmit={async body => { if (await admin.createUser(body)) setCreating(false) }} />}{editingProfile && <OrganizationProfileDialog user={editingProfile} saving={admin.saving} onClose={() => setEditingProfile(null)} onSubmit={async body => { if (await admin.updateUser(editingProfile.id, body)) setEditingProfile(null) }} />}</>
}
function CreateUserDialog({ saving, onClose, onSubmit }: { saving: boolean; onClose: () => void; onSubmit: (body: { username: string; fullName: string; email?: string; systemRole: Exclude<SystemRole, 'SUPER_ADMIN'> }) => Promise<void> }) { const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ fullName: String(data.get('fullName')), username: String(data.get('username')), email: String(data.get('email')), systemRole: data.get('role') as Exclude<SystemRole, 'SUPER_ADMIN'> }) }; return <ModalDialog title="Tạo tài khoản" description="Tạo người dùng mới; có thể thay đổi vai trò sau khi tài khoản được tạo." onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Họ và tên"><input required name="fullName" className={adminInputClass} /></Field><Field label="Tên đăng nhập"><input required name="username" autoComplete="off" className={adminInputClass} /></Field><Field label="Email"><input name="email" type="email" className={adminInputClass} /></Field><Field label="Vai trò hệ thống"><Select name="role"><option value="USER">Người dùng</option><option value="CONTENT_EDITOR">Biên tập SOP</option><option value="ADMIN">Admin nội dung</option></Select></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang tạo' : 'Tạo tài khoản'}</button></form></ModalDialog> }
function OrganizationProfileDialog({ user, saving, onClose, onSubmit }: { user: AdminUser; saving: boolean; onClose: () => void; onSubmit: (body: { department: string | null; jobTitle: string | null }) => Promise<void> }) { const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ department: String(data.get('department')).trim() || null, jobTitle: String(data.get('jobTitle')).trim() || null }) }; return <ModalDialog title={`Hồ sơ tổ chức · ${user.fullName}`} description="Phòng ban và chức danh quyết định phạm vi tài liệu mà người dùng có thể tạo và xem." onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Phòng ban"><input name="department" defaultValue={user.organization.department ?? ''} placeholder="Ví dụ: Phòng Nhân sự" className={adminInputClass} /></Field><Field label="Chức danh"><input name="jobTitle" defaultValue={user.organization.jobTitle ?? ''} placeholder="Ví dụ: Chuyên viên C&B" className={adminInputClass} /></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang lưu' : 'Lưu hồ sơ'}</button></form></ModalDialog> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span>{children}</label> }



