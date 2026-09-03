import { getRuntimeDataset } from '../../../../database/runtimeData'
import type { SopSubProcess } from '../types'

export const SOP_DATABASE = getRuntimeDataset<Record<string, SopSubProcess[]>>('workflow.sopDatabase')
