import type { ModuleInfo, ModuleFilterOption } from '../types'

export const STEP_MODULE_MAP: Record<string, ModuleInfo> = {
  'LIFE-01': {
    name: 'Phân hệ Tuyển dụng',
    nameEn: 'Recruitment Module',
    code: 'REC',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/90',
    border: 'border-indigo-200 dark:border-indigo-800',
    desc: 'Thu thập hồ sơ ứng viên, tạo tài khoản người dùng & cấp Mã nhân viên (EMP ID)',
    descEn: 'Collect applicant files, issue user accounts & allocate Employee ID',
    coModules: [
      { name: '👤 Core EMP (Tạo hồ sơ tạm)', nameEn: '👤 Core EMP (Temp Record)', bg: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300', color: 'border-blue-200 dark:border-blue-800' },
      { name: '💻 IT Systems (Cấp Account)', nameEn: '💻 IT Systems (Account Issue)', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-300 dark:border-slate-700' }
    ]
  },
  'LIFE-02': {
    name: 'Phân hệ Nhân sự (Core EMP)',
    nameEn: 'Personnel Core',
    code: 'EMP',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Số hóa lý lịch, quá trình đào tạo, người phụ thuộc & giấy tờ tùy thân',
    descEn: 'Digitize employee master records, background, dependants & ID documents',
    coModules: [
      { name: '🎯 Tuyển dụng (Kế thừa hồ sơ)', nameEn: '🎯 Recruitment (Inherit Data)', bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300', color: 'border-indigo-200 dark:border-indigo-800' },
      { name: '📁 Số hóa Hồ sơ số', nameEn: '📁 E-Archive Document', bg: 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300', color: 'border-sky-200 dark:border-sky-800' }
    ]
  },
  'LIFE-03': {
    name: 'Phân hệ HR Core & Đánh giá',
    nameEn: 'Evaluation & Movement',
    code: 'EVAL',
    color: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-50 dark:bg-teal-950/90',
    border: 'border-teal-200 dark:border-teal-800',
    desc: 'Phân công vị trí làm việc, đánh giá đạt thử việc & đề xuất bổ nhiệm',
    descEn: 'Assign job positions, evaluate probation results & promote employees',
    coModules: [
      { name: '👤 Core EMP (Cập nhật vị trí)', nameEn: '👤 Core EMP (Position Shift)', bg: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300', color: 'border-blue-200 dark:border-blue-800' },
      { name: '⏱️ Chấm công ATT (Phân ca)', nameEn: '⏱️ Attendance (Shift Assign)', bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300', color: 'border-emerald-200 dark:border-emerald-800' }
    ]
  },
  'LIFE-04': {
    name: 'Phân hệ Hợp đồng & Pháp lý',
    nameEn: 'Contract & Legal',
    code: 'CON',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-950/90',
    border: 'border-purple-200 dark:border-purple-800',
    desc: 'Thiết lập Hợp đồng chính thức, ký số & lưu trữ phụ lục hợp đồng',
    descEn: 'Setup official employment contract, e-sign & archive contract annexes',
    coModules: [
      { name: '💰 C&B (Mức lương HĐ)', nameEn: '💰 C&B (Contract Salary)', bg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', color: 'border-amber-200 dark:border-amber-800' },
      { name: '✍️ Chữ ký số (E-Sign)', nameEn: '✍️ E-Signature Service', bg: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300', color: 'border-violet-200 dark:border-violet-800' }
    ]
  },
  'LIFE-05': {
    name: 'Phân hệ C&B (Lương & BHXH)',
    nameEn: 'C&B: Pay & Ins',
    code: 'C&B',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/90',
    border: 'border-amber-200 dark:border-amber-800',
    desc: 'Cấu hình thang bảng lương, phụ cấp & đăng ký báo tăng BHXH/BHYT',
    descEn: 'Configure pay scales, allowances & declare new insurance registrations',
    coModules: [
      { name: '🏛️ Cơ quan BHXH (Báo tăng)', nameEn: '🏛️ Social Insurance Org', bg: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300', color: 'border-rose-200 dark:border-rose-800' },
      { name: '🏦 Ngân hàng (Tài khoản lương)', nameEn: '🏦 Bank Payroll Account', bg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', color: 'border-amber-200 dark:border-amber-800' }
    ]
  },
  'LIFE-06': {
    name: 'Phân hệ Chấm công (ATT)',
    nameEn: 'Attendance Module',
    code: 'ATT',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/90',
    border: 'border-emerald-200 dark:border-emerald-800',
    desc: 'Ghi nhận công daily, quản lý đơn phép, làm thêm giờ OT & nhật ký biến động',
    descEn: 'Track daily attendance, leave requests, overtime & workplace logs',
    coModules: [
      { name: '💰 C&B (Dữ liệu công ra lương)', nameEn: '💰 C&B (Attendance to Pay)', bg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', color: 'border-amber-200 dark:border-amber-800' },
      { name: '📲 Mobile App (Điểm danh GPS)', nameEn: '📲 Mobile App (GPS Checkin)', bg: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300', color: 'border-cyan-200 dark:border-cyan-800' }
    ]
  },
  'LIFE-07': {
    name: 'Phân hệ Thôi việc & Quyết toán',
    nameEn: 'Offboarding Settlement',
    code: 'OFF',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/90',
    border: 'border-rose-200 dark:border-rose-800',
    desc: 'Thỏa thuận nghỉ việc, bàn giao tài sản IT, báo giảm BHXH & khóa sổ tài khoản',
    descEn: 'Resignation agreement, IT asset clearance, insurance deregistration & account lock',
    coModules: [
      { name: '💰 C&B (Quyết toán trợ cấp)', nameEn: '💰 C&B (Severance Pay)', bg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300', color: 'border-amber-200 dark:border-amber-800' },
      { name: '💻 IT Asset (Thu hồi máy tính)', nameEn: '💻 IT Asset Clearance', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-300 dark:border-slate-700' },
      { name: '🏛️ BHXH (Báo giảm)', nameEn: '🏛️ Insurance Deregistration', bg: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300', color: 'border-rose-200 dark:border-rose-800' }
    ]
  }
}

export const MODULE_FILTER_OPTIONS: ModuleFilterOption[] = [
  { id: 'ALL', name: 'Tất cả Phân hệ', nameEn: 'All HR Modules', code: 'ALL' },
  { id: 'REC', name: 'Tuyển dụng', nameEn: 'Recruitment', code: 'REC', stepIds: ['LIFE-01'] },
  { id: 'EMP', name: 'Core EMP (Nhân sự)', nameEn: 'Personnel Core', code: 'EMP', stepIds: ['LIFE-01', 'LIFE-02', 'LIFE-03'] },
  { id: 'CON', name: 'Hợp đồng & Pháp lý', nameEn: 'Contract & Legal', code: 'CON', stepIds: ['LIFE-02', 'LIFE-04'] },
  { id: 'C&B', name: 'C&B Lương & BHXH', nameEn: 'C&B & Insurance', code: 'C&B', stepIds: ['LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'] },
  { id: 'ATT', name: 'Chấm công (ATT)', nameEn: 'Attendance', code: 'ATT', stepIds: ['LIFE-03', 'LIFE-06'] },
  { id: 'OFF', name: 'Thôi việc & Quyết toán', nameEn: 'Offboarding', code: 'OFF', stepIds: ['LIFE-07'] }
]
