import type { SopSubProcess, SopSubStep } from '../types'

interface PlatformProcessSeed {
  code: string
  title: string
  category: string
  description: string
  inputs: string[]
  outputs: string[]
  rules: string[]
  requester: string
  controller: string
  approver: string
}

const buildSteps = (seed: PlatformProcessSeed): SopSubStep[] => {
  const prefix = seed.code.replace(/[^A-Z0-9]/gi, '')
  return [
    {
      stepCode: `${prefix}.01`,
      title: `Khởi tạo ${seed.title.toLocaleLowerCase('vi-VN')}`,
      actor: seed.requester,
      location: 'HRMS · Nền tảng',
      timing: 'Khi phát sinh yêu cầu cấu hình hoặc tích hợp',
      typeCode: 'M',
      description: `Thiết lập tham số, xác định phạm vi áp dụng, đối tượng dữ liệu và chính sách kiểm soát cho ${seed.title.toLocaleLowerCase('vi-VN')}.`,
      fieldsChecklist: ['Phạm vi áp dụng', 'Ngày hiệu lực', 'Mã định danh', ...seed.inputs.slice(0, 2)]
    },
    {
      stepCode: `${prefix}.02`,
      title: 'Kiểm tra quy tắc và tính tương thích',
      actor: 'Hệ thống HRMS (Platform Engine)',
      location: 'Platform Validation Gateway',
      timing: 'Tự động khi gửi yêu cầu',
      typeCode: 'A',
      description: 'Hệ thống tự động kiểm tra trùng lặp, xung đột cấu hình, schema dữ liệu, phiên bản tương thích và quyền truy cập trước khi thẩm định.',
      fieldsChecklist: ['Schema dữ liệu', 'Ràng buộc toàn vẹn', 'Kiểm tra xung đột', 'Danh sách cảnh báo']
    },
    {
      stepCode: `${prefix}.03`,
      title: 'Thẩm định kỹ thuật và tác động vận hành',
      actor: seed.controller,
      location: 'HRMS · Không gian quản trị nền tảng',
      timing: 'Theo SLA kiểm soát',
      typeCode: 'C',
      description: 'Đối chiếu chính sách bảo mật, tác động tới các phân hệ Core, People, Organization và các hệ thống bên ngoài đang kết nối.',
      fieldsChecklist: ['Đánh giá rủi ro', 'Tác động liên phân hệ', 'Ý kiến kiểm soát', 'Kế hoạch rollback nếu có lỗi']
    },
    {
      stepCode: `${prefix}.04`,
      title: 'Phê duyệt và kích hoạt áp dụng',
      actor: seed.approver,
      location: 'Cổng phê duyệt quản trị',
      timing: 'Sau khi hoàn tất thẩm định',
      typeCode: 'A',
      description: 'Xem xét báo cáo thẩm định, phê duyệt cấu hình, ký số (nếu có) và kích hoạt áp dụng theo ngày hiệu lực.',
      fieldsChecklist: ['Quyết định phê duyệt', 'Chữ ký điện tử / xác thực', 'Thời điểm kích hoạt', 'Nhật ký phê duyệt']
    },
    {
      stepCode: `${prefix}.05`,
      title: 'Đồng bộ liên phân hệ và ghi nhật ký Audit',
      actor: 'Hệ thống HRMS (Audit & Sync Broker)',
      location: 'Core Engine & Audit Log Storage',
      timing: 'Theo ngày hiệu lực đã duyệt',
      typeCode: 'N',
      description: 'Phát tán cấu hình tới các phân hệ nghiệp vụ, đồng bộ dữ liệu tham chiếu và ghi nhận toàn bộ lịch sử thay đổi vào Audit Trail.',
      fieldsChecklist: [...seed.outputs.slice(0, 2), 'Correlation ID', 'Audit Log Entry', 'Trạng thái phát tán']
    }
  ]
}

const buildProcess = (seed: PlatformProcessSeed): SopSubProcess => ({
  sopCode: seed.code,
  sopTitle: seed.title,
  sopCategory: seed.category,
  description: seed.description,
  inputs: seed.inputs,
  outputs: seed.outputs,
  rules: seed.rules,
  sourceNote: 'Quy trình chuẩn hóa cho dịch vụ nền tảng Enterprise HRMS (Platform & Shared Services), đảm bảo tuân thủ ISO/IEC 27001, GDPR/Nghị định 13/2023/NĐ-CP và kiến trúc Microservices/Event-Driven.',
  notes: [
    `RACI: ${seed.requester} (R); ${seed.approver} (A); ${seed.controller} (C); các phân hệ liên quan (I).`,
    'Mọi thay đổi cấu hình nền tảng phải có phiên bản, ngày hiệu lực, lý do thay đổi và lưu vết kiểm toán không thể xóa.'
  ],
  steps: buildSteps(seed)
})

const commonPlatformRules = [
  'Mọi dịch vụ nền tảng phải hỗ trợ đa pháp nhân, đa đơn vị và lưu lịch sử phiên bản.',
  'Thay đổi cấu hình không được làm gián đoạn các giao dịch nghiệp vụ đang diễn ra.'
]

const p = (seed: PlatformProcessSeed) => buildProcess(seed)

