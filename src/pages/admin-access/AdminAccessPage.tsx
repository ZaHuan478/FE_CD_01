import { AdminOverview } from '../../widgets/admin-overview/ui/AdminOverview'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'

export function AdminAccessPage() {
  return <><PageIntro title="Tổng quan quản trị" description="Theo dõi tình trạng tài khoản, phân quyền, phân hệ và tài liệu từ các API nghiệp vụ hiện có." /><AdminOverview /></>
}
