import React, { useRef, useEffect } from 'react'
import {
  Compass,
  FileCheck2,
  Map,
  Search,
  Sparkles,
  UserCheck,
  X,
  Zap
} from 'lucide-react'
import type { UserSession } from '../../../entities/user/model/types'

interface GuideHeroProps {
  session: UserSession
  query: string
  onQueryChange: (value: string) => void
  onlyMine: boolean
  onToggleOnlyMine: (value: boolean) => void
  accessibleCount: number
  totalCount: number
  onStartTour?: () => void
  onQuickStart: () => void
  onViewAllFeatures: () => void
}

export const GuideHero: React.FC<GuideHeroProps> = ({
  session,
  query,
  onQueryChange,
  onlyMine,
  onToggleOnlyMine,
  accessibleCount,
  totalCount,
  onStartTour,
  onQuickStart,
  onViewAllFeatures
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-slate-900 via-[#0c2a38] to-[#155e75] text-white shadow-lg">
      {/* Subtle Dot Grid Pattern matching SOP Canvas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '18px 18px'
        }}
        aria-hidden="true"
      />

      {/* Decorative gradient flare */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 px-5 py-6 sm:px-8 sm:py-7">
        {/* Top bar: Badge & User Access Context */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-700/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-200 ring-1 ring-cyan-400/30">
              <Sparkles className="size-3.5 text-cyan-300" />
              Trung tâm Trợ giúp & Onboarding
            </span>
            <span className="hidden sm:inline-block text-xs text-cyan-200/60">•</span>
            <span className="hidden sm:inline-block text-xs font-semibold text-cyan-100/80">
              Dành cho nhân viên mới & tra cứu vận hành
            </span>
          </div>

          {/* User Access Profile Tag */}
          <div
            data-help-id="guide-profile"
            className="flex items-center gap-2 rounded-xl bg-slate-950/40 px-3 py-1.5 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <UserCheck className="size-4 text-cyan-300" />
            <div className="text-xs">
              <span className="font-black text-white">{session.fullName}</span>
              <span className="mx-1.5 text-cyan-400/60">•</span>
              <span className="text-cyan-200 font-bold">{session.systemRole}</span>
              {session.organization.department && (
                <>
                  <span className="mx-1.5 text-cyan-400/60">•</span>
                  <span className="text-slate-300">{session.organization.department}</span>
                </>
              )}
              <span className="mx-1.5 text-cyan-400/60">•</span>
              <span className="font-mono text-[11px] font-bold text-emerald-300">
                {accessibleCount}/{totalCount} chức năng
              </span>
            </div>
          </div>
        </div>

        {/* Main Hero Row: Headline + Search */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_minmax(320px,460px)] lg:items-center">
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-white">
              Bạn muốn làm gì hôm nay?
            </h1>
            <p className="mt-2 text-xs leading-5 text-cyan-100/90 sm:text-sm sm:leading-6">
              Tra cứu nhanh theo nhu cầu công việc, học cách dùng hệ thống theo lộ trình 5 phút, hoặc khám phá toàn bộ chức năng được phân quyền.
            </p>

            {/* 3 Call-To-Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-black text-slate-950 shadow-sm transition hover:bg-cyan-400 hover:shadow active:translate-y-px"
                >
                  <Compass className="size-3.5" />
                  Bắt đầu tham quan
                </button>
              )}

              <button
                type="button"
                onClick={onQuickStart}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20 active:translate-y-px"
              >
                <Zap className="size-3.5 text-amber-300" />
                Học nhanh trong 5 phút
              </button>

              <button
                type="button"
                onClick={onViewAllFeatures}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-white/5 px-3.5 py-2 text-xs font-bold text-cyan-100 ring-1 ring-white/10 transition hover:bg-white/15 active:translate-y-px"
              >
                <Map className="size-3.5 text-cyan-300" />
                Xem tất cả chức năng
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Tìm chức năng, SOP, thao tác hoặc từ khóa..."
                className="h-12 w-full rounded-xl border border-white/20 bg-white/95 pl-10 pr-20 text-sm font-semibold text-slate-900 shadow-inner outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-300"
                aria-label="Tìm kiếm hướng dẫn hệ thống"
              />

              <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => onQueryChange('')}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Xóa từ khóa tìm kiếm"
                  >
                    <X className="size-4" />
                  </button>
                ) : (
                  <kbd className="hidden rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500 sm:inline-block">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Scope Filter Segmented Switch */}
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-cyan-200/80 font-medium">Phạm vi hiển thị:</span>
              <div className="inline-flex rounded-lg bg-black/25 p-0.5 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => onToggleOnlyMine(true)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-bold transition ${
                    onlyMine
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-cyan-200/75 hover:text-white'
                  }`}
                >
                  <FileCheck2 className="size-3" />
                  Chức năng của tôi ({accessibleCount})
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOnlyMine(false)}
                  className={`rounded-md px-2.5 py-1 font-bold transition ${
                    !onlyMine
                      ? 'bg-cyan-500 text-slate-950 shadow-xs'
                      : 'text-cyan-200/75 hover:text-white'
                  }`}
                >
                  Tất cả chức năng ({totalCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
