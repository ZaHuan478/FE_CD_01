import { useEffect, useMemo, useState } from 'react'
import { Save, Search, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

export function AccessManagement() {
  const admin = useAdminAccessContext()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const requestedUser = params.get('user')
  const { users: allUsers, setSelectedId } = admin
  useEffect(() => { if (requestedUser && allUsers.some(user => user.id === requestedUser)) setSelectedId(requestedUser) }, [requestedUser, allUsers, setSelectedId])
  const users = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return term ? admin.users.filter(user => `${user.fullName} ${user.username}`.toLocaleLowerCase('vi').includes(term)) : admin.users
  }, [admin.users, query])

  return <>
    {admin.error && <Feedback type="error" action={<button type="button" onClick={() => void admin.load()} className="font-bold underline">Thử lại</button>}>{admin.error}</Feedback>}
    {admin.notice && <Feedback type="success">{admin.notice}</Feedback>}
    {admin.loading ? <TableSkeleton rows={8} /> : <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <Panel title="Chọn người dùng" description={`${users.length} tài khoản trong danh sách`}>
        <div className="border-b border-slate-200 p-3 dark:border-slate-800"><label className="relative"><span className="sr-only">Tìm người dùng</span><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tên hoặc tài khoản" className={`${adminInputClass} pl-9`} /></label></div>
        <div className="max-h-[650px] overflow-y-auto p-2">{users.map(user => <button type="button" key={user.id} onClick={() => admin.setSelectedId(user.id)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${admin.selectedId === user.id ? 'bg-cyan-50 text-cyan-950 ring-1 ring-inset ring-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-100 dark:ring-cyan-900' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}><span className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-200 text-[11px] font-black dark:bg-slate-700">{initials(user.fullName)}</span><span className="min-w-0"><span className="block truncate text-sm font-bold">{user.fullName}</span><span className="block truncate text-xs text-slate-500">{user.systemRole === 'ADMIN' ? 'Toàn quyền hệ thống' : `${user.assignedModuleCount} phân hệ`}</span></span></button>)}{!users.length && <EmptyState title="Không tìm thấy" description="Thử một từ khóa khác." />}</div>
      </Panel>
      <AccessEditor />
    </div>}
  </>
}

function AccessEditor() {
  const admin = useAdminAccessContext()
  const user = admin.selectedUser
  if (!user) return <Panel><EmptyState title="Chưa chọn tài khoản" description="Chọn một người dùng để xem và cập nhật quyền phân hệ." /></Panel>
  const dirty = JSON.stringify([...admin.draftModules].sort()) !== JSON.stringify([...(admin.access?.assignedModuleIds ?? [])].sort())
  return <Panel title={user.fullName} description={`${user.username} · ${user.systemRole}`} action={<button type="button" onClick={() => void admin.saveModules()} disabled={!dirty || admin.saving || admin.accessLoading || user.systemRole === 'ADMIN'} className={primaryButtonClass}><Save className="size-4" />{admin.saving ? 'Đang lưu' : 'Lưu quyền'}</button>}>
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400"><ShieldCheck className="mr-2 inline size-4 text-[#155e75]" />Backend quyết định quyền cuối cùng. Admin mặc định có toàn bộ phân hệ.</div>
    {admin.accessLoading ? <TableSkeleton rows={6} /> : <div className="grid gap-2 p-4 sm:grid-cols-2 2xl:grid-cols-3">{admin.modules.map(module => {
      const inherited = user.systemRole === 'ADMIN' || admin.access?.modules.find(item => item.id === module.id)?.sources.includes('system')
      const checked = inherited || admin.draftModules.includes(module.id)
      return <label key={module.id} className={`flex min-h-20 items-start gap-3 rounded-lg border p-3 ${inherited ? 'cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'border-cyan-300 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/30' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'}`}><input type="checkbox" checked={checked} disabled={Boolean(inherited) || module.common || admin.saving} onChange={() => admin.toggleModule(module.id)} className="mt-0.5 size-4 accent-[#155e75]" /><span><span className="block text-sm font-black">{module.title}</span><span className="mt-1 block text-xs text-slate-500">{module.code}{inherited ? ' · quyền hệ thống' : ''}</span></span></label>
    })}</div>}
  </Panel>
}

function initials(name: string) { return name.trim().split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase() }
