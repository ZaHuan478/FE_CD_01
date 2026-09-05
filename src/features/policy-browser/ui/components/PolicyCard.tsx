import React from 'react'
import { Calendar, GitBranch, ArrowRight, ShieldAlert } from 'lucide-react'
import type { Policy } from '../../../../entities/policy/model/types'
import { CATEGORY_METADATA, POLICY_TYPE_METADATA, STATUS_METADATA, SEVERITY_METADATA } from '../../../../entities/policy/lib/policyConstants'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyCardProps {
  policy: Policy
  onSelectPolicy: (policy: Policy) => void
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onSelectPolicy }) => {
  const { language } = useLanguage()

  const categoryMeta = CATEGORY_METADATA[policy.category]
  const typeMeta = POLICY_TYPE_METADATA[policy.type]
  const statusMeta = STATUS_METADATA[policy.status]
  const severityMeta = SEVERITY_METADATA[policy.severity]

  const totalRelated = policy.relatedSopCodes.length + policy.relatedProcessCodes.length

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectPolicy(policy)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectPolicy(policy)}
      onKeyDown={handleKeyDown}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1f5f86] dark:hover:border-sky-500 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1f5f86] dark:focus-visible:ring-sky-400"
    >
      {/* Top Header: Code, Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 tracking-wide">
              {policy.code}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}
            >
              {language === 'vi' ? categoryMeta.label : categoryMeta.labelEn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeMeta.bg} ${typeMeta.text} ${typeMeta.border}`}
            >
              {language === 'vi' ? typeMeta.label : typeMeta.labelEn}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
            >
              {language === 'vi' ? statusMeta.label : statusMeta.labelEn}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${severityMeta.bg} ${severityMeta.text} ${severityMeta.border}`}
            >
              {language === 'vi' ? severityMeta.label : severityMeta.labelEn}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#1f5f86] dark:group-hover:text-sky-300 transition-colors line-clamp-2">
            {language === 'vi' ? policy.title : policy.titleEn}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {language === 'vi' ? policy.summary : policy.summaryEn}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {policy.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              #{tag}
            </span>
          ))}
          {policy.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{policy.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Effective date, SOP link count, Severity & CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 text-[11px]" title="Ngày hiệu lực">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{policy.effectiveFrom}</span>
          </div>

          {totalRelated > 0 && (
            <div className="flex items-center gap-1 text-[11px]" title="Quy trình liên quan">
              <GitBranch className="w-3.5 h-3.5 text-blue-500" />
              <span>{totalRelated} SOP/Flow</span>
            </div>
          )}

          {policy.requiresAcknowledgement && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400" title="Cần xác nhận đã đọc">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-semibold">{language === 'vi' ? 'Cần ký nhận' : 'Ack Req.'}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1 text-xs font-bold text-[#1f5f86] dark:text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>{language === 'vi' ? 'Xem quy định' : 'View Policy'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  )
}
