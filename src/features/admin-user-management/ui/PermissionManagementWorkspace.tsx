import { useState } from 'react'
import { KeyRound, Network, UsersRound } from 'lucide-react'
import { useSession } from '../../authentication/model/session'
import { AccessManagement } from './AccessManagement'
import { PermissionProfileManagement } from './PermissionProfileManagement'
import { SopRoleManagement } from './SopRoleManagement'

type View = 'modules' | 'profiles' | 'sop-roles'
export function PermissionManagementWorkspace() {
  const session = useSession(); const [view, setView] = useState<View>('modules'); const isSuper = session.systemRole === 'SUPER_ADMIN'
  const items: Array<{ id: View; label: string; icon: typeof UsersRound; superOnly?: boolean }> = [
    { id: 'modules', label: 'Quyền phân hệ', icon: Network }, { id: 'profiles', label: 'Nhóm quyền', icon: KeyRound, superOnly: true }, { id: 'sop-roles', label: 'Vai trò SOP', icon: UsersRound }
  ]
  return <><div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Các kiểu phân quyền">{items.filter(item => !item.superOnly || isSuper).map(item => <button type="button" role="tab" aria-selected={view === item.id} key={item.id} onClick={() => setView(item.id)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-bold ${view === item.id ? 'border-[#155e75] bg-[#155e75] text-white' : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><item.icon className="size-4" />{item.label}</button>)}</div>{view === 'profiles' && isSuper ? <PermissionProfileManagement /> : view === 'sop-roles' ? <SopRoleManagement /> : <AccessManagement readOnly={!isSuper} />}</>
}
