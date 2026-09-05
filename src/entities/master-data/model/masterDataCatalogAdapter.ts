import { getRuntimeDataset } from '../../../shared/lib/runtime-datasets/runtimeData'
import type { SopSubProcess } from '../../sop/model/types'
import type { CatalogModuleId, CatalogTier } from './types'

export type CatalogStatus = 'active' | 'upcoming' | 'legacy' | 'deprecated'
export type CatalogType = 'MD-CAT' | 'MD-ACT' | 'MD-ORG' | 'MD-PAY' | 'MD-ATT' | 'MD-INS'
export type DomainGroupId =
  | 'identity'
  | 'geography'
  | 'organization'
  | 'timeshift'
  | 'compensation'
  | 'labor'
  | 'governance'

export interface DomainGroup {
  id: DomainGroupId
  label: string
  iconName: string
  description: string
  color: string
}

export interface GeoMetadata {
  note?: string
  effectiveFrom?: string
  effectiveTo?: string
  legacyNote?: string
  asOfDate?: string
}

export interface CatalogViewModel {
  id: string
  code: string
  catalogType: CatalogType
  title: string
  summary: string
  description: string
  domainGroupId: DomainGroupId
  tier: CatalogTier
  moduleId: CatalogModuleId
  status: CatalogStatus
  ownerRole: string
  consumerModules: string[]
  fields: string[]
  fieldCount: number
  geoMetadata?: GeoMetadata
  sourceSop: SopSubProcess
}

interface MasterDataCatalogDataset {
  domainGroups: DomainGroup[]
  catalogItems: CatalogViewModel[]
  governanceItems: CatalogViewModel[]
  allItems: CatalogViewModel[]
  tierLabels: Record<CatalogTier, { label: string; description: string; color: string }>
  statusLabels: Record<CatalogStatus, { label: string; color: string }>
}

const dataset = getRuntimeDataset<MasterDataCatalogDataset>('masterData.catalog')

export const DOMAIN_GROUPS = dataset.domainGroups
export const ALL_CATALOG_ITEMS = dataset.catalogItems
export const GOVERNANCE_ITEMS = dataset.governanceItems
export const ALL_MASTER_DATA_ITEMS = dataset.allItems
export const TIER_LABELS = dataset.tierLabels
export const STATUS_LABELS = dataset.statusLabels

export interface MasterDataStats {
  totalCatalogs: number
  totalDomainGroups: number
  totalConsumerModules: number
  totalFieldsDefined: number
}

export function computeMasterDataStats(): MasterDataStats {
  const allModules = new Set(ALL_MASTER_DATA_ITEMS.flatMap((item) => item.consumerModules))
  const activeGroups = new Set(ALL_MASTER_DATA_ITEMS.map((item) => item.domainGroupId))
  return {
    totalCatalogs: ALL_MASTER_DATA_ITEMS.length,
    totalDomainGroups: activeGroups.size,
    totalConsumerModules: allModules.size,
    totalFieldsDefined: ALL_MASTER_DATA_ITEMS.reduce((sum, item) => sum + item.fieldCount, 0)
  }
}

export function getItemsByGroup(groupId: DomainGroupId): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.domainGroupId === groupId)
}

export function getItemsByTier(tier: CatalogTier): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.tier === tier)
}

export function getItemsByStatus(status: CatalogStatus): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.status === status)
}

export function searchCatalogs(items: CatalogViewModel[], query: string): CatalogViewModel[] {
  if (!query.trim()) return items
  const normalized = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi')
  return items.filter((item) => {
    const text = [item.code, item.title, item.summary, ...item.fields]
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('vi')
    return text.includes(normalized)
  })
}

export function getGroupCounts(): Record<DomainGroupId, number> {
  const counts: Partial<Record<DomainGroupId, number>> = {}
  for (const item of ALL_MASTER_DATA_ITEMS) {
    counts[item.domainGroupId] = (counts[item.domainGroupId] ?? 0) + 1
  }
  return counts as Record<DomainGroupId, number>
}
