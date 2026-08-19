import React from 'react'
import { Users, Clock, CircleDollarSign, Receipt, ShieldCheck } from 'lucide-react'

export interface SopDetailItem {
  code: string
  title: string
  titleEn: string
  type: 'N' | 'M' | 'A'
}

export interface ModuleEcosystemItem {
  id: string
  code: string
  name: string
  nameEn: string
  sopCount: string
  percentage: string
  subFeatures: string[]
  subFeaturesEn: string[]
  sopList: SopDetailItem[]
  color: string
  gradient: string
  border: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  icon: React.ReactNode
  angleDeg: number
}

// STRICTLY 5 REAL MODULES FROM SOP-HRUX SPECS (45 SOPS TOTAL)
export const FIVE_CORE_MODULES: ModuleEcosystemItem[] = [
  {
    id: 'emp',
    code: 'Core EMP',
    name: 'Phân hệ Nhân sự (Core EMP)',
    nameEn: 'Personnel Core Module (Core EMP)',
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Hồ sơ sơ yếu lý lịch nhân viên', 'Quản lý thông tin hợp đồng & hồ sơ', 'Báo cáo biến động nhân sự'],
    subFeaturesEn: ['Employee master profiles & resumes', 'Contract & document management', 'Headcount & movement reporting'],
    sopList: [
      { code: 'SOP-EMP-01', title: 'Định biên nhân sự & Kế hoạch tuyển dụng', titleEn: 'Headcount Budget & Recruitment Planning', type: 'M' },
      { code: 'SOP-EMP-02', title: 'Tiếp nhận hồ sơ nhân viên mới (Onboarding)', titleEn: 'New Employee Onboarding & File Intake', type: 'N' },
      { code: 'SOP-EMP-03', title: 'Quản lý thông tin lý lịch Master Data', titleEn: 'Employee Master Profile Data Management', type: 'N' },
      { code: 'SOP-EMP-04', title: 'Ký hợp đồng lao động & Phụ lục HĐLĐ', titleEn: 'Employment Contract & Annex Signing', type: 'M' },
      { code: 'SOP-EMP-05', title: 'Tái ký hợp đồng & Chuyển loại HĐLĐ', titleEn: 'Contract Renewal & Type Transition', type: 'M' },
      { code: 'SOP-EMP-06', title: 'Bổ nhiệm, Kiêm nhiệm & Miễn nhiệm', titleEn: 'Appointment, Concurrent Role & Discharge', type: 'M' },
      { code: 'SOP-EMP-07', title: 'Điều động & Điều chuyển nội bộ', titleEn: 'Internal Reassignment & Mobility', type: 'M' },
      { code: 'SOP-EMP-08', title: 'Khen thưởng & Xử lý Kỷ luật lao động', titleEn: 'Employee Rewards & Discipline Action', type: 'M' },
      { code: 'SOP-EMP-09', title: 'Quản lý đào tạo & Phát triển kỹ năng', titleEn: 'Training Plan & Skill Development', type: 'N' },
      { code: 'SOP-EMP-10', title: 'Đánh giá thử việc & Tiêu chí KPI', titleEn: 'Probation Assessment & KPI Evaluation', type: 'M' },
      { code: 'SOP-EMP-11', title: 'Quản lý lịch công tác & Chi phí', titleEn: 'Business Trip & Expense Reimbursement', type: 'N' },
      { code: 'SOP-EMP-12', title: 'Khám sức khỏe & Chăm sóc phúc lợi', titleEn: 'Health Checkup & Welfare Benefit Care', type: 'A' },
      { code: 'SOP-EMP-13', title: 'Biến động giảm & Thỏa thuận nghỉ việc', titleEn: 'Resignation & Resignation Agreement', type: 'M' },
      { code: 'SOP-EMP-14', title: 'Bàn giao công việc & Quyền tài sản IT', titleEn: 'Work Handover & IT Asset Clearance', type: 'M' },
      { code: 'SOP-EMP-15', title: 'Quyết toán thôi việc & Khóa sổ hồ sơ', titleEn: 'Offboarding Settlement & Profile Lock', type: 'A' }
    ],
    color: '#2563eb',
    gradient: 'from-blue-600 to-indigo-600',
    border: 'border-blue-500',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-950/80',
    textLight: 'text-blue-700',
    textDark: 'text-blue-300',
    icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    angleDeg: 270 // Top (12 o'clock)
  },
  {
    id: 'att',
    code: 'ATT',
    name: 'Chấm công & Nghỉ phép (ATT)',
    nameEn: 'Attendance & Leave (ATT)',
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Chấm công tự động (Vân tay/GPS/Khuôn mặt)', 'Quản lý ca làm việc & đăng ký nghỉ phép', 'Bảng tổng hợp công hàng tháng'],
    subFeaturesEn: ['Automated timekeeping (Biometric/GPS/Face ID)', 'Shift management & leave requests', 'Monthly timesheet summaries'],
    sopList: [
      { code: 'SOP-ATT-01', title: 'Cấu hình danh mục Ca làm việc & Lịch làm việc', titleEn: 'Shift & Work Calendar Configuration', type: 'M' },
      { code: 'SOP-ATT-02', title: 'Phân ca & Xoay ca kíp kĩ thuật', titleEn: 'Shift Scheduling & Roster Rotation', type: 'M' },
      { code: 'SOP-ATT-03', title: 'Đồng bộ dữ liệu máy chấm công tự động', titleEn: 'Biometric Clock-in Data Auto-Sync', type: 'A' },
      { code: 'SOP-ATT-04', title: 'Đăng ký & Phê duyệt Nghỉ phép năm', titleEn: 'Annual Leave Application & Approval', type: 'N' },
      { code: 'SOP-ATT-05', title: 'Đơn giải trình đi trễ, về sớm', titleEn: 'Late-in / Early-out Explanation Request', type: 'N' },
      { code: 'SOP-ATT-06', title: 'Đơn đăng ký làm thêm giờ (OT) & Duyệt', titleEn: 'Overtime (OT) Request & Approval', type: 'M' },
      { code: 'SOP-ATT-07', title: 'Quản lý nghỉ bù & Quỹ phép tích lũy', titleEn: 'Compensatory Leave & Balance Audit', type: 'A' },
      { code: 'SOP-ATT-08', title: 'Theo dõi lịch công tác ngoài doanh nghiệp', titleEn: 'Out-of-Office Work Tracking', type: 'N' },
      { code: 'SOP-ATT-09', title: 'Quản lý nghỉ chế độ thai sản / ốm đau', titleEn: 'Maternity & Sick Leave Management', type: 'M' },
      { code: 'SOP-ATT-10', title: 'Chấm công GPS Mobile & Face ID', titleEn: 'GPS Mobile & Face ID Attendance', type: 'A' },
      { code: 'SOP-ATT-11', title: 'Tổng hợp bảng chấm công tháng tự động', titleEn: 'Monthly Timesheet Compilation', type: 'A' },
      { code: 'SOP-ATT-12', title: 'Xử lý cảnh báo vi phạm giờ công', titleEn: 'Workday Violation Alert Processing', type: 'A' },
      { code: 'SOP-ATT-13', title: 'Chốt sổ bảng công & Chuyển tính lương', titleEn: 'Timesheet Lock & Salary Handoff', type: 'M' },
      { code: 'SOP-ATT-14', title: 'Chấm công theo Dự án & Task công việc', titleEn: 'Project & Task Time Tracking', type: 'N' },
      { code: 'SOP-ATT-15', title: 'Báo cáo quản trị tuân thủ giờ công', titleEn: 'Attendance Compliance Analytics', type: 'A' }
    ],
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-950/80',
    textLight: 'text-emerald-700',
    textDark: 'text-emerald-300',
    icon: <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    angleDeg: 342 // Top Right
  },
  {
    id: 'pay',
    code: 'PAY',
    name: 'Tiền lương & Phụ cấp (PAY)',
    nameEn: 'Payroll & Allowances (PAY)',
    sopCount: '4/4 SOPs',
    percentage: '100%',
    subFeatures: ['Cấu hình thang bảng lương & phụ cấp', 'Tính lương tự động theo công & doanh số', 'Chuyển khoản & phiếu lương điện tử'],
    subFeaturesEn: ['Pay grade & allowance configuration', 'Automated salary calculation by workdays & KPI', 'Direct bank transfer & e-payslips'],
    sopList: [
      { code: 'SOP-PAY-01', title: 'Cấu hình Thang bảng lương & Công thức tính lương', titleEn: 'Pay Grade Scale & Formula Setup', type: 'M' },
      { code: 'SOP-PAY-02', title: 'Tính lương tự động theo Bảng công & Doanh số', titleEn: 'Automated Salary Calculation Engine', type: 'A' },
      { code: 'SOP-PAY-03', title: 'Phê duyệt bảng lương & Sinh file ngân hàng', titleEn: 'Payroll Approval & Bank Transfer File', type: 'M' },
      { code: 'SOP-PAY-04', title: 'Phát hành Phiếu lương điện tử E-payslip', titleEn: 'E-payslip Distribution & Query Ticket', type: 'A' }
    ],
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-950/80',
    textLight: 'text-amber-700',
    textDark: 'text-amber-300',
    icon: <CircleDollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    angleDeg: 54 // Bottom Right
  },
  {
    id: 'tax',
    code: 'TAX',
    name: 'Thuế TNCN (TAX)',
    nameEn: 'Personal Income Tax (TAX)',
    sopCount: '3/3 SOPs',
    percentage: '100%',
    subFeatures: ['Đăng ký mã số thuế & người phụ thuộc', 'Tính giảm trừ & Kê khai thuế TNCN', 'Quyết toán thuế TNCN cuối năm'],
    subFeaturesEn: ['Tax ID & dependant registration', 'Deduction calculations & tax filings', 'Year-end PIT settlement'],
    sopList: [
      { code: 'SOP-TAX-01', title: 'Kê khai Mã số thuế & Đăng ký Người phụ thuộc', titleEn: 'Tax ID & Dependant Registration', type: 'N' },
      { code: 'SOP-TAX-02', title: 'Khấu trừ Thuế TNCN hàng tháng & Kê khai Thuế', titleEn: 'Monthly PIT Deductions & Filings', type: 'A' },
      { code: 'SOP-TAX-03', title: 'Quyết toán Thuế TNCN cuối năm & Chứng từ khấu trừ', titleEn: 'Year-end PIT Settlement & Certificates', type: 'M' }
    ],
    color: '#6366f1',
    gradient: 'from-indigo-600 to-blue-600',
    border: 'border-indigo-500',
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-indigo-950/80',
    textLight: 'text-indigo-700',
    textDark: 'text-indigo-300',
    icon: <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    angleDeg: 126 // Bottom Left
  },
  {
    id: 'ins',
    code: 'INS',
    name: 'Bảo hiểm Xã hội (INS)',
    nameEn: 'Social Insurance (INS)',
    sopCount: '8/8 SOPs',
    percentage: '100%',
    subFeatures: ['Thiết lập đối tượng & tỷ lệ đóng BHXH', 'Kê khai BHXH điện tử (Báo tăng/giảm)', 'Giải quyết chế độ ốm đau/thai sản/dưỡng sức'],
    subFeaturesEn: ['Insurance rate & policy setup', 'Electronic e-insurance declarations', 'Sick leave, maternity & recovery claims'],
    sopList: [
      { code: 'SOP-INS-01', title: 'Thiết lập đối tượng & Tỷ lệ đóng BHXH/BHYT/BHTN', titleEn: 'Insurance Policy & Rate Setup', type: 'M' },
      { code: 'SOP-INS-02', title: 'Kê khai Báo tăng lao động BHXH Mẫu D02-LT', titleEn: 'New Employee Insurance Declaration', type: 'N' },
      { code: 'SOP-INS-03', title: 'Kê khai Báo giảm lao động BHXH', titleEn: 'Employee Insurance Termination Filing', type: 'M' },
      { code: 'SOP-INS-04', title: 'Điều chỉnh mức lương đóng BHXH', titleEn: 'Insurance Base Salary Adjustment', type: 'M' },
      { code: 'SOP-INS-05', title: 'Giải quyết chế độ Ốm đau / Thai sản / Phục hồi', titleEn: 'Sick Leave & Maternity Benefit Claims', type: 'N' },
      { code: 'SOP-INS-06', title: 'Đối chiếu phát sinh nộp BHXH với Cơ quan BHXH', titleEn: 'Monthly Insurance Reconciliation', type: 'A' },
      { code: 'SOP-INS-07', title: 'Cấp, chốt sổ BHXH & Thẻ BHYT điện tử', titleEn: 'E-Insurance Book Settlement & Cards', type: 'A' },
      { code: 'SOP-INS-08', title: 'Báo cáo quản trị chi phí Bảo hiểm Doanh nghiệp', titleEn: 'Corporate Insurance Cost Audit Report', type: 'A' }
    ],
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600',
    border: 'border-purple-500',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-950/80',
    textLight: 'text-purple-700',
    textDark: 'text-purple-300',
    icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    angleDeg: 198 // Top Left
  }
]


