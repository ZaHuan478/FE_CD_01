import React, { useState, useRef, useEffect } from 'react'
import { FIVE_CORE_MODULES, type SopDetailItem } from './data/ecosystemModulesData.tsx'
import { EcosystemRadialWheel } from './EcosystemRadialWheel'
import { EcosystemSopWorkbench } from './EcosystemSopWorkbench'
import { EcosystemSopDetail } from './EcosystemSopDetail'

export const RadialEcosystemChart: React.FC = () => {
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>('emp')
  const [isSopListExpanded, setIsSopListExpanded] = useState<boolean>(true)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'N' | 'M' | 'A'>('ALL')
  const [selectedSopCode, setSelectedSopCode] = useState<string>('SOP-EMP-02')
  const [selectedStageId, setSelectedStageId] = useState<string>('ALL')
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState<boolean>(false)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})

  const stageDropdownRef = useRef<HTMLDivElement | null>(null)

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

  const activeModuleId = hoveredModuleId || selectedModuleId
  const activeModule = FIVE_CORE_MODULES.find((m) => m.id === activeModuleId) || FIVE_CORE_MODULES[0]

  useEffect(() => {
    if (activeModule.stages && activeModule.stages.length > 0) {
      const activeStageId = activeModule.stages.find(s => s.sopCodes.includes(selectedSopCode))?.stageId
      const initialState: Record<string, boolean> = {}
      activeModule.stages.forEach(stg => {
        initialState[stg.stageId] = stg.stageId !== activeStageId
      })
      setCollapsedStages(initialState)
    }
  }, [activeModule.id])

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
    if (targetMod.sopList.length > 0) {
      if (modId === 'emp') {
        setSelectedSopCode('SOP-EMP-02')
      } else {
        setSelectedSopCode(targetMod.sopList[0].code)
      }
    }
  }

  return (
    <div className="relative w-full overflow-hidden py-4 flex flex-col items-center justify-center space-y-4">
      <EcosystemRadialWheel
        hoveredModuleId={hoveredModuleId}
        setHoveredModuleId={setHoveredModuleId}
        selectedModuleId={selectedModuleId}
        handleSelectModule={handleSelectModule}
        activeModule={activeModule}
      />

      <EcosystemSopWorkbench
        activeModule={activeModule}
        handleSelectModule={handleSelectModule}
        isSopListExpanded={isSopListExpanded}
        setIsSopListExpanded={setIsSopListExpanded}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={setActiveTypeFilter}
        filteredSopList={filteredSopList}
        setSelectedSopCode={setSelectedSopCode}
        selectedStageId={selectedStageId}
        setSelectedStageId={setSelectedStageId}
        isStageDropdownOpen={isStageDropdownOpen}
        setIsStageDropdownOpen={setIsStageDropdownOpen}
        stageDropdownRef={stageDropdownRef}
        collapsedStages={collapsedStages}
        toggleStageCollapse={toggleStageCollapse}
        activeSopItem={activeSopItem}
      >
        <EcosystemSopDetail activeSopItem={activeSopItem} />
      </EcosystemSopWorkbench>
    </div>
  )
}
