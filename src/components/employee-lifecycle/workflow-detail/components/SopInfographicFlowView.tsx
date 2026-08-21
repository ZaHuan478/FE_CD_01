import React, { useState } from 'react'
import {
  InfographicHeaderBanner,
  InfographicStageNavTabs,
  RecruitmentRequisitionFlow,
  ProbationEvaluationFlow,
  SalaryPromotionFlow,
  OffboardingHandoverFlow,
  OvertimeManagementFlow,
  LeaveManagementFlow
} from './infographic-flow'

interface SopInfographicFlowViewProps {
  sopCode?: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const SopInfographicFlowView: React.FC<SopInfographicFlowViewProps> = ({
  sopCode = 'SOP REC01',
  isDarkMode,
  onOpenWireframe
}) => {
  const [activeStageTab, setActiveStageTab] = useState<number>(0) // 0: All, 1..5: Specific stage

  // Identify Active SOP Workflow
  const isRecruitmentProcess = sopCode.includes('REC') || sopCode.includes('SOP-TD') || sopCode.includes('EMP01') || sopCode.includes('EMP02') || sopCode.includes('LIFE-01')
  const isProbationProcess = !isRecruitmentProcess && (sopCode.includes('PROB') || sopCode.includes('EVAL') || sopCode.includes('EMP05') || sopCode.includes('EMP06') || sopCode.includes('LIFE-04') || sopCode.includes('SOP-NS-06'))
  const isPromotionProcess = !isRecruitmentProcess && !isProbationProcess && (sopCode.includes('PROM') || sopCode.includes('EMP08') || sopCode.includes('EMP11') || sopCode.includes('LIFE-05') || sopCode.includes('LIFE-03') || sopCode.includes('SOP-NS-09'))
  const isOffboardingProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && (sopCode.includes('OFF') || sopCode.includes('EMP15') || sopCode.includes('LIFE-07') || sopCode.includes('SOP-NS-16'))
  const isOvertimeProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (sopCode.includes('ATT01') || sopCode.includes('SOP-CC-02') || sopCode.includes('OT'))
  const isLeaveProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && !isOvertimeProcess

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. HEADER BANNER */}
      <InfographicHeaderBanner
        sopCode={sopCode}
        isDarkMode={isDarkMode}
        onOpenWireframe={onOpenWireframe}
      />

      {/* 2. QUICK STAGE FILTER TABS */}
      <InfographicStageNavTabs
        sopCode={sopCode}
        activeStageTab={activeStageTab}
        setActiveStageTab={setActiveStageTab}
      />

      {/* 3. MODULAR WORKFLOW FLOWS */}
      {isRecruitmentProcess && (
        <RecruitmentRequisitionFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isProbationProcess && (
        <ProbationEvaluationFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isPromotionProcess && (
        <SalaryPromotionFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isOffboardingProcess && (
        <OffboardingHandoverFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isOvertimeProcess && (
        <OvertimeManagementFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isLeaveProcess && (
        <LeaveManagementFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}
