import type { ClusterFlowConfig } from '../types'

export const ORGANIZATION_FLOW_DATA: ClusterFlowConfig = {
  clusterId: 'organization',
  title: 'Chuỗi phụ thuộc từ định biên đến vị trí làm việc',
  titleEn: 'Organization Planning & Position Dependency Chain',
  subtitle:
    'Chuỗi quan hệ phụ thuộc tuần tự và chặt chẽ từ Hoạch định định biên ➔ Cây cơ cấu tổ chức ➔ Danh mục chức danh tiêu chuẩn ➔ Khởi tạo vị trí công tác (Position) ➔ Tổng hợp báo cáo phân tích lực lượng lao động.',
  subtitleEn:
    'Rigid sequential dependency pipeline flowing from Headcount Budget ➔ Org Chart Hierarchy ➔ Job Catalog & Descriptions ➔ Position Management ➔ Workforce Analytics.',
  nodes: [
    {
      id: 'headcount',
      code: 'HC',
      label: 'Định biên Nhân sự',
      labelEn: 'Headcount & FTE Budget',
      cluster: 'organization',
      description: 'Xác định số lượng nhân sự, số giờ FTE và trần ngân sách chi phí nhân công (People Cost) cho từng đơn vị.',
      descriptionEn: 'Establishes headcount targets, FTE allowances, and personnel cost ceilings per business unit.',
      iconName: 'UsersRound',
      workflowId: 'MODULE-ORG-HC',
      firstSopCode: 'HC-01',
      nodeKind: 'business-module',
      colorToken: 'sky'
    },
    {
      id: 'structure',
      code: 'OST',
      label: 'Cơ cấu Tổ chức',
      labelEn: 'Organization Structure',
      cluster: 'organization',
      description: 'Thiết lập cây sơ đồ tổ chức, pháp nhân, phân cấp phòng ban, trung tâm chi phí (Cost Center) và tuyến báo cáo.',
      descriptionEn: 'Configures multi-entity org chart, business unit hierarchy, cost centers, and matrix reporting lines.',
      iconName: 'Network',
      workflowId: 'MODULE-ORG-ST',
      firstSopCode: 'OST-01',
      nodeKind: 'business-module',
      colorToken: 'indigo'
    },
    {
      id: 'job',
      code: 'JOB',
      label: 'Chức danh & JD',
      labelEn: 'Job Architecture & JD',
      cluster: 'organization',
      description: 'Chuẩn hóa Job Catalog, mô tả công việc (JD), khung ngạch bậc (Job Grade) và dải lương tham chiếu.',
      descriptionEn: 'Standardizes Job Catalog, versioned job descriptions, career tracks, grading, and salary bands.',
      iconName: 'BriefcaseBusiness',
      workflowId: 'MODULE-ORG-JOB',
      firstSopCode: 'JOB-01',
      nodeKind: 'business-module',
      colorToken: 'teal'
    },
    {
      id: 'position',
      code: 'POS',
      label: 'Quản lý Vị trí',
      labelEn: 'Position Management',
      cluster: 'organization',
      description: 'Biến định biên thành từng ghế vị trí cụ thể (Position ID) có mã định danh, người đảm nhiệm và trạng thái tuyển dụng.',
      descriptionEn: 'Instantiates unique position seats consuming headcount budget with incumbent and vacancy tracking.',
      iconName: 'Building2',
      workflowId: 'MODULE-ORG-POS',
      firstSopCode: 'POS-01',
      nodeKind: 'business-module',
      colorToken: 'blue'
    },
    {
      id: 'reporting',
      code: 'RPT',
      label: 'Báo cáo Nhân sự',
      labelEn: 'Workforce Analytics',
      cluster: 'organization',
      description: 'Phân tích thực tế so với kế hoạch (Actual vs Plan), biến động nhân sự (Turnover), tỷ lệ lấp đầy và Span of Control.',
      descriptionEn: 'Generates headcount variance, vacancy rates, turnover analytics, and management span of control metrics.',
      iconName: 'BarChart3',
      workflowId: 'MODULE-ORG-RPT',
      firstSopCode: 'RPT-01',
      nodeKind: 'business-module',
      colorToken: 'amber'
    }
  ],
  connections: [
    {
      id: 'org-c1',
      from: 'headcount',
      to: 'structure',
      label: 'Trần hạn mức ngân sách & Định biên phòng ban',
      labelEn: 'Approved Headcount Baseline & Unit Ceilings',
      description: 'Cấp hạn mức nhân sự và chi phí lương tối đa cho từng nút đơn vị trên cây cơ cấu tổ chức.',
      descriptionEn: 'Allocates approved FTE headcounts and personnel cost budgets to organizational units.',
      direction: 'one-way',
      trigger: 'Ban Giám Đốc (BOD) phê duyệt kế hoạch ngân sách năm',
      triggerEn: 'Executive Board approves annual workforce budget plan',
      frequency: 'periodic',
      dataItems: [
        'Hạn mức Headcount & FTE theo từng phòng ban',
        'Trần ngân sách quỹ lương (People Cost Ceiling)',
        'Kế hoạch tuyển mới / Giữ nguyên / Tinh giản',
        'Ngày bắt đầu áp dụng ngân sách'
      ],
      dataItemsEn: [
        'Headcount & FTE quota per department',
        'Approved personnel cost ceiling (People Cost)',
        'Net hire / Freeze / Attrition targets',
        'Budget effective start date'
      ],
      controls: [
        'Mọi đơn vị thành lập mới bắt buộc phải có hạn mức định biên',
        'Tổng định biên các đơn vị con không được vượt quá ngân sách khối'
      ],
      controlsEn: [
        'New business units must have designated headcount quotas',
        'Sub-unit totals cannot exceed parent division ceiling'
      ],
      exceptions: [
        'Dự án khẩn cấp phát sinh ngoài kế hoạch: Trình hồ sơ phê duyệt bổ sung định biên ngoại lệ (Headcount Exemption).'
      ],
      exceptionsEn: [
        'Urgent out-of-plan business demand: Submit formal Headcount Exemption dossier.'
      ],
      relatedWorkflowIds: ['MODULE-ORG-HC', 'MODULE-ORG-ST'],
      relatedSopCodes: ['HC-01', 'OST-01'],
      connectionKind: 'dependency'
    },
    {
      id: 'org-c2',
      from: 'structure',
      to: 'job',
      label: 'Ánh xạ Chức danh chuẩn vào Cơ cấu đơn vị',
      labelEn: 'Job Catalog Mapping to Organizational Units',
      description: 'Quy định các chức danh nào được phép hoạt động trong từng loại hình phòng ban.',
      descriptionEn: 'Defines allowable standard job families and job titles across specific organizational departments.',
      direction: 'one-way',
      trigger: 'Tạo mới hoặc tái cấu trúc phòng ban chức năng',
      triggerEn: 'New department creation or organizational restructuring',
      frequency: 'event-driven',
      dataItems: [
        'Mã đơn vị & Mã trung tâm chi phí (Cost Center)',
        'Danh mục chức danh khả dụng (Job Catalog Map)',
        'Cấp bậc quản lý tiêu chuẩn của đơn vị',
        'Tuyến báo cáo trực tiếp và ma trận'
      ],
      dataItemsEn: [
        'Unit Code & Cost Center ID',
        'Allowable Job Catalog Map',
        'Department standard management hierarchy',
        'Direct and dotted-line reporting structures'
      ],
      controls: [
        'Không cho phép gán chức danh không nằm trong Job Catalog chính thức',
        'Phòng ban phải có người đứng đầu được phân quyền rõ ràng'
      ],
      controlsEn: [
        'Restricts job assignments exclusively to active Job Catalog entries',
        'Every unit must have designated authorized leadership role'
      ],
      exceptions: [
        'Chức danh mới chưa có trong danh mục: Kích hoạt quy trình thẩm định Job Evaluation và ban hành JD mới.'
      ],
      exceptionsEn: [
        'Uncataloged new role: Trigger Job Evaluation committee to author approved JD.'
      ],
      relatedWorkflowIds: ['MODULE-ORG-ST', 'MODULE-ORG-JOB'],
      relatedSopCodes: ['OST-01', 'JOB-01'],
      connectionKind: 'dependency'
    },
    {
      id: 'org-c3',
      from: 'job',
      to: 'position',
      label: 'Kế thừa JD, Khung bậc lương & Khởi tạo Vị trí (Position)',
      labelEn: 'JD Inheritance, Salary Scale & Position Instantiation',
      description: 'Mỗi vị trí làm việc kế thừa toàn bộ mô tả công việc, khung lương và yêu cầu năng lực từ Chức danh cha.',
      descriptionEn: 'Every unique position seat inherits job descriptions, salary bands, and competency requirements.',
      direction: 'one-way',
      trigger: 'Phòng ban yêu cầu mở thêm ghế vị trí tuyển dụng mới',
      triggerEn: 'Department requests new position seat creation for hiring',
      frequency: 'event-driven',
      dataItems: [
        'Mã vị trí duy nhất (Position ID)',
        'Chức danh cha & Bản mô tả công việc (JD ID)',
        'Khung ngạch bậc lương tham chiếu (Grade Band)',
        'Hệ số làm việc (1.0 FTE hoặc 0.5 Part-time)',
        'Mã vị trí cấp trên trực tiếp (Reports To Position ID)'
      ],
      dataItemsEn: [
        'Unique Position ID',
        'Parent Job Title & Versioned JD ID',
        'Benchmark Salary Grade Band',
        'FTE allocation (1.0 Full-time / 0.5 Part-time)',
        'Reports-To Supervisor Position ID'
      ],
      controls: [
        'Khởi tạo vị trí bắt buộc phải tiêu thụ hạn mức định biên còn trống',
        'Vị trí không thể tồn tại độc lập ngoài cây sơ đồ vị trí'
      ],
      controlsEn: [
        'Creating position must strictly consume available headcount quota',
        'Positions cannot exist as orphaned nodes outside Position Tree'
      ],
      exceptions: [
        'Hết chỉ tiêu định biên: Hệ thống tự động chặn tạo Position mới cho đến khi được duyệt tăng biên chế.'
      ],
      exceptionsEn: [
        'Zero headcount quota available: System hard-blocks position creation.'
      ],
      relatedWorkflowIds: ['MODULE-ORG-JOB', 'MODULE-ORG-POS'],
      relatedSopCodes: ['JOB-01', 'POS-01'],
      connectionKind: 'dependency'
    },
    {
      id: 'org-c4',
      from: 'position',
      to: 'reporting',
      label: 'Dữ liệu thực tế người đảm nhiệm & Tỷ lệ trống (Vacancy)',
      labelEn: 'Incumbent Seat Occupancy & Vacancy Pipeline Data',
      description: 'Đồng bộ tình trạng lấp đầy vị trí, nhân viên đang đảm nhiệm và vị trí đang tuyển sang báo cáo quản trị.',
      descriptionEn: 'Syncs seat occupancy, current incumbents, and active requisitions to analytics engine.',
      direction: 'one-way',
      trigger: 'Thay đổi nhân sự (Tuyển mới, Bổ nhiệm, Thôi việc)',
      triggerEn: 'Personnel transaction (New Hire, Promotion, Transfer, Termination)',
      frequency: 'daily',
      dataItems: [
        'Tổng số vị trí đã mở & Tỷ lệ lấp đầy (Occupancy Rate)',
        'Danh sách vị trí trống cần tuyển gấp (Critical Vacancies)',
        'Tỷ lệ quản lý trên nhân viên (Span of Control: 1:N)',
        'Số lượng vị trí đóng hoặc đóng băng'
      ],
      dataItemsEn: [
        'Total Authorized Positions & Occupancy Rate',
        'Critical Vacancy Alert List',
        'Management Span of Control (1:N ratio)',
        'Frozen / Inactive Position Seat Count'
      ],
      controls: [
        'Đối soát 1:1 giữa số lượng vị trí đang hoạt động và hồ sơ nhân viên thực tế'
      ],
      controlsEn: [
        'Strict 1:1 reconciliation between active filled positions and employee master records'
      ],
      exceptions: [
        '1 vị trí có 2 người cùng đảm nhiệm quá thời hạn bàn giao 30 ngày: Cảnh báo bất thường chồng chéo nhân sự.'
      ],
      exceptionsEn: [
        'Double-incumbent overlap exceeding 30-day handoff grace period: Trigger anomaly alert.'
      ],
      relatedWorkflowIds: ['MODULE-ORG-POS', 'MODULE-ORG-RPT'],
      relatedSopCodes: ['POS-01', 'RPT-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'org-c5',
      from: 'reporting',
      to: 'headcount',
      label: 'Đối soát Thực tế vs Kế hoạch (Actual vs Plan Variance)',
      labelEn: 'Headcount Variance Analytics & Budget Recalibration',
      description: 'Báo cáo chênh lệch định biên và dự báo chi phí nhân sự phục vụ việc điều chỉnh ngân sách chu kỳ tới.',
      descriptionEn: 'Headcount variance analytics and labor cost projections feeding next-cycle budget recalibration.',
      direction: 'feedback',
      trigger: 'Đóng kỳ báo cáo quý / Hoạch định định biên năm tới',
      triggerEn: 'Quarterly reporting close or annual budget planning',
      frequency: 'periodic',
      dataItems: [
        'Chênh lệch Headcount thực tế so với kế hoạch (Variance Delta)',
        'Tỷ lệ biến động nhân sự tự nhiên và chủ động (Turnover Rate)',
        'Dự báo chi phí lương và ngân sách thặng dư / thâm hụt',
        'Khuyến nghị điều chỉnh định biên cho từng khối nghiệp vụ'
      ],
      dataItemsEn: [
        'Actual vs Planned Headcount Variance Delta',
        'Voluntary & Involuntary Turnover Metrics',
        'Labor Cost Forecast & Surplus/Deficit Analysis',
        'Headcount reallocation recommendations'
      ],
      controls: [
        'Số liệu báo cáo phải có snapshot đối soát lịch sử không bị thay đổi hồi tố'
      ],
      controlsEn: [
        'Reports backed by immutable point-in-time historical audit snapshots'
      ],
      exceptions: [
        'Vượt ngân sách People Cost toàn công ty: Kích hoạt chính sách đóng băng tuyển dụng (Hiring Freeze).'
      ],
      exceptionsEn: [
        'Over-budget cost overrun: Trigger automated enterprise hiring freeze.'
      ],
      relatedWorkflowIds: ['MODULE-ORG-RPT', 'MODULE-ORG-HC'],
      relatedSopCodes: ['RPT-01', 'HC-01'],
      connectionKind: 'feedback'
    }
  ]
}
