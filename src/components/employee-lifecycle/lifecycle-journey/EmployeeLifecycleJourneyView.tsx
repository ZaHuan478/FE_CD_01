import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Home, ArrowRight } from 'lucide-react'
import { LifecycleJourneyHeader } from './LifecycleJourneyHeader'
import { LifecycleScenarioSelector } from './LifecycleScenarioSelector'
import { LifecycleStagePipeline } from './LifecycleStagePipeline'
import { LifecycleStageWorkbench } from './LifecycleStageWorkbench'
import { LifecycleImpactMatrix } from './LifecycleImpactMatrix'
import { getDefaultStageId, getStageDefinition, getStageSops } from './lifecycleJourneySelectors'
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

  const activeStage = isValidStageId(stageParam) ? stageParam : getDefaultStageId()
  const activeScenario: ScenarioId = isValidScenarioId(scenarioParam) ? scenarioParam : 'all'

  React.useEffect(() => {
    if (!activeStage || stageParam === activeStage) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('stage', activeStage)
      next.delete('sop')
      return next
    }, { replace: true })
  }, [activeStage, setSearchParams, stageParam])

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

  const stageDefinition = activeStage ? getStageDefinition(activeStage) : undefined
  const currentSops = activeStage ? getStageSops(activeStage) : []
  const activeSopCode = sopParam && currentSops.some((s) => s.sopCode === sopParam) ? sopParam : currentSops[0]?.sopCode

  if (!activeStage || !stageDefinition) {
    return (
      <section
        role="status"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900/60 dark:bg-amber-950/30"
      >
        <h2 className="text-sm font-black text-slate-900 dark:text-white">
          Chưa có chặng vòng đời phù hợp
        </h2>
        <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
          Tài khoản hiện tại chưa được cấp quyền xem dữ liệu của chặng vòng đời nào.
        </p>
        <button
          type="button"
          onClick={() => navigate('/employee-lifecycle')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1f5f86] px-4 py-2 text-xs font-bold text-white hover:bg-[#174968]"
        >
          <Home className="h-3.5 w-3.5" />
          Về bản đồ HRMS
        </button>
      </section>
    )
  }

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

      {/* KHU VỰC 5: CHUYỂN TIẾP SANG TẦNG 3 (NGHIỆP VỤ PHÁT SINH) */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
              TẦNG 3
            </span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Nghiệp vụ phát sinh trong quá trình làm việc (CF-01 ➔ CF-08)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Khác với 8 chặng vòng đời tuần tự, Tầng 3 xử lý các sự kiện phát sinh bất kỳ lúc nào: Chấm công, Tái ký HĐ, Điều chuyển, Khen thưởng, Kỷ luật, Đào tạo, KPI và Nhân tài.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/employee-lifecycle/operations')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-[#1f5f86] hover:bg-[#174968] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
        >
          <span>Khám phá 8 Nghiệp vụ Tầng 3</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
