import React, { useState, useEffect } from 'react'
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import type { Policy } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'
import { knowledgeRepository } from '../../../../database/knowledgeRepository'

interface PolicyAcknowledgementDemoProps {
  policy: Policy
}

export const PolicyAcknowledgementDemo: React.FC<PolicyAcknowledgementDemoProps> = ({ policy }) => {
  const { language } = useLanguage()

  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [ackTimestamp, setAckTimestamp] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void knowledgeRepository.getPolicyAcknowledgement(policy.id).then((acknowledgement) => {
      if (!active) return
      setIsAcknowledged(acknowledgement.acknowledged)
      setAckTimestamp(acknowledgement.acknowledgedAt)
    })
    return () => { active = false }
  }, [policy.id])

  if (!policy.requiresAcknowledgement) {
    return null
  }

  const handleToggleAck = async () => {
    const previousAcknowledged = isAcknowledged
    const previousTimestamp = ackTimestamp
    if (!isAcknowledged) {
      const nowStr = new Date().toLocaleString('vi-VN')
      setIsAcknowledged(true)
      setAckTimestamp(nowStr)
      try {
        await knowledgeRepository.setPolicyAcknowledgement(policy.id, nowStr)
      } catch {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
      }
    } else {
      setIsAcknowledged(false)
      setAckTimestamp(null)
      try {
        await knowledgeRepository.setPolicyAcknowledgement(policy.id, null)
      } catch {
        setIsAcknowledged(previousAcknowledged)
        setAckTimestamp(previousTimestamp)
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#1f5f86] dark:text-sky-400" />
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
          {language === 'vi' ? 'Xác nhận đã đọc & Cam kết tuân thủ' : 'Policy Acknowledgement'}
        </h3>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer text-xs select-none">
          <input
            type="checkbox"
            checked={isAcknowledged}
            onChange={handleToggleAck}
            className="mt-0.5 w-4 h-4 rounded text-[#1f5f86] focus:ring-[#1f5f86] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 cursor-pointer"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {policy.acknowledgementLabel ||
              (language === 'vi'
                ? 'Tôi xác nhận đã đọc, hiểu rõ các quy định, điều kiện kiểm soát và cam kết tuân thủ theo đúng nội dung trên.'
                : 'I confirm that I have read, understood and agree to comply with this policy.')}
          </span>
        </label>

        {isAcknowledged && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {language === 'vi'
                ? `Đã ghi nhận xác nhận thành công (${ackTimestamp || 'Phiên hiện tại'}).`
                : `Acknowledgement recorded (${ackTimestamp || 'Current session'}).`}
            </span>
          </div>
        )}

        <div className="text-[11px] text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {language === 'vi'
              ? 'Lưu ý: Đây là tính năng mô phỏng xác nhận trong phiên demo (dữ liệu lưu trữ cục bộ phía frontend).'
              : 'Notice: This acknowledgement is stored locally for demo simulation purposes.'}
          </span>
        </div>
      </div>
    </div>
  )
}
