import React from 'react'
import { ArrowRight, Link2 } from 'lucide-react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import { useLanguage } from '../../../../context/LanguageContext'
import type { ModuleInfo } from '../types'

interface LifecycleStepDetailCanvasProps {
  activeStep: LifecycleStep
  activeModInfo: ModuleInfo
  currentStepIdx: number
  totalSteps: number
  onPrevStep: () => void
  onNextStep: () => void
  onOpenSopDetail: (stepId: string) => void
}

export const LifecycleStepDetailCanvas: React.FC<LifecycleStepDetailCanvasProps> = ({
  activeStep,
  activeModInfo,
  currentStepIdx,
  totalSteps,
  onPrevStep,
  onNextStep,
  onOpenSopDetail
}) => {
  const { language } = useLanguage()

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 border-2 border-blue-500/30 dark:border-blue-500/30 p-5 shadow-sm space-y-4 animate-fadeIn transition-all">
      {/* Canvas Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
            {activeStep.stepNumber}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-xs font-mono font-black bg-blue-600 text-white rounded-md shadow-2xs">
                {activeStep.id}
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${activeModInfo.bg} ${activeModInfo.color} ${activeModInfo.border}`}
              >
                🎯 {language === 'vi' ? activeModInfo.name : activeModInfo.nameEn}
              </span>
              {activeStep.sopBadge && (
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  📋 {activeStep.sopBadge}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {activeStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {language === 'vi' ? activeModInfo.desc : activeModInfo.descEn}
            </p>
          </div>
        </div>

        {/* Step Navigator (Prev / Next & Direct Open CTA) */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIdx === 0}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            ← {language === 'vi' ? 'Bước trước' : 'Previous'}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={currentStepIdx === totalSteps - 1}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              currentStepIdx === totalSteps - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {language === 'vi' ? 'Bước tiếp' : 'Next'} →
          </button>

          <button
            type="button"
            onClick={() => onOpenSopDetail(activeStep.id)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ml-1"
          >
            <span>
              {language === 'vi' ? 'Mở Chi Tiết Quy Trình (SOP)' : 'Open Full SOP Spec'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Body: Inputs, Outputs, and Associated Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Inputs Box */}
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{language === 'vi' ? 'Dữ liệu Đầu vào (Inputs):' : 'Input Data:'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeStep.inputs && activeStep.inputs.length > 0 ? (
              activeStep.inputs.map((inp, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-blue-50/70 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/50"
                >
                  {inp}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Hồ sơ ứng viên / Yêu cầu nghiệp vụ
              </span>
            )}
          </div>
        </div>

        {/* Outputs Box */}
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{language === 'vi' ? 'Kết quả Đầu ra (Outputs):' : 'Output Results:'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeStep.outputs && activeStep.outputs.length > 0 ? (
              activeStep.outputs.map((out, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/50"
                >
                  {out}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Hồ sơ số hóa / Quyết định nhân sự
              </span>
            )}
          </div>
        </div>

        {/* Co-operating Modules Box */}
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Link2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {language === 'vi' ? 'Phân hệ Phối hợp (Co-Modules):' : 'Co-operating Modules:'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeModInfo.coModules && activeModInfo.coModules.length > 0 ? (
              activeModInfo.coModules.map((coMod, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${coMod.bg} ${coMod.color}`}
                >
                  {language === 'vi' ? coMod.name : coMod.nameEn}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Toàn hệ thống Core HR
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
