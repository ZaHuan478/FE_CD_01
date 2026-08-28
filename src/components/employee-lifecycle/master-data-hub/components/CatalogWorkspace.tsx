import React from 'react'
import { Search, Filter, Database } from 'lucide-react'
import {
  TIER_LABELS,
  STATUS_LABELS,
  type CatalogViewModel,
  type CatalogStatus,
  type DomainGroup
} from '../masterDataCatalogAdapter'
import type { CatalogTier } from '../types'
import { DomainIcon } from './DomainIcon'
import { CatalogCard } from './CatalogCard'

export interface CatalogWorkspaceProps {
  isDarkMode: boolean
  activeGroup: DomainGroup
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

export const CatalogWorkspace: React.FC<CatalogWorkspaceProps> = ({
  isDarkMode,
  activeGroup,
  filteredItems,
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
  subdued
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

        {filteredItems.length === 0 && (
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
      </div>
    </div>
  )
}
