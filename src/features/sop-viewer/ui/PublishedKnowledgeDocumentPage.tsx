import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, CheckCircle2, LoaderCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  knowledgeApi,
  type KnowledgeSummary
} from '../model/knowledgeModel'
import type {
  SopImportPreview,
  SopImportStep
} from '../../sop-import/model/sopImportModel'
const SopFlowchartWorkspace = lazy(() => import('../../document-conversion/ui/SopFlowchartWorkspace').then(module => ({ default: module.SopFlowchartWorkspace })))
import {
  Feedback,
  Panel,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'

type PublishedDocument = KnowledgeSummary & { content: Record<string, unknown> }

const nodeKinds: SopImportStep['nodeKind'][] = [
  'start', 'task', 'decision', 'parallel_fork', 'parallel_join', 'subprocess', 'end'
]
const transitionKinds: SopImportPreview['transitions'][number]['kind'][] = [
  'normal', 'conditional', 'return', 'parallel_fork', 'parallel_join', 'subprocess'
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function number(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function toPreview(document: PublishedDocument): SopImportPreview {
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
      checklist: Array.isArray(value.checklist) ? value.checklist.filter((entry): entry is string => typeof entry === 'string') : [],
      inputs: Array.isArray(value.inputs) ? value.inputs.filter(isRecord).map(entry => ({ name: text(entry.name), description: text(entry.description), required: entry.required === true })) : [],
      outputs: Array.isArray(value.outputs) ? value.outputs.filter(isRecord).map(entry => ({ name: text(entry.name), description: text(entry.description), required: entry.required === true })) : [],
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

export function PublishedKnowledgeDocumentPage() {
  const navigate = useNavigate()
  const { documentId } = useParams<{ documentId: string }>()
  const [document, setDocument] = useState<PublishedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!documentId) {
      setError('Thiếu mã tài liệu cần mở.')
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    void knowledgeApi.document(documentId, controller.signal)
      .then(response => {
        if (!controller.signal.aborted) setDocument(response.data)
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setDocument(null)
          setError(reason instanceof Error ? reason.message : 'Không tải được SOP đã công bố.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [documentId])

  const preview = useMemo(() => document ? toPreview(document) : null, [document])

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300"><span className="inline-flex items-center gap-2"><LoaderCircle className="size-5 animate-spin text-[#155e75]" />Đang tải SOP đã công bố…</span></main>
  }

  if (error || !document || !preview) {
    return <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"><section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Feedback type="error">{error || 'Không tìm thấy tài liệu hoặc tài liệu không còn trong phạm vi được xem.'}</Feedback><button type="button" onClick={() => navigate('/employee-lifecycle?tab=process-library&cluster=core')} className={secondaryButtonClass}><ArrowLeft className="size-4" />Quay lại thư viện SOP</button></section></main>
  }

  const purpose = text(document.content.purpose)
  const scope = text(document.content.scope)

  return <div className="min-h-screen bg-slate-50/70 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex w-[94%] max-w-[1600px] items-center gap-3 px-2 py-3 sm:px-4">
        <button type="button" onClick={() => navigate('/employee-lifecycle?tab=process-library&cluster=core')} className={secondaryButtonClass}><ArrowLeft className="size-4" /><span className="hidden sm:inline">Quay lại thư viện</span></button>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#155e75] text-white"><BookOpen className="size-4" /></span>
        <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#155e75] dark:text-cyan-300">SOP đã công bố</p><h1 className="truncate text-sm font-black sm:text-base">{document.title}</h1></div>
      </div>
    </header>

    <main className="mx-auto w-[94%] max-w-[1600px] space-y-5 px-2 py-6 sm:px-4 lg:px-6">
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/25"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-white px-2 py-1 font-mono text-xs font-black text-[#155e75] dark:bg-slate-900 dark:text-cyan-300">{document.code}</span><span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"><CheckCircle2 className="size-3.5" />Đã công bố · v{document.version ?? 1}</span></div><h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{document.title}</h2>{document.summary && <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{document.summary}</p>}</div><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">Có {preview.steps.length} bước</span></div></section>

      <Panel title="Lưu đồ quy trình" description="Lưu đồ được dựng từ các bước của phiên bản SOP đã công bố."><Suspense fallback={<p className="p-4" role="status">Đang mở Canvas…</p>}><SopFlowchartWorkspace key={document.id} importId="" preview={preview} editable={false} onPreview={() => {}} onSave={async () => {}} saving={false} /></Suspense></Panel>

      {(purpose || scope) && <div className="grid gap-4 md:grid-cols-2">{purpose && <Panel title="Mục đích"><p className="p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{purpose}</p></Panel>}{scope && <Panel title="Phạm vi áp dụng"><p className="p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{scope}</p></Panel>}</div>}

      <Panel title={`Các bước nghiệp vụ (${preview.steps.length})`} description="Nội dung đã được Reviewer và Approver xác nhận khi công bố."><div className="divide-y divide-slate-100 dark:divide-slate-800">{preview.steps.map((step, index) => <article key={step.id} className="grid gap-3 p-4 md:grid-cols-[48px_minmax(0,1fr)_220px] md:items-start"><span className="grid size-9 place-items-center rounded-full bg-[#155e75] text-sm font-black text-white">{index + 1}</span><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[11px] font-black text-[#155e75] dark:text-cyan-300">{step.code}</span><h3 className="text-sm font-black text-slate-900 dark:text-white">{step.title}</h3></div>{step.description && <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>}</div>{step.actor && <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300"><span className="block font-bold uppercase tracking-wide text-slate-400">Người thực hiện</span><span className="mt-1 block font-semibold">{step.actor}</span></div>}</article>)}</div></Panel>
    </main>
  </div>
}
