import type { CrossClusterOverviewConnection, FlowNode } from '../types'

export const CROSS_CLUSTER_NODES: FlowNode[] = [
  {
    id: 'organization',
    code: 'ORG',
    label: 'Quản trị Tổ chức',
    labelEn: 'Organization Management',
    cluster: 'organization',
    description: 'Hoạch định định biên, xây dựng cây cơ cấu tổ chức, danh mục chức danh và khởi tạo các vị trí làm việc.',
    descriptionEn: 'Headcount planning, org hierarchy modeling, job architecture, and position seat management.',
    iconName: 'Building2',
    workflowId: 'MODULE-ORG-ST',
    firstSopCode: 'OST-01',
    nodeKind: 'business-module',
    colorToken: 'sky'
  },
  {
    id: 'core',
    code: 'CORE',
    label: 'Vận hành Lõi',
    labelEn: 'Core HR & Operations',
    cluster: 'core',
    description: 'Vận hành toàn diện vòng đời nhân viên từ tuyển dụng, quản lý hồ sơ, chấm công, nghỉ phép đến tính lương, bảo hiểm và thuế.',
    descriptionEn: 'End-to-end employee lifecycle execution including hiring, profiling, timekeeping, payroll, SI, and PIT.',
    iconName: 'Users',
    workflowId: 'LIFE-02',
    firstSopCode: 'SOP-EMP-03',
    nodeKind: 'business-module',
    colorToken: 'blue'
  },
  {
    id: 'people',
    code: 'PPL',
    label: 'Phát triển Con người',
    labelEn: 'People Development',
    cluster: 'people',
    description: 'Thiết lập KPI, đánh giá hiệu suất định kỳ, phân tích khoảng trống năng lực, đào tạo và quy hoạch nhân tài kế nhiệm.',
    descriptionEn: 'Continuous growth cycle with OKR/KPI setting, performance appraisal, competency gaps, L&D, and succession benches.',
    iconName: 'GraduationCap',
    workflowId: 'MODULE-PFM',
    firstSopCode: 'PFM-02',
    nodeKind: 'business-module',
    colorToken: 'emerald'
  },
  {
    id: 'platform',
    code: 'PLT',
    label: 'Dịch vụ Nền tảng',
    labelEn: 'Platform Foundation Mesh',
    cluster: 'platform',
    description: 'Lớp hạ tầng dịch vụ dùng chung: Master Data, Cấu hình tham số, Workflow phê duyệt, Ký số, Thông báo, Bảo mật và Audit log.',
    descriptionEn: 'Enterprise shared service mesh delivering canonical master data, approval routing, digital signatures, notifications, security, and audit.',
    iconName: 'Layers',
    workflowId: 'MODULE-PLT-MD',
    firstSopCode: 'MD-01',
    nodeKind: 'shared-service',
    colorToken: 'purple'
  }
]

