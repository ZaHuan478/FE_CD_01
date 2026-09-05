import React from 'react'
import { Info, RotateCcw } from 'lucide-react'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface FlowEmptyStateProps {
  onReset: () => void
}

export const FlowEmptyState: React.FC<FlowEmptyStateProps> = ({ onReset }) => {
  const { language } = useLanguage()

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <Info className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {language === 'vi' ? 'Không tìm thấy dữ liệu dòng luồng phù hợp' : 'No flow data found'}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {language === 'vi' ? 'Vui lòng chọn một phân hệ khác hoặc đặt lại phạm vi hiển thị.' : 'Please select another module or reset the view scope.'}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 rounded-lg bg-[#1f5f86] text-white text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
      </button>
    </div>
  )
}
