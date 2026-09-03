import { getRuntimeDataset } from '../../../database/runtimeData'
import type { CrossFunctionalModuleDefinition } from './types'

export const CROSS_FUNCTIONAL_REGISTRY = getRuntimeDataset<Record<string, CrossFunctionalModuleDefinition>>(
  'crossFunctional.registry'
)

export const CROSS_FUNCTIONAL_MODULES_LIST = Object.values(CROSS_FUNCTIONAL_REGISTRY)

export function getCrossFunctionalModule(id: string): CrossFunctionalModuleDefinition | undefined {
  return CROSS_FUNCTIONAL_REGISTRY[id.replace('CROSS-', 'CF-')]
}
