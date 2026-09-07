import { memoRuntime } from '../runtime-datasets/runtimeData'
import { getRuntimeDataset, hasRuntimeDataset } from '../runtime-datasets/runtimeData'

export type Language = 'vi' | 'en'
export interface TranslationDict { [key: string]: { vi: string; en: string } }

export const getTranslations: () => TranslationDict = memoRuntime(() => (new Proxy({} as TranslationDict, {
  get(_target, prop: string | symbol) {
    if (typeof prop === 'string' && hasRuntimeDataset('translations')) {
      return getRuntimeDataset<TranslationDict>('translations')[prop]
    }
    return undefined
  }
})))
