export type SourceStatus = 'official' | 'designed' | 'draft' | 'not_available' | 'placeholder'
export type ProcessStatus = 'official' | 'designed' | 'draft' | 'not_available'

export type ActorsMatrix = {
  proposer: string // Người đề xuất
  approver: string // Người phê duyệt
  executor: string // Người thực thi
}

export type IntegrationModule = {
  module: 'ATT' | 'INS' | 'PAY' | 'TAX' | 'IT' | 'BANK' | 'ORG' | 'PERF' | 'TRN' | 'RECRUIT' | 'OFFBOARD' | 'PROFILE' | 'ALM' | 'BI' | 'DOC'
  moduleName: string
  color: string // Tailwind color key e.g. 'emerald', 'blue', 'purple', 'amber', 'rose'
  description: string
}

export type SOPFullNode = {
  id: string
  type: 'lifecycle' | 'cross' | 'master' | 'support'
  code: string
  title: string
  subtitle: string
  contextTrigger: string // Card 1: Bối cảnh & Điều kiện kích hoạt
  actorsMatrix: ActorsMatrix // Card 2: Tác nhân thực hiện Matrix
  inputs: string[] // Card 3: Dữ liệu Đầu vào Checklist
  outputs: string[] // Card 4: Kết quả Đầu ra
  integrations: IntegrationModule[] // Card 4: Liên thông phân hệ
  sopBadge: string
  sopIds: string[]
  sopTitles?: string[]
  process: {
    status: ProcessStatus
    steps: string[]
    source: string
  }
  uiFields: string[]
}

