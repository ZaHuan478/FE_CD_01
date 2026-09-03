import { getRuntimeDataset } from '../database/runtimeData'

export type Language = 'vi' | 'en'
export interface TranslationDict { [key: string]: { vi: string; en: string } }

export const translations = getRuntimeDataset<TranslationDict>('translations')
