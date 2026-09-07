import { memoRuntime } from '../../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../../shared/lib/runtime-datasets/runtimeData'
import type { LifecycleStageDefinition, LifecycleStageId, ScenarioDefinition } from './types'

interface LifecycleJourneyDataset {
  scenarios: ScenarioDefinition[]
  stages: Record<LifecycleStageId, LifecycleStageDefinition>
  stageOrder: LifecycleStageId[]
}

const getDataset = memoRuntime(() => (getRuntimeDataset<LifecycleJourneyDataset>('lifecycle.journey')))

export const getLIFECYCLE_SCENARIOS = memoRuntime(() => (getDataset().scenarios))
export const getLIFECYCLE_STAGES = memoRuntime(() => (getDataset().stages))
export const getLIFECYCLE_STAGE_ORDER = memoRuntime(() => (getDataset().stageOrder))
