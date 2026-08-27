/**
 * masterDataCatalogAdapter.ts
 *
 * Adapter chuyển đổi dữ liệu nguồn từ docxOperationalSopDatabase sang view model
 * chuẩn hóa cho Master Data Studio.
 *
 * KHÔNG sửa source data gốc. Không duplicate business content.
 * Không tự bịa data không có trong source.
 */

import { DOCX_OPERATIONAL_SOP_DATABASE } from '../workflow-detail/data/docxOperationalSopDatabase'
import type { SopSubProcess } from '../workflow-detail/types'
import type { CatalogTier, CatalogModuleId } from './types'

// ────────────────────────────────────────────────────────────────────────────
// 1. VIEW MODEL TYPES
// ────────────────────────────────────────────────────────────────────────────

export type CatalogStatus =
  | 'active'       // Đang áp dụng
  | 'upcoming'     // Sắp áp dụng
  | 'legacy'       // Dữ liệu lịch sử - vẫn giữ nhưng không dùng mới
  | 'deprecated'   // Ngừng sử dụng

export type CatalogType =
  | 'MD-CAT'       // Danh mục dữ liệu chuẩn
  | 'MD-ACT'       // Thao tác quản trị (Thêm/Sửa/Khóa...)
  | 'MD-ORG'       // Cấu hình tổ chức
  | 'MD-PAY'       // Cấu hình lương
  | 'MD-ATT'       // Cấu hình thời gian
  | 'MD-INS'       // Cấu hình bảo hiểm

export type DomainGroupId =
  | 'identity'       // Toàn hệ thống & Định danh
  | 'geography'      // Địa giới hành chính
  | 'organization'   // Tổ chức, Chức danh & Vị trí
  | 'timeshift'      // Thời gian, Ca & Nghỉ phép
  | 'compensation'   // Lương, Phúc lợi, BHXH & Thuế
  | 'labor'          // Quan hệ lao động & Tuân thủ
  | 'governance'     // Quản trị Master Data

export interface DomainGroup {
  id: DomainGroupId
  label: string
  iconName: string
  description: string
  color: string // Tailwind color key
}

export interface GeoMetadata {
  /** Thông tin hành chính hiệu lực hiện tại (từ 01/07/2025) */
  note?: string
  effectiveFrom?: string  // 'YYYY-MM-DD'
  effectiveTo?: string
  legacyNote?: string     // Mô tả về dữ liệu lịch sử
  /** Dữ liệu từ nguồn chính thức, tính đến ngày asOfDate */
  asOfDate?: string
}

export interface CatalogViewModel {
  /** Mã định danh duy nhất trong catalog */
  id: string
  /** Mã gốc từ source (MD-CAT-01, MD-01, ...) */
  code: string
  /** Loại mã để phân biệt danh mục / thao tác / cấu hình */
  catalogType: CatalogType
  /** Tên danh mục */
  title: string
  /** Mô tả ngắn (lấy từ description gốc, 1-2 câu đầu) */
  summary: string
  /** Mô tả đầy đủ */
  description: string
  /** Nhóm nghiệp vụ */
  domainGroupId: DomainGroupId
  /** Tầng dữ liệu */
  tier: CatalogTier
  /** Phân hệ chính */
  moduleId: CatalogModuleId
  /** Trạng thái hiệu lực */
  status: CatalogStatus
  /** Đơn vị chịu trách nhiệm */
  ownerRole: string
  /** Các phân hệ sử dụng danh mục này */
  consumerModules: string[]
  /** Các trường dữ liệu cần khai báo (lấy từ fieldsChecklist) */
  fields: string[]
  /** Số trường dữ liệu */
  fieldCount: number
  /** Dữ liệu địa giới hành chính đặc thù */
  geoMetadata?: GeoMetadata
  /** SOP gốc để liên kết ngược */
  sourceSop: SopSubProcess
}

// ────────────────────────────────────────────────────────────────────────────
// 2. DOMAIN GROUP DEFINITIONS
// ────────────────────────────────────────────────────────────────────────────

