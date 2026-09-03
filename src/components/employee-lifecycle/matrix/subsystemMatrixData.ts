import { getRuntimeDataset } from '../../../database/runtimeData'

export interface SubsystemNode {
  id: string
  code: string
  name: string
  nameEn: string
  shortDesc: string
  shortDescEn: string
  color: string
  gradient: string
  iconName: 'Target' | 'Users' | 'Clock' | 'CircleDollarSign' | 'ShieldCheck' | 'Receipt'
  masterCatalogsCount: number
  sopCount: number
}

export interface MatrixCellFlow {
  fromModuleId: string
  toModuleId: string
  flowTitle: string
  flowTitleEn: string
  flowType: 'mandatory' | 'automated' | 'event_trigger'
  sopRef: string
  dataItems: string[]
  dataItemsEn: string[]
  samplePayload: Record<string, string | number>
  businessRationale: string
  businessRationaleEn: string
}

const dataset = getRuntimeDataset<{ subsystems: SubsystemNode[]; flows: MatrixCellFlow[] }>('matrix.subsystems')

export const MATRIX_SUBSYSTEMS = dataset.subsystems
export const CROSS_MODULE_FLOWS = dataset.flows