// 1. DANH MỤC CHUNG (MODULE-PLT-MD - 8 SOPs)
export const platformSharedMasterDataProcesses: SopSubProcess[] = [
  p({
    code: 'MD-01',
    title: 'Thêm mới giá trị danh mục dùng chung',
    category: 'Danh mục chung · Khởi tạo',
    description: 'Thiết lập mã, tên, phân cấp cha con, thứ tự hiển thị và trạng thái kích hoạt cho giá trị danh mục dùng chung.',
    inputs: ['Tên danh mục cha', 'Mã giá trị', 'Tên tiếng Việt và tiếng Anh', 'Thứ tự hiển thị'],
    outputs: ['Giá trị danh mục mới khả dụng trên toàn hệ thống', 'Audit trail khởi tạo'],
    rules: commonPlatformRules,
    requester: 'Chuyên viên Master Data',
    controller: 'HR Data Steward',
    approver: 'Trưởng nhóm Quản trị Dữ liệu'
  }),
  p({
    code: 'MD-02',
    title: 'Cập nhật giá trị danh mục',
    category: 'Danh mục chung · Cập nhật',
    description: 'Điều chỉnh tên, mô tả hoặc thứ tự hiển thị của giá trị danh mục mà không làm thay đổi mã khóa nghiệp vụ.',
    inputs: ['Giá trị danh mục cần sửa', 'Nội dung thay đổi', 'Lý do cập nhật'],
    outputs: ['Danh mục cập nhật hiển thị đồng bộ trên các phân hệ', 'Lịch sử thay đổi'],
    rules: commonPlatformRules,
    requester: 'Chuyên viên Master Data',
    controller: 'HR Data Steward',
    approver: 'Trưởng nhóm Quản trị Dữ liệu'
  }),
  p({
    code: 'MD-03',
    title: 'Gửi duyệt danh mục dùng chung',
    category: 'Danh mục chung · Đề xuất',
    description: 'Lập tờ trình đề xuất ban hành hoặc thay đổi danh mục mang tính quy chuẩn doanh nghiệp.',
    inputs: ['Danh sách giá trị danh mục mới', 'Tài liệu căn cứ pháp lý / nội bộ'],
    outputs: ['Phiếu yêu cầu phê duyệt danh mục', 'Thông báo thẩm định'],
    rules: commonPlatformRules,
    requester: 'Chuyên viên Master Data',
    controller: 'HRBP / Pháp chế',
    approver: 'HR Director'
  }),
  p({
    code: 'MD-04',
    title: 'Phê duyệt và phát hành danh mục',
    category: 'Danh mục chung · Phê duyệt',
    description: 'Thẩm định tính chuẩn hóa, phê duyệt ký số và chính thức phát hành phiên bản danh mục trên toàn hệ thống.',
    inputs: ['Phiếu yêu cầu phê duyệt', 'Báo cáo đánh giá tác động'],
    outputs: ['Quyết định ban hành danh mục', 'Phiên bản danh mục có hiệu lực'],
    rules: commonPlatformRules,
    requester: 'HR Data Steward',
    controller: 'HR Governance',
    approver: 'HR Director'
  }),
  p({
    code: 'MD-05',
    title: 'Ngừng sử dụng giá trị danh mục',
    category: 'Danh mục chung · Vòng đời',
    description: 'Khóa không cho chọn mới giá trị danh mục lỗi thời nhưng vẫn duy trì tính toàn vẹn dữ liệu lịch sử.',
    inputs: ['Mã giá trị cần ngừng sử dụng', 'Lý do thay thế / bãi bỏ', 'Ngày hết hiệu lực'],
    outputs: ['Giá trị chuyển trạng thái Ngừng hoạt động (Inactive)', 'Cảnh báo trên form nhập liệu'],
    rules: commonPlatformRules,
    requester: 'Chuyên viên Master Data',
    controller: 'HR Data Steward',
    approver: 'Trưởng nhóm Quản trị Dữ liệu'
  }),
  p({
    code: 'MD-06',
    title: 'Import danh mục hàng loạt từ file',
    category: 'Danh mục chung · Tải lên dữ liệu',
    description: 'Kiểm tra cú pháp, đối soát trùng lặp và nạp danh mục số lượng lớn từ file Excel/CSV mẫu.',
    inputs: ['File dữ liệu mẫu Excel/CSV', 'Quy tắc mapping trường'],
    outputs: ['Báo cáo kết quả import (thành công/thất bại)', 'Dữ liệu danh mục nạp vào hệ thống'],
    rules: commonPlatformRules,
    requester: 'HR Data Admin',
    controller: 'System Data Validator',
    approver: 'Trưởng nhóm Quản trị Dữ liệu'
  }),
  p({
    code: 'MD-07',
    title: 'Kiểm tra dữ liệu đang tham chiếu danh mục',
    category: 'Danh mục chung · Ràng buộc',
    description: 'Quét toàn bộ cơ sở dữ liệu để thống kê số lượng hồ sơ, hợp đồng, đơn từ đang sử dụng giá trị danh mục.',
    inputs: ['Mã giá trị danh mục cần kiểm tra', 'Phạm vi phân hệ'],
    outputs: ['Báo cáo ma trận tham chiếu', 'Cảnh báo ràng buộc trước khi chỉnh sửa/xóa'],
    rules: commonPlatformRules,
    requester: 'HR Data Steward',
    controller: 'Platform Engine',
    approver: 'Trưởng nhóm Quản trị Dữ liệu'
  }),
  p({
    code: 'MD-08',
    title: 'Quản lý phiên bản và ngày hiệu lực danh mục',
    category: 'Danh mục chung · Phiên bản',
    description: 'Lưu giữ snapshot danh mục theo từng mốc thời gian, hỗ trợ tra cứu đúng giá trị có hiệu lực tại thời điểm phát sinh giao dịch.',
    inputs: ['Ngày hiệu lực áp dụng', 'Dữ liệu phiên bản mới'],
    outputs: ['Cây phiên bản danh mục', 'Snapshot dữ liệu theo thời gian'],
    rules: commonPlatformRules,
    requester: 'HR Data Steward',
    controller: 'Platform Engine',
    approver: 'HR Governance'
  })
]

