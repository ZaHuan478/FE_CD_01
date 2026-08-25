import type { ModuleInfo, ModuleFilterOption } from '../types'

export const STEP_MODULE_MAP: Record<string, ModuleInfo> = {
  'LIFE-00': {
    name: 'Hoạch định định biên',
    nameEn: 'Workforce Planning',
    code: 'HCP',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Xác định số lượng nhân sự, ngân sách quỹ lương và hạn mức tuyển dụng theo từng phòng ban trước khi phát sinh nhu cầu tuyển dụng mới.',
    descEn: 'Plan headcount, personnel budget, and hiring limits for each department.',
    coModules: [
      { name: 'Cơ cấu tổ chức & Phòng ban', nameEn: 'Org Structure & Departments', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Quản lý quỹ lương & Chi phí', nameEn: 'Payroll & Cost Planning', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Tuyển dụng nhân sự', nameEn: 'Recruitment Module', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-01': {
    name: 'Tiếp nhận nhân viên mới',
    nameEn: 'Recruitment & Onboarding',
    code: 'REC',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Tiếp nhận ứng viên trúng tuyển, khởi tạo hồ sơ nhân sự, cấp mã nhân viên và chuẩn bị cơ sở vật chất, tài khoản làm việc.',
    descEn: 'Onboard new hire, issue employee code, and prepare workplace equipment & accounts.',
    coModules: [
      { name: 'Tuyển dụng nhân sự', nameEn: 'Recruitment System', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Hồ sơ nhân sự', nameEn: 'Personnel Core', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Hệ thống IT & Hành chính', nameEn: 'IT & Administration', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-02': {
    name: 'Hồ sơ nhân viên',
    nameEn: 'Personnel Core Profile',
    code: 'EMP',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Thu thập và số hóa đầy đủ thông tin lý lịch cá nhân, thông tin liên hệ, người phụ thuộc, bằng cấp chứng chỉ và giấy tờ pháp lý.',
    descEn: 'Collect and digitize personal records, contact info, dependants, and legal documents.',
    coModules: [
      { name: 'Hồ sơ nhân sự', nameEn: 'Personnel Core', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Khai báo thuế & Giảm trừ', nameEn: 'Tax Declaration', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Lưu trữ tài liệu số', nameEn: 'Digital Document Archive', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-03': {
    name: 'Bố trí công tác & Vị trí',
    nameEn: 'Position & Work Assignment',
    code: 'ORG',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Gán nhân viên vào vị trí công tác cụ thể trong sơ đồ tổ chức, xác định phòng ban, chức vụ quản lý, tuyến báo cáo và địa điểm làm việc.',
    descEn: 'Assign employee to position in org chart, reporting line, and workplace location.',
    coModules: [
      { name: 'Cơ cấu tổ chức (Org Chart)', nameEn: 'Org Chart', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Phân hệ Chấm công', nameEn: 'Attendance Module', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Phân hệ Tiền lương & C&B', nameEn: 'Payroll & C&B', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-04': {
    name: 'Hợp đồng lao động',
    nameEn: 'Labor Contract',
    code: 'CON',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Tạo lập, giao kết hợp đồng lao động điện tử hoặc văn bản, quản lý thời hạn và theo dõi các phụ lục hợp đồng liên quan.',
    descEn: 'Create, sign, and manage employment contracts, terms, and appendices.',
    coModules: [
      { name: 'Quản lý hợp đồng & Pháp lý', nameEn: 'Contract & Legal', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Bảo hiểm xã hội', nameEn: 'Social Insurance', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Chữ ký số & Ký duyệt điện tử', nameEn: 'E-Signature', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-05': {
    name: 'Lương & Chế độ phúc lợi',
    nameEn: 'Payroll & Benefits',
    code: 'C&B',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Cấu hình ngạch bậc lương, các khoản phụ cấp theo chức danh, thông tin tài khoản ngân hàng và chính sách bảo hiểm bắt buộc.',
    descEn: 'Configure salary scale, allowances, bank account, and insurance policy.',
    coModules: [
      { name: 'Phân hệ Tiền lương & Thu nhập', nameEn: 'Payroll Engine', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Hồ sơ Bảo hiểm xã hội', nameEn: 'Social Insurance System', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Hệ thống Ngân hàng chi trả', nameEn: 'Bank Payment System', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-06': {
    name: 'Quá trình làm việc & Biến động',
    nameEn: 'Work History & Movement',
    code: 'ATT',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Ghi nhận xuyên suốt quá trình công tác, theo dõi điều chuyển nội bộ, thăng tiến, tăng lương, ngày công, khen thưởng và kỷ luật.',
    descEn: 'Record entire service history, promotions, transfers, pay raises, and performance.',
    coModules: [
      { name: 'Phân hệ Chấm công & Nghỉ phép', nameEn: 'Time & Attendance', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Đánh giá hiệu suất & Khen thưởng', nameEn: 'Performance & Rewards', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Báo cáo quản trị nhân sự', nameEn: 'HR Management Reports', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  },
  'LIFE-07': {
    name: 'Nghỉ việc, bàn giao & Đóng hồ sơ',
    nameEn: 'Offboarding & Clearance',
    code: 'OFF',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/90',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Tiếp nhận đơn thôi việc, theo dõi bàn giao công việc & tài sản, thực hiện quyết toán trợ cấp thôi việc, báo giảm BHXH và lưu trữ hồ sơ.',
    descEn: 'Process resignation, task/asset clearance, severance settlement, and record closure.',
    coModules: [
      { name: 'Quyết toán lương & Trợ cấp thôi việc', nameEn: 'Final Settlement', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Bàn giao tài sản & Thu hồi quyền', nameEn: 'Asset & Access Clearance', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' },
      { name: 'Báo giảm Bảo hiểm xã hội', nameEn: 'Insurance Deregistration', bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300', color: 'border-slate-200 dark:border-slate-700' }
    ]
  }
}

export const MODULE_FILTER_OPTIONS: ModuleFilterOption[] = [
  { id: 'ALL', name: 'Tất cả phân hệ', nameEn: 'All HR Modules', code: 'ALL' },
  { id: 'HCP', name: 'Hoạch định định biên', nameEn: 'Workforce Planning', code: 'HCP', stepIds: ['LIFE-00'] },
  { id: 'REC', name: 'Tuyển dụng & Tiếp nhận', nameEn: 'Recruitment', code: 'REC', stepIds: ['LIFE-00', 'LIFE-01'] },
  { id: 'EMP', name: 'Hồ sơ nhân sự', nameEn: 'Personnel Core', code: 'EMP', stepIds: ['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03'] },
  { id: 'CON', name: 'Hợp đồng lao động', nameEn: 'Labor Contract', code: 'CON', stepIds: ['LIFE-04'] },
  { id: 'C&B', name: 'Lương & Chế độ phúc lợi', nameEn: 'Payroll & Benefits', code: 'C&B', stepIds: ['LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'] },
  { id: 'ATT', name: 'Chấm công & Biến động', nameEn: 'Attendance & Movement', code: 'ATT', stepIds: ['LIFE-03', 'LIFE-06'] },
  { id: 'OFF', name: 'Nghỉ việc & Đóng hồ sơ', nameEn: 'Offboarding', code: 'OFF', stepIds: ['LIFE-07'] }
]

