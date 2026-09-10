import React from 'react'
import type { WorkspaceView } from '../../../../entities/master-data/model/types'
import { MasterDataViewTabs } from './MasterDataViewTabs'

export interface StudioHeaderProps {
  workspaceView: WorkspaceView
  onViewChange: (v: WorkspaceView) => void
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  workspaceView,
  onViewChange
}) => {
  return (
    <div className="border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
      <MasterDataViewTabs
        value={workspaceView}
        onChange={onViewChange}
        className="w-full"
      />
    </div>
  )
}
