import type { DevelopmentAccount } from '../../../entities/user/model/types'

interface DemoGroupConfig {
  title: string
  roles: string[]
}

const DEMO_GROUPS: DemoGroupConfig[] = [
  {
    title: 'Lãnh đạo và Quản trị',
    roles: ['ADMIN', 'BOM']
  },
  {
    title: 'Nhân sự và Vận hành',
    roles: ['HR_ADMIN', 'RECRUITER', 'TIMEKEEPER']
  },
  {
    title: 'Đãi ngộ và Kế toán',
    roles: ['CB_SPECIALIST', 'INSURANCE_OFFICER']
  },
  {
    title: 'Quản lý và Nhân viên',
    roles: ['LINE_MANAGER', 'EMPLOYEE']
  }
]

const roleOrder = DEMO_GROUPS.flatMap((group) => group.roles)
const getRoleCode = (account: DevelopmentAccount): string => account.groups[0]?.code ?? ''
const getAccountIdentifier = (account: DevelopmentAccount): string => account.email || account.username


export { DEMO_GROUPS, roleOrder, getRoleCode, getAccountIdentifier }
