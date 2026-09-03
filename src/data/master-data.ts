import { getRuntimeDataset } from '../database/runtimeData'

export type SourceStatus = 'official' | 'designed' | 'draft' | 'placeholder'
export type Actor = { name: string; role: string; action: string }
export type ProcessStep = { status: SourceStatus; steps: string[]; source: string }
export type MasterDataRecord = {
  id: string
  title: string
  inputs: string[]
  outputs: string[]
  actors: Actor[]
  rules: string[]
  usedBy: string[]
  sopIds: string[]
  process: ProcessStep
  sourceStatus: SourceStatus
}

export const masterData = getRuntimeDataset<{ masterData: MasterDataRecord[] }>('legacy.data').masterData
