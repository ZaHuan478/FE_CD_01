import { getRuntimeDataset } from '../database/runtimeData'

export type SopGroup = string
export type SopRecord = {
  group: SopGroup
  title: string
  source: string
  sourceStatus: 'official' | 'designed' | 'draft' | 'placeholder'
}

export const sopCatalog = getRuntimeDataset<{ sopCatalog: SopRecord[] }>('legacy.data').sopCatalog
export const sopLookup = Object.fromEntries(sopCatalog.map((item) => [item.title, item]))
