export const CORE_MODULE_IDS = ['ats', 'onb', 'emp', 'att', 'leave', 'pay', 'ins', 'tax', 'ess'] as const

export type CoreModuleId = typeof CORE_MODULE_IDS[number]

const workflowModules: Record<string, CoreModuleId[]> = {
  'LIFE-00': ['ats', 'emp'],
  'LIFE-01': ['ats', 'emp'],
  'LIFE-02': ['emp', 'onb'],
  'LIFE-03': ['emp'],
  'LIFE-04': ['emp'],
  'LIFE-05': ['emp', 'pay'],
  'LIFE-06': ['emp', 'att', 'leave'],
  'LIFE-07': ['emp'],
  'MODULE-ONB': ['onb'],
  'MODULE-ESS': ['ess'],
  'MODULE-ATT': ['att', 'leave'],
  'MODULE-PAY': ['pay'],
  'MODULE-INS': ['ins'],
  'MODULE-TAX': ['tax'],
  'MODULE-MD': [...CORE_MODULE_IDS],
  'MODULE-MD-FUNCTIONS': [...CORE_MODULE_IDS],
  'MODULE-PFM': ['emp'],
  'MODULE-CMP': ['emp'],
  'MODULE-LND': ['emp'],
  'MODULE-TAL': ['emp'],
  'MODULE-ENG': ['emp'],
  'MODULE-ORG-HC': ['emp'],
  'MODULE-ORG-ST': ['emp'],
  'MODULE-ORG-JOB': ['emp'],
  'MODULE-ORG-POS': ['emp'],
  'MODULE-ORG-RPT': ['emp'],
  'MODULE-PLT-MD': ['ess'],
  'MODULE-PLT-CFG': ['ess'],
  'MODULE-PLT-WFL': ['ess'],
  'MODULE-PLT-DOC': ['ess'],
  'MODULE-PLT-SIG': ['ess'],
  'MODULE-PLT-NTF': ['ess'],
  'MODULE-PLT-INT': ['ess'],
  'MODULE-PLT-SEC': ['ess'],
  'MODULE-PLT-AUD': ['ess'],
  'CF-01': ['att', 'leave'],
  'CROSS-01': ['att', 'leave'],
  'CF-02': ['emp'],
  'CROSS-02': ['emp'],
  'CF-03': ['emp'],
  'CROSS-03': ['emp'],
  'CF-04': ['emp'],
  'CROSS-04': ['emp'],
  'CF-05': ['emp'],
  'CROSS-05': ['emp'],
  'CF-06': ['emp', 'onb'],
  'CROSS-06': ['emp', 'onb'],
  'CF-07': ['emp'],
  'CROSS-07': ['emp'],
  'CF-08': ['emp'],
  'CROSS-08': ['emp']
}

export const dashboardModuleAccess: Record<string, CoreModuleId> = {
  recruitment: 'ats',
  onboarding: 'onb',
  employee: 'emp',
  attendance: 'att',
  leave: 'leave',
  payroll: 'pay',
  insurance: 'ins',
  tax: 'tax',
  selfService: 'ess',
  kpi: 'emp',
  review: 'emp',
  competency: 'emp',
  learning: 'emp',
  talent: 'emp',
  engagement: 'emp',
  headcount: 'emp',
  organizationStructure: 'emp',
  job: 'emp',
  position: 'emp',
  workforceReport: 'emp',
  shared: 'ess',
  configuration: 'ess',
  workflow: 'ess',
  document: 'ess',
  signature: 'ess',
  notification: 'ess',
  integration: 'ess',
  security: 'ess',
  audit: 'ess'
}

function modulesForSopCode(rawCode?: string | null): CoreModuleId[] {
  const code = (rawCode ?? '').toUpperCase().replaceAll(' ', '-')
  if (code.includes('PROM')) return ['emp', 'pay']
  if (code.includes('PAY')) return ['pay']
  if (code.includes('INS') || code.includes('BHXH')) return ['ins']
  if (code.includes('TAX') || code.includes('TNCN')) return ['tax']
  if (code.includes('ATT') || code.includes('LEV') || code.includes('CC-')) return ['att', 'leave']
  if (code.includes('REC') || code.includes('ATS')) return ['ats']
  if (code.includes('ONB')) return ['onb']
  if (code.includes('ESS')) return ['ess']
  if (code.includes('EMP') || code.includes('NS-') || code.includes('OFF')) return ['emp']
  return []
}

export function requiredModuleIdsForRoute(routeId?: string, sopCode?: string | null): CoreModuleId[] {
  const sopModules = modulesForSopCode(sopCode)
  if (sopModules.length > 0) return sopModules
  return routeId ? workflowModules[routeId] ?? [] : []
}

export function canAccessAnyModule(accessibleModuleIds: ReadonlySet<string>, requiredModuleIds: readonly string[]): boolean {
  return requiredModuleIds.length === 0 || requiredModuleIds.some((moduleId) => accessibleModuleIds.has(moduleId))
}
