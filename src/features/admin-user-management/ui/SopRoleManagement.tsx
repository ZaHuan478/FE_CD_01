import { useEffect, useMemo, useState } from 'react'
import { Save, Search } from 'lucide-react'
import { administrationGateway, type SopResource, type SopRoleAssignment, type SopRoleCode } from '../model/administrationGateway'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

const roles: Array<{ code: SopRoleCode; label: string; detail: string }> = [
  { code: 'VIEWER', label: 'Viewer', detail: 'Chỉ đọc tài liệu' },
  { code: 'OWNER', label: 'Owner', detail: 'Chịu trách nhiệm SOP' }, { code: 'EDITOR', label: 'Editor', detail: 'Biên tập nội dung' },
  { code: 'REVIEWER', label: 'Reviewer', detail: 'Rà soát nội dung' }, { code: 'APPROVER', label: 'Approver', detail: 'Phê duyệt, công bố' }
]

export function SopRoleManagement() {
  const toast = useToast()
  const admin = useAdminAccessContext()
  const [sops, setSops] = useState<SopResource[]>([])
  const [sopId, setSopId] = useState('')
  const [assignments, setAssignments] = useState<SopRoleAssignment[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    void administrationGateway.sopResources(controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setSops(result.data)
          setSopId(result.data[0]?.id ?? '')
          setError('')
        }
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(reason, 'Không tải được SOP'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!sopId) return
    const controller = new AbortController()
    void administrationGateway.sopRoles(sopId, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setAssignments(result.data.assignments)
          setError('')
        }
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(reason, 'Không tải được vai trò SOP'))
        }
      })
    return () => controller.abort()
  }, [sopId])
  const users = useMemo(() => { const term = query.trim().toLocaleLowerCase('vi'); return admin.users.filter(user => user.active && (!term || `${user.fullName} ${user.username}`.toLocaleLowerCase('vi').includes(term))) }, [admin.users, query])
  const checked = (accountId: string, roleCode: SopRoleCode) => assignments.some(item => item.accountId === accountId && item.roleCode === roleCode)
  const toggle = (accountId: string, roleCode: SopRoleCode) => setAssignments(current => checked(accountId, roleCode) ? current.filter(item => item.accountId !== accountId || item.roleCode !== roleCode) : [...current, { accountId, roleCode }])
  const save = async () => {
    if (!sopId) return
    setSaving(true)
    setError('')
    try {
      const result = await administrationGateway.replaceSopRoles(sopId, assignments)
      setAssignments(result.data.assignments)
      toast.success('Đã cập nhật trách nhiệm của SOP')
    } catch (reason) {
      const msg = getErrorMessage(reason, 'Không lưu được vai trò SOP')
      if (msg) toast.error(msg)
    } finally {
      setSaving(false)
    }
  }
  if (loading) return <TableSkeleton rows={8} />
  return <Panel title="Phân công trách nhiệm SOP" description="Tách rõ người sở hữu, biên tập, rà soát và phê duyệt." action={<button type="button" className={primaryButtonClass} disabled={!sopId || saving} onClick={() => void save()}><Save className="size-4" />{saving ? 'Đang lưu' : 'Lưu phân công'}</button>}>
    <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[minmax(280px,1fr)_minmax(240px,.7fr)] dark:border-slate-800"><Select aria-label="Chọn SOP" className={adminInputClass} value={sopId} onChange={event => setSopId(event.target.value)}><option value="">Chọn SOP</option>{sops.map(sop => <option key={sop.id} value={sop.id}>{sop.code} · {sop.title}</option>)}</Select><label className="relative"><span className="sr-only">Tìm người dùng</span><Search className="absolute left-3 top-3.5 size-4 text-slate-400" /><input className={`${adminInputClass} pl-9`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm người phụ trách" /></label></div>
    {error && <div className="p-4 pb-0"><Feedback type="error">{error}</Feedback></div>}
    {!sopId ? <EmptyState title="Chưa có SOP" description="Tạo bản nháp SOP trước khi phân công trách nhiệm." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50"><tr><th className="px-4 py-3">Người dùng</th>{roles.map(role => <th key={role.code} className="px-4 py-3 text-center"><span className="block">{role.label}</span><span className="normal-case font-normal">{role.detail}</span></th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{users.map(user => <tr key={user.id}><td className="px-4 py-3"><p className="font-bold">{user.fullName}</p><p className="text-xs text-slate-500">{user.username}</p></td>{roles.map(role => <td key={role.code} className="px-4 py-3 text-center"><input aria-label={`${role.label} - ${user.fullName}`} type="checkbox" checked={checked(user.id, role.code)} onChange={() => toggle(user.id, role.code)} className="size-5 accent-[#155e75]" /></td>)}</tr>)}</tbody></table></div>}
  </Panel>
}



