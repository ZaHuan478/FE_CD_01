import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { ClusterFlowConfig } from '../types'

export const PLATFORM_FLOW_DATA = getRuntimeDataset<{ platform: ClusterFlowConfig }>('crossModule.flows').platform
