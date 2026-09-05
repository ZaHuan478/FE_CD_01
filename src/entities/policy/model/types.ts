/**
 * types.ts
 * Type definitions for Trung tâm Quy định & Tuân thủ (Policies & Compliance)
 */

export type PolicyCategory =
  | 'employee-profile'
  | 'attendance-leave'
  | 'overtime'
  | 'workplace-conduct'
  | 'internal-communications'

export type PolicyType =
  | 'system-rule'
  | 'internal-regulation'
  | 'mandatory-action'
  | 'guideline'
  | 'communication'

export type PolicyStatus = 'active' | 'upcoming' | 'expired' | 'draft'

export type PolicySeverity = 'info' | 'mandatory' | 'warning' | 'critical'

export type RuleKind = 'limit' | 'deadline' | 'approval' | 'validation' | 'penalty'

export interface PolicyRule {
  id: string
  label: string
  description: string
  condition?: string
  outcome: string
  unit?: string
  value?: number | string
  ruleKind: RuleKind
}

export interface PolicyProcedureStep {
  stepNumber: number
  title: string
  description: string
  actor: string
  systemAction?: string
}

export interface PolicyConsequence {
  id: string
  type: 'system-block' | 'verification-required' | 'disciplinary-info'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface PolicyOriginalNotice {
  noticeNumber?: string
  issuedDate: string
  subject: string
  contentSections: Array<{
    heading?: string
    paragraphs: string[]
  }>
  attachments?: string[]
}

export interface Policy {
  id: string
  code: string
  title: string
  titleEn: string
  summary: string
  summaryEn: string
  category: PolicyCategory
  type: PolicyType
  status: PolicyStatus
  severity: PolicySeverity
  effectiveFrom: string
  effectiveTo?: string
  issuingDepartment: string
  applicableAudience: string
  responsibilities: {
    employee: string[]
    manager?: string[]
    hr?: string[]
  }
  rules: PolicyRule[]
  procedures: PolicyProcedureStep[]
  consequences: PolicyConsequence[]
  relatedProcessCodes: string[]
  relatedSopCodes: string[]
  tags: string[]
  originalNotice: PolicyOriginalNotice
  version: string
  lastUpdated: string
  requiresAcknowledgement: boolean
  acknowledgementLabel?: string
}

export interface PolicyFilterState {
  searchTerm: string
  category: PolicyCategory | 'all'
  type: PolicyType | 'all'
  status: PolicyStatus | 'all'
  severity: PolicySeverity | 'all'
}

// Simulator Types
export interface LeaveSimulatorInput {
  days: number
  advanceNoticeDays: number
  isApproved: boolean
}

export interface LeaveSimulatorResult {
  isValid: boolean
  requiredNoticeDays: number
  noticeMet: boolean
  approvalMet: boolean
  autoCancelRisk: boolean
  statusBadge: 'success' | 'warning' | 'error'
  statusText: string
  messages: string[]
}

export interface OvertimeSimulatorInput {
  hoursRequested: number
  dailyTotalHours: number
  monthlyTotalHours: number
  yearlyTotalHours: number
  isUrgent: boolean
  hoursSinceUrgentEvent: number
  urgentRequestsThisMonth: number
}

export interface OvertimeSimulatorResult {
  isValid: boolean
  dailyLimitExceeded: boolean
  monthlyLimitExceeded: boolean
  yearlyLimitExceeded: boolean
  urgentDeadlineExceeded: boolean
  urgentCountExceeded: boolean
  statusBadge: 'success' | 'warning' | 'error'
  statusText: string
  messages: string[]
}

export interface LateEarlySimulatorInput {
  minutes: number
  hasApprovedRequest: boolean
}

export interface LateEarlySimulatorResult {
  minutes: number
  kpiPoints: number
  hasApprovedRequest: boolean
  warningText: string
  statusBadge: 'success' | 'warning' | 'error'
  statusText: string
  messages: string[]
}
