import React from 'react'
import { GitFork, Network } from 'lucide-react'
import type { FlowScope } from '../../../entities/process-flow/model/types'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface FlowScopeToggleProps {
  scope: FlowScope
  onChangeScope: (nextScope: FlowScope) => void
}

export const FlowScopeToggle: React.FC<FlowScopeToggleProps> = ({ scope, onChangeScope }) => {
  const { language } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Phạm vi dòng dữ liệu"
      className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 p-1 shadow-2xs"
    >
      <button
        type="button"
        aria-pressed={scope === 'within-cluster'}
        onClick={() => onChangeScope('within-cluster')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          scope === 'within-cluster'
            ? 'bg-[#1f5f86] text-white shadow-xs'
            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
        }`}
      >
        <GitFork className="w-3.5 h-3.5" />
        <span>{language === 'vi' ? 'Trong cụm nghiệp vụ' : 'Within Cluster'}</span>
      </button>

      <button
        type="button"
        aria-pressed={scope === 'cross-cluster'}
        onClick={() => onChangeScope('cross-cluster')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          scope === 'cross-cluster'
            ? 'bg-[#1f5f86] text-white shadow-xs'
            : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
        }`}
      >
        <Network className="w-3.5 h-3.5 text-amber-300" />
        <span>{language === 'vi' ? 'Toàn cảnh 4 cụm' : 'Cross-Cluster Overview'}</span>
      </button>
    </div>
  )
}
