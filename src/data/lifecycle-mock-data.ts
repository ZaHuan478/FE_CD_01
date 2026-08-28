import { CROSS_FUNCTIONAL_REGISTRY } from '../components/employee-lifecycle/cross-functional'

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
  }
}

// B. TẦNG 3: CÁC NGHIỆP VỤ PHÁT SINH TRONG QUÁ TRÌNH LÀM VIỆC (OPERATIONS)
// Đồng bộ 100% từ CANONICAL CROSS-FUNCTIONAL REGISTRY
const crossFunctionalMockNodes: Record<string, SOPFullNode> = Object.fromEntries(
  Object.entries(CROSS_FUNCTIONAL_REGISTRY).map(([id, mod]) => [
    id,
    {
      id: mod.id,
      type: 'cross' as const,
      code: mod.code,
      title: mod.title,
      subtitle: mod.subtitle,
      contextTrigger: mod.triggerSummary,
      actorsMatrix: {
        proposer: mod.actorsMatrix.proposer,
        approver: mod.actorsMatrix.approver,
        executor: mod.actorsMatrix.executor
      },
      inputs: mod.inputs,
      outputs: mod.outputs,
      integrations: mod.integrations as any,
      sopBadge: mod.sopBadge,
      sopIds: mod.sopIds,
      sopTitles: mod.sopTitles,
      process: {
        status: 'official' as const,
        steps: mod.sopProcesses[0]?.steps?.map((s) => s.title) || [mod.title],
        source: mod.sopProcesses[0]?.sopCategory || mod.domainLabel
      },
      uiFields: mod.uiFields
    }
  ])
)

Object.assign(lifecycleMockNodes, crossFunctionalMockNodes)

