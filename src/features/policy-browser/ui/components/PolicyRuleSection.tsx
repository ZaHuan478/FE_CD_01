import React from 'react'
import { Cpu, ShieldCheck } from 'lucide-react'
import type { Policy } from '../../../../entities/policy/model/types'
import { RULE_KIND_LABELS } from '../../../../entities/policy/lib/policyConstants'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyRuleSectionProps {
  policy: Policy
}

export const PolicyRuleSection: React.FC<PolicyRuleSectionProps> = ({ policy }) => {
  const { language } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#1f5f86] dark:text-sky-400" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            {language === 'vi' ? 'Quy tắc hệ thống & Hạn mức áp dụng' : 'System Rules & Control Thresholds'}
          </h2>
        </div>
        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {policy.rules.length} {language === 'vi' ? 'quy tắc' : 'rules'}
        </span>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {policy.rules.map((rule) => {
          const kindMeta = RULE_KIND_LABELS[rule.ruleKind] || {
            label: rule.ruleKind,
            bg: 'bg-slate-100',
            text: 'text-slate-700'
          }

          return (
            <div
              key={rule.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between gap-3 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono font-bold text-[11px] text-[#1f5f86] dark:text-sky-400">
                    {rule.id}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${kindMeta.bg} ${kindMeta.text}`}>
                    {kindMeta.label}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                  {rule.label}
                </h4>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
              </div>

              {/* Condition & Outcome */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 font-medium">
                {rule.condition && (
                  <div className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">Điều kiện:</span>
                    <span>{rule.condition}</span>
                  </div>
                )}

                <div className="flex items-start gap-1.5 text-[#1f5f86] dark:text-sky-300 text-[11px] bg-sky-50/60 dark:bg-sky-950/40 p-2 rounded-lg border border-sky-100 dark:border-sky-900/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Kết quả kiểm soát: </span>
                    <span>{rule.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
