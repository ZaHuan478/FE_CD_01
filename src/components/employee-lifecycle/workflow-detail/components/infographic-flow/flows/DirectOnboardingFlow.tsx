import React, { useState } from 'react'
import {
  Users,
  GitPullRequest,
  CheckCircle2,
  Database,
  ArrowRight,
  ArrowDown,
  Mail,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
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
  HelpCircle
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps } from '../types'
import { useFlowSimulation } from '../shared/useFlowSimulation'

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

const EMP02_STEPS: Record<string, StepDetail> = {
  'EMP02.01': {
    code: 'EMP02.01',
    title: 'Danh sách nhân viên chờ nhận việc',
    titleEn: 'Onboarding Waiting List',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Tiếp nhận hồ sơ nhân sự mới hoặc nhân sự cũ tái tuyển dụng cấp mã mới',
    actionEn: 'Intake new hires or re-hires under new employee ID',
    inputs: ['Hồ sơ ứng viên trúng tuyển / Thỏa thuận tiếp nhận', 'Quyết định bổ nhiệm/tuyển dụng'],
    outputs: ['Danh sách tiếp nhận trên HRMS', 'Cấp Mã nhân viên mới (EMP ID)'],
    documents: ['Phiếu tiếp nhận nhân sự', 'Offer Letter'],
    rules: ['Bắt buộc đã được đối soát với Định biên EMP01'],
    sla: 'Trước ngày nhận việc 3 ngày',
    simpleExplain: 'Tuyển dụng tạo hồ sơ ban đầu và cấp Mã nhân viên mới trên hệ thống.',
    toStep: 'Rẽ 3 luồng: Báo IT chuẩn bị máy (EMP02.02), Báo Đào tạo (EMP02.08), Báo Sếp giao việc (EMP02.06)'
  },
  'EMP02.02': {
    code: 'EMP02.02',
    title: 'Thông báo task đến các bộ phận (IT / Hành chính)',
    titleEn: 'Dispatch Preparation Tasks to Departments',
    role: 'BP (Bộ phận IT / Hành chính)',
    roleEn: 'IT / Admin Facilities',
    roleBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    action: 'Tự động phân bổ task chuẩn bị cơ sở vật chất, tài khoản & trang thiết bị',
    actionEn: 'Auto-dispatch tasks for IT assets, emails, badges & seating',
    inputs: ['Ticket tiếp nhận từ Tuyển dụng', 'Thông tin chức danh & phòng ban'],
    outputs: ['Task checklist cho IT & Admin'],
    documents: ['Ticket phân công task tự động trên HRMS'],
    rules: ['Kích hoạt tự động khi tạo mã nhân viên mới'],
    sla: 'Hoàn thành trước 17:00 ngày D-1',
    simpleExplain: 'Hệ thống tự gửi thông báo cho IT và Hành chính biết để chuẩn bị máy tính, email và bàn ghế.',
    fromStep: 'Nhận từ Tuyển dụng (EMP02.01)',
    toStep: 'Chuyển sang Cập nhật kết quả (EMP02.03)'
  },
  'EMP02.03': {
    code: 'EMP02.03',
    title: 'Cập nhật kết quả Task chuẩn bị & Gửi mail',
    titleEn: 'Update Preparation Task Results',
    role: 'BP (Bộ phận IT / Hành chính)',
    roleEn: 'IT / Admin Facilities',
    roleBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    action: 'Xác nhận đã cấp Email công ty, cấp phát Laptop, thẻ từ ra vào & bàn làm việc',
    actionEn: 'Confirm corporate email issuance, laptop, access card & seating',
    inputs: ['Biên bản bàn giao thiết bị IT', 'Thẻ nhân viên'],
    outputs: ['Trạng thái Task = Completed', 'Thông tin tài khoản Domain/Email'],
    documents: ['Gửi mail thông báo hoàn tất task'],
    rules: ['Email kích hoạt ở trạng thái tạm khóa trước 08:00 ngày nhận việc'],
    sla: 'Trước 08:30 Ngày 1',
    simpleExplain: 'IT & Hành chính xác nhận đã cài máy xong, tạo email xong và gửi mail báo cho Tuyển dụng.',
    fromStep: 'Nhận từ Task phân công (EMP02.02)',
    toStep: 'Báo cáo ngược lên Tuyển dụng kiểm tra (EMP02.04)'
  },
  'EMP02.04': {
    code: 'EMP02.04',
    title: 'Truy vấn kết quả thực hiện task chuẩn bị',
    titleEn: 'Query Preparation Task Status',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Kiểm tra 100% trang thiết bị & tài khoản đã sẵn sàng đón nhân sự mới',
    actionEn: 'Verify all assets & accounts ready for Day 1 welcoming',
    inputs: ['Báo cáo trạng thái task từ các bộ phận'],
    outputs: ['Xác nhận Onboarding Ready'],
    documents: ['Onboarding Checklist Verification'],
    rules: ['Nếu thiếu trang thiết bị phải kích hoạt cảnh báo Escalation'],
    sla: '08:30 Ngày 1',
    simpleExplain: 'Tuyển dụng kiểm tra lại lần cuối: Đã đủ máy tính, email, thẻ từ chưa trước khi đón nhân viên.',
    fromStep: 'Nhận kết quả từ IT/Hành chính (EMP02.03)',
    toStep: 'Chuyển sang Cập nhật hồ sơ nhân sự (EMP02.05)'
  },
  'EMP02.05': {
    code: 'EMP02.05',
    title: 'Cập nhật hồ sơ nhân viên & Kích hoạt trạng thái',
    titleEn: 'Update Employee Master Record',
    role: 'HRM - Tuyển dụng',
    roleEn: 'Talent Acquisition (TA)',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Kích hoạt trạng thái [Đang thử việc] và mở khóa tài khoản nhân sự',
    actionEn: 'Activate probation status and grant system permissions',
    inputs: ['Bộ hồ sơ nhận việc đầy đủ (CCCD, Bằng cấp, SYLL)'],
    outputs: ['Hồ sơ nhân sự số hóa hoàn tất trên Core EMP'],
    documents: ['Hồ sơ nhân viên chính thức'],
    rules: ['Khai báo đầy đủ trường thông tin thuế TNCN & BHYT'],
    sla: 'Trong ngày làm việc đầu tiên',
    simpleExplain: 'Nhân viên đến nhận việc, Tuyển dụng mở khóa tài khoản và chuyển trạng thái hồ sơ sang "Đang thử việc".',
    fromStep: 'Nhận từ Kiểm tra hoàn tất (EMP02.04)',
    toStep: 'Hoàn thành luồng Cơ sở vật chất ➔ Kết thúc nhánh IT'
  },
  'EMP02.06': {
    code: 'EMP02.06',
    title: 'Giao mục tiêu KPI cho NV thử việc (TBP)',
    titleEn: 'Assign Probation KPI Goals',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    action: 'Thiết lập bộ chỉ tiêu đánh giá 60 ngày thử việc (kết quả công việc & kỷ luật)',
    actionEn: 'Set 60-day probation KPIs (work deliverables & behavioral standards)',
    inputs: ['Mô tả công việc (JD) vị trí', 'Kế hoạch công việc phòng ban'],
    outputs: ['Bản giao mục tiêu KPI thử việc đã ký duyệt'],
    documents: ['Gửi mail thông báo giao KPI', 'Biểu mẫu KPI thử việc'],
    rules: ['Bắt buộc giao KPI trong vòng 03 ngày làm việc đầu tiên'],
    sla: 'Hạn chót Ngày 3',
    simpleExplain: 'Trong 3 ngày đầu, Sếp trực tiếp thiết lập các đầu việc và chỉ tiêu KPI cần làm trong 2 tháng thử việc.',
    fromStep: 'Nhận từ Tiếp nhận nhân sự (EMP02.01)',
    toStep: 'Gửi bảng KPI xuống cho Nhân viên xác nhận (EMP02.07)'
  },
  'EMP02.07': {
    code: 'EMP02.07',
    title: 'Truy vấn & Xác nhận mục tiêu KPI',
    titleEn: 'Access & Acknowledge KPI Goals',
    role: 'NV (Nhân viên mới)',
    roleEn: 'New Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên truy cập HRMS App để xem và xác nhận bộ tiêu chí thử việc',
    actionEn: 'Employee accesses HRMS App to acknowledge probation criteria',
    inputs: ['Thông báo KPI từ Quản lý trực tiếp'],
    outputs: ['Xác nhận cam kết thực hiện KPI'],
    documents: ['Xác nhận điện tử trên Portal'],
    rules: ['Nhân viên có quyền phản hồi làm rõ tiêu chí KPI trong 48h'],
    sla: 'Hạn chót Ngày 5',
    simpleExplain: 'Nhân viên mở điện thoại/máy tính xem sếp giao những việc gì và bấm nút xác nhận cam kết thực hiện.',
    fromStep: 'Nhận từ Sếp giao KPI (EMP02.06)',
    toStep: 'Thực hiện công việc ➔ Tự đánh giá khi gần hết hạn (EMP02.10)'
  },
  'EMP02.08': {
    code: 'EMP02.08',
    title: 'Danh sách NV tham gia đào tạo hội nhập',
    titleEn: 'Orientation Participant List',
    role: 'HRM - Đào tạo',
    roleEn: 'L&D / Training Dept',
    roleBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    action: 'Lập danh sách và gửi thư mời tham gia khóa đào tạo văn hóa doanh nghiệp',
    actionEn: 'Schedule & invite new hires to Company Culture Orientation',
    inputs: ['Danh sách nhân viên mới nhận việc trong tháng'],
    outputs: ['Lịch đào tạo Onboarding & phân bổ giảng viên'],
    documents: ['Thư mời tham gia đào tạo hội nhập'],
    rules: ['100% nhân viên mới bắt buộc tham gia đào tạo hội nhập'],
    sla: 'Trong 02 tuần đầu nhận việc',
    simpleExplain: 'Bộ phận Đào tạo xếp lịch và gửi thư mời nhân viên mới tham gia lớp học văn hóa và quy chế công ty.',
    fromStep: 'Nhận từ Tiếp nhận nhân sự (EMP02.01)',
    toStep: 'Tổ chức lớp học Đào tạo hội nhập'
  },
  'EMP02.09': {
    code: 'EMP02.09',
    title: 'Cập nhật kết quả đào tạo hội nhập',
    titleEn: 'Update Orientation Training Results',
    role: 'HRM - Đào tạo',
    roleEn: 'L&D / Training Dept',
    roleBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    action: 'Chấm điểm bài kiểm tra hội nhập và ghi nhận kết quả vào hồ sơ đào tạo',
    actionEn: 'Grade orientation test and log score into Employee Training Profile',
    inputs: ['Bài test trắc nghiệm văn hóa & nội quy', 'Điểm danh chuyên cần'],
    outputs: ['Chứng chỉ hoàn thành Onboarding', 'Điểm số lưu hồ sơ'],
    documents: ['Gửi mail thông báo kết quả đào tạo'],
    rules: ['Điểm bài test đạt >= 80% mới được tính hoàn thành'],
    sla: 'Trong vòng 48h sau khóa học',
    simpleExplain: 'Học xong làm bài test, Đào tạo chấm điểm (đạt >= 80% là qua) và gửi mail thông báo kết quả.',
    fromStep: 'Sau khi hoàn tất lớp học Đào tạo',
    toStep: 'Hoàn thành luồng Đào tạo ➔ Kết thúc nhánh L&D'
  },
  'EMP02.10': {
    code: 'EMP02.10',
    title: 'Cập nhật kết quả tự đánh giá KPI thử việc',
    titleEn: 'Self-evaluate KPI Performance',
    role: 'NV (Nhân viên mới)',
    roleEn: 'New Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên tự đánh giá kết quả thực hiện công việc trước khi hết hạn thử việc 10 ngày',
    actionEn: 'Self-evaluate work performance 10 days before probation expiry',
    inputs: ['Báo cáo kết quả công việc 60 ngày', 'Bộ mục tiêu KPI ban đầu'],
    outputs: ['Phiếu tự đánh giá thử việc gửi TBP'],
    documents: ['Gửi mail thông báo nộp đánh giá'],
    rules: ['Đính kèm sản phẩm công việc thực tế đã hoàn thành'],
    sla: 'Trước ngày hết hạn 10 ngày',
    simpleExplain: 'Trước khi hết 2 tháng thử việc 10 ngày, nhân viên tự chấm điểm những việc mình đã làm và nộp cho Sếp.',
    fromStep: 'Sau thời gian thử việc',
    toStep: 'Nộp phiếu lên cho Sếp đánh giá chính thức (EMP02.11)'
  },
  'EMP02.11': {
    code: 'EMP02.11',
    title: 'Đánh giá kết quả KPI & Quyết định nhân sự (Decision)',
    titleEn: 'Evaluate KPI & Make Retention Decision',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    action: 'Trưởng bộ phận chấm điểm, nhận xét và ra quyết định ĐẠT hoặc KHÔNG ĐẠT',
    actionEn: 'Manager grades performance and makes PASS or FAIL decision',
    inputs: ['Bản tự đánh giá của NV', 'Thực tế công việc & thái độ tuân thủ'],
    outputs: ['Kết quả đánh giá thử việc chính thức', 'Đề xuất ký HĐLĐ hoặc Dừng'],
    documents: ['Gửi mail thông báo kết quả', 'Phiếu đánh giá thử việc BM-DG-04'],
    rules: ['Nếu Điểm >= 85%: Đạt ➔ Chuyển C&B ký HĐLĐ', 'Nếu Điểm < 85%: Không đạt ➔ Chuyển C&B thanh lý'],
    sla: 'Trước ngày hết hạn 07 ngày',
    simpleExplain: 'Sếp chấm điểm chính thức: Nếu Đạt (>= 85đ) ➔ Bảo C&B ký hợp đồng; Nếu Không đạt (< 85đ) ➔ Bảo C&B thanh lý nghỉ việc.',
    fromStep: 'Nhận phiếu tự chấm từ Nhân viên (EMP02.10)',
    toStep: 'Rẽ 2 nhánh: Đạt ➔ Ký HĐ (EMP02.13), Không đạt ➔ Thanh lý (EMP02.14) & Báo cho NV (EMP02.12)'
  },
  'EMP02.12': {
    code: 'EMP02.12',
    title: 'Truy vấn & Xem kết quả đánh giá KPI',
    titleEn: 'Review Final Evaluation Outcome',
    role: 'NV (Nhân viên mới)',
    roleEn: 'New Employee',
    roleBadge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    action: 'Nhân viên nhận kết quả đánh giá và phản hồi xác nhận trên hệ thống',
    actionEn: 'Employee receives and acknowledges final probation evaluation',
    inputs: ['Kết quả phê duyệt từ Trưởng bộ phận'],
    outputs: ['Xác nhận nhận kết quả đánh giá'],
    documents: ['Trả kết quả đánh giá trên Portal'],
    rules: ['Nhận thông báo chính thức trước khi hết hạn thử việc tối thiểu 05 ngày (Luật LĐ)'],
    sla: 'Trước ngày hết hạn 05 ngày',
    simpleExplain: 'Nhân viên nhận thông báo kết quả thử việc trên App (được biết trước ít nhất 5 ngày theo Luật lao động).',
    fromStep: 'Nhận kết quả từ Sếp (EMP02.11)',
    toStep: 'Hoàn thành quy trình đánh giá của Nhân viên'
  },
  'EMP02.13': {
    code: 'EMP02.13',
    title: 'Ký hợp đồng lao động chính thức (Luồng Đạt)',
    titleEn: 'Execute Official Employment Contract',
    role: 'HRM - C&B',
    roleEn: 'C&B / Labor Relations',
    roleBadge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    action: 'Phát hành Hợp đồng lao động xác định/không xác định thời hạn & báo tăng BHXH',
    actionEn: 'Issue official labor contract & register Social Insurance enrollment',
    inputs: ['Kết quả Đạt từ TBP', 'Mức lương thỏa thuận chính thức'],
    outputs: ['HĐLĐ có chữ ký số 2 bên', 'Báo tăng BHXH mẫu INS01'],
    documents: ['Hợp đồng lao động chính thức', 'Quyết định tiếp nhận chính thức'],
    rules: ['Chuyển trạng thái nhân sự thành [Chính thức - Active]'],
    sla: 'Trước ngày hết hạn thử việc 03 ngày',
    simpleExplain: 'C&B làm Hợp đồng lao động chính thức cho 2 bên ký điện tử và làm thủ tục đóng Bảo hiểm xã hội.',
    fromStep: 'Nhận kết quả ĐẠT từ Sếp (EMP02.11)',
    toStep: 'Hoàn tất quy trình tiếp nhận nhân sự chính thức ➔ Kết thúc'
  },
  'EMP02.14': {
    code: 'EMP02.14',
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
    fromStep: 'Nhận kết quả KHÔNG ĐẠT từ Sếp (EMP02.11)',
    toStep: 'Chuyển sang Giảm lao động & Thu hồi máy (EMP02.15)'
  },
  'EMP02.15': {
    code: 'EMP02.15',
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
    fromStep: 'Nhận từ Thanh lý hợp đồng (EMP02.14)',
    toStep: 'Hoàn tất thủ tục thôi việc ➔ Kết thúc'
  }
}

