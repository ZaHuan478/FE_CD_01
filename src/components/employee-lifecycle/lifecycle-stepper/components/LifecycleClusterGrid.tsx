import React from 'react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import { CLUSTERS } from '../../data/lifecycleClustersData'
import { LifecycleStepCard } from './LifecycleStepCard'
import { STEP_MODULE_MAP } from '../data/stepModuleData'

interface LifecycleClusterGridProps {
  steps: LifecycleStep[]
  previewStepId: string
  onSelectStep: (stepId: string) => void
  isStepHighlighted: (stepId: string) => boolean
}

export const LifecycleClusterGrid: React.FC<LifecycleClusterGridProps> = ({
  steps,
  previewStepId,
  onSelectStep,
  isStepHighlighted
}) => {
  return (
    <div className="overflow-x-auto no-scrollbar py-2">
      <div className="min-w-[1020px] lg:min-w-0 relative">
        {/* Horizontal Connecting Timeline passing across all cards */}
        <div className="absolute top-[110px] left-[55px] right-[55px] h-[3px] bg-slate-300/80 dark:bg-slate-800 z-0 hidden lg:block rounded-full" />

        {/* 8-Column Layout Wrapping the Cluster Grouping Containers */}
        <div className="grid grid-cols-8 gap-3 sm:gap-4 relative z-10 items-stretch">
          {CLUSTERS.map((cluster) => {
            const clusterSteps = steps.filter((s) =>
              cluster.stepIds.includes(s.id)
            )

            return (
              <div
                key={cluster.id}
                className={`${cluster.colSpan} ${cluster.bgClass} ${cluster.borderClass} border rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xs`}
              >
                {/* Cluster Container Header */}
                <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                  <h3
                    className={`text-xs font-extrabold uppercase tracking-wider ${cluster.headerTextClass}`}
                  >
                    {cluster.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cluster.headerBadgeClass}`}
                  >
                    {cluster.badgeText}
                  </span>
                </div>

                {/* Step Cards inside Cluster */}
                <div
                  className={`grid ${cluster.subGridCols} gap-2.5 sm:gap-3 items-stretch h-full`}
                >
                  {clusterSteps.map((step) => {
                    const isSelected = previewStepId === step.id
                    const mod = STEP_MODULE_MAP[step.id]
                    const highlighted = isStepHighlighted(step.id)

                    return (
                      <LifecycleStepCard
                        key={step.id}
                        step={step}
                        isSelected={isSelected}
                        isHighlighted={highlighted}
                        modInfo={mod}
                        sopBadgeColor={cluster.sopBadgeColor}
                        onSelect={onSelectStep}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
