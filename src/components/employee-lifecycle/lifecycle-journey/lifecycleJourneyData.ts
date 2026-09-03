import { getRuntimeDataset } from '../../../database/runtimeData'
import type { LifecycleStageDefinition, LifecycleStageId, ScenarioDefinition } from './types'

interface LifecycleJourneyDataset {
  scenarios: ScenarioDefinition[]
  stages: Record<LifecycleStageId, LifecycleStageDefinition>
  stageOrder: LifecycleStageId[]
}

const dataset = getRuntimeDataset<LifecycleJourneyDataset>('lifecycle.journey')

export const LIFECYCLE_SCENARIOS = dataset.scenarios
export const LIFECYCLE_STAGES = dataset.stages
export const LIFECYCLE_STAGE_ORDER = dataset.stageOrder
