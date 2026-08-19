import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, CheckCircle2, FileText, UserCheck, Filter, Link2 } from 'lucide-react'
import type { LifecycleStep } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'
import { CLUSTERS, getStepIcon } from './data/lifecycleClustersData.tsx'

interface LifecycleStepperProps {
  steps: LifecycleStep[]
  activeStepId?: string
  onSelectStep: (id: string) => void
}

interface ModuleInfo {
  name: string
  nameEn: string
  code: string
  color: string
  bg: string
  border: string
  desc: string
  descEn: string
  coModules: { name: string; nameEn: string; bg: string; color: string }[]
}

const STEP_MODULE_MAP: Record<string, ModuleInfo> = {
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

const MODULE_FILTER_OPTIONS = [
  { id: 'ALL', name: 'Tất cả Phân hệ', nameEn: 'All HR Modules', code: 'ALL' },
  { id: 'REC', name: 'Tuyển dụng', nameEn: 'Recruitment', code: 'REC', stepIds: ['LIFE-01'] },
  { id: 'EMP', name: 'Core EMP (Nhân sự)', nameEn: 'Personnel Core', code: 'EMP', stepIds: ['LIFE-01', 'LIFE-02', 'LIFE-03'] },
  { id: 'CON', name: 'Hợp đồng & Pháp lý', nameEn: 'Contract & Legal', code: 'CON', stepIds: ['LIFE-02', 'LIFE-04'] },
  { id: 'C&B', name: 'C&B Lương & BHXH', nameEn: 'C&B & Insurance', code: 'C&B', stepIds: ['LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'] },
  { id: 'ATT', name: 'Chấm công (ATT)', nameEn: 'Attendance', code: 'ATT', stepIds: ['LIFE-03', 'LIFE-06'] },
  { id: 'OFF', name: 'Thôi việc & Quyết toán', nameEn: 'Offboarding', code: 'OFF', stepIds: ['LIFE-07'] }
]

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  steps,
  activeStepId,
  onSelectStep
}) => {
  const { language, t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL')

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0]
  const activeModInfo = STEP_MODULE_MAP[activeStep.id]

  // Filter steps based on selected module filter option
  const activeFilterOpt = MODULE_FILTER_OPTIONS.find((m) => m.id === selectedModuleFilter)
  const isStepHighlighted = (stepId: string) => {
    if (selectedModuleFilter === 'ALL') return true
    return activeFilterOpt?.stepIds?.includes(stepId) ?? true
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4 transition-all duration-300 hover:shadow-md">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
              Layer 2 · Main Pipeline Flow
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'vi' ? '7 Bước Vòng đời Liên hoàn · Phân định Phân hệ HR' : '7 Continuous Lifecycle Steps · HR Modules Mapped'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t('layer2.title', 'TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (MAIN EMPLOYEE LIFECYCLE)')}
          </h2>
        </div>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0 self-start sm:self-center"
          title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
        >
          <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* INTERACTIVE MODULE FILTER LEGEND BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-extrabold uppercase text-[10px] text-slate-400 dark:text-slate-500 tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-500" />
            {language === 'vi' ? 'Lọc theo Phân hệ HR:' : 'Filter HR Module:'}
          </span>

          {MODULE_FILTER_OPTIONS.map((modOpt) => {
            const isSelected = selectedModuleFilter === modOpt.id
            return (
              <button
                key={modOpt.id}
                type="button"
                onClick={() => setSelectedModuleFilter(modOpt.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer border flex items-center gap-1 ${isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <span>{language === 'vi' ? modOpt.name : modOpt.nameEn}</span>
              </button>
            )
          })}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {language === 'vi' ? '5 Phân hệ HR Tích hợp' : '5 Integrated HR Modules'}
        </span>
      </div>

      {/* EXPANDABLE PIPELINE CONTENT */}
      {isExpanded && (
        <div className="pt-1 animate-fadeIn space-y-4">
          <div className="overflow-x-auto no-scrollbar py-2">
            <div className="min-w-[1020px] lg:min-w-0 relative">

              {/* Horizontal Connecting Timeline passing across all cards */}
              <div className="absolute top-[110px] left-[55px] right-[55px] h-[3px] bg-slate-300/80 dark:bg-slate-800 z-0 hidden lg:block rounded-full" />

              {/* 7-Column Layout Wrapping the 3 Cluster Grouping Containers */}
              <div className="grid grid-cols-7 gap-3 sm:gap-4 relative z-10 items-stretch">
                {CLUSTERS.map((cluster) => {
                  const clusterSteps = steps.filter(
                    (s) => cluster.stepIds.includes(s.id) || cluster.stepNumbers.includes(s.stepNumber)
                  )

                  return (
                    <div
                      key={cluster.id}
                      className={`${cluster.colSpan} ${cluster.bgClass} ${cluster.borderClass} border rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xs`}
                    >
                      {/* Cluster Container Header */}
                      <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${cluster.headerTextClass}`}>
                          {cluster.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cluster.headerBadgeClass}`}>
                          {cluster.badgeText}
                        </span>
                      </div>

                      {/* Step Cards inside Cluster */}
                      <div className={`grid ${cluster.subGridCols} gap-2.5 sm:gap-3 items-stretch h-full`}>
                        {clusterSteps.map((step) => {
                          const isActive = activeStepId === step.id
                          const stepIcon = getStepIcon(step.id)
                          const mod = STEP_MODULE_MAP[step.id]
                          const isHighlighted = isStepHighlighted(step.id)

                          return (
                            <div key={step.id} className="flex flex-col group">
                              <button
                                type="button"
                                onClick={() => onSelectStep(step.id)}
                                className={`w-full h-full min-h-[175px] flex flex-col justify-between items-center text-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${!isHighlighted
                                    ? 'opacity-35 grayscale hover:grayscale-0 hover:opacity-100 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                                    : isActive
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform -translate-y-1 ring-2 ring-blue-400'
                                      : 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-1 shadow-2xs'
                                  }`}
                              >
                                {/* Top Module Tag Badge */}
                                {mod && (
                                  <span
                                    className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border truncate max-w-full ${isActive
                                        ? 'bg-white/20 text-white border-white/30'
                                        : `${mod.bg} ${mod.color} ${mod.border}`
                                      }`}
                                  >
                                    {language === 'vi' ? mod.name : mod.nameEn}
                                  </span>
                                )}

                                {/* Icon Container */}
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs my-2 transition-colors shrink-0 ${isActive
                                      ? 'bg-white/20 text-white border border-white/30'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                                    }`}
                                >
                                  {stepIcon}
                                </div>

                                {/* Step Number & Title */}
                                <div>
                                  <span
                                    className={`text-[10px] font-extrabold uppercase tracking-wider block ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                                      }`}
                                  >
                                    Bước {step.stepNumber} · {step.id}
                                  </span>
                                  <h4
                                    className={`text-xs font-bold leading-tight line-clamp-2 mt-0.5 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'
                                      }`}
                                  >
                                    {step.title}
                                  </h4>
                                </div>

                                {/* SOP Badge */}
                                {step.sopBadge && (
                                  <span
                                    className={`mt-2 px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${isActive
                                        ? 'bg-white/20 text-white border-white/40'
                                        : cluster.sopBadgeColor
                                      }`}
                                  >
                                    📋 {step.sopBadge}
                                  </span>
                                )}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>

          {/* ACTIVE STEP INTEGRATED INSPECTOR BANNER WITH PRIMARY & CO-OPERATING MODULES */}
          {activeStep && activeModInfo && (
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-blue-200/70 dark:border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm mt-0.5">
                  {activeStep.stepNumber}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {activeStep.id}
                    </span>
                    
                    {/* Primary Owning Module */}
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${activeModInfo.bg} ${activeModInfo.color} ${activeModInfo.border}`}>
                      🎯 Phân hệ chính: {language === 'vi' ? activeModInfo.name : activeModInfo.nameEn}
                    </span>

                    {activeStep.sopBadge && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        📋 {activeStep.sopBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeStep.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {language === 'vi' ? activeModInfo.desc : activeModInfo.descEn}
                  </p>

                  {/* Co-operating / Interacting Modules Badges */}
                  {activeModInfo.coModules && activeModInfo.coModules.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Link2 className="w-3 h-3 text-emerald-500" />
                        {language === 'vi' ? 'Phân hệ phối hợp:' : 'Co-operating:'}
                      </span>
                      {activeModInfo.coModules.map((coMod, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${coMod.bg} ${coMod.color}`}
                        >
                          {language === 'vi' ? coMod.name : coMod.nameEn}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectStep(activeStep.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start md:self-center"
              >
                <span>{language === 'vi' ? 'Xem Đặc Tả & Wireframe Form Bước Này →' : 'View Spec & Wireframe Form →'}</span>
              </button>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
              * Quy trình 7 bước Vòng đời Nhân viên vận hành liên hoàn từ khi Tiếp nhận đến khi Thanh lý & Đóng hồ sơ.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
