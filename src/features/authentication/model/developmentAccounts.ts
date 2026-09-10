import type { DevelopmentAccount } from '../../../entities/user/model/types'

interface DemoGroupConfig {
  title: string
  roles: string[]
}

const DEMO_GROUPS: DemoGroupConfig[] = [
  {
    title: 'Lãnh đạo và Quản trị',
    roles: ['SYSTEM_ADMINISTRATOR', 'SOP_ADMINISTRATOR', 'EXECUTIVE']
  },
  {
    title: 'Nhân sự và Vận hành',
    roles: ['HR_OPERATIONS', 'RECRUITER', 'TIME_ATTENDANCE', 'CLERICAL_ADMIN', 'HRIS_SUPPORT', 'LEGAL']
  },
  {
    title: 'Đãi ngộ và Kế toán',
    roles: ['PAYROLL_CB', 'INSURANCE_TAX']
  },
  {
    title: 'Quản lý và Nhân viên',
    roles: ['LINE_MANAGER', 'EMPLOYEE_SELF_SERVICE', 'AUDITOR']
  }
]

const roleOrder = DEMO_GROUPS.flatMap((group) => group.roles)
const getRoleCode = (account: DevelopmentAccount): string =>
  account.groups.map(group => group.code).find(code => roleOrder.includes(code)) ?? account.groups[0]?.code ?? ''
const getAccountIdentifier = (account: DevelopmentAccount): string => account.email || account.username


export { DEMO_GROUPS, roleOrder, getRoleCode, getAccountIdentifier }
