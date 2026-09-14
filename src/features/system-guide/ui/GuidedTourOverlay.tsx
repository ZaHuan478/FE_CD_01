import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Info,
  SkipForward,
  X
} from 'lucide-react'
import type { SystemGuideTourStep } from '../model/systemGuideModel'

interface GuidedTourOverlayProps {
  steps: SystemGuideTourStep[]
  onComplete: () => void
  onClose: () => void
}

export const GuidedTourOverlay: React.FC<GuidedTourOverlayProps> = ({
  steps,
  onComplete,
  onClose
}) => {
  const [index, setIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const step = steps[index]

  // Query anchor target
  const target = useMemo(() => {
    if (!step) return null
    try {
      return document.querySelector<HTMLElement>(`[data-help-id="${step.anchor}"]`)
    } catch {
      return null
    }
  }, [step])

  // Scroll target into view smoothly
  useEffect(() => {
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [target])

  // Keyboard accessibility: Escape to close, arrow keys for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowRight' && index < steps.length - 1) {
        e.preventDefault()
        setIndex((prev) => prev + 1)
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        setIndex((prev) => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, steps.length, onClose])

  // Focus trap / initial focus on Next button
  useEffect(() => {
    const timer = setTimeout(() => {
      nextButtonRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [index])

  if (!step) return null

  const rect = target ? target.getBoundingClientRect() : null
  const isLast = index === steps.length - 1
  const progressPercent = Math.round(((index + 1) / steps.length) * 100)

  // Compute position of card relative to target or center
  let cardStyle: React.CSSProperties
  if (rect) {
    // Check viewport space below vs above
    const spaceBelow = window.innerHeight - rect.bottom
    const cardWidth = Math.min(380, window.innerWidth - 32)
    const left = Math.min(Math.max(16, rect.left), window.innerWidth - cardWidth - 16)

    if (spaceBelow > 220 || rect.top < 220) {
      // Position below target
      cardStyle = {
        left: `${left}px`,
        top: `${Math.min(window.innerHeight - 230, rect.bottom + 14)}px`,
        width: `${cardWidth}px`
      }
    } else {
      // Position above target
      cardStyle = {
        left: `${left}px`,
        top: `${Math.max(16, rect.top - 210)}px`,
        width: `${cardWidth}px`
      }
    }
  } else {
    // Fallback centered position
    const cardWidth = Math.min(380, window.innerWidth - 32)
    cardStyle = {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${cardWidth}px`
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Hướng dẫn tham quan hệ thống"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 transition-opacity"
        onClick={onClose}
      />

      {/* Target Element Spotlight / Highlight Ring */}
      {rect && (
        <div
          className="pointer-events-none fixed rounded-xl ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-950 transition-all duration-300 shadow-2xl"
          style={{
            left: `${Math.max(0, rect.left - 4)}px`,
            top: `${Math.max(0, rect.top - 4)}px`,
            width: `${rect.width + 8}px`,
            height: `${rect.height + 8}px`
          }}
        />
      )}

      {/* Tour Card Tooltip */}
      <section
        ref={dialogRef}
        style={cardStyle}
        className="fixed z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Step Progress Bar */}
        <div className="absolute left-0 top-0 h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#155e75] to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header */}
        <div className="mt-1 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950 dark:text-cyan-300">
              <Compass className="size-4" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Bước {index + 1} / {steps.length}
              </span>
              <h3 className="text-base font-black text-slate-950 dark:text-white leading-tight">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
            aria-label="Đóng hướng dẫn tham quan"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Fallback Notice if Target Element is Missing */}
        {!rect && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Info className="size-3.5 shrink-0" />
            <span>Điểm neo trên giao diện: <code>{step.anchor}</code></span>
          </div>
        )}

        {/* Description */}
        <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
          {step.description}
        </p>

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <SkipForward className="size-3" />
            Bỏ qua
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((prev) => prev - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              <ArrowLeft className="size-3.5" />
              Trước
            </button>

            <button
              ref={nextButtonRef}
              type="button"
              onClick={() => {
                if (isLast) {
                  onComplete()
                } else {
                  setIndex((prev) => prev + 1)
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#155e75] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#164e63] shadow-xs active:translate-y-px transition"
            >
              <span>{isLast ? 'Hoàn tất' : 'Tiếp'}</span>
              {isLast ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
