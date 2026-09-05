import { SOP_DATABASE } from '../../sop/model/sopDatabase'
import type { SopSubProcess } from '../../sop/model/types'
import { LIFECYCLE_STAGES, LIFECYCLE_STAGE_ORDER, LIFECYCLE_SCENARIOS } from '../model/journey/lifecycleJourneyData'
import type { LifecycleStageId, ScenarioId, LifecycleStageDefinition, ScenarioDefinition } from '../model/journey/types'

export function getStageDefinition(stageId: LifecycleStageId): LifecycleStageDefinition | undefined {
  return LIFECYCLE_STAGES[stageId]
}

export function getDefaultStageId(): LifecycleStageId | undefined {
  return LIFECYCLE_STAGE_ORDER.find((stageId) => Boolean(LIFECYCLE_STAGES[stageId]))
}

export function getStageSops(stageId: LifecycleStageId): SopSubProcess[] {
  return SOP_DATABASE[stageId] ?? []
}

export function getTotalDynamicSops(): number {
  return LIFECYCLE_STAGE_ORDER.reduce((total, stageId) => {
    return total + (SOP_DATABASE[stageId]?.length ?? 0)
  }, 0)
}

export function getScenario(scenarioId: ScenarioId): ScenarioDefinition | undefined {
  return LIFECYCLE_SCENARIOS.find((s) => s.id === scenarioId) ?? LIFECYCLE_SCENARIOS[0]
}

export function isStageHighlightedInScenario(stageId: LifecycleStageId, scenarioId: ScenarioId): boolean {
  if (scenarioId === 'all') return true
  const scenario = getScenario(scenarioId)
  return scenario?.highlightStages.includes(stageId) ?? false
}

export function getDistinctSubsystemsCount(): number {
  const subsystems = new Set<string>()
  for (const stage of Object.values(LIFECYCLE_STAGES)) {
    subsystems.add(stage.primarySubsystem)
    for (const rel of stage.relatedSubsystems) {
      subsystems.add(rel)
    }
  }
  return subsystems.size
}
