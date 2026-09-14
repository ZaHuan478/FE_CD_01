import { apiRequest, parseApiErrorResponse, isAbortError, ApiClientError } from './httpClient'
import { apiBaseUrl } from '../config/api'
import { getAuthenticationHeaders } from '../lib/auth/authCredentials'

export interface AdminDocumentUploader {
  accountId: string
  fullName: string
  username: string
  email: string | null
  employeeCode: string | null
  departmentName: string | null
  jobTitle: string | null
  systemRole: string
}

export interface AdminUserDocumentItem {
  id: string
  originalFileName: string
  displayName: string
  storageKey: string
  mediaType: string
  format: 'docx' | 'pdf'
  fileSize: number
  checksum: string
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sourceImportJobId: string | null
  uploader: AdminDocumentUploader
}

export interface AdminDocumentStats {
  totalFiles: number
  totalBytes: number
  activeCount: number
  trashCount: number
  docxCount: number
  pdfCount: number
  uploaderCount: number
}

export interface ListAdminDocumentsResult {
  items: AdminUserDocumentItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  stats: AdminDocumentStats
}

export interface ListAdminDocumentsOptions {
  search?: string
  format?: 'all' | 'docx' | 'pdf'
  tab?: 'active' | 'trash' | 'all'
  uploaderId?: string
  sortBy?: 'createdAt' | 'fileSize' | 'displayName' | 'uploader'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// Fallback seed data for development/offline mode
const mockUploaders: AdminDocumentUploader[] = [
  {
    accountId: 'acc-hr-01',
    fullName: 'Trần Thị Bích Ngọc',
    username: 'ngocttb',
    email: 'ngocttb@lta-hrux.com',
    employeeCode: 'HR-0042',
    departmentName: 'Phòng Nhân sự & Đào tạo',
    jobTitle: 'Trưởng nhóm C&B',
    systemRole: 'USER'
  },
  {
    accountId: 'acc-rec-02',
    fullName: 'Lê Minh Tâm',
    username: 'tamlm',
    email: 'tamlm@lta-hrux.com',
    employeeCode: 'REC-0018',
    departmentName: 'Phòng Tuyển dụng',
    jobTitle: 'Chuyên viên Thu hút Nhân tài',
    systemRole: 'USER'
  },
  {
    accountId: 'acc-ops-03',
    fullName: 'Nguyễn Hoài Nam',
    username: 'namnh',
    email: 'namnh@lta-hrux.com',
    employeeCode: 'OPS-0091',
    departmentName: 'Phòng Vận hành & Hành chính',
    jobTitle: 'Chuyên viên Vận hành',
    systemRole: 'USER'
  },
  {
    accountId: 'acc-tech-04',
    fullName: 'Vũ Quốc Huy',
    username: 'huyvq',
    email: 'huyvq@lta-hrux.com',
    employeeCode: 'IT-0025',
    departmentName: 'Khối Công nghệ Thông tin',
    jobTitle: 'Kỹ sư Hệ thống',
    systemRole: 'USER'
  }
]

let fallbackDocuments: AdminUserDocumentItem[] = [
  {
    id: 'udoc-adm-001',
    originalFileName: 'Quy_che_Luong_Thuong_2026.docx',
    displayName: 'Quy chế Tiền lương & Phúc lợi Toàn công ty 2026',
    storageKey: 'udoc-adm-001.docx',
    mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'docx',
    fileSize: 1024 * 1024 * 2.4, // 2.4 MB
    checksum: 'a9b2c3d4e5f60172839401827364519283746592817263540192837465019283',
    createdBy: 'acc-hr-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[0]
  },
  {
    id: 'udoc-adm-002',
    originalFileName: 'Noi_quy_Lao_dong_Chinh_thuc_V4.pdf',
    displayName: 'Nội quy Lao động Doanh nghiệp (Bản ban hành chính thức)',
    storageKey: 'udoc-adm-002.pdf',
    mediaType: 'application/pdf',
    format: 'pdf',
    fileSize: 1024 * 1024 * 4.8, // 4.8 MB
    checksum: 'bc3d4e5f6a701827364501928374659201928374650192837465019283746501',
    createdBy: 'acc-hr-01',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[0]
  },
  {
    id: 'udoc-adm-003',
    originalFileName: 'Mau_Danh_gia_Thu_viec_2026.docx',
    displayName: 'Mẫu Tiêu chuẩn Đánh giá Thử việc Nhân viên Mới',
    storageKey: 'udoc-adm-003.docx',
    mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'docx',
    fileSize: 1024 * 720, // 720 KB
    checksum: 'c4d5e6f7a8b19283746501928374659201928374650192837465019283746502',
    createdBy: 'acc-rec-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[1]
  },
  {
    id: 'udoc-adm-004',
    originalFileName: 'So_tay_Onboarding_Nhan_vien_2026.pdf',
    displayName: 'Sổ tay Hội nhập & Chào đón Nhân sự Mới 2026',
    storageKey: 'udoc-adm-004.pdf',
    mediaType: 'application/pdf',
    format: 'pdf',
    fileSize: 1024 * 1024 * 8.1, // 8.1 MB
    checksum: 'd5e6f7a8b9c20394857601928374659201928374650192837465019283746503',
    createdBy: 'acc-rec-02',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[1]
  },
  {
    id: 'udoc-adm-005',
    originalFileName: 'Quy_trinh_De_xuat_Mua_sam_Thiet_bi.docx',
    displayName: 'Quy trình Đề xuất & Phê duyệt Mua sắm Thiết bị Văn phòng',
    storageKey: 'udoc-adm-005.docx',
    mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'docx',
    fileSize: 1024 * 1024 * 1.2, // 1.2 MB
    checksum: 'e6f7a8b9c0d31405968701928374659201928374650192837465019283746504',
    createdBy: 'acc-ops-03',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[2]
  },
  {
    id: 'udoc-adm-006',
    originalFileName: 'Chinh_sach_Bao_mat_Thong_tin_Noi_bo.pdf',
    displayName: 'Chính sách An toàn Thông tin & Sử dụng Tài nguyên IT',
    storageKey: 'udoc-adm-006.pdf',
    mediaType: 'application/pdf',
    format: 'pdf',
    fileSize: 1024 * 1024 * 3.6, // 3.6 MB
    checksum: 'f7a8b9c0d1e42516079801928374659201928374650192837465019283746505',
    createdBy: 'acc-tech-04',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    deletedAt: null,
    sourceImportJobId: null,
    uploader: mockUploaders[3]
  },
  {
    id: 'udoc-adm-007',
    originalFileName: 'Bao_cao_Kiem_ke_Q4_Draft.docx',
    displayName: 'Báo cáo Kiểm kê Tài sản Doanh nghiệp Q4 (Bản thảo cũ)',
    storageKey: 'udoc-adm-007.docx',
    mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    format: 'docx',
    fileSize: 1024 * 890,
    checksum: '08b9c0d1e2f53627180901928374659201928374650192837465019283746506',
    createdBy: 'acc-ops-03',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    sourceImportJobId: null,
    uploader: mockUploaders[2]
  }
]

// Mock records are available only for an explicitly requested standalone demo.
// Normal development and production must surface backend errors so the UI does
// not report a successful mutation that never reached the database.
const demoFallbackEnabled = import.meta.env.VITE_ADMIN_DOCUMENT_DEMO_FALLBACK === 'true'

function computeFallbackStats(): AdminDocumentStats {
  const totalFiles = fallbackDocuments.length
  const totalBytes = fallbackDocuments.reduce((sum, d) => sum + d.fileSize, 0)
  const activeCount = fallbackDocuments.filter(d => !d.deletedAt).length
  const trashCount = fallbackDocuments.filter(d => !!d.deletedAt).length
  const docxCount = fallbackDocuments.filter(d => d.format === 'docx').length
  const pdfCount = fallbackDocuments.filter(d => d.format === 'pdf').length
  const uploaderCount = new Set(fallbackDocuments.map(d => d.createdBy)).size

  return {
    totalFiles,
    totalBytes,
    activeCount,
    trashCount,
    docxCount,
    pdfCount,
    uploaderCount
  }
}

function getFallbackList(options: ListAdminDocumentsOptions = {}): ListAdminDocumentsResult {
  const page = Math.max(1, Number(options.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(options.pageSize) || 10))
  const tab = options.tab || 'active'

  let filtered = [...fallbackDocuments]

  if (tab === 'trash') {
    filtered = filtered.filter(d => d.deletedAt !== null)
  } else if (tab === 'active') {
    filtered = filtered.filter(d => d.deletedAt === null)
  }

  if (options.format && options.format !== 'all') {
    filtered = filtered.filter(d => d.format === options.format)
  }

  if (options.uploaderId?.trim()) {
    filtered = filtered.filter(d => d.createdBy === options.uploaderId?.trim())
  }

  if (options.search?.trim()) {
    const q = options.search.trim().toLowerCase()
    filtered = filtered.filter(d =>
      d.displayName.toLowerCase().includes(q) ||
      d.originalFileName.toLowerCase().includes(q) ||
      d.uploader.fullName.toLowerCase().includes(q) ||
      d.uploader.username.toLowerCase().includes(q) ||
      (d.uploader.email && d.uploader.email.toLowerCase().includes(q))
    )
  }

  // Sort
  const sortDir = options.sortOrder === 'asc' ? 1 : -1
  filtered.sort((a, b) => {
    if (options.sortBy === 'fileSize') return (a.fileSize - b.fileSize) * sortDir
    if (options.sortBy === 'displayName') return a.displayName.localeCompare(b.displayName) * sortDir
    if (options.sortBy === 'uploader') return a.uploader.fullName.localeCompare(b.uploader.fullName) * sortDir
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortDir
  })

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize) || 1
  const offset = (page - 1) * pageSize
  const items = filtered.slice(offset, offset + pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    stats: computeFallbackStats()
  }
}

