import React, { useState, useMemo, type FormEvent } from 'react'
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react'
import {
  useAdminSystemGlossary,
  GLOSSARY_CATEGORIES,
  type CreateGlossaryTermInput,
  type GlossaryTerm,
  type UpdateGlossaryTermInput
} from '../../system-glossary/model/systemGlossaryModel'
import {
  EmptyState,
  Feedback,
  Panel,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import { GlossaryTermDrawer } from '../../system-glossary/ui/GlossaryTermDrawer'

export const AdminGlossaryTab: React.FC = () => {
  const {
    terms,
    loading,
    error,
    reload,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    createTerm,
    updateTerm,
    publishTerm,
    archiveTerm
  } = useAdminSystemGlossary()

  const [localFeedback, setLocalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | 'new' | null>(null)
  const [archivingTerm, setArchivingTerm] = useState<GlossaryTerm | null>(null)
  const [previewTerm, setPreviewTerm] = useState<GlossaryTerm | null>(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  // Form states
  const [formData, setFormData] = useState<{
    slug: string
    term: string
    vietnameseName: string
    category: string
    routePath: string
    sortOrder: number
    shortDefinition: string
    detailedDefinition: string
    aliasesText: string
    examplesText: string
    selectedRelatedSlugs: string[]
  }>({
    slug: '',
    term: '',
    vietnameseName: '',
    category: 'Khái niệm SOP',
    routePath: '',
    sortOrder: 10,
    shortDefinition: '',
    detailedDefinition: '',
    aliasesText: '',
    examplesText: '',
    selectedRelatedSlugs: []
  })

  const openEditor = (term: GlossaryTerm | 'new') => {
    setEditingTerm(term)
    if (term === 'new') {
      setFormData({
        slug: '',
        term: '',
        vietnameseName: '',
        category: 'Khái niệm SOP',
        routePath: '',
        sortOrder: (terms.length + 1) * 10,
        shortDefinition: '',
        detailedDefinition: '',
        aliasesText: '',
        examplesText: '',
        selectedRelatedSlugs: []
      })
    } else {
      setFormData({
        slug: term.slug,
        term: term.term,
        vietnameseName: term.vietnameseName || '',
        category: term.category,
        routePath: term.routePath || '',
        sortOrder: term.sortOrder,
        shortDefinition: term.shortDefinition || '',
        detailedDefinition: term.detailedDefinition || '',
        aliasesText: (term.aliases || []).join('\n'),
        examplesText: (term.examples || []).join('\n'),
        selectedRelatedSlugs: term.relatedTermSlugs || []
      })
    }
  }

  // Duplicate warnings
  const duplicateWarning = useMemo(() => {
    if (!formData.slug.trim() && !formData.term.trim()) return null
    const currentId = editingTerm && editingTerm !== 'new' ? editingTerm.id : null

    const dupSlug = terms.find(
      t => t.slug.toLowerCase() === formData.slug.trim().toLowerCase() && t.id !== currentId
    )
    if (dupSlug) return `Mã slug "${formData.slug}" đã trùng với thuật ngữ "${dupSlug.term}".`

    const dupTerm = terms.find(
      t => t.term.toLowerCase() === formData.term.trim().toLowerCase() && t.id !== currentId
    )
    if (dupTerm) return `Thuật ngữ "${formData.term}" đã tồn tại trong hệ thống.`

    return null
  }, [formData.slug, formData.term, terms, editingTerm])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setLocalFeedback(null)

    const aliases = formData.aliasesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const examples = formData.examplesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    try {
      if (editingTerm === 'new') {
        const payload: CreateGlossaryTermInput = {
          slug: formData.slug.trim(),
          term: formData.term.trim(),
          vietnameseName: formData.vietnameseName.trim() || null,
          category: formData.category,
          routePath: formData.routePath.trim() || null,
          sortOrder: Number(formData.sortOrder) || 0,
          shortDefinition: formData.shortDefinition.trim(),
          detailedDefinition: formData.detailedDefinition.trim(),
          aliases,
          examples,
          relatedTermSlugs: formData.selectedRelatedSlugs
        }
        await createTerm(payload)
        setLocalFeedback({ type: 'success', message: 'Tạo thuật ngữ mới thành công (trạng thái Nháp)' })
      } else if (editingTerm) {
        const payload: UpdateGlossaryTermInput = {
          slug: formData.slug.trim(),
          term: formData.term.trim(),
          vietnameseName: formData.vietnameseName.trim() || null,
          category: formData.category,
          routePath: formData.routePath.trim() || null,
          sortOrder: Number(formData.sortOrder) || 0,
          shortDefinition: formData.shortDefinition.trim(),
          detailedDefinition: formData.detailedDefinition.trim(),
          aliases,
          examples,
          relatedTermSlugs: formData.selectedRelatedSlugs
        }
        await updateTerm(editingTerm.id, payload)
        setLocalFeedback({ type: 'success', message: 'Cập nhật bản nháp thuật ngữ thành công' })
      }
      setEditingTerm(null)
    } catch (err) {
      setLocalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Không thể lưu thuật ngữ'
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (term: GlossaryTerm) => {
    try {
      await publishTerm(term.id)
      setLocalFeedback({ type: 'success', message: `Đã công bố thuật ngữ "${term.term}" thành công` })
    } catch (err) {
      setLocalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Không thể công bố thuật ngữ'
      })
    }
  }

  const handleArchive = async () => {
    if (!archivingTerm) return
    try {
      await archiveTerm(archivingTerm.id)
      setLocalFeedback({ type: 'success', message: `Đã lưu trữ thuật ngữ "${archivingTerm.term}"` })
      setArchivingTerm(null)
    } catch (err) {
      setLocalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Không thể lưu trữ thuật ngữ'
      })
    }
  }

  const counts = useMemo(() => {
    return {
      all: terms.length,
      published: terms.filter(t => t.status === 'published').length,
      draft: terms.filter(t => t.status === 'draft' || t.hasDraftVersion).length,
      archived: terms.filter(t => t.status === 'archived').length
    }
  }, [terms])

  const totalPages = Math.max(1, Math.ceil(terms.length / pageSize))
  const paginatedTerms = useMemo(() => {
    const start = (page - 1) * pageSize
    return terms.slice(start, start + pageSize)
  }, [terms, page, pageSize])

  return (
    <div className="space-y-4">
      {error && <Feedback type="error">{error}</Feedback>}
      {localFeedback && <Feedback type={localFeedback.type}>{localFeedback.message}</Feedback>}

      <Panel
        title="Quản trị Từ điển thuật ngữ HRM SOP"
        description="Định nghĩa chuẩn hóa các khái niệm, quy trình và thuật ngữ chuyên sâu; quản lý bản nháp, công bố và liên kết với hướng dẫn."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => reload()} className={secondaryButtonClass}>
              <RefreshCw className="size-4" />
              Làm mới
            </button>
            <button
              type="button"
              onClick={() => openEditor('new')}
              className={primaryButtonClass}
            >
              <Plus className="size-4" />
              Thêm thuật ngữ mới
            </button>
          </div>
        }
      >
        {/* Controls: Status filter + Category + Search */}
        <div className="border-b border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Status tabs */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
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
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
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
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Bản nháp ({counts.draft})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('archived')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'archived'
                    ? 'bg-white text-slate-600 shadow-xs dark:bg-slate-900 dark:text-slate-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Đã lưu trữ ({counts.archived})
              </button>
            </div>

            {/* Category Select */}
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                aria-label="Lọc theo nhóm thuật ngữ"
                className={adminInputClass}
              >
                <option value="ALL">Tất cả nhóm thuật ngữ</option>
                {GLOSSARY_CATEGORIES.filter(c => c !== 'Tất cả').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm thuật ngữ theo tên, slug hoặc từ khóa..."
              aria-label="Tìm kiếm thuật ngữ quản trị"
              className={`${adminInputClass} pl-9`}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách thuật ngữ...</div>
          ) : terms.length === 0 ? (
            <EmptyState
              title="Không tìm thấy thuật ngữ"
              description="Không có thuật ngữ nào phù hợp với bộ lọc hiện tại."
            />
          ) : (
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Thuật ngữ & Tên Việt</th>
                  <th className="px-4 py-3.5">Mã Slug</th>
                  <th className="px-4 py-3.5">Danh mục</th>
                  <th className="px-4 py-3.5">Phiên bản</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedTerms.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.term}</div>
                      {item.vietnameseName && (
                        <div className="text-cyan-700 dark:text-cyan-400 text-xs mt-0.5">{item.vietnameseName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500 text-xs">{item.slug}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {item.currentPublishedVersion ? `v${item.currentPublishedVersion}.0` : '—'}
                        </span>
                        {item.hasDraftVersion && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Có nháp
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {item.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="size-3.5" />
                          Đã công bố
                        </span>
                      ) : item.status === 'draft' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                          <Clock className="size-3.5" />
                          Bản nháp
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-bold">
                          <Archive className="size-3.5" />
                          Đã lưu trữ
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => setPreviewTerm(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Xem trước"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditor(item)}
                        className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50"
                        title="Chỉnh sửa bản nháp"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      {(item.status === 'draft' || item.hasDraftVersion) && (
                        <button
                          type="button"
                          onClick={() => handlePublish(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs"
                          title="Công bố phiên bản này"
                        >
                          Công bố
                        </button>
                      )}
                      {item.status !== 'archived' && (
                        <button
                          type="button"
                          onClick={() => setArchivingTerm(item)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Lưu trữ"
                        >
                          <Archive className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {terms.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                Hiển thị{' '}
                <strong className="font-bold text-slate-900 dark:text-white">
                  {Math.min(terms.length, (page - 1) * pageSize + 1)}
                </strong>{' '}
                –{' '}
                <strong className="font-bold text-slate-900 dark:text-white">
                  {Math.min(terms.length, page * pageSize)}
                </strong>{' '}
                trên tổng số <strong className="font-bold text-slate-900 dark:text-white">{terms.length}</strong> thuật ngữ
              </span>

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">Mỗi trang:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                  aria-label="Số thuật ngữ mỗi trang quản trị"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value={10}>10 / trang</option>
                  <option value={15}>15 / trang</option>
                  <option value={25}>25 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`${secondaryButtonClass} !min-h-8 !px-2.5 text-xs`}
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Trước</span>
                </button>
                <span className="px-2 font-bold text-slate-800 dark:text-slate-200">
                  Trang {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`${secondaryButtonClass} !min-h-8 !px-2.5 text-xs`}
                >
                  <span>Sau</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* Modal Form: Tạo mới hoặc sửa bản nháp */}
      {editingTerm && (
        <ModalDialog
          title={editingTerm === 'new' ? 'Tạo thuật ngữ mới' : `Chỉnh sửa bản nháp: ${editingTerm.term}`}
          onClose={() => setEditingTerm(null)}
          maxWidthClass="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {duplicateWarning && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                ⚠️ {duplicateWarning}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên thuật ngữ (Term) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.term}
                  onChange={e => setFormData({ ...formData, term: e.target.value })}
                  placeholder="VD: SOP (Standard Operating Procedure)"
                  className={adminInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mã Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="VD: sop, quy-trinh-nghiep-vu"
                  className={adminInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên tiếng Việt
                </label>
                <input
                  type="text"
                  value={formData.vietnameseName}
                  onChange={e => setFormData({ ...formData, vietnameseName: e.target.value })}
                  placeholder="VD: Quy trình thao tác chuẩn"
                  className={adminInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nhóm danh mục *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className={adminInputClass}
                >
                  {GLOSSARY_CATEGORIES.filter(c => c !== 'Tất cả').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn chức năng liên quan (routePath)
                </label>
                <input
                  type="text"
                  value={formData.routePath}
                  onChange={e => setFormData({ ...formData, routePath: e.target.value })}
                  placeholder="VD: /employee-lifecycle?tab=process-library"
                  className={adminInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thứ tự sắp xếp (SortOrder)
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className={adminInputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Định nghĩa ngắn (Short Definition) *
              </label>
              <textarea
                required
                rows={2}
                value={formData.shortDefinition}
                onChange={e => setFormData({ ...formData, shortDefinition: e.target.value })}
                placeholder="Tóm tắt ngắn gọn, súc tích dành cho người dùng mới..."
                className={adminInputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Giải thích chi tiết & Cách vận hành trong HRM SOP *
              </label>
              <textarea
                required
                rows={4}
                value={formData.detailedDefinition}
                onChange={e => setFormData({ ...formData, detailedDefinition: e.target.value })}
                placeholder="Mô tả cụ thể cách hệ thống sử dụng thuật ngữ này, các tác nhân và quy tắc liên quan..."
                className={adminInputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bí danh / Tên viết tắt (mỗi dòng một tên)
                </label>
                <textarea
                  rows={3}
                  value={formData.aliasesText}
                  onChange={e => setFormData({ ...formData, aliasesText: e.target.value })}
                  placeholder="Quy trình chuẩn&#10;Standard Operating Procedure&#10;SOP nhân sự"
                  className={adminInputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ví dụ thực tế trong hệ thống (mỗi dòng một ví dụ)
                </label>
                <textarea
                  rows={3}
                  value={formData.examplesText}
                  onChange={e => setFormData({ ...formData, examplesText: e.target.value })}
                  placeholder="SOP Tuyển dụng nhân viên mới&#10;SOP Thanh toán công tác phí"
                  className={adminInputClass}
                />
              </div>
            </div>

            {/* Related Terms Multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Thuật ngữ liên quan
              </label>
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-2 gap-1.5 text-xs bg-slate-50 dark:bg-slate-900">
                {terms
                  .filter(t => t.id !== (editingTerm === 'new' ? '' : editingTerm.id))
                  .map(t => {
                    const isChecked = formData.selectedRelatedSlugs.includes(t.slug)
                    return (
                      <label key={t.id} className="flex items-center gap-2 p-1 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({ ...formData, selectedRelatedSlugs: [...formData.selectedRelatedSlugs, t.slug] })
                            } else {
                              setFormData({
                                ...formData,
                                selectedRelatedSlugs: formData.selectedRelatedSlugs.filter(s => s !== t.slug)
                              })
                            }
                          }}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="truncate">{t.term}</span>
                      </label>
                    )
                  })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingTerm(null)}
                className={secondaryButtonClass}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
              </button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* Confirm Archive Dialog */}
      {archivingTerm && (
        <ModalDialog
          title="Xác nhận lưu trữ thuật ngữ"
          onClose={() => setArchivingTerm(null)}
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <p>
              Bạn có chắc chắn muốn lưu trữ thuật ngữ <strong>&ldquo;{archivingTerm.term}&rdquo;</strong> không?
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
              Thuật ngữ sau khi lưu trữ sẽ bị ẩn khỏi giao diện Hướng dẫn chi tiết của người dùng nhưng vẫn được lưu lại trong cơ sở dữ liệu.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setArchivingTerm(null)} className={secondaryButtonClass}>
                Hủy
              </button>
              <button type="button" onClick={handleArchive} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs">
                Xác nhận lưu trữ
              </button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* Preview Drawer */}
      <GlossaryTermDrawer
        isOpen={Boolean(previewTerm)}
        onClose={() => setPreviewTerm(null)}
        term={previewTerm}
      />
    </div>
  )
}
