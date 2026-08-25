import React from 'react'
import { Filter } from 'lucide-react'
import { MODULE_FILTER_OPTIONS } from '../data/stepModuleData'

interface LifecycleModuleFilterProps {
  selectedModuleFilter: string
  onSelectFilter: (filterId: string) => void
}

export const LifecycleModuleFilter: React.FC<LifecycleModuleFilterProps> = ({
  selectedModuleFilter,
  onSelectFilter
}) => {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
      <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300" htmlFor="lifecycle-module-filter">
        <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Xem hành trình theo phân hệ</span>
      </label>
      <select
        id="lifecycle-module-filter"
        value={selectedModuleFilter}
        onChange={(event) => onSelectFilter(event.target.value)}
        className="min-w-[200px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
      >
        {MODULE_FILTER_OPTIONS.map((modOpt) => (
          <option key={modOpt.id} value={modOpt.id}>
            {modOpt.name}
          </option>
        ))}
      </select>
    </div>
  )
}

