import React from 'react'
import { ArrowLeft, Calendar, Building2, Users, FileText, Sparkles } from 'lucide-react'
import type { Policy } from '../../../../entities/policy/model/types'
import { CATEGORY_METADATA, POLICY_TYPE_METADATA, STATUS_METADATA, SEVERITY_METADATA } from '../../../../entities/policy/lib/policyConstants'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyDetailHeaderProps {
  policy: Policy
  onBack: () => void
  onOpenSimulator?: (policyId: string) => void
}

export const PolicyDetailHeader: React.FC<PolicyDetailHeaderProps> = ({
  policy,
  onBack,
  onOpenSimulator
}) => {
  const { language } = useLanguage()

  const categoryMeta = CATEGORY_METADATA[policy.category]
  const typeMeta = POLICY_TYPE_METADATA[policy.type]
  const statusMeta = STATUS_METADATA[policy.status]
  const severityMeta = SEVERITY_METADATA[policy.severity]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'vi' ? 'Quay lại danh sách quy định' : 'Back to Policies'}</span>
        </button>

        {onOpenSimulator && (policy.id === 'POL-ATT-01' || policy.id === 'POL-ATT-02' || policy.id === 'POL-ATT-03') && (
          <button
            type="button"
            onClick={() => onOpenSimulator(policy.id)}
            className="px-3 py-1.5 bg-[#1f5f86] hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'vi' ? 'Mô phỏng quy tắc này' : 'Simulate this Rule'}</span>
          </button>
        )}
      </div>

      {/* Main Title & Badges */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-black text-xs px-2.5 py-1 bg-[#1f5f86] text-white rounded-lg tracking-wide shadow-2xs">
            {policy.code}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${categoryMeta.bg} ${categoryMeta.text} ${categoryMeta.border}`}
          >
            {language === 'vi' ? categoryMeta.label : categoryMeta.labelEn}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${typeMeta.bg} ${typeMeta.text} ${typeMeta.border}`}
          >
            {language === 'vi' ? typeMeta.label : typeMeta.labelEn}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
          >
            {language === 'vi' ? statusMeta.label : statusMeta.labelEn}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${severityMeta.bg} ${severityMeta.text} ${severityMeta.border}`}
          >
            {language === 'vi' ? severityMeta.label : severityMeta.labelEn}
          </span>
        </div>

        <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
          {language === 'vi' ? policy.title : policy.titleEn}
        </h1>

        {language === 'vi' && policy.titleEn && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">
            {policy.titleEn}
          </p>
        )}
      </div>

      {/* Metadata Grid (Effective Date, Department, Audience, Version) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'vi' ? 'Ngày hiệu lực' : 'Effective Date'}
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {policy.effectiveFrom}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'vi' ? 'Đơn vị ban hành' : 'Issuing Unit'}
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {policy.issuingDepartment}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'vi' ? 'Đối tượng áp dụng' : 'Audience'}
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {policy.applicableAudience}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'vi' ? 'Phiên bản & Cập nhật' : 'Version / Update'}
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              v{policy.version} ({policy.lastUpdated})
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
