import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'

export const getSopDictionary = memoRuntime(() => (getRuntimeDataset<Record<string, { badge: string; title: string }>>('sop.dictionary')))
