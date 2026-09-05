import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LIFECYCLE_STAGE_ORDER, LIFECYCLE_STAGES } from '../../../entities/lifecycle/model/journey/lifecycleJourneyData'
import { getStageSops, isStageHighlightedInScenario } from '../../../entities/lifecycle/lib/lifecycleJourneySelectors'
import type { LifecycleStageId, ScenarioId } from '../../../entities/lifecycle/model/journey/types'

interface LifecycleStagePipelineProps {
  activeStage: LifecycleStageId
  activeScenario: ScenarioId
  onSelectStage: (stageId: LifecycleStageId) => void
}

export const LifecycleStagePipeline: React.FC<LifecycleStagePipelineProps> = ({
  activeStage,
  activeScenario,
  onSelectStage
}) => {
  const availableStageOrder = LIFECYCLE_STAGE_ORDER.filter((stageId) => Boolean(LIFECYCLE_STAGES[stageId]))
  const currentIdx = availableStageOrder.indexOf(activeStage)
  const pipelineRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    if (currentIdx > 0) {
      onSelectStage(availableStageOrder[currentIdx - 1])
    }
  }

  const handleNext = () => {
    if (currentIdx >= 0 && currentIdx < availableStageOrder.length - 1) {
      onSelectStage(availableStageOrder[currentIdx + 1])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, stageId: LifecycleStageId, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelectStage(stageId)
    } else if (e.key === 'ArrowRight' && index < availableStageOrder.length - 1) {
      e.preventDefault()
      onSelectStage(availableStageOrder[index + 1])
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      onSelectStage(availableStageOrder[index - 1])
    }
  }

  return (
    <section
      aria-label="Pipeline 8 chặng vòng đời nhân viên"
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
            Tiến trình 8 chặng liên tục (Pipeline):
          </span>
          <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
            Chặng {currentIdx + 1} / {availableStageOrder.length}
          </span>
        </div>

        {/* NÚT ĐIỀU HƯỚNG TRƯỚC / SAU */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentIdx <= 0}
            onClick={handlePrev}
            aria-label="Chuyển đến chặng trước"
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chặng trước</span>
          </button>
          <button
            type="button"
            disabled={currentIdx < 0 || currentIdx === availableStageOrder.length - 1}
            onClick={handleNext}
            aria-label="Chuyển đến chặng sau"
            className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <span className="hidden sm:inline">Chặng sau</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* PIPELINE CONTAINER - HORIZONTAL SCROLL ON TABLET / DESKTOP */}
      <div
        ref={pipelineRef}
        role="tablist"
        aria-label="Danh sách các chặng vòng đời"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 overflow-x-auto no-scrollbar"
      >
        {availableStageOrder.map((stageId, index) => {
          const stage = LIFECYCLE_STAGES[stageId]
          const isSelected = stageId === activeStage
          const isHighlighted = isStageHighlightedInScenario(stageId, activeScenario)
          const sopsCount = getStageSops(stageId).length

          return (
            <button
              key={stageId}
              role="tab"
              id={`tab-${stageId}`}
              aria-selected={isSelected}
              aria-controls={`panel-${stageId}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectStage(stageId)}
              onKeyDown={(e) => handleKeyDown(e, stageId, index)}
              className={`group relative flex flex-col justify-between rounded-xl p-3 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1f5f86] focus-visible:outline-offset-2 ${
                isSelected
                  ? 'bg-[#1f5f86] text-white shadow-md ring-2 ring-[#2e8bbd]'
                  : isHighlighted
                  ? 'border border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80 shadow-2xs'
                  : 'border border-slate-200/60 bg-slate-50/60 text-slate-500 opacity-60 hover:opacity-100 dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-400'
              }`}
            >
              {/* TOP: STAGE CODE & DYNAMIC SOP COUNT */}
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-mono text-[10px] font-black tracking-wider ${
                      isSelected ? 'text-sky-200' : 'text-[#1f5f86] dark:text-sky-300'
                    }`}
                  >
                    {stageId}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300'
                    }`}
                  >
                    {sopsCount} SOP
                  </span>
                </div>

                {/* STAGE TITLE */}
                <h4
                  className={`mt-1.5 text-xs font-black leading-snug line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {stage.shortTitle}
                </h4>

                {/* ONE LINE DESCRIPTION */}
                <p
                  className={`mt-1 text-[10px] leading-tight line-clamp-2 ${
                    isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {stage.oneLineSummary}
                </p>
              </div>

              {/* BOTTOM: PRIMARY SUBSYSTEM */}
              <div className="mt-2.5 pt-2 border-t border-current/15 flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold truncate ${
                    isSelected ? 'text-sky-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {stage.primarySubsystem.split('(')[0].trim()}
                </span>
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    isSelected ? 'bg-white text-[#1f5f86]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  {index + 1}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
