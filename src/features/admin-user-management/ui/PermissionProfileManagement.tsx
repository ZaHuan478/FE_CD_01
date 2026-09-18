import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Plus, Save, ShieldCheck } from 'lucide-react'
import { administrationGateway, type PermissionProfile } from '../model/administrationGateway'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

const capabilities = [
  ['sop.read', 'Xem SOP'], ['sop.create', 'Tạo SOP'], ['sop.edit', 'Biên tập SOP'], ['sop.review', 'Rà soát SOP'],
  ['sop.publish', 'Phê duyệt và công bố'], ['sop.archive', 'Lưu trữ SOP'], ['module.manage', 'Quản lý phân hệ'],
  ['knowledge.manage', 'Quản lý tài liệu'], ['rag.manage', 'Quản trị chỉ mục AI'], ['audit.read', 'Xem Audit Log']
] as const

export function PermissionProfileManagement() {
  const toast = useToast()
  const admin = useAdminAccessContext()
  const [profiles, setProfiles] = useState<PermissionProfile[]>([])
  const [selected, setSelected] = useState('')
  const [userId, setUserId] = useState('')
  const [userProfiles, setUserProfiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const result = await administrationGateway.profiles()
      setProfiles(result.data)
      setSelected(current => current || result.data[0]?.id || '')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không tải được nhóm quyền')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])
  useEffect(() => {
    if (!userId) { setUserProfiles([]); return }
    const controller = new AbortController()
    void administrationGateway.userProfiles(userId, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) setUserProfiles(result.data.profileIds)
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(reason, 'Không tải được nhóm của người dùng'))
        }
      })
    return () => controller.abort()
  }, [userId])

  const profile = useMemo(() => profiles.find(item => item.id === selected), [profiles, selected])
  const toggleUserProfile = (id: string) => setUserProfiles(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  const saveUserProfiles = async () => {
    if (!userId) return
    setSaving(true)
    setError('')
    try {
      await administrationGateway.replaceUserProfiles(userId, userProfiles)
      toast.success('Đã cập nhật nhóm quyền của người dùng')
      await load()
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không lưu được nhóm quyền'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <TableSkeleton rows={8} />

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(300px,.8fr)_minmax(0,1.2fr)]">
      <Panel
        title="Nhóm quyền"
        description={`${profiles.length} nhóm đang được cấu hình`}
        action={
          <button type="button" className={secondaryButtonClass} onClick={() => setCreating(value => !value)}>
            <Plus className="size-4" />Tạo nhóm
          </button>
        }
      >
        {error && <div className="p-4 pb-0"><Feedback type="error">{error}</Feedback></div>}
        {creating && <CreateProfile onSaved={async () => { setCreating(false); await load() }} />}
        <div className="grid gap-2 p-3">
          {profiles.map(item => (
            <button
              type="button"
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`rounded-xl border p-3 text-left ${selected === item.id ? 'border-cyan-400 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/30' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-black">{item.name}</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-bold dark:bg-slate-800">{item.memberCount} người</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-slate-500">{item.code}</p>
              <p className="mt-2 text-xs text-slate-500">{item.capabilities.length} quyền · {item.active ? 'Đang dùng' : 'Đã tắt'}</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5">
        {profile ? (
          <ProfileEditor key={profile.id} profile={profile} onSaved={load} />
        ) : (
          <Panel><EmptyState title="Chưa có nhóm quyền" description="Tạo nhóm quyền để bắt đầu." /></Panel>
        )}
        <Panel title="Gán nhóm cho người dùng" description="Một người dùng có thể thuộc nhiều nhóm quyền.">
          <div className="grid gap-4 p-4">
            <Select className={adminInputClass} value={userId} onChange={event => setUserId(event.target.value)}>
              <option value="">Chọn người dùng</option>
              {admin.users.filter(user => user.active).map(user => (
                <option key={user.id} value={user.id}>{user.fullName} · {user.username}</option>
              ))}
            </Select>
            {userId && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {profiles.filter(item => item.active).map(item => (
                    <label key={item.id} className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-slate-700">
                      <input type="checkbox" checked={userProfiles.includes(item.id)} onChange={() => toggleUserProfile(item.id)} className="size-4 accent-[#155e75]" />
                      <span className="text-sm font-bold">{item.name}</span>
                    </label>
                  ))}
                </div>
                <button type="button" disabled={saving} onClick={() => void saveUserProfiles()} className={primaryButtonClass}>
                  <Save className="size-4" />Lưu nhóm của người dùng
                </button>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ProfileEditor({ profile, onSaved }: { profile: PermissionProfile; onSaved: () => Promise<void> }) {
  const toast = useToast()
  const [name, setName] = useState(profile.name)
  const [description, setDescription] = useState(profile.description ?? '')
  const [active, setActive] = useState(profile.active)
  const [selected, setSelected] = useState(profile.capabilities)
  const [saving, setSaving] = useState(false)

  const toggle = (code: string) => setSelected(current => current.includes(code) ? current.filter(item => item !== code) : [...current, code])

  const save = async () => {
    setSaving(true)
    try {
      await administrationGateway.updateProfile(profile.id, { name, description: description || null, active, capabilities: selected })
      toast.success('Đã cập nhật nhóm quyền')
      await onSaved()
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không lưu được nhóm quyền'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel
      title={profile.name}
      description="Quyền chi tiết của nhóm"
      action={
        <button type="button" className={primaryButtonClass} disabled={saving} onClick={() => void save()}>
          <Save className="size-4" />Lưu nhóm
        </button>
      }
    >
      <div className="grid gap-4 p-4">
        <input className={adminInputClass} value={name} onChange={event => setName(event.target.value)} />
        <textarea className={`${adminInputClass} min-h-20 py-3`} value={description} onChange={event => setDescription(event.target.value)} />
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={active} onChange={event => setActive(event.target.checked)} className="size-4 accent-[#155e75]" />
          Đang sử dụng
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {capabilities.map(([code, label]) => (
            <label key={code} className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 px-3 dark:border-slate-700">
              <input type="checkbox" checked={selected.includes(code)} onChange={() => toggle(code)} className="size-4 accent-[#155e75]" />
              <span>
                <span className="block text-sm font-bold">{label}</span>
                <span className="font-mono text-[10px] text-slate-500">{code}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function CreateProfile({ onSaved }: { onSaved: () => Promise<void> }) {
  const toast = useToast()
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await administrationGateway.createProfile({
        code: String(data.get('code')).trim().toUpperCase(),
        name: String(data.get('name')).trim(),
        description: String(data.get('description')).trim() || null,
        capabilities: ['sop.read']
      })
      toast.success('Đã tạo nhóm quyền mới')
      await onSaved()
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không tạo được nhóm quyền'))
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-2 border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <input required name="code" placeholder="Mã nhóm, ví dụ HR_REVIEW" className={adminInputClass} />
      <input required name="name" placeholder="Tên nhóm" className={adminInputClass} />
      <input name="description" placeholder="Mô tả" className={adminInputClass} />
      <button className={primaryButtonClass}><ShieldCheck className="size-4" />Tạo nhóm quyền</button>
    </form>
  )
}




