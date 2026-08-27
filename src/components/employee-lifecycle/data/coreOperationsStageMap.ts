export interface StageDefinition {
  stageId: string
  stageNumber: number
  stageTitle: string
  stageTitleEn: string
  description: string
  descriptionEn: string
  sopCodes: string[]
}

export type CoreOperationModuleId = 'ats' | 'emp' | 'onb' | 'att' | 'leave' | 'pay' | 'ins' | 'tax' | 'ess'

export interface ModuleMetadata {
  id: CoreOperationModuleId
  code: string
  name: string
  nameEn: string
  shortLabel: string
  shortDesc: string
  shortDescEn: string
  plainExplanation: string
  plainExplanationEn: string
  receivesFrom: string
  receivesFromEn: string
  sendsTo: string
  sendsToEn: string
  workflowIdDefault: string
  stages: StageDefinition[]
}

export const CORE_OPERATIONS_STAGE_MAP: Record<string, ModuleMetadata> = {
  ats: {
    id: 'ats',
    code: 'REC',
    name: 'Tuyển dụng',
    nameEn: 'Recruitment & ATS',
    shortLabel: 'Tuyển dụng',
    shortDesc: 'Từ khi phát sinh nhu cầu cần người đến khi ứng viên đồng ý nhận việc.',
    shortDescEn: 'From initial hiring requisition to candidate offer acceptance and pre-onboarding.',
    plainExplanation: 'Từ khi phát sinh nhu cầu cần người đến khi ứng viên đồng ý nhận việc.',
    plainExplanationEn: 'From initial headcount demand until candidate accepts the job offer.',
    receivesFrom: 'Kế hoạch định biên nhân sự, yêu cầu tuyển dụng từ các phòng ban và hồ sơ ứng viên từ các kênh tìm kiếm.',
    receivesFromEn: 'Headcount plans, hiring requisitions from departments, and candidate applications from sourcing channels.',
    sendsTo: 'Hồ sơ ứng viên trúng tuyển, thông tin offer và ngày nhận việc chuyển sang phân hệ Nhân sự để Onboarding.',
    sendsToEn: 'Hired candidate profile, agreed offer package, and start date transferred to Personnel Core for Onboarding.',
    workflowIdDefault: 'LIFE-01',
    stages: [
      {
        stageId: 'ATS_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Nhu cầu và phê duyệt',
        stageTitleEn: 'Stage 1: Requisition and Approval',
        description: 'Khởi tạo phiếu yêu cầu tuyển dụng, đối soát hạn mức định biên và phê duyệt kế hoạch tìm kiếm nhân tài.',
        descriptionEn: 'Initiate recruitment requisitions, verify headcount quotas, and approve talent sourcing campaigns.',
        sopCodes: ['SOP-REC-01', 'SOP-REC-02']
      },
      {
        stageId: 'ATS_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Thu hút và tiếp nhận hồ sơ',
        stageTitleEn: 'Stage 2: Sourcing and Application Intake',
        description: 'Đăng tin đa kênh, thu hút ứng viên và tiếp nhận hồ sơ ứng tuyển vào hệ thống quản lý tập trung.',
        descriptionEn: 'Publish job vacancies across channels, attract talent, and intake candidate applications into central ATS.',
        sopCodes: ['SOP-REC-03', 'SOP-REC-04']
      },
      {
        stageId: 'ATS_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Sàng lọc và đánh giá',
        stageTitleEn: 'Stage 3: Screening and Assessment',
        description: 'Sàng lọc CV theo tiêu chuẩn chức danh, kiểm tra hồ sơ và thực hiện bài kiểm tra năng lực/chuyên môn.',
        descriptionEn: 'Screen CVs against job specifications, verify background data, and conduct competency/technical assessments.',
        sopCodes: ['SOP-REC-05', 'SOP-REC-06']
      },
      {
        stageId: 'ATS_STG_4',
        stageNumber: 4,
        stageTitle: 'Chặng 4: Phỏng vấn và lựa chọn',
        stageTitleEn: 'Stage 4: Interview and Selection',
        description: 'Lập hội đồng phỏng vấn, đánh giá kết quả theo thang điểm chuẩn và thẩm định mức độ phù hợp văn hóa.',
        descriptionEn: 'Schedule interview panels, evaluate candidates on standardized scorecards, and assess cultural alignment.',
        sopCodes: ['SOP-REC-07', 'SOP-REC-08']
      },
      {
        stageId: 'ATS_STG_5',
        stageNumber: 5,
        stageTitle: 'Chặng 5: Thư mời và chuẩn bị tiếp nhận',
        stageTitleEn: 'Stage 5: Job Offer and Pre-onboarding',
        description: 'Soạn thảo thư mời nhận việc (Offer Letter), đàm phán đãi ngộ, thu thập xác nhận và kích hoạt checklist đón tiếp.',
        descriptionEn: 'Draft job offer letters, negotiate terms, gather candidate acceptance, and trigger pre-onboarding preparations.',
        sopCodes: ['SOP-REC-09', 'SOP-REC-10', 'SOP-REC-11']
      }
    ]
  },

  emp: {
    id: 'emp',
    code: 'EMP',
    name: 'Nhân sự',
    nameEn: 'Personnel Core (EMP)',
    shortLabel: 'Nhân sự',
    shortDesc: 'Từ khi tiếp nhận nhân viên, quản lý hồ sơ, hợp đồng, thay đổi công tác đến nghỉ việc.',
    shortDescEn: 'From new hire onboarding, profile records, labor contracts, job mobility to offboarding exit.',
    plainExplanation: 'Từ khi tiếp nhận nhân viên, quản lý hồ sơ, hợp đồng, thay đổi công tác đến nghỉ việc.',
    plainExplanationEn: 'From employee onboarding, profile management, contracts, job transfers, to resignation exit.',
    receivesFrom: 'Hồ sơ trúng tuyển từ Tuyển dụng, quyết định tổ chức, phê duyệt định biên và các đề xuất điều động nhân sự.',
    receivesFromEn: 'Hired candidate profiles from Recruitment, organizational decisions, headcount approvals, and transfer requests.',
    sendsTo: 'Thông tin nhân viên và phân ca sang Chấm công; Ngạch bậc lương sang Lương; Biến động lao động sang Bảo hiểm và Thuế.',
    sendsToEn: 'Employee profiles and shift assignments to Attendance; Pay grades to Payroll; Headcount movements to Insurance and Tax.',
    workflowIdDefault: 'LIFE-02',
    stages: [
      {
        stageId: 'EMP_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Định biên và tiếp nhận nhân viên',
        stageTitleEn: 'Stage 1: Headcount Plan and New Hire Onboarding',
        description: 'Hoạch định ngân sách định biên nhân sự, tiếp nhận nhân viên mới và kích hoạt nhiệm vụ hội nhập đầu ngày.',
        descriptionEn: 'Plan headcount budgets, onboard new employees, and trigger departmental orientation checklists.',
        sopCodes: ['SOP-EMP-01', 'SOP-EMP-02', 'SOP-EMP-03']
      },
      {
        stageId: 'EMP_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Hồ sơ và bố trí công tác',
        stageTitleEn: 'Stage 2: Employee Profile and Job Placement',
        description: 'Lưu trữ thông tin lý lịch nhân sự, phân công vị trí, bổ nhiệm, luân chuyển công tác và cử đi công tác.',
        descriptionEn: 'Maintain employee profile records, assign job positions, process appointments, mobility, and business travel.',
        sopCodes: ['SOP-EMP-04', 'SOP-EMP-11', 'SOP-EMP-14']
      },
      {
        stageId: 'EMP_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Hợp đồng lao động',
        stageTitleEn: 'Stage 3: Labor Contract and Evaluation',
        description: 'Thiết lập hợp đồng thử việc, đánh giá hết hạn thử việc, giao kết và tái ký hợp đồng lao động chính thức.',
        descriptionEn: 'Establish probation contracts, evaluate probation outcomes, execute and renew statutory employment contracts.',
        sopCodes: ['SOP-EMP-05', 'SOP-EMP-06', 'SOP-EMP-07']
      },
      {
        stageId: 'EMP_STG_4',
        stageNumber: 4,
        stageTitle: 'Chặng 4: Thu nhập và ghi nhận',
        stageTitleEn: 'Stage 4: Compensation and Recognition',
        description: 'Điều chỉnh thu nhập định kỳ/đột xuất, áp dụng mức lương tối thiểu vùng và quản lý khen thưởng thành tích.',
        descriptionEn: 'Process periodic and ad-hoc pay adjustments, apply regional minimum wages, and record employee awards.',
        sopCodes: ['SOP-EMP-08', 'SOP-EMP-09', 'SOP-EMP-10', 'SOP-EMP-13']
      },
      {
        stageId: 'EMP_STG_5',
        stageNumber: 5,
        stageTitle: 'Chặng 5: Quan hệ lao động và nghỉ việc',
        stageTitleEn: 'Stage 5: Labor Relations and Offboarding Exit',
        description: 'Xử lý kỷ luật lao động, giải quyết thủ tục thôi việc, bàn giao công việc và đóng hồ sơ nhân viên an toàn.',
        descriptionEn: 'Manage disciplinary actions, handle employee resignations, oversee asset handovers, and archive employee records.',
        sopCodes: ['SOP-EMP-12', 'SOP-EMP-15']
      }
    ]
  },

  onb: {
    id: 'onb',
    code: 'ONB',
    name: 'Onboarding',
    nameEn: 'Employee Onboarding',
    shortLabel: 'Onboarding',
    shortDesc: 'Chuẩn bị, tiếp nhận và giúp nhân viên mới sẵn sàng làm việc.',
    shortDescEn: 'Prepare, welcome, and enable new employees to become work-ready.',
    plainExplanation: 'Từ khi ứng viên xác nhận nhận việc đến khi hoàn tất hội nhập và được bàn giao sang quản lý thường xuyên.',
    plainExplanationEn: 'From offer acceptance until orientation is completed and the employee is handed over to regular workforce operations.',
    receivesFrom: 'Hồ sơ ứng viên trúng tuyển, offer đã chấp thuận, ngày nhận việc và thông tin vị trí từ Tuyển dụng và Nhân sự.',
    receivesFromEn: 'Hired candidate profile, accepted offer, start date, and position data from Recruitment and Personnel Core.',
    sendsTo: 'Hồ sơ nhân viên đã kích hoạt, checklist hội nhập, tài khoản và tài sản bàn giao sang Nhân sự, Chấm công và ESS/MSS.',
    sendsToEn: 'Activated employee profile, onboarding checklist, accounts, and assigned assets handed off to Personnel, Attendance, and ESS/MSS.',
    workflowIdDefault: 'MODULE-ONB',
    stages: [
      {
        stageId: 'ONB_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Chuẩn bị tiếp nhận',
        stageTitleEn: 'Stage 1: Pre-boarding Preparation',
        description: 'Khởi tạo hồ sơ, thu thập giấy tờ, điều phối liên phòng ban và chuẩn bị quyền truy cập trước ngày đi làm.',
        descriptionEn: 'Create the pre-boarding record, collect documents, coordinate teams, and prepare access before the start date.',
        sopCodes: ['SOP-ONB-01', 'SOP-ONB-02', 'SOP-ONB-03', 'SOP-ONB-04']
      },
      {
        stageId: 'ONB_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Ngày đầu nhận việc',
        stageTitleEn: 'Stage 2: First Day',
        description: 'Xác nhận nhân viên đến nhận việc, hoàn tất thủ tục và kích hoạt hồ sơ nhân viên chính thức.',
        descriptionEn: 'Confirm the employee arrival, complete first-day procedures, and activate the official employee record.',
        sopCodes: ['SOP-ONB-05']
      },
      {
        stageId: 'ONB_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Hội nhập và bàn giao',
        stageTitleEn: 'Stage 3: Orientation and Handoff',
        description: 'Theo dõi đào tạo hội nhập, thu thập phản hồi, đóng checklist và bàn giao sang vận hành nhân sự.',
        descriptionEn: 'Track orientation, collect feedback, close the checklist, and hand off to regular workforce operations.',
        sopCodes: ['SOP-ONB-06', 'SOP-ONB-07']
      }
    ]
  },

  att: {
    id: 'att',
    code: 'ATT',
    name: 'Chấm công',
    nameEn: 'Time and Attendance (ATT)',
    shortLabel: 'Chấm công',
    shortDesc: 'Ghi nhận lịch làm việc, ca, tăng ca, công bất thường và chốt bảng công.',
    shortDescEn: 'Track schedules, shifts, overtime, clock exceptions, and monthly timesheet reconciliation.',
    plainExplanation: 'Ghi nhận thời gian làm việc thực tế, quản lý ca và tăng ca, xử lý công bất thường trước khi chốt kỳ.',
    plainExplanationEn: 'Track actual working time, shifts and overtime, then resolve attendance exceptions before period close.',
    receivesFrom: 'Đối tượng chấm công, vị trí làm việc và lịch công tác từ phân hệ Nhân sự; Dữ liệu quẹt thẻ từ máy chấm công/GPS.',
    receivesFromEn: 'Attendance profiles, work locations, and travel schedules from Personnel Core; Clock-in punch logs from biometrics/GPS.',
    sendsTo: 'Bảng tổng hợp công và số giờ làm thêm chuyển sang Lương; dữ liệu vắng mặt được đối soát với phân hệ Nghỉ phép.',
    sendsToEn: 'Compiled timesheets and approved overtime sent to Payroll; absence data reconciled with Leave Management.',
    workflowIdDefault: 'MODULE-ATT',
    stages: [
      {
        stageId: 'ATT_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Lịch làm việc và ca',
        stageTitleEn: 'Stage 1: Work Schedules and Shifts',
        description: 'Thiết lập ca làm việc, phân lịch đi ca linh hoạt theo tuần/tháng qua Portal hoặc file biểu mẫu chuẩn.',
        descriptionEn: 'Configure work shifts and assign monthly/weekly shift rosters via Manager Portal or standard templates.',
        sopCodes: ['SOP-ATT-01', 'SOP-ATT-02']
      },
      {
        stageId: 'ATT_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Tăng ca và đi trễ về sớm',
        stageTitleEn: 'Stage 2: Overtime and Clock Exceptions',
        description: 'Đăng ký và phê duyệt làm thêm giờ (OT), giải trình lý do đi trễ về sớm và xác nhận công tác ngoài hiện trường.',
        descriptionEn: 'Request and approve overtime (OT), submit tardiness explanations, and verify remote work attendances.',
        sopCodes: ['SOP-ATT-03', 'SOP-ATT-04', 'SOP-ATT-05']
      },
      {
        stageId: 'ATT_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Đối soát và xử lý công bất thường',
        stageTitleEn: 'Stage 3: Timesheet Reconciliation and Anomalies',
        description: 'Đối chiếu dữ liệu quẹt thẻ thực tế với lịch ca, xử lý quên quẹt thẻ, bổ sung công và chốt bảng công tháng.',
        descriptionEn: 'Reconcile punch logs against assigned shifts, resolve missing punches, and finalize monthly timesheets.',
        sopCodes: ['SOP-ATT-08', 'SOP-ATT-09']
      },
      {
        stageId: 'ATT_STG_4',
        stageNumber: 4,
        stageTitle: 'Chặng 4: Suất ăn theo ca',
        stageTitleEn: 'Stage 4: Shift Meal Registration',
        description: 'Quản lý đăng ký suất ăn theo lịch ca và dữ liệu làm việc thực tế.',
        descriptionEn: 'Manage employee meal registration based on assigned shifts and actual attendance.',
        sopCodes: ['SOP-ATT-10']
      }
    ]
  },

  leave: {
    id: 'leave',
    code: 'LEV',
    name: 'Nghỉ phép',
    nameEn: 'Leave Management',
    shortLabel: 'Nghỉ phép',
    shortDesc: 'Quản lý đăng ký, phê duyệt, số dư và quyết toán các loại nghỉ.',
    shortDescEn: 'Manage leave requests, approvals, balances, and leave finalization.',
    plainExplanation: 'Tách riêng đơn nghỉ, số dư phép, quyết toán phép và chế độ đặc thù để người mới không nhầm với dữ liệu quẹt thẻ chấm công.',
    plainExplanationEn: 'Separates leave requests, balances, finalization, and special regimes from raw time-clock attendance data.',
    receivesFrom: 'Hồ sơ nhân viên, lịch làm việc, chính sách nghỉ và số dư phép; chứng từ nghỉ chế độ do nhân viên cung cấp.',
    receivesFromEn: 'Employee profiles, work schedules, leave policies, leave balances, and supporting statutory documents.',
    sendsTo: 'Ngày nghỉ đã duyệt sang Chấm công; nghỉ không lương sang Lương; nghỉ chế độ sang Bảo hiểm; số dư phép sang ESS/MSS.',
    sendsToEn: 'Approved leave to Attendance, unpaid leave to Payroll, statutory leave to Insurance, and balances to ESS/MSS.',
    workflowIdDefault: 'MODULE-ATT',
    stages: [
      {
        stageId: 'LEV_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Đăng ký và phê duyệt nghỉ',
        stageTitleEn: 'Stage 1: Leave Request and Approval',
        description: 'Tiếp nhận đơn nghỉ hoặc công tác qua Portal hay từ HR, kiểm tra điều kiện và chuyển luồng phê duyệt.',
        descriptionEn: 'Receive leave or business trip requests through the Portal or HR, validate conditions, and route approvals.',
        sopCodes: ['SOP-ATT-06', 'SOP-ATT-07']
      },
      {
        stageId: 'LEV_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Quản lý và quyết toán quỹ phép',
        stageTitleEn: 'Stage 2: Leave Balance and Finalization',
        description: 'Điều chỉnh đối tượng hưởng phép, xử lý phép tồn khi nghỉ việc và quyết toán số dư cuối năm.',
        descriptionEn: 'Adjust leave eligibility, settle balances for terminating employees, and finalize year-end leave balances.',
        sopCodes: ['SOP-ATT-11', 'SOP-ATT-12', 'SOP-ATT-13']
      },
      {
        stageId: 'LEV_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Thai sản và chế độ con nhỏ',
        stageTitleEn: 'Stage 3: Maternity and Childcare Regimes',
        description: 'Ghi nhận nghỉ thai sản, chế độ con nhỏ và lịch làm việc đặc thù qua Portal hoặc do HR cập nhật.',
        descriptionEn: 'Record maternity, childcare, and special working regimes through the Portal or HR administration.',
        sopCodes: ['SOP-ATT-14', 'SOP-ATT-15']
      }
    ]
  },

  pay: {
    id: 'pay',
    code: 'PAY',
    name: 'Lương',
    nameEn: 'Payroll & Compensation (PAY)',
    shortLabel: 'Lương',
    shortDesc: 'Nhận dữ liệu công và chính sách thu nhập để tạo kết quả lương.',
    shortDescEn: 'Receive timesheets and compensation policies to compute accurate net salaries and disbursements.',
    plainExplanation: 'Nhận dữ liệu công và chính sách thu nhập để tạo kết quả lương.',
    plainExplanationEn: 'Receives approved timesheets and compensation policies to produce accurate salary results.',
    receivesFrom: 'Bảng công đã chốt từ Chấm công; Mức lương hợp đồng và phụ cấp từ Nhân sự; Mức trích đóng từ Bảo hiểm.',
    receivesFromEn: 'Finalized timesheets from Attendance; Contract wages and allowances from Personnel Core; Contribution rates from Insurance.',
    sendsTo: 'Thu nhập chịu thuế sang Thuế; Khoản trích nộp sang Bảo hiểm; File chi trả tiền lương sang Ngân hàng.',
    sendsToEn: 'Taxable earnings to Personal Tax; Statutory deductions to Insurance; Bank disbursement batch file to Bank Gateways.',
    workflowIdDefault: 'MODULE-PAY',
    stages: [
      {
        stageId: 'PAY_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Lương ứng',
        stageTitleEn: 'Stage 1: Salary Advances',
        description: 'Xử lý yêu cầu tạm ứng lương giữa kỳ theo chính sách công ty và khấu trừ vào kỳ lương chính thức.',
        descriptionEn: 'Process mid-month salary advance requests according to policy and record deduction for main payroll run.',
        sopCodes: ['SOP-PAY-01']
      },
      {
        stageId: 'PAY_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Lương tháng',
        stageTitleEn: 'Stage 2: Monthly Regular Payroll',
        description: 'Tổng hợp công, tính thu nhập 3P, tính các khoản trích đóng BHXH/thuế, phê duyệt và phát hành phiếu lương điện tử.',
        descriptionEn: 'Aggregate timesheet hours, calculate 3P earnings, compute statutory deductions, approve and issue e-payslips.',
        sopCodes: ['SOP-PAY-03']
      },
      {
        stageId: 'PAY_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Lương nghỉ việc',
        stageTitleEn: 'Stage 3: Final Settlement Payroll',
        description: 'Tính toán lương ngày công cuối, thanh toán ngày phép tồn, trợ cấp thôi việc và các khoản bồi hoàn khi thôi việc.',
        descriptionEn: 'Compute final working days wage, compensate unused leave, process severance allowance, and settle handovers.',
        sopCodes: ['SOP-PAY-02']
      },
      {
        stageId: 'PAY_STG_4',
        stageNumber: 4,
        stageTitle: 'Chặng 4: Thưởng',
        stageTitleEn: 'Stage 4: Bonuses and Incentives',
        description: 'Tính toán thưởng hiệu suất KPI, thưởng tháng 13, thưởng lễ tết và chi trả các khoản đãi ngộ đặc biệt.',
        descriptionEn: 'Calculate performance bonuses, 13th-month salary, holiday incentives, and disburse special rewards.',
        sopCodes: ['SOP-PAY-04']
      }
    ]
  },

  ins: {
    id: 'ins',
    code: 'INS',
    name: 'Bảo hiểm',
    nameEn: 'Social Insurance (INS)',
    shortLabel: 'Bảo hiểm',
    shortDesc: 'Quản lý tham gia, mức đóng và giải quyết chế độ BHXH.',
    shortDescEn: 'Manage statutory declarations, contribution bases, and insurance claim settlements.',
    plainExplanation: 'Quản lý tham gia, mức đóng và giải quyết chế độ BHXH.',
    plainExplanationEn: 'Manage statutory participation, contribution bases, and social insurance benefit claims.',
    receivesFrom: 'Hồ sơ nhân viên và loại HĐLĐ từ Nhân sự; Mức lương đóng BHXH từ Lương; Đơn nghỉ ốm/thai sản từ Chấm công.',
    receivesFromEn: 'Employee profiles and contract types from Personnel Core; Insurance salary base from Payroll; Sick/maternity leave from Attendance.',
    sendsTo: 'Tỷ lệ và số tiền trích đóng sang Lương; Dữ liệu kê khai điện tử sang Cơ quan BHXH Việt Nam; Tiền trợ cấp chế độ về người lao động.',
    sendsToEn: 'Deduction amounts to Payroll; Electronic declaration packages to Social Security Authority; Benefit payouts to employees.',
    workflowIdDefault: 'MODULE-INS',
    stages: [
      {
        stageId: 'INS_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Hồ sơ bảo hiểm',
        stageTitleEn: 'Stage 1: Insurance Registration Records',
        description: 'Đăng ký cấp mã số BHXH, khai báo thông tin bệnh viện KCB ban đầu và đồng bộ dữ liệu VssID cho nhân viên mới.',
        descriptionEn: 'Register social insurance numbers, declare initial healthcare clinics, and synchronize VssID accounts.',
        sopCodes: ['SOP-INS-01']
      },
      {
        stageId: 'INS_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Tăng, giảm và điều chỉnh đóng',
        stageTitleEn: 'Stage 2: Headcount and Contribution Adjustments',
        description: 'Lập hồ sơ báo tăng lao động mới, báo giảm khi nghỉ việc, tạm hoãn đóng và điều chỉnh mức lương đóng BHXH.',
        descriptionEn: 'Submit insurance new hire increases, offboarding decreases, suspension of contributions, and salary base changes.',
        sopCodes: ['SOP-INS-02', 'SOP-INS-03', 'SOP-INS-04', 'SOP-INS-05']
      },
      {
        stageId: 'INS_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Giải quyết chế độ',
        stageTitleEn: 'Stage 3: Benefits and Claims Settlement',
        description: 'Lập mẫu C70a giải quyết trợ cấp ốm đau, thai sản, dưỡng sức phục hồi sức khỏe và đối soát tiền chi trả từ cơ quan BHXH.',
        descriptionEn: 'Compile statutory C70a claim dossiers for sickness, maternity, convalescence benefits, and reconcile claim payouts.',
        sopCodes: ['SOP-INS-06', 'SOP-INS-07', 'SOP-INS-08']
      }
    ]
  },

  tax: {
    id: 'tax',
    code: 'TAX',
    name: 'Thuế',
    nameEn: 'Personal Income Tax (TAX)',
    shortLabel: 'Thuế',
    shortDesc: 'Quản lý hồ sơ thuế, khấu trừ, kê khai và quyết toán thuế TNCN.',
    shortDescEn: 'Manage tax ID registration, deductions, monthly declarations, and annual personal tax finalization.',
    plainExplanation: 'Quản lý hồ sơ thuế, khấu trừ, kê khai và quyết toán thuế TNCN.',
    plainExplanationEn: 'Manage tax profiles, dependents, progressive withholdings, and annual PIT finalization.',
    receivesFrom: 'Thông tin cá nhân và CCCD từ Nhân sự; Thu nhập chịu thuế và các khoản khấu trừ từ phân hệ Lương.',
    receivesFromEn: 'Personal identity and citizen ID data from Personnel Core; Taxable earnings and deductions from Payroll.',
    sendsTo: 'Số tiền thuế TNCN đã khấu trừ sang Lương; Hồ sơ kê khai điện tử và chứng từ khấu trừ thuế nộp Cơ quan Thuế.',
    sendsToEn: 'Withholding tax deductions to Payroll; Electronic tax declaration returns and tax certificates to Tax Department.',
    workflowIdDefault: 'MODULE-TAX',
    stages: [
      {
        stageId: 'TAX_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Hồ sơ thuế',
        stageTitleEn: 'Stage 1: Tax Registration and Dependents',
        description: 'Đăng ký cấp Mã số thuế cá nhân (MST) và khai báo người phụ thuộc để tính giảm trừ gia cảnh theo quy định.',
        descriptionEn: 'Register personal tax identification numbers (PIT) and declare qualified dependents for family deductions.',
        sopCodes: ['SOP-TAX-01']
      },
      {
        stageId: 'TAX_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Khấu trừ, kê khai và tạm nộp',
        stageTitleEn: 'Stage 2: Withholding and Periodic Declarations',
        description: 'Khấu trừ thuế TNCN theo biểu lũy tiến hoặc tỷ lệ cố định, lập tờ khai thuế tháng/quý và xuất chứng từ khấu trừ thuế.',
        descriptionEn: 'Withhold PIT according to progressive tax tables, compile monthly/quarterly tax returns, and issue withholding slips.',
        sopCodes: ['SOP-TAX-02']
      },
      {
        stageId: 'TAX_STG_3',
        stageNumber: 3,
        stageTitle: 'Chặng 3: Quyết toán thuế',
        stageTitleEn: 'Stage 3: Annual Tax Finalization',
        description: 'Tiếp nhận ủy quyền quyết toán thuế năm của người lao động, tổng hợp thu nhập cả năm và lập hồ sơ quyết toán thuế TNCN.',
        descriptionEn: 'Receive employee tax finalization authorizations, consolidate annual earnings, and generate statutory annual PIT returns.',
        sopCodes: ['SOP-TAX-03']
      }
    ]
  },

  ess: {
    id: 'ess',
    code: 'ESS',
    name: 'ESS/MSS',
    nameEn: 'Employee and Manager Self Service',
    shortLabel: 'ESS/MSS',
    shortDesc: 'Cổng tự phục vụ cho nhân viên và quản lý, kết nối các giao dịch HRMS.',
    shortDescEn: 'Self-service workspace connecting employees and managers to HRMS transactions.',
    plainExplanation: 'Nhân viên tự tra cứu, cập nhật và gửi yêu cầu; quản lý theo dõi đội ngũ, phê duyệt và khởi tạo giao dịch theo thẩm quyền.',
    plainExplanationEn: 'Employees review data and submit requests, while managers monitor teams, approve requests, and initiate authorized transactions.',
    receivesFrom: 'Hồ sơ, công, phép, lương, tài liệu, workflow và quan hệ quản lý từ các phân hệ HRMS.',
    receivesFromEn: 'Profiles, attendance, leave, payroll, documents, workflows, and reporting lines from HRMS modules.',
    sendsTo: 'Yêu cầu hợp lệ về đúng phân hệ nguồn; quyết định phê duyệt và phản hồi được lưu vào Workflow và Audit log.',
    sendsToEn: 'Valid requests routed to source modules; approval decisions and feedback recorded in Workflow and Audit logs.',
    workflowIdDefault: 'MODULE-ESS',
    stages: [
      {
        stageId: 'ESS_STG_1',
        stageNumber: 1,
        stageTitle: 'Chặng 1: Nhân viên tự phục vụ',
        stageTitleEn: 'Stage 1: Employee Self Service',
        description: 'Nhân viên cập nhật hồ sơ, tra cứu tài liệu, gửi yêu cầu HR và đối chiếu công, phép, lương.',
        descriptionEn: 'Employees update profiles, access documents, submit HR requests, and review attendance, leave, and payroll.',
        sopCodes: ['SOP-ESS-01', 'SOP-ESS-02', 'SOP-ESS-03', 'SOP-ESS-04']
      },
      {
        stageId: 'ESS_STG_2',
        stageNumber: 2,
        stageTitle: 'Chặng 2: Quản lý tự phục vụ',
        stageTitleEn: 'Stage 2: Manager Self Service',
        description: 'Quản lý theo dõi đội ngũ, phê duyệt yêu cầu, giám sát ngoại lệ và khởi tạo giao dịch nhân sự.',
        descriptionEn: 'Managers monitor teams, approve requests, supervise exceptions, and initiate workforce transactions.',
        sopCodes: ['SOP-MSS-01', 'SOP-MSS-02', 'SOP-MSS-03', 'SOP-MSS-04']
      }
    ]
  }
}

