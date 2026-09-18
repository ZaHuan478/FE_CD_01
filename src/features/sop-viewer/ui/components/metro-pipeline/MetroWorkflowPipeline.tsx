import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  CheckCircle2,
  ArrowRight,
  Inbox,
  HelpCircle,
  Filter,
  Scan,
  Layers
} from 'lucide-react'
import type { SopSubProcess, SopSubStep } from '../../../../../entities/sop/model/types'
import { MetroStepCard } from './MetroStepCard'
import { useLanguage } from '../../../../../shared/lib/i18n/LanguageContext'

interface MetroWorkflowPipelineProps {
  process: SopSubProcess
  selectedStepIdx: number
  onSelectStep: (idx: number) => void
  isDarkMode: boolean
  actionSlot?: React.ReactNode
}

interface ProcessStage {
  id: string
  stageNumber: number
  title: string
  stepIndices: number[]
  startStepIdx: number
  endStepIdx: number
}

// Compute stages for long processes based on actual data
function computeProcessStages(steps: SopSubStep[], language: string): ProcessStage[] {
  if (steps.length <= 3) {
    return [
      {
        id: 'stage-all',
        stageNumber: 1,
        title: language === 'vi' ? 'Toàn bộ tiến trình' : 'Full Pipeline',
        stepIndices: steps.map((_, idx) => idx),
        startStepIdx: 0,
        endStepIdx: steps.length - 1
      }
    ]
  }

  // If 4 or 5 steps: 2 stages
  if (steps.length <= 5) {
    const split = Math.ceil(steps.length / 2)
    const stage1Steps = steps.slice(0, split)
    const stage2Steps = steps.slice(split)

    const getStage1Title = () => {
      const texts = stage1Steps.map(s => (s.title + ' ' + (s.description || '')).toLowerCase()).join(' ')
      if (/tiếp nhận|khai báo|đăng ký|chuẩn bị|tạo|nhập/u.test(texts)) {
        return language === 'vi' ? 'Khởi tạo & Tiếp nhận' : 'Initiation & Intake'
      }
      return language === 'vi' ? `Chặng 1 (Bước 1 - ${split})` : `Stage 1 (Step 1 - ${split})`
    }

    const getStage2Title = () => {
      const texts = stage2Steps.map(s => (s.title + ' ' + (s.description || '')).toLowerCase()).join(' ')
      if (/duyệt|phê duyệt|xác nhận|chốt|bàn giao|hoàn tất/u.test(texts)) {
        return language === 'vi' ? 'Phê duyệt & Bàn giao' : 'Approval & Handover'
      }
      if (/kiểm tra|xử lý|thẩm định|đối chiếu|rà soát/u.test(texts)) {
        return language === 'vi' ? 'Xử lý & Thẩm định' : 'Processing & Verification'
      }
      return language === 'vi' ? `Chặng 2 (Bước ${split + 1} - ${steps.length})` : `Stage 2 (Step ${split + 1} - ${steps.length})`
    }

    return [
      {
        id: 'stage-1',
        stageNumber: 1,
        title: getStage1Title(),
        stepIndices: Array.from({ length: split }, (_, i) => i),
        startStepIdx: 0,
        endStepIdx: split - 1
      },
      {
        id: 'stage-2',
        stageNumber: 2,
        title: getStage2Title(),
        stepIndices: Array.from({ length: steps.length - split }, (_, i) => i + split),
        startStepIdx: split,
        endStepIdx: steps.length - 1
      }
    ]
  }

  // If 6 or more steps: 3 stages
  const s1Count = Math.max(2, Math.floor(steps.length / 3))
  const s2Count = Math.floor((steps.length - s1Count) / 2)
  const s3Count = steps.length - s1Count - s2Count

  const s1Steps = steps.slice(0, s1Count)
  const s2Steps = steps.slice(s1Count, s1Count + s2Count)
  const s3Steps = steps.slice(s1Count + s2Count)

  const s1Title = (() => {
    const texts = s1Steps.map(s => (s.title + ' ' + (s.description || '')).toLowerCase()).join(' ')
    if (/tiếp nhận|khai báo|đăng ký|chuẩn bị|tạo|nhập/u.test(texts)) {
      return language === 'vi' ? 'Khởi tạo & Tiếp nhận' : 'Initiation & Intake'
    }
    return language === 'vi' ? `Khởi tạo (Bước 1 - ${s1Count})` : `Initiation (Step 1 - ${s1Count})`
  })()

  const s2Title = (() => {
    const texts = s2Steps.map(s => (s.title + ' ' + (s.description || '')).toLowerCase()).join(' ')
    if (/kiểm tra|xử lý|thẩm định|đối chiếu|rà soát|tính/u.test(texts)) {
      return language === 'vi' ? 'Xử lý & Thẩm định' : 'Processing & Verification'
    }
    return language === 'vi' ? `Xử lý (Bước ${s1Count + 1} - ${s1Count + s2Count})` : `Processing (Step ${s1Count + 1} - ${s1Count + s2Count})`
  })()

  const s3Title = (() => {
    const texts = s3Steps.map(s => (s.title + ' ' + (s.description || '')).toLowerCase()).join(' ')
    if (/duyệt|phê duyệt|xác nhận|chốt|bàn giao|hoàn tất|ký/u.test(texts)) {
      return language === 'vi' ? 'Phê duyệt & Bàn giao' : 'Approval & Handover'
    }
    return language === 'vi' ? `Hoàn tất (Bước ${s1Count + s2Count + 1} - ${steps.length})` : `Completion (Step ${s1Count + s2Count + 1} - ${steps.length})`
  })()

  return [
    {
      id: 'stage-1',
      stageNumber: 1,
      title: s1Title,
      stepIndices: Array.from({ length: s1Count }, (_, i) => i),
      startStepIdx: 0,
      endStepIdx: s1Count - 1
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      title: s2Title,
      stepIndices: Array.from({ length: s2Count }, (_, i) => i + s1Count),
      startStepIdx: s1Count,
      endStepIdx: s1Count + s2Count - 1
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      title: s3Title,
      stepIndices: Array.from({ length: s3Count }, (_, i) => i + s1Count + s2Count),
      startStepIdx: s1Count + s2Count,
      endStepIdx: steps.length - 1
    }
  ]
}

