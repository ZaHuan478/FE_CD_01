import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminAccessApi, type AdminModule, type AdminUser, type UserModuleAccess } from '../../../shared/api/admin-access.api'

export function useAdminAccess() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [modules, setModules] = useState<AdminModule[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [access, setAccess] = useState<UserModuleAccess | null>(null)
  const [draftModules, setDraftModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [accessLoading, setAccessLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

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
    setSaving(true); setError(''); setNotice('')
    try {
      const result = await adminAccessApi.replaceUserModules(selectedId, draftModules)
      setAccess(result.data); setDraftModules(result.data.assignedModuleIds); setNotice('Đã cập nhật quyền phân hệ')
      await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không lưu được quyền') }
    finally { setSaving(false) }
  }
  const createUser = async (body: { username: string; fullName: string; email?: string; systemRole: 'USER' | 'CONTENT_EDITOR' | 'ADMIN' }) => {
    setSaving(true); setError(''); setNotice('')
    try {
      const user = await adminAccessApi.createUser({ username: body.username, fullName: body.fullName, email: body.email || null })
      if (body.systemRole !== 'USER') await adminAccessApi.updateUser(user.id, { systemRole: body.systemRole })
      await load(); setSelectedId(user.id); setNotice('Đã tạo tài khoản mới'); return true
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không tạo được tài khoản'); return false }
    finally { setSaving(false) }
  }
  const updateUser = async (id: string, body: { active?: boolean; systemRole?: 'USER' | 'CONTENT_EDITOR' | 'ADMIN' }) => {
    setSaving(true); setError(''); setNotice('')
    try {
      await adminAccessApi.updateUser(id, body)
      await load()
      if (id === selectedId) {
        const result = await adminAccessApi.userModules(id)
        setAccess(result.data); setDraftModules(result.data.assignedModuleIds)
      }
      setNotice('Đã cập nhật tài khoản')
    }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không cập nhật được tài khoản') }
    finally { setSaving(false) }
  }
  const createModule = async (body: { code: string; title: string; description?: string; moduleType: string }) => {
    setSaving(true); setError(''); setNotice('')
    try { await adminAccessApi.createModule({ ...body, status: 'published', sortOrder: modules.length + 1 }); await load(); setNotice('Đã tạo phân hệ mới'); return true }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không tạo được phân hệ'); return false }
    finally { setSaving(false) }
  }
  const updateModule = async (id: string, status: AdminModule['status']) => {
    setSaving(true); setError(''); setNotice('')
    try { await adminAccessApi.updateModule(id, { status }); await load(); setNotice('Đã cập nhật phân hệ') }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không cập nhật được phân hệ') }
    finally { setSaving(false) }
  }

  return { users, modules, selectedId, setSelectedId, selectedUser, access, draftModules, toggleModule,
    loading, accessLoading, saving, error, notice, load, saveModules, createUser, updateUser, createModule, updateModule }
}
