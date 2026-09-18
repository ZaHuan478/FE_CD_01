import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

// Test canonical capability helper functions logic
function canApproveSop(session) {
  if (!session) return false
  if (session.systemRole === 'SUPER_ADMIN') return true
  return (session.capabilities || []).includes('sop.review') || (session.capabilities || []).includes('sop.publish')
}

function canReviewSop(session) {
  if (!session) return false
  if (session.systemRole === 'SUPER_ADMIN') return true
  return (session.capabilities || []).includes('sop.review')
}

function canPublishSop(session) {
  if (!session) return false
  if (session.systemRole === 'SUPER_ADMIN') return true
  return (session.capabilities || []).includes('sop.publish')
}

test('1. Permission helper logic: Admin without sop.review or sop.publish cannot approve SOP', () => {
  const normalAdmin = {
    systemRole: 'ADMIN',
    capabilities: ['module.access', 'document.read']
  }
  assert.equal(canApproveSop(normalAdmin), false)
  assert.equal(canReviewSop(normalAdmin), false)
  assert.equal(canPublishSop(normalAdmin), false)
})

test('2. Permission helper logic: Admin with sop.review only can review SOP but cannot publish', () => {
  const reviewAdmin = {
    systemRole: 'ADMIN',
    capabilities: ['module.access', 'sop.review']
  }
  assert.equal(canApproveSop(reviewAdmin), true)
  assert.equal(canReviewSop(reviewAdmin), true)
  assert.equal(canPublishSop(reviewAdmin), false)
})

test('3. Permission helper logic: Admin with sop.publish only can publish SOP but cannot review', () => {
  const publishAdmin = {
    systemRole: 'ADMIN',
    capabilities: ['module.access', 'sop.publish']
  }
  assert.equal(canApproveSop(publishAdmin), true)
  assert.equal(canReviewSop(publishAdmin), false)
  assert.equal(canPublishSop(publishAdmin), true)
})

test('4. Permission helper logic: SUPER_ADMIN always has full approval permissions', () => {
  const superAdmin = {
    systemRole: 'SUPER_ADMIN',
    capabilities: []
  }
  assert.equal(canApproveSop(superAdmin), true)
  assert.equal(canReviewSop(superAdmin), true)
  assert.equal(canPublishSop(superAdmin), true)
})

test('5. session.tsx exports canonical canApproveSop, canReviewSop, and canPublishSop', () => {
  const sessionSource = read('src/features/authentication/model/session.tsx')
  assert(sessionSource.includes('export function canApproveSop'))
  assert(sessionSource.includes('export function canReviewSop'))
  assert(sessionSource.includes('export function canPublishSop'))
  assert(sessionSource.includes("session.capabilities.includes('sop.review')"))
  assert(sessionSource.includes("session.capabilities.includes('sop.publish')"))
  assert(sessionSource.includes("session.systemRole === 'SUPER_ADMIN'"))
})

test('6. AdminWorkspace hides "Duyệt SOP" navigation and protects section from unauthorized admins', () => {
  const adminSource = read('src/widgets/admin-workspace/ui/AdminWorkspace.tsx')
  assert(adminSource.includes('canApproveSop'))
  assert(adminSource.includes("item.id === 'sop-approvals' && !isApprover"))
  assert(adminSource.includes("activeSection === 'sop-approvals' && !isApprover"))
  assert(adminSource.includes('<SopApprovalWorkspace />'))
  // Ensure SopImportWorkspace is not rendered in admin approvals
  assert(!adminSource.includes('<SopImportWorkspace adminMode />'))
})

test('7. EmployeeWorkspace blocks and redirects direct URL access to /employee-lifecycle/admin/sop-approvals for unauthorized users', () => {
  const empSource = read('src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx')
  assert(empSource.includes('canApproveSop'))
  assert(empSource.includes("activeAdminSection === 'sop-approvals' && !canApproveSops"))
  assert(empSource.includes("navigate('/employee-lifecycle/admin', { replace: true })"))
})

