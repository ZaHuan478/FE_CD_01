import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { CrossClusterOverviewConnection, FlowNode } from '../model/types'

interface CrossModuleDataset {
  crossClusterNodes: FlowNode[]
  crossClusterConnections: CrossClusterOverviewConnection[]
}

const dataset = getRuntimeDataset<CrossModuleDataset>('crossModule.flows')

export const CROSS_CLUSTER_NODES = dataset.crossClusterNodes
export const CROSS_CLUSTER_CONNECTIONS = dataset.crossClusterConnections