export const DirectOnboardingFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const [activeTabMode, setActiveTabMode] = useState<'swimlane' | 'story' | 'specs'>('swimlane')
  const { selectedStep, setSelectedStep, simulationScenario, simActiveStep, runSimulation } = useFlowSimulation({
    initialStep: 'EMP02.01',
    activeStageTab,
    stageSteps: { 1: 'EMP02.01', 2: 'EMP02.03', 3: 'EMP02.06', 4: 'EMP02.11', 5: 'EMP02.13' },
    sequences: {
      pass: ['START', 'EMP02.01', 'EMP02.02', 'EMP02.03', 'EMP02.04', 'EMP02.05', 'EMP02.08', 'EMP02.09', 'EMP02.06', 'EMP02.07', 'EMP02.10', 'EMP02.11', 'EMP02.12', 'EMP02.13', 'END'],
      fail: ['START', 'EMP02.01', 'EMP02.06', 'EMP02.07', 'EMP02.10', 'EMP02.11', 'EMP02.12', 'EMP02.14', 'EMP02.15', 'END']
    },
    delays: { pass: 900, fail: 1000 }
  })

  const currentStepData = EMP02_STEPS[selectedStep] || EMP02_STEPS['EMP02.01']

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TIMELINE BANNER: DÒNG THỜI GIAN NGHIỆP VỤ 60 NGÀY CHO MỌI NGƯỜI DỄ HÌNH DUNG */}
      <div className={`p-4 rounded-2xl border transition-colors shadow-2xs ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200/80'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'vi' ? 'DÒNG THỜI GIAN 60 NGÀY TIẾP NHẬN & THỬ VIỆC (DỄ HIỂU TRONG 1 PHÚT)' : '60-DAY ONBOARDING & PROBATION TIMELINE'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'vi' ? 'Toàn bộ quy trình diễn ra theo 5 mốc thời gian rõ ràng từ ngày đầu đến ngày ký hợp đồng' : 'Clear 5-milestone journey from Day 1 to contract execution'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              ⚖️ Điều 27 Luật Lao Động: Báo trước 05 ngày
            </span>
          </div>
        </div>

        {/* 5 Milestone Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-blue-600 dark:text-blue-400">MỐC 1 · NGÀY 1</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Nhận việc & Cấp máy</p>
            <span className="text-[10px] text-slate-400">IT cấp email, HR mở hồ sơ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-emerald-600 dark:text-emerald-400">MỐC 2 · NGÀY 3</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Sếp giao KPI 60 ngày</p>
            <span className="text-[10px] text-slate-400">Xác nhận mục tiêu trên App</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-amber-600 dark:text-amber-400">MỐC 3 · TUẦN 2</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Đào tạo hội nhập</p>
            <span className="text-[10px] text-slate-400">Học văn hóa & Test &ge; 80%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-purple-600 dark:text-purple-400">MỐC 4 · NGÀY 50-53</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Tự chấm & Sếp đánh giá</p>
            <span className="text-[10px] text-slate-400">Đạt &ge; 85 điểm ➔ Ký HĐLĐ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs col-span-2 sm:col-span-1">
            <span className="font-mono font-black text-[10px] text-rose-600 dark:text-rose-400">MỐC 5 · NGÀY 55-60</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Ký HĐLĐ / Dừng lại</p>
            <span className="text-[10px] text-slate-400">Ký chính thức & Đóng BHXH</span>
          </div>
        </div>
      </div>

      {/* TOP CONTROL TOOLBAR: VIEW TOGGLE & SIMULATION CONTROLS */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Swimlane with visual connections */}
          <button
            type="button"
            onClick={() => setActiveTabMode('swimlane')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'swimlane'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'vi' ? 'Sơ Đồ Phân Làn 6 Bên (Có Dây Nối Trực Quan)' : '6-Swimlane Diagram with Visual Links'}</span>
          </button>

          {/* Tab 2: Plain-language Story Mode */}
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
            <span>{language === 'vi' ? '📖 Hướng Dẫn Kể Chuyện (Ai Đọc Cũng Hiểu)' : 'Plain-Language Story Mode'}</span>
          </button>

          {/* Tab 3: Specs & RACI */}
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
            <span>{language === 'vi' ? 'Ma trận 3 luồng & phân công trách nhiệm' : '3-stream work assignment matrix'}</span>
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

      {/* VIEW 1: 6-SWIMLANE INTERACTIVE FLOWCHART CANVAS WITH CLEAR CONNECTOR LABELS */}
      {activeTabMode === 'swimlane' && (
        <div className="space-y-6">
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            {/* Header with Visual Legend for Non-Tech/Non-HR users */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>{language === 'vi' ? '(EMP02) LƯU ĐỒ TĂNG NHÂN VIÊN MỚI & ĐÁNH GIÁ THỬ VIỆC' : '(EMP02) DIRECT ONBOARDING & PROBATION FLOWCHART'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'vi' ? 'Xem các đường dây liên kết giữa các phòng ban · Nhấp vào từng ô để xem giải thích bình dân bên dưới' : 'Visual links across 6 departments · Click any card for step-by-step plain explanations'}
                </p>
              </div>

              {/* Visual Legend Bar */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bắt đầu / Đạt
                </span>
                <span className="flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Công việc cần làm
                </span>
                <span className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Điểm ra quyết định
                </span>
                <span className="flex items-center gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Dừng / Thanh lý
                </span>
              </div>
            </div>

            {/* 6-LANE FLOWCHART CONTAINER WITH ENHANCED INTERACTIVE LABELS */}
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[1000px] border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner">

                {/* LANE 1: HRM - TUYỂN DỤNG */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-blue-100/50 dark:bg-blue-900/30 text-center">
                    <span className="text-xs font-black text-blue-900 dark:text-blue-200 tracking-wider uppercase">1. HRM - Tuyển dụng</span>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mt-1">Tiếp nhận & Mở hồ sơ</span>
                    <span className="text-[9px] text-slate-400 font-mono">Talent Acquisition</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 relative">
                    {/* Start Pill & EMP02.01 */}
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-full border-2 font-black text-xs transition-all shadow-xs shrink-0 ${
                        simActiveStep === 'START'
                          ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-300 animate-pulse'
                          : 'bg-emerald-600 text-white border-emerald-700'
                      }`}>
                        Bắt đầu
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* EMP02.01 Card */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP02.01')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                            selectedStep === 'EMP02.01' || simActiveStep === 'EMP02.01'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              EMP02.01
                            </span>
                            <Users className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Danh sách nhân viên chờ nhận việc</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.01' ? 'text-blue-100' : 'text-slate-500'}`}>
                            Khởi tạo hồ sơ & cấp mã NV
                          </p>
                        </button>

                        {/* Visual Connector Notice to 3 Lanes */}
                        <div className="absolute -bottom-7 left-2 flex items-center gap-1 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-300 shadow-2xs whitespace-nowrap">
                          <ArrowDown className="w-3 h-3 text-blue-600" />
                          <span>Rẽ 3 luồng: Báo IT, Đào tạo, Sếp</span>
                        </div>
                      </div>
                    </div>

                    {/* Returning Stream from BP: EMP02.04 & EMP02.05 */}
                    <div className="flex items-center gap-3">
                      {/* EMP02.04 */}
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.04')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP02.04' || simActiveStep === 'EMP02.04'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            EMP02.04
                          </span>
                          <Laptop className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Kiểm tra kết quả chuẩn bị</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.04' ? 'text-blue-100' : 'text-slate-500'}`}>
                          Đã đủ máy tính, email, thẻ
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* EMP02.05 */}
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.05')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP02.05' || simActiveStep === 'EMP02.05'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            EMP02.05
                          </span>
                          <Database className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật hồ sơ nhân viên</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.05' ? 'text-blue-100' : 'text-slate-500'}`}>
                          Chuyển sang "Đang thử việc"
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* End Pill */}
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
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mt-1">Cơ sở vật chất & Máy tính</span>
                    <span className="text-[9px] text-slate-400 font-mono">Facilities & IT</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-start gap-4 pl-32 relative">
                    {/* EMP02.02 */}
                    <button
                      type="button"
                      onClick={() => setSelectedStep('EMP02.02')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                        selectedStep === 'EMP02.02' || simActiveStep === 'EMP02.02'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-4 ring-purple-300 scale-105'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          EMP02.02
                        </span>
                        <Laptop className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <h4 className="text-xs font-black leading-tight">Thông báo task đến các bộ phận</h4>
                      <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.02' ? 'text-purple-100' : 'text-slate-500'}`}>
                        Nhận yêu cầu chuẩn bị máy & email
                      </p>
                    </button>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {/* EMP02.03 */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.03')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP02.03' || simActiveStep === 'EMP02.03'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-4 ring-purple-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            EMP02.03
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật kết quả Task</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.03' ? 'text-purple-100' : 'text-slate-500'}`}>
                          Đã cấp email, máy tính & bàn ghế
                        </p>
                      </button>

                      {/* Mail Doc Output with upward connector label */}
                      <div className="absolute -bottom-8 left-4 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 border border-amber-300 text-[10px] font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1 shadow-2xs">
                          <Mail className="w-3 h-3 text-amber-600" />
                          <span>Gửi mail báo Tuyển dụng ⬆ (EMP02.04)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 3: HRM - ĐÀO TẠO */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-amber-100/50 dark:bg-amber-900/30 text-center">
                    <span className="text-xs font-black text-amber-900 dark:text-amber-200 tracking-wider uppercase">3. HRM - Đào tạo</span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 mt-1">Đào tạo Hội nhập</span>
                    <span className="text-[9px] text-slate-400 font-mono">L&D Training</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-start gap-4 pl-32 relative">
                    {/* EMP02.08 */}
                    <button
                      type="button"
                      onClick={() => setSelectedStep('EMP02.08')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                        selectedStep === 'EMP02.08' || simActiveStep === 'EMP02.08'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-4 ring-amber-300 scale-105'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          EMP02.08
                        </span>
                        <GraduationCap className="w-3.5 h-3.5 opacity-70" />
                      </div>
                      <h4 className="text-xs font-black leading-tight">Danh sách NV tham gia đào tạo</h4>
                      <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.08' ? 'text-amber-100' : 'text-slate-500'}`}>
                        Lập danh sách & gửi thư mời học
                      </p>
                    </button>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {/* Trapezoid Orientation Session */}
                    <div className="px-4 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-100/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-xs text-center">
                      <p>🎓 Đào tạo hội nhập</p>
                      <span className="text-[10px] font-normal opacity-80">(Học văn hóa & quy định)</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                    {/* EMP02.09 */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.09')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP02.09' || simActiveStep === 'EMP02.09'
                            ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-4 ring-amber-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            EMP02.09
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật kết quả đào tạo</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.09' ? 'text-amber-100' : 'text-slate-500'}`}>
                          Chấm điểm bài test (&ge; 80%)
                        </p>
                      </button>

                      {/* Mail Doc Output */}
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
                    {/* EMP02.06 Giao mục tiêu KPI */}
                    <div className="relative pl-32">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.06')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP02.06' || simActiveStep === 'EMP02.06'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-4 ring-emerald-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            EMP02.06
                          </span>
                          <Briefcase className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Giao mục tiêu KPI thử việc</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.06' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Giao việc 60 ngày trên App
                        </p>
                      </button>

                      {/* Mail Doc Output & Downward connector to Employee */}
                      <div className="absolute -bottom-8 left-36 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 border border-cyan-300 text-[10px] font-bold text-cyan-800 dark:text-cyan-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                          <Mail className="w-3 h-3 text-cyan-600" />
                          <span>Gửi KPI xuống NV ⬇ (EMP02.07)</span>
                        </div>
                      </div>
                    </div>

                    {/* EMP02.11 Decision Point */}
                    <div className="flex items-center gap-4 pr-12">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP02.11')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-56 shadow-xs ${
                            selectedStep === 'EMP02.11' || simActiveStep === 'EMP02.11'
                              ? 'bg-amber-500 text-white border-amber-400 shadow-md ring-4 ring-amber-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              EMP02.11 (Điểm Quyết Định)
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Đánh giá kết quả thực hiện KPI</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.11' ? 'text-amber-100' : 'text-slate-500'}`}>
                            Sếp chấm điểm: Đạt hay Không?
                          </p>
                        </button>

                        {/* Result Doc Return */}
                        <div className="absolute -right-32 top-2 flex items-center gap-1">
                          <div className="px-2 py-1 rounded bg-teal-50 dark:bg-teal-950 border border-teal-300 text-[10px] font-bold text-teal-800 dark:text-teal-200 shadow-2xs">
                            Gửi kết quả ➔ NV ⬇
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 5: NV (NHÂN VIÊN MỚI) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-cyan-50/20 dark:bg-cyan-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-cyan-100/50 dark:bg-cyan-900/30 text-center">
                    <span className="text-xs font-black text-cyan-900 dark:text-cyan-200 tracking-wider uppercase">5. NV (Nhân viên mới)</span>
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 mt-1">Làm việc & Tự chấm</span>
                    <span className="text-[9px] text-slate-400 font-mono">New Employee</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 relative">
                    {/* EMP02.07 & EMP02.10 */}
                    <div className="flex items-center gap-4 pl-32">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.07')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP02.07' || simActiveStep === 'EMP02.07'
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                            EMP02.07
                          </span>
                          <FileText className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Xem & Xác nhận KPI</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.07' ? 'text-cyan-100' : 'text-slate-500'}`}>
                          Nhận việc & cam kết mục tiêu
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP02.10')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                            selectedStep === 'EMP02.10' || simActiveStep === 'EMP02.10'
                              ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                              EMP02.10
                            </span>
                            <GitPullRequest className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Tự chấm điểm thử việc</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.10' ? 'text-cyan-100' : 'text-slate-500'}`}>
                            Nộp báo cáo 60 ngày cho Sếp
                          </p>
                        </button>

                        <div className="absolute -top-8 left-4 flex items-center gap-1">
                          <div className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                            <Mail className="w-3 h-3 text-emerald-600" />
                            <span>Gửi phiếu tự chấm lên Sếp ⬆ (EMP02.11)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EMP02.12 Result View */}
                    <div className="pr-12">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.12')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP02.12' || simActiveStep === 'EMP02.12'
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md ring-4 ring-cyan-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                            EMP02.12
                          </span>
                          <UserCheck className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Xem kết quả đánh giá</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.12' ? 'text-cyan-100' : 'text-slate-500'}`}>
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
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 mt-1">Lương, Hợp đồng & Bảo hiểm</span>
                    <span className="text-[9px] text-slate-400 font-mono">C&B Specialist</span>
                  </div>

                  <div className="col-span-10 p-4 flex items-center justify-between gap-4 pl-32 relative">
                    {/* Pass Path: EMP02.13 */}
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-200 shadow-2xs">
                        ✅ NẾU ĐẠT (&ge; 85đ)
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.13')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP02.13' || simActiveStep === 'EMP02.13'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-4 ring-emerald-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            EMP02.13
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Ký hợp đồng lao động chính thức</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.13' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Ký HĐLĐ & Đóng BHXH
                        </p>
                      </button>
                    </div>

                    {/* Fail Path: EMP02.14 & EMP02.15 */}
                    <div className="flex items-center gap-3 pr-12">
                      <div className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 border border-rose-400 text-[10px] font-extrabold text-rose-800 dark:text-rose-200 shadow-2xs">
                        ❌ NẾU KHÔNG ĐẠT (&lt; 85đ)
                      </div>

                      {/* EMP02.14 */}
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP02.14')}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                          selectedStep === 'EMP02.14' || simActiveStep === 'EMP02.14'
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-4 ring-rose-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            EMP02.14
                          </span>
                          <UserX className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Thanh lý HĐLĐ thử việc</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.14' ? 'text-rose-100' : 'text-slate-500'}`}>
                          Tính lương ngày công đã làm
                        </p>
                      </button>

                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* EMP02.15 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP02.15')}
                          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left w-48 shadow-xs ${
                            selectedStep === 'EMP02.15' || simActiveStep === 'EMP02.15'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-4 ring-rose-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                              EMP02.15
                            </span>
                            <Printer className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Giảm lao động</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP02.15' ? 'text-rose-100' : 'text-slate-500'}`}>
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

          {/* STEP INSPECTOR DRAWER / DETAILS CARD (PLAIN LANGUAGE EXPLANATION) */}
          {currentStepData && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 border-2 border-blue-500/40 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs shadow-2xs">
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

              {/* Plain-Language Summary Box (Dành cho người không chuyên IT/HR) */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200">
                    💡 {language === 'vi' ? 'Hiểu đơn giản về bước này:' : 'Plain Explanation:'}
                  </span>{' '}
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {currentStepData.simpleExplain}
                  </span>
                </div>
              </div>

              {/* Data Flow Indicator */}
              {(currentStepData.fromStep || currentStepData.toStep) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentStepData.fromStep && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">⬅ Nhận từ:</span>
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
                {/* Inputs */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{language === 'vi' ? 'Dữ liệu Đầu vào (Inputs)' : 'Inputs'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.inputs.map((inp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500">•</span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs & Documents */}
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

                {/* Rules & Conditions */}
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

      {/* VIEW 2: PLAIN-LANGUAGE STORY MODE (KỂ CHUYỆN 4 CHƯƠNG CHO NGƯỜI DÙNG BÌNH DÂN) */}
      {activeTabMode === 'story' && (
        <div className={`p-5 sm:p-7 rounded-3xl border space-y-6 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>{language === 'vi' ? 'QUY TRÌNH TIẾP NHẬN & THỬ VIỆC DƯỚI DẠNG KỂ CHUYỆN (4 BƯỚC CỰC DỄ HIỂU)' : 'PLAIN LANGUAGE STORY: 4 SIMPLE STEPS'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi' ? 'Dù bạn không làm nhân sự hay IT, chỉ cần đọc 4 bước này là hiểu ngay cách thức hoạt động' : 'Non-HR & Non-IT friendly story format'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Story 1 */}
            <div className="p-5 rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  1
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {language === 'vi' ? 'Ngày Đầu Nhận Việc: Chuẩn Bị & Mở Hồ Sơ' : 'Day 1: Setup & Intake'}
                  </h4>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Ai làm: Tuyển dụng + IT + Hành chính</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Khi có nhân sự mới, <strong>Tuyển dụng</strong> tạo mã nhân viên trên phần mềm. Hệ thống tự động báo cho <strong>IT</strong> cài máy tính, tạo email và báo <strong>Hành chính</strong> chuẩn bị thẻ từ, bàn ghế. Trước 8h30 ngày đầu, mọi thứ sẵn sàng để nhân sự mới chỉ việc vào làm.
              </p>
            </div>

            {/* Story 2 */}
            <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  2
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {language === 'vi' ? 'Tuần Đầu: Học Văn Hóa & Nhận Việc (KPI)' : 'Week 1: Training & KPI'}
                  </h4>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Ai làm: Đào tạo + Trưởng phòng + Nhân viên</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Trong 3 ngày đầu, <strong>Trưởng phòng</strong> giao các mục tiêu KPI 60 ngày cần làm. Nhân viên mở App điện thoại bấm cam kết. Đồng thời, bộ phận <strong>Đào tạo</strong> mời nhân viên tham gia lớp học văn hóa doanh nghiệp và làm bài kiểm tra đạt từ 80% điểm.
              </p>
            </div>

            {/* Story 3 */}
            <div className="p-5 rounded-3xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  3
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {language === 'vi' ? 'Hết 60 Ngày: Tự Chấm Điểm & Sếp Đánh Giá' : 'Day 50-53: Evaluation'}
                  </h4>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Ai làm: Nhân viên + Trưởng phòng</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Trước khi hết 2 tháng thử việc 10 ngày, <strong>Nhân viên</strong> tự chấm điểm những việc mình đã làm rồi nộp cho Sếp. <strong>Trưởng phòng</strong> chấm điểm chính thức: Nếu Đạt (&ge; 85 điểm) thì đề xuất ký hợp đồng; Nếu Không đạt (&lt; 85 điểm) thì dừng hợp tác.
              </p>
            </div>

            {/* Story 4 */}
            <div className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  4
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {language === 'vi' ? 'Chốt Kết Quả: Ký Hợp Đồng Hoặc Thanh Lý' : 'Day 55-60: Contract or Exit'}
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ai làm: C&B + Nhân viên</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Bộ phận <strong>C&B</strong> nhận kết quả: Nếu Đạt ➔ phát hành Hợp đồng chính thức và đóng Bảo hiểm xã hội. Nếu Không đạt ➔ thanh lý đủ tiền lương những ngày đã làm, nhận lại máy tính và thông báo cho nhân viên trước ít nhất 5 ngày theo Luật lao động.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 3-STREAM PARALLEL MATRIX & RACI */}
      {activeTabMode === 'specs' && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>{language === 'vi' ? 'MA TRẬN 3 LUỒNG CÔNG VIỆC SONG SONG & PHÂN CÔNG TRÁCH NHIỆM' : '3 PARALLEL WORKSTREAMS & RESPONSIBILITY MATRIX'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'vi' ? 'Tiếp nhận trực tiếp không qua tuyển dụng · Phân định rõ ràng trách nhiệm 6 bên' : 'Direct onboarding without recruiting · Clear 6-party responsibility allocation'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stream 1 */}
            <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-extrabold text-xs uppercase">
                <Laptop className="w-4 h-4" />
                <span>Luồng 1: Cơ Sở Vật Chất & IT</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Chuẩn bị Máy tính, Cấp Email, Thẻ từ, Chỗ ngồi làm việc trước 08:30 Ngày nhận việc đầu tiên.
              </p>
              <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 p-2 rounded-xl border border-purple-200 dark:border-purple-800">
                Steps: EMP02.02 ➔ EMP02.03 ➔ EMP02.04 ➔ EMP02.05
              </div>
            </div>

            {/* Stream 2 */}
            <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs uppercase">
                <GraduationCap className="w-4 h-4" />
                <span>Luồng 2: Đào Tạo Hội Nhập</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Khóa đào tạo Văn hóa công ty, Quy chế làm việc & Bài test kiểm tra đạt tối thiểu &ge; 80% điểm.
              </p>
              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200 dark:border-amber-800">
                Steps: EMP02.08 ➔ Đào tạo ➔ EMP02.09
              </div>
            </div>

            {/* Stream 3 */}
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase">
                <Briefcase className="w-4 h-4" />
                <span>Luồng 3: KPI Thử Việc & Hợp Đồng</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Giao KPI 60 ngày ➔ Tự đánh giá ➔ TBP chấm điểm ➔ Rẽ nhánh Ký HĐLĐ hoặc Thanh lý nghỉ việc.
              </p>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                Steps: EMP02.06 ➔ EMP02.07 ➔ EMP02.10 ➔ EMP02.11 ➔ EMP02.13/14/15
              </div>
            </div>
          </div>

          {/* Legal Compliance Alert */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-rose-700 dark:text-rose-300 uppercase text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>LƯU Ý PHÁP LÝ TỐI QUAN TRỌNG VỀ THỜI HẠN THỬ VIỆC (ĐIỀU 27 BỘ LUẬT LAO ĐỘNG):</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Bắt buộc hoàn tất đánh giá và thông báo kết quả thử việc cho nhân viên <strong>trước khi hết hạn hợp đồng thử việc tối thiểu 05 ngày</strong>. Nếu quá hạn không có văn bản thông báo hoặc thanh lý, hợp đồng thử việc tự động chuyển hóa thành hợp đồng lao động chính thức.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
