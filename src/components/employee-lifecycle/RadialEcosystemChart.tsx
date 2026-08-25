import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FIVE_CORE_MODULES, type SopDetailItem } from './data/ecosystemModulesData.tsx'
import { EcosystemRadialWheel } from './EcosystemRadialWheel'
import { EcosystemSopWorkbench } from './EcosystemSopWorkbench'
import { EcosystemSopDetail } from './EcosystemSopDetail'

export const RadialEcosystemChart: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlModule = searchParams.get('module')
  const urlSop = searchParams.get('sop')
  const urlStage = searchParams.get('stage')
  const urlFilter = searchParams.get('type') as 'ALL' | 'N' | 'M' | 'A'

  const initialModule = urlModule && FIVE_CORE_MODULES.some(m => m.id === urlModule) ? urlModule : 'emp'
  const targetInitialMod = FIVE_CORE_MODULES.find(m => m.id === initialModule) || FIVE_CORE_MODULES[0]
  const initialSop = urlSop && targetInitialMod.sopList.some(s => s.code === urlSop)
    ? urlSop
    : (initialModule === 'emp' ? 'SOP-EMP-02' : targetInitialMod.sopList[0]?.code || 'SOP-EMP-02')

  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModule)
  const [isSopListExpanded, setIsSopListExpanded] = useState<boolean>(true)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'N' | 'M' | 'A'>(urlFilter || 'ALL')
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
    const currentFilter = searchParams.get('type') as 'ALL' | 'N' | 'M' | 'A'

    if (currentModule && currentModule !== selectedModuleId && FIVE_CORE_MODULES.some(m => m.id === currentModule)) {
      setSelectedModuleId(currentModule)
    }
    if (currentSop && currentSop !== selectedSopCode) {
      setSelectedSopCode(currentSop)
    }
    if (currentStage && currentStage !== selectedStageId) {
      setSelectedStageId(currentStage)
    }
    if (currentFilter && currentFilter !== activeTypeFilter) {
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

  const activeModuleId = selectedModuleId
  const activeModule = FIVE_CORE_MODULES.find((m) => m.id === activeModuleId) || FIVE_CORE_MODULES[0]

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
    return item.type === activeTypeFilter
  })

  const activeSopItem: SopDetailItem =
    activeModule.sopList.find((s) => s.code === selectedSopCode) ||
    filteredSopList[0] ||
    activeModule.sopList[0]

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId)
    setSelectedStageId('ALL')
    const targetMod = FIVE_CORE_MODULES.find((m) => m.id === modId) || FIVE_CORE_MODULES[0]
    let newSop = targetMod.sopList[0]?.code || 'SOP-EMP-02'
    if (modId === 'emp') {
      newSop = 'SOP-EMP-02'
    }
    setSelectedSopCode(newSop)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('module', modId)
      next.set('sop', newSop)
      next.delete('stage')
      return next
    }, { replace: true })
  }

  const handleSelectSop = (code: string) => {
    setSelectedSopCode(code)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('sop', code)
      return next
    }, { replace: true })
  }

  const handleSelectStageId = (stageId: string) => {
    setSelectedStageId(stageId)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (stageId === 'ALL') {
        next.delete('stage')
      } else {
        next.set('stage', stageId)
      }
      return next
    }, { replace: true })
  }

  const handleTypeFilterChange = (filter: 'ALL' | 'N' | 'M' | 'A') => {
    setActiveTypeFilter(filter)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (filter === 'ALL') {
        next.delete('type')
      } else {
        next.set('type', filter)
      }
      return next
    }, { replace: true })
  }

  return (
    <div className="relative w-full overflow-hidden py-4 flex flex-col items-center justify-center space-y-4">
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
