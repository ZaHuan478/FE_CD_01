import { useGlobalSopSearch } from '../hooks/useGlobalSopSearch'
import { SearchField } from '../../../shared/ui/molecules/SearchField'

export function GlobalSopSearch() {
  const { globalSearchTerm, setGlobalSearchTerm, isGlobalSearchOpen, setIsGlobalSearchOpen, globalSearchResults, openGlobalSearchResult } = useGlobalSopSearch()
  return (
            <div className="relative hidden lg:block">
              <SearchField value={globalSearchTerm}
                onFocus={() => setIsGlobalSearchOpen(true)}
                onValueChange={(value) => { setGlobalSearchTerm(value); setIsGlobalSearchOpen(true) }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') { setIsGlobalSearchOpen(false); event.currentTarget.blur() }
                  if (event.key === 'Enter' && globalSearchResults[0]) openGlobalSearchResult(globalSearchResults[0].workflowId, globalSearchResults[0].sopCode)
                }}
                onClear={() => { setGlobalSearchTerm(''); setIsGlobalSearchOpen(false) }}
                placeholder="Tìm quy trình, mã SOP..." ariaLabel="Tìm quy trình hoặc mã SOP" />
              {isGlobalSearchOpen && globalSearchTerm.trim() && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {globalSearchResults.length > 0 ? globalSearchResults.map((result) => (
                    <button key={`${result.workflowId}-${result.sopCode}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openGlobalSearchResult(result.workflowId, result.sopCode)} className="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-sky-50 dark:hover:bg-sky-500/10">
                      <span className="mt-0.5 rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">{result.sopCode}</span>
                      <span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{result.title}</span><span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">{result.workflowId}</span></span>
                    </button>
                  )) : <p className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">Không tìm thấy quy trình hoặc mã SOP phù hợp.</p>}
                </div>
              )}
            </div>

  )
}
