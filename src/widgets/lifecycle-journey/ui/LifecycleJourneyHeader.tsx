import React from 'react'
import { Layers } from 'lucide-react'
import { getTotalDynamicSops, getDistinctSubsystemsCount } from '../../../entities/lifecycle/lib/lifecycleJourneySelectors'
import { LIFECYCLE_STAGE_ORDER } from '../../../entities/lifecycle/model/journey/lifecycleJourneyData'

export const LifecycleJourneyHeader: React.FC = () => {
  const totalStages = LIFECYCLE_STAGE_ORDER.length
  const totalSops = getTotalDynamicSops()
  const totalSubsystems = getDistinctSubsystemsCount()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1f5f86] text-white shadow-2xs">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#1f5f86] dark:text-sky-300">
              TẦNG 2 · VÒNG ĐỜI NHÂN VIÊN
            </span>
          </div>
          <h2 className="mt-1.5 text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Hành trình vòng đời nhân viên
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
            Theo dõi dữ liệu và trách nhiệm từ lúc phát sinh nhu cầu nhân sự đến khi đóng hồ sơ.
          </p>
        </div>

        {/* METRICS TIÊU CHUẨN ĐỘNG */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1f5f86] text-[11px] font-bold text-white">
              {totalStages}
            </span>
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Chặng cốt lõi</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">LIFE-00 ➔ 07</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 text-[11px] font-bold text-white">
              {totalSops}
            </span>
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">SOP thực tế</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Tính động SOP_DB</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2e8bbd] text-[11px] font-bold text-white">
              {totalSubsystems}
            </span>
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phân hệ kết nối</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Liên thông dữ liệu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
