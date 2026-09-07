import { getSOP_DATABASE, getWorkflowProcesses } from '../../sop/model/sopDatabase'
import type { SopSubProcess } from '../../sop/model/types'
import { getLIFECYCLE_STAGES, getLIFECYCLE_STAGE_ORDER, getLIFECYCLE_SCENARIOS } from '../model/journey/lifecycleJourneyData'
import type { LifecycleStageId, ScenarioId, LifecycleStageDefinition, ScenarioDefinition } from '../model/journey/types'

export function getStageDefinition(stageId: LifecycleStageId): LifecycleStageDefinition | undefined {
  return getLIFECYCLE_STAGES()[stageId]
}

export function getDefaultStageId(): LifecycleStageId | undefined {
  return getLIFECYCLE_STAGE_ORDER().find((stageId) => Boolean(getLIFECYCLE_STAGES()[stageId]))
}

export function getStageSops(stageId: LifecycleStageId): SopSubProcess[] {
  return getWorkflowProcesses(stageId)
}

export function getTotalDynamicSops(): number {
  return getLIFECYCLE_STAGE_ORDER().reduce((total, stageId) => {
    return total + (getSOP_DATABASE()[stageId]?.length ?? 0)
  }, 0)
}

export function getScenario(scenarioId: ScenarioId): ScenarioDefinition | undefined {
  return getLIFECYCLE_SCENARIOS().find((s) => s.id === scenarioId) ?? getLIFECYCLE_SCENARIOS()[0]
}

export function isStageHighlightedInScenario(stageId: LifecycleStageId, scenarioId: ScenarioId): boolean {
  if (scenarioId === 'all') return true
  const scenario = getScenario(scenarioId)
  return scenario?.highlightStages.includes(stageId) ?? false
}

export function getDistinctSubsystemsCount(): number {
  const subsystems = new Set<string>()
  for (const stage of Object.values(getLIFECYCLE_STAGES())) {
    subsystems.add(stage.primarySubsystem)
    for (const rel of stage.relatedSubsystems) {
      subsystems.add(rel)
    }
  }
  return subsystems.size
}