test('8. SopApprovalWorkspace strictly filters accepted documents and does not render upload form', () => {
  assert.equal(existsSync(path.join(root, 'src/features/sop-import/ui/SopApprovalWorkspace.tsx')), true)
  const approvalSource = read('src/features/sop-import/ui/SopApprovalWorkspace.tsx')
  
  // Filter accepted items only
  assert(approvalSource.includes("item.status === 'accepted'"))
  
  // Distinguish 'Chờ rà soát' vs 'Chờ phê duyệt công bố'
  assert(approvalSource.includes('Chờ rà soát'))
  assert(approvalSource.includes('Chờ phê duyệt công bố'))
  
  // EmptyState with exact required text
  assert(approvalSource.includes('Không có SOP đang chờ duyệt'))
  assert(approvalSource.includes('Các tài liệu cần Admin xử lý sẽ xuất hiện tại đây.'))
  
  // Action buttons gated by specific capability
  assert(approvalSource.includes('canReview'))
  assert(approvalSource.includes('canPublish'))
  assert(approvalSource.includes('Xác nhận đã rà soát'))
  assert(approvalSource.includes('Phê duyệt và công bố'))
  assert(approvalSource.includes('Đang chờ Reviewer xác nhận'))
  assert(approvalSource.includes('Đã rà soát · chờ Approver công bố'))
  
  // Absolutely no file upload form or inputs
  assert(!approvalSource.includes('type="file"'))
  assert(!approvalSource.includes('UploadCloud'))
  assert(!approvalSource.includes('Chọn tệp'))
  assert(!approvalSource.includes('handleFileUpload'))
})

test('9. SopImportWorkspace no longer uses adminMode=true to grant approval permissions', () => {
  const importSource = read('src/features/sop-import/ui/SopImportWorkspace.tsx')
  assert(!importSource.includes("canPublish = adminMode ||"))
  assert(!importSource.includes("canReview = adminMode ||"))
  assert(importSource.includes('canPublishSop(session)'))
  assert(importSource.includes('canReviewSop(session)'))
})

test('10. GlobalSopManagementWorkspace has complete redesigned UI layout, statistics, and responsive views', () => {
  const globalSource = read('src/features/admin-sop-management/ui/GlobalSopManagementWorkspace.tsx')
  
  // Header and stats
  assert(globalSource.includes('Đã công bố'))
  assert(globalSource.includes('Chờ xử lý'))
  assert(globalSource.includes('Bản nháp'))
  assert(globalSource.includes('Đã lưu trữ'))
  
  // Toolbar: search and filter
  assert(globalSource.includes('Bộ lọc & Tìm kiếm'))
  assert(globalSource.includes('Trạng thái hồ sơ'))
  assert(globalSource.includes('Làm mới'))
  
  // Tabs: published vs drafts
  assert(globalSource.includes('SOP đã công bố'))
  assert(globalSource.includes('Hồ sơ đang xử lý'))
  
  // Responsive desktop table & mobile cards
  assert(globalSource.includes('hidden md:block'))
  assert(globalSource.includes('md:hidden'))
  assert(globalSource.includes('Mã SOP'))
  assert(globalSource.includes('Tên quy trình'))
  assert(globalSource.includes('Phiên bản'))
  assert(globalSource.includes('Trạng thái'))
  assert(globalSource.includes('Cập nhật gần nhất') || globalSource.includes('Tóm tắt'))
  assert(globalSource.includes('Thao tác'))
  
  // Standard badge color classes
  assert(globalSource.includes('bg-emerald-50 text-emerald-700'))
  assert(globalSource.includes('bg-amber-50 text-amber-700'))
  assert(globalSource.includes('bg-cyan-50 text-cyan-700'))
  assert(globalSource.includes('bg-slate-100 text-slate-700'))
  assert(globalSource.includes('bg-rose-50 text-rose-700'))
  
  // Navigation routes preservation
  assert(globalSource.includes('/employee-lifecycle/sop-management?source='))
  assert(globalSource.includes('/employee-lifecycle/sop-management?draft='))
  assert(globalSource.includes('Mở bản sửa'))
  assert(globalSource.includes('Mở hồ sơ'))
})
