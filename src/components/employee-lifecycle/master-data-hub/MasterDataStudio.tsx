/**
 * MasterDataStudio.tsx
 *
 * Master Data Studio — thay thế MasterDataHub với layout 3 panel:
 *   Left Domain Rail  |  Center Workspace  |  Right Detail Inspector
 *
 * Route: /employee-lifecycle/masterdata
 * Hỗ trợ query string: ?view=catalogs|process|relations&group=<DomainGroupId>&catalog=<code>
 */
import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  useRef,
  useEffect
} from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Globe,
  MapPin,
  Building2,
  Clock,
  Wallet,
  FileText,
  ShieldCheck,
  Search,
  ChevronRight,
  Network,
  BookOpen,
  Database,
  Filter,
  X,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  XCircle,
  ListChecks,
  Users,
  Layers3,
  BarChart3,
  ClipboardList,
  UserRound,
  GitBranch,
  Loader2
} from 'lucide-react'

import {
  DOMAIN_GROUPS,
  ALL_MASTER_DATA_ITEMS,
  GOVERNANCE_ITEMS,
  computeMasterDataStats,
  getItemsByGroup,
  getGroupCounts,
  searchCatalogs,
  TIER_LABELS,
  STATUS_LABELS,
  type CatalogViewModel,
  type DomainGroupId,
  type CatalogStatus
} from './masterDataCatalogAdapter'
import type { CatalogTier } from './types'
import { DOCX_OPERATIONAL_SOP_DATABASE } from '../workflow-detail/data/docxOperationalSopDatabase'
import type { SopSubProcess } from '../workflow-detail/types'
import { erdClustersData as _erdClustersData } from '../data/erdClustersData'

// ── Lazy-load relationship view ─────────────────────────────────────────────
const MasterDataRelationshipView = React.lazy(() =>
  import('./MasterDataRelationshipView').then((m) => ({ default: m.MasterDataRelationshipView }))
)

// ────────────────────────────────────────────────────────────────────────────
// ICON MAP
// ────────────────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, MapPin, Building2, Clock, Wallet, FileText, ShieldCheck,
  Search, Network, BookOpen, Database, Filter, ClipboardList, UserRound, GitBranch
}

function DomainIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Database
  return <Icon className={className} aria-hidden="true" />
}

// ────────────────────────────────────────────────────────────────────────────
// COLOR HELPERS
// ────────────────────────────────────────────────────────────────────────────

type ColorKey = 'blue' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate' | 'red'

const BG_LIGHT: Record<ColorKey, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  red: 'bg-red-50 text-red-700 border-red-200'
}

const BG_DARK: Record<ColorKey, string> = {
  blue: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  emerald: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  indigo: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
  amber: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  rose: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  purple: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
  slate: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  red: 'dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60'
}

function colorBadge(color: string): string {
  const c = color as ColorKey
  return `${BG_LIGHT[c] ?? BG_LIGHT.slate} ${BG_DARK[c] ?? BG_DARK.slate}`
}

