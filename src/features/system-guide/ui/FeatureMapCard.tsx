import React from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  ClipboardList,
  Compass,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import type { SystemGuide } from '../model/systemGuideModel'

const categoryIcons: Record<string, typeof Compass> = {
  'Bắt đầu': Compass,
  'Khám phá hệ thống': Compass,
  'Tra cứu': Search,
  'Tài liệu': FileText,
  'Chuyển hóa': Sparkles,
  'Trực quan hóa': BookOpenCheck,
  'Quản lý SOP': ClipboardList,
  'Trợ lý AI': Bot,
  'Quản trị': ShieldCheck
}

interface FeatureMapCardProps {
  guide: SystemGuide
  isSelected?: boolean
  onSelect: (guide: SystemGuide) => void
  onOpenRoute?: (routePath: string) => void
}

export const FeatureMapCard: React.FC<FeatureMapCardProps> = ({
  guide,
  isSelected = false,
  onSelect,
  onOpenRoute
}) => {
  const Icon = categoryIcons[guide.category] || BookOpenCheck

  return (
    <div
      onClick={() => onSelect(guide)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(guide)
        }
      }}
      className={`group flex min-h-[160px] cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        isSelected
          ? 'border-cyan-500 bg-cyan-50/40 ring-2 ring-cyan-400/50 shadow-md dark:border-cyan-500 dark:bg-cyan-950/40'
          : guide.available
          ? 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700'
          : 'border-slate-200/60 bg-slate-50/70 hover:border-slate-300 dark:border-slate-800/60 dark:bg-slate-900/40'
      }`}
    >
      <div>
        {/* Header: Icon, Category Badge & Lock status */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`grid size-8 place-items-center rounded-lg ${
              isSelected
                ? 'bg-[#155e75] text-white shadow-xs'
                : guide.available
                ? 'bg-cyan-50 text-[#155e75] dark:bg-cyan-950/60 dark:text-cyan-300'
                : 'bg-slate-200/60 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <Icon className="size-4" />
          </span>

          <div className="flex items-center gap-1.5">
            {guide.available ? (
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                Có thể dùng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <LockKeyhole className="size-2.5" />
                Khóa
              </span>
            )}
          </div>
        </div>

        {/* Title and summary */}
        <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#155e75] dark:group-hover:text-cyan-300 transition-colors">
          {guide.title}
        </h4>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
          {guide.summary}
        </p>
      </div>

      {/* Footer: Guide Actions */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {guide.category}
        </span>

        <div className="flex items-center gap-2">
          {guide.available && guide.routePath && onOpenRoute && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenRoute(guide.routePath!)
              }}
              className="rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 hover:text-[#155e75] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
              title="Mở trực tiếp trang này"
            >
              Mở ngay
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1 text-xs font-black transition-transform ${
              guide.available
                ? 'text-[#155e75] dark:text-cyan-300 group-hover:translate-x-0.5'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span>{guide.available ? 'Xem chi tiết' : 'Xem điều kiện'}</span>
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  )
}
