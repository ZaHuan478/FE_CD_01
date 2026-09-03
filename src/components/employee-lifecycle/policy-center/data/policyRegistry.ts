import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { Policy } from '../types'

export const POLICY_REGISTRY = getRuntimeDataset<Policy[]>('policy.registry')
