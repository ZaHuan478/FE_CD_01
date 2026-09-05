import type { UserSession } from './types'

export const ROLE_NAMES: Record<string, string> = {
  'ADMIN': 'Quản trị hệ thống',
  'BOM': 'Ban Giám Đốc',
  'HR_ADMIN': 'Quản trị nhân sự',
  'RECRUITER': 'Chuyên viên tuyển dụng',
  'TIMEKEEPER': 'Chuyên viên chấm công',
  'CB_SPECIALIST': 'Chuyên viên C&B / Lương',
  'INSURANCE_OFFICER': 'Chuyên viên bảo hiểm',
  'LINE_MANAGER': 'Trưởng bộ phận',
  'EMPLOYEE': 'Nhân viên',
  'group-admin': 'Quản trị hệ thống',
  'group-bom': 'Ban Giám Đốc',
  'group-hr-admin': 'Quản trị nhân sự',
  'group-recruiter': 'Chuyên viên tuyển dụng',
  'group-attendance': 'Chuyên viên chấm công',
  'group-cb': 'Chuyên viên C&B / Lương',
  'group-insurance': 'Chuyên viên bảo hiểm',
  'group-manager': 'Trưởng bộ phận',
  'group-employee': 'Nhân viên',
  'demo-admin': 'Quản trị hệ thống',
  'demo-bom': 'Ban Giám Đốc',
  'demo-hr-admin': 'Quản trị nhân sự',
  'demo-recruiter': 'Chuyên viên tuyển dụng',
  'demo-attendance': 'Chuyên viên chấm công',
  'demo-cb': 'Chuyên viên C&B / Lương',
  'demo-insurance': 'Chuyên viên bảo hiểm',
  'demo-manager': 'Trưởng bộ phận',
  'demo-employee': 'Nhân viên'
}

export function resolveUserRoleTitle(session: UserSession | null): string {
  if (!session) return ''
  if (session.roleTitle) return session.roleTitle
  for (const groupId of session.groupIds || []) {
    if (ROLE_NAMES[groupId]) return ROLE_NAMES[groupId]
  }
  if (ROLE_NAMES[session.username]) return ROLE_NAMES[session.username]
  if (ROLE_NAMES[session.accountId]) return ROLE_NAMES[session.accountId]
  return 'Thành viên hệ thống'
}