export const WORKFLOW_ID_BY_SOP_CODE: Record<string, string> = {
  // Recruitment
  'SOP-REC-01': 'LIFE-01',
  'SOP-REC-02': 'LIFE-01',
  'SOP-REC-03': 'LIFE-01',
  'SOP-REC-04': 'LIFE-01',
  'SOP-REC-05': 'LIFE-01',
  'SOP-REC-06': 'LIFE-01',
  'SOP-REC-07': 'LIFE-01',
  'SOP-REC-08': 'LIFE-01',
  'SOP-REC-09': 'LIFE-01',
  'SOP-REC-10': 'LIFE-01',
  'SOP-REC-11': 'LIFE-01',

  // Employee
  'SOP-EMP-01': 'LIFE-00',
  'SOP-EMP-02': 'LIFE-01',
  'SOP-EMP-03': 'LIFE-01',
  'SOP-EMP-04': 'LIFE-02',
  'SOP-EMP-05': 'LIFE-04',
  'SOP-EMP-06': 'LIFE-04',
  'SOP-EMP-07': 'LIFE-04',
  'SOP-EMP-08': 'LIFE-05',
  'SOP-EMP-09': 'LIFE-05',
  'SOP-EMP-10': 'LIFE-05',
  'SOP-EMP-11': 'LIFE-03',
  'SOP-EMP-12': 'LIFE-05',
  'SOP-EMP-13': 'LIFE-05',
  'SOP-EMP-14': 'LIFE-03',
  'SOP-EMP-15': 'LIFE-07',

  // Onboarding
  'SOP-ONB-01': 'MODULE-ONB',
  'SOP-ONB-02': 'MODULE-ONB',
  'SOP-ONB-03': 'MODULE-ONB',
  'SOP-ONB-04': 'MODULE-ONB',
  'SOP-ONB-05': 'MODULE-ONB',
  'SOP-ONB-06': 'MODULE-ONB',
  'SOP-ONB-07': 'MODULE-ONB',

  // Attendance
  'SOP-ATT-01': 'MODULE-ATT',
  'SOP-ATT-02': 'MODULE-ATT',
  'SOP-ATT-03': 'MODULE-ATT',
  'SOP-ATT-04': 'MODULE-ATT',
  'SOP-ATT-05': 'MODULE-ATT',
  'SOP-ATT-06': 'MODULE-ATT',
  'SOP-ATT-07': 'MODULE-ATT',
  'SOP-ATT-08': 'MODULE-ATT',
  'SOP-ATT-09': 'MODULE-ATT',
  'SOP-ATT-10': 'MODULE-ATT',
  'SOP-ATT-11': 'MODULE-ATT',
  'SOP-ATT-12': 'MODULE-ATT',
  'SOP-ATT-13': 'MODULE-ATT',
  'SOP-ATT-14': 'MODULE-ATT',
  'SOP-ATT-15': 'MODULE-ATT',

  // Payroll
  'SOP-PAY-01': 'MODULE-PAY',
  'SOP-PAY-02': 'MODULE-PAY',
  'SOP-PAY-03': 'MODULE-PAY',
  'SOP-PAY-04': 'MODULE-PAY',

  // Insurance
  'SOP-INS-01': 'MODULE-INS',
  'SOP-INS-02': 'MODULE-INS',
  'SOP-INS-03': 'MODULE-INS',
  'SOP-INS-04': 'MODULE-INS',
  'SOP-INS-05': 'MODULE-INS',
  'SOP-INS-06': 'MODULE-INS',
  'SOP-INS-07': 'MODULE-INS',
  'SOP-INS-08': 'MODULE-INS',

  // Tax
  'SOP-TAX-01': 'MODULE-TAX',
  'SOP-TAX-02': 'MODULE-TAX',
  'SOP-TAX-03': 'MODULE-TAX',

  // ESS/MSS
  'SOP-ESS-01': 'MODULE-ESS',
  'SOP-ESS-02': 'MODULE-ESS',
  'SOP-ESS-03': 'MODULE-ESS',
  'SOP-ESS-04': 'MODULE-ESS',
  'SOP-MSS-01': 'MODULE-ESS',
  'SOP-MSS-02': 'MODULE-ESS',
  'SOP-MSS-03': 'MODULE-ESS',
  'SOP-MSS-04': 'MODULE-ESS'
}

export const KNOWN_WIREFRAME_IDS = new Set<string>([
  'LIFE-00',
  'LIFE-01',
  'LIFE-02',
  'LIFE-03',
  'LIFE-04',
  'LIFE-05',
  'LIFE-06',
  'LIFE-07'
])
