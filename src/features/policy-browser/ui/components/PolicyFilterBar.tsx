import React, { useState } from 'react'
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { PolicyFilterState, PolicyCategory, PolicyType, PolicyStatus, PolicySeverity } from '../../../../entities/policy/model/types'
import { CATEGORY_METADATA, POLICY_TYPE_METADATA, STATUS_METADATA, SEVERITY_METADATA } from '../../../../entities/policy/lib/policyConstants'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyFilterBarProps {
  filter: PolicyFilterState
  onChangeFilter: (nextFilter: PolicyFilterState) => void
  onResetFilter: () => void
  resultCount: number
  totalCount: number
}

export const PolicyFilterBar: React.FC<PolicyFilterBarProps> = ({
  filter,
  onChangeFilter,
  onResetFilter,
  resultCount,
  totalCount
}) => {
  const { language } = useLanguage()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const isFiltered =
    filter.searchTerm.trim() !== '' ||
    filter.category !== 'all' ||
    filter.type !== 'all' ||
    filter.status !== 'all' ||
    filter.severity !== 'all'

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilter({ ...filter, searchTerm: event.target.value })
  }

  const handleClearSearch = () => {
    onChangeFilter({ ...filter, searchTerm: '' })
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, category: event.target.value as PolicyCategory | 'all' })
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, type: event.target.value as PolicyType | 'all' })
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, status: event.target.value as PolicyStatus | 'all' })
  }

  const handleSeverityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, severity: event.target.value as PolicySeverity | 'all' })
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
      {/* Top Search Bar & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={filter.searchTerm}
            onChange={handleSearchChange}
            placeholder={
              language === 'vi'
                ? 'Tìm theo mã, tên quy định, nội dung, từ khóa (VD: nghỉ phép, OT, bảng tên)...'
                : 'Search by code, title, keywords, tags (e.g. leave, overtime, badge)...'
            }
            aria-label="Tìm kiếm quy định"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2 pl-9 pr-8 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#1f5f86] dark:focus:border-sky-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-colors"
          />
          {filter.searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="sm:hidden flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Bộ lọc nâng cao' : 'Filters'}</span>
            {isFiltered && <span className="w-2 h-2 rounded-full bg-[#1f5f86]" />}
          </button>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilter}
              className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
            </button>
          )}

          {/* Results Counter Pill */}
          <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700">
            {resultCount} / {totalCount} {language === 'vi' ? 'quy định' : 'policies'}
          </div>
        </div>
      </div>

      {/* Desktop Filter Dropdowns (Or Collapsible on Mobile) */}
      <div
        className={`${
          isMobileFilterOpen ? 'grid' : 'hidden sm:grid'
        } grid-cols-2 md:grid-cols-4 gap-2.5 pt-1`}
      >
        {/* Category Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-category" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {language === 'vi' ? 'Nhóm nghiệp vụ' : 'Category'}
          </label>
          <div className="relative">
            <select
              id="filter-category"
              value={filter.category}
              onChange={handleCategoryChange}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#1f5f86] transition-colors cursor-pointer"
            >
              <option value="all">{language === 'vi' ? 'Tất cả nhóm nghiệp vụ' : 'All Categories'}</option>
              {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
                <option key={key} value={key}>
                  {language === 'vi' ? meta.label : meta.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Policy Type Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-type" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {language === 'vi' ? 'Loại quy định' : 'Policy Type'}
          </label>
          <select
            id="filter-type"
            value={filter.type}
            onChange={handleTypeChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#1f5f86] transition-colors cursor-pointer"
          >
            <option value="all">{language === 'vi' ? 'Tất cả loại quy định' : 'All Types'}</option>
            {Object.entries(POLICY_TYPE_METADATA).map(([key, meta]) => (
              <option key={key} value={key}>
                {language === 'vi' ? meta.label : meta.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-status" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {language === 'vi' ? 'Trạng thái hiệu lực' : 'Status'}
          </label>
          <select
            id="filter-status"
            value={filter.status}
            onChange={handleStatusChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#1f5f86] transition-colors cursor-pointer"
          >
            <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All Statuses'}</option>
            {Object.entries(STATUS_METADATA).map(([key, meta]) => (
              <option key={key} value={key}>
                {language === 'vi' ? meta.label : meta.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-severity" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {language === 'vi' ? 'Mức độ tuân thủ' : 'Severity'}
          </label>
          <select
            id="filter-severity"
            value={filter.severity}
            onChange={handleSeverityChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#1f5f86] transition-colors cursor-pointer"
          >
            <option value="all">{language === 'vi' ? 'Tất cả mức độ' : 'All Severities'}</option>
            {Object.entries(SEVERITY_METADATA).map(([key, meta]) => (
              <option key={key} value={key}>
                {language === 'vi' ? meta.label : meta.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
