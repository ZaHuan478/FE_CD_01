import React from 'react'
import { Play, Pause, RotateCcw, ChevronRight, Sparkles } from 'lucide-react'
import type { SimulationStatus } from '../../../entities/process-flow/model/types'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface FlowSimulationControlsProps {
  status: SimulationStatus
  currentStep: number
  totalSteps: number
  activeLabel?: string
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
}

export const FlowSimulationControls: React.FC<FlowSimulationControlsProps> = ({
  status,
  currentStep,
  totalSteps,
  activeLabel,
  onPlay,
  onPause,
  onReset,
  onStepForward
}) => {
  const { language } = useLanguage()

  const isRunning = status === 'running'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
      {/* Status Info */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900/50">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Mô phỏng dòng chảy dữ liệu' : 'Data Flow Simulation'}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
          {activeLabel && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-md">
              {activeLabel}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 self-start sm:self-center">
        {isRunning ? (
          <button
            type="button"
            onClick={onPause}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Tạm dừng' : 'Pause'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="px-3 py-1.5 bg-[#1f5f86] hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'vi' ? 'Bắt đầu chạy' : 'Play Flow'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStepForward}
          disabled={isRunning}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
          title="Chuyển sang bước kế tiếp"
        >
          <span>{language === 'vi' ? 'Bước tiếp' : 'Step'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          title="Đặt lại mô phỏng"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
        </button>
      </div>
    </div>
  )
}
