import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, User, Clock, ArrowUpRight } from 'lucide-react'
import type { Citation } from '../model/chatAssistantModel'

interface CitationBadgeProps {
  citation: Citation
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (citation.routeUrl) {
      navigate(citation.routeUrl)
    }
  }

  return (
    <span
      className="relative inline-flex items-center mx-1 my-0.5"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 border border-sky-300 rounded-full transition-all cursor-pointer shadow-xs"
        title={`${citation.sopCode} - ${citation.sopTitle}`}
      >
        <BookOpen className="w-3 h-3 text-sky-600" />
        <span>[{citation.index}]</span>
        {citation.stepCode && (
          <span className="font-mono text-[10px] text-sky-800 bg-sky-200/60 px-1 rounded">
            {citation.stepCode}
          </span>
        )}
      </button>

      {/* Popover Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between gap-1 pb-1 mb-2 border-b border-slate-700">
            <span className="font-bold text-sky-400">{citation.sopCode}</span>
            <span className="flex items-center text-[10px] text-slate-400 gap-0.5">
              Bấm để mở <ArrowUpRight className="w-2.5 h-2.5" />
            </span>
          </div>

          <p className="font-medium text-slate-200 mb-1.5 line-clamp-2">
            {citation.sopTitle}
          </p>

          {citation.stepTitle && (
            <div className="text-slate-300 mb-1">
              <span className="text-amber-300 font-semibold">{citation.stepCode}:</span> {citation.stepTitle}
            </div>
          )}

          {citation.actor && (
            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">Thực hiện: {citation.actor}</span>
            </div>
          )}

          {citation.timing && (
            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">Thời hạn: {citation.timing}</span>
            </div>
          )}
        </div>
      )}
    </span>
  )
}
