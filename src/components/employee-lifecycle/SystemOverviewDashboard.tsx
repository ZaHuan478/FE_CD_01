import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  Database,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
  PieChart,
  ChevronDown,
  ChevronUp,
  Workflow,
  X
} from 'lucide-react'
import { RadialEcosystemChart } from './RadialEcosystemChart'
import { SubsystemMatrixView } from './matrix/SubsystemMatrixView'
import { DataFlowDiagram } from './data-flow/DataFlowDiagram'
import { useLanguage } from '../../context/LanguageContext'

export const SystemOverviewDashboard: React.FC = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [coverageViewMode, setCoverageViewMode] = useState<'wheel' | 'matrix' | 'bar' | 'flow'>('wheel')
  const [isCoverageExpanded, setIsCoverageExpanded] = useState<boolean>(true)
  const [activeModal, setActiveModal] = useState<'lifecycle' | 'modules' | 'sops' | null>(null)

  const navigateToTab = (tab: 'lifecycle' | 'masterdata' | 'reports', hash?: string) => {
    setActiveModal(null)
    navigate(`/employee-lifecycle?tab=${tab}${hash ? `#${hash}` : ''}`)
    // Need a tiny delay for React Router to render the tab before scrolling to hash if present
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-6">

      {/* TOP KPI STATS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* METRIC 1: PIPELINE STAGES */}
        <div
          onClick={() => navigateToTab('lifecycle', 'layer-2-lifecycle')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'VÒNG ĐỜI NHÂN SỰ' : 'EMPLOYEE LIFECYCLE'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">7/7</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 100% SOP
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {language === 'vi' ? 'Xem chi tiết Tầng 2 Vòng đời' : 'View Layer 2 Lifecycle Details'}
          </p>
        </div>

        {/* METRIC 2: MASTER DATA CATALOGS */}
        <div
          onClick={() => navigateToTab('masterdata', 'layer-1-master-data')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'MASTER DATA TẦNG 1' : 'LAYER 1 MASTER DATA'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">10</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              G01 - G08 Groups
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {language === 'vi' ? 'Xem chi tiết Tầng 1 Master Data' : 'View Layer 1 Master Data Details'}
          </p>
        </div>

        {/* METRIC 3: OPERATIONAL GRID MODULES */}
        <div
          onClick={() => navigateToTab('lifecycle', 'layer-3-operations')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'LƯỚI VẬN HÀNH TẦNG 3' : 'LAYER 3 OPERATIONAL GRID'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">8</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {language === 'vi' ? 'Modules Nghiệp vụ' : 'Business Modules'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {language === 'vi' ? 'Xem chi tiết Lưới vận hành Tầng 3' : 'View Layer 3 Operational Grid'}
          </p>
        </div>

        {/* METRIC 4: INTEGRATED SOPS & BUSINESS RULES */}
        <div
          onClick={() => {
            const el = document.getElementById('coverage-wheel')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SOP SPECS & RULES
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">45</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              SOPs (EMP/ATT/INS/PAY/TAX)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {language === 'vi' ? '20 Quy tắc Nghiệp vụ (BR) & 26 Cảnh báo tự động' : '20 Business Rules (BR) & 26 Automated Alerts'}
          </p>
        </div>
      </div>

      {/* MODULE SOP COVERAGE: TOGGLEABLE RADIAL ECOSYSTEM WHEEL VS BAR CHART */}
      <div id="coverage-wheel" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              {language === 'vi'
                ? 'TỶ LỆ PHỦ ĐẶC TẢ SOP THEO CÁC PHÂN HỆ DOANH NGHIỆP'
                : 'SOP SPECIFICATION COVERAGE BY BUSINESS MODULES'}
            </span>
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCoverageViewMode('wheel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${coverageViewMode === 'wheel'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Sơ đồ Vòng tròn 6 Phân hệ' : '6-Module Radial Wheel'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCoverageViewMode('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${coverageViewMode === 'matrix'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Ma Trận Tương Quan I/O' : 'I/O Matrix'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCoverageViewMode('flow')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${coverageViewMode === 'flow'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Dòng Chảy Dữ Liệu' : 'Data Flow'}</span>
              </button>
            </div>

            <span className="hidden md:flex text-xs font-bold text-emerald-600 dark:text-emerald-400 items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 50/50 SOPs Specs Integrated
            </span>

            {/* Collapse / Expand Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsCoverageExpanded(!isCoverageExpanded)}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              title={isCoverageExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
            >
              <span>{isCoverageExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
              {isCoverageExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* EXPANDABLE BODY CONTENT */}
        {isCoverageExpanded && (
          <div className="animate-fadeIn space-y-4">
            {/* VIEW MODE 1: RADIAL ECOSYSTEM WHEEL */}
            {coverageViewMode === 'wheel' && (
              <RadialEcosystemChart />
            )}

            {/* VIEW MODE 2: INTERACTIVE INPUT-OUTPUT MATRIX VIEW */}
            {coverageViewMode === 'matrix' && (
              <SubsystemMatrixView />
            )}

            {/* VIEW MODE 4: DATA FLOW DIAGRAM */}
            {coverageViewMode === 'flow' && (
              <DataFlowDiagram />
            )}
          </div>
        )}

      </div>

      {/* MODAL OVERLAYS FOR METRIC CARDS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase">
                {activeModal === 'lifecycle' && (language === 'vi' ? '7 Bước Vòng Đời Nhân Sự' : '7 Steps of Employee Lifecycle')}
                {activeModal === 'modules' && (language === 'vi' ? '8 Modules Nghiệp Vụ' : '8 Operational Modules')}
                {activeModal === 'sops' && (language === 'vi' ? 'Tổng Hợp 45 Quy Trình (SOPs)' : '45 Integrated SOPs')}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto">

              {/* CONTENT 1: LIFECYCLE */}
              {activeModal === 'lifecycle' && (
                <ul className="space-y-2">
                  {[
                    { id: 1, name: 'Tuyển dụng', nameEn: 'Recruitment' },
                    { id: 2, name: 'Tiếp nhận & Hội nhập', nameEn: 'Onboarding' },
                    { id: 3, name: 'Quản lý Hồ sơ & Hợp đồng', nameEn: 'Profile & Contract' },
                    { id: 4, name: 'Đào tạo & Đánh giá', nameEn: 'Training & Evaluation' },
                    { id: 5, name: 'Lương, Thưởng & Phúc lợi', nameEn: 'C&B / Payroll' },
                    { id: 6, name: 'Khen thưởng & Kỷ luật', nameEn: 'Rewards & Discipline' },
                    { id: 7, name: 'Thuyên chuyển & Thôi việc', nameEn: 'Movements & Offboarding' }
                  ].map((step) => (
                    <li key={step.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {step.id}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {language === 'vi' ? step.name : step.nameEn}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CONTENT 2: MODULES */}
              {activeModal === 'modules' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'ATS', name: 'Tuyển dụng', color: 'purple' },
                    { id: 'EMP', name: 'Hồ sơ nhân sự', color: 'blue' },
                    { id: 'ATT', name: 'Chấm công', color: 'emerald' },
                    { id: 'PAY', name: 'Tiền lương', color: 'amber' },
                    { id: 'INS', name: 'Bảo hiểm', color: 'pink' },
                    { id: 'TAX', name: 'Thuế TNCN', color: 'indigo' },
                    { id: 'LMS', name: 'Đào tạo', color: 'cyan' },
                    { id: 'PERF', name: 'Đánh giá KPI/OKR', color: 'rose' }
                  ].map((mod) => (
                    <div key={mod.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                      <span className={`text-[10px] font-mono font-extrabold text-${mod.color}-500`}>{mod.id}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{mod.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CONTENT 3: SOPs */}
              {activeModal === 'sops' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl mb-4">
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {language === 'vi'
                        ? 'Hệ thống đã số hóa thành công 45 quy trình chuẩn (Standard Operating Procedures) bao phủ toàn bộ 5 phân hệ Core HR, kèm theo các Luật định (Business Rules) tự động cảnh báo.'
                        : 'System has successfully digitized 45 Standard Operating Procedures covering all 5 Core HR modules, complete with automated Business Rules.'}
                    </p>
                  </div>
                  {[
                    { module: 'Core EMP (Nhân sự)', count: 15, barColor: 'bg-blue-500' },
                    { module: 'ATT (Chấm công)', count: 15, barColor: 'bg-emerald-500' },
                    { module: 'PAY (Tiền lương)', count: 4, barColor: 'bg-amber-500' },
                    { module: 'INS (Bảo hiểm)', count: 8, barColor: 'bg-pink-500' },
                    { module: 'TAX (Thuế TNCN)', count: 3, barColor: 'bg-indigo-500' }
                  ].map((group) => (
                    <div key={group.module} className="flex items-center gap-3">
                      <div className="w-32 text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
                        {group.module}
                      </div>
                      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div className={`h-full ${group.barColor} rounded-full`} style={{ width: `${(group.count / 45) * 100}%` }} />
                      </div>
                      <div className="w-12 text-right text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {group.count} SOP
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-black">
                    <span>Tổng cộng:</span>
                    <span>45 SOPs</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