export async function fetchAdminDocumentBlob(id: string, signal?: AbortSignal): Promise<Blob> {
  try {
    const response = await fetch(`${apiBaseUrl}/admin/documents/${encodeURIComponent(id)}/file`, {
      headers: getAuthenticationHeaders(),
      signal,
      cache: 'no-store'
    })
    if (!response.ok) {
      throw await parseApiErrorResponse(response)
    }
    return await response.blob()
  } catch (error) {
    if (isAbortError(error) || error instanceof ApiClientError) {
      throw error
    }
    if (!demoFallbackEnabled) throw error
  }

  const doc = fallbackDocuments.find(d => d.id === id)
  if (!doc) throw new Error('Không tìm thấy tài liệu demo')
  const isPdf = doc?.format === 'pdf'
  const text = isPdf
    ? `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF`
    : `Tài liệu: ${doc?.displayName || 'Tài liệu quản trị'}\nNgười tải: ${doc?.uploader.fullName || 'Người dùng'}`
  return new Blob([text], { type: doc?.mediaType || (isPdf ? 'application/pdf' : 'text/plain') })
}

export const adminDocumentsApi = {
  list: async (options: ListAdminDocumentsOptions = {}, signal?: AbortSignal): Promise<ListAdminDocumentsResult> => {
    const params = new URLSearchParams()
    if (options.search?.trim()) params.set('search', options.search.trim())
    if (options.format && options.format !== 'all') params.set('format', options.format)
    if (options.tab) params.set('tab', options.tab)
    if (options.uploaderId?.trim()) params.set('uploaderId', options.uploaderId.trim())
    if (options.sortBy) params.set('sortBy', options.sortBy)
    if (options.sortOrder) params.set('sortOrder', options.sortOrder)
    if (options.page) params.set('page', String(options.page))
    if (options.pageSize) params.set('pageSize', String(options.pageSize))

    const query = params.toString() ? `?${params.toString()}` : ''
    try {
      const res = await apiRequest<{ data: ListAdminDocumentsResult }>(`/admin/documents${query}`, { signal })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      return getFallbackList(options)
    }
  },

  get: async (id: string, signal?: AbortSignal): Promise<AdminUserDocumentItem> => {
    try {
      const res = await apiRequest<{ data: AdminUserDocumentItem }>(`/admin/documents/${encodeURIComponent(id)}`, { signal })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      const doc = fallbackDocuments.find(d => d.id === id)
      if (!doc) throw new Error('Không tìm thấy tài liệu')
      return doc
    }
  },

  rename: async (id: string, displayName: string): Promise<AdminUserDocumentItem> => {
    try {
      const res = await apiRequest<{ data: AdminUserDocumentItem }>(`/admin/documents/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ displayName })
      })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      const doc = fallbackDocuments.find(d => d.id === id)
      if (doc) {
        doc.displayName = displayName
        doc.updatedAt = new Date().toISOString()
      }
      return doc || fallbackDocuments[0]
    }
  },

  delete: async (id: string): Promise<AdminUserDocumentItem> => {
    try {
      const res = await apiRequest<{ data: AdminUserDocumentItem }>(`/admin/documents/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      const doc = fallbackDocuments.find(d => d.id === id)
      if (doc) {
        doc.deletedAt = new Date().toISOString()
        doc.updatedAt = new Date().toISOString()
      }
      return doc || fallbackDocuments[0]
    }
  },

  restore: async (id: string): Promise<AdminUserDocumentItem> => {
    try {
      const res = await apiRequest<{ data: AdminUserDocumentItem }>(`/admin/documents/${encodeURIComponent(id)}/restore`, {
        method: 'POST'
      })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      const doc = fallbackDocuments.find(d => d.id === id)
      if (doc) {
        doc.deletedAt = null
        doc.updatedAt = new Date().toISOString()
      }
      return doc || fallbackDocuments[0]
    }
  },

  permanentDelete: async (id: string): Promise<{ id: string; success: boolean }> => {
    try {
      const res = await apiRequest<{ data: { id: string; success: boolean } }>(`/admin/documents/${encodeURIComponent(id)}/permanent`, {
        method: 'DELETE'
      })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      fallbackDocuments = fallbackDocuments.filter(d => d.id !== id)
      return { id, success: true }
    }
  },

  batchAction: async (action: 'trash' | 'restore' | 'permanentDelete', documentIds: string[]): Promise<{ affectedCount: number }> => {
    try {
      const res = await apiRequest<{ data: { affectedCount: number } }>('/admin/documents/batch-action', {
        method: 'POST',
        body: JSON.stringify({ action, documentIds })
      })
      return res.data
    } catch (error) {
      if (!demoFallbackEnabled) throw error
      let count = 0
      for (const id of documentIds) {
        const doc = fallbackDocuments.find(d => d.id === id)
        if (doc) {
          if (action === 'trash') {
            doc.deletedAt = new Date().toISOString()
            count++
          } else if (action === 'restore') {
            doc.deletedAt = null
            count++
          }
        }
      }
      if (action === 'permanentDelete') {
        const prevLen = fallbackDocuments.length
        fallbackDocuments = fallbackDocuments.filter(d => !documentIds.includes(d.id))
        count = prevLen - fallbackDocuments.length
      }
      return { affectedCount: count }
    }
  }
}
