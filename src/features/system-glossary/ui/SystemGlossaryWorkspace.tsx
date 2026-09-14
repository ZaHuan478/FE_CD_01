import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSystemGlossary } from '../model/systemGlossaryModel'
import { GlossarySearch } from './GlossarySearch'
import { GlossaryCategoryFilter } from './GlossaryCategoryFilter'
import { GlossaryAlphabetNav } from './GlossaryAlphabetNav'
import { GlossaryTermCard } from './GlossaryTermCard'
import { GlossaryTermDrawer } from './GlossaryTermDrawer'
import { GlossaryEmptyState } from './GlossaryEmptyState'

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = [1]
  if (current > 3) {
    pages.push('...')
  }
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (current < total - 2) {
    pages.push('...')
  }
  pages.push(total)
  return pages
}

export interface SystemGlossaryWorkspaceProps {
  onOpenRoute?: (routePath: string) => void
}

export const SystemGlossaryWorkspace: React.FC<SystemGlossaryWorkspaceProps> = ({ onOpenRoute }) => {
  const {
    items,
    total,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    loading,
    error,
    reload,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLetter,
    setSelectedLetter,
    resetFilters,
    availableLetters,
    selectedTerm,
    isDrawerOpen,
    drawerLoading,
    openDrawer,
    closeDrawer
  } = useSystemGlossary()

  const isFiltering =
    Boolean(searchQuery.trim()) || selectedCategory !== 'Tất cả' || selectedLetter !== 'Tất cả'

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-800/80 border border-cyan-100/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Tra cứu chuẩn mực</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Từ điển thuật ngữ & Khái niệm chuẩn
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Giải nghĩa toàn bộ các khái niệm, quy tắc viết tắt và thuật ngữ chuyên ngành được sử dụng trong hệ thống HRM SOP: từ cấu trúc quy trình, vai trò thẩm quyền đến lưu đồ tương tác và trợ lý AI.
          </p>
        </div>
      </div>

      {/* Control Bar: Search + Category + Alphabet */}
      <div className="space-y-3.5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <GlossarySearch
          value={searchQuery}
          onChange={setSearchQuery}
          totalResults={total}
        />

        {/* Category Pills */}
        <div className="pt-1">
          <GlossaryCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Alphabet Bar */}
        <div className="pt-1">
          <GlossaryAlphabetNav
            selectedLetter={selectedLetter}
            onSelectLetter={setSelectedLetter}
            availableLetters={availableLetters}
          />
        </div>

        {/* Active Filter Chips */}
        {isFiltering && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium">Đang lọc theo:</span>
              {searchQuery.trim() && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Từ khóa: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedCategory !== 'Tất cả' && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-medium">
                  Nhóm: {selectedCategory}
                </span>
              )}
              {selectedLetter !== 'Tất cả' && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                  Chữ cái: {selectedLetter}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
                <div className="pt-2 flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <GlossaryEmptyState
            type="error"
            message={error}
            onAction={reload}
            actionLabel="Tải lại từ điển"
          />
        ) : items.length === 0 ? (
          <GlossaryEmptyState
            type={isFiltering ? 'search' : 'empty'}
            onAction={isFiltering ? resetFilters : undefined}
            actionLabel={isFiltering ? 'Xóa tất cả bộ lọc' : undefined}
          />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(term => (
                <GlossaryTermCard
                  key={term.id}
                  term={term}
                  onClick={() => openDrawer(term)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between text-xs">
                {/* Left side: Range summary & Page size selector */}
                <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                  <span>
                    Hiển thị{' '}
                    <strong className="font-bold text-slate-900 dark:text-white">
                      {Math.min(total, (page - 1) * limit + 1)}
                    </strong>{' '}
                    –{' '}
                    <strong className="font-bold text-slate-900 dark:text-white">
                      {Math.min(total, page * limit)}
                    </strong>{' '}
                    trên tổng số <strong className="font-bold text-slate-900 dark:text-white">{total}</strong> thuật ngữ
                  </span>

                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">Mỗi trang:</span>
                    <select
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      aria-label="Số thuật ngữ mỗi trang"
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <option value={9}>9 / trang</option>
                      <option value={12}>12 / trang</option>
                      <option value={24}>24 / trang</option>
                      <option value={36}>36 / trang</option>
                    </select>
                  </div>
                </div>

                {/* Right side: Page navigation */}
                {totalPages > 1 && (
                  <nav aria-label="Phân trang từ điển thuật ngữ" className="flex items-center gap-1.5 self-center sm:self-auto">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      aria-label="Trang trước"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>Trước</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers(page, totalPages).map((item, idx) => {
                        if (item === '...') {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-1.5 text-slate-400 select-none text-xs"
                            >
                              …
                            </span>
                          )
                        }

                        const pageNum = Number(item)
                        const isActive = page === pageNum

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            disabled={loading}
                            onClick={() => {
                              setPage(pageNum)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Trang ${pageNum}`}
                            className={`min-w-8 rounded-xl px-2.5 py-1.5 font-bold transition shadow-2xs ${
                              isActive
                                ? 'bg-cyan-700 text-white shadow-xs dark:bg-cyan-600'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={page >= totalPages || loading}
                      onClick={() => {
                        setPage((p) => Math.min(totalPages, p + 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      aria-label="Trang sau"
                    >
                      <span>Sau</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </nav>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <GlossaryTermDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        term={selectedTerm}
        loading={drawerLoading}
        onSelectTerm={openDrawer}
        onOpenRoute={onOpenRoute}
      />
    </div>
  )
}
