import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  LoaderCircle
} from 'lucide-react'
import { knowledgeApi, type KnowledgeSummary } from '../model/knowledgeModel'
import type { SopImportPreview, SopImportStep } from '../../sop-import/model/sopImportModel'
import type { SopSubProcess, SopSubStep } from '../../../entities/sop/model/types'
import { useSession } from '../../authentication/model/session'
import { MetroWorkflowPipeline } from './components/metro-pipeline/MetroWorkflowPipeline'
import { UniversalStepDetailCanvas } from './components/UniversalStepDetailCanvas'
import { Feedback, Panel, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

export type PublishedDocument = KnowledgeSummary & {
  content: Record<string, unknown>
}

interface CanonicalSopViewerProps {
  documentId?: string
  workflowId?: string
  onBack?: () => void
}

const nodeKinds: SopImportStep['nodeKind'][] = [
  'start', 'task', 'decision', 'parallel_fork', 'parallel_join', 'subprocess', 'end'
]
const transitionKinds: SopImportPreview['transitions'][number]['kind'][] = [
  'normal', 'conditional', 'return', 'parallel_fork', 'parallel_join', 'subprocess'
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function number(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function documentToPreview(document: PublishedDocument): SopImportPreview {
  const content = document.content
  const rawSteps = Array.isArray(content.steps) ? content.steps : []
  const steps: SopImportStep[] = rawSteps.flatMap((value, index) => {
    if (!isRecord(value)) return []
    const title = text(value.title)
    if (!title) return []
    const rawKind = text(value.nodeKind)
    const nodeKind = nodeKinds.includes(rawKind as SopImportStep['nodeKind'])
      ? rawKind as SopImportStep['nodeKind']
      : 'task'
    const id = text(value.id) || `published-step-${index + 1}`
    return [{
      id,
      stableKey: text(value.stableKey) || id,
      code: text(value.code) || text(value.stepCode) || `STEP-${String(index + 1).padStart(2, '0')}`,
      title,
      objective: text(value.objective),
      description: text(value.description),
      actor: text(value.actor),
      location: text(value.location),
      timing: text(value.timing),
      nodeKind,
      typeCode: text(value.typeCode) || 'N',
      positionX: typeof value.positionX === 'number' ? value.positionX : undefined,
      positionY: typeof value.positionY === 'number' ? value.positionY : undefined,
      sortOrder: number(value.sortOrder, index + 1),
      imageUrl: text(value.imageUrl) || null,
      illustrationPreset: text(value.illustrationPreset) || null,
      media: Array.isArray(value.media) ? value.media : undefined,
      checklist: Array.isArray(value.checklist)
        ? value.checklist.filter((entry): entry is string => typeof entry === 'string')
        : Array.isArray(value.fieldsChecklist)
          ? value.fieldsChecklist.filter((entry): entry is string => typeof entry === 'string')
          : [],
      inputs: Array.isArray(value.inputs)
        ? value.inputs.filter(isRecord).map(entry => ({
            name: text(entry.name),
            description: text(entry.description),
            required: entry.required === true
          }))
        : [],
      outputs: Array.isArray(value.outputs)
        ? value.outputs.filter(isRecord).map(entry => ({
            name: text(entry.name),
            description: text(entry.description),
            required: entry.required === true
          }))
        : [],
      confidence: typeof value.confidence === 'number' ? value.confidence : undefined
    }]
  })

  const rawTransitions = Array.isArray(content.transitions) ? content.transitions : []
  const transitions = rawTransitions.flatMap((value, index) => {
    if (!isRecord(value)) return []
    const fromStepId = text(value.fromStepId)
    const toStepId = text(value.toStepId)
    if (!fromStepId || !toStepId) return []
    const rawKind = text(value.kind)
    const kind = transitionKinds.includes(rawKind as typeof transitionKinds[number])
      ? rawKind as typeof transitionKinds[number]
      : 'normal'
    return [{
      id: text(value.id) || `published-transition-${index + 1}`,
      fromStepId,
      toStepId,
      kind,
      condition: text(value.condition),
      branchLabel: text(value.branchLabel),
      sortOrder: number(value.sortOrder, index + 1)
    }]
  })

  const moduleIds = Array.isArray(content.moduleIds)
    ? content.moduleIds.filter((value): value is string => typeof value === 'string')
    : document.moduleIds

  return {
    code: document.code,
    title: document.title,
    category: text(content.category),
    moduleIds,
    primaryModuleId: text(content.primaryModuleId) || moduleIds[0] || '',
    definition: text(content.definition),
    purpose: text(content.purpose),
    scope: text(content.scope),
    changeLog: text(content.changeLog),
    steps: steps.sort((a, b) => a.sortOrder - b.sortOrder),
    transitions
  }
}

export function CanonicalSopViewer({ documentId, workflowId, onBack }: CanonicalSopViewerProps) {
  const navigate = useNavigate()
  const session = useSession()
  const [searchParams, setSearchParams] = useSearchParams()

  const targetStepParam = searchParams.get('step')
  const targetSopParam = searchParams.get('sop')

  const [document, setDocument] = useState<PublishedDocument | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      (typeof window !== 'undefined' && window.document.documentElement.classList.contains('dark')) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('employee_lifecycle_theme') === 'dark')
    )
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleClassChange = () => {
      setIsDarkMode(window.document.documentElement.classList.contains('dark'))
    }
    const observer = new MutationObserver(handleClassChange)
    observer.observe(window.document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

  // Load document by documentId, or look up by workflowId
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    const loadData = async () => {
      try {
        let resolvedDocId = documentId

        // If no documentId but workflowId is provided, look up published document
        if (!resolvedDocId && workflowId) {
          const listResponse = await knowledgeApi.catalogDocuments(
            { type: 'procedure', pageSize: 100 },
            controller.signal
          )
          const matched = listResponse.data.find(d => {
            if (targetSopParam && (d.code.toLowerCase() === targetSopParam.toLowerCase() || d.id === targetSopParam)) {
              return true
            }
            return d.workflowId === workflowId
          }) || (targetSopParam ? undefined : listResponse.data.find(d => d.workflowId === workflowId))

          if (matched) {
            resolvedDocId = matched.id
          } else {
            throw new Error(`Không tìm thấy SOP đã công bố cho mã quy trình "${workflowId}".`)
          }
        }

        if (!resolvedDocId) {
          throw new Error('Thiếu định danh tài liệu SOP cần mở.')
        }

        const docResponse = await knowledgeApi.document(resolvedDocId, controller.signal)
        if (!controller.signal.aborted) {
          setDocument(docResponse.data)
        }
      } catch (reason) {
        if (!controller.signal.aborted) {
          setDocument(null)
          setError(reason instanceof Error ? reason.message : 'Không tải được SOP đã công bố.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadData()
    return () => controller.abort()
  }, [documentId, workflowId, targetSopParam])

  const preview = useMemo(() => document ? documentToPreview(document) : null, [document])

  // Build canonical SopSubProcess with strictly real data
  const sopProcess = useMemo<SopSubProcess | null>(() => {
    if (!preview || !document) return null

    const content = document.content
    const rawRules = Array.isArray(content.rules)
      ? content.rules.filter((r): r is string => typeof r === 'string')
      : []

    // Map transitions to identify branch conditions
    const transitionsByFrom = new Map<string, typeof preview.transitions[number]>()
    preview.transitions.forEach(t => {
      const fromId = t.fromStepId
      if (fromId && (t.kind === 'conditional' || t.condition || t.branchLabel)) {
        transitionsByFrom.set(fromId, t)
      }
    })

    const steps: SopSubStep[] = preview.steps.map((s, idx) => {
      const stepTrans = (s.id ? transitionsByFrom.get(s.id) : undefined) || (s.code ? transitionsByFrom.get(s.code) : undefined)
      return {
        stepCode: s.code || `B${idx + 1}`,
        sourceCode: s.id,
        title: s.title,
        actor: s.actor || '',
        location: s.location || '',
        timing: s.timing || '',
        typeCode: (s.typeCode as 'N' | 'A' | 'C' | 'M') || 'N',
        description: s.description || '',
        fieldsChecklist: s.checklist || [],
        inputs: s.inputs && s.inputs.length > 0 ? s.inputs : [],
        outputs: s.outputs && s.outputs.length > 0 ? s.outputs : [],
        condition: stepTrans?.condition || '',
        branchLabel: stepTrans?.branchLabel || '',
        imageUrl: s.imageUrl || null,
        media: s.media?.map((media, mediaIndex) => ({
          id: media.id,
          sourceMediaId: media.sourceMediaId,
          storageKey: media.storageKey,
          url: media.url,
          caption: media.caption,
          role: media.role,
          sourcePage: media.sourcePage,
          sourceSubPath: media.sourceSubPath,
          sortOrder: media.sortOrder ?? mediaIndex + 1
        }))
      }
    })

    // Process-level real inputs and outputs (deduplicated from step inputs/outputs if not explicitly given)
    const procInputs: string[] = Array.isArray(content.inputs)
      ? content.inputs.filter((i): i is string => typeof i === 'string')
      : Array.from(new Set(steps.flatMap(s => (Array.isArray(s.inputs) ? s.inputs.map(i => typeof i === 'string' ? i : i.name) : []))))

    const procOutputs: string[] = Array.isArray(content.outputs)
      ? content.outputs.filter((o): o is string => typeof o === 'string')
      : Array.from(new Set(steps.flatMap(s => (Array.isArray(s.outputs) ? s.outputs.map(o => typeof o === 'string' ? o : o.name) : []))))

    const relatedDocuments = Array.isArray(content.relatedDocuments)
      ? content.relatedDocuments.filter((d): d is string => typeof d === 'string')
      : []

    return {
      sopCode: preview.code,
      sopTitle: preview.title,
      sopCategory: preview.category || 'Quy trình đã công bố',
      description: preview.purpose || preview.definition || '',
      steps,
      inputs: procInputs,
      outputs: procOutputs,
      rules: rawRules,
      documentId: document.id,
      version: document.version ?? 1,
      moduleIds: preview.moduleIds,
      primaryModuleId: preview.primaryModuleId,
      relatedDocuments,
      transitions: preview.transitions.map(t => ({
        id: t.id,
        fromStepId: t.fromStepId,
        toStepId: t.toStepId,
        kind: t.kind,
        condition: t.condition,
        branchLabel: t.branchLabel,
        sortOrder: t.sortOrder
      }))
    }
  }, [preview, document])

  // Selected Step Index resolution from ?step=
  const initialStepIdx = useMemo(() => {
    if (!sopProcess || !sopProcess.steps.length || !targetStepParam) return 0
    const num = Number(targetStepParam)
    if (!isNaN(num) && num >= 1 && num <= sopProcess.steps.length) {
      return num - 1
    }
    const foundIdx = sopProcess.steps.findIndex(
      s => s.stepCode.toLowerCase() === targetStepParam.toLowerCase() || s.sourceCode === targetStepParam
    )
    return foundIdx !== -1 ? foundIdx : 0
  }, [sopProcess, targetStepParam])

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(initialStepIdx)

  useEffect(() => {
    setSelectedStepIdx(initialStepIdx)
  }, [initialStepIdx, document?.id])

  const handleSelectStep = useCallback((idx: number) => {
    setSelectedStepIdx(idx)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('step', String(idx + 1))
      return next
    })
  }, [setSearchParams])

  // Back navigation handler
  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/employee-lifecycle?tab=process-library&cluster=core')
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">
        <span className="inline-flex items-center gap-2">
          <LoaderCircle className="size-5 animate-spin text-[#155e75]" />
          Đang tải SOP đã công bố…
        </span>
      </main>
    )
  }

  if (error || !document || !sopProcess) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <Feedback type="error">
            {error || 'Không tìm thấy tài liệu SOP hoặc bạn không có quyền truy cập.'}
          </Feedback>
          <button
            type="button"
            onClick={handleBack}
            className={secondaryButtonClass}
          >
            <ArrowLeft className="size-4" />
            Quay lại Thư viện quy trình
          </button>
        </section>
      </main>
    )
  }

  const currentStep = sopProcess.steps[selectedStepIdx] || sopProcess.steps[0]
  const moduleNames = document.moduleIds
    .map(id => session.modules.find(m => m.id === id)?.title ?? id)
    .join(', ')

  const purpose = text(document.content.purpose)
  const scope = text(document.content.scope)

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/70 text-slate-800'}`}>
      {/* 1. UNIFIED HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-xs backdrop-blur dark:border-slate-800/90 dark:bg-slate-900/95">
        <div className="mx-auto flex w-[94%] max-w-[1920px] items-center justify-between gap-4 px-2 py-3 sm:px-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className={secondaryButtonClass}
              title="Quay lại Thư viện quy trình"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Quay lại thư viện</span>
            </button>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#155e75] text-white">
              <BookOpen className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#155e75] dark:text-cyan-300">
                  {document.code}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                  <CheckCircle2 className="size-3" />
                  Đã công bố · v{document.version ?? 1}
                </span>
                {moduleNames && (
                  <span className="hidden md:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Phân hệ: {moduleNames}
                  </span>
                )}
              </div>
              <h1 className="truncate text-sm font-black sm:text-base mt-0.5">
                {document.title}
              </h1>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
            {sopProcess.steps.length} bước quy trình
          </span>
        </div>
      </header>

      {/* MAIN CONTENT: PROCESS PIPELINE & STEP DETAILS */}
      <main className="mx-auto w-[94%] max-w-[1920px] space-y-5 px-2 py-5 sm:px-4">
        {/* Tuyến quy trình Metro */}
        <MetroWorkflowPipeline
          process={sopProcess}
          selectedStepIdx={selectedStepIdx}
          onSelectStep={handleSelectStep}
          isDarkMode={isDarkMode}
        />

        {/* Chi tiết bước được chọn */}
        {currentStep && (
          <UniversalStepDetailCanvas
            step={currentStep}
            stepIdx={selectedStepIdx}
            totalSteps={sopProcess.steps.length}
            onPreviousStep={() => handleSelectStep(Math.max(0, selectedStepIdx - 1))}
            onNextStep={() => handleSelectStep(Math.min(sopProcess.steps.length - 1, selectedStepIdx + 1))}
            isDarkMode={isDarkMode}
            process={sopProcess}
          />
        )}

        {/* Mục đích & Phạm vi (Nếu có trong SOP) */}
        {(purpose || scope) && (
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            {purpose && (
              <Panel title="Mục đích ban hành" collapsible defaultExpanded={true}>
                <p className="p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {purpose}
                </p>
              </Panel>
            )}
            {scope && (
              <Panel title="Phạm vi áp dụng" collapsible defaultExpanded={true}>
                <p className="p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {scope}
                </p>
              </Panel>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
