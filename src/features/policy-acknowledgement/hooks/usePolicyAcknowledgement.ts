import { useState, useEffect } from 'react'
import { policyAcknowledgementApi } from '../../../shared/api/policy-acknowledgement.api'

export function usePolicyAcknowledgement(policyId: string) {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [ackTimestamp, setAckTimestamp] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void policyAcknowledgementApi.getPolicyAcknowledgement(policyId).then((acknowledgement) => {
      if (!active) return
      setIsAcknowledged(acknowledgement.acknowledged)
      setAckTimestamp(acknowledgement.acknowledgedAt)
    }).catch(() => {
      if (active) { setIsAcknowledged(false); setAckTimestamp(null) }
    })
    return () => { active = false }
  }, [policyId])

  const handleToggleAck = async () => {
    const previousAcknowledged = isAcknowledged
    const previousTimestamp = ackTimestamp
    if (!isAcknowledged) {
      const nowStr = new Date().toLocaleString('vi-VN')
      setIsAcknowledged(true)
      setAckTimestamp(nowStr)
      try {
        const saved = await policyAcknowledgementApi.setPolicyAcknowledgement(policyId, nowStr)
        setIsAcknowledged(saved.acknowledged)
        setAckTimestamp(saved.acknowledgedAt)
      } catch {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
      }
    } else {
      setIsAcknowledged(false)
      setAckTimestamp(null)
      try {
        const saved = await policyAcknowledgementApi.setPolicyAcknowledgement(policyId, null)
        setIsAcknowledged(saved.acknowledged)
        setAckTimestamp(saved.acknowledgedAt)
      } catch {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
      }
    }
  }

  return { isAcknowledged, ackTimestamp, handleToggleAck }
}
