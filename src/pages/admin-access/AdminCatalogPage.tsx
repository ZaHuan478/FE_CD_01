import { CatalogManagement } from '../../features/admin-catalog/ui/CatalogManagement'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'
export function AdminCatalogPage() { return <><PageIntro title="Danh mục hệ thống" description="Quản lý danh mục phân hệ và tài liệu nghiệp vụ bằng các endpoint riêng, không phụ thuộc vào bootstrap." /><CatalogManagement /></> }
