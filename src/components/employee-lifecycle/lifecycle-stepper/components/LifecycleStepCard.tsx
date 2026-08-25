import React from 'react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import { getStepIcon } from '../../data/lifecycleClustersData'

interface LifecycleStepCardProps {
  step: LifecycleStep
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (id: string) => void
}

const STEP_STANDARD_TITLES: Record<string, string> = {
  'LIFE-00': 'Thiết lập định biên nhân sự',
  'LIFE-01': 'Tiếp nhận nhân viên mới',
  'LIFE-02': 'Tạo và hoàn thiện hồ sơ nhân viên',
  'LIFE-03': 'Bố trí công tác và vị trí',
  'LIFE-04': 'Thiết lập hợp đồng',
  'LIFE-05': 'Cấu hình lương và chế độ',
  'LIFE-06': 'Quá trình làm việc và biến động',
  'LIFE-07': 'Nghỉ việc, bàn giao và đóng hồ sơ'
}

export const LifecycleStepCard: React.FC<LifecycleStepCardProps> = ({
  step,
  isSelected,
  isHighlighted,
  onSelect
}) => {
  const stepIcon = getStepIcon(step.id)
  const displayTitle = STEP_STANDARD_TITLES[step.id] || step.title

  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      className={`w-full min-h-[148px] h-full flex flex-col justify-between items-center text-center p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
        !isHighlighted
          ? 'opacity-35 grayscale bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          : isSelected
            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
            : 'bg-white dark:bg-slate-850 hover:bg-slate-50/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-750 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xs'
      }`}
    >
      {/* Top row: Step Number */}
      <div className="w-full flex items-center justify-between">
        <span
          className={`text-[11px] font-bold tracking-tight ${
            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {`Bước ${step.stepNumber}`}
        </span>
      </div>

      {/* Middle: Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center my-1.5 transition-colors shrink-0 ${
          isSelected
            ? 'bg-white/15 text-white border border-white/25'
            : 'bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-slate-700'
        }`}
      >
        {stepIcon}
      </div>

      {/* Bottom: Step Title (2-3 lines max) */}
      <div className="w-full flex items-center justify-center min-h-[38px]">
        <h4
          className={`text-xs font-bold leading-snug line-clamp-3 text-center ${
            isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {displayTitle}
        </h4>
      </div>
    </button>
  )
}

