export type LifecycleStageId =
  | 'LIFE-00'
  | 'LIFE-01'
  | 'LIFE-02'
  | 'LIFE-03'
  | 'LIFE-04'
  | 'LIFE-05'
  | 'LIFE-06'
  | 'LIFE-07'

export type ScenarioId =
  | 'all'
  | 'new-hire'
  | 'direct-hire'
  | 'transfer'
  | 'offboarding'

export interface ScenarioDefinition {
  id: ScenarioId
  title: string
  subtitle: string
  description: string
  highlightStages: LifecycleStageId[]
  primaryEntryStage: LifecycleStageId
  impactedModules: string[]
}

export interface MultiDimensionStatusChange {
  dimension:
    | 'CandidateStatus'
    | 'OnboardingStatus'
    | 'EmploymentStatus'
    | 'ContractStatus'
    | 'AssignmentStatus'
    | 'InsuranceStatus'
    | 'PayrollStatus'
    | 'AccessStatus'
    | 'HeadcountPlan'
    | 'PositionBudget'
  from: string
  to: string
  note?: string
}

export interface LegalReferenceItem {
  lawDocument: string
  articles: string
  contentSummary: string
  effectiveDate: string
  status: 'Tham khảo' | 'Đã đối chiếu' | 'Cần xác nhận'
  sourceUrl?: string
  lastUpdated: string
}

export interface ImpactMatrixRow {
  dataChange: string
  targetModule: string
  impactType: string
  effectiveTiming: string
  condition: string
  handoverStatus: string
  sourceSop: string
}

export interface LifecycleStageDefinition {
  id: LifecycleStageId
  code: string
  title: string
  shortTitle: string
  oneLineSummary: string
  primaryActor: string
  approverActor: string
  executorActor: string
  primarySubsystem: string
  relatedSubsystems: string[]
  triggerContext: string
  purpose: string
  prerequisites: string[]
  processActions: string[]
  deliverables: string[]
  statusTransitions: MultiDimensionStatusChange[]
  legalReferences: LegalReferenceItem[]
  impactRows: ImpactMatrixRow[]
  wireframeId?: string
}
