import type { DetailItem } from '../../module/model/lifecycle.types'

export interface WorkflowDetailPageProps {
  item: DetailItem
  onBack: () => void
  onOpenWireframe?: (item: DetailItem) => void
}

export interface SopSubStep {
  stepCode: string
  sourceCode?: string
  sourceRow?: number
  sourceTypeCode?: string
  title: string
  actor: string
  location: string
  timing: string
  typeCode: 'N' | 'A' | 'C' | 'M' | ''
  description: string
  fieldsChecklist?: string[]
}

export interface SopSubProcess {
  sopCode: string
  sopTitle: string
  sopCategory: string
  description: string
  inputs?: string[]
  outputs?: string[]
  rules?: string[]
  steps: SopSubStep[]
  sourceNote?: string
  notes?: string[]
}

export interface RoleDataFlow {
  roleType: 'candidate' | 'hr'
  roleTitle: string
  actorLabel: string
  badgeColorLight: string
  badgeColorDark: string
  bgLight: string
  bgDark: string
  borderLight: string
  borderDark: string
  inputs: {
    title: string
    description: string
    items: string[]
  }
  outputs: {
    title: string
    description: string
    items: string[]
  }
}

export interface SwimlaneStep {
  id: string
  lane: 'candidate' | 'hr'
  stageIndex: number // 1, 2, 3... indicates horizontal timeline column
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  actionTag: string
  actionTagEn: string
  interactionType?: 'upload_portal' | 'send_offer' | 'confirm_accept' | 'auto_ticket' | 'sync_ins'
  interactionLabel?: string
  interactionLabelEn?: string
  details?: string[]
}

export interface SwimlaneSequenceData {
  summary: string
  summaryEn: string
  candidateSteps: SwimlaneStep[]
  hrSteps: SwimlaneStep[]
}
