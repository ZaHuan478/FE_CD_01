import React from 'react'
import { ChevronLeft, ChevronRight, Search, Filter, Database } from 'lucide-react'
import {
  getTIER_LABELS,
  getSTATUS_LABELS,
  type CatalogViewModel,
  type CatalogStatus,
  type DomainGroup,
  type DomainGroupId
} from '../../../../entities/master-data/model/masterDataCatalogAdapter'
import type { CatalogTier } from '../../../../entities/master-data/model/types'
import { DomainIcon } from './DomainIcon'
import { CatalogCard } from './CatalogCard'

export interface CatalogWorkspaceProps {
  isDarkMode: boolean
  activeGroup: DomainGroup
  domainGroups?: DomainGroup[]
  onGroupChange?: (groupId: DomainGroupId) => void
  groupCounts?: Record<string, number>
  filteredItems: CatalogViewModel[]
  filteredItemCount: number
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
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  subdued: string
}

export const CatalogWorkspace: React.FC<CatalogWorkspaceProps> = ({
  isDarkMode,
  activeGroup,
  domainGroups,
  onGroupChange,
  groupCounts,
  filteredItems,
  filteredItemCount,
  allGroupItems,
  selectedCatalog,
  catalogSearch,
  onSearchChange,
  tierFilter,
  statusFilter,
  onTierFilter,
  onStatusFilter,
  isFilterOpen,
  onToggleFilter,
  filterActive,
  onSelectCatalog,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  subdued
}) => {
  const TIERS: Array<{ value: CatalogTier | 'all'; label: string }> = [
    { value: 'all', label: 'Tất cả tầng' },
    { value: 'tier1_global', label: getTIER_LABELS().tier1_global.label },
    { value: 'tier2_module', label: getTIER_LABELS().tier2_module.label },
    { value: 'tier3_utility', label: getTIER_LABELS().tier3_utility.label },
    { value: 'tier4_governance', label: getTIER_LABELS().tier4_governance.label }
  ]

  const STATUSES: Array<{ value: CatalogStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: getSTATUS_LABELS().active.label },
    { value: 'upcoming', label: getSTATUS_LABELS().upcoming.label },
    { value: 'legacy', label: getSTATUS_LABELS().legacy.label },
    { value: 'deprecated', label: getSTATUS_LABELS().deprecated.label }
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Domain Group Selector (shown only on <sm when DomainRail is hidden) */}
      {domainGroups && onGroupChange && (
        <div
          className={`sm:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-2 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
          }`}
          aria-label="Chọn nhóm danh mục"
        >
          {domainGroups.map((group) => {
            const isSelected = group.id === activeGroup.id
            const count = groupCounts?.[group.id]
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onGroupChange(group.id)}
                className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1f5f86] text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <DomainIcon name={group.iconName} className="w-3.5 h-3.5" />
                <span>{group.label}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isDarkMode
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Workspace toolbar */}
      <div
        className={`
        px-4 sm:px-5 py-3 border-b
        ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white/80'}
        sticky top-0 z-10
      `}
      >
        <div className="flex items-center gap-2">
          {/* Group label & count */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className={`
              inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0
              ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}
            `}
            >
              <DomainIcon name={activeGroup.iconName} className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {activeGroup.label}
              </h3>
              <p className={`text-[10px] font-medium ${subdued}`}>
                {filteredItemCount}/{allGroupItems.length} danh mục
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
                ${
                  isDarkMode
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
              ${
                filterActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isDarkMode
                    ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }
            `}
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            {filterActive && (
              <span
                className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
                aria-label="Có bộ lọc đang bật"
              />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div
            className={`mt-3 p-3 rounded-xl border ${
              isDarkMode ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <label
                  className={`text-[10px] font-extrabold ${subdued} uppercase tracking-wide block mb-1.5`}
                >
                  Tầng dữ liệu
                </label>
                <div className="flex flex-wrap gap-1">
                  {TIERS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onTierFilter(value)}
                      className={`
                        px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors
                        ${
                          tierFilter === value
                            ? 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className={`text-[10px] font-extrabold ${subdued} uppercase tracking-wide block mb-1.5`}
                >
                  Trạng thái
                </label>
                <div className="flex flex-wrap gap-1">
                  {STATUSES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onStatusFilter(value)}
                      className={`
                        px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors
                        ${
                          statusFilter === value
                            ? 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
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

        {filteredItemCount === 0 && (
          <div className={`text-center py-16 ${subdued}`}>
            <Database className="w-8 h-8 mx-auto mb-2 opacity-40" aria-hidden="true" />
            <p className="text-sm font-medium">
              {catalogSearch
                ? 'Không tìm thấy danh mục phù hợp.'
                : 'Nhóm này chưa có dữ liệu demo.'}
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

        {filteredItemCount > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 px-1 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-xs font-medium ${subdued}`}>
              Hiển thị {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredItemCount)} trong {filteredItemCount} danh mục
            </p>
            <nav className="flex items-center gap-1" aria-label="Phân trang danh mục Master Data">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  aria-label={`Trang ${page}`}
                  className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition-colors ${
                    page === currentPage
                      ? 'bg-[#1f5f86] text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
