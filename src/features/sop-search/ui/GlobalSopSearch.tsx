import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useGlobalSopSearch } from '../hooks/useGlobalSopSearch'
import { SearchField } from '../../../shared/ui/molecules/SearchField'

export function GlobalSopSearch() {
  const {
    globalSearchTerm,
    setGlobalSearchTerm,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    globalSearchResults,
    openGlobalSearchResult,
    openDraftWorkspace,
    searchLoading,
    searchError
  } = useGlobalSopSearch()

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleOpenMobile = () => {
    setIsMobileSearchOpen(true)
    setIsGlobalSearchOpen(true)
  }

  const handleCloseMobile = () => {
    setIsMobileSearchOpen(false)
  }

  const handleSelectResult = (result: (typeof globalSearchResults)[0]) => {
    openGlobalSearchResult(result)
    setIsMobileSearchOpen(false)
  }

  const handleOpenDraft = () => {
    openDraftWorkspace()
    setIsMobileSearchOpen(false)
  }

  return (
    <>
      {/* Mobile / Tablet search trigger button (< lg) */}
      <button
        type="button"
        onClick={handleOpenMobile}
        className="grid size-11 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-[#155e75] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:hidden"
        title="Tìm kiếm quy trình, SOP"
        aria-label="Tìm kiếm quy trình, SOP"
      >
        <Search className="size-4" />
      </button>

      {/* Desktop Search Bar (lg+) */}
      <div className="relative hidden lg:block">
        <SearchField
          value={globalSearchTerm}
          onFocus={() => setIsGlobalSearchOpen(true)}
          onValueChange={(value) => {
            setGlobalSearchTerm(value)
            setIsGlobalSearchOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsGlobalSearchOpen(false)
              event.currentTarget.blur()
            }
            if (event.key === 'Enter' && globalSearchResults[0]) {
              openGlobalSearchResult(globalSearchResults[0])
            }
          }}
          onClear={() => {
            setGlobalSearchTerm('')
            setIsGlobalSearchOpen(false)
          }}
          placeholder="Tìm quy trình, mã SOP..."
          ariaLabel="Tìm quy trình hoặc mã SOP"
        />
        {isGlobalSearchOpen && globalSearchTerm.trim() && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            {globalSearchResults.length > 0 ? (
              globalSearchResults.map((result) => (
                <button
                  key={`${result.documentId}-${result.sopCode}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => openGlobalSearchResult(result)}
                  className="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10"
                >
                  <span className="mt-0.5 rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">
                    {result.sopCode}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {result.workflowId ? `Quy trình ${result.workflowId}` : 'SOP đã công bố · Mở chi tiết'}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div role="status" className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                <p>
                  {searchLoading
                    ? 'Đang tìm kiếm...'
                    : searchError
                    ? 'Không tải được kết quả. Vui lòng thử lại.'
                    : 'Không tìm thấy SOP đã công bố phù hợp.'}
                </p>
                {!searchLoading && !searchError && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={openDraftWorkspace}
                    className="mt-2 font-bold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    Mở Chuyển hóa tài liệu để xem bản nháp →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Modal Overlay (< lg) */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 lg:hidden">
          <div className="mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Input Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
              <div className="relative flex-1 min-w-0">
                <SearchField
                  value={globalSearchTerm}
                  onFocus={() => setIsGlobalSearchOpen(true)}
                  onValueChange={(value) => {
                    setGlobalSearchTerm(value)
                    setIsGlobalSearchOpen(true)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') handleCloseMobile()
                    if (event.key === 'Enter' && globalSearchResults[0]) {
                      handleSelectResult(globalSearchResults[0])
                    }
                  }}
                  onClear={() => {
                    setGlobalSearchTerm('')
                  }}
                  placeholder="Tìm quy trình, mã SOP..."
                  ariaLabel="Tìm quy trình hoặc mã SOP"
                />
              </div>
              <button
                type="button"
                onClick={handleCloseMobile}
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                aria-label="Đóng tìm kiếm"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {globalSearchTerm.trim() === '' ? (
                <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Nhập từ khóa hoặc mã SOP (VD: EMP01, REC,...) để tìm kiếm
                </div>
              ) : globalSearchResults.length > 0 ? (
                <div className="space-y-1">
                  {globalSearchResults.map((result) => (
                    <button
                      key={`${result.documentId}-${result.sopCode}`}
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10"
                    >
                      <span className="mt-0.5 shrink-0 rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">
                        {result.sopCode}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block font-semibold text-xs text-slate-800 dark:text-slate-100">
                          {result.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                          {result.workflowId ? `Quy trình ${result.workflowId}` : 'SOP đã công bố · Mở chi tiết'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div role="status" className="px-3 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    {searchLoading
                      ? 'Đang tìm kiếm...'
                      : searchError
                      ? 'Không tải được kết quả. Vui lòng thử lại.'
                      : 'Không tìm thấy SOP đã công bố phù hợp.'}
                  </p>
                  {!searchLoading && !searchError && (
                    <button
                      type="button"
                      onClick={handleOpenDraft}
                      className="mt-3 font-bold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      Mở Chuyển hóa tài liệu để xem bản nháp →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
