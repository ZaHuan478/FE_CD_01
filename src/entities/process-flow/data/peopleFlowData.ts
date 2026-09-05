import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ClusterFlowConfig } from '../model/types'

export const PEOPLE_FLOW_DATA = getRuntimeDataset<{ people: ClusterFlowConfig }>('crossModule.flows').people
