import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { POLICY_REGISTRY } from '../../../../entities/policy/model/policyRegistry'
import { getPoliciesForProcess } from '../../../../entities/policy/lib/policySelectors'
import { CATEGORY_METADATA } from '../../../../entities/policy/lib/policyConstants'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface RelatedPoliciesWidgetProps {
  processId: string
  sopCode?: string
}

export const RelatedPoliciesWidget: React.FC<RelatedPoliciesWidgetProps> = ({
  processId,
  sopCode
}) => {
  const navigate = useNavigate()
  const { language } = useLanguage()

  // Find policies related to either processId or sopCode
  const relatedPolicies = React.useMemo(() => {
    const fromProc = getPoliciesForProcess(POLICY_REGISTRY, processId)
    const fromSop = sopCode ? getPoliciesForProcess(POLICY_REGISTRY, sopCode) : []
    const combined = [...fromProc, ...fromSop]
    // deduplicate
    const map = new Map<string, typeof combined[0]>()
    combined.forEach((p) => map.set(p.id, p))
    return Array.from(map.values())
  }, [processId, sopCode])

  if (relatedPolicies.length === 0) {
    return null
  }

  const handleOpenPolicy = (policyId: string) => {
    navigate(`/employee-lifecycle/policies/${policyId}`)
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1f5f86] dark:text-sky-400" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            {language === 'vi' ? 'Quy định & Chế tài liên quan' : 'Related Policies & Compliance'}
          </h4>
        </div>
        <button
          type="button"
          onClick={() => navigate('/employee-lifecycle/policies')}
          className="text-[11px] font-bold text-[#1f5f86] dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          <span>{language === 'vi' ? 'Xem tất cả' : 'View all'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {relatedPolicies.map((policy) => {
          const categoryMeta = CATEGORY_METADATA[policy.category]

          return (
            <div
              key={policy.id}
              onClick={() => handleOpenPolicy(policy.id)}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 hover:bg-sky-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-start justify-between gap-2 group text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#1f5f86] dark:text-sky-400">
                    {policy.code}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}
                  >
                    {language === 'vi' ? categoryMeta.label : categoryMeta.labelEn}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-slate-800 dark:text-white group-hover:text-[#1f5f86] dark:group-hover:text-sky-300 transition-colors line-clamp-1">
                  {language === 'vi' ? policy.title : policy.titleEn}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {language === 'vi' ? policy.summary : policy.summaryEn}
                </p>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1f5f86] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
