import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { LifecycleJourneyHeader } from './LifecycleJourneyHeader'
import { LifecycleScenarioSelector } from './LifecycleScenarioSelector'
import { LifecycleStagePipeline } from './LifecycleStagePipeline'
import { LifecycleStageWorkbench } from './LifecycleStageWorkbench'
import { LifecycleImpactMatrix } from './LifecycleImpactMatrix'
import { getStageDefinition, getStageSops } from './lifecycleJourneySelectors'
import { LIFECYCLE_STAGE_ORDER } from './lifecycleJourneyData'
import type { LifecycleStageId, ScenarioId } from './types'

const isValidStageId = (value: string | null): value is LifecycleStageId => {
  return Boolean(value && LIFECYCLE_STAGE_ORDER.includes(value as LifecycleStageId))
}

const isValidScenarioId = (value: string | null): value is ScenarioId => {
  return ['all', 'new-hire', 'direct-hire', 'transfer', 'offboarding'].includes(value as ScenarioId)
}

export const EmployeeLifecycleJourneyView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const stageParam = searchParams.get('stage')
  const scenarioParam = searchParams.get('scenario')
  const sopParam = searchParams.get('sop')

  const activeStage: LifecycleStageId = isValidStageId(stageParam) ? stageParam : 'LIFE-00'
  const activeScenario: ScenarioId = isValidScenarioId(scenarioParam) ? scenarioParam : 'all'

  // Update query params when state changes
  const handleSelectStage = (stageId: LifecycleStageId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('stage', stageId)
      const currentSops = getStageSops(stageId)
      if (currentSops.length > 0) {
        next.set('sop', currentSops[0].sopCode)
      } else {
        next.delete('sop')
      }
      return next
    })
  }

  const handleSelectScenario = (scenarioId: ScenarioId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('scenario', scenarioId)
      return next
    })
  }

  const handleSelectSop = (sopCode: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sop', sopCode)
      return next
    })
  }

  const stageDefinition = getStageDefinition(activeStage)
  const currentSops = getStageSops(activeStage)
  const activeSopCode = sopParam && currentSops.some((s) => s.sopCode === sopParam) ? sopParam : currentSops[0]?.sopCode

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={() => navigate('/employee-lifecycle')}
          className="flex items-center gap-1 hover:text-[#1f5f86] dark:hover:text-white transition-colors cursor-pointer"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Bản đồ HRMS</span>
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-bold text-slate-900 dark:text-white">
          Vòng đời nhân viên
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-mono font-bold text-[#1f5f86] dark:text-sky-300">
          {activeStage}: {stageDefinition.shortTitle}
        </span>
      </nav>

      {/* KHU VỰC 1: HEADER THỐNG KÊ ĐỘNG */}
      <LifecycleJourneyHeader />

      {/* KHU VỰC 1B: BỘ CHỌN KỊCH BẢN NGHIỆP VỤ */}
      <LifecycleScenarioSelector
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* KHU VỰC 2: PIPELINE 8 CHẶNG LIÊN TỤC */}
      <LifecycleStagePipeline
        activeStage={activeStage}
        activeScenario={activeScenario}
        onSelectStage={handleSelectStage}
      />

      {/* KHU VỰC 3: STAGE WORKBENCH (2 CỘT: 32% NGỮ CẢNH & PHÁP LÝ / 68% LUỒNG & SOP) */}
      <LifecycleStageWorkbench
        stage={stageDefinition}
        selectedSopCode={activeSopCode}
        onSelectSop={handleSelectSop}
      />

      {/* KHU VỰC 4: TÁC ĐỘNG LIÊN PHÂN HỆ (THU GỌN MẶC ĐỊNH) */}
      <LifecycleImpactMatrix stage={stageDefinition} />
    </div>
  )
}
