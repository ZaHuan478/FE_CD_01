import type { SopSubProcess, SopSubStep } from '../types'

type StepType = SopSubStep['typeCode']

interface StepSeed {
  title: string
  actor: string
  type: StepType
  description: string
  fields: string[]
  location?: string
  timing?: string
}

interface ProcessSeed {
  code: string
  title: string
  category: string
  description: string
  inputs: string[]
  outputs: string[]
  rules: string[]
  steps: StepSeed[]
}

const buildProcess = (seed: ProcessSeed): SopSubProcess => {
  const [domain, sequence] = seed.code.replace('SOP-', '').split('-')

  return {
    sopCode: seed.code,
    sopTitle: `Quy trình ${seed.title}`,
    sopCategory: seed.category,
    description: seed.description,
    inputs: seed.inputs,
    outputs: seed.outputs,
    rules: seed.rules,
    sourceNote: 'Khung nghiệp vụ demo HRMS. Cần cấu hình theo quy chế, cơ cấu phê duyệt và chính sách dữ liệu của từng doanh nghiệp.',
    steps: seed.steps.map((step, index) => ({
      stepCode: `${domain}${sequence}.${String(index + 1).padStart(2, '0')}`,
      title: step.title,
      actor: step.actor,
      location: step.location ?? 'HRM Portal',
      timing: step.timing ?? 'Theo SLA được cấu hình',
      typeCode: step.type,
      description: step.description,
      fieldsChecklist: step.fields
    }))
  }
}

