import React, { useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  Share2
} from 'lucide-react'
import type { LifecycleStageDefinition } from '../../../entities/lifecycle/model/journey/types'

interface LifecycleImpactMatrixProps {
  stage: LifecycleStageDefinition
}

export const LifecycleImpactMatrix: React.FC<LifecycleImpactMatrixProps> = ({ stage }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section aria-label="Tác động liên phân hệ" className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* COLLAPSIBLE HEADER */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1f5f86] text-white shadow-2xs">
            <Share2 className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Tác động liên phân hệ (Cross-Module Data Impact)</span>
              <span className="rounded bg-sky-100 px-1.5 py-0.2 text-[10px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                {stage.impactRows.length} luồng liên thông
              </span>
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Xem chi tiết những phân hệ nào tiếp nhận dữ liệu khi chặng {stage.id} hoàn tất
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết'}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* EXPANDABLE TABLE */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <th className="py-2.5 px-3">Dữ liệu thay đổi</th>
                  <th className="py-2.5 px-3">Phân hệ nhận</th>
                  <th className="py-2.5 px-3">Kiểu tác động</th>
                  <th className="py-2.5 px-3">Thời điểm hiệu lực</th>
                  <th className="py-2.5 px-3">Điều kiện</th>
                  <th className="py-2.5 px-3">Trạng thái bàn giao</th>
                  <th className="py-2.5 px-3">SOP nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stage.impactRows.map((row, idx) => (
                  <tr
                    key={`${row.dataChange}-${idx}`}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white leading-snug">
                      {row.dataChange}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-0.5 font-semibold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800">
                        {row.targetModule}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {row.impactType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {row.effectiveTiming}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {row.condition}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{row.handoverStatus}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {row.sourceSop}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
