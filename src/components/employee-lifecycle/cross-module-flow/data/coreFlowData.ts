import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { ClusterFlowConfig } from '../types'

export const CORE_FLOW_DATA = getRuntimeDataset<{ core: ClusterFlowConfig }>('crossModule.flows').core
