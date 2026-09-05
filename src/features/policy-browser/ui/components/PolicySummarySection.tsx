import React from 'react'
import { Info, CheckSquare, ShieldCheck, UserCheck } from 'lucide-react'
import type { Policy } from '../../../../entities/policy/model/types'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicySummarySectionProps {
  policy: Policy
}

export const PolicySummarySection: React.FC<PolicySummarySectionProps> = ({ policy }) => {
  const { language } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Executive Summary */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1f5f86] dark:text-sky-400" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            {language === 'vi' ? 'Tóm tắt nội dung quy định' : 'Executive Summary'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          {language === 'vi' ? policy.summary : policy.summaryEn}
        </p>
      </div>

      {/* "Bạn cần làm gì?" Checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            {language === 'vi' ? 'Bạn cần làm gì? (Trách nhiệm của Nhân viên)' : 'What you need to do (Employee Checklist)'}
          </h3>
        </div>

        <div className="space-y-2">
          {policy.responsibilities.employee.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200"
            >
              <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span className="leading-relaxed font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Manager & HR Responsibilities (if present) */}
      {(policy.responsibilities.manager || policy.responsibilities.hr) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {policy.responsibilities.manager && (
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'vi' ? 'Trách nhiệm của Quản lý' : 'Manager Responsibilities'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {policy.responsibilities.manager.map((item, idx) => (
                  <li key={idx} className="leading-relaxed font-normal">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {policy.responsibilities.hr && (
            <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>{language === 'vi' ? 'Trách nhiệm của Đơn vị Nhân sự / POEC' : 'HR / POEC Responsibilities'}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {policy.responsibilities.hr.map((item, idx) => (
                  <li key={idx} className="leading-relaxed font-normal">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
