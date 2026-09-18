import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { knowledgeApi, type KnowledgePage } from '../../../features/sop-viewer/model/knowledgeModel'
import { useSession } from '../../../features/authentication/model/session'
import { Feedback, Panel, TableSkeleton, secondaryButtonClass, adminInputClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import { publishedSopDestination } from '../model/moduleNavigation'

export function ProcessLibraryWorkspace() {
  const session = useSession()
  const canEdit = session.capabilities.includes('sop.edit') || ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const moduleId = params.get('libraryModule') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)
  const [input, setInput] = useState(query)
  const [result, setResult] = useState<KnowledgePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const change = (key: string, value: string) => setParams(previous => {
    const next = new URLSearchParams(previous)
    if (value) next.set(key, value); else next.delete(key)
    if (key !== 'page') next.delete('page')
    return next
  })
  useEffect(() => { setInput(query) }, [query])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError('')
    void knowledgeApi.catalogDocuments({ q: query, moduleId: moduleId || undefined, type: 'procedure', page, pageSize: 12 }, controller.signal)
      .then(response => { if (!controller.signal.aborted) setResult(response) })
      .catch(reason => { if (!controller.signal.aborted) { setResult(null); setError(reason instanceof Error ? reason.message : 'Không tải được thư viện SOP') } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [query, moduleId, page, refresh, session.accountId])
  const totalPages = Math.max(1, Math.ceil((result?.pagination.total ?? 0) / 12))
  return <Panel title="Thư viện quy trình đã công bố" description="Tất cả SOP đã công bố trong phạm vi bạn được xem, bao gồm SOP chuyển hóa từ tài liệu tải lên." action={<button type="button" onClick={() => setRefresh(value => value + 1)} className={secondaryButtonClass}><RefreshCw className="size-4" />Làm mới</button>}>
    <form onSubmit={event => { event.preventDefault(); change('q', input.trim()) }} className="flex flex-wrap items-end gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
      <label className="grid min-w-48 flex-1 gap-1 text-sm font-bold">Tìm quy trình<input value={input} onChange={event => setInput(event.target.value)} placeholder="Tên, mã SOP hoặc nội dung…" className={adminInputClass} /></label>
      <label className="grid gap-1 text-sm font-bold">Phân hệ<Select value={moduleId} onChange={event => change('libraryModule', event.target.value)} className={adminInputClass}><option value="">Tất cả phân hệ</option>{session.modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</Select></label>
      <button type="submit" className={secondaryButtonClass}>Tìm kiếm</button>
    </form>
    {error && <div className="p-4"><Feedback type="error">{error}</Feedback></div>}
    {loading ? <TableSkeleton /> : <>
      <p role="status" className="px-4 pt-4 text-sm text-slate-500">{result?.pagination.total ?? 0} quy trình đã công bố</p>
      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{result?.data.map(item => <article key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><Link to={publishedSopDestination(item)} className="block rounded-lg transition-colors hover:text-sky-700 focus-visible:outline-sky-600 dark:hover:text-sky-300">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300"><BookOpen className="size-4" /><span>{item.code}</span><span className="ml-auto text-emerald-700 dark:text-emerald-300">Đã công bố</span></div>
        <h3 className="mt-3 font-bold">{item.title}</h3>
        {item.summary && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.summary}</p>}
        <p className="mt-3 text-xs text-slate-500">Phiên bản {item.version ?? 1} · {item.moduleIds.map(id => session.modules.find(module => module.id === id)?.title ?? id).join(', ')}</p>
        <span className="mt-3 inline-block text-sm font-bold text-[#155e75] dark:text-cyan-300">Xem quy trình & chi tiết →</span>
      </Link>{canEdit && <Link to={`/employee-lifecycle/sop-management?source=${encodeURIComponent(item.id)}`} className="mt-3 inline-block rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-[#155e75] hover:bg-slate-50 dark:border-slate-700 dark:text-cyan-300 dark:hover:bg-slate-800">Tạo bản sửa</Link>}</article>)}</div>
      {!result?.data.length && !error && <p className="p-6 text-center text-sm text-slate-500">Không có SOP đã công bố phù hợp với bộ lọc. Tài liệu chỉ mới upload hoặc còn bản nháp sẽ chưa xuất hiện ở đây.</p>}
      <nav aria-label="Phân trang thư viện" className="flex items-center justify-end gap-3 border-t border-slate-200 p-4 dark:border-slate-800"><button type="button" disabled={page <= 1} onClick={() => change('page', String(page - 1))} className={secondaryButtonClass}><ChevronLeft className="size-4" />Trước</button><span className="text-sm">Trang {page}/{totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => change('page', String(page + 1))} className={secondaryButtonClass}>Sau<ChevronRight className="size-4" /></button></nav>
    </>}
  </Panel>
}
