import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminDocumentsApi,
  type AdminDocumentStats,
  type AdminUserDocumentItem,
  type ListAdminDocumentsOptions
} from '../../../shared/api/admin-documents.api'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

export {
  adminDocumentsApi,
  fetchAdminDocumentBlob,
  type AdminUserDocumentItem,
  type AdminDocumentStats,
  type ListAdminDocumentsResult,
  type ListAdminDocumentsOptions
} from '../../../shared/api/admin-documents.api'
export { getErrorMessage } from '../../../shared/lib/errors/apiError'

export function useAdminDocuments() {
  const toast = useToast()
  const [documents, setDocuments] = useState<AdminUserDocumentItem[]>([])
  const [stats, setStats] = useState<AdminDocumentStats>({
    totalFiles: 0,
    totalBytes: 0,
    activeCount: 0,
    trashCount: 0,
    docxCount: 0,
    pdfCount: 0,
    uploaderCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters & pagination
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState<'all' | 'docx' | 'pdf'>('all')
  const [tab, setTab] = useState<'active' | 'trash' | 'all'>('active')
  const [uploaderId, setUploaderId] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'createdAt' | 'fileSize' | 'displayName' | 'uploader'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const options: ListAdminDocumentsOptions = {
        search: search.trim() || undefined,
        format: format === 'all' ? undefined : format,
        tab,
        uploaderId: uploaderId === 'all' ? undefined : uploaderId,
        sortBy,
        sortOrder,
        page,
        pageSize
      }
      const res = await adminDocumentsApi.list(options)
      setDocuments(res.items)
      setTotal(res.total)
      setTotalPages(res.totalPages)
      setStats(res.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách tài liệu')
    } finally {
      setLoading(false)
    }
  }, [search, format, tab, uploaderId, sortBy, sortOrder, page, pageSize])

  useEffect(() => {
    void load()
  }, [load])

  // Clear selections when page/tab changes
  useEffect(() => {
    setSelectedIds([])
  }, [page, tab, format, uploaderId, search])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === documents.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(documents.map(d => d.id))
    }
  }, [documents, selectedIds.length])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  const renameDocument = useCallback(async (id: string, newName: string) => {
    setSaving(true)
    setError(null)
    try {
      await adminDocumentsApi.rename(id, newName)
      toast.success('Đã đổi tên tài liệu thành công')
      await load()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi đổi tên tài liệu'))
      return false
    } finally {
      setSaving(false)
    }
  }, [load, toast])

  const moveToTrash = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await adminDocumentsApi.delete(id)
      toast.success('Đã chuyển tài liệu vào thùng rác')
      await load()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi chuyển tài liệu vào thùng rác'))
      return false
    } finally {
      setSaving(false)
    }
  }, [load, toast])

  const restoreDocument = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await adminDocumentsApi.restore(id)
      toast.success('Đã khôi phục tài liệu thành công')
      await load()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi khôi phục tài liệu'))
      return false
    } finally {
      setSaving(false)
    }
  }, [load, toast])

  const permanentDelete = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await adminDocumentsApi.permanentDelete(id)
      toast.success('Đã xóa vĩnh viễn tài liệu khỏi hệ thống')
      await load()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi xóa tài liệu'))
      return false
    } finally {
      setSaving(false)
    }
  }, [load, toast])

  const batchAction = useCallback(async (action: 'trash' | 'restore' | 'permanentDelete') => {
    if (!selectedIds.length) return false
    const totalSelected = selectedIds.length
    setSaving(true)
    setError(null)
    try {
      const res = await adminDocumentsApi.batchAction(action, selectedIds)
      const actionName = action === 'trash' ? 'chuyển vào thùng rác' : action === 'restore' ? 'khôi phục' : 'xóa vĩnh viễn'
      if (res.affectedCount === totalSelected) {
        toast.success(`Đã ${actionName} ${res.affectedCount} tài liệu.`)
      } else if (res.affectedCount > 0) {
        toast.warning(`Chỉ có ${res.affectedCount}/${totalSelected} tài liệu được ${actionName}.`)
      } else {
        toast.error(`Không thể ${actionName} các tài liệu đã chọn.`)
      }
      setSelectedIds([])
      await load()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi thực hiện thao tác hàng loạt'))
      return false
    } finally {
      setSaving(false)
    }
  }, [selectedIds, load, toast])

  // Get distinct uploaders from current documents / stats for filter dropdown
  const uploaders = useMemo(() => {
    const map = new Map<string, { id: string; name: string; dept?: string | null }>()
    for (const doc of documents) {
      if (!map.has(doc.uploader.accountId)) {
        map.set(doc.uploader.accountId, {
          id: doc.uploader.accountId,
          name: doc.uploader.fullName,
          dept: doc.uploader.departmentName
        })
      }
    }
    return Array.from(map.values())
  }, [documents])

  const exportSummaryCsv = useCallback(() => {
    const headers = ['Mã tài liệu', 'Tên hiển thị', 'Tên tệp gốc', 'Định dạng', 'Dung lượng (Bytes)', 'Người tải lên', 'Email', 'Phòng ban', 'Ngày tải lên', 'Trạng thái']
    const rows = documents.map(d => [
      d.id,
      `"${d.displayName.replaceAll('"', '""')}"`,
      `"${d.originalFileName.replaceAll('"', '""')}"`,
      d.format.toUpperCase(),
      d.fileSize,
      `"${d.uploader.fullName.replaceAll('"', '""')}"`,
      `"${d.uploader.email || ''}"`,
      `"${d.uploader.departmentName || ''}"`,
      d.createdAt,
      d.deletedAt ? 'Thùng rác' : 'Hoạt động'
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bao-cao-tai-lieu-admin-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.info('Đã xuất báo cáo CSV danh sách tài liệu.')
  }, [documents, toast])

  return {
    documents,
    stats,
    loading,
    saving,
    error,
    notice: null,
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
    isAllSelected: documents.length > 0 && selectedIds.length === documents.length,
    load,
    renameDocument,
    moveToTrash,
    restoreDocument,
    permanentDelete,
    batchAction,
    uploaders,
    exportSummaryCsv
  }
}
