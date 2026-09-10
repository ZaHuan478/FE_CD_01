import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { LifecycleJourneyHeader } from './LifecycleJourneyHeader'
import { LifecycleStagePipeline } from './LifecycleStagePipeline'
import { LifecycleStageWorkbench } from './LifecycleStageWorkbench'
import { LifecycleImpactMatrix } from './LifecycleImpactMatrix'
import { getDefaultStageId, getStageDefinition, getStageSops } from '../../../entities/lifecycle/lib/lifecycleJourneySelectors'
import { getLIFECYCLE_STAGE_ORDER } from '../../../entities/lifecycle/model/journey/lifecycleJourneyData'
import type { LifecycleStageId } from '../../../entities/lifecycle/model/journey/types'

const isValidStageId = (value: string | null): value is LifecycleStageId => {
  return Boolean(value && getLIFECYCLE_STAGE_ORDER().includes(value as LifecycleStageId))
}

export const EmployeeLifecycleJourneyView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const stageParam = searchParams.get('stage')
  const sopParam = searchParams.get('sop')

  const activeStage = isValidStageId(stageParam) ? stageParam : getDefaultStageId()

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

      {/* KHU VỰC 2: PIPELINE 8 CHẶNG LIÊN TỤC */}
      <LifecycleStagePipeline
        activeStage={activeStage}
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
    </div>
  )
}
