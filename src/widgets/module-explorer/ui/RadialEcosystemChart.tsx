import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CORE_OPERATION_MODULES,
  type SopDetailItem,
  type ModuleEcosystemItem
} from '../../../entities/module/data/ecosystemModulesData'
import { EcosystemRadialWheel } from './EcosystemRadialWheel'
import { EcosystemSopWorkbench } from './EcosystemSopWorkbench'
import { EcosystemSopDetail } from './EcosystemSopDetail'
import { canonicalizeSopCode } from '../../../entities/sop/lib/coreOperationsSelectors'

export const RadialEcosystemChart: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlModule = searchParams.get('module')
  const urlSop = searchParams.get('sop')
  const urlStage = searchParams.get('stage')
  const urlFilter = searchParams.get('type') as 'ALL' | 'N' | 'M' | 'C' | 'A'

  const initialModule = urlModule && CORE_OPERATION_MODULES.some(m => m.id === urlModule)
    ? urlModule
    : 'emp'

  const targetInitialMod: ModuleEcosystemItem =
    CORE_OPERATION_MODULES.find(m => m.id === initialModule) || CORE_OPERATION_MODULES[0]

  const canonicalUrlSop = urlSop ? canonicalizeSopCode(urlSop) : ''

  const initialSop = canonicalUrlSop && targetInitialMod.sopList.some(s => s.code === canonicalUrlSop)
    ? canonicalUrlSop
    : (targetInitialMod.sopList[0]?.code || 'SOP-EMP-01')

  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModule)
  const [isSopListExpanded, setIsSopListExpanded] = useState<boolean>(true)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'N' | 'M' | 'C' | 'A'>(
    ['ALL', 'N', 'M', 'C', 'A'].includes(urlFilter) ? urlFilter : 'ALL'
  )
  const [selectedSopCode, setSelectedSopCode] = useState<string>(initialSop)
  const [selectedStageId, setSelectedStageId] = useState<string>(urlStage || 'ALL')
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState<boolean>(false)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})

  const stageDropdownRef = useRef<HTMLDivElement | null>(null)

  // Sync state if browser Back / Forward is clicked
  useEffect(() => {
    const currentModule = searchParams.get('module')
    const currentSop = searchParams.get('sop')
    const currentStage = searchParams.get('stage')
    const currentFilter = searchParams.get('type') as 'ALL' | 'N' | 'M' | 'C' | 'A'

    if (currentModule && currentModule !== selectedModuleId && CORE_OPERATION_MODULES.some(m => m.id === currentModule)) {
      setSelectedModuleId(currentModule)
    }

    if (currentSop) {
      const canonical = canonicalizeSopCode(currentSop)
      if (canonical && canonical !== selectedSopCode) {
        setSelectedSopCode(canonical)
      }
    }

    if (currentStage && currentStage !== selectedStageId) {
      setSelectedStageId(currentStage)
    }

    if (currentFilter && currentFilter !== activeTypeFilter && ['ALL', 'N', 'M', 'C', 'A'].includes(currentFilter)) {
      setActiveTypeFilter(currentFilter)
    }
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stageDropdownRef.current && !stageDropdownRef.current.contains(event.target as Node)) {
        setIsStageDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId]
    }))
  }

  const activeModule = CORE_OPERATION_MODULES.find((m) => m.id === selectedModuleId) || CORE_OPERATION_MODULES[0]

  // Automatically expand the stage containing selectedSopCode on module or SOP change
  useEffect(() => {
    if (activeModule.stages && activeModule.stages.length > 0) {
      const activeStageId = activeModule.stages.find(s => s.sopCodes.includes(selectedSopCode))?.stageId
      const initialState: Record<string, boolean> = {}
      activeModule.stages.forEach(stg => {
        initialState[stg.stageId] = stg.stageId !== activeStageId
      })
      setCollapsedStages(initialState)
    }
  }, [activeModule.id, selectedSopCode])

  const filteredSopList = activeModule.sopList.filter((item) => {
    if (activeTypeFilter === 'ALL') return true
    const types = item.stepTypes || [item.type]
    return types.includes(activeTypeFilter)
  })

  const activeSopItem: SopDetailItem =
    activeModule.sopList.find((s) => s.code === selectedSopCode) ||
    filteredSopList[0] ||
    activeModule.sopList[0]

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId)
    setSelectedStageId('ALL')
    const targetMod = CORE_OPERATION_MODULES.find((m) => m.id === modId) || CORE_OPERATION_MODULES[0]
    const newSop = targetMod.sopList[0]?.code || 'SOP-REC-01'

    setSelectedSopCode(newSop)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('cluster', 'core')
      next.set('module', modId)
      next.set('sop', newSop)
      next.delete('stage')
      return next
    }, { replace: true })
  }

  const handleSelectSop = (code: string) => {
    const canonical = canonicalizeSopCode(code)
    setSelectedSopCode(canonical)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('cluster', 'core')
      next.set('module', selectedModuleId)
      next.set('sop', canonical)
      return next
    }, { replace: true })
  }

  const handleSelectStageId = (stageId: string) => {
    setSelectedStageId(stageId)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('cluster', 'core')
      next.set('module', selectedModuleId)
      if (stageId === 'ALL') {
        next.delete('stage')
      } else {
        next.set('stage', stageId)
      }
      return next
    }, { replace: true })
  }

  const handleTypeFilterChange = (filter: 'ALL' | 'N' | 'M' | 'C' | 'A') => {
    setActiveTypeFilter(filter)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('cluster', 'core')
      next.set('module', selectedModuleId)
      if (filter === 'ALL') {
        next.delete('type')
      } else {
        next.set('type', filter)
      }
      return next
    }, { replace: true })
  }

  return (
    <div className="relative w-full overflow-hidden py-2 flex flex-col items-center justify-center space-y-6">
      <EcosystemRadialWheel
        hoveredModuleId={hoveredModuleId}
        setHoveredModuleId={setHoveredModuleId}
        selectedModuleId={selectedModuleId}
        handleSelectModule={handleSelectModule}
      />

      <EcosystemSopWorkbench
        activeModule={activeModule}
        handleSelectModule={handleSelectModule}
        isSopListExpanded={isSopListExpanded}
        setIsSopListExpanded={setIsSopListExpanded}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={handleTypeFilterChange}
        filteredSopList={filteredSopList}
        setSelectedSopCode={handleSelectSop}
        selectedStageId={selectedStageId}
        setSelectedStageId={handleSelectStageId}
        isStageDropdownOpen={isStageDropdownOpen}
        setIsStageDropdownOpen={setIsStageDropdownOpen}
        stageDropdownRef={stageDropdownRef}
        collapsedStages={collapsedStages}
        toggleStageCollapse={toggleStageCollapse}
        activeSopItem={activeSopItem}
      >
        <EcosystemSopDetail activeSopItem={activeSopItem} moduleId={activeModule.id} />
      </EcosystemSopWorkbench>
    </div>
  )
}
