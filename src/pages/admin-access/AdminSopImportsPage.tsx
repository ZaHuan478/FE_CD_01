import { SopImportWorkspace } from '../../features/sop-import/ui/SopImportWorkspace'
import { PageIntro } from '../../shared/ui/molecules/AdminSurface'

export function AdminSopImportsPage() {
  return <>
    <PageIntro
      title="Upload và số hóa tài liệu"
      description="Chuyển DOCX hoặc PDF thành SOP có cấu trúc. Kết quả luôn được rà soát trước khi tạo bản nháp và gửi duyệt."
    />
    <SopImportWorkspace adminMode />
  </>
}
