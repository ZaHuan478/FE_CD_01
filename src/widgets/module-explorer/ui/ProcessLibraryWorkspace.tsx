import React from 'react'
import type { BusinessClusterId } from '../../../entities/module/model/types'
import { ClusterProcessExplorer, type ExplorerCluster } from './ClusterProcessExplorer'
import { RadialEcosystemChart } from './RadialEcosystemChart'

interface ProcessLibraryWorkspaceProps {
  activeCluster: BusinessClusterId
}

export const ProcessLibraryWorkspace: React.FC<ProcessLibraryWorkspaceProps> = ({ activeCluster }) => {
  if (activeCluster === 'core') {
    return <RadialEcosystemChart view="library" />
  }

  return <ClusterProcessExplorer cluster={activeCluster as ExplorerCluster} />
}
