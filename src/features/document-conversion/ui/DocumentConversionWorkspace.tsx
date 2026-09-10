import { lazy, Suspense, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ChevronLeft, ChevronRight,
  FileSearch, FileText, GitBranch, LoaderCircle, Plus, Search, ScanText, Trash2, X
} from 'lucide-react'
import { useSession } from '../../authentication/model/session'
import { useSopImportModules } from '../../sop-import/model/sopImportModel'
import {
  sopImportApi, type SopImportItem, type SopImportPreview, type SopImportStep
} from '../model/documentConversionModel'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'
import { Select } from '../../../shared/ui/atoms/Select'
import {
  Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass, secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'
import { useToast } from '../../../shared/ui/toast'
import {
  useDocumentConversionDocuments, type UserDocumentItem
} from '../model/useDocumentConversionDocuments'

const SourceDocumentViewer = lazy(() => import('../../sop-import/ui/SourceDocumentViewer').then(module => ({ default: module.SourceDocumentViewer })))
const SopFlowchartWorkspace = lazy(() => import('./SopFlowchartWorkspace').then(module => ({ default: module.SopFlowchartWorkspace })))
const PAGE_SIZE = 8
type ConversionView = 'draft' | 'flow' | 'source' | 'extracted'

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(value))
}

function titleFromFile(value: string) {
  return value.replace(/\.(docx|pdf)$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalizeFlow(preview: SopImportPreview): SopImportPreview {
  const steps = preview.steps.map((step, index) => ({ ...step, sortOrder: index + 1 }))
  const stepIds = new Set(steps.map(step => step.id))
  return {
    ...preview,
    steps,
    transitions: preview.transitions
      .filter(transition => transition.fromStepId && transition.toStepId && stepIds.has(transition.fromStepId) && stepIds.has(transition.toStepId))
      .map((transition, index) => ({ ...transition, sortOrder: index + 1 }))
  }
}

function appendStep(preview: SopImportPreview, step: SopImportStep): SopImportPreview {
  const previous = preview.steps.at(-1)
  return normalizeFlow({
    ...preview,
    steps: [...preview.steps, step],
    transitions: previous ? [...preview.transitions, {
      id: `conversion-transition-${Date.now()}`,
      fromStepId: previous.id,
      toStepId: step.id,
      kind: 'normal',
      sortOrder: preview.transitions.length + 1
    }] : preview.transitions
  })
}

function createStep(index: number, patch: Partial<SopImportStep> = {}): SopImportStep {
  const id = `conversion-step-${Date.now()}-${index}`
  return {
    id,
    stableKey: id,
    code: `STEP-${String(index + 1).padStart(2, '0')}`,
    title: 'Bước mới',
    description: '',
    actor: '',
    location: '',
    timing: '',
    nodeKind: 'task',
    typeCode: 'N',
    sortOrder: index + 1,
    checklist: [],
    inputs: [],
    outputs: [],
    ...patch
  }
}

export function DocumentConversionWorkspace() {
  const toast = useToast()
  const session = useSession()
  const moduleState = useSopImportModules()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState<'all' | 'docx' | 'pdf'>('all')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [active, setActive] = useState<SopImportItem | null>(null)
  const [preview, setPreview] = useState<SopImportPreview | null>(null)
  const [view, setView] = useState<ConversionView>('draft')
  const [busy, setBusy] = useState<'open' | 'create' | 'save' | 'complete' | 'delete' | null>(null)
  const [conversionError, setConversionError] = useState('')
  const { items, total, totalPages, loading, error, refresh } = useDocumentConversionDocuments({
    search, format, page, pageSize: PAGE_SIZE
  })
  const selected = useMemo(() => items.find(item => item.id === selectedId) ?? null, [items, selectedId])
  const department = session.organization?.department?.trim() ?? ''
  const jobTitle = session.organization?.jobTitle?.trim() ?? ''
  const defaultAudience = department && jobTitle
    ? 'department_job_title'
    : department ? 'department' : jobTitle ? 'job_title' : 'personal'
  const editable = Boolean(active && active.createdBy === session.accountId && active.status === 'needs_review')

  useEffect(() => {
    if (selectedId && !items.some(item => item.id === selectedId)) setSelectedId(null)
  }, [items, selectedId])

  useEffect(() => {
    const controller = new AbortController()
    setConversionError('')
    setActive(null)
    setPreview(null)
    if (!selected?.sourceImportJobId) return () => controller.abort()
    setBusy('open')
    void sopImportApi.get(selected.sourceImportJobId, controller.signal)
      .then(result => { setActive(result.data); setPreview(result.data.preview); setView('flow') })
      .catch(reason => {
        if (!controller.signal.aborted) setConversionError(getErrorMessage(reason, 'Không mở được hồ sơ chuyển hóa đã liên kết'))
      })
      .finally(() => { if (!controller.signal.aborted) setBusy(null) })
    return () => controller.abort()
  }, [selected])

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const startConversion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected) return
    const fields = new FormData(event.currentTarget)
    setBusy('create')
    setConversionError('')
    try {
      const result = await sopImportApi.createFromDocument({
        documentId: selected.id,
        code: String(fields.get('code') ?? '').trim(),
        title: String(fields.get('title') ?? '').trim(),
        primaryModuleId: String(fields.get('primaryModuleId') ?? '').trim(),
        category: String(fields.get('category') ?? '').trim() || undefined,
        audienceMode: String(fields.get('audienceMode') ?? defaultAudience) as 'personal' | 'department' | 'job_title' | 'department_job_title' | 'module'
      })
      setActive(result.data)
      setPreview(result.data.preview)
      setView('flow')
      refresh()
      toast.success('Đã trích xuất tài liệu và tạo lưu đồ Mermaid để hiệu chỉnh.')
    } catch (reason) {
      const message = getErrorMessage(reason, 'Không thể chuyển hóa tài liệu')
      setConversionError(message)
      toast.error(message)
    } finally {
      setBusy(null)
    }
  }

  const save = async () => {
    if (!active || !preview) return
    setBusy('save')
    try {
      const result = await sopImportApi.update(active.id, normalizeFlow(preview))
      setActive(result.data)
      setPreview(result.data.preview)
      toast.success('Đã lưu bản hiệu chỉnh SOP.')
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không lưu được bản hiệu chỉnh'))
    } finally { setBusy(null) }
  }

  const complete = async () => {
    if (!active || !preview) return
    if (!preview.steps.length) {
      toast.error('SOP phải có ít nhất một bước.')
      return
    }
    setBusy('complete')
    try {
      await sopImportApi.update(active.id, normalizeFlow(preview))
      const result = await sopImportApi.accept(active.id)
      setActive(result.data.import)
      setPreview(result.data.import.preview)
      toast.success(`Đã hoàn tất chuyển hóa và tạo SOP Draft ${result.data.import.preview.code}.`)
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không hoàn tất được bản chuyển hóa'))
    } finally { setBusy(null) }
  }

  const deleteConversion = async () => {
    if (!active || !editable) return
    if (!window.confirm('Xóa bản chuyển hóa này? Tài liệu gốc trong “Tài liệu của tôi” vẫn được giữ nguyên.')) return
    setBusy('delete')
    try {
      await sopImportApi.delete(active.id)
      setActive(null)
      setPreview(null)
      refresh()
      toast.success('Đã xóa bản chuyển hóa. Tài liệu nguồn vẫn được giữ nguyên.')
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không xóa được bản chuyển hóa'))
    } finally { setBusy(null) }
  }

  const updateStep = (index: number, patch: Partial<SopImportStep>) => setPreview(current => current ? {
    ...current,
    steps: current.steps.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step)
  } : current)

  const addStep = (patch: Partial<SopImportStep> = {}) => setPreview(current => current
    ? appendStep(current, createStep(current.steps.length, patch))
    : current)

  const removeStep = (index: number) => setPreview(current => {
    if (!current) return current
    const removed = current.steps[index]
    if (!removed) return current
    return normalizeFlow({
      ...current,
      steps: current.steps.filter((_, stepIndex) => stepIndex !== index),
      transitions: current.transitions.filter(transition => transition.fromStepId !== removed.id && transition.toStepId !== removed.id)
    })
  })

  const moveStep = (index: number, direction: -1 | 1) => setPreview(current => {
    if (!current) return current
    const target = index + direction
    if (target < 0 || target >= current.steps.length) return current
    const steps = [...current.steps]
    ;[steps[index], steps[target]] = [steps[target]!, steps[index]!]
    return normalizeFlow({ ...current, steps })
  })

  return (
    <div className="space-y-4 animate-fadeIn">
      {(error || conversionError || moduleState.error) && <Feedback type="error">{error || conversionError || moduleState.error}</Feedback>}
      <ConversionProgress active={active} selected={selected} busy={busy} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <DocumentListPanel
          items={items} total={total} totalPages={totalPages} loading={loading} page={page}
          selectedId={selectedId} searchInput={searchInput} format={format}
          onSearchInput={setSearchInput} onSubmitSearch={submitSearch}
          onClearSearch={() => { setSearchInput(''); setSearch(''); setPage(1) }}
          onFormat={value => { setFormat(value); setPage(1) }} onPage={setPage} onSelect={setSelectedId}
        />
        <Panel title="Thiết lập chuyển hóa" description="Tạo SOP từ file đang có; hệ thống không upload hoặc nhân đôi file nguồn.">
          {!selected ? <EmptySelection /> : active || busy === 'open' ? (
            <div className="space-y-4 p-4">
              <SelectedDocument item={selected} />
              {busy === 'open' ? <p role="status" className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="size-4 animate-spin" />Đang mở hồ sơ chuyển hóa…</p> : active && <>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <strong>{active.status === 'needs_review' ? 'Đang hiệu chỉnh' : active.status === 'accepted' ? 'Đã tạo SOP Draft' : active.status === 'published' ? 'Đã công bố' : 'Đã lưu trữ'}:</strong> {active.preview.code}
                </div>
                <button type="button" onClick={() => document.getElementById('conversion-editor')?.scrollIntoView({ behavior: 'smooth' })} className={`${primaryButtonClass} w-full`}><FileSearch className="size-4" />Mở khu vực hiệu chỉnh</button>
              </>}
            </div>
          ) : <ConversionSetupForm selected={selected} modules={moduleState.modules} department={department} jobTitle={jobTitle} defaultAudience={defaultAudience} busy={busy === 'create'} onSubmit={startConversion} />}
        </Panel>
      </div>
      {active && preview && <section id="conversion-editor" className="scroll-mt-24">
        <ConversionEditor
          item={active} preview={preview} view={view} editable={editable} busy={busy}
          modules={moduleState.modules} onView={setView} onPreview={setPreview}
          onAddStep={addStep} onUpdateStep={updateStep} onRemoveStep={removeStep} onMoveStep={moveStep}
          onSave={save} onComplete={complete} onDelete={deleteConversion}
        />
      </section>}
    </div>
  )
}

