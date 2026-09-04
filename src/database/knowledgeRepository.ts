import { apiRequest } from '../api/apiClient'

export interface PolicyAcknowledgement {
  acknowledged: boolean
  acknowledgedAt: string | null
}

export const knowledgeRepository = {
  getPolicyAcknowledgement(policyId: string): Promise<PolicyAcknowledgement> {
    return apiRequest<PolicyAcknowledgement>(
      `/policy-acknowledgements/${encodeURIComponent(policyId)}`
    )
  },

  setPolicyAcknowledgement(
    policyId: string,
    acknowledgedAt: string | null
  ): Promise<PolicyAcknowledgement> {
    return apiRequest<PolicyAcknowledgement>(
      `/policy-acknowledgements/${encodeURIComponent(policyId)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ acknowledged: Boolean(acknowledgedAt) })
      }
    )
  }
}
