import React from 'react'
import { Filter } from 'lucide-react'
import { getMODULE_FILTER_OPTIONS } from '../../../../entities/lifecycle/model/stepper/data/stepModuleData'
import { Select } from '../../../../shared/ui/atoms/Select'

interface LifecycleModuleFilterProps {
  selectedModuleFilter: string
  onSelectFilter: (filterId: string) => void
}

export const LifecycleModuleFilter: React.FC<LifecycleModuleFilterProps> = ({
  selectedModuleFilter,
  onSelectFilter
}) => {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center">
      <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300" htmlFor="lifecycle-module-filter">
        <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Xem hành trình theo phân hệ</span>
      </label>
      <Select
        id="lifecycle-module-filter"
        visualSize="compact"
        value={selectedModuleFilter}
        onChange={(event) => onSelectFilter(event.target.value)}
        containerClassName="w-full min-w-0 sm:w-auto sm:min-w-[200px]"
        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
      >
        {getMODULE_FILTER_OPTIONS().map((modOpt) => (
          <option key={modOpt.id} value={modOpt.id}>
            {modOpt.name}
          </option>
        ))}
      </Select>
    </div>
  )
}
