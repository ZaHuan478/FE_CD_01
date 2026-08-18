import React, { useState } from 'react'
import { ChevronRight, UserPlus, FileCheck, MapPin, FileSignature, CircleDollarSign, Activity, UserMinus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import type { LifecycleStep } from '../../types/employee-lifecycle'

interface LifecycleStepperProps {
  steps: LifecycleStep[]
  activeStepId?: string
  onSelectStep: (id: string) => void
}

const getStepIcon = (idOrCode: string) => {
  if (idOrCode.includes('01') || idOrCode.endsWith('1')) return <UserPlus className="w-4 h-4" />
  if (idOrCode.includes('02') || idOrCode.endsWith('2')) return <FileCheck className="w-4 h-4" />
  if (idOrCode.includes('03') || idOrCode.endsWith('3')) return <MapPin className="w-4 h-4" />
  if (idOrCode.includes('04') || idOrCode.endsWith('4')) return <FileSignature className="w-4 h-4" />
  if (idOrCode.includes('05') || idOrCode.endsWith('5')) return <CircleDollarSign className="w-4 h-4" />
  if (idOrCode.includes('06') || idOrCode.endsWith('6')) return <Activity className="w-4 h-4" />
  if (idOrCode.includes('07') || idOrCode.endsWith('7')) return <UserMinus className="w-4 h-4" />
  return <Sparkles className="w-4 h-4" />
}

interface ClusterConfig {
  id: string
  title: string
  badgeText: string
  stepIds: string[]
  stepNumbers: number[]
  colSpan: string
  subGridCols: string
  bgClass: string
  borderClass: string
  headerTextClass: string
  headerBadgeClass: string
  sopBadgeColor: string
}

const CLUSTERS: ClusterConfig[] = [
  {
    id: 'cluster-1',
    title: 'TIẾP NHẬN & HỒ SƠ',
    badgeText: 'CỤM 1 · 2 BƯỚC',
    stepIds: ['LIFE-01', 'LIFE-02'],
    stepNumbers: [1, 2],
    colSpan: 'lg:col-span-2',
    subGridCols: 'grid-cols-2',
    bgClass: 'bg-slate-50/70 dark:bg-slate-950/70',
    borderClass: 'border-slate-200/80 dark:border-slate-800',
    headerTextClass: 'text-slate-800 dark:text-slate-200',
    headerBadgeClass: 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/80 dark:border-slate-700',
    sopBadgeColor: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 group-hover:bg-blue-100'
  },
  {
    id: 'cluster-2',
    title: 'HỢP ĐỒNG & CHẾ ĐỘ PHÚC LỢI',
    badgeText: 'CỤM 2 · 3 BƯỚC',
    stepIds: ['LIFE-03', 'LIFE-04', 'LIFE-05'],
    stepNumbers: [3, 4, 5],
    colSpan: 'lg:col-span-3',
    subGridCols: 'grid-cols-3',
    bgClass: 'bg-emerald-50/40 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200/80 dark:border-emerald-900/40',
    headerTextClass: 'text-emerald-900 dark:text-emerald-300',
    headerBadgeClass: 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200/90 dark:border-emerald-800',
    sopBadgeColor: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 group-hover:bg-emerald-100'
  },
  {
    id: 'cluster-3',
    title: 'BIẾN ĐỘNG & KẾT THÚC',
    badgeText: 'CỤM 3 · 2 BƯỚC',
    stepIds: ['LIFE-06', 'LIFE-07'],
    stepNumbers: [6, 7],
    colSpan: 'lg:col-span-2',
    subGridCols: 'grid-cols-2',
    bgClass: 'bg-amber-50/40 dark:bg-amber-950/30',
    borderClass: 'border-amber-200/80 dark:border-amber-900/40',
    headerTextClass: 'text-amber-900 dark:text-amber-300',
    headerBadgeClass: 'bg-amber-100/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-200/90 dark:border-amber-800',
    sopBadgeColor: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 group-hover:bg-amber-100'
  }
]

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  steps,
  activeStepId,
  onSelectStep
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-5 transition-all duration-300 hover:shadow-md">
      {/* Header Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
              Layer 2 · Main Pipeline Flow
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">3 Cụm Grouping Container · 7 Bước Quy trình</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (MAIN EMPLOYEE LIFECYCLE)
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <span>Tiếp nhận</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Hợp đồng & Phúc lợi</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Biến động & Kết thúc</span>
          </div>

          {/* Collapse Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
            title={isExpanded ? 'Thu gọn Tầng 2 Vòng đời' : 'Mở rộng Tầng 2 Vòng đời'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EXPANDABLE BODY CONTENT */}
      {isExpanded && (
        <div className="space-y-5 animate-fadeIn">
          {/* Mobile Hint Cue */}
          <div className="flex lg:hidden items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/80 dark:bg-blue-950/50 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <span>👉 Vuốt ngang để xem đủ 3 Cụm quy trình (7 bước)</span>
            <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">7 Steps · 3 Clusters</span>
          </div>

          {/* Pipeline Stepper Container with Continuous Line */}
          <div className="relative pt-2 pb-2 overflow-x-auto no-scrollbar">
            <div className="min-w-[1020px] lg:min-w-0 relative">
              
              {/* Continuous Timeline Connector Line passing across behind all icons */}
              <div className="absolute top-[94px] left-[45px] right-[45px] h-[3px] bg-slate-300/80 dark:bg-slate-800 z-0 hidden lg:block rounded-full" />

              {/* 7-Column Responsive Layout wrapping 3 Grouping Sub-Containers */}
              <div className="grid grid-cols-7 gap-3 sm:gap-4 relative z-10">
                {CLUSTERS.map((cluster) => {
                  const clusterSteps = steps.filter(
                    (s) => cluster.stepIds.includes(s.id) || cluster.stepNumbers.includes(s.stepNumber)
                  )

                  return (
                    <div
                      key={cluster.id}
                      className={`${cluster.colSpan} ${cluster.bgClass} ${cluster.borderClass} border rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xs`}
                    >
                      {/* Sub-Container Header */}
                      <div className="flex items-center justify-between mb-3 h-6">
                        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${cluster.headerTextClass}`}>
                          {cluster.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cluster.headerBadgeClass}`}>
                          {cluster.badgeText}
                        </span>
                      </div>

                      {/* Sub-Grid for Step Cards inside Cluster */}
                      <div className={`grid ${cluster.subGridCols} gap-2.5 sm:gap-3`}>
                        {clusterSteps.map((step) => {
                          const isActive = activeStepId === step.id
                          const stepIcon = getStepIcon(step.id)

                          return (
                            <div key={step.id} className="flex flex-col group">
                              <button
                                type="button"
                                onClick={() => onSelectStep(step.id)}
                                className={`w-full h-full flex flex-col items-center text-center p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform -translate-y-1'
                                    : 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-1 shadow-xs'
                                }`}
                              >
                                {/* Step Icon Circle */}
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs mb-2.5 transition-colors shrink-0 relative z-10 ${
                                    isActive
                                      ? 'bg-white/20 text-white border border-white/30'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 shadow-2xs'
                                  }`}
                                >
                                  {stepIcon}
                                </div>

                                {/* Step Number Code */}
                                <span
                                  className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${
                                    isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                  }`}
                                >
                                  Bước {step.stepNumber} · {step.id}
                                </span>

                                {/* Title */}
                                <h4
                                  className={`text-xs font-bold leading-tight mb-1 line-clamp-2 ${
                                    isActive ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400'
                                  }`}
                                >
                                  {step.title}
                                </h4>

                                {/* Subtitle */}
                                <span
                                  className={`text-[11px] leading-tight line-clamp-1 mb-2 ${
                                    isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {step.subtitle}
                                </span>

                                {/* SOP Badge Tag */}
                                {step.sopBadge && (
                                  <span
                                    className={`mt-auto px-2 py-0.5 text-[9px] font-mono font-bold rounded border transition-colors ${
                                      isActive
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

          {/* Footer Note */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
              * Quy trình 7 bước được phân thành 3 Cụm nghiệp vụ chính: Tiếp nhận & Hồ sơ ➔ Hợp đồng & Phúc lợi ➔ Biến động & Kết thúc.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
