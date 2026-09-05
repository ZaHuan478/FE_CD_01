import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ClusterFlowConfig } from '../model/types'

export const ORGANIZATION_FLOW_DATA = getRuntimeDataset<{ organization: ClusterFlowConfig }>('crossModule.flows').organization
