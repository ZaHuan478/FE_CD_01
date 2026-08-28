import React from 'react'
import { Database, ClipboardList, Network } from 'lucide-react'
import type { WorkspaceView } from '../types'
import type { computeMasterDataStats } from '../masterDataCatalogAdapter'

export interface StudioHeaderProps {
  isDarkMode: boolean
  stats?: ReturnType<typeof computeMasterDataStats>
  workspaceView: WorkspaceView
  onViewChange: (v: WorkspaceView) => void
}

const TABS: Array<{ id: WorkspaceView; label: string; icon: React.ElementType }> = [
  { id: 'catalogs', label: 'Danh mục', icon: Database },
  { id: 'process', label: 'Theo quy trình', icon: ClipboardList },
  { id: 'relations', label: 'Bản đồ quan hệ', icon: Network }
]

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  isDarkMode,
  workspaceView,
  onViewChange
}) => {
  const surface = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'

  return (
    <div className={`border-b ${surface}`}>
      {/* Tab bar */}
      <div className={`px-4 sm:px-5 flex gap-1 ${isDarkMode ? 'bg-slate-950/30' : 'bg-slate-50/80'}`}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = workspaceView === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(id)}
              className={`
                flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold
                border-b-2 transition-colors cursor-pointer whitespace-nowrap
                focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
                ${active
                  ? 'border-blue-600 text-blue-700 dark:text-blue-300 dark:border-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