const onboardingProcesses: ProcessSeed[] = [
  {
    code: 'SOP-ONB-01',
    title: 'Khởi tạo hồ sơ tiếp nhận nhân viên mới',
    category: 'Onboarding · Khởi tạo tiếp nhận',
    description: 'Chuyển ứng viên đã nhận offer hoặc nhân sự tiếp nhận trực tiếp thành hồ sơ chờ nhận việc, xác định ngày vào làm, đơn vị, vị trí và người phụ trách hội nhập.',
    inputs: ['Offer đã được ứng viên chấp thuận hoặc quyết định tiếp nhận', 'Thông tin định danh và liên hệ của nhân viên mới', 'Đơn vị, vị trí, cấp quản lý và ngày nhận việc'],
    outputs: ['Mã hồ sơ Pre-onboarding', 'Checklist tiếp nhận theo vị trí', 'Danh sách bên liên quan cần phối hợp'],
    rules: ['Không tạo trùng hồ sơ theo CCCD, hộ chiếu, email hoặc số điện thoại', 'Ngày nhận việc phải nằm trong hiệu lực của quyết định hoặc offer', 'Chỉ chuyển sang chuẩn bị tiếp nhận khi thông tin tối thiểu đã đầy đủ'],
    steps: [
      { title: 'Tiếp nhận dữ liệu trúng tuyển hoặc quyết định tiếp nhận', actor: 'Chuyên viên Tuyển dụng hoặc HR Operations', type: 'N', description: 'Chọn nguồn tiếp nhận, kiểm tra offer và khởi tạo yêu cầu Onboarding.', fields: ['Nguồn tiếp nhận', 'Ngày nhận việc', 'Đơn vị', 'Vị trí', 'Quản lý trực tiếp'] },
      { title: 'Kiểm tra trùng và tính hợp lệ của hồ sơ', actor: 'Hệ thống HRM', type: 'A', description: 'Đối chiếu thông tin định danh với ứng viên, nhân viên hiện hữu và hồ sơ đã nghỉ việc.', fields: ['CCCD hoặc hộ chiếu', 'Email', 'Số điện thoại', 'Kết quả đối chiếu'] },
      { title: 'Xác nhận phạm vi tiếp nhận', actor: 'HR Operations', type: 'C', description: 'Xác nhận loại nhân sự, nơi làm việc, đơn vị, cấp quản lý và bộ checklist áp dụng.', fields: ['Loại nhân sự', 'Địa điểm làm việc', 'Mẫu checklist', 'HR phụ trách'] },
      { title: 'Phát hành hồ sơ Pre-onboarding', actor: 'Hệ thống HRM', type: 'A', description: 'Sinh mã tiếp nhận và thông báo nhiệm vụ cho các bên tham gia.', fields: ['Mã Pre-onboarding', 'Trạng thái hồ sơ', 'Danh sách người nhận thông báo'] }
    ]
  },
  {
    code: 'SOP-ONB-02',
    title: 'Thu thập và kiểm tra hồ sơ trước ngày nhận việc',
    category: 'Onboarding · Hồ sơ đầu vào',
    description: 'Thu thập hồ sơ cá nhân, bằng cấp, tài khoản ngân hàng, thông tin thuế và bảo hiểm trước ngày đi làm để giảm nhập liệu lại và phát hiện thiếu sót sớm.',
    inputs: ['Mã hồ sơ Pre-onboarding', 'Danh mục hồ sơ bắt buộc theo loại lao động', 'Tài liệu do nhân viên mới cung cấp'],
    outputs: ['Bộ hồ sơ điện tử đã kiểm tra', 'Danh sách tài liệu còn thiếu hoặc cần bổ sung', 'Thông tin sẵn sàng tạo hồ sơ nhân viên'],
    rules: ['Mỗi tài liệu phải có loại, ngày hiệu lực và trạng thái kiểm tra', 'Dữ liệu nhạy cảm chỉ hiển thị theo phân quyền', 'Không đánh dấu hoàn tất nếu còn tài liệu bắt buộc bị thiếu hoặc hết hiệu lực'],
    steps: [
      { title: 'Gửi yêu cầu bổ sung hồ sơ', actor: 'Hệ thống HRM', type: 'A', description: 'Gửi đường dẫn bảo mật và danh sách tài liệu cần nộp cho nhân viên mới.', fields: ['Hạn nộp', 'Danh mục tài liệu', 'Kênh xác thực'] },
      { title: 'Khai báo và tải tài liệu', actor: 'Nhân viên mới', type: 'N', description: 'Khai báo thông tin cá nhân và tải bản chụp tài liệu theo checklist.', fields: ['Thông tin cá nhân', 'CCCD hoặc hộ chiếu', 'Bằng cấp', 'Tài khoản ngân hàng', 'Thông tin thuế và BHXH'] },
      { title: 'Kiểm tra tính đầy đủ và nhất quán', actor: 'HR Operations', type: 'C', description: 'So khớp dữ liệu khai báo với tài liệu, ghi nhận ngoại lệ và yêu cầu bổ sung nếu cần.', fields: ['Trạng thái từng tài liệu', 'Sai lệch phát hiện', 'Yêu cầu bổ sung'] },
      { title: 'Chốt bộ hồ sơ trước nhận việc', actor: 'HR Operations', type: 'M', description: 'Xác nhận bộ hồ sơ đạt yêu cầu để chuyển sang bước tiếp nhận.', fields: ['Kết quả kiểm tra', 'Người xác nhận', 'Thời điểm xác nhận'] }
    ]
  },
  {
    code: 'SOP-ONB-03',
    title: 'Lập kế hoạch tiếp nhận liên phòng ban',
    category: 'Onboarding · Điều phối',
    description: 'Điều phối nhiệm vụ chuẩn bị chỗ ngồi, thiết bị, tài khoản, người hướng dẫn, lịch gặp và tài liệu hội nhập giữa HR, IT, Hành chính và đơn vị tiếp nhận.',
    inputs: ['Hồ sơ Pre-onboarding đã xác nhận ngày nhận việc', 'Checklist theo vị trí và địa điểm', 'Danh mục đầu mối HR, IT, Hành chính và quản lý'],
    outputs: ['Kế hoạch tiếp nhận có người phụ trách và hạn hoàn thành', 'Lịch trình ngày đầu', 'Cảnh báo nhiệm vụ trễ hạn'],
    rules: ['Mỗi nhiệm vụ phải có một người chịu trách nhiệm và hạn hoàn thành', 'Nhiệm vụ quan trọng phải hoàn tất trước ngày nhận việc', 'Thay đổi ngày nhận việc phải cập nhật đồng bộ toàn bộ checklist'],
    steps: [
      { title: 'Sinh checklist theo vị trí', actor: 'Hệ thống HRM', type: 'A', description: 'Áp dụng mẫu checklist tương ứng loại nhân sự, vị trí và địa điểm làm việc.', fields: ['Mẫu checklist', 'Danh sách nhiệm vụ', 'Hạn hoàn thành mặc định'] },
      { title: 'Phân công đầu mối thực hiện', actor: 'HR Operations', type: 'N', description: 'Giao nhiệm vụ cho IT, Hành chính, quản lý trực tiếp và người hướng dẫn.', fields: ['Người phụ trách', 'Người phối hợp', 'Hạn hoàn thành'] },
      { title: 'Xác nhận kế hoạch ngày đầu', actor: 'Quản lý trực tiếp', type: 'M', description: 'Xác nhận lịch giới thiệu đội ngũ, mục tiêu tuần đầu và người hướng dẫn.', fields: ['Lịch ngày đầu', 'Buddy hoặc mentor', 'Mục tiêu tuần đầu'] },
      { title: 'Theo dõi tiến độ chuẩn bị', actor: 'Hệ thống HRM', type: 'A', description: 'Tổng hợp trạng thái và nhắc việc khi nhiệm vụ gần hoặc quá hạn.', fields: ['Tỷ lệ hoàn thành', 'Nhiệm vụ trễ', 'Thông báo nhắc việc'] }
    ]
  },
  {
    code: 'SOP-ONB-04',
    title: 'Cấp tài khoản, thiết bị và quyền truy cập',
    category: 'Onboarding · Sẵn sàng làm việc',
    description: 'Cấp phát tài khoản hệ thống, thiết bị, thẻ ra vào và quyền truy cập theo vị trí, đảm bảo nguyên tắc tối thiểu cần thiết và có bằng chứng bàn giao.',
    inputs: ['Hồ sơ tiếp nhận đã được phê duyệt', 'Ma trận quyền theo vai trò và đơn vị', 'Danh mục thiết bị và tài sản khả dụng'],
    outputs: ['Tài khoản và quyền truy cập đã kích hoạt đúng thời điểm', 'Biên bản bàn giao thiết bị và tài sản', 'Nhật ký phê duyệt quyền'],
    rules: ['Không kích hoạt quyền trước ngày bắt đầu nếu không có phê duyệt ngoại lệ', 'Quyền cấp phải theo vai trò, đơn vị và nguyên tắc tối thiểu', 'Tài sản phải có mã, tình trạng và người nhận'],
    steps: [
      { title: 'Đề xuất gói tài khoản và tài sản', actor: 'Hệ thống HRM', type: 'A', description: 'Đề xuất quyền, ứng dụng và thiết bị theo vị trí đã được phê duyệt.', fields: ['Gói quyền', 'Ứng dụng', 'Thiết bị', 'Thẻ ra vào'] },
      { title: 'Kiểm tra và phê duyệt quyền đặc biệt', actor: 'Quản lý trực tiếp và Chủ hệ thống', type: 'M', description: 'Xem xét các quyền ngoài gói chuẩn hoặc quyền truy cập dữ liệu nhạy cảm.', fields: ['Quyền đặc biệt', 'Lý do nghiệp vụ', 'Thời hạn quyền'] },
      { title: 'Cấp tài khoản và chuẩn bị thiết bị', actor: 'IT và Hành chính', type: 'N', description: 'Tạo tài khoản, cấu hình thiết bị, chuẩn bị thẻ và ghi nhận mã tài sản.', fields: ['Tên đăng nhập', 'Mã thiết bị', 'Mã tài sản', 'Trạng thái cấu hình'] },
      { title: 'Kích hoạt và ghi nhận bàn giao', actor: 'IT và Nhân viên mới', type: 'C', description: 'Kích hoạt đúng ngày, xác nhận nhận thiết bị và lưu bằng chứng bàn giao.', fields: ['Thời điểm kích hoạt', 'Biên bản bàn giao', 'Xác nhận người nhận'] }
    ]
  },
  {
    code: 'SOP-ONB-05',
    title: 'Tiếp nhận ngày đầu và xác nhận nhận việc',
    category: 'Onboarding · Ngày đầu',
    description: 'Kiểm tra nhân viên có mặt, hoàn tất thủ tục xác nhận nhận việc, giới thiệu đơn vị và bàn giao các điều kiện làm việc trong ngày đầu tiên.',
    inputs: ['Lịch nhận việc và kế hoạch ngày đầu', 'Bộ hồ sơ đã kiểm tra', 'Tài khoản, thiết bị và nơi làm việc đã chuẩn bị'],
    outputs: ['Trạng thái đã nhận việc hoặc không đến nhận việc', 'Biên bản bàn giao và xác nhận chính sách', 'Hồ sơ nhân viên được kích hoạt'],
    rules: ['Chỉ kích hoạt hồ sơ chính thức khi có xác nhận nhận việc', 'Trường hợp không đến nhận việc phải ghi nhận lý do và thông báo các bên', 'Tài liệu bắt buộc phải được xác nhận theo phiên bản hiệu lực'],
    steps: [
      { title: 'Check-in và đối chiếu danh tính', actor: 'HR Operations', type: 'C', description: 'Xác nhận người đến nhận việc và đối chiếu giấy tờ bản gốc khi chính sách yêu cầu.', fields: ['Thời gian check-in', 'Giấy tờ đối chiếu', 'Kết quả xác minh'] },
      { title: 'Xác nhận nhận việc và chính sách', actor: 'Nhân viên mới', type: 'N', description: 'Xác nhận ngày bắt đầu, nội quy, bảo mật và các tài liệu bắt buộc.', fields: ['Ngày bắt đầu thực tế', 'Xác nhận nội quy', 'Cam kết bảo mật'] },
      { title: 'Bàn giao điều kiện làm việc', actor: 'IT, Hành chính và Quản lý trực tiếp', type: 'C', description: 'Bàn giao thiết bị, thẻ, tài khoản và giới thiệu đội ngũ.', fields: ['Thiết bị đã nhận', 'Tài khoản đã kiểm tra', 'Người hướng dẫn'] },
      { title: 'Kích hoạt hồ sơ nhân viên', actor: 'Hệ thống HRM', type: 'A', description: 'Chuyển hồ sơ từ Pre-onboarding sang đang làm việc và kích hoạt các nghiệp vụ liên quan.', fields: ['Mã nhân viên', 'Trạng thái làm việc', 'Ngày hiệu lực'] }
    ]
  },
  {
    code: 'SOP-ONB-06',
    title: 'Đào tạo hội nhập và theo dõi hoàn thành',
    category: 'Onboarding · Hội nhập',
    description: 'Giao chương trình hội nhập bắt buộc, theo dõi tiến độ học, kiểm tra kiến thức và xử lý các nội dung chưa hoàn thành trong giai đoạn đầu.',
    inputs: ['Hồ sơ nhân viên đã kích hoạt', 'Chương trình hội nhập theo nhóm vị trí', 'Danh mục nội dung bắt buộc và hạn hoàn thành'],
    outputs: ['Kết quả hoàn thành từng nội dung hội nhập', 'Điểm kiểm tra hoặc xác nhận tham dự', 'Danh sách nội dung quá hạn cần xử lý'],
    rules: ['Nội dung bắt buộc phải hoàn thành trong thời hạn cấu hình', 'Kết quả kiểm tra phải đạt ngưỡng tối thiểu', 'Nội dung liên quan an toàn hoặc bảo mật phải được học lại khi không đạt'],
    steps: [
      { title: 'Giao chương trình hội nhập', actor: 'Hệ thống HRM hoặc LMS', type: 'A', description: 'Gán khóa học, tài liệu và lịch đào tạo phù hợp với vị trí.', fields: ['Chương trình', 'Nội dung bắt buộc', 'Hạn hoàn thành'] },
      { title: 'Tham gia và xác nhận nội dung', actor: 'Nhân viên mới', type: 'N', description: 'Học tài liệu, tham dự buổi giới thiệu và thực hiện bài kiểm tra.', fields: ['Tiến độ học', 'Xác nhận tham dự', 'Kết quả kiểm tra'] },
      { title: 'Theo dõi và hỗ trợ hội nhập', actor: 'Buddy, Quản lý trực tiếp và HR', type: 'C', description: 'Theo dõi vướng mắc và ghi nhận hỗ trợ trong các mốc tuần đầu, tháng đầu.', fields: ['Vướng mắc', 'Hành động hỗ trợ', 'Người phụ trách'] },
      { title: 'Chốt kết quả hội nhập', actor: 'HR Operations', type: 'M', description: 'Xác nhận hoàn thành hoặc lập kế hoạch bổ sung cho nội dung chưa đạt.', fields: ['Kết quả tổng thể', 'Nội dung chưa đạt', 'Kế hoạch bổ sung'] }
    ]
  },
  {
    code: 'SOP-ONB-07',
    title: 'Đánh giá hội nhập và bàn giao sang vận hành',
    category: 'Onboarding · Kết thúc hội nhập',
    description: 'Đánh giá mức độ thích nghi, hoàn tất checklist, xử lý tồn đọng và bàn giao nhân viên sang quản lý thường xuyên hoặc quy trình đánh giá thử việc.',
    inputs: ['Kết quả checklist tiếp nhận', 'Kết quả đào tạo hội nhập', 'Phản hồi của nhân viên, buddy và quản lý'],
    outputs: ['Biên bản hoàn tất Onboarding', 'Danh sách hành động còn mở có người chịu trách nhiệm', 'Bàn giao sang quản lý nhân sự hoặc đánh giá thử việc'],
    rules: ['Không đóng Onboarding nếu còn nhiệm vụ bắt buộc chưa có phương án xử lý', 'Phản hồi phải được giới hạn quyền xem', 'Mọi hành động tồn đọng phải có hạn xử lý và người phụ trách'],
    steps: [
      { title: 'Thu thập phản hồi hội nhập', actor: 'Hệ thống HRM', type: 'A', description: 'Gửi khảo sát cho nhân viên mới, buddy và quản lý theo mốc cấu hình.', fields: ['Mốc khảo sát', 'Điểm hài lòng', 'Ý kiến phản hồi'] },
      { title: 'Đánh giá mức độ sẵn sàng', actor: 'Quản lý trực tiếp', type: 'M', description: 'Đánh giá mức độ hiểu công việc, khả năng tiếp cận nguồn lực và các hỗ trợ cần thiết.', fields: ['Mức độ sẵn sàng', 'Khoảng trống cần hỗ trợ', 'Kế hoạch tiếp theo'] },
      { title: 'Đối soát và đóng checklist', actor: 'HR Operations', type: 'C', description: 'Kiểm tra tất cả nhiệm vụ, tài liệu và bằng chứng trước khi đóng hồ sơ.', fields: ['Nhiệm vụ hoàn thành', 'Tồn đọng', 'Bằng chứng'] },
      { title: 'Bàn giao sang vận hành nhân sự', actor: 'Hệ thống HRM', type: 'A', description: 'Đóng Onboarding và kích hoạt mốc thử việc hoặc chu kỳ quản lý nhân sự tiếp theo.', fields: ['Ngày hoàn tất', 'Trạng thái bàn giao', 'Quy trình tiếp theo'] }
    ]
  }
]

