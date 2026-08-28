import React from 'react'
import { AlertOctagon, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react'
import type { Policy } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface PolicyConsequencesSectionProps {
  policy: Policy
}

export const PolicyConsequencesSection: React.FC<PolicyConsequencesSectionProps> = ({ policy }) => {
  const { language } = useLanguage()

  if (!policy.consequences || policy.consequences.length === 0) {
    return null
  }

  const getConsequenceStyle = (type: string) => {
    switch (type) {
      case 'system-block':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-50 dark:bg-rose-950/30',
          border: 'border-rose-200 dark:border-rose-900/60',
          badgeBg: 'bg-rose-100 dark:bg-rose-900/50',
          badgeText: 'text-rose-800 dark:text-rose-200',
          tag: 'Hệ thống tự động chặn'
        }
      case 'verification-required':
        return {
          icon: HelpCircle,
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-900/60',
          badgeBg: 'bg-amber-100 dark:bg-amber-900/50',
          badgeText: 'text-amber-800 dark:text-amber-200',
          tag: 'Cần hậu kiểm xác minh'
        }
      default:
        return {
          icon: AlertTriangle,
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-900/60',
          badgeBg: 'bg-blue-100 dark:bg-blue-900/50',
          badgeText: 'text-blue-800 dark:text-blue-200',
          tag: 'Thông tin chế tài tham chiếu'
        }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            {language === 'vi' ? 'Điều kiện không hợp lệ & Hệ quả kiểm soát' : 'Non-Compliance & System Controls'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'vi'
              ? 'Phân biệt cơ chế khóa cứng tự động trên HRMS và các nội dung tham chiếu quy định.'
              : 'Distingush between automated system gates and regulatory reference policies.'}
          </p>
        </div>
      </div>

      {/* Consequences Cards */}
      <div className="space-y-3">
        {policy.consequences.map((cq) => {
          const style = getConsequenceStyle(cq.type)
          const Icon = style.icon

          return (
            <div
              key={cq.id}
              className={`p-4 rounded-xl border ${style.bg} ${style.border} space-y-2 text-xs`}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0 text-slate-700 dark:text-slate-200" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {cq.title}
                  </h4>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText}`}
                >
                  {style.tag}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-6">
                {cq.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Safety Disclaimer Note */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-[#1f5f86] shrink-0 mt-0.5" />
        <span>
          {language === 'vi'
            ? 'Lưu ý: Mọi thông tin chế tài trên đây được trình bày dưới dạng tham chiếu theo quy định demo nhằm mục đích mô phỏng nghiệp vụ, không thay thế văn bản nhân sự chính thức.'
            : 'Disclaimer: Consequence guidelines are provided for demo reference purposes only and do not constitute formal HR disciplinary decisions.'}
        </span>
      </div>
    </div>
  )
}
