import React, { useState, useEffect } from 'react'
import type { Policy } from './types'
import { PolicyDetailHeader } from './components/PolicyDetailHeader'
import { PolicySummarySection } from './components/PolicySummarySection'
import { PolicyRuleSection } from './components/PolicyRuleSection'
import { PolicyProcedureSection } from './components/PolicyProcedureSection'
import { PolicyConsequencesSection } from './components/PolicyConsequencesSection'
import { PolicyRelatedProcesses } from './components/PolicyRelatedProcesses'
import { PolicyOriginalNotice } from './components/PolicyOriginalNotice'
import { PolicyAcknowledgementDemo } from './components/PolicyAcknowledgementDemo'
import { PolicyRuleSimulator } from './components/PolicyRuleSimulator'

interface PolicyDetailPageProps {
  policy: Policy
  onBack: () => void
}

export const PolicyDetailPage: React.FC<PolicyDetailPageProps> = ({ policy, onBack }) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  // Scroll to top when policy opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [policy.id])

  const initialSimulatorTab =
    policy.id === 'POL-ATT-02'
      ? 'overtime'
      : policy.id === 'POL-ATT-03'
      ? 'late-early'
      : 'leave'

  return (
    <div className="space-y-5 animate-fadeIn max-w-[1440px] mx-auto pb-12">
      {/* 1. Header Banner */}
      <PolicyDetailHeader
        policy={policy}
        onBack={onBack}
        onOpenSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
      />

      {/* Optional In-Place Rule Simulator */}
      {isSimulatorOpen && (
        <div className="animate-fadeIn">
          <PolicyRuleSimulator
            initialTab={initialSimulatorTab}
            onClose={() => setIsSimulatorOpen(false)}
          />
        </div>
      )}

      {/* 2. Executive Summary & Employee Checklist */}
      <PolicySummarySection policy={policy} />

      {/* 3. System Rules & Limits */}
      <PolicyRuleSection policy={policy} />

      {/* 4. HRMS Step-by-Step Procedures */}
      <PolicyProcedureSection policy={policy} />

      {/* 5. Non-compliance & System Consequences */}
      <PolicyConsequencesSection policy={policy} />

      {/* 6. Linked SOPs and Workflow Navigation */}
      <PolicyRelatedProcesses policy={policy} />

      {/* 7. Collapsible Original Notice Document */}
      <PolicyOriginalNotice policy={policy} />

      {/* 8. Acknowledgement In-Session Demo */}
      <PolicyAcknowledgementDemo policy={policy} />
    </div>
  )
}
