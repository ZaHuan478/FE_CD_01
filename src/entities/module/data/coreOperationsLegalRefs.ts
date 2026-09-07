import { memoRuntime } from '../../../shared/lib/runtime-datasets/runtimeData'
import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'

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

export const getCORE_OPERATIONS_LEGAL_REFS = memoRuntime(() => (getRuntimeDataset<{
  legalReferences: LegalReference[]
}>('coreOperations.config').legalReferences))
