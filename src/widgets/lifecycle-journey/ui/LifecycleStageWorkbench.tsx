import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  Layout
} from 'lucide-react'
import { LifecycleStageContextPanel } from './LifecycleStageContextPanel'
import { LifecycleStageDataFlow } from './LifecycleStageDataFlow'
import { LifecycleStageSopList } from './LifecycleStageSopList'
import { getStageSops } from '../../../entities/lifecycle/lib/lifecycleJourneySelectors'
import type { LifecycleStageDefinition } from '../../../entities/lifecycle/model/journey/types'

interface LifecycleStageWorkbenchProps {
  stage: LifecycleStageDefinition
  selectedSopCode?: string
  onSelectSop: (sopCode: string) => void
}

export const LifecycleStageWorkbench: React.FC<LifecycleStageWorkbenchProps> = ({
  stage,
  selectedSopCode,
  onSelectSop
}) => {
  const navigate = useNavigate()
  const sops = getStageSops(stage.id)

  const handleOpenWireframe = () => {
    navigate(`/employee-lifecycle/wireframe/${stage.id}`)
  }

  return (
    <article
      id={`panel-${stage.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${stage.id}`}
      className="space-y-4"
    >
      {/* WORKBENCH TOP HERO BANNER */}
      <header className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#1f5f86] px-2 py-0.5 font-mono text-[11px] font-black text-white shadow-2xs">
                {stage.id}
              </span>
              <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                MÃ SOP: {stage.code}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Phân hệ: <strong className="text-slate-700 dark:text-slate-200">{stage.primarySubsystem}</strong>
              </span>
            </div>
            <h3 className="mt-1.5 text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {stage.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              {stage.oneLineSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenWireframe}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-bold text-[#1f5f86] hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Layout className="h-4 w-4" />
              <span>Mở màn hình mẫu (Wireframe)</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      {/* 2-COLUMN WORKBENCH GRID: LEFT (30-32%) / RIGHT (68-70%) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[32%_68%] items-start">
        {/* CỘT TRÁI: NGỮ CẢNH, TRÁCH NHIỆM, TRẠNG THÁI & PHÁP LÝ */}
        <LifecycleStageContextPanel stage={stage} />

        {/* CỘT PHẢI: LUỒNG DỮ LIỆU 3 KHỐI & DANH SÁCH SOP */}
        <div className="space-y-4">
          <LifecycleStageDataFlow stage={stage} />
          <LifecycleStageSopList
            stageId={stage.id}
            sops={sops}
            selectedSopCode={selectedSopCode}
            onSelectSop={onSelectSop}
          />
        </div>
      </div>
    </article>
  )
}
