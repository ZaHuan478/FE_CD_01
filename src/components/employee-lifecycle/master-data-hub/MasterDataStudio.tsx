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
  useEffect
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import {
  DOMAIN_GROUPS,
  ALL_MASTER_DATA_ITEMS,
  GOVERNANCE_ITEMS,
  computeMasterDataStats,
  getItemsByGroup,
  getGroupCounts,
  searchCatalogs,
  type CatalogViewModel,
  type DomainGroupId,
  type CatalogStatus
} from './masterDataCatalogAdapter'
import type { CatalogTier, WorkspaceView } from './types'
import { DOCX_OPERATIONAL_SOP_DATABASE } from '../workflow-detail/data/docxOperationalSopDatabase'

import {
  StudioHeader,
  DomainRail,
  CatalogWorkspace,
  ProcessGuideWorkspace,
  DetailInspector,
  MobileInspectorDrawer
} from './components'

// ── Lazy-load relationship view ─────────────────────────────────────────────
const MasterDataRelationshipView = React.lazy(() =>
  import('./MasterDataRelationshipView').then((m) => ({ default: m.MasterDataRelationshipView }))
)

// ────────────────────────────────────────────────────────────────────────────
// PROPS
// ────────────────────────────────────────────────────────────────────────────

export interface MasterDataStudioProps {
  isDarkMode: boolean
  sopCode?: string | null
  onOpenERD?: () => void
}

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
    () => (initCatalog ? ALL_MASTER_DATA_ITEMS.find((item) => item.id === initCatalog) ?? null : null)
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
    const query = processSearch
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('vi')
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

  const [selectedStepCode, setSelectedStepCode] = useState(
    contextProcess?.steps[0]?.stepCode || ''
  )
  useEffect(() => {
    setSelectedStepCode(contextProcess?.steps[0]?.stepCode || '')
  }, [contextProcess])

  const selectedStep =
    contextProcess?.steps.find((s) => s.stepCode === selectedStepCode) ??
    contextProcess?.steps[0]

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
  const subdued = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

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
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className={`text-sm font-medium ${subdued}`}>
                    Đang tải bản đồ quan hệ...
                  </span>
                </div>
              }
            >
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
        <div
          className={`
          hidden xl:flex xl:flex-col
          w-[360px] shrink-0
          overflow-y-auto
          border-l border-slate-200 dark:border-slate-800
          sticky top-0 max-h-[calc(100vh-160px)]
        `}
        >
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
