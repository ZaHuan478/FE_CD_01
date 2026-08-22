import type { LifecycleStep } from '../../../types/employee-lifecycle'

export interface LifecycleStepperProps {
  steps: LifecycleStep[]
  activeStepId?: string
  onSelectStep: (id: string) => void
}

export interface CoModule {
  name: string
  nameEn: string
  bg: string
  color: string
}

export interface ModuleInfo {
  name: string
  nameEn: string
  code: string
  color: string
  bg: string
  border: string
  desc: string
  descEn: string
  coModules: CoModule[]
}

export interface ModuleFilterOption {
  id: string
  name: string
  nameEn: string
  code: string
  stepIds?: string[]
}
