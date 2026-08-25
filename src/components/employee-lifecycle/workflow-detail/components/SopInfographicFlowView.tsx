import React from 'react'
import { InfographicHeaderBanner, SopProcessDetailView } from './infographic-flow'
import type { SopSubProcess } from '../types'

interface SopInfographicFlowViewProps {
  sopCode?: string
  workflowId?: string
  process?: SopSubProcess
  activeStep?: number
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const SopInfographicFlowView: React.FC<SopInfographicFlowViewProps> = ({
  sopCode = 'SOP REC01',
  process,
  activeStep = 0,
  isDarkMode,
  onOpenWireframe
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. HEADER BANNER */}
      <InfographicHeaderBanner
        sopCode={sopCode}
        process={process}
        isDarkMode={isDarkMode}
        onOpenWireframe={onOpenWireframe}
      />

      {/* ONE CONSISTENT DETAIL VIEW FOR EVERY SOP PROCESS */}
      {process ? (
        <SopProcessDetailView
          process={process}
          activeStageTab={activeStep}
          isDarkMode={isDarkMode}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          Chưa có cấu hình SOP chi tiết cho quy trình {sopCode}.
        </div>
      )}
    </div>
  )
}
