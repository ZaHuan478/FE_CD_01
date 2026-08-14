export type MasterDataCategory = {
  id: string
  code: string
  title: string
  subtitle: string
  clusterId: 'personal' | 'structure' | 'policy'
  count?: number
  inputsCount: number
  outputsCount: number
}

export type ERDCluster = {
  id: 'personal' | 'structure' | 'policy'
  title: string
  subtitle: string
  targetField: string
  color: string
  badgeBg: string
  badgeText?: string
  items: Array<{
    id: string
    code: string
    title: string
    subtitle: string
  }>
}

export type LifecycleStep = {
  id: string
  stepNumber: number
  code: string
  title: string
  subtitle: string
  statusLabel?: string
  description: string
  inputs: string[]
  outputs: string[]
  actors: Array<{ name: string; role: string; action: string }>
}

export type OperationModule = {
  id: string
  code: string
  title: string
  description: string
  iconName: string
  category: string
  inputs: string[]
  outputs: string[]
}

export type SystemSupportUtility = {
  id: string
  code: string
  title: string
  subtitle: string
  iconName: string
  description: string
  features: string[]
}

export type DetailItem = {
  id: string
  title: string
  subtitle: string
  category: 'master' | 'lifecycle' | 'cross' | 'support'
  sourceStatus?: string
  inputs: string[]
  outputs: string[]
  actors: Array<{ name: string; role: string; action: string }>
  rules?: string[]
  process?: { steps: string[]; source?: string; status?: string }
  sopIds: string[]
  usedBy?: string[]
  uiFields?: string[]
}
