/**
 * types.ts
 * Type definitions for Unified Cross-Module Data Flow (Dòng dữ liệu nghiệp vụ)
 */

export type BusinessClusterId = 'core' | 'people' | 'organization' | 'platform'

export type NodeKind = 'business-module' | 'shared-service' | 'external-system'

export type FlowDirection = 'one-way' | 'two-way' | 'feedback'

export type FlowFrequency =
  | 'realtime'
  | 'event-driven'
  | 'daily'
  | 'monthly'
  | 'periodic'
  | 'on-demand'

export type ConnectionKind =
  | 'data-transfer'
  | 'dependency'
  | 'approval'
  | 'shared-service'
  | 'feedback'

export type FlowScope = 'within-cluster' | 'cross-cluster'

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface FlowNode {
  id: string
  code: string
  label: string
  labelEn: string
  cluster: BusinessClusterId
  description: string
  descriptionEn: string
  iconName: string
  workflowId?: string
  firstSopCode?: string
  nodeKind: NodeKind
  colorToken?: string
}

export interface FlowConnection {
  id: string
  from: string
  to: string
  label: string
  labelEn: string
  description?: string
  descriptionEn?: string
  direction: FlowDirection
  trigger: string
  triggerEn: string
  frequency: FlowFrequency
  dataItems: string[]
  dataItemsEn: string[]
  controls: string[]
  controlsEn: string[]
  exceptions: string[]
  exceptionsEn: string[]
  relatedWorkflowIds: string[]
  relatedSopCodes: string[]
  connectionKind: ConnectionKind
}

export interface ClusterFlowConfig {
  clusterId: BusinessClusterId
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
  nodes: FlowNode[]
  connections: FlowConnection[]
}

export interface CrossClusterOverviewConnection {
  id: string
  fromCluster: BusinessClusterId
  toCluster: BusinessClusterId
  label: string
  labelEn: string
  description: string
  descriptionEn: string
  direction: FlowDirection
  frequency: FlowFrequency
  dataItems: string[]
  dataItemsEn: string[]
  controls: string[]
  controlsEn: string[]
  exceptions: string[]
  exceptionsEn: string[]
  primaryModules: string[]
  relatedWorkflowIds: string[]
}