function statusIcon(status: CatalogStatus) {
  switch (status) {
    case 'active': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
    case 'upcoming': return <Clock3 className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
    case 'legacy': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
    case 'deprecated': return <XCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PROPS
// ────────────────────────────────────────────────────────────────────────────

interface MasterDataStudioProps {
  isDarkMode: boolean
  sopCode?: string | null
  onOpenERD?: () => void
}

type WorkspaceView = 'catalogs' | 'process' | 'relations'

// ────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export const MasterDataStudio: React.FC<MasterDataStudioProps> = ({
  isDarkMode,
  sopCode
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Derived initial state from query string ─────────────────────────────
  const initView = (searchParams.get('view') as WorkspaceView) || 'catalogs'
  const initGroup = (searchParams.get('group') as DomainGroupId) || 'identity'
  const initCatalog = searchParams.get('catalog') || null

  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>(initView)
  const [activeGroupId, setActiveGroupId] = useState<DomainGroupId>(initGroup)
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogViewModel | null>(
    () => initCatalog ? ALL_MASTER_DATA_ITEMS.find((item) => item.id === initCatalog) ?? null : null
  )
  const [catalogSearch, setCatalogSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<CatalogTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CatalogStatus | 'all'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mobile: Right Inspector opens as drawer
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  // Process Guide state (carries over from legacy MasterDataHub)
  const [selectedProcessCode, setSelectedProcessCode] = useState(sopCode || '')
  const [processSearch, setProcessSearch] = useState('')

  // Stats computed once
  const stats = useMemo(() => computeMasterDataStats(), [])
  const groupCounts = useMemo(() => getGroupCounts(), [])

  // ── Sync query string (non-blocking) ────────────────────────────────────
  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    next.set('view', workspaceView)
    next.set('group', activeGroupId)
    if (selectedCatalog) next.set('catalog', selectedCatalog.id)
    else next.delete('catalog')
    // Only update if changed to avoid back-button thrash
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [workspaceView, activeGroupId, selectedCatalog]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Items for center workspace ──────────────────────────────────────────
  const groupItems = useMemo(() => getItemsByGroup(activeGroupId), [activeGroupId])

  const filteredItems = useMemo(() => {
    let items = catalogSearch.trim() ? searchCatalogs(groupItems, catalogSearch) : groupItems
    if (tierFilter !== 'all') items = items.filter((item) => item.tier === tierFilter)
    if (statusFilter !== 'all') items = items.filter((item) => item.status === statusFilter)
    return items
  }, [groupItems, catalogSearch, tierFilter, statusFilter])

  // ── Process guide data ──────────────────────────────────────────────────
  const allOperationalProcesses = useMemo(
    () => Object.values(DOCX_OPERATIONAL_SOP_DATABASE).flat(),
    []
  )
  const filteredProcesses = useMemo(() => {
    const query = processSearch.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi')
    if (!query) return allOperationalProcesses
    return allOperationalProcesses.filter((p) =>
      [p.sopCode, p.sopTitle, p.sopCategory, p.description]
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('vi')
        .includes(query)
    )
  }, [processSearch, allOperationalProcesses])

  const contextProcess = useMemo(() => {
    if (!selectedProcessCode) return undefined
    return allOperationalProcesses.find(
      (p) => p.sopCode.toLowerCase() === selectedProcessCode.toLowerCase()
    )
  }, [selectedProcessCode, allOperationalProcesses])

  const [selectedStepCode, setSelectedStepCode] = useState(contextProcess?.steps[0]?.stepCode || '')
  useEffect(() => {
    setSelectedStepCode(contextProcess?.steps[0]?.stepCode || '')
  }, [contextProcess])

  const selectedStep = contextProcess?.steps.find((s) => s.stepCode === selectedStepCode) ?? contextProcess?.steps[0]

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectCatalog = useCallback((item: CatalogViewModel) => {
    setSelectedCatalog(item)
    setIsInspectorOpen(true)
  }, [])

  const handleGroupChange = useCallback((groupId: DomainGroupId) => {
    setActiveGroupId(groupId)
    setSelectedCatalog(null)
    setCatalogSearch('')
  }, [])

  const handleViewChange = useCallback((view: WorkspaceView) => {
    setWorkspaceView(view)
    setSelectedCatalog(null)
  }, [])

  const filterActive = tierFilter !== 'all' || statusFilter !== 'all'
  const activeGroup = DOMAIN_GROUPS.find((g) => g.id === activeGroupId)!

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

  const subdued = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className="w-full flex flex-col gap-0 animate-fadeIn">

      {/* ── COMPACT HEADER ─────────────────────────────────────────────── */}
      <StudioHeader
        isDarkMode={isDarkMode}
        stats={stats}
        workspaceView={workspaceView}
        onViewChange={handleViewChange}
      />

      {/* ── 3-PANEL STUDIO LAYOUT ─────────────────────────────────────── */}
      <div className="flex gap-0 min-h-[calc(100vh-220px)] relative">

        {/* ── LEFT DOMAIN RAIL ───────────────────────────────────────── */}
        <DomainRail
          isDarkMode={isDarkMode}
          activeGroupId={activeGroupId}
          groupCounts={groupCounts}
          onGroupChange={handleGroupChange}
          workspaceView={workspaceView}
        />

        {/* ── CENTER WORKSPACE ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          {workspaceView === 'catalogs' && (
            <CatalogWorkspace
              isDarkMode={isDarkMode}
              activeGroup={activeGroup}
              filteredItems={filteredItems}
              allGroupItems={groupItems}
              selectedCatalog={selectedCatalog}
              catalogSearch={catalogSearch}
              onSearchChange={setCatalogSearch}
              tierFilter={tierFilter}
              statusFilter={statusFilter}
              onTierFilter={setTierFilter}
              onStatusFilter={setStatusFilter}
              isFilterOpen={isFilterOpen}
              onToggleFilter={() => setIsFilterOpen((v) => !v)}
              filterActive={filterActive}
              onSelectCatalog={handleSelectCatalog}
              subdued={subdued}
            />
          )}
          {workspaceView === 'process' && (
            <ProcessGuideWorkspace
              isDarkMode={isDarkMode}
              processSearch={processSearch}
              onProcessSearchChange={setProcessSearch}
              filteredProcesses={filteredProcesses}
              selectedProcessCode={selectedProcessCode}
              onSelectProcess={setSelectedProcessCode}
              contextProcess={contextProcess}
              selectedStep={selectedStep}
              selectedStepCode={selectedStepCode}
              onSelectStep={setSelectedStepCode}
              governanceItems={GOVERNANCE_ITEMS}
              subdued={subdued}
            />
          )}
          {workspaceView === 'relations' && (
            <Suspense fallback={
              <div className="flex items-center justify-center h-64 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className={`text-sm font-medium ${subdued}`}>Đang tải bản đồ quan hệ...</span>
              </div>
            }>
              <MasterDataRelationshipView
                isDarkMode={isDarkMode}
                mode="embedded"
                selectedCatalogId={selectedCatalog?.id}
                onSelectCatalog={(id) => {
                  const found = ALL_MASTER_DATA_ITEMS.find((item) => item.id === id)
                  if (found) {
                    setSelectedCatalog(found)
                    setWorkspaceView('catalogs')
                    setActiveGroupId(found.domainGroupId)
                  }
                }}
              />
            </Suspense>
          )}
        </div>

        {/* ── RIGHT DETAIL INSPECTOR (desktop sticky) ────────────────── */}
        <div className={`
          hidden xl:flex xl:flex-col
          w-[360px] shrink-0
          overflow-y-auto
          border-l border-slate-200 dark:border-slate-800
          sticky top-0 max-h-[calc(100vh-160px)]
        `}>
          <DetailInspector
            isDarkMode={isDarkMode}
            selectedCatalog={selectedCatalog}
            contextProcess={contextProcess}
            onNavigateToCatalog={(id) => {
              const found = ALL_MASTER_DATA_ITEMS.find((item) => item.id === id)
              if (found) {
                setSelectedCatalog(found)
                setWorkspaceView('catalogs')
                setActiveGroupId(found.domainGroupId)
              }
            }}
            subdued={subdued}
          />
        </div>

        {/* ── MOBILE INSPECTOR DRAWER ────────────────────────────────── */}
        {isInspectorOpen && selectedCatalog && (
          <MobileInspectorDrawer
            isDarkMode={isDarkMode}
            selectedCatalog={selectedCatalog}
            onClose={() => setIsInspectorOpen(false)}
            subdued={subdued}
          />
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: STUDIO HEADER
// ────────────────────────────────────────────────────────────────────────────

interface StudioHeaderProps {
  isDarkMode: boolean
  stats: ReturnType<typeof computeMasterDataStats>
  workspaceView: WorkspaceView
  onViewChange: (v: WorkspaceView) => void
}

const StudioHeader: React.FC<StudioHeaderProps> = ({ isDarkMode, stats, workspaceView, onViewChange }) => {
  const surface = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'

  const TABS: Array<{ id: WorkspaceView; label: string; icon: React.ElementType }> = [
    { id: 'catalogs', label: 'Danh mục', icon: Database },
    { id: 'process', label: 'Theo quy trình', icon: ClipboardList },
    { id: 'relations', label: 'Bản đồ quan hệ', icon: Network }
  ]

  const statItems = [
    { label: 'Danh mục', value: stats.totalCatalogs, icon: Database, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Nhóm nghiệp vụ', value: stats.totalDomainGroups, icon: Layers3, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Phân hệ dùng', value: stats.totalConsumerModules, icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Trường khai báo', value: stats.totalFieldsDefined, icon: ListChecks, color: 'text-amber-600 dark:text-amber-400' }
  ]

  return (
    <div className={`border-b ${surface}`}>
      {/* Tab bar */}
      <div className={`px-4 sm:px-5 flex gap-1 ${isDarkMode ? 'bg-slate-950/30' : 'bg-slate-50/80'}`}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = workspaceView === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(id)}
              className={`
                flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold
                border-b-2 transition-colors cursor-pointer whitespace-nowrap
                focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
                ${active
                  ? 'border-blue-600 text-blue-700 dark:text-blue-300 dark:border-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DOMAIN RAIL (LEFT)
// ────────────────────────────────────────────────────────────────────────────

interface DomainRailProps {
  isDarkMode: boolean
  activeGroupId: DomainGroupId
  groupCounts: Record<DomainGroupId, number>
  onGroupChange: (id: DomainGroupId) => void
  workspaceView: WorkspaceView
}

const DomainRail: React.FC<DomainRailProps> = ({
  isDarkMode, activeGroupId, groupCounts, onGroupChange, workspaceView
}) => {
  const railRef = useRef<HTMLDivElement>(null)

  return (
    <nav
      ref={railRef}
      aria-label="Nhóm nghiệp vụ Master Data"
      className={`
        shrink-0
        w-full sm:w-56 xl:w-60
        border-r border-slate-200 dark:border-slate-800
        overflow-y-auto
        ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50/80'}
        hidden sm:flex flex-col
        sticky top-0 max-h-[calc(100vh-160px)]
      `}
    >
      <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Nhóm nghiệp vụ
        </p>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {DOMAIN_GROUPS.map((group) => {
          const active = activeGroupId === group.id
          const count = groupCounts[group.id] ?? 0
          // In process tab, we show all groups but visual differentiation is less important
          const dimmed = workspaceView === 'process' && !active

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onGroupChange(group.id)}
              aria-current={active ? 'true' : undefined}
              className={`
                group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                text-left transition-all cursor-pointer
                focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-1
                ${active
                  ? isDarkMode
                    ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40'
                    : 'bg-blue-50 text-blue-800 ring-1 ring-blue-200'
                  : dimmed
                    ? 'opacity-50 hover:opacity-100'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }
              `}
            >
              <span className={`
                flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                ${active
                  ? 'bg-blue-600 text-white'
                  : isDarkMode ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700' : 'bg-white text-slate-500 group-hover:bg-slate-50 border border-slate-200'
                }
              `}>
                <DomainIcon name={group.iconName} className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-bold leading-snug truncate">{group.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-medium ${active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}`}>
                    {count} mục
                  </span>
                )}
              </span>
              {active && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-blue-500" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: CATALOG WORKSPACE (CENTER)
// ────────────────────────────────────────────────────────────────────────────

interface CatalogWorkspaceProps {
  isDarkMode: boolean
  activeGroup: typeof DOMAIN_GROUPS[number]
  filteredItems: CatalogViewModel[]
  allGroupItems: CatalogViewModel[]
  selectedCatalog: CatalogViewModel | null
  catalogSearch: string
  onSearchChange: (v: string) => void
  tierFilter: CatalogTier | 'all'
  statusFilter: CatalogStatus | 'all'
  onTierFilter: (v: CatalogTier | 'all') => void
  onStatusFilter: (v: CatalogStatus | 'all') => void
  isFilterOpen: boolean
  onToggleFilter: () => void
  filterActive: boolean
  onSelectCatalog: (item: CatalogViewModel) => void
  subdued: string
}

const CatalogWorkspace: React.FC<CatalogWorkspaceProps> = ({
  isDarkMode, activeGroup, filteredItems, allGroupItems,
  selectedCatalog, catalogSearch, onSearchChange,
  tierFilter, statusFilter, onTierFilter, onStatusFilter,
  isFilterOpen, onToggleFilter, filterActive,
  onSelectCatalog, subdued
}) => {
  const TIERS: Array<{ value: CatalogTier | 'all'; label: string }> = [
    { value: 'all', label: 'Tất cả tầng' },
    { value: 'tier1_global', label: TIER_LABELS.tier1_global.label },
    { value: 'tier2_module', label: TIER_LABELS.tier2_module.label },
    { value: 'tier3_utility', label: TIER_LABELS.tier3_utility.label },
    { value: 'tier4_governance', label: TIER_LABELS.tier4_governance.label }
  ]

  const STATUSES: Array<{ value: CatalogStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: STATUS_LABELS.active.label },
    { value: 'upcoming', label: STATUS_LABELS.upcoming.label },
    { value: 'legacy', label: STATUS_LABELS.legacy.label },
    { value: 'deprecated', label: STATUS_LABELS.deprecated.label }
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Workspace toolbar */}
      <div className={`
        px-4 sm:px-5 py-3 border-b
        ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white/80'}
        sticky top-0 z-10
      `}>
        <div className="flex items-center gap-2">
          {/* Group label & count */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className={`
              inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0
              ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}
            `}>
              <DomainIcon name={activeGroup.iconName} className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {activeGroup.label}
              </h3>
              <p className={`text-[10px] font-medium ${subdued}`}>
                {filteredItems.length}/{allGroupItems.length} danh mục
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-44 sm:w-56">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={catalogSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm trong nhóm..."
              aria-label="Tìm danh mục trong nhóm"
              className={`
                w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none
                transition-colors focus:border-blue-500
                ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }
              `}
            />
          </div>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={onToggleFilter}
            aria-expanded={isFilterOpen}
            aria-label="Bộ lọc"
            className={`
              relative p-2 rounded-lg border transition-colors cursor-pointer
              focus-visible:outline-2 focus-visible:outline-blue-500
              ${filterActive
                ? 'bg-blue-600 border-blue-600 text-white'
                : isDarkMode
                  ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }
            `}
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            {filterActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" aria-label="Có bộ lọc đang bật" />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className={`mt-3 p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className={`text-[10px] font-extrabold ${subdued} uppercase tracking-wide block mb-1.5`}>Tầng dữ liệu</label>
                <div className="flex flex-wrap gap-1">
                  {TIERS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onTierFilter(value)}
                      className={`
                        px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors
                        ${tierFilter === value
                          ? 'bg-blue-600 text-white'
                          : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-[10px] font-extrabold ${subdued} uppercase tracking-wide block mb-1.5`}>Trạng thái</label>
                <div className="flex flex-wrap gap-1">
                  {STATUSES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onStatusFilter(value)}
                      className={`
                        px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors
                        ${statusFilter === value
                          ? 'bg-blue-600 text-white'
                          : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Catalog list */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* Group description (only if no search) */}
        {!catalogSearch && (
          <p className={`text-xs leading-relaxed mb-4 ${subdued} px-1`}>
            {activeGroup.description}
          </p>
        )}

        {filteredItems.length === 0 && (
          <div className={`text-center py-16 ${subdued}`}>
            <Database className="w-8 h-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
            <p className="text-sm font-medium">
              {catalogSearch ? 'Không tìm thấy danh mục phù hợp.' : 'Nhóm này chưa có dữ liệu demo.'}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {filteredItems.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              isSelected={selectedCatalog?.id === item.id}
              isDarkMode={isDarkMode}
              onSelect={onSelectCatalog}
              subdued={subdued}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: CATALOG CARD
// ────────────────────────────────────────────────────────────────────────────

interface CatalogCardProps {
  item: CatalogViewModel
  isSelected: boolean
  isDarkMode: boolean
  onSelect: (item: CatalogViewModel) => void
  subdued: string
}

const CatalogCard: React.FC<CatalogCardProps> = ({ item, isSelected, isDarkMode, onSelect, subdued }) => {
  const tierInfo = TIER_LABELS[item.tier]
  const statusInfo = STATUS_LABELS[item.status]

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-pressed={isSelected}
      aria-label={`Xem chi tiết ${item.title}`}
      className={`
        group w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer
        focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-1
        ${isSelected
          ? isDarkMode
            ? 'border-blue-500/70 bg-blue-600/15 ring-1 ring-blue-500/30'
            : 'border-blue-400 bg-blue-50/70 ring-1 ring-blue-200'
          : isDarkMode
            ? 'border-slate-800 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60'
            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Code badge + type */}
        <div className="shrink-0 flex flex-col items-start gap-1">
          <span className={`
            px-2 py-0.5 rounded font-mono text-[10px] font-bold
            ${isSelected ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}
          `}>
            {item.code}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-extrabold leading-snug ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'} transition-colors`}>
              {item.title}
            </h4>
            {/* Status icon inline */}
            <span className="shrink-0 mt-0.5" title={statusInfo.label}>
              {statusIcon(item.status)}
            </span>
          </div>
          <p className={`text-xs mt-1 leading-snug line-clamp-2 ${subdued}`}>{item.summary}</p>

          {/* Legacy geo warning */}
          {item.status === 'legacy' && item.geoMetadata?.legacyNote && (
            <div className={`mt-2 flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-[11px] leading-snug
              ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-800'}`}>
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item.geoMetadata.legacyNote}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Tier badge */}
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge(tierInfo.color)}`}>
              {tierInfo.label}
            </span>
            {/* Consumer modules */}
            {item.consumerModules.slice(0, 3).map((mod) => (
              <span key={mod} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {mod}
              </span>
            ))}
            {item.consumerModules.length > 3 && (
              <span className={`text-[10px] ${subdued}`}>+{item.consumerModules.length - 3}</span>
            )}
            {/* Field count */}
            {item.fieldCount > 0 && (
              <span className={`ml-auto text-[10px] font-medium ${subdued}`}>
                {item.fieldCount} trường
              </span>
            )}
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${isSelected ? 'text-blue-500' : subdued}`} aria-hidden="true" />
      </div>
    </button>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PROCESS GUIDE WORKSPACE
// ────────────────────────────────────────────────────────────────────────────

interface ProcessGuideWorkspaceProps {
  isDarkMode: boolean
  processSearch: string
  onProcessSearchChange: (v: string) => void
  filteredProcesses: SopSubProcess[]
  selectedProcessCode: string
  onSelectProcess: (code: string) => void
  contextProcess: SopSubProcess | undefined
  selectedStep: SopSubProcess['steps'][number] | undefined
  selectedStepCode: string
  onSelectStep: (code: string) => void
  governanceItems: CatalogViewModel[]
  subdued: string
}

const ProcessGuideWorkspace: React.FC<ProcessGuideWorkspaceProps> = ({
  isDarkMode, processSearch, onProcessSearchChange,
  filteredProcesses, selectedProcessCode, onSelectProcess,
  contextProcess, selectedStep, selectedStepCode, onSelectStep,
  governanceItems, subdued
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className={`
        px-4 sm:px-5 py-3 border-b
        ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white/80'}
        sticky top-0 z-10
      `}>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Hướng dẫn theo quy trình</h3>
        <p className={`text-xs ${subdued} mb-3`}>Chọn một quy trình để xem từng bước thực hiện và danh mục Master Data liên quan.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <input
              value={processSearch}
              onChange={(e) => onProcessSearchChange(e.target.value)}
              placeholder="Tìm quy trình (tên, mã SOP)..."
              aria-label="Tìm quy trình"
              className={`
                w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors focus:border-blue-500
                ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'}
              `}
            />
          </div>
          <label htmlFor="process-guide-select" className="sr-only">Chọn quy trình</label>
          <select
            id="process-guide-select"
            value={selectedProcessCode}
            onChange={(e) => onSelectProcess(e.target.value)}
            className={`
              flex-[1.4] rounded-lg border px-3 py-2 text-xs font-semibold outline-none
              focus:border-blue-500 cursor-pointer
              ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}
            `}
          >
            <option value="">— Chọn quy trình để xem hướng dẫn —</option>
            {filteredProcesses.map((p) => (
              <option key={p.sopCode} value={p.sopCode}>{p.sopCode} — {p.sopTitle}</option>
            ))}
            {filteredProcesses.length === 0 && <option disabled>Không tìm thấy quy trình</option>}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!contextProcess && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-300' : 'border-blue-100 bg-blue-50/70 text-slate-600'}`}>
            Hãy chọn một quy trình ở trên để xem danh sách bước hướng dẫn và danh mục Master Data liên quan.
          </div>
        )}

        {contextProcess && (
          <>
            {/* Step tabs */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{contextProcess.sopTitle}</h4>
                  <p className={`text-xs mt-0.5 ${subdued}`}>{contextProcess.steps.length} bước thực hiện</p>
                </div>
              </div>
              {/* Steps horizontal scroll */}
              <div className="flex gap-2 overflow-x-auto p-3 pb-2 [scrollbar-width:thin]">
                {contextProcess.steps.map((step, idx) => {
                  const active = step.stepCode === selectedStepCode || (!selectedStepCode && idx === 0)
                  return (
                    <button
                      key={step.stepCode}
                      type="button"
                      onClick={() => onSelectStep(step.stepCode)}
                      className={`
                        min-w-[160px] max-w-[240px] shrink-0 text-left px-3 py-2.5
                        rounded-xl border transition-colors cursor-pointer
                        ${active
                          ? isDarkMode ? 'border-blue-500 bg-blue-600/20 text-blue-100' : 'border-blue-500 bg-blue-50 text-blue-900'
                          : isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-black mr-1.5 ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold">{step.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step detail */}
            {selectedStep && (
              <div className={`rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                      {contextProcess.steps.findIndex((s) => s.stepCode === selectedStep.stepCode) + 1}
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold tracking-wide text-blue-600 uppercase">Việc cần thực hiện</p>
                      <h4 className="text-base font-black mt-0.5 text-slate-900 dark:text-white">{selectedStep.title}</h4>
                    </div>
                  </div>
                  {selectedStep.description && (
                    <p className={`text-sm leading-6 ${subdued} mb-4`}>{selectedStep.description.split('\n')[0]}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {selectedStep.actor && (
                      <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <UserRound className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />Người thực hiện
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>{selectedStep.actor}</p>
                      </div>
                    )}
                    {selectedStep.location && (
                      <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />Nơi thực hiện
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>{selectedStep.location}</p>
                      </div>
                    )}
                    {selectedStep.timing && (
                      <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />Thời điểm
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>{selectedStep.timing}</p>
                      </div>
                    )}
                  </div>

                  {selectedStep.fieldsChecklist && selectedStep.fieldsChecklist.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200 mb-2">Thông tin / Danh mục cần chuẩn bị</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStep.fieldsChecklist.slice(0, 15).map((f) => (
                          <span key={f} className={`px-2.5 py-1 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                            {f}
                          </span>
                        ))}
                        {selectedStep.fieldsChecklist.length > 15 && (
                          <span className={`text-xs ${subdued} py-1`}>+{selectedStep.fieldsChecklist.length - 15} thêm</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Governance section */}
        {governanceItems.length > 0 && (
          <div>
            <div className={`flex items-center gap-2 mb-3 px-1`}>
              <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                Thao tác Quản trị Danh mục (tier4_governance)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {governanceItems.map((item) => (
                <div key={item.id}
                  className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                >
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${subdued}`}>{item.summary}</p>
                  {item.fields.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.fields.slice(0, 3).map((f) => (
                        <span key={f} className={`px-1.5 py-0.5 rounded text-[10px] ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DETAIL INSPECTOR (RIGHT PANEL)
// ────────────────────────────────────────────────────────────────────────────

interface DetailInspectorProps {
  isDarkMode: boolean
  selectedCatalog: CatalogViewModel | null
  contextProcess?: SopSubProcess
  onNavigateToCatalog: (id: string) => void
  subdued: string
}

const DetailInspector: React.FC<DetailInspectorProps> = ({
  isDarkMode, selectedCatalog, subdued
}) => {
  if (!selectedCatalog) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div className={`
          w-12 h-12 rounded-2xl flex items-center justify-center mb-4
          ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}
        `} aria-hidden="true">
          <Info className="w-6 h-6 text-slate-400" />
        </div>
        <p className={`text-sm font-semibold ${subdued} mb-1`}>Chưa chọn danh mục</p>
        <p className={`text-xs ${subdued} max-w-[220px] leading-relaxed`}>
          Chọn một danh mục ở giữa để xem mục đích, trường khai báo và phân hệ sử dụng.
        </p>
      </div>
    )
  }

  const tierInfo = TIER_LABELS[selectedCatalog.tier]
  const statusInfo = STATUS_LABELS[selectedCatalog.status]

  return (
    <div className="flex flex-col">
      {/* Inspector header */}
      <div className={`
        px-4 py-3 border-b
        ${isDarkMode ? 'border-slate-800 bg-slate-900/80 sticky top-0 z-10' : 'border-slate-100 bg-white/90 sticky top-0 z-10 backdrop-blur-sm'}
      `}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {selectedCatalog.code}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-bold ${statusInfo.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : statusInfo.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
            {statusIcon(selectedCatalog.status)} {statusInfo.label}
          </span>
        </div>
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
          {selectedCatalog.title}
        </h3>
      </div>

      {/* Inspector body */}
      <div className="p-4 space-y-5 overflow-y-auto">

        {/* 1. Tổng quan */}
        <InspectorSection title="Tổng quan" icon={Info} isDarkMode={isDarkMode}>
          <p className={`text-xs leading-relaxed ${subdued}`}>{selectedCatalog.summary || selectedCatalog.description.split('\n')[0]}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge(tierInfo.color)}`}>
              {tierInfo.label}
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge('slate')}`}>
              {selectedCatalog.catalogType}
            </span>
          </div>
        </InspectorSection>

        {/* Geo metadata note (địa giới hành chính) */}
        {selectedCatalog.geoMetadata && (
          <div className={`p-3 rounded-xl text-xs leading-relaxed ${selectedCatalog.status === 'legacy'
            ? isDarkMode ? 'bg-amber-900/20 text-amber-300 border border-amber-800/50' : 'bg-amber-50 text-amber-800 border border-amber-200'
            : isDarkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/50' : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
            <div className="flex items-start gap-2">
              {selectedCatalog.status === 'legacy'
                ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                : <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              }
              <div>
                <p className="font-bold mb-1">Địa giới hành chính</p>
                <p>{selectedCatalog.geoMetadata.note || selectedCatalog.geoMetadata.legacyNote}</p>
                {selectedCatalog.geoMetadata.effectiveFrom && (
                  <p className="mt-1 font-medium">Hiệu lực từ: {selectedCatalog.geoMetadata.effectiveFrom}</p>
                )}
                {selectedCatalog.geoMetadata.effectiveTo && (
                  <p className="mt-0.5 font-medium">Hết hiệu lực: {selectedCatalog.geoMetadata.effectiveTo}</p>
                )}
                {selectedCatalog.geoMetadata.asOfDate && (
                  <p className={`mt-1 text-[10px] ${isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}`}>
                    Dữ liệu tính đến: {selectedCatalog.geoMetadata.asOfDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Quản trị */}
        <InspectorSection title="Quản trị" icon={ShieldCheck} isDarkMode={isDarkMode}>
          <div className="space-y-2">
            <InspectorRow label="Data Owner" value={selectedCatalog.ownerRole} subdued={subdued} />
            <InspectorRow label="Phạm vi" value={TIER_LABELS[selectedCatalog.tier].description} subdued={subdued} />
          </div>
        </InspectorSection>

        {/* 3. Trường dữ liệu */}
        {selectedCatalog.fields.length > 0 && (
          <InspectorSection title={`Trường khai báo (${selectedCatalog.fieldCount})`} icon={ListChecks} isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-1.5">
              {selectedCatalog.fields.slice(0, 20).map((f) => (
                <span key={f} className={`px-2 py-1 rounded-lg text-[11px] leading-snug ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                  {f}
                </span>
              ))}
              {selectedCatalog.fields.length > 20 && (
                <span className={`text-[11px] py-1 ${subdued}`}>+{selectedCatalog.fields.length - 20} trường nữa</span>
              )}
            </div>
          </InspectorSection>
        )}

        {/* 4. Phân hệ sử dụng */}
        {selectedCatalog.consumerModules.length > 0 && (
          <InspectorSection title="Phân hệ sử dụng" icon={Users} isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-2">
              {selectedCatalog.consumerModules.map((mod) => (
                <span key={mod} className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold border
                  ${isDarkMode ? 'border-indigo-700/60 bg-indigo-900/30 text-indigo-300' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}
                `}>
                  {mod}
                </span>
              ))}
            </div>
          </InspectorSection>
        )}

        {selectedCatalog.fields.length === 0 && selectedCatalog.consumerModules.length === 0 && (
          <p className={`text-xs ${subdued} text-center py-4`}>Chưa có dữ liệu mô tả chi tiết.</p>
        )}
      </div>
    </div>
  )
}

// ── Inspector helpers ─────────────────────────────────────────────────────────

interface InspectorSectionProps {
  title: string
  icon: React.ElementType
  isDarkMode: boolean
  children: React.ReactNode
}

const InspectorSection: React.FC<InspectorSectionProps> = ({ title, icon: Icon, isDarkMode, children }) => (
  <div>
    <div className={`flex items-center gap-1.5 mb-2 pb-1.5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <Icon className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
      <h4 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{title}</h4>
    </div>
    {children}
  </div>
)

interface InspectorRowProps {
  label: string
  value: string
  subdued: string
}

const InspectorRow: React.FC<InspectorRowProps> = ({ label, value, subdued }) => (
  <div className="flex items-start gap-2">
    <span className={`text-[11px] font-bold shrink-0 w-24 ${subdued}`}>{label}</span>
    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{value || '—'}</span>
  </div>
)

// ────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: MOBILE INSPECTOR DRAWER
// ────────────────────────────────────────────────────────────────────────────

interface MobileInspectorDrawerProps {
  isDarkMode: boolean
  selectedCatalog: CatalogViewModel
  onClose: () => void
  subdued: string
}

const MobileInspectorDrawer: React.FC<MobileInspectorDrawerProps> = ({
  isDarkMode, selectedCatalog, onClose, subdued
}) => {
  // Focus trap
  const drawerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    drawerRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết: ${selectedCatalog.title}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`
          relative z-10 w-full max-w-sm h-full overflow-y-auto flex flex-col
          ${isDarkMode ? 'bg-slate-900' : 'bg-white'}
        `}
      >
        <div className={`px-4 py-3 border-b flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Chi tiết danh mục</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1">
          <DetailInspector
            isDarkMode={isDarkMode}
            selectedCatalog={selectedCatalog}
            onNavigateToCatalog={() => { }}
            subdued={subdued}
          />
        </div>
      </div>
    </div>
  )
}
