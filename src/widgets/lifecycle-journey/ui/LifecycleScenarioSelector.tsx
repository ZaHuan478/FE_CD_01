import React from 'react'
import { CheckCircle2, Compass, Info } from 'lucide-react'
import { LIFECYCLE_SCENARIOS } from '../../../entities/lifecycle/model/journey/lifecycleJourneyData'
import type { ScenarioId } from '../../../entities/lifecycle/model/journey/types'

interface LifecycleScenarioSelectorProps {
  activeScenario: ScenarioId
  onSelectScenario: (scenarioId: ScenarioId) => void
}

export const LifecycleScenarioSelector: React.FC<LifecycleScenarioSelectorProps> = ({
  activeScenario,
  onSelectScenario
}) => {
  const currentScenario = LIFECYCLE_SCENARIOS.find((s) => s.id === activeScenario) ?? LIFECYCLE_SCENARIOS[0]

  return (
    <section aria-label="Bộ chọn kịch bản nghiệp vụ" className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
            <Compass className="h-4 w-4 text-[#1f5f86] dark:text-sky-300" />
            <span>Kịch bản nghiệp vụ / Xem hành trình mẫu:</span>
          </div>
        </div>

        {/* DANH SÁCH NÚT KỊCH BẢN */}
        <div className="flex flex-wrap items-center gap-1.5">
          {LIFECYCLE_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenario
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onSelectScenario(scenario.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#1f5f86] text-white shadow-2xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {scenario.title}
              </button>
            )
          })}
        </div>

        {/* THẺ TÓM TẮT KỊCH BẢN ĐANG CHỌN */}
        <div className="flex items-start gap-2.5 rounded-lg border border-sky-100 bg-sky-50/60 p-3 text-xs dark:border-sky-900/40 dark:bg-sky-950/20">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86] dark:text-sky-300" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 dark:text-white">
              {currentScenario.title}: <span className="font-normal text-slate-600 dark:text-slate-300">{currentScenario.subtitle}</span>
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
              {currentScenario.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
                Phân hệ tác động:
              </span>
              {currentScenario.impactedModules.map((mod) => (
                <span
                  key={mod}
                  className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#1f5f86] shadow-2xs dark:bg-slate-900 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  <span>{mod}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
