import { useEffect, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { administrationGateway, type AuditResult } from '../model/administrationGateway'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
const empty: AuditResult = { items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1 }, filters: { entityTypes: [], actions: [] } }
export function AuditLogPanel({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState(empty)
  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('')
    void administrationGateway.audit({ page, pageSize: compact ? 5 : 20, search, entityType, action }, controller.signal)
      .then(data => { if (!controller.signal.aborted) setResult(data) })
      .catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được nhật ký') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [page, search, entityType, action, compact])
  const submit = (event: FormEvent) => { event.preventDefault(); setPage(1); setSearch(draft.trim()) }
  return <Panel title={compact ? 'Hoạt động gần đây' : 'Nhật ký hệ thống'} description={`${result.pagination.total} sự kiện được ghi nhận`}>
    {!compact && <form onSubmit={submit} className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[minmax(260px,1fr)_200px_220px_auto] dark:border-slate-800">
      <label className="relative"><span className="sr-only">Tìm nhật ký</span><Search className="absolute left-3 top-3.5 size-4 text-slate-400" /><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Người thao tác, đối tượng, hành động" className={`${adminInputClass} pl-9`} /></label>
      <Select aria-label="Lọc loại đối tượng" value={entityType} onChange={event => { setEntityType(event.target.value); setPage(1) }}><option value="">Mọi đối tượng</option>{result.filters.entityTypes.map(value => <option key={value}>{value}</option>)}</Select>
      <Select aria-label="Lọc hành động" value={action} onChange={event => { setAction(event.target.value); setPage(1) }}><option value="">Mọi hành động</option>{result.filters.actions.map(value => <option key={value}>{value}</option>)}</Select>
      <button className={secondaryButtonClass}><Search className="size-4" />Tìm kiếm</button>
    </form>}
    {error && <div className="p-4"><Feedback type="error">{error}</Feedback></div>}
    {loading ? <TableSkeleton rows={compact ? 5 : 10} /> : !result.items.length ? <EmptyState title="Chưa có sự kiện" description="Không tìm thấy nhật ký phù hợp với bộ lọc." /> : <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50"><tr><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3">Người thao tác</th><th className="px-4 py-3">Hành động</th><th className="px-4 py-3">Đối tượng</th><th className="px-4 py-3">Chi tiết</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{result.items.map(item => <tr key={item.id}><td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('vi-VN')}</td><td className="px-4 py-3 font-bold">{item.actor?.name ?? 'Hệ thống'}</td><td className="px-4 py-3"><span className="rounded-md bg-cyan-50 px-2 py-1 font-mono text-xs font-bold text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">{item.action}</span></td><td className="px-4 py-3"><p className="font-semibold">{item.entityType}</p><p className="font-mono text-xs text-slate-500">{item.entityId}</p></td><td className="px-4 py-3"><details><summary className="cursor-pointer text-xs font-bold text-[#155e75]">Xem thay đổi</summary><pre className="mt-2 max-w-md overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] text-slate-100">{JSON.stringify({ before: item.before, after: item.after }, null, 2)}</pre></details></td></tr>)}</tbody></table></div>}
    {!compact && result.pagination.totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800"><span>Trang {result.pagination.page}/{result.pagination.totalPages}</span><div className="flex gap-2"><button type="button" className={secondaryButtonClass} disabled={page <= 1} onClick={() => setPage(value => value - 1)}><ChevronLeft className="size-4" />Trước</button><button type="button" className={secondaryButtonClass} disabled={page >= result.pagination.totalPages} onClick={() => setPage(value => value + 1)}>Sau<ChevronRight className="size-4" /></button></div></div>}
  </Panel>
}



