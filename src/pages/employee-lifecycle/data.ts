import { lifecycleMockNodes } from '../../data/lifecycle-mock-data'

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
  'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'
].map(id => {
  const node = lifecycleMockNodes[id]
  return {
    id: node.id,
    type: 'lifecycle',
    code: node.code,
    title: node.title,
    subtitle: node.subtitle,
    overview: {
      purpose: node.contextTrigger,
      description: node.subtitle,
      status: 'official',
      phase: 'Lifecycle'
    },
    inputs: node.inputs.map((inp: string) => ({ name: inp, source: 'SOP Standard', sourceType: 'manual' })),
    outputs: node.outputs.map((out: string) => ({ name: out, source: 'HRM Core Engine', sourceType: 'system' })),
    actors: [
      { name: node.actorsMatrix.proposer, role: 'Đề xuất', action: 'Kích hoạt' },
      { name: node.actorsMatrix.approver, role: 'Phê duyệt', action: 'Thẩm định' },
      { name: node.actorsMatrix.executor, role: 'Thực thi', action: 'Xử lý hệ thống' }
    ],
    masterDataIds: ['MD-05', 'MD-06'],
    sopIds: node.sopIds,
    process: node.process,
    wireframe: {
      title: node.title,
      fields: node.uiFields,
      actions: ['Hủy', 'Lưu', 'Tiếp tục']
    },
    source: {
      note: node.process.source,
      status: 'official'
    }
  }
})

export const crossFunctionalProcesses: BusinessNode[] = [
  'CF-01', 'CF-02', 'CF-03', 'CF-04', 'CF-05', 'CF-06', 'CF-07', 'CF-08'
].map(id => {
  const node = lifecycleMockNodes[id]
  return {
    id: node.id,
    type: 'cross',
    code: node.code,
    title: node.title,
    subtitle: node.subtitle,
    overview: {
      purpose: node.contextTrigger,
      description: node.subtitle,
      status: 'official',
      phase: 'Cross Functional'
    },
    inputs: node.inputs.map((inp: string) => ({ name: inp, source: 'SOP Operations', sourceType: 'manual' })),
    outputs: node.outputs.map((out: string) => ({ name: out, source: 'HRM Core Engine', sourceType: 'system' })),
    actors: [
      { name: node.actorsMatrix.proposer, role: 'Đề xuất', action: 'Kích hoạt' },
      { name: node.actorsMatrix.approver, role: 'Phê duyệt', action: 'Thẩm định' },
      { name: node.actorsMatrix.executor, role: 'Thực thi', action: 'Xử lý hệ thống' }
    ],
    masterDataIds: ['MD-05', 'MD-06', 'MD-08', 'MD-10'],
    sopIds: node.sopIds,
    process: node.process,
    wireframe: {
      title: node.title,
      fields: node.uiFields,
      actions: ['Hủy', 'Lưu', 'Duyệt']
    },
    source: {
      note: node.process.source,
      status: 'official'
    }
  }
})

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
  const found = allBusinessNodes.find((node) => node.id === nodeId)
  if (found) return found
  if (nodeId === 'LIFE-00' && lifecycleMockNodes['LIFE-00']) {
    const node = lifecycleMockNodes['LIFE-00']
    return {
      id: node.id,
      type: 'lifecycle',
      code: node.code,
      title: node.title,
      subtitle: node.subtitle,
      overview: {
        purpose: node.contextTrigger,
        description: node.subtitle,
        status: 'official',
        phase: 'Lifecycle'
      },
      inputs: node.inputs.map((inp: string) => ({ name: inp, source: 'SOP Standard', sourceType: 'manual' })),
      outputs: node.outputs.map((out: string) => ({ name: out, source: 'HRM Core Engine', sourceType: 'system' })),
      actors: [
        { name: node.actorsMatrix.proposer, role: 'Đề xuất', action: 'Kích hoạt' },
        { name: node.actorsMatrix.approver, role: 'Phê duyệt', action: 'Thẩm định' },
        { name: node.actorsMatrix.executor, role: 'Thực thi', action: 'Xử lý hệ thống' }
      ],
      masterDataIds: ['MD-05', 'MD-06'],
      sopIds: node.sopIds,
      process: node.process,
      wireframe: {
        title: node.title,
        fields: node.uiFields,
        actions: ['Hủy', 'Lưu', 'Tiếp tục']
      },
      source: {
        note: node.process.source,
        status: 'official'
      }
    }
  }
  return undefined
}

export function getNodeLabel(node: BusinessNode): string {
  if (node.type === 'master') return 'MASTER DATA'
  if (node.type === 'lifecycle') return 'LIFECYCLE PROCESS'
  if (node.type === 'cross') return 'CROSS-FUNCTIONAL'
  return 'SHARED SERVICE'
}

export const defaultBusinessDetail = lifecycleProcesses[0]
