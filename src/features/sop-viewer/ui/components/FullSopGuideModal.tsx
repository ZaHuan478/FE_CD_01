import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  BookOpen,
  UserCheck,
  Clock,
  ShieldCheck,
  CheckSquare2,
  FileText,
  Printer,
  FileCheck2,
  AlertCircle,
  MapPin,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react'
import type { SopSubProcess } from '../../../../entities/sop/model/types'

interface FullSopGuideModalProps {
  isOpen: boolean
  onClose: () => void
  process: SopSubProcess
  isDarkMode: boolean
}

export const FullSopGuideModal: React.FC<FullSopGuideModalProps> = ({
  isOpen,
  onClose,
  process,
  isDarkMode
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  const [collapsedSteps, setCollapsedSteps] = useState<Record<number, boolean>>({})
  onCloseRef.current = onClose

  // Keep keyboard focus inside the modal, restore it after closing and prevent
  // the document behind the guide from scrolling.
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ))
      if (!focusable.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [isOpen])

  if (!isOpen || typeof document === 'undefined') return null

  const handlePrint = () => {
    window.print()
  }

  const steps = process.steps || []
  const docControl = process.documentControl
  const access = process.access
  const rules = process.rules || []

  const toggleStepCollapse = (idx: number) => {
    setCollapsedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const areAllCollapsed = steps.length > 0 && steps.every((_, idx) => Boolean(collapsedSteps[idx]))

  const toggleAllSteps = () => {
    if (areAllCollapsed) {
      setCollapsedSteps({})
    } else {
      const all: Record<number, boolean> = {}
      steps.forEach((_, idx) => {
        all[idx] = true
      })
      setCollapsedSteps(all)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-3 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Centered SOP guide modal */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="full-sop-guide-title"
          className={`relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isDarkMode ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4 sm:px-6 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-[#1f5f86] text-white shadow-xs shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                    {process.sopCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {process.sopCategory || 'Quy trình chuẩn hóa'}
                  </span>
                </div>
                <h2 id="full-sop-guide-title" className="text-base sm:text-lg font-black text-slate-950 dark:text-white truncate">
                  {process.sopTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="In tài liệu SOP"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label="Đóng hướng dẫn SOP đầy đủ"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
            {/* 1. Tổng quan & Mục đích */}
            <section
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-400">
                <FileText className="w-4 h-4" />
                <span>1. Mục đích & Phạm vi áp dụng</span>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {process.description || 'Quy trình chuẩn hóa hướng dẫn các bước thao tác nghiệp vụ tuần tự, đảm bảo tính nhất quán, chính xác và minh bạch trong toàn doanh nghiệp.'}
              </p>

              {/* Inputs & Outputs Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {process.inputs && process.inputs.length > 0 && (
                  <div className="p-3 rounded-xl border border-orange-200/80 dark:border-orange-800/60 bg-orange-50/50 dark:bg-orange-950/20 text-xs">
                    <span className="font-bold text-orange-900 dark:text-orange-200 block mb-1.5">
                      Dữ liệu đầu vào (Inputs):
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                      {process.inputs.map((inp, idx) => (
                        <li key={idx} className="leading-snug">{inp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {process.outputs && process.outputs.length > 0 && (
                  <div className="p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1.5">
                      Kết quả bàn giao (Outputs):
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                      {process.outputs.map((out, idx) => (
                        <li key={idx} className="leading-snug">{out}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* 2. Toàn bộ các bước chi tiết (All Sequential Steps) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-400">
                  <FileCheck2 className="w-4 h-4" />
                  <span>2. Hướng dẫn chi tiết từng bước ({steps.length} bước)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {steps.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={toggleAllSteps}
                        className="text-xs font-semibold text-[#1f5f86] hover:text-[#184b6a] dark:text-sky-400 dark:hover:text-sky-300 transition-colors cursor-pointer"
                      >
                        {areAllCollapsed ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
                      </button>
                      <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
                    </>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Trình tự thực thi chuẩn
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const isCollapsed = Boolean(collapsedSteps[idx])

                  return (
                    <div
                      key={`${step.stepCode || idx}-${idx}`}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      } ${!isCollapsed ? 'space-y-3' : ''}`}
                    >
                      {/* Step Title Header */}
                      <div
                        className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        onClick={() => toggleStepCollapse(idx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleStepCollapse(idx)
                          }
                        }}
                        aria-expanded={!isCollapsed}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="size-6 rounded-lg bg-[#1f5f86] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-xs">
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                            <UserCheck className="w-3 h-3 text-orange-500" />
                            <span>{step.actor || 'HR/User'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStepCollapse(idx)
                            }}
                            className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-transform duration-200 inline-flex items-center justify-center cursor-pointer ${
                              !isCollapsed ? 'rotate-180' : ''
                            }`}
                            aria-expanded={!isCollapsed}
                            title={isCollapsed ? 'Mở rộng bước' : 'Thu gọn bước'}
                            aria-label={isCollapsed ? 'Mở rộng bước' : 'Thu gọn bước'}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Step Details (Collapsible) */}
                      {!isCollapsed && (
                        <>
                          {/* Step Description */}
                          {step.description && (
                            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-8.5">
                              {step.description}
                            </p>
                          )}

                          {/* Execution Meta (Location + Timing) */}
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pl-8.5 flex-wrap">
                            {step.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{step.location}</span>
                              </span>
                            )}
                            {step.timing && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Thời hạn: {step.timing}</span>
                              </span>
                            )}
                          </div>

                          {/* Checklist */}
                          {step.fieldsChecklist && step.fieldsChecklist.length > 0 && (
                            <div className="pl-8.5 pt-1 space-y-1.5">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                                Bảng kiểm thao tác:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {step.fieldsChecklist.map((item, itemIdx) => (
                                  <div
                                    key={itemIdx}
                                    className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
                                  >
                                    <CheckSquare2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="leading-snug">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Image Thumbnail if attached */}
                          {(step.imageUrl || (step.media && step.media.length > 0)) && (
                            <div className="pl-8.5 pt-2 flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400">
                              <ImageIcon className="w-4 h-4" />
                              <span>Có hình ảnh minh họa đính kèm</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 3. Quy tắc & Ràng buộc nghiệp vụ */}
            {rules.length > 0 && (
              <section
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                  isDarkMode ? 'bg-amber-950/20 border-amber-800/50' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span>3. Quy định & Chế tài kiểm soát</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-xs leading-relaxed text-amber-950 dark:text-amber-200">
                  {rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. Quản trị tài liệu & RACI */}
            {docControl && (
              <section
                className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Phân định trách nhiệm & Quản trị tài liệu</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Chủ quản SOP:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{docControl.owner}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Người phê duyệt:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{docControl.approver}</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Chu kỳ rà soát:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{docControl.reviewCycle}</span>
                  </div>
                </div>

                {access && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>Phạm vi áp dụng: </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {access.sopViewers?.join(', ') || 'Toàn bộ nhân sự được phân quyền'}
                    </span>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Mã tài liệu: <strong className="font-mono text-slate-800 dark:text-slate-200">{process.sopCode}</strong>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1f5f86] text-white text-xs font-bold shadow-xs hover:bg-[#184b6a] transition-colors cursor-pointer"
            >
              Đóng hướng dẫn
            </button>
          </div>
        </div>
    </div>
    , document.body)
}
