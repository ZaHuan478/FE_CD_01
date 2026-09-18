import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, RefreshCw, Save, Search } from 'lucide-react'
import { useSession } from '../../authentication/model/session'
import { emptySop, getErrorMessage, sopManagementApi, stateLabels, type ManagedSop, type SopAction, type SopImportPreview } from '../model/sopManagementModel'
import { adminInputClass, EmptyState, Feedback, PageIntro, Panel, primaryButtonClass, secondaryButtonClass, TableSkeleton } from '../../../shared/ui/molecules/AdminSurface'
import { BusinessWorkflowEditor } from './BusinessWorkflowEditor'

export function SopManagementWorkspace() {
  const session = useSession()
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('draft'), source = params.get('source')
  const [rows, setRows] = useState<ManagedSop[]>([]), [selected, setSelected] = useState<ManagedSop | null>(null)
  const [preview, setPreview] = useState<SopImportPreview | null>(null), [creating, setCreating] = useState(false)
  const [query, setQuery] = useState(''), [state, setState] = useState(''), [page, setPage] = useState(1), [total, setTotal] = useState(0)
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [note, setNote] = useState('')
  const sourceRequest = useRef<string | null>(null)
  const dirty = selected && preview && JSON.stringify(selected.preview) !== JSON.stringify(preview)
  const editable = creating || Boolean(selected?.state === 'draft' && selected.permissions.edit)
  const canCreate = ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole) || session.capabilities.includes('sop.create')
  const open = useCallback((item: ManagedSop) => { setSelected(item); setPreview(item.preview); setCreating(false); setError(''); setNote(''); setParams({ draft: item.id }, { replace: true }) }, [setParams])
  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    try { const result = await sopManagementApi.list(query, state, page, signal); setRows(result.data); setTotal(result.pagination.total) }
    catch (e) { if (!signal?.aborted) setError(getErrorMessage(e)) }
    finally { if (!signal?.aborted) setLoading(false) }
  }, [query, state, page])
  useEffect(() => { const controller = new AbortController(); const timer = window.setTimeout(() => { void refresh(controller.signal) }, 200); return () => { window.clearTimeout(timer); controller.abort() } }, [refresh])
  useEffect(() => {
    if (!selectedId) return
    const controller = new AbortController()
    void sopManagementApi.get(selectedId, controller.signal).then(({ data }) => { setSelected(data); setPreview(data.preview); setCreating(false) }).catch(e => { if (!controller.signal.aborted) setError(getErrorMessage(e)) })
    return () => controller.abort()
  }, [selectedId])
  useEffect(() => {
    if (!source || sourceRequest.current === source) return
    sourceRequest.current = source; setBusy(true)
    void sopManagementApi.create({ documentId: source }).then(({ data }) => { open(data); setNotice('Đã mở bản sửa. Phiên bản đang công bố vẫn được giữ nguyên.') }).catch(e => { setError(getErrorMessage(e)); sourceRequest.current = null }).finally(() => setBusy(false))
  }, [source, open])
  useEffect(() => {
    if (!dirty && !creating) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, creating])
  async function save() {
    if (!preview) return
    setBusy(true); setError(''); setNotice('')
    try {
      const result = selected ? await sopManagementApi.save(selected, preview) : await sopManagementApi.create({ preview })
      open(result.data); setNotice('Đã lưu bản nháp.'); await refresh()
    } catch (e) { setError(getErrorMessage(e)) } finally { setBusy(false) }
  }
  async function act(action: SopAction) {
    if (!selected || dirty) return
    setBusy(true); setError(''); setNotice('')
    try { const { data } = await sopManagementApi.action(selected, action, note); open(data); setNotice(`SOP: ${stateLabels[data.state]}.`); await refresh() }
    catch (e) { setError(getErrorMessage(e)) } finally { setBusy(false) }
  }
  function close() {
    if (dirty || creating) { if (!window.confirm('Bạn còn nội dung chưa lưu. Rời bản nháp này?')) return }
    setSelected(null); setPreview(null); setCreating(false); setParams({}); setNotice(''); setError('')
  }
  const update = (patch: Partial<SopImportPreview>) => setPreview(current => current ? { ...current, ...patch } : current)
  return <div className="space-y-4">
    <PageIntro title="Quản lý SOP" description="Soạn thảo → Rà soát → Công bố → Cập nhật hoặc thu hồi. Bản nháp chỉ hiển thị cho người có trách nhiệm." actions={<Link className={secondaryButtonClass} to="/employee-lifecycle/operation-guide">Hướng dẫn sử dụng</Link>} />
    {error && <Feedback type="error">{error}</Feedback>}{notice && <Feedback type="success">{notice}</Feedback>}
    {preview ? <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className={secondaryButtonClass} onClick={close} disabled={busy}><ArrowLeft size={16} /> Danh sách</button>
        <span className="text-sm font-semibold">{selected ? `${stateLabels[selected.state]} · Lần lưu ${selected.revision}` : 'SOP mới'}{dirty ? ' · Chưa lưu' : ''}</span>
        {editable && <button className={primaryButtonClass} onClick={() => void save()} disabled={busy || !preview.title.trim() || !preview.code.trim()}><Save size={16} />{busy ? 'Đang lưu…' : 'Lưu bản nháp'}</button>}
      </div>
      {selected?.note && <Feedback type="info">Ghi chú xử lý: {selected.note}</Feedback>}
      <Panel title="Thông tin SOP">
        <fieldset disabled={!editable || busy} className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-1 text-sm font-semibold">Mã SOP<input className={adminInputClass} value={preview.code} disabled={Boolean(selected?.documentId)} onChange={e => update({ code: e.target.value })} maxLength={100} /></label>
          <label className="space-y-1 text-sm font-semibold sm:col-span-2">Tên quy trình<input className={adminInputClass} value={preview.title} onChange={e => update({ title: e.target.value })} maxLength={500} /></label>
          <label className="space-y-1 text-sm font-semibold">Phân hệ chính<select className={adminInputClass} value={preview.primaryModuleId} onChange={e => update({ primaryModuleId: e.target.value, moduleIds: [e.target.value] })}>{session.modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select></label>
          <label className="space-y-1 text-sm font-semibold">Mục đích<textarea className={`${adminInputClass} h-24 py-2`} value={preview.purpose ?? ''} onChange={e => update({ purpose: e.target.value })} /></label>
          <label className="space-y-1 text-sm font-semibold">Phạm vi áp dụng<textarea className={`${adminInputClass} h-24 py-2`} value={preview.scope ?? ''} onChange={e => update({ scope: e.target.value })} /></label>
          <label className="space-y-1 text-sm font-semibold sm:col-span-2">Tóm tắt<textarea className={`${adminInputClass} h-20 py-2`} value={preview.definition ?? ''} onChange={e => update({ definition: e.target.value })} /></label>
          <label className="space-y-1 text-sm font-semibold">Nội dung thay đổi<textarea className={`${adminInputClass} h-20 py-2`} value={preview.changeLog ?? ''} onChange={e => update({ changeLog: e.target.value })} /></label>
        </fieldset>
      </Panel>
      <BusinessWorkflowEditor preview={preview} editable={editable && !busy} onPreview={setPreview} />
      {selected && <Panel title="Xử lý và lịch sử phiên bản" description="Người soạn, người rà soát và người công bố là các tài khoản khác nhau.">
        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-500">Người soạn: {selected.createdBy} · Người sửa cuối: {selected.editedBy} · Rà soát: {selected.reviewedBy || 'Chưa rà soát'} · Công bố: {selected.publishedBy || 'Chưa công bố'} · Phiên bản gốc: {selected.baseVersion || 'SOP mới'}</p>
          <label className="block text-sm font-semibold">Ghi chú / lý do trả lại<input className={`${adminInputClass} mt-1`} value={note} onChange={e => setNote(e.target.value)} maxLength={4000} /></label>
          {dirty && <p role="status" className="text-sm text-amber-700">Hãy lưu thay đổi trước khi gửi duyệt.</p>}
          <div className="flex flex-wrap gap-2">
            {selected.state === 'draft' && selected.permissions.edit && <><button className={primaryButtonClass} disabled={busy || Boolean(dirty)} onClick={() => void act('submit')}>Gửi rà soát</button><button className={secondaryButtonClass} disabled={busy || Boolean(dirty)} onClick={() => void act('trash')}>Chuyển vào thùng rác</button></>}
            {selected.state === 'submitted' && selected.permissions.review && <button className={primaryButtonClass} disabled={busy} onClick={() => void act('review')}>Xác nhận rà soát</button>}
            {selected.state === 'reviewed' && selected.permissions.publish && <button className={primaryButtonClass} disabled={busy} onClick={() => void act('publish')}>Phê duyệt & công bố</button>}
            {['submitted', 'reviewed'].includes(selected.state) && selected.permissions.reject && <button className={secondaryButtonClass} disabled={busy || !note.trim()} onClick={() => void act('reject')}>Trả lại để chỉnh sửa</button>}
            {selected.state === 'published' && selected.permissions.archive && <button className={secondaryButtonClass} disabled={busy} onClick={() => void act('archive')}>Thu hồi khỏi thư viện</button>}
            {['trash', 'archived'].includes(selected.state) && selected.permissions.edit && <button className={secondaryButtonClass} disabled={busy} onClick={() => void act('restore')}>Khôi phục thành bản nháp</button>}
            {selected.documentId && selected.state === 'published' && <><Link className={secondaryButtonClass} to={`/employee-lifecycle/knowledge-documents/${selected.documentId}`}>Xem bản công bố</Link>{selected.permissions.edit && <button className={secondaryButtonClass} disabled={busy} onClick={() => { setBusy(true); void sopManagementApi.create({ documentId: selected.documentId! }).then(({ data }) => open(data)).catch(e => setError(getErrorMessage(e))).finally(() => setBusy(false)) }}>Tạo bản sửa tiếp theo</button>}</>}
          </div>
        </div>
      </Panel>}
    </> : <Panel title="Các SOP được giao quản lý" action={canCreate && <button disabled={busy || !session.modules.length} className={primaryButtonClass} onClick={() => { setCreating(true); setSelected(null); setPreview(emptySop(session.modules[0]!.id)) }}><Plus size={16} /> Tạo SOP</button>}>
      <div className="flex flex-wrap gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <label className="relative min-w-56 flex-1"><span className="sr-only">Tìm SOP</span><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className={`${adminInputClass} pl-9`} placeholder="Tìm mã hoặc tên SOP…" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} /></label>
        <label><span className="sr-only">Trạng thái</span><select className={adminInputClass} value={state} onChange={e => { setState(e.target.value); setPage(1) }}><option value="">Tất cả trạng thái</option>{Object.entries(stateLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button className={secondaryButtonClass} disabled={loading} onClick={() => void refresh()} aria-label="Tải lại danh sách"><RefreshCw size={16} /></button>
      </div>
      {loading ? <TableSkeleton /> : rows.length ? <div className="divide-y divide-slate-200 dark:divide-slate-800">{rows.map(item => <button key={item.id} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-cyan-600 dark:hover:bg-slate-800" onClick={() => open(item)}><span><span className="text-xs text-slate-500">{item.preview.code}</span><span className="block text-sm font-bold">{item.preview.title}</span><span className="text-xs text-slate-500">{item.createdBy} · {new Date(item.updatedAt).toLocaleString('vi-VN')}</span></span><span className="rounded-md bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{stateLabels[item.state]}</span></button>)}</div> : <EmptyState title="Chưa có hồ sơ phù hợp" description="Tạo SOP mới hoặc mở Thư viện quy trình và chọn Tạo bản sửa. Quyền soạn, rà soát và công bố do quản trị viên phân công." />}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm dark:border-slate-800"><span>{total} hồ sơ · Trang {page}/{Math.max(1, Math.ceil(total / 12))}</span><div className="flex gap-2"><button className={secondaryButtonClass} disabled={page <= 1 || loading} onClick={() => setPage(v => v - 1)}>Trước</button><button className={secondaryButtonClass} disabled={page * 12 >= total || loading} onClick={() => setPage(v => v + 1)}>Sau</button></div></div>
    </Panel>}
  </div>
}
