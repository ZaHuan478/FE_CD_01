import { useMemo, useState, useRef, useEffect, type ChangeEvent } from 'react'
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  History,
  LayoutGrid,
  Layers,
  List,
  RefreshCw,
  Search,
  UploadCloud,
  X
} from 'lucide-react'
import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'
import {
  getALL_MASTER_DATA_ITEMS,
  getDOMAIN_GROUPS,
  type CatalogViewModel,
  type DomainGroupId
} from '../../../entities/master-data/model/masterDataCatalogAdapter'
import { ModalDialog } from '../../../shared/ui/molecules/ModalDialog'
import {
  EmptyState,
  PageIntro,
  Panel,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass
} from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import { useToast } from '../../../shared/ui/toast'

export type MasterDataUploadStatus = 'synced' | 'pending' | 'draft' | 'archived'

export interface MasterDataVersion {
  version: string
  fileName: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  note: string
  recordCount: number
}

export interface MasterDataItemRecord {
  id: string
  catalogCode: string
  catalogTitle: string
  domainGroupId: DomainGroupId
  domainLabel: string
  tier: string
  fileName: string
  fileSize: number
  fileFormat: 'xlsx' | 'csv' | 'json'
  currentVersion: string
  recordCount: number
  fieldCount: number
  fields: string[]
  uploadedBy: string
  updatedAt: string
  status: MasterDataUploadStatus
  consumerModules: string[]
  versions: MasterDataVersion[]
}

const STORAGE_KEY = 'hrm_admin_master_data_items_v1'

