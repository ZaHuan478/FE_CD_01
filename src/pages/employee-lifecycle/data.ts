export type SourceStatus = 'official' | 'designed' | 'draft' | 'not_available' | 'placeholder'
export type ProcessStatus = 'official' | 'designed' | 'draft' | 'not_available'

export type BusinessField = {
  name: string
  source: string
  sourceType?: 'master' | 'sop' | 'system' | 'manual'
}

export type Actor = {
  name: string
  role: string
  action: string
}

export type BusinessNode = {
  id: string
  type: 'master' | 'lifecycle' | 'cross' | 'support'
  code: string
  title: string
  subtitle: string
  overview: {
    purpose: string
    description: string
    status: SourceStatus
    phase?: string
  }
  inputs: BusinessField[]
  outputs: BusinessField[]
  actors: Actor[]
  masterDataIds: string[]
  sopIds: string[]
  process: {
    status: ProcessStatus
    steps: string[]
    source: string
  }
  wireframe: {
    title: string
    fields: string[]
    actions: string[]
  }
  source: {
    note: string
    status: SourceStatus
  }
}

export type RelationshipType = 'used-by' | 'uses' | 'related-to' | 'produces' | 'feeds' | 'supports'

export type Relationship = {
  source: string
  target: string
  type: RelationshipType
}

export type SopRecord = {
  id: string
  title: string
  lifecycleIds: string[]
  masterDataIds: string[]
  crossFunctionalIds: string[]
  source: {
    file: string
    sheet?: string
    row?: string
  }
  status: SourceStatus
}

