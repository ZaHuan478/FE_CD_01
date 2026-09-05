import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'

export type SourceStatus = 'official' | 'designed' | 'draft' | 'not_available' | 'placeholder'
export type ProcessStatus = 'official' | 'designed' | 'draft' | 'not_available'

export type BusinessField = {
  name: string
  source: string
  sourceType?: 'master' | 'sop' | 'system' | 'manual'
}

export type Actor = { name: string; role: string; action: string }

export type BusinessNode = {
  id: string
  type: 'master' | 'lifecycle' | 'cross' | 'support'
  code: string
  title: string
  subtitle: string
  overview: { purpose: string; description: string; status: SourceStatus; phase?: string }
  inputs: BusinessField[]
  outputs: BusinessField[]
  actors: Actor[]
  masterDataIds: string[]
  sopIds: string[]
  process: { status: ProcessStatus; steps: string[]; source: string }
  wireframe: { title: string; fields: string[]; actions: string[] }
  source: { note: string; status: SourceStatus }
}

export type RelationshipType = 'used-by' | 'uses' | 'related-to' | 'produces' | 'feeds' | 'supports'
export type Relationship = { source: string; target: string; type: RelationshipType }

export type SopRecord = {
  id: string
  title: string
  lifecycleIds: string[]
  masterDataIds: string[]
  crossFunctionalIds: string[]
  source: { file: string; sheet?: string; row?: string }
  status: SourceStatus
}

interface PageBusinessDataset {
  masterData: BusinessNode[]
  lifecycleProcesses: BusinessNode[]
  crossFunctionalProcesses: BusinessNode[]
  sharedServices: BusinessNode[]
  sops: SopRecord[]
  relationships: Relationship[]
}

const dataset = getRuntimeDataset<PageBusinessDataset>('page.businessNodes')

export const masterData = dataset.masterData
export const lifecycleProcesses = dataset.lifecycleProcesses
export const crossFunctionalProcesses = dataset.crossFunctionalProcesses
export const sharedServices = dataset.sharedServices
export const allBusinessNodes = [...masterData, ...lifecycleProcesses, ...crossFunctionalProcesses, ...sharedServices]
export const sops = dataset.sops
export const relationships = dataset.relationships

export function findNodeById(nodeId: string): BusinessNode | undefined {
  return allBusinessNodes.find((node) => node.id === nodeId)
}

export function getNodeLabel(node: BusinessNode): string {
  if (node.type === 'master') return 'MASTER DATA'
  if (node.type === 'lifecycle') return 'LIFECYCLE PROCESS'
  if (node.type === 'cross') return 'CROSS-FUNCTIONAL'
  return 'SHARED SERVICE'
}

export const defaultBusinessDetail = lifecycleProcesses[0]
