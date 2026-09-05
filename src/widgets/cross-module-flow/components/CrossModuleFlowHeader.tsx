import React from 'react'
import { GitBranch } from 'lucide-react'
import type { FlowScope, BusinessClusterId } from '../../../entities/process-flow/model/types'
import { FlowScopeToggle } from './FlowScopeToggle'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface CrossModuleFlowHeaderProps {
  clusterId?: BusinessClusterId
  scope: FlowScope
  onChangeScope: (nextScope: FlowScope) => void
  title: string
  titleEn: string
  subtitle: string
  subtitleEn: string
}

export const CrossModuleFlowHeader: React.FC<CrossModuleFlowHeaderProps> = ({
  scope,
  onChangeScope,
  title,
  titleEn,
  subtitle,
  subtitleEn
}) => {
  const { language } = useLanguage()

  const displayTitle = scope === 'cross-cluster'
    ? (language === 'vi' ? 'Toàn cảnh Dòng dữ liệu giữa 4 Cụm Nghiệp vụ' : 'Cross-Cluster Enterprise Data Architecture')
    : (language === 'vi' ? title : titleEn)

  const displaySubtitle = scope === 'cross-cluster'
    ? (language === 'vi'
      ? 'Kiến trúc tương tác cấp cao: Quản trị tổ chức cấp định biên & vị trí ➔ Vận hành lõi xử lý vòng đời ➔ Phát triển con người đánh giá & kế nhiệm ➔ Nền tảng hỗ trợ dịch vụ dùng chung.'
      : 'High-level multi-cluster interaction: Organization feeds headcount & positions ➔ Core executes lifecycle ➔ People develops talent ➔ Platform provides shared services.')
    : (language === 'vi' ? subtitle : subtitleEn)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Eyebrow */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#1f5f86] dark:text-sky-400">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'DÒNG DỮ LIỆU NGHIỆP VỤ' : 'DATA FLOW & DEPENDENCIES'}</span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
            {displayTitle}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Right Scope Switcher */}
        <div className="shrink-0 self-start lg:self-center">
          <FlowScopeToggle scope={scope} onChangeScope={onChangeScope} />
        </div>
      </div>
    </div>
  )
}
