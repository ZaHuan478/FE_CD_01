import React from 'react'
import { ShieldCheck, CheckCircle2, Cpu, AlertTriangle, Sparkles } from 'lucide-react'
import { useLanguage } from '../../../../context/LanguageContext'

interface PolicyHeaderProps {
  metrics: {
    total: number
    active: number
    systemRules: number
    mandatory: number
  }
  onOpenSimulator?: () => void
}

export const PolicyHeader: React.FC<PolicyHeaderProps> = ({ metrics, onOpenSimulator }) => {
  const { language } = useLanguage()

  return (
    <div className="space-y-4">
      {/* Top Banner / Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="space-y-1">
          {/* <div className="flex items-center gap-2 text-[11px] font-bold text-[#1f5f86] dark:text-sky-400 uppercase tracking-wider">
            <span>Employee Lifecycle</span>
            <span>/</span>
            <span>{language === 'vi' ? 'Quản trị Tuân thủ' : 'Governance & Compliance'}</span>
          </div> */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1f5f86] text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'vi' ? 'Trung tâm Quy định & Tuân thủ Nội bộ' : 'Policies & Compliance Center'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                {language === 'vi'
                  ? 'Tra cứu quy định, quy tắc hệ thống, hạn mức nghiệp vụ và cơ chế kiểm soát liên kết với các quy trình SOP.'
                  : 'Lookup corporate policies, system control rules, business limits, and linked SOP workflow specifications.'}
              </p>
            </div>
          </div>
        </div>

        {onOpenSimulator && (
          <button
            type="button"
            onClick={onOpenSimulator}
            className="self-start md:self-center px-4 py-2 bg-gradient-to-r from-[#1f5f86] to-sky-700 hover:from-sky-700 hover:to-[#1f5f86] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'vi' ? 'Mô phỏng Quy tắc (Simulator)' : 'Policy Rule Simulator'}</span>
          </button>
        )}
      </div>

      {/* 4 Compact Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              {metrics.total}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Tổng số quy định' : 'Total Policies'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              {metrics.active}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Đang hiệu lực' : 'Active Policies'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              {metrics.systemRules}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Quy tắc hệ thống' : 'System Rules'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              {metrics.mandatory}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Bắt buộc tuân thủ' : 'Mandatory Compliance'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
