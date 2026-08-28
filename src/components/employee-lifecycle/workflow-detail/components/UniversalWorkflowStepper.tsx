import React from 'react'
import { ArrowRight, UserCheck, Clock, GitBranch } from 'lucide-react'
import type { SopSubStep } from '../types'
import { selectStepTypeCode } from '../workflowSelectors'
import { useLanguage } from '../../../../context/LanguageContext'

interface UniversalWorkflowStepperProps {
  steps: SopSubStep[]
  selectedStepIdx: number
  onSelectStep: (idx: number) => void
  isDarkMode: boolean
}

export const UniversalWorkflowStepper: React.FC<UniversalWorkflowStepperProps> = ({
  steps,
  selectedStepIdx,
  onSelectStep,
  isDarkMode
}) => {
  const { language } = useLanguage()

  if (!steps || steps.length === 0) {
    return (
      <div
        className={`rounded-2xl border p-6 text-center shadow-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <p className="text-xs font-semibold">
          {language === 'vi'
            ? 'Quy trình này hiện chưa có các bước SOP chi tiết được phân rã.'
            : 'No detailed SOP steps available for this process yet.'}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Header bar of Stepper */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#1f5f86] dark:text-sky-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'vi' ? 'Lưu đồ Quy trình Thực thi Chuẩn' : 'Standard Execution Flowchart'}
          </h3>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            ({steps.length} {language === 'vi' ? 'bước tuần tự' : 'steps'})
          </span>
        </div>

        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
          {language === 'vi' ? 'Chọn từng bước để xem chi tiết bên dưới' : 'Click a step to view details below'}
        </span>
      </div>

      {/* Horizontal Steps Pipeline (Scrollable when steps > 4) */}
      <div className="relative overflow-x-auto no-scrollbar pb-2 pt-1">
        <div className="flex items-stretch gap-3 min-w-max px-1">
          {steps.map((step, idx) => {
            const isSelected = selectedStepIdx === idx
            const isLast = idx === steps.length - 1
            const typeStyle = selectStepTypeCode(step)

            return (
              <React.Fragment key={`${step.stepCode || idx}-${idx}`}>
                {/* Single Step Card */}
                <button
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  className={`w-[240px] sm:w-[260px] shrink-0 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-blue-950/90 border-sky-400 ring-2 ring-sky-500/40 text-white shadow-md transform -translate-y-0.5'
                        : 'bg-[#1f5f86] border-[#1f5f86] ring-2 ring-blue-300 text-white shadow-md transform -translate-y-0.5'
                      : isDarkMode
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800/80'
                        : 'bg-slate-50 border-slate-200/90 hover:border-blue-300 text-slate-800 hover:bg-white'
                  }`}
                >
                  {/* Top: Step Index & Code & Type */}
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        <span
                          className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          {step.stepCode || `B${idx + 1}`}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/30'
                            : `${typeStyle.bgLight} ${typeStyle.bgDark} ${typeStyle.textLight} ${typeStyle.textDark} ${typeStyle.borderLight} ${typeStyle.borderDark}`
                        }`}
                        title={typeStyle.label}
                      >
                        [{typeStyle.code}]
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4
                      className={`text-xs font-bold leading-snug line-clamp-2 mb-2 ${
                        isSelected
                          ? 'text-white'
                          : isDarkMode
                            ? 'text-slate-100'
                            : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  {/* Bottom: Actor & Timing Pills */}
                  <div
                    className={`pt-2 border-t w-full flex items-center justify-between text-[10px] ${
                      isSelected
                        ? isDarkMode
                          ? 'border-blue-800 text-blue-100'
                          : 'border-blue-400/60 text-blue-50'
                        : 'border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1 truncate max-w-[150px]">
                      <UserCheck className="w-3 h-3 shrink-0" />
                      <span className="truncate">{step.actor || 'HR/User'}</span>
                    </span>

                    {step.timing && (
                      <span className="flex items-center gap-0.5 shrink-0">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        <span>{step.timing.split(' ')[0]}</span>
                      </span>
                    )}
                  </div>
                </button>

                {/* Connecting Arrow */}
                {!isLast && (
                  <div className="flex items-center justify-center shrink-0 text-slate-300 dark:text-slate-700 px-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
