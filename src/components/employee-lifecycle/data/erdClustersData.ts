import { getRuntimeDataset } from '../../../database/runtimeData'
import type { ERDCluster } from '../../../types/employee-lifecycle'

export const erdClustersData = getRuntimeDataset<ERDCluster[]>('erd.clusters')
