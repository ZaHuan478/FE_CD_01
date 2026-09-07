import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { SopSubProcess } from './types'

export type SopStepSummary = Pick<SopSubProcess['steps'][number], 'stepCode' | 'title' | 'actor' | 'typeCode' | 'sourceTypeCode' | 'fieldsChecklist'>
export type SopProcessSummary = Omit<SopSubProcess, 'steps'> & { steps: SopStepSummary[] }

/** Navigation metadata, never full step content. */
export const getSOP_DATABASE = () => getRuntimeDataset<Record<string, SopProcessSummary[]>>('workflow.index')

export function getWorkflowProcesses(workflowId: string): SopSubProcess[] {
  if (!Object.hasOwn(getSOP_DATABASE(), workflowId)) return []
  return getRuntimeDataset<SopSubProcess[]>(`workflow.detail:${workflowId}`)
}
