export type SourceStatus = 'official' | 'designed' | 'draft' | 'placeholder'

export type Actor = {
  name: string
  role: string
  action: string
}

export type ProcessStep = {
  status: SourceStatus
  steps: string[]
  source: string
}

export type MasterDataRecord = {
  id: string
  title: string
  inputs: string[]
  outputs: string[]
  actors: Actor[]
  rules: string[]
  usedBy: string[]
  sopIds: string[]
  process: ProcessStep
  sourceStatus: SourceStatus
}

export const masterData: MasterDataRecord[] = [
  {
    id: 'MD-01',
    title: 'Thêm mới giá trị danh mục',
    inputs: ['Loại danh mục', 'Mã giá trị', 'Tên giá trị', 'Mô tả'],
    outputs: ['Giá trị danh mục mới', 'Dropdown / mapping cập nhật'],
    actors: [
      { name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Tạo mới danh mục' },
      { name: 'HR Admin', role: 'Người vận hành', action: 'Xác nhận sử dụng' },
    ],
    rules: ['Mã giá trị phải duy nhất', 'Từng loại danh mục chỉ được lưu đúng định nghĩa nghiệp vụ'],
    usedBy: ['Tiếp nhận nhân viên mới', 'Bố trí công tác'],
    sopIds: ['Thiết lập và quản lý đối tượng tính thuế và mức thuế TNCN'],
    process: {
      status: 'official',
      steps: ['Nhập thông tin danh mục', 'Kiểm tra tính duy nhất', 'Lưu bản ghi', 'Cập nhật dropdown'],
      source: 'Quy trình quản trị dữ liệu hiện có',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-02',
    title: 'Cập nhật giá trị danh mục',
    inputs: ['Bản ghi danh mục hiện có', 'Giá trị mới', 'Trạng thái và mô tả'],
    outputs: ['Dữ liệu danh mục đã cập nhật'],
    actors: [{ name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Hiệu chỉnh danh mục' }],
    rules: ['Không xóa dữ liệu đang được dùng làm tham chiếu', 'Mỗi thay đổi phải theo quyền quản trị'],
    usedBy: ['Tiếp nhận nhân viên mới', 'Quá trình làm việc'],
    sopIds: ['Quản lý thông tin nhân viên', 'Điều chỉnh thu nhập'],
    process: {
      status: 'official',
      steps: ['Chọn bản ghi', 'Sửa thông tin', 'Kiểm tra ràng buộc', 'Lưu thay đổi'],
      source: 'Quy trình cập nhật dữ liệu master',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-03',
    title: 'Khóa/kích hoạt danh mục',
    inputs: ['Bản ghi danh mục', 'Trạng thái mới', 'Lý do thay đổi'],
    outputs: ['Trạng thái danh mục được cập nhật'],
    actors: [{ name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Khóa hoặc kích hoạt lại bản ghi' }],
    rules: ['Không xóa bản ghi đang có hiệu lực', 'Danh mục khóa không còn được chọn trong quy trình đang dùng'],
    usedBy: ['Quá trình làm việc', 'Lương & chế độ'],
    sopIds: ['Quản lý thông tin nhân viên'],
    process: {
      status: 'draft',
      steps: ['Chọn bản ghi', 'Xác định trạng thái mới', 'Kiểm tra ràng buộc', 'Lưu thay đổi'],
      source: 'Dự thảo quy trình quản lý trạng thái danh mục',
    },
    sourceStatus: 'draft',
  },
  {
    id: 'MD-04',
    title: 'Quản lý đơn vị hành chính',
    inputs: ['Cấp đơn vị', 'Mã đơn vị', 'Tên đơn vị', 'Đơn vị cha'],
    outputs: ['Cây đơn vị hành chính'],
    actors: [{ name: 'Quản trị viên', role: 'Quản trị trực tiếp', action: 'Quản lý hiệp định đơn vị' }],
    rules: ['Không vòng lặp', 'Mã đơn vị duy nhất'],
    usedBy: ['Tiếp nhận nhân viên mới', 'Bố trí công tác', 'Nghỉ việc & đóng hồ sơ'],
    sopIds: ['Điều động/điều chuyển', 'Bổ nhiệm', 'Miễn nhiệm'],
    process: {
      status: 'designed',
      steps: ['Nhập đơn vị', 'Xác định cấp', 'Thiết lập cha-con', 'Lưu cấu trúc'],
      source: 'Quy trình quản lý đơn vị hành chính',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-05',
    title: 'Quản lý cơ cấu tổ chức',
    inputs: ['Mã đơn vị', 'Tên đơn vị', 'Loại đơn vị', 'Đơn vị cha', 'Người quản lý'],
    outputs: ['Cây tổ chức', 'Nguồn chọn vị trí', 'Đơn vị công tác chính thức'],
    actors: [
      { name: 'HR Admin', role: 'Quản lý tổ chức', action: 'Thiết lập và duy trì cấu trúc tổ chức' },
      { name: 'Quản lý đơn vị', role: 'Phê duyệt', action: 'Xác nhận vị trí và bộ máy' },
    ],
    rules: ['Không vòng lặp', 'Mã duy nhất', 'Đơn vị cha phải tồn tại và hoạt động'],
    usedBy: ['Tiếp nhận nhân viên mới', 'Bố trí công tác', 'Thiết lập hợp đồng', 'Nghỉ việc & đóng hồ sơ'],
    sopIds: ['Điều động/điều chuyển', 'Bổ nhiệm', 'Miễn nhiệm'],
    process: {
      status: 'official',
      steps: ['Nhập đơn vị', 'Kiểm tra cấu trúc', 'Xác minh đơn vị cha', 'Lưu cây tổ chức'],
      source: 'Quy trình thực tế quản lý cơ cấu tổ chức',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-06',
    title: 'Quản lý chức vụ/chức danh',
    inputs: ['Mã chức danh', 'Tên chức danh', 'Level', 'Cấp bậc', 'Hiệu lực'],
    outputs: ['Danh mục chức danh', 'Danh sách vị trí được gán'],
    actors: [{ name: 'HR Admin', role: 'Quản lý nhân sự', action: 'Thiết lập chức danh và vị trí' }],
    rules: ['Mã chức danh duy nhất', 'Level/Cấp bậc phải có trong danh mục', 'Không tạo chức danh mâu thuẫn với cơ cấu'],
    usedBy: ['Tiếp nhận nhân viên mới', 'Bố trí công tác', 'Thiết lập hợp đồng'],
    sopIds: ['Bổ nhiệm', 'Kiêm nhiệm', 'Miễn nhiệm'],
    process: {
      status: 'official',
      steps: ['Nhập chức danh', 'Xác định level', 'Kiểm tra hiệu lực', 'Lưu danh mục'],
      source: 'Quy trình quản lý chức danh',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-07',
    title: 'Thiết lập thang/bậc lương',
    inputs: ['Thang lương', 'Bậc lương', 'Mức lương', 'Hiệu lực', 'Loại lương'],
    outputs: ['Thang/bậc lương', 'Cấu hình lương áp dụng cho nhân viên'],
    actors: [
      { name: 'C&B', role: 'Chính sách lương', action: 'Thiết lập thang lương' },
      { name: 'HR Admin', role: 'Duyệt', action: 'Xác nhận áp dụng cho nhân sự' },
    ],
    rules: ['Mức lương không âm', 'Bậc thuộc thang', 'Không chồng lấn hiệu lực trong cùng điều kiện'],
    usedBy: ['Lương & chế độ', 'Điều chỉnh thu nhập'],
    sopIds: ['Quản lý thang bảng lương', 'Quản lý chính sách thu nhập theo đối tượng'],
    process: {
      status: 'official',
      steps: ['Xác định thang lương', 'Nhập bậc và mức', 'Kiểm tra hiệu lực', 'Lưu cấu hình'],
      source: 'Quy trình quản lý chính sách lương',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-08',
    title: 'Thiết lập ca và loại nghỉ',
    inputs: ['Ca làm việc', 'Giờ bắt đầu/kết thúc', 'Loại nghỉ', 'Chu kỳ', 'Hiệu lực'],
    outputs: ['Cấu hình ca', 'Cấu hình nghỉ', 'Quy định chấm công'],
    actors: [{ name: 'Chuyên viên chấm công', role: 'Thời gian làm việc', action: 'Thiết lập ca và phép' }],
    rules: ['Thời gian ca hợp lệ', 'Mỗi ca phải có mã đại diện duy nhất', 'Nghỉ phép phải thuộc danh mục cho phép'],
    usedBy: ['Quá trình làm việc', 'Công & phép'],
    sopIds: ['Quản lý lịch đi ca (có portal)', 'Quản lý nghỉ phép (có portal)'],
    process: {
      status: 'official',
      steps: ['Thiết lập ca', 'Thiết lập nghỉ phép', 'Kiểm tra hiệu lực', 'Lưu cấu hình'],
      source: 'Quy trình chấm công và nghỉ phép',
    },
    sourceStatus: 'official',
  },
  {
    id: 'MD-09',
    title: 'Quản lý bảo hiểm/y tế',
    inputs: ['Đối tượng tham gia', 'Chế độ bảo hiểm', 'Mức đóng', 'Nơi KCB'],
    outputs: ['Danh mục bảo hiểm', 'Chế độ hưởng bảo hiểm'],
    actors: [{ name: 'Chuyên viên bảo hiểm', role: 'Bảo hiểm', action: 'Thiết lập và duy trì danh mục' }],
    rules: ['Đối tượng phải hợp lệ', 'Mức đóng phải nằm trong biểu phí hợp lệ', 'Chế độ chỉ áp dụng cho nhóm được phép'],
    usedBy: ['Lương & chế độ', 'Quá trình làm việc'],
    sopIds: ['Thiết lập và quản lý đối tượng/tỷ lệ và mức tham gia bảo hiểm', 'Quản lý chế độ trợ cấp bảo hiểm (ốm đau/thai sản)'],
    process: {
      status: 'draft',
      steps: ['Xác định đối tượng', 'Thiết lập tỷ lệ', 'Lưu mức đóng', 'Cập nhật hiệu lực'],
      source: 'Dự thảo quy trình bảo hiểm và y tế',
    },
    sourceStatus: 'draft',
  },
  {
    id: 'MD-10',
    title: 'Quản lý kỷ luật',
    inputs: ['Hành vi vi phạm', 'Loại vi phạm', 'Hình thức xử lý', 'Mô tả'],
    outputs: ['Danh mục kỷ luật', 'Lịch sử xử lý'],
    actors: [{ name: 'HR Admin', role: 'Chính sách nội bộ', action: 'Thiết lập quy định kỷ luật' }],
    rules: ['Hành vi cần được phân loại đúng', 'Hình thức kỷ luật phải phù hợp với mức độ vi phạm'],
    usedBy: ['Quá trình làm việc', 'Kỷ luật'],
    sopIds: ['Kỷ luật', 'Khen thưởng'],
    process: {
      status: 'official',
      steps: ['Nhập vi phạm', 'Chọn hành vi', 'Xác định hình thức xử lý', 'Lưu danh mục'],
      source: 'Quy trình kỷ luật và khen thưởng nội bộ',
    },
    sourceStatus: 'official',
  },
]