export const CROSS_CLUSTER_CONNECTIONS: CrossClusterOverviewConnection[] = [
  {
    id: 'cc-org-core',
    fromCluster: 'organization',
    toCluster: 'core',
    label: 'Bàn giao Vị trí trống & Hạn mức định biên',
    labelEn: 'Position Seat Authorization & Headcount Limits',
    description: 'Quản trị tổ chức cấp phép vị trí trống (Position ID) kèm chức danh, dải lương và định biên cho Vận hành lõi tuyển dụng và bổ nhiệm.',
    descriptionEn: 'Organization Management authorizes vacant position seats, job descriptions, and salary ceilings for Core HR recruitment and placement.',
    direction: 'one-way',
    frequency: 'event-driven',
    dataItems: [
      'Mã vị trí tuyển dụng được phê duyệt (Position ID)',
      'Bản mô tả công việc (JD) & Tiêu chuẩn chức danh',
      'Hạn mức ngạch bậc lương tham chiếu (Salary Band)',
      'Phòng ban, Trung tâm chi phí (Cost Center) & Cấp quản lý trực tiếp'
    ],
    dataItemsEn: [
      'Approved Position ID for Recruitment',
      'Versioned Job Description & Qualifications',
      'Benchmark Salary Grade Band',
      'Assigned Department, Cost Center & Line Manager'
    ],
    controls: [
      'Vị trí tuyển dụng bắt buộc phải có chỉ tiêu định biên còn trống',
      'Mức lương đề xuất không vượt trần ngân sách chức danh'
    ],
    controlsEn: [
      'Requisition must consume available headcount budget',
      'Offer salary must not breach approved job salary band'
    ],
    exceptions: [
      'Tuyển vượt định biên: Kích hoạt quy trình phê duyệt bổ sung ngoại lệ từ Ban Tổng Giám Đốc.'
    ],
    exceptionsEn: [
      'Over-budget requisition: Requires Executive Board headcount exemption approval.'
    ],
    primaryModules: ['Định biên (HC)', 'Vị trí (POS)', 'Tuyển dụng (ATS)', 'Hồ sơ nhân sự (EMP)'],
    relatedWorkflowIds: ['MODULE-ORG-POS', 'LIFE-01', 'LIFE-02']
  },
  {
    id: 'cc-core-ppl',
    fromCluster: 'core',
    toCluster: 'people',
    label: 'Bàn giao Dữ liệu Nhân sự, Chức vụ & Kết quả làm việc',
    labelEn: 'Employee Master Record & Operational Work Data',
    description: 'Vận hành lõi chuyển giao hồ sơ nhân viên, thâm niên, quá trình công tác và kết quả hoàn thành công việc sang Phát triển con người.',
    descriptionEn: 'Core HR provides active employee master data, job tenure, and work deliverables to People Development for review cycles.',
    direction: 'one-way',
    frequency: 'periodic',
    dataItems: [
      'Danh sách nhân sự đang hoạt động & Thâm niên làm việc',
      'Chức danh, Cấp bậc và Quản lý trực tiếp phụ trách đánh giá',
      'Dữ liệu kỷ luật, khen thưởng và chuyên cần trong kỳ',
      'Gói mục tiêu cam kết và bằng chứng thực hiện công việc'
    ],
    dataItemsEn: [
      'Active Employee List & Job Tenure',
      'Current Position, Grade, and Assigned Appraiser',
      'Attendance, disciplinary, and spot-reward history',
      'Goal scorecard deliverables and work evidence'
    ],
    controls: [
      'Chỉ đưa vào đánh giá các nhân viên đã qua thời gian thử việc hoặc đủ điều kiện theo quy chế',
      'Thông tin quản lý trực tiếp được cập nhật chính xác trước ngày mở kỳ đánh giá'
    ],
    controlsEn: [
      'Only eligible post-probation employees enrolled in formal review cycle',
      'Line manager assignment verified prior to appraisal period start'
    ],
    exceptions: [
      'Nhân viên điều chuyển giữa kỳ: Phân bổ tỷ lệ đánh giá giữa Quản lý cũ và Quản lý mới.'
    ],
    exceptionsEn: [
      'Mid-cycle transfer: Split appraisal weighting between former and new managers.'
    ],
    primaryModules: ['Hồ sơ nhân sự (EMP)', 'Chấm công (ATT)', 'KPI & Mục tiêu', 'Đánh giá hiệu suất (REV)'],
    relatedWorkflowIds: ['LIFE-02', 'MODULE-PFM']
  },
  {
    id: 'cc-ppl-org',
    fromCluster: 'people',
    toCluster: 'organization',
    label: 'Khoảng trống năng lực & Đề xuất Quy hoạch Kế nhiệm',
    labelEn: 'Competency Gaps & Succession Bench Recommendations',
    description: 'Phát triển con người phản hồi dữ liệu nhân tài nguồn và khoảng trống năng lực để Quản trị tổ chức điều chỉnh quy hoạch vị trí.',
    descriptionEn: 'People Development feeds succession readiness ratings and talent pool data to refine organizational position planning.',
    direction: 'feedback',
    frequency: 'periodic',
    dataItems: [
      'Báo cáo phân tích ma trận 9-Box toàn công ty',
      'Danh sách cán bộ nguồn sẵn sàng kế nhiệm cho các vị trí chủ chốt',
      'Báo cáo khoảng trống năng lực chiến lược (Strategic Competency Gaps)',
      'Đề xuất tinh giản hoặc tái cấu trúc chức danh'
    ],
    dataItemsEn: [
      'Enterprise-wide 9-Box Talent Matrix Analytics',
      'Ready-now succession candidates for critical leadership seats',
      'Strategic workforce competency gap heatmaps',
      'Job architecture restructuring proposals'
    ],
    controls: [
      'Quy hoạch kế nhiệm phải được Hội đồng Nhân sự phê duyệt trước khi cập nhật vị trí'
    ],
    controlsEn: [
      'Succession bench nominations require Executive Talent Council sign-off'
    ],
    exceptions: [
      'Vị trí chủ chốt không có người kế nhiệm (Zero Bench Strength): Cảnh báo rủi ro vận hành và mở kênh tìm kiếm nhân tài.'
    ],
    exceptionsEn: [
      'Zero bench strength for key role: Trigger organizational talent risk alert.'
    ],
    primaryModules: ['Nhân tài & Kế nhiệm (TAL)', 'Năng lực (CMP)', 'Vị trí (POS)', 'Báo cáo nhân sự (RPT)'],
    relatedWorkflowIds: ['MODULE-TAL', 'MODULE-ORG-POS']
  },
  {
    id: 'cc-ppl-core',
    fromCluster: 'people',
    toCluster: 'core',
    label: 'Kết quả Hiệu suất phục vụ Thăng chức, Tăng lương & Thưởng',
    labelEn: 'Appraisal Results for Promotion, Merit Pay & Bonus',
    description: 'Chuyển kết quả xếp loại hiệu suất và đề xuất thăng chức/thưởng sang Vận hành lõi để điều chỉnh hợp đồng và chi trả thu nhập.',
    descriptionEn: 'Transfers final performance ratings and promotion decisions to Core HR for salary adjustment and bonus payroll execution.',
    direction: 'feedback',
    frequency: 'periodic',
    dataItems: [
      'Bảng xếp loại hiệu suất hoàn thiện (A/B/C/D)',
      'Quyết định bổ nhiệm, thăng ngạch lương hoặc tăng bậc P1',
      'Hệ số thưởng hiệu quả công việc P2 / Thưởng cuối năm',
      'Kế hoạch cải thiện hiệu suất (PIP) đối với nhân viên chưa đạt'
    ],
    dataItemsEn: [
      'Final Certified Performance Grade (A/B/C/D)',
      'Promotion & Merit Salary Adjustment Decisions',
      'Performance Bonus Multiplier P2 & Annual Bonus payout',
      'Performance Improvement Plan (PIP) rosters'
    ],
    controls: [
      'Ngân sách tăng lương và thưởng hiệu quả không vượt quá quỹ lương được duyệt',
      'Quyết định thăng chức có đầy đủ phê duyệt từ cấp thẩm quyền'
    ],
    controlsEn: [
      'Merit increase and bonus pool adhere strictly to approved budget',
      'Promotion orders carry verified governance sign-offs'
    ],
    exceptions: [
      'Khiếu nại điểm đánh giá chưa giải quyết: Tạm hoãn chi trả thưởng đợt 1 đối với trường hợp khiếu nại.'
    ],
    exceptionsEn: [
      'Unresolved appraisal grievance: Hold discretionary bonus pending dispute resolution.'
    ],
    primaryModules: ['Đánh giá (REV)', 'Ghi nhận (ENG)', 'Hồ sơ nhân sự (EMP)', 'Tiền lương (PAY)'],
    relatedWorkflowIds: ['MODULE-PFM', 'LIFE-05', 'MODULE-PAY']
  },
  {
    id: 'cc-plt-all',
    fromCluster: 'platform',
    toCluster: 'core',
    label: 'Cung cấp Hạ tầng Dịch vụ dùng chung cho Toàn hệ thống',
    labelEn: 'Shared Service Mesh Supporting All Business Clusters',
    description: 'Nền tảng cung cấp Master Data, Cấu hình tham số, Workflow Engine, Ký số, Thông báo, Bảo mật và Audit log cho 3 cụm nghiệp vụ.',
    descriptionEn: 'Platform Foundation delivers canonical master data, approval routing, digital signatures, notifications, security, and audit across all 3 business clusters.',
    direction: 'one-way',
    frequency: 'realtime',
    dataItems: [
      'Danh mục dùng chung & Bộ quy tắc cấu hình tham số',
      'Luồng phê duyệt điện tử đa cấp (Dynamic Workflow)',
      'Dịch vụ tạo mẫu văn bản & Ký số hợp pháp (Digital Sign)',
      'Hệ thống thông báo đa kênh (In-app, Push, Email, SMS)',
      'Phân quyền bảo mật theo vai trò (RBAC) & Nhật ký Audit Trail'
    ],
    dataItemsEn: [
      'Canonical Master Dictionaries & Parameter Rules',
      'Dynamic Multi-level Workflow Routing Engine',
      'Document Template Merge & Legally Binding Digital Signing',
      'Omnichannel Notifications (In-app, Push, Email, SMS)',
      'Role-based Security (RBAC) & Immutable Audit Trail'
    ],
    controls: [
      'Đảm bảo thời gian phản hồi API nền tảng < 200ms',
      'Nhật ký kiểm toán được lưu trữ bất biến (WORM)'
    ],
    controlsEn: [
      'Platform shared API response SLA < 200ms',
      'Audit log stored on immutable write-once media'
    ],
    exceptions: [
      'Sự cố dịch vụ ký số bên thứ 3: Tự động kích hoạt cơ chế ký OTP SMS dự phòng.'
    ],
    exceptionsEn: [
      'Third-party CA service outage: Automatically switch to backup SMS OTP signing.'
    ],
    primaryModules: ['Danh mục (MD)', 'Cấu hình (CFG)', 'Workflow (WFL)', 'Ký số (SIG)', 'Bảo mật (SEC)'],
    relatedWorkflowIds: ['MODULE-PLT-MD', 'MODULE-PLT-WFL', 'MODULE-PLT-SIG']
  }
]
