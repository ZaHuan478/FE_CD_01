import type {
  BusinessClusterId,
  ClusterFlowConfig,
  FlowNode,
  FlowConnection,
  CrossClusterOverviewConnection
} from '../model/types'
import { CORE_FLOW_DATA } from '../data/coreFlowData'
import { PEOPLE_FLOW_DATA } from '../data/peopleFlowData'
import { ORGANIZATION_FLOW_DATA } from '../data/organizationFlowData'
import { PLATFORM_FLOW_DATA } from '../data/platformFlowData'
import { CROSS_CLUSTER_NODES, CROSS_CLUSTER_CONNECTIONS } from '../data/crossClusterFlowData'

export const getClusterFlowConfig = (clusterId: BusinessClusterId): ClusterFlowConfig => {
  switch (clusterId) {
    case 'core':
      return CORE_FLOW_DATA
    case 'people':
      return PEOPLE_FLOW_DATA
    case 'organization':
      return ORGANIZATION_FLOW_DATA
    case 'platform':
      return PLATFORM_FLOW_DATA
    default:
      return CORE_FLOW_DATA
  }
}

export const getFlowNodeById = (
  nodes: FlowNode[],
  nodeId: string
): FlowNode | undefined => {
  return nodes.find((n) => n.id === nodeId)
}

export const getFlowConnectionById = (
  connections: FlowConnection[],
  connectionId: string
): FlowConnection | undefined => {
  return connections.find((c) => c.id === connectionId)
}

export const getCrossClusterConnectionById = (
  connectionId: string
): CrossClusterOverviewConnection | undefined => {
  return CROSS_CLUSTER_CONNECTIONS.find((c) => c.id === connectionId)
}

export const getCrossClusterNodes = (): FlowNode[] => {
  return CROSS_CLUSTER_NODES
}

export const getCrossClusterConnections = (): CrossClusterOverviewConnection[] => {
  return CROSS_CLUSTER_CONNECTIONS
}

export const getConnectionsForNode = (
  connections: FlowConnection[],
  nodeId: string
): FlowConnection[] => {
  return connections.filter((c) => c.from === nodeId || c.to === nodeId)
}
