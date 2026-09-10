import { useSearchParams } from 'react-router-dom'
import { AuditLogPanel } from '../../features/admin-user-management/ui/AuditLogPanel'
import { SystemSettingsForm } from '../../features/admin-user-management/ui/SystemSettingsForm'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'

export function AdminSettingsPage() {
  const [params] = useSearchParams(); const audit = params.get('section') === 'audit'
  return <><PageIntro title={audit ? 'Audit Log' : 'Cài đặt'} description={audit ? 'Tra cứu lịch sử thay đổi trong hệ thống.' : 'Cấu hình quản trị được lưu tại backend.'} />{audit ? <AuditLogPanel /> : <SystemSettingsForm />}</>
}
