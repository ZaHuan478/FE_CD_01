import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

test('AdminActionMenu component exists in shared molecules and is structured correctly', () => {
  const filePath = 'src/shared/ui/molecules/AdminActionMenu.tsx'
  assert.equal(existsSync(path.join(root, filePath)), true)
  const content = read(filePath)
  assert(content.includes('export const AdminActionMenu'))
  assert(content.includes('createPortal'))
  assert(content.includes('MoreHorizontal'))
  assert(content.includes('updatePosition'))
  assert(content.includes('handleOutsideClick'))
  assert(content.includes('handleKeyDown'))
})

test('AdminMasterDataWorkspace integrates AdminActionMenu and full pagination controls', () => {
  const content = read('src/features/admin-master-data/ui/AdminMasterDataWorkspace.tsx')
  assert(content.includes("import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'"))
  assert(content.includes('<AdminActionMenu'))
  assert(content.includes('Xem cấu trúc & dữ liệu mẫu'))
  assert(content.includes('Tải lên tệp cập nhật mới'))
  assert(content.includes('Tải tệp dữ liệu về máy'))
  assert(content.includes('Lịch sử các phiên bản'))
  assert(content.includes('Chuyển đổi trạng thái'))

  // Pagination verification
  assert(content.includes('const [page, setPage] = useState(1)'))
  assert(content.includes('const [pageSize, setPageSize] = useState(10)'))
  assert(content.includes('const totalPages = Math.max(1, Math.ceil(total / pageSize))'))
  assert(content.includes('paginatedItems.map'))
  assert(content.includes('Master Data Pagination Footer'))
  assert(content.includes('10 danh mục/trang'))
  assert(content.includes('25 danh mục/trang'))
  assert(content.includes('50 danh mục/trang'))
})

test('AdminDocumentsWorkspace and UserManagement integrate AdminActionMenu', () => {
  const docContent = read('src/features/admin-documents/ui/AdminDocumentsWorkspace.tsx')
  assert(docContent.includes("import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'"))
  assert(docContent.includes('<AdminActionMenu'))
  assert(docContent.includes('Xem trước nội dung'))
  assert(docContent.includes('Thông tin & audit'))
  assert(docContent.includes('Xóa vĩnh viễn'))

  const userContent = read('src/features/admin-user-management/ui/UserManagement.tsx')
  assert(userContent.includes("import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'"))
  assert(userContent.includes('<AdminActionMenu'))
  assert(userContent.includes('Hồ sơ tổ chức'))
  assert(userContent.includes('Khóa tài khoản'))
  assert(userContent.includes('Kích hoạt tài khoản'))

  const myDocContent = read('src/features/my-documents/ui/MyDocumentsWorkspace.tsx')
  assert(myDocContent.includes("import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'"))
  assert(myDocContent.includes('<AdminActionMenu'))
  assert(myDocContent.includes('Xem trực tiếp trên web'))
  assert(myDocContent.includes('Tải file gốc về máy'))
  assert(myDocContent.includes('Đổi tên hiển thị'))
  assert(myDocContent.includes('Chuyển vào thùng rác'))
})

test('CatalogManagement integrates AdminActionMenu and table/grid view switcher', () => {
  const catalogContent = read('src/features/admin-catalog/ui/CatalogManagement.tsx')
  assert(catalogContent.includes("import { AdminActionMenu } from '../../../shared/ui/molecules/AdminActionMenu'"))
  assert(catalogContent.includes('<AdminActionMenu'))
  assert(catalogContent.includes("const [viewMode, setViewMode] = useState<ViewMode>('table')"))
  assert(catalogContent.includes('Xem dạng bảng'))
  assert(catalogContent.includes('Xem dạng lưới'))
  assert(catalogContent.includes('Công bố phân hệ'))
  assert(catalogContent.includes('Chuyển về bản nháp'))
  assert(catalogContent.includes('Lưu trữ phân hệ'))
})

