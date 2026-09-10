import React from 'react'
import { ClipboardList, Database, Network } from 'lucide-react'
import type { WorkspaceView } from '../../../../entities/master-data/model/types'

const MASTER_DATA_VIEWS: Array<{
  id: WorkspaceView
  label: string
  icon: React.ElementType
}> = [
  { id: 'catalogs', label: 'Danh mục', icon: Database },
  { id: 'process', label: 'Theo quy trình', icon: ClipboardList },
  { id: 'relations', label: 'Bản đồ quan hệ', icon: Network }
]

export interface MasterDataViewTabsProps {
  value: WorkspaceView
  onChange: (view: WorkspaceView) => void
  className?: string
}

export const MasterDataViewTabs: React.FC<MasterDataViewTabsProps> = ({
  value,
  onChange,
  className = ''
}) => (
  <nav
    className={`flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl bg-slate-100/80 p-1 dark:bg-slate-950/50 ${className}`}
    aria-label="Chế độ xem Master Data"
  >
    {MASTER_DATA_VIEWS.map(({ id, label, icon: Icon }) => {
      const active = value === id
      return (
        <button
          key={id}
          type="button"
          aria-current={active ? 'page' : undefined}
          onClick={() => onChange(id)}
          className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border-0 px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            active
              ? 'bg-[#1f5f86] text-white shadow-xs'
              : 'text-slate-600 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </button>
      )
    })}
  </nav>
)
