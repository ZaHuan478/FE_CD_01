import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { POLICY_REGISTRY } from '../../../entities/policy/model/policyRegistry'
import type { Policy, PolicyFilterState } from '../../../entities/policy/model/types'
import {
  filterPolicies,
  calculatePolicyMetrics,
  getPolicyByIdOrCode
} from '../../../entities/policy/lib/policySelectors'
import { PolicyHeader } from './components/PolicyHeader'
import { PolicyFilterBar } from './components/PolicyFilterBar'
import { PolicyList } from './components/PolicyList'
import { PolicyRuleSimulator } from './components/PolicyRuleSimulator'
import { PolicyDetailPage } from './PolicyDetailPage'

interface PolicyCenterPageProps {
  initialPolicyId?: string
}

export const PolicyCenterPage: React.FC<PolicyCenterPageProps> = ({ initialPolicyId }) => {
  const navigate = useNavigate()
  const { id: routePolicyId } = useParams<{ id?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const activePolicyId = initialPolicyId || routePolicyId || searchParams.get('id')

  // Selected policy derived from URL or prop
  const selectedPolicy = useMemo(() => {
    if (!activePolicyId) return null
    return getPolicyByIdOrCode(POLICY_REGISTRY, activePolicyId) || null
  }, [activePolicyId])

  // Filter state
  const [filter, setFilter] = useState<PolicyFilterState>({
    searchTerm: searchParams.get('q') || '',
    category: (searchParams.get('category') as any) || 'all',
    type: (searchParams.get('type') as any) || 'all',
    status: (searchParams.get('status') as any) || 'all',
    severity: (searchParams.get('severity') as any) || 'all'
  })

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  // Metrics
  const metrics = useMemo(() => calculatePolicyMetrics(POLICY_REGISTRY), [])

  // Filtered policies
  const filteredPolicies = useMemo(() => {
    return filterPolicies(POLICY_REGISTRY, filter)
  }, [filter])

  // Filter handlers
  const handleFilterChange = (nextFilter: PolicyFilterState) => {
    setFilter(nextFilter)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (nextFilter.searchTerm) next.set('q', nextFilter.searchTerm)
      else next.delete('q')

      if (nextFilter.category !== 'all') next.set('category', nextFilter.category)
      else next.delete('category')

      if (nextFilter.type !== 'all') next.set('type', nextFilter.type)
      else next.delete('type')

      if (nextFilter.status !== 'all') next.set('status', nextFilter.status)
      else next.delete('status')

      if (nextFilter.severity !== 'all') next.set('severity', nextFilter.severity)
      else next.delete('severity')

      return next
    })
  }

  const handleResetFilter = () => {
    const resetState: PolicyFilterState = {
      searchTerm: '',
      category: 'all',
      type: 'all',
      status: 'all',
      severity: 'all'
    }
    setFilter(resetState)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('q')
      next.delete('category')
      next.delete('type')
      next.delete('status')
      next.delete('severity')
      return next
    })
  }

  const handleSelectPolicy = (policy: Policy) => {
    navigate(`/employee-lifecycle/policies/${policy.id}`)
  }

  const handleBackToList = () => {
    navigate('/employee-lifecycle/policies')
  }

  // If a policy is currently selected, render the Detail Page
  if (selectedPolicy) {
    return (
      <PolicyDetailPage
        policy={selectedPolicy}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="space-y-5 animate-fadeIn max-w-[1440px] mx-auto pb-12">
      {/* 1. Header Banner & Quick Stats */}
      <PolicyHeader
        metrics={metrics}
        onOpenSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
      />

      {/* Optional Interactive Rule Simulator Section */}
      {isSimulatorOpen && (
        <div className="animate-fadeIn">
          <PolicyRuleSimulator onClose={() => setIsSimulatorOpen(false)} />
        </div>
      )}

      {/* 2. Filter & Search Bar */}
      <PolicyFilterBar
        filter={filter}
        onChangeFilter={handleFilterChange}
        onResetFilter={handleResetFilter}
        resultCount={filteredPolicies.length}
        totalCount={POLICY_REGISTRY.length}
      />

      {/* 3. Policy Cards Grid */}
      <PolicyList
        policies={filteredPolicies}
        onSelectPolicy={handleSelectPolicy}
        onResetFilter={handleResetFilter}
        isFiltered={
          filter.searchTerm !== '' ||
          filter.category !== 'all' ||
          filter.type !== 'all' ||
          filter.status !== 'all' ||
          filter.severity !== 'all'
        }
      />
    </div>
  )
}