export const masterData: BusinessNode[] = [
  {
    id: 'MD-01',
    type: 'master',
    code: 'MD-01',
    title: 'Thêm mới giá trị danh mục',
    subtitle: 'Tạo dữ liệu danh mục mới',
    overview: {
      purpose: 'Lưu trữ và cấp phép giá trị danh mục mới cho các nghiệp vụ quản trị dữ liệu.',
      description: 'Dùng để tạo bản ghi danh mục chính thức phục vụ cho các dropdown, mapping và tham chiếu nghiệp vụ.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Loại danh mục', source: 'Quản trị dữ liệu', sourceType: 'master' },
      { name: 'Mã giá trị', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Tên giá trị', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Mô tả', source: 'Người quản trị', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Giá trị danh mục mới', source: 'Hệ thống quản trị dữ liệu', sourceType: 'system' },
      { name: 'Dropdown / mapping cập nhật', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Tạo mới danh mục' },
      { name: 'HR Admin', role: 'Người vận hành', action: 'Xác nhận sử dụng' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'official',
      steps: ['Nhập thông tin danh mục', 'Kiểm tra tính duy nhất', 'Lưu bản ghi', 'Cập nhật dropdown'],
      source: 'Quy trình được xác định từ mô hình quản trị dữ liệu hiện có.'
    },
    wireframe: {
      title: 'Quản lý danh mục',
      fields: ['Loại danh mục', 'Mã', 'Tên', 'Trạng thái', 'Mô tả'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Nguồn dữ liệu sơ bộ từ quy trình quản trị danh mục hiện có.',
      status: 'official'
    }
  },
  {
    id: 'MD-02',
    type: 'master',
    code: 'MD-02',
    title: 'Cập nhật giá trị danh mục',
    subtitle: 'Sửa dữ liệu danh mục hiện có',
    overview: {
      purpose: 'Cập nhật giá trị danh mục để phản ánh thay đổi nghiệp vụ hoặc cấu hình mới.',
      description: 'Dùng khi cần bổ sung, điều chỉnh hay sửa tên, trạng thái hoặc thứ tự của danh mục.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Bản ghi danh mục', source: 'Dữ liệu hiện có', sourceType: 'master' },
      { name: 'Giá trị mới', source: 'Người quản trị', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Dữ liệu danh mục đã cập nhật', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Cập nhật giá trị' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'official',
      steps: ['Chọn bản ghi', 'Sửa thông tin', 'Kiểm tra ràng buộc', 'Lưu thay đổi'],
      source: 'Quy trình cập nhật dữ liệu danh mục.'
    },
    wireframe: {
      title: 'Cập nhật danh mục',
      fields: ['Mã', 'Tên', 'Trạng thái', 'Mô tả'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Nguồn dữ liệu hiện có; chưa có mapping SOP rõ ràng.',
      status: 'official'
    }
  },
  {
    id: 'MD-03',
    type: 'master',
    code: 'MD-03',
    title: 'Khóa/kích hoạt danh mục',
    subtitle: 'Thay đổi trạng thái dữ liệu danh mục',
    overview: {
      purpose: 'Khóa hoặc kích hoạt lại giá trị danh mục khi cần ngừng hoặc cho phép sử dụng.',
      description: 'Không xóa vật lý bản ghi đang được dùng để tránh làm sai dữ liệu lịch sử.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Bản ghi danh mục', source: 'Dữ liệu hiện có', sourceType: 'master' },
      { name: 'Trạng thái mới', source: 'Quản trị viên', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Trạng thái đã cập nhật', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Khóa/kích hoạt bản ghi' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'not_available',
      steps: [],
      source: 'Chưa có quy trình thực tế được xác nhận.'
    },
    wireframe: {
      title: 'Khóa/kích hoạt danh mục',
      fields: ['Mã', 'Tên', 'Trạng thái', 'Lý do'],
      actions: ['Hủy', 'Xác nhận']
    },
    source: {
      note: 'Chưa có nguồn mô tả chi tiết.',
      status: 'placeholder'
    }
  },
  {
    id: 'MD-04',
    type: 'master',
    code: 'MD-04',
    title: 'Quản lý đơn vị hành chính',
    subtitle: 'Quản trị địa giới hành chính',
    overview: {
      purpose: 'Quản lý đơn vị hành chính, cấp bậc và mối quan hệ cha-con để phục vụ cơ cấu tổ chức và địa lý.',
      description: 'Cho phép tổ chức quản lý đơn vị hành chính theo hệ thống phân cấp.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Cấp đơn vị', source: 'Quản trị viên', sourceType: 'manual' },
      { name: 'Mã đơn vị', source: 'Quản trị viên', sourceType: 'manual' },
      { name: 'Tên đơn vị', source: 'Quản trị viên', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Cây đơn vị hành chính', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Quản trị viên', role: 'Quản trị địa lý', action: 'Cập nhật cấp đơn vị' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'not_available',
      steps: [],
      source: 'Chưa có quy trình thực tế được xác nhận.'
    },
    wireframe: {
      title: 'Đơn vị hành chính',
      fields: ['Cấp', 'Mã', 'Tên', 'Đơn vị cha'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Chưa có dữ liệu nguồn đầy đủ trong spec hiện hành.',
      status: 'placeholder'
    }
  },
  {
    id: 'MD-05',
    type: 'master',
    code: 'MD-05',
    title: 'Quản lý cơ cấu tổ chức',
    subtitle: 'Đơn vị, vị trí và chức danh',
    overview: {
      purpose: 'Quản lý cấu trúc tổ chức làm nguồn dữ liệu cho bố trí công tác, tuyển dụng và quản lý nhân sự.',
      description: 'Cơ cấu tổ chức là dữ liệu nền tảng cho việc gán nhân viên vào phòng ban, vị trí và chức danh.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Mã đơn vị', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Tên đơn vị', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Loại đơn vị', source: 'Danh mục', sourceType: 'master' },
      { name: 'Đơn vị cha', source: 'Cơ cấu tổ chức', sourceType: 'master' },
      { name: 'Người quản lý', source: 'Cơ cấu tổ chức', sourceType: 'master' }
    ],
    outputs: [
      { name: 'Cây tổ chức', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Nguồn chọn vị trí', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Quản lý tổ chức', action: 'Thiết lập và duy trì cấu trúc tổ chức' },
      { name: 'Quản trị viên', role: 'Quản trị dữ liệu', action: 'Kiểm tra ràng buộc và tính hợp lệ' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Nhập đơn vị', 'Kiểm tra cấu trúc', 'Xác minh đơn vị cha', 'Lưu cây tổ chức'],
      source: 'Sơ đồ nghiệp vụ và quy trình được thiết kế cho quản lý cơ cấu tổ chức.'
    },
    wireframe: {
      title: 'Cấu trúc tổ chức',
      fields: ['Mã', 'Tên', 'Loại đơn vị', 'Đơn vị cha', 'Người quản lý'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Dữ liệu nguồn được xác định từ mô hình hiện có và quy trình tổ chức của hệ thống.',
      status: 'official'
    }
  },
  {
    id: 'MD-06',
    type: 'master',
    code: 'MD-06',
    title: 'Quản lý chức vụ/chức danh',
    subtitle: 'Danh mục vị trí công tác',
    overview: {
      purpose: 'Quản lý chức vụ, chức danh và cấp bậc để gán cho nhân viên trong cơ cấu tổ chức.',
      description: 'Cung cấp danh mục chức danh, cấp bậc và cấu hình vị trí công tác.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Mã chức danh', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Tên chức danh', source: 'Người quản trị', sourceType: 'manual' },
      { name: 'Level', source: 'Danh mục', sourceType: 'master' }
    ],
    outputs: [
      { name: 'Danh mục chức danh', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Quản lý nhân sự', action: 'Thiết lập chức danh' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Nhập chức danh', 'Xác định level', 'Kiểm tra định nghĩa', 'Lưu danh mục'],
      source: 'Thiết kế nghiệp vụ quản lý chức danh.'
    },
    wireframe: {
      title: 'Chức vụ / chức danh',
      fields: ['Mã', 'Tên', 'Level', 'Phụ trách', 'Trạng thái'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Nguồn dữ liệu xác định từ nghiệp vụ nhân sự và cơ cấu tổ chức.',
      status: 'official'
    }
  },
  {
    id: 'MD-07',
    type: 'master',
    code: 'MD-07',
    title: 'Thiết lập thang/bậc lương',
    subtitle: 'Cấu hình mức lương',
    overview: {
      purpose: 'Định nghĩa thang lương, bậc lương và mức lương phục vụ tính lương nhân viên.',
      description: 'Mức lương được dùng khi áp dụng chính sách thu nhập, hợp đồng và phụ cấp.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Thang lương', source: 'C&B', sourceType: 'manual' },
      { name: 'Bậc lương', source: 'C&B', sourceType: 'manual' },
      { name: 'Mức lương', source: 'C&B', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Thang/bậc lương', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'C&B', role: 'Chính sách lương', action: 'Thiết lập thang/bậc' },
      { name: 'HR Admin', role: 'Quản lý nhân sự', action: 'Duyệt cấu hình áp dụng' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Xác định thang lương', 'Nhập bậc và mức', 'Kiểm tra hiệu lực', 'Lưu cấu hình'],
      source: 'Thiết kế nghiệp vụ lương và thu nhập.'
    },
    wireframe: {
      title: 'Thang/bậc lương',
      fields: ['Thang', 'Bậc', 'Mức', 'Hiệu lực'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Nguồn dữ liệu từ pháp chế lương và cấu hình nhân sự.',
      status: 'official'
    }
  },
  {
    id: 'MD-08',
    type: 'master',
    code: 'MD-08',
    title: 'Thiết lập ca và loại nghỉ',
    subtitle: 'Cấu hình thời gian làm việc',
    overview: {
      purpose: 'Thiết lập ca làm việc, lịch làm việc và loại nghỉ phục vụ quản lý giờ công, phép và chấm công.',
      description: 'Dữ liệu này ảnh hưởng trực tiếp đến công & phép và thời gian làm việc.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Ca làm việc', source: 'Chấm công', sourceType: 'manual' },
      { name: 'Loại nghỉ', source: 'Chấm công', sourceType: 'manual' },
      { name: 'Chu kỳ', source: 'Chấm công', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Cấu hình ca và nghỉ', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Chuyên viên chấm công', role: 'Điều hành thời gian', action: 'Thiết lập ca và phép' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Thiết lập ca', 'Thiết lập nghỉ phép', 'Kiểm tra hiệu lực', 'Lưu cấu hình'],
      source: 'Thiết kế quản lý ca và nghỉ phép.'
    },
    wireframe: {
      title: 'Ca làm việc & phép',
      fields: ['Ca', 'Giờ', 'Loại nghỉ', 'Chu kỳ'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Nguồn dữ liệu dựa trên quy trình chấm công và phép.',
      status: 'official'
    }
  },
  {
    id: 'MD-09',
    type: 'master',
    code: 'MD-09',
    title: 'Quản lý danh mục bảo hiểm/y tế',
    subtitle: 'Cấu hình bảo hiểm hỗ trợ',
    overview: {
      purpose: 'Duy trì danh mục bảo hiểm, đối tượng tham gia và chế độ hỗ trợ y tế.',
      description: 'Được dùng trong nghiệp vụ lương và chế độ cho nhân viên.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Đối tượng', source: 'Bảo hiểm', sourceType: 'manual' },
      { name: 'Chế độ', source: 'Bảo hiểm', sourceType: 'manual' },
      { name: 'Bệnh viện / nơi KCB', source: 'Bảo hiểm', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Danh mục bảo hiểm', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Chuyên viên bảo hiểm', role: 'Bảo hiểm', action: 'Cập nhật danh mục bảo hiểm' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'not_available',
      steps: [],
      source: 'Chưa có quy trình thực tế được xác định.'
    },
    wireframe: {
      title: 'Bảo hiểm / y tế',
      fields: ['Đối tượng', 'Chế độ', 'Nơi KCB', 'Hiệu lực'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Chưa có mapping SOP cụ thể trong nguồn hiện tại.',
      status: 'placeholder'
    }
  },
  {
    id: 'MD-10',
    type: 'master',
    code: 'MD-10',
    title: 'Quản lý danh mục kỷ luật',
    subtitle: 'Cấu hình vi phạm và xử lý kỷ luật',
    overview: {
      purpose: 'Quản lý danh mục hình thức kỷ luật, hành vi và quy định xử lý liên quan.',
      description: 'Dùng cho ghi nhận thành tích, kỷ luật và các phát sinh liên quan đến chính sách nội bộ.',
      status: 'official',
      phase: 'Master Data'
    },
    inputs: [
      { name: 'Hành vi', source: 'HR Admin', sourceType: 'manual' },
      { name: 'Loại vi phạm', source: 'HR Admin', sourceType: 'manual' },
      { name: 'Hình thức xử lý', source: 'HR Admin', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Danh mục kỷ luật', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Chính sách nội bộ', action: 'Thiết lập danh mục kỷ luật' }
    ],
    masterDataIds: [],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Nhập vi phạm', 'Chọn hành vi', 'Xác định hình thức xử lý', 'Lưu danh mục'],
      source: 'Thiết kế nghiệp vụ kỷ luật và thành tích.'
    },
    wireframe: {
      title: 'Kỷ luật',
      fields: ['Hành vi', 'Loại', 'Hình thức', 'Mô tả'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Dữ liệu được xác định từ chính sách nội bộ và quy trình phát sinh trong thời gian làm việc.',
      status: 'official'
    }
  }
]

export const lifecycleProcesses: BusinessNode[] = [
  {
    id: 'LIFE-01',
    type: 'lifecycle',
    code: '01',
    title: 'Tiếp nhận nhân viên mới',
    subtitle: 'Khởi tạo hành trình',
    overview: {
      purpose: 'Tiếp nhận thông tin cơ bản của ứng viên hoặc nhân viên mới để khởi đầu vòng đời nhân viên.',
      description: 'Bước đầu tiên của lifecycle, tạo nền tảng cho hồ sơ, vị trí và điều kiện làm việc.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Thông tin ứng viên/nhân viên mới', source: 'Nguồn tuyển dụng / đề xuất tiếp nhận', sourceType: 'manual' },
      { name: 'Thông tin cơ bản cá nhân', source: 'Hồ sơ ứng viên', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Bản ghi tiếp nhận', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Thông tin chuyển sang tạo hồ sơ', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR/Admin', role: 'Tiếp nhận', action: 'Thu thập và kiểm tra thông tin' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Nhận thông tin ứng viên', 'Kiểm tra dữ liệu ban đầu', 'Khởi tạo bản ghi', 'Chuyển sang tạo hồ sơ'],
      source: 'Quy trình được mô tả trong bản đồ nghiệp vụ hiện có.'
    },
    wireframe: {
      title: 'Tiếp nhận nhân viên mới',
      fields: ['Họ tên', 'Nguồn tuyển dụng', 'Vị trí', 'Ngày bắt đầu'],
      actions: ['Hủy', 'Lưu', 'Tiếp tục']
    },
    source: {
      note: 'Nguồn nghiệp vụ lấy từ sơ đồ hiện có và căn cứ vào SOP tuyển dụng / tiếp nhận.',
      status: 'official'
    }
  },
  {
    id: 'LIFE-02',
    type: 'lifecycle',
    code: '02',
    title: 'Tạo hồ sơ nhân viên',
    subtitle: 'Thiết lập hồ sơ',
    overview: {
      purpose: 'Thiết lập hồ sơ nhân sự đầy đủ để phục vụ các nghiệp vụ tiếp theo.',
      description: 'Xử lý thông tin cá nhân, giấy tờ và dữ liệu bắt buộc cho một nhân viên mới.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Thông tin tiếp nhận', source: 'LIFE-01', sourceType: 'system' },
      { name: 'Thông tin cá nhân', source: 'Người dùng / HR', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Hồ sơ nhân viên', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Quản lý hồ sơ', action: 'Nhập và duy trì hồ sơ' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Kiểm tra thông tin', 'Nhập hồ sơ', 'Xác nhận dữ liệu', 'Lưu hồ sơ'],
      source: 'Sơ đồ nghiệp vụ và quy trình hồ sơ nhân sự.'
    },
    wireframe: {
      title: 'Hồ sơ nhân viên',
      fields: ['Họ tên', 'Ngày sinh', 'CCCD', 'Địa chỉ'],
      actions: ['Hủy', 'Lưu']
    },
    source: {
      note: 'Dữ liệu nguồn dựa trên nghiệp vụ hồ sơ nhân sự.',
      status: 'official'
    }
  },
  {
    id: 'LIFE-03',
    type: 'lifecycle',
    code: '03',
    title: 'Bố trí công tác',
    subtitle: 'Đơn vị và chức danh',
    overview: {
      purpose: 'Gán nhân viên vào đơn vị, vị trí công tác và chức danh phù hợp.',
      description: 'Liên kết nhân viên với cơ cấu tổ chức và định nghĩa vị trí làm việc.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Nhân viên', source: 'LIFE-02', sourceType: 'system' },
      { name: 'Đơn vị / phòng ban', source: 'MD-05', sourceType: 'master' },
      { name: 'Chức vụ / chức danh', source: 'MD-06', sourceType: 'master' }
    ],
    outputs: [
      { name: 'Vị trí công tác', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Đơn vị công tác', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Phân công', action: 'Định vị và gắn nhân viên' },
      { name: 'Quản lý đơn vị', role: 'Xác nhận', action: 'Phê duyệt vị trí' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Chọn nhân viên', 'Chọn đơn vị', 'Chọn chức vụ', 'Kiểm tra dữ liệu', 'Lưu bố trí'],
      source: 'Quy trình được thiết kế và nhấn mạnh bởi roadmap hiện có.'
    },
    wireframe: {
      title: 'Bố trí công tác',
      fields: ['Nhân viên', 'Đơn vị', 'Chức danh', 'Hiệu lực'],
      actions: ['Hủy', 'Lưu', 'Phê duyệt']
    },
    source: {
      note: 'Dữ liệu nguồn được xác định từ quy trình bố trí và cơ cấu tổ chức.',
      status: 'official'
    }
  },
  {
    id: 'LIFE-04',
    type: 'lifecycle',
    code: '04',
    title: 'Thiết lập hợp đồng',
    subtitle: 'Quan hệ lao động',
    overview: {
      purpose: 'Thiết lập quan hệ lao động của nhân viên với thông tin hiệu lực và điều kiện làm việc.',
      description: 'Hợp đồng đóng vai trò kết nối hồ sơ nhân sự với điều kiện lao động và chính sách áp dụng.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Hồ sơ nhân viên', source: 'LIFE-02', sourceType: 'system' },
      { name: 'Thông tin bố trí công tác', source: 'LIFE-03', sourceType: 'system' }
    ],
    outputs: [
      { name: 'Thông tin hợp đồng', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Hợp đồng', action: 'Lập và quản lý hợp đồng' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Tạo hồ sơ hợp đồng', 'Xác thực dữ liệu', 'Phê duyệt', 'Lưu hợp đồng'],
      source: 'Quy trình hợp đồng lao động được mô tả trong sơ đồ hiện có.'
    },
    wireframe: {
      title: 'Hợp đồng lao động',
      fields: ['Loại hợp đồng', 'Ngày hiệu lực', 'Mức lương', 'Chức danh'],
      actions: ['Hủy', 'Lưu', 'Ký']
    },
    source: {
      note: 'Nguồn nghiệp vụ từ quy trình hợp đồng nhân sự.',
      status: 'official'
    }
  },
  {
    id: 'LIFE-05',
    type: 'lifecycle',
    code: '05',
    title: 'Lương & chế độ',
    subtitle: 'Cấu hình quyền lợi',
    overview: {
      purpose: 'Gán cấu hình lương, bảo hiểm và quyền lợi cho nhân viên.',
      description: 'Unify thu nhập, bảo hiểm và chế độ theo dữ liệu cấu hình và hợp đồng.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Hồ sơ nhân viên', source: 'LIFE-02', sourceType: 'system' },
      { name: 'Thông tin hợp đồng', source: 'LIFE-04', sourceType: 'system' },
      { name: 'Thang/bậc lương', source: 'MD-07', sourceType: 'master' }
    ],
    outputs: [
      { name: 'Cấu hình lương', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Chế độ bảo hiểm', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'C&B/HR Admin', role: 'Lương', action: 'Thiết lập và cập nhật lương' }
    ],
    masterDataIds: ['MD-07', 'MD-09'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Xác định chính sách', 'Gán thang lương', 'Cấu hình bảo hiểm', 'Lưu quyền lợi'],
      source: 'Quy trình lương và chế độ được thiết kế trong mô hình hiện có.'
    },
    wireframe: {
      title: 'Lương & chế độ',
      fields: ['Mức lương', 'Phụ cấp', 'Bảo hiểm', 'Hiệu lực'],
      actions: ['Hủy', 'Lưu', 'Phê duyệt']
    },
    source: {
      note: 'Nguồn nghiệp vụ dựa trên chính sách lương và bảo hiểm.',
      status: 'official'
    }
  },
  {
    id: 'LIFE-06',
    type: 'lifecycle',
    code: '06',
    title: 'Quá trình làm việc',
    subtitle: 'Quản lý xuyên suốt',
    overview: {
      purpose: 'Theo dõi và ghi nhận các phát sinh trong thời gian nhân viên làm việc.',
      description: 'Bước này tích hợp các nghiệp vụ xuyên suốt như chấm công, ca, nghỉ phép và kỷ luật.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Hồ sơ đang hiệu lực', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Nghiệp vụ phát sinh', source: 'Quy trình nghiệp vụ', sourceType: 'system' }
    ],
    outputs: [
      { name: 'Lịch sử quá trình làm việc', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Theo dõi', action: 'Ghi nhận và kiểm tra phát sinh' },
      { name: 'Quản lý', role: 'Phê duyệt', action: 'Xác nhận nghiệp vụ' }
    ],
    masterDataIds: ['MD-08', 'MD-10'],
    sopIds: [],
    process: {
      status: 'draft',
      steps: ['Thu thập phát sinh', 'Kiểm tra dữ liệu', 'Cập nhật lịch sử', 'Kết thúc hiệu lực nếu cần'],
      source: 'Dự thảo quy trình thực tế cho giai đoạn làm việc.'
    },
    wireframe: {
      title: 'Quá trình làm việc',
      fields: ['Ngày', 'Loại phát sinh', 'Trạng thái', 'Người xử lý'],
      actions: ['Lưu', 'Duyệt']
    },
    source: {
      note: 'Nghiệp vụ được mô tả trong sơ đồ nhưng chưa có mapping SOP chính thức đầy đủ.',
      status: 'draft'
    }
  },
  {
    id: 'LIFE-07',
    type: 'lifecycle',
    code: '07',
    title: 'Nghỉ việc & đóng hồ sơ',
    subtitle: 'Kết thúc lifecycle',
    overview: {
      purpose: 'Hoàn tất nghỉ việc, bàn giao và đóng hồ sơ nhân viên.',
      description: 'Bước kết thúc vòng đời nhân viên, bao gồm xác nhận nghỉ việc và thanh lý hồ sơ.',
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: [
      { name: 'Đề nghị nghỉ việc', source: 'Nhân viên / quản lý', sourceType: 'manual' },
      { name: 'Hồ sơ hiện hành', source: 'Hệ thống', sourceType: 'system' }
    ],
    outputs: [
      { name: 'Trạng thái nghỉ việc', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Hồ sơ đã đóng', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Thanh lý', action: 'Xử lý và đóng hồ sơ' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Nhận đề nghị', 'Xác nhận ngày nghỉ', 'Bàn giao', 'Đóng hồ sơ'],
      source: 'Quy trình nghỉ việc và thanh lý hồ sơ được mô tả bằng sơ đồ.'
    },
    wireframe: {
      title: 'Nghỉ việc & đóng hồ sơ',
      fields: ['Ngày nghỉ', 'Nguyên nhân', 'Hồ sơ bàn giao', 'Trạng thái'],
      actions: ['Hủy', 'Lưu', 'Kết thúc']
    },
    source: {
      note: 'Dữ liệu nguồn phù hợp với quy trình nghỉ việc và giao nhận hồ sơ.',
      status: 'official'
    }
  }
]

export const crossFunctionalProcesses: BusinessNode[] = [
  {
    id: 'CROSS-01',
    type: 'cross',
    code: 'A',
    title: 'Công & phép',
    subtitle: 'Chấm công, nghỉ và ca làm việc',
    overview: {
      purpose: 'Theo dõi thời gian làm việc, nghỉ phép và ca làm việc trong quá trình vận hành.',
      description: 'Nghiệp vụ phát sinh xuyên suốt lifecycle, kết nối với cấu hình ca và loại nghỉ.',
      status: 'official',
      phase: 'Cross Functional'
    },
    inputs: [
      { name: 'Chấm công', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Đơn nghỉ phép', source: 'Nhân viên', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Thời gian làm việc', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Nhân viên', role: 'Sử dụng ca/lễ', action: 'Gửi yêu cầu nghỉ hoặc đăng ký ca' },
      { name: 'HR Admin', role: 'Quản lý', action: 'Theo dõi và xử lý' }
    ],
    masterDataIds: ['MD-08'],
    sopIds: [],
    process: {
      status: 'draft',
      steps: ['Thu thập chấm công', 'Kiểm tra phép', 'Cập nhật hồ sơ', 'Phân tích hiệu lực'],
      source: 'Dự thảo quy trình chấm công và nghỉ phép.'
    },
    wireframe: {
      title: 'Công & phép',
      fields: ['Ngày', 'Ca', 'Phép', 'Trạng thái'],
      actions: ['Lưu', 'Duyệt']
    },
    source: {
      note: 'Nghiệp vụ phát sinh xuyên suốt; chưa có mapping SOP chi tiết hoàn chỉnh.',
      status: 'draft'
    }
  },
  {
    id: 'CROSS-02',
    type: 'cross',
    code: 'B',
    title: 'Hợp đồng',
    subtitle: 'Điều chỉnh quan hệ lao động',
    overview: {
      purpose: 'Quản lý tái ký, đổi loại hợp đồng, bổ sung hợp đồng hoặc thay đổi điều kiện lao động.',
      description: 'Nghiệp vụ này có mối liên hệ chặt chẽ với MD-05 và MD-06.',
      status: 'official',
      phase: 'Cross Functional'
    },
    inputs: [
      { name: 'Hợp đồng hiện tại', source: 'Hệ thống', sourceType: 'system' },
      { name: 'Yêu cầu thay đổi', source: 'Quản lý / HR', sourceType: 'manual' }
    ],
    outputs: [
      { name: 'Hợp đồng mới hoặc phụ lục', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR', role: 'Quản lý hợp đồng', action: 'Xử lý cập nhật hợp đồng' },
      { name: 'Nhân viên', role: 'Đối tác', action: 'Ký và xác nhận' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'designed',
      steps: ['Phát hiện yêu cầu', 'Kiểm tra hợp đồng', 'Cập nhật điều kiện', 'Lưu và ký'],
      source: 'Quy trình thay đổi hợp đồng đang được mô tả bằng logic nghiệp vụ.'
    },
    wireframe: {
      title: 'Hợp đồng',
      fields: ['Loại hợp đồng', 'Hiệu lực', 'Mức lương', 'Chức danh'],
      actions: ['Lưu', 'Ký']
    },
    source: {
      note: 'Nghiệp vụ có căn cứ từ quy trình hợp đồng và bố trí tổ chức.',
      status: 'official'
    }
  },
  {
    id: 'CROSS-03',
    type: 'cross',
    code: 'C',
    title: 'Biến động nhân sự',
    subtitle: 'Thay đổi thông tin công tác',
    overview: {
      purpose: 'Ghi nhận và quản lý các thay đổi phát sinh trong hồ sơ nhân sự.',
      description: 'Bao gồm điều động, bổ nhiệm, miễm nhiệm, thay đổi vị trí hay địa điểm làm việc.',
      status: 'official',
      phase: 'Cross Functional'
    },
    inputs: [
      { name: 'Yêu cầu thay đổi', source: 'Quản lý / HR', sourceType: 'manual' },
      { name: 'Thông tin nhân sự', source: 'Hệ thống', sourceType: 'system' }
    ],
    outputs: [
      { name: 'Biến động nhân sự', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'HR Admin', role: 'Quản lý nhân sự', action: 'Thực hiện biến động' },
      { name: 'Quản lý', role: 'Phê duyệt', action: 'Đồng ý yêu cầu' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: [],
    process: {
      status: 'draft',
      steps: ['Nhận yêu cầu', 'Kiểm tra dữ liệu', 'Duyệt thay đổi', 'Cập nhật quan hệ công tác'],
      source: 'Quy trình dự thảo cho biến động nhân sự.'
    },
    wireframe: {
      title: 'Biến động nhân sự',
      fields: ['Nhân viên', 'Thay đổi', 'Đơn vị', 'Trạng thái'],
      actions: ['Lưu', 'Phê duyệt']
    },
    source: {
      note: 'Biến động nhân sự có gốc từ quy trình công tác nhưng chưa được mapping chuẩn hóa.',
      status: 'draft'
    }
  },
  {
    id: 'CROSS-04',
    type: 'cross',
    code: 'D',
    title: 'Ghi nhận thành tích',
    subtitle: 'Theo dõi kết quả và kỷ luật',
    overview: {
      purpose: 'Ghi nhận các hoạt động khen thưởng, kỷ luật hoặc đánh giá thành tích trong quá trình làm việc.',
      description: 'Nghiệp vụ này liên quan trực tiếp đến danh mục kỷ luật, thành tích và đánh giá nhân sự.',
      status: 'official',
      phase: 'Cross Functional'
    },
    inputs: [
      { name: 'Kết quả làm việc', source: 'Quản lý', sourceType: 'manual' },
      { name: 'Dữ liệu kỷ luật', source: 'MD-10', sourceType: 'master' }
    ],
    outputs: [
      { name: 'Lịch sử thành tích / kỷ luật', source: 'Hệ thống', sourceType: 'system' }
    ],
    actors: [
      { name: 'Quản lý', role: 'Đánh giá', action: 'Đề xuất thành tích hoặc kỷ luật' },
      { name: 'HR', role: 'Hồ sơ', action: 'Xác nhận và lưu' }
    ],
    masterDataIds: ['MD-10'],
    sopIds: [],
    process: {
      status: 'draft',
      steps: ['Thu thập kết quả', 'Chọn danh mục', 'Xác nhận quyết định', 'Lưu lịch sử'],
      source: 'Dự thảo quy trình khen thưởng và kỷ luật.'
    },
    wireframe: {
      title: 'Thành tích / kỷ luật',
      fields: ['Nhân viên', 'Loại', 'Mức độ', 'Trạng thái'],
      actions: ['Lưu', 'Duyệt']
    },
    source: {
      note: 'Quy trình có căn cứ từ chính sách nội bộ nhưng chưa được mapping đầy đủ.',
      status: 'draft'
    }
  }
]

export const sharedServices: BusinessNode[] = [
  {
    id: 'SUPPORT-01',
    type: 'support',
    code: 'S1',
    title: 'Phân quyền người dùng',
    subtitle: 'Kiểm soát quyền truy cập',
    overview: {
      purpose: 'Quản lý quyền truy cập cho từng vai trò trong quy trình nhân sự.',
      description: 'Hỗ trợ bảo mật và phân tách trách nhiệm.',
      status: 'official',
      phase: 'Shared Services'
    },
    inputs: [{ name: 'Vai trò', source: 'Quản trị hệ thống', sourceType: 'manual' }],
    outputs: [{ name: 'Quyền truy cập', source: 'Hệ thống', sourceType: 'system' }],
    actors: [{ name: 'Quản trị hệ thống', role: 'Bảo mật', action: 'Cấu hình quyền' }],
    masterDataIds: [],
    sopIds: [],
    process: { status: 'not_available', steps: [], source: 'Chưa có quy trình thực tế.' },
    wireframe: { title: 'Phân quyền', fields: ['Vai trò', 'Mục quyền', 'Người dùng'], actions: ['Lưu', 'Hủy'] },
    source: { note: 'Shared capability, không phải lifecycle step.', status: 'official' }
  },
  {
    id: 'SUPPORT-02',
    type: 'support',
    code: 'S2',
    title: 'Phê duyệt nghiệp vụ',
    subtitle: 'Xác nhận tái nhập / phê duyệt',
    overview: {
      purpose: 'Phê duyệt các nghiệp vụ quan trọng trong vòng đời nhân viên.',
      description: 'Đảm bảo tính hợp lệ trước khi các dữ liệu được lưu và truyền tiếp.',
      status: 'official',
      phase: 'Shared Services'
    },
    inputs: [{ name: 'Yêu cầu nghiệp vụ', source: 'Người dùng', sourceType: 'manual' }],
    outputs: [{ name: 'Kết quả phê duyệt', source: 'Hệ thống', sourceType: 'system' }],
    actors: [{ name: 'Quản lý', role: 'Phê duyệt', action: 'Duyệt hoặc trả lại' }],
    masterDataIds: [],
    sopIds: [],
    process: { status: 'not_available', steps: [], source: 'Chưa có quy trình thực tế.' },
    wireframe: { title: 'Phê duyệt', fields: ['Yêu cầu', 'Người duyệt', 'Trạng thái'], actions: ['Từ chối', 'Phê duyệt'] },
    source: { note: 'Shared capability, không phải lifecycle step.', status: 'official' }
  }
]

export const allBusinessNodes = [...masterData, ...lifecycleProcesses, ...crossFunctionalProcesses, ...sharedServices]

export const sops: SopRecord[] = [
  {
    id: 'SOP-01',
    title: 'Tiếp nhận nhân viên mới',
    lifecycleIds: ['LIFE-01'],
    masterDataIds: ['MD-05', 'MD-06'],
    crossFunctionalIds: [],
    source: { file: 'SOP - HRUX.xlsx', sheet: 'Tuyển dụng', row: '4' },
    status: 'official'
  },
  {
    id: 'SOP-02',
    title: 'Ký hợp đồng với nhân viên mới',
    lifecycleIds: ['LIFE-04'],
    masterDataIds: ['MD-05', 'MD-06'],
    crossFunctionalIds: ['CROSS-02'],
    source: { file: 'SOP - HRUX.xlsx', sheet: 'Nhân sự', row: '10' },
    status: 'official'
  },
  {
    id: 'SOP-03',
    title: 'Quản lý nghỉ phép (có portal)',
    lifecycleIds: ['LIFE-06'],
    masterDataIds: ['MD-08'],
    crossFunctionalIds: ['CROSS-01'],
    source: { file: 'SOP - HRUX.xlsx', sheet: 'Chấm công/Phép', row: '26' },
    status: 'official'
  }
]

export const relationships: Relationship[] = [
  { source: 'MD-05', target: 'LIFE-01', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-03', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-04', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-07', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-01', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-03', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-04', type: 'used-by' },
  { source: 'MD-07', target: 'LIFE-05', type: 'used-by' },
  { source: 'MD-08', target: 'LIFE-06', type: 'used-by' },
  { source: 'MD-08', target: 'CROSS-01', type: 'used-by' },
  { source: 'MD-09', target: 'LIFE-05', type: 'used-by' },
  { source: 'MD-10', target: 'LIFE-06', type: 'used-by' },
  { source: 'MD-10', target: 'CROSS-04', type: 'used-by' },
  { source: 'LIFE-01', target: 'LIFE-02', type: 'feeds' },
  { source: 'LIFE-02', target: 'LIFE-03', type: 'feeds' },
  { source: 'LIFE-03', target: 'LIFE-04', type: 'feeds' },
  { source: 'LIFE-04', target: 'LIFE-05', type: 'feeds' },
  { source: 'LIFE-05', target: 'LIFE-06', type: 'feeds' },
  { source: 'LIFE-06', target: 'LIFE-07', type: 'feeds' }
]

export function findNodeById(nodeId: string): BusinessNode | undefined {
  return allBusinessNodes.find((node) => node.id === nodeId)
}

export function getNodeLabel(node: BusinessNode): string {
  if (node.type === 'master') return 'MASTER DATA'
  if (node.type === 'lifecycle') return 'LIFECYCLE PROCESS'
  if (node.type === 'cross') return 'CROSS-FUNCTIONAL'
  return 'SHARED SERVICE'
}

export const defaultBusinessDetail = lifecycleProcesses[0]
