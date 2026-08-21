export interface SubsystemNode {
  id: string
  code: string
  name: string
  nameEn: string
  shortDesc: string
  shortDescEn: string
  color: string
  gradient: string
  iconName: 'Target' | 'Users' | 'Clock' | 'CircleDollarSign' | 'ShieldCheck' | 'Receipt'
  masterCatalogsCount: number
  sopCount: number
}

export interface MatrixCellFlow {
  fromModuleId: string
  toModuleId: string
  flowTitle: string
  flowTitleEn: string
  flowType: 'mandatory' | 'automated' | 'event_trigger'
  sopRef: string
  dataItems: string[]
  dataItemsEn: string[]
  samplePayload: Record<string, string | number>
  businessRationale: string
  businessRationaleEn: string
}

export const MATRIX_SUBSYSTEMS: SubsystemNode[] = [
  {
    id: 'ats',
    code: 'ATS',
    name: 'Phân hệ Tuyển dụng (ATS)',
    nameEn: 'Recruitment & ATS',
    shortDesc: 'Săn tìm, lọc CV, phỏng vấn và phát hành Thư mời nhận việc (Offer).',
    shortDescEn: 'Sourcing, screening, interviews and offer generation.',
    color: '#8b5cf6',
    gradient: 'from-purple-600 to-indigo-600',
    iconName: 'Target',
    masterCatalogsCount: 3,
    sopCount: 5
  },
  {
    id: 'emp',
    code: 'Core EMP',
    name: 'Phân hệ Nhân sự (Core EMP)',
    nameEn: 'Personnel Core (EMP)',
    shortDesc: 'Hồ sơ nhân sự, Hợp đồng LĐ, Điều chuyển, Bổ nhiệm và Khởi tạo Master Data.',
    shortDescEn: 'Employee profiles, contracts, transfers, appointments and master data initialization.',
    color: '#2563eb',
    gradient: 'from-blue-600 to-indigo-600',
    iconName: 'Users',
    masterCatalogsCount: 11,
    sopCount: 15
  },
  {
    id: 'att',
    code: 'ATT',
    name: 'Chấm công & Nghỉ phép (ATT)',
    nameEn: 'Attendance & Leave (ATT)',
    shortDesc: 'Ca kíp, quẹt thẻ vân tay/GPS, duyệt nghỉ phép, tăng ca OT và khóa sổ bảng công.',
    shortDescEn: 'Shifts, biometric clock-in, leave requests, OT and timesheet compilation.',
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    iconName: 'Clock',
    masterCatalogsCount: 4,
    sopCount: 15
  },
  {
    id: 'pay',
    code: 'PAY',
    name: 'Tiền lương & Phụ cấp (PAY)',
    nameEn: 'Payroll & Compensation (PAY)',
    shortDesc: 'Thang bảng lương 3P, tính lương theo công, thuế, bảo hiểm, sinh file ngân hàng.',
    shortDescEn: '3P pay scale, timesheet salary computation, bank files and e-payslips.',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    iconName: 'CircleDollarSign',
    masterCatalogsCount: 5,
    sopCount: 4
  },
  {
    id: 'ins',
    code: 'INS',
    name: 'Bảo hiểm Xã hội (INS)',
    nameEn: 'Social Insurance (INS)',
    shortDesc: 'Kê khai BHXH/BHYT/BHTN, báo tăng/giảm, giải quyết ốm đau/thai sản C70a.',
    shortDescEn: 'Social/health insurance declarations, new hire increase, offboarding decrease and claims.',
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600',
    iconName: 'ShieldCheck',
    masterCatalogsCount: 3,
    sopCount: 8
  },
  {
    id: 'tax',
    code: 'TAX',
    name: 'Thuế TNCN (TAX)',
    nameEn: 'Personal Income Tax (TAX)',
    shortDesc: 'Đăng ký MST, người phụ thuộc giảm trừ gia cảnh, tính thuế lũy tiến và quyết toán năm.',
    shortDescEn: 'Tax ID registration, dependant relief, progressive tax brackets and annual settlement.',
    color: '#6366f1',
    gradient: 'from-indigo-600 to-blue-600',
    iconName: 'Receipt',
    masterCatalogsCount: 2,
    sopCount: 3
  }
]

