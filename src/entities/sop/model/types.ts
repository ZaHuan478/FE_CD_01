import type { DetailItem } from '../../module/model/lifecycle.types'

export interface WorkflowDetailPageProps {
  item: DetailItem
  onBack: () => void
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
  inputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }> | string[]
  outputs?: Array<{ id?: string; name: string; description?: string | null; required?: boolean }> | string[]
  condition?: string
  branchLabel?: string
  imageUrl?: string | null
  media?: Array<{
    id: string
    sourceMediaId?: string
    storageKey?: string
    url?: string
    caption?: string
    role?: 'cover' | 'illustration' | 'screenshot' | 'form' | 'diagram'
    sourcePage?: number
    sourceSubPath?: string
    sortOrder: number
  }>
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
  documentId?: string
  version?: number
  moduleIds?: string[]
  primaryModuleId?: string
  relatedDocuments?: string[]
  transitions?: Array<{
    id?: string
    fromStepId?: string | null
    toStepId?: string | null
    kind: 'normal' | 'conditional' | 'return' | 'parallel_fork' | 'parallel_join' | 'subprocess'
    condition?: string | null
    branchLabel?: string | null
    sortOrder?: number
  }>
  sourceNote?: string
  notes?: string[]
  access?: {
    classification: 'internal' | 'restricted' | 'confidential' | 'highly-restricted'
    sopViewers: string[]
    recordViewers: string[]
    excluded: string[]
  }
  documentControl?: {
    owner: string
    reviewers: string[]
    approver: string
    reviewCycle: string
  }
  approvalFlow?: Array<{
    order: number
    actor: string
    decision: string
    condition?: string
    outcome: string
  }>
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
