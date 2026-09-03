import { getRuntimeDataset } from '../../../database/runtimeData'

export const sopDictionary = getRuntimeDataset<Record<string, { badge: string; title: string }>>('sop.dictionary')
