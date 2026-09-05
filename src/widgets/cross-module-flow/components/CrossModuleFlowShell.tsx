import React, { useState, useEffect, useRef, useMemo } from 'react'
import type { BusinessClusterId, FlowScope, SimulationStatus, FlowNode, FlowConnection, CrossClusterOverviewConnection } from '../../../entities/process-flow/model/types'
import { getClusterFlowConfig, getCrossClusterNodes, getCrossClusterConnections } from '../../../entities/process-flow/lib/flowSelectors'
import { CrossModuleFlowHeader } from './CrossModuleFlowHeader'
import { FlowSimulationControls } from './FlowSimulationControls'
import { FlowLegend } from './FlowLegend'
import { FlowTransferInspector } from './FlowTransferInspector'
import { FlowMobileList } from './FlowMobileList'
import { FlowEmptyState } from './FlowEmptyState'
import { CorePipelineRenderer } from '../renderers/CorePipelineRenderer'
import { PeopleFeedbackLoopRenderer } from '../renderers/PeopleFeedbackLoopRenderer'
import { OrganizationDependencyRenderer } from '../renderers/OrganizationDependencyRenderer'
import { PlatformServiceMeshRenderer } from '../renderers/PlatformServiceMeshRenderer'
import { CrossClusterOverviewRenderer } from '../renderers/CrossClusterOverviewRenderer'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

export interface CrossModuleFlowShellProps {
  cluster: BusinessClusterId
}

