import React, { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  ExternalLink,
  Info,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  X
} from 'lucide-react'
import type { SystemGuide } from '../model/systemGuideModel'
import { useGuideTerms, type GlossaryTerm } from '../../system-glossary/model/systemGlossaryModel'
import { GlossaryTermTooltip } from '../../system-glossary/ui/GlossaryTermTooltip'
import { GlossaryTermDrawer } from '../../system-glossary/ui/GlossaryTermDrawer'

interface GuideDetailDrawerProps {
  guide: SystemGuide | null
  isOpen: boolean
  onClose: () => void
  onToggleStep: (guide: SystemGuide, stepIndex: number) => Promise<void>
  onCompleteAllSteps: (guide: SystemGuide) => Promise<void>
  onOpenRoute?: (routePath: string) => void
  isSaving?: boolean
}

export const GuideDetailDrawer: React.FC<GuideDetailDrawerProps> = ({
  guide,
  isOpen,
  onClose,
  onToggleStep,
  onCompleteAllSteps,
  onOpenRoute,
  isSaving = false
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const guideId = guide?.id
  const { terms: guideTerms } = useGuideTerms(isOpen ? guideId : undefined)
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<GlossaryTerm | null>(null)
  const [isGlossaryDrawerOpen, setIsGlossaryDrawerOpen] = useState(false)

  if (!isOpen || !guide) return null

  const content = guide?.content
  const completedSteps = guide?.progress?.completedSteps || []
  const totalSteps = content?.steps?.length || 0
  const isAllStepsCompleted = totalSteps > 0 && completedSteps.length >= totalSteps

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Fullscreen on Mobile, Slide-over on Desktop) */}
      <div className="relative z-10 flex h-full w-full flex-col bg-white shadow-2xl transition-transform dark:bg-slate-900 sm:max-w-xl md:max-w-2xl border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
        {/* Drawer Header */}
        <header className="flex shrink-0 items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="min-w-0 flex-1 pr-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200">
                {guide.category}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                v{guide.version}
              </span>
              {guide.available ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <CheckCircle2 className="size-3" />
                  Được phép sử dụng
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                  <LockKeyhole className="size-3" />
                  Chưa có quyền
                </span>
              )}
            </div>

            <h2
              id="guide-drawer-title"
              className="mt-2 text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-snug"
            >
              {guide.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
            aria-label="Đóng bảng hướng dẫn"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Action Header Banner if Route is Available */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 bg-white dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {totalSteps > 0 && (
              <span>
                Tiến độ: <strong>{completedSteps.length}/{totalSteps}</strong> bước hoàn thành
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {totalSteps > 0 && (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void onCompleteAllSteps(guide)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Check className="size-3.5 text-emerald-600" />
                {isAllStepsCompleted ? 'Bỏ đánh dấu xong' : 'Đánh dấu hoàn thành'}
              </button>
            )}

            {guide.available && guide.routePath && onOpenRoute && (
              <button
                type="button"
                onClick={() => {
                  onOpenRoute(guide.routePath!)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#155e75] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#164e63] shadow-xs active:translate-y-px"
              >
                Mở chức năng
                <ExternalLink className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* Permission warning banner if unauthorized */}
          {!guide.available && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <ShieldAlert className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-xs leading-5">
                  <h4 className="font-black text-amber-900 dark:text-amber-200">
                    Chức năng đang bị giới hạn truy cập
                  </h4>
                  <p className="mt-1 text-amber-800 dark:text-amber-300">
                    {guide.audienceMode === 'ADMIN'
                      ? 'Chức năng này chỉ dành cho người dùng có vai trò Quản trị viên (ADMIN / SUPER_ADMIN).'
                      : guide.requiredPermission
                      ? `Tài khoản của bạn cần được cấp quyền [${guide.requiredPermission}] và phân hệ liên quan để mở chức năng này.`
                      : 'Tài khoản chưa được phân quyền truy cập chức năng này.'}
                  </p>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Vui lòng liên hệ Quản trị viên hệ thống để kiểm tra và cấp quyền phù hợp với trách nhiệm công việc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {content ? (
            <>
              {/* Grid: Mục đích & Ai sử dụng */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Info className="size-4 text-[#155e75] dark:text-cyan-400" />
                    Mục đích chức năng
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-700 dark:text-slate-300">
                    {content.purpose}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                    Đối tượng sử dụng
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-700 dark:text-slate-300">
                    {content.audience}
                  </p>
                </div>
              </div>

              {/* Đường dẫn thao tác bằng chữ */}
              {content.accessPath && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Đường dẫn thao tác
                  </span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono">
                    <Compass className="size-4 text-[#155e75] dark:text-cyan-300 shrink-0" />
                    <span>{content.accessPath}</span>
                  </div>
                </div>
              )}

              {/* Thuật ngữ cần biết */}
              {guideTerms && guideTerms.length > 0 && (
                <div className="rounded-xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/60 to-blue-50/30 p-4 dark:border-cyan-900/50 dark:bg-cyan-950/20 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300 mb-2.5">
                    <BookOpen className="size-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Thuật ngữ cần biết</span>
                    <span className="text-[10px] lowercase font-normal text-cyan-700/80 dark:text-cyan-400/80">
                      (nhấp để xem định nghĩa)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guideTerms.map(term => (
                      <GlossaryTermTooltip
                        key={term.id}
                        term={term}
                        onClick={() => {
                          setActiveGlossaryTerm(term)
                          setIsGlossaryDrawerOpen(true)
                        }}
                      >
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-cyan-500 hover:text-cyan-600 dark:hover:border-cyan-400 dark:hover:text-cyan-300 transition-all cursor-pointer group"
                        >
                          <span className="size-1.5 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform" />
                          <span>{term.term}</span>
                        </button>
                      </GlossaryTermTooltip>
                    ))}
                  </div>
                </div>
              )}

              {/* Điều kiện tiên quyết */}
              {content.prerequisites && content.prerequisites.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Điều kiện cần có trước khi thực hiện
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {content.prerequisites.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <ChevronRight className="size-3.5 mt-0.5 text-cyan-600 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Numbered Timeline: Các bước thực hiện */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">
                    Các bước thực hiện chuẩn hóa
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Bấm vào số để đánh dấu hoàn thành
                  </span>
                </div>

                <ol className="mt-4 space-y-3 relative">
                  {content.steps.map((step, index) => {
                    const isDone = completedSteps.includes(index)
                    return (
                      <li
                        key={`${step.title}-${index}`}
                        className={`flex gap-3.5 rounded-xl border p-3.5 transition-all ${
                          isDone
                            ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                        }`}
                      >
                        {/* Interactive Step Circle Button */}
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => void onToggleStep(guide, index)}
                          aria-label={isDone ? `Bỏ hoàn thành bước ${index + 1}` : `Hoàn thành bước ${index + 1}`}
                          className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-black transition-transform active:scale-95 ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-cyan-100 hover:text-[#155e75] dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {isDone ? <Check className="size-4" /> : index + 1}
                        </button>

                        <div className="flex-1">
                          <h4
                            className={`text-xs font-black ${
                              isDone
                                ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>

              {/* Kết quả mong đợi */}
              {content.result && (
                <div className="rounded-xl border border-slate-200 bg-emerald-50/40 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Kết quả sau khi hoàn thành
                  </div>
                  <p className="mt-2 text-xs leading-5 text-emerald-950 dark:text-emerald-100 font-medium">
                    {content.result}
                  </p>
                </div>
              )}

              {/* Lỗi thường gặp */}
              {content.commonErrors && content.commonErrors.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="size-4 text-amber-600" />
                    Lỗi thường gặp & Cách xử lý
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {content.commonErrors.map((err, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Khi cần hỗ trợ */}
              {content.support && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <CircleHelp className="size-4 text-cyan-600" />
                    Hỗ trợ & Liên hệ
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {content.support}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-slate-500">
              Chưa có thông tin chi tiết cho hướng dẫn này.
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <footer className="shrink-0 border-t border-slate-200 p-4 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Đóng bảng
          </button>

          {guide.available && guide.routePath && onOpenRoute && (
            <button
              type="button"
              onClick={() => {
                onOpenRoute(guide.routePath!)
                onClose()
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#155e75] px-4 py-2 text-xs font-bold text-white hover:bg-[#164e63] shadow-xs active:translate-y-px"
            >
              Mở chức năng này
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </footer>
      </div>

      {/* Nested Glossary Term Drawer */}
      <GlossaryTermDrawer
        isOpen={isGlossaryDrawerOpen}
        onClose={() => {
          setIsGlossaryDrawerOpen(false)
          setActiveGlossaryTerm(null)
        }}
        term={activeGlossaryTerm}
      />
    </div>
  )
}
