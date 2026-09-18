import React, { useEffect, useMemo, useState } from 'react'
import {
  ChevronRight,
  CircleUserRound,
  MapPin,
  UsersRound
} from 'lucide-react'

import type { SopSubProcess, SopSubStep } from '../../../../entities/sop/model/types'

interface StructuredRaciEntry {
  actor: string
  responsible?: string[]
  accountable?: string[]
  consulted?: string[]
  informed?: string[]
}

interface RoleFlowSectionProps {
  currentProcess: SopSubProcess & { raci?: StructuredRaciEntry[] }
  isDarkMode: boolean
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

  const hasStructuredRaci = Array.isArray(currentProcess.raci) && currentProcess.raci.length > 0

  return (
    <section className={`rounded-2xl border shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      <header className={`p-5 sm:p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"><UsersRound className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                {hasStructuredRaci ? 'Phân định vai trò & RACI' : 'Vai trò theo từng bước'}
              </p>
              <h2 className="text-base sm:text-lg font-black mt-0.5">
                {hasStructuredRaci ? 'Ma trận vai trò & RACI của quy trình' : 'Ai phụ trách từng bước và họ làm gì?'}
              </h2>
              <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400">
                Chọn một bước để xem vai trò phụ trách thực tế và trách nhiệm được nêu trong tài liệu SOP.
              </p>
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
                  <span className="min-w-0 flex-1"><span className="block text-xs font-bold leading-snug">{step.title}</span><span className={`block mt-1 text-[11px] ${selected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{step.actor || 'Chưa được khai báo'}</span></span>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${selected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {selectedStep && (
          <div className={`rounded-xl border p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900/35' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div><p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-300">Vai trò tại bước đang chọn</p><h3 className="text-base font-black mt-1">{selectedStep.title}</h3></div>
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3"><div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0"><CircleUserRound className="w-4 h-4" /></div><div><p className="text-xs font-extrabold">{selectedStep.actor || 'Chưa được khai báo'}</p><p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">Người thực hiện</p></div></div>
                <div className="flex flex-wrap gap-2">
                  {selectedStep.location && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 text-blue-600" />{selectedStep.location}</span>}
                </div>
              </div>
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}><h4 className="text-xs font-extrabold">Trách nhiệm tại bước này</h4><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedStep.description || 'Chưa được khai báo'}</p></div>
            </div>
          </div>
        )}
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
