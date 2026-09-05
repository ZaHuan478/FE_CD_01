import type { PolicyCategory, PolicyType, PolicyStatus, PolicySeverity, RuleKind } from '../model/types'

export interface BadgeStyle {
  label: string
  labelEn: string
  bg: string
  text: string
  border: string
}

export const CATEGORY_METADATA: Record<PolicyCategory, BadgeStyle> = {
  'employee-profile': {
    label: 'Hồ sơ nhân viên',
    labelEn: 'Employee Profile',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800'
  },
  'attendance-leave': {
    label: 'Chấm công & Nghỉ phép',
    labelEn: 'Attendance & Leave',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  'overtime': {
    label: 'Tăng ca (OT)',
    labelEn: 'Overtime',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800'
  },
  'workplace-conduct': {
    label: 'Quy tắc nơi làm việc',
    labelEn: 'Workplace Conduct',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800'
  },
  'internal-communications': {
    label: 'Truyền thông nội bộ',
    labelEn: 'Internal Communications',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800'
  }
}

export const POLICY_TYPE_METADATA: Record<PolicyType, BadgeStyle> = {
  'system-rule': {
    label: 'Quy tắc hệ thống',
    labelEn: 'System Rule',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
  'internal-regulation': {
    label: 'Quy định nội bộ',
    labelEn: 'Internal Regulation',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700'
  },
  'mandatory-action': {
    label: 'Hành động bắt buộc',
    labelEn: 'Mandatory Action',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800'
  },
  'guideline': {
    label: 'Hướng dẫn thực hiện',
    labelEn: 'Guideline',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800'
  },
  'communication': {
    label: 'Thông tin truyền thông',
    labelEn: 'Communication',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800'
  }
}

export const STATUS_METADATA: Record<PolicyStatus, BadgeStyle> = {
  'active': {
    label: 'Đang hiệu lực',
    labelEn: 'Active',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  'upcoming': {
    label: 'Sắp hiệu lực',
    labelEn: 'Upcoming',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800'
  },
  'expired': {
    label: 'Hết hiệu lực',
    labelEn: 'Expired',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-500 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700'
  },
  'draft': {
    label: 'Dự thảo',
    labelEn: 'Draft',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800'
  }
}

export const SEVERITY_METADATA: Record<PolicySeverity, BadgeStyle> = {
  'info': {
    label: 'Thông tin / Khuyến nghị',
    labelEn: 'Info / Recommended',
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700'
  },
  'mandatory': {
    label: 'Bắt buộc tuân thủ',
    labelEn: 'Mandatory',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800'
  },
  'warning': {
    label: 'Cần lưu ý kiểm soát',
    labelEn: 'Warning',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800'
  },
  'critical': {
    label: 'Quy tắc kiểm soát chặt',
    labelEn: 'Critical',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800'
  }
}

export const RULE_KIND_LABELS: Record<RuleKind, { label: string; bg: string; text: string }> = {
  limit: { label: 'Hạn mức / Giới hạn', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300' },
  deadline: { label: 'Thời hạn / Thời hiệu', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300' },
  approval: { label: 'Phê duyệt', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300' },
  validation: { label: 'Điều kiện xác thực', bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-300' },
  penalty: { label: 'Mức tham chiếu / Chế tài', bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300' }
}
