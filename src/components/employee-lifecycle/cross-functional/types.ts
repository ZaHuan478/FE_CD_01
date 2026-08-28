import type { SopSubProcess } from '../workflow-detail/types'

export type CrossFunctionalDomain =
  | 'time_leave'
  | 'contract'
  | 'movement'
  | 'reward'
  | 'discipline'
  | 'learning'
  | 'performance'
  | 'talent'

export type CrossFunctionalFrequency =
  | 'daily'
  | 'event'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'mixed'

export interface CrossFunctionalActorsMatrix {
  proposer: string
  reviewer?: string
  approver: string
  executor: string
  notified?: string
}

export interface CrossFunctionalIntegration {
  module: string
  moduleName: string
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'sky' | 'indigo' | 'slate'
  description: string
}

export interface CrossFunctionalExceptionRule {
  scenario: string
  handling: string
}

export interface CrossFunctionalAuditRule {
  logEvent: string
  notificationTarget: string
  notificationChannel: string
}

export interface CrossFunctionalModuleDefinition {
  id: string // e.g. 'CF-01'
  code: string // e.g. 'CF-01'
  title: string
  shortTitle: string
  subtitle: string
  description: string
  businessPurpose: string
  triggerSummary: string
  iconName: string
  domain: CrossFunctionalDomain
  domainLabel: string
  frequency: CrossFunctionalFrequency
  frequencyLabel: string
  sla: string
  actorsMatrix: CrossFunctionalActorsMatrix
  inputs: string[]
  outputs: string[]
  upstreamModules: string[]
  downstreamModules: string[]
  integrations: CrossFunctionalIntegration[]
  masterDataIds: string[]
  sopBadge: string
  sopIds: string[]
  sopTitles: string[]
  exceptionHandling: CrossFunctionalExceptionRule[]
  auditAndNotification: CrossFunctionalAuditRule[]
  uiFields: string[]
  sopProcesses: SopSubProcess[]
}
