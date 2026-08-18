import React from 'react'
import { Users, Clock, CircleDollarSign, Receipt, ShieldCheck } from 'lucide-react'

export interface ModuleEcosystemItem {
  id: string
  code: string
  name: string
  sopCount: string
  percentage: string
  subFeatures: string[]
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
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Hồ sơ sơ yếu lý lịch nhân viên', 'Quản lý thông tin hợp đồng & hồ sơ', 'Báo cáo biến động nhân sự'],
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
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Chấm công tự động (Vân tay/GPS/Khuôn mặt)', 'Quản lý ca làm việc & đăng ký nghỉ phép', 'Bảng tổng hợp công hàng tháng'],
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
    sopCount: '4/4 SOPs',
    percentage: '100%',
    subFeatures: ['Cấu hình thang bảng lương & phụ cấp', 'Tính lương tự động theo công & doanh số', 'Chuyển khoản & phiếu lương điện tử'],
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
    sopCount: '3/3 SOPs',
    percentage: '100%',
    subFeatures: ['Đăng ký mã số thuế & người phụ thuộc', 'Tính giảm trừ & Kê khai thuế TNCN', 'Quyết toán thuế TNCN cuối năm'],
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
    sopCount: '8/8 SOPs',
    percentage: '100%',
    subFeatures: ['Thiết lập đối tượng & tỷ lệ đóng BHXH', 'Kê khai BHXH điện tử (Báo tăng/giảm)', 'Giải quyết chế độ ốm đau/thai sản/dưỡng sức'],
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
