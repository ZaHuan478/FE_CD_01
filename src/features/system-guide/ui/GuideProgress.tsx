import React from 'react'
import { Award, CheckCircle2, Trophy } from 'lucide-react'

interface GuideProgressProps {
  completedCount: number
  totalCount: number
  className?: string
}

export const GuideProgress: React.FC<GuideProgressProps> = ({
  completedCount,
  totalCount,
  className = ''
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const isCompleted = totalCount > 0 && completedCount >= totalCount

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Trophy className="size-4" />
            </span>
          ) : (
            <span className="grid size-7 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950/60 dark:text-cyan-300">
              <Award className="size-4" />
            </span>
          )}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Tiến độ làm quen hệ thống
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isCompleted
                ? 'Đã hoàn tất tất cả các bước cơ bản'
                : `Đã hoàn thành ${completedCount}/${totalCount} bước quan trọng`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800">
              <CheckCircle2 className="size-3" />
              Sẵn sàng làm việc
            </span>
          )}
          <span className="font-mono text-sm font-black text-[#155e75] dark:text-cyan-300">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-cyan-600 to-sky-400'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tiến độ hoàn thành lộ trình"
        />
      </div>
    </div>
  )
}
