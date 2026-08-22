import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../../../context/LanguageContext'

interface LifecycleStepperHeaderProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export const LifecycleStepperHeader: React.FC<LifecycleStepperHeaderProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  const { language, t } = useLanguage()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
            Layer 2 · Main Pipeline Flow
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {language === 'vi' ? '7 Bước Vòng đời Liên hoàn · Master-Detail Tương tác' : '7 Continuous Lifecycle Steps · Interactive Master-Detail'}
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {t('layer2.title', 'TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (MAIN EMPLOYEE LIFECYCLE)')}
        </h2>
      </div>

      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0 self-start sm:self-center"
        title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
      >
        <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </div>
  )
}
