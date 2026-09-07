import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { Policy } from './types'

export const getPOLICY_REGISTRY = memoRuntime(() => (getRuntimeDataset<Policy[]>('policy.registry')))
