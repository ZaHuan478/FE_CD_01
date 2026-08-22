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
  const [previewStepId, setPreviewStepId] = useState<string>(
    activeStepId || (steps[0]?.id ?? 'LIFE-01')
  )

  // Sync preview step when activeStepId prop changes
  useEffect(() => {
    if (activeStepId) {
      setPreviewStepId(activeStepId)
    }
  }, [activeStepId])

  const activeStep = steps.find((s) => s.id === previewStepId) || steps[0]
  const activeModInfo = STEP_MODULE_MAP[activeStep?.id || 'LIFE-01']
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5 transition-all duration-300 hover:shadow-md">
      {/* HEADER BAR */}
      <LifecycleStepperHeader
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((prev) => !prev)}
      />

      {/* INTERACTIVE MODULE FILTER LEGEND BAR */}
      <LifecycleModuleFilter
        selectedModuleFilter={selectedModuleFilter}
        onSelectFilter={setSelectedModuleFilter}
      />

      {/* EXPANDABLE PIPELINE CONTENT */}
      {isExpanded && (
        <div className="pt-1 animate-fadeIn space-y-5">
          {/* 7-Step Horizontal Pipeline & 3 Cluster Containers */}
          <LifecycleClusterGrid
            steps={steps}
            previewStepId={previewStepId}
            onSelectStep={setPreviewStepId}
            isStepHighlighted={isStepHighlighted}
          />

          {/* DYNAMIC MASTER-DETAIL STEP CANVAS (EXPANDED INSPECTOR) */}
          {activeStep && activeModInfo && (
            <LifecycleStepDetailCanvas
              activeStep={activeStep}
              activeModInfo={activeModInfo}
              currentStepIdx={currentStepIdx}
              totalSteps={steps.length}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onOpenSopDetail={onSelectStep}
            />
          )}

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
              * Bấm chọn bất kỳ bước nào trong 7 bước phía trên để xem nhanh Dữ liệu Đầu vào, Đầu ra và Phân hệ liên quan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
