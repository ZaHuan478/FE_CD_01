import type { LifecycleStageDefinition, ScenarioDefinition, LifecycleStageId } from './types'

export const LIFECYCLE_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'all',
    title: 'Tất cả vòng đời',
    subtitle: 'Toàn bộ 8 chặng từ Hoạch định đến Đóng hồ sơ',
    description: 'Bao quát toàn cảnh 8 chặng nối tiếp trong vòng đời nhân sự, thể hiện dòng chảy dữ liệu liên tục và các mốc chuyển giao trạng thái.',
    highlightStages: ['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'],
    primaryEntryStage: 'LIFE-00',
    impactedModules: ['Định biên', 'Tuyển dụng', 'Hồ sơ', 'Tổ chức', 'Hợp đồng', 'Lương', 'BHXH', 'Thuế', 'Chấm công', 'Nghỉ việc']
  },
  {
    id: 'new-hire',
    title: 'Tuyển mới và gia nhập',
    subtitle: 'Luồng tuyển dụng và Onboarding chuẩn mực (LIFE-00 ➔ LIFE-05)',
    description: 'Từ lúc phát sinh yêu cầu tuyển dụng trong hạn mức định biên, tiếp nhận ứng viên trúng tuyển, lập hồ sơ số, gán vị trí, ký hợp đồng và cấu hình đãi ngộ.',
    highlightStages: ['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06'],
    primaryEntryStage: 'LIFE-00',
    impactedModules: ['Tuyển dụng (ATS)', 'Onboarding', 'Hồ sơ (EMP)', 'Cơ cấu tổ chức (ORG)', 'Hợp đồng', 'Lương (PAY)', 'Bảo hiểm (INS)', 'Thuế (TAX)', 'Tài sản & IT']
  },
  {
    id: 'direct-hire',
    title: 'Tiếp nhận trực tiếp',
    subtitle: 'Tiếp nhận không qua ATS đầy đủ (Bắt đầu từ LIFE-01 hoặc LIFE-02)',
    description: 'Áp dụng cho trường hợp tiếp nhận lao động thời vụ, chuyên gia được chỉ định, hoặc chuyển giao nội bộ mà không cần qua quy trình đăng tuyển và phỏng vấn ATS.',
    highlightStages: ['LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06'],
    primaryEntryStage: 'LIFE-01',
    impactedModules: ['Hồ sơ nhân sự (EMP)', 'Cơ cấu tổ chức (ORG)', 'Hợp đồng lao động', 'Lương & Phúc lợi', 'Hành chính & IT']
  },
  {
    id: 'transfer',
    title: 'Điều chuyển hoặc bổ nhiệm',
    subtitle: 'Biến động công tác nội bộ phát sinh tại LIFE-06 tác động đa phân hệ',
    description: 'Sự kiện biến động tại LIFE-06 liên kết cập nhật ngược vị trí công tác (LIFE-03), phụ lục hợp đồng (LIFE-04), mức lương & trạm chi phí (LIFE-05), phân ca (ATT) và quyền truy cập.',
    highlightStages: ['LIFE-06', 'LIFE-03', 'LIFE-04', 'LIFE-05'],
    primaryEntryStage: 'LIFE-06',
    impactedModules: ['Quá trình công tác', 'Vị trí & Org Chart', 'Phụ lục HĐLĐ', 'Lương (Prorate)', 'Chấm công (Ca làm việc)', 'Phân quyền & Workflow']
  },
  {
    id: 'offboarding',
    title: 'Nghỉ việc và quyết toán',
    subtitle: 'Thanh lý quan hệ lao động và đóng hồ sơ (LIFE-07)',
    description: 'Tiếp nhận yêu cầu thôi việc, kiểm soát thời gian báo trước, thu hồi tài sản, chốt ngày công/phép tồn, quyết toán lương cuối cùng, báo giảm BHXH và thu hồi quyền truy cập.',
    highlightStages: ['LIFE-06', 'LIFE-07'],
    primaryEntryStage: 'LIFE-07',
    impactedModules: ['Nghỉ việc & Đóng hồ sơ', 'Chấm công (Phép tồn)', 'Lương (Bảng lương cuối)', 'Bảo hiểm (Báo giảm)', 'Thuế (Chứng từ TNCN)', 'Thu hồi quyền IT', 'Bàn giao tài sản']
  }
]

