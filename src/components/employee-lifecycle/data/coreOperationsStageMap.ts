import { getRuntimeDataset } from '../../../database/runtimeData'

export interface StageDefinition {
  stageId: string
  stageNumber: number
  stageTitle: string
  stageTitleEn: string
  description: string
  descriptionEn: string
  sopCodes: string[]
}

export type CoreOperationModuleId = 'ats' | 'emp' | 'onb' | 'att' | 'leave' | 'pay' | 'ins' | 'tax' | 'ess'

export interface ModuleMetadata {
  id: CoreOperationModuleId
  code: string
  name: string
  nameEn: string
  shortLabel: string
  shortDesc: string
  shortDescEn: string
  plainExplanation: string
  plainExplanationEn: string
  receivesFrom: string
  receivesFromEn: string
  sendsTo: string
  sendsToEn: string
  workflowIdDefault: string
  stages: StageDefinition[]
}

interface CoreOperationsDataset {
  stageMap: Record<string, ModuleMetadata>
  workflowBySopCode: Record<string, string>
  knownWireframeIds: string[]
}

const dataset = getRuntimeDataset<CoreOperationsDataset>('coreOperations.config')

export const CORE_OPERATIONS_STAGE_MAP = dataset.stageMap
export const WORKFLOW_ID_BY_SOP_CODE = dataset.workflowBySopCode
export const KNOWN_WIREFRAME_IDS = new Set(dataset.knownWireframeIds)
