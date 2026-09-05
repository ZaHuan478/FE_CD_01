import React, { useEffect, useMemo, useState } from 'react'
import {
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  MapPin,
  MessageSquareMore,
  UsersRound,
  Zap
} from 'lucide-react'

import type { SopSubProcess, SopSubStep } from '../../../../entities/sop/model/types'

interface RoleFlowSectionProps {
  currentProcess: SopSubProcess
  isDarkMode: boolean
}

type ParticipationKind = 'Thực hiện' | 'Tham vấn / thẩm định' | 'Phê duyệt' | 'Tự động thực hiện'

const getParticipation = (step: SopSubStep): ParticipationKind => {
  const source = `${step.title} ${step.description}`.toLocaleLowerCase('vi')
  const actor = step.actor.toLocaleLowerCase('vi')

  if (source.includes('phê duyệt') || source.includes('duyệt')) return 'Phê duyệt'
  if (source.includes('tham vấn') || source.includes('thẩm định')) return 'Tham vấn / thẩm định'
  if (step.typeCode === 'A' || actor.includes('hệ thống') || actor.includes('system')) return 'Tự động thực hiện'
  return 'Thực hiện'
}

const getParticipationIcon = (kind: ParticipationKind) => {
  if (kind === 'Phê duyệt') return ClipboardCheck
  if (kind === 'Tham vấn / thẩm định') return MessageSquareMore
  if (kind === 'Tự động thực hiện') return Zap
  return CircleUserRound
}

const getParticipationClasses = (kind: ParticipationKind, isDarkMode: boolean) => {
  if (kind === 'Phê duyệt') return isDarkMode ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (kind === 'Tham vấn / thẩm định') return isDarkMode ? 'bg-amber-500/15 text-amber-200 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
  if (kind === 'Tự động thực hiện') return isDarkMode ? 'bg-violet-500/15 text-violet-200 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200'
  return isDarkMode ? 'bg-blue-500/15 text-blue-200 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
}

export const RoleFlowSection: React.FC<RoleFlowSectionProps> = ({ currentProcess, isDarkMode }) => {
  const [selectedStepCode, setSelectedStepCode] = useState(currentProcess.steps[0]?.stepCode || '')

  useEffect(() => {
    setSelectedStepCode(currentProcess.steps[0]?.stepCode || '')
  }, [currentProcess])

  const selectedStep = currentProcess.steps.find((step) => step.stepCode === selectedStepCode) || currentProcess.steps[0]
  const actorGroups = useMemo(() => {
    const groups = new Map<string, SopSubStep[]>()
    currentProcess.steps.forEach((step) => {
      const actor = step.actor?.trim() || 'Chưa nêu người thực hiện'
      groups.set(actor, [...(groups.get(actor) || []), step])
    })
    return Array.from(groups, ([actor, steps]) => ({ actor, steps }))
  }, [currentProcess])

  if (currentProcess.steps.length === 0) {
    return (
      <div className={`rounded-xl border p-5 text-sm ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
        Quy trình này chưa có các bước để phân định vai trò.
      </div>
    )
  }

  return (
    <section className={`rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      <header className={`p-5 sm:p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"><UsersRound className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-300">Vai trò và điểm phối hợp</p>
              <h2 className="text-base sm:text-lg font-black mt-0.5">Ai phụ trách từng bước và họ làm gì?</h2>
              <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400">Chọn một bước để xem đúng vai trò, hình thức tham gia và trách nhiệm được nêu trong quy trình.</p>
            </div>
          </div>
          <span className="self-start px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{actorGroups.length} vai trò tham gia</span>
        </div>
      </header>

      <div className="p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-[minmax(280px,.8fr)_minmax(0,1.2fr)] gap-4">
        <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/60'}`}>
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className="text-xs font-extrabold">Chọn bước cần xem vai trò</h3>
          </div>
          <div className="p-2 space-y-1 max-h-[440px] overflow-y-auto">
            {currentProcess.steps.map((step, index) => {
              const selected = step.stepCode === selectedStep?.stepCode
              return (
                <button key={step.stepCode} type="button" onClick={() => setSelectedStepCode(step.stepCode)} className={`w-full p-3 rounded-lg text-left flex items-start gap-3 transition-colors cursor-pointer ${selected ? 'bg-blue-600 text-white shadow-sm' : isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-white text-slate-800'}`}>
                  <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${selected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{index + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold leading-snug">{step.title}</span><span className={`block mt-1 text-[11px] ${selected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{step.actor || 'Chưa nêu người thực hiện'}</span></span>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${selected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {selectedStep && (() => {
          const participation = getParticipation(selectedStep)
          const ParticipationIcon = getParticipationIcon(participation)
          return <div className={`rounded-xl border p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900/35' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div><p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-300">Vai trò tại bước đang chọn</p><h3 className="text-base font-black mt-1">{selectedStep.title}</h3></div>
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3"><div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0"><CircleUserRound className="w-4 h-4" /></div><div><p className="text-xs font-extrabold">{selectedStep.actor || 'Chưa nêu người phụ trách'}</p><p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">Vai trò được nêu cho bước này</p></div></div>
                <div className="flex flex-wrap gap-2"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold ${getParticipationClasses(participation, isDarkMode)}`}><ParticipationIcon className="w-3.5 h-3.5" />{participation}</span>{selectedStep.location && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 text-blue-600" />{selectedStep.location}</span>}</div>
              </div>
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}><h4 className="text-xs font-extrabold">Trách nhiệm của vai trò này tại bước đang chọn</h4><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedStep.description || 'Chưa nêu trong quy trình'}</p></div>
            </div>
          </div>
        })()}
      </div>

      <div className={`p-4 sm:p-5 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'}`}>
        <h3 className="text-xs font-extrabold">Tổng hợp theo vai trò</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {actorGroups.map((group) => <div key={group.actor} className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-2"><p className="text-xs font-extrabold">{group.actor}</p><span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{group.steps.length} bước</span></div><p className="mt-1.5 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{group.steps.map((step) => step.title).join(' · ')}</p></div>)}
        </div>
      </div>
    </section>
  )
}
