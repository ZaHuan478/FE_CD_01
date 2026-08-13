import type { Actor, ProcessStep, SourceStatus } from './master-data'

export type LifecycleNode = {
  id: string
  title: string
  subtitle: string
  inputs: string[]
  outputs: string[]
  actors: Actor[]
  masterDataIds: string[]
  sopIds: string[]
  process: ProcessStep
  sourceStatus: SourceStatus
  uiFields: string[]
}

export const lifecycle: LifecycleNode[] = [
  {
    id: 'LIFE-01',
    title: 'Tiếp nhận nhân viên mới',
    subtitle: 'Khởi tạo hành trình',
    inputs: ['Thông tin ứng viên / nhân viên mới', 'Nguồn tuyển dụng hoặc đề xuất tiếp nhận'],
    outputs: ['Bản ghi tiếp nhận', 'Thông tin chuyển sang tạo hồ sơ'],
    actors: [{ name: 'HR/Admin', role: 'Tiếp nhận', action: 'Thu thập và kiểm tra thông tin' }],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: ['Tiếp nhận nhân viên mới'],
    process: {
      status: 'official',
      steps: ['Nhận thông tin ứng viên', 'Kiểm tra dữ liệu ban đầu', 'Khởi tạo bản ghi', 'Chuyển sang tạo hồ sơ'],
      source: 'Quy trình tiếp nhận nhân viên mới',
    },
    sourceStatus: 'official',
    uiFields: ['Họ tên', 'Nguồn tuyển dụng', 'Vị trí', 'Ngày bắt đầu'],
  },
  {
    id: 'LIFE-02',
    title: 'Tạo hồ sơ nhân viên',
    subtitle: 'Thiết lập hồ sơ',
    inputs: ['Thông tin tiếp nhận', 'Thông tin cá nhân và giấy tờ'],
    outputs: ['Hồ sơ nhân viên'],
    actors: [{ name: 'HR Admin', role: 'Quản lý hồ sơ', action: 'Nhập và duy trì hồ sơ' }],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: ['Quản lý thông tin nhân viên'],
    process: {
      status: 'official',
      steps: ['Kiểm tra thông tin', 'Nhập hồ sơ', 'Xác nhận dữ liệu', 'Lưu hồ sơ'],
      source: 'Quy trình quản lý hồ sơ nhân sự',
    },
    sourceStatus: 'official',
    uiFields: ['Họ tên', 'Ngày sinh', 'CCCD', 'Địa chỉ'],
  },
  {
    id: 'LIFE-03',
    title: 'Bố trí công tác',
    subtitle: 'Đơn vị và chức danh',
    inputs: ['Nhân viên', 'Đơn vị / phòng ban', 'Chức vụ / chức danh'],
    outputs: ['Vị trí công tác', 'Đơn vị công tác'],
    actors: [
      { name: 'HR Admin', role: 'Phân công', action: 'Gán nhân viên vào vị trí' },
      { name: 'Quản lý đơn vị', role: 'Xác nhận', action: 'Duyệt vị trí công tác' },
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: ['Điều động/điều chuyển', 'Bổ nhiệm'],
    process: {
      status: 'official',
      steps: ['Chọn nhân viên', 'Chọn đơn vị', 'Chọn chức vụ', 'Kiểm tra dữ liệu', 'Lưu bố trí'],
      source: 'Quy trình bố trí công tác',
    },
    sourceStatus: 'official',
    uiFields: ['Nhân viên', 'Đơn vị', 'Chức danh', 'Hiệu lực'],
  },
  {
    id: 'LIFE-04',
    title: 'Thiết lập hợp đồng',
    subtitle: 'Quan hệ lao động',
    inputs: ['Hồ sơ nhân viên', 'Thông tin bố trí công tác'],
    outputs: ['Thông tin hợp đồng', 'Hợp đồng lao động'],
    actors: [{ name: 'HR Admin', role: 'Hợp đồng', action: 'Lập và quản lý hợp đồng' }],
    masterDataIds: ['MD-05', 'MD-06', 'MD-07'],
    sopIds: ['Ký hợp đồng với nhân viên mới', 'Phụ lục hợp đồng', 'Tái ký hợp đồng lao động'],
    process: {
      status: 'official',
      steps: ['Tạo hồ sơ hợp đồng', 'Xác thực dữ liệu', 'Phê duyệt', 'Lưu hợp đồng'],
      source: 'Quy trình ký kết hợp đồng nhân sự',
    },
    sourceStatus: 'official',
    uiFields: ['Loại hợp đồng', 'Ngày hiệu lực', 'Mức lương', 'Chức danh'],
  },
  {
    id: 'LIFE-05',
    title: 'Lương & chế độ',
    subtitle: 'Cấu hình quyền lợi',
    inputs: ['Hồ sơ nhân viên', 'Thông tin hợp đồng', 'Thang/bậc lương'],
    outputs: ['Cấu hình lương', 'Chế độ bảo hiểm'],
    actors: [{ name: 'C&B/HR Admin', role: 'Lương', action: 'Thiết lập và cập nhật lương' }],
    masterDataIds: ['MD-07', 'MD-09'],
    sopIds: ['Quản lý thang bảng lương', 'Quản lý chính sách thu nhập theo đối tượng', 'Quản lý hồ sơ bảo hiểm'],
    process: {
      status: 'official',
      steps: ['Xác định chính sách', 'Gán thang lương', 'Cấu hình bảo hiểm', 'Lưu quyền lợi'],
      source: 'Quy trình lương và chế độ',
    },
    sourceStatus: 'official',
    uiFields: ['Mức lương', 'Phụ cấp', 'Bảo hiểm', 'Hiệu lực'],
  },
  {
    id: 'LIFE-06',
    title: 'Quá trình làm việc',
    subtitle: 'Quản lý xuyên suốt',
    inputs: ['Hồ sơ đang hiệu lực', 'Nghiệp vụ phát sinh', 'Ca và nghỉ phép'],
    outputs: ['Lịch sử quá trình làm việc', 'Cập nhật chấm công / phép / kỷ luật'],
    actors: [
      { name: 'HR Admin', role: 'Theo dõi', action: 'Ghi nhận và kiểm tra phát sinh' },
      { name: 'Quản lý', role: 'Phê duyệt', action: 'Xác nhận nghiệp vụ' },
    ],
    masterDataIds: ['MD-08', 'MD-10'],
    sopIds: ['Quản lý nghỉ phép (có portal)', 'Quản lý lịch đi ca (có portal)', 'Kỷ luật'],
    process: {
      status: 'draft',
      steps: ['Thu thập phát sinh', 'Kiểm tra dữ liệu', 'Cập nhật lịch sử', 'Kết thúc hiệu lực nếu cần'],
      source: 'Dự thảo quy trình thực tế cho giai đoạn làm việc',
    },
    sourceStatus: 'draft',
    uiFields: ['Ngày', 'Loại phát sinh', 'Trạng thái', 'Người xử lý'],
  },
  {
    id: 'LIFE-07',
    title: 'Nghỉ việc & đóng hồ sơ',
    subtitle: 'Kết thúc lifecycle',
    inputs: ['Đề nghị nghỉ việc', 'Hồ sơ hiện hành'],
    outputs: ['Trạng thái nghỉ việc', 'Hồ sơ đã đóng'],
    actors: [{ name: 'HR Admin', role: 'Thanh lý', action: 'Xử lý và đóng hồ sơ' }],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: ['Giảm lao động', 'Quyết toán phép (nhân viên nghỉ việc)'],
    process: {
      status: 'official',
      steps: ['Nhận đề nghị', 'Xác nhận ngày nghỉ', 'Bàn giao', 'Đóng hồ sơ'],
      source: 'Quy trình nghỉ việc và thanh lý hồ sơ',
    },
    sourceStatus: 'official',
    uiFields: ['Ngày nghỉ', 'Nguyên nhân', 'Hồ sơ bàn giao', 'Trạng thái'],
  },
]