export const MetroWorkflowPipeline: React.FC<MetroWorkflowPipelineProps> = ({
  process,
  selectedStepIdx,
  onSelectStep,
  isDarkMode,
  actionSlot
}) => {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [selectedActor, setSelectedActor] = useState<string>('ALL')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const steps = useMemo<SopSubStep[]>(() => process.steps || [], [process.steps])
  const inputs = useMemo<string[]>(() => process.inputs || [], [process.inputs])
  const outputs = useMemo<string[]>(() => process.outputs || [], [process.outputs])

  // Extract distinct actors from steps for filtering
  const distinctActors = useMemo(() => {
    const set = new Set<string>()
    steps.forEach((s: SopSubStep) => {
      if (s.actor && s.actor.trim()) {
        set.add(s.actor.trim())
      }
    })
    return Array.from(set)
  }, [steps])

  // Compute stages for long workflows
  const stages = useMemo(() => computeProcessStages(steps, language), [steps, language])

  // Find which stage contains the selected step
  const activeStageId = useMemo(() => {
    const found = stages.find(st => st.stepIndices.includes(selectedStepIdx))
    return found ? found.id : stages[0]?.id
  }, [stages, selectedStepIdx])

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      void containerRef.current.requestFullscreen()
    } else {
      void document.exitFullscreen()
    }
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.4))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const handleResetZoom = () => setZoom(1)

  // Fit to screen calculation
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return
    const containerWidth = containerRef.current.clientWidth - 48
    const contentWidth = contentRef.current.scrollWidth
    if (contentWidth <= 0 || containerWidth <= 0) return
    const targetZoom = Math.min(Math.max(containerWidth / contentWidth, 0.4), 1.2)
    setZoom(Math.round(targetZoom * 100) / 100)
  }, [])

  // Empty state
  if (steps.length === 0) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center shadow-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <p className="text-xs font-semibold">
          {language === 'vi'
            ? 'Quy trình này hiện chưa có các bước SOP chi tiết được phân rã.'
            : 'No detailed SOP steps available for this process yet.'}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border shadow-xs transition-colors duration-200 overflow-hidden flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen bg-white dark:bg-slate-950'
          : 'min-h-[380px]'
      } ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* 1. TOP TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 p-3.5 sm:px-5 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
        {/* Left: Process Title & Step Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shrink-0">
            <GitBranch className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white truncate">
                {language === 'vi' ? 'Sơ đồ Tuyến Metro Quy trình' : 'Metro Process Pipeline'}
              </h3>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/50 shrink-0">
                {steps.length} {language === 'vi' ? 'bước thực hiện' : 'steps'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {language === 'vi'
                ? 'Nhấp vào từng bước để xem chi tiết nghiệp vụ, checklist và điều kiện chuyển tiếp bên dưới.'
                : 'Click any step to inspect full business attributes, checklist, and conditions below.'}
            </p>
          </div>
        </div>

        {/* Right: Controls & Filters & ActionSlot */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Actor Filter Dropdown */}
          {distinctActors.length > 1 && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedActor}
                onChange={(e) => setSelectedActor(e.target.value)}
                className="bg-transparent border-0 text-xs font-semibold focus:outline-hidden cursor-pointer"
                title="Lọc theo người thực hiện"
              >
                <option value="ALL">Tất cả vai trò ({distinctActors.length})</option>
                {distinctActors.map((actor: string) => (
                  <option key={actor} value={actor}>
                    {actor}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Zoom Controls + Fit View Button */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={fitToScreen}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Căn chỉnh vừa chiều rộng màn hình"
            >
              <Scan className="w-3.5 h-3.5 text-orange-500" />
              <span>Vừa màn hình</span>
            </button>

            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 cursor-pointer"
              title="Đặt lại 100%"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>

          {actionSlot}
        </div>
      </div>

      {/* 2. STAGE PROGRESSION STRIP (CHẶNG CHÍNH - QUY TRÌNH DÀI) */}
      {stages.length > 1 && (
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-300 shrink-0 pr-2 border-r border-slate-200 dark:border-slate-800">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Các chặng chính:' : 'Main Stages:'}</span>
          </div>

          <div className="flex items-center gap-2">
            {stages.map((stage, idx) => {
              const isActive = activeStageId === stage.id
              return (
                <React.Fragment key={stage.id}>
                  <button
                    type="button"
                    onClick={() => onSelectStep(stage.startStepIdx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                      isActive
                        ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                        : isDarkMode
                          ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <span
                      className={`size-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive ? 'bg-white text-[#1f5f86]' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {stage.stageNumber}
                    </span>
                    <span>{stage.title}</span>
                    <span className={`text-[11px] font-semibold opacity-75`}>
                      ({stage.stepIndices.length} bước)
                    </span>
                  </button>

                  {idx < stages.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. MAIN METRO TRACK */}
      <div className="relative flex-1 flex flex-col justify-center overflow-x-auto p-4 sm:p-6 no-scrollbar bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <div
          ref={contentRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center left',
            transition: 'transform 0.15s ease-out'
          }}
          className="inline-flex flex-col gap-4 min-w-max my-auto py-2"
        >
          {/* TOP SATELLITE INPUTS ROW */}
          {inputs.length > 0 && (
            <div className="flex items-center gap-3 pl-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Inbox className="w-4 h-4 text-orange-500" />
                <span className="uppercase text-xs tracking-wider font-extrabold">
                  {language === 'vi' ? 'Dữ liệu đầu vào:' : 'Inputs:'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {inputs.slice(0, 3).map((inp: string, idx: number) => (
                  <div
                    key={`${inp}-${idx}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800/80 bg-orange-50/90 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 text-xs font-semibold shadow-2xs animate-fadeIn"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span>{inp}</span>
                    <span className="text-xs opacity-60 ml-0.5">↴</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAIN HORIZONTAL TRACK: RENDERED BY STAGES */}
          <div className="relative flex items-center py-2 gap-3 sm:gap-4">
            {stages.map((stage, stageIdx) => {
              const isStageActive = activeStageId === stage.id

              return (
                <React.Fragment key={stage.id}>
                  {/* Stage Container Grouping */}
                  <div
                    className={`relative flex flex-col rounded-3xl border transition-all p-3 sm:p-4 ${
                      stages.length > 1
                        ? isStageActive
                          ? isDarkMode
                            ? 'bg-slate-900/40 border-orange-500/40 ring-1 ring-orange-500/20'
                            : 'bg-orange-50/20 border-orange-200 ring-1 ring-orange-200/50'
                          : isDarkMode
                            ? 'bg-slate-900/20 border-slate-800/80'
                            : 'bg-slate-50/40 border-slate-200/80'
                        : 'border-transparent p-0'
                    }`}
                  >
                    {/* Stage Header Label (Shown when multiple stages exist) */}
                    {stages.length > 1 && (
                      <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-5 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                              isStageActive
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {stage.stageNumber}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            {stage.title}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {stage.stepIndices.length} {language === 'vi' ? 'bước' : 'steps'}
                        </span>
                      </div>
                    )}

                    {/* Step Cards within this Stage */}
                    <div className="relative flex items-center">
                      {stage.stepIndices.map((stepIdxInFull, idxInStage) => {
                        const step = steps[stepIdxInFull]
                        if (!step) return null
                        const isSelected = selectedStepIdx === stepIdxInFull
                        const isHighlighted =
                          selectedActor === 'ALL' ||
                          !step.actor ||
                          step.actor.trim().toLowerCase() === selectedActor.trim().toLowerCase()

                        return (
                          <React.Fragment key={`${step.stepCode || stepIdxInFull}-${stepIdxInFull}`}>
                            {/* Step Card with Layer 1 content */}
                            <div className="relative z-10 shrink-0">
                              <MetroStepCard
                                step={step}
                                stepIdx={stepIdxInFull}
                                isSelected={isSelected}
                                isHighlighted={isHighlighted}
                                onSelect={() => onSelectStep(stepIdxInFull)}
                                isDarkMode={isDarkMode}
                              />
                            </div>

                            {/* Connecting Track Segment within same stage */}
                            {idxInStage < stage.stepIndices.length - 1 && (
                              <div className="relative z-10 shrink-0 flex items-center justify-center w-10 sm:w-12">
                                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 opacity-80 pointer-events-none -z-0 rounded-full" />
                                <div
                                  className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/30'
                                      : 'bg-white dark:bg-slate-900 text-orange-500 border-orange-200 dark:border-slate-700 shadow-2xs'
                                  }`}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>

                  {/* Connecting Milestone between Stages */}
                  {stageIdx < stages.length - 1 && (
                    <div className="relative z-10 shrink-0 flex flex-col items-center justify-center px-1">
                      <div className="flex items-center justify-center w-12 sm:w-14">
                        <div className="absolute w-12 sm:w-14 h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-sky-500 opacity-80 pointer-events-none rounded-full" />
                        <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5 whitespace-nowrap">
                        {language === 'vi' ? 'Chuyển chặng' : 'Next Stage'}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              )
            })}

            {/* Final Handover Output Node */}
            {outputs.length > 0 && (
              <div className="relative z-10 shrink-0 flex items-center">
                <div className="relative shrink-0 flex items-center justify-center w-10 sm:w-12">
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 opacity-80 pointer-events-none -z-0 rounded-full" />
                  <div className="relative z-10 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Output Card */}
                <div
                  className={`w-[190px] sm:w-[210px] rounded-2xl border p-3 space-y-1.5 transition-all shadow-2xs shrink-0 ${
                    isDarkMode
                      ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{language === 'vi' ? 'Kết quả bàn giao' : 'Outputs'}</span>
                  </div>
                  <p className="text-xs font-bold leading-snug line-clamp-2">
                    {outputs[0]}
                  </p>
                  {outputs.length > 1 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                      +{outputs.length - 1} kết quả khác
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM LEGEND */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-3 sm:px-5 flex items-center justify-between flex-wrap gap-2.5 text-xs bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span>Tiến trình nghiệp vụ</span>
          </span>

          {stages.length > 1 && (
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-md bg-[#1f5f86] shrink-0" />
              <span>Phân chia các chặng chính</span>
            </span>
          )}

          {inputs.length > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-orange-400 shrink-0" />
              <span>Dữ liệu đầu vào (Inputs)</span>
            </span>
          )}

          {outputs.length > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Kết quả bàn giao (Outputs)</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>Nhấp vào thẻ bất kỳ để xem chi tiết đầy đủ bên dưới</span>
        </div>
      </div>
    </div>
  )
}
