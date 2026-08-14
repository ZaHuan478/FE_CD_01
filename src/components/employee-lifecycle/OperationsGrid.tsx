import React from 'react'
import { Clock, FileEdit, UserSquare2, Award, GraduationCap, Target, HeartHandshake, Receipt, ArrowUpRight } from 'lucide-react'
import type { OperationModule } from '../../types/employee-lifecycle'

interface OperationsGridProps {
  modules: OperationModule[]
  onSelectModule: (id: string) => void
}

const defaultModules: OperationModule[] = [
  {
    id: 'CF-01',
    code: 'CF-01',
    title: 'Công & Phép',
    description: 'Chấm công tự động, đăng ký ca làm việc và quản lý nghỉ phép năm',
    iconName: 'Clock',
    category: 'Time & Attendance',
    inputs: ['Chấm công', 'Đơn xin nghỉ'],
    outputs: ['Bảng tổng hợp công']
  },
  {
    id: 'CF-02',
    code: 'CF-02',
    title: 'Điều chỉnh Hợp đồng',
    description: 'Tái ký hợp đồng, lập phụ lục điều chỉnh mức lương và điều khoản',
    iconName: 'FileEdit',
    category: 'Contract Admin',
    inputs: ['Yêu cầu tái ký', 'Phụ lục HĐ'],
    outputs: ['Hợp đồng mới']
  },
  {
    id: 'CF-03',
    code: 'CF-03',
    title: 'Biến động Nhân sự',
    description: 'Điều động nội bộ, bổ nhiệm chức vụ, luân chuyển phòng ban',
    iconName: 'UserSquare2',
    category: 'Movement',
    inputs: ['Tờ trình luân chuyển'],
    outputs: ['Quyết định điều động']
  },
  {
    id: 'CF-04',
    code: 'CF-04',
    title: 'Thành tích & Kỷ luật',
    description: 'Ghi nhận khen thưởng, vinh danh cá nhân và xử lý vi phạm kỷ luật',
    iconName: 'Award',
    category: 'Conduct & Rewards',
    inputs: ['Đề xuất khen thưởng'],
    outputs: ['Quyết định khen thưởng/kỷ luật']
  },
  {
    id: 'CF-05',
    code: 'CF-05',
    title: 'Đào tạo & Phát triển',
    description: 'Lập kế hoạch đào tạo, quản lý khóa học và theo dõi chứng chỉ',
    iconName: 'GraduationCap',
    category: 'Learning',
    inputs: ['Nhu cầu đào tạo'],
    outputs: ['Kết quả đánh giá khóa học']
  },
  {
    id: 'CF-06',
    code: 'CF-06',
    title: 'Đánh giá Hiệu suất',
    description: 'Thiết lập KPI/OKR hàng kỳ, theo dõi và đánh giá hoàn thành công việc',
    iconName: 'Target',
    category: 'Performance',
    inputs: ['Chỉ tiêu KPI'],
    outputs: ['Kết quả đánh giá kỳ']
  },
  {
    id: 'CF-07',
    code: 'CF-07',
    title: 'Phúc lợi & Y tế',
    description: 'Quản lý chính sách bảo hiểm tự nguyện, khám sức khỏe & quà lễ tết',
    iconName: 'HeartHandshake',
    category: 'Benefits',
    inputs: ['Danh sách đăng ký'],
    outputs: ['Chi phí phúc lợi']
  },
  {
    id: 'CF-08',
    code: 'CF-08',
    title: 'Công tác & Chi phí',
    description: 'Đăng ký lịch công tác, duyệt phụ cấp và thanh quyết toán công tác phí',
    iconName: 'Receipt',
    category: 'Travel & Expense',
    inputs: ['Lịch công tác'],
    outputs: ['Quyết toán chi phí']
  }
]

const getModuleIcon = (id: string) => {
  switch (id) {
    case 'CF-01': return <Clock className="w-5 h-5" />
    case 'CF-02': return <FileEdit className="w-5 h-5" />
    case 'CF-03': return <UserSquare2 className="w-5 h-5" />
    case 'CF-04': return <Award className="w-5 h-5" />
    case 'CF-05': return <GraduationCap className="w-5 h-5" />
    case 'CF-06': return <Target className="w-5 h-5" />
    case 'CF-07': return <HeartHandshake className="w-5 h-5" />
    case 'CF-08': return <Receipt className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

export const OperationsGrid: React.FC<OperationsGridProps> = ({
  modules = defaultModules,
  onSelectModule
}) => {
  const displayModules = modules.length >= 8 ? modules : defaultModules

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 transition-all duration-300 hover:shadow-md">
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-md border border-indigo-200/60">
              Layer 3 · Operations Grid
            </span>
            <span className="text-xs text-slate-500 font-medium">8 Module Nghiệp vụ Phát sinh</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            TẦNG 3: NGHIỆP VỤ PHÁT SINH XUYÊN SUỐT (OPERATIONS)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Các hoạt động nhân sự diễn ra định kỳ hoặc đột xuất trong quá trình làm việc của nhân viên
          </p>
        </div>
      </div>

      {/* Minimalist Grid 4x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayModules.slice(0, 8).map((mod) => {
          const icon = getModuleIcon(mod.id)
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              className="bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200/80 hover:border-blue-400 text-left hover:-translate-y-1 transition-all duration-200 hover:shadow-md flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-white group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 rounded-lg border border-slate-200/70 group-hover:border-blue-200 transition-colors">
                    {icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200/70 group-hover:bg-blue-600 text-slate-700 group-hover:text-white rounded transition-colors">
                      {mod.code}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>{mod.category || 'Operation'}</span>
                <span className="font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Chi tiết →</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
