import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, FileText, LoaderCircle, Plus, ScanText, Trash2, UploadCloud } from 'lucide-react'
import { sopImportApi, useSopImportModules, getErrorMessage, type SopImportItem, type SopImportPreview, type SopImportStep } from '../model/sopImportModel'
import { useSession, canPublishSop, canReviewSop } from '../../authentication/model/session'
import { Feedback, Panel, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import { useToast } from '../../../shared/ui/toast'

const maxFileSize = 10 * 1024 * 1024
const SourceDocumentViewer = lazy(() => import('./SourceDocumentViewer').then(module => ({ default: module.SourceDocumentViewer })))

function audienceLabel(audience: SopImportItem['audience']) {
  if (audience.mode === 'module') return 'Người có quyền phân hệ'
  if (audience.mode === 'department_job_title') return `${audience.jobTitle ?? 'Chức danh'} · ${audience.department ?? 'Phòng ban'}`
  if (audience.mode === 'department') return `Phòng ban ${audience.department ?? ''}`.trim()
  if (audience.mode === 'job_title') return `Chức danh ${audience.jobTitle ?? ''}`.trim()
  return 'Chỉ người tạo'
}

function formatBytes(value: number) {
  return value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`
}

function rebuildFlow(preview: SopImportPreview): SopImportPreview {
  const steps = preview.steps.map((step, index) => ({ ...step, sortOrder: index + 1 }))
  return { ...preview, steps, transitions: steps.slice(0, -1).map((step, index) => ({
    id: `import-transition-${index + 1}`, fromStepId: step.id, toStepId: steps[index + 1]!.id,
    kind: 'normal', sortOrder: index + 1
  })) }
}

function reorder(preview: SopImportPreview, index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= preview.steps.length) return preview
  const steps = [...preview.steps]
  const current = steps[index]!
  steps[index] = steps[target]!
  steps[target] = current
  return rebuildFlow({ ...preview, steps })
}

export function SopImportWorkspace({ adminMode = false }: { adminMode?: boolean }) {
  const toast = useToast()
  const moduleState = useSopImportModules()
  const session = useSession()
  const canPublish = canPublishSop(session)
  const canReview = canReviewSop(session)
  const department = session.organization?.department?.trim() ?? ''
  const jobTitle = session.organization?.jobTitle?.trim() ?? ''
  const defaultAudience = department && jobTitle ? 'department_job_title' : department ? 'department' : jobTitle ? 'job_title' : 'personal'
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [imports, setImports] = useState<SopImportItem[]>([])
  const [active, setActive] = useState<SopImportItem | null>(null)
  const [preview, setPreview] = useState<SopImportPreview | null>(null)
  const [busy, setBusy] = useState<'load' | 'upload' | 'save' | 'delete' | 'accept' | 'review' | 'publish' | 'revise' | 'archive' | null>('load')
  const [error, setError] = useState('')
  const [documentView, setDocumentView] = useState<'sop' | 'source'>('sop')
  const modules = useMemo(() => moduleState.modules, [moduleState.modules])
  const isOwner = active?.createdBy === session.accountId
  const editable = Boolean(isOwner && active?.status === 'needs_review')

  const manageDocument = async (action: 'revise' | 'archive') => {
    if (!active) return
    const message = action === 'archive'
      ? 'Gỡ tài liệu khỏi công bố? File nguồn và lịch sử vẫn được giữ để tra cứu.'
      : active.status === 'accepted' ? 'Rút bản chờ duyệt về để chỉnh sửa? Xác nhận rà soát hiện tại sẽ bị hủy.'
      : 'Tạo bản chỉnh sửa để gửi duyệt lại? Bản đang công bố tiếp tục có hiệu lực.'
    if (!window.confirm(message)) return
    setBusy(action); setError('')
    try {
      const { data } = await sopImportApi[action](active.id)
      setImports(current => current.some(item => item.id === data.id)
        ? current.map(item => item.id === data.id ? data : item) : [data, ...current])
      setActive(data); setPreview(data.preview)
      toast.success(action === 'archive' ? 'Đã lưu trữ tài liệu và gỡ phiên bản này khỏi công bố.' : 'Đã mở bản chỉnh sửa. Hãy lưu và gửi duyệt lại khi hoàn tất.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không xử lý được tài liệu')) }
    finally { setBusy(null) }
  }

  useEffect(() => {
    const controller = new AbortController()
    void sopImportApi.list(controller.signal).then(result => setImports(result.data)).catch(reason => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được hồ sơ số hóa')
    }).finally(() => { if (!controller.signal.aborted) setBusy(null) })
    return () => controller.abort()
  }, [])

  const chooseFile = (next: File | null) => {
    setFileError('')
    if (!next) return setFile(null)
    const extension = next.name.split('.').pop()?.toLocaleLowerCase()
    if (!['docx', 'pdf'].includes(extension ?? '')) { setFileError('Chỉ chấp nhận tệp DOCX hoặc PDF.'); return setFile(null) }
    if (next.size > maxFileSize) { setFileError('Dung lượng tối đa là 10 MB.'); return setFile(null) }
    setFile(next)
  }

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('')
    if (!file) return setFileError('Vui lòng chọn một tệp DOCX hoặc PDF.')
    const data = new FormData(event.currentTarget)
    data.set('file', file)
    setBusy('upload')
    try {
      const result = await sopImportApi.upload(data)
      setImports(current => [result.data, ...current]); setActive(result.data); setPreview(result.data.preview)
      toast.success('Đã upload và trích xuất nội dung tài liệu.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không thể upload tài liệu lên hệ thống lưu trữ.')) }
    finally { setBusy(null) }
  }

  const selectImport = (item: SopImportItem) => { setActive(item); setPreview(item.preview); setError('') }
  const updateStep = (index: number, patch: Partial<SopImportStep>) => setPreview(current => current ? {
    ...current, steps: current.steps.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step)
  } : current)
  const removeStep = (index: number) => setPreview(current => current ? rebuildFlow({ ...current, steps: current.steps.filter((_, i) => i !== index) }) : current)
  const addStep = () => setPreview(current => {
    if (!current) return current
    const key = `import-step-${Date.now()}`
    return rebuildFlow({ ...current, steps: [...current.steps, {
      id: key, stableKey: key, code: `STEP-${String(current.steps.length + 1).padStart(2, '0')}`,
      title: 'Bước mới', description: '', actor: '', location: '', timing: '', nodeKind: 'task',
      sortOrder: current.steps.length + 1, checklist: [], inputs: [], outputs: []
    }] })
  })

  const save = async () => {
    if (!active || !preview) return
    setBusy('save'); setError('')
    try {
      const result = await sopImportApi.update(active.id, rebuildFlow(preview))
      setActive(result.data); setPreview(result.data.preview)
      setImports(current => current.map(item => item.id === result.data.id ? result.data : item))
      toast.success('Đã lưu bản hiệu chỉnh.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không lưu được bản hiệu chỉnh')) }
    finally { setBusy(null) }
  }

  const deleteDraft = async () => {
    if (!active || !['needs_review', 'accepted'].includes(active.status) || active.createdBy !== session.accountId) return
    if (!window.confirm(`Xóa bản nháp “${active.preview.title}”? Tệp nguồn và nội dung đã số hóa của bản nháp này sẽ bị xóa.`)) return
    setBusy('delete'); setError('')
    try {
      await sopImportApi.delete(active.id)
      setImports(current => current.filter(item => item.id !== active.id))
      setActive(null); setPreview(null)
      toast.success('Đã xóa bản nháp tài liệu.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không xóa được bản nháp')) }
    finally { setBusy(null) }
  }

  const accept = async () => {
    if (!active || !preview || !preview.steps.length) return
    setBusy('accept'); setError('')
    try {
      await sopImportApi.update(active.id, rebuildFlow(preview))
      const result = await sopImportApi.accept(active.id)
      setActive(result.data.import); setPreview(result.data.import.preview)
      setImports(current => current.map(item => item.id === active.id ? result.data.import : item))
      toast.success(`Đã tạo SOP ở trạng thái Draft: ${result.data.import.preview.code}`)
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không tạo được SOP draft')) }
    finally { setBusy(null) }
  }

  const review = async () => {
    if (!active || active.status !== 'accepted') return
    setBusy('review'); setError('')
    try {
      const result = await sopImportApi.review(active.id)
      setActive(result.data); setImports(current => current.map(item => item.id === result.data.id ? result.data : item))
      toast.success('Reviewer đã xác nhận tài liệu.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không xác nhận được bước rà soát')) }
    finally { setBusy(null) }
  }
  const publish = async () => {
    if (!active || active.status !== 'accepted') return
    setBusy('publish'); setError('')
    try {
      const result = await sopImportApi.publish(active.id)
      setActive(result.data); setPreview(result.data.preview)
      setImports(current => current.map(item => item.id === result.data.id ? result.data : item))
      toast.success('Đã phê duyệt và công bố SOP.')
    } catch (reason) { toast.error(getErrorMessage(reason, 'Không công bố được SOP')) }
    finally { setBusy(null) }
  }

  return <div className="space-y-4">
    {error && <Feedback type="error">{error}</Feedback>}
    {moduleState.error && <Feedback type="error">{moduleState.error}</Feedback>}
    <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5" aria-label="Tiến trình số hóa">
      {[['1', 'Tải tài liệu', Boolean(file || active)], ['2', 'Hiệu chỉnh nội dung', Boolean(active)], ['3', 'Gửi bản nháp', active?.status === 'accepted' || active?.status === 'published'], ['4', 'Reviewer xác nhận', Boolean(active?.reviewedAt)], ['5', 'Approver công bố', active?.status === 'published']].map(([number, label, done]) => <li key={String(number)} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 text-sm font-bold ${done ? 'border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-100' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900'}`}><span className="grid size-7 place-items-center rounded-full bg-[#155e75] text-xs text-white">{number}</span>{label}</li>)}
    </ol>

    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-4">
        <Panel title={adminMode ? 'Tài liệu nguồn' : 'Tạo tài liệu mới'} description="DOCX hoặc PDF có văn bản, tối đa 10 MB.">
          <form onSubmit={upload} className="space-y-4 p-4">
            <input ref={inputRef} type="file" name="file" accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => chooseFile(event.target.files?.[0] ?? null)} />
            <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition-colors hover:border-[#155e75] hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155e75] dark:border-slate-700 dark:bg-slate-950 dark:hover:border-cyan-500">
              <UploadCloud aria-hidden="true" className="size-8 text-[#155e75] dark:text-cyan-400" />
              <span className="mt-3 text-sm font-black">{file ? file.name : 'Chọn tài liệu cần số hóa'}</span>
              <span className="mt-1 text-xs text-slate-500">{file ? formatBytes(file.size) : 'Hệ thống giữ file gốc để đối chiếu và audit'}</span>
            </button>
            {fileError && <p role="alert" className="text-xs font-semibold text-red-700 dark:text-red-300">{fileError}</p>}
            <Field label="Mã SOP"><input required name="code" placeholder="SOP-EMP-01" className={adminInputClass} /></Field>
            <Field label="Tên SOP"><input required name="title" placeholder="Quy trình tiếp nhận nhân viên" className={adminInputClass} /></Field>
            <Field label="Phân hệ"><Select required name="primaryModuleId" className={adminInputClass}><option value="">Chọn phân hệ</option>{modules.map(module => <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</Select></Field>
            <Field label="Nhóm tài liệu"><input name="category" placeholder="Quy trình nhân sự" className={adminInputClass} /></Field>
            <Field label="Ai được xem sau khi công bố">
              <Select name="audienceMode" defaultValue={defaultAudience} className={adminInputClass}>
                <option value="personal">Chỉ tôi (và người kiểm duyệt)</option>
                <option value="module">Tất cả người có quyền phân hệ</option>
                {department && <option value="department">Cùng phòng ban · {department}</option>}
                {jobTitle && <option value="job_title">Cùng chức danh · {jobTitle}</option>}
                {department && jobTitle && <option value="department_job_title">Cùng chức danh trong phòng ban</option>}
              </Select>
            </Field>
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200">
              <strong>Phạm vi từ hồ sơ:</strong> {department || jobTitle ? [jobTitle, department].filter(Boolean).join(' · ') : 'Chưa có phòng ban/chức danh; tài liệu sẽ ở phạm vi cá nhân.'}
            </div>
            <button disabled={busy !== null} className={`${primaryButtonClass} w-full`}>{busy === 'upload' ? <><LoaderCircle className="size-4 animate-spin" />Đang trích xuất...</> : <><ScanText className="size-4" />Upload và số hóa</>}</button>
          </form>
        </Panel>

        <Panel title={adminMode ? 'Hồ sơ chờ xử lý' : 'Tài liệu nghiệp vụ'} description={adminMode ? 'Tài liệu của người dùng để quản trị viên rà soát và công bố.' : 'Bản nháp của bạn và tài liệu đã công bố được chia sẻ đúng phạm vi.'}>
          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {busy === 'load' && <p className="p-4 text-sm text-slate-500">Đang tải...</p>}
            {!busy && !imports.length && <p className="p-4 text-sm text-slate-500">Chưa có tài liệu nào.</p>}
            {imports.map(item => <button key={item.id} type="button" onClick={() => selectImport(item)} className={`flex min-h-16 w-full cursor-pointer items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155e75] dark:hover:bg-slate-800 ${active?.id === item.id ? 'bg-cyan-50 dark:bg-cyan-950/20' : ''}`}><FileText className="mt-0.5 size-4 shrink-0 text-[#155e75] dark:text-cyan-400" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{item.file.name}</span><span className="mt-1 block text-xs text-slate-500">{item.preview.code} · {item.preview.steps.length} bước</span><span className="mt-1 block truncate text-[10px] font-semibold text-sky-700 dark:text-sky-300">{audienceLabel(item.audience)}</span></span><span className={`rounded-md px-2 py-1 text-[10px] font-black ${item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{item.status === 'archived' ? 'Đã lưu trữ' : item.status === 'published' ? 'Đã công bố' : item.status === 'accepted' ? 'Chờ duyệt' : 'Bản nháp'}</span></button>)}
          </div>
        </Panel>
      </div>

      {!preview || !active ? <EmptyPreview /> : <div className="space-y-4">
        <div role="tablist" aria-label="Cách xem tài liệu" className="flex flex-wrap gap-2">
          <button type="button" role="tab" aria-selected={documentView === 'sop'} onClick={() => setDocumentView('sop')} className={documentView === 'sop' ? primaryButtonClass : secondaryButtonClass}>Nội dung SOP</button>
          <button type="button" role="tab" aria-selected={documentView === 'source'} onClick={() => setDocumentView('source')} className={documentView === 'source' ? primaryButtonClass : secondaryButtonClass}><FileText className="size-4" />File gốc · {active.file.mediaType === 'application/pdf' ? 'PDF' : 'Word'}</button>
        </div>
        {documentView === 'source' ? <Suspense fallback={<p role="status" className="p-4 text-sm">Đang mở trình xem tài liệu…</p>}><SourceDocumentViewer key={`${session.accountId}:${active.id}`} item={active} /></Suspense> : <>
        <Panel title="Quản lý tài liệu" description="Bản công bố được cập nhật qua một bản chỉnh sửa và duyệt lại. Tài liệu cũ có thể gỡ công bố, giữ lịch sử.">
          <div className="flex flex-wrap gap-2 p-4">
            {isOwner && ['accepted', 'published', 'archived'].includes(active.status) && <button type="button" disabled={busy !== null} onClick={() => void manageDocument('revise')} className={secondaryButtonClass}>{active.status === 'accepted' ? 'Rút về chỉnh sửa' : 'Tạo bản chỉnh sửa'}</button>}
            {isOwner && active.status === 'accepted' && <button type="button" disabled={busy !== null} onClick={() => void deleteDraft()} className={secondaryButtonClass}><Trash2 className="size-4" />Xóa bản chờ duyệt</button>}
            {active.status === 'published' && (isOwner || session.capabilities.includes('sop.archive')) && <button type="button" disabled={busy !== null} onClick={() => void manageDocument('archive')} className={secondaryButtonClass}><Trash2 className="size-4" />Gỡ công bố / Lưu trữ</button>}
            {editable && <p className="text-sm text-slate-500">Bạn có thể sửa nội dung ở bên dưới và chọn “Lưu hiệu chỉnh”, hoặc xóa bản nháp.</p>}
            {active.status === 'archived' && <p role="status" className="text-sm text-slate-500">Đã lưu trữ — tài liệu không còn được công bố qua hồ sơ này.</p>}
          </div>
        </Panel>
        <Panel title="Bản xem trước SOP" description={`${active.file.name} · ${formatBytes(active.file.size)} · SHA-256 ${active.file.checksum.slice(0, 12)}…`} action={<div className="flex items-center gap-2"><span className={`rounded-md px-2 py-1 text-xs font-black ${active.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{active.status === 'archived' ? 'Đã lưu trữ' : active.status === 'published' ? 'Đã công bố' : active.status === 'accepted' ? 'Chờ Admin duyệt' : 'Bản nháp'}</span>{active.status === 'needs_review' && active.createdBy === session.accountId && <button type="button" disabled={busy !== null} onClick={() => void deleteDraft()} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"><Trash2 className="size-4" />{busy === 'delete' ? 'Đang xóa...' : 'Xóa bản nháp'}</button>}</div>}>
          <div className="grid gap-4 p-4 md:grid-cols-2">
            <Field label="Mã SOP"><input disabled={!editable} value={preview.code} onChange={event => setPreview({ ...preview, code: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Tên SOP"><input disabled={!editable} value={preview.title} onChange={event => setPreview({ ...preview, title: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Mục đích" wide><textarea disabled={!editable} rows={3} value={preview.purpose ?? ''} onChange={event => setPreview({ ...preview, purpose: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
            <Field label="Phạm vi" wide><textarea disabled={!editable} rows={3} value={preview.scope ?? ''} onChange={event => setPreview({ ...preview, scope: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
            <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"><strong>Người được xem sau công bố:</strong> {audienceLabel(active.audience)}. Reviewer, Approver và quản trị viên được xem trong quá trình kiểm soát.</div>
          </div>
        </Panel>

        {!!active.warnings.length && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"><div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><p className="text-sm font-black text-amber-950 dark:text-amber-100">Cần người dùng kiểm tra</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900 dark:text-amber-200">{active.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div></div></div>}

        <Panel title={`Các bước nghiệp vụ (${preview.steps.length})`} description="Sắp xếp và hiệu chỉnh nội dung trước khi tạo SOP draft." action={editable ? <button type="button" onClick={addStep} className={secondaryButtonClass}><Plus className="size-4" />Thêm bước</button> : undefined}>
          <div className="space-y-3 p-4">{preview.steps.map((step, index) => <StepEditor key={step.id} step={step} index={index} count={preview.steps.length} disabled={!editable} onChange={patch => updateStep(index, patch)} onUp={() => setPreview(reorder(preview, index, -1))} onDown={() => setPreview(reorder(preview, index, 1))} onRemove={() => removeStep(index)} />)}</div>
          <div className="flex flex-col gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end dark:border-slate-800">{active.status === 'archived' ? <span className="text-sm text-slate-500">Đã lưu trữ</span> : active.status === 'published' ? <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-100 px-4 text-sm font-bold text-emerald-900"><CheckCircle2 className="size-4" />SOP đã được công bố</span> : active.status === 'accepted' ? !active.reviewedAt ? canReview ? <button type="button" disabled={busy !== null} onClick={() => void review()} className={primaryButtonClass}>{busy === 'review' ? 'Đang xác nhận...' : 'Xác nhận đã rà soát'}</button> : <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-100 px-4 text-sm font-bold text-amber-900"><CheckCircle2 className="size-4" />Đang chờ Reviewer xác nhận</span> : canPublish ? <button type="button" disabled={busy !== null} onClick={() => void publish()} className={primaryButtonClass}>{busy === 'publish' ? <><LoaderCircle className="size-4 animate-spin" />Đang công bố...</> : 'Phê duyệt và công bố'}</button> : <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-100 px-4 text-sm font-bold text-amber-900"><CheckCircle2 className="size-4" />Đã rà soát · chờ Approver công bố</span> : editable ? <><button type="button" disabled={busy !== null} onClick={() => void save()} className={secondaryButtonClass}>{busy === 'save' ? 'Đang lưu...' : 'Lưu hiệu chỉnh'}</button><button type="button" disabled={busy !== null || !preview.steps.length} onClick={() => void accept()} className={primaryButtonClass}>{busy === 'accept' ? <><LoaderCircle className="size-4 animate-spin" />Đang gửi...</> : 'Gửi bản nháp chờ duyệt'}</button></> : <span className="text-sm text-slate-500">Chỉ người tạo được hiệu chỉnh bản nháp.</span>}</div>
        </Panel>
      </>} </div>}
    </div>
  </div>
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`grid gap-1.5 text-sm font-bold ${wide ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>
}

function EmptyPreview() {
  return <Panel className="min-h-[520px]" title="Bản xem trước SOP"><div className="grid min-h-[460px] place-items-center px-6 text-center"><div><ScanText className="mx-auto size-9 text-slate-300" /><p className="mt-3 font-black">Chưa có bản số hóa</p><p className="mt-1 max-w-md text-sm leading-6 text-slate-500">Tải một tài liệu hoặc chọn hồ sơ gần đây để kiểm tra nội dung đã trích xuất.</p></div></div></Panel>
}

function StepEditor({ step, index, count, disabled, onChange, onUp, onDown, onRemove }: { step: SopImportStep; index: number; count: number; disabled: boolean; onChange: (patch: Partial<SopImportStep>) => void; onUp: () => void; onDown: () => void; onRemove: () => void }) {
  return <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-wrap items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-[#155e75] text-xs font-black text-white">{index + 1}</span><input aria-label={`Mã bước ${index + 1}`} disabled={disabled} value={step.code} onChange={event => onChange({ code: event.target.value })} className="h-9 w-32 rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-bold dark:border-slate-700 dark:bg-slate-950" />{!disabled && <div className="ml-auto flex gap-1"><IconButton label="Chuyển bước lên" disabled={index === 0} onClick={onUp}><ArrowUp className="size-4" /></IconButton><IconButton label="Chuyển bước xuống" disabled={index === count - 1} onClick={onDown}><ArrowDown className="size-4" /></IconButton><IconButton label="Xóa bước" danger onClick={onRemove}><Trash2 className="size-4" /></IconButton></div>}</div><div className="mt-3 grid gap-3 md:grid-cols-2"><Field label="Tên bước"><input disabled={disabled} value={step.title} onChange={event => onChange({ title: event.target.value })} className={adminInputClass} /></Field><Field label="Người thực hiện"><input disabled={disabled} value={step.actor ?? ''} onChange={event => onChange({ actor: event.target.value })} className={adminInputClass} /></Field><Field label="Mô tả" wide><textarea disabled={disabled} rows={3} value={step.description ?? ''} onChange={event => onChange({ description: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field></div></article>
}

function IconButton({ label, disabled, danger, onClick, children }: { label: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={label} className={`grid size-9 place-items-center rounded-lg disabled:opacity-30 ${danger ? 'text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{children}</button>
}
