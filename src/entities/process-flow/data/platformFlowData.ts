import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ClusterFlowConfig } from '../model/types'

export const PLATFORM_FLOW_DATA = getRuntimeDataset<{ platform: ClusterFlowConfig }>('crossModule.flows').platform
