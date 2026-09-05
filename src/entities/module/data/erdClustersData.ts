import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ERDCluster } from '../model/lifecycle.types'

export const erdClustersData = getRuntimeDataset<ERDCluster[]>('erd.clusters')
