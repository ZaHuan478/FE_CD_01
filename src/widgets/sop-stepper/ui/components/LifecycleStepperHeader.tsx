import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface LifecycleStepperHeaderProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export const LifecycleStepperHeader: React.FC<LifecycleStepperHeaderProps> = ({
  isExpanded,
  onToggleExpand
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/70 dark:border-blue-800">
            HÀNH TRÌNH NHÂN SỰ · 8 GIAI ĐOẠN
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tầng 2: Vòng đời nhân viên
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Theo dõi các công việc từ thiết lập định biên đến nghỉ việc.
        </p>
      </div>

      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0 self-start sm:self-center"
        title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
      >
        <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
    </div>
  )
}

