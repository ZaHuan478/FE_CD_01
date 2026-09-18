import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck
} from 'lucide-react'
import {
  sopImportApi,
  getErrorMessage,
  type SopImportItem
} from '../model/sopImportModel'
import { useSession, canReviewSop, canPublishSop } from '../../authentication/model/session'
import {
  EmptyState,
  Feedback,
  Panel,
  TableSkeleton,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'
import { useToast } from '../../../shared/ui/toast'

const SourceDocumentViewer = lazy(() =>
  import('./SourceDocumentViewer').then(module => ({ default: module.SourceDocumentViewer }))
)

function formatBytes(value: number) {
  return value < 1024 * 1024
    ? `${Math.max(1, Math.round(value / 1024))} KB`
    : `${(value / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function audienceLabel(audience: SopImportItem['audience']) {
  if (audience.mode === 'module') return 'Người có quyền phân hệ'
  if (audience.mode === 'department_job_title')
    return `${audience.jobTitle ?? 'Chức danh'} · ${audience.department ?? 'Phòng ban'}`
  if (audience.mode === 'department') return `Phòng ban ${audience.department ?? ''}`.trim()
  if (audience.mode === 'job_title') return `Chức danh ${audience.jobTitle ?? ''}`.trim()
  return 'Chỉ người tạo'
}

export function SopApprovalWorkspace() {
  const toast = useToast()
  const session = useSession()
  const canReview = canReviewSop(session)
  const canPublish = canPublishSop(session)
  const hasAnyApprovalAccess = canReview || canPublish

  const [items, setItems] = useState<SopImportItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'pending_publish'>('all')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<'review' | 'publish' | null>(null)
  const [error, setError] = useState('')
  const [reviewNote, setReviewNote] = useState('')
  const [documentView, setDocumentView] = useState<'sop' | 'source'>('sop')

  const loadApprovals = async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const res = await sopImportApi.list(signal)
      // Strictly filter accepted documents only
      const acceptedOnly = res.data.filter(item => item.status === 'accepted')
      setItems(acceptedOnly)
      if (acceptedOnly.length > 0) {
        setActiveId(prev => (prev && acceptedOnly.some(item => item.id === prev) ? prev : acceptedOnly[0]!.id))
      } else {
        setActiveId(null)
      }
    } catch (reason) {
      if (!signal?.aborted) {
        setError(getErrorMessage(reason, 'Không tải được danh sách hồ sơ chờ duyệt'))
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    void loadApprovals(controller.signal)
    return () => controller.abort()
  }, [])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter(item => {
      const isPendingReview = !item.reviewedAt
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'pending_review'
          ? isPendingReview
          : !isPendingReview

      const matchesSearch =
        !q ||
        item.preview.code.toLowerCase().includes(q) ||
        item.preview.title.toLowerCase().includes(q) ||
        item.file.name.toLowerCase().includes(q) ||
        item.createdBy.toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [items, search, statusFilter])

  const active = useMemo(() => {
    return items.find(item => item.id === activeId) ?? null
  }, [items, activeId])

  const handleReview = async () => {
    if (!active || active.status !== 'accepted' || !canReview) return
    setBusy('review')
    setError('')
    try {
      const result = await sopImportApi.review(active.id, reviewNote.trim() || undefined)
      setItems(current => current.map(item => (item.id === result.data.id ? result.data : item)))
      setReviewNote('')
      toast.success(`Reviewer đã xác nhận hồ sơ: ${active.preview.code}`)
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không xác nhận được bước rà soát'))
    } finally {
      setBusy(null)
    }
  }

  const handlePublish = async () => {
    if (!active || active.status !== 'accepted' || !canPublish) return
    setBusy('publish')
    setError('')
    try {
      const result = await sopImportApi.publish(active.id)
      // Once published, the item leaves the accepted approval queue
      setItems(current => current.filter(item => item.id !== result.data.id))
      setActiveId(null)
      toast.success(`Đã phê duyệt và công bố SOP: ${result.data.preview.code}`)
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không công bố được SOP'))
    } finally {
      setBusy(null)
    }
  }

  if (!hasAnyApprovalAccess) {
    return (
      <Panel>
        <div className="grid min-h-56 place-items-center p-6 text-center">
          <div>
            <ShieldAlert className="mx-auto size-8 text-amber-500" />
            <h2 className="mt-3 text-base font-black">Không có quyền duyệt SOP</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tài khoản cần có quyền rà soát (sop.review) hoặc phê duyệt công bố (sop.publish) để mở chức năng này.
            </p>
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Feedback type="error" action={<button type="button" onClick={() => void loadApprovals()} className="font-bold underline">Thử lại</button>}>
          {error}
        </Feedback>
      )}

      {loading ? (
        <TableSkeleton rows={8} />
      ) : items.length === 0 ? (
        <Panel>
          <EmptyState
            title="Không có SOP đang chờ duyệt"
            description="Các tài liệu cần Admin xử lý sẽ xuất hiện tại đây."
          />
        </Panel>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
          {/* Left Column: Queue List */}
          <div className="space-y-3">
            <Panel
              title={`Hồ sơ chờ xử lý (${items.length})`}
              description="Các hồ sơ SOP Draft đang chờ Admin rà soát hoặc phê duyệt công bố."
              action={
                <button
                  type="button"
                  onClick={() => void loadApprovals()}
                  aria-label="Làm mới danh sách chờ duyệt"
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Làm mới danh sách"
                >
                  <RefreshCw className="size-4" />
                </button>
              }
            >
              <div className="space-y-2 border-b border-slate-200 p-3 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo mã, tên, người tạo..."
                    className={`${adminInputClass} h-9 pl-9 text-xs`}
                  />
                </div>
                <div className="flex gap-1.5" role="group" aria-label="Lọc trạng thái duyệt">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold transition ${
                      statusFilter === 'all'
                        ? 'bg-[#155e75] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Tất cả ({items.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('pending_review')}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold transition ${
                      statusFilter === 'pending_review'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-200'
                    }`}
                  >
                    Chờ rà soát ({items.filter(i => !i.reviewedAt).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('pending_publish')}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold transition ${
                      statusFilter === 'pending_publish'
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'bg-cyan-50 text-cyan-900 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-200'
                    }`}
                  >
                    Chờ công bố ({items.filter(i => Boolean(i.reviewedAt)).length})
                  </button>
                </div>
              </div>

              <div className="max-h-[620px] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {filteredItems.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-500">Không tìm thấy hồ sơ phù hợp bộ lọc.</p>
                ) : (
                  filteredItems.map(item => {
                    const isReviewed = Boolean(item.reviewedAt)
                    const isSelected = active?.id === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveId(item.id)
                          setDocumentView('sop')
                        }}
                        className={`flex w-full cursor-pointer items-start gap-3 p-3 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155e75] dark:hover:bg-slate-800 ${
                          isSelected ? 'bg-cyan-50/70 dark:bg-cyan-950/30' : ''
                        }`}
                      >
                        <FileCheck2
                          className={`mt-0.5 size-4 shrink-0 ${
                            isReviewed ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-mono text-xs font-black text-[#155e75] dark:text-cyan-300">
                              {item.preview.code}
                            </span>
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                                isReviewed
                                  ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200'
                                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                              }`}
                            >
                              {isReviewed ? 'Chờ phê duyệt công bố' : 'Chờ rà soát'}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs font-bold text-slate-900 dark:text-white">
                            {item.preview.title}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span>Người tạo: {item.createdBy}</span>
                            <span>·</span>
                            <span>{item.preview.steps.length} bước</span>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </Panel>
          </div>

          {/* Right Column: Selected Document Inspection & Approval Actions */}
          {!active ? (
            <Panel title="Chi tiết hồ sơ">
              <div className="grid min-h-64 place-items-center p-6 text-center">
                <p className="text-sm text-slate-500">Chọn một hồ sơ từ danh sách bên trái để kiểm tra và duyệt.</p>
              </div>
            </Panel>
          ) : (
            <div className="space-y-4">
              {/* Mode switcher tabs */}
              <div role="tablist" aria-label="Chế độ xem tài liệu" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  role="tab"
                  aria-selected={documentView === 'sop'}
                  onClick={() => setDocumentView('sop')}
                  className={documentView === 'sop' ? primaryButtonClass : secondaryButtonClass}
                >
                  Nội dung SOP đã chuẩn hóa
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={documentView === 'source'}
                  onClick={() => setDocumentView('source')}
                  className={documentView === 'source' ? primaryButtonClass : secondaryButtonClass}
                >
                  <FileText className="size-4" />
                  File gốc · {active.file.mediaType === 'application/pdf' ? 'PDF' : 'Word'}
                </button>
              </div>

              {documentView === 'source' ? (
                <Suspense fallback={<TableSkeleton rows={6} />}>
                  <SourceDocumentViewer key={`${session.accountId}:${active.id}`} item={active} />
                </Suspense>
              ) : (
                <>
                  {/* General SOP metadata */}
                  <Panel
                    title="Thông tin tổng quan SOP"
                    description={`${active.file.name} · ${formatBytes(active.file.size)} · Gửi lúc: ${formatDate(
                      active.acceptedAt ?? active.createdAt
                    )}`}
                    action={
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-black ${
                          active.reviewedAt
                            ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                        }`}
                      >
                        {active.reviewedAt ? 'Chờ phê duyệt công bố' : 'Chờ rà soát'}
                      </span>
                    }
                  >
                    <div className="grid gap-3 p-4 md:grid-cols-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-500">Mã quy trình</span>
                        <p className="font-mono text-sm font-black text-[#155e75] dark:text-cyan-300">
                          {active.preview.code}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500">Tên quy trình</span>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{active.preview.title}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500">Người tạo hồ sơ</span>
                        <p className="text-sm font-medium">{active.createdBy}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500">Phạm vi xem sau công bố</span>
                        <p className="text-sm font-medium">{audienceLabel(active.audience)}</p>
                      </div>
                      {active.preview.purpose && (
                        <div className="md:col-span-2">
                          <span className="text-xs font-semibold text-slate-500">Mục đích</span>
                          <p className="mt-0.5 text-xs leading-5 text-slate-700 dark:text-slate-300">
                            {active.preview.purpose}
                          </p>
                        </div>
                      )}
                      {active.preview.scope && (
                        <div className="md:col-span-2">
                          <span className="text-xs font-semibold text-slate-500">Phạm vi áp dụng</span>
                          <p className="mt-0.5 text-xs leading-5 text-slate-700 dark:text-slate-300">
                            {active.preview.scope}
                          </p>
                        </div>
                      )}
                      {active.reviewedAt && (
                        <div className="md:col-span-2 rounded-lg border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-900 dark:bg-cyan-950/40">
                          <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 dark:text-cyan-200">
                            <UserCheck className="size-4" />
                            Đã xác nhận rà soát bởi: {active.reviewedBy || 'Reviewer'} ({formatDate(active.reviewedAt)})
                          </div>
                          {active.reviewNote && (
                            <p className="mt-1 text-xs text-cyan-800 dark:text-cyan-300">
                              Ghi chú: {active.reviewNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Panel>

                  {/* Extraction warnings if any */}
                  {!!active.warnings.length && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                      <div className="flex gap-3">
                        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
                        <div>
                          <p className="text-sm font-black text-amber-950 dark:text-amber-100">
                            Lưu ý từ quá trình số hóa
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-amber-900 dark:text-amber-200">
                            {active.warnings.map((warning, idx) => (
                              <li key={idx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Read-only Step inspection for approval */}
                  <Panel
                    title={`Nội dung quy trình (${active.preview.steps.length} bước)`}
                    description="Kiểm tra chi tiết từng bước nghiệp vụ trước khi xác nhận rà soát hoặc công bố."
                  >
                    <div className="space-y-3 p-4">
                      {active.preview.steps.map((step, idx) => (
                        <article
                          key={step.id || idx}
                          className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="grid size-6 place-items-center rounded-full bg-[#155e75] text-xs font-black text-white">
                              {idx + 1}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-500">{step.code}</span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</span>
                            {step.actor && (
                              <span className="ml-auto rounded-md bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Thực hiện: {step.actor}
                              </span>
                            )}
                          </div>
                          {step.description && (
                            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300 pl-8">
                              {step.description}
                            </p>
                          )}
                          {Boolean(step.checklist?.length) && (
                            <div className="mt-2 pl-8">
                              <span className="text-[11px] font-bold text-slate-500">Checklist cần kiểm tra:</span>
                              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-600 dark:text-slate-400">
                                {step.checklist!.map((item, cIdx) => (
                                  <li key={cIdx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>

                    {/* Action Footer */}
                    <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                      <div className="text-xs text-slate-500">
                        {!active.reviewedAt ? (
                          <span>Cần Reviewer có thẩm quyền rà soát trước khi chuyển sang bước công bố.</span>
                        ) : (
                          <span>Hồ sơ đã được rà soát. Cần Approver phê duyệt để chính thức công bố.</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Step 1: Review confirmation */}
                        {!active.reviewedAt ? (
                          canReview ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                value={reviewNote}
                                onChange={e => setReviewNote(e.target.value)}
                                placeholder="Ghi chú rà soát (tùy chọn)..."
                                className={`${adminInputClass} h-9 text-xs sm:w-64`}
                              />
                              <button
                                type="button"
                                disabled={busy !== null}
                                onClick={() => void handleReview()}
                                className={primaryButtonClass}
                              >
                                {busy === 'review' ? (
                                  <>
                                    <LoaderCircle className="size-4 animate-spin" />
                                    Đang xác nhận...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="size-4" />
                                    Xác nhận đã rà soát
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-50 px-4 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                              <Clock className="size-4" />
                              Đang chờ Reviewer xác nhận
                            </span>
                          )
                        ) : /* Step 2: Publish approval */
                        canPublish ? (
                          <button
                            type="button"
                            disabled={busy !== null}
                            onClick={() => void handlePublish()}
                            className={primaryButtonClass}
                          >
                            {busy === 'publish' ? (
                              <>
                                <LoaderCircle className="size-4 animate-spin" />
                                Đang công bố...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="size-4" />
                                Phê duyệt và công bố
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-cyan-50 px-4 text-xs font-bold text-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200">
                            <CheckCircle2 className="size-4" />
                            Đã rà soát · chờ Approver công bố
                          </span>
                        )}
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
