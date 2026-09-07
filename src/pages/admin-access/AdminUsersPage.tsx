import { UserManagement } from '../../features/admin-user-management/ui/UserManagement'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'
export function AdminUsersPage() { return <><PageIntro title="Người dùng" description="Quản lý vòng đời tài khoản và vai trò hệ thống. Tài khoản đang đăng nhập không thể tự khóa hoặc tự hạ quyền." /><UserManagement /></> }
