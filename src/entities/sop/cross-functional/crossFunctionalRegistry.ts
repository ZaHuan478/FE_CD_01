import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { CrossFunctionalModuleDefinition } from './types'

export const getCROSS_FUNCTIONAL_REGISTRY = memoRuntime(() => (getRuntimeDataset<Record<string, CrossFunctionalModuleDefinition>>(
  'crossFunctional.registry'
)))

export const getCROSS_FUNCTIONAL_MODULES_LIST = memoRuntime(() => (Object.values(getCROSS_FUNCTIONAL_REGISTRY())))

export function getCrossFunctionalModule(id: string): CrossFunctionalModuleDefinition | undefined {
  return getCROSS_FUNCTIONAL_REGISTRY()[id.replace('CROSS-', 'CF-')]
}
