import React from 'react'
import { HrmModuleRelationshipSection } from './HrmModuleRelationshipSection'

interface EcosystemRadialWheelProps {
  hoveredModuleId?: string | null
  setHoveredModuleId?: (id: string | null) => void
  selectedModuleId: string
  handleSelectModule: (id: string) => void
}

export const EcosystemRadialWheel: React.FC<EcosystemRadialWheelProps> = ({
  selectedModuleId,
  handleSelectModule
}) => {
  return (
    <div className="w-full">
      <HrmModuleRelationshipSection
        selectedModuleId={selectedModuleId}
        onSelectModule={handleSelectModule}
      />
    </div>
  )
}

