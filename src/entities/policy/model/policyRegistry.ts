import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { Policy } from './types'

export const POLICY_REGISTRY = getRuntimeDataset<Policy[]>('policy.registry')
