import type { ClusterFlowConfig } from '../types'

export const PEOPLE_FLOW_DATA: ClusterFlowConfig = {
  clusterId: 'people',
  title: 'Vòng phản hồi hiệu suất và phát triển con người',
  titleEn: 'Performance and Development Continuous Feedback Loop',
  subtitle:
    'Chu trình khép kín và liên tục từ Thiết lập mục tiêu KPI ➔ Đánh giá hiệu suất ➔ Khung năng lực & Khoảng trống ➔ Kế hoạch đào tạo ➔ Quản trị nhân tài kế nhiệm ➔ Tưởng thưởng gắn kết ➔ Phản hồi tái thiết lập mục tiêu chu kỳ mới.',
  subtitleEn:
    'Closed-loop developmental cycle connecting KPI Goal Setting, Performance Review, Competency Gap Assessment, Learning & IDP, Succession Planning, and Recognition back to next-cycle Goal Alignment.',
  nodes: [
    {
      id: 'kpi',
      code: 'KPI',
      label: 'Mục tiêu & KPI',
      labelEn: 'Goals & OKRs/KPIs',
      cluster: 'people',
      description: 'Chuyển kỳ vọng chiến lược của tổ chức thành cam kết công việc và chỉ số đo lường cho từng nhân viên.',
      descriptionEn: 'Translates strategic goals into measurable individual commitments, weights, and milestones.',
      iconName: 'Target',
      workflowId: 'MODULE-PFM',
      firstSopCode: 'PFM-02',
      nodeKind: 'business-module',
      colorToken: 'emerald'
    },
    {
      id: 'rev',
      code: 'REV',
      label: 'Đánh giá Hiệu suất',
      labelEn: 'Performance Review',
      cluster: 'people',
      description: 'Tổng kết kết quả thực hiện, đối thoại hiệu suất 1:1, tự đánh giá, đánh giá quản lý và hiệu chuẩn điểm (Calibration).',
      descriptionEn: 'Self-assessment, manager review, 1:1 performance dialogue, and rating calibration.',
      iconName: 'ClipboardCheck',
      workflowId: 'MODULE-PFM',
      firstSopCode: 'PFM-04',
      nodeKind: 'business-module',
      colorToken: 'blue'
    },
    {
      id: 'cmp',
      code: 'CMP',
      label: 'Năng lực & Kỹ năng',
      labelEn: 'Competency & Skill Matrix',
      cluster: 'people',
      description: 'So khớp mức độ thành thạo thực tế với từ điển năng lực tiêu chuẩn để xác định khoảng trống năng lực (Competency Gap).',
      descriptionEn: 'Evaluates proficiency against job competency matrix to identify gap analysis and growth areas.',
      iconName: 'BrainCircuit',
      workflowId: 'MODULE-CMP',
      firstSopCode: 'CMP-01',
      nodeKind: 'business-module',
      colorToken: 'purple'
    },
    {
      id: 'lnd',
      code: 'LND',
      label: 'Đào tạo & Phát triển (L&D)',
      labelEn: 'Learning & Development (L&D)',
      cluster: 'people',
      description: 'Thiết kế lộ trình học tập cá nhân hóa (IDP), tổ chức khóa học, đánh giá hiệu quả sau đào tạo (Kirkpatrick).',
      descriptionEn: 'Designs individual development plans (IDP), manages course delivery, and evaluates post-training impact.',
      iconName: 'GraduationCap',
      workflowId: 'MODULE-LND',
      firstSopCode: 'LND-01',
      nodeKind: 'business-module',
      colorToken: 'indigo'
    },
    {
      id: 'tal',
      code: 'TAL',
      label: 'Nhân tài & Kế nhiệm',
      labelEn: 'Talent & Succession Pool',
      cluster: 'people',
      description: 'Xếp hạng ma trận 9-Box (Hiệu suất vs Tiềm năng), xác định nhân tài chủ chốt (HiPo) và quy hoạch cán bộ nguồn.',
      descriptionEn: '9-Box talent grid mapping, identification of High Potentials (HiPo), and succession bench planning.',
      iconName: 'Trophy',
      workflowId: 'MODULE-TAL',
      firstSopCode: 'TAL-01',
      nodeKind: 'business-module',
      colorToken: 'amber'
    },
    {
      id: 'eng',
      code: 'ENG',
      label: 'Ghi nhận & Phúc lợi',
      labelEn: 'Recognition & Well-being',
      cluster: 'people',
      description: 'Khen thưởng, vinh danh cá nhân xuất sắc, khảo sát mức độ gắn kết và chế độ phúc lợi linh hoạt.',
      descriptionEn: 'Rewards and recognition, engagement pulse surveys, and flexible developmental perks.',
      iconName: 'HeartHandshake',
      workflowId: 'MODULE-ENG',
      firstSopCode: 'ENG-01',
      nodeKind: 'business-module',
      colorToken: 'rose'
    }
  ],
  connections: [
    {
      id: 'people-c1',
      from: 'kpi',
      to: 'rev',
      label: 'Bàn giao Phiếu cam kết mục tiêu & Bằng chứng',
      labelEn: 'Approved Goal Commitment & Evidence Dossier',
      description: 'Chuyển bộ chỉ tiêu KPI đã duyệt kèm kết quả Check-in giữa kỳ sang chu kỳ đánh giá chính thức.',
      descriptionEn: 'Transfers approved KPI targets, weights, and mid-term check-in notes to evaluation cycle.',
      direction: 'one-way',
      trigger: 'Mở kỳ đánh giá hiệu suất (Cuối quý / Cuối năm)',
      triggerEn: 'Performance evaluation cycle kick-off (Quarter-end / Year-end)',
      frequency: 'periodic',
      dataItems: [
        'Mã mục tiêu & Trọng số cam kết (Tổng 100%)',
        'Chỉ tiêu định lượng (Target) & Mức tối thiểu/tối đa',
        'Bằng chứng và số liệu đo lường thực tế',
        'Lịch sử Check-in tiến độ giữa kỳ'
      ],
      dataItemsEn: [
        'Goal IDs & Approved Weights (Total 100%)',
        'Quantitative Targets & Thresholds',
        'Verified delivery evidence & metrics',
        'Mid-cycle check-in progress log'
      ],
      controls: [
        'Phiếu KPI ở trạng thái Đã duyệt bởi Quản lý trực tiếp',
        'Không được chỉnh sửa trọng số sau khi kỳ đánh giá đã mở'
      ],
      controlsEn: [
        'KPI scorecard in Approved state by Line Manager',
        'Weights frozen once evaluation period is activated'
      ],
      exceptions: [
        'Mục tiêu bị hủy do thay đổi chiến lược: Yêu cầu cập nhật biên bản phê duyệt loại trừ trước khi tính điểm.'
      ],
      exceptionsEn: [
        'Cancelled strategic goals: Require formal exclusion approval prior to scoring.'
      ],
      relatedWorkflowIds: ['MODULE-PFM'],
      relatedSopCodes: ['PFM-02', 'PFM-04'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'people-c2',
      from: 'rev',
      to: 'cmp',
      label: 'Kết quả hiệu suất & Đánh giá năng lực hành vi',
      labelEn: 'Performance Rating & Behavioral Competency Evaluation',
      description: 'Chuyển điểm số hiệu suất sang phân hệ Năng lực để so sánh mối tương quan giữa Năng lực và Kết quả thực tế.',
      descriptionEn: 'Feeds performance ratings into Competency Engine to correlate competency level with actual output.',
      direction: 'one-way',
      trigger: 'Hoàn tất buổi đối thoại đánh giá và hiệu chuẩn điểm (Calibration)',
      triggerEn: 'Performance calibration session completed',
      frequency: 'periodic',
      dataItems: [
        'Xếp loại hiệu suất cuối cùng (A/B/C/D hoặc 1-5 sao)',
        'Đánh giá hành vi theo giá trị cốt lõi',
        'Ý kiến phản hồi điểm mạnh và điểm cần cải thiện',
        'Cam kết hành động của nhân viên'
      ],
      dataItemsEn: [
        'Final Performance Grade (A/B/C/D or 1-5 scale)',
        'Core values behavioral score',
        'Manager feedback on strengths & growth areas',
        'Employee developmental commitments'
      ],
      controls: [
        'Tách bạch giữa Tự đánh giá và Đánh giá của Quản lý',
        'Phân phối xếp loại tuân thủ đường cong chuẩn (Bell Curve)'
      ],
      controlsEn: [
        'Strict separation between self and manager appraisals',
        'Forced ranking distribution adheres to Bell Curve guidelines'
      ],
      exceptions: [
        'Khiếu nại kết quả đánh giá: Kích hoạt quy trình hòa giải độc lập của Hội đồng Nhân sự.'
      ],
      exceptionsEn: [
        'Appraisal dispute: Trigger independent mediation by HR Committee.'
      ],
      relatedWorkflowIds: ['MODULE-PFM', 'MODULE-CMP'],
      relatedSopCodes: ['PFM-04', 'CMP-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'people-c3',
      from: 'cmp',
      to: 'lnd',
      label: 'Khoảng trống năng lực (Gap) & Nhu cầu đào tạo',
      labelEn: 'Competency Gap Assessment & Training Needs (TNA)',
      description: 'Xác định các năng lực chưa đạt chuẩn của chức danh để đưa vào Kế hoạch phát triển cá nhân (IDP) và Lịch đào tạo.',
      descriptionEn: 'Translates identified competency gaps into individualized development plans (IDP) and course enrollments.',
      direction: 'one-way',
      trigger: 'Công bố kết quả đánh giá khoảng trống năng lực (Competency Gap Report)',
      triggerEn: 'Competency Gap Report finalized and approved',
      frequency: 'periodic',
      dataItems: [
        'Mã năng lực & Mức độ thành thạo hiện tại',
        'Mức độ yêu cầu chuẩn của vị trí (Benchmark)',
        'Khoảng cách thiếu hụt (Gap Level)',
        'Danh sách khóa học khuyến nghị & Chứng chỉ cần đạt'
      ],
      dataItemsEn: [
        'Competency Code & Current Proficiency Level',
        'Benchmark Requirement for Job Position',
        'Identified Gap Delta',
        'Recommended Course Modules & Certifications'
      ],
      controls: [
        'Khung năng lực có phiên bản hiệu lực tương ứng với Job Catalog',
        'Ưu tiên đào tạo cho các năng lực cốt lõi phục vụ sản xuất kinh doanh'
      ],
      controlsEn: [
        'Competency framework version synced with Job Catalog',
        'Priority assigned to critical core competencies'
      ],
      exceptions: [
        'Không có khóa học nội bộ đáp ứng: Đề xuất cử đi đào tạo bên ngoài kèm cam kết đào tạo.'
      ],
      exceptionsEn: [
        'No matching in-house course: Propose external training with service commitment.'
      ],
      relatedWorkflowIds: ['MODULE-CMP', 'MODULE-LND'],
      relatedSopCodes: ['CMP-01', 'LND-01'],
      connectionKind: 'dependency'
    },
    {
      id: 'people-c4',
      from: 'lnd',
      to: 'tal',
      label: 'Kết quả đào tạo, Chứng chỉ & Mức độ sẵn sàng',
      labelEn: 'Training Completion, Certifications & Readiness Score',
      description: 'Cập nhật lịch sử hoàn thành khóa học và điểm kiểm tra vào hồ sơ tiềm năng để đánh giá mức độ sẵn sàng kế nhiệm.',
      descriptionEn: 'Updates course completions and exam certifications to elevate talent bench readiness scores.',
      direction: 'one-way',
      trigger: 'Hoàn tất khóa học hoặc vượt qua kỳ sát hạch năng lực',
      triggerEn: 'Course completion or passing certification milestone',
      frequency: 'event-driven',
      dataItems: [
        'Chứng chỉ & Điểm số bài thi tốt nghiệp',
        'Đánh giá ứng dụng thực tế sau 90 ngày (Level 3 Kirkpatrick)',
        'Điểm sẵn sàng thăng tiến (Succession Readiness)',
        'Tỷ lệ hoàn thành kế hoạch IDP'
      ],
      dataItemsEn: [
        'Certification Record & Assessment Score',
        '90-day post-training application review (Level 3)',
        'Succession Promotion Readiness Index',
        'IDP completion percentage'
      ],
      controls: [
        'Chứng chỉ có ngày cấp, thời hạn hiệu lực và đơn vị cấp uy tín',
        'Đánh giá hiệu quả sau đào tạo có xác nhận của Quản lý trực tiếp'
      ],
      controlsEn: [
        'Verified issuance date and expiration on certificates',
        'Line manager sign-off on workplace knowledge transfer'
      ],
      exceptions: [
        'Không đạt bài thi sát hạch: Phải học lại hoặc bổ sung bài tập tình huống trong 30 ngày.'
      ],
      exceptionsEn: [
        'Failed certification: Mandatory re-training or capstone project within 30 days.'
      ],
      relatedWorkflowIds: ['MODULE-LND', 'MODULE-TAL'],
      relatedSopCodes: ['LND-01', 'TAL-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'people-c5',
      from: 'tal',
      to: 'eng',
      label: 'Quy hoạch cán bộ nguồn (HiPo) & Chính sách giữ chân',
      labelEn: 'High-Potential (HiPo) Bench & Retention Strategy',
      description: 'Chuyển danh sách nhân tài vào chương trình đãi ngộ đặc biệt, cổ phiếu thưởng ESOP hoặc phụ cấp vị trí nguồn.',
      descriptionEn: 'Enrolls top-tier talent into specialized retention perks, leadership coaching, and fast-track bonuses.',
      direction: 'one-way',
      trigger: 'Hội đồng Nhân sự phê duyệt sơ đồ 9-Box và danh sách kế nhiệm',
      triggerEn: 'Executive Talent Council approves 9-Box matrix and talent pool',
      frequency: 'periodic',
      dataItems: [
        'Vị trí trong ma trận 9-Box (Box 1 - Box 9)',
        'Danh sách vị trí kế nhiệm mục tiêu (Ready Now / 1-2 năm)',
        'Gói chính sách đãi ngộ đặc biệt (Key Talent Retention Package)',
        'Kế hoạch kèm cặp cố vấn (Mentorship Plan)'
      ],
      dataItemsEn: [
        '9-Box Grid Placement (High Perf / High Potential)',
        'Target Succession Positions (Ready Now / 1-2 Years)',
        'Specialized Key Talent Retention Package',
        'Executive Mentorship Assignment'
      ],
      controls: [
        'Bảo mật tuyệt đối thông tin quy hoạch cán bộ nguồn',
        'Quy hoạch kế nhiệm phải có tối thiểu 2 ứng viên cho 1 vị trí chủ chốt'
      ],
      controlsEn: [
        'Strict confidentiality safeguards on succession dossiers',
        'Succession bench requires at least 2 candidates per key role'
      ],
      exceptions: [
        'Nhân sự HiPo có dấu hiệu bất mãn hoặc nguy cơ rời đi: Kích hoạt kế hoạch phỏng vấn giữ chân khẩn cấp (Stay Interview).'
      ],
      exceptionsEn: [
        'Flight risk detected: Trigger emergency Stay Interview protocol.'
      ],
      relatedWorkflowIds: ['MODULE-TAL', 'MODULE-ENG'],
      relatedSopCodes: ['TAL-01', 'ENG-01'],
      connectionKind: 'data-transfer'
    },
    {
      id: 'people-c6',
      from: 'eng',
      to: 'kpi',
      label: 'Phản hồi gắn kết & Tái thiết lập mục tiêu chu kỳ mới',
      labelEn: 'Engagement Feedback Loop & Next-Cycle Target Realignment',
      description: 'Vòng lặp feedback: Dùng kết quả vinh danh và khảo sát gắn kết để nâng tầm mục tiêu thách thức cho chu kỳ tiếp theo.',
      descriptionEn: 'Continuous loop: Leverages recognition and employee pulse insights to recalibrate higher strategic targets.',
      direction: 'feedback',
      trigger: 'Chu kỳ lập kế hoạch hiệu suất năm mới bắt đầu',
      triggerEn: 'New annual strategic planning kickoff',
      frequency: 'periodic',
      dataItems: [
        'Chỉ số gắn kết đội ngũ (eNPS / Pulse Score)',
        'Thành tích vinh danh & Bài học kinh nghiệm chu kỳ trước',
        'Mục tiêu thách thức mới (Stretch Goals)',
        'Kỳ vọng nâng chuẩn năng suất phòng ban'
      ],
      dataItemsEn: [
        'Employee Net Promoter Score (eNPS / Pulse)',
        'Past cycle award milestones & lessons learned',
        'Next-generation Stretch Goals',
        'Productivity baseline recalibration'
      ],
      controls: [
        'Mục tiêu mới phải liên tục cải tiến so với baseline chu kỳ cũ',
        'Đảm bảo sự cân bằng giữa áp lực chỉ tiêu và sức khỏe tinh thần NLĐ'
      ],
      controlsEn: [
        'New targets demonstrate continuous improvement over past baseline',
        'Maintains sustainable balance between business stretch and employee well-being'
      ],
      exceptions: [
        'Tỷ lệ kiệt sức hoặc gắn kết thấp: Điều chỉnh giảm tải áp lực mục tiêu và tăng cường hỗ trợ đào tạo.'
      ],
      exceptionsEn: [
        'Low engagement/burnout indicator: Adjust goal intensity and inject coaching support.'
      ],
      relatedWorkflowIds: ['MODULE-ENG', 'MODULE-PFM'],
      relatedSopCodes: ['ENG-01', 'PFM-02'],
      connectionKind: 'feedback'
    }
  ]
}
