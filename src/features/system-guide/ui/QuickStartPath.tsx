/* oxlint-disable react/only-export-components */
import React from 'react'
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Layers,
  Play,
  Search,
  Zap
} from 'lucide-react'
import type { SystemGuide } from '../model/systemGuideModel'
import { GuideProgress } from './GuideProgress'

export interface QuickStartStepConfig {
  id: string
  slug: string
  title: string
  description: string
  estimatedTime: string
  icon: typeof Compass
}

export const defaultQuickStartSteps: QuickStartStepConfig[] = [
  {
    id: 'step-overview',
    slug: 'tong-quan-he-thong',
    title: '1. Tổng quan hệ thống',
    description: 'Hiểu bố cục, phân hệ và phạm vi quyền tài khoản',
    estimatedTime: '1 phút',
    icon: Compass
  },
  {
    id: 'step-search-sop',
    slug: 'thu-vien-quy-trinh',
    title: '2. Tìm SOP đã công bố',
    description: 'Tra cứu quy trình chuẩn theo phân hệ & nghiệp vụ',
    estimatedTime: '2 phút',
    icon: Search
  },
  {
    id: 'step-view-flowchart',
    slug: 'xem-luu-do-va-canvas-sop',
    title: '3. Xem lưu đồ & canvas',
    description: 'Đọc sơ đồ trực quan, bước rẽ nhánh và trách nhiệm',
    estimatedTime: '1 phút',
    icon: Layers
  },
  {
    id: 'step-my-docs',
    slug: 'tai-lieu-cua-toi',
    title: '4. Mở kho tài liệu',
    description: 'Quản lý tài liệu nguồn PDF/DOCX trước chuyển hóa',
    estimatedTime: '2 phút',
    icon: FileText
  },
  {
    id: 'step-ai-assistant',
    slug: 'tro-ly-ai-sop',
    title: '5. Hỏi trợ lý AI',
    description: 'Hỏi đáp nghiệp vụ nhanh có trích dẫn nguồn SOP',
    estimatedTime: '1 phút',
    icon: Bot
  }
]

interface QuickStartPathProps {
  guides: SystemGuide[]
  onSelectGuide: (slug: string) => void
  onStartTour?: () => void
  className?: string
}

export const QuickStartPath: React.FC<QuickStartPathProps> = ({
  guides,
  onSelectGuide,
  onStartTour,
  className = ''
}) => {
  // Determine completion state for each step based on backend data
  const stepStatuses = defaultQuickStartSteps.map((step) => {
    const guide = guides.find((g) => g.slug === step.slug)
    const progress = guide?.progress
    const totalContentSteps = guide?.content?.steps?.length || 3
    const completedStepsCount = progress?.completedSteps?.length || 0

    let status: 'completed' | 'in_progress' | 'not_started' = 'not_started'
    if (progress?.tourCompleted || (completedStepsCount >= totalContentSteps && totalContentSteps > 0)) {
      status = 'completed'
    } else if (completedStepsCount > 0) {
      status = 'in_progress'
    }

    return {
      ...step,
      guide,
      status,
      completedStepsCount,
      totalContentSteps
    }
  })

  const completedCount = stepStatuses.filter((s) => s.status === 'completed').length
  const totalSteps = stepStatuses.length

  return (
    <section
      id="quick-start-path"
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {/* Header with Title and Tour CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Zap className="size-4.5" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Lộ trình bắt đầu trong 5 phút
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                5 bước chuẩn hóa giúp người mới tự tin sử dụng toàn bộ hệ thống
              </p>
            </div>
          </div>
        </div>

        {onStartTour && (
          <button
            type="button"
            onClick={onStartTour}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50/60 px-3.5 py-1.5 text-xs font-black text-[#155e75] hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/60"
          >
            <Play className="size-3.5" />
            Tham quan giao diện
          </button>
        )}
      </div>

      {/* Overall Progress Widget */}
      <div className="mt-4">
        <GuideProgress completedCount={completedCount} totalCount={totalSteps} />
      </div>

      {/* Connected 5-Step Learning Path */}
      <div className="mt-5">
        <ol className="grid gap-3 md:grid-cols-5 relative">
          {stepStatuses.map((step, idx) => {
            const Icon = step.icon
            const isLast = idx === stepStatuses.length - 1
            const isCompleted = step.status === 'completed'
            const isInProgress = step.status === 'in_progress'

            return (
              <li
                key={step.id}
                className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : isInProgress
                    ? 'border-cyan-300 bg-cyan-50/30 ring-1 ring-cyan-200 dark:border-cyan-800 dark:bg-cyan-950/20 dark:ring-cyan-900'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50'
                }`}
              >
                {/* Connector Arrow for Desktop */}
                {!isLast && (
                  <div
                    className="hidden md:block pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700"
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-4" />
                  </div>
                )}

                <div>
                  {/* Step Top Row: Icon + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`grid size-8 place-items-center rounded-lg text-xs font-black ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-cyan-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                    </span>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="size-3" />
                        Đã xong
                      </span>
                    ) : isInProgress ? (
                      <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-black text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                        Đang học
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Clock className="size-2.5" />
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Step Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSelectGuide(step.slug)}
                    className={`w-full inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2.5 text-xs font-bold transition ${
                      isCompleted
                        ? 'border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300'
                        : isInProgress
                        ? 'bg-[#155e75] text-white hover:bg-[#164e63] shadow-xs'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{isCompleted ? 'Xem lại' : isInProgress ? 'Tiếp tục' : 'Bắt đầu'}</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
