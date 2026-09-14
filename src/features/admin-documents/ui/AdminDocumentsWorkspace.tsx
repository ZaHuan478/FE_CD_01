import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileSpreadsheet,
  FileText,
  Info,
  LayoutGrid,
  List,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Square,
  Trash2,
  X,
  XCircle
} from 'lucide-react'
import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'
import { Select } from '../../../shared/ui/atoms/Select'
import { useAdminDocuments, type AdminUserDocumentItem } from '../model/useAdminDocuments'
import { AdminDocumentViewer } from './AdminDocumentViewer'
import {
  EmptyState,
  Feedback,
  PageIntro,
  Panel,
  TableSkeleton,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatDate(iso: string): string {
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

function getInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() || 'U'
  return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase()
}

// Avatar color based on uploader name
const avatarColors = [
  'bg-emerald-600 text-white',
  'bg-sky-600 text-white',
  'bg-indigo-600 text-white',
  'bg-amber-600 text-white',
  'bg-teal-600 text-white',
  'bg-rose-600 text-white',
  'bg-violet-600 text-white'
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length] || avatarColors[0]
}

export function AdminDocumentsWorkspace() {
  const {
    documents,
    stats,
    loading,
    saving,
    error,
    search,
    setSearch,
    format,
    setFormat,
    tab,
    setTab,
    uploaderId,
    setUploaderId,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    load,
    renameDocument,
    moveToTrash,
    restoreDocument,
    permanentDelete,
    batchAction,
    uploaders,
    exportSummaryCsv
  } = useAdminDocuments()

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [previewingDoc, setPreviewingDoc] = useState<AdminUserDocumentItem | null>(null)
  const [renamingDoc, setRenamingDoc] = useState<AdminUserDocumentItem | null>(null)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [detailsDoc, setDetailsDoc] = useState<AdminUserDocumentItem | null>(null)
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<{ doc: AdminUserDocumentItem; permanent: boolean } | null>(null)
  const [confirmBatchAction, setConfirmBatchAction] = useState<'trash' | 'restore' | 'permanentDelete' | null>(null)

  useEffect(() => {
    const availableIds = new Set(documents.map(document => document.id))
    setPreviewingDoc(current => current && !availableIds.has(current.id) ? null : current)
    setDetailsDoc(current => current && !availableIds.has(current.id) ? null : current)
    setRenamingDoc(current => current && !availableIds.has(current.id) ? null : current)
  }, [documents])

  const handleOpenRename = (doc: AdminUserDocumentItem) => {
    setRenamingDoc(doc)
    setNewDisplayName(doc.displayName)
  }

  const handleSaveRename = async () => {
    if (!renamingDoc || !newDisplayName.trim()) return
    const success = await renameDocument(renamingDoc.id, newDisplayName.trim())
    if (success) setRenamingDoc(null)
  }

  const handleConfirmSingleDelete = async () => {
    if (!confirmDeleteDoc) return
    const { doc, permanent } = confirmDeleteDoc
    const succeeded = permanent
      ? await permanentDelete(doc.id)
      : await moveToTrash(doc.id)
    if (succeeded) {
      setPreviewingDoc(current => current?.id === doc.id ? null : current)
      setDetailsDoc(current => current?.id === doc.id ? null : current)
      setRenamingDoc(current => current?.id === doc.id ? null : current)
    }
    setConfirmDeleteDoc(null)
  }

  const handleConfirmBatch = async () => {
    if (!confirmBatchAction) return
    const affectedIds = new Set(selectedIds)
    const succeeded = await batchAction(confirmBatchAction)
    if (succeeded) {
      setPreviewingDoc(current => current && affectedIds.has(current.id) ? null : current)
      setDetailsDoc(current => current && affectedIds.has(current.id) ? null : current)
      setRenamingDoc(current => current && affectedIds.has(current.id) ? null : current)
    }
    setConfirmBatchAction(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageIntro
        title="Quản lý tệp tài liệu người dùng"
        description="Theo dõi toàn bộ các tệp Word và PDF do nhân viên và người dùng tải lên hệ thống. Tra cứu thông tin người tải, kiểm soát dung lượng lưu trữ, xem trước nội dung an toàn và dọn dẹp dữ liệu."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportSummaryCsv}
              className={`${secondaryButtonClass} inline-flex items-center gap-2`}
              title="Xuất danh sách tệp ra file CSV"
            >
              <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Xuất báo cáo CSV</span>
            </button>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className={`${secondaryButtonClass} inline-flex items-center gap-2`}
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>
        }
      />

      {/* Global Alerts */}
      {error && <Feedback type="error">{error}</Feedback>}



      {/* Embedded Document Previewer if active */}
      {previewingDoc && (
        <div className="mb-6">
          <AdminDocumentViewer
            document={previewingDoc}
            onClose={() => setPreviewingDoc(null)}
          />
        </div>
      )}

      {/* Main Content Panel */}
      <Panel
        title="Danh sách tệp tài liệu toàn hệ thống"
        description="Tìm kiếm theo tên tài liệu, tên file gốc hoặc thông tin người tải lên."
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition ${
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
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition ${
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
          </div>
        }
      >
        {/* Filters and Controls */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 space-y-3">
          {/* Top Filter Bar: Tabs & Search */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => {
                  setTab('active')
                  setPage(1)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  tab === 'active'
                    ? 'bg-[#155e75] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Đang hoạt động ({stats.activeCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('trash')
                  setPage(1)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  tab === 'trash'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Thùng rác ({stats.trashCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('all')
                  setPage(1)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  tab === 'all'
                    ? 'bg-slate-800 text-white shadow-sm dark:bg-slate-200 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Tất cả ({stats.totalFiles})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Tìm theo tên file, người tải, phòng ban..."
                className={`${adminInputClass} pl-9 pr-8 text-xs`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter Bar: Formats, Uploaders, Sorting */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            {/* Format Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Định dạng:</span>
              <Select
                visualSize="compact"
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value as any)
                  setPage(1)
                }}
                containerClassName="w-auto min-w-[170px]"
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả định dạng</option>
                <option value="docx">Microsoft Word (.docx)</option>
                <option value="pdf">Tài liệu PDF (.pdf)</option>
              </Select>
            </div>

            {/* Uploader Filter */}
            {uploaders.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">Người tải lên:</span>
                <Select
                  visualSize="compact"
                  value={uploaderId}
                  onChange={(e) => {
                    setUploaderId(e.target.value)
                    setPage(1)
                  }}
                  containerClassName="w-auto min-w-[180px] max-w-[240px]"
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">Tất cả người tải ({uploaders.length})</option>
                  {uploaders.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} {u.dept ? `(${u.dept})` : ''}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="font-semibold text-slate-500">Sắp xếp:</span>
              <Select
                visualSize="compact"
                popupAlign="right"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as any)
                  setSortOrder(order as any)
                }}
                containerClassName="w-auto min-w-[175px]"
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="createdAt-desc">Mới nhất trước</option>
                <option value="createdAt-asc">Cũ nhất trước</option>
                <option value="fileSize-desc">Dung lượng giảm dần</option>
                <option value="fileSize-asc">Dung lượng tăng dần</option>
                <option value="displayName-asc">Tên A-Z</option>
                <option value="uploader-asc">Người tải A-Z</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Batch Floating Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-200 bg-cyan-50/80 px-4 py-3 dark:border-cyan-900/60 dark:bg-cyan-950/40 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-950 dark:text-cyan-200">
              <CheckSquare className="size-4 text-cyan-600 dark:text-cyan-400" />
              <span>Đang chọn {selectedIds.length} tệp</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tab !== 'trash' && (
                <button
                  type="button"
                  onClick={() => setConfirmBatchAction('trash')}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 transition"
                >
                  <Trash2 className="size-3.5" />
                  <span>Chuyển thùng rác ({selectedIds.length})</span>
                </button>
              )}
              {tab !== 'active' && (
                <button
                  type="button"
                  onClick={() => setConfirmBatchAction('restore')}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Khôi phục ({selectedIds.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setConfirmBatchAction('permanentDelete')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300 transition"
              >
                <ShieldAlert className="size-3.5" />
                <span>Xóa vĩnh viễn ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
              >
                <X className="size-3" />
                <span>Bỏ chọn</span>
              </button>
            </div>
          </div>
        )}

        {/* Content View: Loading / Empty / Table / Grid */}
        {loading ? (
          <TableSkeleton rows={7} />
        ) : documents.length === 0 ? (
          <EmptyState
            title="Không tìm thấy tài liệu phù hợp"
            description={
              search || format !== 'all' || uploaderId !== 'all'
                ? 'Không có tài liệu nào khớp với tiêu chí lọc hoặc từ khóa tìm kiếm. Vui lòng thử lại.'
                : tab === 'trash'
                ? 'Thùng rác hiện đang trống.'
                : 'Chưa có người dùng nào tải lên tài liệu trong hệ thống.'
            }
          />
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      title={isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="size-4 text-[#155e75]" />
                      ) : (
                        <Square className="size-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Tài liệu / Tệp gốc</th>
                  <th className="px-4 py-3">Định dạng & Dung lượng</th>
                  <th className="px-4 py-3">Người tải lên</th>
                  <th className="px-4 py-3">Thời gian tải</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => {
                  const isSelected = selectedIds.includes(doc.id)
                  const isTrash = Boolean(doc.deletedAt)
                  return (
                    <tr
                      key={doc.id}
                      className={`group transition-colors ${
                        isSelected
                          ? 'bg-cyan-50/50 dark:bg-cyan-950/20'
                          : isTrash
                          ? 'bg-slate-50/40 hover:bg-slate-100/60 dark:bg-slate-950/20 dark:hover:bg-slate-800/40 opacity-75'
                          : 'hover:bg-slate-50/75 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelect(doc.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4 text-[#155e75]" />
                          ) : (
                            <Square className="size-4" />
                          )}
                        </button>
                      </td>

                      {/* Display Name & Original File Name */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${
                              doc.format === 'pdf'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                            }`}
                          >
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setPreviewingDoc(doc)}
                              className="font-bold text-slate-900 hover:text-[#155e75] hover:underline dark:text-white dark:hover:text-cyan-400 text-left truncate block max-w-[240px]"
                              title={doc.displayName}
                            >
                              {doc.displayName}
                            </button>
                            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                              {doc.originalFileName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Format & Size */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                            doc.format === 'pdf'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                          }`}
                        >
                          {doc.format.toUpperCase()}
                        </span>
                        <span className="ml-2 font-mono text-[11px] text-slate-500">
                          {formatBytes(doc.fileSize)}
                        </span>
                      </td>

                      {/* Uploader Profile */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${getAvatarColor(
                              doc.uploader.fullName
                            )}`}
                          >
                            {getInitials(doc.uploader.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                              {doc.uploader.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {doc.uploader.departmentName || doc.uploader.email || doc.uploader.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                        {formatDate(doc.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {isTrash ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                            <Trash2 className="size-2.5" /> Thùng rác
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <CheckCircle2 className="size-2.5" /> Hoạt động
                          </span>
                        )}
                      </td>

                      {/* Actions with 3-dots Menu */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <AdminActionMenu
                          items={[
                            {
                              id: 'preview',
                              label: 'Xem trước nội dung',
                              icon: <Eye className="size-4 text-[#155e75] dark:text-cyan-400" />,
                              onClick: () => setPreviewingDoc(doc)
                            },
                            {
                              id: 'details',
                              label: 'Thông tin & audit',
                              icon: <Info className="size-4 text-slate-600 dark:text-slate-300" />,
                              onClick: () => setDetailsDoc(doc)
                            },
                            ...(!isTrash
                              ? [
                                  {
                                    id: 'rename',
                                    label: 'Đổi tên tài liệu',
                                    icon: <Edit3 className="size-4 text-slate-600 dark:text-slate-300" />,
                                    onClick: () => handleOpenRename(doc)
                                  }
                                ]
                              : []),
                            isTrash
                              ? {
                                  id: 'restore',
                                  label: 'Khôi phục tài liệu',
                                  divider: true,
                                  variant: 'success' as const,
                                  icon: <RotateCcw className="size-4 text-emerald-600 dark:text-emerald-400" />,
                                  onClick: () => void restoreDocument(doc.id)
                                }
                              : {
                                  id: 'trash',
                                  label: 'Chuyển vào thùng rác',
                                  divider: true,
                                  variant: 'warning' as const,
                                  icon: <Trash2 className="size-4 text-amber-600 dark:text-amber-400" />,
                                  onClick: () => setConfirmDeleteDoc({ doc, permanent: false })
                                },
                            {
                              id: 'delete-perm',
                              label: 'Xóa vĩnh viễn',
                              variant: 'danger' as const,
                              icon: <XCircle className="size-4 text-rose-600 dark:text-rose-400" />,
                              onClick: () => setConfirmDeleteDoc({ doc, permanent: true })
                            }
                          ]}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid Card View */
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => {
              const isSelected = selectedIds.includes(doc.id)
              const isTrash = Boolean(doc.deletedAt)
              return (
                <div
                  key={doc.id}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/40 dark:border-cyan-500 dark:bg-cyan-950/20'
                      : isTrash
                      ? 'border-rose-200 bg-rose-50/20 dark:border-rose-900/50 dark:bg-rose-950/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Card Top Row: Checkbox, Format, Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSelect(doc.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4 text-[#155e75]" />
                          ) : (
                            <Square className="size-4" />
                          )}
                        </button>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${
                            doc.format === 'pdf'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                          }`}
                        >
                          {doc.format.toUpperCase()}
                        </span>
                      </div>
                      {isTrash ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          Thùng rác
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          Hoạt động
                        </span>
                      )}
                    </div>

                    {/* Card Body: Title & Original Name */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setPreviewingDoc(doc)}
                        className="font-bold text-slate-900 hover:text-[#155e75] hover:underline dark:text-white dark:hover:text-cyan-400 text-left line-clamp-2"
                        title={doc.displayName}
                      >
                        {doc.displayName}
                      </button>
                      <p className="mt-1 text-xs text-slate-400 truncate">
                        {doc.originalFileName} · {formatBytes(doc.fileSize)}
                      </p>
                    </div>

                    {/* Uploader Block */}
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                      <div
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${getAvatarColor(
                          doc.uploader.fullName
                        )}`}
                      >
                        {getInitials(doc.uploader.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {doc.uploader.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {doc.uploader.departmentName || doc.uploader.email || 'Thành viên'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400">
                      {formatDate(doc.createdAt)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewingDoc(doc)}
                        className="rounded px-2.5 py-1 text-xs font-bold text-[#155e75] hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/40 transition"
                      >
                        Xem trước
                      </button>
                      <AdminActionMenu
                        items={[
                          {
                            id: 'preview',
                            label: 'Xem trước nội dung',
                            icon: <Eye className="size-4 text-[#155e75] dark:text-cyan-400" />,
                            onClick: () => setPreviewingDoc(doc)
                          },
                          {
                            id: 'details',
                            label: 'Thông tin & audit',
                            icon: <Info className="size-4 text-slate-600 dark:text-slate-300" />,
                            onClick: () => setDetailsDoc(doc)
                          },
                          ...(!isTrash
                            ? [
                                {
                                  id: 'rename',
                                  label: 'Đổi tên tài liệu',
                                  icon: <Edit3 className="size-4 text-slate-600 dark:text-slate-300" />,
                                  onClick: () => handleOpenRename(doc)
                                }
                              ]
                            : []),
                          isTrash
                            ? {
                                id: 'restore',
                                label: 'Khôi phục tài liệu',
                                divider: true,
                                variant: 'success' as const,
                                icon: <RotateCcw className="size-4 text-emerald-600 dark:text-emerald-400" />,
                                onClick: () => void restoreDocument(doc.id)
                              }
                            : {
                                id: 'trash',
                                label: 'Chuyển vào thùng rác',
                                divider: true,
                                variant: 'warning' as const,
                                icon: <Trash2 className="size-4 text-amber-600 dark:text-amber-400" />,
                                onClick: () => setConfirmDeleteDoc({ doc, permanent: false })
                              },
                          {
                            id: 'delete-perm',
                            label: 'Xóa vĩnh viễn',
                            variant: 'danger' as const,
                            icon: <XCircle className="size-4 text-rose-600 dark:text-rose-400" />,
                            onClick: () => setConfirmDeleteDoc({ doc, permanent: true })
                          }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>
                Hiển thị{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(total, (page - 1) * pageSize + 1)}
                </strong>{' '}
                –{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(total, page * pageSize)}
                </strong>{' '}
                trên tổng số <strong className="text-slate-900 dark:text-white">{total}</strong> tệp
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <Select
                visualSize="compact"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                containerClassName="w-auto min-w-[130px]"
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={10}>10 tệp/trang</option>
                <option value={25}>25 tệp/trang</option>
                <option value={50}>50 tệp/trang</option>
              </Select>
            </div>

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
          </div>
        )}
      </Panel>

      {/* MODAL: Rename Document */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Đổi tên hiển thị tài liệu
              </h3>
              <button
                type="button"
                onClick={() => setRenamingDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Tệp gốc: <span className="font-mono">{renamingDoc.originalFileName}</span>
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên hiển thị mới
              </label>
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Nhập tên tài liệu mới..."
                className={adminInputClass}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenamingDoc(null)}
                className={secondaryButtonClass}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={saving || !newDisplayName.trim()}
                onClick={() => void handleSaveRename()}
                className={primaryButtonClass}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Technical Details & Audit Info */}
      {detailsDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-[#155e75] dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Thông tin kỹ thuật & Giám sát tài liệu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Mã tài liệu:</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{detailsDoc.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Tên hiển thị:</span>
                <span className="col-span-2 font-bold text-slate-900 dark:text-white">{detailsDoc.displayName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Tên tệp gốc:</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{detailsDoc.originalFileName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Kích thước:</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{formatBytes(detailsDoc.fileSize)} ({detailsDoc.fileSize.toLocaleString()} bytes)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Loại MIME:</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{detailsDoc.mediaType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Mã băm SHA-256:</span>
                <span className="col-span-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">{detailsDoc.checksum}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Storage Key:</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{detailsDoc.storageKey}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Người tải lên:</span>
                <span className="col-span-2 font-bold text-slate-800 dark:text-slate-200">
                  {detailsDoc.uploader.fullName} ({detailsDoc.uploader.username})
                  {detailsDoc.uploader.departmentName && ` — ${detailsDoc.uploader.departmentName}`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Email liên hệ:</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-200">{detailsDoc.uploader.email || '—'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Thời gian tạo:</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-200">{formatDate(detailsDoc.createdAt)}</span>
              </div>
              {detailsDoc.deletedAt && (
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                  <span className="font-semibold">Đã xóa lúc:</span>
                  <span className="col-span-2 font-bold">{formatDate(detailsDoc.deletedAt)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailsDoc(null)}
                className={secondaryButtonClass}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Delete (Soft or Permanent) */}
      {confirmDeleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="size-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {confirmDeleteDoc.permanent ? 'Xác nhận xóa vĩnh viễn tệp' : 'Chuyển tài liệu vào thùng rác'}
              </h3>
            </div>
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              {confirmDeleteDoc.permanent ? (
                <>
                  Bạn đang chuẩn bị <strong className="text-rose-600">xóa vĩnh viễn</strong> tài liệu{' '}
                  <strong className="text-slate-900 dark:text-white">“{confirmDeleteDoc.doc.displayName}”</strong>.
                  Tệp sẽ bị xóa vĩnh viễn khỏi hệ thống lưu trữ và không thể khôi phục.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn chuyển tài liệu{' '}
                  <strong className="text-slate-900 dark:text-white">“{confirmDeleteDoc.doc.displayName}”</strong> vào
                  thùng rác? Bạn vẫn có thể khôi phục lại bất kỳ lúc nào từ tab Thùng rác.
                </>
              )}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteDoc(null)}
                className={secondaryButtonClass}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleConfirmSingleDelete()}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition ${
                  confirmDeleteDoc.permanent
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {saving ? 'Đang xử lý...' : confirmDeleteDoc.permanent ? 'Xóa vĩnh viễn' : 'Chuyển thùng rác'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Batch Action */}
      {confirmBatchAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="size-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {confirmBatchAction === 'permanentDelete'
                  ? 'Xác nhận xóa vĩnh viễn hàng loạt'
                  : confirmBatchAction === 'restore'
                  ? 'Khôi phục hàng loạt tài liệu'
                  : 'Chuyển hàng loạt vào thùng rác'}
              </h3>
            </div>
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              Thao tác này sẽ áp dụng lên{' '}
              <strong className="text-slate-900 dark:text-white">{selectedIds.length}</strong> tệp tài liệu đã chọn.
              {confirmBatchAction === 'permanentDelete' && (
                <span className="block mt-2 font-bold text-rose-600">
                  Cảnh báo: Toàn bộ các tệp đã chọn sẽ bị xóa vĩnh viễn khỏi hệ thống lưu trữ và không thể khôi phục!
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmBatchAction(null)}
                className={secondaryButtonClass}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleConfirmBatch()}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition ${
                  confirmBatchAction === 'permanentDelete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : confirmBatchAction === 'restore'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {saving ? 'Đang xử lý...' : 'Xác nhận thực hiện'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
