import React from 'react'
import type { GlossaryTerm } from '../model/systemGlossaryModel'

interface GlossaryTermCardProps {
  term: GlossaryTerm
  onClick: () => void
}

export const GlossaryTermCard: React.FC<GlossaryTermCardProps> = ({ term, onClick }) => {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Chi tiết thuật ngữ: ${term.term}`}
      className="group relative flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-200 cursor-pointer text-left"
    >
      <div>
        {/* Header: Category Badge & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
            {term.category}
          </span>
          {term.routePath && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Có liên kết</span>
            </span>
          )}
        </div>

        {/* Term Titles */}
        <div className="mb-2.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
            {term.term}
          </h3>
          {term.vietnameseName && term.vietnameseName !== term.term && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {term.vietnameseName}
            </p>
          )}
        </div>

        {/* Short Definition */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {term.shortDefinition || 'Chưa có định nghĩa ngắn gọn.'}
        </p>
      </div>

      {/* Footer: Aliases Chips & Detail Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-hidden flex-wrap max-h-6">
          {term.aliases && term.aliases.length > 0 ? (
            term.aliases.slice(0, 2).map((alias, idx) => (
              <span
                key={idx}
                className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium rounded truncate max-w-[120px]"
                title={alias}
              >
                {alias}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Không có bí danh</span>
          )}
          {term.aliases && term.aliases.length > 2 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              +{term.aliases.length - 2}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Chi tiết</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  )
}
