import React, { useState, useEffect, useCallback } from 'react'
import type { LifecycleStepperProps } from './lifecycle-stepper/types'
import { STEP_MODULE_MAP, MODULE_FILTER_OPTIONS } from './lifecycle-stepper/data/stepModuleData'
import { LifecycleStepperHeader } from './lifecycle-stepper/components/LifecycleStepperHeader'
import { LifecycleModuleFilter } from './lifecycle-stepper/components/LifecycleModuleFilter'
import { LifecycleClusterGrid } from './lifecycle-stepper/components/LifecycleClusterGrid'
import { LifecycleStepDetailCanvas } from './lifecycle-stepper/components/LifecycleStepDetailCanvas'

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  steps,
  activeStepId,
  onSelectStep
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL')
  // Default to LIFE-03 (Bước 4: Bố trí công tác và vị trí) as requested in the demo specification
  const [previewStepId, setPreviewStepId] = useState<string>(
    activeStepId || 'LIFE-03'
  )

  // Sync preview step when activeStepId prop changes
  useEffect(() => {
    if (activeStepId) {
      setPreviewStepId(activeStepId)
    }
  }, [activeStepId])

  const activeStep = steps.find((s) => s.id === previewStepId) || steps.find((s) => s.id === 'LIFE-03') || steps[0]
  const activeModInfo = STEP_MODULE_MAP[activeStep?.id || 'LIFE-03']
  const currentStepIdx = steps.findIndex((s) => s.id === activeStep?.id)

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setPreviewStepId(steps[currentStepIdx - 1].id)
    }
  }

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setPreviewStepId(steps[currentStepIdx + 1].id)
    }
  }

  // Filter steps based on selected module filter option
  const activeFilterOpt = MODULE_FILTER_OPTIONS.find(
    (m) => m.id === selectedModuleFilter
  )
  const isStepHighlighted = useCallback(
    (stepId: string) => {
      if (selectedModuleFilter === 'ALL') return true
      return activeFilterOpt?.stepIds?.includes(stepId) ?? true
    },
    [selectedModuleFilter, activeFilterOpt]
  )

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-4 sm:p-6 space-y-4 transition-all">
      <div className="rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-violet-900/50 dark:bg-violet-950/25 dark:text-slate-200">
        <strong>Hành trình nhân viên:</strong> chọn từng chặng để xem công việc cần làm, người tham gia, dữ liệu vào và kết quả. Mã <strong>LIFE</strong> chỉ là tên kỹ thuật của từng chặng.
      </div>
      {/* HEADER BAR */}
      <LifecycleStepperHeader
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((prev) => !prev)}
      />

      {/* INTERACTIVE MODULE FILTER BAR */}
      <LifecycleModuleFilter
        selectedModuleFilter={selectedModuleFilter}
        onSelectFilter={setSelectedModuleFilter}
      />

      {/* EXPANDABLE PIPELINE CONTENT */}
      {isExpanded && (
        <div className="pt-1 animate-fadeIn space-y-4">
          {/* 4-Stage Horizontal Pipeline & Cluster Containers (1 - 2 - 3 - 2 ratio) */}
          <LifecycleClusterGrid
            steps={steps}
            previewStepId={previewStepId}
            onSelectStep={setPreviewStepId}
            isStepHighlighted={isStepHighlighted}
          />

          {/* DYNAMIC MASTER-DETAIL STEP CANVAS */}
          {activeStep && activeModInfo && (
            <LifecycleStepDetailCanvas
              activeStep={activeStep}
              activeModInfo={activeModInfo}
              currentStepIdx={currentStepIdx >= 0 ? currentStepIdx : 3}
              totalSteps={steps.length}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onOpenSopDetail={onSelectStep}
            />
          )}

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Chọn một bước ở trên để xem thông tin cần có trước khi thực hiện, kết quả và các hệ thống liên quan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
