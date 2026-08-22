import React, { useState, useEffect } from 'react'
import {
  GitPullRequest,
  CheckCircle2,
  Database,
  ArrowRight,
  ArrowDown,
  Mail,
  Printer,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  GraduationCap,
  Laptop,
  Briefcase,
  FileText,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
  HelpCircle,
  History
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps } from '../types'

interface StepDetail {
  code: string
  title: string
  titleEn: string
  role: string
  roleEn: string
  roleBadge: string
  action: string
  actionEn: string
  inputs: string[]
  outputs: string[]
  documents: string[]
  rules: string[]
  sla: string
  simpleExplain: string
  fromStep?: string
  toStep?: string
}

const EMP03_STEPS: Record<string, StepDetail> = {
  'EMP03.01': {
    code: 'EMP03.01',
    title: 'Danh sách nhân viên chờ nhận việc (Lấy lại mã NV cũ)',
    titleEn: 'Re-hire Intake List (Legacy EMP ID)',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Tiếp nhận nhân sự cũ quay lại làm việc, tra cứu hồ sơ cũ & giữ nguyên Mã nhân viên cũ',
    actionEn: 'Intake returning employee, look up past record & retain legacy Employee ID',
    inputs: ['Thỏa thuận tiếp nhận lại', 'Mã số nhân viên cũ', 'Lịch sử đánh giá quá khứ'],
    outputs: ['Khôi phục hồ sơ theo Mã NV cũ', 'Kế thừa lịch sử thâm niên'],
    documents: ['Phiếu tiếp nhận nhân sự cũ', 'Thỏa thuận tái ký hợp đồng'],
    rules: ['Kiểm tra Blacklist & lý do nghỉ việc cũ trước khi tiếp nhận'],
    sla: 'Trước ngày nhận việc 3 ngày',
    simpleExplain: 'Tuyển dụng tìm lại hồ sơ cũ của nhân viên, giữ nguyên Mã nhân viên cũ và khôi phục thông tin trên hệ thống.',
    toStep: 'Rẽ 3 luồng: Báo IT mở lại tài khoản cũ (EMP03.02), Báo Đào tạo (EMP03.08), Báo Sếp giao việc (EMP03.06)'
  },
  'EMP03.02': {
    code: 'EMP03.02',
    title: 'Thông báo task đến các bộ phận (Mở lại tài khoản)',
    titleEn: 'Dispatch Reactivation Tasks to IT & Facilities',
    role: 'BP (Bộ phận IT / Hành chính)',
    roleEn: 'IT / Admin Facilities',
    roleBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    action: 'Tự động mở lại tài khoản Domain/Email cũ, phân quyền hệ thống & chuẩn bị máy tính làm việc',
    actionEn: 'Reactivate legacy domain/email account, assign system roles & prepare laptop',
    inputs: ['Mã NV cũ & Email cũ', 'Quyết định bổ nhiệm/vị trí mới'],
    outputs: ['Tài khoản IT được kích hoạt lại', 'Bàn giao Laptop & thẻ từ'],
    documents: ['Ticket khôi phục tài khoản IT'],
    rules: ['Kế thừa hoặc cập nhật lại phân quyền theo vị trí công việc mới'],
    sla: 'Hoàn thành trước 17:00 ngày D-1',
    simpleExplain: 'Hệ thống báo cho IT mở lại email/tài khoản cũ cho nhân viên và chuẩn bị lại máy tính, thẻ ra vào.',
    fromStep: 'Nhận từ Tuyển dụng (EMP03.01)',
    toStep: 'Chuyển sang Cập nhật kết quả (EMP03.03)'
  },
  'EMP03.03': {
    code: 'EMP03.03',
    title: 'Cập nhật kết quả Task chuẩn bị & Gửi mail',
    titleEn: 'Confirm Reactivation & Dispatch Notification',
    role: 'BP (Bộ phận IT / Hành chính)',
    roleEn: 'IT / Admin Facilities',
    roleBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    action: 'Xác nhận đã khôi phục xong tài khoản, cấp phát thiết bị và gửi mail thông báo cho Tuyển dụng',
    actionEn: 'Confirm accounts reactivated, assets issued & email TA team',
    inputs: ['Biên bản bàn giao thiết bị', 'Trạng thái tài khoản Active'],
    outputs: ['Trạng thái Task = Hoàn thành', 'Gửi mail thông báo sẵn sàng'],
    documents: ['Gửi mail thông báo hoàn tất task'],
    rules: ['Kiểm tra mật khẩu tạm thời hoạt động trước 08:30 ngày đầu'],
    sla: 'Trước 08:30 Ngày 1',
    simpleExplain: 'IT xác nhận đã mở lại nick cũ, cài xong máy tính và gửi mail báo cho Tuyển dụng kiểm tra.',
    fromStep: 'Nhận từ Phân công task (EMP03.02)',
    toStep: 'Báo cáo ngược lên Tuyển dụng kiểm tra (EMP03.04)'
  },
  'EMP03.04': {
    code: 'EMP03.04',
    title: 'Truy vấn kết quả thực hiện task chuẩn bị',
    titleEn: 'Verify Reactivation & Readiness',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Kiểm tra 100% tài khoản cũ đã mở lại và trang thiết bị đã sẵn sàng đón nhân sự',
    actionEn: 'Verify all accounts reactivated and assets ready for onboarding',
    inputs: ['Báo cáo trạng thái từ IT & Hành chính'],
    outputs: ['Xác nhận Onboarding Ready cho nhân sự cũ'],
    documents: ['Checklist tái tiếp nhận nhân sự'],
    rules: ['Đảm bảo không phát sinh trùng lặp tài khoản hoặc mã số'],
    sla: '08:30 Ngày 1',
    simpleExplain: 'Tuyển dụng kiểm tra lại lần cuối: Đã mở lại tài khoản cũ chưa, đã có máy tính sẵn sàng chưa.',
    fromStep: 'Nhận kết quả từ IT/Hành chính (EMP03.03)',
    toStep: 'Chuyển sang Tái kích hoạt hồ sơ (EMP03.05)'
  },
  'EMP03.05': {
    code: 'EMP03.05',
    title: 'Cập nhật hồ sơ nhân viên (Tái kích hoạt)',
    titleEn: 'Reactivate Employee Master Record',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Chuyển trạng thái hồ sơ từ [Đã nghỉ việc] sang [Đang thử việc] trên hệ thống Core EMP',
    actionEn: 'Switch status from [Resigned] to [Probation] in Core EMP system',
    inputs: ['Hồ sơ bổ sung cập nhật mới (CCCD, địa chỉ mới nếu có)'],
    outputs: ['Bản ghi hồ sơ Active trở lại', 'Nối tiếp lịch sử thâm niên'],
    documents: ['Hồ sơ tái tuyển dụng nhân sự'],
    rules: ['Giữ nguyên lịch sử công tác trước đây trong cơ sở dữ liệu'],
    sla: 'Trong ngày làm việc đầu tiên',
    simpleExplain: 'Nhân viên đến nhận việc, Tuyển dụng đổi trạng thái hồ sơ từ "Đã nghỉ việc" thành "Đang thử việc".',
    fromStep: 'Nhận từ Kiểm tra hoàn tất (EMP03.04)',
    toStep: 'Hoàn thành luồng Cơ sở vật chất ➔ Kết thúc nhánh IT'
  },
  'EMP03.06': {
    code: 'EMP03.06',
    title: 'Giao mục tiêu KPI cho NV thử việc (TBP)',
    titleEn: 'Assign KPIs for Returning Employee',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    action: 'Trưởng bộ phận thiết lập mục tiêu công việc & chỉ tiêu KPI cho giai đoạn thử việc mới',
    actionEn: 'Manager sets job deliverables & KPI goals for new probation period',
    inputs: ['Bản mô tả công việc vị trí mới', 'Kế hoạch công việc phòng ban'],
    outputs: ['Bản giao mục tiêu KPI thử việc'],
    documents: ['Gửi mail thông báo giao KPI', 'Biểu mẫu KPI thử việc'],
    rules: ['Bắt buộc giao KPI trong vòng 03 ngày làm việc đầu tiên'],
    sla: 'Hạn chót Ngày 3',
    simpleExplain: 'Sếp trực tiếp giao các đầu việc và mục tiêu KPI mới cần đạt trong 2 tháng thử việc.',
    fromStep: 'Nhận từ Tiếp nhận nhân sự (EMP03.01)',
    toStep: 'Gửi bảng KPI xuống cho Nhân viên xác nhận (EMP03.07)'
  },
  'EMP03.07': {
    code: 'EMP03.07',
    title: 'Truy vấn & Xác nhận mục tiêu KPI',
    titleEn: 'Access & Acknowledge KPI Goals',
    role: 'NV (Nhân viên cũ)',
    roleEn: 'Returning Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên truy cập HRMS App bằng tài khoản cũ để xem và xác nhận mục tiêu thử việc',
    actionEn: 'Employee accesses HRMS App via legacy credentials to confirm KPIs',
    inputs: ['Thông báo KPI từ Quản lý trực tiếp'],
    outputs: ['Xác nhận cam kết thực hiện KPI'],
    documents: ['Xác nhận điện tử trên Portal'],
    rules: ['Nhân viên có quyền phản hồi làm rõ tiêu chí KPI trong 48h'],
    sla: 'Hạn chót Ngày 5',
    simpleExplain: 'Nhân viên đăng nhập App bằng tài khoản cũ, xem các việc sếp giao và bấm nút cam kết thực hiện.',
    fromStep: 'Nhận từ Sếp giao KPI (EMP03.06)',
    toStep: 'Làm việc ➔ Tự đánh giá khi gần hết hạn thử việc (EMP03.10)'
  },
  'EMP03.08': {
    code: 'EMP03.08',
    title: 'Danh sách NV tham gia đào tạo hội nhập',
    titleEn: 'Orientation & Refresh Training List',
    role: 'HRM - Đào tạo',
    roleEn: 'L&D / Training Dept',
    roleBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    action: 'Xếp lịch đào tạo cập nhật các chính sách, quy chế và định hướng mới của doanh nghiệp',
    actionEn: 'Schedule refresh training on new corporate policies & strategy updates',
    inputs: ['Danh sách nhân sự tái tiếp nhận trong tháng'],
    outputs: ['Lịch đào tạo tái hòa nhập (Refresh Orientation)'],
    documents: ['Thư mời tham gia đào tạo cập nhật'],
    rules: ['Cập nhật những thay đổi về quy chế từ thời điểm nhân viên nghỉ việc'],
    sla: 'Trong 02 tuần đầu nhận việc',
    simpleExplain: 'Bộ phận Đào tạo mời nhân viên tham gia lớp học cập nhật các chính sách và quy định mới của công ty.',
    fromStep: 'Nhận từ Tiếp nhận nhân sự (EMP03.01)',
    toStep: 'Tổ chức lớp học Đào tạo cập nhật'
  },
  'EMP03.09': {
    code: 'EMP03.09',
    title: 'Cập nhật kết quả đào tạo hội nhập',
    titleEn: 'Update Training Evaluation Results',
    role: 'HRM - Đào tạo',
    roleEn: 'L&D / Training Dept',
    roleBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    action: 'Ghi nhận điểm số bài kiểm tra cập nhật quy chế vào hồ sơ đào tạo tích lũy của nhân viên',
    actionEn: 'Log policy test score into cumulative training history',
    inputs: ['Bài test trắc nghiệm quy chế mới'],
    outputs: ['Chứng nhận hoàn thành khóa cập nhật', 'Ghi nhận hồ sơ'],
    documents: ['Gửi mail thông báo kết quả đào tạo'],
    rules: ['Điểm bài test đạt >= 80% mới được tính hoàn thành'],
    sla: 'Trong vòng 48h sau khóa học',
    simpleExplain: 'Đào tạo chấm điểm bài test cập nhật quy định và gửi mail thông báo kết quả.',
    fromStep: 'Sau khi hoàn tất khóa Đào tạo',
    toStep: 'Hoàn thành luồng Đào tạo ➔ Kết thúc nhánh L&D'
  },
  'EMP03.10': {
    code: 'EMP03.10',
    title: 'Cập nhật kết quả tự đánh giá KPI thử việc',
    titleEn: 'Self-evaluate KPI Performance',
    role: 'NV (Nhân viên cũ)',
    roleEn: 'Returning Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên tự chấm điểm và đính kèm báo cáo sản phẩm công việc trước khi hết hạn 10 ngày',
    actionEn: 'Self-evaluate work deliverables 10 days before probation expiry',
    inputs: ['Báo cáo kết quả công việc 60 ngày', 'Bộ mục tiêu KPI ban đầu'],
    outputs: ['Phiếu tự đánh giá thử việc gửi TBP'],
    documents: ['Gửi mail thông báo nộp đánh giá'],
    rules: ['Đính kèm sản phẩm công việc thực tế đã hoàn thành'],
    sla: 'Trước ngày hết hạn 10 ngày',
    simpleExplain: 'Trước khi hết 2 tháng thử việc 10 ngày, nhân viên tự chấm điểm những việc mình đã làm rồi nộp cho Sếp.',
    fromStep: 'Sau thời gian thử việc',
    toStep: 'Nộp phiếu lên cho Sếp đánh giá chính thức (EMP03.11)'
  },
  'EMP03.11': {
    code: 'EMP03.11',
    title: 'Đánh giá kết quả KPI & Quyết định nhân sự (Decision)',
    titleEn: 'Evaluate KPI & Make Retention Decision',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    action: 'Trưởng bộ phận chấm điểm, nhận xét và ra quyết định ĐẠT hoặc KHÔNG ĐẠT',
    actionEn: 'Manager grades performance and makes PASS or FAIL decision',
    inputs: ['Bản tự đánh giá của NV', 'Thực tế công việc & thái độ hợp tác'],
    outputs: ['Kết quả đánh giá thử việc chính thức', 'Đề xuất ký HĐLĐ hoặc Dừng'],
    documents: ['Gửi mail thông báo kết quả', 'Phiếu đánh giá thử việc BM-DG-04'],
    rules: ['Nếu Điểm >= 85%: Đạt ➔ Chuyển C&B ký HĐLĐ', 'Nếu Điểm < 85%: Không đạt ➔ Chuyển C&B thanh lý'],
    sla: 'Trước ngày hết hạn 07 ngày',
    simpleExplain: 'Sếp chấm điểm chính thức: Nếu Đạt (>= 85đ) ➔ Bảo C&B ký hợp đồng; Nếu Không đạt (< 85đ) ➔ Bảo C&B thanh lý nghỉ việc.',
    fromStep: 'Nhận phiếu tự chấm từ Nhân viên (EMP03.10)',
    toStep: 'Rẽ 2 nhánh: Đạt ➔ Ký HĐ (EMP03.13), Không đạt ➔ Thanh lý (EMP03.14) & Báo cho NV (EMP03.12)'
  },
  'EMP03.12': {
    code: 'EMP03.12',
    title: 'Truy vấn & Xem kết quả đánh giá KPI',
    titleEn: 'Review Final Evaluation Outcome',
    role: 'NV (Nhân viên cũ)',
    roleEn: 'Returning Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên nhận kết quả đánh giá và phản hồi xác nhận trên hệ thống',
    actionEn: 'Employee receives and acknowledges final probation evaluation',
    inputs: ['Kết quả phê duyệt từ Trưởng bộ phận'],
    outputs: ['Xác nhận nhận kết quả đánh giá'],
    documents: ['Trả kết quả đánh giá trên Portal'],
    rules: ['Nhận thông báo chính thức trước khi hết hạn thử việc tối thiểu 05 ngày (Luật LĐ)'],
    sla: 'Trước ngày hết hạn 05 ngày',
    simpleExplain: 'Nhân viên nhận thông báo kết quả thử việc trên App (được biết trước ít nhất 5 ngày theo Luật lao động).',
    fromStep: 'Nhận kết quả từ Sếp (EMP03.11)',
    toStep: 'Hoàn thành quy trình đánh giá của Nhân viên'
  },
  'EMP03.13': {
    code: 'EMP03.13',
    title: 'Ký hợp đồng lao động chính thức (Luồng Đạt)',
    titleEn: 'Execute Official Employment Contract',
    role: 'HRM - C&B',
    roleEn: 'C&B / Labor Relations',
    roleBadge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    action: 'Phát hành Hợp đồng lao động chính thức, ký số 2 bên & tiếp tục đóng BHXH',
    actionEn: 'Issue official labor contract, execute e-sign & resume Social Insurance',
    inputs: ['Kết quả Đạt từ TBP', 'Mức lương thỏa thuận chính thức'],
    outputs: ['HĐLĐ có chữ ký số 2 bên', 'Báo tăng BHXH tiếp nối sổ cũ'],
    documents: ['Hợp đồng lao động chính thức', 'Quyết định tiếp nhận chính thức'],
    rules: ['Chuyển trạng thái nhân sự thành [Chính thức - Active] & giữ nguyên Mã NV'],
    sla: 'Trước ngày hết hạn thử việc 03 ngày',
    simpleExplain: 'C&B làm Hợp đồng lao động chính thức cho 2 bên ký điện tử và làm thủ tục đóng nối tiếp Bảo hiểm xã hội.',
    fromStep: 'Nhận kết quả ĐẠT từ Sếp (EMP03.11)',
    toStep: 'Hoàn tất quy trình tiếp nhận nhân sự chính thức ➔ Kết thúc'
  },
  'EMP03.14': {
    code: 'EMP03.14',
    title: 'Thanh lý hợp đồng lao động thử việc (Luồng Không đạt)',
    titleEn: 'Settle Probation Agreement',
    role: 'HRM - C&B',
    roleEn: 'C&B / Labor Relations',
    roleBadge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    action: 'Chốt công thử việc, quyết toán lương và gửi thông báo dừng hợp tác',
    actionEn: 'Calculate worked days, finalize probation pay & send exit notice',
    inputs: ['Kết quả Không đạt từ TBP', 'Dữ liệu chấm công thực tế'],
    outputs: ['Bảng thanh toán lương thử việc', 'Biên bản thanh lý hợp đồng'],
    documents: ['Gửi mail thông báo không đạt thử việc'],
    rules: ['Thông báo bằng văn bản trước khi hết hạn theo quy định pháp lý'],
    sla: 'Trước ngày hết hạn 03 ngày',
    simpleExplain: 'C&B tính đủ tiền lương những ngày đã làm và gửi thư thông báo dừng thử việc theo đúng luật.',
    fromStep: 'Nhận kết quả KHÔNG ĐẠT từ Sếp (EMP03.11)',
    toStep: 'Chuyển sang Giảm lao động & Thu hồi máy (EMP03.15)'
  },
  'EMP03.15': {
    code: 'EMP03.15',
    title: 'Giảm lao động & Khóa quyền truy cập hệ thống',
    titleEn: 'Deregister Employee & Revoke Access',
    role: 'HRM - C&B',
    roleEn: 'C&B / Master Data Admin',
    roleBadge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    action: 'Ban hành Quyết định nghỉ việc, thu hồi tài sản IT & chuyển trạng thái Inactive',
    actionEn: 'Issue termination decision, collect IT assets & set Inactive status',
    inputs: ['Biên bản bàn giao tài sản', 'Phiếu thanh toán lương cuối cùng'],
    outputs: ['Chốt sổ hồ sơ nhân sự', 'Khóa tài khoản HRMS & Email lúc 18h'],
    documents: ['In Quyết định thôi việc / Không đạt thử việc'],
    rules: ['Khóa toàn bộ quyền truy cập hệ thống ngay ngày làm việc cuối cùng'],
    sla: 'Ngày làm việc cuối cùng',
    simpleExplain: 'In Quyết định nghỉ việc, nhận lại máy tính/thẻ từ và khóa tài khoản hệ thống lúc 18h ngày cuối.',
    fromStep: 'Nhận từ Thanh lý hợp đồng (EMP03.14)',
    toStep: 'Hoàn tất thủ tục thôi việc ➔ Kết thúc'
  }
}

