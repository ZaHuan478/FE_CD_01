export const CORE_MODULE_IDS = ['ats', 'onb', 'emp', 'att', 'leave', 'pay', 'ins', 'tax', 'ess'] as const

export type CoreModuleId = typeof CORE_MODULE_IDS[number]

const workflowModules: Record<string, string[]> = {
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
  'MODULE-PFM': ['kpi', 'review'],
  'MODULE-CMP': ['cmp'],
  'MODULE-LND': ['lnd'],
  'MODULE-TAL': ['tal'],
  'MODULE-ENG': ['eng'],
  'MODULE-ORG-HC': ['org-hc'],
  'MODULE-ORG-ST': ['org-st'],
  'MODULE-ORG-JOB': ['org-job'],
  'MODULE-ORG-POS': ['org-pos'],
  'MODULE-ORG-RPT': ['org-rpt'],
  'MODULE-PLT-MD': ['plt-md'],
  'MODULE-PLT-CFG': ['plt-cfg'],
  'MODULE-PLT-WFL': ['plt-wfl'],
  'MODULE-PLT-DOC': ['plt-doc'],
  'MODULE-PLT-SIG': ['plt-sig'],
  'MODULE-PLT-NTF': ['plt-ntf'],
  'MODULE-PLT-INT': ['plt-int'],
  'MODULE-PLT-SEC': ['plt-sec'],
  'MODULE-PLT-AUD': ['plt-aud'],
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
  'CF-07': ['review'],
  'CROSS-07': ['review'],
  'CF-08': ['emp'],
  'CROSS-08': ['emp']
}

export const dashboardModuleAccess: Record<string, string> = {
  recruitment: 'ats',
  onboarding: 'onb',
  employee: 'emp',
  attendance: 'att',
  leave: 'leave',
  payroll: 'pay',
  insurance: 'ins',
  tax: 'tax',
  selfService: 'ess',
  kpi: 'kpi',
  review: 'review',
  competency: 'cmp',
  learning: 'lnd',
  talent: 'tal',
  engagement: 'eng',
  headcount: 'org-hc',
  organizationStructure: 'org-st',
  job: 'org-job',
  position: 'org-pos',
  workforceReport: 'org-rpt',
  shared: 'plt-md',
  configuration: 'plt-cfg',
  workflow: 'plt-wfl',
  document: 'plt-doc',
  signature: 'plt-sig',
  notification: 'plt-ntf',
  integration: 'plt-int',
  security: 'plt-sec',
  audit: 'plt-aud'
}

function modulesForSopCode(rawCode?: string | null): string[] {
  const code = (rawCode ?? '').toUpperCase().replaceAll(' ', '-')
  if (/PFM-?0?2\b/.test(code) || /PFM-?0?3\b/.test(code)) return ['kpi']
  if (code.includes('PFM') || code.includes('ĐG') || code.includes('DG')) return ['review']
  if (code.includes('CMP')) return ['cmp']
  if (code.includes('LND')) return ['lnd']
  if (code.includes('TAL')) return ['tal']
  if (code.includes('ENG')) return ['eng']
  if (code.includes('HC-')) return ['org-hc']
  if (code.includes('OST')) return ['org-st']
  if (code.includes('JOB')) return ['org-job']
  if (code.includes('POS')) return ['org-pos']
  if (code.includes('RPT')) return ['org-rpt']
  if (code.includes('CFG')) return ['plt-cfg']
  if (code.includes('WFL')) return ['plt-wfl']
  if (code.includes('DOC') || code.includes('ADM')) return ['plt-doc']
  if (code.includes('SIG')) return ['plt-sig']
  if (code.includes('NTF')) return ['plt-ntf']
  if (code.includes('INT')) return ['plt-int']
  if (code.includes('SEC')) return ['plt-sec']
  if (code.includes('AUD')) return ['plt-aud']
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

export function requiredModuleIdsForRoute(routeId?: string, sopCode?: string | null): string[] {
  const sopModules = modulesForSopCode(sopCode)
  if (sopModules.length > 0) return sopModules
  return routeId ? workflowModules[routeId] ?? [] : []
}

export function canAccessAnyModule(accessibleModuleIds: ReadonlySet<string>, requiredModuleIds: readonly string[]): boolean {
  return requiredModuleIds.length === 0 || requiredModuleIds.some((moduleId) => accessibleModuleIds.has(moduleId))
}
