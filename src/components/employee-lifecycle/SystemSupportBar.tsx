import React from 'react'
import { Lock, ShieldCheck, Bell, FileSpreadsheet, BarChart3, Settings } from 'lucide-react'
import type { SystemSupportUtility } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'

interface SystemSupportBarProps {
  onSelectUtility?: (id: string) => void
}

const getUtilityIcon = (id: string) => {
  switch (id) {
    case 'SUPPORT-01': return <Lock className="w-4 h-4" />
    case 'SUPPORT-02': return <ShieldCheck className="w-4 h-4" />
    case 'SUPPORT-03': return <Bell className="w-4 h-4" />
    case 'SUPPORT-04': return <FileSpreadsheet className="w-4 h-4" />
    case 'SUPPORT-05': return <BarChart3 className="w-4 h-4" />
    default: return <Settings className="w-4 h-4" />
  }
}

export const SystemSupportBar: React.FC<SystemSupportBarProps> = ({
  onSelectUtility
}) => {
  const { language, t } = useLanguage()

  const defaultUtilities: SystemSupportUtility[] = [
    {
      id: 'SUPPORT-01',
      code: 'SUP-01',
      title: language === 'vi' ? 'Phân quyền người dùng' : 'User Access Control',
      subtitle: 'RBAC & Role Mapping',
      iconName: 'Lock',
      description: 'Kiểm soát quyền truy cập chi tiết từng trường dữ liệu & chức năng',
      features: ['Ma trận phân quyền', 'Phân nhóm role', 'Bảo mật dữ liệu']
    },
    {
      id: 'SUPPORT-02',
      code: 'SUP-02',
      title: language === 'vi' ? 'Phê duyệt nghiệp vụ' : 'Workflow Approval',
      subtitle: 'Multi-level Workflow',
      iconName: 'ShieldCheck',
      description: 'Luồng phê duyệt nhiều cấp cho hợp đồng, lương & biến động',
      features: ['Duyệt song song', 'Duyệt nối tiếp', 'Ủy quyền phê duyệt']
    },
    {
      id: 'SUPPORT-03',
      code: 'SUP-03',
      title: language === 'vi' ? 'Cảnh báo & Nhắc việc' : 'Alerts & Reminders',
      subtitle: 'Automated Alerts',
      iconName: 'Bell',
      description: 'Cảnh báo hết hạn hợp đồng, thời hạn thử việc & sinh nhật nhân viên',
      features: ['Thông báo Email', 'In-app Alert', 'Lịch nhắc tự động']
    },
    {
      id: 'SUPPORT-04',
      code: 'SUP-04',
      title: language === 'vi' ? 'Tra cứu & Import' : 'Search & Bulk Import',
      subtitle: 'Bulk Data Tools',
      iconName: 'FileSpreadsheet',
      description: 'Tìm kiếm nhân viên nâng cao, import/export dữ liệu Excel hàng loạt',
      features: ['Smart Search', 'Excel Mapping', 'Kiểm tra trùng lặp']
    },
    {
      id: 'SUPPORT-05',
      code: 'SUP-05',
      title: language === 'vi' ? 'Báo cáo & Audit Log' : 'Reports & Audit Logs',
      subtitle: 'Analytics & Audit',
      iconName: 'BarChart3',
      description: 'Báo cáo quản trị nhân sự tổng hợp & vết lịch sử thay đổi hệ thống',
      features: ['Báo cáo biến động', 'Nhật ký truy cập', 'Vết lịch sử dữ liệu']
    }
  ]

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 leading-snug">
              {t('support.title', 'THANH HỖ TRỢ XUYÊN SUỐT HỆ THỐNG (SYSTEM SUPPORT BAR)')}
            </h3>
            <span className="text-[11px] text-slate-400 leading-tight block">
              {language === 'vi' ? '5 Tiện ích quản trị dùng chung áp dụng toàn bộ quy trình Lifecycle' : '5 Shared governance utilities across entire Lifecycle'}
            </span>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] font-mono text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-900 shrink-0 self-start sm:self-center">
          Enterprise Shared Services
        </span>
      </div>


      {/* 5 Columns Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {defaultUtilities.map((util) => {
          const icon = getUtilityIcon(util.id)
          return (
            <button
              key={util.id}
              type="button"
              onClick={() => onSelectUtility?.(util.id)}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="p-2 bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white rounded-lg border border-slate-700 group-hover:border-blue-500 transition-colors shrink-0">
                {icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors truncate">
                  {util.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {util.subtitle}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