export const DOMAIN_GROUPS: DomainGroup[] = [
  {
    id: 'identity',
    label: 'Toàn hệ thống & Định danh',
    iconName: 'Globe',
    description: 'Quốc tịch, tiền tệ, dân tộc, tôn giáo, trình độ học vấn và các danh mục định danh cá nhân dùng chung toàn hệ thống.',
    color: 'blue'
  },
  {
    id: 'geography',
    label: 'Địa giới hành chính',
    iconName: 'MapPin',
    description: 'Tỉnh/thành phố, xã/phường hiện hành (từ 01/07/2025) và dữ liệu quận/huyện lịch sử. Hỗ trợ chuyển đổi mã địa giới.',
    color: 'emerald'
  },
  {
    id: 'organization',
    label: 'Tổ chức, Chức danh & Vị trí',
    iconName: 'Building2',
    description: 'Đơn vị tổ chức, phòng ban, chức danh, chức vụ, cấp bậc và quan hệ báo cáo.',
    color: 'indigo'
  },
  {
    id: 'timeshift',
    label: 'Thời gian, Ca & Nghỉ phép',
    iconName: 'Clock',
    description: 'Ca làm việc, lịch công, loại nghỉ phép, đối tượng công, tăng ca và ngày nghỉ lễ.',
    color: 'amber'
  },
  {
    id: 'compensation',
    label: 'Lương, Phúc lợi, BHXH & Thuế',
    iconName: 'Wallet',
    description: 'Thang/bậc lương, nhóm phụ cấp, đối tượng bảo hiểm, vùng làm việc và cấu hình lương.',
    color: 'rose'
  },
  {
    id: 'labor',
    label: 'Quan hệ lao động & Tuân thủ',
    iconName: 'FileText',
    description: 'Loại hợp đồng, loại nghỉ việc, lý do điều chuyển, kỷ luật và khen thưởng.',
    color: 'purple'
  },
  {
    id: 'governance',
    label: 'Quản trị Master Data',
    iconName: 'ShieldCheck',
    description: 'Quy trình tạo, cập nhật, phê duyệt, khóa, kiểm tra trùng lặp và theo dõi lịch sử danh mục.',
    color: 'slate'
  }
]

// ────────────────────────────────────────────────────────────────────────────
// 3. MAPPING RULES - Phân loại từng mã sopCode vào DomainGroup & Tier
// ────────────────────────────────────────────────────────────────────────────

interface CatalogMappingRule {
  codes: string[]       // Danh sách sopCode áp dụng quy tắc này
  domainGroupId: DomainGroupId
  tier: CatalogTier
  moduleId: CatalogModuleId
  ownerRole: string
  consumerModules: string[]
  catalogType: CatalogType
  status: CatalogStatus
  geoMetadata?: GeoMetadata
}

