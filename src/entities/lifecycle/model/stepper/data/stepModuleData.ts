import { memoRuntime } from '../../../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../../../shared/lib/runtime-datasets/runtimeData'
import type { ModuleFilterOption, ModuleInfo } from '../types'

const getDataset = memoRuntime(() => (getRuntimeDataset<{
  stepModuleMap: Record<string, ModuleInfo>
  moduleFilterOptions: ModuleFilterOption[]
}>('lifecycleStepper.modules')))

export const getSTEP_MODULE_MAP = memoRuntime(() => (getDataset().stepModuleMap))
export const getMODULE_FILTER_OPTIONS = memoRuntime(() => (getDataset().moduleFilterOptions))