function ConversionProgress({ active, selected, busy }: { active: SopImportItem | null; selected: UserDocumentItem | null; busy: string | null }) {
  const steps = [
    ['1', 'Chọn tài liệu', Boolean(selected)],
    ['2', 'Trích xuất nội dung', Boolean(active) || ['open', 'create'].includes(busy ?? '')],
    ['3', 'Hiệu chỉnh các bước', Boolean(active)],
    ['4', 'Tạo lưu đồ Mermaid', Boolean(active)],
    ['5', 'Tạo SOP Draft', Boolean(active && active.status !== 'needs_review')]
  ] as const
  return <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5" aria-label="Tiến trình chuyển hóa">{steps.map(([number, label, done]) => (
    <li key={number} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-sm font-bold ${done ? 'border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-100' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900'}`}><span className="grid size-7 place-items-center rounded-full bg-[#155e75] text-xs text-white">{number}</span>{label}</li>
  ))}</ol>
}

function DocumentListPanel(props: {
  items: UserDocumentItem[]; total: number; totalPages: number; loading: boolean; page: number
  selectedId: string | null; searchInput: string; format: 'all' | 'docx' | 'pdf'
  onSearchInput: (value: string) => void; onSubmitSearch: (event: FormEvent) => void
  onClearSearch: () => void; onFormat: (value: 'all' | 'docx' | 'pdf') => void
  onPage: React.Dispatch<React.SetStateAction<number>>; onSelect: (id: string) => void
}) {
  return <Panel title="Tài liệu nguồn của tôi" description="Chọn một PDF hoặc Word đã lưu trong “Tài liệu của tôi”.">
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800">
      <form onSubmit={props.onSubmitSearch} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input type="search" value={props.searchInput} onChange={event => props.onSearchInput(event.target.value)} placeholder="Tìm theo tên tài liệu…" aria-label="Tìm tài liệu để chuyển hóa" className="h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 dark:border-slate-700 dark:bg-slate-950" />
        {props.searchInput && <button type="button" onClick={props.onClearSearch} aria-label="Xóa nội dung tìm kiếm" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="size-4" /></button>}
      </form>
      <Select
        value={props.format}
        onChange={event => props.onFormat(event.target.value as typeof props.format)}
        containerClassName="w-full sm:w-36 sm:shrink-0"
        className="h-11"
      >
        <option value="all">Tất cả</option>
        <option value="pdf">PDF</option>
        <option value="docx">Word</option>
      </Select>
    </div>
    {props.loading ? <TableSkeleton rows={6} /> : props.items.length === 0 ? <div className="grid min-h-64 place-items-center p-8 text-center"><div><FileText className="mx-auto size-9 text-slate-300" /><p className="mt-3 text-sm font-black">Không có tài liệu phù hợp</p><p className="mt-1 text-sm text-slate-500">Hãy upload tài liệu trong “Tài liệu của tôi”.</p></div></div> : <div className="grid gap-2 p-4 md:grid-cols-2">{props.items.map(item => <DocumentSourceCard key={item.id} item={item} selected={item.id === props.selectedId} onSelect={() => props.onSelect(item.id)} />)}</div>}
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><span>{props.total} tài liệu · Trang {props.page}/{props.totalPages}</span><div className="flex gap-2"><button type="button" disabled={props.loading || props.page <= 1} onClick={() => props.onPage(value => value - 1)} className={secondaryButtonClass}><ChevronLeft className="size-4" />Trước</button><button type="button" disabled={props.loading || props.page >= props.totalPages} onClick={() => props.onPage(value => value + 1)} className={secondaryButtonClass}>Sau<ChevronRight className="size-4" /></button></div></div>
  </Panel>
}

