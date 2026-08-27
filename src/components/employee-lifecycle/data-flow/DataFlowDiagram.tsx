import React, { useState } from 'react'
import {
  Target,
  Users,
  Clock,
  DollarSign,
  Shield,
  Receipt,
  ArrowRight,
  Zap,
  RefreshCw,
  CalendarClock,
  Info
} from 'lucide-react'
import { useLanguage } from '../../../context/LanguageContext'

// ============================================================================
// DATA FLOW CONNECTION DEFINITIONS
// ============================================================================
export interface DataFlowConnection {
  from: string
  to: string
  label: string
  labelEn: string
  dataItems: string[]
  dataItemsEn: string[]
  frequency: 'once' | 'ongoing' | 'monthly'
}

export const DATA_FLOW_CONNECTIONS: DataFlowConnection[] = [
  {
    from: 'ats',
    to: 'emp',
    label: 'Hồ sơ trúng tuyển & Offer đã ký số',
    labelEn: 'Accepted Offer & Candidate Dossier',
    dataItems: ['Họ tên, Ngày sinh, CCCD', 'CV & Bằng cấp gốc', 'Chức danh trúng tuyển (MD-06)', 'Mức lương P1 (MD-07)', 'Ngày nhận việc (Join Date)'],
    dataItemsEn: ['Full name, DOB, National ID', 'CV & Degree scans', 'Hired job title (MD-06)', 'P1 Salary (MD-07)', 'Onboarding date'],
    frequency: 'once'
  },
  {
    from: 'emp',
    to: 'att',
    label: 'Mã NV & Phân ca kíp',
    labelEn: 'Employee ID & Shift Assignment',
    dataItems: ['Mã nhân viên (EMP ID)', 'Phòng ban trực thuộc (MD-05)', 'Ca làm việc (MD-08)', 'Thiết bị chấm công (Vân tay / Face ID)'],
    dataItemsEn: ['Employee ID', 'Department (MD-05)', 'Work shift (MD-08)', 'Biometric device enrollment'],
    frequency: 'once'
  },
  {
    from: 'emp',
    to: 'pay',
    label: 'HĐLĐ & Bậc lương P1',
    labelEn: 'Contract & Pay Scale P1',
    dataItems: ['Hợp đồng lao động (Loại & Thời hạn)', 'Mức lương cơ bản P1 (MD-07)', '20 Khoản phụ cấp (MD-ALLOWANCE)', 'Số tài khoản ngân hàng nhận lương'],
    dataItemsEn: ['Labor contract (Type & Duration)', 'Base salary P1 (MD-07)', '20 Allowance items', 'Bank account for payroll'],
    frequency: 'ongoing'
  },
  {
    from: 'emp',
    to: 'ins',
    label: 'Báo tăng lao động & Mức đóng BHXH',
    labelEn: 'New hire registration & Insurance base',
    dataItems: ['Mã NV & Thông tin nhân thân', 'Mức lương đóng BHXH', 'Bệnh viện KCB ban đầu (MD-09)', 'Số Sổ BHXH (nếu đã có)'],
    dataItemsEn: ['Employee ID & Personal info', 'Insurance salary base', 'Designated hospital (MD-09)', 'Existing SI book number'],
    frequency: 'once'
  },
  {
    from: 'emp',
    to: 'tax',
    label: 'MST cá nhân & Người phụ thuộc',
    labelEn: 'Personal Tax ID & Dependants',
    dataItems: ['Mã số thuế cá nhân', 'Hồ sơ người phụ thuộc (MD-03)', 'Giấy khai sinh con / Giấy kết hôn', 'Mức giảm trừ gia cảnh (11tr + 4.4tr/người)'],
    dataItemsEn: ['Personal tax ID', 'Dependant records (MD-03)', 'Birth/Marriage certificates', 'Deduction: 11M + 4.4M/person'],
    frequency: 'ongoing'
  },
  {
    from: 'att',
    to: 'pay',
    label: 'Bảng công chốt sổ cuối tháng',
    labelEn: 'Monthly timesheet closing',
    dataItems: ['Số ngày công thực tế', 'Giờ tăng ca OT (150% / 200% / 300%)', 'Số ngày nghỉ phép hưởng lương', 'Số lần đi trễ / về sớm / vắng KL'],
    dataItemsEn: ['Actual working days', 'OT hours (150% / 200% / 300%)', 'Paid leave days', 'Late / Early / Absent counts'],
    frequency: 'monthly'
  },
  {
    from: 'ins',
    to: 'pay',
    label: 'Trích nộp BHXH 10.5% & Chi trả chế độ',
    labelEn: 'SI deduction 10.5% & Benefit payments',
    dataItems: ['Trích NLĐ: 10.5% (8% BHXH + 1.5% BHYT + 1% BHTN)', 'Chi phí DN: 21.5%', 'Chi trả ốm đau / thai sản (C70a)'],
    dataItemsEn: ['Employee: 10.5% (8% SI + 1.5% HI + 1% UI)', 'Employer: 21.5%', 'Sickness / Maternity benefits (C70a)'],
    frequency: 'monthly'
  },
  {
    from: 'pay',
    to: 'tax',
    label: 'Thu nhập chịu thuế & Khấu trừ TNCN',
    labelEn: 'Taxable income & PIT withholding',
    dataItems: ['Tổng thu nhập chịu thuế (Gross)', 'Trừ: Giảm trừ bản thân 11tr', 'Trừ: Giảm trừ người phụ thuộc', 'Áp biểu thuế lũy tiến 5% - 35%'],
    dataItemsEn: ['Gross taxable income', 'Less: Personal deduction 11M', 'Less: Dependant deductions', 'Progressive tax 5% - 35%'],
    frequency: 'monthly'
  }
]

