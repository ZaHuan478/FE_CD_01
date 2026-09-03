import { getRuntimeDataset } from '../database/runtimeData'
import type { Actor, ProcessStep, SourceStatus } from './master-data'

export type LifecycleNode = {
  id: string
  title: string
  subtitle: string
  inputs: string[]
  outputs: string[]
  actors: Actor[]
  masterDataIds: string[]
  sopIds: string[]
  process: ProcessStep
  sourceStatus: SourceStatus
  uiFields: string[]
}

export const lifecycle = getRuntimeDataset<{ lifecycle: LifecycleNode[] }>('legacy.data').lifecycle
