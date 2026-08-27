import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileCode,
  GitGraph,
  Layers,
  Layout,
  ListTree,
  UserCheck
} from 'lucide-react'
import type { SopSubProcess } from '../workflow-detail/types'
import type { LifecycleStageId } from './types'

interface LifecycleStageSopListProps {
  stageId: LifecycleStageId
  sops: SopSubProcess[]
  selectedSopCode?: string
  onSelectSop: (sopCode: string) => void
}

export const LifecycleStageSopList: React.FC<LifecycleStageSopListProps> = ({
  stageId,
  sops,
  selectedSopCode,
  onSelectSop
}) => {
  const navigate = useNavigate()
  const activeSop = sops.find((s) => s.sopCode === selectedSopCode) ?? sops[0]

  const handleNavigate = (viewType: 'infographic' | 'flowchart' | 'raci' | 'specs' | 'wireframe') => {
    const sopQuery = activeSop ? `?sop=${encodeURIComponent(activeSop.sopCode)}` : ''
    navigate(`/employee-lifecycle/${viewType}/${stageId}${sopQuery}`)
  }

  return (
    <section aria-label="Danh sách SOP và thao tác chuyên sâu" className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
            <ListTree className="h-4 w-4" />
            <span>Quy trình SOP chi tiết của chặng ({sops.length} quy trình thực tế):</span>
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Chọn quy trình để xem các bước nghiệp vụ và mở tài liệu chuyên sâu
          </p>
        </div>
      </div>

      {/* DANH SÁCH THẺ SOP */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sops.map((sop) => {
          const isSelected = activeSop?.sopCode === sop.sopCode
          return (
            <button
              key={sop.sopCode}
              type="button"
              onClick={() => onSelectSop(sop.sopCode)}
              className={`flex items-start gap-2.5 rounded-lg p-2.5 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border border-[#1f5f86] bg-sky-50/80 shadow-2xs dark:border-sky-500 dark:bg-sky-950/60'
                  : 'border border-slate-200 bg-slate-50/60 hover:border-sky-300 hover:bg-sky-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-800/60'
              }`}
            >
              <span
                className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                  isSelected
                    ? 'bg-[#1f5f86] text-white'
                    : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {sop.sopCode}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-snug text-slate-900 dark:text-white truncate">
                  {sop.sopTitle}
                </p>
                <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {sop.description}
                </p>
                <span className="mt-1 inline-block text-[9.5px] font-semibold text-[#1f5f86] dark:text-sky-300">
                  {sop.steps?.length ?? 0} bước thực hiện
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* THÔNG TIN SOP ĐANG CHỌN & 5 NÚT ĐIỀU HƯỚNG */}
      {activeSop && (
        <div className="mt-4 rounded-xl border border-sky-200/80 bg-sky-50/40 p-3.5 dark:border-sky-900/60 dark:bg-sky-950/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-200/60 pb-3 dark:border-sky-900/60">
            <div>
              <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1f5f86] dark:bg-sky-900 dark:text-sky-300">
                {activeSop.sopCode}
              </span>
              <h5 className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                {activeSop.sopTitle}
              </h5>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNavigate('infographic')}
                className="inline-flex items-center gap-1 rounded-lg bg-[#1f5f86] px-2.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#184b6a] transition-colors cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Chi tiết từng bước</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('flowchart')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#1f5f86] hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <GitGraph className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
                <span>Sơ đồ luồng</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('raci')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#1f5f86] hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
                <span>RACI</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('specs')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#1f5f86] hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <FileCode className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
                <span>Quy chuẩn Specs</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('wireframe')}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-[#1f5f86] hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300 transition-colors cursor-pointer"
              >
                <Layout className="h-3.5 w-3.5" />
                <span>Màn hình mẫu</span>
              </button>
            </div>
          </div>

          {/* DANH SÁCH CÁC BƯỚC THỰC HIỆN CỦA SOP ĐANG CHỌN */}
          {activeSop.steps && activeSop.steps.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Các bước thực thi trong SOP:
              </span>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {activeSop.steps.map((step) => (
                  <div
                    key={step.stepCode}
                    className="flex items-start gap-2 rounded-md bg-white p-2 text-xs shadow-2xs dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="rounded bg-sky-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#1f5f86] dark:bg-sky-900 dark:text-sky-300 shrink-0">
                      {step.stepCode}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {step.actor} · {step.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
