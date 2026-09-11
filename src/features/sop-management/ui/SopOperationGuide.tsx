import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, Panel, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

const stages = [
  ['1. Tạo hoặc mở bản sửa', 'Người được cấp sop.create/sop.edit nhập thông tin và chỉnh lưu đồ. Bản đang công bố vẫn tiếp tục phục vụ người đọc.'],
  ['2. Lưu bản nháp', 'Kiểm tra mã, phân hệ, các bước, người thực hiện và đường nối trước khi gửi.'],
  ['3. Gửi rà soát', 'Reviewer phải là tài khoản khác người soạn và kiểm tra nội dung nghiệp vụ.'],
  ['4. Phê duyệt & công bố', 'Approver phải khác Reviewer. Phiên bản mới xuất hiện trong Thư viện quy trình sau khi công bố.'],
  ['5. Cập nhật hoặc thu hồi', 'Tạo bản sửa mới khi quy trình thay đổi; dùng Thu hồi khi tài liệu không còn hiệu lực.']
] as const

export function SopOperationGuide() {
  return <div className="space-y-4">
    <PageIntro title="Hướng dẫn quản lý SOP" description="Luồng chuẩn từ bản nháp đến phiên bản được công bố." actions={<Link className={secondaryButtonClass} to="/employee-lifecycle/sop-management"><ArrowLeft size={16} />Quay lại quản lý SOP</Link>} />
    <Panel title="Quy trình vận hành">
      <ol className="grid gap-3 p-4 lg:grid-cols-2">
        {stages.map(([title, description]) => <li key={title} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-2 font-bold"><CheckCircle2 className="size-4 text-emerald-600" />{title}</div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p></li>)}
      </ol>
    </Panel>
  </div>
}