export const lifecycleMockNodes: Record<string, any> = {
  'LIFE-00': {
    id: 'LIFE-00',
    type: 'lifecycle',
    code: 'EMP01.01',
    title: 'Thiết lập định biên nhân sự',
    subtitle: 'Hoạch định, tham vấn, điều chỉnh, phê duyệt và cập nhật định biên phòng ban',
    contextTrigger: 'Trưởng bộ phận xây dựng kế hoạch định biên vào đầu năm theo chiến lược công ty và ngân sách phê duyệt.',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận (TBP - Xây dựng định biên)',
      approver: 'HRBP (Tham vấn) & BOD (Phê duyệt định biên)',
      executor: 'Chuyên viên C&B (Cập nhật kết quả duyệt)'
    },
    inputs: [
      'Năm xây dựng & Phòng ban áp dụng',
      'Chức vụ & Cấp bậc (Level job grade)',
      'Tháng định biên (kế hoạch chi tiết 12 tháng)',
      'Thu nhập & Chi phí nhân sự dự kiến (People Cost)'
    ],
    outputs: [
      'Tổng thu nhập (People Cost) trên tổng định biên đã duyệt',
      'Bản định biên nhân sự chính thức của doanh nghiệp',
      'Dữ liệu hạn mức tuyển dụng cập nhật vào Master Data'
    ],
    integrations: [
      { module: 'RECRUIT', moduleName: 'Tuyển dụng (ATS)', color: 'blue', description: 'Trần hạn mức yêu cầu tuyển dụng mới' },
      { module: 'PAY', moduleName: 'Lương thưởng (PAY)', color: 'emerald', description: 'Kiểm soát quỹ lương và chi phí nhân sự kế hoạch' }
    ],
    sopBadge: 'SOP-EMP-01',
    sopIds: ['SOP-EMP-01'],
    sopTitles: ['Quy trình Thiết lập định biên nhân sự (EMP01.01 - EMP01.05)'],
    process: {
      status: 'official',
      steps: [
        'EMP01.01: Thiết lập định biên nhân sự (TBP)',
        'EMP01.02: Tham vấn định biên nhân sự (HRBP)',
        'EMP01.03: Điều chỉnh định biên nhân sự (TBP)',
        'EMP01.04: Phê duyệt định biên nhân sự (BOD)',
        'EMP01.05: Cập nhật kết quả phê duyệt vào hệ thống (C&B)'
      ],
      source: '1.ERP.HRM.SOP.docx'
    },
    uiFields: ['Năm', 'Phòng ban', 'Chức vụ', 'Cấp độ', 'Số lượng 12 tháng', 'Chi phí dự kiến']
  },
  // =========================================================================
  // A. TẦNG 2: LUỒNG NGHIỆP VỤ CHÍNH — VÒNG ĐỜI NHÂN VIÊN (LIFECYCLE)
  // =========================================================================
  'LIFE-01': {
    id: 'LIFE-01',
    type: 'lifecycle',
    code: 'EMP02.01',
    title: 'Tiếp nhận nhân viên mới',
    subtitle: 'Khởi tạo hành trình & Chuẩn bị tiếp nhận nhân sự mới',
    contextTrigger: 'Ứng viên trúng tuyển xác nhận nhận Thư mời nhận việc (Offer Letter), chuẩn bị đến làm việc chính thức tại doanh nghiệp.',
    actorsMatrix: {
      proposer: 'HRM-Tuyển dụng (Tạo hồ sơ chờ & kích hoạt luồng)',
      approver: 'Trưởng bộ phận (Duyệt kế hoạch tiếp nhận & giao việc)',
      executor: 'IT / Hành chính (Cấp phát tài khoản, máy tính & bàn làm việc)'
    },
    inputs: [
      'File CV & Thông tin ứng viên (Họ tên, CCCD/Hộ chiếu, Ngày sinh, Địa chỉ, Email, Số điện thoại)',
      'Vị trí công tác dự kiến: Chức danh, Chức vụ, Phòng ban, Cấp bậc (Level), Ngày vào làm chính thức',
      'Check-list chuẩn bị Onboarding: Cấp phát máy tính/email (IT), Thẻ nhân viên/bàn làm việc/đồng phục (Hành chính)'
    ],
    outputs: [
      'Mã nhân viên (Employee ID) duy nhất tự động sinh bởi hệ thống',
      'Hồ sơ nhân viên chuyển từ trạng thái "Chờ nhận việc" sang "Đang thử việc"',
      'Tự động kích hoạt luồng Đào tạo hội nhập (EMP02.08) và Giao mục tiêu KPI thử việc (EMP02.06)'
    ],
    integrations: [
      {
        module: 'IT',
        moduleName: 'Hành chính IT',
        color: 'blue',
        description: 'Tự động gửi Ticket cấp email công ty, tài khoản domain, bàn làm việc & trang thiết bị.'
      },
      {
        module: 'TRN',
        moduleName: 'Đào tạo',
        color: 'purple',
        description: 'Kích hoạt khóa Đào tạo hội nhập bắt buộc cho nhân viên mới (SOP EMP02.08).'
      },
      {
        module: 'PERF',
        moduleName: 'Đánh giá KPI',
        color: 'amber',
        description: 'Khởi tạo bản gán mục tiêu & tiêu chí đánh giá thử việc (SOP EMP02.06).'
      }
    ],
    sopBadge: 'SOP EMP02.01 ➔ EMP02.05',
    sopIds: ['SOP EMP02.01', 'SOP EMP02.05', 'SOP-TD-04'],
    sopTitles: ['Quy trình Tiếp nhận nhân viên mới & Khởi tạo tài khoản'],
    process: {
      status: 'official',
      steps: [
        'Xác nhận Offer Letter & Thông tin tiếp nhận từ Tuyển dụng',
        'Tạo hồ sơ nhân viên dạng Nháp & Cấp mã nhân viên tự động',
        'Gửi thông báo chuẩn bị trang thiết bị sang IT & Hành chính',
        'Khởi tạo luồng Đào tạo hội nhập & Mục tiêu thử việc trên Portal'
      ],
      source: 'Quy trình Tiếp nhận nhân viên mới (SOP EMP02.01 -> EMP02.05)'
    },
    uiFields: ['Mã nhân viên', 'Họ tên', 'Vị trí chuyên môn', 'Phòng ban', 'Ngày vào làm chính thức', 'Email công ty dự kiến']
  },

  'LIFE-02': {
    id: 'LIFE-02',
    type: 'lifecycle',
    code: 'EMP04',
    title: 'Tạo & Hoàn thiện hồ sơ nhân viên',
    subtitle: 'Số hóa & Lưu trữ thông tin pháp lý nhân sự',
    contextTrigger: 'Ngày đầu tiên nhận việc, nhân viên cập nhật & bổ túc đầy đủ hồ sơ giấy tờ pháp lý theo quy định của Luật lao động.',
    actorsMatrix: {
      proposer: 'Nhân viên mới (Cập nhật thông tin qua Portal Self-Service)',
      approver: 'HRM-Admin / C&B (Kiểm tra đối soát & Phê duyệt hồ sơ)',
      executor: 'HRM-Admin (Số hóa, lưu trữ & chốt hồ sơ chính thức)'
    },
    inputs: [
      'Thông tin hộ khẩu, thường trú, tạm trú (theo cây địa lý Tỉnh - Huyện - Xã)',
      'Hồ sơ gia đình: Người liên hệ khẩn cấp, Danh sách người phụ thuộc (kèm Giấy khai sinh/CCCD)',
      'Hồ sơ năng lực: Bằng cấp học vấn, Chứng chỉ ngoại ngữ/tin học, Kinh nghiệm làm việc trước đây',
      'Thông tin tài chính: Số tài khoản ngân hàng nhận lương, Mã số thuế PIT cá nhân'
    ],
    outputs: [
      'Hồ sơ nhân viên được số hóa 100% kèm file đính kèm chứng thực',
      'Tự động đồng bộ sang Phân hệ Thuế (TAX01) để đăng ký mã số thuế & người phụ thuộc giảm trừ gia cảnh'
    ],
    integrations: [
      {
        module: 'TAX',
        moduleName: 'Thuế PIT',
        color: 'emerald',
        description: 'Tự động đồng bộ đăng ký Mã số thuế cá nhân & Người phụ thuộc giảm trừ gia cảnh (TAX01).'
      },
      {
        module: 'BANK',
        moduleName: 'Ngân hàng',
        color: 'indigo',
        description: 'Cập nhật thông tin Tài khoản ngân hàng chi trả lương vào Master Data.'
      },
      {
        module: 'DOC',
        moduleName: 'Lưu trữ số',
        color: 'slate',
        description: 'Số hóa và mã hóa lưu trữ bộ hồ sơ scan pháp lý.'
      }
    ],
    sopBadge: 'SOP EMP04',
    sopIds: ['SOP EMP04', 'SOP-NS-04'],
    sopTitles: ['Quy trình Quản lý hồ sơ nhân viên & Số hóa dữ liệu nhân sự'],
    process: {
      status: 'official',
      steps: [
        'Nhân viên truy cập Employee Portal để khai báo lý lịch',
        'HR-Admin đối soát chứng từ scan với hồ sơ bản cứng',
        'Xác nhận tính hợp lệ & Duyệt hồ sơ nhân viên',
        'Đồng bộ dữ liệu tài chính & thuế sang phân hệ liên quan'
      ],
      source: 'Quy trình Quản lý thông tin nhân viên (SOP EMP04)'
    },
    uiFields: ['Số CCCD/Hộ chiếu', 'Địa chỉ thường trú', 'Số tài khoản ngân hàng', 'Mã số thuế', 'Người liên hệ khẩn cấp', 'Bằng cấp cao nhất']
  },

  'LIFE-03': {
    id: 'LIFE-03',
    type: 'lifecycle',
    code: 'EMP02.01 & MD-G04',
    title: 'Bố trí công tác & Vị trí làm việc',
    subtitle: 'Định vị nhân sự trong Cơ cấu tổ chức (Org Chart)',
    contextTrigger: 'Nhân viên hoàn thành tạo hồ sơ, cần gán chính thức vào một vị trí công tác cụ thể trên sơ đồ tổ chức của doanh nghiệp.',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận (Đề xuất vị trí & định biên chức danh)',
      approver: 'Giám đốc Khối / HRD (Phê duyệt quyết định bố trí công tác)',
      executor: 'HRM-Admin (Cập nhật vị trí trên sơ đồ Org Chart)'
    },
    inputs: [
      'Đơn vị/Phòng ban trực thuộc, Chức danh chuyên môn, Chức vụ quản lý',
      'Vùng làm việc (Vùng I - IV), Địa điểm làm việc cố định (Cost Center)',
      'Lộ trình phê duyệt (Reporting Line) và Chức vụ duyệt cấp trên'
    ],
    outputs: [
      'Bản ghi Vị trí công tác hiện tại có hiệu lực trên sơ đồ Org Chart',
      'Tự động gán: Nhóm phụ cấp chức vụ, Định mức trang thiết bị, và Tiêu chuẩn đánh giá năng lực',
      'Liên thông sang Chấm công (ATT01) để gán Đối tượng công và Ca làm việc mặc định'
    ],
    integrations: [
      {
        module: 'ATT',
        moduleName: 'Chấm công',
        color: 'sky',
        description: 'Liên thông gán Đối tượng chấm công & Ca làm việc mặc định (ATT01).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Kích hoạt Nhóm phụ cấp chức vụ & Trạm chi phí (Cost Center) tính lương.'
      },
      {
        module: 'ORG',
        moduleName: 'Cơ cấu tổ chức',
        color: 'purple',
        description: 'Cập nhật vị trí hiển thị trực tiếp trên sơ đồ Org Chart và Reporting Line.'
      }
    ],
    sopBadge: 'SOP EMP02.01 & MD-G04',
    sopIds: ['SOP EMP02.01', 'MD-G04', 'SOP-ĐG-04'],
    sopTitles: ['Quy trình Bố trí công tác & Định vị chức danh tổ chức'],
    process: {
      status: 'official',
      steps: [
        'Chọn vị trí công tác khả dụng trong định biên phòng ban',
        'Gán chức danh chuyên môn, cấp bậc & cấp quản lý trực tiếp',
        'Thiết lập Cost Center & Vùng lương áp dụng',
        'Kích hoạt vị trí công tác & Phân quyền trên hệ thống'
      ],
      source: 'Quy trình Bố trí công tác & Quản lý định biên (SOP EMP02.01 & MD-G04)'
    },
    uiFields: ['Đơn vị công tác', 'Chức danh', 'Chức vụ quản lý', 'Quản lý trực tiếp', 'Trạm chi phí (Cost Center)', 'Vùng làm việc']
  },

  'LIFE-04': {
    id: 'LIFE-04',
    type: 'lifecycle',
    code: 'EMP02.13, EMP06',
    title: 'Thiết lập Hợp đồng lao động (Labor Contract)',
    subtitle: 'Xác lập quan hệ lao động & Pháp lý hợp đồng',
    contextTrigger: 'Ký Hợp đồng thử việc khi nhận việc hoặc Ký HĐLĐ chính thức sau khi đánh giá thử việc Đạt.',
    actorsMatrix: {
      proposer: 'HRM-C&B (Dự thảo Hợp đồng lao động & Phụ lục)',
      approver: 'Ban Giám Đốc / Đại diện pháp luật (Ký duyệt / Ký số vẹn toàn)',
      executor: 'Nhân viên (Ký xác nhận) & HRM-C&B (Lưu trữ HĐ)'
    },
    inputs: [
      'Loại hợp đồng (Thử việc, Xác định thời hạn 12-36 tháng, Không xác định thời hạn)',
      'Thời hạn hợp đồng, Ngày bắt đầu, Ngày kết thúc hiệu lực',
      'Mức lương cơ bản theo ngạch/bậc, Các khoản phụ cấp cố định trên hợp đồng',
      'Mẫu file hợp đồng chuẩn (Word template theo quy định pháp luật)'
    ],
    outputs: [
      'Hợp đồng lao động chính thức được sinh mã số tự động, có hiệu lực pháp lý (bản in/ký số)',
      'Thiết lập lịch tự động cảnh báo trước 30/45 ngày khi hợp đồng đến hạn kết thúc',
      'Liên thông sang Bảo hiểm (INS02) để tự động đưa vào danh sách Báo tăng BHXH/BHYT/BHTN'
    ],
    integrations: [
      {
        module: 'INS',
        moduleName: 'Bảo hiểm',
        color: 'rose',
        description: 'Tự động đưa vào danh sách Báo tăng BHXH / BHYT / BHTN (INS02).'
      },
      {
        module: 'ALM',
        moduleName: 'Cảnh báo',
        color: 'amber',
        description: 'Thiết lập lịch tự động cảnh báo trước 30/45 ngày khi HĐ đến hạn kết thúc (SOP EMP05).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Xác lập Mức lương đóng BHXH và Mức lương căn bản theo HĐLĐ.'
      }
    ],
    sopBadge: 'SOP EMP02.13, EMP06',
    sopIds: ['SOP EMP02.13', 'SOP EMP06', 'SOP-NS-06'],
    sopTitles: ['Quy trình Giao kết Hợp đồng lao động & Quản lý hợp đồng số'],
    process: {
      status: 'official',
      steps: [
        'Khởi tạo hồ sơ hợp đồng theo Mẫu quy chuẩn pháp luật',
        'Trình ký số tới Đại diện pháp luật doanh nghiệp',
        'Gửi hợp đồng cho nhân viên ký số / ký văn bản',
        'Lưu trữ hồ sơ hợp đồng & Kích hoạt lịch cảnh báo đáo hạn'
      ],
      source: 'Quy trình Thiết lập & Giao kết HĐLĐ (SOP EMP02.13, EMP06)'
    },
    uiFields: ['Mã số hợp đồng', 'Loại hợp đồng', 'Ngày bắt đầu', 'Ngày kết thúc', 'Mức lương chính', 'Phương thức ký (Chữ ký số/In paper)']
  },

  'LIFE-05': {
    id: 'LIFE-05',
    type: 'lifecycle',
    code: 'PAY01, INS01',
    title: 'Cấu hình Lương & Chế độ phúc lợi',
    subtitle: 'Thiết lập tham số thu nhập & đóng nộp bảo hiểm',
    contextTrigger: 'Xác lập chính sách đãi ngộ gắn liền với Hợp đồng lao động và Chức vụ của nhân viên.',
    actorsMatrix: {
      proposer: 'HRM-C&B Specialist (Cấu hình thông số thu nhập & đóng nộp)',
      approver: 'Giám đốc Nhân sự (HRD) / Kế toán trưởng (Duyệt cấu hình)',
      executor: 'Hệ thống tính lương tự động (Payroll Engine Execution)'
    },
    inputs: [
      'Đối tượng lương (Lương thời gian / Lương khoán), Ngạch lương, Bậc lương (P1)',
      'Bộ các khoản phụ cấp cá nhân và phụ cấp chức vụ (Xăng xe, Điện thoại, Trách nhiệm)',
      'Đối tượng bảo hiểm và Tỷ lệ trích nộp (BHXH 8%, BHYT 1.5%, BHTN 1%)',
      'Đối tượng tính thuế TNCN (Lũy tiến từng phần hoặc Khấu trừ 10%)'
    ],
    outputs: [
      'Bảng thông số đãi ngộ hoàn chỉnh sẵn sàng cho chu kỳ chạy bảng lương (PAY03)',
      'Hồ sơ bảo hiểm cá nhân (INS01) ghi nhận mức lương trích nộp và số sổ BHXH/thẻ BHYT'
    ],
    integrations: [
      {
        module: 'PAY',
        moduleName: 'Bảng lương',
        color: 'emerald',
        description: 'Cung cấp tham số đầu vào chính xác cho Payroll Engine chạy lương hàng tháng (PAY03).'
      },
      {
        module: 'INS',
        moduleName: 'Bảo hiểm',
        color: 'rose',
        description: 'Khởi tạo Hồ sơ bảo hiểm cá nhân & Quản lý số sổ BHXH (INS01).'
      },
      {
        module: 'TAX',
        moduleName: 'Thuế TNCN',
        color: 'amber',
        description: 'Gán biểu thuế lũy tiến từng phần hoặc biểu thuế trích nộp cố định.'
      }
    ],
    sopBadge: 'SOP PAY01, INS01',
    sopIds: ['SOP PAY01', 'SOP INS01', 'SOP-L-01'],
    sopTitles: ['Quy trình Thiết lập cấu hình thu nhập & Hồ sơ Bảo hiểm xã hội'],
    process: {
      status: 'official',
      steps: [
        'Chọn ngạch bậc lương & Mức lương đóng bảo hiểm',
        'Gán danh sách các khoản phụ cấp cố định & phụ cấp theo hiệu suất',
        'Xác định biểu tỷ lệ trích nộp BHXH/BHYT/BHTN',
        'Khóa cấu hình đãi ngộ cá nhân & Sẵn sàng tính lương'
      ],
      source: 'Quy trình Cấu hình Lương & Chế độ phúc lợi (SOP PAY01, INS01)'
    },
    uiFields: ['Đối tượng lương', 'Ngạch / Bậc lương', 'Mức lương trích BHXH', 'Phụ cấp chức vụ', 'Phụ cấp đi lại/điện thoại', 'Số sổ BHXH']
  },

  'LIFE-06': {
    id: 'LIFE-06',
    type: 'lifecycle',
    code: 'EMP11, ATT08',
    title: 'Quá trình làm việc & Biến động',
    subtitle: 'Nhật ký biến động nhân sự xuyên suốt thời gian công tác',
    contextTrigger: 'Quản lý toàn bộ diễn tiến quá trình cống hiến của nhân sự: điều chuyển, nâng lương, thành tích, vi phạm.',
    actorsMatrix: {
      proposer: 'Tự động từ Hệ thống Audit Log / Trưởng bộ phận',
      approver: 'HRM-Admin / Ban Giám Đốc',
      executor: 'HRM-System Engine (Lưu vết không ghi đè dữ liệu lịch sử)'
    },
    inputs: [
      'Lịch sử các lần điều chuyển, bổ nhiệm, kiêm nhiệm, tăng lương qua các năm',
      'Dữ liệu tổng hợp công, số ngày nghỉ phép, làm thêm giờ tích lũy theo từng tháng',
      'Kết quả đánh giá hiệu suất (KPI) hàng năm và lịch sử khen thưởng/kỷ luật'
    ],
    outputs: [
      'Sổ tay điện tử lịch sử quá trình công tác (Job & Salary History) không bị ghi đè dữ liệu cũ',
      'Báo cáo biến động nhân sự phục vụ phân tích BI và quy hoạch cán bộ nguồn'
    ],
    integrations: [
      {
        module: 'BI',
        moduleName: 'Phân tích BI',
        color: 'purple',
        description: 'Đồng bộ kho dữ liệu lịch sử phục vụ Phân tích Thâm niên & Phụ thuộc biến động.'
      },
      {
        module: 'PERF',
        moduleName: 'Đánh giá KPI',
        color: 'amber',
        description: 'Tích hợp kết quả hiệu suất công tác liên tục qua các chu kỳ năm.'
      },
      {
        module: 'ATT',
        moduleName: 'Chấm công',
        color: 'blue',
        description: 'Lưu trữ tổng giờ công, phép tồn & OT tích lũy hàng tháng.'
      }
    ],
    sopBadge: 'SOP EMP11, ATT08',
    sopIds: ['SOP EMP11', 'SOP ATT08', 'SOP-CC-08'],
    sopTitles: ['Quy trình Ghi nhận quá trình làm việc & Quản lý lịch sử biến động'],
    process: {
      status: 'official',
      steps: [
        'Hệ thống tự động lắng nghe sự kiện biến động (Tăng lương, Bổ nhiệm, Khen thưởng)',
        'Ghi nhận bản ghi lịch sử gắn timestamp & Mã quyết định',
        'Cập nhật sổ tay điện tử làm việc của nhân viên',
        'Tổng hợp dữ liệu phục vụ báo cáo BI & quy hoạch cán bộ'
      ],
      source: 'Quy trình Ghi nhận quá trình làm việc & Lịch sử nhân sự (SOP EMP11, ATT08)'
    },
    uiFields: ['Loại biến động', 'Ngày áp dụng', 'Quyết định số', 'Đơn vị cũ ➔ Mới', 'Chức danh cũ ➔ Mới', 'Mức lương cũ ➔ Mới']
  },

  'LIFE-07': {
    id: 'LIFE-07',
    type: 'lifecycle',
    code: 'EMP15, PAY02, INS03',
    title: 'Nghỉ việc, Bàn giao & Đóng hồ sơ',
    subtitle: 'Thanh lý hợp đồng & Kết thúc vòng đời nhân sự',
    contextTrigger: 'Nhân viên nộp đơn xin thôi việc hoặc Công ty chấm dứt Hợp đồng lao động theo quy định.',
    actorsMatrix: {
      proposer: 'Nhân viên (Nộp đơn nghỉ việc trên Portal) / HR-Admin (Thông báo chấm dứt)',
      approver: 'Trưởng bộ phận & Ban Giám Đốc (Duyệt đơn nghỉ việc & Ngày làm việc cuối)',
      executor: 'IT/Hành chính/Kế toán (Thu hồi tài sản) ➔ HRM-C&B (Đóng hồ sơ)'
    },
    inputs: [
      'Đơn xin nghỉ: Ngày nộp đơn, Ngày mong muốn nghỉ, Lý do thôi việc',
      'Kiểm tra thời hạn báo trước theo luật (30 ngày HĐ có thời hạn, 45 ngày HĐ không thời hạn)',
      'Phiếu kiểm soát bàn giao (Clearance Sheet): Thu máy tính/tài khoản (IT), Thu thẻ BHYT/đồng phục (Hành chính), Chốt công nợ tạm ứng (Kế toán)'
    ],
    outputs: [
      'Quyết định thôi việc chính thức và Biên bản thanh lý hợp đồng lao động',
      'Khóa tài khoản đăng nhập hệ thống và chuyển trạng thái hồ sơ sang "Đã nghỉ việc"',
      'Liên thông tự động: Báo giảm BHXH (INS03), Quyết toán tiền phép tồn (ATT12), và Tính bảng lương chi trả cuối cùng gồm trợ cấp thôi việc/bồi hoàn (PAY02)'
    ],
    integrations: [
      {
        module: 'INS',
        moduleName: 'Bảo hiểm',
        color: 'rose',
        description: 'Tự động lập danh sách Báo giảm BHXH / Chốt sổ BHXH (INS03).'
      },
      {
        module: 'ATT',
        moduleName: 'Chấm công',
        color: 'blue',
        description: 'Quyết toán quỹ phép tồn & số ngày công làm việc thực tế cuối cùng (ATT12).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Quyết toán bảng lương thanh lý, Trợ cấp thôi việc hoặc Bồi hoàn đào tạo (PAY02).'
      },
      {
        module: 'IT',
        moduleName: 'Hệ thống IT',
        color: 'slate',
        description: 'Vô hiệu hóa tài khoản đăng nhập & thu hồi quyền truy cập hệ thống ngay trong ngày cuối.'
      }
    ],
    sopBadge: 'SOP EMP15, PAY02, INS03',
    sopIds: ['SOP EMP15', 'SOP PAY02', 'SOP INS03', 'SOP-NS-16'],
    sopTitles: ['Quy trình Quản lý Nghỉ việc, Bàn giao tài sản & Thanh lý HĐLĐ'],
    process: {
      status: 'official',
      steps: [
        'Tiếp nhận & Kiểm tra điều kiện thời gian báo trước của Đơn xin nghỉ',
        'Kích hoạt Phiếu kiểm soát bàn giao điện tử (Clearance Checklist)',
        'Xác nhận bàn giao từ IT, Hành chính & Kế toán công nợ',
        'Quyết toán lương thanh lý, Báo giảm BHXH & Đóng hồ sơ nhân viên'
      ],
      source: 'Quy trình Nghỉ việc & Đóng hồ sơ (SOP EMP15, PAY02, INS03)'
    },
    uiFields: ['Ngày nộp đơn', 'Ngày làm việc cuối cùng', 'Lý do nghỉ việc', 'Trạng thái bàn giao IT', 'Trạng thái chốt công nợ', 'Số ngày phép tồn quyết toán']
  },

  // =========================================================================
  // B. TẦNG 3: CÁC NGHIỆP VỤ PHÁT SINH TRONG QUÁ TRÌNH LÀM VIỆC (OPERATIONS)
  // =========================================================================
  'CF-01': {
    id: 'CF-01',
    type: 'cross',
    code: 'ATT06, ATT08',
    title: 'Quản lý Công & Phép (Time & Leave)',
    subtitle: 'Chấm công, giải trình & Quản lý quỹ phép năm',
    contextTrigger: 'Nhân viên phát sinh nhu cầu nghỉ phép / công tác hoặc Hệ thống nhận dữ liệu quét thẻ chấm công thô hàng ngày.',
    actorsMatrix: {
      proposer: 'Nhân viên (Tạo đơn trên Portal) / Máy chấm công (Dữ liệu quét thẻ)',
      approver: 'Trưởng bộ phận (Duyệt đơn nghỉ phép / Đơn giải trình đi trễ về sớm)',
      executor: 'HRM-Chấm công Specialist (Khóa sổ công tháng & chuyển dữ liệu tính lương)'
    },
    inputs: [
      'Đơn xin nghỉ phép/công tác từ Portal (chọn loại nghỉ, ngày nghỉ, chỉ định người backup)',
      'Dữ liệu quét thẻ chấm công thô từ máy quét (IN/OUT)',
      'Đơn giải trình đi trễ về sớm & Đơn đăng ký làm thêm giờ (OT)'
    ],
    outputs: [
      'Bảng chấm công tổng hợp tháng được khóa sổ (không cho sửa)',
      'Số ngày phép bị trừ tự động theo thứ tự giải trừ (Phép bù ➔ Phép năm ➔ Không lương)',
      'Chuyển ngày công thực tế sang PAY03 để tính lương'
    ],
    integrations: [
      {
        module: 'PAY',
        moduleName: 'Bảng lương',
        color: 'emerald',
        description: 'Đẩy số ngày công thực tế, giờ OT & ngày nghỉ hưởng lương sang Payroll Engine (PAY03).'
      },
      {
        module: 'ATT',
        moduleName: 'Quỹ phép',
        color: 'blue',
        description: 'Tự động cấn trừ quỹ phép năm (ATT08) theo quy tắc ưu tiên giải trừ.'
      }
    ],
    sopBadge: 'SOP ATT06, ATT08',
    sopIds: ['SOP ATT06', 'SOP ATT08', 'SOP-CC-01'],
    sopTitles: ['Quy trình Quản lý lịch đi ca, Chấm công & Giải trình phép'],
    process: {
      status: 'official',
      steps: [
        'Thu thập dữ liệu quẹt thẻ thô & Đơn từ Portal',
        'Tự động đối soát ca làm việc & Cảnh báo bất thường',
        'Trưởng bộ phận duyệt đơn giải trình & phép',
        'Khóa sổ bảng chấm công tháng & Đẩy sang tính lương'
      ],
      source: 'Quy trình Quản lý Công & Phép (SOP ATT06, ATT08)'
    },
    uiFields: ['Kỳ chấm công', 'Loại nghỉ phép', 'Số ngày đăng ký', 'Người bàn giao công việc', 'Số giờ OT', 'Trạng thái duyệt TBP']
  },

  'CF-02': {
    id: 'CF-02',
    type: 'cross',
    code: 'EMP05, EMP07',
    title: 'Tái ký HĐLĐ & Phụ lục hợp đồng (Contract Renewal)',
    subtitle: 'Đánh giá gia hạn & Điều chỉnh phụ lục hợp đồng',
    contextTrigger: 'Hợp đồng lao động hiện tại sắp đến hạn (cảnh báo trước 30/45 ngày) hoặc phát sinh điều chỉnh điều khoản mức lương/chức danh.',
    actorsMatrix: {
      proposer: 'Hệ thống tự động (Cảnh báo HĐ hết hạn) / HRM-C&B Specialist',
      approver: 'Trưởng bộ phận & Ban Giám Đốc (Đánh giá kết quả & Duyệt tái ký)',
      executor: 'HRM-C&B (Sinh hợp đồng mới/phụ lục) & Nhân viên (Ký xác nhận)'
    },
    inputs: [
      'Cảnh báo tự động từ hệ thống trước 30/45 ngày khi HĐ hết hạn',
      'Kết quả đánh giá hiệu suất của TBP & Đề xuất mức lương/ngạch bậc mới',
      'Ý kiến phê duyệt của BOM về việc gia hạn hợp đồng lao động'
    ],
    outputs: [
      'File HĐLĐ mới hoặc Phụ lục điều chỉnh hợp đồng có mã số tự động',
      'HĐ mới chuyển "Hiệu lực", HĐ cũ lưu vào "Lịch sử"',
      'Kích hoạt điều chỉnh mức nộp bảo hiểm sang INS04'
    ],
    integrations: [
      {
        module: 'INS',
        moduleName: 'Bảo hiểm',
        color: 'rose',
        description: 'Đẩy dữ liệu thay đổi mức lương đóng BHXH sang luồng Điều chỉnh đóng (INS04).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Cập nhật mức lương chính mới & khoản phụ cấp vào hồ sơ thu nhập.'
      }
    ],
    sopBadge: 'SOP EMP05, EMP07',
    sopIds: ['SOP EMP05', 'SOP EMP07', 'SOP-NS-05'],
    sopTitles: ['Quy trình Tái ký hợp đồng lao động & Ký phụ lục điều chỉnh'],
    process: {
      status: 'official',
      steps: [
        'Hệ thống phát cảnh báo hợp đồng sắp hết hạn',
        'TBP đánh giá hiệu suất & Đề xuất hình thức tái ký',
        'Ban Giám Đốc duyệt phê duyệt hạn hợp đồng mới',
        'Sinh HĐLĐ mới/Phụ lục, thực hiện ký số & Đồng bộ BHXH'
      ],
      source: 'Quy trình Tái ký HĐLĐ & Phụ lục (SOP EMP05, EMP07)'
    },
    uiFields: ['Mã HĐ hiện tại', 'Đề xuất tái ký', 'Thời hạn HĐ mới', 'Mức lương điều chỉnh', 'Ngày bắt đầu hiệu lực mới']
  },

  'CF-03': {
    id: 'CF-03',
    type: 'cross',
    code: 'EMP11',
    title: 'Biến động nhân sự & Quá trình công tác (Personnel Movement)',
    subtitle: 'Bổ nhiệm, Miễn nhiệm, Kiêm nhiệm & Điều chuyển',
    contextTrigger: 'Doanh nghiệp có nhu cầu bổ nhiệm cán bộ, kiêm nhiệm vị trí hoặc điều chuyển nhân sự giữa các đơn vị/địa điểm làm việc.',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận / Phòng Nhân sự (Tờ trình điều động / bổ nhiệm)',
      approver: 'Ban Giám Đốc (BOM) / Giám đốc Nhân sự (HRD)',
      executor: 'HRM-Admin (Ban hành quyết định, cập nhật hồ sơ & phân quyền)'
    },
    inputs: [
      'Tờ trình đề xuất: Bổ nhiệm, Miễn nhiệm, Kiêm nhiệm, Điều chuyển đơn vị/địa điểm',
      'Chức vụ mới, Phòng ban mới, Ngày áp dụng thực tế',
      'Phê duyệt theo thẩm quyền BOM/HRD'
    ],
    outputs: [
      'Quyết định bổ nhiệm/điều chuyển chính thức',
      'Cập nhật chức danh và trạm chi phí (Cost Center) trên hồ sơ',
      'Tự động đổi Lịch phân ca (ATT01) và Cấu hình đối tượng phép năm mới (ATT11)'
    ],
    integrations: [
      {
        module: 'ATT',
        moduleName: 'Chấm công',
        color: 'blue',
        description: 'Tự động thay đổi Lịch phân ca (ATT01) & Quy định chế độ phép năm mới (ATT11).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Cập nhật Cost Center trích chi phí lương & Phụ cấp chức vụ mới.'
      },
      {
        module: 'ORG',
        moduleName: 'Cơ cấu tổ chức',
        color: 'purple',
        description: 'Điều chỉnh vị trí hiển thị trên sơ đồ cây tổ chức & Reporting Line.'
      }
    ],
    sopBadge: 'SOP EMP11',
    sopIds: ['SOP EMP11', 'SOP-NS-09', 'SOP-NS-12'],
    sopTitles: ['Quy trình Bổ nhiệm, Kiêm nhiệm & Điều động nhân sự nội bộ'],
    process: {
      status: 'official',
      steps: [
        'Lập tờ trình đề xuất biến động nhân sự',
        'Hội đồng Nhân sự & Ban Giám Đốc xét duyệt',
        'Ban hành Quyết định điều chuyển / bổ nhiệm số hóa',
        'Cập nhật thông tin vị trí mới, Cost Center & Phân quyền hệ thống'
      ],
      source: 'Quy trình Biến động nhân sự & Điều động (SOP EMP11)'
    },
    uiFields: ['Hình thức biến động', 'Đơn vị mới', 'Chức danh mới', 'Quản lý mới', 'Cost Center mới', 'Ngày có hiệu lực']
  },

  'CF-04': {
    id: 'CF-04',
    type: 'cross',
    code: 'EMP13',
    title: 'Quản lý Khen thưởng (Rewards)',
    subtitle: 'Ghi nhận thành tích, sáng kiến Kaizen & Vinh danh',
    contextTrigger: 'Cá nhân hoặc Tập thể đạt thành tích xuất sắc, hoàn thành dự án trọng điểm hoặc đóng góp sáng kiến Kaizen mang lại hiệu quả.',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận / Hội đồng Sáng kiến Kaizen',
      approver: 'Hội đồng Khen thưởng doanh nghiệp & Tổng Giám Đốc',
      executor: 'HRM-C&B Specialist (Ghi nhận thành tích, chi trả & truyền thông)'
    },
    inputs: [
      'Đề xuất từ Hội đồng Khen thưởng / Sáng kiến Kaizen',
      'Danh hiệu khen thưởng, Hình thức (Hiện vật/Hiện kim), Giá trị quy đổi bằng tiền',
      'Biên bản xét duyệt của Hội đồng Khen thưởng'
    ],
    outputs: [
      'Quyết định khen thưởng chính thức & Email vinh danh toàn công ty',
      'Ghi nhận thành tích vào Profile nhân viên',
      'Chuyển dữ liệu sang TAX02 để tạm trích thuế PIT nếu giá trị thưởng > 10.000.000 VNĐ'
    ],
    integrations: [
      {
        module: 'TAX',
        moduleName: 'Thuế PIT',
        color: 'amber',
        description: 'Tự động tính thuế TNCN bất thường nếu giá trị phần thưởng > 10,000,000 VNĐ (TAX02).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Đưa số tiền thưởng hiện kim vào kỳ chi trả lương gần nhất.'
      },
      {
        module: 'PROFILE',
        moduleName: 'Hồ sơ nhân sự',
        color: 'blue',
        description: 'Lưu vết danh hiệu khen thưởng vào Hồ sơ thăng tiến cá nhân.'
      }
    ],
    sopBadge: 'SOP EMP13',
    sopIds: ['SOP EMP13', 'SOP-NS-13'],
    sopTitles: ['Quy trình Xét duyệt Khen thưởng & Vinh danh thành tích'],
    process: {
      status: 'official',
      steps: [
        'Nộp hồ sơ đề xuất khen thưởng / Sáng kiến Kaizen',
        'Hội đồng Khen thưởng họp thẩm định & Xếp hạng',
        'Tổng Giám Đốc ký Quyết định khen thưởng',
        'Chi trả tiền thưởng qua bảng lương & Vinh danh truyền thông'
      ],
      source: 'Quy trình Quản lý Khen thưởng & Sáng kiến (SOP EMP13)'
    },
    uiFields: ['Danh hiệu khen thưởng', 'Hình thức thưởng', 'Giá trị thưởng (VNĐ)', 'Hội đồng phê duyệt', 'Biên bản khen thưởng']
  },

  'CF-05': {
    id: 'CF-05',
    type: 'cross',
    code: 'EMP12',
    title: 'Quản lý Kỷ luật (Discipline)',
    subtitle: 'Xử lý vi phạm nội quy & Bồi thường thiệt hại',
    contextTrigger: 'Nhân viên vi phạm nội quy lao động, quy trình an toàn lao động hoặc gây thất thoát thiệt hại tài sản công ty.',
    actorsMatrix: {
      proposer: 'Trưởng đơn vị / Bộ phận Kiểm soát nội bộ (Nộp biên bản vi phạm)',
      approver: 'Hội đồng Kỷ luật & Ban Giám Đốc (Phê duyệt hình thức kỷ luật)',
      executor: 'HRM-Admin (Ban hành quyết định, ghi nhận vết & cấn trừ)'
    },
    inputs: [
      'Biên bản vi phạm nội quy/an toàn lao động',
      'Báo cáo của Hội đồng Kỷ luật',
      'Hình thức kỷ luật (Khiển trách, Kéo dài nâng lương, Cách chức, Sa thải)',
      'Kiểm tra điều kiện loại trừ: Lao động nữ nuôi con nhỏ < 12 tháng'
    ],
    outputs: [
      'Quyết định xử lý kỷ luật chính thức',
      'Ghi nhận vết vi phạm vào Profile / Tự động thêm vào Blacklist tuyển dụng',
      'Cắt giảm phụ cấp tương ứng hoặc hoãn kỳ nâng lương định kỳ'
    ],
    integrations: [
      {
        module: 'RECRUIT',
        moduleName: 'Tuyển dụng',
        color: 'rose',
        description: 'Tự động thêm vào Blacklist Tuyển dụng hệ thống (nếu áp dụng hình thức Sa thải).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Khấu trừ tiền bồi thường thiệt hại tài sản / Hoãn kỳ xét nâng lương định kỳ.'
      }
    ],
    sopBadge: 'SOP EMP12',
    sopIds: ['SOP EMP12', 'SOP-NS-14'],
    sopTitles: ['Quy trình Xử lý Kỷ luật Lao động & Kiểm soát vi phạm'],
    process: {
      status: 'official',
      steps: [
        'Lập biên bản sự việc & Thu thập bằng chứng vi phạm',
        'Tổ chức phiên họp Hội đồng Kỷ luật lao động',
        'Kiểm tra các điều kiện loại trừ theo Luật Lao động',
        'Ban hành Quyết định kỷ luật & Cập nhật vết sơ yếu lý lịch'
      ],
      source: 'Quy trình Quản lý Kỷ luật Lao động (SOP EMP12)'
    },
    uiFields: ['Hành vi vi phạm', 'Biên bản số', 'Hình thức kỷ luật', 'Thời gian hoãn nâng lương', 'Số tiền bồi thường (nếu có)']
  },

  'CF-06': {
    id: 'CF-06',
    type: 'cross',
    code: 'EMP02.08, EMP02.09',
    title: 'Đào tạo Hội nhập & Phát triển (Training)',
    subtitle: 'Đào tạo tân tuyển & Nâng cao kỹ năng chuyên môn',
    contextTrigger: 'Nhân viên mới gia nhập tổ chức hoặc có kế hoạch đào tạo nâng cao năng lực chuyên môn định kỳ theo khung chức danh.',
    actorsMatrix: {
      proposer: 'Chuyên viên L&D / Trưởng bộ phận (Đề xuất khóa học)',
      approver: 'Giám đốc Đào tạo / HRD (Phê duyệt ngân sách & kế hoạch)',
      executor: 'Chuyên viên Đào tạo & Giảng viên (Tổ chức & Điểm danh)'
    },
    inputs: [
      'Danh sách nhân viên mới tiếp nhận',
      'Khóa học hội nhập bắt buộc theo Chức danh',
      'Hợp đồng cam kết đào tạo (kèm chi phí và thời hạn cam kết phục vụ)'
    ],
    outputs: [
      'Bảng điểm và xếp loại kết quả đào tạo',
      'Chứng chỉ số hóa gắn vào Hồ sơ nhân lực',
      'Thiết lập công thức phạt bồi hoàn chi phí đào tạo nếu nhân viên nghỉ việc trước hạn cam kết'
    ],
    integrations: [
      {
        module: 'OFFBOARD',
        moduleName: 'Nghỉ việc',
        color: 'rose',
        description: 'Tự động kích hoạt điều khoản bồi hoàn chi phí đào tạo nếu vi phạm cam kết phục vụ (SOP EMP15).'
      },
      {
        module: 'PROFILE',
        moduleName: 'Hồ sơ',
        color: 'blue',
        description: 'Cập nhật bằng cấp, chứng chỉ số hóa vào Hồ sơ năng lực cá nhân.'
      }
    ],
    sopBadge: 'SOP EMP02.08, EMP02.09',
    sopIds: ['SOP EMP02.08', 'SOP EMP02.09', 'SOP-DT-02'],
    sopTitles: ['Quy trình Quản lý Đào tạo Hội nhập & Cam kết Đào tạo'],
    process: {
      status: 'official',
      steps: [
        'Lập danh sách học viên & Ký Hợp đồng cam kết đào tạo',
        'Tổ chức khóa đào tạo & Ghi nhận điểm danh LMS',
        'Thực hiện bài kiểm tra sát hạch cuối khóa',
        'Cấp chứng chỉ số & Ghi nhận giá trị khóa học vào Hồ sơ'
      ],
      source: 'Quy trình Đào tạo & Cam kết phục vụ (SOP EMP02.08, EMP02.09)'
    },
    uiFields: ['Tên khóa đào tạo', 'Thời lượng (Giờ)', 'Chi phí đào tạo (VNĐ)', 'Thời hạn cam kết phục vụ (Tháng)', 'Điểm sát hạch']
  },

  'CF-07': {
    id: 'CF-07',
    type: 'cross',
    code: 'EMP02.06, EMP02.11',
    title: 'Đánh giá Thử việc & Hiệu suất KPI (Performance Appraisal)',
    subtitle: 'Đánh giá kết quả thử việc & KPI định kỳ',
    contextTrigger: 'Đến hạn kết thúc giai đoạn thử việc (30/60 ngày) hoặc đến kỳ đánh giá hiệu suất công việc định kỳ (Tháng/Quý/Năm).',
    actorsMatrix: {
      proposer: 'Nhân viên (Thực hiện Tự đánh giá KPI trên Portal)',
      approver: 'Trưởng bộ phận (Chấm điểm, Nhận xét & Đề xuất kết quả) ➔ HRD (Duyệt)',
      executor: 'HRM-C&B Specialist (Xử lý hợp đồng chính thức / Thưởng KPI)'
    },
    inputs: [
      'Bản giao mục tiêu KPI thử việc lúc nhận việc',
      'Bản tự đánh giá kết quả của nhân viên',
      'Bảng điểm chấm và nhận xét của Trưởng bộ phận'
    ],
    outputs: [
      'Biên bản đánh giá thử việc kết luận: "Đạt" (Kích hoạt ký HĐ chính thức EMP06) hoặc "Không đạt" (Chuyển sang làm thủ tục thanh lý hợp đồng EMP15)'
    ],
    integrations: [
      {
        module: 'PERF',
        moduleName: 'Hợp đồng',
        color: 'emerald',
        description: 'Nếu kết quả "Đạt" ➔ Tự động kích hoạt Luồng Ký HĐLĐ Chính thức (SOP EMP06).'
      },
      {
        module: 'OFFBOARD',
        moduleName: 'Chấm dứt',
        color: 'rose',
        description: 'Nếu kết quả "Không đạt" ➔ Chuyển luồng Thủ tục Thanh lý HĐLĐ Thử việc (SOP EMP15).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'amber',
        description: 'Đẩy hệ số hiệu suất công việc phục vụ tính Thưởng KPI / Nâng bậc lương.'
      }
    ],
    sopBadge: 'SOP EMP02.06, EMP02.11',
    sopIds: ['SOP EMP02.06', 'SOP EMP02.11', 'SOP-ĐG-02'],
    sopTitles: ['Quy trình Đánh giá Thử việc & Đánh giá Hiệu suất KPI'],
    process: {
      status: 'official',
      steps: [
        'Nhân viên lập bản tự đánh giá KPI trên Portal',
        'Trưởng bộ phận chấm điểm & Phỏng vấn nghiệm thu',
        'HRD phê duyệt kết quả Đạt / Không đạt thử việc',
        'Kích hoạt luồng Tái ký HĐLĐ chính thức hoặc Thanh lý'
      ],
      source: 'Quy trình Đánh giá Thử việc & KPI (SOP EMP02.06, EMP02.11)'
    },
    uiFields: ['Kỳ đánh giá', 'Điểm tự đánh giá', 'Điểm Quản lý chấm', 'Xếp loại hiệu suất', 'Kết luận thử việc (Đạt/Không đạt)']
  },

  'CF-08': {
    id: 'CF-08',
    type: 'cross',
    code: 'EMP01',
    title: 'Phát triển Nhân viên & Quy hoạch (Career Path & Succession)',
    subtitle: 'Lộ trình thăng tiến & Quy hoạch cán bộ nguồn',
    contextTrigger: 'Doanh nghiệp thực hiện quy hoạch nhân sự nguồn hàng năm hoặc xây dựng Lộ trình thăng tiến cá nhân (IDP).',
    actorsMatrix: {
      proposer: 'HR Business Partner (HRBP) / Ban Giám Đốc',
      approver: 'Hội đồng Quy hoạch Cán bộ & Tổng Giám Đốc',
      executor: 'Chuyên viên Phát triển Nhân sự (Talent Management Specialist)'
    },
    inputs: [
      'Khung tiêu chuẩn chức danh & Bộ năng lực (Core, Leadership, Behavior)',
      'Dữ liệu lịch sử đánh giá KPI nhiều năm và thâm niên công tác'
    ],
    outputs: [
      'Bản đồ lộ trình thăng tiến cá nhân (Career Path)',
      'Danh sách quy hoạch cán bộ nguồn cho các vị trí quản lý trọng yếu'
    ],
    integrations: [
      {
        module: 'TRN',
        moduleName: 'Đào tạo',
        color: 'purple',
        description: 'Thiết lập Lộ trình đào tạo lãnh đạo kế thừa (Management Trainee / IDP).'
      },
      {
        module: 'ORG',
        moduleName: 'Tổ chức',
        color: 'sky',
        description: 'Ghi nhận nhân sự tiềm năng vào danh sách Kế thừa vị trí Key Position.'
      }
    ],
    sopBadge: 'SOP EMP01',
    sopIds: ['SOP EMP01', 'SOP-NS-15'],
    sopTitles: ['Quy trình Xây dựng Lộ trình Thăng tiến & Quy hoạch Cán bộ Kế thừa'],
    process: {
      status: 'official',
      steps: [
        'Rà soát ma trận năng lực & Điểm KPI tích lũy 3 năm',
        'Phân loại nhân tài vào Ma trận 9-Box Talent Matrix',
        'Xây dựng Kế hoạch phát triển cá nhân (IDP)',
        'Phê duyệt danh sách Cán bộ quy hoạch nguồn'
      ],
      source: 'Quy trình Phát triển Nhân viên & Quy hoạch (SOP EMP01)'
    },
    uiFields: ['Vị trí quy hoạch', 'Phân loại 9-Box Matrix', 'Mức độ sẵn sàng (Ready now / 1-2 years)', 'Kế hoạch phát triển IDP']
  }
}
