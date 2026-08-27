import type { SopSubProcess, SopSubStep } from '../types'

type StepSeed = Omit<SopSubStep, 'stepCode'>

interface ProcessSeed {
  code: string
  title: string
  category: string
  description: string
  inputs: string[]
  outputs: string[]
  rules: string[]
  notes: string[]
  steps: StepSeed[]
}

const buildProcess = (seed: ProcessSeed): SopSubProcess => {
  const stepPrefix = seed.code.replace(/[^A-Z0-9]/gi, '')

  return {
    sopCode: seed.code,
    sopTitle: seed.title,
    sopCategory: seed.category,
    description: seed.description,
    inputs: seed.inputs,
    outputs: seed.outputs,
    rules: seed.rules,
    sourceNote: 'Nội dung demo được chuẩn hóa từ blueprint Phát triển con người; chính sách, biểu mẫu và ngưỡng phê duyệt cần cấu hình theo từng doanh nghiệp.',
    notes: seed.notes,
    steps: seed.steps.map((step, index) => ({
      ...step,
      stepCode: `${stepPrefix}.${String(index + 1).padStart(2, '0')}`
    }))
  }
}

const peopleDevelopmentProcesses = {
  performance: [
    buildProcess({
      code: 'PFM-01',
      title: 'Thiết lập chu kỳ và chính sách đánh giá',
      category: 'Hiệu suất · Thiết lập chu kỳ',
      description: 'Khởi tạo một chu kỳ đánh giá thống nhất về đối tượng, phương pháp, thang điểm, biểu mẫu, lịch thực hiện và thẩm quyền phê duyệt trước khi giao mục tiêu.',
      inputs: ['Cơ cấu tổ chức và danh sách nhân viên hiệu lực', 'Chính sách đánh giá, thang điểm và mẫu phiếu', 'Lịch doanh nghiệp và ma trận phê duyệt'],
      outputs: ['Chu kỳ đánh giá ở trạng thái Đã phát hành', 'Danh sách đối tượng và lịch nhiệm vụ', 'Phiên bản chính sách có hiệu lực'],
      rules: ['Một nhân viên chỉ thuộc một cấu hình đánh giá chính trong cùng kỳ; mọi thay đổi sau phát hành phải có phiên bản và nhật ký.', 'Không hard-code BSC, OKR, KPI hay 360 độ; hệ thống cho phép cấu hình phương pháp theo nhóm đối tượng.'],
      notes: ['RACI: HR Performance là R; CHRO hoặc cấp được ủy quyền là A; HRBP, Legal và lãnh đạo đơn vị là C; quản lý và nhân viên là I.', 'Ngoại lệ cần xử lý: nhân viên vào hoặc nghỉ giữa kỳ, điều chuyển, nghỉ dài hạn, thay quản lý và cơ cấu tổ chức thay đổi sau khi phát hành.'],
      steps: [
        { title: 'Khởi tạo chu kỳ đánh giá', actor: 'HR Performance', location: 'HRMS · Thiết lập hiệu suất', timing: 'Trước ngày bắt đầu chu kỳ', typeCode: 'M', description: 'Tạo kỳ đánh giá, xác định phạm vi, loại chu kỳ và mốc hiệu lực.', fieldsChecklist: ['Tên và mã chu kỳ', 'Ngày bắt đầu, kết thúc', 'Đơn vị và nhóm nhân viên áp dụng'] },
        { title: 'Cấu hình phương pháp và biểu mẫu', actor: 'HR Performance', location: 'HRMS · Thư viện biểu mẫu', timing: 'Trong giai đoạn chuẩn bị', typeCode: 'M', description: 'Chọn cấu phần mục tiêu, năng lực, phản hồi và thang điểm phù hợp chính sách.', fieldsChecklist: ['Phương pháp KPI, OKR hoặc hỗn hợp', 'Trọng số từng cấu phần', 'Thang điểm và quy tắc làm tròn'] },
        { title: 'Thiết lập lịch và workflow', actor: 'HR Performance', location: 'HRMS · Workflow', timing: 'Trước khi trình duyệt', typeCode: 'C', description: 'Cấu hình hạn hoàn thành, cấp phê duyệt, ủy quyền, nhắc việc và escalation.', fieldsChecklist: ['Mốc giao mục tiêu', 'Mốc tự đánh giá và quản lý đánh giá', 'SLA duyệt và escalation'] },
        { title: 'Thẩm định phạm vi và chính sách', actor: 'HRBP và Legal', location: 'Cổng phê duyệt', timing: 'Theo SLA thiết lập chu kỳ', typeCode: 'C', description: 'Đối chiếu đối tượng áp dụng, tính nhất quán và các điều kiện đặc thù của đơn vị.', fieldsChecklist: ['Danh sách đối tượng', 'Điều kiện loại trừ', 'Ý kiến thẩm định'] },
        { title: 'Phê duyệt và phát hành chu kỳ', actor: 'CHRO hoặc người được ủy quyền', location: 'Cổng phê duyệt', timing: 'Trước ngày chu kỳ có hiệu lực', typeCode: 'A', description: 'Phê duyệt phiên bản cuối; hệ thống khóa cấu hình gốc và phát sinh nhiệm vụ cho các bên.', fieldsChecklist: ['Quyết định phê duyệt', 'Phiên bản có hiệu lực', 'Danh sách nhiệm vụ được sinh'] },
        { title: 'Thông báo mở chu kỳ', actor: 'Hệ thống HRMS', location: 'Email, Portal và Notification', timing: 'Ngay sau khi phát hành', typeCode: 'N', description: 'Thông báo phạm vi, thời hạn, hướng dẫn và đường dẫn thao tác cho quản lý, nhân viên.', fieldsChecklist: ['Nhóm người nhận', 'Mẫu thông báo', 'Trạng thái gửi và nhận'] }
      ]
    }),
    buildProcess({
      code: 'PFM-02',
      title: 'Thiết lập và phê duyệt mục tiêu',
      category: 'Hiệu suất · Mục tiêu',
      description: 'Chuyển mục tiêu tổ chức và đơn vị thành mục tiêu cá nhân có thước đo, trọng số, thời hạn và chủ sở hữu rõ ràng.',
      inputs: ['Chu kỳ đánh giá đã phát hành', 'Mục tiêu công ty và phòng ban', 'Mô tả công việc, chức danh và người quản lý'],
      outputs: ['Phiếu mục tiêu cá nhân đã duyệt', 'Baseline và trọng số được khóa', 'Lịch check-in trong kỳ'],
      rules: ['Tổng trọng số phải đạt đúng ngưỡng cấu hình; mục tiêu phải có chỉ tiêu đo, đơn vị tính, baseline và target.', 'Mục tiêu liên phòng ban phải xác định một chủ sở hữu và người phối hợp; thay đổi sau duyệt phải tạo yêu cầu điều chỉnh.'],
      notes: ['RACI: nhân viên và quản lý là R; quản lý trực tiếp là A; HRBP là C; HR Performance là I/C.', 'Ngoại lệ: nhân viên mới, kiêm nhiệm, mục tiêu dùng chung, thay quản lý và mục tiêu bị hủy do thay đổi chiến lược.'],
      steps: [
        { title: 'Phân bổ mục tiêu từ cấp trên', actor: 'Quản lý trực tiếp', location: 'Manager Portal', timing: 'Đầu chu kỳ', typeCode: 'M', description: 'Chọn mục tiêu đơn vị cần cascade và xác định phần đóng góp của nhân viên.', fieldsChecklist: ['Mục tiêu nguồn', 'Tỷ lệ đóng góp', 'Chủ sở hữu và người phối hợp'] },
        { title: 'Soạn mục tiêu cá nhân', actor: 'Nhân viên', location: 'Employee Portal', timing: 'Trong hạn giao mục tiêu', typeCode: 'M', description: 'Khai báo mục tiêu, chỉ tiêu đo, thời hạn, trọng số và bằng chứng dự kiến.', fieldsChecklist: ['Tên mục tiêu', 'Baseline và target', 'Đơn vị tính', 'Trọng số', 'Mốc hoàn thành'] },
        { title: 'Kiểm tra tính hợp lệ', actor: 'Hệ thống HRMS', location: 'Goal Engine', timing: 'Khi lưu hoặc gửi duyệt', typeCode: 'C', description: 'Kiểm tra tổng trọng số, trường bắt buộc, mục tiêu trùng và thời hạn nằm trong chu kỳ.', fieldsChecklist: ['Tổng trọng số', 'Trường bắt buộc', 'Trùng lặp', 'Khoảng ngày hợp lệ'] },
        { title: 'Trao đổi và điều chỉnh mục tiêu', actor: 'Nhân viên và quản lý', location: 'Employee/Manager Portal', timing: 'Trước khi phê duyệt', typeCode: 'M', description: 'Làm rõ kỳ vọng, cập nhật mục tiêu và lưu lịch sử phản hồi giữa hai bên.', fieldsChecklist: ['Nội dung phản hồi', 'Phiên bản trước và sau', 'Lý do điều chỉnh'] },
        { title: 'Phê duyệt phiếu mục tiêu', actor: 'Quản lý trực tiếp', location: 'Manager Portal', timing: 'Theo SLA giao mục tiêu', typeCode: 'A', description: 'Duyệt, từ chối hoặc trả về chỉnh sửa; ghi nhận thời điểm và ý kiến phê duyệt.', fieldsChecklist: ['Quyết định', 'Ý kiến duyệt', 'Thời điểm duyệt'] },
        { title: 'Khóa baseline và thông báo', actor: 'Hệ thống HRMS', location: 'Goal Engine và Notification', timing: 'Ngay sau khi duyệt', typeCode: 'N', description: 'Khóa phiên bản mục tiêu được duyệt, tạo lịch check-in và thông báo các bên.', fieldsChecklist: ['Baseline version', 'Lịch check-in', 'Trạng thái thông báo'] }
      ]
    }),
    buildProcess({
      code: 'PFM-03',
      title: 'Check-in và điều chỉnh mục tiêu giữa kỳ',
      category: 'Hiệu suất · Theo dõi giữa kỳ',
      description: 'Theo dõi tiến độ, ghi nhận bằng chứng, gỡ vướng và kiểm soát mọi thay đổi mục tiêu trong thời gian thực hiện.',
      inputs: ['Phiếu mục tiêu đã duyệt', 'Kết quả thực hiện và bằng chứng', 'Lịch check-in hoặc yêu cầu điều chỉnh'],
      outputs: ['Biên bản check-in', 'Tiến độ và dự báo hoàn thành', 'Phiên bản mục tiêu điều chỉnh nếu được duyệt'],
      rules: ['Không ghi đè mục tiêu gốc; thay đổi target, trọng số hoặc thời hạn phải có lý do, người duyệt và effective date.', 'Bằng chứng chỉ được sử dụng khi còn truy cập được và có chủ sở hữu rõ ràng.'],
      notes: ['RACI: nhân viên và quản lý là R; quản lý là A; HRBP là C khi có thay đổi lớn.', 'Ngoại lệ: mục tiêu không còn phù hợp, dự án dừng, điều chuyển, nghỉ dài hạn hoặc phát sinh mục tiêu khẩn cấp.'],
      steps: [
        { title: 'Cập nhật tiến độ và bằng chứng', actor: 'Nhân viên', location: 'Employee Portal', timing: 'Theo lịch check-in', typeCode: 'M', description: 'Cập nhật phần trăm hoàn thành, kết quả thực tế, vướng mắc và tài liệu chứng minh.', fieldsChecklist: ['Tiến độ', 'Kết quả thực tế', 'Bằng chứng', 'Vướng mắc'] },
        { title: 'Đánh giá tiến độ và phản hồi', actor: 'Quản lý trực tiếp', location: 'Manager Portal', timing: 'Sau cập nhật của nhân viên', typeCode: 'C', description: 'Xác nhận tiến độ, phản hồi chất lượng bằng chứng và thống nhất hành động hỗ trợ.', fieldsChecklist: ['Nhận xét quản lý', 'Mức độ rủi ro', 'Hành động hỗ trợ', 'Ngày check-in tiếp theo'] },
        { title: 'Đề nghị điều chỉnh mục tiêu', actor: 'Nhân viên hoặc quản lý', location: 'Goal Change Request', timing: 'Khi có thay đổi hợp lệ', typeCode: 'M', description: 'Tạo yêu cầu đổi target, trọng số, thời hạn hoặc hủy mục tiêu và nêu rõ nguyên nhân.', fieldsChecklist: ['Nội dung trước và sau', 'Lý do', 'Ngày hiệu lực', 'Tài liệu liên quan'] },
        { title: 'Kiểm soát và phê duyệt thay đổi', actor: 'Quản lý và HRBP theo thẩm quyền', location: 'Cổng phê duyệt', timing: 'Theo SLA điều chỉnh', typeCode: 'A', description: 'Kiểm tra tác động tới tổng trọng số, tính công bằng và phê duyệt hoặc từ chối.', fieldsChecklist: ['Tác động trọng số', 'Ý kiến HRBP', 'Quyết định duyệt'] },
        { title: 'Lưu phiên bản và cảnh báo rủi ro', actor: 'Hệ thống HRMS', location: 'Goal Engine', timing: 'Sau check-in hoặc phê duyệt', typeCode: 'N', description: 'Lưu snapshot, cập nhật dự báo và gửi cảnh báo với mục tiêu chậm hoặc thiếu bằng chứng.', fieldsChecklist: ['Snapshot tiến độ', 'Phiên bản mục tiêu', 'Cảnh báo và người nhận'] }
      ]
    }),
    buildProcess({
      code: 'PFM-04',
      title: 'Tự đánh giá và đánh giá của quản lý',
      category: 'Hiệu suất · Đánh giá cuối kỳ',
      description: 'Thu thập tự đánh giá, bằng chứng và đánh giá quản lý theo cùng tiêu chí để tạo kết quả sơ bộ có thể kiểm chứng.',
      inputs: ['Mục tiêu và năng lực thuộc kỳ', 'Tiến độ, bằng chứng và phản hồi trong kỳ', 'Biểu mẫu và thang điểm đã phát hành'],
      outputs: ['Phiếu tự đánh giá', 'Phiếu đánh giá quản lý', 'Điểm và xếp loại sơ bộ'],
      rules: ['Không cho quản lý sửa nội dung tự đánh giá của nhân viên; mọi lần mở lại phiếu phải có lý do và nhật ký.', 'Đối tượng phản hồi 360 độ và danh tính người phản hồi tuân theo cấu hình bảo mật.'],
      notes: ['RACI: nhân viên và quản lý là R; quản lý cấp trên là A khi chính sách yêu cầu; HR Performance là C.', 'Ngoại lệ: nhân viên không hoàn tất, quản lý vắng mặt, thay quản lý, xung đột lợi ích và thiếu dữ liệu một phần kỳ.'],
      steps: [
        { title: 'Mở nhiệm vụ đánh giá cuối kỳ', actor: 'Hệ thống HRMS', location: 'Performance Portal', timing: 'Theo lịch chu kỳ', typeCode: 'N', description: 'Tạo nhiệm vụ, chốt dữ liệu mục tiêu và nhắc các bên về hạn hoàn thành.', fieldsChecklist: ['Đối tượng đánh giá', 'Dữ liệu snapshot', 'Hạn hoàn thành'] },
        { title: 'Tự đánh giá và nộp bằng chứng', actor: 'Nhân viên', location: 'Employee Portal', timing: 'Trong hạn tự đánh giá', typeCode: 'M', description: 'Đánh giá từng mục tiêu và năng lực, giải trình kết quả và đính kèm bằng chứng.', fieldsChecklist: ['Điểm tự đánh giá', 'Nhận xét', 'Bằng chứng', 'Thành tựu và khó khăn'] },
        { title: 'Thu thập phản hồi bổ sung', actor: 'Đồng nghiệp hoặc bên liên quan', location: 'Feedback Portal', timing: 'Nếu chu kỳ có cấu hình', typeCode: 'M', description: 'Cung cấp phản hồi theo tiêu chí và chế độ công khai hoặc ẩn danh đã cấu hình.', fieldsChecklist: ['Người phản hồi', 'Tiêu chí', 'Nội dung phản hồi', 'Chế độ bảo mật'] },
        { title: 'Quản lý đánh giá và xếp loại sơ bộ', actor: 'Quản lý trực tiếp', location: 'Manager Portal', timing: 'Sau khi nhân viên nộp phiếu', typeCode: 'M', description: 'Đối chiếu target, bằng chứng và phản hồi để cho điểm, nhận xét và đề xuất xếp loại.', fieldsChecklist: ['Điểm quản lý', 'Nhận xét theo tiêu chí', 'Xếp loại sơ bộ', 'Đề xuất phát triển'] },
        { title: 'Kiểm tra hoàn tất và chuyển hiệu chỉnh', actor: 'Hệ thống HRMS', location: 'Performance Engine', timing: 'Khi quản lý nộp phiếu', typeCode: 'C', description: 'Kiểm tra trường bắt buộc, chênh lệch điểm bất thường và chuyển dữ liệu sang phiên hiệu chỉnh.', fieldsChecklist: ['Mức hoàn tất', 'Chênh lệch tự đánh giá', 'Cảnh báo dữ liệu', 'Trạng thái chuyển bước'] }
      ]
    }),
    buildProcess({
      code: 'PFM-05',
      title: 'Hiệu chỉnh và phê duyệt kết quả',
      category: 'Hiệu suất · Hiệu chỉnh kết quả',
      description: 'Rà soát tính nhất quán giữa các đơn vị, yêu cầu bằng chứng cho điều chỉnh và phê duyệt kết quả cuối kỳ.',
      inputs: ['Kết quả đánh giá sơ bộ', 'Phân bố xếp loại và dữ liệu so sánh', 'Bằng chứng, nhận xét và chính sách hiệu chỉnh'],
      outputs: ['Kết quả đánh giá cuối cùng', 'Biên bản hiệu chỉnh', 'Dữ liệu sẵn sàng chuyển C&B, L&D và Talent'],
      rules: ['Không tự động ép phân bố nếu chính sách không quy định; mọi điều chỉnh điểm phải lưu trước, sau, lý do và người quyết định.', 'Kết quả chỉ phát hành cho nhân viên sau khi đủ cấp phê duyệt.'],
      notes: ['RACI: HR Performance là R; Hội đồng hiệu chỉnh hoặc lãnh đạo có thẩm quyền là A; quản lý và HRBP là C.', 'Ngoại lệ: đơn vị quá ít người, người đánh giá có xung đột lợi ích, thiếu bằng chứng hoặc có khiếu nại đang mở.'],
      steps: [
        { title: 'Chuẩn bị dữ liệu hiệu chỉnh', actor: 'HR Performance', location: 'Calibration Workspace', timing: 'Sau khi đóng đánh giá quản lý', typeCode: 'C', description: 'Tổng hợp phân bố, chênh lệch, ngoại lệ và hồ sơ cần hội đồng xem xét.', fieldsChecklist: ['Phân bố xếp loại', 'Danh sách ngoại lệ', 'Chênh lệch theo đơn vị', 'Bằng chứng'] },
        { title: 'Rà soát tại phiên hiệu chỉnh', actor: 'Hội đồng hiệu chỉnh', location: 'Calibration Workspace và cuộc họp', timing: 'Theo lịch hội đồng', typeCode: 'M', description: 'So sánh tiêu chí và bằng chứng giữa các đơn vị, ghi nhận đề xuất giữ hoặc đổi kết quả.', fieldsChecklist: ['Thành viên tham dự', 'Ý kiến thảo luận', 'Đề xuất điều chỉnh'] },
        { title: 'Ghi nhận điều chỉnh có căn cứ', actor: 'HR Performance', location: 'Calibration Workspace', timing: 'Trong phiên hiệu chỉnh', typeCode: 'C', description: 'Nhập điểm hoặc xếp loại đề xuất mới và bắt buộc gắn lý do, người quyết định.', fieldsChecklist: ['Kết quả trước và sau', 'Lý do', 'Người đề xuất', 'Bằng chứng'] },
        { title: 'Phê duyệt kết quả cuối cùng', actor: 'Lãnh đạo có thẩm quyền', location: 'Cổng phê duyệt', timing: 'Sau phiên hiệu chỉnh', typeCode: 'A', description: 'Duyệt kết quả cuối kỳ hoặc trả lại hội đồng khi dữ liệu chưa đủ căn cứ.', fieldsChecklist: ['Quyết định', 'Ý kiến phê duyệt', 'Thời điểm khóa'] },
        { title: 'Phát hành và chuyển dữ liệu liên quan', actor: 'Hệ thống HRMS', location: 'Performance Engine và Notification', timing: 'Sau khi phê duyệt', typeCode: 'N', description: 'Phát hành kết quả theo quyền xem và chuyển bản ghi được duyệt cho C&B, L&D, Talent.', fieldsChecklist: ['Người nhận kết quả', 'Dữ liệu tích hợp', 'Trạng thái chuyển', 'Audit log'] }
      ]
    }),
    buildProcess({
      code: 'PFM-06',
      title: 'Khiếu nại kết quả và kế hoạch cải thiện hiệu suất',
      category: 'Hiệu suất · Sau đánh giá',
      description: 'Tiếp nhận khiếu nại có thời hạn và quản lý kế hoạch cải thiện hiệu suất với tiêu chí, hỗ trợ và kết luận minh bạch.',
      inputs: ['Kết quả đánh giá đã phát hành', 'Đơn khiếu nại hoặc quyết định mở PIP', 'Bằng chứng và chính sách xử lý'],
      outputs: ['Quyết định giải quyết khiếu nại', 'Kế hoạch PIP và lịch theo dõi', 'Kết luận hoàn thành, gia hạn hoặc xử lý tiếp'],
      rules: ['Tách quyền người đánh giá và người giải quyết khiếu nại khi có xung đột lợi ích; PIP không đồng nghĩa tự động chấm dứt quan hệ lao động.', 'Mọi tiêu chí PIP phải đo được, có mốc thời gian, nguồn lực hỗ trợ và biên bản check-in.'],
      notes: ['RACI: nhân viên, quản lý và HRBP là R theo từng bước; cấp giải quyết hoặc CHRO là A; Legal là C khi có rủi ro.', 'Ngoại lệ: khiếu nại quá hạn có lý do chính đáng, quản lý bị khiếu nại, nhân viên nghỉ dài hạn hoặc thay đổi công việc trong PIP.'],
      steps: [
        { title: 'Gửi khiếu nại hoặc đề nghị PIP', actor: 'Nhân viên hoặc quản lý', location: 'Employee/Manager Portal', timing: 'Trong thời hạn chính sách', typeCode: 'M', description: 'Khai báo nội dung, kết quả liên quan, căn cứ và phương án mong muốn.', fieldsChecklist: ['Loại yêu cầu', 'Nội dung', 'Bằng chứng', 'Ngày gửi'] },
        { title: 'Kiểm tra điều kiện tiếp nhận', actor: 'HRBP', location: 'HR Case Management', timing: 'Theo SLA tiếp nhận', typeCode: 'C', description: 'Kiểm tra thời hạn, thẩm quyền, xung đột lợi ích và mức đầy đủ của hồ sơ.', fieldsChecklist: ['Điều kiện hợp lệ', 'Người xử lý độc lập', 'Hồ sơ cần bổ sung'] },
        { title: 'Thẩm tra và ra quyết định', actor: 'Cấp giải quyết hoặc hội đồng', location: 'Cổng phê duyệt', timing: 'Theo SLA giải quyết', typeCode: 'A', description: 'Đối chiếu bằng chứng, phỏng vấn bên liên quan và quyết định giữ hoặc điều chỉnh kết quả.', fieldsChecklist: ['Biên bản thẩm tra', 'Quyết định', 'Lý do', 'Ngày hiệu lực'] },
        { title: 'Thiết lập kế hoạch PIP', actor: 'Quản lý và HRBP', location: 'Performance Portal', timing: 'Khi có quyết định PIP', typeCode: 'M', description: 'Xác định tiêu chí cần cải thiện, mốc đo, hỗ trợ, check-in và hệ quả theo chính sách.', fieldsChecklist: ['Mục tiêu cải thiện', 'Thời hạn', 'Nguồn lực hỗ trợ', 'Lịch check-in'] },
        { title: 'Theo dõi và ghi nhận tiến độ', actor: 'Nhân viên và quản lý', location: 'Performance Portal', timing: 'Theo lịch PIP', typeCode: 'C', description: 'Cập nhật bằng chứng, phản hồi, hành động hỗ trợ và rủi ro ở từng lần check-in.', fieldsChecklist: ['Tiến độ', 'Bằng chứng', 'Nhận xét hai bên', 'Hỗ trợ đã cung cấp'] },
        { title: 'Kết luận và thông báo', actor: 'Cấp có thẩm quyền', location: 'Cổng phê duyệt và Notification', timing: 'Cuối thời hạn PIP', typeCode: 'A', description: 'Kết luận đạt, gia hạn hoặc chuyển quy trình nhân sự phù hợp; hệ thống thông báo và khóa hồ sơ.', fieldsChecklist: ['Kết luận', 'Căn cứ', 'Hành động tiếp theo', 'Thông báo các bên'] }
      ]
    })
  ],
  competency: [
    buildProcess({
      code: 'CMP-01',
      title: 'Xây dựng từ điển năng lực',
      category: 'Năng lực · Dữ liệu nền',
      description: 'Chuẩn hóa danh mục năng lực, định nghĩa, cấp độ hành vi và bằng chứng để dùng thống nhất trong tuyển dụng, đánh giá và phát triển.',
      inputs: ['Chiến lược và giá trị doanh nghiệp', 'Job family, chức danh và mô tả công việc', 'Khung năng lực hiện hành và ý kiến chuyên gia'],
      outputs: ['Từ điển năng lực có phiên bản', 'Thang cấp độ và chỉ báo hành vi', 'Danh mục bằng chứng được chấp nhận'],
      rules: ['Mã năng lực không trùng; thay đổi định nghĩa hoặc cấp độ phải tạo phiên bản mới với effective date.', 'Phân biệt năng lực cốt lõi, lãnh đạo, chuyên môn và kỹ năng/chứng chỉ.'],
      notes: ['RACI: COE Năng lực là R; CHRO là A; HRBP và chuyên gia nghiệp vụ là C.', 'Ngoại lệ: năng lực đặc thù đơn vị, năng lực ngừng sử dụng, trùng khái niệm hoặc cần song ngữ.'],
      steps: [
        { title: 'Thu thập yêu cầu năng lực', actor: 'COE Năng lực', location: 'Competency Workspace', timing: 'Theo kế hoạch xây dựng khung', typeCode: 'M', description: 'Tổng hợp chiến lược, chức danh, quy trình và yêu cầu chuyên môn từ các đơn vị.', fieldsChecklist: ['Nguồn yêu cầu', 'Nhóm chức danh', 'Năng lực dự kiến'] },
        { title: 'Soạn định nghĩa và cấp độ hành vi', actor: 'COE và chuyên gia nghiệp vụ', location: 'Competency Workspace', timing: 'Sau bước khảo sát', typeCode: 'M', description: 'Mô tả định nghĩa, cấp độ, chỉ báo hành vi và bằng chứng quan sát cho từng năng lực.', fieldsChecklist: ['Mã và tên', 'Định nghĩa', 'Cấp độ', 'Chỉ báo hành vi', 'Bằng chứng'] },
        { title: 'Kiểm tra trùng lặp và chuẩn dữ liệu', actor: 'HR Data Steward', location: 'Master Data Control', timing: 'Trước thẩm định', typeCode: 'C', description: 'Kiểm tra mã, thuật ngữ, quan hệ cha con, bản dịch và ngày hiệu lực.', fieldsChecklist: ['Mã duy nhất', 'Nhóm năng lực', 'Phiên bản', 'Ngày hiệu lực'] },
        { title: 'Thẩm định với hội đồng chuyên môn', actor: 'HRBP và chuyên gia nghiệp vụ', location: 'Cổng tham vấn', timing: 'Theo lịch thẩm định', typeCode: 'C', description: 'Đánh giá tính phù hợp, khả năng quan sát và áp dụng cho các nhóm chức danh.', fieldsChecklist: ['Ý kiến chuyên gia', 'Nội dung cần sửa', 'Phạm vi áp dụng'] },
        { title: 'Phê duyệt và công bố từ điển', actor: 'CHRO', location: 'Cổng phê duyệt', timing: 'Sau khi hoàn tất thẩm định', typeCode: 'A', description: 'Phê duyệt phiên bản và công bố cho các phân hệ được phép sử dụng.', fieldsChecklist: ['Phiên bản duyệt', 'Ngày hiệu lực', 'Phân hệ sử dụng', 'Lịch rà soát'] }
      ]
    }),
    buildProcess({
      code: 'CMP-02',
      title: 'Ánh xạ năng lực với chức danh',
      category: 'Năng lực · Ma trận chức danh',
      description: 'Xác định năng lực và cấp độ yêu cầu cho từng chức danh, cấp bậc và đơn vị để hình thành chuẩn so sánh.',
      inputs: ['Từ điển năng lực đã duyệt', 'Danh mục chức danh, job family và cấp bậc', 'Mô tả công việc và ý kiến quản lý'],
      outputs: ['Ma trận năng lực theo chức danh', 'Mức yêu cầu tối thiểu và trọng số', 'Phiên bản ánh xạ có hiệu lực'],
      rules: ['Một chức danh có thể có năng lực bắt buộc và lựa chọn; phải chỉ rõ mức yêu cầu, trọng số và ngày hiệu lực.', 'Điều chuyển hoặc bổ nhiệm phải dùng ma trận có hiệu lực tại ngày quyết định.'],
      notes: ['RACI: COE Năng lực là R; chủ sở hữu job family là A; quản lý và HRBP là C.', 'Ngoại lệ: một chức danh dùng ở nhiều đơn vị với mức yêu cầu khác nhau, kiêm nhiệm hoặc chức danh mới chưa có dữ liệu lịch sử.'],
      steps: [
        { title: 'Chọn chức danh và phiên bản áp dụng', actor: 'COE Năng lực', location: 'Job Competency Matrix', timing: 'Khi tạo hoặc rà soát ánh xạ', typeCode: 'M', description: 'Chọn chức danh, job family, cấp bậc, phạm vi đơn vị và ngày hiệu lực.', fieldsChecklist: ['Chức danh', 'Job family', 'Cấp bậc', 'Ngày hiệu lực'] },
        { title: 'Gán năng lực và mức yêu cầu', actor: 'COE và quản lý chuyên môn', location: 'Job Competency Matrix', timing: 'Trong kỳ xây dựng ma trận', typeCode: 'M', description: 'Gán năng lực, cấp độ yêu cầu, mức ưu tiên và trọng số cho chức danh.', fieldsChecklist: ['Năng lực', 'Cấp độ yêu cầu', 'Bắt buộc hay lựa chọn', 'Trọng số'] },
        { title: 'Kiểm tra tính đầy đủ và xung đột', actor: 'Hệ thống HRMS', location: 'Competency Engine', timing: 'Khi gửi thẩm định', typeCode: 'C', description: 'Cảnh báo năng lực hết hiệu lực, trùng ánh xạ hoặc thiếu nhóm năng lực bắt buộc.', fieldsChecklist: ['Năng lực hiệu lực', 'Trùng phiên bản', 'Tổng trọng số', 'Nhóm bắt buộc'] },
        { title: 'Thẩm định ma trận chức danh', actor: 'HRBP và chủ sở hữu job family', location: 'Cổng tham vấn', timing: 'Theo SLA thẩm định', typeCode: 'C', description: 'Đối chiếu với công việc thực tế, lộ trình nghề nghiệp và chuẩn nội bộ.', fieldsChecklist: ['Ý kiến thẩm định', 'Khoảng lệch cần sửa', 'Phạm vi áp dụng'] },
        { title: 'Phê duyệt và phát hành ma trận', actor: 'Chủ sở hữu job family', location: 'Cổng phê duyệt', timing: 'Trước kỳ đánh giá năng lực', typeCode: 'A', description: 'Phê duyệt phiên bản; hệ thống dùng làm chuẩn cho đánh giá, tuyển dụng và IDP.', fieldsChecklist: ['Quyết định', 'Phiên bản', 'Ngày hiệu lực', 'Phân hệ nhận dữ liệu'] }
      ]
    }),
    buildProcess({
      code: 'CMP-03',
      title: 'Đánh giá năng lực và kỹ năng',
      category: 'Năng lực · Đánh giá',
      description: 'Đánh giá mức năng lực hiện tại bằng tiêu chí và bằng chứng phù hợp, có hiệu chỉnh để hạn chế thiên lệch.',
      inputs: ['Ma trận năng lực chức danh', 'Hồ sơ kỹ năng, chứng chỉ và bằng chứng', 'Chu kỳ, biểu mẫu và người đánh giá'],
      outputs: ['Hồ sơ năng lực hiện tại', 'Mức đánh giá đã hiệu chỉnh', 'Danh sách năng lực cần phát triển'],
      rules: ['Tách mức tự khai báo, mức quản lý đánh giá và mức đã xác thực; chứng chỉ phải có tổ chức cấp và ngày hết hạn.', 'Không suy diễn năng lực chỉ từ chức danh hoặc thâm niên.'],
      notes: ['RACI: nhân viên và quản lý là R; quản lý hoặc hội đồng là A; HR/COE và chuyên gia là C.', 'Ngoại lệ: kỹ năng mới chưa có trong từ điển, chứng chỉ hết hạn, người đánh giá thiếu chuyên môn hoặc xung đột lợi ích.'],
      steps: [
        { title: 'Khởi tạo phiếu đánh giá năng lực', actor: 'Hệ thống HRMS', location: 'Competency Portal', timing: 'Theo chu kỳ hoặc sự kiện', typeCode: 'N', description: 'Nạp ma trận chức danh có hiệu lực và tạo danh sách tiêu chí cho từng nhân viên.', fieldsChecklist: ['Nhân viên', 'Chức danh hiệu lực', 'Ma trận áp dụng', 'Người đánh giá'] },
        { title: 'Tự khai báo mức năng lực và bằng chứng', actor: 'Nhân viên', location: 'Employee Portal', timing: 'Trong hạn tự đánh giá', typeCode: 'M', description: 'Chọn mức hiện tại, mô tả kinh nghiệm và đính kèm bằng chứng hoặc chứng chỉ.', fieldsChecklist: ['Mức tự đánh giá', 'Kinh nghiệm', 'Tài liệu', 'Chứng chỉ và hạn'] },
        { title: 'Đánh giá của quản lý', actor: 'Quản lý trực tiếp', location: 'Manager Portal', timing: 'Sau tự đánh giá', typeCode: 'M', description: 'Đánh giá theo hành vi quan sát được, phản hồi và nêu khoảng chênh so với tự đánh giá.', fieldsChecklist: ['Mức quản lý đánh giá', 'Nhận xét', 'Bằng chứng quan sát', 'Khoảng chênh'] },
        { title: 'Xác minh chuyên môn hoặc chứng chỉ', actor: 'Chuyên gia và HR', location: 'Competency Verification', timing: 'Khi tiêu chí yêu cầu', typeCode: 'C', description: 'Kiểm tra tính xác thực của bằng chứng, bài test hoặc chứng chỉ chuyên môn.', fieldsChecklist: ['Phương thức xác minh', 'Kết quả test', 'Trạng thái chứng chỉ', 'Người xác minh'] },
        { title: 'Hiệu chỉnh mức đánh giá', actor: 'Hội đồng năng lực', location: 'Calibration Workspace', timing: 'Sau khi hoàn tất đánh giá', typeCode: 'A', description: 'Giải quyết chênh lệch, thống nhất mức xác thực và ghi căn cứ quyết định.', fieldsChecklist: ['Mức trước và sau', 'Căn cứ', 'Thành viên hội đồng', 'Quyết định'] },
        { title: 'Cập nhật hồ sơ kỹ năng', actor: 'Hệ thống HRMS', location: 'Skill Profile', timing: 'Sau phê duyệt', typeCode: 'N', description: 'Lưu mức xác thực, ngày đánh giá, hạn rà soát và chuyển dữ liệu sang phân tích gap.', fieldsChecklist: ['Mức xác thực', 'Ngày đánh giá', 'Ngày rà soát', 'Nguồn dữ liệu'] }
      ]
    }),
    buildProcess({
      code: 'CMP-04',
      title: 'Phân tích khoảng trống và tạo IDP',
      category: 'Năng lực · Phát triển cá nhân',
      description: 'So sánh năng lực hiện tại với yêu cầu của vai trò hiện tại hoặc mục tiêu để lập kế hoạch phát triển cá nhân có thể theo dõi.',
      inputs: ['Kết quả năng lực đã xác thực', 'Ma trận vai trò hiện tại và vai trò mục tiêu', 'Nguyện vọng nghề nghiệp và nguồn học tập'],
      outputs: ['Báo cáo competency gap', 'Kế hoạch phát triển cá nhân IDP', 'Các nhiệm vụ học tập, mentoring và OJT'],
      rules: ['IDP phải có mục tiêu, hành động, bằng chứng, người hỗ trợ, thời hạn và trạng thái; ưu tiên gap có tác động tới công việc.', 'Mục tiêu nghề nghiệp là dữ liệu nhạy cảm và không đồng nghĩa cam kết bổ nhiệm.'],
      notes: ['RACI: nhân viên là R; quản lý là A/R; HRBP, L&D và mentor là C.', 'Ngoại lệ: vai trò mục tiêu chưa có ma trận, nhân viên đổi nguyện vọng, điều chuyển hoặc không có nguồn học phù hợp.'],
      steps: [
        { title: 'Chọn chuẩn năng lực để so sánh', actor: 'Nhân viên và quản lý', location: 'Development Portal', timing: 'Sau đánh giá năng lực', typeCode: 'M', description: 'Chọn vai trò hiện tại hoặc mục tiêu và phiên bản ma trận dùng để phân tích.', fieldsChecklist: ['Vai trò chuẩn', 'Phiên bản ma trận', 'Mục tiêu nghề nghiệp'] },
        { title: 'Tính và ưu tiên khoảng trống', actor: 'Hệ thống HRMS', location: 'Competency Engine', timing: 'Ngay sau khi chọn chuẩn', typeCode: 'C', description: 'Tính gap theo từng năng lực, trọng số và mức ảnh hưởng tới vai trò.', fieldsChecklist: ['Mức hiện tại', 'Mức yêu cầu', 'Khoảng trống', 'Mức ưu tiên'] },
        { title: 'Thiết kế hành động phát triển', actor: 'Nhân viên và quản lý', location: 'IDP Workspace', timing: 'Trong kỳ lập IDP', typeCode: 'M', description: 'Chọn khóa học, OJT, dự án, mentoring hoặc tự học và xác định bằng chứng hoàn thành.', fieldsChecklist: ['Mục tiêu IDP', 'Hành động 70-20-10', 'Bằng chứng', 'Người hỗ trợ', 'Thời hạn'] },
        { title: 'Thẩm định nguồn lực và phê duyệt', actor: 'Quản lý và L&D', location: 'Cổng phê duyệt', timing: 'Theo SLA IDP', typeCode: 'A', description: 'Đánh giá tính phù hợp, thời gian, ngân sách và phê duyệt kế hoạch.', fieldsChecklist: ['Ngân sách', 'Thời gian', 'Nguồn học', 'Quyết định'] },
        { title: 'Theo dõi IDP và nhắc việc', actor: 'Hệ thống HRMS', location: 'Development Portal và Notification', timing: 'Trong suốt thời hạn IDP', typeCode: 'N', description: 'Tạo nhiệm vụ, đồng bộ đăng ký học và nhắc quản lý, nhân viên cập nhật tiến độ.', fieldsChecklist: ['Nhiệm vụ phát triển', 'Tiến độ', 'Lịch check-in', 'Cảnh báo quá hạn'] }
      ]
    })
  ],
  learning: [
    buildProcess({
      code: 'LND-01',
      title: 'Khảo sát nhu cầu và lập kế hoạch đào tạo',
      category: 'Đào tạo · Kế hoạch năm',
      description: 'Tổng hợp nhu cầu từ chiến lược, tuân thủ, competency gap và đề xuất đơn vị thành kế hoạch đào tạo có ưu tiên và ngân sách.',
      inputs: ['Chiến lược và kế hoạch nhân lực', 'Competency gap, IDP và yêu cầu tuân thủ', 'Đề xuất đơn vị và ngân sách dự kiến'],
      outputs: ['Training Needs Analysis', 'Kế hoạch đào tạo năm', 'Ngân sách và danh mục ưu tiên đã duyệt'],
      rules: ['Mỗi nhu cầu phải có nguồn, nhóm đối tượng, kết quả mong đợi và mức ưu tiên; tách đào tạo bắt buộc với phát triển tự chọn.', 'Nhu cầu ngoài kế hoạch phải đi theo workflow bổ sung ngân sách.'],
      notes: ['RACI: L&D là R; CHRO/Ban điều hành là A theo ngân sách; HRBP, Finance và quản lý là C.', 'Ngoại lệ: yêu cầu tuân thủ khẩn cấp, cắt giảm ngân sách, khóa học không có nhà cung cấp hoặc trùng nhu cầu giữa nhiều đơn vị.'],
      steps: [
        { title: 'Mở đợt khảo sát nhu cầu', actor: 'L&D', location: 'Learning Planning', timing: 'Theo lịch lập kế hoạch năm', typeCode: 'N', description: 'Phát hành biểu mẫu, phạm vi, tiêu chí ưu tiên và thời hạn cho các đơn vị.', fieldsChecklist: ['Năm kế hoạch', 'Phạm vi', 'Tiêu chí ưu tiên', 'Hạn gửi'] },
        { title: 'Đề xuất nhu cầu đào tạo', actor: 'Quản lý và nhân viên', location: 'Employee/Manager Portal', timing: 'Trong thời gian khảo sát', typeCode: 'M', description: 'Khai báo chủ đề, đối tượng, nguyên nhân, kết quả mong đợi và thời điểm cần.', fieldsChecklist: ['Chủ đề', 'Đối tượng', 'Nguồn nhu cầu', 'Kết quả mong đợi', 'Thời gian'] },
        { title: 'Tổng hợp dữ liệu gap và tuân thủ', actor: 'Hệ thống HRMS', location: 'Learning Analytics', timing: 'Khi đóng khảo sát', typeCode: 'C', description: 'Gộp đề xuất với competency gap, chứng chỉ sắp hết hạn và đào tạo bắt buộc.', fieldsChecklist: ['Competency gap', 'IDP', 'Tuân thủ', 'Chứng chỉ hết hạn'] },
        { title: 'Ưu tiên và thiết kế danh mục', actor: 'L&D và HRBP', location: 'Learning Planning', timing: 'Sau tổng hợp', typeCode: 'C', description: 'Loại trùng, nhóm nhu cầu, xác định hình thức, số người và dự toán chi phí.', fieldsChecklist: ['Mức ưu tiên', 'Hình thức học', 'Số học viên', 'Dự toán'] },
        { title: 'Thẩm định ngân sách', actor: 'Finance và C&B', location: 'Budget Review', timing: 'Trước trình duyệt', typeCode: 'C', description: 'Đối chiếu ngân sách, định mức, nguồn chi và kế hoạch mua sắm nhà cung cấp.', fieldsChecklist: ['Ngân sách nguồn', 'Định mức', 'Chênh lệch', 'Ý kiến Finance'] },
        { title: 'Phê duyệt kế hoạch đào tạo', actor: 'CHRO hoặc Ban điều hành', location: 'Cổng phê duyệt', timing: 'Trước năm hoặc kỳ kế hoạch', typeCode: 'A', description: 'Phê duyệt danh mục, ngân sách, nhóm ưu tiên và điều kiện triển khai.', fieldsChecklist: ['Danh mục duyệt', 'Ngân sách duyệt', 'Điều kiện', 'Ngày hiệu lực'] }
      ]
    }),
    buildProcess({
      code: 'LND-02',
      title: 'Thiết lập chương trình, khóa học và lớp học',
      category: 'Đào tạo · Danh mục và lớp',
      description: 'Chuẩn hóa catalog học tập và chuyển khóa học đã duyệt thành lớp có lịch, giảng viên, sức chứa, chi phí và điều kiện hoàn thành.',
      inputs: ['Kế hoạch đào tạo đã duyệt', 'Thông tin nội dung, giảng viên và nhà cung cấp', 'Địa điểm, lịch và nguồn ngân sách'],
      outputs: ['Chương trình và khóa học trong catalog', 'Lớp học được mở đăng ký', 'Lịch, chi phí và điều kiện hoàn thành'],
      rules: ['Phân biệt chương trình, khóa học và lớp học; một khóa có thể mở nhiều lớp và nhiều hình thức.', 'Tài liệu, nội dung và nhà cung cấp phải được kiểm soát phiên bản và quyền sử dụng.'],
      notes: ['RACI: L&D Administrator là R; L&D Manager là A; chuyên gia, Procurement, Finance và IT là C.', 'Ngoại lệ: thay giảng viên, đổi lịch hoặc địa điểm, lớp trực tuyến, nội dung có bản quyền và lớp tối thiểu học viên.'],
      steps: [
        { title: 'Tạo chương trình và khóa học', actor: 'L&D Administrator', location: 'Learning Catalog', timing: 'Sau khi kế hoạch được duyệt', typeCode: 'M', description: 'Khai báo mục tiêu, đối tượng, nội dung, thời lượng và hình thức học.', fieldsChecklist: ['Mã khóa học', 'Mục tiêu', 'Đối tượng', 'Thời lượng', 'Hình thức'] },
        { title: 'Thiết lập điều kiện và đánh giá', actor: 'L&D và chuyên gia nội dung', location: 'Learning Catalog', timing: 'Trước khi phát hành catalog', typeCode: 'M', description: 'Cấu hình điều kiện tiên quyết, điểm đạt, điểm danh, chứng chỉ và thời hạn hoàn thành.', fieldsChecklist: ['Điều kiện tiên quyết', 'Điểm đạt', 'Tỷ lệ tham dự', 'Chứng chỉ'] },
        { title: 'Thẩm định nội dung và nhà cung cấp', actor: 'Chuyên gia, Procurement và Legal', location: 'Content Review', timing: 'Theo chính sách mua sắm', typeCode: 'C', description: 'Kiểm tra chất lượng, bản quyền, điều khoản, báo giá và khả năng bảo mật dữ liệu.', fieldsChecklist: ['Phiên bản nội dung', 'Bản quyền', 'Nhà cung cấp', 'Báo giá', 'Điều khoản'] },
        { title: 'Tạo lớp và phân bổ nguồn lực', actor: 'L&D Administrator', location: 'Class Management', timing: 'Theo lịch triển khai', typeCode: 'M', description: 'Mở lớp cụ thể, xếp lịch, phòng học, giảng viên, sức chứa và ngân sách.', fieldsChecklist: ['Mã lớp', 'Lịch học', 'Giảng viên', 'Địa điểm', 'Sức chứa', 'Chi phí'] },
        { title: 'Phê duyệt mở lớp', actor: 'L&D Manager', location: 'Cổng phê duyệt', timing: 'Trước khi mở đăng ký', typeCode: 'A', description: 'Duyệt nguồn lực, chi phí và điều kiện vận hành của lớp.', fieldsChecklist: ['Quyết định', 'Ngân sách', 'Số lượng tối thiểu', 'Điều kiện hủy'] },
        { title: 'Công bố catalog và lịch lớp', actor: 'Hệ thống LMS/HRMS', location: 'Learning Portal', timing: 'Sau phê duyệt', typeCode: 'N', description: 'Hiển thị lớp cho đúng nhóm đủ điều kiện và gửi thông báo mở đăng ký.', fieldsChecklist: ['Nhóm nhìn thấy', 'Thời gian đăng ký', 'Kênh thông báo', 'Trạng thái lớp'] }
      ]
    }),
    buildProcess({
      code: 'LND-03',
      title: 'Đăng ký, đề cử và phê duyệt học tập',
      category: 'Đào tạo · Đăng ký học',
      description: 'Xử lý nhu cầu học do nhân viên đăng ký hoặc quản lý đề cử, kiểm tra điều kiện, chỗ học và ngân sách trước khi ghi danh.',
      inputs: ['Catalog và lớp đang mở', 'Hồ sơ nhân viên, IDP và điều kiện tiên quyết', 'Hạn mức ngân sách và ma trận phê duyệt'],
      outputs: ['Ghi danh được xác nhận', 'Danh sách chờ hoặc quyết định từ chối', 'Cam kết đào tạo nếu thuộc diện áp dụng'],
      rules: ['Kiểm tra eligibility, trùng lịch, sức chứa và ngân sách tại thời điểm duyệt; tự học không mặc nhiên miễn phê duyệt chi phí.', 'Cam kết đào tạo chỉ áp dụng khi chính sách và thỏa thuận hợp lệ.'],
      notes: ['RACI: nhân viên hoặc quản lý là R; quản lý và chủ ngân sách là A theo ngưỡng; L&D là C/R vận hành.', 'Ngoại lệ: lớp đầy, trùng lịch, học bắt buộc, nhân viên nghỉ dài hạn, khóa ngoài kế hoạch hoặc đổi người học.'],
      steps: [
        { title: 'Đăng ký hoặc đề cử học viên', actor: 'Nhân viên hoặc quản lý', location: 'Learning Portal', timing: 'Trong thời gian đăng ký', typeCode: 'M', description: 'Chọn lớp, nêu mục tiêu học, nguồn nhu cầu và yêu cầu chi phí nếu có.', fieldsChecklist: ['Lớp học', 'Học viên', 'Nguồn nhu cầu', 'Mục tiêu', 'Chi phí đề nghị'] },
        { title: 'Kiểm tra điều kiện tham gia', actor: 'Hệ thống HRMS', location: 'Enrollment Engine', timing: 'Ngay khi gửi đăng ký', typeCode: 'C', description: 'Kiểm tra đối tượng, điều kiện tiên quyết, trùng lịch, trạng thái lao động và sức chứa.', fieldsChecklist: ['Eligibility', 'Tiên quyết', 'Trùng lịch', 'Sức chứa', 'Trạng thái nhân viên'] },
        { title: 'Kiểm tra ngân sách và cam kết', actor: 'L&D và C&B/Finance', location: 'Learning Approval', timing: 'Với lớp có chi phí', typeCode: 'C', description: 'Đối chiếu hạn mức, nguồn chi và điều kiện ký cam kết đào tạo.', fieldsChecklist: ['Ngân sách còn lại', 'Nguồn chi', 'Mức cam kết', 'Hồ sơ cần ký'] },
        { title: 'Phê duyệt đăng ký', actor: 'Quản lý và chủ ngân sách', location: 'Manager Portal', timing: 'Theo SLA đăng ký', typeCode: 'A', description: 'Duyệt, từ chối hoặc chuyển danh sách chờ kèm lý do.', fieldsChecklist: ['Quyết định', 'Lý do', 'Cấp duyệt', 'Ngày duyệt'] },
        { title: 'Hoàn tất cam kết đào tạo', actor: 'Nhân viên và HR', location: 'Document/e-Sign', timing: 'Trước khi xác nhận ghi danh', typeCode: 'M', description: 'Ký thỏa thuận đào tạo nếu khóa học thuộc phạm vi phải cam kết.', fieldsChecklist: ['Mẫu thỏa thuận', 'Chi phí được tính', 'Thời hạn cam kết', 'Chữ ký'] },
        { title: 'Xác nhận ghi danh và thông báo', actor: 'Hệ thống LMS/HRMS', location: 'Learning Portal và Notification', timing: 'Sau đủ điều kiện', typeCode: 'N', description: 'Giữ chỗ, cập nhật danh sách lớp, lịch cá nhân và gửi hướng dẫn tham gia.', fieldsChecklist: ['Enrollment status', 'Lịch cá nhân', 'Tài liệu chuẩn bị', 'Kênh thông báo'] }
      ]
    }),
    buildProcess({
      code: 'LND-04',
      title: 'Tổ chức học, điểm danh, kiểm tra và chứng nhận',
      category: 'Đào tạo · Thực hiện lớp',
      description: 'Vận hành lớp học từ khai giảng tới hoàn thành, kiểm soát tham dự, bài kiểm tra, kết quả và chứng chỉ.',
      inputs: ['Danh sách ghi danh đã xác nhận', 'Lịch, nội dung và giảng viên', 'Tiêu chí điểm danh, điểm đạt và chứng nhận'],
      outputs: ['Lịch sử tham dự và điểm kiểm tra', 'Trạng thái hoàn thành khóa', 'Chứng chỉ và hồ sơ học tập'],
      rules: ['Không cấp chứng chỉ nếu chưa đạt đồng thời điều kiện tham dự, bài kiểm tra và nghĩa vụ bắt buộc.', 'Sửa điểm hoặc điểm danh phải lưu người sửa, lý do, giá trị trước và sau.'],
      notes: ['RACI: L&D Administrator và giảng viên là R; L&D Manager là A; quản lý và IT là C; học viên là R tham gia.', 'Ngoại lệ: học bù, mất kết nối, vắng có lý do, gian lận kiểm tra, sửa điểm và cấp lại chứng chỉ.'],
      steps: [
        { title: 'Xác nhận khai giảng và danh sách lớp', actor: 'L&D Administrator', location: 'Class Management', timing: 'Trước giờ học', typeCode: 'C', description: 'Chốt học viên, lịch, giảng viên, phòng hoặc liên kết học trực tuyến.', fieldsChecklist: ['Danh sách học viên', 'Lịch cuối', 'Giảng viên', 'Địa điểm hoặc link'] },
        { title: 'Ghi nhận điểm danh', actor: 'Giảng viên hoặc hệ thống LMS', location: 'Classroom/LMS', timing: 'Mỗi buổi học', typeCode: 'M', description: 'Ghi nhận có mặt, đi muộn, về sớm, vắng và lý do theo từng buổi.', fieldsChecklist: ['Trạng thái tham dự', 'Thời gian vào ra', 'Lý do vắng', 'Người xác nhận'] },
        { title: 'Thực hiện nội dung và bài kiểm tra', actor: 'Học viên và giảng viên', location: 'Classroom/LMS', timing: 'Theo lịch khóa học', typeCode: 'M', description: 'Học viên hoàn thành nội dung, bài tập, bài thi hoặc sản phẩm thực hành.', fieldsChecklist: ['Tiến độ nội dung', 'Bài tập', 'Bài thi', 'Sản phẩm thực hành'] },
        { title: 'Chấm và kiểm soát kết quả', actor: 'Giảng viên và L&D', location: 'LMS Gradebook', timing: 'Sau bài kiểm tra', typeCode: 'C', description: 'Nhập điểm, xác minh gian lận, xử lý phúc khảo và khóa kết quả.', fieldsChecklist: ['Điểm thành phần', 'Điểm cuối', 'Phúc khảo', 'Nhật ký sửa điểm'] },
        { title: 'Xác định trạng thái hoàn thành', actor: 'Hệ thống LMS/HRMS', location: 'Learning Engine', timing: 'Khi đủ dữ liệu', typeCode: 'C', description: 'Đối chiếu tỷ lệ tham dự, điểm đạt và nội dung bắt buộc để kết luận.', fieldsChecklist: ['Tỷ lệ tham dự', 'Điểm đạt', 'Nội dung hoàn thành', 'Trạng thái cuối'] },
        { title: 'Cấp chứng chỉ và cập nhật hồ sơ', actor: 'L&D và hệ thống HRMS', location: 'Learning Record', timing: 'Sau khi đạt', typeCode: 'N', description: 'Cấp chứng chỉ, cập nhật hồ sơ kỹ năng và đặt cảnh báo ngày hết hạn nếu có.', fieldsChecklist: ['Số chứng chỉ', 'Ngày cấp', 'Ngày hết hạn', 'Năng lực liên kết'] }
      ]
    }),
    buildProcess({
      code: 'LND-05',
      title: 'Đánh giá hiệu quả và quản lý cam kết đào tạo',
      category: 'Đào tạo · Hiệu quả và chi phí',
      description: 'Đo phản hồi, kết quả học và mức áp dụng sau đào tạo; đồng thời đối soát chi phí và nghĩa vụ cam kết khi phát sinh.',
      inputs: ['Kết quả lớp và chi phí thực tế', 'Khảo sát học viên, quản lý và dữ liệu áp dụng', 'Thỏa thuận đào tạo đã ký'],
      outputs: ['Báo cáo hiệu quả đào tạo', 'Competency/IDP được cập nhật', 'Số dư cam kết hoặc quyết định hoàn trả'],
      rules: ['Tách phản hồi hài lòng, kết quả học và tác động công việc; không khẳng định ROI nếu dữ liệu không đủ.', 'Chi phí hoàn trả phải dựa trên thỏa thuận, chứng từ và quyết định có thẩm quyền, không tự động khấu trừ trái quy định.'],
      notes: ['RACI: L&D là R; L&D Manager/CHRO là A; quản lý, Finance, C&B và Legal là C.', 'Ngoại lệ: nghỉ việc, chấm dứt không do lỗi nhân viên, khóa học kém chất lượng, thiếu chứng từ hoặc cam kết bị sửa đổi.'],
      steps: [
        { title: 'Thu thập phản hồi sau khóa học', actor: 'Học viên', location: 'Learning Portal', timing: 'Ngay sau khi kết thúc', typeCode: 'M', description: 'Đánh giá nội dung, giảng viên, tổ chức và mức hữu ích dự kiến.', fieldsChecklist: ['Mức hài lòng', 'Chất lượng nội dung', 'Giảng viên', 'Góp ý'] },
        { title: 'Đánh giá kết quả học tập', actor: 'L&D và giảng viên', location: 'Learning Analytics', timing: 'Sau khi khóa kết quả', typeCode: 'C', description: 'Tổng hợp tỷ lệ hoàn thành, điểm, chứng nhận và các trường hợp không đạt.', fieldsChecklist: ['Tỷ lệ hoàn thành', 'Điểm bình quân', 'Chứng chỉ', 'Không đạt'] },
        { title: 'Đánh giá áp dụng sau đào tạo', actor: 'Quản lý và học viên', location: 'Manager/Employee Portal', timing: 'Sau khoảng thời gian cấu hình', typeCode: 'M', description: 'Ghi nhận hành vi áp dụng, sản phẩm công việc và thay đổi năng lực sau học.', fieldsChecklist: ['Hành vi áp dụng', 'Bằng chứng công việc', 'Mức cải thiện', 'Nhận xét quản lý'] },
        { title: 'Phân tích hiệu quả chương trình', actor: 'L&D', location: 'Learning Analytics', timing: 'Theo quý hoặc chương trình', typeCode: 'C', description: 'So sánh mục tiêu, chi phí, kết quả và đề xuất tiếp tục, điều chỉnh hoặc dừng.', fieldsChecklist: ['Mục tiêu so với kết quả', 'Chi phí', 'Tác động', 'Khuyến nghị'] },
        { title: 'Đối soát nghĩa vụ cam kết', actor: 'C&B, Finance và Legal', location: 'Training Commitment', timing: 'Khi có sự kiện phát sinh', typeCode: 'C', description: 'Xác định chi phí hợp lệ, thời gian đã thực hiện và ngoại lệ trước khi trình quyết định.', fieldsChecklist: ['Thỏa thuận', 'Chi phí chứng từ', 'Thời gian cam kết', 'Số dư dự kiến'] },
        { title: 'Phê duyệt kết luận và cập nhật hồ sơ', actor: 'Cấp có thẩm quyền', location: 'Cổng phê duyệt', timing: 'Sau phân tích hoặc đối soát', typeCode: 'A', description: 'Duyệt hành động cải tiến, cập nhật IDP/năng lực và nghĩa vụ tài chính nếu hợp lệ.', fieldsChecklist: ['Quyết định', 'Hành động cải tiến', 'Cập nhật hồ sơ', 'Thông báo các bên'] }
      ]
    })
  ],
  talent: [
    buildProcess({
      code: 'TAL-01',
      title: 'Xác định vị trí trọng yếu và talent pool',
      category: 'Nhân tài · Talent pool',
      description: 'Xác định vị trí có ảnh hưởng lớn tới vận hành và nhóm nhân sự cần ưu tiên phát triển, với phạm vi truy cập chặt chẽ.',
      inputs: ['Chiến lược, cơ cấu và danh mục vị trí', 'Tiêu chí vị trí trọng yếu và tiêu chí talent', 'Dữ liệu nhân sự, hiệu suất và năng lực'],
      outputs: ['Danh mục vị trí trọng yếu', 'Talent pool có thời hạn rà soát', 'Rủi ro thiếu hụt nhân tài theo đơn vị'],
      rules: ['Talent pool không đồng nghĩa cam kết bổ nhiệm; tiêu chí và quyết định phải có bằng chứng và human review.', 'Dữ liệu talent dùng quyền riêng, không kế thừa mặc định từ quyền xem hồ sơ nhân viên.'],
      notes: ['RACI: Talent Management là R; Ban điều hành là A; HRBP và quản lý đơn vị là C.', 'Ngoại lệ: vị trí mới hoặc giải thể, nhân viên không đồng ý tham gia, tiêu chí thay đổi hoặc dữ liệu chưa đủ.'],
      steps: [
        { title: 'Rà soát danh mục vị trí', actor: 'Talent Management và HRBP', location: 'Talent Workspace', timing: 'Theo chu kỳ nhân tài', typeCode: 'M', description: 'Đánh giá tác động, độ khan hiếm, thời gian thay thế và rủi ro gián đoạn.', fieldsChecklist: ['Vị trí', 'Mức tác động', 'Độ khan hiếm', 'Thời gian thay thế', 'Rủi ro'] },
        { title: 'Phê duyệt vị trí trọng yếu', actor: 'Ban điều hành', location: 'Cổng phê duyệt', timing: 'Sau rà soát chiến lược', typeCode: 'A', description: 'Duyệt danh mục vị trí trọng yếu, chủ sở hữu và ngày rà soát tiếp theo.', fieldsChecklist: ['Danh mục duyệt', 'Chủ sở hữu', 'Lý do trọng yếu', 'Ngày rà soát'] },
        { title: 'Thiết lập tiêu chí talent pool', actor: 'Talent Management', location: 'Talent Configuration', timing: 'Trước khi đề cử', typeCode: 'M', description: 'Xác định điều kiện hiệu suất, tiềm năng, năng lực, mobility và điều kiện loại trừ.', fieldsChecklist: ['Tiêu chí đầu vào', 'Điều kiện loại trừ', 'Thời hạn membership', 'Mức bảo mật'] },
        { title: 'Đề cử nhân sự tiềm năng', actor: 'Quản lý và HRBP', location: 'Manager Portal', timing: 'Trong đợt đề cử', typeCode: 'M', description: 'Đề cử nhân viên kèm căn cứ, nguyện vọng và rủi ro giữ chân.', fieldsChecklist: ['Nhân viên', 'Căn cứ', 'Nguyện vọng', 'Rủi ro nghỉ việc'] },
        { title: 'Rà soát tính phù hợp và thiên lệch', actor: 'Talent Management', location: 'Talent Review', timing: 'Trước hội đồng', typeCode: 'C', description: 'Kiểm tra dữ liệu thiếu, tiêu chí, xung đột lợi ích và chênh lệch bất thường giữa các nhóm.', fieldsChecklist: ['Đủ dữ liệu', 'Đạt tiêu chí', 'Cảnh báo thiên lệch', 'Xung đột lợi ích'] },
        { title: 'Phê duyệt và cập nhật talent pool', actor: 'Hội đồng nhân tài', location: 'Talent Review', timing: 'Theo lịch hội đồng', typeCode: 'A', description: 'Quyết định membership, hành động phát triển, mức bảo mật và hạn rà soát.', fieldsChecklist: ['Quyết định', 'Talent pool', 'Hành động', 'Hạn rà soát'] }
      ]
    }),
    buildProcess({
      code: 'TAL-02',
      title: 'Đánh giá 9-Box và hiệu chỉnh nhân tài',
      category: 'Nhân tài · 9-Box',
      description: 'Kết hợp hiệu suất và tiềm năng để hỗ trợ thảo luận nhân tài, hiệu chỉnh giữa đơn vị và xác định hành động phát triển.',
      inputs: ['Kết quả hiệu suất đã duyệt', 'Tiêu chí và đánh giá tiềm năng', 'Hồ sơ năng lực, mobility và aspiration'],
      outputs: ['Kết quả 9-Box đã hiệu chỉnh', 'Phân nhóm nhân tài', 'Hành động phát triển và lịch rà soát'],
      rules: ['9-Box là công cụ hỗ trợ, không phải quyết định tự động; mọi ô xếp hạng phải có tiêu chí, bằng chứng và người xem xét.', 'Kết quả tiềm năng và 9-Box phải áp dụng quyền xem hạn chế và audit xuất dữ liệu.'],
      notes: ['RACI: Talent Management là R; Hội đồng nhân tài/Ban điều hành là A; quản lý và HRBP là C.', 'Ngoại lệ: thiếu lịch sử hiệu suất, mới bổ nhiệm, xung đột lợi ích, thay vai trò hoặc dữ liệu tiềm năng chưa đủ.'],
      steps: [
        { title: 'Nạp kết quả hiệu suất đủ điều kiện', actor: 'Hệ thống HRMS', location: 'Talent Analytics', timing: 'Sau khi khóa kỳ hiệu suất', typeCode: 'C', description: 'Chỉ nhận kết quả đã phê duyệt, đúng kỳ và đúng quyền truy cập.', fieldsChecklist: ['Kỳ hiệu suất', 'Kết quả cuối', 'Trạng thái duyệt', 'Nguồn dữ liệu'] },
        { title: 'Đánh giá tiềm năng', actor: 'Quản lý và HRBP', location: 'Talent Review', timing: 'Trong đợt talent review', typeCode: 'M', description: 'Đánh giá khả năng phát triển, learning agility, aspiration và mobility theo tiêu chí.', fieldsChecklist: ['Mức tiềm năng', 'Learning agility', 'Aspiration', 'Mobility', 'Bằng chứng'] },
        { title: 'Tạo ma trận 9-Box sơ bộ', actor: 'Hệ thống HRMS', location: '9-Box Workspace', timing: 'Khi đủ hai trục dữ liệu', typeCode: 'C', description: 'Đặt nhân sự vào ma trận theo cấu hình và đánh dấu dữ liệu thiếu hoặc ngoại lệ.', fieldsChecklist: ['Trục hiệu suất', 'Trục tiềm năng', 'Ô sơ bộ', 'Cảnh báo'] },
        { title: 'Họp hiệu chỉnh nhân tài', actor: 'Hội đồng nhân tài', location: '9-Box Workspace và cuộc họp', timing: 'Theo lịch hội đồng', typeCode: 'M', description: 'Thảo luận bằng chứng, so sánh tiêu chí và đề xuất thay đổi vị trí trên ma trận.', fieldsChecklist: ['Thành viên', 'Nội dung thảo luận', 'Đề xuất trước và sau', 'Căn cứ'] },
        { title: 'Phê duyệt kết quả và hành động', actor: 'Ban điều hành', location: 'Cổng phê duyệt', timing: 'Sau phiên hiệu chỉnh', typeCode: 'A', description: 'Duyệt kết quả, nhóm nhân tài và hành động như IDP, mentoring, giữ chân hoặc mobility.', fieldsChecklist: ['Ô 9-Box cuối', 'Nhóm nhân tài', 'Hành động', 'Người sở hữu'] },
        { title: 'Khóa quyền và đặt lịch rà soát', actor: 'Hệ thống HRMS', location: 'Talent Profile', timing: 'Sau phê duyệt', typeCode: 'N', description: 'Cập nhật hồ sơ mật, tạo nhiệm vụ phát triển và nhắc kỳ rà soát tiếp theo.', fieldsChecklist: ['Mức bảo mật', 'Nhiệm vụ', 'Ngày rà soát', 'Audit log'] }
      ]
    }),
    buildProcess({
      code: 'TAL-03',
      title: 'Lập và theo dõi kế hoạch kế nhiệm',
      category: 'Nhân tài · Kế nhiệm',
      description: 'Chuẩn bị nhiều ứng viên kế nhiệm cho vị trí trọng yếu, đánh giá mức sẵn sàng và theo dõi kế hoạch phát triển để giảm rủi ro gián đoạn.',
      inputs: ['Danh mục vị trí trọng yếu', 'Talent pool, 9-Box và hồ sơ năng lực', 'Tiêu chí readiness và nguyện vọng nghề nghiệp'],
      outputs: ['Successor slate theo vị trí', 'Mức Ready now, 1-2 năm hoặc 3+ năm', 'Kế hoạch phát triển và rủi ro kế nhiệm'],
      rules: ['Một vị trí có nhiều ứng viên và một nhân viên có thể được xem xét cho nhiều vị trí; không công khai ngoài phạm vi được phép.', 'Đề cử không tạo quyền được bổ nhiệm; quyết định nhân sự vẫn theo quy trình có thẩm quyền.'],
      notes: ['RACI: Talent Management và quản lý vị trí là R; Ban điều hành là A; HRBP và L&D là C; ứng viên là I theo chính sách.', 'Ngoại lệ: ứng viên rút lui hoặc nghỉ việc, vị trí thay đổi, khẩn cấp cần bổ nhiệm tạm thời hoặc không có ứng viên nội bộ.'],
      steps: [
        { title: 'Chọn vị trí cần lập kế nhiệm', actor: 'Talent Management', location: 'Succession Workspace', timing: 'Theo kỳ rà soát hoặc sự kiện', typeCode: 'M', description: 'Chọn vị trí trọng yếu, người đương nhiệm, rủi ro trống vị trí và thời điểm cần.', fieldsChecklist: ['Vị trí', 'Người đương nhiệm', 'Rủi ro trống', 'Thời điểm nhu cầu'] },
        { title: 'Đề cử ứng viên kế nhiệm', actor: 'Quản lý vị trí và HRBP', location: 'Succession Workspace', timing: 'Trong đợt đề cử', typeCode: 'M', description: 'Chọn ứng viên nội bộ hoặc nguồn ngoài kèm căn cứ và mức quan tâm.', fieldsChecklist: ['Ứng viên', 'Nguồn ứng viên', 'Căn cứ', 'Aspiration', 'Mobility'] },
        { title: 'Đánh giá phù hợp và khoảng trống', actor: 'Talent Management và L&D', location: 'Succession Analytics', timing: 'Sau đề cử', typeCode: 'C', description: 'So sánh năng lực, kinh nghiệm, hiệu suất và yêu cầu của vị trí kế nhiệm.', fieldsChecklist: ['Mức phù hợp', 'Competency gap', 'Kinh nghiệm thiếu', 'Rủi ro'] },
        { title: 'Xác định mức sẵn sàng', actor: 'Hội đồng nhân tài', location: 'Succession Review', timing: 'Theo phiên hội đồng', typeCode: 'M', description: 'Phân loại Ready now, 1-2 năm hoặc 3+ năm và ghi căn cứ.', fieldsChecklist: ['Readiness', 'Căn cứ', 'Điều kiện cần đạt', 'Ngày đánh giá'] },
        { title: 'Phê duyệt successor slate', actor: 'Ban điều hành', location: 'Cổng phê duyệt', timing: 'Sau talent review', typeCode: 'A', description: 'Duyệt danh sách ứng viên, thứ tự ưu tiên, phạm vi bảo mật và phương án khẩn cấp.', fieldsChecklist: ['Ứng viên duyệt', 'Mức ưu tiên', 'Phương án khẩn cấp', 'Mức bảo mật'] },
        { title: 'Tạo kế hoạch phát triển kế nhiệm', actor: 'Quản lý, L&D và ứng viên', location: 'IDP Workspace', timing: 'Sau phê duyệt slate', typeCode: 'M', description: 'Tạo stretch assignment, mentoring, đào tạo và mốc chứng minh readiness.', fieldsChecklist: ['Hành động phát triển', 'Mentor', 'Mốc hoàn thành', 'Bằng chứng'] },
        { title: 'Theo dõi và rà soát định kỳ', actor: 'Talent Management', location: 'Succession Dashboard', timing: 'Hàng quý hoặc theo cấu hình', typeCode: 'N', description: 'Cập nhật tiến độ, thay đổi readiness, rủi ro nghỉ việc và cảnh báo vị trí chưa có kế nhiệm.', fieldsChecklist: ['Tiến độ IDP', 'Readiness mới', 'Rủi ro nghỉ việc', 'Coverage vị trí'] }
      ]
    })
  ],
  engagement: [
    buildProcess({
      code: 'ENG-01',
      title: 'Ghi nhận và khen thưởng thành tích',
      category: 'Trải nghiệm nhân viên · Ghi nhận',
      description: 'Ghi nhận đóng góp kịp thời, phê duyệt thưởng theo hạn mức và chuyển đúng dữ liệu sang C&B, PAY và TAX.',
      inputs: ['Đề cử thành tích và bằng chứng', 'Chính sách, tiêu chí và ngân sách ghi nhận', 'Thông tin nhân viên và ma trận phê duyệt'],
      outputs: ['Quyết định ghi nhận', 'Khoản thưởng, quà hoặc ghi nhận phi tài chính', 'Dữ liệu chuyển PAY/TAX và lịch sử thành tích'],
      rules: ['Phân biệt thưởng tiền, hiện vật và phi tài chính; kiểm tra trùng đề cử, hạn mức và cách xử lý thuế trước phê duyệt.', 'Công bố thành tích phải theo lựa chọn riêng tư và chính sách truyền thông.'],
      notes: ['RACI: quản lý, đồng nghiệp hoặc HR là R; cấp duyệt theo hạn mức là A; C&B, Finance và Tax là C; nhân viên là I.', 'Ngoại lệ: đề cử trùng, vượt ngân sách, nhân viên đã nghỉ, thưởng cần thu hồi hoặc điều chỉnh.'],
      steps: [
        { title: 'Tạo đề cử ghi nhận', actor: 'Quản lý, đồng nghiệp hoặc HR', location: 'Recognition Portal', timing: 'Khi phát sinh thành tích', typeCode: 'M', description: 'Chọn nhân viên, chương trình, thành tích, giá trị thể hiện và bằng chứng.', fieldsChecklist: ['Người được đề cử', 'Chương trình', 'Thành tích', 'Bằng chứng', 'Phạm vi công bố'] },
        { title: 'Kiểm tra tiêu chí và trùng lặp', actor: 'Hệ thống HRMS', location: 'Recognition Engine', timing: 'Ngay khi gửi', typeCode: 'C', description: 'Kiểm tra eligibility, cùng thành tích, hạn mức cá nhân và trạng thái nhân viên.', fieldsChecklist: ['Eligibility', 'Trùng đề cử', 'Hạn mức', 'Trạng thái nhân viên'] },
        { title: 'Thẩm định ngân sách và thuế', actor: 'C&B, Finance và Tax', location: 'Reward Review', timing: 'Với ghi nhận có giá trị', typeCode: 'C', description: 'Xác định loại quyền lợi, nguồn ngân sách, giá trị tính thuế và kỳ chi trả.', fieldsChecklist: ['Loại thưởng', 'Nguồn ngân sách', 'Giá trị', 'Tax treatment', 'Kỳ trả'] },
        { title: 'Phê duyệt ghi nhận', actor: 'Cấp duyệt theo hạn mức', location: 'Cổng phê duyệt', timing: 'Theo SLA chương trình', typeCode: 'A', description: 'Duyệt, từ chối hoặc điều chỉnh mức thưởng kèm lý do.', fieldsChecklist: ['Quyết định', 'Mức duyệt', 'Lý do điều chỉnh', 'Ngày duyệt'] },
        { title: 'Công bố và gửi lời ghi nhận', actor: 'Hệ thống HRMS và HR', location: 'Portal, Email hoặc kênh nội bộ', timing: 'Sau phê duyệt', typeCode: 'N', description: 'Gửi thông báo riêng hoặc công bố theo phạm vi đã được phép.', fieldsChecklist: ['Nội dung công bố', 'Kênh', 'Đối tượng nhìn thấy', 'Ngày công bố'] },
        { title: 'Chuyển thưởng và lưu lịch sử', actor: 'Hệ thống HRMS', location: 'C&B/PAY/TAX Integration', timing: 'Theo kỳ chi trả', typeCode: 'N', description: 'Chuyển bản ghi thưởng, theo dõi trạng thái chi và cập nhật hồ sơ thành tích.', fieldsChecklist: ['Mã khoản thưởng', 'Kỳ lương', 'Tax code', 'Trạng thái chi', 'Audit log'] }
      ]
    }),
    buildProcess({
      code: 'ENG-02',
      title: 'Quản lý phúc lợi, sức khỏe và gắn kết',
      category: 'Trải nghiệm nhân viên · Phúc lợi và gắn kết',
      description: 'Quản lý chương trình phúc lợi, khám sức khỏe và khảo sát gắn kết từ xác định điều kiện tới đối soát chi phí và hành động cải thiện.',
      inputs: ['Chính sách phúc lợi và ngân sách', 'Hồ sơ nhân viên, người phụ thuộc và eligibility', 'Nhà cung cấp, kế hoạch khám hoặc khảo sát'],
      outputs: ['Lịch sử hưởng phúc lợi và chi phí', 'Hồ sơ sức khỏe theo phạm vi được phép', 'Kết quả gắn kết tổng hợp và action plan'],
      rules: ['Dữ liệu sức khỏe chỉ hiển thị theo nhu cầu công việc; báo cáo quản trị ưu tiên dữ liệu tổng hợp hoặc ẩn danh.', 'Quyền lợi chịu thuế phải chuyển TAX/PAY; thay đổi eligibility phải dùng effective date và không xóa lịch sử.'],
      notes: ['RACI: Total Rewards/Employee Experience là R; CHRO là A; C&B, Finance, Legal và HSE là C; nhân viên là R khi đăng ký.', 'Ngoại lệ: người phụ thuộc, điều chuyển, nghỉ việc giữa chương trình, yêu cầu ngoài hạn mức, nhà cung cấp từ chối hoặc mẫu khảo sát không đủ ẩn danh.'],
      steps: [
        { title: 'Thiết lập chương trình', actor: 'Total Rewards hoặc Employee Experience', location: 'Benefit & Engagement Setup', timing: 'Trước thời gian mở chương trình', typeCode: 'M', description: 'Khai báo loại phúc lợi, khám sức khỏe hoặc khảo sát, phạm vi và thời hạn.', fieldsChecklist: ['Mã chương trình', 'Loại chương trình', 'Thời gian', 'Nhà cung cấp', 'Ngân sách'] },
        { title: 'Cấu hình eligibility và hạn mức', actor: 'C&B và HR Data', location: 'Benefit Rules', timing: 'Trước phát hành', typeCode: 'C', description: 'Xác định điều kiện theo trạng thái, đơn vị, thâm niên, cấp bậc và người phụ thuộc.', fieldsChecklist: ['Nhóm đủ điều kiện', 'Hạn mức', 'Người phụ thuộc', 'Ngày hiệu lực'] },
        { title: 'Đăng ký quyền lợi hoặc tham gia', actor: 'Nhân viên', location: 'Employee Portal', timing: 'Trong thời gian đăng ký', typeCode: 'M', description: 'Chọn quyền lợi, lịch khám hoặc trả lời khảo sát và cung cấp giấy tờ cần thiết.', fieldsChecklist: ['Lựa chọn quyền lợi', 'Lịch đăng ký', 'Người phụ thuộc', 'Chứng từ', 'Consent'] },
        { title: 'Kiểm tra và phê duyệt yêu cầu', actor: 'HR và cấp duyệt theo chính sách', location: 'Benefit Approval', timing: 'Theo SLA chương trình', typeCode: 'A', description: 'Kiểm tra điều kiện, hạn mức, trùng quyền lợi và phê duyệt hoặc yêu cầu bổ sung.', fieldsChecklist: ['Kết quả eligibility', 'Hạn mức còn lại', 'Quyết định', 'Lý do'] },
        { title: 'Cung cấp quyền lợi và bảo vệ dữ liệu', actor: 'HR và nhà cung cấp', location: 'Vendor Portal/Benefit Administration', timing: 'Theo lịch chương trình', typeCode: 'M', description: 'Cấp quyền lợi, tổ chức khám hoặc phát hành khảo sát với phân quyền và consent phù hợp.', fieldsChecklist: ['Trạng thái cung cấp', 'Mã nhà cung cấp', 'Consent', 'Phân loại dữ liệu'] },
        { title: 'Đối soát chi phí và tích hợp PAY/TAX', actor: 'C&B và Finance', location: 'Benefit Reconciliation', timing: 'Theo kỳ đối soát', typeCode: 'C', description: 'Đối chiếu danh sách sử dụng, hóa đơn, phần nhân viên đóng và nghĩa vụ thuế.', fieldsChecklist: ['Danh sách sử dụng', 'Hóa đơn', 'Chi phí công ty', 'Phần nhân viên', 'Tax treatment'] },
        { title: 'Phân tích gắn kết và theo dõi action plan', actor: 'Employee Experience và quản lý', location: 'Engagement Dashboard', timing: 'Sau chương trình hoặc khảo sát', typeCode: 'N', description: 'Công bố kết quả tổng hợp đủ ngưỡng ẩn danh, giao hành động cải thiện và theo dõi tiến độ.', fieldsChecklist: ['Điểm tổng hợp', 'Ngưỡng ẩn danh', 'Action plan', 'Người sở hữu', 'Hạn hoàn thành'] }
      ]
    })
  ]
}

export const PEOPLE_DEVELOPMENT_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  'MODULE-PFM': peopleDevelopmentProcesses.performance,
  'MODULE-CMP': peopleDevelopmentProcesses.competency,
  'MODULE-LND': peopleDevelopmentProcesses.learning,
  'MODULE-TAL': peopleDevelopmentProcesses.talent,
  'MODULE-ENG': peopleDevelopmentProcesses.engagement
}
