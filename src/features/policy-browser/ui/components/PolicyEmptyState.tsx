import React from 'react'
import { FileQuestion, RotateCcw } from 'lucide-react'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyEmptyStateProps {
  onResetFilter?: () => void
  isFiltered?: boolean
}

export const PolicyEmptyState: React.FC<PolicyEmptyStateProps> = ({
  onResetFilter,
  isFiltered = true
}) => {
  const { language } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl">
        <FileQuestion className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
          {language === 'vi' ? 'Không tìm thấy quy định phù hợp' : 'No matching policies found'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {language === 'vi'
            ? 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc điều chỉnh lại các điều kiện trong bộ lọc.'
            : 'Please check your search keyword or reset filter criteria to see all policies.'}
        </p>
      </div>

      {isFiltered && onResetFilter && (
        <button
          type="button"
          onClick={onResetFilter}
          className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Đặt lại toàn bộ bộ lọc' : 'Reset All Filters'}</span>
        </button>
      )}
    </div>
  )
}
