import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { SopSubProcess } from './types'

export const SOP_DATABASE = getRuntimeDataset<Record<string, SopSubProcess[]>>('workflow.sopDatabase')
