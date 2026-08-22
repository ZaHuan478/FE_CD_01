import React, { useState } from 'react'
import {
  InfographicHeaderBanner,
  InfographicStageNavTabs,
  RecruitmentRequisitionFlow,
  ProbationEvaluationFlow,
  SalaryPromotionFlow,
  OffboardingHandoverFlow,
  OvertimeManagementFlow,
  LeaveManagementFlow,
  HeadcountBudgetFlow,
  DirectOnboardingFlow,
  RehireLegacyEmpFlow,
  LifecycleFoundationFlow
} from './infographic-flow'

interface SopInfographicFlowViewProps {
  sopCode?: string
  workflowId?: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const SopInfographicFlowView: React.FC<SopInfographicFlowViewProps> = ({
  sopCode = 'SOP REC01',
  workflowId,
  isDarkMode,
  onOpenWireframe
}) => {
  const [activeStageTab, setActiveStageTab] = useState<number>(0) // 0: All, 1..5: Specific stage

  // Identify Active SOP Workflow
  const flowKey = `${workflowId ?? ''} ${sopCode}`.toUpperCase()
  const isHeadcountProcess = flowKey.includes('LIFE-00') || flowKey.includes('EMP01') || flowKey.includes('SOP-EMP-01')
  const isRehireProcess = !isHeadcountProcess && (flowKey.includes('EMP03') || flowKey.includes('SOP-EMP-03') || flowKey.includes('REHIRE'))
  const isDirectOnboardingProcess = !isHeadcountProcess && !isRehireProcess && (flowKey.includes('EMP02') || flowKey.includes('SOP-EMP-02') || flowKey.includes('DIRECT'))
  const isRecruitmentProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && (flowKey.includes('LIFE-01') || flowKey.includes('REC') || flowKey.includes('ATS') || flowKey.includes('SOP-TD'))
  const isProfileProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && (flowKey.includes('LIFE-02') || flowKey.includes('EMP04') || flowKey.includes('SOP-NS-04') || flowKey.includes('PROFILE'))
  const isPlacementProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && (flowKey.includes('LIFE-03') || flowKey.includes('EMP11') || flowKey.includes('EMP14') || flowKey.includes('PLACEMENT') || flowKey.includes('POSITION') || flowKey.includes('MOBILITY'))
  const isProbationProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && (flowKey.includes('LIFE-04') || flowKey.includes('PROB') || flowKey.includes('EVAL') || flowKey.includes('EMP05') || flowKey.includes('EMP06') || flowKey.includes('EMP07') || flowKey.includes('INS') || flowKey.includes('SOP-NS-06'))
  const isPromotionProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && (flowKey.includes('LIFE-05') || flowKey.includes('PAY') || flowKey.includes('TAX') || flowKey.includes('SAL') || flowKey.includes('PROM') || flowKey.includes('EMP08') || flowKey.includes('EMP09') || flowKey.includes('EMP10') || flowKey.includes('EMP12') || flowKey.includes('EMP13') || flowKey.includes('SOP-NS-09'))
  const isOffboardingProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && !isPromotionProcess && (flowKey.includes('LIFE-07') || flowKey.includes('OFF') || flowKey.includes('EMP15') || flowKey.includes('EXIT') || flowKey.includes('RESIGN') || flowKey.includes('SOP-NS-16'))
  const isOvertimeProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (flowKey.includes('ATT01') || flowKey.includes('SOP-CC-02') || flowKey.includes('OT'))
  const isLeaveProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && !isOvertimeProcess

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. HEADER BANNER */}
      <InfographicHeaderBanner
        sopCode={sopCode}
        workflowId={workflowId}
        isDarkMode={isDarkMode}
        onOpenWireframe={onOpenWireframe}
      />

      {/* 2. QUICK STAGE FILTER TABS */}
      <InfographicStageNavTabs
        sopCode={sopCode}
        workflowId={workflowId}
        activeStageTab={activeStageTab}
        setActiveStageTab={setActiveStageTab}
      />

      {/* 3. MODULAR WORKFLOW FLOWS */}
      {isHeadcountProcess && (
        <HeadcountBudgetFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isRehireProcess && (
        <RehireLegacyEmpFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isDirectOnboardingProcess && (
        <DirectOnboardingFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {isRecruitmentProcess && (
        <RecruitmentRequisitionFlow
          activeStageTab={activeStageTab}
          isDarkMode={isDarkMode}
        />
      )}

      {(isProfileProcess || isPlacementProcess) && (
        <LifecycleFoundationFlow
          workflowId={workflowId}
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
