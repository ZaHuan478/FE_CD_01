import React from 'react'
import {
  UserCheck,
  MapPin,
  Clock,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react'
import type { SopSubStep } from '../../../../entities/sop/model/types'
import { selectStepTypeCode } from '../../../../entities/sop/lib/workflowSelectors'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface UniversalStepDetailCanvasProps {
  step?: SopSubStep
  stepIdx: number
  totalSteps: number
  onPreviousStep: () => void
  onNextStep: () => void
  isDarkMode: boolean
}

export const UniversalStepDetailCanvas: React.FC<UniversalStepDetailCanvasProps> = ({
  step,
  stepIdx,
  totalSteps,
  onPreviousStep,
  onNextStep,
  isDarkMode
}) => {
  const { language } = useLanguage()

  if (!step) {
    return null
  }

  const typeStyle = selectStepTypeCode(step)
  const hasChecklist = step.fieldsChecklist && step.fieldsChecklist.length > 0

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200 animate-fadeIn ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Top Banner: Step Identity & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-1 bg-[#1f5f86] text-white font-mono font-black text-xs rounded-xl shadow-2xs">
            {step.stepCode || `BƯỚC ${stepIdx + 1}`}
          </span>

          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-lg border ${typeStyle.bgLight} ${typeStyle.bgDark} ${typeStyle.textLight} ${typeStyle.textDark} ${typeStyle.borderLight} ${typeStyle.borderDark}`}
          >
            [{typeStyle.code}] {typeStyle.label}
          </span>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {step.title}
          </h3>
        </div>

        {/* Step Prev / Next Navigator */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">
            {stepIdx + 1} / {totalSteps}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={onPreviousStep}
              className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">{language === 'vi' ? 'Trước' : 'Prev'}</span>
            </button>

            <button
              type="button"
              disabled={stepIdx >= totalSteps - 1}
              onClick={onNextStep}
              className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bước tiếp theo"
            >
              <span className="hidden md:inline">{language === 'vi' ? 'Tiếp' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Description */}
      <div
        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-700'
        }`}
      >
        <span className="font-bold text-slate-900 dark:text-white mr-1.5">
          {language === 'vi' ? 'Mô tả thao tác:' : 'Action Description:'}
        </span>
        {step.description || 'Thực hiện thao tác theo các quy định và hướng dẫn của quy trình chuẩn hóa.'}
      </div>

      {/* 3 Columns Execution Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Column 1: Actor & Location */}
        <div
          className={`p-3.5 rounded-xl border space-y-2 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <span className="font-extrabold text-[#1f5f86] dark:text-sky-300 uppercase tracking-wider text-[10px] block">
            {language === 'vi' ? '1. Người thực hiện & Kênh xử lý' : '1. Actor & Execution Channel'}
          </span>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white">{step.actor || 'HR/User'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{step.location || 'HRMS Portal / Văn bản điện tử'}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Timing & SLA */}
        <div
          className={`p-3.5 rounded-xl border space-y-2 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <span className="font-extrabold text-[#1f5f86] dark:text-sky-300 uppercase tracking-wider text-[10px] block">
            {language === 'vi' ? '2. Thời điểm & Tiến độ (SLA)' : '2. Timing & SLA'}
          </span>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white">{step.timing || 'Theo chu kỳ vận hành'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{language === 'vi' ? 'Kiểm soát phê duyệt theo phân quyền' : 'Authorization checkpoint'}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Source Code & Classification */}
        <div
          className={`p-3.5 rounded-xl border space-y-2 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <span className="font-extrabold text-[#1f5f86] dark:text-sky-300 uppercase tracking-wider text-[10px] block">
            {language === 'vi' ? '3. Phân loại thao tác & Mã SOP' : '3. Type & Reference Code'}
          </span>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-bold text-slate-900 dark:text-white">
                {typeStyle.label} ({step.typeCode || 'M'})
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Mã bước: {step.stepCode || 'SOP-STEP'}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist / Required Data Fields Section */}
      <div
        className={`p-4 rounded-xl border space-y-2.5 ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/60 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
          <CheckSquare2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {language === 'vi'
              ? 'Danh mục dữ liệu & Tiêu chí kiểm tra tại bước này'
              : 'Data Checklist & Verification Criteria'}
          </span>
        </div>

        {hasChecklist ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {step.fieldsChecklist!.map((field, idx) => (
              <div
                key={`${field}-${idx}`}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate" title={field}>
                  {field}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {language === 'vi'
              ? 'Chưa có danh mục checklist trường dữ liệu chi tiết cho bước này. Thực hiện theo biểu mẫu tiêu chuẩn.'
              : 'No specific data checklist declared for this step.'}
          </p>
        )}
      </div>
    </div>
  )
}
