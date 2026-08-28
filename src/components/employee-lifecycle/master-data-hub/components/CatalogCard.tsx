import React from 'react'
import { ChevronRight, AlertTriangle } from 'lucide-react'
import {
  TIER_LABELS,
  STATUS_LABELS,
  type CatalogViewModel
} from '../masterDataCatalogAdapter'
import { colorBadge, statusIcon } from './DomainIcon'

export interface CatalogCardProps {
  item: CatalogViewModel
  isSelected: boolean
  isDarkMode: boolean
  onSelect: (item: CatalogViewModel) => void
  subdued: string
}

export const CatalogCard: React.FC<CatalogCardProps> = ({
  item,
  isSelected,
  isDarkMode,
  onSelect,
  subdued
}) => {
  const tierInfo = TIER_LABELS[item.tier]
  const statusInfo = STATUS_LABELS[item.status]

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-pressed={isSelected}
      aria-label={`Xem chi tiết ${item.title}`}
      className={`
        group w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer
        focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-1
        ${isSelected
          ? isDarkMode
            ? 'border-blue-500/70 bg-blue-600/15 ring-1 ring-blue-500/30'
            : 'border-blue-400 bg-blue-50/70 ring-1 ring-blue-200'
          : isDarkMode
            ? 'border-slate-800 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60'
            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Code badge + type */}
        <div className="shrink-0 flex flex-col items-start gap-1">
          <span
            className={`
            px-2 py-0.5 rounded font-mono text-[10px] font-bold
            ${isSelected
              ? 'bg-blue-600 text-white'
              : isDarkMode
                ? 'bg-slate-700 text-slate-300'
                : 'bg-slate-100 text-slate-600'
            }
          `}
          >
            {item.code}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-extrabold leading-snug ${
                isSelected
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300'
              } transition-colors`}
            >
              {item.title}
            </h4>
            {/* Status icon inline */}
            <span className="shrink-0 mt-0.5" title={statusInfo.label}>
              {statusIcon(item.status)}
            </span>
          </div>
          <p className={`text-xs mt-1 leading-snug line-clamp-2 ${subdued}`}>{item.summary}</p>

          {/* Legacy geo warning */}
          {item.status === 'legacy' && item.geoMetadata?.legacyNote && (
            <div
              className={`mt-2 flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-[11px] leading-snug
              ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-800'}`}
            >
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item.geoMetadata.legacyNote}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Tier badge */}
            <span
              className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge(
                tierInfo.color
              )}`}
            >
              {tierInfo.label}
            </span>
            {/* Consumer modules */}
            {item.consumerModules.slice(0, 3).map((mod) => (
              <span
                key={mod}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {mod}
              </span>
            ))}
            {item.consumerModules.length > 3 && (
              <span className={`text-[10px] ${subdued}`}>+{item.consumerModules.length - 3}</span>
            )}
            {/* Field count */}
            {item.fieldCount > 0 && (
              <span className={`ml-auto text-[10px] font-medium ${subdued}`}>
                {item.fieldCount} trường
              </span>
            )}
          </div>
        </div>

        <ChevronRight
          className={`w-4 h-4 shrink-0 mt-1 transition-colors ${
            isSelected ? 'text-blue-500' : subdued
          }`}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}