export const CrossModuleFlowShell: React.FC<CrossModuleFlowShellProps> = ({ cluster }) => {
  const { language } = useLanguage()

  // 1. State
  const [scope, setScope] = useState<FlowScope>('within-cluster')
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>('')
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('idle')
  const [simulationStep, setSimulationStep] = useState<number>(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 2. Data calculation
  const clusterConfig = useMemo(() => getClusterFlowConfig(cluster), [cluster])
  const crossNodes = useMemo(() => getCrossClusterNodes(), [])
  const crossConnections = useMemo(() => getCrossClusterConnections(), [])

  const currentNodes: FlowNode[] = scope === 'within-cluster' ? clusterConfig.nodes : crossNodes
  const currentConnections: (FlowConnection | CrossClusterOverviewConnection)[] =
    scope === 'within-cluster' ? clusterConfig.connections : crossConnections

  // 3. Sync initial connection when cluster or scope changes
  useEffect(() => {
    // Clear simulation on cluster or scope switch
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setSimulationStatus('idle')
    setSimulationStep(0)
    setSelectedNodeId(undefined)

    if (currentConnections.length > 0) {
      setSelectedConnectionId(currentConnections[0].id)
    }
  }, [cluster, scope, currentConnections])

  // 4. Timer cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // 5. Simulation Runner
  useEffect(() => {
    if (simulationStatus === 'running') {
      timerRef.current = setInterval(() => {
        setSimulationStep((prevStep) => {
          const nextStep = prevStep + 1
          if (nextStep >= currentConnections.length) {
            // Reached end of simulation
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            setSimulationStatus('completed')
            return prevStep
          }
          const activeConn = currentConnections[nextStep]
          if (activeConn) {
            setSelectedConnectionId(activeConn.id)
            if ('from' in activeConn) {
              setSelectedNodeId(activeConn.from)
            }
          }
          return nextStep
        })
      }, 2500)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [simulationStatus, currentConnections])

  // Handlers
  const handlePlay = () => {
    if (simulationStatus === 'completed' || simulationStep >= currentConnections.length - 1) {
      setSimulationStep(0)
      if (currentConnections.length > 0) {
        setSelectedConnectionId(currentConnections[0].id)
      }
    }
    setSimulationStatus('running')
  }

  const handlePause = () => {
    setSimulationStatus('paused')
  }

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setSimulationStatus('idle')
    setSimulationStep(0)
    if (currentConnections.length > 0) {
      setSelectedConnectionId(currentConnections[0].id)
    }
  }

  const handleStepForward = () => {
    const nextStep = (simulationStep + 1) % currentConnections.length
    setSimulationStep(nextStep)
    const activeConn = currentConnections[nextStep]
    if (activeConn) {
      setSelectedConnectionId(activeConn.id)
      if ('from' in activeConn) {
        setSelectedNodeId(activeConn.from)
      }
    }
  }

  const handleSelectConnection = (id: string) => {
    setSelectedConnectionId(id)
    const index = currentConnections.findIndex((c) => c.id === id)
    if (index >= 0) {
      setSimulationStep(index)
    }
  }

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id)
    // Find first connection starting or ending with this node
    const conn = currentConnections.find((c) => ('from' in c && (c.from === id || c.to === id)))
    if (conn) {
      setSelectedConnectionId(conn.id)
    }
  }

  const selectedConnection = currentConnections.find((c) => c.id === selectedConnectionId) || currentConnections[0]

  const getSourceLabel = (conn: FlowConnection | CrossClusterOverviewConnection) => {
    if ('from' in conn) {
      const node = currentNodes.find((n) => n.id === conn.from)
      return node ? (language === 'vi' ? node.label : node.labelEn) : conn.from
    }
    return conn.fromCluster
  }

  const getTargetLabel = (conn: FlowConnection | CrossClusterOverviewConnection) => {
    if ('to' in conn) {
      const node = currentNodes.find((n) => n.id === conn.to)
      return node ? (language === 'vi' ? node.label : node.labelEn) : conn.to
    }
    return conn.toCluster
  }

  return (
    <section className="space-y-4">
      {/* 1. Shell Header with Cluster Title & Scope Toggle */}
      <CrossModuleFlowHeader
        clusterId={cluster}
        scope={scope}
        onChangeScope={setScope}
        title={clusterConfig.title}
        titleEn={clusterConfig.titleEn}
        subtitle={clusterConfig.subtitle}
        subtitleEn={clusterConfig.subtitleEn}
      />

      {/* 2. Simulation Controls */}
      <FlowSimulationControls
        status={simulationStatus}
        currentStep={simulationStep}
        totalSteps={currentConnections.length}
        activeLabel={selectedConnection ? (language === 'vi' ? selectedConnection.label : selectedConnection.labelEn) : undefined}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
      />

      {/* 3. Legend bar */}
      <FlowLegend isCrossCluster={scope === 'cross-cluster'} />

      {/* 4. Desktop Renderer + Inspector Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-start w-full min-w-0">
        {/* Left Column: Topology Diagram */}
        <div className="w-full min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs overflow-hidden">
          {scope === 'cross-cluster' ? (
            <CrossClusterOverviewRenderer
              nodes={crossNodes}
              connections={crossConnections}
              selectedConnectionId={selectedConnectionId}
              onSelectConnection={handleSelectConnection}
            />
          ) : cluster === 'core' ? (
            <CorePipelineRenderer
              nodes={clusterConfig.nodes}
              connections={clusterConfig.connections}
              selectedConnectionId={selectedConnectionId}
              selectedNodeId={selectedNodeId}
              onSelectConnection={handleSelectConnection}
              onSelectNode={handleSelectNode}
            />
          ) : cluster === 'people' ? (
            <PeopleFeedbackLoopRenderer
              nodes={clusterConfig.nodes}
              connections={clusterConfig.connections}
              selectedConnectionId={selectedConnectionId}
              selectedNodeId={selectedNodeId}
              onSelectConnection={handleSelectConnection}
              onSelectNode={handleSelectNode}
            />
          ) : cluster === 'organization' ? (
            <OrganizationDependencyRenderer
              nodes={clusterConfig.nodes}
              connections={clusterConfig.connections}
              selectedConnectionId={selectedConnectionId}
              selectedNodeId={selectedNodeId}
              onSelectConnection={handleSelectConnection}
              onSelectNode={handleSelectNode}
            />
          ) : cluster === 'platform' ? (
            <PlatformServiceMeshRenderer
              nodes={clusterConfig.nodes}
              connections={clusterConfig.connections}
              selectedConnectionId={selectedConnectionId}
              selectedNodeId={selectedNodeId}
              onSelectConnection={handleSelectConnection}
              onSelectNode={handleSelectNode}
            />
          ) : (
            <FlowEmptyState onReset={handleReset} />
          )}
        </div>

        {/* Right Column: Unified Detail Inspector Panel */}
        <div className="w-full min-w-0 sticky top-20">
          <FlowTransferInspector
            connection={selectedConnection}
            sourceNodeLabel={selectedConnection ? getSourceLabel(selectedConnection) : undefined}
            targetNodeLabel={selectedConnection ? getTargetLabel(selectedConnection) : undefined}
          />
        </div>
      </div>

      {/* 5. Mobile List View (rendered on screens < 768px) */}
      <FlowMobileList
        connections={currentConnections}
        nodes={currentNodes}
        selectedConnectionId={selectedConnectionId}
        onSelectConnection={handleSelectConnection}
      />
    </section>
  )
}
