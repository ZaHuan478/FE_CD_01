import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminAccessApi, type AdminModule, type AdminUser, type ModuleInput, type SystemRole, type UserModuleAccess } from '../../../shared/api/admin-access.api'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

export function useAdminAccess() {
  const toast = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [modules, setModules] = useState<AdminModule[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [access, setAccess] = useState<UserModuleAccess | null>(null)
  const [draftModules, setDraftModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [accessLoading, setAccessLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [userResult, moduleResult] = await Promise.all([adminAccessApi.users(), adminAccessApi.modules()])
      setUsers(userResult.data); setModules(moduleResult.items)
      setSelectedId(current => current && userResult.data.some(user => user.id === current) ? current : userResult.data[0]?.id ?? null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không tải được dữ liệu quản trị') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!selectedId) { setAccess(null); setDraftModules([]); return }
    const controller = new AbortController()
    setAccessLoading(true); setError('')
    void adminAccessApi.userModules(selectedId, controller.signal).then(result => {
      if (!controller.signal.aborted) { setAccess(result.data); setDraftModules(result.data.assignedModuleIds) }
    }).catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được quyền phân hệ') })
      .finally(() => { if (!controller.signal.aborted) setAccessLoading(false) })
    return () => controller.abort()
  }, [selectedId])

  const selectedUser = useMemo(() => users.find(user => user.id === selectedId) ?? null, [users, selectedId])
  const toggleModule = (id: string) => setDraftModules(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  const saveModules = async () => {
    if (!selectedId) return
    setSaving(true); setError('')
    try {
      const result = await adminAccessApi.replaceUserModules(selectedId, draftModules)
      setAccess(result.data); setDraftModules(result.data.assignedModuleIds)
      toast.success('Đã cập nhật quyền phân hệ')
      await load()
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không lưu được quyền'))
    } finally { setSaving(false) }
  }

  const createUser = async (body: { username: string; fullName: string; email?: string; systemRole: Exclude<SystemRole, 'SUPER_ADMIN'> }) => {
    setSaving(true); setError('')
    try {
      const user = await adminAccessApi.createUser({ username: body.username, fullName: body.fullName, email: body.email || null })
      if (body.systemRole !== 'USER') await adminAccessApi.updateUser(user.id, { systemRole: body.systemRole })
      await load(); setSelectedId(user.id)
      toast.success('Đã tạo tài khoản mới')
      return true
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không tạo được tài khoản'))
      return false
    } finally { setSaving(false) }
  }

  const updateUser = async (id: string, body: { active?: boolean; systemRole?: SystemRole; department?: string | null; jobTitle?: string | null }) => {
    setSaving(true); setError('')
    try {
      await adminAccessApi.updateUser(id, body)
      await load()
      if (id === selectedId) {
        const result = await adminAccessApi.userModules(id)
        setAccess(result.data); setDraftModules(result.data.assignedModuleIds)
      }
      toast.success('Đã cập nhật tài khoản')
      return true
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không cập nhật được tài khoản'))
      return false
    } finally { setSaving(false) }
  }

  const createModule = async (body: ModuleInput) => {
    setSaving(true); setError('')
    try {
      await adminAccessApi.createModule({ status: 'published', sortOrder: Math.max(0, ...modules.map(module => module.sortOrder)) + 10, ...body })
      window.dispatchEvent(new Event('sop-catalog-changed'))
      await load()
      toast.success('Đã tạo phân hệ mới')
      return true
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không tạo được phân hệ'))
      return false
    } finally { setSaving(false) }
  }

  const updateModule = async (id: string, change: AdminModule['status'] | Partial<ModuleInput>) => {
    setSaving(true); setError('')
    try {
      await adminAccessApi.updateModule(id, typeof change === 'string' ? { status: change } : change)
      window.dispatchEvent(new Event('sop-catalog-changed'))
      await load()
      toast.success('Đã cập nhật phân hệ')
      return true
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không cập nhật được phân hệ'))
      return false
    } finally { setSaving(false) }
  }

  return {
    users, modules, selectedId, setSelectedId, selectedUser, access, draftModules, toggleModule,
    loading, accessLoading, saving, error, notice: null, load, saveModules, createUser, updateUser, createModule, updateModule
  }
}