export const LIFECYCLE_STAGES: Record<LifecycleStageId, LifecycleStageDefinition> = {
  'LIFE-00': {
    id: 'LIFE-00',
    code: 'EMP01',
    title: 'Định biên nhân sự',
    shortTitle: 'Định biên',
    oneLineSummary: 'Hoạch định số lượng nhân sự, ngân sách quỹ lương và chỉ tiêu tuyển dụng cho từng phòng ban theo năm.',
    primaryActor: 'Trưởng bộ phận (TBP)',
    approverActor: 'HRBP (Tham vấn) & Ban Giám Đốc (BOD - Phê duyệt)',
    executorActor: 'Chuyên viên C&B (Cập nhật Master Data)',
    primarySubsystem: 'Quản trị tổ chức (ORG)',
    relatedSubsystems: ['Tuyển dụng (ATS)', 'Tiền lương (PAY)', 'Từ điển danh mục (MD)'],
    triggerContext: 'Phát sinh vào chu kỳ lập kế hoạch đầu năm hoặc khi doanh nghiệp mở rộng quy mô, thành lập đơn vị mới cần phê duyệt ngân sách nhân sự (People Cost).',
    purpose: 'Xác lập trần hạn mức nhân sự và ngân sách tiền lương cho từng đơn vị, làm căn cứ bắt buộc để kiểm soát không cho phép tuyển dụng vượt định biên.',
    prerequisites: [
      'Kế hoạch sản xuất kinh doanh năm của doanh nghiệp',
      'Cơ cấu tổ chức & Cây danh mục chức danh chuẩn hóa',
      'Ngân sách quỹ lương dự kiến (People Cost)',
      'Tỷ lệ biến động nhân sự và thâm niên năm trước'
    ],
    processActions: [
      'Trưởng bộ phận lập bảng đề xuất định biên 12 tháng theo chức danh trên Portal',
      'HRBP thẩm định tính khả thi và đối soát với chiến lược nhân sự',
      'Ban Giám Đốc (BOD) xem xét và ký số phê duyệt định biên chính thức',
      'Chuyên viên C&B cập nhật hạn mức vào hệ thống để tự động khóa trần tuyển dụng'
    ],
    deliverables: [
      'Bản kế hoạch định biên nhân sự đã được phê duyệt chính thức',
      'Hạn mức chỉ tiêu tuyển dụng phân bổ theo từng phòng ban và tháng',
      'Khung ngân sách chi phí nhân sự (People Cost) làm trần kiểm soát'
    ],
    statusTransitions: [
      {
        dimension: 'HeadcountPlan',
        from: 'Proposed (Đề xuất)',
        to: 'Approved (Đã phê duyệt)',
        note: 'Chỉ tiêu định biên được kích hoạt trên hệ thống'
      },
      {
        dimension: 'PositionBudget',
        from: 'Draft (Dự thảo)',
        to: 'Available (Sẵn sàng mở tuyển)',
        note: 'Hạn mức ngân sách vị trí sẵn sàng nhận yêu cầu tuyển dụng'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Quy chế Quản trị Doanh nghiệp & Kế hoạch Nhân sự',
        articles: 'Quy định nội bộ về Thẩm quyền phê duyệt Ngân sách',
        contentSummary: 'Căn cứ pháp lý chi tiết đang được bổ sung và cần xác nhận.',
        effectiveDate: '01/01/2026',
        status: 'Cần xác nhận',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Hạn mức định biên và ngân sách People Cost được kích hoạt',
        targetModule: 'Tuyển dụng (ATS)',
        impactType: 'Cập nhật Master Data',
        effectiveTiming: 'Tức thì',
        condition: 'Bản định biên có chữ ký số phê duyệt của BOD',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-01 (EMP01.05)'
      },
      {
        dataChange: 'Trần chi phí lương theo phòng ban',
        targetModule: 'Tiền lương & Tài chính (PAY)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Bản định biên đã chốt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-01 (EMP01.04)'
      }
    ],
    wireframeId: 'WF-LIFE-00'
  },

  'LIFE-01': {
    id: 'LIFE-01',
    code: 'EMP02.01',
    title: 'Tiếp nhận nhân viên mới',
    shortTitle: 'Tiếp nhận',
    oneLineSummary: 'Tiếp nhận ứng viên trúng tuyển, khởi tạo mã nhân viên, cấp tài khoản và chuẩn bị trang thiết bị làm việc.',
    primaryActor: 'Chuyên viên Tuyển dụng / Onboarding',
    approverActor: 'Trưởng bộ phận tiếp nhận (Duyệt kế hoạch tiếp nhận)',
    executorActor: 'Hành chính IT & Chuyên viên Nhân sự',
    primarySubsystem: 'Tuyển dụng & Onboarding (ATS)',
    relatedSubsystems: ['Hồ sơ nhân sự (EMP)', 'Hành chính IT', 'Đào tạo (LND)'],
    triggerContext: 'Ứng viên xác nhận đồng ý Thư mời nhận việc (Offer Letter), chuẩn bị đến làm việc chính thức tại doanh nghiệp vào ngày tiếp nhận.',
    purpose: 'Chuyển giao thông tin từ trạng thái ứng viên sang bản ghi nhân viên ban đầu, tự động kích hoạt checklist bàn giao máy tính, tài khoản và đào tạo hội nhập.',
    prerequisites: [
      'Thư mời nhận việc (Offer Letter) đã được ứng viên ký xác nhận',
      'Thông tin trúng tuyển từ phân hệ Tuyển dụng (Họ tên, CCCD, Vị trí, Mức lương thỏa thuận)',
      'Phiếu yêu cầu cấp phát tài khoản email, domain và trang thiết bị làm việc',
      'Ngày bắt đầu nhận việc chính thức được xác định'
    ],
    processActions: [
      'Tiếp nhận ứng viên tại văn phòng vào ngày đầu tiên đi làm',
      'Hệ thống tự động sinh Mã nhân viên (Employee ID) duy nhất',
      'Gửi ticket tự động tới IT/Hành chính để bàn giao máy tính, thẻ nhân viên',
      'Kích hoạt luồng đào tạo hội nhập (Onboarding Training) cho nhân viên mới'
    ],
    deliverables: [
      'Mã định danh nhân viên (Employee ID) chính thức',
      'Tài khoản làm việc, email doanh nghiệp và quyền truy cập ban đầu',
      'Biên bản bàn giao trang thiết bị và tài sản ban đầu',
      'Kế hoạch thử việc và chỉ tiêu đánh giá thử việc'
    ],
    statusTransitions: [
      {
        dimension: 'CandidateStatus',
        from: 'Offered (Đã gửi Offer)',
        to: 'Hired (Đã tuyển dụng)',
        note: 'Đóng hồ sơ ứng viên tại ATS và chuyển dữ liệu sang Core EMP'
      },
      {
        dimension: 'OnboardingStatus',
        from: 'NotStarted (Chưa bắt đầu)',
        to: 'Preparing (Đang chuẩn bị tiếp nhận)',
        note: 'Kích hoạt danh mục checklist chuẩn bị tài sản và tài khoản'
      },
      {
        dimension: 'EmploymentStatus',
        from: 'Preboarding (Chờ nhận việc)',
        to: 'Probation (Đang thử việc)',
        note: 'Hồ sơ chuyển sang trạng thái lao động thử việc có ngày bắt đầu'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Quy trình Tiếp nhận & Thỏa thuận tuyển dụng',
        articles: 'Thư mời làm việc & Thỏa thuận gia nhập',
        contentSummary: 'Căn cứ pháp lý chi tiết đang được bổ sung và cần xác nhận.',
        effectiveDate: '01/01/2026',
        status: 'Cần xác nhận',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Mã nhân viên (Employee ID) và thông tin định danh',
        targetModule: 'Hồ sơ nhân sự (Core EMP)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Tức thì',
        condition: 'Ứng viên xác nhận nhận việc thực tế',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-REC-01 / SOP-EMP-02'
      },
      {
        dataChange: 'Yêu cầu cấp phát tài khoản email, domain, máy tính',
        targetModule: 'Hành chính & Kỹ thuật IT',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Trước ngày nhận việc 1-2 ngày',
        condition: 'Offer Letter đã duyệt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-REC-05'
      }
    ],
    wireframeId: 'WF-LIFE-01'
  },

  'LIFE-02': {
    id: 'LIFE-02',
    code: 'EMP04',
    title: 'Tạo hồ sơ nhân viên',
    shortTitle: 'Tạo hồ sơ',
    oneLineSummary: 'Thu thập, số hóa và lưu trữ đầy đủ hồ sơ lý lịch, giấy tờ pháp lý, người phụ thuộc và thông tin tài khoản ngân hàng.',
    primaryActor: 'Nhân viên mới (Tự khai báo Self-Service) & HR Admin',
    approverActor: 'Chuyên viên Nhân sự (Đối soát & Thẩm định chứng từ)',
    executorActor: 'HR Admin (Lưu trữ số hóa & Khóa hồ sơ chính thức)',
    primarySubsystem: 'Hồ sơ nhân sự (Core EMP)',
    relatedSubsystems: ['Thuế TNCN (TAX)', 'Ngân hàng chi trả lương', 'Kho tài liệu số (DOC)'],
    triggerContext: 'Nhân viên mới đăng nhập Employee Portal để khai báo thông tin lý lịch cá nhân và tải lên các giấy tờ tùy thân chứng thực.',
    purpose: 'Xây dựng bản ghi hồ sơ nhân sự chuẩn mực (Single Source of Truth), tích hợp thông tin thuế, người phụ thuộc và tài khoản thanh toán lương.',
    prerequisites: [
      'Bản scan CCCD / Hộ chiếu còn hạn sử dụng',
      'Sơ yếu lý lịch, Bằng cấp học vấn, Chứng chỉ chuyên môn',
      'Hồ sơ đăng ký người phụ thuộc giảm trừ gia cảnh kèm giấy khai sinh',
      'Số tài khoản ngân hàng chính chủ để chi trả lương'
    ],
    processActions: [
      'Nhân viên tự điền thông tin cá nhân và tải file đính kèm qua Portal',
      'HR Admin đối chiếu tính chính xác giữa bản scan và hồ sơ bản cứng',
      'Xác nhận thông tin mã số thuế và đăng ký người phụ thuộc',
      'Lưu trữ điện tử an toàn và cấp quyền xem hồ sơ cá nhân'
    ],
    deliverables: [
      'Hồ sơ nhân sự số hóa hoàn chỉnh có xác thực',
      'Mã số thuế thu nhập cá nhân (PIT) và danh sách người phụ thuộc hợp lệ',
      'Thông tin tài khoản ngân hàng đã được kiểm tra khớp tên'
    ],
    statusTransitions: [
      {
        dimension: 'OnboardingStatus',
        from: 'Preparing (Đang chuẩn bị)',
        to: 'Ready (Hồ sơ đầy đủ & Sẵn sàng ký HĐ)',
        note: 'Hoàn tất bước thu thập hồ sơ pháp lý bắt buộc'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Quy định về Quản lý Hồ sơ lao động & Bảo vệ dữ liệu cá nhân',
        articles: 'Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân',
        contentSummary: 'Căn cứ pháp lý chi tiết đang được bổ sung và cần xác nhận.',
        effectiveDate: '01/07/2023',
        status: 'Cần xác nhận',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Mã số thuế cá nhân & Hồ sơ người phụ thuộc',
        targetModule: 'Thuế TNCN (TAX)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Chứng từ người phụ thuộc được HR duyệt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-04'
      },
      {
        dataChange: 'Số tài khoản ngân hàng và chi nhánh',
        targetModule: 'Tiền lương & Ngân hàng (PAY)',
        impactType: 'Cập nhật Master Data',
        effectiveTiming: 'Tức thì',
        condition: 'Tên chủ tài khoản trùng khớp họ tên nhân viên',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-04'
      }
    ],
    wireframeId: 'WF-LIFE-02'
  },

  'LIFE-03': {
    id: 'LIFE-03',
    code: 'EMP02.01',
    title: 'Bố trí công tác và vị trí',
    shortTitle: 'Bố trí vị trí',
    oneLineSummary: 'Gán nhân viên vào sơ đồ tổ chức, xác định phòng ban trực thuộc, chức danh, tuyến báo cáo và địa điểm làm việc.',
    primaryActor: 'Trưởng bộ phận (Đề xuất vị trí công tác)',
    approverActor: 'Giám đốc Khối / HRD (Phê duyệt quyết định)',
    executorActor: 'HR Admin (Cập nhật vị trí trên Cây tổ chức Org Chart)',
    primarySubsystem: 'Cơ cấu tổ chức (ORG)',
    relatedSubsystems: ['Chấm công (ATT)', 'Tiền lương (PAY)', 'Hồ sơ nhân sự (EMP)'],
    triggerContext: 'Nhân viên mới cần được xếp vào ghế vị trí cụ thể trong phòng ban, hoặc khi phát sinh nhu cầu phân công nhiệm vụ chuyên môn.',
    purpose: 'Định vị chính xác nhân viên trên cây sơ đồ tổ chức (Org Chart), xác lập cấp quản lý trực tiếp (Reporting Line), vùng làm việc và đối tượng chấm công.',
    prerequisites: [
      'Mã vị trí công tác còn trống trong định biên đã duyệt (LIFE-00)',
      'Chức danh chuyên môn, Chức vụ quản lý và Cấp bậc (Level)',
      'Tuyến báo cáo công việc (người quản lý trực tiếp duyệt đơn từ)',
      'Địa điểm làm việc cố định và Trạm chi phí (Cost Center)'
    ],
    processActions: [
      'Chọn vị trí công tác khả dụng trên sơ đồ cây tổ chức',
      'Gán chức danh chuyên môn và chỉ định người phê duyệt trực tiếp',
      'Thiết lập vùng lương (Vùng I - IV) và Cost Center tương ứng',
      'Kích hoạt vị trí công tác và cập nhật phân quyền hệ thống'
    ],
    deliverables: [
      'Bản ghi vị trí công tác chính thức có hiệu lực trên sơ đồ tổ chức',
      'Tuyến báo cáo phê duyệt (Reporting Line) được cấu hình tự động',
      'Phân ca làm việc và đối tượng chấm công mặc định'
    ],
    statusTransitions: [
      {
        dimension: 'AssignmentStatus',
        from: 'Planned (Đã quy hoạch)',
        to: 'Active (Đang đảm nhiệm)',
        note: 'Ghế vị trí trên sơ đồ Org Chart chuyển sang trạng thái đã lấp đầy'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Quy chế Tổ chức & Phân cấp thẩm quyền',
        articles: 'Quy định chức danh & Quản trị vị trí việc làm',
        contentSummary: 'Căn cứ pháp lý chi tiết đang được bổ sung và cần xác nhận.',
        effectiveDate: '01/01/2026',
        status: 'Cần xác nhận',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Đối tượng chấm công và ca làm việc mặc định',
        targetModule: 'Chấm công (ATT)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Vị trí công tác đã duyệt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-ATT-01'
      },
      {
        dataChange: 'Trạm chi phí (Cost Center) và Phụ cấp chức vụ',
        targetModule: 'Tiền lương (PAY)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Vị trí công tác gắn liền phụ cấp',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-PAY-01'
      }
    ],
    wireframeId: 'WF-LIFE-03'
  },

  'LIFE-04': {
    id: 'LIFE-04',
    code: 'EMP06',
    title: 'Hợp đồng lao động',
    shortTitle: 'Hợp đồng',
    oneLineSummary: 'Soạn thảo, trình ký số và quản lý hợp đồng thử việc, hợp đồng xác định thời hạn hoặc không xác định thời hạn.',
    primaryActor: 'Chuyên viên C&B / Quan hệ lao động',
    approverActor: 'Đại diện pháp luật doanh nghiệp / Người được ủy quyền',
    executorActor: 'Nhân viên (Ký xác nhận) & Chuyên viên C&B (Lưu trữ)',
    primarySubsystem: 'Hợp đồng lao động (Contract Hub)',
    relatedSubsystems: ['Bảo hiểm xã hội (INS)', 'Tiền lương (PAY)', 'Cảnh báo tự động (ALM)'],
    triggerContext: 'Ký Hợp đồng thử việc khi tiếp nhận hoặc ký Hợp đồng lao động chính thức sau khi đánh giá thử việc Đạt.',
    purpose: 'Xác lập quan hệ lao động hợp pháp theo Bộ luật Lao động, làm căn cứ pháp lý để chi trả lương, đóng bảo hiểm và giải quyết quyền lợi.',
    prerequisites: [
      'Loại hợp đồng (Thử việc / Xác định thời hạn / Không xác định thời hạn)',
      'Thời hạn hợp đồng, Ngày bắt đầu và Ngày kết thúc hiệu lực',
      'Mức lương chính và các khoản phụ cấp ghi nhận trên hợp đồng',
      'Vị trí công tác đã được xác lập tại LIFE-03'
    ],
    processActions: [
      'Khởi tạo hồ sơ hợp đồng theo biểu mẫu quy chuẩn của doanh nghiệp',
      'Trình ký số tới Đại diện pháp luật doanh nghiệp',
      'Gửi văn bản tới nhân viên để ký số hoặc ký giấy bản cứng',
      'Kích hoạt lịch tự động cảnh báo đáo hạn trước 30/45 ngày'
    ],
    deliverables: [
      'Hợp đồng lao động chính thức có chữ ký đầy đủ hai bên',
      'Lịch cảnh báo tự động khi hợp đồng sắp hết hạn',
      'Hồ sơ hợp đồng số hóa lưu trữ trong kho dữ liệu'
    ],
    statusTransitions: [
      {
        dimension: 'ContractStatus',
        from: 'Draft (Dự thảo)',
        to: 'Active (Có hiệu lực)',
        note: 'Sau khi hai bên hoàn tất ký số và hợp đồng đến ngày hiệu lực'
      },
      {
        dimension: 'EmploymentStatus',
        from: 'Preboarding (Chờ nhận việc)',
        to: 'Probation (Thử việc) hoặc Active (Chính thức)',
        note: 'Tùy thuộc loại hợp đồng được giao kết'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14',
        articles: 'Điều 13, Điều 14',
        contentSummary: 'Quy định về Giao kết hợp đồng lao động và Hình thức hợp đồng lao động (bằng văn bản hoặc thông điệp dữ liệu điện tử).',
        effectiveDate: '01/01/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      },
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14',
        articles: 'Điều 20, Điều 21',
        contentSummary: 'Quy định về 02 loại hợp đồng lao động (Xác định thời hạn tối đa 36 tháng và Không xác định thời hạn); Nội dung chủ yếu bắt buộc của hợp đồng.',
        effectiveDate: '01/01/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      },
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14',
        articles: 'Điều 24, Điều 25, Điều 26, Điều 27',
        contentSummary: 'Quy định về Thử việc: Thời gian thử việc theo trình độ (tối đa 180 ngày với quản lý, 60 ngày với đại học, 30 ngày với trung cấp), Tiền lương thử việc tối thiểu 85% lương chính thức và Kết thúc thời gian thử việc.',
        effectiveDate: '01/01/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Kích hoạt nhiệm vụ thiết lập lương và ngạch bậc',
        targetModule: 'Tiền lương (PAY)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Hợp đồng lao động đã ký',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-06'
      },
      {
        dataChange: 'Tạo hồ sơ BHXH ở trạng thái chờ kiểm tra đối tượng',
        targetModule: 'Bảo hiểm xã hội (INS)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Hợp đồng thuộc đối tượng tham gia BHXH bắt buộc',
        handoverStatus: 'Chờ kiểm tra & duyệt',
        sourceSop: 'SOP-INS-01'
      },
      {
        dataChange: 'Cập nhật thông tin hợp đồng và ngày hết hạn',
        targetModule: 'Hồ sơ nhân sự (Core EMP)',
        impactType: 'Cập nhật Master Data',
        effectiveTiming: 'Tức thì',
        condition: 'Hợp đồng hoàn thành ký số',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-06'
      }
    ],
    wireframeId: 'WF-LIFE-04'
  },

  'LIFE-05': {
    id: 'LIFE-05',
    code: 'PAY01',
    title: 'Lương, BHXH và Thuế TNCN',
    shortTitle: 'Lương & Chế độ',
    oneLineSummary: 'Thiết lập tham số tiền lương, mức trích đóng bảo hiểm xã hội bắt buộc và biểu tính thuế TNCN.',
    primaryActor: 'Chuyên viên C&B (Thiết lập tham số)',
    approverActor: 'Trưởng phòng Nhân sự (HRM) / Kế toán trưởng (Thẩm định & Khóa cấu hình)',
    executorActor: 'Payroll & Compliance Engine (Tính toán tự động định kỳ)',
    primarySubsystem: 'Lương & Phúc lợi (C&B Hub)',
    relatedSubsystems: ['Bảo hiểm xã hội (INS)', 'Thuế TNCN (TAX)', 'Tiền lương (PAY)'],
    triggerContext: 'Sau khi ký kết hợp đồng lao động, thiết lập đầy đủ các thông số thu nhập, ngạch bậc lương và chính sách trích nộp bắt buộc.',
    purpose: 'Đảm bảo dữ liệu tiền lương, tỷ lệ bảo hiểm và biểu thuế được tính toán chính xác tuyệt đối, tuân thủ đúng quy định pháp luật hiện hành.',
    prerequisites: [
      'Mức lương căn bản và phụ cấp thỏa thuận trên hợp đồng lao động',
      'Ngạch bậc lương và đối tượng trả lương (Thời gian / Khoán / Doanh số)',
      'Đối tượng tham gia BHXH/BHYT/BHTN và số sổ BHXH đã có',
      'Mã số thuế cá nhân và số lượng người phụ thuộc đã xác thực'
    ],
    processActions: [
      'Gán ngạch bậc lương, thang bảng lương và mức lương đóng BHXH',
      'Cấu hình danh mục các khoản phụ cấp cố định và phụ cấp biến đổi',
      'Xác lập tỷ lệ trích nộp BHXH/BHYT/BHTN của người lao động và doanh nghiệp',
      'Khóa cấu hình đãi ngộ cá nhân và sẵn sàng cho chu kỳ tính lương'
    ],
    deliverables: [
      'Bảng tham số đãi ngộ cá nhân hoàn chỉnh phục vụ chạy bảng lương',
      'Hồ sơ bảo hiểm cá nhân ghi nhận mức đóng và tình trạng tham gia',
      'Cấu hình biểu thuế TNCN lũy tiến từng phần sẵn sàng khấu trừ'
    ],
    statusTransitions: [
      {
        dimension: 'PayrollStatus',
        from: 'Pending (Chờ cấu hình)',
        to: 'Active (Sẵn sàng tính lương)',
        note: 'Tham số lương đã được thẩm định và khóa'
      },
      {
        dimension: 'InsuranceStatus',
        from: 'PendingIncrease (Chờ báo tăng)',
        to: 'Participating (Đang tham gia)',
        note: 'Sau khi hoàn tất thủ tục báo tăng với cơ quan BHXH'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Luật Bảo hiểm xã hội số 41/2024/QH15',
        articles: 'Điều 31, Điều 32, Điều 33, Điều 34',
        contentSummary: 'Quy định về Tiền lương làm căn cứ đóng BHXH bắt buộc, Tỷ lệ đóng, Mức đóng, Phương thức và Thời hạn đóng BHXH (Hiệu lực thi hành từ ngày 01/07/2025).',
        effectiveDate: '01/07/2025',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vbpl.vn/bongoaigiao/Pages/vbpq-toanvan.aspx?ItemID=175027',
        lastUpdated: '2026-08-27'
      },
      {
        lawDocument: 'Luật Thuế Thu nhập cá nhân & Các văn bản hướng dẫn',
        articles: 'Biểu thuế lũy tiến từng phần & Giảm trừ gia cảnh',
        contentSummary: 'Quy định về thu nhập chịu thuế từ tiền lương, tiền công, mức giảm trừ gia cảnh cho bản thân và người phụ thuộc.',
        effectiveDate: '01/01/2026',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vbpl.moj.gov.vn/bocongthuong/Pages/vbpq-vanbanlienquan.aspx?ItemID=139264',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Tham số tiền lương và phụ cấp',
        targetModule: 'Tiền lương (PAY)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Cấu hình lương đã được duyệt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-PAY-01'
      },
      {
        dataChange: 'Mức lương căn cứ đóng BHXH',
        targetModule: 'Bảo hiểm xã hội (INS)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Người lao động thuộc diện đóng bảo hiểm',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-INS-01'
      }
    ],
    wireframeId: 'WF-LIFE-05'
  },

  'LIFE-06': {
    id: 'LIFE-06',
    code: 'EMP11',
    title: 'Quá trình làm việc và biến động',
    shortTitle: 'Biến động công tác',
    oneLineSummary: 'Ghi nhận toàn bộ diễn tiến làm việc: điều chuyển, bổ nhiệm, nâng lương, khen thưởng, kỷ luật và biến động công tác.',
    primaryActor: 'Hệ thống HRM Engine & Trưởng đơn vị',
    approverActor: 'Ban Giám Đốc / Giám đốc Khối (Phê duyệt quyết định)',
    executorActor: 'HR Admin & C&B Specialist (Cập nhật lịch sử không ghi đè)',
    primarySubsystem: 'Quản trị biến động (Talent & Movement Hub)',
    relatedSubsystems: ['Cơ cấu tổ chức (ORG)', 'Tiền lương (PAY)', 'Chấm công (ATT)', 'Báo cáo BI'],
    triggerContext: 'Phát sinh trong suốt thời gian nhân sự công tác tại doanh nghiệp: tăng lương định kỳ, điều chuyển phòng ban, bổ nhiệm chức vụ hoặc khen thưởng kỷ luật.',
    purpose: 'Lưu giữ nhật ký điện tử bất biến (Audit Trail) về toàn bộ quá trình thâm niên, đảm bảo tính liên tục và cung cấp dữ liệu cho quy hoạch nhân sự.',
    prerequisites: [
      'Quyết định điều chuyển / bổ nhiệm / nâng lương đã được ký ban hành',
      'Ngày hiệu lực áp dụng của quyết định',
      'Đơn vị tiếp nhận, Chức danh mới và Mức lương mới (nếu có thay đổi)'
    ],
    processActions: [
      'Ghi nhận sự kiện biến động gắn liền với Mã quyết định và Timestamp',
      'Cập nhật vị trí mới trên Cây tổ chức và điều chỉnh tuyến báo cáo',
      'Điều chỉnh cấu hình lương mới (tính prorate ngày công nếu giữa tháng)',
      'Tổng hợp dữ liệu phục vụ báo cáo biến động nhân sự'
    ],
    deliverables: [
      'Sổ tay điện tử lịch sử quá trình công tác (Job & Salary History)',
      'Phụ lục hợp đồng lao động tương ứng với nội dung thay đổi',
      'Dữ liệu biến động cập nhật sang Chấm công, Lương và Phân quyền'
    ],
    statusTransitions: [
      {
        dimension: 'EmploymentStatus',
        from: 'Active (Đang làm việc)',
        to: 'Active (Đang làm việc - Đã ghi nhận biến động)',
        note: 'Trạng thái lao động vẫn duy trì Active, ghi nhận thêm bản ghi lịch sử mới'
      },
      {
        dimension: 'AssignmentStatus',
        from: 'Active (Vị trí cũ)',
        to: 'Transferred (Đã điều chuyển) ➔ Active (Vị trí mới)',
        note: 'Khi phát sinh quyết định điều động hoặc bổ nhiệm'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14 & Quy chế Doanh nghiệp',
        articles: 'Điều 29 (Chuyển người lao động làm công việc khác), Điều 33 (Sửa đổi, bổ sung HĐLĐ)',
        contentSummary: 'Căn cứ pháp lý chi tiết đang được bổ sung và cần xác nhận.',
        effectiveDate: '01/01/2021',
        status: 'Cần xác nhận',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Vị trí công tác, đơn vị, quản lý trực tiếp mới',
        targetModule: 'Cơ cấu tổ chức & Phân quyền (ORG)',
        impactType: 'Cập nhật Master Data',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Quyết định bổ nhiệm/điều chuyển có hiệu lực',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-EMP-11'
      },
      {
        dataChange: 'Mức lương mới (Tính prorate ngày công theo ngày hiệu lực)',
        targetModule: 'Tiền lương (PAY)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Quyết định nâng lương đã duyệt',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-PAY-02'
      }
    ],
    wireframeId: 'WF-LIFE-06'
  },

  'LIFE-07': {
    id: 'LIFE-07',
    code: 'EMP15',
    title: 'Nghỉ việc và đóng hồ sơ',
    shortTitle: 'Nghỉ việc & Bàn giao',
    oneLineSummary: 'Tiếp nhận đơn thôi việc, kiểm soát bàn giao tài sản, quyết toán lương cuối cùng, báo giảm BHXH và đóng hồ sơ.',
    primaryActor: 'Nhân viên thôi việc & Trưởng bộ phận',
    approverActor: 'Ban Giám Đốc (Phê duyệt Quyết định thôi việc)',
    executorActor: 'IT, Hành chính, Kế toán (Thu hồi tài sản) ➔ C&B (Đóng hồ sơ)',
    primarySubsystem: 'Nghỉ việc & Đóng hồ sơ (Offboarding Hub)',
    relatedSubsystems: ['Chấm công (ATT)', 'Tiền lương (PAY)', 'Bảo hiểm xã hội (INS)', 'Hệ thống IT'],
    triggerContext: 'Nhân viên nộp đơn xin thôi việc hoặc doanh nghiệp chấm dứt hợp đồng lao động theo các căn cứ quy định của pháp luật.',
    purpose: 'Hoàn tất thủ tục thanh lý hợp đồng đúng pháp luật, thu hồi tài sản, chi trả đầy đủ chế độ trợ cấp thôi việc và đóng tài khoản an toàn.',
    prerequisites: [
      'Đơn xin thôi việc hoặc Thông báo chấm dứt hợp đồng lao động',
      'Ngày làm việc cuối cùng và lý do chấm dứt (Tự nguyện / Hết hạn HĐ / Thỏa thuận / Sa thải / Hưu trí)',
      'Kiểm tra thời gian báo trước (30 ngày HĐ có thời hạn, 45 ngày HĐ không thời hạn)',
      'Phiếu kiểm soát bàn giao (Clearance Checklist): Thu máy tính, thẻ, chốt công nợ'
    ],
    processActions: [
      'Tiếp nhận và kiểm tra tính hợp lệ về thời hạn báo trước của đơn thôi việc',
      'Ban hành Quyết định chấm dứt hợp đồng lao động và gửi các bộ phận liên quan',
      'Kích hoạt quy trình bàn giao tài sản, thu hồi quyền truy cập hệ thống',
      'Quyết toán bảng lương cuối cùng (ngày công, phép tồn, trợ cấp) và báo giảm BHXH'
    ],
    deliverables: [
      'Quyết định thôi việc chính thức và Biên bản thanh lý hợp đồng lao động',
      'Bảng thanh toán lương cuối cùng kèm tiền trợ cấp thôi việc/phép tồn',
      'Hồ sơ báo giảm BHXH và xác nhận trả sổ BHXH cho người lao động',
      'Xác nhận thu hồi 100% tài khoản hệ thống và tài sản công ty'
    ],
    statusTransitions: [
      {
        dimension: 'EmploymentStatus',
        from: 'Active (Đang làm việc)',
        to: 'Terminated (Đã chấm dứt quan hệ lao động)',
        note: 'Lý do kết thúc ghi nhận chi tiết theo từng trường hợp pháp lý'
      },
      {
        dimension: 'ContractStatus',
        from: 'Active (Có hiệu lực)',
        to: 'Ended (Đã kết thúc / Thanh lý)',
        note: 'Khóa hợp đồng lao động'
      },
      {
        dimension: 'AssignmentStatus',
        from: 'Active (Đang đảm nhiệm)',
        to: 'Ended (Đã giải phóng)',
        note: 'Ghế vị trí trên sơ đồ Org Chart chuyển sang trạng thái trống để mở tuyển'
      },
      {
        dimension: 'PayrollStatus',
        from: 'Active (Đang nhận lương)',
        to: 'FinalSettlement (Quyết toán cuối) ➔ Closed (Đã đóng)',
        note: 'Sau khi hoàn tất chi trả bảng lương thanh lý'
      },
      {
        dimension: 'InsuranceStatus',
        from: 'Participating (Đang tham gia)',
        to: 'PendingDecrease (Chờ báo giảm) ➔ Ended (Đã chốt sổ)',
        note: 'Báo giảm lao động với cơ quan BHXH'
      },
      {
        dimension: 'AccessStatus',
        from: 'Active (Đang hoạt động)',
        to: 'Revoked (Đã thu hồi / Vô hiệu hóa)',
        note: 'Khóa tài khoản đăng nhập vào ngày làm việc cuối cùng'
      }
    ],
    legalReferences: [
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14',
        articles: 'Điều 34, Điều 35, Điều 36',
        contentSummary: 'Quy định về Các trường hợp chấm dứt hợp đồng lao động; Quyền đơn phương chấm dứt hợp đồng của người lao động (thời hạn báo trước) và của người sử dụng lao động.',
        effectiveDate: '01/01/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      },
      {
        lawDocument: 'Bộ luật Lao động số 45/2019/QH14',
        articles: 'Điều 46, Điều 48',
        contentSummary: 'Quy định về Trợ cấp thôi việc (mỗi năm làm việc được trợ cấp 1/2 tháng tiền lương) và Trách nhiệm của các bên khi chấm dứt hợp đồng (thời hạn thanh toán 14 ngày làm việc, hoàn thành thủ tục xác nhận thời gian đóng BHXH, BHTN và trả lại hồ sơ).',
        effectiveDate: '01/01/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      },
      {
        lawDocument: 'Nghị định số 145/2020/NĐ-CP',
        articles: 'Điều 8',
        contentSummary: 'Hướng dẫn chi tiết về thời gian làm việc để tính trợ cấp thôi việc, tiền lương làm căn cứ tính trợ cấp và kinh phí chi trả.',
        effectiveDate: '01/02/2021',
        status: 'Đã đối chiếu',
        sourceUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=211199&orggroupid=1&pageid=27160',
        lastUpdated: '2026-08-27'
      }
    ],
    impactRows: [
      {
        dataChange: 'Lập danh sách Báo giảm BHXH và thủ tục chốt sổ',
        targetModule: 'Bảo hiểm xã hội (INS)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Quyết định thôi việc đã ký',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-INS-03'
      },
      {
        dataChange: 'Quyết toán phép tồn và công làm việc thực tế cuối cùng',
        targetModule: 'Chấm công (ATT)',
        impactType: 'Tự động đồng bộ',
        effectiveTiming: 'Ngày làm việc cuối',
        condition: 'Chốt ngày công thực tế',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-ATT-12'
      },
      {
        dataChange: 'Bảng lương thanh lý & Trợ cấp thôi việc',
        targetModule: 'Tiền lương (PAY)',
        impactType: 'Kích hoạt nhiệm vụ',
        effectiveTiming: 'Theo ngày hiệu lực',
        condition: 'Clearance Checklist hoàn tất',
        handoverStatus: 'Sẵn sàng bàn giao',
        sourceSop: 'SOP-PAY-02'
      },
      {
        dataChange: 'Vô hiệu hóa tài khoản đăng nhập & thu hồi quyền',
        targetModule: 'Bảo mật & Hệ thống IT',
        impactType: 'Thu hồi quyền & Khóa',
        effectiveTiming: 'Tức thì tại 17:30 ngày cuối',
        condition: 'Biên bản bàn giao ký duyệt',
        handoverStatus: 'Đã khóa & Lưu trữ',
        sourceSop: 'SOP-EMP-15'
      }
    ],
    wireframeId: 'WF-LIFE-07'
  }
}

export const LIFECYCLE_STAGE_ORDER: LifecycleStageId[] = [
  'LIFE-00',
  'LIFE-01',
  'LIFE-02',
  'LIFE-03',
  'LIFE-04',
  'LIFE-05',
  'LIFE-06',
  'LIFE-07'
]