export const RehireLegacyEmpFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const [selectedStep, setSelectedStep] = useState<string>('EMP03.01')
  const [activeTabMode, setActiveTabMode] = useState<'swimlane' | 'story' | 'specs'>('swimlane')
  const [simulationScenario, setSimulationScenario] = useState<'pass' | 'fail' | null>(null)
  const [simActiveStep, setSimActiveStep] = useState<string | null>(null)

  // Sync selected step when activeStageTab prop changes
  useEffect(() => {
    if (activeStageTab === 1) setSelectedStep('EMP03.01')
    else if (activeStageTab === 2) setSelectedStep('EMP03.03')
    else if (activeStageTab === 3) setSelectedStep('EMP03.06')
    else if (activeStageTab === 4) setSelectedStep('EMP03.11')
    else if (activeStageTab === 5) setSelectedStep('EMP03.13')
  }, [activeStageTab])

  // Simulation runner
  const runSimulation = (scenario: 'pass' | 'fail') => {
    setSimulationScenario(scenario)
    if (scenario === 'pass') {
      const sequence = [
        'START',
        'EMP03.01',
        'EMP03.02',
        'EMP03.03',
        'EMP03.04',
        'EMP03.05',
        'EMP03.08',
        'EMP03.09',
        'EMP03.06',
        'EMP03.07',
        'EMP03.10',
        'EMP03.11',
        'EMP03.12',
        'EMP03.13',
        'END'
      ]
      sequence.forEach((step, idx) => {
        setTimeout(() => {
          setSimActiveStep(step)
          if (step.startsWith('EMP')) setSelectedStep(step)
          if (idx === sequence.length - 1) {
            setTimeout(() => setSimulationScenario(null), 1500)
          }
        }, idx * 900)
      })
    } else {
      const sequence = [
        'START',
        'EMP03.01',
        'EMP03.06',
        'EMP03.07',
        'EMP03.10',
        'EMP03.11',
        'EMP03.12',
        'EMP03.14',
        'EMP03.15',
        'END'
      ]
      sequence.forEach((step, idx) => {
        setTimeout(() => {
          setSimActiveStep(step)
          if (step.startsWith('EMP')) setSelectedStep(step)
          if (idx === sequence.length - 1) {
            setTimeout(() => setSimulationScenario(null), 1500)
          }
        }, idx * 1000)
      })
    }
  }

  const currentStepData = EMP03_STEPS[selectedStep] || EMP03_STEPS['EMP03.01']

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TIMELINE BANNER: DÒNG THỜI GIAN TUYỂN LẠI NGƯỜI CŨ (KẾ THỪA MÃ CŨ) */}
      <div className={`p-4 rounded-2xl border transition-colors shadow-2xs ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50 border-teal-200/80'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-600 text-white">
              <History className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'vi' ? '(EMP03) TIẾN TRÌNH TUYỂN LẠI NHÂN VIÊN CŨ · GIỮ NGUYÊN MÃ SỐ NHÂN VIÊN CŨ' : '(EMP03) RE-HIRE FORMER EMPLOYEE WITH LEGACY EMP ID'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'vi' ? 'Khôi phục hồ sơ cũ, kế thừa lịch sử thâm niên, mở lại nick IT cũ và thực hiện đánh giá thử việc 60 ngày' : 'Reactivate past profile, inherit seniority, restore IT accounts & 60-day probation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              🏷️ Kế thừa Mã NV & Sổ BHXH cũ
            </span>
          </div>
        </div>

        {/* 5 Milestone Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-teal-600 dark:text-teal-400">MỐC 1 · NGÀY 1</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Khôi phục hồ sơ cũ</p>
            <span className="text-[10px] text-slate-400">Mở lại Email & Nick cũ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-emerald-600 dark:text-emerald-400">MỐC 2 · NGÀY 3</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Sếp giao KPI 60 ngày</p>
            <span className="text-[10px] text-slate-400">Xác nhận mục tiêu mới</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-amber-600 dark:text-amber-400">MỐC 3 · TUẦN 2</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Cập nhật quy định mới</p>
            <span className="text-[10px] text-slate-400">Refresh văn hóa & Test</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-purple-600 dark:text-purple-400">MỐC 4 · NGÀY 50-53</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Tự chấm & Sếp đánh giá</p>
            <span className="text-[10px] text-slate-400">Đạt &ge; 85đ ➔ Ký HĐLĐ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs col-span-2 sm:col-span-1">
            <span className="font-mono font-black text-[10px] text-rose-600 dark:text-rose-400">MỐC 5 · NGÀY 55-60</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Ký HĐLĐ / Dừng lại</p>
            <span className="text-[10px] text-slate-400">Nối tiếp BHXH sổ cũ</span>
          </div>
        </div>
      </div>

      {/* TOP CONTROL TOOLBAR: VIEW TOGGLE & SIMULATION CONTROLS */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabMode('swimlane')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'swimlane'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-500" />
            <span>{language === 'vi' ? 'Sơ Đồ Phân Làn 6 Bên (Chuẩn EMP03)' : '6-Swimlane Diagram with Links'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('story')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'story'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>{language === 'vi' ? '📖 Hướng Dẫn Kể Chuyện (Ai Đọc Cũng Hiểu)' : 'Plain Story Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('specs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'specs'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'vi' ? 'So sánh EMP02 vs EMP03 & phân công trách nhiệm' : 'EMP02 vs EMP03 responsibility split'}</span>
          </button>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mr-1 hidden sm:inline">
            {language === 'vi' ? 'Chạy Thử:' : 'Simulate:'}
          </span>
          <button
            type="button"
            onClick={() => runSimulation('pass')}
            disabled={simulationScenario !== null}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '▶ Luồng Thử Việc ĐẠT (Ký HĐLĐ)' : '▶ Pass Probation (Contract)'}</span>
          </button>
          <button
            type="button"
            onClick={() => runSimulation('fail')}
            disabled={simulationScenario !== null}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '⏹ Luồng KHÔNG ĐẠT (Thanh lý & Báo giảm)' : '⏹ Fail Probation (Exit)'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 6-SWIMLANE INTERACTIVE FLOWCHART CANVAS */}
      {activeTabMode === 'swimlane' && (
        <div className="space-y-6">
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>{language === 'vi' ? '(EMP03) LƯU ĐỒ TĂNG NHÂN VIÊN TỪ NHÂN VIÊN CŨ (LẤY LẠI MÃ NV CŨ)' : '(EMP03) RE-HIRE FORMER EMPLOYEE FLOWCHART (LEGACY EMP ID)'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'vi' ? 'Kế thừa mã số nhân viên cũ · Nhấp vào từng ô để xem giải thích nghiệp vụ và chỉ hướng luồng dữ liệu' : 'Retain legacy EMP ID · Click any node to view plain explanations and directional links'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Giữ Mã NV cũ
                </span>
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đạt ➔ Ký HĐ
                </span>
                <span className="flex items-center gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Không đạt ➔ Thanh lý
                </span>
              </div>
            </div>

            {/* 6-LANE FLOWCHART CONTAINER */}
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[1000px] border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner">

                {/* LANE 1: HRM - TUYỂN DỤNG */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-blue-100/50 dark:bg-blue-900/30 text-center">
                    <span className="text-xs font-black text-blue-900 dark:text-blue-200 tracking-wider uppercase">1. HRM - Tuyển dụng</span>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mt-1">Khôi phục Mã NV cũ</span>
                    <span className="text-[9px] text-slate-400 font-mono">Talent Acquisition</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 relative">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-full border-2 font-black text-xs transition-all shadow-xs shrink-0 ${
                        simActiveStep === 'START'
                          ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-300 animate-pulse'
                          : 'bg-emerald-600 text-white border-emerald-700'
                      }`}>
                        Bắt đầu
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* EMP03.01 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP03.01')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                            selectedStep === 'EMP03.01' || simActiveStep === 'EMP03.01'
                              ? 'bg-teal-600 text-white border-teal-500 shadow-md ring-4 ring-teal-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-teal-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                              EMP03.01 (Mã Cũ)
                            </span>
                            <History className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Danh sách NV chờ nhận việc</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.01' ? 'text-teal-100' : 'text-slate-500'}`}>
                            Tra cứu & khôi phục Mã NV cũ
                          </p>
                        </button>

                        <div className="absolute -bottom-7 left-2 flex items-center gap-1 text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-300 shadow-2xs whitespace-nowrap">
                          <ArrowDown className="w-3 h-3 text-teal-600" />
                          <span>Rẽ 3 luồng: Báo IT mở lại nick, Đào tạo, Sếp</span>
                        </div>
                      </div>
                    </div>

                    {/* Returning Stream from BP: EMP03.04 & EMP03.05 */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.04')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP03.04' || simActiveStep === 'EMP03.04'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            EMP03.04
                          </span>
                          <Laptop className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Kiểm tra kết quả mở nick IT</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.04' ? 'text-blue-100' : 'text-slate-500'}`}>
                          Đã mở lại Email cũ & cấp máy
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.05')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP03.05' || simActiveStep === 'EMP03.05'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            EMP03.05
                          </span>
                          <Database className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Tái kích hoạt hồ sơ NV</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.05' ? 'text-blue-100' : 'text-slate-500'}`}>
                          Chuyển sang "Đang thử việc"
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className={`px-3 py-1.5 rounded-full border-2 font-black text-xs transition-all shadow-xs shrink-0 ${
                        simActiveStep === 'END'
                          ? 'bg-rose-500 text-white border-rose-400 ring-4 ring-rose-300 animate-pulse'
                          : 'bg-slate-700 text-white border-slate-800'
                      }`}>
                        Kết thúc
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 2: BP (BỘ PHẬN IT / CƠ SỞ VẬT CHẤT) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-purple-50/20 dark:bg-purple-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-purple-100/50 dark:bg-purple-900/30 text-center">
                    <span className="text-xs font-black text-purple-900 dark:text-purple-200 tracking-wider uppercase">2. BP (IT & Admin)</span>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mt-1">Mở lại Nick & Cấp máy</span>
                    <span className="text-[9px] text-slate-400 font-mono">Facilities & IT</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-start gap-4 pl-32 relative">
                    <button
                      type="button"
                      onClick={() => setSelectedStep('EMP03.02')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                        selectedStep === 'EMP03.02' || simActiveStep === 'EMP03.02'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-4 ring-purple-300 scale-105'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          EMP03.02
                        </span>
                        <Laptop className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <h4 className="text-xs font-black leading-tight">Thông báo task đến các bộ phận</h4>
                      <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.02' ? 'text-purple-100' : 'text-slate-500'}`}>
                        Nhận yêu cầu mở lại nick cũ & máy
                      </p>
                    </button>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.03')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP03.03' || simActiveStep === 'EMP03.03'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-4 ring-purple-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            EMP03.03
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật kết quả Task</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.03' ? 'text-purple-100' : 'text-slate-500'}`}>
                          Đã mở lại Email cũ & cấp máy
                        </p>
                      </button>

                      <div className="absolute -bottom-8 left-4 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 border border-amber-300 text-[10px] font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1 shadow-2xs">
                          <Mail className="w-3 h-3 text-amber-600" />
                          <span>Gửi mail báo Tuyển dụng ⬆ (EMP03.04)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 3: HRM - ĐÀO TẠO */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-amber-100/50 dark:bg-amber-900/30 text-center">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-200 tracking-wider uppercase">3. HRM - Đào tạo</span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 mt-1">Cập nhật Quy định mới</span>
                    <span className="text-[9px] text-slate-400 font-mono">L&D Training</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-start gap-4 pl-32 relative">
                    <button
                      type="button"
                      onClick={() => setSelectedStep('EMP03.08')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                        selectedStep === 'EMP03.08' || simActiveStep === 'EMP03.08'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-4 ring-amber-300 scale-105'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          EMP03.08
                        </span>
                        <GraduationCap className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <h4 className="text-xs font-black leading-tight">Danh sách NV tham gia đào tạo</h4>
                      <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.08' ? 'text-amber-100' : 'text-slate-500'}`}>
                        Mời học lớp cập nhật quy định mới
                      </p>
                    </button>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    <div className="px-4 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-xs text-center">
                      <p>🎓 Đào tạo cập nhật</p>
                      <span className="text-[10px] font-normal opacity-80">(Chính sách mới & định hướng)</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.09')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP03.09' || simActiveStep === 'EMP03.09'
                            ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-4 ring-amber-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            EMP03.09
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật kết quả đào tạo</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.09' ? 'text-amber-100' : 'text-slate-500'}`}>
                          Chấm điểm test quy chế (&ge; 80%)
                        </p>
                      </button>

                      <div className="absolute -bottom-8 left-4 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 border border-amber-300 text-[10px] font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1 shadow-2xs">
                          <Mail className="w-3 h-3 text-amber-600" />
                          <span>Gửi mail thông báo kết quả ➔ Kết thúc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 4: TBP (TRƯỞNG BỘ PHẬN) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-emerald-50/20 dark:bg-emerald-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-emerald-100/50 dark:bg-emerald-900/30 text-center">
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 tracking-wider uppercase">4. TBP (Trưởng phòng)</span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">Giao việc & Chấm điểm</span>
                    <span className="text-[9px] text-slate-400 font-mono">Department Head</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 relative">
                    <div className="relative pl-32">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.06')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP03.06' || simActiveStep === 'EMP03.06'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-4 ring-emerald-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            EMP03.06
                          </span>
                          <Briefcase className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Giao mục tiêu KPI thử việc</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.06' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Giao chỉ tiêu 60 ngày trên App
                        </p>
                      </button>

                      <div className="absolute -bottom-8 left-36 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 border border-cyan-300 text-[10px] font-bold text-cyan-800 dark:text-cyan-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                          <Mail className="w-3 h-3 text-cyan-600" />
                          <span>Gửi KPI xuống NV ⬇ (EMP03.07)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pr-12">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP03.11')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-56 shadow-xs ${
                            selectedStep === 'EMP03.11' || simActiveStep === 'EMP03.11'
                              ? 'bg-amber-500 text-white border-amber-400 shadow-md ring-4 ring-amber-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              EMP03.11 (Điểm Quyết Định)
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Đánh giá kết quả thực hiện KPI</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.11' ? 'text-amber-100' : 'text-slate-500'}`}>
                            Sếp chấm điểm: Đạt hay Không?
                          </p>
                        </button>

                        <div className="absolute -right-32 top-2 flex items-center gap-1">
                          <div className="px-2 py-1 rounded bg-teal-50 dark:bg-teal-950 border border-teal-300 text-[10px] font-bold text-teal-800 dark:text-teal-200 shadow-2xs">
                            Gửi kết quả ➔ NV ⬇
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 5: NV (NHÂN VIÊN CŨ ĐƯỢC TUYỂN LẠI) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-cyan-50/20 dark:bg-cyan-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-cyan-100/50 dark:bg-cyan-900/30 text-center">
                    <span className="text-xs font-black text-cyan-900 dark:text-cyan-200 tracking-wider uppercase">5. NV (Nhân viên cũ)</span>
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 mt-1">Làm việc & Tự chấm</span>
                    <span className="text-[9px] text-slate-400 font-mono">Returning Employee</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 relative">
                    <div className="flex items-center gap-4 pl-32">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.07')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP03.07' || simActiveStep === 'EMP03.07'
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                            EMP03.07
                          </span>
                          <FileText className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Xem & Xác nhận KPI</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.07' ? 'text-cyan-100' : 'text-slate-500'}`}>
                          Đăng nhập nick cũ & cam kết
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP03.10')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                            selectedStep === 'EMP03.10' || simActiveStep === 'EMP03.10'
                              ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                              EMP03.10
                            </span>
                            <GitPullRequest className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Tự chấm điểm thử việc</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.10' ? 'text-cyan-100' : 'text-slate-500'}`}>
                            Nộp báo cáo 60 ngày cho Sếp
                          </p>
                        </button>

                        <div className="absolute -top-8 left-4 flex items-center gap-1">
                          <div className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                            <Mail className="w-3 h-3 text-emerald-600" />
                            <span>Gửi phiếu tự chấm lên Sếp ⬆ (EMP03.11)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pr-12">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.12')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP03.12' || simActiveStep === 'EMP03.12'
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                            EMP03.12
                          </span>
                          <UserCheck className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Xem kết quả đánh giá</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.12' ? 'text-cyan-100' : 'text-slate-500'}`}>
                          Biết kết quả trước 5 ngày
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* LANE 6: HRM - C&B */}
                <div className="grid grid-cols-12 bg-rose-50/20 dark:bg-rose-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-rose-100/50 dark:bg-rose-900/30 text-center">
                    <span className="text-xs font-black text-rose-900 dark:text-rose-200 tracking-wider uppercase">6. HRM - C&B</span>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 mt-1">Hợp đồng & Nối BHXH</span>
                    <span className="text-[9px] text-slate-400 font-mono">C&B Specialist</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 pl-32 relative">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 shadow-2xs">
                        ✅ NẾU ĐẠT (&ge; 85đ)
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.13')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP03.13' || simActiveStep === 'EMP03.13'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-4 ring-emerald-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            EMP03.13 (Pass)
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Ký hợp đồng lao động chính thức</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.13' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Nối tiếp sổ BHXH cũ & Active
                        </p>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 pr-12">
                      <div className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 border border-rose-400 text-[10px] font-extrabold text-rose-800 dark:text-rose-200 shadow-2xs">
                        ❌ NẾU KHÔNG ĐẠT (&lt; 85đ)
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP03.14')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP03.14' || simActiveStep === 'EMP03.14'
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-4 ring-rose-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            EMP03.14
                          </span>
                          <UserX className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Thanh lý HĐLĐ thử việc</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.14' ? 'text-rose-100' : 'text-slate-500'}`}>
                          Tính lương ngày công đã làm
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP03.15')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                            selectedStep === 'EMP03.15' || simActiveStep === 'EMP03.15'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-4 ring-rose-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                              EMP03.15
                            </span>
                            <Printer className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Giảm lao động</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP03.15' ? 'text-rose-100' : 'text-slate-500'}`}>
                            Thu hồi máy & Khóa nick 18h
                          </p>
                        </button>

                        <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                          <div className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 border border-rose-300 text-[10px] font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                            <Printer className="w-3 h-3 text-rose-600" />
                            <span>In Quyết định nghỉ việc ➔ Kết thúc</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* STEP INSPECTOR DRAWER */}
          {currentStepData && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 border-2 border-teal-500/40 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-teal-600 text-white font-mono font-black text-xs shadow-2xs">
                    {currentStepData.code}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {language === 'vi' ? currentStepData.title : currentStepData.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? currentStepData.action : currentStepData.actionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>SLA: {currentStepData.sla}</span>
                  </span>
                  <div className={`px-3 py-1 rounded-xl border text-xs font-bold ${currentStepData.roleBadge}`}>
                    👤 {language === 'vi' ? currentStepData.role : currentStepData.roleEn}
                  </div>
                </div>
              </div>

              {/* Plain-Language Box */}
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-extrabold text-teal-900 dark:text-teal-200">
                    💡 {language === 'vi' ? 'Hiểu đơn giản về bước này:' : 'Plain Explanation:'}
                  </span>{' '}
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {currentStepData.simpleExplain}
                  </span>
                </div>
              </div>

              {/* Data Flow Direction */}
              {(currentStepData.fromStep || currentStepData.toStep) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentStepData.fromStep && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-teal-600 dark:text-teal-400 shrink-0">⬅ Nhận từ:</span>
                      <span className="truncate">{currentStepData.fromStep}</span>
                    </div>
                  )}
                  {currentStepData.toStep && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">➡ Chuyển tới:</span>
                      <span className="truncate">{currentStepData.toStep}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{language === 'vi' ? 'Dữ liệu Đầu vào (Inputs)' : 'Inputs'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.inputs.map((inp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-500">•</span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{language === 'vi' ? 'Kết quả & Biểu mẫu (Outputs)' : 'Outputs & Docs'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.outputs.map((out, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">✓</span>
                        <span>{out}</span>
                      </li>
                    ))}
                    {currentStepData.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                        <span>📄</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>{language === 'vi' ? 'Quy tắc Nghiệp vụ (Rules)' : 'Business Rules'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-500">⚡</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PLAIN STORY MODE */}
      {activeTabMode === 'story' && (
        <div className={`p-5 sm:p-7 rounded-3xl border space-y-6 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>{language === 'vi' ? 'QUY TRÌNH TUYỂN LẠI NGƯỜI CŨ DƯỚI DẠNG KỂ CHUYỆN (4 BƯỚC)' : 'PLAIN STORY: RE-HIRING FORMER EMPLOYEES'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi' ? 'Giải thích dễ hiểu về cách hệ thống giữ nguyên mã nhân viên và khôi phục hồ sơ cho người cũ' : 'Plain language explanation of legacy employee re-hiring'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl border border-teal-200 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  1
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Khôi Phục Mã Cũ & Mở Lại Email
                  </h4>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Ai làm: Tuyển dụng + IT</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Người cũ quay lại làm việc, <strong>Tuyển dụng</strong> tra cứu hồ sơ cũ và giữ nguyên Mã NV cũ. Hệ thống báo <strong>IT</strong> mở lại tài khoản Email cũ và chuẩn bị máy tính, bàn ghế trước giờ nhận việc.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  2
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Nhận KPI Mới & Cập Nhật Quy Định
                  </h4>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Ai làm: Trưởng phòng + Đào tạo</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Trong 3 ngày đầu, <strong>Trưởng phòng</strong> giao các mục tiêu KPI mới. Nhân viên đăng nhập App bằng nick cũ xác nhận. <strong>Đào tạo</strong> mời học lớp cập nhật các quy chế mới thay đổi trong thời gian nhân viên vắng bóng.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  3
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Tự Chấm Điểm & Sếp Đánh Giá Thử Việc
                  </h4>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Ai làm: Nhân viên + Trưởng phòng</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Trước khi hết 2 tháng thử việc 10 ngày, nhân viên tự chấm điểm kết quả công việc. <strong>Trưởng phòng</strong> chấm điểm chính thức: Nếu Đạt (&ge; 85đ) ➔ chuyển C&B ký hợp đồng; Nếu Không đạt ➔ dừng hợp tác.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  4
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Ký Hợp Đồng Chính Thức & Nối Sổ BHXH
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ai làm: C&B</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Bộ phận <strong>C&B</strong> làm Hợp đồng lao động chính thức và làm thủ tục đóng nối tiếp vào sổ BHXH cũ, chuyển trạng thái nhân sự thành Chính thức nhưng vẫn bảo lưu toàn bộ quá trình công tác trong quá khứ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SPECS & COMPARISON EMP02 vs EMP03 */}
      {activeTabMode === 'specs' && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>SO SÁNH BẢN CHẤT NGHIỆP VỤ: QUY TRÌNH EMP02 (MÃ MỚI) VS EMP03 (MÃ CŨ)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Hạng mục nghiệp vụ</th>
                  <th className="p-3 text-blue-600 dark:text-blue-400">SOP EMP02 (Tiếp nhận Mã Mới)</th>
                  <th className="p-3 text-teal-600 dark:text-teal-400">SOP EMP03 (Tuyển lại Mã Cũ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-3 font-bold">Mã số nhân viên</td>
                  <td className="p-3">Sinh mã mới tự động (Ví dụ: `NV-01205`)</td>
                  <td className="p-3 font-semibold text-teal-600">Khôi phục Mã NV cũ (Ví dụ: `NV-00432`)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Lịch sử thâm niên</td>
                  <td className="p-3">Tính lại từ đầu (0 ngày)</td>
                  <td className="p-3 font-semibold text-teal-600">Kế thừa quá trình công tác & thâm niên cũ</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Tài khoản IT / Email</td>
                  <td className="p-3">Khởi tạo Email mới từ đầu</td>
                  <td className="p-3 font-semibold text-teal-600">Mở lại hòm thư Domain/Active Directory cũ</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Bảo hiểm Xã hội</td>
                  <td className="p-3">Khai báo báo tăng mới</td>
                  <td className="p-3 font-semibold text-teal-600">Báo tăng nối tiếp vào dữ liệu sổ BHXH cũ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
