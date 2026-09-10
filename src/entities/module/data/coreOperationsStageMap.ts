import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'

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
}

const getDataset = memoRuntime(() => (getRuntimeDataset<CoreOperationsDataset>('coreOperations.config')))

export const getCORE_OPERATIONS_STAGE_MAP = memoRuntime(() => (getDataset().stageMap))
export const getWORKFLOW_ID_BY_SOP_CODE = memoRuntime(() => (getDataset().workflowBySopCode))
