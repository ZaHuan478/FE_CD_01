/**
 * MasterDataStudio.tsx
 *
 * Master Data Studio với layout 3 panel:
 *   Left Domain Rail  |  Center Workspace  |  Right Detail Inspector
 *
 * Route: /employee-lifecycle/masterdata
 * Hỗ trợ query string: ?view=catalogs|process|relations&group=<DomainGroupId>&catalog=<code>&page=<number>
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
  getDOMAIN_GROUPS,
  getALL_MASTER_DATA_ITEMS,
  getGOVERNANCE_ITEMS,
  getItemsByGroup,
  getGroupCounts,
  searchCatalogs,
  type CatalogViewModel,
  type DomainGroupId,
  type CatalogStatus
} from '../../../entities/master-data/model/masterDataCatalogAdapter'
import type { CatalogTier, WorkspaceView } from '../../../entities/master-data/model/types'
import { getSOP_DATABASE, getWorkflowProcesses } from '../../../entities/sop/model/sopDatabase'

import {
  StudioHeader,
  DomainRail,
  CatalogWorkspace,
  ProcessGuideWorkspace,
  DetailInspector,
  MobileInspectorDrawer
} from './components/index'

// ── Lazy-load relationship view ─────────────────────────────────────────────
const MasterDataRelationshipView = React.lazy(() =>
  import('./MasterDataRelationshipView').then((m) => ({ default: m.MasterDataRelationshipView })
))

const CATALOG_PAGE_SIZE = 6
const isWorkspaceView = (value: string | null): value is WorkspaceView =>
  value === 'catalogs' || value === 'process' || value === 'relations'

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
  const initCatalog = searchParams.get('catalog') || null

  const viewParam = searchParams.get('view')
  const catalogParam = searchParams.get('catalog')
  const workspaceView: WorkspaceView = isWorkspaceView(viewParam) ? viewParam : 'catalogs'
  const domainGroups = getDOMAIN_GROUPS()
  const activeGroup = domainGroups.find(group => group.id === searchParams.get('group'))
    ?? domainGroups.find(group => group.id === 'identity')
    ?? domainGroups[0]
  const activeGroupId = activeGroup?.id
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogViewModel | null>(
    () => (initCatalog ? getALL_MASTER_DATA_ITEMS().find((item) => item.id === initCatalog) ?? null : null)
  )
  const [catalogSearch, setCatalogSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<CatalogTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CatalogStatus | 'all'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mobile: Right Inspector opens as drawer
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  // Process Guide state
  const [selectedProcessCode, setSelectedProcessCode] = useState(sopCode || '')
  const [processSearch, setProcessSearch] = useState('')

  const groupCounts = useMemo(() => getGroupCounts(), [])

  // ── Items for center workspace ──────────────────────────────────────────
  const groupItems = useMemo(() => activeGroupId ? getItemsByGroup(activeGroupId) : [], [activeGroupId])

  const filteredItems = useMemo(() => {
    let items = catalogSearch.trim() ? searchCatalogs(groupItems, catalogSearch) : groupItems
    if (tierFilter !== 'all') items = items.filter((item) => item.tier === tierFilter)
    if (statusFilter !== 'all') items = items.filter((item) => item.status === statusFilter)
    return items
  }, [groupItems, catalogSearch, tierFilter, statusFilter])

  const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CATALOG_PAGE_SIZE))
  const currentPage = Math.min(
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    totalPages
  )
  const paginatedItems = useMemo(
    () => filteredItems.slice(
      (currentPage - 1) * CATALOG_PAGE_SIZE,
      currentPage * CATALOG_PAGE_SIZE
    ),
    [filteredItems, currentPage]
  )

  useEffect(() => {
    const catalogFromUrl = catalogParam
      ? getALL_MASTER_DATA_ITEMS().find((item) => item.id === catalogParam) ?? null
      : null
    setSelectedCatalog((current) =>
      current?.id === catalogFromUrl?.id ? current : catalogFromUrl
    )
  }, [catalogParam])

  // ── Sync query string (non-blocking) ────────────────────────────────────
  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    next.set('view', workspaceView)
    if (activeGroupId) next.set('group', activeGroupId)
    else next.delete('group')
    if (workspaceView === 'catalogs' && currentPage > 1) next.set('page', String(currentPage))
    else next.delete('page')
    // Only update if changed to avoid back-button thrash
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [workspaceView, activeGroupId, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Process guide data ──────────────────────────────────────────────────
  const allOperationalProcesses = useMemo(
    () => Array.from(
      new Map(
        Object.values(getSOP_DATABASE())
          .flat()
          .map((process) => [process.sopCode, process])
      ).values()
    ),
    []
  )
  const governanceItems = useMemo(
    () => Array.from(
      new Map(getGOVERNANCE_ITEMS().map((item) => [item.id, item])).values()
    ),
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
    const workflowId = Object.entries(getSOP_DATABASE()).find(([, processes]) => processes.some(
      process => process.sopCode.toLowerCase() === selectedProcessCode.toLowerCase()
    ))?.[0]
    return workflowId ? getWorkflowProcesses(workflowId).find(
      process => process.sopCode.toLowerCase() === selectedProcessCode.toLowerCase()
    ) : undefined
  }, [selectedProcessCode])

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
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('catalog', item.id)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleGroupChange = useCallback((groupId: DomainGroupId) => {
    setSelectedCatalog(null)
    setCatalogSearch('')
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('group', groupId)
      next.delete('catalog')
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleViewChange = useCallback((view: WorkspaceView) => {
    setSelectedCatalog(null)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('view', view)
      next.delete('catalog')
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  const handleCatalogSearchChange = useCallback((value: string) => {
    setCatalogSearch(value)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleTierFilter = useCallback((value: CatalogTier | 'all') => {
    setTierFilter(value)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleStatusFilter = useCallback((value: CatalogStatus | 'all') => {
    setStatusFilter(value)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.delete('page')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handlePageChange = useCallback((page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages)
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (safePage === 1) next.delete('page')
      else next.set('page', String(safePage))
      return next
    })
  }, [setSearchParams, totalPages])

  const filterActive = tierFilter !== 'all' || statusFilter !== 'all'
  const subdued = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col gap-0 animate-fadeIn">
      {/* ── COMPACT HEADER ─────────────────────────────────────────────── */}
      <StudioHeader
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
          {workspaceView === 'catalogs' && !activeGroup && (
            <div role="status" className="p-6 text-sm text-slate-500 dark:text-slate-400">
              Chưa có danh mục Master Data trong phạm vi truy cập của bạn.
              Nếu cần xem thêm danh mục, vui lòng liên hệ quản trị viên.
            </div>
          )}
          {workspaceView === 'catalogs' && activeGroup && (
            <CatalogWorkspace
              isDarkMode={isDarkMode}
              activeGroup={activeGroup}
              domainGroups={domainGroups}
              onGroupChange={handleGroupChange}
              groupCounts={groupCounts}
              filteredItems={paginatedItems}
              filteredItemCount={filteredItems.length}
              allGroupItems={groupItems}
              selectedCatalog={selectedCatalog}
              catalogSearch={catalogSearch}
              onSearchChange={handleCatalogSearchChange}
              tierFilter={tierFilter}
              statusFilter={statusFilter}
              onTierFilter={handleTierFilter}
              onStatusFilter={handleStatusFilter}
              isFilterOpen={isFilterOpen}
              onToggleFilter={() => setIsFilterOpen((v) => !v)}
              filterActive={filterActive}
              onSelectCatalog={handleSelectCatalog}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={CATALOG_PAGE_SIZE}
              onPageChange={handlePageChange}
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
              governanceItems={governanceItems}
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
                  const found = getALL_MASTER_DATA_ITEMS().find((item) => item.id === id)
                  if (found) {
                    setSelectedCatalog(found)
                    setSearchParams((previous) => {
                      const next = new URLSearchParams(previous)
                      next.set('view', 'catalogs')
                      next.set('group', found.domainGroupId)
                      next.set('catalog', found.id)
                      next.delete('page')
                      return next
                    })
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
              const found = getALL_MASTER_DATA_ITEMS().find((item) => item.id === id)
              if (found) {
                setSelectedCatalog(found)
                setSearchParams((previous) => {
                  const next = new URLSearchParams(previous)
                  next.set('view', 'catalogs')
                  next.set('group', found.domainGroupId)
                  next.set('catalog', found.id)
                  next.delete('page')
                  return next
                })
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
