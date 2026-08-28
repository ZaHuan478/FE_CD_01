import type { ClusterFlowConfig } from '../types'

export const PLATFORM_FLOW_DATA: ClusterFlowConfig = {
  clusterId: 'platform',
  title: 'Dịch vụ nền tảng phục vụ toàn hệ thống',
  titleEn: 'Enterprise Platform Shared Service Network',
  subtitle:
    'Mạng lưới dịch vụ dùng chung (Shared Services Mesh) cung cấp hạ tầng dữ liệu, công cụ phê duyệt, ký số, bảo mật và kiểm toán cho toàn bộ các phân hệ nghiệp vụ HRMS.',
  subtitleEn:
    'Centralized shared service mesh providing standardized master data dictionaries, dynamic workflow routing, digital signing, notifications, security, and audit logging to all business clusters.',
  nodes: [
    {
      id: 'shared',
      code: 'MD',
      label: 'Danh mục Dùng chung',
      labelEn: 'Shared Master Data',
      cluster: 'platform',
      description: 'Cung cấp từ điển dữ liệu quy chuẩn (quốc gia, ngân hàng, loại hợp đồng, lý do biến động) giúp toàn bộ HRMS không bị phân mảnh dữ liệu.',
      descriptionEn: 'Provides canonical master dictionaries across departments, preventing data fragmentation.',
      iconName: 'Layers',
      workflowId: 'MODULE-PLT-MD',
      firstSopCode: 'MD-01',
      nodeKind: 'shared-service',
      colorToken: 'purple'
    },
    {
      id: 'configuration',
      code: 'CFG',
      label: 'Cấu hình HRM',
      labelEn: 'HRM Dynamic Configuration',
      cluster: 'platform',
      description: 'Quản lý tham số vận hành, lịch làm việc, quy tắc mã hóa tự động và trường dữ liệu mở rộng theo từng pháp nhân.',
      descriptionEn: 'Manages enterprise parameters, fiscal calendars, auto-numbering, and custom fields without code changes.',
      iconName: 'Sliders',
      workflowId: 'MODULE-PLT-CFG',
      firstSopCode: 'CFG-01',
      nodeKind: 'shared-service',
      colorToken: 'indigo'
    },
    {
      id: 'workflow',
      code: 'WFL',
      label: 'Workflow Phê duyệt',
      labelEn: 'Dynamic Approval Engine',
      cluster: 'platform',
      description: 'Công cụ điều hướng luồng phê duyệt đa cấp (1 cấp, 2 cấp, rẽ nhánh theo hạn mức) cho toàn bộ đơn từ và giao dịch nhân sự.',
      descriptionEn: 'Multi-level approval engine routing requests based on organizational hierarchy and authority thresholds.',
      iconName: 'GitMerge',
      workflowId: 'MODULE-PLT-WFL',
      firstSopCode: 'WFL-01',
      nodeKind: 'shared-service',
      colorToken: 'blue'
    },
    {
      id: 'document',
      code: 'DOC',
      label: 'Quản lý Tài liệu',
      labelEn: 'Document & Template Store',
      cluster: 'platform',
      description: 'Lưu trữ mẫu biểu (Template HĐLĐ, quyết định, thư mời) và quản lý kho chứng từ điện tử có mã hóa bảo mật.',
      descriptionEn: 'Manages smart document templates (contracts, appointment decisions) and encrypted digital file archives.',
      iconName: 'FileText',
      workflowId: 'MODULE-PLT-DOC',
      firstSopCode: 'DOC-01',
      nodeKind: 'shared-service',
      colorToken: 'teal'
    },
    {
      id: 'signature',
      code: 'SIG',
      label: 'Ký số Điện tử',
      labelEn: 'Digital Signature Service',
      cluster: 'platform',
      description: 'Dịch vụ ký số hợp chuẩn (CA/OTP/Biometrics) cho phép ký HĐLĐ, phụ lục và quyết định nhân sự từ xa có giá trị pháp lý.',
      descriptionEn: 'Legally binding digital signature service (PKI/OTP) for remote execution of employment agreements.',
      iconName: 'FileSignature',
      workflowId: 'MODULE-PLT-SIG',
      firstSopCode: 'SIG-01',
      nodeKind: 'shared-service',
      colorToken: 'emerald'
    },
    {
      id: 'notification',
      code: 'NTF',
      label: 'Trung tâm Thông báo',
      labelEn: 'Omnichannel Notification Engine',
      cluster: 'platform',
      description: 'Phát thông báo đa kênh (In-app, Push notification, Email, Zalo/SMS) nhắc việc, thông báo duyệt và cảnh báo hạn chót.',
      descriptionEn: 'Multi-channel messaging hub delivering instant task alerts, approval reminders, and policy bulletins.',
      iconName: 'Bell',
      workflowId: 'MODULE-PLT-NTF',
      firstSopCode: 'NTF-01',
      nodeKind: 'shared-service',
      colorToken: 'amber'
    },
    {
      id: 'integration',
      code: 'INT',
      label: 'Cổng Tích hợp API',
      labelEn: 'Enterprise Integration Gateway',
      cluster: 'platform',
      description: 'Kết nối hai chiều với hệ thống máy chấm công, phần mềm ERP kế toán, ngân hàng thanh toán và cổng BHXH/Thuế nhà nước.',
      descriptionEn: 'Bi-directional API connector for biometric hardware, ERP finance systems, banking, and government portals.',
      iconName: 'Network',
      workflowId: 'MODULE-PLT-INT',
      firstSopCode: 'INT-01',
      nodeKind: 'shared-service',
      colorToken: 'sky'
    },
    {
      id: 'security',
      code: 'SEC',
      label: 'Phân quyền & Bảo mật (RBAC)',
      labelEn: 'Security & Access Control (RBAC)',
      cluster: 'platform',
      description: 'Quản trị vai trò (Role-Based Access Control), chính sách bảo mật dữ liệu nhạy cảm (Lương, CCCD) và xác thực đa yếu tố.',
      descriptionEn: 'Fine-grained role-based permission control, column-level sensitive data masking, and MFA enforcement.',
      iconName: 'ShieldCheck',
      workflowId: 'MODULE-PLT-SEC',
      firstSopCode: 'SEC-01',
      nodeKind: 'shared-service',
      colorToken: 'rose'
    },
    {
      id: 'audit',
      code: 'AUD',
      label: 'Audit Log & Kiểm toán',
      labelEn: 'Audit Trail & Compliance Log',
      cluster: 'platform',
      description: 'Ghi nhật ký bất biến mọi thao tác chỉnh sửa dữ liệu, xem thông tin lương, phê duyệt đơn và xuất báo cáo.',
      descriptionEn: 'Immutable logging of all data edits, compensation views, approvals, and compliance export actions.',
      iconName: 'History',
      workflowId: 'MODULE-PLT-AUD',
      firstSopCode: 'AUD-01',
      nodeKind: 'shared-service',
      colorToken: 'slate'
    }
  ],
  connections: [
    {
      id: 'plt-c1',
      from: 'shared',
      to: 'configuration',
      label: 'Cung cấp Từ điển dữ liệu chuẩn cho Cấu hình HRM',
      labelEn: 'Master Dictionaries feeding HRM Configuration Rules',
      description: 'Cung cấp danh mục chuẩn để cấu hình các quy tắc nghiệp vụ theo từng công ty con và địa bàn hoạt động.',
      descriptionEn: 'Supplies canonical master data to configure enterprise parameters across multi-entity instances.',
      direction: 'one-way',
      trigger: 'Cập nhật danh mục hoặc ban hành tham số vận hành mới',
      triggerEn: 'Master catalog update or new system parameter rollout',
      frequency: 'on-demand',
      dataItems: [
        'Danh mục Pháp nhân & Đơn vị (MD-05)',
        'Danh mục Loại hợp đồng & Thời hạn',
        'Danh mục Chế độ phụ cấp & Trợ cấp (MD-ALLOWANCE)',
        'Bảng mã tỉnh thành, ngân hàng và cơ quan thuế'
      ],
      dataItemsEn: [
        'Legal Entity & Division catalog (MD-05)',
        'Contract Type & Term duration list',
        'Allowance & Benefit dictionary',
        'Province, Bank, and Tax office standard codes'
      ],
      controls: [
        'Mã danh mục có tính duy nhất và không bị trùng lặp trên toàn hệ thống'
      ],
      controlsEn: [
        'Unique catalog codes strictly enforced globally'
      ],
      exceptions: [
        'Ngừng sử dụng danh mục đang có giao dịch tham chiếu: Tạm khóa kích hoạt mới nhưng giữ nguyên dữ liệu lịch sử.'
      ],
      exceptionsEn: [
        'Deprecating referenced item: Soft-disable for new entries while preserving historical link.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-MD', 'MODULE-PLT-CFG'],
      relatedSopCodes: ['MD-01', 'CFG-01'],
      connectionKind: 'shared-service'
    },
    {
      id: 'plt-c2',
      from: 'configuration',
      to: 'workflow',
      label: 'Quy tắc rẽ nhánh phê duyệt & Ma trận thẩm quyền',
      labelEn: 'Approval Matrix & Dynamic Branching Policies',
      description: 'Cung cấp ma trận phân quyền duyệt (theo hạn mức tiền, số ngày nghỉ, cấp bậc) cho Workflow Engine.',
      descriptionEn: 'Provides dynamic authority delegation matrix and budget threshold rules to Workflow Engine.',
      direction: 'one-way',
      trigger: 'Thiết lập hoặc điều chỉnh quy chế phân cấp phê duyệt',
      triggerEn: 'Approval matrix policy update or threshold reconfiguration',
      frequency: 'on-demand',
      dataItems: [
        'Quy tắc duyệt 1 cấp / 2 cấp / Ban Giám Đốc',
        'Hạn mức số ngày nghỉ (≤3 ngày: Trưởng phòng, >3 ngày: Giám đốc Khối)',
        'Hạn mức tăng ca OT & Hạn mức ngân sách định biên',
        'Quy tắc ủy quyền phê duyệt khi vắng mặt (Delegation Rule)'
      ],
      dataItemsEn: [
        'Single / Multi-tier / Executive routing rules',
        'Leave thresholds (≤3 days: Manager, >3 days: Director)',
        'OT and headcount budget threshold limits',
        'Approval delegation rules during temporary absence'
      ],
      controls: [
        'Không cho phép tạo luồng phê duyệt thiếu người phê duyệt cuối cùng (Deadlock prevention)'
      ],
      controlsEn: [
        'Deadlock prevention validation ensuring valid terminal approver exists'
      ],
      exceptions: [
        'Người phê duyệt vắng mặt không ủy quyền: Tự động chuyển cấp (Escalate) sau 48h quá hạn.'
      ],
      exceptionsEn: [
        'Approver absent without delegation: Auto-escalate after 48-hour SLA expiration.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-CFG', 'MODULE-PLT-WFL'],
      relatedSopCodes: ['CFG-01', 'WFL-01'],
      connectionKind: 'shared-service'
    },
    {
      id: 'plt-c3',
      from: 'workflow',
      to: 'document',
      label: 'Kích hoạt Điền mẫu văn bản tự động khi được duyệt',
      labelEn: 'Approved Workflow triggering Automated Document Merge',
      description: 'Khi đơn đề nghị hoặc quyết định được duyệt, hệ thống tự động trộn dữ liệu vào biểu mẫu hợp đồng/quyết định.',
      descriptionEn: 'Automated mail-merge into standardized contract/decision templates upon workflow approval.',
      direction: 'one-way',
      trigger: 'Giao dịch chuyển trạng thái "Đã phê duyệt hoàn tất"',
      triggerEn: 'Workflow reaches final Approved state',
      frequency: 'realtime',
      dataItems: [
        'Dữ liệu nhân thân & Chức danh từ hồ sơ',
        'Mẫu biểu văn bản chuẩn (Smart Template ID)',
        'Số quyết định sinh tự động theo quy tắc cấu hình',
        'File văn bản PDF hoàn chỉnh được tạo tự động'
      ],
      dataItemsEn: [
        'Personal and position profile payload',
        'Smart Document Template ID',
        'Auto-numbered official decision reference code',
        'Generated PDF ready for signing'
      ],
      controls: [
        'Nội dung trộn dữ liệu khớp 100% với thông tin được cấp thẩm quyền phê duyệt'
      ],
      controlsEn: [
        'Merged fields strictly match authorized workflow payload'
      ],
      exceptions: [
        'Lỗi định dạng trường dữ liệu: Ghi log lỗi và gửi thông báo cho chuyên viên phụ trách kiểm tra lại.'
      ],
      exceptionsEn: [
        'Field formatting error: Log error and notify system admin.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-WFL', 'MODULE-PLT-DOC'],
      relatedSopCodes: ['WFL-01', 'DOC-01'],
      connectionKind: 'shared-service'
    },
    {
      id: 'plt-c4',
      from: 'document',
      to: 'signature',
      label: 'Chuyển văn bản sang Dịch vụ Ký số điện tử',
      labelEn: 'Document Handoff to Digital Signature Engine',
      description: 'Chuyển tệp PDF hợp đồng/quyết định sang luồng ký số kèm vị trí con dấu và chữ ký các bên.',
      descriptionEn: 'Hands off generated PDF to digital signing engine with coordinate placement for signatures.',
      direction: 'one-way',
      trigger: 'Văn bản đã tạo sẵn sàng ký kết',
      triggerEn: 'Document generated and pending execution',
      frequency: 'realtime',
      dataItems: [
        'File văn bản PDF có mã băm bảo mật (Hash Code)',
        'Tọa độ vùng ký số của Người lao động và Đại diện Công ty',
        'Phương thức ký: OTP SMS / SmartCA / Chữ ký số USB Token',
        'Thời hạn ký số quy định'
      ],
      dataItemsEn: [
        'PDF document with SHA-256 integrity hash',
        'Signature coordinate anchors for both parties',
        'Signing method: SMS OTP / SmartCA / Token',
        'Signing expiration deadline'
      ],
      controls: [
        'Mã băm tài liệu không bị thay đổi (Bảo toàn tính toàn vẹn văn bản)',
        'Xác thực danh tính người ký qua OTP/Sinh trắc học'
      ],
      controlsEn: [
        'Document SHA-256 hash verified before and after signing',
        'Signer identity verified via biometric / OTP authentication'
      ],
      exceptions: [
        'Người lao động quá hạn ký: Gửi thông báo nhắc nhở và tự động gia hạn 24h.'
      ],
      exceptionsEn: [
        'Signer overdue: Dispatch automated reminder and grant 24-hour extension.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-DOC', 'MODULE-PLT-SIG'],
      relatedSopCodes: ['DOC-01', 'SIG-01'],
      connectionKind: 'shared-service'
    },
    {
      id: 'plt-c5',
      from: 'signature',
      to: 'notification',
      label: 'Kích hoạt Thông báo đa kênh khi hoàn tất ký kết',
      labelEn: 'Signed Document triggering Multi-channel Notification',
      description: 'Gửi thông báo tức thì cho các bên liên quan và đính kèm bản sao hợp đồng đã ký số.',
      descriptionEn: 'Triggers instant push/email alerts with certified signed document attachment to all stakeholders.',
      direction: 'one-way',
      trigger: 'Tất cả các bên hoàn thành ký số',
      triggerEn: 'All signers successfully execute digital signature',
      frequency: 'realtime',
      dataItems: [
        'File văn bản đã ký số có dấu thời gian (Timestamped PDF)',
        'Danh sách người nhận (Nhân viên, Quản lý, HR, Kế toán)',
        'Kênh thông báo: In-app banner, Push notification, Email đính kèm'
      ],
      dataItemsEn: [
        'Timestamped certified signed PDF',
        'Recipient list (Employee, Manager, HR, Finance)',
        'Delivery channel: In-app badge, Push alert, Email attachment'
      ],
      controls: [
        'Đảm bảo thông báo được gửi thành công với tỷ lệ ghi nhận nhận tin > 99%'
      ],
      controlsEn: [
        'High-deliverability SLA ensuring message delivery confirmation'
      ],
      exceptions: [
        'Email bị trả lại (Bounced): Tự động chuyển hướng gửi qua tin nhắn SMS nội bộ.'
      ],
      exceptionsEn: [
        'Bounced email: Fall back to internal SMS notification.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-SIG', 'MODULE-PLT-NTF'],
      relatedSopCodes: ['SIG-01', 'NTF-01'],
      connectionKind: 'shared-service'
    },
    {
      id: 'plt-c6',
      from: 'security',
      to: 'audit',
      label: 'Giám sát phân quyền, truy cập dữ liệu nhạy cảm & Ghi vết',
      labelEn: 'RBAC Security Enforcement & Immutable Audit Trail',
      description: 'Mọi hành động truy cập dữ liệu lương, xuất danh sách nhân viên hoặc thay đổi cấu hình đều được ghi vết bất biến.',
      descriptionEn: 'Captures immutable audit logs for all sensitive salary views, employee data exports, and permission edits.',
      direction: 'one-way',
      trigger: 'Mọi thao tác giao dịch hoặc truy vấn dữ liệu nhạy cảm',
      triggerEn: 'Any user transaction, permission check, or sensitive query',
      frequency: 'realtime',
      dataItems: [
        'User ID, IP Address, Địa chỉ thiết bị & Thời gian thao tác',
        'Hành vi: Xem, Thêm mới, Sửa, Xóa, Xuất Excel (Export)',
        'Dữ liệu trước và sau khi thay đổi (Before/After snapshot)',
        'Trạng thái: Thành công hoặc Bị từ chối truy cập (Access Denied)'
      ],
      dataItemsEn: [
        'User ID, IP Address, Device Fingerprint & Timestamp',
        'Action: View, Create, Update, Delete, Export',
        'Before/After snapshot delta payload',
        'Status: Success or Access Denied'
      ],
      controls: [
        'Nhật ký Audit Log không thể bị xóa hoặc sửa đổi bởi bất kỳ quản trị viên nào (WORM storage)'
      ],
      controlsEn: [
        'Immutable write-once-read-many (WORM) audit storage preventing tampering'
      ],
      exceptions: [
        'Phát hiện hành vi xuất dữ liệu bất thường số lượng lớn: Tự động khóa tạm thời phiên làm việc và cảnh báo CISO.'
      ],
      exceptionsEn: [
        'Abnormal bulk export detected: Temporarily suspend session and alert Security Officer.'
      ],
      relatedWorkflowIds: ['MODULE-PLT-SEC', 'MODULE-PLT-AUD'],
      relatedSopCodes: ['SEC-01', 'AUD-01'],
      connectionKind: 'shared-service'
    }
  ]
}
