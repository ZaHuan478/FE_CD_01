export type CatalogTier = 'tier1_global' | 'tier2_module' | 'tier3_utility' | 'tier4_governance'

export type CatalogModuleId =
  | 'global'
  | 'ats'
  | 'emp'
  | 'att'
  | 'pay'
  | 'ins'
  | 'tax'
  | 'admin'

export interface CatalogFieldSchema {
  name: string
  nameEn: string
  key: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'lookup'
  required: boolean
  description: string
  descriptionEn: string
  validationRules?: string[]
  lookupCatalogId?: string
}

export interface CatalogForeignKey {
  field: string
  targetCatalogId: string
  targetField: string
  relationship: 'many-to-one' | 'one-to-many' | 'one-to-one'
  required?: boolean
}

export interface CatalogValidationConstraint {
  id: string
  field: string
  type: 'required' | 'unique' | 'range' | 'regex' | 'enum' | 'cross_catalog' | 'cascade_filter'
  rule: string
  message: string
}

export interface CatalogRelationalRule {
  id: string
  title: string
  sourceField: string
  targetCatalogId: string
  targetField: string
  ruleType: 'lookup' | 'cascade' | 'range_guard' | 'blocking_dependency' | 'inheritance'
  description: string
}

export interface CatalogSampleRecord {
  id: string
  code?: string
  name?: string
  nameEn?: string
  status?: 'active' | 'inactive'
  [key: string]: any
}

export interface MasterCatalogItem {
  id: string
  code: string // e.g. MD-01, MD-GEO, MD-BANK, MD-05, MD-07, MD-08
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
  tier: CatalogTier
  moduleId: CatalogModuleId
  moduleName: string
  moduleNameEn: string
  recordCount: number
  color: string // Tailwind color key e.g. 'blue', 'emerald', 'amber', 'purple', 'indigo', 'rose'
  iconName: string
  feedsIntoModules: string[] // List of modules that consume this data (e.g. ['Core EMP', 'Chấm công ATT', 'Lương PAY'])
  feedsIntoWorkflows?: string[] // e.g. ['LIFE-01', 'LIFE-02', 'LIFE-04']
  description: string
  descriptionEn: string
  fields: CatalogFieldSchema[]
  sampleRecords: CatalogSampleRecord[]
  foreignKeys?: CatalogForeignKey[]
  validationConstraints?: CatalogValidationConstraint[]
  relationalRules?: CatalogRelationalRule[]
}
