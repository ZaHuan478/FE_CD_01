import { useEffect, useState, useMemo, type FormEvent, type ReactNode } from 'react'
import {
  Archive,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  Eye,
  FileText,
  Filter,
  Layers,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import {
  getErrorMessage,
  systemGuideApi,
  systemGlossaryApi,
  type GuideAudience,
  type SystemGuide,
  type SystemGuideContent,
  type SystemGuideInput,
  type GlossaryTerm
} from '../model/adminSystemGuideModel'
import { AdminGlossaryTab } from './AdminGlossaryTab'
import {
  EmptyState,
  Feedback,
  Panel,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'

const emptyContent: SystemGuideContent = {
  purpose: '',
  audience: '',
  accessPath: '',
  prerequisites: [],
  steps: [{ title: '', description: '' }],
  result: '',
  permissions: [],
  commonErrors: [],
  relatedRoutes: [],
  support: ''
}

export function AdminSystemGuides() {
  const [items, setItems] = useState<SystemGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modals state
  const [editing, setEditing] = useState<SystemGuide | 'new' | null>(null)
  const [previewing, setPreviewing] = useState<SystemGuide | null>(null)
  const [archivingGuide, setArchivingGuide] = useState<SystemGuide | null>(null)

  // Top tab: 'guides' | 'glossary'
  const [adminTab, setAdminTab] = useState<'guides' | 'glossary'>('guides')

  const load = () => {
    setLoading(true)
    setError('')
    systemGuideApi
      .adminList()
      .then((response) => setItems(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const act = async (
    operation: () => Promise<unknown>,
    successMessage: string
  ) => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await operation()
      setSuccess(successMessage)
      load()
      return (res as { data?: any })?.data
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setSaving(false)
    }
  }

  // Filter categories
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category)))
  }, [items])

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
      if (!searchKeyword.trim()) return true
      const kw = searchKeyword.trim().toLowerCase()
      return (
        item.title.toLowerCase().includes(kw) ||
        item.slug.toLowerCase().includes(kw) ||
        (item.routePath || '').toLowerCase().includes(kw)
      )
    })
  }, [items, statusFilter, selectedCategory, searchKeyword])

  const counts = useMemo(() => {
    return {
      all: items.length,
      published: items.filter((i) => i.status === 'published').length,
      draft: items.filter((i) => i.status === 'draft').length,
      archived: items.filter((i) => i.status === 'archived').length
    }
  }, [items])

  return (
    <div className="space-y-4">
      {error && <Feedback type="error">{error}</Feedback>}
      {success && <Feedback type="success">{success}</Feedback>}

      {/* Top Admin Section Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
        <button
          type="button"
          onClick={() => setAdminTab('guides')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            adminTab === 'guides'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="size-4 text-cyan-600 dark:text-cyan-400" />
          <span>Hướng dẫn hệ thống</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('glossary')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            adminTab === 'glossary'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookMarked className="size-4 text-cyan-600 dark:text-cyan-400" />
          <span>Từ điển thuật ngữ</span>
        </button>
      </div>

      {adminTab === 'glossary' ? (
        <AdminGlossaryTab />
      ) : (
        <>
          {/* Main Admin Panel */}
          <Panel
        title="Quản lý Hướng dẫn sử dụng hệ thống"
        description="Soạn thảo, quản lý phiên bản và công bố hướng dẫn sản phẩm độc lập với dữ liệu SOP mẫu."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={load} className={secondaryButtonClass}>
              <RefreshCw className="size-4" />
              Làm mới
            </button>
            <button
              type="button"
              onClick={() => setEditing('new')}
              className={primaryButtonClass}
            >
              <Plus className="size-4" />
              Tạo hướng dẫn mới
            </button>
          </div>
        }
      >
        {/* Filter and Search Bar */}
        <div className="border-b border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Tất cả ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'published'
                    ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Đã công bố ({counts.published})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'draft'
                    ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Bản nháp ({counts.draft})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('archived')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'archived'
                    ? 'bg-white text-slate-700 shadow-xs dark:bg-slate-900 dark:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Lưu trữ ({counts.archived})
              </button>
            </div>

            {/* Category and Search Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-slate-300 bg-white pl-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-[#155e75] focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  aria-label="Lọc theo danh mục"
                >
                  <option value="all">Mọi danh mục</option>
                  {categories
                    .filter((c) => c !== 'all')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
                <Filter className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm theo tên hoặc slug..."
                  className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#155e75] focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guides Table */}
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-slate-950/60">
                <tr>
                  <th className="px-4 py-3">Hướng dẫn</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Đối tượng & Quyền</th>
                  <th className="px-4 py-3">Phiên bản</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Cập nhật</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    {/* Title and route */}
                    <td className="px-4 py-3">
                      <p className="font-black text-slate-900 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 max-w-sm truncate text-xs text-slate-500 font-mono">
                        /{item.slug} {item.routePath ? `• ${item.routePath}` : ''}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>

                    {/* Audience and permission */}
                    <td className="px-4 py-3 text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.audienceMode}
                      </div>
                      {item.requiredPermission && (
                        <div className="mt-0.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                          {item.requiredPermission}
                        </div>
                      )}
                    </td>

                    {/* Version */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        v{item.version}
                      </span>
                      {item.versionStatus === 'draft' && (
                        <span className="ml-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          có bản nháp
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <StatusBadge value={item.status} />
                    </td>

                    {/* Updated At */}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{formatDate(item.updatedAt)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewing(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Xem trước hiển thị"
                        >
                          <Eye className="size-3.5" />
                          Xem trước
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className={secondaryButtonClass}
                        >
                          <Edit3 className="size-3.5" />
                          Sửa
                        </button>

                        {item.versionStatus === 'draft' && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void act(
                                () => systemGuideApi.publish(item.id),
                                `Đã công bố thành công ${item.title}.`
                              )
                            }
                            className={primaryButtonClass}
                          >
                            <Rocket className="size-3.5" />
                            Công bố
                          </button>
                        )}

                        {item.status !== 'archived' && (
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => setArchivingGuide(item)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                          >
                            <Archive className="size-3.5" />
                            Lưu trữ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Không tìm thấy hướng dẫn nào"
            description="Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
          />
        )}
      </Panel>

      {/* Guide Editor Dialog */}
      {editing && (
        <GuideEditor
          guide={editing === 'new' ? null : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={async (body, termIds) => {
            const result = await act(
              () =>
                editing === 'new'
                  ? systemGuideApi.create(body)
                  : systemGuideApi.update(editing.id, body),
              editing === 'new'
                ? 'Đã tạo bản nháp hướng dẫn mới.'
                : 'Đã lưu thay đổi vào bản nháp.'
            )
            const guideId = editing === 'new' ? result?.id : editing.id
            if (guideId && termIds) {
              await systemGlossaryApi.associateGuide({ guideId, termIds })
            }
            setEditing(null)
          }}
        />
      )}

      {/* Guide Preview Modal */}
      {previewing && (
        <GuidePreviewModal
          guide={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}

      {/* Archive Confirmation Dialog */}
      {archivingGuide && (
        <ModalDialog
          title="Xác nhận lưu trữ hướng dẫn"
          description="Hướng dẫn sau khi lưu trữ sẽ bị ẩn khỏi trung tâm trợ giúp của người dùng."
          onClose={() => setArchivingGuide(null)}
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="flex items-center gap-2 font-black">
                <ShieldAlert className="size-4 text-amber-600" />
                <span>Bạn có chắc chắn muốn lưu trữ:</span>
              </div>
              <p className="mt-1.5 font-black text-sm text-slate-900 dark:text-white">
                "{archivingGuide.title}" ({archivingGuide.slug})
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setArchivingGuide(null)}
                className={secondaryButtonClass}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  const target = archivingGuide
                  setArchivingGuide(null)
                  await act(
                    () => systemGuideApi.archive(target.id),
                    `Đã lưu trữ thành công hướng dẫn "${target.title}".`
                  )
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
              >
                <Archive className="size-4" />
                Xác nhận lưu trữ
              </button>
            </div>
          </div>
        </ModalDialog>
      )}
        </>
      )}
    </div>
  )
}

function GuideEditor({
  guide,
  saving,
  onClose,
  onSave
}: {
  guide: SystemGuide | null
  saving: boolean
  onClose: () => void
  onSave: (body: SystemGuideInput, termIds: string[]) => Promise<void>
}) {
  const content = guide?.content ?? emptyContent
  const [activeSection, setActiveSection] = useState<'basic' | 'access' | 'content' | 'steps' | 'tour' | 'terms'>('basic')
  const [allTerms, setAllTerms] = useState<GlossaryTerm[]>([])
  const [selectedTermIds, setSelectedTermIds] = useState<string[]>([])

  useEffect(() => {
    systemGlossaryApi.list({ limit: 100 }).then(res => setAllTerms(res.data.items)).catch(() => {})
    if (guide?.id) {
      systemGlossaryApi.byGuide(guide.id).then(res => setSelectedTermIds(res.data.map(t => t.id))).catch(() => {})
    }
  }, [guide?.id])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const lines = (name: string) =>
      String(data.get(name) ?? '')
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean)
    const stepTitles = lines('stepTitles')
    const stepDescriptions = lines('stepDescriptions')

    void onSave({
      slug: String(data.get('slug')),
      title: String(data.get('title')),
      summary: String(data.get('summary')),
      category: String(data.get('category')),
      routePath: String(data.get('routePath') || '') || null,
      requiredPermission: String(data.get('requiredPermission') || '') || null,
      audienceMode: data.get('audienceMode') as GuideAudience,
      sortOrder: Number(data.get('sortOrder')),
      content: {
        purpose: String(data.get('purpose')),
        audience: String(data.get('audience')),
        accessPath: String(data.get('accessPath')),
        prerequisites: lines('prerequisites'),
        steps: stepTitles.map((title, index) => ({
          title,
          description: stepDescriptions[index] ?? title
        })),
        result: String(data.get('result')),
        permissions: lines('permissions'),
        commonErrors: lines('commonErrors'),
        relatedRoutes: lines('relatedRoutes'),
        support: String(data.get('support'))
      },
      tour: lines('tourAnchors').map((anchor, index) => ({
        anchor,
        title: lines('tourTitles')[index] ?? anchor,
        description: lines('tourDescriptions')[index] ?? anchor,
        routePath: lines('tourRoutes')[index] ?? '/employee-lifecycle/system-guide',
        sortOrder: (index + 1) * 10
      }))
    }, selectedTermIds)
  }

  return (
    <ModalDialog
      title={guide ? `Hiệu chỉnh hướng dẫn: ${guide.title}` : 'Tạo hướng dẫn mới'}
      description="Biên tập thông tin, phân quyền, các bước thực hiện và điểm neo tour tương tác."
      onClose={onClose}
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Editor Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2 dark:border-slate-800">
          <SectionTabButton
            active={activeSection === 'basic'}
            onClick={() => setActiveSection('basic')}
            icon={<FileText className="size-3.5" />}
            label="1. Thông tin cơ bản"
          />
          <SectionTabButton
            active={activeSection === 'access'}
            onClick={() => setActiveSection('access')}
            icon={<ShieldCheck className="size-3.5" />}
            label="2. Phân quyền & Điều hướng"
          />
          <SectionTabButton
            active={activeSection === 'content'}
            onClick={() => setActiveSection('content')}
            icon={<Sparkles className="size-3.5" />}
            label="3. Nội dung chức năng"
          />
          <SectionTabButton
            active={activeSection === 'steps'}
            onClick={() => setActiveSection('steps')}
            icon={<Layers className="size-3.5" />}
            label="4. Các bước thực hiện"
          />
          <SectionTabButton
            active={activeSection === 'tour'}
            onClick={() => setActiveSection('tour')}
            icon={<Compass className="size-3.5" />}
            label="5. Tour tương tác"
          />
          <SectionTabButton
            active={activeSection === 'terms'}
            onClick={() => setActiveSection('terms')}
            icon={<BookMarked className="size-3.5" />}
            label="6. Thuật ngữ cần biết"
          />
        </div>

        {/* Scrollable Form Content */}
        <div className="max-h-[62vh] overflow-y-auto pr-1 space-y-4">
          {/* Section 1: Basic Information */}
          <div className={activeSection === 'basic' ? 'space-y-4' : 'hidden'}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tiêu đề hướng dẫn">
                <input
                  name="title"
                  required
                  defaultValue={guide?.title}
                  className={adminInputClass}
                  placeholder="Ví dụ: Tra cứu thư viện quy trình"
                />
              </Field>
              <Field label="Slug (Định danh URL)">
                <input
                  name="slug"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  defaultValue={guide?.slug}
                  className={adminInputClass}
                  placeholder="thu-vien-quy-trinh"
                />
              </Field>
            </div>

            <Field label="Tóm tắt ngắn gọn (1-2 câu)">
              <textarea
                name="summary"
                required
                defaultValue={guide?.summary}
                className={`${adminInputClass} min-h-20 py-2.5`}
                placeholder="Mô tả ngắn hiển thị trên thẻ và tìm kiếm..."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Danh mục chức năng">
                <input
                  name="category"
                  required
                  defaultValue={guide?.category || 'Bắt đầu'}
                  className={adminInputClass}
                  placeholder="Bắt đầu, Tra cứu, Tài liệu, Quản trị..."
                />
              </Field>
              <Field label="Thứ tự hiển thị (sortOrder)">
                <input
                  type="number"
                  min="0"
                  name="sortOrder"
                  defaultValue={guide?.sortOrder || 100}
                  className={adminInputClass}
                />
              </Field>
            </div>
          </div>

          {/* Section 2: Access & Navigation */}
          <div className={activeSection === 'access' ? 'space-y-4' : 'hidden'}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Đối tượng truy cập (Audience)">
                <select
                  name="audienceMode"
                  defaultValue={guide?.audienceMode || 'ALL'}
                  className={adminInputClass}
                >
                  <option value="ALL">Tất cả người dùng (ALL)</option>
                  <option value="AUTHORIZED">Theo quyền cụ thể (AUTHORIZED)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </Field>

              <Field label="Quyền yêu cầu (Required Permission)">
                <input
                  name="requiredPermission"
                  defaultValue={guide?.requiredPermission || ''}
                  className={adminInputClass}
                  placeholder="sop.read, sop.create, sop.edit..."
                />
              </Field>
            </div>

            <Field label="Đường dẫn chuyển hướng (routePath)">
              <input
                name="routePath"
                defaultValue={guide?.routePath || ''}
                className={adminInputClass}
                placeholder="/employee-lifecycle?tab=process-library&cluster=core"
              />
            </Field>

            <Field label="Đường dẫn thao tác bằng chữ (Access Path)">
              <input
                name="accessPath"
                required
                defaultValue={content.accessPath}
                className={adminInputClass}
                placeholder="Thanh bên → Thư viện quy trình → Chọn SOP..."
              />
            </Field>
          </div>

          {/* Section 3: Functional Content */}
          <div className={activeSection === 'content' ? 'space-y-4' : 'hidden'}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mục đích chức năng">
                <textarea
                  name="purpose"
                  required
                  defaultValue={content.purpose}
                  className={`${adminInputClass} min-h-24 py-2.5`}
                  placeholder="Chức năng này giúp người dùng giải quyết bài toán gì..."
                />
              </Field>
              <Field label="Ai nên sử dụng">
                <textarea
                  name="audience"
                  required
                  defaultValue={content.audience}
                  className={`${adminInputClass} min-h-24 py-2.5`}
                  placeholder="Các vai trò, phòng ban nào..."
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Điều kiện cần có (mỗi dòng một điều kiện)">
                <textarea
                  name="prerequisites"
                  defaultValue={content.prerequisites.join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="Đã đăng nhập hệ thống&#10;Tài liệu có định dạng PDF/DOCX..."
                />
              </Field>
              <Field label="Quyền cần có (mỗi dòng một quyền)">
                <textarea
                  name="permissions"
                  defaultValue={content.permissions.join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="sop.read&#10;Quyền xem phân hệ nhân sự..."
                />
              </Field>
            </div>

            <Field label="Kết quả mong đợi sau khi hoàn thành">
              <textarea
                name="result"
                required
                defaultValue={content.result}
                className={`${adminInputClass} min-h-20 py-2.5`}
                placeholder="Người dùng nhận được đầu ra gì..."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Lỗi thường gặp & cách xử lý (mỗi dòng)">
                <textarea
                  name="commonErrors"
                  defaultValue={content.commonErrors.join('\n')}
                  className={`${adminInputClass} min-h-24 py-2.5`}
                  placeholder="Nếu không thấy SOP: kiểm tra trạng thái công bố..."
                />
              </Field>
              <Field label="Đường dẫn liên quan (mỗi dòng)">
                <textarea
                  name="relatedRoutes"
                  defaultValue={content.relatedRoutes.join('\n')}
                  className={`${adminInputClass} min-h-24 py-2.5`}
                  placeholder="/employee-lifecycle/policies"
                />
              </Field>
            </div>

            <Field label="Khi cần hỗ trợ">
              <textarea
                name="support"
                defaultValue={content.support}
                className={`${adminInputClass} min-h-20 py-2.5`}
                placeholder="Thông tin liên hệ, hotline hoặc phòng ban phụ trách..."
              />
            </Field>
          </div>

          {/* Section 4: Steps Timeline */}
          <div className={activeSection === 'steps' ? 'space-y-4' : 'hidden'}>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-3 text-xs leading-5 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200">
              <p className="font-bold">Quy tắc nhập các bước:</p>
              <p className="mt-0.5">
                Mỗi dòng ở ô <strong>Tên các bước</strong> tương ứng với một dòng ở ô{' '}
                <strong>Mô tả từng bước</strong>. Hãy đảm bảo số lượng dòng ở hai ô bằng nhau.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tên các bước (mỗi dòng một bước)">
                <textarea
                  name="stepTitles"
                  required
                  defaultValue={content.steps.map((item) => item.title).join('\n')}
                  className={`${adminInputClass} min-h-48 py-2.5`}
                  placeholder="Bước 1: Mở thư viện quy trình&#10;Bước 2: Tìm kiếm theo từ khóa&#10;Bước 3: Xem lưu đồ chi tiết"
                />
              </Field>
              <Field label="Mô tả từng bước (mỗi dòng tương ứng)">
                <textarea
                  name="stepDescriptions"
                  required
                  defaultValue={content.steps.map((item) => item.description).join('\n')}
                  className={`${adminInputClass} min-h-48 py-2.5`}
                  placeholder="Mô tả chi tiết cho bước 1...&#10;Mô tả chi tiết cho bước 2...&#10;Mô tả chi tiết cho bước 3..."
                />
              </Field>
            </div>
          </div>

          {/* Section 5: Guided Tour Configuration */}
          <div className={activeSection === 'tour' ? 'space-y-4' : 'hidden'}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white">Cấu hình Tour điểm neo</h4>
              <p className="mt-1">
                Thuộc tính <code>anchor</code> phải khớp với thuộc tính <code>data-help-id</code> trên các phần tử giao diện (ví dụ: <code>main-sidebar</code>, <code>guide-profile</code>, <code>guide-task-shortcuts</code>).
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Anchor (data-help-id)">
                <textarea
                  name="tourAnchors"
                  defaultValue={guide?.tour?.map((item) => item.anchor).join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="main-sidebar&#10;guide-profile"
                />
              </Field>
              <Field label="Tiêu đề bước tour">
                <textarea
                  name="tourTitles"
                  defaultValue={guide?.tour?.map((item) => item.title).join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="Thanh điều hướng&#10;Quyền của tôi"
                />
              </Field>
              <Field label="Mô tả bước tour">
                <textarea
                  name="tourDescriptions"
                  defaultValue={guide?.tour?.map((item) => item.description).join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="Mô tả điểm neo 1...&#10;Mô tả điểm neo 2..."
                />
              </Field>
              <Field label="Đường dẫn tương ứng">
                <textarea
                  name="tourRoutes"
                  defaultValue={guide?.tour?.map((item) => item.routePath).join('\n')}
                  className={`${adminInputClass} min-h-28 py-2.5`}
                  placeholder="/employee-lifecycle/system-guide"
                />
              </Field>
            </div>
          </div>

          {/* Section 6: Associated Glossary Terms */}
          <div className={activeSection === 'terms' ? 'space-y-4' : 'hidden'}>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-3 text-xs leading-5 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-200">
              <p className="font-bold">Liên kết thuật ngữ với bài hướng dẫn này:</p>
              <p className="mt-0.5">
                Các thuật ngữ được chọn sẽ hiển thị dạng chip trong khu vực &ldquo;Thuật ngữ cần biết&rdquo; của hướng dẫn, giúp người dùng tra cứu nhanh định nghĩa và ví dụ mà không cần rời trang.
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto p-3 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              {allTerms.length === 0 ? (
                <div className="col-span-2 text-center text-xs text-slate-400 py-4">Đang tải danh sách thuật ngữ...</div>
              ) : (
                allTerms.map(t => {
                  const isChecked = selectedTermIds.includes(t.id)
                  return (
                    <label key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTermIds([...selectedTermIds, t.id])
                          } else {
                            setSelectedTermIds(selectedTermIds.filter(id => id !== t.id))
                          }
                        }}
                        className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.term}</div>
                        {t.vietnameseName && (
                          <div className="text-[11px] text-cyan-700 dark:text-cyan-400 truncate">{t.vietnameseName}</div>
                        )}
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{t.shortDefinition}</div>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-200 bg-white pt-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-400">
            {activeSection !== 'tour' ? 'Điền xong có thể chuyển tab tiếp theo.' : 'Sẵn sàng lưu bản nháp.'}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={secondaryButtonClass}>
              Hủy
            </button>
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
            </button>
          </div>
        </div>
      </form>
    </ModalDialog>
  )
}

function GuidePreviewModal({
  guide,
  onClose
}: {
  guide: SystemGuide
  onClose: () => void
}) {
  const content = guide.content

  return (
    <ModalDialog
      title={`Xem trước giao diện: ${guide.title}`}
      description="Xem hướng dẫn dưới góc nhìn của nhân viên khi mở drawer chi tiết."
      onClose={onClose}
      maxWidthClass="max-w-2xl"
    >
      <div className="max-h-[68vh] overflow-y-auto space-y-4 pr-1">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-50 px-2 py-0.5 text-xs font-black uppercase text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
              {guide.category}
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">v{guide.version}</span>
            <StatusBadge value={guide.status} />
          </div>
          <h3 className="mt-2 text-base font-black text-slate-950 dark:text-white">{guide.title}</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{guide.summary}</p>
        </div>

        {content && (
          <div className="space-y-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Mục đích</span>
                <p className="mt-1 text-slate-800 dark:text-slate-200 leading-5">{content.purpose}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Đối tượng</span>
                <p className="mt-1 text-slate-800 dark:text-slate-200 leading-5">{content.audience}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Đường dẫn thao tác</span>
              <p className="mt-1 font-mono font-bold text-slate-800 dark:text-slate-200">{content.accessPath}</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-2">Các bước thực hiện ({content.steps.length})</span>
              <ol className="space-y-2.5">
                {content.steps.map((s, idx) => (
                  <li key={idx} className="flex gap-2.5 rounded-lg border border-slate-100 p-2.5 dark:border-slate-800">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-bold dark:bg-slate-800">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{s.title}</div>
                      <div className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{s.description}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/20">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Kết quả mong đợi</span>
              <p className="text-emerald-950 dark:text-emerald-100">{content.result}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Đóng xem trước
          </button>
        </div>
      </div>
    </ModalDialog>
  )
}

function SectionTabButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
        active
          ? 'bg-[#155e75] text-white shadow-xs'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  )
}

function StatusBadge({ value }: { value: string }) {
  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  let label = 'Lưu trữ'
  let icon = null

  if (value === 'published') {
    styles = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800'
    label = 'Đã công bố'
    icon = <CheckCircle2 className="size-3" />
  } else if (value === 'draft') {
    styles = 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800'
    label = 'Bản nháp'
    icon = <Edit3 className="size-3" />
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black ${styles}`}>
      {icon}
      {label}
    </span>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}
