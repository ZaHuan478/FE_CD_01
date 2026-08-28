import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, ExternalLink, ShieldCheck } from 'lucide-react'
import type { Policy } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface PolicyRelatedProcessesProps {
  policy: Policy
}

export const PolicyRelatedProcesses: React.FC<PolicyRelatedProcessesProps> = ({ policy }) => {
  const navigate = useNavigate()
  const { language } = useLanguage()

  const allProcesses = [
    ...policy.relatedProcessCodes.map((code) => ({ code, isSop: false })),
    ...policy.relatedSopCodes.map((code) => ({ code, isSop: true }))
  ]

  if (allProcesses.length === 0) {
    return null
  }

  const handleNavigateToWorkflow = (code: string, isSop: boolean) => {
    if (code.startsWith('MD-')) {
      navigate('/employee-lifecycle/masterdata')
      return
    }

    if (code.startsWith('LIFE-') || code.startsWith('CF-')) {
      navigate(`/employee-lifecycle/workflow/${code}`)
      return
    }

    if (isSop) {
      // Find matching parent if known, or open corresponding CF-01 or LIFE
      if (code.includes('ATT') || code.includes('CF')) {
        navigate(`/employee-lifecycle/workflow/CF-01?sop=${encodeURIComponent(code)}`)
      } else if (code.includes('EMP')) {
        navigate(`/employee-lifecycle/workflow/LIFE-02?sop=${encodeURIComponent(code)}`)
      } else if (code.includes('REC')) {
        navigate(`/employee-lifecycle/workflow/LIFE-01?sop=${encodeURIComponent(code)}`)
      } else {
        navigate('/employee-lifecycle/operations')
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            {language === 'vi' ? 'Quy trình & SOP liên kết' : 'Linked SOPs & Workflows'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'vi'
              ? 'Nhấp vào mã quy trình để điều hướng trực tiếp tới sơ đồ phân bước và biểu mẫu tương ứng.'
              : 'Click on workflow code to navigate directly to step diagram and wireframe forms.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {allProcesses.map(({ code, isSop }, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleNavigateToWorkflow(code, isSop)}
            className="group px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 hover:border-sky-300 dark:border-slate-700 dark:hover:border-sky-500 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {isSop ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <GitBranch className="w-3.5 h-3.5 text-[#1f5f86] dark:text-sky-400 shrink-0" />
            )}
            <span className="font-mono">{code}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}
