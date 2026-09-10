import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  AlertCircle,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  LoaderCircle,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react'
import {
  myDocumentsApi,
  fetchDocumentBlob,
  getErrorMessage,
  type UserDocumentItem
} from '../model/myDocumentsModel'
import { Feedback, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'
import { Select } from '../../../shared/ui/atoms/Select'
import { useToast } from '../../../shared/ui/toast'

const PersonalDocumentViewer = lazy(() =>
  import('./PersonalDocumentViewer').then((module) => ({ default: module.PersonalDocumentViewer }))
)

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch {
    return dateString
  }
}

export function MyDocumentsWorkspace() {
  const toast = useToast()
  const [documents, setDocuments] = useState<UserDocumentItem[]>([])
  const [activeDoc, setActiveDoc] = useState<UserDocumentItem | null>(null)
  const [currentTab, setCurrentTab] = useState<'active' | 'trash'>('active')
  const [formatFilter, setFormatFilter] = useState<'all' | 'docx' | 'pdf'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Upload modal / panel state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customDisplayName, setCustomDisplayName] = useState('')
  const [fileError, setFileError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState<UserDocumentItem | null>(null)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)

  // Action state
  const [busyActionId, setBusyActionId] = useState<string | null>(null)

  // Load documents list
  const loadDocuments = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const response = await myDocumentsApi.list(
        {
          tab: currentTab,
          format: formatFilter,
          search: searchKeyword,
          page,
          pageSize
        },
        signal
      )
      if (signal?.aborted) return
      setDocuments(response.data.items)
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : 'Không tải được danh sách tài liệu')
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [currentTab, formatFilter, page, pageSize, searchKeyword])

  useEffect(() => {
    const controller = new AbortController()
    const requestTimer = window.setTimeout(() => void loadDocuments(controller.signal), 0)
    return () => {
      window.clearTimeout(requestTimer)
      controller.abort()
    }
  }, [loadDocuments])

  // Handle Search submit
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearchKeyword(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchKeyword('')
    setPage(1)
  }

  // Handle File selection
  const handleChooseFile = (file: File | null) => {
    setFileError('')
    if (!file) {
      setSelectedFile(null)
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!['docx', 'pdf'].includes(extension ?? '')) {
      setFileError('Chỉ chấp nhận tệp định dạng .docx hoặc .pdf')
      setSelectedFile(null)
      return
    }

    if (file.size === 0) {
      setFileError('Tệp không có nội dung (0 byte). Vui lòng chọn tệp hợp lệ.')
      setSelectedFile(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Dung lượng tệp vượt quá 10 MB.')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setCustomDisplayName(file.name)
  }

  // Handle Upload
  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setFileError('Vui lòng chọn một tệp .docx hoặc .pdf')
      return
    }

    setIsUploading(true)
    setError('')
    setFileError('')

    const formData = new FormData()
    formData.set('file', selectedFile)
    if (customDisplayName.trim()) {
      formData.set('displayName', customDisplayName.trim())
    }

    try {
      const result = await myDocumentsApi.upload(formData)
      toast.success(`Tải lên thành công tài liệu: “${result.data.displayName}”`)
      setIsUploadOpen(false)
      setSelectedFile(null)
      setCustomDisplayName('')
      setPage(1)
      if (currentTab !== 'active') {
        setCurrentTab('active')
      } else {
        void loadDocuments()
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể tải tài liệu lên'))
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Rename
  const handleOpenRename = (doc: UserDocumentItem) => {
    setRenameTarget(doc)
    setNewDisplayName(doc.displayName)
  }

  const handleRenameSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!renameTarget || !newDisplayName.trim()) return

    setIsRenaming(true)
    setError('')

    try {
      const updated = await myDocumentsApi.rename(renameTarget.id, newDisplayName.trim())
      setDocuments((prev) =>
        prev.map((item) => (item.id === updated.data.id ? { ...item, displayName: updated.data.displayName } : item))
      )
      if (activeDoc?.id === updated.data.id) {
        setActiveDoc(updated.data)
      }
      toast.success(`Đã đổi tên tài liệu thành: “${updated.data.displayName}”`)
      setRenameTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể đổi tên tài liệu'))
    } finally {
      setIsRenaming(false)
    }
  }

  // Handle Soft Delete
  const handleDelete = async (doc: UserDocumentItem) => {
    if (!window.confirm(`Chuyển tài liệu “${doc.displayName}” vào thùng rác? Bạn có thể khôi phục lại khi cần.`)) {
      return
    }

    setBusyActionId(doc.id)
    setError('')

    try {
      await myDocumentsApi.delete(doc.id)
      toast.success(`Đã chuyển “${doc.displayName}” vào thùng rác.`)
      if (activeDoc?.id === doc.id) {
        setActiveDoc(null)
      }
      void loadDocuments()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể xóa tài liệu'))
    } finally {
      setBusyActionId(null)
    }
  }

  // Handle Restore
  const handleRestore = async (doc: UserDocumentItem) => {
    setBusyActionId(doc.id)
    setError('')

    try {
      const restored = await myDocumentsApi.restore(doc.id)
      toast.success(`Đã khôi phục tài liệu: “${restored.data.displayName}”`)
      void loadDocuments()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không thể khôi phục tài liệu'))
    } finally {
      setBusyActionId(null)
    }
  }

  // Handle Direct Download
  const handleDownloadOriginal = async (doc: UserDocumentItem) => {
    try {
      const blob = await fetchDocumentBlob(doc.id)
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const extension = doc.format
      const filename = doc.displayName.endsWith(`.${extension}`) ? doc.displayName : `${doc.displayName}.${extension}`
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(downloadUrl)
      toast.info(`Đang tải file: “${filename}”`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được file tài liệu'))
    }
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Alerts */}
      {error && <Feedback type="error">{error}</Feedback>}

      {/* If document viewer is opened, render it inline */}
      {activeDoc ? (
        <Suspense
          fallback={
            <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <LoaderCircle className="size-8 animate-spin text-[#1f5f86]" />
              <span className="text-sm font-bold text-slate-500">Đang mở trình xem tài liệu...</span>
            </div>
          }
        >
          <PersonalDocumentViewer
            key={activeDoc.id}
            document={activeDoc}
            onClose={() => setActiveDoc(null)}
          />
        </Suspense>
      ) : (
        <>
          {/* Main Control Panel */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            {/* Tabs: Active vs Trash */}
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('active')
                  setPage(1)
                }}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  currentTab === 'active'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Tài liệu đang lưu
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('trash')
                  setPage(1)
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  currentTab === 'trash'
                    ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Trash2 className="size-3.5" />
                <span>Thùng rác</span>
              </button>
            </div>

            {/* Actions: Search, Filter, Upload */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative min-w-[200px] flex-1 sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pr-8 pl-9 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#1f5f86] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <Search className="absolute top-2 left-2.5 size-4 text-slate-400" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </form>

              {/* Format Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="size-3.5 text-slate-400 shrink-0 hidden md:block" />
                <Select
                  visualSize="compact"
                  aria-label="Lọc theo định dạng tài liệu"
                  value={formatFilter}
                  onChange={(e) => {
                    setFormatFilter(e.target.value as 'all' | 'docx' | 'pdf')
                    setPage(1)
                  }}
                  containerClassName="w-auto min-w-[155px]"
                  className="rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">Tất cả định dạng</option>
                  <option value="docx">Word (.docx)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </Select>
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(true)
                  setSelectedFile(null)
                  setFileError('')
                }}
                className={`${primaryButtonClass} inline-flex items-center gap-1.5 shrink-0`}
              >
                <Plus className="size-4" />
                <span>Upload tài liệu</span>
              </button>
            </div>
          </div>

          {/* Upload Modal */}
          {isUploadOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-fadeIn">
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Tải lên tài liệu cá nhân</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Chấp nhận tệp .docx hoặc .pdf, dung lượng tối đa 10 MB.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChooseFile(e.target.files?.[0] ?? null)
                    }
                  />

                  {/* Dropzone */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-[#1f5f86] hover:bg-sky-50/40 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:hover:border-sky-500"
                  >
                    <UploadCloud className="size-10 text-[#1f5f86] dark:text-sky-400" />
                    <span className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                      {selectedFile ? selectedFile.name : 'Bấm để chọn file hoặc kéo thả vào đây'}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      {selectedFile
                        ? formatBytes(selectedFile.size)
                        : 'Hỗ trợ Microsoft Word (.docx) và Adobe Acrobat (.pdf)'}
                    </span>
                  </button>

                  {fileError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  {selectedFile && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tên hiển thị (mặc định lấy tên file)
                      </label>
                      <input
                        type="text"
                        value={customDisplayName}
                        onChange={(e) => setCustomDisplayName(e.target.value)}
                        placeholder={selectedFile.name}
                        className={adminInputClass}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => setIsUploadOpen(false)}
                      className={secondaryButtonClass}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedFile || isUploading}
                      className={`${primaryButtonClass} min-w-28`}
                    >
                      {isUploading ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          <span>Đang tải lên...</span>
                        </>
                      ) : (
                        'Tải lên ngay'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Rename Modal */}
          {renameTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-fadeIn">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Đổi tên hiển thị tài liệu</h3>
                  <button
                    type="button"
                    onClick={() => setRenameTarget(null)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleRenameSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tên hiển thị mới
                    </label>
                    <input
                      type="text"
                      required
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Nhập tên mới cho tài liệu..."
                      className={adminInputClass}
                      autoFocus
                    />
                    <p className="mt-1 text-[11px] text-slate-500">File gốc: {renameTarget.originalFileName}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      disabled={isRenaming}
                      onClick={() => setRenameTarget(null)}
                      className={secondaryButtonClass}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={!newDisplayName.trim() || isRenaming}
                      className={`${primaryButtonClass} min-w-24`}
                    >
                      {isRenaming ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        'Lưu tên mới'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Main Documents Table Panel */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
                <LoaderCircle className="size-7 animate-spin text-[#1f5f86]" />
                <span className="text-xs font-bold">Đang tải danh sách tài liệu...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <FileText className="size-7" />
                </div>
                <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {currentTab === 'trash'
                    ? 'Thùng rác đang trống'
                    : searchKeyword
                    ? `Không tìm thấy tài liệu phù hợp với “${searchKeyword}”`
                    : 'Chưa có tài liệu nào trong kho cá nhân'}
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  {currentTab === 'trash'
                    ? 'Các tài liệu bạn xóa sẽ được lưu trữ tại đây và có thể khôi phục bất cứ lúc nào.'
                    : searchKeyword
                    ? 'Vui lòng kiểm tra lại từ khóa hoặc xóa bộ lọc để xem toàn bộ danh sách.'
                    : 'Tải lên tài liệu Word (.docx) hoặc PDF (.pdf) đầu tiên của bạn để bắt đầu lưu trữ và tra cứu.'}
                </p>
                {currentTab === 'active' && !searchKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadOpen(true)
                      setSelectedFile(null)
                    }}
                    className={`${primaryButtonClass} mt-4 inline-flex items-center gap-1.5`}
                  >
                    <Plus className="size-4" />
                    <span>Tải lên tài liệu ngay</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                      <th scope="col" className="py-3.5 px-4">
                        Tên tài liệu
                      </th>
                      <th scope="col" className="py-3.5 px-4 w-28">
                        Định dạng
                      </th>
                      <th scope="col" className="py-3.5 px-4 w-28">
                        Dung lượng
                      </th>
                      <th scope="col" className="py-3.5 px-4 w-40">
                        {currentTab === 'trash' ? 'Ngày xóa' : 'Ngày upload'}
                      </th>
                      <th scope="col" className="py-3.5 px-4 text-right w-48">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                    {documents.map((doc) => {
                      const isBusy = busyActionId === doc.id
                      return (
                        <tr
                          key={doc.id}
                          className="group hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                        >
                          {/* Name */}
                          <td className="py-3.5 px-4 min-w-[220px]">
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 rounded-lg p-2 shrink-0 ${
                                  doc.format === 'pdf'
                                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                                }`}
                              >
                                <FileText className="size-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveDoc(doc)}
                                  className="text-left font-bold text-slate-900 hover:text-[#1f5f86] dark:text-white dark:hover:text-sky-300 break-words line-clamp-2 cursor-pointer transition"
                                  title="Bấm để xem trực tiếp"
                                >
                                  {doc.displayName}
                                </button>
                                <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                                  {doc.originalFileName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Format */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-black uppercase tracking-wider ${
                                doc.format === 'pdf'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                              }`}
                            >
                              {doc.format.toUpperCase()}
                            </span>
                          </td>

                          {/* File size */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                            {formatBytes(doc.fileSize)}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                            {formatDate(currentTab === 'trash' && doc.deletedAt ? doc.deletedAt : doc.createdAt)}
                          </td>

                          {/* Actions with 3-dots Menu */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <AdminActionMenu
                              items={
                                currentTab === 'active'
                                  ? [
                                      {
                                        id: 'preview',
                                        label: 'Xem trực tiếp trên web',
                                        icon: <Eye className="size-4 text-sky-600 dark:text-sky-400" />,
                                        onClick: () => setActiveDoc(doc)
                                      },
                                      {
                                        id: 'download',
                                        label: 'Tải file gốc về máy',
                                        icon: <Download className="size-4 text-slate-600 dark:text-slate-300" />,
                                        onClick: () => handleDownloadOriginal(doc)
                                      },
                                      {
                                        id: 'rename',
                                        label: 'Đổi tên hiển thị',
                                        icon: <Edit2 className="size-4 text-slate-600 dark:text-slate-300" />,
                                        onClick: () => handleOpenRename(doc)
                                      },
                                      {
                                        id: 'delete',
                                        label: 'Chuyển vào thùng rác',
                                        divider: true,
                                        variant: 'warning' as const,
                                        disabled: isBusy,
                                        icon: <Trash2 className="size-4 text-amber-600 dark:text-amber-400" />,
                                        onClick: () => void handleDelete(doc)
                                      }
                                    ]
                                  : [
                                      {
                                        id: 'preview',
                                        label: 'Xem trực tiếp trên web',
                                        icon: <Eye className="size-4 text-sky-600 dark:text-sky-400" />,
                                        onClick: () => setActiveDoc(doc)
                                      },
                                      {
                                        id: 'download',
                                        label: 'Tải file gốc về máy',
                                        icon: <Download className="size-4 text-slate-600 dark:text-slate-300" />,
                                        onClick: () => handleDownloadOriginal(doc)
                                      },
                                      {
                                        id: 'restore',
                                        label: 'Khôi phục tài liệu',
                                        divider: true,
                                        variant: 'success' as const,
                                        disabled: isBusy,
                                        icon: <RotateCcw className="size-4 text-emerald-600 dark:text-emerald-400" />,
                                        onClick: () => void handleRestore(doc)
                                      }
                                    ]
                              }
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/30">
                <span className="text-slate-500">
                  Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} trên tổng số {total} tài liệu
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`min-w-8 rounded-lg px-2.5 py-1.5 font-bold transition ${
                        page === pageNum
                          ? 'bg-[#1f5f86] text-white shadow-2xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
