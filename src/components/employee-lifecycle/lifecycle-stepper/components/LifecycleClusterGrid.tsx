import React from 'react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import { CLUSTERS } from '../../data/lifecycleClustersData'
import { LifecycleStepCard } from './LifecycleStepCard'

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
    <div className="py-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-3.5">
        {CLUSTERS.map((cluster) => {
          const clusterSteps = steps.filter((s) =>
            cluster.stepIds.includes(s.id)
          )

          return (
            <div
              key={cluster.id}
              className={`${cluster.colSpan} border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between`}
            >
              {/* Cluster Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/70 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate pr-1">
                  {cluster.title}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                  {cluster.badgeText}
                </span>
              </div>

              {/* Steps inside Cluster */}
              <div className={`grid ${cluster.subGridCols} gap-2.5 h-full`}>
                {clusterSteps.map((step) => {
                  const isSelected = previewStepId === step.id
                  const highlighted = isStepHighlighted(step.id)

                  return (
                    <LifecycleStepCard
                      key={step.id}
                      step={step}
                      isSelected={isSelected}
                      isHighlighted={highlighted}
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
  )
}

