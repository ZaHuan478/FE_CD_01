import { useEffect, useState, useMemo, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Archive,
  BookCheck,
  CheckCircle2,
  Clock,
  FilePenLine,
  FolderGit2,
  RefreshCw,
  Search
} from 'lucide-react'
import {
  globalSopManagementApi,
  stateLabels,
  type KnowledgePage,
  type ManagedSop
} from '../model/globalSopManagementModel'
import {
  EmptyState,
  Feedback,
  Panel,
  TableSkeleton,
  adminInputClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'

const pageSize = 12

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

function getStateBadge(state: string) {
  const label = (stateLabels as Record<string, string>)[state] ?? state
  switch (state) {
    case 'published':
      return {
        label,
        className:
          'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
      }
    case 'submitted':
      return {
        label,
        className:
          'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
      }
    case 'reviewed':
      return {
        label,
        className:
          'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
      }
    case 'draft':
      return {
        label,
        className:
          'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      }
    case 'archived':
    case 'trash':
      return {
        label,
        className:
          'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
      }
    default:
      return {
        label,
        className:
          'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      }
  }
}

type TabType = 'published' | 'drafts'

export function GlobalSopManagementWorkspace() {
  const [activeTab, setActiveTab] = useState<TabType>('published')
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [state, setState] = useState('')
  const [publishedPage, setPublishedPage] = useState(1)
  const [draftPage, setDraftPage] = useState(1)
  const [published, setPublished] = useState<KnowledgePage | null>(null)
  const [drafts, setDrafts] = useState<ManagedSop[]>([])
  const [draftTotal, setDraftTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    void Promise.all([
      globalSopManagementApi.listPublished(query, publishedPage, controller.signal),
      globalSopManagementApi.listDrafts(query, state, draftPage, controller.signal)
    ])
      .then(([publishedResult, draftResult]) => {
        if (controller.signal.aborted) return
        setPublished(publishedResult)
        setDrafts(draftResult.data)
        setDraftTotal(draftResult.pagination.total)
      })
      .catch(reason => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : 'Không tải được danh sách SOP')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [query, state, publishedPage, draftPage, refresh])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(input.trim())
    setPublishedPage(1)
    setDraftPage(1)
  }

  const publishedTotal = published?.pagination.total ?? 0
  const publishedPages = Math.max(1, Math.ceil(publishedTotal / pageSize))
  const draftPages = Math.max(1, Math.ceil(draftTotal / pageSize))

  // Derived statistics for summary cards
  const stats = useMemo(() => {
    const pendingCount = drafts.filter(d => ['submitted', 'reviewed'].includes(d.state)).length
    const draftOnlyCount = drafts.filter(d => d.state === 'draft').length
    const archivedCount = drafts.filter(d => ['archived', 'trash'].includes(d.state)).length
    return {
      published: publishedTotal,
      pending: pendingCount,
      drafts: draftOnlyCount,
      archived: archivedCount
    }
  }, [publishedTotal, drafts])

  return (
    <div className="space-y-5">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Đã công bố</span>
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.published}</p>
          <span className="mt-0.5 block text-[11px] text-slate-500">Trong thư viện quy trình</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Chờ xử lý</span>
            <span className="grid size-7 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.pending}</p>
          <span className="mt-0.5 block text-[11px] text-slate-500">Chờ rà soát / công bố</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bản nháp</span>
            <span className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <FilePenLine className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.drafts}</p>
          <span className="mt-0.5 block text-[11px] text-slate-500">Đang được soạn thảo</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Đã lưu trữ</span>
            <span className="grid size-7 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <Archive className="size-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.archived}</p>
          <span className="mt-0.5 block text-[11px] text-slate-500">Thu hồi hoặc thùng rác</span>
        </div>
      </div>

      {/* Toolbar: Search and Status Filter */}
      <Panel
        title="Bộ lọc & Tìm kiếm"
        description="Tìm kiếm theo mã, tên quy trình, tóm tắt hoặc người tạo trong toàn hệ thống."
      >
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3 p-4">
          <label className="relative min-w-56 flex-1 text-sm font-bold">
            <span className="sr-only">Tìm kiếm SOP</span>
            <Search className="absolute left-3 top-3.5 size-4 text-slate-400" />
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Tìm theo mã, tên hoặc tóm tắt SOP..."
              className={`${adminInputClass} pl-9`}
              aria-label="Tìm theo mã, tên hoặc tóm tắt SOP"
            />
          </label>

          <label className="grid gap-1 text-sm font-bold">
            <span className="text-xs text-slate-500">Trạng thái hồ sơ</span>
            <select
              value={state}
              onChange={event => {
                setState(event.target.value)
                setDraftPage(1)
              }}
              className={adminInputClass}
              aria-label="Lọc theo trạng thái hồ sơ"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(stateLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className={secondaryButtonClass} aria-label="Thực hiện tìm kiếm">
            <Search className="size-4" />
            Tìm kiếm
          </button>

          <button
            type="button"
            onClick={() => setRefresh(value => value + 1)}
            className={secondaryButtonClass}
            aria-label="Tải lại danh sách SOP"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="size-4" />
            Làm mới
          </button>
        </form>
      </Panel>

      {error && <Feedback type="error">{error}</Feedback>}

      {/* Tabs / Segmented Control */}
      <div
        className="flex w-fit rounded-lg border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        role="tablist"
        aria-label="Chế độ xem SOP"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'published'}
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition ${
            activeTab === 'published'
              ? 'bg-[#155e75] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <BookCheck className="size-4" />
          SOP đã công bố
          <span
            className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
              activeTab === 'published'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {publishedTotal}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'drafts'}
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition ${
            activeTab === 'drafts'
              ? 'bg-[#155e75] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <FolderGit2 className="size-4" />
          Hồ sơ đang xử lý
          <span
            className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
              activeTab === 'drafts'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {draftTotal}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'published' ? (
        <Panel
          title={`Danh sách SOP đã công bố (${publishedTotal})`}
          description="Toàn bộ quy trình đang chính thức có hiệu lực và hiển thị trong Thư viện quy trình."
        >
          {loading ? (
            <TableSkeleton rows={6} />
          ) : !published?.data.length ? (
            <EmptyState title="Không có SOP phù hợp" description="Thử thay đổi từ khóa tìm kiếm hoặc làm mới lại trang." />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Mã SOP</th>
                      <th className="px-4 py-3">Tên quy trình</th>
                      <th className="px-4 py-3">Phiên bản</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Tóm tắt</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {published.data.map(item => {
                      const badge = getStateBadge('published')
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-black text-[#155e75] dark:text-cyan-300 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.title}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              v{item.version ?? 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">
                            <span className="line-clamp-2">{item.summary || 'Chưa có tóm tắt.'}</span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <Link
                              className={`${secondaryButtonClass} text-xs`}
                              to={`/employee-lifecycle/sop-management?source=${encodeURIComponent(item.id)}`}
                              aria-label={`Mở bản sửa cho ${item.code}`}
                            >
                              <FilePenLine className="size-3.5" />
                              Mở bản sửa
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
                {published.data.map(item => {
                  const badge = getStateBadge('published')
                  return (
                    <article key={item.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-300">
                          {item.code} · v{item.version ?? 1}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      {item.summary && (
                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {item.summary}
                        </p>
                      )}
                      <div className="pt-2">
                        <Link
                          className={`${secondaryButtonClass} w-full text-xs`}
                          to={`/employee-lifecycle/sop-management?source=${encodeURIComponent(item.id)}`}
                          aria-label={`Mở bản sửa cho ${item.code}`}
                        >
                          <FilePenLine className="size-3.5" />
                          Mở bản sửa
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
          <Pager page={publishedPage} pages={publishedPages} onPage={setPublishedPage} />
        </Panel>
      ) : (
        <Panel
          title={`Hồ sơ quản lý SOP (${draftTotal})`}
          description="Bản nháp, hồ sơ chờ rà soát, chờ công bố, đã thu hồi hoặc nằm trong thùng rác."
        >
          {loading ? (
            <TableSkeleton rows={6} />
          ) : !drafts.length ? (
            <EmptyState
              title="Không có hồ sơ phù hợp"
              description="Chưa có hồ sơ quản lý SOP nào theo bộ lọc hoặc từ khóa hiện tại."
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Mã SOP</th>
                      <th className="px-4 py-3">Tên quy trình</th>
                      <th className="px-4 py-3">Người tạo</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Cập nhật gần nhất</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {drafts.map(item => {
                      const badge = getStateBadge(item.state)
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition dark:hover:bg-slate-800/50"
                        >
                          <td className="px-4 py-3 font-mono text-xs font-black text-[#155e75] dark:text-cyan-300 whitespace-nowrap">
                            {item.preview.code}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {item.preview.title}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {item.createdBy}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                            {formatDate(item.updatedAt)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <Link
                              className={`${secondaryButtonClass} text-xs`}
                              to={`/employee-lifecycle/sop-management?draft=${encodeURIComponent(item.id)}`}
                              aria-label={`Mở hồ sơ ${item.preview.code}`}
                            >
                              <FilePenLine className="size-3.5" />
                              Mở hồ sơ
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-800">
                {drafts.map(item => {
                  const badge = getStateBadge(item.state)
                  return (
                    <article key={item.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-300">
                          {item.preview.code}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.preview.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                        <p>Người tạo: {item.createdBy}</p>
                        <p>Cập nhật: {formatDate(item.updatedAt)}</p>
                      </div>
                      <div className="pt-2">
                        <Link
                          className={`${secondaryButtonClass} w-full text-xs`}
                          to={`/employee-lifecycle/sop-management?draft=${encodeURIComponent(item.id)}`}
                          aria-label={`Mở hồ sơ ${item.preview.code}`}
                        >
                          <FilePenLine className="size-3.5" />
                          Mở hồ sơ
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
          <Pager page={draftPage} pages={draftPages} onPage={setDraftPage} />
        </Panel>
      )}
    </div>
  )
}

function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800">
      <span>
        Trang <strong className="font-bold text-slate-900 dark:text-white">{page}</strong> / {pages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className={secondaryButtonClass}
          aria-label="Trang trước"
        >
          Trước
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className={secondaryButtonClass}
          aria-label="Trang sau"
        >
          Sau
        </button>
      </div>
    </div>
  )
}
