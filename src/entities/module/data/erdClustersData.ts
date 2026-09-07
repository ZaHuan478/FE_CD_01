import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { ERDCluster } from '../model/lifecycle.types'

export const getErdClustersData = memoRuntime(() => (getRuntimeDataset<ERDCluster[]>('erd.clusters')))
