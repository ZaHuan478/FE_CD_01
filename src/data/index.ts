export { masterData } from './master-data'
export type { MasterDataRecord, SourceStatus, Actor, ProcessStep } from './master-data'
export { lifecycle } from './lifecycle'
export type { LifecycleNode } from './lifecycle'
export { sopCatalog, sopLookup } from './sop'
export type { SopRecord, SopGroup } from './sop'
export { relationships } from './relationships'
export type { Relationship, RelationshipType } from './relationships'

export const crossFunctional = [
  {
    id: 'CF-01',
    title: 'Công & phép',
    subtitle: 'Chấm công, nghỉ và ca làm việc',
    inputs: ['Thông tin ca làm việc', 'Đơn nghỉ phép', 'Dữ liệu chấm công'],
    outputs: ['Thời gian làm việc', 'Số phép, quỹ phép, tần suất có mặt'],
    actors: [
      { name: 'Nhân viên', role: 'Người lao động', action: 'Đăng ký ca và nghỉ phép' },
      { name: 'HR Admin', role: 'Quản lý', action: 'Kiểm tra và xử lý dữ liệu' },
    ],
    rules: ['Dữ liệu thích hợp với quy định ca và nghỉ', 'Không chồng lấn giờ làm việc'],
    usedBy: ['Quá trình làm việc'],
    sopIds: ['Quản lý lịch đi ca (có portal)', 'Quản lý nghỉ phép (có portal)', 'Xử lý dữ liệu chấm công'],
    process: {
      status: 'official',
      steps: ['Nhân viên đăng ký ca/đơn nghỉ', 'Hệ thống kiểm tra dữ liệu', 'Manager/HR duyệt', 'Cập nhật thời gian làm việc'],
      source: 'Quy trình thực tế chấm công và nghỉ phép',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-02',
    title: 'Hợp đồng',
    subtitle: 'Điều chỉnh quan hệ lao động',
    inputs: ['Hợp đồng hiện hành', 'Yêu cầu tái ký / bổ sung / điều chỉnh'],
    outputs: ['Hợp đồng mới', 'Phụ lục / quyết định thay đổi'],
    actors: [
      { name: 'HR', role: 'Quản lý hợp đồng', action: 'Xử lý cập nhật và phê duyệt' },
      { name: 'Nhân viên', role: 'Đối tác', action: 'Xem và ký hợp đồng / phụ lục' },
    ],
    rules: ['Hợp đồng mới phải đúng thời hạn hiệu lực', 'Điều chỉnh hợp đồng phải được duyệt bởi người có thẩm quyền'],
    usedBy: ['Thiết lập hợp đồng'],
    sopIds: ['Ký hợp đồng với nhân viên mới', 'Phụ lục hợp đồng', 'Tái ký hợp đồng lao động'],
    process: {
      status: 'official',
      steps: ['Phát hiện yêu cầu', 'Kiểm tra hợp đồng', 'Cập nhật điều kiện', 'Lưu và ký'],
      source: 'Quy trình thay đổi hợp đồng',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-03',
    title: 'Biến động nhân sự',
    subtitle: 'Thay đổi thông tin công tác',
    inputs: ['Yêu cầu thay đổi', 'Thông tin nhân sự hiện có'],
    outputs: ['Biến động nhân sự', 'Lịch sử thay đổi tổ chức'],
    actors: [
      { name: 'HR Admin', role: 'Quản lý nhân sự', action: 'Thực hiện biến động' },
      { name: 'Quản lý', role: 'Phê duyệt', action: 'Duyệt yêu cầu' },
    ],
    rules: ['Thay đổi phải phù hợp với quy định tổ chức', 'Không tạo xung đột đơn vị/chức danh'],
    usedBy: ['Bố trí công tác'],
    sopIds: ['Điều động/điều chuyển', 'Bổ nhiệm', 'Miễn nhiệm'],
    process: {
      status: 'draft',
      steps: ['Nhận yêu cầu', 'Kiểm tra dữ liệu', 'Duyệt thay đổi', 'Cập nhật quan hệ công tác'],
      source: 'Dự thảo quy trình biến động nhân sự',
    },
    sourceStatus: 'draft',
  },
  {
    id: 'CF-04',
    title: 'Khen thưởng',
    subtitle: 'Theo dõi thành tích',
    inputs: ['Kết quả làm việc', 'Quy định khen thưởng'],
    outputs: ['Lệnh khen thưởng', 'Lịch sử thành tích'],
    actors: [{ name: 'Quản lý', role: 'Đánh giá', action: 'Đề xuất khen thưởng' }],
    rules: ['Khen thưởng phải dựa trên kết quả thực tế được xác minh'],
    usedBy: ['Quá trình làm việc'],
    sopIds: ['Khen thưởng'],
    process: {
      status: 'official',
      steps: ['Thu thập kết quả', 'Xác minh thành tích', 'Duyệt quyết định', 'Lưu lịch sử'],
      source: 'Quy trình thực tế khen thưởng',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-05',
    title: 'Kỷ luật',
    subtitle: 'Xử lý vi phạm',
    inputs: ['Hành vi vi phạm', 'Dữ liệu bằng chứng', 'Danh mục kỷ luật'],
    outputs: ['Quyết định kỷ luật', 'Lịch sử vi phạm'],
    actors: [{ name: 'HR', role: 'Hồ sơ', action: 'Xử lý và lưu hồ sơ' }],
    rules: ['Mức xử lý phải phù hợp với mức độ vi phạm', 'Bằng chứng phải được xác minh'],
    usedBy: ['Quá trình làm việc'],
    sopIds: ['Kỷ luật'],
    process: {
      status: 'official',
      steps: ['Thu thập bằng chứng', 'Phân loại vi phạm', 'Duyệt quyết định', 'Lưu lịch sử'],
      source: 'Quy trình kỷ luật',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-06',
    title: 'Đào tạo',
    subtitle: 'Kế hoạch và hiệu quả đào tạo',
    inputs: ['Nhu cầu đào tạo', 'Tiêu chuẩn chức danh', 'Kế hoạch đào tạo'],
    outputs: ['Kế hoạch đào tạo', 'Kết quả đánh giá sau đào tạo'],
    actors: [{ name: 'Bộ phận đào tạo', role: 'Quản lý', action: 'Lập kế hoạch và theo dõi hiệu quả' }],
    rules: ['Đào tạo phải phục vụ nhu cầu chức danh và kỹ năng'],
    usedBy: ['Phát triển nhân viên'],
    sopIds: ['Quản lý kế hoạch đào tao của Công ty', 'Quản lý nhu cầu đào tạo của nhân viên', 'Quản lý đánh giá hiệu quả sau đào tạo'],
    process: {
      status: 'official',
      steps: ['Xác định nhu cầu', 'Lập kế hoạch', 'Tiến hành đào tạo', 'Đánh giá hiệu quả'],
      source: 'Quy trình đào tạo và đánh giá hiệu quả',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-07',
    title: 'Đánh giá',
    subtitle: 'KPI, thử việc và đa chiều',
    inputs: ['KPI và tiêu chí', 'Kết quả làm việc', 'Đánh giá 360'],
    outputs: ['Đánh giá thành tích', 'Kết luận bổ nhiệm / tái ký / thử việc'],
    actors: [{ name: 'Quản lý', role: 'Đánh giá', action: 'Đánh giá thành tích và KPI' }],
    rules: ['Đánh giá phải dựa trên tiêu chuẩn được quy định'],
    usedBy: ['Quá trình làm việc'],
    sopIds: ['Quy trình đánh giá thành tích', 'Quy trình đánh giá 360', 'Quy trình đánh giá thử việc'],
    process: {
      status: 'official',
      steps: ['Định nghĩa tiêu chí', 'Thu thập dữ liệu', 'Đánh giá', 'Lưu kết quả'],
      source: 'Quy trình đánh giá nhân sự',
    },
    sourceStatus: 'official',
  },
  {
    id: 'CF-08',
    title: 'Phát triển nhân viên',
    subtitle: 'Nghề nghiệp và kế cận',
    inputs: ['Kế hoạch phát triển', 'Năng lực hiện tại', 'Đội ngũ kế cận'],
    outputs: ['Lộ trình phát triển', 'Danh sách kế cận'],
    actors: [{ name: 'Quản lý', role: 'Phát triển', action: 'Quy hoạch và theo dõi đội ngũ' }],
    rules: ['Phát triển phải phù hợp với vị trí và năng lực của nhân viên'],
    usedBy: ['Đào tạo'],
    sopIds: ['Quy trình phát triển nghề nghiệp', 'Quy trình quản lý đội ngũ kế cận'],
    process: {
      status: 'official',
      steps: ['Đánh giá năng lực', 'Lập lộ trình', 'Thực hiện phát triển', 'Theo dõi tiến độ'],
      source: 'Quy trình phát triển nghề nghiệp',
    },
    sourceStatus: 'official',
  },
] as const

export const sharedServices = [
  { id: 'SV-01', title: 'Phân quyền', subtitle: 'Kiểm soát quyền truy cập', sourceStatus: 'official' },
  { id: 'SV-02', title: 'Phê duyệt', subtitle: 'Xác nhận nghiệp vụ', sourceStatus: 'official' },
  { id: 'SV-03', title: 'Notification', subtitle: 'Thông báo điều hành', sourceStatus: 'official' },
  { id: 'SV-04', title: 'Import / Export', subtitle: 'Tải lên / xuất dữ liệu', sourceStatus: 'official' },
  { id: 'SV-05', title: 'Audit log', subtitle: 'Nhật ký hệ thống', sourceStatus: 'official' },
  { id: 'SV-06', title: 'BI', subtitle: 'Phân tích và báo cáo', sourceStatus: 'official' },
  { id: 'SV-07', title: 'Báo cáo', subtitle: 'Xuất báo cáo theo yêu cầu', sourceStatus: 'official' },
  { id: 'SV-08', title: 'Ngân sách', subtitle: 'Quy trình chi tiêu nhân sự', sourceStatus: 'official' },
]
