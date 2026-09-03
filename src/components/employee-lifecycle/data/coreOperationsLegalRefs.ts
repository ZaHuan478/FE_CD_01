import { getRuntimeDataset } from '../../../database/runtimeData'

export interface LegalReference {
  id: string
  documentNumber: string
  title: string
  titleEn: string
  effectiveFrom: string
  effectiveTo?: string
  officialUrl?: string
  affectedModules: ('ats' | 'emp' | 'att' | 'pay' | 'ins' | 'tax')[]
  note: string
  noteEn: string
  status: 'active' | 'superseded' | 'upcoming'
}

export const CORE_OPERATIONS_LEGAL_REFS = getRuntimeDataset<{
  legalReferences: LegalReference[]
}>('coreOperations.config').legalReferences
