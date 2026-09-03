import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { ClusterFlowConfig } from '../types'

export const PEOPLE_FLOW_DATA = getRuntimeDataset<{ people: ClusterFlowConfig }>('crossModule.flows').people