const CATALOG_MAPPING_RULES: CatalogMappingRule[] = [
  // ── Địa giới hành chính ──────────────────────────────────────────────────
  {
    codes: ['MD-CAT-01'],
    domainGroupId: 'geography',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'IT / HR Operations',
    consumerModules: ['EMP', 'PAY', 'INS', 'ATT'],
    catalogType: 'MD-CAT',
    status: 'active',
    geoMetadata: {
      note: 'Từ 01/07/2025: Việt Nam vận hành mô hình 2 cấp địa phương. Có 34 đơn vị hành chính cấp tỉnh.',
      effectiveFrom: '2025-07-01',
      asOfDate: '2025-07-01'
    }
  },
  {
    codes: ['MD-CAT-02'],
    domainGroupId: 'geography',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'IT / HR Operations',
    consumerModules: ['EMP', 'PAY', 'INS'],
    catalogType: 'MD-CAT',
    status: 'legacy',
    geoMetadata: {
      note: 'Dữ liệu lịch sử – Cấp huyện không còn là cấp hành chính hiện hành từ 01/07/2025.',
      legacyNote: 'Giữ lại để đối chiếu hồ sơ, hợp đồng và chứng từ cũ. Không dùng cho địa chỉ hiện hành.',
      effectiveTo: '2025-06-30',
      asOfDate: '2025-07-01'
    }
  },
  {
    codes: ['MD-CAT-03'],
    domainGroupId: 'geography',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'IT / HR Operations',
    consumerModules: ['EMP', 'PAY', 'INS'],
    catalogType: 'MD-CAT',
    status: 'active',
    geoMetadata: {
      note: 'Từ 01/07/2025: Có 3.321 đơn vị hành chính cấp xã (xã, phường, thị trấn, đặc khu).',
      effectiveFrom: '2025-07-01',
      asOfDate: '2025-07-01'
    }
  },

  // ── Toàn hệ thống & Định danh ─────────────────────────────────────────────
  {
    codes: ['MD-CAT-04', 'MD-CAT-05', 'MD-CAT-06'],
    domainGroupId: 'identity',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'HR Operations',
    consumerModules: ['EMP'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-07'],
    domainGroupId: 'identity',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'Finance / HR',
    consumerModules: ['PAY', 'INS', 'TAX'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-08', 'MD-CAT-09', 'MD-CAT-10', 'MD-CAT-11', 'MD-CAT-12', 'MD-CAT-13', 'MD-CAT-14'],
    domainGroupId: 'identity',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'HR Operations',
    consumerModules: ['EMP'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-15', 'MD-CAT-16', 'MD-CAT-17'],
    domainGroupId: 'identity',
    tier: 'tier1_global',
    moduleId: 'global',
    ownerRole: 'HR Operations',
    consumerModules: ['EMP', 'ATT', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },

  // ── Tổ chức, Chức danh & Vị trí ──────────────────────────────────────────
  {
    codes: ['MD-CAT-32', 'MD-CAT-33'],
    domainGroupId: 'organization',
    tier: 'tier1_global',
    moduleId: 'emp',
    ownerRole: 'HR Operations / C&B',
    consumerModules: ['EMP', 'PAY', 'ATT', 'ATS'],
    catalogType: 'MD-CAT',
    status: 'active'
  },

  // ── Quan hệ lao động & Tuân thủ ───────────────────────────────────────────
  {
    codes: ['MD-CAT-18', 'MD-CAT-19'],
    domainGroupId: 'labor',
    tier: 'tier2_module',
    moduleId: 'emp',
    ownerRole: 'HR Operations',
    consumerModules: ['EMP'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-20', 'MD-CAT-21'],
    domainGroupId: 'labor',
    tier: 'tier2_module',
    moduleId: 'emp',
    ownerRole: 'HR Operations / Legal',
    consumerModules: ['EMP', 'PAY', 'INS'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-29', 'MD-CAT-39', 'MD-CAT-40'],
    domainGroupId: 'labor',
    tier: 'tier2_module',
    moduleId: 'emp',
    ownerRole: 'HR Operations',
    consumerModules: ['EMP'],
    catalogType: 'MD-CAT',
    status: 'active'
  },

  // ── Thời gian, Ca & Nghỉ phép ─────────────────────────────────────────────
  {
    codes: ['MD-CAT-22', 'MD-CAT-23'],
    domainGroupId: 'timeshift',
    tier: 'tier2_module',
    moduleId: 'att',
    ownerRole: 'HR Operations / C&B',
    consumerModules: ['ATT', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-24'],
    domainGroupId: 'timeshift',
    tier: 'tier2_module',
    moduleId: 'att',
    ownerRole: 'HR Operations',
    consumerModules: ['ATT', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-27', 'MD-CAT-28'],
    domainGroupId: 'timeshift',
    tier: 'tier2_module',
    moduleId: 'att',
    ownerRole: 'HR Operations',
    consumerModules: ['ATT', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-34', 'MD-CAT-35', 'MD-CAT-36'],
    domainGroupId: 'timeshift',
    tier: 'tier3_utility',
    moduleId: 'att',
    ownerRole: 'HR Operations',
    consumerModules: ['ATT'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-41'],
    domainGroupId: 'timeshift',
    tier: 'tier3_utility',
    moduleId: 'att',
    ownerRole: 'HR Operations',
    consumerModules: ['ATT'],
    catalogType: 'MD-CAT',
    status: 'active'
  },

  // ── Lương, Phúc lợi, BHXH & Thuế ─────────────────────────────────────────
  {
    codes: ['MD-CAT-25'],
    domainGroupId: 'compensation',
    tier: 'tier2_module',
    moduleId: 'pay',
    ownerRole: 'C&B',
    consumerModules: ['PAY', 'ATT'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-26'],
    domainGroupId: 'compensation',
    tier: 'tier2_module',
    moduleId: 'ins',
    ownerRole: 'HR Operations / C&B',
    consumerModules: ['INS', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-30', 'MD-CAT-31'],
    domainGroupId: 'compensation',
    tier: 'tier2_module',
    moduleId: 'pay',
    ownerRole: 'C&B',
    consumerModules: ['PAY', 'EMP'],
    catalogType: 'MD-CAT',
    status: 'active'
  },
  {
    codes: ['MD-CAT-37', 'MD-CAT-38'],
    domainGroupId: 'compensation',
    tier: 'tier2_module',
    moduleId: 'ins',
    ownerRole: 'C&B / HR Operations',
    consumerModules: ['INS', 'PAY'],
    catalogType: 'MD-CAT',
    status: 'active'
  },

  // ── Quản trị Master Data (MODULE-MD-FUNCTIONS) ───────────────────────────
  {
    codes: ['MD-01', 'MD-02', 'MD-03', 'MD-04', 'MD-05', 'MD-06', 'MD-07', 'MD-08', 'MD-09', 'MD-10'],
    domainGroupId: 'governance',
    tier: 'tier4_governance',
    moduleId: 'admin',
    ownerRole: 'HR Admin / IT Admin',
    consumerModules: ['Admin'],
    catalogType: 'MD-ACT',
    status: 'active'
  }
]

// ────────────────────────────────────────────────────────────────────────────
// 4. ADAPTER FUNCTION
// ────────────────────────────────────────────────────────────────────────────

function findRule(sopCode: string): CatalogMappingRule | undefined {
  return CATALOG_MAPPING_RULES.find((rule) => rule.codes.includes(sopCode))
}

function extractSummary(description: string): string {
  if (!description) return 'Chưa có mô tả.'
  // Lấy câu đầu tiên hoặc 120 ký tự đầu
  const firstSentence = description.split('\n')[0].trim()
  return firstSentence.length > 140 ? firstSentence.slice(0, 140) + '…' : firstSentence
}

function adaptSopToViewModel(sop: SopSubProcess): CatalogViewModel {
  const rule = findRule(sop.sopCode)
  const fields = sop.steps.flatMap((step) => step.fieldsChecklist || []).filter(Boolean)

  return {
    id: sop.sopCode,
    code: sop.sopCode,
    catalogType: rule?.catalogType ?? 'MD-CAT',
    title: sop.sopTitle,
    summary: extractSummary(sop.description || (sop.steps[0]?.description ?? '')),
    description: sop.description || sop.steps[0]?.description || '',
    domainGroupId: rule?.domainGroupId ?? 'identity',
    tier: rule?.tier ?? 'tier1_global',
    moduleId: rule?.moduleId ?? 'global',
    status: rule?.status ?? 'active',
    ownerRole: rule?.ownerRole ?? 'HR Operations',
    consumerModules: rule?.consumerModules ?? [],
    fields,
    fieldCount: fields.length,
    geoMetadata: rule?.geoMetadata,
    sourceSop: sop
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 5. EXPORTED DERIVED DATA
// ────────────────────────────────────────────────────────────────────────────

const rawCatalogs: SopSubProcess[] = DOCX_OPERATIONAL_SOP_DATABASE['MODULE-MD'] || []
const rawGovernance: SopSubProcess[] = DOCX_OPERATIONAL_SOP_DATABASE['MODULE-MD-FUNCTIONS'] || []

/** Toàn bộ danh mục MD-CAT-* (từ MODULE-MD) */
export const ALL_CATALOG_ITEMS: CatalogViewModel[] = rawCatalogs.map(adaptSopToViewModel)

/** Các thao tác quản trị MD-ACT (từ MODULE-MD-FUNCTIONS) */
export const GOVERNANCE_ITEMS: CatalogViewModel[] = rawGovernance.map(adaptSopToViewModel)

/** Tất cả items cho Master Data Studio */
export const ALL_MASTER_DATA_ITEMS: CatalogViewModel[] = [
  ...ALL_CATALOG_ITEMS,
  ...GOVERNANCE_ITEMS
]

// ────────────────────────────────────────────────────────────────────────────
// 6. STATISTICS (Tính từ dữ liệu thật, không hard-code)
// ────────────────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────────────────
// 7. FILTER & GROUP HELPERS
// ────────────────────────────────────────────────────────────────────────────

export function getItemsByGroup(groupId: DomainGroupId): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.domainGroupId === groupId)
}

export function getItemsByTier(tier: CatalogTier): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.tier === tier)
}

export function getItemsByStatus(status: CatalogStatus): CatalogViewModel[] {
  return ALL_MASTER_DATA_ITEMS.filter((item) => item.status === status)
}

export function searchCatalogs(
  items: CatalogViewModel[],
  query: string
): CatalogViewModel[] {
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

// ────────────────────────────────────────────────────────────────────────────
// 8. TIER LABELS (Human-readable, bằng ngôn ngữ nghiệp vụ)
// ────────────────────────────────────────────────────────────────────────────

export const TIER_LABELS: Record<CatalogTier, { label: string; description: string; color: string }> = {
  tier1_global: {
    label: 'Toàn hệ thống',
    description: 'Dữ liệu dùng chung cho mọi phân hệ và quy trình.',
    color: 'blue'
  },
  tier2_module: {
    label: 'Theo phân hệ',
    description: 'Dữ liệu cấu hình riêng cho từng phân hệ nghiệp vụ.',
    color: 'indigo'
  },
  tier3_utility: {
    label: 'Tiện ích & Hỗ trợ',
    description: 'Dữ liệu phục vụ cho nghiệp vụ phụ trợ và báo cáo.',
    color: 'amber'
  },
  tier4_governance: {
    label: 'Quản trị',
    description: 'Quy tắc, thao tác và quy trình vận hành Master Data.',
    color: 'slate'
  }
}

export const STATUS_LABELS: Record<CatalogStatus, { label: string; color: string }> = {
  active: { label: 'Đang áp dụng', color: 'emerald' },
  upcoming: { label: 'Sắp áp dụng', color: 'blue' },
  legacy: { label: 'Dữ liệu lịch sử', color: 'amber' },
  deprecated: { label: 'Ngừng sử dụng', color: 'red' }
}