const domainColorMap: Record<DomainGroupId, { bg: string; text: string; border: string }> = {
  identity: { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  geography: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  organization: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  timeshift: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  compensation: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  labor: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  governance: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' }
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDateTime(iso: string): string {
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

function generateInitialRecords(): MasterDataItemRecord[] {
  const domains = getDOMAIN_GROUPS()
  const domainMap = new Map(domains.map(d => [d.id, d.label]))
  const allCatalogs = getALL_MASTER_DATA_ITEMS()

  return allCatalogs.map((item: CatalogViewModel, idx: number): MasterDataItemRecord => {
    const format: 'xlsx' | 'csv' | 'json' = idx % 3 === 0 ? 'xlsx' : idx % 3 === 1 ? 'csv' : 'xlsx'
    const cleanCode = item.code.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${cleanCode}_master_data.${format}`
    const fileSize = Math.floor(18000 + (idx * 14500) % 350000)
    const recordCount = Math.floor(15 + (idx * 27) % 850)
    const versionStr = `v${Math.floor(idx / 5) + 1}.${(idx % 4) + 1}`
    const status: MasterDataUploadStatus = idx % 7 === 0 ? 'pending' : idx % 11 === 0 ? 'draft' : 'synced'

    const uploadDate = new Date(Date.now() - (idx * 36 + 2) * 3600 * 1000).toISOString()
    const prevDate = new Date(Date.now() - (idx * 36 + 72) * 3600 * 1000).toISOString()

    return {
      id: item.id,
      catalogCode: item.code,
      catalogTitle: item.title,
      domainGroupId: item.domainGroupId,
      domainLabel: domainMap.get(item.domainGroupId) || item.domainGroupId,
      tier: item.tier,
      fileName,
      fileSize,
      fileFormat: format,
      currentVersion: versionStr,
      recordCount,
      fieldCount: item.fieldCount || item.fields.length || 3,
      fields: item.fields && item.fields.length ? item.fields : ['Mã danh mục', 'Tên hiển thị', 'Mô tả', 'Trạng thái'],
      uploadedBy: idx % 2 === 0 ? 'demo-admin' : 'demo-super-admin',
      updatedAt: uploadDate,
      status,
      consumerModules: item.consumerModules || ['EMP'],
      versions: [
        {
          version: versionStr,
          fileName,
          fileSize,
          uploadedBy: idx % 2 === 0 ? 'demo-admin' : 'demo-super-admin',
          uploadedAt: uploadDate,
          note: `Đồng bộ định kỳ phiên bản ${versionStr} vào hệ thống Master Data`,
          recordCount
        },
        {
          version: `v${Math.floor(idx / 5) + 1}.0`,
          fileName: `${cleanCode}_v1_0.${format}`,
          fileSize: Math.floor(fileSize * 0.9),
          uploadedBy: 'system-migration',
          uploadedAt: prevDate,
          note: 'Khởi tạo ban đầu từ nguồn legacy snapshot',
          recordCount: Math.floor(recordCount * 0.85)
        }
      ]
    }
  })
}

export function AdminMasterDataWorkspace() {
  const [items, setItems] = useState<MasterDataItemRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved) as MasterDataItemRecord[]
    } catch {
      // fallback
    }
    return generateInitialRecords()
  })

  const saveItems = (updater: (prev: MasterDataItemRecord[]) => MasterDataItemRecord[]) => {
    setItems(prev => {
      const next = updater(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Filter state
  const [activeTab, setActiveTab] = useState<'all' | MasterDataUploadStatus>('all')
  const [selectedDomain, setSelectedDomain] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Modals & previews
  const [previewItem, setPreviewItem] = useState<MasterDataItemRecord | null>(null)
  const [historyItem, setHistoryItem] = useState<MasterDataItemRecord | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadTargetItem, setUploadTargetItem] = useState<MasterDataItemRecord | null>(null)

  const toast = useToast()

  const domains = useMemo(() => getDOMAIN_GROUPS(), [])

  // Filtered items
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter(item => {
      if (activeTab !== 'all' && item.status !== activeTab) return false
      if (selectedDomain !== 'all' && item.domainGroupId !== selectedDomain) return false
      if (q) {
        const matches =
          item.catalogCode.toLowerCase().includes(q) ||
          item.catalogTitle.toLowerCase().includes(q) ||
          item.fileName.toLowerCase().includes(q) ||
          item.domainLabel.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q)
        if (!matches) return false
      }
      return true
    })
  }, [items, activeTab, selectedDomain, search])

  // Aggregate stats
  const stats = useMemo(() => {
    const total = items.length
    const synced = items.filter(i => i.status === 'synced').length
    const pending = items.filter(i => i.status === 'pending').length
    const totalRecords = items.reduce((sum, i) => sum + i.recordCount, 0)
    const totalBytes = items.reduce((sum, i) => sum + i.fileSize, 0)
    return { total, synced, pending, totalRecords, totalBytes }
  }, [items])

  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1)
  }, [activeTab, selectedDomain, search])

  const total = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(total, startIndex + pageSize)
  const paginatedItems = useMemo(
    () => filteredItems.slice(startIndex, endIndex),
    [filteredItems, startIndex, endIndex]
  )

  const handleDownloadTemplate = (item?: MasterDataItemRecord) => {
    const fileName = item ? `Template_${item.catalogCode}.csv` : 'Template_MasterData_General.csv'
    const headers = item ? item.fields.join(',') : 'Code,Name,Description,Status,EffectiveFrom'
    const sampleRow = item
      ? item.fields.map((_, i) => `Sample_Val_${i + 1}`).join(',')
      : 'MD_001,Mẫu giá trị 1,Mô tả dữ liệu,Active,2026-01-01'
    const content = `\uFEFF${headers}\n${sampleRow}\n`
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    toast.info(`Đã tải xuống file template: ${fileName}`)
  }

  const handleDownloadFile = (item: MasterDataItemRecord) => {
    const headers = item.fields.join(',')
    const rows = Array.from({ length: Math.min(item.recordCount, 25) }, (_, i) =>
      item.fields.map((f, colIdx) => `${item.catalogCode}_${colIdx === 0 ? 'ITEM' : f.slice(0, 4)}_${i + 1}`).join(',')
    ).join('\n')
    const content = `\uFEFF${headers}\n${rows}\n`
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = item.fileName
    a.click()
    URL.revokeObjectURL(url)
    toast.info(`Đã tải xuống dữ liệu: ${item.fileName}`)
  }

  const handleSyncAll = () => {
    saveItems(prev =>
      prev.map(i => (i.status === 'pending' ? { ...i, status: 'synced', updatedAt: new Date().toISOString() } : i))
    )
    toast.success('Đã đồng bộ toàn bộ danh mục Master Data thành công.')
  }

  const handleToggleStatus = (id: string) => {
    saveItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item
        const nextStatus: MasterDataUploadStatus =
          item.status === 'synced' ? 'draft' : item.status === 'draft' ? 'pending' : 'synced'
        toast.info(`Đã đổi trạng thái danh mục: ${nextStatus === 'synced' ? 'Đã đồng bộ' : nextStatus === 'draft' ? 'Bản nháp' : 'Chờ xử lý'}`)
        return { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
      })
    )
  }

  return (
    <div className="space-y-5">
      <PageIntro
        title="Quản lý Master Data"
        description="Quản trị, kiểm tra và đồng bộ các tệp dữ liệu danh mục Master Data tải lên hệ thống."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadTemplate()}
              className={`${secondaryButtonClass} inline-flex items-center gap-2`}
              title="Tải tệp mẫu Excel/CSV chuẩn"
            >
              <Download className="size-4" />
              <span>Tải file mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleSyncAll}
              className={`${secondaryButtonClass} inline-flex items-center gap-2`}
              title="Đồng bộ tất cả danh mục chờ xử lý"
            >
              <RefreshCw className="size-4 text-[#155e75] dark:text-cyan-400" />
              <span>Đồng bộ dữ liệu</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadTargetItem(null)
                setUploadModalOpen(true)
              }}
              className={`${primaryButtonClass} inline-flex items-center gap-2 shadow-sm`}
            >
              <UploadCloud className="size-4" />
              <span>Tải lên Master Data</span>
            </button>
          </div>
        }
      />

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Bộ danh mục</span>
            <Database className="size-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs text-slate-500">danh mục</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Đã đồng bộ (Active)</span>
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.synced}</span>
            <span className="text-xs text-slate-500">áp dụng</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Chờ đồng bộ</span>
            <Clock className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</span>
            <span className="text-xs text-slate-500">bản ghi</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Dữ liệu lưu trữ</span>
            <FileSpreadsheet className="size-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalRecords.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">dòng ({formatBytes(stats.totalBytes)})</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Panel */}
      <Panel>
        {/* Controls and Filters */}
        <div className="space-y-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Tab navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'all'
                    ? 'bg-[#155e75] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Tất cả ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('synced')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'synced'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Đã đồng bộ ({items.filter(i => i.status === 'synced').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'pending'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Chờ đồng bộ ({items.filter(i => i.status === 'pending').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('draft')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'draft'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Bản nháp ({items.filter(i => i.status === 'draft').length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`rounded p-1.5 transition ${
                  viewMode === 'table'
                    ? 'bg-white text-[#155e75] shadow-xs dark:bg-slate-800 dark:text-cyan-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Dạng bảng chi tiết"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#155e75] shadow-xs dark:bg-slate-800 dark:text-cyan-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Dạng thẻ trực quan"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>

          {/* Search and Domain Select */}
          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm theo tên danh mục, mã catalog, tên file đã tải lên..."
                className={`${adminInputClass} pl-9 pr-8 text-xs`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <Select
                visualSize="compact"
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
                containerClassName="w-full sm:w-auto min-w-[220px]"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="all">Tất cả nhóm nghiệp vụ</option>
                {domains.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Content View */}
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center">
            <EmptyState
              title="Không tìm thấy danh mục Master Data phù hợp"
              description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn nhóm nghiệp vụ khác."
            />
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setSelectedDomain('all')
                setActiveTab('all')
              }}
              className={`${secondaryButtonClass} mt-2`}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Danh mục & Mã</th>
                  <th className="px-4 py-3">Nhóm nghiệp vụ</th>
                  <th className="px-4 py-3">Tệp nguồn đã tải lên</th>
                  <th className="px-4 py-3">Phiên bản & Dữ liệu</th>
                  <th className="px-4 py-3">Cập nhật gần nhất</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedItems.map(item => {
                  const domainColor = domainColorMap[item.domainGroupId] || domainColorMap.governance
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      {/* Catalog Name & Code */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#155e75] dark:bg-slate-800 dark:text-cyan-400 font-mono text-xs font-black">
                            {item.catalogCode.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                              {item.catalogTitle}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                {item.catalogCode}
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {item.tier}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Domain Group */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-md border px-2 py-1 text-[11px] font-medium leading-normal ${domainColor.bg} ${domainColor.text} ${domainColor.border}`}
                        >
                          {item.domainLabel}
                        </span>
                      </td>

                      {/* File Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800 dark:text-slate-200" title={item.fileName}>
                              {item.fileName}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {formatBytes(item.fileSize)} · {item.fileFormat.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Version & Record Count */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[11px] font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                              {item.currentVersion}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-sans">
                            {item.recordCount.toLocaleString()} bản ghi · {item.fieldCount} trường
                          </p>
                        </div>
                      </td>

                      {/* Updated date & user */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-500">
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {formatDateTime(item.updatedAt)}
                        </p>
                        <p className="text-slate-400">{item.uploadedBy}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {item.status === 'synced' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <CheckCircle2 className="size-3" />
                            Đã áp dụng
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                            <Clock className="size-3" />
                            Chờ đồng bộ
                          </span>
                        )}
                        {item.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                            <Layers className="size-3" />
                            Bản nháp
                          </span>
                        )}
                        {item.status === 'archived' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Lưu trữ
                          </span>
                        )}
                      </td>

                      {/* Actions with 3-dots Menu */}
                      <td className="px-4 py-3.5 text-right">
                        <AdminActionMenu
                          items={[
                            {
                              id: 'preview',
                              label: 'Xem cấu trúc & dữ liệu mẫu',
                              icon: <Eye className="size-4 text-[#155e75] dark:text-cyan-400" />,
                              onClick: () => setPreviewItem(item)
                            },
                            {
                              id: 'upload',
                              label: 'Tải lên tệp cập nhật mới',
                              icon: <UploadCloud className="size-4 text-emerald-600 dark:text-emerald-400" />,
                              onClick: () => {
                                setUploadTargetItem(item)
                                setUploadModalOpen(true)
                              }
                            },
                            {
                              id: 'download',
                              label: 'Tải tệp dữ liệu về máy',
                              icon: <Download className="size-4 text-slate-600 dark:text-slate-300" />,
                              onClick: () => handleDownloadFile(item)
                            },
                            {
                              id: 'history',
                              label: 'Lịch sử các phiên bản',
                              icon: <History className="size-4 text-indigo-600 dark:text-indigo-400" />,
                              onClick: () => setHistoryItem(item)
                            },
                            {
                              id: 'status',
                              label: 'Chuyển đổi trạng thái',
                              divider: true,
                              icon: <ArrowUpDown className="size-4 text-amber-600 dark:text-amber-400" />,
                              onClick: () => handleToggleStatus(item.id)
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
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map(item => {
              const domainColor = domainColorMap[item.domainGroupId] || domainColorMap.governance
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#155e75]/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#155e75] dark:text-cyan-400">
                        {item.catalogCode}
                      </span>
                      {item.status === 'synced' && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Đã áp dụng
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          Chờ đồng bộ
                        </span>
                      )}
                      {item.status === 'draft' && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          Bản nháp
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {item.catalogTitle}
                    </h3>

                    <p className="mt-1">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${domainColor.bg} ${domainColor.text}`}
                      >
                        {item.domainLabel}
                      </span>
                    </p>

                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Tệp:</span>
                        <span className="font-mono truncate max-w-[170px]" title={item.fileName}>
                          {item.fileName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Phiên bản:</span>
                        <span className="font-mono font-bold text-[#155e75] dark:text-cyan-400">
                          {item.currentVersion}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quy mô:</span>
                        <span>
                          {item.recordCount.toLocaleString()} bản ghi · {item.fieldCount} trường
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Cập nhật: {formatDateTime(item.updatedAt).split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="rounded px-2.5 py-1 text-xs font-bold text-[#155e75] hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-950/40 transition"
                      >
                        Xem trước
                      </button>
                      <AdminActionMenu
                        items={[
                          {
                            id: 'preview',
                            label: 'Xem cấu trúc & dữ liệu mẫu',
                            icon: <Eye className="size-4 text-[#155e75] dark:text-cyan-400" />,
                            onClick: () => setPreviewItem(item)
                          },
                          {
                            id: 'upload',
                            label: 'Tải lên tệp cập nhật mới',
                            icon: <UploadCloud className="size-4 text-emerald-600 dark:text-emerald-400" />,
                            onClick: () => {
                              setUploadTargetItem(item)
                              setUploadModalOpen(true)
                            }
                          },
                          {
                            id: 'download',
                            label: 'Tải tệp dữ liệu về máy',
                            icon: <Download className="size-4 text-slate-600 dark:text-slate-300" />,
                            onClick: () => handleDownloadFile(item)
                          },
                          {
                            id: 'history',
                            label: 'Lịch sử các phiên bản',
                            icon: <History className="size-4 text-indigo-600 dark:text-indigo-400" />,
                            onClick: () => setHistoryItem(item)
                          },
                          {
                            id: 'status',
                            label: 'Chuyển đổi trạng thái',
                            divider: true,
                            icon: <ArrowUpDown className="size-4 text-amber-600 dark:text-amber-400" />,
                            onClick: () => handleToggleStatus(item.id)
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

        {/* Master Data Pagination Footer */}
        {total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Hiển thị{' '}
                <strong className="text-slate-900 dark:text-white">
                  {startIndex + 1}
                </strong>{' '}
                –{' '}
                <strong className="text-slate-900 dark:text-white">
                  {endIndex}
                </strong>{' '}
                trên tổng số <strong className="text-slate-900 dark:text-white">{total}</strong> danh mục
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <Select
                visualSize="compact"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                aria-label="Số bản ghi trên mỗi trang"
                containerClassName="w-auto min-w-[150px]"
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value={10}>10 danh mục/trang</option>
                <option value={25}>25 danh mục/trang</option>
                <option value={50}>50 danh mục/trang</option>
              </Select>
            </div>

            <div className="flex items-center gap-1 self-center sm:self-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(1)}
                title="Trang đầu"
                aria-label="Trang đầu"
                className={`${secondaryButtonClass} !min-h-8 !px-2 text-xs`}
              >
                <ChevronsLeft className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                title="Trang trước"
                aria-label="Trang trước"
                className={`${secondaryButtonClass} !min-h-8 !px-2.5 text-xs`}
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push('ellipsis')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, idx) =>
                    p === 'ellipsis' ? (
                      <span key={`el-${idx}`} className="px-1 text-slate-400">...</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`grid size-8 place-items-center rounded-lg text-xs font-bold transition ${
                          currentPage === p
                            ? 'bg-[#155e75] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                title="Trang sau"
                aria-label="Trang sau"
                className={`${secondaryButtonClass} !min-h-8 !px-2.5 text-xs`}
              >
                <span className="hidden sm:inline">Sau</span>
                <ChevronRight className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(totalPages)}
                title="Trang cuối"
                aria-label="Trang cuối"
                className={`${secondaryButtonClass} !min-h-8 !px-2 text-xs`}
              >
                <ChevronsRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* MODAL 1: PREVIEW RECORDS & FIELDS */}
      {previewItem && (
        <ModalDialog
          title={`Xem trước dữ liệu · ${previewItem.catalogTitle} (${previewItem.catalogCode})`}
          onClose={() => setPreviewItem(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800 sm:grid-cols-4">
              <div>
                <span className="text-slate-400">Tệp nguồn:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                  {previewItem.fileName}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Phiên bản:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {previewItem.currentVersion}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Dung lượng:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {formatBytes(previewItem.fileSize)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Phân hệ tiêu thụ:</span>
                <p className="font-bold text-[#155e75] dark:text-cyan-400 truncate">
                  {previewItem.consumerModules.join(', ') || 'Toàn hệ thống'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Cấu trúc trường ({previewItem.fields.length} trường định nghĩa)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {previewItem.fields.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Bản ghi dữ liệu mẫu (Hiển thị 8/{previewItem.recordCount} dòng)
                </h4>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewItem)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#155e75] hover:underline dark:text-cyan-400"
                >
                  <Download className="size-3.5" />
                  Tải toàn bộ file
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 text-[11px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      {previewItem.fields.map((f, i) => (
                        <th key={i} className="px-3 py-2 font-mono">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Array.from({ length: 8 }).map((_, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono">
                        <td className="px-3 py-1.5 text-slate-400">{rIdx + 1}</td>
                        {previewItem.fields.map((f, colIdx) => (
                          <td key={colIdx} className="px-3 py-1.5 font-sans">
                            {colIdx === 0
                              ? `${previewItem.catalogCode}_${rIdx + 1}`
                              : colIdx === 1
                              ? `${previewItem.catalogTitle} số ${rIdx + 1}`
                              : f.toLowerCase().includes('trạng thái')
                              ? 'Hiệu lực'
                              : `Dữ liệu ${f} ${rIdx + 1}`}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className={secondaryButtonClass}
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = previewItem
                  setPreviewItem(null)
                  setUploadTargetItem(target)
                  setUploadModalOpen(true)
                }}
                className={primaryButtonClass}
              >
                <UploadCloud className="mr-1.5 inline size-4" />
                Tải lên bản cập nhật
              </button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* MODAL 2: VERSION HISTORY */}
      {historyItem && (
        <ModalDialog
          title={`Lịch sử phiên bản · ${historyItem.catalogTitle}`}
          onClose={() => setHistoryItem(null)}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Danh sách các lần upload và cập nhật dữ liệu của danh mục{' '}
              <strong className="text-slate-800 dark:text-slate-200">{historyItem.catalogCode}</strong>:
            </p>

            <div className="space-y-3">
              {historyItem.versions.map((ver, vIdx) => (
                <div
                  key={vIdx}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 font-mono">
                        {ver.version}
                      </span>
                      {vIdx === 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Hiện hành
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{formatDateTime(ver.uploadedAt)}</span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {ver.note}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span>
                      Tệp: <strong className="font-mono text-slate-700 dark:text-slate-300">{ver.fileName}</strong> ({formatBytes(ver.fileSize)})
                    </span>
                    <span>Người tải: {ver.uploadedBy}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setHistoryItem(null)}
                className={secondaryButtonClass}
              >
                Đóng
              </button>
            </div>
          </div>
        </ModalDialog>
      )}

      {/* MODAL 3: UPLOAD MASTER DATA FILE */}
      {uploadModalOpen && (
        <UploadMasterDataDialog
          targetItem={uploadTargetItem}
          domains={domains}
          allItems={items}
          onClose={() => {
            setUploadModalOpen(false)
            setUploadTargetItem(null)
          }}
          onSubmit={(newItem) => {
            saveItems(prev => {
              const existingIndex = prev.findIndex(i => i.catalogCode === newItem.catalogCode)
              if (existingIndex >= 0) {
                const updated = [...prev]
                const old = updated[existingIndex]!
                updated[existingIndex] = {
                  ...old,
                  ...newItem,
                  versions: [
                    {
                      version: newItem.currentVersion,
                      fileName: newItem.fileName,
                      fileSize: newItem.fileSize,
                      uploadedBy: newItem.uploadedBy,
                      uploadedAt: newItem.updatedAt,
                      note: `Cập nhật lên phiên bản ${newItem.currentVersion}`,
                      recordCount: newItem.recordCount
                    },
                    ...old.versions
                  ]
                }
                return updated
              }
              return [newItem, ...prev]
            })
            toast.success(`Đã tải lên và lưu bộ Master Data: ${newItem.catalogTitle} (${newItem.catalogCode})`)
            setUploadModalOpen(false)
            setUploadTargetItem(null)
          }}
        />
      )}
    </div>
  )
}

function UploadMasterDataDialog({
  targetItem,
  domains,
  allItems,
  onClose,
  onSubmit
}: {
  targetItem: MasterDataItemRecord | null
  domains: ReturnType<typeof getDOMAIN_GROUPS>
  allItems: MasterDataItemRecord[]
  onClose: () => void
  onSubmit: (item: MasterDataItemRecord) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [catalogCode, setCatalogCode] = useState(targetItem?.catalogCode || '')
  const [catalogTitle, setCatalogTitle] = useState(targetItem?.catalogTitle || '')
  const [domainGroupId, setDomainGroupId] = useState<DomainGroupId>(targetItem?.domainGroupId || 'identity')
  const [version, setVersion] = useState(targetItem ? `v${parseFloat(targetItem.currentVersion.replace('v', '')) + 0.1}` : 'v1.0')
  const [mode, setMode] = useState<'replace' | 'upsert'>('replace')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSelectCatalog = (code: string) => {
    setCatalogCode(code)
    const found = allItems.find(i => i.catalogCode === code)
    if (found) {
      setCatalogTitle(found.catalogTitle)
      setDomainGroupId(found.domainGroupId)
      setVersion(`v${(parseFloat(found.currentVersion.replace('v', '')) + 0.1).toFixed(1)}`)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase()
    if (!['.xlsx', '.xls', '.csv', '.json'].includes(ext)) {
      setFileError('Chỉ hỗ trợ file định dạng .xlsx, .csv hoặc .json')
      setSelectedFile(null)
      return
    }
    if (f.size > 25 * 1024 * 1024) {
      setFileError('Kích thước file không được vượt quá 25MB')
      setSelectedFile(null)
      return
    }
    setFileError('')
    setSelectedFile(f)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile && !targetItem) {
      setFileError('Vui lòng chọn tệp Master Data để tải lên')
      return
    }
    setSubmitting(true)

    setTimeout(() => {
      const fileName = selectedFile?.name || targetItem?.fileName || `${catalogCode}_upload.xlsx`
      const fileSize = selectedFile?.size || targetItem?.fileSize || 35000
      const format: 'xlsx' | 'csv' | 'json' = fileName.endsWith('.csv')
        ? 'csv'
        : fileName.endsWith('.json')
        ? 'json'
        : 'xlsx'

      const domainObj = domains.find(d => d.id === domainGroupId)

      const newItem: MasterDataItemRecord = {
        id: targetItem?.id || `md_custom_${Date.now()}`,
        catalogCode,
        catalogTitle: catalogTitle.trim() || catalogCode,
        domainGroupId,
        domainLabel: domainObj?.label || domainGroupId,
        tier: targetItem?.tier || 'Tầng 1 (Nền tảng)',
        fileName,
        fileSize,
        fileFormat: format,
        currentVersion: version.trim() || 'v1.0',
        recordCount: targetItem ? targetItem.recordCount + (mode === 'upsert' ? 25 : 0) : 120,
        fieldCount: targetItem?.fieldCount || 4,
        fields: targetItem?.fields || ['Mã', 'Tên', 'Mô tả', 'Trạng thái'],
        uploadedBy: 'demo-admin',
        updatedAt: new Date().toISOString(),
        status: 'synced',
        consumerModules: targetItem?.consumerModules || ['EMP'],
        versions: []
      }

      onSubmit(newItem)
      setSubmitting(false)
    }, 400)
  }

  return (
    <ModalDialog
      title={targetItem ? `Cập nhật Master Data · ${targetItem.catalogTitle}` : 'Tải lên bộ Master Data mới'}
      description="Tải lên tệp danh mục dữ liệu nền tảng định dạng Excel (.xlsx), CSV hoặc JSON."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Drag and Drop / Input */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
            Chọn tệp dữ liệu Master Data <span className="text-rose-500">*</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
              selectedFile
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:bg-slate-800'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className={`size-8 ${selectedFile ? 'text-emerald-600' : 'text-slate-400'}`} />
            {selectedFile ? (
              <div className="mt-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)} · Sẵn sàng tải lên</p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Nhấn để chọn tệp hoặc kéo thả vào đây
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Hỗ trợ Excel (.xlsx, .xls), CSV hoặc JSON (tối đa 25MB)</p>
              </div>
            )}
          </div>
          {fileError && <p className="mt-1 text-xs font-semibold text-rose-500">{fileError}</p>}
        </div>

        {/* Catalog Selection / Creation */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mã danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              value={catalogCode}
              onChange={e => handleSelectCatalog(e.target.value)}
              placeholder="Ví dụ: MD-CAT-04"
              className={adminInputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              value={catalogTitle}
              onChange={e => setCatalogTitle(e.target.value)}
              placeholder="Ví dụ: Dân tộc, Tôn giáo, Quốc tịch..."
              className={adminInputClass}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nhóm nghiệp vụ
            </label>
            <Select
              value={domainGroupId}
              onChange={e => setDomainGroupId(e.target.value as DomainGroupId)}
              className={adminInputClass}
            >
              {domains.map(d => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phiên bản (Version)
            </label>
            <input
              type="text"
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="v1.0"
              className={adminInputClass}
            />
          </div>
        </div>

        {/* Upload Mode */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Chế độ áp dụng dữ liệu
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                mode === 'replace'
                  ? 'border-[#155e75] bg-cyan-50/50 text-[#155e75] dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="uploadMode"
                value="replace"
                checked={mode === 'replace'}
                onChange={() => setMode('replace')}
                className="size-3.5 text-[#155e75]"
              />
              <span>Ghi đè hoàn toàn (Full Replace)</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                mode === 'upsert'
                  ? 'border-[#155e75] bg-cyan-50/50 text-[#155e75] dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-300'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="uploadMode"
                value="upsert"
                checked={mode === 'upsert'}
                onChange={() => setMode('upsert')}
                className="size-3.5 text-[#155e75]"
              />
              <span>Cập nhật & Bổ sung (Upsert / Merge)</span>
            </label>
          </div>
        </div>

        {/* Change Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Ghi chú thay đổi (Change Log)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Mô tả lý do upload hoặc các thay đổi trong phiên bản dữ liệu này..."
            className={`${adminInputClass} h-auto py-2`}
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className={secondaryButtonClass}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={primaryButtonClass}
          >
            {submitting ? 'Đang xử lý...' : 'Tải lên & Lưu Master Data'}
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