function ConversionSetupForm({ selected, modules, department, jobTitle, defaultAudience, busy, onSubmit }: {
  selected: UserDocumentItem; modules: Array<{ id: string; code: string; title: string }>; department: string; jobTitle: string
  defaultAudience: string; busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return <form key={selected.id} onSubmit={onSubmit} className="space-y-4 p-4">
    <SelectedDocument item={selected} />
    <Field label="Mã SOP"><input required name="code" placeholder="SOP-EMP-01" className={adminInputClass} /></Field>
    <Field label="Tên SOP"><input required name="title" defaultValue={titleFromFile(selected.displayName)} className={adminInputClass} /></Field>
    <Field label="Phân hệ"><Select required name="primaryModuleId" className={adminInputClass}><option value="">Chọn phân hệ</option>{modules.map(module => <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</Select></Field>
    <Field label="Nhóm tài liệu"><input name="category" placeholder="Hợp đồng lao động" className={adminInputClass} /></Field>
    <Field label="Ai được xem sau khi công bố"><Select name="audienceMode" defaultValue={defaultAudience} className={adminInputClass}><option value="personal">Chỉ tôi và người kiểm duyệt</option><option value="module">Người có quyền phân hệ</option>{department && <option value="department">Cùng phòng ban · {department}</option>}{jobTitle && <option value="job_title">Cùng chức danh · {jobTitle}</option>}{department && jobTitle && <option value="department_job_title">Cùng chức danh trong phòng ban</option>}</Select></Field>
    <button disabled={busy} className={`${primaryButtonClass} w-full`}>{busy ? <><LoaderCircle className="size-4 animate-spin" />Đang trích xuất…</> : <><ScanText className="size-4" />Trích xuất & tạo Mermaid</>}</button>
  </form>
}

function ConversionEditor(props: {
  item: SopImportItem; preview: SopImportPreview; view: ConversionView; editable: boolean
  busy: string | null; modules: Array<{ id: string; code: string; title: string }>
  onView: (value: ConversionView) => void; onPreview: (value: SopImportPreview) => void
  onAddStep: (patch?: Partial<SopImportStep>) => void; onUpdateStep: (index: number, patch: Partial<SopImportStep>) => void
  onRemoveStep: (index: number) => void; onMoveStep: (index: number, direction: -1 | 1) => void
  onSave: () => Promise<void>; onComplete: () => Promise<void>; onDelete: () => Promise<void>
}) {
  return <div className="space-y-4">
    <div role="tablist" aria-label="Nội dung chuyển hóa" className="flex flex-wrap gap-2">
      <button type="button" role="tab" aria-selected={props.view === 'draft'} onClick={() => props.onView('draft')} className={props.view === 'draft' ? primaryButtonClass : secondaryButtonClass}>SOP bản nháp</button>
      <button type="button" role="tab" aria-selected={props.view === 'flow'} onClick={() => props.onView('flow')} className={props.view === 'flow' ? primaryButtonClass : secondaryButtonClass}><GitBranch className="size-4" />Lưu đồ Mermaid</button>
      <button type="button" role="tab" aria-selected={props.view === 'source'} onClick={() => props.onView('source')} className={props.view === 'source' ? primaryButtonClass : secondaryButtonClass}>File gốc</button>
      <button type="button" role="tab" aria-selected={props.view === 'extracted'} onClick={() => props.onView('extracted')} className={props.view === 'extracted' ? primaryButtonClass : secondaryButtonClass}>Nội dung trích xuất</button>
    </div>
    {props.view === 'source' ? <Suspense fallback={<p role="status" className="p-6 text-sm text-slate-500">Đang mở tài liệu…</p>}><SourceDocumentViewer item={props.item} /></Suspense> : props.view === 'flow' ? <Suspense fallback={<p role="status" className="flex min-h-80 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="size-5 animate-spin" />Đang mở công cụ lưu đồ…</p>}><SopFlowchartWorkspace key={props.item.id} importId={props.item.id} preview={props.preview} editable={props.editable} onPreview={props.onPreview} onSave={props.onSave} saving={props.busy !== null} /></Suspense> : props.view === 'extracted' ? <ExtractedTextPanel item={props.item} editable={props.editable} onAddStep={props.onAddStep} /> : <>
      <Panel title="Thông tin SOP" description={`${props.item.file.name} · ${formatBytes(props.item.file.size)} · SHA-256 ${props.item.file.checksum.slice(0, 12)}…`}>
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <Field label="Mã SOP"><input disabled={!props.editable} value={props.preview.code} onChange={event => props.onPreview({ ...props.preview, code: event.target.value })} className={adminInputClass} /></Field>
          <Field label="Tên SOP"><input disabled={!props.editable} value={props.preview.title} onChange={event => props.onPreview({ ...props.preview, title: event.target.value })} className={adminInputClass} /></Field>
          <Field label="Phân hệ"><Select disabled={!props.editable} value={props.preview.primaryModuleId} onChange={event => props.onPreview({ ...props.preview, primaryModuleId: event.target.value, moduleIds: [event.target.value] })} className={adminInputClass}>{props.modules.map(module => <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</Select></Field>
          <Field label="Nhóm tài liệu"><input disabled={!props.editable} value={props.preview.category ?? ''} onChange={event => props.onPreview({ ...props.preview, category: event.target.value })} className={adminInputClass} /></Field>
          <Field label="Mục đích" wide><textarea disabled={!props.editable} rows={3} value={props.preview.purpose ?? ''} onChange={event => props.onPreview({ ...props.preview, purpose: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
          <Field label="Phạm vi" wide><textarea disabled={!props.editable} rows={3} value={props.preview.scope ?? ''} onChange={event => props.onPreview({ ...props.preview, scope: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
        </div>
      </Panel>
      {!!props.item.warnings.length && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"><div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><p className="text-sm font-black text-amber-950 dark:text-amber-100">Cần người dùng kiểm tra</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900 dark:text-amber-200">{props.item.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div></div></div>}
      <Panel title={`Các bước nghiệp vụ (${props.preview.steps.length})`} description="Vai trò thực hiện là chức danh nghiệp vụ; không gắn cố định tên một nhân viên." action={props.editable ? <button type="button" onClick={() => props.onAddStep()} className={secondaryButtonClass}><Plus className="size-4" />Thêm bước</button> : undefined}>
        <div className="space-y-3 p-4">{props.preview.steps.map((step, index) => <StepEditor key={step.id} step={step} index={index} count={props.preview.steps.length} disabled={!props.editable} onChange={patch => props.onUpdateStep(index, patch)} onUp={() => props.onMoveStep(index, -1)} onDown={() => props.onMoveStep(index, 1)} onRemove={() => props.onRemoveStep(index)} />)}</div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
          {props.editable ? <><button type="button" disabled={props.busy !== null} onClick={() => void props.onDelete()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300"><Trash2 className="size-4" />Xóa bản chuyển hóa</button><button type="button" disabled={props.busy !== null} onClick={() => void props.onSave()} className={secondaryButtonClass}>{props.busy === 'save' ? 'Đang lưu…' : 'Lưu hiệu chỉnh'}</button><button type="button" disabled={props.busy !== null || !props.preview.steps.length} onClick={() => void props.onComplete()} className={primaryButtonClass}>{props.busy === 'complete' ? <><LoaderCircle className="size-4 animate-spin" />Đang hoàn tất…</> : 'Hoàn tất chuyển hóa'}</button></> : <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-100 px-4 text-sm font-bold text-emerald-900"><CheckCircle2 className="size-4" />{props.item.status === 'published' ? 'SOP đã công bố' : 'SOP Draft đã được tạo'}</span>}
        </div>
      </Panel>
    </>}
  </div>
}

function ExtractedTextPanel({ item, editable, onAddStep }: { item: SopImportItem; editable: boolean; onAddStep: (patch?: Partial<SopImportStep>) => void }) {
  const lines = useMemo(() => item.extractedText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length >= 3).slice(0, 500), [item.extractedText])
  return <Panel title="Nội dung đã trích xuất" description="Chọn đoạn phù hợp để đưa vào SOP. Các đề xuất vẫn cần người dùng kiểm tra.">
    {!lines.length ? <div className="p-6 text-sm text-slate-500">Không có lớp chữ. Hãy kiểm tra cảnh báo OCR hoặc file nguồn.</div> : <div className="max-h-[680px] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">{lines.map((line, index) => <div key={`${index}-${line.slice(0, 20)}`} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start"><span className="min-w-0 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200"><span className="mr-2 text-xs font-bold text-slate-400">{index + 1}</span>{line}</span>{editable && <div className="flex shrink-0 flex-wrap gap-1"><button type="button" onClick={() => onAddStep({ title: line.slice(0, 500), description: line, nodeKind: 'task', typeCode: 'N' })} className={secondaryButtonClass}>+ Bước</button><button type="button" onClick={() => onAddStep({ title: line.slice(0, 500), description: line, nodeKind: 'decision', typeCode: 'C' })} className={secondaryButtonClass}>+ Điều kiện</button><button type="button" onClick={() => onAddStep({ title: line.slice(0, 500), description: line, nodeKind: 'task', typeCode: 'C' })} className={secondaryButtonClass}>+ Quy tắc</button></div>}</div>)}</div>}
  </Panel>
}

function StepEditor({ step, index, count, disabled, onChange, onUp, onDown, onRemove }: {
  step: SopImportStep; index: number; count: number; disabled: boolean
  onChange: (patch: Partial<SopImportStep>) => void; onUp: () => void; onDown: () => void; onRemove: () => void
}) {
  return <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-wrap items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-[#155e75] text-xs font-black text-white">{index + 1}</span><input aria-label={`Mã bước ${index + 1}`} disabled={disabled} value={step.code} onChange={event => onChange({ code: event.target.value })} className="h-9 w-32 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold dark:border-slate-700 dark:bg-slate-950" />{!disabled && <div className="ml-auto flex gap-1"><IconButton label="Chuyển bước lên" disabled={index === 0} onClick={onUp}><ArrowUp className="size-4" /></IconButton><IconButton label="Chuyển bước xuống" disabled={index === count - 1} onClick={onDown}><ArrowDown className="size-4" /></IconButton><IconButton label="Xóa bước" danger onClick={onRemove}><Trash2 className="size-4" /></IconButton></div>}</div><div className="mt-3 grid gap-3 md:grid-cols-2"><Field label="Tên bước"><input disabled={disabled} value={step.title} onChange={event => onChange({ title: event.target.value })} className={adminInputClass} /></Field><Field label="Vai trò/chức danh thực hiện"><input disabled={disabled} value={step.actor ?? ''} onChange={event => onChange({ actor: event.target.value })} placeholder="Ví dụ: Chuyên viên nhân sự" className={adminInputClass} /></Field><Field label="Loại nút"><Select disabled={disabled} value={step.nodeKind} onChange={event => onChange({ nodeKind: event.target.value as SopImportStep['nodeKind'] })} className={adminInputClass}><option value="task">Thao tác</option><option value="decision">Điều kiện quyết định</option><option value="subprocess">Quy trình con</option><option value="start">Bắt đầu</option><option value="end">Kết thúc</option></Select></Field><Field label="Phân loại thao tác"><Select disabled={disabled} value={step.typeCode ?? 'N'} onChange={event => onChange({ typeCode: event.target.value })} className={adminInputClass}><option value="N">Nhập liệu/thực hiện</option><option value="C">Kiểm soát/quy tắc</option><option value="M">Phê duyệt</option><option value="A">Tự động</option></Select></Field><Field label="Mô tả chi tiết" wide><textarea disabled={disabled} rows={4} value={step.description ?? ''} onChange={event => onChange({ description: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field></div></article>
}

function DocumentSourceCard({ item, selected, onSelect }: { item: UserDocumentItem; selected: boolean; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} aria-pressed={selected} className={`min-h-28 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155e75] ${selected ? 'border-cyan-500 bg-cyan-50 shadow-sm dark:border-cyan-600 dark:bg-cyan-950/30' : 'border-slate-200 bg-white hover:border-cyan-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800 dark:hover:bg-slate-800'}`}><span className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#155e75] dark:bg-slate-800 dark:text-cyan-300"><FileText className="size-4" /></span><span className="min-w-0 flex-1"><span className="block break-words text-sm font-black">{item.displayName}</span><span className="mt-1 block truncate text-xs text-slate-500">{item.originalFileName}</span><span className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold"><span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.format.toUpperCase()}</span><span className="text-slate-500">{formatBytes(item.fileSize)}</span>{item.sourceImportJobId && <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-3.5" />Đã chuyển hóa</span>}</span></span></span></button>
}

function SelectedDocument({ item }: { item: UserDocumentItem }) {
  return <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#155e75] text-white"><FileText className="size-5" /></span><div className="min-w-0"><p className="break-words text-sm font-black">{item.displayName}</p><p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.format.toUpperCase()} · {formatBytes(item.fileSize)}</p><p className="mt-1 text-xs text-slate-500">Tải lên {formatDate(item.createdAt)}</p></div></div></div>
}

function EmptySelection() {
  return <div className="grid min-h-80 place-items-center p-6 text-center"><div><ScanText className="mx-auto size-10 text-slate-300" /><p className="mt-3 text-sm font-black">Chưa chọn tài liệu</p><p className="mt-1 text-sm leading-6 text-slate-500">Chọn tài liệu để thiết lập mã SOP, phân hệ và phạm vi người xem.</p></div></div>
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`grid gap-1.5 text-sm font-bold ${wide ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>
}

function IconButton({ label, disabled, danger, onClick, children }: { label: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={label} className={`grid size-9 place-items-center rounded-lg disabled:opacity-30 ${danger ? 'text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{children}</button>
}
