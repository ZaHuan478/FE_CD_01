import React from 'react'
import type { Policy } from '../types'
import { PolicyCard } from './PolicyCard'
import { PolicyEmptyState } from './PolicyEmptyState'

interface PolicyListProps {
  policies: Policy[]
  onSelectPolicy: (policy: Policy) => void
  onResetFilter?: () => void
  isFiltered?: boolean
}

export const PolicyList: React.FC<PolicyListProps> = ({
  policies,
  onSelectPolicy,
  onResetFilter,
  isFiltered
}) => {
  if (policies.length === 0) {
    return <PolicyEmptyState onResetFilter={onResetFilter} isFiltered={isFiltered} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {policies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          onSelectPolicy={onSelectPolicy}
        />
      ))}
    </div>
  )
}
