import { getRuntimeDataset, hasRuntimeDataset } from '../database/runtimeData'

export type Language = 'vi' | 'en'
export interface TranslationDict { [key: string]: { vi: string; en: string } }

export const translations: TranslationDict = new Proxy({} as TranslationDict, {
  get(_target, prop: string | symbol) {
    if (typeof prop === 'string' && hasRuntimeDataset('translations')) {
      return getRuntimeDataset<TranslationDict>('translations')[prop]
    }
    return undefined
  }
})
