import React from 'react'
import { Users, Clock, CircleDollarSign, Receipt, ShieldCheck, Target } from 'lucide-react'

export interface ModuleStage {
  stageId: string
  stageNumber: number
  stageTitle: string
  stageTitleEn: string
  description: string
  descriptionEn: string
  sopCodes: string[]
}

export interface SopDetailItem {
  code: string
  title: string
  titleEn: string
  type: 'N' | 'M' | 'A'
  stageNumber?: number
  actor?: string
  actorEn?: string
  scopeNote?: string
  scopeNoteEn?: string
  inputs?: string[]
  inputsEn?: string[]
  outputs?: string[]
  outputsEn?: string[]
  workflowId?: string
  wireframeId?: string
  isInheritedFromATS?: boolean
}

export interface ModuleEcosystemItem {
  id: string
  code: string
  name: string
  nameEn: string
  sopCount: string
  percentage: string
  subFeatures: string[]
  subFeaturesEn: string[]
  stages?: ModuleStage[]
  sopList: SopDetailItem[]
  color: string
  gradient: string
  border: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  icon: React.ReactNode
  angleDeg: number
}

// 6 REAL ENTERPRISE HRMS MODULES (50 SOPS TOTAL)
export const SIX_CORE_MODULES: ModuleEcosystemItem[] = [
  {
    id: 'ats',
    code: 'Tuyển dụng ATS',
    name: 'Phân hệ Tuyển dụng & Săn tìm Nhân tài (ATS)',
    nameEn: 'Recruitment & Applicant Tracking System (ATS)',
    sopCount: '5/5 SOPs',
    percentage: '100%',
    subFeatures: ['Kế hoạch định biên & Yêu cầu tuyển dụng', 'Sàng lọc CV & Phỏng vấn ứng viên', 'Phát hành Offer & Chuyển giao Onboarding'],
    subFeaturesEn: ['Headcount requisition & Job postings', 'CV screening & Candidate interviews', 'Offer generation & Onboarding handover'],
    stages: [
      {
        stageId: 'ATS_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Hoạch định Nhu cầu & Đăng tin Tuyển dụng',
        stageTitleEn: 'Stage 1: Requisition & Job Sourcing',
        description: 'Thu thập phiếu yêu cầu tuyển dụng từ các phòng ban, kiểm tra định biên nhân sự và đăng tin trên các kênh đối tác.',
        descriptionEn: 'Gather recruitment requisitions, verify headcount plans, and publish vacancies to job boards.',
        sopCodes: ['SOP-REC-01', 'SOP-REC-02']
      },
      {
        stageId: 'ATS_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Sàng lọc CV, Phỏng vấn & Thư mời Offer',
        stageTitleEn: 'Stage 2: Screening, Interview & Offer',
        description: 'Tiếp nhận hồ sơ ứng viên, chấm điểm phỏng vấn, thẩm định năng lực và phát hành thư mời nhận việc chuyển sang Onboarding.',
        descriptionEn: 'Screen candidate profiles, evaluate interview scorecards, and issue official offer letters for onboarding handover.',
        sopCodes: ['SOP-REC-03', 'SOP-REC-04', 'SOP-REC-05']
      }
    ],
    sopList: [
      {
        code: 'SOP-REC-01',
        title: 'Đề xuất nhu cầu tuyển dụng & Phê duyệt định biên',
        titleEn: 'Recruitment Requisition & Headcount Approval',
        type: 'N',
        stageNumber: 1,
        actor: 'Trưởng bộ phận & HR Tuyển dụng',
        actorEn: 'Line Manager & Talent Acquisition Lead',
        scopeNote: 'Khởi tạo phiếu yêu cầu tuyển dụng khi phòng ban có phát sinh nhân sự mới hoặc thay thế, đối soát với hạn mức định biên EMP01.',
        scopeNoteEn: 'Initiate headcount requisition when departments expand or backfill, cross-referencing against EMP01 headcount quotas.',
        inputs: ['Phiếu đề xuất tuyển dụng', 'Hạn mức định biên phòng ban (MD-05)', 'Tiêu chuẩn chức danh JD (MD-06)'],
        outputs: ['Yêu cầu tuyển dụng được phê duyệt', 'Ngân sách tuyển dụng vị trí được cấp phép'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-REC-02',
        title: 'Đăng tin tuyển dụng & Quản lý Job Boards đối tác',
        titleEn: 'Job Posting & Partner Channels Management',
        type: 'A',
        stageNumber: 1,
        actor: 'Chuyên viên Tuyển dụng (TA Specialist)',
        actorEn: 'Talent Acquisition Specialist',
        scopeNote: 'Tự động đồng bộ tin tuyển dụng lên LinkedIn, TopCV, VietnamWorks và hệ thống giới thiệu nội bộ (Referral).',
        scopeNoteEn: 'Automatically synchronize job vacancies to LinkedIn, job boards and internal referral programs.',
        inputs: ['Bản mô tả công việc (JD)', 'Kênh đăng tuyển (MD-ATS-02)', 'Chi phí ngân sách tuyển dụng'],
        outputs: ['Tin tuyển dụng phát hành công khai', 'Link nộp CV trực tuyến cho ứng viên'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-REC-03',
        title: 'Thu thập, Sàng lọc CV & Đánh giá sơ bộ ứng viên',
        titleEn: 'CV Ingestion, Automated Screening & Shortlisting',
        type: 'M',
        stageNumber: 2,
        actor: 'Chuyên viên Tuyển dụng & AI Parser',
        actorEn: 'TA Specialist & CV Parsing Engine',
        scopeNote: 'Tự động trích xuất thông tin CV, đối chiếu với Tiêu chí tuyển dụng (MD-ATS-01) để lọc ra danh sách ứng viên tiềm năng (Shortlist).',
        scopeNoteEn: 'Auto-parse candidate resumes against hiring criteria (MD-ATS-01) to generate qualified candidate shortlists.',
        inputs: ['File CV ứng viên', 'Khung điều kiện tuyển dụng (MD-ATS-01)', 'Học vấn & Kinh nghiệm (MD-04)'],
        outputs: ['Hồ sơ ứng viên chuẩn hóa trong kho ATS', 'Danh sách ứng viên vào vòng phỏng vấn'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-REC-04',
        title: 'Phỏng vấn, Chấm điểm chuyên môn & Đánh giá tiềm năng',
        titleEn: 'Interview Scoring, Technical Assessment & Evaluation',
        type: 'M',
        stageNumber: 2,
        actor: 'Hội đồng phỏng vấn & Trưởng bộ phận',
        actorEn: 'Interview Panel & Hiring Manager',
        scopeNote: 'Tổ chức phỏng vấn trực tiếp/online, nhập điểm đánh giá theo tiêu chí và đưa ra kết luận Đạt/Không đạt (Pass/Fail).',
        scopeNoteEn: 'Conduct interviews, record evaluation scores against job competencies, and decide Pass/Fail status.',
        inputs: ['Lịch phỏng vấn đã xếp', 'Bộ tiêu chí chấm điểm chuyên môn', 'Hồ sơ năng lực ứng viên'],
        outputs: ['Bảng điểm đánh giá phỏng vấn (Scorecard)', 'Quyết định lựa chọn ứng viên trúng tuyển'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-REC-05',
        title: 'Phát hành Thư mời nhận việc (Offer) & Chuyển giao Onboarding',
        titleEn: 'Offer Letter Generation & Onboarding Ingestion Handover',
        type: 'A',
        stageNumber: 2,
        actor: 'HR Tuyển dụng & Hệ thống Tự động',
        actorEn: 'TA Lead & Automated Handover Engine',
        scopeNote: 'Phát hành Thư mời nhận việc kèm mức lương P1 (MD-07). Khi ứng viên ký số chấp thuận, hệ thống tự động bắn toàn bộ dữ liệu sang Core EMP (SOP-EMP-02) để tiếp nhận Onboarding.',
        scopeNoteEn: 'Generate official offer letters based on P1 pay scale (MD-07). Upon digital signature acceptance, automatically stream data to Core EMP (SOP-EMP-02).',
        inputs: ['Quyết định trúng tuyển', 'Thang bảng lương 3P (MD-07)', 'Chữ ký số xác nhận của ứng viên'],
        outputs: ['Thư mời nhận việc có hiệu lực (Offer Letter)', 'Gói dữ liệu ứng viên chuyển giao sang Onboarding (SOP-EMP-02)'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      }
    ],
    color: '#8b5cf6',
    gradient: 'from-purple-600 to-indigo-600',
    border: 'border-purple-500/30',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-950/40',
    textLight: 'text-purple-700',
    textDark: 'text-purple-300',
    icon: <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    angleDeg: 270 // 12 o'clock
  },
  {
    id: 'emp',
    code: 'Core EMP',
    name: 'Phân hệ Nhân sự (Core EMP)',
    nameEn: 'Personnel Core Module (Core EMP)',
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Hồ sơ sơ yếu lý lịch nhân viên', 'Quản lý thông tin hợp đồng & hồ sơ', 'Báo cáo biến động nhân sự'],
    subFeaturesEn: ['Employee master profiles & resumes', 'Contract & document management', 'Headcount & movement reporting'],
    stages: [
      {
        stageId: 'EMP_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Hoạch định & Tiếp nhận mới (Onboarding)',
        stageTitleEn: 'Stage 1: Planning & New Hire Onboarding',
        description: 'Kế thừa hồ sơ từ Tuyển dụng (ATS), kiểm tra định biên và khởi tạo hồ sơ nhân viên mới lần đầu.',
        descriptionEn: 'Inherit profile from Recruitment (ATS), check headcount and initialize new employee master record.',
        sopCodes: ['SOP-EMP-01', 'SOP-EMP-02', 'SOP-EMP-03']
      },
      {
        stageId: 'EMP_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Hợp đồng & Điều chuyển (Contracts & Mobility)',
        stageTitleEn: 'Stage 2: Contracts & Organizational Mobility',
        description: 'Xác lập quan hệ lao động pháp lý, tái ký hợp đồng, bổ nhiệm chức vụ và điều động phòng ban.',
        descriptionEn: 'Establish legal employment contracts, renewals, appointments and inter-department transfers.',
        sopCodes: ['SOP-EMP-04', 'SOP-EMP-05', 'SOP-EMP-06', 'SOP-EMP-07']
      },
      {
        stageId: 'EMP_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Đánh giá, Đào tạo & Phúc lợi (Growth & Welfare)',
        stageTitleEn: 'Stage 3: Evaluation, Training & Welfare Benefits',
        description: 'Đánh giá thử việc KPI, khen thưởng/kỷ luật, quy hoạch đào tạo kỹ năng và chế độ sức khỏe.',
        descriptionEn: 'Probation KPI review, rewards & discipline, training plans and healthcare benefits.',
        sopCodes: ['SOP-EMP-08', 'SOP-EMP-09', 'SOP-EMP-10', 'SOP-EMP-11', 'SOP-EMP-12']
      },
      {
        stageId: 'EMP_STG_4',
        stageNumber: 4,
        stageTitle: 'Chặng 4: Biến động giảm & Thôi việc (Offboarding)',
        stageTitleEn: 'Stage 4: Resignation & Offboarding Clearance',
        description: 'Xử lý thỏa thuận thôi việc, thu hồi tài sản IT 4 bên, quyết toán tài chính và khóa sổ hồ sơ.',
        descriptionEn: 'Process resignation agreements, 4-party IT asset recovery, final pay and master record lock.',
        sopCodes: ['SOP-EMP-13', 'SOP-EMP-14', 'SOP-EMP-15']
      }
    ],
    sopList: [
      {
        code: 'SOP-EMP-01',
        workflowId: 'LIFE-00',
        wireframeId: 'LIFE-00',
        title: 'EMP01 - Thiết lập định biên nhân sự',
        titleEn: 'EMP01 - Headcount Budget Planning',
        type: 'N',
        stageNumber: 1,
        actor: 'TBP (Trưởng bộ phận) & HRBP / BOD',
        actorEn: 'Department Head & HRBP / BOD',
        scopeNote: 'TBP phụ trách xây dựng định biên cho phòng ban mình theo năm. Thẩm định qua HRBP và BOD phê duyệt.',
        scopeNoteEn: 'Dept Head plans annual headcount for department. Audited by HRBP and approved by BOD.',
        inputs: [
          'Năm xây dựng & Phòng ban', 
          'Chức vụ (từ danh mục Chức vụ)', 
          'Cấp độ (level job grade) theo chức vụ',
          'Tháng định biên (chi tiết 12 tháng)',
          'Thu nhập (people cost) theo định biên'
        ],
        outputs: [
          'Tổng thu nhập (people cost) trên tổng định biên (sum)', 
          'Gửi mail tự động về HRM/HRD', 
          'In file trao đổi'
        ]
      },
      {
        code: 'SOP-EMP-02',
        title: 'EMP02 - Tăng nhân viên mới không qua tuyển dụng (bao gồm cả nhân viên cũ nhưng lấy theo mã nhân viên mới)',
        titleEn: 'EMP02 - Direct Employee Intake Without Recruitment (New EMP ID)',
        type: 'N',
        stageNumber: 1,
        isInheritedFromATS: true,
        actor: 'HRM-Tuyển dụng & Các bộ phận liên quan',
        actorEn: 'HR Recruitment & Related Departments',
        scopeNote: 'Quy trình tiếp nhận nhân sự trực tiếp không qua quy trình tuyển dụng chuẩn (nhân viên mới hoặc nhân viên cũ cấp mã mới), giao task onboarding và KPI thử việc.',
        scopeNoteEn: 'Direct employee onboarding without standard recruitment process, task delegation and probation KPI assignment.',
        inputs: ['Thông tin cá nhân & lý lịch ứng viên', 'Chức vụ, Chức danh & Phòng ban tiếp nhận', 'Ngày nhận việc & Task list từng bộ phận cần chuẩn bị', 'Bộ mục tiêu KPI thử việc từ Trưởng bộ phận'],
        outputs: ['Mã số nhân viên mới (EMP ID) khởi tạo', 'Gửi mail thông báo task list cho các TBP liên quan', 'Giao mục tiêu KPI thử việc và danh sách đào tạo hội nhập'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-EMP-03',
        title: 'EMP03 - Tăng nhân viên từ nhân viên cũ không qua tuyển dụng (lấy lại mã nhân viên cũ)',
        titleEn: 'EMP03 - Rehire Former Employee (Retain Old EMP ID)',
        type: 'N',
        stageNumber: 1,
        actor: 'HR Admin & Quản lý trực tiếp',
        actorEn: 'HR Admin & Line Manager',
        scopeNote: 'Quy trình tái tuyển dụng nhân viên cũ quay lại làm việc, giữ nguyên Mã nhân viên cũ và khôi phục lịch sử hồ sơ.',
        scopeNoteEn: 'Rehiring former employee retaining existing Employee ID and reactivating employment history.',
        inputs: ['Mã nhân viên cũ', 'Thông tin cập nhật mới (CCCD, Địa chỉ, Số tài khoản)', 'Quyết định tiếp nhận lại'],
        outputs: ['Hồ sơ nhân viên khôi phục trạng thái hoạt động', 'Gán vị trí công tác mới', 'Đồng bộ lại tài khoản hệ thống'],
        workflowId: 'LIFE-01',
        wireframeId: 'LIFE-01'
      },
      {
        code: 'SOP-EMP-04',
        title: 'EMP04 - Quản lý thông tin nhân viên',
        titleEn: 'EMP04 - Employee Master Profile & Record Management',
        type: 'N',
        stageNumber: 1,
        actor: 'Nhân viên (Self-Service) & HR Admin',
        actorEn: 'Employee (Self-Service) & HR Admin',
        scopeNote: 'Quản lý, cập nhật và tra cứu toàn bộ thông tin hồ sơ lý lịch, bằng cấp, người phụ thuộc, tài khoản ngân hàng và quá trình biến động xuyên suốt.',
        scopeNoteEn: 'Ongoing maintenance, updates and lookup of master employee profiles, qualifications, dependents and audit logs.',
        inputs: ['Mã nhân viên (EMP ID)', 'Giấy tờ chứng thực biến động (Giấy khai sinh con, CCCD mới)', 'Bằng cấp học vấn bổ sung'],
        outputs: ['Hồ sơ Master Data được cập nhật phiên bản mới', 'Đăng ký giảm trừ gia cảnh thuế TNCN (TAX01)', 'Lịch sử thay đổi (Audit Log) ghi nhận hệ thống'],
        workflowId: 'LIFE-02',
        wireframeId: 'LIFE-02'
      },
      {
        code: 'SOP-EMP-05',
        title: 'EMP05 - Tái ký hợp đồng lao động',
        titleEn: 'EMP05 - Labor Contract Renewal Workflow',
        type: 'M',
        stageNumber: 2,
        actor: 'HR C&B & Trưởng bộ phận',
        actorEn: 'HR C&B & Department Head',
        scopeNote: 'Cảnh báo tự động trước 30/45 ngày khi HĐLĐ sắp hết hạn, đánh giá tái ký và ký mới HĐLĐ theo quy định.',
        scopeNoteEn: 'Automated 30/45-day contract expiry notification, performance review and contract renewal signing.',
        inputs: ['Danh sách hợp đồng sắp đáo hạn', 'Đánh giá hiệu quả công việc từ TBP', 'Nguyện vọng tiếp tục làm việc'],
        outputs: ['HĐLĐ tái ký mới (12/24 tháng hoặc Không xác định thời hạn)', 'Ghi nhận lịch sử gia hạn hợp đồng'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-EMP-06',
        title: 'EMP06 - Ký hợp đồng với nhân viên mới',
        titleEn: 'EMP06 - Initial Labor Contract Signing For New Employees',
        type: 'M',
        stageNumber: 2,
        actor: 'HR C&B & Ban Giám Đốc (BOM)',
        actorEn: 'HR C&B & Board of Management',
        scopeNote: 'Quy trình lập và ký HĐLĐ chính thức sau khi nhân viên hoàn thành thời gian thử việc đạt yêu cầu.',
        scopeNoteEn: 'Drafting and signing official employment contracts upon successful probation evaluation.',
        inputs: ['Kết quả đánh giá thử việc Đạt (EMP02 / EMP10)', 'Thang bảng lương áp dụng (MD-07)', 'Mẫu hợp đồng chuẩn Word Template'],
        outputs: ['Mã số HĐLĐ chính thức có chữ ký số 2 bên', 'Bản PDF HĐLĐ lưu trữ két số (E-Vault)', 'Cập nhật mức đóng BHXH theo hợp đồng'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-EMP-07',
        title: 'EMP07 - Ký phụ lục khi thay đổi mức lương/phụ cấp trên hợp đồng',
        titleEn: 'EMP07 - Contract Annex Signing For Salary & Allowance Changes',
        type: 'M',
        stageNumber: 2,
        actor: 'HR C&B & Ban Giám Đốc',
        actorEn: 'HR C&B & Board of Directors',
        scopeNote: 'Lập và ký Phụ lục Hợp đồng lao động khi có điều chỉnh về mức lương cơ bản, ngạch bậc lương hoặc các khoản phụ cấp.',
        scopeNoteEn: 'Issuing and signing employment contract annexes upon wage and allowance adjustments.',
        inputs: ['Quyết định điều chỉnh lương / phụ cấp', 'HĐLĐ hiện tại đang có hiệu lực', 'Mẫu phụ lục hợp đồng chuẩn'],
        outputs: ['Phụ lục HĐLĐ có chữ ký 2 bên', 'Cập nhật mức đóng BHXH mới', 'Đồng bộ sang bảng lương PAY'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-EMP-08',
        title: 'EMP08 - Điều chỉnh thu nhập định kỳ',
        titleEn: 'EMP08 - Periodic Annual / Scheduled Salary Review',
        type: 'M',
        stageNumber: 3,
        actor: 'HR C&B & Hội đồng Đánh giá / BOD',
        actorEn: 'HR C&B & Evaluation Committee / BOD',
        scopeNote: 'Quy trình rà soát và điều chỉnh tăng lương định kỳ hàng năm theo kết quả KPI và chính sách công ty.',
        scopeNoteEn: 'Annual scheduled salary review based on annual KPI performance and company budget.',
        inputs: ['Bảng đánh giá KPI năm', 'Tỷ lệ tăng lương đề xuất theo xếp loại', 'Hạn mức ngân sách quỹ lương'],
        outputs: ['Danh sách nhân sự được duyệt tăng lương', 'Quyết định tăng lương định kỳ', 'Kích hoạt ký Phụ lục HĐLĐ (EMP07)'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-EMP-09',
        title: 'EMP09 - Điều chỉnh thu nhập đột xuất',
        titleEn: 'EMP09 - Off-Cycle / Extraordinary Salary Adjustment',
        type: 'M',
        stageNumber: 3,
        actor: 'Trưởng bộ phận đề xuất & BOD phê duyệt',
        actorEn: 'Department Head & BOD Approval',
        scopeNote: 'Điều chỉnh lương đột xuất ngoài kỳ đánh giá do thành tích xuất sắc, giữ chân nhân tài hoặc bổ sung trách nhiệm.',
        scopeNoteEn: 'Off-cycle ad-hoc salary increment due to exceptional merit, retention or added scope.',
        inputs: ['Tờ trình đề xuất tăng lương đột xuất của TBP', 'Lý do giải trình & Báo cáo đóng góp', 'Ý kiến HRD'],
        outputs: ['Quyết định tăng lương đột xuất có phê duyệt BOD', 'Cập nhật bảng lương kỳ tới', 'Ký Phụ lục HĐLĐ'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-EMP-10',
        title: 'EMP10 - Điều chỉnh thu nhập theo lương tối thiểu vùng',
        titleEn: 'EMP10 - Statutory Regional Minimum Wage Adjustment',
        type: 'A',
        stageNumber: 3,
        actor: 'HR C&B & Hệ thống HRM',
        actorEn: 'HR C&B & Automated HRM Engine',
        scopeNote: 'Hệ thống tự động quét và điều chỉnh mức lương sàn cho các nhân sự thấp hơn mức Lương tối thiểu vùng theo Nghị định mới.',
        scopeNoteEn: 'Automated scan and baseline wage adjustment for compliance with new statutory regional minimum wage decrees.',
        inputs: ['Nghị định quy định mức lương tối thiểu vùng mới', 'Danh sách nhân sự có mức đóng < mức quy định', 'Cấu hình thời điểm áp dụng'],
        outputs: ['Bảng điều chỉnh mức lương & BHXH hàng loạt', 'Thông báo tự động đến nhân sự', 'Đồng bộ cơ quan BHXH'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-EMP-11',
        title: 'EMP11 - Thay đổi quá trình công tác (Bổ nhiệm/Miễn nhiệm/Kiêm nhiệm/Điều chuyển/Điều động)',
        titleEn: 'EMP11 - Career Mobility (Appointment / Discharge / Concurrent / Transfer)',
        type: 'M',
        stageNumber: 2,
        actor: 'Ban Giám Đốc, HRD & Trưởng các phòng ban',
        actorEn: 'BOD, HRD & Department Heads',
        scopeNote: 'Quy trình thực hiện các quyết định nhân sự: Bổ nhiệm cán bộ quản lý, Kiêm nhiệm vị trí, Miễn nhiệm, Điều động hoặc Điều chuyển nội bộ.',
        scopeNoteEn: 'Personnel action workflows: Managerial appointments, concurrent assignments, transfers and internal mobility.',
        inputs: ['Tờ trình nhân sự từ Khối/Phòng', 'Hạn mức định biên vị trí mới', 'Biên bản thống nhất 2 phòng ban'],
        outputs: ['Quyết định nhân sự chính thức có chữ ký BOD', 'Cập nhật Sơ đồ tổ chức & Phân quyền hệ thống', 'Cập nhật phụ cấp chức vụ'],
        workflowId: 'LIFE-03',
        wireframeId: 'LIFE-03'
      },
      {
        code: 'SOP-EMP-12',
        title: 'EMP12 - Quản lý thông tin kỷ luật',
        titleEn: 'EMP12 - Disciplinary Action Management',
        type: 'M',
        stageNumber: 3,
        actor: 'Hội đồng Kỷ luật & HR Pháp chế',
        actorEn: 'Disciplinary Committee & Legal HR',
        scopeNote: 'Xử lý vi phạm nội quy lao động đúng trình tự Bộ luật Lao động: Lập biên bản, họp hội đồng, ra quyết định và lưu vết hồ sơ.',
        scopeNoteEn: 'Handling labor code violations: Incident report, hearing committee, disciplinary decisions and profile records.',
        inputs: ['Biên bản vi phạm kỷ luật', 'Bản tường trình của nhân viên', 'Biên bản họp Hội đồng kỷ luật'],
        outputs: ['Quyết định xử lý kỷ luật (Khiển trách/Kéo dài nâng lương/Cách chức/Sa thải)', 'Khấu trừ hoặc giảm trừ lương (nếu có)', 'Lưu hồ sơ nhân sự'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-EMP-13',
        title: 'EMP13 - Quản lý khen thưởng',
        titleEn: 'EMP13 - Employee Reward & Recognition Management',
        type: 'M',
        stageNumber: 3,
        actor: 'Hội đồng Thi đua Khen thưởng & HR',
        actorEn: 'Recognition Committee & HR',
        scopeNote: 'Ghi nhận và vinh danh thành tích cá nhân/tập thể xuất sắc: Khen thưởng dự án, sáng kiến cải tiến hoặc thưởng định kỳ.',
        scopeNoteEn: 'Recognizing individual and team excellence: Project milestones, innovations and periodic awards.',
        inputs: ['Hồ sơ đề xuất khen thưởng & Minh chứng thành tích', 'Quy chế thi đua khen thưởng', 'Phê duyệt của Hội đồng'],
        outputs: ['Quyết định khen thưởng chính thức', 'Tiền thưởng tự động đẩy vào kỳ lương PAY', 'Vinh danh trên bảng tin Portal'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-EMP-14',
        title: 'EMP14 - Quản lý công tác',
        titleEn: 'EMP14 - Business Travel & Mission Management',
        type: 'N',
        stageNumber: 3,
        actor: 'Nhân viên nộp đơn & Trưởng phòng phê duyệt',
        actorEn: 'Employee Request & Manager Approval',
        scopeNote: 'Đăng ký kế hoạch đi công tác trong/ngoài nước, phê duyệt chi phí vé máy bay/khách sạn, tạm ứng và thanh quyết toán công tác phí.',
        scopeNoteEn: 'Domestic and international business trip planning, travel itinerary approvals, expense advances and reimbursements.',
        inputs: ['Kế hoạch công tác & Mục tiêu công việc', 'Dự toán chi phí vé/khách sạn/công tác phí', 'Danh sách nhân sự tham gia'],
        outputs: ['Giấy đi đường & Quyết định cử công tác', 'Lệnh tạm ứng chi phí kế toán', 'Ghi nhận ngày công tác trên bảng chấm công ATT'],
        workflowId: 'LIFE-03',
        wireframeId: 'LIFE-03'
      },
      {
        code: 'SOP-EMP-15',
        title: 'EMP15 - Giảm lao động',
        titleEn: 'EMP15 - Employee Offboarding & Separation Management',
        type: 'M',
        stageNumber: 4,
        actor: 'Nhân viên thôi việc, TBP, HR C&B & 4 Bên bàn giao',
        actorEn: 'Resigning Employee, Line Manager, HR C&B & 4-Party Clearance',
        scopeNote: 'Quy trình toàn diện khi nhân sự nghỉ việc: Tiếp nhận đơn, kiểm tra thời hạn báo trước, bàn giao tài sản 4 bên, thanh lý HĐLĐ và quyết toán trợ cấp thôi việc.',
        scopeNoteEn: 'Comprehensive offboarding workflow: Resignation notice, 4-party asset handover, contract termination, severance calculation and master archive lock.',
        inputs: ['Đơn xin nghỉ việc / Quyết định chấm dứt HĐLĐ', 'Check-list bàn giao công việc & Tài sản IT/Hành chính', 'Bảng tính công & phép tồn lũy kế'],
        outputs: ['Quyết định nghỉ việc chính thức', 'Bảng quyết toán thôi việc (Final Pay)', 'Báo giảm BHXH (INS03) & Khóa tài khoản vĩnh viễn'],
        workflowId: 'LIFE-07',
        wireframeId: 'LIFE-07'
      }
    ],
    color: '#2563eb',
    gradient: 'from-blue-600 to-indigo-600',
    border: 'border-blue-500',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-950/80',
    textLight: 'text-blue-700',
    textDark: 'text-blue-300',
    icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    angleDeg: 330 // 2 o'clock (Top Right)
  },
  {
    id: 'att',
    code: 'ATT',
    name: 'Chấm công & Nghỉ phép (ATT)',
    nameEn: 'Attendance & Leave (ATT)',
    sopCount: '15/15 SOPs',
    percentage: '100%',
    subFeatures: ['Chấm công tự động (Vân tay/GPS/Khuôn mặt)', 'Quản lý ca làm việc & đăng ký nghỉ phép', 'Bảng tổng hợp công hàng tháng'],
    subFeaturesEn: ['Automated timekeeping (Biometric/GPS/Face ID)', 'Shift management & leave requests', 'Monthly timesheet summaries'],
    stages: [
      {
        stageId: 'ATT_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Cấu hình Ca & Thu thập Dữ liệu Chấm công',
        stageTitleEn: 'Stage 1: Shift Configuration & Clock-in Data Collection',
        description: 'Thiết lập ca kíp, phân lịch làm việc và tự động đồng bộ dữ liệu từ máy chấm công vân tay / Face ID.',
        descriptionEn: 'Configure shift schedules, work calendars and auto-sync biometric/Face ID clock-in data.',
        sopCodes: ['SOP-ATT-01', 'SOP-ATT-02', 'SOP-ATT-03', 'SOP-ATT-10', 'SOP-ATT-14']
      },
      {
        stageId: 'ATT_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Đơn từ & Phê duyệt Nghỉ phép / Làm thêm giờ (OT)',
        stageTitleEn: 'Stage 2: Leave Applications & Overtime (OT) Approvals',
        description: 'Xử lý đơn xin nghỉ phép năm, giải trình đi trễ về sớm, phê duyệt làm thêm giờ và quản lý quỹ phép.',
        descriptionEn: 'Process annual leave requests, attendance explanations, OT approval and leave balance management.',
        sopCodes: ['SOP-ATT-04', 'SOP-ATT-05', 'SOP-ATT-06', 'SOP-ATT-07', 'SOP-ATT-08', 'SOP-ATT-09']
      },
      {
        stageId: 'ATT_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Tổng hợp Bảng công & Khóa sổ Chuyển tính Lương',
        stageTitleEn: 'Stage 3: Timesheet Compilation & Salary Handoff Lock',
        description: 'Tự động tính tổng công tháng, xử lý cảnh báo vi phạm, chốt sổ bảng công và chuyển sang phân hệ Lương PAY.',
        descriptionEn: 'Compile monthly workdays, process violation alerts, lock timesheet and handoff to Payroll PAY.',
        sopCodes: ['SOP-ATT-11', 'SOP-ATT-12', 'SOP-ATT-13', 'SOP-ATT-15']
      }
    ],
    sopList: [
      {
        code: 'SOP-ATT-01',
        title: 'Cấu hình danh mục Ca làm việc & Lịch làm việc',
        titleEn: 'Shift & Work Calendar Configuration',
        type: 'M',
        stageNumber: 1,
        actor: 'HR Chấm công',
        actorEn: 'Timekeeping HR',
        scopeNote: 'Thiết lập khung giờ vào/ra, ca gãy, ca đêm và lịch nghỉ lễ chuẩn công ty.',
        inputs: ['Quy chế làm việc công ty', 'Lịch nghỉ lễ nhà nước'],
        outputs: ['Danh mục Ca làm việc (MD-08)', 'Khung giờ cho phép quẹt thẻ'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-02',
        title: 'Phân ca & Xoay ca kíp kĩ thuật',
        titleEn: 'Shift Scheduling & Roster Rotation',
        type: 'M',
        stageNumber: 1,
        actor: 'Quản lý ca / Trưởng nhóm',
        actorEn: 'Shift Manager / Lead',
        scopeNote: 'Gán ca tuần/tháng cho nhân viên sản xuất, nhà máy hoặc cửa hàng bán lẻ.',
        inputs: ['Kế hoạch nhân sự ca kíp', 'Danh sách nhân viên'],
        outputs: ['Bảng phân ca làm việc chi tiết', 'Thông báo lịch ca lên Mobile App'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-03',
        title: 'Đồng bộ dữ liệu máy chấm công tự động',
        titleEn: 'Biometric Clock-in Data Auto-Sync',
        type: 'A',
        stageNumber: 1,
        actor: 'Hệ thống tự động hóa (Auto Engine)',
        actorEn: 'Automated Sync Engine',
        scopeNote: 'Real-time sync dữ liệu quẹt thẻ vân tay, nhận diện khuôn mặt về cơ sở dữ liệu.',
        inputs: ['Dữ liệu IP máy chấm công', 'Log quẹt thẻ thời gian thực'],
        outputs: ['Dữ liệu In/Out thô được chuẩn hóa', 'Khớp nối với Mã nhân viên'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-04',
        title: 'Đăng ký & Phê duyệt Nghỉ phép năm',
        titleEn: 'Annual Leave Application & Approval',
        type: 'N',
        stageNumber: 2,
        actor: 'Nhân viên nộp & Quản lý duyệt',
        actorEn: 'Employee & Manager',
        scopeNote: 'Nộp đơn xin nghỉ phép năm, kiểm tra quỹ phép tồn và chuỗi phê duyệt theo cấp bậc.',
        inputs: ['Loại phép (Phép năm, Không lương)', 'Số ngày nghỉ & Ngày bắt đầu', 'Người bàn giao công việc'],
        outputs: ['Đơn phép được duyệt', 'Tự động trừ Quỹ phép tồn', 'Ghi nhận ngày công hợp lệ'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-05',
        title: 'Đơn giải trình đi trễ, về sớm',
        titleEn: 'Late-in / Early-out Explanation Request',
        type: 'N',
        stageNumber: 2,
        actor: 'Nhân viên nộp & TBP duyệt',
        actorEn: 'Employee & Line Manager',
        scopeNote: 'Giải trình quên quẹt thẻ, đi công tác đột xuất hoặc lý do chính đáng.',
        inputs: ['Ngày có lỗi quẹt thẻ', 'Lý do giải trình', 'Bằng chứng kèm theo (nếu có)'],
        outputs: ['Bổ sung giờ quẹt thẻ hợp lệ', 'Xóa cảnh báo đi trễ trên bảng công'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-06',
        title: 'Đơn đăng ký làm thêm giờ (OT) & Duyệt',
        titleEn: 'Overtime (OT) Request & Approval',
        type: 'M',
        stageNumber: 2,
        actor: 'Trưởng nhóm lập & TBP duyệt',
        actorEn: 'Team Lead & Department Head',
        scopeNote: 'Đăng ký làm thêm giờ trước ca, kiểm tra trần OT 40h/tháng theo luật lao động.',
        inputs: ['Khung giờ OT dự kiến', 'Danh sách nhân sự tham gia', 'Lý do công việc'],
        outputs: ['Kế hoạch OT được phê duyệt', 'Cơ sở đối soát giờ quẹt thẻ thực tế'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-07',
        title: 'Quản lý nghỉ bù & Quỹ phép tích lũy',
        titleEn: 'Compensatory Leave & Balance Audit',
        type: 'A',
        stageNumber: 2,
        actor: 'Hệ thống tự động & HR',
        actorEn: 'System Engine & HR',
        scopeNote: 'Tự động cộng dồn giờ OT chuyển đổi thành ngày nghỉ bù hoặc tính lũy kế phép thâm niên.',
        inputs: ['Số giờ OT được duyệt chuyển đổi', 'Thâm niên làm việc'],
        outputs: ['Quỹ nghỉ bù khả dụng', 'Báo cáo số dư phép tồn toàn công ty'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-08',
        title: 'Theo dõi lịch công tác ngoài doanh nghiệp',
        titleEn: 'Out-of-Office Work Tracking',
        type: 'N',
        stageNumber: 2,
        actor: 'Nhân viên nộp & TBP duyệt',
        actorEn: 'Employee & Manager',
        scopeNote: 'Ghi nhận ngày làm việc tại địa điểm khách hàng, dự án hoặc công tác bên ngoài.',
        inputs: ['Đơn công tác ngoài', 'Vị trí check-in GPS'],
        outputs: ['Xác nhận đủ ngày công làm việc thực tế'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-09',
        title: 'Quản lý nghỉ chế độ thai sản / ốm đau',
        titleEn: 'Maternity & Sick Leave Management',
        type: 'M',
        stageNumber: 2,
        actor: 'Nhân viên & HR Bảo hiểm',
        actorEn: 'Employee & Insurance HR',
        scopeNote: 'Ghi nhận nghỉ chế độ bảo hiểm xã hội, làm căn cứ thanh toán chế độ ốm đau thai sản.',
        inputs: ['Giấy ra viện / Giấy chứng nhận nghỉ việc hưởng BHXH', 'Thời gian nghỉ theo chỉ định'],
        outputs: ['Ghi nhận nghỉ chế độ trên bảng công', 'Đồng bộ hồ sơ sang Phân hệ Bảo hiểm (INS05)'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-10',
        title: 'Chấm công GPS Mobile & Face ID',
        titleEn: 'GPS Mobile & Face ID Attendance',
        type: 'A',
        stageNumber: 1,
        actor: 'Nhân viên & Hệ thống Mobile',
        actorEn: 'Employee & Mobile App',
        scopeNote: 'Chấm công di động qua định vị GPS bán kính văn phòng và nhận diện khuôn mặt AI.',
        inputs: ['Tọa độ GPS điện thoại', 'Ảnh chụp Face ID thời gian thực'],
        outputs: ['Log chấm công hợp lệ kèm ảnh chụp và tọa độ'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-11',
        title: 'Tổng hợp bảng chấm công tháng tự động',
        titleEn: 'Monthly Timesheet Compilation',
        type: 'A',
        stageNumber: 3,
        actor: 'Hệ thống tự động hóa',
        actorEn: 'Automated Engine',
        scopeNote: 'Tự động gom log quẹt thẻ, đơn phép, đơn OT và tính ra tổng số ngày công chuẩn trong tháng.',
        inputs: ['Dữ liệu quẹt thẻ 30 ngày', 'Danh sách đơn phép đã duyệt', 'Lịch phân ca'],
        outputs: ['Bảng tổng hợp công chi tiết từng nhân viên (Ngày công, Giờ OT, Số lần đi trễ)'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-12',
        title: 'Xử lý cảnh báo vi phạm giờ công',
        titleEn: 'Workday Violation Alert Processing',
        type: 'A',
        stageNumber: 3,
        actor: 'HR Chấm công & Quản lý',
        actorEn: 'Attendance HR & Manager',
        scopeNote: 'Cảnh báo nhân viên vi phạm quá số lần đi trễ, quên quẹt thẻ hoặc nghỉ không phép.',
        inputs: ['Bảng công chưa hoàn thiện', 'Ngưỡng vi phạm nội quy'],
        outputs: ['Danh sách cảnh báo vi phạm', 'Thông báo nhắc nhở gửi nhân viên'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-13',
        title: 'Chốt sổ bảng công & Chuyển tính lương',
        titleEn: 'Timesheet Lock & Salary Handoff',
        type: 'M',
        stageNumber: 3,
        actor: 'HR Manager & C&B',
        actorEn: 'HR Manager & C&B Specialist',
        scopeNote: 'Khóa dữ liệu bảng công không cho chỉnh sửa và đẩy dữ liệu sang Phân hệ Lương PAY.',
        inputs: ['Bảng công đã giải trình 100%', 'Chữ ký số duyệt của HR Manager'],
        outputs: ['Bảng công chính thức bị khóa sổ (Locked)', 'File dữ liệu công nạp tự động vào Bảng lương PAY'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-14',
        title: 'Chấm công theo Dự án & Task công việc',
        titleEn: 'Project & Task Time Tracking',
        type: 'N',
        stageNumber: 1,
        actor: 'Nhân viên & Quản lý Dự án (PM)',
        actorEn: 'Employee & Project Manager',
        scopeNote: 'Phân bổ số giờ làm việc theo từng dự án hoặc trung tâm chi phí để hạch toán chi phí.',
        inputs: ['Mã dự án (Project Code)', 'Số giờ làm việc thực tế'],
        outputs: ['Báo cáo Man-hours theo dự án'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      },
      {
        code: 'SOP-ATT-15',
        title: 'Báo cáo quản trị tuân thủ giờ công',
        titleEn: 'Attendance Compliance Analytics',
        type: 'A',
        stageNumber: 3,
        actor: 'Ban Giám Đốc & HRD',
        actorEn: 'Board & HRD',
        scopeNote: 'Thống kê tỷ lệ đi làm đúng giờ, tỷ lệ nghỉ phép và chi phí làm thêm giờ toàn công ty.',
        inputs: ['Dữ liệu bảng công lịch sử 12 tháng'],
        outputs: ['Dashboard phân tích tuân thủ giờ công', 'Báo cáo chi phí OT theo phòng ban'],
        workflowId: 'LIFE-06',
        wireframeId: 'LIFE-06'
      }
    ],
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-950/80',
    textLight: 'text-emerald-700',
    textDark: 'text-emerald-300',
    icon: <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    angleDeg: 30 // 4 o'clock (Bottom Right)
  },
  {
    id: 'pay',
    code: 'PAY',
    name: 'Tiền lương & Phụ cấp (PAY)',
    nameEn: 'Payroll & Allowances (PAY)',
    sopCount: '4/4 SOPs',
    percentage: '100%',
    subFeatures: ['Cấu hình thang bảng lương & phụ cấp', 'Tính lương tự động theo công & doanh số', 'Chuyển khoản & phiếu lương điện tử'],
    subFeaturesEn: ['Pay grade & allowance configuration', 'Automated salary calculation by workdays & KPI', 'Direct bank transfer & e-payslips'],
    stages: [
      {
        stageId: 'PAY_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Cấu hình Công thức & Thang Bảng Lương',
        stageTitleEn: 'Stage 1: Salary Scale & Formula Setup',
        description: 'Thiết lập ngạch bậc lương, công thức tính lương theo ca, phụ cấp cố định và các khoản giảm trừ.',
        descriptionEn: 'Configure pay grades, shift salary formulas, fixed allowances and standard deduction rules.',
        sopCodes: ['SOP-PAY-01']
      },
      {
        stageId: 'PAY_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Tính toán, Phê duyệt Chi trả & Phiếu Lương',
        stageTitleEn: 'Stage 2: Calculation, Approval, Bank Transfer & E-Payslips',
        description: 'Tự động tính lương theo bảng công, trình duyệt BOM, sinh file chi lương ngân hàng và gửi phiếu lương điện tử.',
        descriptionEn: 'Compute net pay from timesheet, BOM approval, generate bank transfer file and distribute e-payslips.',
        sopCodes: ['SOP-PAY-02', 'SOP-PAY-03', 'SOP-PAY-04']
      }
    ],
    sopList: [
      {
        code: 'SOP-PAY-01',
        title: 'Cấu hình Thang bảng lương & Công thức tính lương',
        titleEn: 'Pay Grade Scale & Formula Setup',
        type: 'M',
        stageNumber: 1,
        actor: 'Chuyên viên C&B & HR Manager',
        actorEn: 'C&B Specialist & HR Manager',
        scopeNote: 'Cấu hình công thức tính lương Gross/Net, trần đóng BHXH, biểu thuế lũy tiến và các khoản phụ cấp.',
        inputs: ['Quy chế lương thưởng công ty', 'Quy định mức lương tối thiểu vùng'],
        outputs: ['Bộ công thức tính lương tự động', 'Danh mục Ngạch bậc lương (MD-07)'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-PAY-02',
        title: 'Tính lương tự động theo Bảng công & Doanh số',
        titleEn: 'Automated Salary Calculation Engine',
        type: 'A',
        stageNumber: 2,
        actor: 'Hệ thống tự động (Payroll Engine)',
        actorEn: 'Automated Payroll Engine',
        scopeNote: 'Kết nối Bảng công khóa sổ (ATT13), dữ liệu KPI/Doanh số và tự động chạy tính lương toàn công ty.',
        inputs: ['Bảng chấm công đã khóa từ ATT', 'Hợp đồng lao động & Mức lương từ Core EMP', 'Dữ liệu trích nộp BHXH/Thuế'],
        outputs: ['Bảng tính lương chi tiết từng nhân sự (Gross, Giảm trừ BHXH, Thuế TNCN, Lương thực nhận Net)'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-PAY-03',
        title: 'Phê duyệt bảng lương & Sinh file ngân hàng',
        titleEn: 'Payroll Approval & Bank Transfer File',
        type: 'M',
        stageNumber: 2,
        actor: 'HRD, Kế toán trưởng & Giám đốc (CEO)',
        actorEn: 'HRD, Chief Accountant & CEO',
        scopeNote: 'Thẩm định bảng lương 3 cấp, ký số phê duyệt và sinh file mã hóa gửi Ngân hàng giải ngân.',
        inputs: ['Tờ trình chi lương tháng', 'Bảng lương tổng hợp'],
        outputs: ['Quyết định chi lương đã duyệt', 'File chi lương định dạng ngân hàng (Vietcombank/BIDV/Techcombank)'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-PAY-04',
        title: 'Phát hành Phiếu lương điện tử E-payslip',
        titleEn: 'E-payslip Distribution & Query Ticket',
        type: 'A',
        stageNumber: 2,
        actor: 'Hệ thống tự động & Nhân viên',
        actorEn: 'Automated System & Employee',
        scopeNote: 'Mã hóa và gửi phiếu lương bảo mật qua Mobile App/Email cá nhân, tiếp nhận thắc mắc trực tuyến.',
        inputs: ['Bảng lương đã chi trả thành công'],
        outputs: ['Phiếu lương điện tử (E-payslip) bảo mật OTP trên App', 'Kênh tiếp nhận giải đáp thắc mắc lương'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      }
    ],
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-950/80',
    textLight: 'text-amber-700',
    textDark: 'text-amber-300',
    icon: <CircleDollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    angleDeg: 90 // 6 o'clock (Bottom)
  },
  {
    id: 'tax',
    code: 'TAX',
    name: 'Thuế TNCN (TAX)',
    nameEn: 'Personal Income Tax (TAX)',
    sopCount: '3/3 SOPs',
    percentage: '100%',
    subFeatures: ['Đăng ký mã số thuế & người phụ thuộc', 'Tính giảm trừ & Kê khai thuế TNCN', 'Quyết toán thuế TNCN cuối năm'],
    subFeaturesEn: ['Tax ID & dependant registration', 'Deduction calculations & tax filings', 'Year-end PIT settlement'],
    stages: [
      {
        stageId: 'TAX_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Đăng ký Mã Số Thuế & Người Phụ Thuộc',
        stageTitleEn: 'Stage 1: Tax ID & Dependant Registration',
        description: 'Đăng ký MST cá nhân lần đầu cho nhân viên mới và khai báo người phụ thuộc giảm trừ gia cảnh.',
        descriptionEn: 'Register initial personal tax ID and declare dependants for family tax relief.',
        sopCodes: ['SOP-TAX-01']
      },
      {
        stageId: 'TAX_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Khấu trừ Hàng Tháng & Quyết toán Năm',
        stageTitleEn: 'Stage 2: Monthly Withholding & Year-End PIT Settlement',
        description: 'Tự động tính thuế lũy tiến từng tháng, nộp tờ khai thuế và lập hồ sơ quyết toán thuế cuối năm.',
        descriptionEn: 'Automated progressive tax withholding, monthly tax declarations and year-end PIT settlement.',
        sopCodes: ['SOP-TAX-02', 'SOP-TAX-03']
      }
    ],
    sopList: [
      {
        code: 'SOP-TAX-01',
        title: 'Kê khai Mã số thuế & Đăng ký Người phụ thuộc',
        titleEn: 'Tax ID & Dependant Registration',
        type: 'N',
        stageNumber: 1,
        actor: 'Nhân viên khai báo & HR C&B',
        actorEn: 'Employee & Tax Specialist',
        scopeNote: 'Khai báo hồ sơ giảm trừ gia cảnh, đối soát giấy khai sinh và nộp Cơ quan Thuế.',
        inputs: ['CCCD nhân viên', 'Giấy khai sinh con / Giấy tờ thân nhân phụ thuộc'],
        outputs: ['Mã số thuế cá nhân (MST)', 'Mã số người phụ thuộc được cơ quan thuế chấp thuận'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-TAX-02',
        title: 'Khấu trừ Thuế TNCN hàng tháng & Kê khai Thuế',
        titleEn: 'Monthly PIT Deductions & Filings',
        type: 'A',
        stageNumber: 2,
        actor: 'Hệ thống tự động & Kế toán thuế',
        actorEn: 'Automated Engine & Tax Accountant',
        scopeNote: 'Tự động áp biểu thuế lũy tiến từng phần (5% - 35%) theo thu nhập tính thuế hàng tháng.',
        inputs: ['Thu nhập chịu thuế từ Bảng lương PAY', 'Mức giảm trừ bản thân (11tr) & người phụ thuộc (4.4tr)'],
        outputs: ['Số thuế TNCN phải khấu trừ', 'Tờ khai thuế TNCN định kỳ Mẫu 05/KK-TNCN'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      },
      {
        code: 'SOP-TAX-03',
        title: 'Quyết toán Thuế TNCN cuối năm & Chứng từ khấu trừ',
        titleEn: 'Year-end PIT Settlement & Certificates',
        type: 'M',
        stageNumber: 2,
        actor: 'Kế toán thuế, HR & Cơ quan Thuế',
        actorEn: 'Tax Accountant, HR & Tax Authority',
        scopeNote: 'Tổng hợp thu nhập 12 tháng, tiếp nhận giấy ủy quyền quyết toán và xuất chứng từ khấu trừ thuế điện tử.',
        inputs: ['Bản cam kết ủy quyền quyết toán thuế', 'Tổng thu nhập chịu thuế cả năm'],
        outputs: ['Hồ sơ quyết toán thuế TNCN Mẫu 05/QTT-TNCN', 'Chứng từ khấu trừ thuế TNCN điện tử cấp cho nhân viên'],
        workflowId: 'LIFE-05',
        wireframeId: 'LIFE-05'
      }
    ],
    color: '#6366f1',
    gradient: 'from-indigo-600 to-blue-600',
    border: 'border-indigo-500',
    bgLight: 'bg-indigo-50',
    bgDark: 'bg-indigo-950/80',
    textLight: 'text-indigo-700',
    textDark: 'text-indigo-300',
    icon: <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    angleDeg: 210 // 10 o'clock (Top Left)
  },
  {
    id: 'ins',
    code: 'INS',
    name: 'Bảo hiểm Xã hội (INS)',
    nameEn: 'Social Insurance (INS)',
    sopCount: '8/8 SOPs',
    percentage: '100%',
    subFeatures: ['Thiết lập đối tượng & tỷ lệ đóng BHXH', 'Kê khai BHXH điện tử (Báo tăng/giảm)', 'Giải quyết chế độ ốm đau/thai sản/dưỡng sức'],
    subFeaturesEn: ['Insurance rate & policy setup', 'Electronic e-insurance declarations', 'Sick leave, maternity & recovery claims'],
    stages: [
      {
        stageId: 'INS_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Thiết lập Tỷ Lệ & Kê Khai Biến Động (Tăng / Giảm / Lương)',
        stageTitleEn: 'Stage 1: Rate Setup & Movement Declarations (Increase / Decrease)',
        description: 'Cấu hình mức đóng BHXH/BHYT/BHTN, lập hồ sơ báo tăng nhân viên mới, báo giảm thôi việc và điều chỉnh lương đóng.',
        descriptionEn: 'Configure rates, submit new hire increase, offboarding decrease and salary base adjustments.',
        sopCodes: ['SOP-INS-01', 'SOP-INS-02', 'SOP-INS-03', 'SOP-INS-04']
      },
      {
        stageId: 'INS_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Giải Quyết Chế Độ & Quyết Toán Sổ Bảo Hiểm',
        stageTitleEn: 'Stage 2: Benefit Claims & Social Insurance Book Settlement',
        description: 'Lập hồ sơ thanh toán chế độ ốm đau, thai sản, đối chiếu số liệu đóng với cơ quan BHXH và chốt sổ điện tử.',
        descriptionEn: 'Submit sick leave & maternity claims, monthly reconciliation with Social Insurance authority and e-book closure.',
        sopCodes: ['SOP-INS-05', 'SOP-INS-06', 'SOP-INS-07', 'SOP-INS-08']
      }
    ],
    sopList: [
      {
        code: 'SOP-INS-01',
        title: 'Thiết lập đối tượng & Tỷ lệ đóng BHXH/BHYT/BHTN',
        titleEn: 'Insurance Policy & Rate Setup',
        type: 'M',
        stageNumber: 1,
        actor: 'Chuyên viên Bảo hiểm & HR Manager',
        actorEn: 'Insurance Specialist & HR Manager',
        scopeNote: 'Cấu hình tỷ lệ trích nộp theo luật (DN: 21.5%, NLĐ: 10.5%) và trần đóng BHXH/BHYT.',
        inputs: ['Nghị định quy định mức lương cơ sở', 'Khung mức lương đóng tối đa'],
        outputs: ['Bảng tỷ lệ trích đóng BHXH tự động áp dụng'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-02',
        title: 'Kê khai Báo tăng lao động BHXH Mẫu D02-LT',
        titleEn: 'New Employee Insurance Declaration',
        type: 'N',
        stageNumber: 1,
        actor: 'Chuyên viên Bảo hiểm & Phần mềm BHXH Điện tử',
        actorEn: 'Insurance Specialist & E-Insurance Software',
        scopeNote: 'Kế thừa hồ sơ nhân viên mới trúng tuyển (SOP-EMP-02), lập hồ sơ báo tăng gửi Cơ quan BHXH.',
        inputs: ['Hồ sơ nhân viên mới từ Core EMP', 'Hợp đồng lao động chính thức ký kết (EMP04)', 'Mã số sổ BHXH cũ (nếu có)'],
        outputs: ['Hồ sơ Báo tăng Mẫu D02-LT', 'Mã số BHXH mới hoặc xác nhận chuyển nơi đóng'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-03',
        title: 'Kê khai Báo giảm lao động BHXH',
        titleEn: 'Employee Insurance Termination Filing',
        type: 'M',
        stageNumber: 1,
        actor: 'Chuyên viên Bảo hiểm & Cơ quan BHXH',
        actorEn: 'Insurance Specialist & Insurance Agency',
        scopeNote: 'Kế thừa quyết định thôi việc từ Core EMP (SOP-EMP-15), lập hồ sơ báo giảm kịp thời tránh phát sinh tiền nộp thừa.',
        inputs: ['Quyết định chấm dứt HĐLĐ', 'Thẻ BHYT điện tử'],
        outputs: ['Xác nhận Báo giảm của Cơ quan BHXH', 'Thủ tục chốt sổ BHXH'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-04',
        title: 'Điều chỉnh mức lương đóng BHXH',
        titleEn: 'Insurance Base Salary Adjustment',
        type: 'M',
        stageNumber: 1,
        actor: 'Chuyên viên Bảo hiểm',
        actorEn: 'Insurance Specialist',
        scopeNote: 'Điều chỉnh mức lương đóng bảo hiểm khi có quyết định tăng lương hoặc điều chỉnh phụ cấp.',
        inputs: ['Phụ lục HĐLĐ tăng lương', 'Danh sách nhân sự điều chỉnh'],
        outputs: ['Hồ sơ điều chỉnh mức đóng gửi Cơ quan BHXH'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-05',
        title: 'Giải quyết chế độ Ốm đau / Thai sản / Phục hồi',
        titleEn: 'Sick Leave & Maternity Benefit Claims',
        type: 'N',
        stageNumber: 2,
        actor: 'Nhân viên nộp hồ sơ & Chuyên viên Bảo hiểm',
        actorEn: 'Employee & Insurance Specialist',
        scopeNote: 'Tiếp nhận chứng từ y tế, lập hồ sơ hưởng chế độ ốm đau, thai sản Mẫu 01B-HSB gửi BHXH chi trả trợ cấp.',
        inputs: ['Giấy chứng sinh / Giấy ra viện', 'Thời gian nghỉ trên bảng công ATT09', 'Số tài khoản nhận tiền trợ cấp'],
        outputs: ['Quyết định duyệt chi tiền trợ cấp từ Cơ quan BHXH', 'Tiền trợ cấp chuyển trực tiếp vào tài khoản nhân viên'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-06',
        title: 'Đối chiếu phát sinh nộp BHXH với Cơ quan BHXH',
        titleEn: 'Monthly Insurance Reconciliation',
        type: 'A',
        stageNumber: 2,
        actor: 'Kế toán & Chuyên viên Bảo hiểm',
        actorEn: 'Accountant & Insurance Specialist',
        scopeNote: 'Đối chiếu Thông báo kết quả đóng BHXH Mẫu C12-TS từ Cơ quan BHXH với số liệu trích nộp nội bộ.',
        inputs: ['Thông báo Mẫu C12-TS của Cơ quan BHXH', 'Bảng trích nộp nội bộ từ Bảng lương PAY'],
        outputs: ['Biên bản đối chiếu khớp 100%', 'Lệnh ủy nhiệm chi chuyển tiền đóng BHXH'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-07',
        title: 'Cấp, chốt sổ BHXH & Thẻ BHYT điện tử',
        titleEn: 'E-Insurance Book Settlement & Cards',
        type: 'A',
        stageNumber: 2,
        actor: 'Chuyên viên Bảo hiểm & Cơ quan BHXH',
        actorEn: 'Insurance Specialist & Agency',
        scopeNote: 'Hoàn tất thủ tục chốt sổ in tờ rời xác nhận thời gian đóng bảo hiểm khi nhân viên nghỉ việc.',
        inputs: ['Hồ sơ báo giảm đã duyệt', 'Sổ BHXH'],
        outputs: ['Tờ rời chốt sổ BHXH bàn giao cho nhân viên', 'Xác nhận chấm dứt nghĩa vụ đóng'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      },
      {
        code: 'SOP-INS-08',
        title: 'Báo cáo quản trị chi phí Bảo hiểm Doanh nghiệp',
        titleEn: 'Corporate Insurance Cost Audit Report',
        type: 'A',
        stageNumber: 2,
        actor: 'HRD & Ban Giám Đốc',
        actorEn: 'HRD & Board of Management',
        scopeNote: 'Báo cáo phân tích tổng chi phí bảo hiểm doanh nghiệp phải nộp 12 tháng và dự toán năm sau.',
        inputs: ['Dữ liệu đóng bảo hiểm lũy kế cả năm'],
        outputs: ['Báo cáo phân tích chi phí bảo hiểm theo Cost Center'],
        workflowId: 'LIFE-04',
        wireframeId: 'LIFE-04'
      }
    ],
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600',
    border: 'border-purple-500',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-950/80',
    textLight: 'text-purple-700',
    textDark: 'text-purple-300',
    icon: <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    angleDeg: 150 // 8 o'clock (Bottom Left)
  }
]

// Backward compatibility export
export const FIVE_CORE_MODULES: ModuleEcosystemItem[] = SIX_CORE_MODULES
