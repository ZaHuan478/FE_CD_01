import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ClusterFlowConfig } from '../model/types'

export const CORE_FLOW_DATA = getRuntimeDataset<{ core: ClusterFlowConfig }>('crossModule.flows').core
