import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { ModuleFilterOption, ModuleInfo } from '../types'

const dataset = getRuntimeDataset<{
  stepModuleMap: Record<string, ModuleInfo>
  moduleFilterOptions: ModuleFilterOption[]
}>('lifecycleStepper.modules')

export const STEP_MODULE_MAP = dataset.stepModuleMap
export const MODULE_FILTER_OPTIONS = dataset.moduleFilterOptions