export const CROSS_MODULE_FLOWS: MatrixCellFlow[] = [
  // 1. ATS ➔ EMP
  {
    fromModuleId: 'ats',
    toModuleId: 'emp',
    flowTitle: 'Chuyển giao Hồ sơ Trúng tuyển & Offer sang Onboarding',
    flowTitleEn: 'Accepted Offer & Candidate Ingestion to Onboarding',
    flowType: 'automated',
    sopRef: 'SOP-REC-05 ➔ SOP-EMP-02',
    dataItems: [
      'Thông tin ứng viên (Họ tên, Ngày sinh, CCCD, Email, SĐT)',
      'Bản scan CCCD / Bằng cấp chuyên môn',
      'Thư mời nhận việc đã ký số (Offer Letter)',
      'Vị trí, Chức danh & Mức lương thỏa thuận (P1)'
    ],
    dataItemsEn: [
      'Candidate master info (Full name, DoB, National ID, Email, Phone)',
      'Scanned National ID & Education degree attachments',
      'Digitally signed Offer Letter',
      'Job title, Department & Agreed base salary (P1)'
    ],
    samplePayload: {
      candidate_id: 'CAN-2026-089',
      full_name: 'Trần Minh Anh',
      job_title_code: 'SE-LV3',
      dept_id: 'DEPT-TECH-01',
      offered_salary: 28000000,
      start_date: '2026-09-01'
    },
    businessRationale: 'Là tiền đề sống còn để Nhân sự tiếp nhận nhân viên mới mà không phải gõ lại hồ sơ từ đầu, tránh sai lệch thông tin.',
    businessRationaleEn: 'Crucial intake premise allowing Core EMP to onboard new hires without manual re-typing, preventing human errors.'
  },

  // 2. EMP ➔ ATS
  {
    fromModuleId: 'emp',
    toModuleId: 'ats',
    flowTitle: 'Định biên Nhân sự & Yêu cầu Tuyển dụng Phòng ban',
    flowTitleEn: 'Department Headcount Quota & Job Requisitions',
    flowType: 'mandatory',
    sopRef: 'SOP-EMP-01 ➔ SOP-REC-01',
    dataItems: [
      'Hạn mức định biên nhân sự theo phòng ban (MD-05)',
      'Tiêu chuẩn chức danh công việc JD (MD-06)',
      'Bảng lương khung theo vị trí (MD-07)'
    ],
    dataItemsEn: [
      'Approved department headcount quotas (MD-05)',
      'Standard job description competency profiles (MD-06)',
      'Base salary grading brackets (MD-07)'
    ],
    samplePayload: {
      dept_id: 'DEPT-TECH-01',
      approved_headcount: 25,
      current_headcount: 22,
      open_vacancies: 3
    },
    businessRationale: 'Giúp Tuyển dụng kiểm soát không tuyển vượt định biên và tuân thủ đúng khung ngạch bậc lương.',
    businessRationaleEn: 'Ensures ATS does not hire beyond approved quotas and adheres strictly to pay grade standards.'
  },

  // 3. EMP ➔ ATT
  {
    fromModuleId: 'emp',
    toModuleId: 'att',
    flowTitle: 'Cấp Mã Nhân Viên, Phòng Ban & Đăng ký Vân tay',
    flowTitleEn: 'Employee ID, Department & Biometric Registration',
    flowType: 'automated',
    sopRef: 'SOP-EMP-02 ➔ SOP-ATT-01',
    dataItems: [
      'Mã nhân viên chính thức (Employee ID)',
      'Phòng ban, Chi nhánh & Địa điểm làm việc',
      'Trạng thái hợp đồng (Thử việc / Chính thức)'
    ],
    dataItemsEn: [
      'Official Employee ID',
      'Department, Branch & Workplace location',
      'Contract status (Probationary / Official)'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      branch_code: 'HCM-HQ',
      default_shift: 'CA-HC-0830',
      status: 'PROBATION'
    },
    businessRationale: 'Tự động tạo tài khoản chấm công trên máy vân tay và app GPS ngay khi nhân viên được Onboard.',
    businessRationaleEn: 'Auto-creates timekeeping accounts on biometric devices and GPS app upon onboarding.'
  },

  // 4. EMP ➔ PAY
  {
    fromModuleId: 'emp',
    toModuleId: 'pay',
    flowTitle: 'Hợp Đồng Lao Động, Bậc Lương P1 & 20 Loại Phụ Cấp',
    flowTitleEn: 'Labor Contract, P1 Salary Grade & 20 Allowance Categories',
    flowType: 'mandatory',
    sopRef: 'SOP-EMP-06 ➔ SOP-PAY-01',
    dataItems: [
      'Loại HĐLĐ (Thử việc, 12 tháng, Không xác định thời hạn)',
      'Mức lương căn bản P1 (Theo thang bảng lương MD-07)',
      'Danh sách Phụ cấp cố định (Ăn trưa, Điện thoại, Xăng xe)',
      'Tài khoản Ngân hàng nhận lương'
    ],
    dataItemsEn: [
      'Contract type (Probation, 12M, Indefinite)',
      'P1 base salary level (per MD-07 pay scale)',
      'Fixed monthly allowances (Meal, Phone, Transport)',
      'Employee bank account number for payroll'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      contract_no: 'HD-2026/08-HCM',
      base_salary: 28000000,
      meal_allowance: 730000,
      bank_code: 'VCB'
    },
    businessRationale: 'Là xương sống căn bản để Phân hệ Tiền lương tính ra mức lương đóng bảo hiểm và tổng thu nhập hợp đồng.',
    businessRationaleEn: 'Backbone master data enabling Payroll to compute insurance bases and total contractual remuneration.'
  },

  // 5. EMP ➔ INS
  {
    fromModuleId: 'emp',
    toModuleId: 'ins',
    flowTitle: 'Hồ Sơ Nhân Sự, Nơi Khám Chữa Bệnh & Báo Tăng Mới',
    flowTitleEn: 'Personnel Master Profile, Hospital KCB & New Hire Increase',
    flowType: 'mandatory',
    sopRef: 'SOP-EMP-04 ➔ SOP-INS-02',
    dataItems: [
      'Số định danh CCCD / Mã số BHXH cũ (nếu có)',
      'Bệnh viện KCB ban đầu đăng ký (Theo MD-INS-01)',
      'Mức lương giao kết đóng BHXH/BHYT/BHTN'
    ],
    dataItemsEn: [
      'National ID / Existing Social Insurance Book ID',
      'Registered primary medical clinic/hospital (MD-INS-01)',
      'Declared insurable salary base'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      social_ins_no: '7912345678',
      hospital_code: 'BV-79-012',
      insurable_salary: 28000000
    },
    businessRationale: 'Căn cứ lập hồ sơ điện tử Báo tăng BHXH (Mẫu D02-LT) nộp lên Cơ quan Bảo hiểm Xã hội Việt Nam.',
    businessRationaleEn: 'Prerequisite for compiling e-insurance Form D02-LT submitted to Vietnam Social Security.'
  },

  // 6. EMP ➔ TAX
  {
    fromModuleId: 'emp',
    toModuleId: 'tax',
    flowTitle: 'Người Phụ Thuộc, Quan Hệ Thân Nhân & Giảm Trừ Gia Cảnh',
    flowTitleEn: 'Dependants, Family Relations & Family Tax Deductions',
    flowType: 'mandatory',
    sopRef: 'SOP-EMP-04 ➔ SOP-TAX-01',
    dataItems: [
      'Mã số thuế cá nhân (MST) của nhân viên',
      'Hồ sơ người phụ thuộc (26 Loại quan hệ theo MD-02)',
      'Giấy khai sinh / Giấy tờ chứng minh nghĩa vụ nuôi dưỡng'
    ],
    dataItemsEn: [
      'Personal Tax ID (MST)',
      'Dependant profiles (26 family relation types per MD-02)',
      'Birth certificates / Proof of guardianship documents'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      tax_id: '8091234567',
      dependants_count: 2,
      total_deduction_amount: 8800000
    },
    businessRationale: 'Cung cấp số lượng người phụ thuộc để Phân hệ Thuế tự động giảm trừ 4.400.000đ/người/tháng.',
    businessRationaleEn: 'Supplies dependant count allowing Tax engine to deduct 4,400,000 VND/person/month automatically.'
  },

  // 7. ATT ➔ PAY
  {
    fromModuleId: 'att',
    toModuleId: 'pay',
    flowTitle: 'Bảng Tổng Hợp Công Khóa Sổ, Giờ Tăng Ca OT & Phép Năm',
    flowTitleEn: 'Locked Monthly Timesheet, Overtime (OT) Hours & Paid Leaves',
    flowType: 'mandatory',
    sopRef: 'SOP-ATT-13 ➔ SOP-PAY-02',
    dataItems: [
      'Số ngày công chuẩn & Ngày công làm việc thực tế',
      'Giờ làm thêm giờ OT (Ngày thường 150%, Cuối tuần 200%, Lễ 300%)',
      'Số ngày nghỉ phép hưởng nguyên lương / Nghỉ không lương',
      'Số lần đi trễ về sớm bị phạt vi phạm'
    ],
    dataItemsEn: [
      'Standard workdays & actual worked days',
      'OT hours breakdown (Weekday 150%, Weekend 200%, Holiday 300%)',
      'Paid annual leave days / Unpaid leave days',
      'Tardiness count & attendance penalty records'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      month: '2026-08',
      standard_days: 22,
      actual_days: 22,
      ot_weekday_hours: 8.5,
      ot_weekend_hours: 4.0
    },
    businessRationale: 'Là đầu vào quan trọng nhất để tính ra Lương thời gian (P2), Tiền làm thêm giờ và các khoản phạt chuyên cần.',
    businessRationaleEn: 'The most vital timesheet input for computing time-based salary (P2), OT compensation and attendance penalties.'
  },

  // 8. ATT ➔ INS
  {
    fromModuleId: 'att',
    toModuleId: 'ins',
    flowTitle: 'Chứng Từ Nghỉ Phép Hưởng BHXH (Ốm Đau / Thai Sản / Dưỡng Sức)',
    flowTitleEn: 'Social Insurance Leave Certificates (Sick / Maternity / Recovery)',
    flowType: 'event_trigger',
    sopRef: 'SOP-ATT-09 ➔ SOP-INS-05',
    dataItems: [
      'Giấy ra viện / Giấy chứng nhận nghỉ việc hưởng BHXH',
      'Số ngày nghỉ thực tế theo chỉ định của bác sĩ',
      'Ngày bắt đầu và ngày kết thúc nghỉ chế độ'
    ],
    dataItemsEn: [
      'Hospital discharge papers / Medical leave certificates',
      'Prescribed leave days by medical authority',
      'Commencement and resumption dates'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      claim_type: 'SICK_LEAVE',
      leave_days: 3,
      cert_no: 'BV79-GCN-2026-99'
    },
    businessRationale: 'Căn cứ để Phân hệ Bảo hiểm lập hồ sơ Mẫu C70a-HD thanh toán trợ cấp ốm đau thai sản từ quỹ BHXH.',
    businessRationaleEn: 'Basis for INS module to generate Form C70a-HD claiming sick/maternity benefits from national insurance fund.'
  },

  // 9. INS ➔ PAY
  {
    fromModuleId: 'ins',
    toModuleId: 'pay',
    flowTitle: 'Tỷ Lệ Trích Nộp & Số Tiền BHXH Khấu Trừ Trừ Lương',
    flowTitleEn: 'Insurance Contribution Rates & Net Salary Deductions',
    flowType: 'automated',
    sopRef: 'SOP-INS-01 ➔ SOP-PAY-02',
    dataItems: [
      'Tỷ lệ khấu trừ người lao động: BHXH (8%), BHYT (1.5%), BHTN (1%)',
      'Số tiền bảo hiểm trích trừ vào lương Net nhân viên',
      'Số tiền bảo hiểm doanh nghiệp gánh chịu (21.5%)'
    ],
    dataItemsEn: [
      'Employee contribution rates: Social (8%), Health (1.5%), Unemployment (1%)',
      'Total insurance deduction amount from Net pay',
      'Employer insurance contribution liability (21.5%)'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      ins_salary_base: 28000000,
      employee_deduction_10_5pct: 2940000,
      employer_liability_21_5pct: 6020000
    },
    businessRationale: 'Giúp Payroll tự động khấu trừ 10.5% vào lương nhân viên và hạch toán 21.5% chi phí của doanh nghiệp.',
    businessRationaleEn: 'Enables Payroll to withhold 10.5% employee share and book 21.5% company operating expense.'
  },

  // 10. PAY ➔ TAX
  {
    fromModuleId: 'pay',
    toModuleId: 'tax',
    flowTitle: 'Thu Nhập Chịu Thuế, Các Khoản Miễn Thuế & Tiền Thuế Khấu Trừ',
    flowTitleEn: 'Taxable Gross Earnings, Tax-Exempt Allowances & PIT Deductions',
    flowType: 'automated',
    sopRef: 'SOP-PAY-02 ➔ SOP-TAX-02',
    dataItems: [
      'Tổng thu nhập chịu thuế (Gross Earnings)',
      'Các khoản phụ cấp miễn thuế TNCN (Ăn trưa 730k, Xăng xe, Điện thoại)',
      'Thu nhập tính thuế sau khi trừ BHXH (10.5%) và Giảm trừ gia cảnh',
      'Số tiền thuế TNCN thực tế khấu trừ'
    ],
    dataItemsEn: [
      'Total gross taxable remuneration',
      'Tax-exempt allowances (Meal 730k, transport, telephone)',
      'Taxable income after insurance deductions and family relief',
      'Actual progressive PIT withholding amount'
    ],
    samplePayload: {
      employee_id: 'NV-2026-0142',
      gross_income: 32000000,
      exempt_allowances: 730000,
      taxable_income: 12470000,
      pit_withheld: 970500
    },
    businessRationale: 'Căn cứ để Phân hệ Thuế lập Tờ khai thuế TNCN định kỳ Mẫu 05/KK-TNCN nộp Cơ quan Thuế.',
    businessRationaleEn: 'Data stream for TAX module to generate monthly/quarterly PIT Declaration Form 05/KK-TNCN.'
  },

  // 11. PAY ➔ ATS
  {
    fromModuleId: 'pay',
    toModuleId: 'ats',
    flowTitle: 'Hạn Mức Ngân Sách Quỹ Lương & Báo Cáo Chi Phí Tuyển Dụng',
    flowTitleEn: 'Salary Budget Quota & Recruitment Cost Audit',
    flowType: 'automated',
    sopRef: 'SOP-PAY-01 ➔ SOP-REC-01',
    dataItems: [
      'Quỹ lương dự toán theo phòng ban',
      'Định mức chi phí tuyển dụng trên một nhân sự (Cost-per-Hire)',
      'Khung thưởng nóng tuyển dụng nhân tài (Sign-on Bonus)'
    ],
    dataItemsEn: [
      'Department payroll budget ceilings',
      'Standard Cost-per-Hire allowances',
      'Sign-on bonus & talent acquisition incentives'
    ],
    samplePayload: {
      dept_id: 'DEPT-TECH-01',
      annual_salary_budget: 8500000000,
      recruitment_budget_pool: 250000000
    },
    businessRationale: 'Giúp ban Tuyển dụng kiểm soát ngân sách quỹ lương và chi phí đăng tin/thưởng giới thiệu.',
    businessRationaleEn: 'Helps TA team control hiring budgets, headhunter fees and job board expenditures.'
  }
]
