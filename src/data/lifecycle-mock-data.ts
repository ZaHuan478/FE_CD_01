import { getRuntimeDataset } from '../database/runtimeData'

export type SourceStatus = 'official' | 'designed' | 'draft' | 'not_available' | 'placeholder'
export type ProcessStatus = 'official' | 'designed' | 'draft' | 'not_available'
export type ActorsMatrix = { proposer: string; approver: string; executor: string }
export type IntegrationModule = {
  module: 'ATT' | 'INS' | 'PAY' | 'TAX' | 'IT' | 'BANK' | 'ORG' | 'PERF' | 'TRN' | 'RECRUIT' | 'OFFBOARD' | 'PROFILE' | 'ALM' | 'BI' | 'DOC'
  moduleName: string
  color: string
  description: string
}
export type SOPFullNode = {
  id: string
  type: 'lifecycle' | 'cross' | 'master' | 'support'
  code: string
  title: string
  subtitle: string
  contextTrigger: string
  actorsMatrix: ActorsMatrix
  inputs: string[]
  outputs: string[]
  integrations: IntegrationModule[]
  sopBadge: string
  sopIds: string[]
  sopTitles?: string[]
  process: { status: ProcessStatus; steps: string[]; source: string }
  uiFields: string[]
}

export const lifecycleMockNodes = getRuntimeDataset<{
  lifecycleMockNodes: Record<string, SOPFullNode>
}>('legacy.data').lifecycleMockNodes
