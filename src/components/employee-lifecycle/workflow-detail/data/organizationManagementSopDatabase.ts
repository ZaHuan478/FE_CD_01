import type { SopSubProcess, SopSubStep } from '../types'

interface OrganizationProcessSeed {
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

const buildSteps = (seed: OrganizationProcessSeed): SopSubStep[] => {
  const prefix = seed.code.replace(/[^A-Z0-9]/gi, '')
  return [
    {
      stepCode: `${prefix}.01`,
      title: `Khởi tạo ${seed.title.toLocaleLowerCase('vi-VN')}`,
      actor: seed.requester,
      location: 'HRMS · Quản trị tổ chức',
      timing: 'Khi phát sinh nhu cầu hoặc theo chu kỳ',
      typeCode: 'M',
      description: `Tạo hồ sơ nghiệp vụ, xác định phạm vi, ngày hiệu lực, lý do và các dữ liệu nguồn cần dùng cho ${seed.title.toLocaleLowerCase('vi-VN')}.`,
      fieldsChecklist: ['Phạm vi áp dụng', 'Ngày hiệu lực', 'Lý do và căn cứ', ...seed.inputs.slice(0, 2)]
    },
    {
      stepCode: `${prefix}.02`,
      title: 'Kiểm tra dữ liệu và điều kiện nghiệp vụ',
      actor: 'Hệ thống HRMS',
      location: 'Organization Data Control',
      timing: 'Ngay khi gửi yêu cầu',
      typeCode: 'A',
      description: 'Kiểm tra mã trùng, phiên bản hiệu lực, quan hệ cha con, định biên, trạng thái đối tượng và các trường bắt buộc trước khi thẩm định.',
      fieldsChecklist: ['Mã duy nhất', 'Khoảng ngày hiệu lực', 'Dữ liệu tham chiếu', 'Danh sách lỗi và cảnh báo']
    },
    {
      stepCode: `${prefix}.03`,
      title: 'Thẩm định phạm vi và tác động',
      actor: seed.controller,
      location: 'HRMS · Không gian thẩm định',
      timing: 'Theo SLA kiểm soát',
      typeCode: 'C',
      description: 'Đối chiếu chính sách, ngân sách và dữ liệu hiện hành; xác định ảnh hưởng tới đơn vị, vị trí, nhân viên và các phân hệ liên quan.',
      fieldsChecklist: ['Kết quả đối chiếu', 'Đối tượng bị ảnh hưởng', 'Ý kiến kiểm soát', 'Phương án xử lý ngoại lệ']
    },
    {
      stepCode: `${prefix}.04`,
      title: 'Phê duyệt hoặc trả lại điều chỉnh',
      actor: seed.approver,
      location: 'Cổng phê duyệt',
      timing: 'Sau khi hoàn tất thẩm định',
      typeCode: 'A',
      description: 'Xem nội dung trước và sau thay đổi, ý kiến thẩm định và tác động; phê duyệt, từ chối hoặc trả lại kèm lý do.',
      fieldsChecklist: ['Quyết định', 'Ý kiến phê duyệt', 'Người phê duyệt', 'Thời điểm phê duyệt']
    },
    {
      stepCode: `${prefix}.05`,
      title: 'Áp dụng theo ngày hiệu lực và lưu lịch sử',
      actor: 'Hệ thống HRMS',
      location: 'Organization Master Data và Notification',
      timing: 'Theo ngày hiệu lực đã duyệt',
      typeCode: 'N',
      description: 'Tạo phiên bản dữ liệu mới, giữ nguyên lịch sử, cập nhật các quan hệ phụ thuộc và thông báo đúng nhóm người dùng.',
      fieldsChecklist: [...seed.outputs.slice(0, 2), 'Phiên bản trước và sau', 'Audit log', 'Trạng thái đồng bộ']
    }
  ]
}

const buildProcess = (seed: OrganizationProcessSeed): SopSubProcess => ({
  sopCode: seed.code,
  sopTitle: seed.title,
  sopCategory: seed.category,
  description: seed.description,
  inputs: seed.inputs,
  outputs: seed.outputs,
  rules: seed.rules,
  sourceNote: 'Nội dung demo được chuẩn hóa từ pháp luật lao động Việt Nam, ISO 30409, ISO 30414 và mô hình Workforce Structures, Position Management của các HRMS doanh nghiệp. Chính sách và thẩm quyền cần cấu hình theo từng doanh nghiệp.',
  notes: [`RACI chính: ${seed.requester} là R; ${seed.approver} là A; ${seed.controller} là C; các đơn vị bị ảnh hưởng là I.`, 'Mọi thay đổi dữ liệu tổ chức phải có ngày hiệu lực, lý do, phiên bản và nhật ký kiểm toán.'],
  steps: buildSteps(seed)
})

const commonRules = ['Không ghi đè dữ liệu đang có hiệu lực; thay đổi phải tạo phiên bản mới.', 'Không áp dụng khi dữ liệu tham chiếu hoặc cấp phê duyệt chưa hợp lệ.']

const p = (seed: OrganizationProcessSeed) => buildProcess(seed)

const headcountProcesses = [
  p({ code: 'HC-01', title: 'Thiết lập chu kỳ và giả định hoạch định nhân lực', category: 'Định biên · Chu kỳ kế hoạch', description: 'Xác định kỳ kế hoạch, phạm vi, giả định tăng trưởng, năng suất, tỷ lệ nghỉ việc và nguyên tắc lập ngân sách nhân lực.', inputs: ['Chiến lược và kế hoạch kinh doanh', 'Lịch ngân sách và chính sách định biên'], outputs: ['Chu kỳ hoạch định đã phát hành', 'Bộ giả định và lịch nhiệm vụ'], rules: commonRules, requester: 'HR Planning', controller: 'HRBP và Finance', approver: 'CHRO hoặc Ban điều hành' }),
  p({ code: 'HC-02', title: 'Thu thập nhu cầu nhân lực từ các đơn vị', category: 'Định biên · Nhu cầu', description: 'Thu thập nhu cầu theo đơn vị, chức danh, vị trí, tháng cần người, lý do và mức ưu tiên.', inputs: ['Chu kỳ hoạch định đã mở', 'Kế hoạch hoạt động của đơn vị'], outputs: ['Danh sách nhu cầu nhân lực', 'Giải trình theo đơn vị và thời điểm'], rules: commonRules, requester: 'Trưởng đơn vị', controller: 'HRBP', approver: 'Giám đốc khối' }),
  p({ code: 'HC-03', title: 'Phân tích lực lượng lao động hiện tại', category: 'Định biên · Nguồn cung', description: 'Lập snapshot nhân lực hiện có, FTE, hợp đồng, năng lực, biến động dự kiến và vị trí đang trống.', inputs: ['Hồ sơ nhân viên hiệu lực', 'Cơ cấu, vị trí và dữ liệu biến động'], outputs: ['Baseline Headcount và FTE', 'Dự báo nguồn cung nội bộ'], rules: commonRules, requester: 'HR Planning', controller: 'HR Data Steward', approver: 'CHRO' }),
  p({ code: 'HC-04', title: 'Dự báo nhu cầu và xác định chênh lệch nhân lực', category: 'Định biên · Phân tích chênh lệch', description: 'So sánh nhu cầu với nguồn cung để xác định thiếu, thừa, rủi ro năng lực và thời điểm cần hành động.', inputs: ['Nhu cầu nhân lực', 'Baseline và dự báo nguồn cung'], outputs: ['Báo cáo thiếu và thừa nhân lực', 'Danh sách khoảng trống ưu tiên'], rules: commonRules, requester: 'HR Planning', controller: 'HRBP và đơn vị', approver: 'CHRO' }),
  p({ code: 'HC-05', title: 'Xây dựng kịch bản Headcount, FTE và People Cost', category: 'Định biên · Kịch bản', description: 'Mô phỏng tuyển mới, điều chuyển, thuê ngoài, tự động hóa và tác động chi phí theo nhiều kịch bản.', inputs: ['Khoảng trống nhân lực', 'Dải lương, phúc lợi và ngân sách'], outputs: ['Các kịch bản nhân lực', 'People Cost và khuyến nghị lựa chọn'], rules: commonRules, requester: 'HR Planning', controller: 'C&B và Finance', approver: 'CHRO' }),
  p({ code: 'HC-06', title: 'Phê duyệt và khóa định biên gốc', category: 'Định biên · Phê duyệt', description: 'Tổng hợp phương án cuối, phê duyệt số lượng, FTE, chi phí và khóa baseline làm trần kiểm soát.', inputs: ['Kịch bản được đề xuất', 'Ý kiến HR, Finance và lãnh đạo đơn vị'], outputs: ['Định biên gốc được duyệt', 'Hạn mức vị trí và ngân sách'], rules: commonRules, requester: 'CHRO', controller: 'Finance và HR Governance', approver: 'Ban điều hành' }),
  p({ code: 'HC-07', title: 'Điều chỉnh định biên trong kỳ', category: 'Định biên · Điều chỉnh', description: 'Xử lý yêu cầu tăng, giảm hoặc chuyển định biên giữa đơn vị với đầy đủ tác động ngân sách và ngày hiệu lực.', inputs: ['Định biên gốc', 'Yêu cầu và giải trình điều chỉnh'], outputs: ['Phiên bản định biên điều chỉnh', 'Hạn mức còn lại sau duyệt'], rules: commonRules, requester: 'Trưởng đơn vị', controller: 'HRBP và Finance', approver: 'Cấp duyệt theo hạn mức' }),
  p({ code: 'HC-08', title: 'Theo dõi Actual so với Plan và cảnh báo vượt định biên', category: 'Định biên · Giám sát', description: 'Theo dõi nhân sự thực tế, FTE, vị trí trống, đang tuyển và chi phí so với baseline theo thời gian.', inputs: ['Định biên có hiệu lực', 'Nhân sự, vị trí, tuyển dụng và People Cost thực tế'], outputs: ['Dashboard Actual so với Plan', 'Cảnh báo vượt hoặc chưa sử dụng định biên'], rules: commonRules, requester: 'Hệ thống HRMS', controller: 'HR Planning và Finance', approver: 'CHRO' })
]

const structureProcesses = [
  p({ code: 'OST-01', title: 'Thiết lập mô hình và cấp tổ chức', category: 'Cơ cấu tổ chức · Mô hình', description: 'Định nghĩa các cấp pháp nhân, khối, ban, phòng, bộ phận, nhóm và nguyên tắc quan hệ cha con.', inputs: ['Mô hình quản trị doanh nghiệp', 'Quy tắc mã và cấp tổ chức'], outputs: ['Mô hình cấp tổ chức', 'Quy tắc cây và mã đơn vị'], rules: commonRules, requester: 'HR Organization Design', controller: 'Legal và Finance', approver: 'Ban điều hành' }),
  p({ code: 'OST-02', title: 'Thành lập đơn vị tổ chức', category: 'Cơ cấu tổ chức · Thành lập', description: 'Tạo đơn vị mới với mã, cấp, đơn vị cha, người quản lý, Cost Center, địa điểm và ngày hiệu lực.', inputs: ['Quyết định thành lập', 'Đơn vị cha và Cost Center'], outputs: ['Đơn vị tổ chức mới', 'Quan hệ trên cây tổ chức'], rules: commonRules, requester: 'HRBP hoặc Trưởng đơn vị', controller: 'HR Data Steward và Finance', approver: 'Cấp có thẩm quyền' }),
  p({ code: 'OST-03', title: 'Thay đổi thông tin đơn vị tổ chức', category: 'Cơ cấu tổ chức · Cập nhật', description: 'Quản lý đổi tên, mã hiển thị, chức năng, địa điểm hoặc thuộc tính của đơn vị theo ngày hiệu lực.', inputs: ['Đơn vị hiện hành', 'Nội dung và lý do thay đổi'], outputs: ['Phiên bản đơn vị mới', 'Lịch sử thuộc tính đơn vị'], rules: commonRules, requester: 'HRBP', controller: 'HR Data Steward', approver: 'Trưởng HR' }),
  p({ code: 'OST-04', title: 'Thay đổi quản lý, Cost Center hoặc địa điểm', category: 'Cơ cấu tổ chức · Quan hệ quản trị', description: 'Thay đổi người quản lý đơn vị và các thuộc tính tài chính, địa điểm mà không làm mất lịch sử.', inputs: ['Đơn vị và quan hệ hiện tại', 'Người quản lý hoặc Cost Center mới'], outputs: ['Quan hệ quản lý mới', 'Dữ liệu chuyển PAY, quyền và báo cáo'], rules: commonRules, requester: 'Trưởng đơn vị hoặc HRBP', controller: 'Finance, HR Data và IT', approver: 'Cấp quản lý có thẩm quyền' }),
  p({ code: 'OST-05', title: 'Di chuyển đơn vị trong cây tổ chức', category: 'Cơ cấu tổ chức · Điều chuyển', description: 'Chuyển một đơn vị sang đơn vị cha khác và xác định tác động đến tuyến báo cáo, vị trí, nhân viên và phân quyền.', inputs: ['Cây tổ chức hiện tại', 'Đơn vị cha mới và ngày hiệu lực'], outputs: ['Cây tổ chức phiên bản mới', 'Danh sách quan hệ được cập nhật'], rules: commonRules, requester: 'HR Organization Design', controller: 'HRBP, Finance và IT', approver: 'Ban điều hành hoặc cấp ủy quyền' }),
  p({ code: 'OST-06', title: 'Tách, gộp, đổi tên hoặc giải thể đơn vị', category: 'Cơ cấu tổ chức · Tái cấu trúc', description: 'Quản lý phương án tái cấu trúc và chuyển tiếp toàn bộ vị trí, nhân viên, Cost Center và trách nhiệm liên quan.', inputs: ['Phương án tái cấu trúc', 'Danh sách đơn vị và đối tượng bị ảnh hưởng'], outputs: ['Cơ cấu sau tái tổ chức', 'Phương án chuyển tiếp dữ liệu'], rules: commonRules, requester: 'Ban điều hành hoặc HR Organization Design', controller: 'HRBP, Legal và Finance', approver: 'Cấp có thẩm quyền' }),
  p({ code: 'OST-07', title: 'Đánh giá ảnh hưởng của phương án tái cơ cấu', category: 'Cơ cấu tổ chức · Kiểm soát tác động', description: 'Xác định người lao động, vị trí, hợp đồng, lương, quyền hệ thống và nghĩa vụ cần xử lý trước khi tái cơ cấu.', inputs: ['Phương án cơ cấu dự kiến', 'Nhân viên, vị trí và quan hệ lao động'], outputs: ['Danh sách ảnh hưởng', 'Kế hoạch sử dụng và chuyển tiếp lao động'], rules: commonRules, requester: 'HR Organization Design', controller: 'HRBP, Legal, C&B và IT', approver: 'CHRO' }),
  p({ code: 'OST-08', title: 'Phê duyệt, áp dụng và công bố cơ cấu theo ngày hiệu lực', category: 'Cơ cấu tổ chức · Công bố', description: 'Khóa phương án, áp dụng đồng bộ và công bố sơ đồ tổ chức hiện tại hoặc tương lai theo quyền xem.', inputs: ['Phương án đã thẩm định', 'Ngày hiệu lực và phạm vi công bố'], outputs: ['Sơ đồ tổ chức có hiệu lực', 'Thông báo và audit log'], rules: commonRules, requester: 'HR Organization Design', controller: 'HR Data Steward và Internal Communications', approver: 'Ban điều hành' })
]

const jobProcesses = [
  p({ code: 'JOB-01', title: 'Thiết lập nhóm nghề và họ nghề nghiệp', category: 'Chức danh · Kiến trúc nghề nghiệp', description: 'Xây dựng Job Function, Job Family, Sub-family và nguyên tắc phân loại công việc dùng chung toàn doanh nghiệp.', inputs: ['Chiến lược năng lực', 'Danh mục công việc hiện có'], outputs: ['Kiến trúc nghề nghiệp', 'Danh mục Job Family có hiệu lực'], rules: commonRules, requester: 'HR Job Architecture', controller: 'HRBP và chuyên gia nghiệp vụ', approver: 'CHRO' }),
  p({ code: 'JOB-02', title: 'Tạo mới chức danh', category: 'Chức danh · Tạo mới', description: 'Tạo chức danh dùng chung, không gắn với một cá nhân, với mục tiêu, phạm vi trách nhiệm và yêu cầu tối thiểu.', inputs: ['Nhu cầu công việc mới', 'Job Family và cấp quản lý'], outputs: ['Mã chức danh mới', 'Hồ sơ chức danh ở trạng thái hiệu lực'], rules: commonRules, requester: 'Trưởng đơn vị hoặc HRBP', controller: 'HR Job Architecture', approver: 'CHRO hoặc cấp ủy quyền' }),
  p({ code: 'JOB-03', title: 'Cập nhật chức danh và mô tả công việc', category: 'Chức danh · Mô tả công việc', description: 'Quản lý mục tiêu công việc, trách nhiệm, yêu cầu học vấn, kinh nghiệm, kỹ năng và phiên bản JD.', inputs: ['Chức danh hiện hành', 'Nội dung công việc và yêu cầu mới'], outputs: ['JD phiên bản mới', 'Lịch sử thay đổi chức danh'], rules: commonRules, requester: 'Quản lý chuyên môn', controller: 'HRBP và HR Job Architecture', approver: 'Chủ sở hữu Job Family' }),
  p({ code: 'JOB-04', title: 'Đánh giá chức danh và ánh xạ cấp bậc', category: 'Chức danh · Job Evaluation', description: 'Đánh giá quy mô, độ phức tạp, tác động và trách nhiệm để ánh xạ Job Level, Grade và dải lương.', inputs: ['JD đã thẩm định', 'Phương pháp Job Evaluation và khung Grade'], outputs: ['Kết quả Job Evaluation', 'Job Level, Grade và dải lương tham chiếu'], rules: commonRules, requester: 'HR Job Architecture', controller: 'C&B và Hội đồng đánh giá', approver: 'CHRO' }),
  p({ code: 'JOB-05', title: 'Ngừng sử dụng hoặc thay thế chức danh', category: 'Chức danh · Vòng đời', description: 'Đóng chức danh không còn sử dụng, xác định chức danh thay thế và xử lý các vị trí đang tham chiếu.', inputs: ['Chức danh cần ngừng', 'Danh sách vị trí và nhân viên liên quan'], outputs: ['Chức danh hết hiệu lực', 'Ánh xạ chức danh thay thế'], rules: commonRules, requester: 'HR Job Architecture', controller: 'HRBP và C&B', approver: 'CHRO' })
]

const positionProcesses = [
  p({ code: 'POS-01', title: 'Tạo vị trí từ định biên được phê duyệt', category: 'Vị trí · Khởi tạo', description: 'Tạo một ghế công việc cụ thể trong đơn vị từ hạn mức định biên còn khả dụng.', inputs: ['Định biên còn hiệu lực', 'Chức danh, đơn vị và FTE'], outputs: ['Mã vị trí mới', 'Số định biên còn lại'], rules: commonRules, requester: 'Trưởng đơn vị hoặc HRBP', controller: 'HR Planning và C&B', approver: 'Cấp duyệt theo hạn mức' }),
  p({ code: 'POS-02', title: 'Điều chỉnh thông tin, FTE hoặc đơn vị của vị trí', category: 'Vị trí · Thay đổi', description: 'Thay đổi chức danh, FTE, đơn vị, địa điểm, Cost Center hoặc tuyến báo cáo của vị trí theo ngày hiệu lực.', inputs: ['Vị trí hiện hành', 'Nội dung thay đổi và định biên'], outputs: ['Phiên bản vị trí mới', 'Tác động tới người đảm nhiệm'], rules: commonRules, requester: 'Trưởng đơn vị hoặc HRBP', controller: 'HR Data, C&B và HR Planning', approver: 'Cấp duyệt theo thẩm quyền' }),
  p({ code: 'POS-03', title: 'Quản lý người đảm nhiệm và tỷ lệ phân bổ FTE', category: 'Vị trí · Người đảm nhiệm', description: 'Theo dõi một hoặc nhiều người đảm nhiệm, phần trăm FTE, thời gian kiêm nhiệm và quan hệ vị trí chính.', inputs: ['Vị trí có hiệu lực', 'Quyết định phân công hoặc điều chuyển'], outputs: ['Lịch sử người đảm nhiệm', 'Tỷ lệ lấp đầy vị trí'], rules: commonRules, requester: 'HR Operations', controller: 'HRBP và Payroll', approver: 'Quản lý có thẩm quyền' }),
  p({ code: 'POS-04', title: 'Quản lý vị trí trống và tuyển thay thế', category: 'Vị trí · Vacancy', description: 'Xác định vị trí trống do mới mở hoặc nhân viên rời vị trí và bàn giao sang tuyển dụng đúng hạn mức.', inputs: ['Vị trí trống', 'Lý do và ngày cần lấp đầy'], outputs: ['Vacancy được xác nhận', 'Yêu cầu tuyển dụng liên kết vị trí'], rules: commonRules, requester: 'Trưởng đơn vị', controller: 'HRBP và Talent Acquisition', approver: 'Cấp duyệt tuyển dụng' }),
  p({ code: 'POS-05', title: 'Tạm khóa, đóng hoặc mở lại vị trí', category: 'Vị trí · Trạng thái', description: 'Quản lý trạng thái vị trí khi tạm dừng tuyển, hết nhu cầu, tái cấu trúc hoặc được cấp lại ngân sách.', inputs: ['Vị trí và trạng thái hiện tại', 'Lý do thay đổi trạng thái'], outputs: ['Trạng thái vị trí mới', 'Xử lý vacancy hoặc người đảm nhiệm'], rules: commonRules, requester: 'Trưởng đơn vị hoặc HRBP', controller: 'HR Planning và HR Data', approver: 'Cấp duyệt theo hạn mức' }),
  p({ code: 'POS-06', title: 'Quản lý cây vị trí và tuyến báo cáo', category: 'Vị trí · Position Tree', description: 'Thiết lập quan hệ báo cáo giữa các vị trí, vị trí quản lý và cơ chế thay thế tạm thời.', inputs: ['Danh sách vị trí có hiệu lực', 'Quan hệ quản lý dự kiến'], outputs: ['Position Tree có hiệu lực', 'Tuyến phê duyệt và phân quyền liên quan'], rules: commonRules, requester: 'HR Organization Design', controller: 'HR Data và IT Security', approver: 'CHRO hoặc cấp ủy quyền' })
]

const reportingProcesses = [
  p({ code: 'RPT-01', title: 'Thiết lập danh mục và định nghĩa chỉ số nhân sự', category: 'Báo cáo nhân sự · Data Governance', description: 'Chuẩn hóa tên, công thức, chiều phân tích, chủ sở hữu và tần suất cập nhật của từng chỉ số.', inputs: ['Nhu cầu quản trị và tuân thủ', 'Nguồn dữ liệu HRMS'], outputs: ['Metric Dictionary', 'Data owner và công thức được duyệt'], rules: commonRules, requester: 'People Analytics', controller: 'HR Data Steward', approver: 'CHRO' }),
  p({ code: 'RPT-02', title: 'Báo cáo cơ cấu và hiện trạng nhân sự', category: 'Báo cáo nhân sự · Hiện trạng', description: 'Cung cấp snapshot nhân sự theo pháp nhân, khối, đơn vị, địa điểm, chức danh, vị trí và trạng thái.', inputs: ['Hồ sơ nhân viên và assignment', 'Cơ cấu, chức danh và vị trí'], outputs: ['Báo cáo cơ cấu nhân sự', 'Snapshot tại ngày báo cáo'], rules: commonRules, requester: 'People Analytics', controller: 'HR Data Steward', approver: 'CHRO' }),
  p({ code: 'RPT-03', title: 'Báo cáo Headcount, FTE và Actual so với Plan', category: 'Báo cáo nhân sự · Định biên', description: 'So sánh định biên được duyệt với nhân sự, FTE, vị trí trống, đang tuyển và chi phí thực tế.', inputs: ['Định biên và ngân sách', 'Nhân sự, vị trí và tuyển dụng thực tế'], outputs: ['Actual so với Plan', 'Cảnh báo chênh lệch theo đơn vị'], rules: commonRules, requester: 'HR Planning', controller: 'Finance và HR Data', approver: 'CHRO' }),
  p({ code: 'RPT-04', title: 'Báo cáo biến động nhân sự', category: 'Báo cáo nhân sự · Movement', description: 'Theo dõi tăng mới, nghỉ việc, điều chuyển, bổ nhiệm, thay đổi hợp đồng và di chuyển nội bộ.', inputs: ['Lịch sử sự kiện nhân sự', 'Cơ cấu và assignment theo ngày hiệu lực'], outputs: ['Báo cáo biến động', 'Tỷ lệ tuyển mới, nghỉ việc và di chuyển'], rules: commonRules, requester: 'People Analytics', controller: 'HR Operations', approver: 'CHRO' }),
  p({ code: 'RPT-05', title: 'Báo cáo vị trí trống và nhu cầu tuyển dụng', category: 'Báo cáo nhân sự · Vacancy', description: 'Theo dõi vị trí được phép tuyển, thời gian trống, pipeline tuyển dụng và rủi ro chưa lấp đầy.', inputs: ['Position và Vacancy', 'Requisition và pipeline tuyển dụng'], outputs: ['Vacancy Dashboard', 'Danh sách vị trí quá hạn lấp đầy'], rules: commonRules, requester: 'Talent Acquisition', controller: 'HR Planning', approver: 'CHRO' }),
  p({ code: 'RPT-06', title: 'Báo cáo Span of Control và tầng quản lý', category: 'Báo cáo nhân sự · Sức khỏe tổ chức', description: 'Phân tích số nhân viên trên mỗi quản lý, số tầng, đơn vị quá mỏng hoặc quá rộng và ngoại lệ tuyến báo cáo.', inputs: ['Cây tổ chức và Position Tree', 'Assignment và cấp quản lý'], outputs: ['Span of Control', 'Cảnh báo tầng quản lý và quan hệ bất thường'], rules: commonRules, requester: 'HR Organization Design', controller: 'HR Data Steward', approver: 'CHRO' }),
  p({ code: 'RPT-07', title: 'Báo cáo chi phí và năng suất nhân sự', category: 'Báo cáo nhân sự · People Cost', description: 'Kết hợp Headcount, FTE, lương, phúc lợi và chỉ số kinh doanh để phân tích chi phí và năng suất.', inputs: ['People Cost đã đối soát', 'Headcount, FTE và dữ liệu kinh doanh'], outputs: ['Chi phí theo đơn vị và FTE', 'Chỉ số năng suất nhân lực'], rules: commonRules, requester: 'People Analytics', controller: 'C&B và Finance', approver: 'CHRO hoặc CFO' }),
  p({ code: 'RPT-08', title: 'Báo cáo sử dụng lao động, phân phối và kiểm soát truy cập', category: 'Báo cáo nhân sự · Tuân thủ', description: 'Lập báo cáo theo quy định, kiểm tra dữ liệu, phê duyệt, xuất tệp và phân phối theo đúng thẩm quyền.', inputs: ['Dữ liệu lao động kỳ báo cáo', 'Biểu mẫu, lịch nộp và danh sách người nhận'], outputs: ['Báo cáo đã phê duyệt', 'Lịch sử nộp, xuất và truy cập'], rules: commonRules, requester: 'HR Compliance', controller: 'Legal và HR Data Protection', approver: 'Người đại diện hoặc cấp ủy quyền' })
]

export const ORGANIZATION_MANAGEMENT_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  'MODULE-ORG-HC': headcountProcesses,
  'MODULE-ORG-ST': structureProcesses,
  'MODULE-ORG-JOB': jobProcesses,
  'MODULE-ORG-POS': positionProcesses,
  'MODULE-ORG-RPT': reportingProcesses
}
