import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, Database, LockKeyhole, Settings, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { PageIntro, Panel } from '../../shared/ui/molecules/AdminSurface'

export function AdminSettingsPage() {
  const [params] = useSearchParams()
  const section = params.get('section') ?? 'general'
  return <><PageIntro title="Cài đặt" description="Điểm truy cập tập trung cho cấu hình quản trị. Các thay đổi chỉ được bật khi backend có API lưu tương ứng." />
    {section === 'audit' ? <Panel title="Nhật ký hệ thống" description="Trạng thái tích hợp AuditLog"><div className="flex min-h-52 items-start gap-3 p-5"><ShieldCheck className="mt-0.5 size-5 text-slate-400" /><div><p className="text-sm font-black">Backend đang ghi, giao diện chưa thể đọc</p><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Cơ sở dữ liệu có bảng AuditLog phục vụ truy vết, nhưng chưa có API danh sách, tìm kiếm và phân trang. Vì vậy trang này không hiển thị sự kiện giả.</p></div></div></Panel> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <SettingCard icon={<Settings className="size-5" />} title="Thiết lập chung" detail="Chưa có API lưu cấu hình. Các tuỳ chọn sẽ ở trạng thái chỉ đọc." disabled />
      <SettingLink to="/employee-lifecycle/admin/access" icon={<LockKeyhole className="size-5" />} title="Quyền truy cập" detail="Cấu hình quyền phân hệ theo từng tài khoản." />
      <SettingLink to="/employee-lifecycle/admin/catalog" icon={<BookOpen className="size-5" />} title="Danh mục nghiệp vụ" detail="Quản lý phân hệ và tài liệu đã công bố." />
      <SettingLink to="/employee-lifecycle/admin/master-data" icon={<Database className="size-5" />} title="Master Data" detail="Tra cứu catalog và quan hệ dữ liệu dùng chung." />
      <SettingLink to="/employee-lifecycle/admin/settings?section=audit" icon={<ShieldCheck className="size-5" />} title="Nhật ký hệ thống" detail="Kiểm tra trạng thái tích hợp AuditLog." />
    </div>}
  </>
}

function SettingCard({ icon, title, detail, disabled }: { icon: ReactNode; title: string; detail: string; disabled?: boolean }) { return <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><span className="grid size-9 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950/40 dark:text-cyan-300">{icon}</span><h3 className="mt-4 text-sm font-black">{title}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">{detail}</p>{disabled && <span className="mt-4 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800">Chỉ đọc</span>}</article> }
function SettingLink({ to, ...props }: { to: string; icon: ReactNode; title: string; detail: string }) { return <Link to={to} className="rounded-xl outline-none ring-[#155e75] focus-visible:ring-2"><SettingCard {...props} /></Link> }