// 2. CẤU HÌNH HRM (MODULE-PLT-CFG - 8 SOPs)
export const platformConfigurationProcesses: SopSubProcess[] = [
  p({
    code: 'CFG-01',
    title: 'Thiết lập tham số doanh nghiệp',
    category: 'Cấu hình HRM · Tham số chung',
    description: 'Cấu hình các tham số vận hành toàn công ty như tiền tệ, múi giờ, định dạng ngày tháng và quy chuẩn làm tròn số.',
    inputs: ['Chính sách tài chính & kế toán', 'Quy chuẩn vận hành công ty'],
    outputs: ['Bảng tham số doanh nghiệp có hiệu lực', 'Audit log thay đổi tham số'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Finance & HRBP',
    approver: 'CHRO'
  }),
  p({
    code: 'CFG-02',
    title: 'Thiết lập lịch và kỳ nghiệp vụ',
    category: 'Cấu hình HRM · Chu kỳ',
    description: 'Cấu hình ngày chốt công, ngày tính lương, kỳ nộp bảo hiểm, hạn chốt thuế và lịch nghỉ lễ/nghỉ bù hàng năm.',
    inputs: ['Lịch nghỉ lễ nhà nước', 'Quy chế chi trả thu nhập công ty'],
    outputs: ['Lịch làm việc và kỳ đóng sổ nghiệp vụ 12 tháng', 'Kích hoạt cảnh báo chu kỳ'],
    rules: commonPlatformRules,
    requester: 'C&B Specialist',
    controller: 'Payroll Lead',
    approver: 'HR Director'
  }),
  p({
    code: 'CFG-03',
    title: 'Thiết lập quy tắc đánh số tự động',
    category: 'Cấu hình HRM · Mã định danh',
    description: 'Định nghĩa công thức sinh mã nhân viên, mã hợp đồng, số quyết định, mã phiếu lương theo tiền tố, hậu tố và bộ đếm.',
    inputs: ['Quy chuẩn mã hóa doanh nghiệp', 'Mẫu tiền tố theo pháp nhân / vị trí'],
    outputs: ['Sequence generator tự động', 'Quy tắc mã hóa duy nhất'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'HR Data Steward',
    approver: 'HR Director'
  }),
  p({
    code: 'CFG-04',
    title: 'Thiết lập biểu mẫu và trường mở rộng',
    category: 'Cấu hình HRM · Form & Custom Fields',
    description: 'Tạo thêm trường dữ liệu tùy biến (Custom Fields), gán kiểu dữ liệu, bắt buộc/không bắt buộc và bố trí trên màn hình.',
    inputs: ['Yêu cầu quản lý thông tin bổ sung', 'Danh sách trường và kiểu dữ liệu'],
    outputs: ['Giao diện form được cập nhật trường mở rộng', 'Schema lưu trữ động'],
    rules: commonPlatformRules,
    requester: 'HR Admin',
    controller: 'HR System Admin',
    approver: 'HR Governance'
  }),
  p({
    code: 'CFG-05',
    title: 'Thiết lập quy tắc kiểm tra dữ liệu',
    category: 'Cấu hình HRM · Data Validation Rules',
    description: 'Thiết lập các logic ràng buộc dữ liệu (ví dụ: tuổi lao động >= 18, số CCCD đủ 12 số, email đúng cú pháp domain công ty).',
    inputs: ['Quy định pháp luật và chính sách công ty', 'Biểu thức logic validation'],
    outputs: ['Bộ quy tắc kiểm tra dữ liệu tự động', 'Thông báo lỗi khi nhập sai'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Legal & Compliance',
    approver: 'HR Director'
  }),
  p({
    code: 'CFG-06',
    title: 'Quản lý cấu hình theo pháp nhân hoặc đơn vị',
    category: 'Cấu hình HRM · Phân cấp cấu hình',
    description: 'Áp dụng các gói cấu hình riêng biệt cho từng công ty con, chi nhánh hoặc ban chuyên môn trong cùng tập đoàn.',
    inputs: ['Cơ cấu pháp nhân và đơn vị', 'Gói cấu hình đặc thù'],
    outputs: ['Ma trận cấu hình đa pháp nhân', 'Kế thừa cấu hình cha-con'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'HRBP từng khối',
    approver: 'CHRO'
  }),
  p({
    code: 'CFG-07',
    title: 'Quản lý phiên bản cấu hình',
    category: 'Cấu hình HRM · Versioning',
    description: 'Lưu vết lịch sử mọi lần thay đổi cấu hình, cho phép so sánh khác biệt (Diff) và phục hồi phiên bản trước khi cần.',
    inputs: ['Phiên bản cấu hình hiện tại', 'Nội dung thay đổi mới'],
    outputs: ['Version Snapshot', 'Báo cáo so sánh khác biệt cấu hình'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'IT Security',
    approver: 'HR Director'
  }),
  p({
    code: 'CFG-08',
    title: 'Di chuyển cấu hình giữa các môi trường',
    category: 'Cấu hình HRM · Migration',
    description: 'Đóng gói cấu hình đã thử nghiệm trên môi trường Staging/Test và triển khai an toàn lên Production.',
    inputs: ['Gói cấu hình đã nghiệm thu', 'Kế hoạch triển khai môi trường Production'],
    outputs: ['Biên bản triển khai cấu hình', 'Log migration hoàn tất'],
    rules: commonPlatformRules,
    requester: 'DevOps / HR Tech Lead',
    controller: 'QA & HR Test Lead',
    approver: 'IT Director'
  })
]

// 3. WORKFLOW PHÊ DUYỆT (MODULE-PLT-WFL - 9 SOPs)
export const platformWorkflowProcesses: SopSubProcess[] = [
  p({
    code: 'WFL-01',
    title: 'Thiết kế luồng phê duyệt',
    category: 'Workflow phê duyệt · Thiết kế',
    description: 'Xây dựng sơ đồ các bước phê duyệt tuần tự hoặc song song cho từng loại nghiệp vụ (nghỉ phép, tuyển dụng, điều chuyển, chi trả).',
    inputs: ['Quy chế phân quyền phê duyệt', 'Loại giao dịch nghiệp vụ'],
    outputs: ['Bản đồ luồng phê duyệt phát hành', 'Quy tắc xác định người duyệt'],
    rules: commonPlatformRules,
    requester: 'HR Process Analyst',
    controller: 'HRBP Lead',
    approver: 'CHRO'
  }),
  p({
    code: 'WFL-02',
    title: 'Thiết lập điều kiện rẽ nhánh',
    category: 'Workflow phê duyệt · Logic rẽ nhánh',
    description: 'Cấu hình các điều kiện phân luồng tự động dựa trên số ngày nghỉ, mức ngân sách, cấp bậc nhân viên hoặc loại hợp đồng.',
    inputs: ['Điều kiện rẽ nhánh (IF/ELSE)', 'Thuộc tính dữ liệu đầu vào'],
    outputs: ['Bộ quy tắc định tuyến tự động (Routing Rules)', 'Kịch bản rẽ nhánh kiểm thử'],
    rules: commonPlatformRules,
    requester: 'HR Process Analyst',
    controller: 'HR System Admin',
    approver: 'HR Director'
  }),
  p({
    code: 'WFL-03',
    title: 'Thiết lập cấp duyệt theo hạn mức',
    category: 'Workflow phê duyệt · Hạn mức thẩm quyền',
    description: 'Gán trần thẩm quyền phê duyệt cho từng cấp quản lý (Trưởng nhóm, Trưởng phòng, Giám đốc khối, Tổng Giám đốc).',
    inputs: ['Ma trận thẩm quyền phê duyệt (DOA)', 'Hạn mức tài chính / nhân sự'],
    outputs: ['Bảng hạn mức phê duyệt hệ thống', 'Ngăn chặn phê duyệt vượt quyền'],
    rules: commonPlatformRules,
    requester: 'HR Governance Specialist',
    controller: 'Internal Audit',
    approver: 'Ban Điều Hành (BOD)'
  }),
  p({
    code: 'WFL-04',
    title: 'Gửi yêu cầu phê duyệt',
    category: 'Workflow phê duyệt · Khởi tạo yêu cầu',
    description: 'Người dùng nộp yêu cầu, hệ thống tự động kiểm tra dữ liệu, gán cấp duyệt đầu tiên và kích hoạt bộ đếm thời gian SLA.',
    inputs: ['Đơn yêu cầu của nhân viên/quản lý', 'Tài liệu đính kèm minh chứng'],
    outputs: ['Phiếu yêu cầu chuyển trạng thái Chờ duyệt (Pending)', 'Thông báo gửi tới cấp duyệt'],
    rules: commonPlatformRules,
    requester: 'Người tạo yêu cầu',
    controller: 'Workflow Engine',
    approver: 'Cấp duyệt bước 1'
  }),
  p({
    code: 'WFL-05',
    title: 'Phê duyệt, từ chối hoặc trả lại',
    category: 'Workflow phê duyệt · Xử lý yêu cầu',
    description: 'Cấp duyệt xem chi tiết hồ sơ, nhập ý kiến phản hồi và chọn: Đồng ý (Duyệt), Không đồng ý (Từ chối) hoặc Yêu cầu bổ sung (Trả lại).',
    inputs: ['Hồ sơ yêu cầu chờ duyệt', 'Ý kiến và quyết định của người duyệt'],
    outputs: ['Cập nhật trạng thái yêu cầu', 'Chuyển tiếp bước kế tiếp hoặc đóng luồng'],
    rules: commonPlatformRules,
    requester: 'Người có thẩm quyền duyệt',
    controller: 'Workflow Engine',
    approver: 'Người duyệt hiện tại'
  }),
  p({
    code: 'WFL-06',
    title: 'Ủy quyền và phê duyệt thay',
    category: 'Workflow phê duyệt · Ủy quyền',
    description: 'Thiết lập chuyển giao quyền phê duyệt tạm thời cho người khác khi quản lý đi công tác hoặc nghỉ phép dài hạn.',
    inputs: ['Người ủy quyền & Người nhận ủy quyền', 'Khoảng thời gian và phạm vi ủy quyền'],
    outputs: ['Quyết định ủy quyền có hiệu lực', 'Phiếu duyệt được chuyển tự động'],
    rules: commonPlatformRules,
    requester: 'Người ủy quyền',
    controller: 'HR Governance',
    approver: 'Cấp quản lý trực tiếp'
  }),
  p({
    code: 'WFL-07',
    title: 'Nhắc việc và escalation quá hạn',
    category: 'Workflow phê duyệt · SLA & Escalation',
    description: 'Hệ thống tự động gửi thông báo nhắc việc khi sắp hết giờ xử lý và tự động chuyển cấp duyệt lên cấp trên nếu quá hạn SLA.',
    inputs: ['Cấu hình thời gian SLA từng bước', 'Quy tắc escalation'],
    outputs: ['Email/Noti nhắc nhở', 'Tự động nâng cấp duyệt khi quá hạn'],
    rules: commonPlatformRules,
    requester: 'Workflow Engine',
    controller: 'HR Operations',
    approver: 'Cấp quản lý cấp cao'
  }),
  p({
    code: 'WFL-08',
    title: 'Hủy hoặc thu hồi yêu cầu',
    category: 'Workflow phê duyệt · Hủy yêu cầu',
    description: 'Cho phép người tạo thu hồi đơn khi chưa được duyệt hoặc quản trị viên hủy yêu cầu không còn giá trị vận hành.',
    inputs: ['Mã yêu cầu cần hủy', 'Lý do thu hồi / hủy bỏ'],
    outputs: ['Yêu cầu chuyển trạng thái Đã hủy (Cancelled)', 'Thông báo tới các bên liên quan'],
    rules: commonPlatformRules,
    requester: 'Người tạo yêu cầu / Admin',
    controller: 'Workflow Engine',
    approver: 'Cấp duyệt hiện tại'
  }),
  p({
    code: 'WFL-09',
    title: 'Theo dõi lịch sử phê duyệt',
    category: 'Workflow phê duyệt · Giám sát',
    description: 'Tra cứu toàn bộ dòng thời gian xử lý: ai duyệt, duyệt lúc nào, ý kiến gì, thời gian xử lý thực tế so với cam kết SLA.',
    inputs: ['Mã giao dịch / Mã nhân viên', 'Khoảng thời gian tra cứu'],
    outputs: ['Timeline phê duyệt chi tiết', 'Báo cáo hiệu suất SLA phê duyệt'],
    rules: commonPlatformRules,
    requester: 'Người dùng / Quản lý / HR',
    controller: 'Workflow Engine',
    approver: 'HR Operations'
  })
]

// 4. TÀI LIỆU (MODULE-PLT-DOC - 8 SOPs)
export const platformDocumentProcesses: SopSubProcess[] = [
  p({
    code: 'DOC-01',
    title: 'Thiết lập loại tài liệu',
    category: 'Tài liệu · Phân loại',
    description: 'Định nghĩa danh mục các loại giấy tờ nhân sự (hợp đồng, quyết định, cam kết, bằng cấp, chứng chỉ) và chính sách bảo mật tương ứng.',
    inputs: ['Danh mục hồ sơ nhân sự', 'Mức độ bảo mật (Public/Internal/Confidential)'],
    outputs: ['Bảng phân loại tài liệu hệ thống', 'Quy định thời hạn lưu trữ'],
    rules: commonPlatformRules,
    requester: 'HR Document Specialist',
    controller: 'Legal & Compliance',
    approver: 'HR Director'
  }),
  p({
    code: 'DOC-02',
    title: 'Tạo tài liệu từ template',
    category: 'Tài liệu · Sinh mẫu tự động',
    description: 'Hệ thống tự động trộn dữ liệu nhân viên (Merge Fields) vào mẫu hợp đồng, quyết định để sinh ra file PDF/Docx hoàn chỉnh.',
    inputs: ['Mẫu tài liệu chuẩn (Template)', 'Dữ liệu nhân viên từ Core EMP'],
    outputs: ['File tài liệu dự thảo hoàn chỉnh', 'Mã tài liệu tự sinh'],
    rules: commonPlatformRules,
    requester: 'HR Admin / C&B',
    controller: 'Document Generator Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'DOC-03',
    title: 'Tải lên và phân loại tài liệu',
    category: 'Tài liệu · Lưu trữ hồ sơ',
    description: 'Nhân viên hoặc HR tải scan giấy tờ cá nhân, hệ thống hỗ trợ OCR nhận diện thông tin và gắn thẻ phân loại hồ sơ.',
    inputs: ['File tài liệu scan / ảnh chụp', 'Thông tin nhân viên sở hữu'],
    outputs: ['Tài liệu được lưu trữ an toàn trong kho hồ sơ điện tử', 'Trạng thái Chờ xác thực'],
    rules: commonPlatformRules,
    requester: 'Nhân viên / HR Admin',
    controller: 'HR Data Verifier',
    approver: 'HR Admin Lead'
  }),
  p({
    code: 'DOC-04',
    title: 'Quản lý phiên bản tài liệu',
    category: 'Tài liệu · Phiên bản',
    description: 'Theo dõi các lần chỉnh sửa phụ lục, hợp đồng tái ký hoặc quyết định điều chỉnh với số hiệu phiên bản rõ ràng (v1.0, v2.0).',
    inputs: ['Tài liệu hiện hữu', 'Bản cập nhật mới'],
    outputs: ['Lịch sử các phiên bản tài liệu', 'Đánh dấu bản đang có hiệu lực'],
    rules: commonPlatformRules,
    requester: 'HR Document Specialist',
    controller: 'Document Management Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'DOC-05',
    title: 'Kiểm tra thời hạn và tính đầy đủ',
    category: 'Tài liệu · Tuân thủ hồ sơ',
    description: 'Tự động quét danh sách hồ sơ nhân viên để phát hiện giấy tờ thiếu, hết hạn (CCCD, visa, chứng chỉ hành nghề, hợp đồng) và gửi cảnh báo.',
    inputs: ['Quy định checklist hồ sơ bắt buộc', 'Dữ liệu ngày hết hạn của tài liệu'],
    outputs: ['Báo cáo tỷ lệ đầy đủ hồ sơ (Compliance Rate)', 'Cảnh báo tự động đến nhân viên'],
    rules: commonPlatformRules,
    requester: 'Hệ thống HRMS (Auto Compliance Scanner)',
    controller: 'HR Admin',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'DOC-06',
    title: 'Phê duyệt và phát hành tài liệu',
    category: 'Tài liệu · Ban hành',
    description: 'Thẩm định nội dung tài liệu trước khi chính thức phát hành tới nhân viên hoặc gửi sang luồng ký số.',
    inputs: ['Tài liệu dự thảo', 'Tờ trình đề xuất ban hành'],
    outputs: ['Tài liệu được khóa chỉnh sửa và cấp mã phát hành', 'Sẵn sàng gửi ký số'],
    rules: commonPlatformRules,
    requester: 'HR Admin',
    controller: 'Legal / HRBP',
    approver: 'HR Director'
  }),
  p({
    code: 'DOC-07',
    title: 'Lưu trữ và tra cứu tài liệu',
    category: 'Tài liệu · Tìm kiếm & Lưu trữ',
    description: 'Công cụ tìm kiếm thông minh theo mã nhân viên, loại giấy tờ, khoảng ngày tạo và phân quyền bảo mật xem tài liệu nhạy cảm.',
    inputs: ['Từ khóa tìm kiếm / Bộ lọc hồ sơ', 'Quyền hạn truy cập của người tra cứu'],
    outputs: ['Danh sách tài liệu phù hợp', 'Nhật ký xem và tải tài liệu'],
    rules: commonPlatformRules,
    requester: 'Người dùng có thẩm quyền',
    controller: 'Security Access Control',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'DOC-08',
    title: 'Thu hồi hoặc hết hiệu lực tài liệu',
    category: 'Tài liệu · Hết hiệu lực',
    description: 'Chuyển tài liệu sang trạng thái Hết hiệu lực hoặc Thu hồi khi nhân viên thôi việc hoặc văn bản bị thay thế bằng quyết định mới.',
    inputs: ['Mã tài liệu cần hết hiệu lực', 'Quyết định thay thế / Lý do thu hồi'],
    outputs: ['Tài liệu đánh dấu Đã lưu trữ (Archived) / Hết hiệu lực', 'Lưu vết lịch sử'],
    rules: commonPlatformRules,
    requester: 'HR Document Specialist',
    controller: 'Document Management Engine',
    approver: 'HR Director'
  })
]

// 5. KÝ SỐ (MODULE-PLT-SIG - 8 SOPs)
export const platformSignatureProcesses: SopSubProcess[] = [
  p({
    code: 'SIG-01',
    title: 'Thiết lập nhà cung cấp ký số',
    category: 'Ký số · Cấu hình nhà cung cấp',
    description: 'Kết nối cổng dịch vụ ký số từ xa (Remote Signing/Cloud CA), chứng thư số HSM và cấu hình tài khoản nhà cung cấp ký số.',
    inputs: ['Thông tin kết nối nhà cung cấp (VNPT, Viettel, FPT, CMC, MISA)', 'Chứng thư số doanh nghiệp'],
    outputs: ['Cổng ký số được kích hoạt và kiểm thử kết nối thành công', 'Cấu hình bảo mật ký số'],
    rules: commonPlatformRules,
    requester: 'HR Tech Specialist',
    controller: 'IT Security Lead',
    approver: 'IT Director'
  }),
  p({
    code: 'SIG-02',
    title: 'Chuẩn bị hồ sơ ký',
    category: 'Ký số · Chuẩn bị tài liệu',
    description: 'Chuyển đổi tài liệu sang định dạng chuẩn PDF/A, định vị các ô ký (Sign Tag), ngày ký và vị trí con dấu công ty.',
    inputs: ['Tài liệu đã được phê duyệt', 'Vị trí tọa độ các chữ ký trên trang'],
    outputs: ['Tài liệu số hóa chuẩn hóa kèm trường ký', 'Mã phiên ký (Signing Session)'],
    rules: commonPlatformRules,
    requester: 'HR Admin',
    controller: 'Signature Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'SIG-03',
    title: 'Xác định người ký và thứ tự ký',
    category: 'Ký số · Luồng ký',
    description: 'Thiết lập danh sách các bên tham gia ký: Người lao động ký trước, Người đại diện theo pháp luật ký sau hoặc ký song song.',
    inputs: ['Danh sách người ký (Email, Số điện thoại, Vai trò)', 'Thứ tự ký tuần tự'],
    outputs: ['Ma trận thứ tự luồng ký', 'Kích hoạt bước ký đầu tiên'],
    rules: commonPlatformRules,
    requester: 'HR Admin',
    controller: 'Signature Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'SIG-04',
    title: 'Gửi yêu cầu ký',
    category: 'Ký số · Phát hành yêu cầu',
    description: 'Hệ thống gửi đường dẫn ký an toàn kèm mã xác thực OTP qua Email/SMS/Portal đến người cần ký.',
    inputs: ['Phiên ký đã chuẩn bị', 'Kênh gửi thông báo ký'],
    outputs: ['Thông báo mời ký được gửi thành công', 'Kích hoạt hạn chót ký (Signing Deadline)'],
    rules: commonPlatformRules,
    requester: 'Signature Engine',
    controller: 'Notification Service',
    approver: 'HR Admin'
  }),
  p({
    code: 'SIG-05',
    title: 'Xác thực và thực hiện ký',
    category: 'Ký số · Ký kết',
    description: 'Người ký mở tài liệu, xem nội dung, thực hiện xác thực bảo mật 2 lớp (OTP/Smart CA) và đóng dấu chữ ký số.',
    inputs: ['Mã xác thực OTP / Khóa ký bảo mật', 'Xác nhận đồng ý nội dung văn bản'],
    outputs: ['Chữ ký điện tử/số được nhúng vào file PDF', 'Bằng chứng mã hóa thời gian ký (Timestamp)'],
    rules: commonPlatformRules,
    requester: 'Người ký',
    controller: 'Cloud CA / Signature Gateway',
    approver: 'Hệ thống xác thực'
  }),
  p({
    code: 'SIG-06',
    title: 'Theo dõi trạng thái ký',
    category: 'Ký số · Giám sát',
    description: 'Theo dõi thời gian thực tiến độ ký của từng người: Chưa mở, Đã xem, Đã ký, Từ chối hoặc Quá hạn.',
    inputs: ['Mã phiên ký', 'Khoảng thời gian theo dõi'],
    outputs: ['Bảng trạng thái ký thời gian thực', 'Tự động gửi nhắc nhở người chưa ký'],
    rules: commonPlatformRules,
    requester: 'HR Admin / Quản lý',
    controller: 'Signature Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'SIG-07',
    title: 'Từ chối, hủy hoặc gửi lại',
    category: 'Ký số · Xử lý ngoại lệ',
    description: 'Xử lý khi người ký từ chối văn bản kèm lý do phản hồi, hoặc HR thu hồi phiên ký khi phát hiện sai sót thông tin.',
    inputs: ['Lý do từ chối của người ký / Yêu cầu hủy của HR', 'Mã phiên ký'],
    outputs: ['Phiên ký đóng trạng thái Từ chối / Đã hủy', 'Thông báo phản hồi đến các bên'],
    rules: commonPlatformRules,
    requester: 'Người ký / HR Admin',
    controller: 'Signature Engine',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'SIG-08',
    title: 'Hoàn tất và lưu bằng chứng ký',
    category: 'Ký số · Bằng chứng pháp lý',
    description: 'Đóng dấu niêm phong điện tử (Document Seal), sinh file chứng thực hoàn tất ký (Audit Certificate) và lưu trữ vào hồ sơ nhân viên.',
    inputs: ['Tài liệu đầy đủ các chữ ký hợp lệ', 'Log kỹ thuật thời gian ký và địa chỉ IP'],
    outputs: ['Hợp đồng/Quyết định điện tử có giá trị pháp lý', 'Chứng chỉ kiểm toán phiên ký (Audit Trail Certificate)'],
    rules: commonPlatformRules,
    requester: 'Signature Engine',
    controller: 'Legal & Compliance',
    approver: 'HR Director'
  })
]

// 6. THÔNG BÁO (MODULE-PLT-NTF - 8 SOPs)
export const platformNotificationProcesses: SopSubProcess[] = [
  p({
    code: 'NTF-01',
    title: 'Thiết lập mẫu thông báo',
    category: 'Thông báo · Mẫu thông báo',
    description: 'Thiết kế nội dung mẫu thông báo cho Email, Notification Portal và SMS với các biến động (Tên NV, Mã đơn, Ngày hẹn).',
    inputs: ['Nội dung thông báo mẫu', 'Danh sách biến động trộn dữ liệu (Placeholders)'],
    outputs: ['Template thông báo sẵn sàng sử dụng', 'Phiên bản mẫu thông báo'],
    rules: commonPlatformRules,
    requester: 'HR Communications Specialist',
    controller: 'HR System Admin',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'NTF-02',
    title: 'Thiết lập sự kiện kích hoạt thông báo',
    category: 'Thông báo · Sự kiện kích hoạt',
    description: 'Gắn mẫu thông báo với các sự kiện nghiệp vụ: Sinh nhật, Hết hạn hợp đồng, Yêu cầu duyệt mới, Có phiếu lương, Chấm công trễ.',
    inputs: ['Sự kiện nghiệp vụ kích hoạt', 'Mẫu thông báo tương ứng'],
    outputs: ['Bộ quy tắc kích hoạt thông báo tự động (Notification Triggers)', 'Kịch bản kiểm thử'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'HR Process Lead',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'NTF-03',
    title: 'Xác định đối tượng người nhận',
    category: 'Thông báo · Đối tượng nhận',
    description: 'Quy định danh sách nhận theo vai trò: Cá nhân nhân viên, Quản lý trực tiếp, HR phụ trách, Toàn bộ nhân sự đơn vị.',
    inputs: ['Quy tắc xác định người nhận theo ngữ cảnh', 'Điều kiện lọc đối tượng'],
    outputs: ['Danh sách phân phối thông báo chuẩn xác', 'Không lộ người nhận ngoài thẩm quyền'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Security Lead',
    approver: 'HR Operations Lead'
  }),
  p({
    code: 'NTF-04',
    title: 'Gửi thông báo đa kênh (Email, Portal, SMS)',
    category: 'Thông báo · Phát tán đa kênh',
    description: 'Phát tán thông báo tới các kênh tiếp nhận tương ứng, tối ưu trải nghiệm và đảm bảo tốc độ chuyển phát tin tức.',
    inputs: ['Gói tin thông báo đã khởi tạo', 'Kênh nhận ưu tiên của người dùng'],
    outputs: ['Tin nhắn phát tán thành công đến Email/Portal/SMS', 'Mã log phát tán'],
    rules: commonPlatformRules,
    requester: 'Notification Broker',
    controller: 'Message Gateway',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'NTF-05',
    title: 'Nhắc việc tự động trước hạn',
    category: 'Thông báo · Nhắc việc',
    description: 'Hệ thống quét các nhiệm vụ sắp tới hạn (đánh giá thử việc, nộp hồ sơ thuế, phê duyệt phiếu công) và gửi thông báo nhắc việc.',
    inputs: ['Hạn chót xử lý công việc (Due date)', 'Cấu hình mốc thời gian nhắc (trước 7 ngày, 3 ngày, 1 ngày)'],
    outputs: ['Thông báo nhắc nhở kèm link xử lý nhanh', 'Giảm tỷ lệ xử lý trễ hạn'],
    rules: commonPlatformRules,
    requester: 'Notification Engine (Scheduled Job)',
    controller: 'HR Operations',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'NTF-06',
    title: 'Escalation khi quá hạn nhiệm vụ',
    category: 'Thông báo · Cảnh báo vượt cấp',
    description: 'Khi nhiệm vụ bị quá hạn SLA mà chưa được xử lý, hệ thống gửi cảnh báo trực tiếp đến cấp quản lý cao hơn để can thiệp.',
    inputs: ['Nhiệm vụ quá hạn SLA', 'Cây quản lý trực tiếp và gián tiếp'],
    outputs: ['Thông báo Escalation gửi cấp quản lý', 'Ghi nhận tỷ lệ trễ hạn của đơn vị'],
    rules: commonPlatformRules,
    requester: 'Notification Engine',
    controller: 'HR Governance',
    approver: 'Giám đốc đơn vị'
  }),
  p({
    code: 'NTF-07',
    title: 'Theo dõi trạng thái gửi và nhận',
    category: 'Thông báo · Giám sát phát tán',
    description: 'Thống kê tỷ lệ gửi thành công, tỷ lệ mở xem, các lỗi gửi thất bại (sai email, lỗi mạng) và tự động thử gửi lại (Retry).',
    inputs: ['Dữ liệu phản hồi từ Email/SMS Provider', 'Khoảng thời gian giám sát'],
    outputs: ['Bảng điều khiển Delivery Status', 'Tự động gửi lại tối đa 3 lần'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Notification Broker',
    approver: 'IT Operations'
  }),
  p({
    code: 'NTF-08',
    title: 'Quản lý lựa chọn nhận thông báo của người dùng',
    category: 'Thông báo · Tùy chọn người dùng',
    description: 'Cho phép người lao động tùy chỉnh nhận các loại thông báo không bắt buộc (tin tức nội bộ, bản tin phong trào) theo sở thích.',
    inputs: ['Cài đặt tùy chọn thông báo của nhân viên', 'Quy định thông báo bắt buộc của công ty'],
    outputs: ['Hồ sơ tùy chọn thông báo (Notification Preferences)', 'Tôn trọng quyền riêng tư'],
    rules: commonPlatformRules,
    requester: 'Người lao động',
    controller: 'Notification Engine',
    approver: 'HR Communications'
  })
]

// 7. TÍCH HỢP (MODULE-PLT-INT - 10 SOPs)
export const platformIntegrationProcesses: SopSubProcess[] = [
  p({
    code: 'INT-01',
    title: 'Đăng ký hệ thống tích hợp',
    category: 'Tích hợp · Đăng ký hệ thống',
    description: 'Khai báo hệ thống đối tác kết nối (ERP Kế toán, Máy chấm công, Ngân hàng, Cổng Thuế/BHXH, Active Directory, Job Board).',
    inputs: ['Thông tin hệ thống đối tác', 'Giao thức kết nối (REST API / SFTP / Webhook)'],
    outputs: ['Hệ thống được cấp mã định danh Client ID & Secret', 'Chính sách bảo mật kết nối'],
    rules: commonPlatformRules,
    requester: 'HR Tech Lead',
    controller: 'IT Security Lead',
    approver: 'CIO / IT Director'
  }),
  p({
    code: 'INT-02',
    title: 'Thiết lập API hoặc File Exchange',
    category: 'Tích hợp · Kênh truyền tải',
    description: 'Cấu hình Endpoint, phương thức xác thực (OAuth 2.0 / API Key / mTLS) hoặc đường dẫn thư mục SFTP an toàn.',
    inputs: ['Tài liệu API Specification / SFTP Credentials', 'Môi trường kết nối (Sandbox/Production)'],
    outputs: ['Kênh kết nối được thông tuyến an toàn', 'Kiểm tra Ping/Handshake thành công'],
    rules: commonPlatformRules,
    requester: 'Integration Engineer',
    controller: 'Network & Security Team',
    approver: 'IT Operations Lead'
  }),
  p({
    code: 'INT-03',
    title: 'Thiết lập ánh xạ dữ liệu (Data Mapping)',
    category: 'Tích hợp · Ánh xạ trường',
    description: 'Cấu hình bảng chuyển đổi dữ liệu nguồn và đích (ví dụ: Mã phòng ban HRMS sang Mã Cost Center ERP, Mã nhân viên sang Mã thẻ chấm công).',
    inputs: ['Schema dữ liệu nguồn HRMS', 'Schema dữ liệu đích hệ thống ngoài'],
    outputs: ['Bản đồ ánh xạ dữ liệu (Data Mapping Matrix)', 'Quy tắc chuyển đổi dữ liệu'],
    rules: commonPlatformRules,
    requester: 'HR Data Analyst',
    controller: 'System Architect',
    approver: 'HR Tech Lead'
  }),
  p({
    code: 'INT-04',
    title: 'Đồng bộ dữ liệu theo lịch (Scheduled Batch Sync)',
    category: 'Tích hợp · Đồng bộ định kỳ',
    description: 'Lập lịch tự động chạy các gói đồng bộ dữ liệu ban đêm (quét log máy chấm công hàng ngày, xuất bảng lương sang kế toán hàng tháng).',
    inputs: ['Lịch biểu đồng bộ (Cron Expression)', 'Gói dữ liệu cần đồng bộ'],
    outputs: ['Job đồng bộ tự động kích hoạt đúng giờ', 'Báo cáo số lượng bản ghi đã xử lý'],
    rules: commonPlatformRules,
    requester: 'Integration Engine',
    controller: 'Job Scheduler',
    approver: 'IT Operations Lead'
  }),
  p({
    code: 'INT-05',
    title: 'Đồng bộ dữ liệu theo sự kiện (Real-time Event Sync)',
    category: 'Tích hợp · Sự kiện thời gian thực',
    description: 'Kích hoạt Webhook/Message Queue ngay khi có sự kiện nghiệp vụ (tạo tài khoản AD khi có nhân viên mới, khóa tài khoản khi thôi việc).',
    inputs: ['Sự kiện nghiệp vụ phát sinh', 'Webhook Endpoint nhận tin'],
    outputs: ['Bản tin sự kiện được đẩy tức thì', 'Độ trễ truyền tải < 3 giây'],
    rules: commonPlatformRules,
    requester: 'Event Broker',
    controller: 'Integration Gateway',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'INT-06',
    title: 'Kiểm tra và xử lý lỗi tích hợp',
    category: 'Tích hợp · Xử lý lỗi',
    description: 'Hệ thống bắt lỗi định dạng, lỗi ngắt kết nối hoặc dữ liệu không hợp lệ, ghi log chi tiết và phân loại nguyên nhân lỗi.',
    inputs: ['Log phản hồi lỗi từ hệ thống đích', 'Bản ghi dữ liệu phát sinh lỗi'],
    outputs: ['Hồ sơ ghi nhận lỗi tích hợp', 'Thông báo cảnh báo tới kỹ sư tích hợp'],
    rules: commonPlatformRules,
    requester: 'Integration Error Handler',
    controller: 'IT Support Team',
    approver: 'HR Tech Lead'
  }),
  p({
    code: 'INT-07',
    title: 'Đối soát dữ liệu nguồn và đích',
    category: 'Tích hợp · Đối soát toàn vẹn',
    description: 'Tự động so khớp tổng số lượng bản ghi, tổng số tiền lương hoặc danh sách nhân sự giữa HRMS và hệ thống kế toán/ngân hàng.',
    inputs: ['Snapshot dữ liệu HRMS', 'Snapshot dữ liệu hệ thống đối tác'],
    outputs: ['Biên bản đối soát dữ liệu (Reconciliation Report)', 'Danh sách bản ghi chênh lệch cần xử lý'],
    rules: commonPlatformRules,
    requester: 'HR Data Steward / Kế toán',
    controller: 'Internal Control',
    approver: 'C&B Lead & Chief Accountant'
  }),
  p({
    code: 'INT-08',
    title: 'Gửi lại giao dịch thất bại (Dead Letter Queue & Retry)',
    category: 'Tích hợp · Tự phục hồi',
    description: 'Cơ chế đưa các bản tin lỗi vào hàng đợi DLQ, cho phép HR hoặc Kỹ sư sửa dữ liệu và nhấn nút gửi lại hàng loạt.',
    inputs: ['Danh sách giao dịch lỗi trong hàng đợi DLQ', 'Dữ liệu đã được hiệu chỉnh'],
    outputs: ['Giao dịch được xử lý lại thành công', 'Cập nhật trạng thái đồng bộ'],
    rules: commonPlatformRules,
    requester: 'HR Tech Specialist',
    controller: 'Integration Gateway',
    approver: 'HR Tech Lead'
  }),
  p({
    code: 'INT-09',
    title: 'Theo dõi trạng thái kết nối và hiệu năng',
    category: 'Tích hợp · Giám sát hiệu năng',
    description: 'Bảng điều khiển giám sát tình trạng hoạt động (Health check), thời gian phản hồi (Response Time) và lưu lượng truyền tải (Throughput).',
    inputs: ['Metric kết nối thời gian thực', 'Ngưỡng cảnh báo hiệu năng'],
    outputs: ['Dashboard giám sát sức khỏe tích hợp', 'Cảnh báo tự động khi mất kết nối'],
    rules: commonPlatformRules,
    requester: 'IT Monitoring System',
    controller: 'DevOps / IT Operations',
    approver: 'IT Director'
  }),
  p({
    code: 'INT-10',
    title: 'Ngừng hoặc thay đổi phiên bản tích hợp',
    category: 'Tích hợp · Quản lý vòng đời API',
    description: 'Thực hiện chuyển đổi nâng cấp phiên bản API (v1 sang v2) hoặc đóng kết nối hệ thống đối tác cũ theo quy trình an toàn.',
    inputs: ['Kế hoạch nâng cấp API Version', 'Thời gian ngừng hỗ trợ phiên bản cũ'],
    outputs: ['Chuyển đổi lưu lượng sang API mới an toàn', 'Biên bản nghiệm thu tích hợp'],
    rules: commonPlatformRules,
    requester: 'HR Tech Lead',
    controller: 'Enterprise Architect',
    approver: 'CIO'
  })
]

// 8. PHÂN QUYỀN (MODULE-PLT-SEC - 10 SOPs)
export const platformSecurityProcesses: SopSubProcess[] = [
  p({
    code: 'SEC-01',
    title: 'Tạo vai trò và nhóm quyền',
    category: 'Phân quyền · Vai trò',
    description: 'Xác định các vai trò nghiệp vụ chuẩn trong doanh nghiệp (HR Admin, HRBP, C&B Specialist, Tuyển dụng, Quản lý trực tiếp, Nhân viên).',
    inputs: ['Mô tả chức năng công việc', 'Nguyên tắc bảo mật phân quyền RBAC'],
    outputs: ['Hồ sơ vai trò hệ thống mới', 'Danh mục chức năng gán vào vai trò'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Information Security Lead',
    approver: 'HR Director'
  }),
  p({
    code: 'SEC-02',
    title: 'Gán chức năng cho vai trò',
    category: 'Phân quyền · Quyền chức năng',
    description: 'Cấu hình quyền Xem, Thêm, Sửa, Xóa, Xuất file, Phê duyệt cho từng màn hình cụ thể trong hệ thống.',
    inputs: ['Cây menu chức năng hệ thống', 'Ma trận quyền chức năng của vai trò'],
    outputs: ['Bảng phân quyền chức năng của vai trò', 'Kiểm thử quyền màn hình'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'HR Process Lead',
    approver: 'HR Director'
  }),
  p({
    code: 'SEC-03',
    title: 'Thiết lập phạm vi dữ liệu (Data Scope)',
    category: 'Phân quyền · Quyền dữ liệu',
    description: 'Xác định ranh giới dữ liệu người dùng được thấy: Bản thân (Self), Cấp dưới trực tiếp (Direct Reports), Phòng ban, Chi nhánh hoặc Toàn công ty.',
    inputs: ['Cơ cấu tổ chức & Cây quản lý', 'Chính sách bảo vệ dữ liệu cá nhân'],
    outputs: ['Bộ lọc phạm vi dữ liệu tự động (Data Filter Logic)', 'Ngăn chặn truy cập dữ liệu ngoài phạm vi'],
    rules: commonPlatformRules,
    requester: 'HR System Admin',
    controller: 'Data Privacy Officer (DPO)',
    approver: 'HR Director'
  }),
  p({
    code: 'SEC-04',
    title: 'Gán vai trò cho người dùng',
    category: 'Phân quyền · Phân quyền tài khoản',
    description: 'Gán một hoặc nhiều vai trò cho tài khoản nhân viên theo quyết định bổ nhiệm hoặc phân công nhiệm vụ.',
    inputs: ['Mã nhân viên', 'Danh sách vai trò cần gán', 'Phạm vi đơn vị phụ trách'],
    outputs: ['Tài khoản được kích hoạt quyền truy cập tương ứng', 'Thông báo quyền mới cho người dùng'],
    rules: commonPlatformRules,
    requester: 'HR Admin / Quản lý',
    controller: 'HR System Admin',
    approver: 'Trưởng phòng Nhân sự'
  }),
  p({
    code: 'SEC-05',
    title: 'Phê duyệt quyền truy cập dữ liệu nhạy cảm',
    category: 'Phân quyền · Dữ liệu nhạy cảm',
    description: 'Quy trình thẩm định và phê duyệt đặc biệt khi nhân sự cần truy cập dữ liệu lương, thông tin sức khỏe, hoặc xuất khẩu dữ liệu lớn.',
    inputs: ['Tờ trình xin cấp quyền đặc thù', 'Cam kết bảo mật thông tin NDA'],
    outputs: ['Quyết định cấp quyền có thời hạn', 'Ghi log giám sát tăng cường'],
    rules: commonPlatformRules,
    requester: 'Người đề xuất',
    controller: 'Data Privacy Officer & IT Security',
    approver: 'CHRO'
  }),
  p({
    code: 'SEC-06',
    title: 'Ủy quyền truy cập tạm thời',
    category: 'Phân quyền · Quyền tạm thời',
    description: 'Cấp quyền tạm thời cho nhân sự thay thế trong thời gian nghỉ phép hoặc tham gia dự án đặc thù, tự động thu hồi khi hết hạn.',
    inputs: ['Khoảng thời gian hiệu lực quyền tạm', 'Phạm vi chức năng ủy quyền'],
    outputs: ['Quyền tạm thời được kích hoạt có đếm ngược', 'Tự động thu hồi đúng hạn'],
    rules: commonPlatformRules,
    requester: 'Người ủy quyền / Quản lý',
    controller: 'HR System Admin',
    approver: 'Trưởng phòng Nhân sự'
  }),
  p({
    code: 'SEC-07',
    title: 'Rà soát quyền định kỳ (Access Review)',
    category: 'Phân quyền · Kiểm toán định kỳ',
    description: 'Rà soát định kỳ hàng quý toàn bộ danh sách tài khoản, vai trò và quyền hạn để phát hiện các quyền dư thừa không còn sử dụng.',
    inputs: ['Báo cáo danh sách quyền hiện hành', 'Danh sách biến động công tác gần nhất'],
    outputs: ['Biên bản rà soát quyền định kỳ', 'Danh sách quyền cần điều chỉnh/thu hồi'],
    rules: commonPlatformRules,
    requester: 'Internal Auditor / DPO',
    controller: 'HRBP Lead',
    approver: 'CHRO'
  }),
  p({
    code: 'SEC-08',
    title: 'Thu hồi quyền truy cập',
    category: 'Phân quyền · Thu hồi quyền',
    description: 'Lập tức khóa hoặc thu hồi các quyền truy cập khi nhân viên chuyển công tác, thay đổi vị trí hoặc có quyết định thôi việc.',
    inputs: ['Quyết định thuyên chuyển / Quyết định thôi việc', 'Mã nhân viên'],
    outputs: ['Toàn bộ quyền bị thu hồi hoặc hạ cấp an toàn', 'Phiên đăng nhập hiện tại bị ngắt kết nối'],
    rules: commonPlatformRules,
    requester: 'HR Admin',
    controller: 'HR System Admin',
    approver: 'Trưởng phòng Nhân sự'
  }),
  p({
    code: 'SEC-09',
    title: 'Kiểm soát xung đột quyền (Separation of Duties)',
    category: 'Phân quyền · Chống xung đột SoD',
    description: 'Hệ thống tự động phát hiện và cảnh báo các cấu hình xung đột lợi ích (ví dụ: cùng một người vừa tạo bảng lương vừa phê duyệt chi trả).',
    inputs: ['Ma trận xung đột nhiệm vụ SoD', 'Đề xuất gán vai trò mới'],
    outputs: ['Cảnh báo xung đột quyền tự động', 'Ngăn chặn gán quyền vi phạm nguyên tắc SoD'],
    rules: commonPlatformRules,
    requester: 'Security Engine',
    controller: 'Internal Audit',
    approver: 'CHRO'
  }),
  p({
    code: 'SEC-10',
    title: 'Quản lý tài khoản đặc quyền (Privileged Access)',
    category: 'Phân quyền · Tài khoản Admin',
    description: 'Quản lý nghiêm ngặt các tài khoản Super Admin, bắt buộc xác thực đa yếu tố MFA, lưu log mọi thao tác và rà soát hàng tháng.',
    inputs: ['Danh sách tài khoản Admin tối cao', 'Chính sách quản lý tài khoản đặc quyền'],
    outputs: ['Nhật ký giám sát tài khoản Admin', 'MFA bắt buộc khi đăng nhập'],
    rules: commonPlatformRules,
    requester: 'IT Security Lead',
    controller: 'Internal Audit',
    approver: 'CIO & CHRO'
  })
]

// 9. AUDIT LOG (MODULE-PLT-AUD - 8 SOPs)
export const platformAuditProcesses: SopSubProcess[] = [
  p({
    code: 'AUD-01',
    title: 'Ghi nhận nhật ký đăng nhập và phiên làm việc',
    category: 'Audit log · Nhật ký truy cập',
    description: 'Ghi nhận toàn bộ thông tin đăng nhập: Thời gian, Địa chỉ IP, Thiết bị, Trình duyệt, Kết quả (Thành công/Thất bại), Đăng xuất.',
    inputs: ['Thông tin phiên kết nối người dùng', 'Kết quả xác thực'],
    outputs: ['Bản ghi Session Audit Log', 'Cảnh báo khi đăng nhập bất thường'],
    rules: commonPlatformRules,
    requester: 'Authentication Service',
    controller: 'Audit Broker',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'AUD-02',
    title: 'Ghi nhận thay đổi dữ liệu (Data Change Log)',
    category: 'Audit log · Lịch sử dữ liệu',
    description: 'Lưu vết chính xác từng trường thông tin bị thay đổi: Giá trị cũ, Giá trị mới, Người thực hiện, Thời điểm và Lý do nghiệp vụ.',
    inputs: ['Giao dịch thêm/sửa/xóa dữ liệu', 'Giá trị trước và sau khi thay đổi'],
    outputs: ['Bản ghi Data Audit Trail bất biến (Immutable)', 'Khả năng tái hiện trạng thái cũ'],
    rules: commonPlatformRules,
    requester: 'Database Change Interceptor',
    controller: 'Audit Broker',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'AUD-03',
    title: 'Ghi nhận lịch sử phê duyệt và luân chuyển',
    category: 'Audit log · Lịch sử quy trình',
    description: 'Lưu vết từng hành động trong quy trình: Gửi yêu cầu, Xem đơn, Đồng ý, Từ chối, Trả lại, Ủy quyền kèm ý kiến nhận xét.',
    inputs: ['Hành động xử lý workflow', 'Ý kiến và chữ ký của người duyệt'],
    outputs: ['Dòng thời gian phê duyệt bất biến', 'Cung cấp dữ liệu kiểm toán quy trình'],
    rules: commonPlatformRules,
    requester: 'Workflow Engine',
    controller: 'Audit Broker',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'AUD-04',
    title: 'Ghi nhận hoạt động xem và xuất dữ liệu',
    category: 'Audit log · Giám sát dữ liệu nhạy cảm',
    description: 'Ghi log mỗi khi người dùng xem hồ sơ nhân sự, xem bảng lương hoặc nhấn nút Xuất file Excel/PDF ra máy tính cá nhân.',
    inputs: ['Hành động Xem / Xuất báo cáo', 'Số lượng bản ghi và phạm vi dữ liệu xuất'],
    outputs: ['Nhật ký xuất khẩu dữ liệu', 'Cảnh báo khi xuất dữ liệu dung lượng lớn'],
    rules: commonPlatformRules,
    requester: 'Data Access Layer',
    controller: 'Security Lead',
    approver: 'Hệ thống tự động'
  }),
  p({
    code: 'AUD-05',
    title: 'Tra cứu và lọc nhật ký kiểm toán',
    category: 'Audit log · Tìm kiếm nhật ký',
    description: 'Cung cấp công cụ tra cứu mạnh mẽ theo người dùng, đối tượng dữ liệu, khoảng thời gian, mã giao dịch (Correlation ID) và loại hành động.',
    inputs: ['Bộ lọc tra cứu kiểm toán', 'Quyền hạn của người tra cứu'],
    outputs: ['Danh sách log chi tiết', 'Báo cáo trích xuất phục vụ kiểm tra'],
    rules: commonPlatformRules,
    requester: 'Auditor / HR Compliance',
    controller: 'Audit Log Storage',
    approver: 'HR Director'
  }),
  p({
    code: 'AUD-06',
    title: 'Phát hiện và cảnh báo hoạt động bất thường',
    category: 'Audit log · Cảnh báo rủi ro',
    description: 'Hệ thống tự động phân tích hành vi và gửi cảnh báo khi phát hiện đăng nhập từ IP lạ, nhập sai mật khẩu nhiều lần hoặc tải dữ liệu hàng loạt.',
    inputs: ['Dòng dữ liệu log thời gian thực', 'Quy tắc phát hiện bất thường (Anomaly Detection Rules)'],
    outputs: ['Cảnh báo an ninh thông tin gửi IT & HR', 'Tự động tạm khóa tài khoản nguy cơ'],
    rules: commonPlatformRules,
    requester: 'Security Monitoring Engine',
    controller: 'SOC / IT Security',
    approver: 'CISO'
  }),
  p({
    code: 'AUD-07',
    title: 'Lưu trữ và chính sách hết hạn nhật ký (Log Retention)',
    category: 'Audit log · Lưu trữ & Hết hạn',
    description: 'Chính sách lưu giữ log tối thiểu theo quy định pháp luật (ví dụ: 1-5 năm), nén lưu trữ lạnh (Cold Storage) và chống chỉnh sửa/xóa log.',
    inputs: ['Chính sách lưu trữ kiểm toán', 'Dữ liệu log quá thời hạn lưu trữ nóng'],
    outputs: ['Kho lưu trữ nén bảo mật (WORM Storage)', 'Tiêu hủy log hết hạn an toàn theo quy định'],
    rules: commonPlatformRules,
    requester: 'Data Retention Engine',
    controller: 'IT Security Lead',
    approver: 'Chief Information Security Officer'
  }),
  p({
    code: 'AUD-08',
    title: 'Cung cấp bằng chứng và báo cáo kiểm toán',
    category: 'Audit log · Báo cáo kiểm toán',
    description: 'Kết xuất hồ sơ bằng chứng số phục vụ kiểm toán nội bộ, kiểm toán độc lập hoặc thanh tra cơ quan quản lý nhà nước.',
    inputs: ['Yêu cầu cung cấp bằng chứng kiểm toán', 'Phạm vi thời gian và đối tượng'],
    outputs: ['Gói hồ sơ bằng chứng kiểm toán có đóng dấu xác thực số', 'Biên bản bàn giao số liệu'],
    rules: commonPlatformRules,
    requester: 'Kiểm toán viên / Trưởng ban kiểm soát',
    controller: 'Compliance Lead',
    approver: 'CHRO & General Director'
  })
]

export const PLATFORM_FOUNDATION_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  'MODULE-PLT-MD': platformSharedMasterDataProcesses,
  'MODULE-PLT-CFG': platformConfigurationProcesses,
  'MODULE-PLT-WFL': platformWorkflowProcesses,
  'MODULE-PLT-DOC': platformDocumentProcesses,
  'MODULE-PLT-SIG': platformSignatureProcesses,
  'MODULE-PLT-NTF': platformNotificationProcesses,
  'MODULE-PLT-INT': platformIntegrationProcesses,
  'MODULE-PLT-SEC': platformSecurityProcesses,
  'MODULE-PLT-AUD': platformAuditProcesses
}
