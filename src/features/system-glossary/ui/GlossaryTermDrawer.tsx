import React, { useEffect, useRef } from 'react'
import type { GlossaryTerm } from '../model/systemGlossaryModel'

interface GlossaryTermDrawerProps {
  isOpen: boolean
  onClose: () => void
  term: GlossaryTerm | null
  loading?: boolean
  onSelectTerm?: (termOrSlug: string) => void
  onOpenRoute?: (routePath: string) => void
}

export const GlossaryTermDrawer: React.FC<GlossaryTermDrawerProps> = ({
  isOpen,
  onClose,
  term,
  loading = false,
  onSelectTerm,
  onOpenRoute
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOpenRoute = () => {
    if (term?.routePath) {
      onClose()
      if (onOpenRoute) {
        onOpenRoute(term.routePath)
      } else if (typeof window !== 'undefined') {
        window.location.assign(term.routePath)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="glossary-drawer-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                {term?.category || 'Thuật ngữ'}
              </span>
              {term?.currentPublishedVersion && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  v{term.currentPublishedVersion}.0
                </span>
              )}
            </div>

            <h2 id="glossary-drawer-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {term?.term || 'Chi tiết thuật ngữ'}
            </h2>

            {term?.vietnameseName && term.vietnameseName !== term.term && (
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400 mt-0.5">
                {term.vietnameseName}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Đóng bảng chi tiết"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700 dark:text-slate-300">
          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          ) : term ? (
            <>
              {/* Short Definition Highlight */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 mb-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Định nghĩa nhanh
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {term.shortDefinition || 'Chưa có định nghĩa tóm tắt.'}
                </p>
              </div>

              {/* Detailed Definition */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Giải thích chi tiết & Ngữ cảnh HRM SOP
                </h4>
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {term.detailedDefinition || 'Đang cập nhật nội dung giải thích chi tiết.'}
                </div>
              </div>

              {/* Examples in system */}
              {term.examples && term.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Ví dụ thực tế trong hệ thống
                  </h4>
                  <ul className="space-y-2">
                    {term.examples.map((example, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                          ✓
                        </span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Aliases */}
              {term.aliases && term.aliases.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Bí danh / Tên gọi khác
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {term.aliases.map((alias, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Terms */}
              {((term.relatedTerms && term.relatedTerms.length > 0) ||
                (term.relatedTermSlugs && term.relatedTermSlugs.length > 0)) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Thuật ngữ liên quan
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {term.relatedTerms && term.relatedTerms.length > 0
                      ? term.relatedTerms.map(rel => (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => onSelectTerm?.(rel.slug)}
                            className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 hover:border-cyan-400/50 dark:hover:border-cyan-500/40 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                {rel.term}
                              </span>
                              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                                Xem →
                              </span>
                            </div>
                            {rel.shortDefinition && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                {rel.shortDefinition}
                              </p>
                            )}
                          </button>
                        ))
                      : term.relatedTermSlugs?.map(slug => (
                          <button
                            key={slug}
                            type="button"
                            onClick={() => onSelectTerm?.(slug)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-cyan-700 dark:text-cyan-400"
                          >
                            <span>{slug}</span>
                            <span>→</span>
                          </button>
                        ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-400 py-12">Không tìm thấy thông tin thuật ngữ.</p>
          )}
        </div>

        {/* Footer Actions */}
        {term?.routePath && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Đường dẫn: <span className="font-mono text-[11px]">{term.routePath}</span>
            </div>
            <button
              type="button"
              onClick={handleOpenRoute}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-cyan-600/20 hover:shadow-md transition-all shrink-0 min-h-[44px]"
            >
              <span>Mở chức năng này</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
