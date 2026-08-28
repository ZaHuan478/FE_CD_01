import type { ClusterFlowConfig } from '../types'

export const CORE_FLOW_DATA: ClusterFlowConfig = {
  clusterId: 'core',
  title: 'Dòng dữ liệu xuyên suốt vòng đời nhân viên',
  titleEn: 'Employee Lifecycle Operational Data Flow',
  subtitle:
    'Luồng dữ liệu liên thông một chiều và đồng bộ đa phân hệ từ Tuyển dụng, Onboarding, Hồ sơ nhân sự, Chấm công, Nghỉ phép đến Tính lương, Bảo hiểm, Thuế và Cổng tự phục vụ.',
  subtitleEn:
    'End-to-end operational pipeline connecting recruitment, onboarding, employee profile, attendance, leave, payroll, insurance, tax, and self-service.',
  nodes: [
    {
      id: 'ats',
      code: 'REC',
      label: 'Tuyển dụng (ATS)',
      labelEn: 'Recruitment (ATS)',
      cluster: 'core',
      description: 'Tiếp nhận nhu cầu tuyển dụng, sàng lọc ứng viên, phỏng vấn và gửi thư mời nhận việc (Offer).',
      descriptionEn: 'Manages candidate requisitions, screening, interviewing, and offer acceptance.',
      iconName: 'UserPlus',
      workflowId: 'LIFE-01',
      firstSopCode: 'SOP-REC-01',
      nodeKind: 'business-module',
      colorToken: 'sky'
    },
    {
      id: 'onb',
      code: 'ONB',
      label: 'Onboarding & Hội nhập',
      labelEn: 'Onboarding & Induction',
      cluster: 'core',
      description: 'Quy trình tiếp đón nhân viên mới, thu thập hồ sơ đầu vào, cấp phát tài sản và định hướng văn hóa.',
      descriptionEn: 'New hire welcome, initial document collection, asset provisioning, and orientation.',
      iconName: 'Sparkles',
      workflowId: 'MODULE-ONB',
      firstSopCode: 'ONB-01',
      nodeKind: 'business-module',
      colorToken: 'teal'
    },
    {
      id: 'emp',
      code: 'EMP',
      label: 'Hồ sơ & Hợp đồng (HR)',
      labelEn: 'Employee & Contract (HR)',
      cluster: 'core',
      description: 'Lưu trữ thông tin nhân thân, hợp đồng lao động, quá trình bổ nhiệm, điều chuyển và giảm lao động.',
      descriptionEn: 'Core HR master records, labor contracts, job movements, and exit processing.',
      iconName: 'UserCheck',
      workflowId: 'LIFE-02',
      firstSopCode: 'SOP-EMP-03',
      nodeKind: 'business-module',
      colorToken: 'blue'
    },
    {
      id: 'att',
      code: 'ATT',
      label: 'Chấm công & Lịch ca',
      labelEn: 'Time & Attendance',
      cluster: 'core',
      description: 'Phân ca làm việc, thu thập dữ liệu quẹt thẻ, ghi nhận đi trễ về sớm và tổng hợp bảng công tháng.',
      descriptionEn: 'Shift scheduling, biometric time capture, tardiness tracking, and monthly timesheet closing.',
      iconName: 'Clock',
      workflowId: 'CF-01',
      firstSopCode: 'SOP-ATT-01',
      nodeKind: 'business-module',
      colorToken: 'indigo'
    },
    {
      id: 'lev',
      code: 'LEV',
      label: 'Nghỉ phép & Vắng mặt',
      labelEn: 'Leave & Absences',
      cluster: 'core',
      description: 'Quản lý quỹ phép năm, phê duyệt đơn xin nghỉ phép, nghỉ ốm, thai sản và đồng bộ công nghỉ.',
      descriptionEn: 'Leave entitlement ledger, advance notice validation, approval, and absence sync.',
      iconName: 'CalendarCheck',
      workflowId: 'CF-01',
      firstSopCode: 'SOP-ATT-06',
      nodeKind: 'business-module',
      colorToken: 'emerald'
    },
    {
      id: 'pay',
      code: 'PAY',
      label: 'Tiền lương (Payroll)',
      labelEn: 'Payroll Engine',
      cluster: 'core',
      description: 'Tính toán bảng lương tổng hợp từ dữ liệu công, phụ cấp, trích nộp BHXH và giảm trừ thuế.',
      descriptionEn: 'Automated payroll computation integrating working days, allowances, SI, and PIT deductions.',
      iconName: 'DollarSign',
      workflowId: 'MODULE-PAY',
      firstSopCode: 'PAY-01',
      nodeKind: 'business-module',
      colorToken: 'amber'
    },
    {
      id: 'ins',
      code: 'INS',
      label: 'Bảo hiểm Xã hội',
      labelEn: 'Social Insurance',
      cluster: 'core',
      description: 'Báo tăng/giảm lao động, trích nộp tỷ lệ 10.5% NLĐ và giải quyết chế độ ốm đau, thai sản.',
      descriptionEn: 'Monthly social insurance declarations, statutory contributions (10.5% employee / 21.5% employer).',
      iconName: 'Shield',
      workflowId: 'MODULE-INS',
      firstSopCode: 'INS-01',
      nodeKind: 'business-module',
      colorToken: 'rose'
    },
    {
      id: 'tax',
      code: 'TAX',
      label: 'Thuế Thu nhập Cá nhân',
      labelEn: 'Personal Income Tax',
      cluster: 'core',
      description: 'Mã số thuế, hồ sơ người phụ thuộc giảm trừ gia cảnh và quyết toán thuế TNCN cuối năm.',
      descriptionEn: 'Tax ID management, dependent relief registration, and annual tax settlement.',
      iconName: 'Receipt',
      workflowId: 'MODULE-TAX',
      firstSopCode: 'TAX-01',
      nodeKind: 'business-module',
      colorToken: 'purple'
    },
    {
      id: 'ess',
      code: 'ESS',
      label: 'Cổng ESS / MSS',
      labelEn: 'Employee Self-Service (ESS/MSS)',
      cluster: 'core',
      description: 'Cổng thông tin nhân viên xem phiếu lương, giải trình công, nộp đơn nghỉ phép và cập nhật hồ sơ.',
      descriptionEn: 'Self-service portal for payslip viewing, attendance explanation, leave request, and profile review.',
      iconName: 'Smartphone',
      workflowId: 'MODULE-ESS',
      firstSopCode: 'ESS-01',
      nodeKind: 'business-module',
      colorToken: 'cyan'
    }
  ],
  connections: [
    {
      id: 'core-c1',
      from: 'ats',
      to: 'onb',
      label: 'Hồ sơ trúng tuyển & Thư mời nhận việc',
      labelEn: 'Hired Dossier & Accepted Offer',
      description: 'Chuyển thông tin ứng viên trúng tuyển sang phân hệ Onboarding để kích hoạt kế hoạch tiếp đón.',
      descriptionEn: 'Transfers accepted candidate records to the Onboarding module to trigger induction workflow.',
      direction: 'one-way',
      trigger: 'Ứng viên xác nhận ký số thư mời nhận việc (Offer Letter)',
      triggerEn: 'Candidate signs digital offer letter',
      frequency: 'event-driven',
      dataItems: [
        'Họ tên, Ngày sinh, CCCD/Hộ chiếu',
        'CV gốc & Bằng cấp chuyên môn',
        'Chức danh tuyển dụng (MD-06)',
        'Mức lương đề xuất P1 (MD-07)',
        'Ngày bắt đầu nhận việc (Join Date)'
      ],
      dataItemsEn: [
        'Full Name, DOB, National ID/Passport',
        'Original CV & Diploma documents',
        'Hired Job Title (MD-06)',
        'Offered Base Salary P1 (MD-07)',
        'Onboarding Join Date'
      ],
      controls: [
        'Đã có chữ ký số xác nhận của ứng viên',
        'Vị trí tuyển dụng khớp với định biên còn trống',
        'Mức lương nằm trong dải lương được phê duyệt'
      ],
      controlsEn: [
        'Digital signature verified on offer letter',
        'Position matches available headcount quota',
        'Salary within approved pay band'
      ],
      exceptions: [
        'Ứng viên từ chối nhận việc: Hủy luồng tiếp nhận và cập nhật trạng thái kho ứng viên.',
        'Thiếu chứng chỉ bắt buộc: Yêu cầu bổ sung trong 30 ngày thử việc.'
      ],
      exceptionsEn: [
        'Candidate declines offer: Cancel onboarding flow and update talent pool status.',
        'Missing mandatory certification: Allow 30-day grace period during probation.'
      ],
      relatedWorkflowIds: ['LIFE-01', 'MODULE-ONB'],
      relatedSopCodes: ['SOP-REC-01', 'ONB-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c2',
      from: 'onb',
      to: 'emp',
      label: 'Hồ sơ nhân sự chính thức & HĐLĐ thử việc',
      labelEn: 'Official Employee Record & Probation Contract',
      description: 'Bàn giao hồ sơ hoàn thiện sau ngày đầu nhận việc để tạo Master Record nhân sự chính thức.',
      descriptionEn: 'Handoff verified documents to create employee master record and probation contract.',
      direction: 'one-way',
      trigger: 'Hoàn tất thủ tục Check-in ngày đầu nhận việc (Day 1)',
      triggerEn: 'First-day check-in procedure completed',
      frequency: 'event-driven',
      dataItems: [
        'Mã nhân viên định danh (EMP ID)',
        'Hồ sơ nhân thân đã xác thực CCCD',
        'Hợp đồng thử việc / HĐLĐ chính thức đã ký số',
        'Tài khoản ngân hàng nhận lương',
        'Danh sách tài sản/thiết bị đã cấp phát'
      ],
      dataItemsEn: [
        'Unique Employee ID (EMP ID)',
        'Verified personal identity record',
        'Signed probation/labor contract',
        'Bank account details for payroll',
        'Allocated IT assets & equipment list'
      ],
      controls: [
        'Mã nhân viên sinh tự động duy nhất',
        'Hồ sơ CCCD có ảnh đối soát hợp lệ',
        'HĐLĐ có xác nhận chữ ký 2 bên'
      ],
      controlsEn: [
        'Auto-generated unique Employee ID',
        'National ID photo verification',
        'Bi-party contract digital signatures'
      ],
      exceptions: [
        'Không nộp đủ hồ sơ gốc trong 7 ngày: Gửi thông báo nhắc nhở tự động qua email/SMS.'
      ],
      exceptionsEn: [
        'Incomplete documentation within 7 days: Send automated reminder notification.'
      ],
      relatedWorkflowIds: ['MODULE-ONB', 'LIFE-02'],
      relatedSopCodes: ['ONB-02', 'SOP-EMP-03'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c3',
      from: 'emp',
      to: 'att',
      label: 'Mã nhân viên & Lịch phân ca làm việc',
      labelEn: 'Employee ID & Work Shift Assignment',
      description: 'Đồng bộ danh sách nhân sự sang hệ thống chấm công để cấp quyền điểm danh và gán ca chuẩn.',
      descriptionEn: 'Syncs active employee list with attendance engine for biometric access and shift assignment.',
      direction: 'one-way',
      trigger: 'Kích hoạt hồ sơ nhân sự mới hoặc thay đổi phòng ban/ca',
      triggerEn: 'New employee profile activation or department/shift transfer',
      frequency: 'event-driven',
      dataItems: [
        'Mã NV & Họ tên đầy đủ',
        'Phòng ban & Vị trí công tác',
        'Mã ca làm việc chuẩn (MD-08)',
        'Dữ liệu đăng ký sinh trắc học (FaceID / Vân tay / GPS Geofence)'
      ],
      dataItemsEn: [
        'Employee ID & Full Name',
        'Department & Position Assignment',
        'Standard Shift Code (MD-08)',
        'Biometric enrollment profile (FaceID / Fingerprint / Geofence)'
      ],
      controls: [
        'Nhân viên ở trạng thái Hoạt động (Active)',
        'Ca làm việc hợp lệ trong danh mục Master Data'
      ],
      controlsEn: [
        'Employee profile in Active state',
        'Valid work shift configured in Master Data'
      ],
      exceptions: [
        'Chưa đăng ký sinh trắc học: Tạm thời cho phép chấm công GPS kèm ảnh xác minh.'
      ],
      exceptionsEn: [
        'Unenrolled biometrics: Allow GPS attendance with photo verification temporarily.'
      ],
      relatedWorkflowIds: ['LIFE-02', 'CF-01'],
      relatedSopCodes: ['SOP-EMP-03', 'SOP-ATT-01'],
      connectionKind: 'dependency'
    },
    {
      id: 'core-c4',
      from: 'emp',
      to: 'lev',
      label: 'Khởi tạo Quỹ phép năm & Chính sách nghỉ',
      labelEn: 'Annual Leave Ledger Initialization',
      description: 'Tính toán số ngày phép năm khả dụng theo thâm niên và cấp bậc quản lý.',
      descriptionEn: 'Calculates pro-rated annual leave quota based on seniority and job grade.',
      direction: 'one-way',
      trigger: 'Đầu năm tài chính hoặc khi nhân viên ký HĐLĐ chính thức',
      triggerEn: 'Fiscal year rollover or official contract signing',
      frequency: 'periodic',
      dataItems: [
        'Mã NV & Ngày bắt đầu tính thâm niên',
        'Số ngày phép năm tiêu chuẩn (12 - 16 ngày)',
        'Số ngày phép thâm niên cộng thêm',
        'Hạn sử dụng phép tồn năm trước'
      ],
      dataItemsEn: [
        'Employee ID & Seniority start date',
        'Standard annual leave quota (12 - 16 days)',
        'Seniority bonus leave days',
        'Carry-over leave expiration deadline'
      ],
      controls: [
        'Tính tỷ lệ phép theo tháng làm việc thực tế',
        'Phép tồn chuyển giao tuân thủ hạn chót 31/03'
      ],
      controlsEn: [
        'Pro-rate leave based on actual working months',
        'Carry-over leave complies with March 31 deadline'
      ],
      exceptions: [
        'Nghỉ việc trước hạn: Tự động quyết toán ngày phép thừa/thiếu vào bảng lương cuối cùng.'
      ],
      exceptionsEn: [
        'Early termination: Auto-reconcile leave balance in final payroll settlement.'
      ],
      relatedWorkflowIds: ['LIFE-02', 'CF-01'],
      relatedSopCodes: ['SOP-EMP-03', 'SOP-ATT-06'],
      connectionKind: 'dependency'
    },
    {
      id: 'core-c5',
      from: 'lev',
      to: 'att',
      label: 'Đồng bộ ngày nghỉ được duyệt vào bảng công',
      labelEn: 'Approved Leave Sync into Timesheet',
      description: 'Chuyển trạng thái nghỉ phép đã duyệt sang bảng chấm công để không bị ghi nhận vắng mặt.',
      descriptionEn: 'Syncs approved leave requests into timesheet records to prevent unauthorized absence flags.',
      direction: 'one-way',
      trigger: 'Đơn nghỉ phép chuyển sang trạng thái "Đã duyệt"',
      triggerEn: 'Leave request transitions to "Approved" status',
      frequency: 'realtime',
      dataItems: [
        'Mã NV & Ngày nghỉ cụ thể',
        'Ký hiệu công phép (AL: Phép năm, SL: Ốm đau, UP: Không lương)',
        'Số giờ / buổi nghỉ (0.5 ngày / 1 ngày)',
        'Mã đơn phê duyệt tương ứng'
      ],
      dataItemsEn: [
        'Employee ID & Specific leave dates',
        'Leave attendance symbol (AL: Annual, SL: Sick, UP: Unpaid)',
        'Duration (Half-day / Full-day)',
        'Approval Reference Ticket ID'
      ],
      controls: [
        'Đơn bắt buộc duyệt trước thời điểm bắt đầu nghỉ',
        'Không trùng lặp lịch nghỉ với ca làm việc khác'
      ],
      controlsEn: [
        'Must be approved prior to leave commencement',
        'No overlapping absence schedules'
      ],
      exceptions: [
        'Đơn chưa duyệt đến giờ vào ca: Tự động hủy đơn theo quy định POL-ATT-01.'
      ],
      exceptionsEn: [
        'Unapproved request at shift start: Auto-cancel pursuant to POL-ATT-01.'
      ],
      relatedWorkflowIds: ['CF-01'],
      relatedSopCodes: ['SOP-ATT-01', 'SOP-ATT-06'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c6',
      from: 'att',
      to: 'pay',
      label: 'Bảng công chốt kỳ & Giờ làm thêm OT',
      labelEn: 'Monthly Timesheet & Overtime Closing Data',
      description: 'Chuyển dữ liệu ngày công thực tế, giờ OT và trừ phạt chuyên cần sang phân hệ lương.',
      descriptionEn: 'Transfers finalized working days, OT hours, and attendance deduction points to payroll.',
      direction: 'one-way',
      trigger: 'Chốt bảng công tháng định kỳ (ngày 01–03 hàng tháng)',
      triggerEn: 'Monthly timesheet lock (1st - 3rd of each month)',
      frequency: 'monthly',
      dataItems: [
        'Số ngày công chuẩn & Công thực tế hưởng lương',
        'Giờ tăng ca OT 150% (Ngày thường)',
        'Giờ tăng ca OT 200% (Cuối tuần) & 300% (Lễ tết)',
        'Số lần đi trễ, về sớm & Phạt không phép',
        'Số ngày nghỉ hưởng lương BHXH (Ốm/Thai sản)'
      ],
      dataItemsEn: [
        'Standard working days & Actual paid days',
        'OT hours 150% (Regular weekdays)',
        'OT hours 200% (Weekends) & 300% (Holidays)',
        'Tardiness, early departure & unexcused absence count',
        'Social insurance covered sick/maternity days'
      ],
      controls: [
        'Khóa bảng công bắt buộc có chữ ký duyệt của Trưởng bộ phận và HR',
        'Giờ OT không vượt trần 40h/tháng và 200h/năm theo POL-ATT-02'
      ],
      controlsEn: [
        'Timesheet lock requires HOD and HR approvals',
        'OT hours adhere to 40h/mo and 200h/yr limits per POL-ATT-02'
      ],
      exceptions: [
        'Phát sinh khiếu nại công sau ngày chốt: Thực hiện truy lĩnh / truy thu vào kỳ lương tháng kế tiếp.'
      ],
      exceptionsEn: [
        'Post-closing timesheet dispute: Process retro adjustment in subsequent payroll cycle.'
      ],
      relatedWorkflowIds: ['CF-01', 'MODULE-PAY'],
      relatedSopCodes: ['SOP-ATT-01', 'SOP-ATT-02', 'PAY-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c7',
      from: 'emp',
      to: 'ins',
      label: 'Báo tăng/giảm lao động & Mức lương đóng BHXH',
      labelEn: 'Statutory Social Insurance Declaration Data',
      description: 'Cung cấp danh sách tiếp nhận mới hoặc chấm dứt HĐLĐ để nộp tờ khai cơ quan BHXH.',
      descriptionEn: 'Provides hire/termination lists to generate monthly electronic SI declaration (D02-LT).',
      direction: 'one-way',
      trigger: 'Ký HĐLĐ mới, điều chỉnh thu nhập đóng BH hoặc thôi việc',
      triggerEn: 'New contract, salary adjustment, or employee resignation',
      frequency: 'monthly',
      dataItems: [
        'Mã số BHXH & Mã định danh cá nhân',
        'Mức lương đóng BHXH bắt buộc',
        'Mã bệnh viện đăng ký KCB ban đầu',
        'Thời điểm tăng mới hoặc giảm hẳn lao động'
      ],
      dataItemsEn: [
        'SI Book Number & National Citizen ID',
        'Statutory Insurance Base Salary',
        'Primary healthcare facility code',
        'Effective date of inclusion or termination'
      ],
      controls: [
        'Mức lương đóng BH không thấp hơn lương tối thiểu vùng',
        'Không vượt trần 20 lần mức lương cơ sở'
      ],
      controlsEn: [
        'Salary base must not fall below regional minimum wage',
        'Does not exceed statutory cap of 20x base salary'
      ],
      exceptions: [
        'Báo giảm trễ hạn: Phải chịu lãi phạt theo quy định cơ quan BHXH.'
      ],
      exceptionsEn: [
        'Delayed termination filing: Incurs late declaration statutory penalties.'
      ],
      relatedWorkflowIds: ['LIFE-02', 'MODULE-INS'],
      relatedSopCodes: ['SOP-EMP-03', 'INS-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c8',
      from: 'ins',
      to: 'pay',
      label: 'Tỷ lệ trích nộp BHXH & Quyết toán chế độ ốm đau',
      labelEn: 'SI Deductions & Benefit Reimbursement Sync',
      description: 'Đồng bộ mức khấu trừ 10.5% vào lương và khoản tiền BHXH chi trả hộ cho NLĐ.',
      descriptionEn: 'Syncs statutory 10.5% employee contribution and social insurance benefit disbursements.',
      direction: 'two-way',
      trigger: 'Kỳ tính lương hàng tháng',
      triggerEn: 'Monthly payroll calculation cycle',
      frequency: 'monthly',
      dataItems: [
        'Khấu trừ NLĐ: 8% BHXH + 1.5% BHYT + 1% BHTN (Tổng 10.5%)',
        'Chi phí doanh nghiệp: 21.5%',
        'Tiền trợ cấp ốm đau / thai sản / dưỡng sức được duyệt (Mẫu C70a)'
      ],
      dataItemsEn: [
        'Employee withholding: 8% SI + 1.5% HI + 1% UI (Total 10.5%)',
        'Employer portion: 21.5%',
        'Approved sick/maternity/recovery allowances (C70a)'
      ],
      controls: [
        'Đối soát khớp đúng số tiền đóng giữa bảng lương và thông báo C12 của cơ quan BHXH'
      ],
      controlsEn: [
        'Strict reconciliation between payroll deductions and statutory C12 notice'
      ],
      exceptions: [
        'Hồ sơ thai sản bị cơ quan BHXH từ chối: Gửi thông báo yêu cầu bổ sung chứng từ bệnh viện.'
      ],
      exceptionsEn: [
        'Rejected maternity claim: Prompt employee to provide missing hospital records.'
      ],
      relatedWorkflowIds: ['MODULE-INS', 'MODULE-PAY'],
      relatedSopCodes: ['INS-01', 'PAY-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c9',
      from: 'emp',
      to: 'tax',
      label: 'Mã số thuế cá nhân & Hồ sơ người phụ thuộc',
      labelEn: 'Tax ID & Dependant Relief Records',
      description: 'Cung cấp hồ sơ đăng ký giảm trừ gia cảnh để xác định mức giảm trừ khi tính thuế TNCN.',
      descriptionEn: 'Transfers registered dependants and tax exemptions to compute correct progressive PIT.',
      direction: 'one-way',
      trigger: 'Nhân viên nộp hồ sơ người phụ thuộc mới',
      triggerEn: 'Employee submits new dependent relief dossier',
      frequency: 'event-driven',
      dataItems: [
        'Mã số thuế thu nhập cá nhân (MST)',
        'Danh sách người phụ thuộc hợp lệ',
        'Mức giảm trừ: 11 triệu (Bản thân) + 4.4 triệu/người phụ thuộc',
        'Ngày bắt đầu có hiệu lực giảm trừ'
      ],
      dataItemsEn: [
        'Personal Tax ID (MST)',
        'Approved dependent records',
        'Relief allowance: 11M (Self) + 4.4M/dependent',
        'Effective deduction start date'
      ],
      controls: [
        'Người phụ thuộc bắt buộc có giấy khai sinh hoặc CCCD và mã định danh duy nhất'
      ],
      controlsEn: [
        'Dependents must have verified birth certificates or unique citizen IDs'
      ],
      exceptions: [
        'Trùng lặp người phụ thuộc với người nộp thuế khác: Hệ thống cảnh báo từ chối áp dụng.'
      ],
      exceptionsEn: [
        'Duplicate dependent claimed elsewhere: System triggers validation rejection.'
      ],
      relatedWorkflowIds: ['LIFE-02', 'MODULE-TAX'],
      relatedSopCodes: ['SOP-EMP-03', 'TAX-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c10',
      from: 'pay',
      to: 'tax',
      label: 'Thu nhập chịu thuế & Số thuế TNCN khấu trừ',
      labelEn: 'Taxable Income & Withheld PIT Calculation',
      description: 'Chuyển tổng thu nhập chịu thuế và tính thuế lũy tiến từng phần theo luật thuế TNCN.',
      descriptionEn: 'Applies progressive tax brackets (5% - 35%) on net taxable income.',
      direction: 'one-way',
      trigger: 'Chốt bảng lương trước ngày thanh toán',
      triggerEn: 'Payroll lock prior to disbursement date',
      frequency: 'monthly',
      dataItems: [
        'Tổng thu nhập chịu thuế (Gross taxable income)',
        'Thu nhập miễn thuế (Ăn trưa, đồng phục trong hạn mức)',
        'Các khoản giảm trừ (Bản thân, người phụ thuộc, đóng BHXH)',
        'Số tiền thuế TNCN phải nộp (Biểu thuế 5% - 35%)'
      ],
      dataItemsEn: [
        'Gross taxable income',
        'Non-taxable allowances (Lunch, uniform within caps)',
        'Statutory relief deductions (Self, dependents, SI contributions)',
        'Net PIT liability (5% - 35% progressive brackets)'
      ],
      controls: [
        'Tự động áp dụng biểu thuế suất lũy tiến từng phần theo quy định của Tổng cục Thuế'
      ],
      controlsEn: [
        'Automated computation matching official General Department of Taxation formula'
      ],
      exceptions: [
        'Nhân viên chưa có MST: Tạm khấu trừ 10% hoặc 20% đối với thu nhập vãng lai.'
      ],
      exceptionsEn: [
        'Missing Tax ID: Apply flat 10% or 20% non-resident withholding rate.'
      ],
      relatedWorkflowIds: ['MODULE-PAY', 'MODULE-TAX'],
      relatedSopCodes: ['PAY-01', 'TAX-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'core-c11',
      from: 'pay',
      to: 'ess',
      label: 'Phát hành Phiếu lương điện tử (Payslip)',
      labelEn: 'Digital Payslip Publishing to Portal',
      description: 'Phát hành phiếu lương chi tiết bảo mật đến từng tài khoản nhân viên trên Mobile App và Portal.',
      descriptionEn: 'Publishes encrypted itemized payslips to employee self-service portal and mobile app.',
      direction: 'one-way',
      trigger: 'Ban Giám Đốc duyệt lệnh chi lương (ngày 05–10 hàng tháng)',
      triggerEn: 'Executive payroll payment authorization (5th - 10th of each month)',
      frequency: 'monthly',
      dataItems: [
        'Lương cơ bản P1 & Lương hiệu quả P2',
        'Tiền làm thêm giờ OT chi tiết',
        'Các khoản phụ cấp & Thưởng năng suất',
        'Khấu trừ BHXH 10.5% & Khấu trừ thuế TNCN',
        'Thực lĩnh chuyển khoản ngân hàng (Net Pay)'
      ],
      dataItemsEn: [
        'Base Salary P1 & Performance Pay P2',
        'Detailed Overtime earnings',
        'Allowances & Productivity bonuses',
        'SI 10.5% deduction & PIT tax withholding',
        'Final Bank Net Pay Transfer'
      ],
      controls: [
        'Bảo mật mã hóa 2 lớp (Mật khẩu cá nhân / OTP / Biometrics)',
        'Chỉ nhân viên chính chủ mới có quyền truy cập phiếu lương của mình'
      ],
      controlsEn: [
        'Two-factor encryption security (PIN / OTP / Biometric authentication)',
        'Strict role-based isolation restricting payslip access exclusively to owner'
      ],
      exceptions: [
        'Khiếu nại sai lệch số liệu: Mở ticket phản hồi trực tiếp trên ESS tới bộ phận C&B trong vòng 48h.'
      ],
      exceptionsEn: [
        'Payslip calculation discrepancy: Open dispute ticket via ESS to C&B within 48 hours.'
      ],
      relatedWorkflowIds: ['MODULE-PAY', 'MODULE-ESS'],
      relatedSopCodes: ['PAY-01', 'ESS-01'],
      connectionKind: 'data-transfer'
    }
  ]
}
