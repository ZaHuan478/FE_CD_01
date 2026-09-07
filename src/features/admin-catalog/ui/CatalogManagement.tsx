import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { BookOpen, Boxes, Plus, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useAdminCatalog, type AdminDocumentCreateInput, type AdminDocumentType } from '../../user-module-access/hooks/useAdminCatalog'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import { Select } from '../../../shared/ui/atoms/Select'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

type CatalogTab = 'modules' | 'documents'
const typeLabels: Record<AdminDocumentType, string> = { procedure: 'Quy trình', policy: 'Quy định', guide: 'Hướng dẫn', glossary: 'Thuật ngữ', form: 'Biểu mẫu' }

export function CatalogManagement() {
  const admin = useAdminAccessContext()
  const [urlParams] = useSearchParams()
  const [tab, setTab] = useState<CatalogTab>('modules')
  const [query, setQuery] = useState(urlParams.get('q') ?? '')
  const [moduleId, setModuleId] = useState('')
  const [type, setType] = useState<AdminDocumentType | 'all'>('all')
  const [page, setPage] = useState(1)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const catalog = useAdminCatalog({ q: query, moduleId, type, page, pageSize: 20 })
  const filteredModules = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return term ? admin.modules.filter(module => `${module.code} ${module.title} ${module.description ?? ''}`.toLocaleLowerCase('vi').includes(term)) : admin.modules
  }, [admin.modules, query])

  return <>
    {admin.error && <Feedback type="error">{admin.error}</Feedback>}
    {admin.notice && <Feedback type="success">{admin.notice}</Feedback>}
    {catalog.error && <Feedback type="error" action={<button type="button" onClick={() => void catalog.load()} className="font-bold underline">Thử lại</button>}>{catalog.error}</Feedback>}
    {catalog.notice && <Feedback type="success">{catalog.notice}</Feedback>}
    <div className="mb-4 flex w-fit rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label="Loại danh mục">
      <Tab active={tab === 'modules'} onClick={() => setTab('modules')} icon={<Boxes className="size-4" />}>Phân hệ</Tab>
      <Tab active={tab === 'documents'} onClick={() => setTab('documents')} icon={<BookOpen className="size-4" />}>Tài liệu</Tab>
    </div>
    {tab === 'modules' ? <Panel>
      <div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800"><label className="relative block min-w-0 flex-1"><span className="sr-only">Tìm phân hệ</span><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm mã, tên hoặc mô tả phân hệ" className={`${adminInputClass} pl-9`} /></label><button type="button" onClick={() => setShowModuleForm(true)} className={`${primaryButtonClass} shrink-0`}><Plus className="size-4" />Tạo phân hệ</button></div>
      {admin.loading ? <TableSkeleton /> : !filteredModules.length ? <EmptyState title="Không có phân hệ phù hợp" description="Thử thay đổi từ khóa tìm kiếm." /> : <div className="grid gap-3 p-4 md:grid-cols-2 2xl:grid-cols-3">{filteredModules.map(module => <article key={module.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-400">{module.code}</p><h3 className="mt-1 text-sm font-black">{module.title}</h3></div><span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold dark:bg-slate-800">{module.status}</span></div><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{module.description || 'Chưa có mô tả.'}</p><Select aria-label={`Trạng thái ${module.title}`} value={module.status} disabled={admin.saving} onChange={event => void admin.updateModule(module.id, event.target.value as typeof module.status)} className="mt-3"><option value="published">Công bố</option><option value="draft">Bản nháp</option><option value="archived">Lưu trữ</option></Select></article>)}</div>}
    </Panel> : <Panel title="Danh mục tài liệu" description="API hiện trả về các tài liệu đã công bố. Sửa và lưu trữ chưa có endpoint nên không hiển thị thao tác giả." action={<button type="button" onClick={() => setShowDocumentForm(true)} className={primaryButtonClass}><Plus className="size-4" />Tạo tài liệu</button>}>
      <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(240px,1fr)_200px_180px] dark:border-slate-800"><label className="relative"><span className="sr-only">Tìm tài liệu</span><Search className="absolute left-3 top-3.5 size-4 text-slate-400" /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Tìm mã hoặc tên tài liệu" className={`${adminInputClass} pl-9`} /></label><Select aria-label="Lọc theo phân hệ" value={moduleId} onChange={event => { setModuleId(event.target.value); setPage(1) }}><option value="">Tất cả phân hệ</option>{admin.modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</Select><Select aria-label="Lọc loại tài liệu" value={type} onChange={event => { setType(event.target.value as typeof type); setPage(1) }}><option value="all">Mọi loại</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></div>
      {catalog.loading ? <TableSkeleton /> : !catalog.data.length ? <EmptyState title="Không có tài liệu phù hợp" description="Thử thay đổi bộ lọc hoặc tạo tài liệu mới." /> : <><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50"><tr><th className="px-4 py-3">Tài liệu</th><th className="px-4 py-3">Loại</th><th className="px-4 py-3">Phân hệ</th><th className="px-4 py-3">Phiên bản</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{catalog.data.map(document => <tr key={document.id}><td className="px-4 py-3"><p className="font-bold">{document.title}</p><p className="font-mono text-xs text-slate-500">{document.code}</p></td><td className="px-4 py-3 text-xs font-bold">{typeLabels[document.type]}</td><td className="px-4 py-3 font-mono text-xs tabular-nums">{document.moduleIds.length}</td><td className="px-4 py-3 font-mono text-xs tabular-nums">v{document.version ?? 1}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800"><span>{catalog.pagination.total} tài liệu</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className={secondaryButtonClass}>Trước</button><span className="grid min-h-10 place-items-center px-2 font-mono">{page}</span><button type="button" disabled={page * catalog.pagination.pageSize >= catalog.pagination.total} onClick={() => setPage(value => value + 1)} className={secondaryButtonClass}>Sau</button></div></div></>}
    </Panel>}
    {showModuleForm && <CreateModuleDialog saving={admin.saving} onClose={() => setShowModuleForm(false)} onSubmit={async body => { if (await admin.createModule(body)) setShowModuleForm(false) }} />}
    {showDocumentForm && <CreateDocumentDialog saving={catalog.saving} modules={admin.modules} onClose={() => setShowDocumentForm(false)} onSubmit={async body => { if (await catalog.createDocument(body)) setShowDocumentForm(false) }} />}
  </>
}

