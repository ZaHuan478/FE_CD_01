import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  Archive,
  BookOpen,
  Boxes,
  CheckCircle2,
  FileEdit,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useAdminCatalog, type AdminDocumentCreateInput, type AdminDocumentType, type AdminModule, type BusinessCluster, type ModuleInput } from '../../user-module-access/hooks/useAdminCatalog'
import { useAdminAccessContext } from '../../user-module-access/model/AdminAccessContext'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import { Select } from '../../../shared/ui/atoms/Select'
import { EmptyState, Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'

type CatalogTab = 'modules' | 'documents'
type ViewMode = 'table' | 'grid'
const typeLabels: Record<AdminDocumentType, string> = { procedure: 'Quy trình', policy: 'Quy định', guide: 'Hướng dẫn', glossary: 'Thuật ngữ', form: 'Biểu mẫu', catalog: 'Danh mục Master Data' }

export function CatalogManagement() {
  const admin = useAdminAccessContext()
  const [urlParams] = useSearchParams()
  const [tab, setTab] = useState<CatalogTab>('modules')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [query, setQuery] = useState(urlParams.get('q') ?? '')
  const [moduleId, setModuleId] = useState('')
  const [moduleCluster, setModuleCluster] = useState<BusinessCluster | 'all'>('all')
  const [type, setType] = useState<AdminDocumentType | 'all'>('all')
  const [page, setPage] = useState(1)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null)
  const [hidingModule, setHidingModule] = useState<{ module: AdminModule; status: 'draft' | 'archived' } | null>(null)
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const catalog = useAdminCatalog({ q: query, moduleId, type, page, pageSize: 20 })
  const filteredModules = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return admin.modules.filter(module => {
      const matchesCluster = moduleCluster === 'all' || (module.businessCluster ?? 'core') === moduleCluster
      const matchesTerm = !term || `${module.code} ${module.title} ${module.description ?? ''}`.toLocaleLowerCase('vi').includes(term)
      return matchesCluster && matchesTerm
    })
  }, [admin.modules, moduleCluster, query])

  const getModuleActions = (module: (typeof admin.modules)[number]) => [
    {
      id: 'edit', label: 'Sửa thông tin và thứ tự', icon: <Pencil className="size-4" />,
      disabled: admin.saving, onClick: () => setEditingModule(module)
    },
    {
      id: 'publish',
      label: 'Công bố phân hệ',
      icon: <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />,
      disabled: admin.saving || module.status === 'published',
      onClick: () => void admin.updateModule(module.id, 'published')
    },
    {
      id: 'draft',
      label: 'Chuyển về bản nháp',
      icon: <FileEdit className="size-4 text-amber-600 dark:text-amber-400" />,
      disabled: admin.saving || module.status === 'draft',
      onClick: () => setHidingModule({ module, status: 'draft' })
    },
    {
      id: 'archive',
      label: 'Lưu trữ phân hệ',
      icon: <Archive className="size-4 text-rose-600 dark:text-rose-400" />,
      disabled: admin.saving || module.status === 'archived',
      variant: 'danger' as const,
      divider: true,
      onClick: () => setHidingModule({ module, status: 'archived' })
    }
  ]

  const viewModeButtons = (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950/60">
      <button
        type="button"
        onClick={() => setViewMode('table')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
          viewMode === 'table'
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Xem dạng bảng"
      >
        <List className="size-3.5" />
        <span className="hidden sm:inline">Bảng</span>
      </button>
      <button
        type="button"
        onClick={() => setViewMode('grid')}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
          viewMode === 'grid'
            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
        title="Xem dạng lưới"
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">Lưới</span>
      </button>
    </div>
  )

  return <>
    {admin.error && <Feedback type="error">{admin.error}</Feedback>}
    {catalog.error && <Feedback type="error" action={<button type="button" onClick={() => void catalog.load()} className="font-bold underline">Thử lại</button>}>{catalog.error}</Feedback>}
    <div className="mb-4 flex w-fit rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900" role="tablist" aria-label="Loại danh mục">
      <Tab active={tab === 'modules'} onClick={() => setTab('modules')} icon={<Boxes className="size-4" />}>Phân hệ</Tab>
      <Tab active={tab === 'documents'} onClick={() => setTab('documents')} icon={<BookOpen className="size-4" />}>Tài liệu</Tab>
    </div>
    {tab === 'modules' ? <Panel>
      <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-4 sm:grid-cols-4 xl:grid-cols-5 dark:border-slate-800">
        <button type="button" onClick={() => setModuleCluster('all')} className={`rounded-lg border px-3 py-2 text-left ${moduleCluster === 'all' ? 'border-[#155e75] bg-cyan-50 dark:bg-cyan-950/30' : 'border-slate-200 dark:border-slate-800'}`}><span className="block text-xs font-bold text-slate-500">Tất cả</span><strong className="text-lg text-slate-900 dark:text-white">{admin.modules.length}</strong></button>
        {(Object.entries(clusterLabels) as Array<[BusinessCluster, string]>).map(([cluster, label]) => <button key={cluster} type="button" onClick={() => setModuleCluster(cluster)} className={`rounded-lg border px-3 py-2 text-left ${moduleCluster === cluster ? 'border-[#155e75] bg-cyan-50 dark:bg-cyan-950/30' : 'border-slate-200 dark:border-slate-800'}`}><span className="block truncate text-xs font-bold text-slate-500">{label}</span><strong className="text-lg text-slate-900 dark:text-white">{admin.modules.filter(module => (module.businessCluster ?? 'core') === cluster).length}</strong></button>)}
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Tìm phân hệ</span>
          <Search className="absolute left-3 top-3 size-4 text-slate-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Tìm mã, tên hoặc mô tả phân hệ"
            className={`${adminInputClass} pl-9`}
          />
        </label>
        <div className="flex items-center gap-2 shrink-0">
          {viewModeButtons}
          <button type="button" onClick={() => setShowModuleForm(true)} className={`${primaryButtonClass} shrink-0`}>
            <Plus className="size-4" />
            Tạo phân hệ
          </button>
        </div>
      </div>
      {admin.loading ? (
        <TableSkeleton />
      ) : !filteredModules.length ? (
        <EmptyState title="Không có phân hệ phù hợp" description="Thử thay đổi từ khóa tìm kiếm." />
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50">
              <tr>
                <th className="px-4 py-3">Mã phân hệ</th>
                <th className="px-4 py-3">Tên phân hệ</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Cụm / Thứ tự</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredModules.map(module => (
                <tr key={module.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-black text-[#155e75] dark:text-cyan-400">
                    {module.code}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{module.title}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-md">
                    {module.description || 'Chưa có mô tả.'}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold capitalize dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {clusterLabels[module.businessCluster ?? 'core']} · {module.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${
                        module.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : module.status === 'draft'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {module.status === 'published' ? 'Công bố' : module.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminActionMenu items={getModuleActions(module)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 p-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredModules.map(module => (
            <article key={module.id} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-400">{module.code}</p>
                  <h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white">{module.title}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                      module.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : module.status === 'draft'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {module.status === 'published' ? 'Công bố' : module.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                  </span>
                  <AdminActionMenu items={getModuleActions(module)} />
                </div>
              </div>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{module.description || 'Chưa có mô tả.'}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{clusterLabels[module.businessCluster ?? 'core']} · {module.sortOrder}</span>
                <Select
                  visualSize="compact"
                  aria-label={`Trạng thái ${module.title}`}
                  value={module.status}
                  disabled={admin.saving}
                  onChange={event => { const status = event.target.value as typeof module.status; if (status === 'published') void admin.updateModule(module.id, status); else setHidingModule({ module, status }) }}
                  className="w-32"
                >
                  <option value="published">Công bố</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </Select>
              </div>
            </article>
          ))}
        </div>
      )}
    </Panel> : <Panel title="Danh mục tài liệu" description="API hiện trả về các tài liệu đã công bố. Sửa và lưu trữ chưa có endpoint nên không hiển thị thao tác giả." action={<button type="button" onClick={() => setShowDocumentForm(true)} className={primaryButtonClass}><Plus className="size-4" />Tạo tài liệu</button>}>
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center dark:border-slate-800">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Tìm tài liệu</span>
          <Search className="absolute left-3 top-3.5 size-4 text-slate-400" />
          <input
            value={query}
            onChange={event => { setQuery(event.target.value); setPage(1) }}
            placeholder="Tìm mã hoặc tên tài liệu"
            className={`${adminInputClass} pl-9`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Lọc theo phân hệ"
            value={moduleId}
            onChange={event => { setModuleId(event.target.value); setPage(1) }}
            className="w-44"
          >
            <option value="">Tất cả phân hệ</option>
            {admin.modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}
          </Select>
          <Select
            aria-label="Lọc loại tài liệu"
            value={type}
            onChange={event => { setType(event.target.value as typeof type); setPage(1) }}
            className="w-36"
          >
            <option value="all">Mọi loại</option>
            {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          {viewModeButtons}
        </div>
      </div>
      {catalog.loading ? (
        <TableSkeleton />
      ) : !catalog.data.length ? (
        <EmptyState title="Không có tài liệu phù hợp" description="Thử thay đổi bộ lọc hoặc tạo tài liệu mới." />
      ) : viewMode === 'table' ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50">
                <tr>
                  <th className="px-4 py-3">Tài liệu</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Phân hệ</th>
                  <th className="px-4 py-3">Phiên bản</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {catalog.data.map(document => (
                  <tr key={document.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 dark:text-white">{document.title}</p>
                      <p className="font-mono text-xs text-slate-500">{document.code}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">
                      <span className="inline-block rounded-md bg-[#155e75]/10 px-2 py-0.5 text-xs font-bold text-[#155e75] dark:bg-cyan-950/50 dark:text-cyan-300">
                        {typeLabels[document.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-slate-600 dark:text-slate-400">
                      {document.moduleIds.length} phân hệ
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums font-bold text-slate-700 dark:text-slate-300">
                      v{document.version ?? 1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
            <span>{catalog.pagination.total} tài liệu</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className={secondaryButtonClass}>Trước</button>
              <span className="grid min-h-10 place-items-center px-2 font-mono">{page}</span>
              <button type="button" disabled={page * catalog.pagination.pageSize >= catalog.pagination.total} onClick={() => setPage(value => value + 1)} className={secondaryButtonClass}>Sau</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 p-4 md:grid-cols-2 2xl:grid-cols-3">
            {catalog.data.map(document => (
              <article key={document.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-400">{document.code}</p>
                    <h3 className="mt-1 text-sm font-black text-slate-900 dark:text-white">{document.title}</h3>
                  </div>
                  <span className="rounded-md bg-[#155e75]/10 px-2 py-0.5 text-xs font-bold text-[#155e75] dark:bg-cyan-950/50 dark:text-cyan-300 shrink-0">
                    {typeLabels[document.type]}
                  </span>
                </div>
                <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500 line-clamp-2">
                  {document.summary || 'Chưa có tóm tắt.'}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                  <span>{document.moduleIds.length} phân hệ liên kết</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">v{document.version ?? 1}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
            <span>{catalog.pagination.total} tài liệu</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className={secondaryButtonClass}>Trước</button>
              <span className="grid min-h-10 place-items-center px-2 font-mono">{page}</span>
              <button type="button" disabled={page * catalog.pagination.pageSize >= catalog.pagination.total} onClick={() => setPage(value => value + 1)} className={secondaryButtonClass}>Sau</button>
            </div>
          </div>
        </>
      )}
    </Panel>}
    {(showModuleForm || editingModule) && <ModuleDialog module={editingModule} saving={admin.saving} onClose={() => { setShowModuleForm(false); setEditingModule(null) }} onSubmit={async body => { const saved = editingModule ? await admin.updateModule(editingModule.id, body) : await admin.createModule(body); if (saved) { setShowModuleForm(false); setEditingModule(null) } }} />}
    {hidingModule && <ModalDialog title={hidingModule.status === 'archived' ? 'Lưu trữ phân hệ' : 'Ẩn phân hệ khỏi menu'} onClose={() => setHidingModule(null)}><div className="space-y-4"><p className="text-sm">Phân hệ <strong>{hidingModule.module.title}</strong> sẽ không còn xuất hiện trong thanh phân hệ của người đọc.</p><p className="text-sm text-slate-500">Hệ thống giữ tài liệu và lịch sử. Nếu phân hệ còn SOP đã công bố, hãy chuyển phân hệ của SOP hoặc lưu trữ SOP trước; hệ thống sẽ chặn việc ẩn để tránh mất đường truy cập.</p><div className="flex justify-end gap-2"><button type="button" disabled={admin.saving} onClick={() => setHidingModule(null)} className={secondaryButtonClass}>Hủy</button><button type="button" disabled={admin.saving} onClick={async () => { if (await admin.updateModule(hidingModule.module.id, hidingModule.status)) setHidingModule(null) }} className={primaryButtonClass}>{admin.saving ? 'Đang kiểm tra…' : 'Xác nhận'}</button></div></div></ModalDialog>}
    {showDocumentForm && <CreateDocumentDialog saving={catalog.saving} modules={admin.modules} onClose={() => setShowDocumentForm(false)} onSubmit={async body => { if (await catalog.createDocument(body)) setShowDocumentForm(false) }} />}
  </>
}

function Tab({ active, icon, onClick, children }: { active: boolean; icon: ReactNode; onClick: () => void; children: ReactNode }) { return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-bold ${active ? 'bg-[#155e75] text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{icon}{children}</button> }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span>{children}</label> }

const clusterLabels = { core: 'Vận hành lõi', people: 'Phát triển con người', organization: 'Quản trị tổ chức', platform: 'Nền tảng' }
const iconLabels = { layers: 'Phân hệ', users: 'Nhân sự', briefcase: 'Công việc', clipboard: 'Checklist', clock: 'Thời gian', calendar: 'Lịch', wallet: 'Thu nhập', shield: 'Bảo vệ', book: 'Tài liệu' }

function ModuleDialog({ module, saving, onClose, onSubmit }: { module: AdminModule | null; saving: boolean; onClose: () => void; onSubmit: (body: ModuleInput) => Promise<void> }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    void onSubmit({ code: String(data.get('code')).trim(), title: String(data.get('title')).trim(), description: String(data.get('description')).trim(), moduleType: module?.moduleType ?? 'business', businessCluster: data.get('businessCluster') as ModuleInput['businessCluster'], iconKey: data.get('iconKey') as ModuleInput['iconKey'], sortOrder: Number(data.get('sortOrder')) })
  }
  return <ModalDialog title={module ? 'Sửa phân hệ' : 'Tạo phân hệ'} description="Tên, cụm và thứ tự được dùng trực tiếp trên thanh phân hệ. Số thứ tự nhỏ hiển thị trước." onClose={onClose}><form onSubmit={submit} className="grid gap-4">
    <Field label="Mã phân hệ"><input required maxLength={100} name="code" defaultValue={module?.code} className={adminInputClass} /></Field>
    <Field label="Tên phân hệ"><input required maxLength={250} name="title" defaultValue={module?.title} className={adminInputClass} /></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Cụm nghiệp vụ"><Select name="businessCluster" defaultValue={module?.businessCluster ?? 'core'}>{Object.entries(clusterLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select></Field><Field label="Biểu tượng"><Select name="iconKey" defaultValue={module?.iconKey ?? 'layers'}>{Object.entries(iconLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select></Field></div>
    <Field label="Thứ tự hiển thị"><input required type="number" step={1} name="sortOrder" defaultValue={module?.sortOrder ?? 100} className={adminInputClass} /></Field>
    <Field label="Mô tả"><textarea maxLength={10000} name="description" defaultValue={module?.description ?? ''} rows={3} className={`${adminInputClass} h-auto py-2`} /></Field>
    <div className="flex justify-end gap-2"><button type="button" onClick={onClose} disabled={saving} className={secondaryButtonClass}>Hủy</button><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang lưu…' : module ? 'Lưu thay đổi' : 'Tạo phân hệ'}</button></div>
  </form></ModalDialog>
}

function CreateDocumentDialog({ saving, modules, onClose, onSubmit }: { saving: boolean; modules: ReturnType<typeof useAdminAccessContext>['modules']; onClose: () => void; onSubmit: (body: AdminDocumentCreateInput) => Promise<void> }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); void onSubmit({ code: String(data.get('code')), title: String(data.get('title')), type: data.get('type') as AdminDocumentType, summary: String(data.get('summary')), moduleIds: data.getAll('moduleIds').map(String), content: { body: String(data.get('content')) } }) }
  return <ModalDialog title="Tạo tài liệu" description="Tài liệu mới được backend tạo phiên bản đầu tiên và công bố ngay." onClose={onClose}><form onSubmit={submit} className="grid gap-4"><Field label="Mã tài liệu"><input required name="code" className={adminInputClass} /></Field><Field label="Tên tài liệu"><input required name="title" className={adminInputClass} /></Field><Field label="Loại"><Select name="type">{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field><Field label="Phân hệ"><Select required multiple name="moduleIds" className="h-32">{modules.filter(module => module.status !== 'archived').map(module => <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</Select><span className="text-xs font-normal text-slate-500">Giữ Ctrl để chọn nhiều phân hệ.</span></Field><Field label="Tóm tắt"><textarea required name="summary" rows={2} className={`${adminInputClass} h-auto py-2`} /></Field><Field label="Nội dung"><textarea required name="content" rows={6} className={`${adminInputClass} h-auto py-2`} /></Field><button disabled={saving} className={primaryButtonClass}>{saving ? 'Đang tạo' : 'Tạo và công bố'}</button></form></ModalDialog>
}
