import React from 'react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import { useLanguage } from '../../../../context/LanguageContext'
import { getStepIcon } from '../../data/lifecycleClustersData'
import type { ModuleInfo } from '../types'

interface LifecycleStepCardProps {
  step: LifecycleStep
  isSelected: boolean
  isHighlighted: boolean
  modInfo?: ModuleInfo
  sopBadgeColor: string
  onSelect: (id: string) => void
}

export const LifecycleStepCard: React.FC<LifecycleStepCardProps> = ({
  step,
  isSelected,
  isHighlighted,
  modInfo,
  sopBadgeColor,
  onSelect
}) => {
  const { language } = useLanguage()
  const stepIcon = getStepIcon(step.id)

  return (
    <div className="flex flex-col group">
      <button
        type="button"
        onClick={() => onSelect(step.id)}
        className={`w-full h-full min-h-[175px] flex flex-col justify-between items-center text-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
          !isHighlighted
            ? 'opacity-35 grayscale hover:grayscale-0 hover:opacity-100 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            : isSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform -translate-y-1.5 ring-3 ring-blue-400/50 scale-[1.02]'
              : 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-1 shadow-2xs'
        }`}
      >
        {/* Top Module Tag Badge */}
        {modInfo && (
          <span
            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border truncate max-w-full ${
              isSelected
                ? 'bg-white/20 text-white border-white/30'
                : `${modInfo.bg} ${modInfo.color} ${modInfo.border}`
            }`}
          >
            {language === 'vi' ? modOptName(modInfo.name, modInfo.nameEn, language) : modInfo.nameEn}
          </span>
        )}

        {/* Icon Container */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs my-2 transition-colors shrink-0 ${
            isSelected
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          {stepIcon}
        </div>

        {/* Step Number & Title */}
        <div>
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider block ${
              isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Bước {step.stepNumber} · {step.id}
          </span>
          <h4
            className={`text-xs font-bold leading-tight line-clamp-2 mt-0.5 ${
              isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            {step.title}
          </h4>
        </div>

        {/* SOP Badge */}
        {step.sopBadge && (
          <span
            className={`mt-2 px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${
              isSelected
                ? 'bg-white/20 text-white border-white/40'
                : sopBadgeColor
            }`}
          >
            📋 {step.sopBadge}
          </span>
        )}
      </button>
    </div>
  )
}

function modOptName(nameVi: string, nameEn: string, lang: string) {
  return lang === 'vi' ? nameVi : nameEn
}
