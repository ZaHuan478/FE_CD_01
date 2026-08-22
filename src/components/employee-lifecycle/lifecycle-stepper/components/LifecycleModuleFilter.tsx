import React from 'react'
import { Filter } from 'lucide-react'
import { useLanguage } from '../../../../context/LanguageContext'
import { MODULE_FILTER_OPTIONS } from '../data/stepModuleData'

interface LifecycleModuleFilterProps {
  selectedModuleFilter: string
  onSelectFilter: (filterId: string) => void
}

export const LifecycleModuleFilter: React.FC<LifecycleModuleFilterProps> = ({
  selectedModuleFilter,
  onSelectFilter
}) => {
  const { language } = useLanguage()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-extrabold uppercase text-[10px] text-slate-400 dark:text-slate-500 tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-blue-500" />
          {language === 'vi' ? 'Lọc theo Phân hệ HR:' : 'Filter HR Module:'}
        </span>

        {MODULE_FILTER_OPTIONS.map((modOpt) => {
          const isSelected = selectedModuleFilter === modOpt.id
          return (
            <button
              key={modOpt.id}
              type="button"
              onClick={() => onSelectFilter(modOpt.id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer border flex items-center gap-1 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{language === 'vi' ? modOpt.name : modOpt.nameEn}</span>
            </button>
          )
        })}
      </div>

      <span className="text-[11px] font-mono text-slate-400">
        {language === 'vi' ? '5 Phân hệ HR Tích hợp' : '5 Integrated HR Modules'}
      </span>
    </div>
  )
}
