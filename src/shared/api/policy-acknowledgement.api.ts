import { apiRequest } from './httpClient'

export interface PolicyAcknowledgement {
  acknowledged: boolean
  acknowledgedAt: string | null
}

export const policyAcknowledgementApi = {
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
