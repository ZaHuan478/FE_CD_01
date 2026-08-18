import type { DetailItem } from '../../../types/employee-lifecycle'

export interface WorkflowDetailPageProps {
  item: DetailItem
  onBack: () => void
  onOpenWireframe?: (item: DetailItem) => void
}

export interface SopSubStep {
  stepCode: string
  title: string
  actor: string
  location: string
  timing: string
  typeCode: 'N' | 'A' | 'C' | 'M'
  description: string
  fieldsChecklist?: string[]
}

export interface SopSubProcess {
  sopCode: string
  sopTitle: string
  sopCategory: string
  description: string
  steps: SopSubStep[]
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
