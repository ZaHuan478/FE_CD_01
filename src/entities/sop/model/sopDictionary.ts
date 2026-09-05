import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'

export const sopDictionary = getRuntimeDataset<Record<string, { badge: string; title: string }>>('sop.dictionary')
