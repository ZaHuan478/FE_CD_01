import { useState, useEffect } from 'react'
import { policyAcknowledgementApi } from '../../../shared/api/policy-acknowledgement.api'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

export function usePolicyAcknowledgement(policyId: string) {
  const toast = useToast()
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
        toast.success('Đã ghi nhận đã đọc và hiểu chính sách')
      } catch (reason) {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
        const msg = getErrorMessage(reason, 'Không thể cập nhật trạng thái đọc chính sách')
        if (msg) toast.error(msg)
      }
    } else {
      setIsAcknowledged(false)
      setAckTimestamp(null)
      try {
        const saved = await policyAcknowledgementApi.setPolicyAcknowledgement(policyId, null)
        setIsAcknowledged(saved.acknowledged)
        setAckTimestamp(saved.acknowledgedAt)
        toast.info('Đã hủy ghi nhận đọc chính sách')
      } catch (reason) {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
        const msg = getErrorMessage(reason, 'Không thể cập nhật trạng thái đọc chính sách')
        if (msg) toast.error(msg)
      }
    }
  }

  return { isAcknowledged, ackTimestamp, handleToggleAck }
}
