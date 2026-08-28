import React from 'react'
import { ListOrdered, User, Cpu } from 'lucide-react'
import type { Policy } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface PolicyProcedureSectionProps {
  policy: Policy
}

export const PolicyProcedureSection: React.FC<PolicyProcedureSectionProps> = ({ policy }) => {
  const { language } = useLanguage()

  if (!policy.procedures || policy.procedures.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <ListOrdered className="w-4 h-4 text-[#1f5f86] dark:text-sky-400" />
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
          {language === 'vi' ? 'Trình tự thực hiện & Thao tác trên HRMS' : 'Operational Steps on HRMS'}
        </h2>
      </div>

      {/* Stepper Timeline */}
      <div className="relative pl-3 sm:pl-4 space-y-4 before:absolute before:left-[19px] sm:before:left-[23px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {policy.procedures.map((step) => (
          <div key={step.stepNumber} className="relative flex items-start gap-3 sm:gap-4">
            {/* Step Number Circle */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1f5f86] text-white flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-xs z-10">
              {step.stepNumber}
            </div>

            {/* Step Card Content */}
            <div className="flex-1 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {step.title}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  <User className="w-3 h-3 text-[#1f5f86] dark:text-sky-400" />
                  <span>{step.actor}</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>

              {step.systemAction && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-start gap-1.5 text-[11px] text-sky-800 dark:text-sky-300 bg-sky-50/50 dark:bg-sky-950/30 p-2 rounded-lg">
                  <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Hệ thống xử lý: </span>
                    <span>{step.systemAction}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
