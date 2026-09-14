import React, { useId, useState } from 'react'
import type { GlossaryTerm } from '../model/systemGlossaryModel'

interface GlossaryTermTooltipProps {
  term: GlossaryTerm
  children: React.ReactNode
  onClick?: () => void
}

export const GlossaryTermTooltip: React.FC<GlossaryTermTooltipProps> = ({
  term,
  children,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipId = useId()

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
        aria-describedby={tooltipId}
        className="cursor-pointer inline-flex items-center"
      >
        {children}
      </div>

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3 bg-slate-900/95 dark:bg-slate-800 text-white rounded-xl shadow-xl border border-slate-700/60 text-xs backdrop-blur-sm pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between gap-1 mb-1 border-b border-slate-700 pb-1">
            <span className="font-bold text-cyan-300 truncate">{term.term}</span>
            <span className="text-[10px] text-slate-400 shrink-0">{term.category}</span>
          </div>

          {term.vietnameseName && term.vietnameseName !== term.term && (
            <p className="text-[11px] text-slate-300 font-medium italic mb-1.5">
              {term.vietnameseName}
            </p>
          )}

          <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
            {term.shortDefinition || 'Chưa có định nghĩa tóm tắt.'}
          </p>

          <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-cyan-400">
            <span>Nhấp để xem đầy đủ</span>
            <span>→</span>
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95 dark:border-t-slate-800" />
        </div>
      )}
    </div>
  )
}
