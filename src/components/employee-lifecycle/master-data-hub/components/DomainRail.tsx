import React, { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { DOMAIN_GROUPS, type DomainGroupId } from '../masterDataCatalogAdapter'
import type { WorkspaceView } from '../types'
import { DomainIcon } from './DomainIcon'

export interface DomainRailProps {
  isDarkMode: boolean
  activeGroupId: DomainGroupId
  groupCounts: Record<DomainGroupId, number>
  onGroupChange: (id: DomainGroupId) => void
  workspaceView: WorkspaceView
}

export const DomainRail: React.FC<DomainRailProps> = ({
  isDarkMode,
  activeGroupId,
  groupCounts,
  onGroupChange,
  workspaceView
}) => {
  const railRef = useRef<HTMLDivElement>(null)

  return (
    <nav
      ref={railRef}
      aria-label="Nhóm nghiệp vụ Master Data"
      className={`
        shrink-0
        w-full sm:w-56 xl:w-60
        border-r border-slate-200 dark:border-slate-800
        overflow-y-auto
        ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50/80'}
        hidden sm:flex flex-col
        sticky top-0 max-h-[calc(100vh-160px)]
      `}
    >
      <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Nhóm nghiệp vụ
        </p>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {DOMAIN_GROUPS.map((group) => {
          const active = activeGroupId === group.id
          const count = groupCounts[group.id] ?? 0
          // In process tab, we show all groups but visual differentiation is less important
          const dimmed = workspaceView === 'process' && !active

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onGroupChange(group.id)}
              aria-current={active ? 'true' : undefined}
              className={`
                group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                text-left transition-all cursor-pointer
                focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-1
                ${active
                  ? isDarkMode
                    ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40'
                    : 'bg-blue-50 text-blue-800 ring-1 ring-blue-200'
                  : dimmed
                    ? 'opacity-50 hover:opacity-100'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }
              `}
            >
              <span
                className={`
                flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                ${active
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    : 'bg-white text-slate-500 group-hover:bg-slate-50 border border-slate-200'
                }
              `}
              >
                <DomainIcon name={group.iconName} className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-bold leading-snug truncate">{group.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-medium ${
                      active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    {count} mục
                  </span>
                )}
              </span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-blue-500" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