const selfServiceProcesses: ProcessSeed[] = [
  {
    code: 'SOP-ESS-01',
    title: 'Cập nhật thông tin cá nhân qua ESS',
    category: 'ESS · Hồ sơ cá nhân',
    description: 'Cho phép nhân viên tự đề nghị cập nhật thông tin cá nhân và tài liệu chứng minh, qua kiểm soát HR trước khi ghi nhận vào hồ sơ chính thức.',
    inputs: ['Tài khoản nhân viên đang hoạt động', 'Thông tin cần thay đổi', 'Tài liệu chứng minh theo loại thay đổi'],
    outputs: ['Yêu cầu cập nhật có trạng thái theo dõi', 'Hồ sơ nhân viên được cập nhật sau phê duyệt', 'Nhật ký trước và sau thay đổi'],
    rules: ['Không cho sửa trực tiếp trường dữ liệu gốc cần kiểm soát', 'Thay đổi nhạy cảm phải có tài liệu chứng minh', 'Lưu toàn bộ phiên bản trước và sau thay đổi'],
    steps: [
      { title: 'Khởi tạo yêu cầu thay đổi thông tin', actor: 'Nhân viên', type: 'N', description: 'Chọn nhóm thông tin, nhập giá trị mới và đính kèm tài liệu.', fields: ['Trường thay đổi', 'Giá trị hiện tại', 'Giá trị đề nghị', 'Tài liệu'] },
      { title: 'Kiểm tra dữ liệu và điều kiện', actor: 'Hệ thống HRM', type: 'A', description: 'Kiểm tra định dạng, trường bắt buộc và yêu cầu tài liệu theo loại thay đổi.', fields: ['Kết quả kiểm tra', 'Cảnh báo trùng', 'Tài liệu bắt buộc'] },
      { title: 'Thẩm định yêu cầu', actor: 'HR Operations', type: 'M', description: 'Đối chiếu tài liệu và phê duyệt, từ chối hoặc yêu cầu bổ sung.', fields: ['Kết quả thẩm định', 'Ý kiến xử lý', 'Ngày hiệu lực'] },
      { title: 'Cập nhật hồ sơ và lưu vết', actor: 'Hệ thống HRM', type: 'A', description: 'Ghi nhận dữ liệu được duyệt, lưu phiên bản cũ và thông báo kết quả.', fields: ['Dữ liệu mới', 'Lịch sử thay đổi', 'Thông báo'] }
    ]
  },
  {
    code: 'SOP-ESS-02',
    title: 'Tra cứu hồ sơ, hợp đồng và tài liệu cá nhân',
    category: 'ESS · Tra cứu',
    description: 'Cung cấp cho nhân viên một điểm truy cập có kiểm soát để xem thông tin hồ sơ, hợp đồng, quyết định và tài liệu cá nhân được phép công bố.',
    inputs: ['Tài khoản đã xác thực', 'Phạm vi dữ liệu được phân quyền', 'Hồ sơ và tài liệu đã phát hành'],
    outputs: ['Nội dung tra cứu đúng phạm vi', 'Lịch sử xem hoặc tải tài liệu nhạy cảm', 'Yêu cầu hỗ trợ khi phát hiện sai lệch'],
    rules: ['Chỉ chủ thể dữ liệu được xem hồ sơ cá nhân của mình', 'Tài liệu nhạy cảm cần xác thực tăng cường khi cấu hình', 'Mọi lượt tải tài liệu phải được lưu audit log'],
    steps: [
      { title: 'Xác thực người dùng và thiết bị', actor: 'Hệ thống IAM', type: 'A', description: 'Xác thực phiên đăng nhập và đánh giá điều kiện truy cập.', fields: ['Tài khoản', 'Phiên đăng nhập', 'Thiết bị', 'Kết quả xác thực'] },
      { title: 'Chọn thông tin cần tra cứu', actor: 'Nhân viên', type: 'N', description: 'Chọn hồ sơ, hợp đồng, quyết định hoặc tài liệu cá nhân.', fields: ['Nhóm tài liệu', 'Kỳ dữ liệu', 'Mục đích truy cập'] },
      { title: 'Áp dụng quyền và che dữ liệu', actor: 'Hệ thống HRM', type: 'C', description: 'Kiểm tra quyền, phiên bản tài liệu và che trường nhạy cảm nếu cần.', fields: ['Phạm vi quyền', 'Trường được hiển thị', 'Phiên bản hiệu lực'] },
      { title: 'Hiển thị, tải và lưu nhật ký', actor: 'Hệ thống HRM', type: 'A', description: 'Cung cấp tài liệu hợp lệ và ghi nhận lịch sử truy cập.', fields: ['Thời điểm truy cập', 'Hành động xem hoặc tải', 'Audit log'] }
    ]
  },
  {
    code: 'SOP-ESS-03',
    title: 'Gửi và theo dõi yêu cầu dịch vụ nhân sự',
    category: 'ESS · HR Service Request',
    description: 'Cho phép nhân viên gửi yêu cầu nhân sự theo danh mục dịch vụ, theo dõi SLA, trao đổi bổ sung và nhận kết quả trên một luồng thống nhất.',
    inputs: ['Danh mục dịch vụ HR', 'Biểu mẫu và SLA theo loại yêu cầu', 'Thông tin do nhân viên cung cấp'],
    outputs: ['Ticket dịch vụ có mã và người phụ trách', 'Lịch sử trao đổi tập trung', 'Kết quả xử lý và mức độ hài lòng'],
    rules: ['Mỗi loại yêu cầu phải có đơn vị xử lý và SLA', 'Không trao đổi dữ liệu nhạy cảm ngoài ticket', 'Ticket chỉ được đóng khi có kết quả hoặc lý do từ chối rõ ràng'],
    steps: [
      { title: 'Chọn dịch vụ và gửi yêu cầu', actor: 'Nhân viên', type: 'N', description: 'Chọn loại yêu cầu, cung cấp nội dung và tài liệu liên quan.', fields: ['Loại dịch vụ', 'Mức độ ưu tiên', 'Nội dung', 'Tài liệu'] },
      { title: 'Phân loại và định tuyến ticket', actor: 'Hệ thống HRM', type: 'A', description: 'Sinh mã ticket, xác định đội xử lý và thời hạn SLA.', fields: ['Mã ticket', 'Đội xử lý', 'SLA', 'Trạng thái'] },
      { title: 'Xử lý và yêu cầu bổ sung', actor: 'HR Service Desk', type: 'N', description: 'Thực hiện nghiệp vụ, trao đổi và yêu cầu bổ sung nếu thiếu thông tin.', fields: ['Người xử lý', 'Nội dung xử lý', 'Yêu cầu bổ sung'] },
      { title: 'Trả kết quả và đóng yêu cầu', actor: 'HR Service Desk và Nhân viên', type: 'C', description: 'Bàn giao kết quả, xác nhận hoàn thành và ghi nhận phản hồi.', fields: ['Kết quả', 'Thời gian hoàn thành', 'Mức độ hài lòng'] }
    ]
  },
  {
    code: 'SOP-ESS-04',
    title: 'Tra cứu công, phép và phiếu lương',
    category: 'ESS · Thông tin thu nhập và thời gian',
    description: 'Tổng hợp dữ liệu cá nhân từ Chấm công, Nghỉ phép và Lương để nhân viên tự tra cứu, đối chiếu và gửi yêu cầu giải trình khi có sai lệch.',
    inputs: ['Dữ liệu công đã ghi nhận', 'Số dư phép và lịch sử đơn', 'Phiếu lương đã được phát hành'],
    outputs: ['Bảng tra cứu cá nhân theo kỳ', 'Xác nhận đã xem phiếu lương', 'Yêu cầu giải trình gắn đúng kỳ dữ liệu'],
    rules: ['Chỉ hiển thị phiếu lương sau khi kỳ lương được phát hành', 'Không hiển thị dữ liệu của nhân viên khác', 'Yêu cầu giải trình phải gắn nguồn dữ liệu và kỳ phát sinh'],
    steps: [
      { title: 'Chọn kỳ và nhóm dữ liệu', actor: 'Nhân viên', type: 'N', description: 'Chọn kỳ công, phép hoặc lương cần tra cứu.', fields: ['Kỳ dữ liệu', 'Nhóm dữ liệu', 'Đơn vị hiển thị'] },
      { title: 'Tổng hợp dữ liệu cá nhân', actor: 'Hệ thống HRM', type: 'A', description: 'Lấy dữ liệu đã được phép công bố từ các phân hệ nguồn.', fields: ['Nguồn dữ liệu', 'Trạng thái chốt', 'Thời điểm đồng bộ'] },
      { title: 'Đối chiếu và gửi giải trình', actor: 'Nhân viên', type: 'N', description: 'Chọn dòng sai lệch, mô tả vấn đề và gửi bằng chứng.', fields: ['Dòng dữ liệu', 'Nội dung sai lệch', 'Bằng chứng'] },
      { title: 'Định tuyến yêu cầu về phân hệ nguồn', actor: 'Hệ thống HRM', type: 'A', description: 'Chuyển yêu cầu đến đúng nhóm Chấm công, Nghỉ phép hoặc Lương.', fields: ['Phân hệ nguồn', 'Người xử lý', 'SLA'] }
    ]
  },
  {
    code: 'SOP-MSS-01',
    title: 'Tra cứu và quản lý thông tin đội ngũ qua MSS',
    category: 'MSS · Quản lý đội ngũ',
    description: 'Cung cấp cho quản lý trực tiếp góc nhìn đội ngũ theo đúng phạm vi quản lý, gồm hồ sơ công việc, hợp đồng, biến động và cảnh báo cần xử lý.',
    inputs: ['Quan hệ quản lý có hiệu lực', 'Dữ liệu nhân sự của đội ngũ', 'Quyền xem theo vai trò quản lý'],
    outputs: ['Danh sách đội ngũ theo cơ cấu hiệu lực', 'Cảnh báo hợp đồng và biến động cần chú ý', 'Lịch sử truy cập dữ liệu đội ngũ'],
    rules: ['Chỉ hiển thị nhân viên thuộc phạm vi quản lý có hiệu lực', 'Trường nhạy cảm phải được che theo vai trò', 'Thay đổi cơ cấu phải cập nhật phạm vi truy cập theo ngày hiệu lực'],
    steps: [
      { title: 'Xác định phạm vi quản lý', actor: 'Hệ thống HRM', type: 'A', description: 'Tính danh sách nhân viên theo cơ cấu, quan hệ báo cáo và ngày hiệu lực.', fields: ['Quản lý', 'Đơn vị', 'Quan hệ báo cáo', 'Ngày hiệu lực'] },
      { title: 'Tra cứu đội ngũ', actor: 'Quản lý trực tiếp', type: 'N', description: 'Xem hồ sơ công việc, trạng thái hợp đồng và cảnh báo của đội ngũ.', fields: ['Nhân viên', 'Vị trí', 'Trạng thái', 'Cảnh báo'] },
      { title: 'Áp dụng kiểm soát dữ liệu', actor: 'Hệ thống HRM', type: 'C', description: 'Ẩn trường không thuộc quyền và ghi nhận mục đích truy cập khi cần.', fields: ['Trường được xem', 'Trường bị che', 'Audit log'] },
      { title: 'Khởi tạo hành động quản lý', actor: 'Quản lý trực tiếp', type: 'N', description: 'Từ cảnh báo, mở yêu cầu hoặc quy trình nhân sự phù hợp.', fields: ['Loại hành động', 'Nhân viên áp dụng', 'Hạn xử lý'] }
    ]
  },
  {
    code: 'SOP-MSS-02',
    title: 'Phê duyệt yêu cầu của nhân viên qua MSS',
    category: 'MSS · Phê duyệt',
    description: 'Tập trung các yêu cầu của nhân viên cần quản lý phê duyệt, hiển thị đủ dữ liệu liên quan, người thay thế và tác động trước khi ra quyết định.',
    inputs: ['Yêu cầu từ ESS hoặc phân hệ nghiệp vụ', 'Luồng phê duyệt theo đơn vị', 'Dữ liệu kiểm tra điều kiện và người thay thế'],
    outputs: ['Quyết định duyệt, từ chối hoặc yêu cầu bổ sung', 'Dữ liệu chuyển đến bước xử lý tiếp theo', 'Nhật ký quyết định và thời gian xử lý'],
    rules: ['Người duyệt không được phê duyệt yêu cầu của chính mình', 'Ủy quyền phải còn hiệu lực tại thời điểm duyệt', 'Từ chối phải có lý do và được thông báo cho người yêu cầu'],
    steps: [
      { title: 'Nhận yêu cầu cần phê duyệt', actor: 'Hệ thống Workflow', type: 'A', description: 'Định tuyến yêu cầu đến quản lý hoặc người được ủy quyền hợp lệ.', fields: ['Mã yêu cầu', 'Người đề nghị', 'Người duyệt', 'Hạn xử lý'] },
      { title: 'Xem dữ liệu và tác động', actor: 'Quản lý trực tiếp', type: 'C', description: 'Kiểm tra số dư, lịch đội ngũ, chi phí hoặc tác động liên quan.', fields: ['Dữ liệu điều kiện', 'Người thay thế', 'Tác động vận hành'] },
      { title: 'Ra quyết định phê duyệt', actor: 'Quản lý trực tiếp', type: 'M', description: 'Duyệt, từ chối hoặc yêu cầu bổ sung với ý kiến rõ ràng.', fields: ['Quyết định', 'Ý kiến', 'Điều kiện kèm theo'] },
      { title: 'Chuyển bước và thông báo', actor: 'Hệ thống Workflow', type: 'A', description: 'Lưu quyết định, chuyển bước tiếp theo và thông báo các bên.', fields: ['Trạng thái mới', 'Bước tiếp theo', 'Người nhận thông báo'] }
    ]
  },
  {
    code: 'SOP-MSS-03',
    title: 'Theo dõi công, phép và biến động đội ngũ',
    category: 'MSS · Giám sát vận hành',
    description: 'Giúp quản lý theo dõi lịch làm việc, tình trạng vắng mặt, công bất thường và biến động nhân sự để chủ động điều phối nguồn lực.',
    inputs: ['Lịch làm việc và dữ liệu công của đội ngũ', 'Đơn nghỉ đã duyệt và đang chờ', 'Biến động vào, ra, điều chuyển và hợp đồng'],
    outputs: ['Lịch nguồn lực đội ngũ', 'Danh sách ngoại lệ cần xử lý', 'Hành động điều phối hoặc yêu cầu hỗ trợ HR'],
    rules: ['Dữ liệu phải theo phạm vi quản lý và ngày hiệu lực', 'Cảnh báo không thay thế kết quả chốt công hoặc quyết định HR', 'Mọi điều chỉnh dữ liệu phải quay về phân hệ nguồn'],
    steps: [
      { title: 'Tổng hợp tình trạng đội ngũ', actor: 'Hệ thống HRM', type: 'A', description: 'Tổng hợp lịch, vắng mặt, công bất thường và biến động theo ngày hoặc kỳ.', fields: ['Kỳ theo dõi', 'Phạm vi đội ngũ', 'Nguồn dữ liệu'] },
      { title: 'Rà soát cảnh báo vận hành', actor: 'Quản lý trực tiếp', type: 'C', description: 'Xem xung đột lịch, thiếu người, đơn chờ duyệt và công bất thường.', fields: ['Loại cảnh báo', 'Mức ảnh hưởng', 'Nhân viên liên quan'] },
      { title: 'Điều phối hoặc khởi tạo xử lý', actor: 'Quản lý trực tiếp', type: 'N', description: 'Điều phối người thay thế hoặc mở yêu cầu xử lý ở phân hệ nguồn.', fields: ['Hành động', 'Người phụ trách', 'Hạn xử lý'] },
      { title: 'Theo dõi kết quả xử lý', actor: 'Hệ thống HRM', type: 'A', description: 'Cập nhật trạng thái cảnh báo theo kết quả từ phân hệ nguồn.', fields: ['Trạng thái cảnh báo', 'Kết quả xử lý', 'Thời điểm cập nhật'] }
    ]
  },
  {
    code: 'SOP-MSS-04',
    title: 'Khởi tạo giao dịch nhân sự cho đội ngũ',
    category: 'MSS · Giao dịch quản lý',
    description: 'Cho phép quản lý khởi tạo đề xuất nhân sự như điều chuyển, thay đổi vị trí, gia hạn hợp đồng hoặc ghi nhận thành tích theo đúng thẩm quyền.',
    inputs: ['Nhân viên thuộc phạm vi quản lý', 'Loại giao dịch được phân quyền', 'Dữ liệu hiện tại và ngày hiệu lực đề xuất'],
    outputs: ['Đề xuất nhân sự có mã theo dõi', 'Luồng phê duyệt được kích hoạt', 'Dữ liệu đã duyệt chuyển về phân hệ Nhân sự'],
    rules: ['Quản lý chỉ được khởi tạo loại giao dịch thuộc thẩm quyền', 'Ngày hiệu lực phải tuân thủ kỳ công, kỳ lương và hợp đồng liên quan', 'Giao dịch chỉ cập nhật hồ sơ chính thức sau khi phê duyệt hoàn tất'],
    steps: [
      { title: 'Chọn nhân viên và loại giao dịch', actor: 'Quản lý trực tiếp', type: 'N', description: 'Chọn nhân viên, loại thay đổi và ngày hiệu lực dự kiến.', fields: ['Nhân viên', 'Loại giao dịch', 'Ngày hiệu lực'] },
      { title: 'Kiểm tra điều kiện và xung đột', actor: 'Hệ thống HRM', type: 'A', description: 'Kiểm tra thẩm quyền, dữ liệu hiện tại, giao dịch đang chờ và tác động kỳ chốt.', fields: ['Kết quả điều kiện', 'Giao dịch xung đột', 'Cảnh báo kỳ chốt'] },
      { title: 'Hoàn thiện đề xuất và gửi duyệt', actor: 'Quản lý trực tiếp', type: 'N', description: 'Nhập lý do, giá trị đề xuất, tài liệu và gửi luồng phê duyệt.', fields: ['Lý do', 'Giá trị đề xuất', 'Tài liệu', 'Người duyệt'] },
      { title: 'Chuyển giao cho phân hệ Nhân sự', actor: 'Hệ thống Workflow', type: 'A', description: 'Sau phê duyệt, tạo tác vụ cho HR cập nhật hoặc tự động áp dụng theo cấu hình.', fields: ['Kết quả phê duyệt', 'Tác vụ HR', 'Trạng thái áp dụng'] }
    ]
  }
]

export const CORE_EXPERIENCE_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  'MODULE-ONB': onboardingProcesses.map(buildProcess),
  'MODULE-ESS': selfServiceProcesses.map(buildProcess)
}