function Tab({ active, icon, onClick, children }: { active: boolean; icon: ReactNode; onClick: () => void; children: ReactNode }) { return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-bold ${active ? 'bg-[#155e75] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{icon}{children}</button> }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span>{children}</label> }

function CreateModuleDialog({ saving, onClose, onSubmit }: { saving: boolean; onClose: () => void; onSubmit: (body: { code: string; title: string; description?: string; moduleType: string }) => Promise<void> }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ code: String(data.get('code')), title: String(data.get('title')), description: String(data.get('description')), moduleType: String(data.get('moduleType')) }) }
  return <ModalDialog title="Tạo phân hệ" onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Mã phân hệ"><input required name="code" className={adminInputClass} /></Field><Field label="Tên phân hệ"><input required name="title" className={adminInputClass} /></Field><Field label="Loại phân hệ"><input required name="moduleType" defaultValue="business" className={adminInputClass} /></Field><Field label="Mô tả"><textarea name="description" rows={3} className={`${adminInputClass} h-auto py-2`} /></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang tạo' : 'Tạo phân hệ'}</button></form></ModalDialog>
}

function CreateDocumentDialog({ saving, modules, onClose, onSubmit }: { saving: boolean; modules: ReturnType<typeof useAdminAccessContext>['modules']; onClose: () => void; onSubmit: (body: AdminDocumentCreateInput) => Promise<void> }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ code: String(data.get('code')), title: String(data.get('title')), type: data.get('type') as AdminDocumentType, summary: String(data.get('summary')), moduleIds: data.getAll('moduleIds').map(String), content: { body: String(data.get('content')) } }) }
  return <ModalDialog title="Tạo tài liệu" description="Tài liệu mới được backend tạo phiên bản đầu tiên và công bố ngay." onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Mã tài liệu"><input required name="code" className={adminInputClass} /></Field><Field label="Tên tài liệu"><input required name="title" className={adminInputClass} /></Field><Field label="Loại"><Select name="type">{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field><Field label="Phân hệ"><Select required multiple name="moduleIds" className="h-32">{modules.filter(module => module.status !== 'archived').map(module => <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</Select><span className="text-xs font-normal text-slate-500">Giữ Ctrl để chọn nhiều phân hệ.</span></Field><Field label="Tóm tắt"><textarea required name="summary" rows={2} className={`${adminInputClass} h-auto py-2`} /></Field><Field label="Nội dung"><textarea required name="content" rows={6} className={`${adminInputClass} h-auto py-2`} /></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang tạo' : 'Tạo và công bố'}</button></form></ModalDialog>
}
