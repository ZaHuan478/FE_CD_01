import React from 'react'
import { Info, ArrowRight, RefreshCw } from 'lucide-react'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface FlowLegendProps {
  isCrossCluster?: boolean
}

export const FlowLegend: React.FC<FlowLegendProps> = () => {
  const { language } = useLanguage()

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-5 gap-y-2">
      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
        <Info className="w-3.5 h-3.5 text-[#1f5f86] dark:text-sky-400" />
        <span>{language === 'vi' ? 'Chú giải ký hiệu:' : 'Legend:'}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-sky-600" />
        <span>{language === 'vi' ? 'Phân hệ nghiệp vụ' : 'Business Module'}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
        <span>{language === 'vi' ? 'Dịch vụ nền tảng' : 'Shared Service'}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
        <span>{language === 'vi' ? 'Bàn giao 1 chiều' : 'One-way Transfer'}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{language === 'vi' ? 'Vòng phản hồi (Feedback)' : 'Feedback Loop'}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-amber-100 dark:bg-amber-900/40" />
        <span>{language === 'vi' ? 'Đang chọn kiểm tra' : 'Active Selection'}</span>
      </div>
    </div>
  )
}
