import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { ClusterFlowConfig } from '../types'

export const ORGANIZATION_FLOW_DATA = getRuntimeDataset<{ organization: ClusterFlowConfig }>('crossModule.flows').organization
