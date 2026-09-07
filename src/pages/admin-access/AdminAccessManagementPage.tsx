import { AccessManagement } from '../../features/admin-user-management/ui/AccessManagement'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'
export function AdminAccessManagementPage() { return <><PageIntro title="Phân quyền" description="Cấp các phân hệ mà từng người dùng được phép xem. Backend luôn là nguồn quyết định quyền cuối cùng." /><AccessManagement /></> }
