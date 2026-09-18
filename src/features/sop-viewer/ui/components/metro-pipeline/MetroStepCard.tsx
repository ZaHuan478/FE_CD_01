import React from 'react'
import {
  UserCheck,
  Clock,
  Calendar,
  FileText,
  Send,
  CheckCheck,
  ShieldCheck,
  Database,
  Cpu,
  PenTool
} from 'lucide-react'
import type { SopSubStep } from '../../../../../entities/sop/model/types'
import { selectStepTypeCode } from '../../../../../entities/sop/lib/workflowSelectors'

interface MetroStepCardProps {
  step: SopSubStep
  stepIdx: number
  isSelected: boolean
  isHighlighted?: boolean
  onSelect: () => void
  isDarkMode: boolean
}

// Helper to choose a contextual icon based on step title, description or type
function getStepIcon(step: SopSubStep) {
  const titleLower = (step.title || '').toLowerCase()
  const descLower = (step.description || '').toLowerCase()
  const text = `${titleLower} ${descLower}`

  if (step.typeCode === 'A' || text.includes('tự động') || text.includes('hệ thống') || text.includes('engine')) {
    return <Cpu className="w-4 h-4 text-violet-500" />
  }
  if (text.includes('khai báo') || text.includes('nhập') || text.includes('tạo') || text.includes('điền')) {
    return <PenTool className="w-4 h-4 text-orange-500" />
  }
  if (text.includes('phân ca') || text.includes('lịch') || text.includes('phân công') || text.includes('chấm công')) {
    return <Calendar className="w-4 h-4 text-amber-500" />
  }
  if (text.includes('gửi') || text.includes('yêu cầu') || text.includes('thông báo') || text.includes('chuyển tiếp')) {
    return <Send className="w-4 h-4 text-sky-500" />
  }
  if (text.includes('kiểm tra') || text.includes('rà soát') || text.includes('đối chiếu') || text.includes('thẩm định')) {
    return <ShieldCheck className="w-4 h-4 text-indigo-500" />
  }
  if (text.includes('chốt') || text.includes('xác nhận') || text.includes('hoàn tất') || text.includes('duyệt') || text.includes('ký')) {
    return <CheckCheck className="w-4 h-4 text-emerald-500" />
  }
  if (text.includes('lương') || text.includes('tính toán') || text.includes('dữ liệu') || text.includes('báo cáo')) {
    return <Database className="w-4 h-4 text-rose-500" />
  }
  return <FileText className="w-4 h-4 text-orange-500" />
}

export const MetroStepCard: React.FC<MetroStepCardProps> = ({
  step,
  stepIdx,
  isSelected,
  isHighlighted = true,
  onSelect,
  isDarkMode
}) => {
  const typeStyle = selectStepTypeCode(step)

  // Extract a clean 1-sentence short business description from data without inventing anything
  const shortDescription = step.description?.trim() || (step.fieldsChecklist && step.fieldsChecklist.length > 0 ? step.fieldsChecklist.join(', ') : '')

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`relative w-[230px] sm:w-[250px] shrink-0 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between select-none ${
        !isHighlighted ? 'opacity-40 grayscale-[40%]' : 'opacity-100'
      } ${
        isSelected
          ? isDarkMode
            ? 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/20 ring-2 ring-orange-500/60 -translate-y-1'
            : 'bg-white border-orange-400 shadow-xl shadow-orange-500/15 ring-2 ring-orange-400/80 -translate-y-1'
          : isDarkMode
            ? 'bg-slate-900/95 border-slate-800 hover:border-orange-500/40 hover:bg-slate-850 shadow-xs hover:shadow-md'
            : 'bg-white border-slate-200/90 hover:border-orange-300 hover:shadow-md shadow-2xs'
      }`}
    >
      {/* Active Glowing Indicator Dot */}
      {isSelected && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white dark:border-slate-900" />
        </span>
      )}

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Step Header: Friendly Step Number & Friendly Action Type */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                isSelected
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-orange-400 border-slate-700'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}
            >
              Bước {stepIdx + 1}
            </span>
          </div>

          {/* Friendly Type Badge (No technical code like [N], [A]) */}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md border ${typeStyle.bgLight} ${typeStyle.bgDark} ${typeStyle.textLight} ${typeStyle.textDark} ${typeStyle.borderLight} ${typeStyle.borderDark}`}
          >
            {typeStyle.label}
          </span>
        </div>

        {/* Step Title + Icon (Max 2 lines) */}
        <div className="flex items-start gap-2.5 pt-0.5">
          <div
            className={`p-2 rounded-xl shrink-0 transition-colors ${
              isSelected
                ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {getStepIcon(step)}
          </div>

          <h4
            className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 transition-colors ${
              isSelected
                ? 'text-orange-950 dark:text-orange-100'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {step.title}
          </h4>
        </div>

        {/* Short Business Description (Max 2 lines, >= 12px) */}
        <div
          className={`p-2 rounded-xl border min-h-[44px] flex items-center ${
            isDarkMode
              ? 'bg-slate-950/50 border-slate-800/80'
              : 'bg-slate-50/80 border-slate-100'
          }`}
        >
          {shortDescription ? (
            <p className="text-xs leading-relaxed line-clamp-2 text-slate-600 dark:text-slate-300">
              {shortDescription}
            </p>
          ) : (
            <p className="text-xs italic text-slate-400 dark:text-slate-500 line-clamp-1">
              Thực hiện theo quy chuẩn thao tác
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Role & Timing (Font >= 12px) */}
      <div
        className={`px-3.5 py-2 border-t flex items-center justify-between text-xs font-medium rounded-b-2xl ${
          isSelected
            ? isDarkMode
              ? 'border-slate-800 bg-orange-950/20 text-orange-300'
              : 'border-orange-100 bg-orange-50/50 text-orange-800'
            : isDarkMode
              ? 'border-slate-800/80 bg-slate-900/60 text-slate-300'
              : 'border-slate-100 bg-slate-50/70 text-slate-600'
        }`}
      >
        <span className="flex items-center gap-1.5 truncate max-w-[150px] font-semibold">
          <UserCheck className="w-3.5 h-3.5 shrink-0 text-orange-500" />
          <span className="truncate">{step.actor || 'Người thực hiện'}</span>
        </span>

        {step.timing && (
          <span className="flex items-center gap-1 shrink-0 text-slate-500 dark:text-slate-400 text-xs">
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[70px]">{step.timing.split(' ')[0]}</span>
          </span>
        )}
      </div>
    </div>
  )
}