// ============================================================================
// MODULE NODE DEFINITIONS
// ============================================================================
export interface ModuleNode {
  id: string
  name: string
  nameEn: string
  shortName: string
  icon: React.ReactNode
  color: string
  sopCount: number
  role: string
  roleEn: string
}

export const MODULE_NODES: ModuleNode[] = [
  {
    id: 'ats',
    name: 'Tuyển Dụng',
    nameEn: 'Recruitment',
    shortName: 'ATS',
    icon: <Target className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 5,
    role: '🚪 Cổng đầu vào duy nhất',
    roleEn: '🚪 Single entry gate'
  },
  {
    id: 'emp',
    name: 'Nhân Sự',
    nameEn: 'Personnel',
    shortName: 'Core EMP',
    icon: <Users className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 15,
    role: '🏛️ Trung tâm dữ liệu gốc (Hub)',
    roleEn: '🏛️ Master data hub (SSOT)'
  },
  {
    id: 'att',
    name: 'Chấm Công',
    nameEn: 'Attendance',
    shortName: 'ATT',
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 15,
    role: '⏱️ Đo lường thời gian thực tế',
    roleEn: '⏱️ Time measurement engine'
  },
  {
    id: 'pay',
    name: 'Tiền Lương',
    nameEn: 'Payroll',
    shortName: 'PAY',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 4,
    role: '💰 Hub tổng hợp tính lương',
    roleEn: '💰 Payroll aggregation hub'
  },
  {
    id: 'ins',
    name: 'Bảo Hiểm',
    nameEn: 'Insurance',
    shortName: 'INS',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 8,
    role: '🛡️ Nghĩa vụ pháp lý BHXH/BHYT',
    roleEn: '🛡️ Legal SI/HI obligations'
  },
  {
    id: 'tax',
    name: 'Thuế TNCN',
    nameEn: 'Personal Tax',
    shortName: 'TAX',
    icon: <Receipt className="w-4 h-4" />,
    color: 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950/60 dark:text-sky-300',
    sopCount: 3,
    role: '🧾 Khấu trừ thuế lũy tiến',
    roleEn: '🧾 Progressive tax withholding'
  }
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const DataFlowDiagram: React.FC = () => {
  const { language } = useLanguage()
  const [selectedConnection, setSelectedConnection] = useState<DataFlowConnection | null>(null)
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  const getNode = (id: string) => MODULE_NODES.find((n) => n.id === id)!

  const getFrequencyBadge = (freq: 'once' | 'ongoing' | 'monthly') => {
    switch (freq) {
      case 'once':
        return { icon: <Zap className="w-3 h-3" />, label: language === 'vi' ? '1 LẦN' : 'ONE-TIME' }
      case 'ongoing':
        return { icon: <RefreshCw className="w-3 h-3" />, label: language === 'vi' ? 'XUYÊN SUỐT' : 'ONGOING' }
      case 'monthly':
        return { icon: <CalendarClock className="w-3 h-3" />, label: language === 'vi' ? 'HÀNG THÁNG' : 'MONTHLY' }
    }
  }

  // Highlight connections related to a hovered module
  const isConnectionHighlighted = (conn: DataFlowConnection) => {
    if (!hoveredModule) return true
    return conn.from === hoveredModule || conn.to === hoveredModule
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* TITLE & LEGEND */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'vi' ? '🌊 Sơ Đồ Dòng Chảy Dữ Liệu Giữa 6 Phân Hệ' : '🌊 Data Flow Diagram Across 6 Subsystems'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'vi'
              ? 'Bấm vào đường kết nối để xem chi tiết. Di chuột vào module để lọc các luồng liên quan.'
              : 'Click any connection to inspect details. Hover a module to filter related flows.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Zap className="w-3 h-3" /> {language === 'vi' ? '1 Lần' : 'One-time'}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <RefreshCw className="w-3 h-3" /> {language === 'vi' ? 'Xuyên suốt' : 'Ongoing'}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <CalendarClock className="w-3 h-3" /> {language === 'vi' ? 'Hàng tháng' : 'Monthly'}
          </span>
        </div>
      </div>

      {/* QUICK GUIDE */}
      <div className="p-3.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
        <h5 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> {language === 'vi' ? 'Hướng dẫn đọc sơ đồ (Dành cho người không chuyên)' : 'How to read this diagram (For beginners)'}
        </h5>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4.5 h-4.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-[9px] mt-0.5">1</span>
            <span><strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Bắt đầu từ trái sang phải:' : 'Start from left to right:'}</strong> {language === 'vi' ? 'Toàn bộ dữ liệu của 1 nhân sự đều bắt nguồn từ cổng duy nhất là Tuyển Dụng (ATS).' : 'All employee data originates from the single entry gate Recruitment (ATS).'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4.5 h-4.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[9px] mt-0.5">2</span>
            <span><strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Trạm trung chuyển (Hub):' : 'The Hub:'}</strong> {language === 'vi' ? 'Phân hệ Nhân Sự (Core EMP) nhận hồ sơ từ ATS, cấp Mã Nhân Viên, rồi tự động chia phát dữ liệu xuống 4 phân hệ còn lại mà không cần nhập tay.' : 'Personnel (Core EMP) receives dossier from ATS, creates EMP ID, then auto-distributes data to the other 4 subsystems.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-4.5 h-4.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[9px] mt-0.5">3</span>
            <span><strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Chu trình cuối tháng:' : 'End-of-month cycle:'}</strong> {language === 'vi' ? 'Dữ liệu thời gian làm việc (Chấm công) và Mức đóng (Bảo hiểm) sẽ được tự động đẩy về cục bộ Tiền Lương để tính toán, sau đó xuất ra số liệu đóng Thuế TNCN.' : 'Time data (Attendance) and Rates (Insurance) are pushed to Payroll for calculation, which then outputs Tax data.'}</span>
          </li>
        </ul>
      </div>

      {/* ================================================================= */}
      {/* VISUAL FLOW LAYOUT                                                */}
      {/* ================================================================= */}
      <div className="space-y-4">

        {/* ROW 1: ATS → EMP (Single entry gate) */}
        <div className="flex items-center gap-3">
          {/* ATS Node */}
          <div
            className={`shrink-0 w-[200px] p-3.5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${hoveredModule === 'ats' ? 'scale-105 shadow-md border-slate-400 dark:border-slate-500' : 'border-slate-200 dark:border-slate-800'}`}
            onMouseEnter={() => setHoveredModule('ats')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${getNode('ats').color}`}>
                {getNode('ats').icon}
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500">{getNode('ats').shortName}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{language === 'vi' ? getNode('ats').name : getNode('ats').nameEn}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400">{language === 'vi' ? getNode('ats').role : getNode('ats').roleEn}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{getNode('ats').sopCount} SOPs</div>
          </div>

          {/* Arrow ATS → EMP */}
          <button
            type="button"
            onClick={() => setSelectedConnection(DATA_FLOW_CONNECTIONS[0])}
            className={`flex-1 min-w-0 p-2.5 rounded-xl border border-dashed transition-all cursor-pointer group ${
              selectedConnection === DATA_FLOW_CONNECTIONS[0]
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                : isConnectionHighlighted(DATA_FLOW_CONNECTIONS[0])
                ? 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                : 'border-slate-200 dark:border-slate-800 opacity-30'
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <ArrowRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${selectedConnection === DATA_FLOW_CONNECTIONS[0] ? 'text-blue-500' : 'text-slate-400'}`} />
              <span className={`text-[11px] font-bold truncate ${selectedConnection === DATA_FLOW_CONNECTIONS[0] ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {language === 'vi' ? 'Hồ sơ trúng tuyển & Offer ký số' : 'Accepted Offer & Dossier'}
              </span>
              <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Zap className="w-2.5 h-2.5" /> {language === 'vi' ? '1 LẦN' : 'ONCE'}
              </span>
            </div>
          </button>

          {/* EMP Node (Hub) */}
          <div
            className={`shrink-0 w-[220px] p-3.5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${hoveredModule === 'emp' ? 'scale-105 shadow-md border-slate-400 dark:border-slate-500' : 'border-slate-200 dark:border-slate-800'}`}
            onMouseEnter={() => setHoveredModule('emp')}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${getNode('emp').color}`}>
                {getNode('emp').icon}
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-500">{getNode('emp').shortName}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{language === 'vi' ? getNode('emp').name : getNode('emp').nameEn}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400">{language === 'vi' ? getNode('emp').role : getNode('emp').roleEn}</div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{getNode('emp').sopCount} SOPs</div>
          </div>
        </div>

        {/* ROW 2: EMP distributes to ATT / PAY / INS / TAX (4 outputs) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pl-[215px]">
          {/* Each arrow from EMP to child module */}
          {[
            { connIdx: 1, node: getNode('att') },
            { connIdx: 2, node: getNode('pay') },
            { connIdx: 3, node: getNode('ins') },
            { connIdx: 4, node: getNode('tax') }
          ].map(({ connIdx, node }) => {
            const conn = DATA_FLOW_CONNECTIONS[connIdx]
            const freqBadge = getFrequencyBadge(conn.frequency)
            const isSelected = selectedConnection === conn
            return (
              <div key={node.id} className="space-y-2">
                {/* Arrow label */}
                <button
                  type="button"
                  onClick={() => setSelectedConnection(conn)}
                  className={`w-full p-2 rounded-xl border border-dashed transition-all cursor-pointer group text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : isConnectionHighlighted(conn)
                      ? 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                      : 'border-slate-200 dark:border-slate-800 opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-bold truncate ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {language === 'vi' ? conn.label : conn.labelEn}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {freqBadge.icon} {freqBadge.label}
                    </span>
                  </div>
                </button>

                {/* Target module node */}
                <div
                  className={`p-3 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${
                    hoveredModule === node.id ? 'scale-105 shadow-md border-slate-400 dark:border-slate-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onMouseEnter={() => setHoveredModule(node.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${node.color}`}>
                      {node.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-500">{node.shortName}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{language === 'vi' ? node.name : node.nameEn}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">{language === 'vi' ? node.role : node.roleEn}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{node.sopCount} SOPs</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ROW 3: Cross-module flows: ATT→PAY, INS→PAY, PAY→TAX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-[215px]">
          {[
            { connIdx: 5, fromNode: getNode('att'), toNode: getNode('pay') },
            { connIdx: 6, fromNode: getNode('ins'), toNode: getNode('pay') },
            { connIdx: 7, fromNode: getNode('pay'), toNode: getNode('tax') }
          ].map(({ connIdx, fromNode, toNode }) => {
            const conn = DATA_FLOW_CONNECTIONS[connIdx]
            const freqBadge = getFrequencyBadge(conn.frequency)
            const isSelected = selectedConnection === conn
            return (
              <button
                key={connIdx}
                type="button"
                onClick={() => setSelectedConnection(conn)}
                className={`p-3 rounded-2xl border border-dashed transition-all cursor-pointer text-left group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                    : isConnectionHighlighted(conn)
                    ? 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                    : 'border-slate-200 dark:border-slate-800 opacity-30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{fromNode.shortName}</span>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-mono font-bold text-slate-500">{toNode.shortName}</span>
                  <span className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {freqBadge.icon} {freqBadge.label}
                  </span>
                </div>
                <p className={`text-[11px] font-bold leading-tight ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {language === 'vi' ? conn.label : conn.labelEn}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* CONNECTION DETAIL INSPECTOR                                        */}
      {/* ================================================================= */}
      {selectedConnection && (
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 space-y-3 animate-fadeIn mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Info className="w-4.5 h-4.5 text-blue-500 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-slate-500">{getNode(selectedConnection.from).shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-mono font-bold text-slate-500">{getNode(selectedConnection.to).shortName}</span>
                  {(() => {
                    const badge = getFrequencyBadge(selectedConnection.frequency)
                    return (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                        {badge.icon} {badge.label}
                      </span>
                    )
                  })()}
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {language === 'vi' ? selectedConnection.label : selectedConnection.labelEn}
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedConnection(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {(language === 'vi' ? selectedConnection.dataItems : selectedConnection.dataItemsEn).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <ArrowRight className="w-3 h-3 text-blue-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
