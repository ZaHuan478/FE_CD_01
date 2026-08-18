import type { OperationModule } from '../../../types/employee-lifecycle'

export const defaultOperationsModules: OperationModule[] = [
  {
    id: 'CF-01',
    code: 'CF-01',
    title: 'Công & Phép',
    description: 'Chấm công tự động, đăng ký ca làm việc và quản lý nghỉ phép năm',
    iconName: 'Clock',
    category: 'Time & Attendance',
    inputs: ['Chấm công', 'Đơn xin nghỉ'],
    outputs: ['Bảng tổng hợp công'],
    sopBadge: 'SOP-CC-01'
  },
  {
    id: 'CF-02',
    code: 'CF-02',
    title: 'Điều chỉnh Hợp đồng',
    description: 'Tái ký hợp đồng, lập phụ lục điều chỉnh mức lương và điều khoản',
    iconName: 'FileEdit',
    category: 'Contract Admin',
    inputs: ['Yêu cầu tái ký', 'Phụ lục HĐ'],
    outputs: ['Hợp đồng mới'],
    sopBadge: 'SOP-NS-05'
  },
  {
    id: 'CF-03',
    code: 'CF-03',
    title: 'Biến động Nhân sự',
    description: 'Điều động nội bộ, bổ nhiệm chức vụ, luân chuyển phòng ban',
    iconName: 'UserSquare2',
    category: 'Movement',
    inputs: ['Tờ trình luân chuyển'],
    outputs: ['Quyết định điều động'],
    sopBadge: 'SOP-NS-12'
  },
  {
    id: 'CF-04',
    code: 'CF-04',
    title: 'Thành tích & Kỷ luật',
    description: 'Ghi nhận khen thưởng, vinh danh cá nhân và xử lý vi phạm kỷ luật',
    iconName: 'Award',
    category: 'Conduct & Rewards',
    inputs: ['Đề xuất khen thưởng'],
    outputs: ['Quyết định khen thưởng/kỷ luật'],
    sopBadge: 'SOP-NS-13'
  },
  {
    id: 'CF-05',
    code: 'CF-05',
    title: 'Đào tạo & Phát triển',
    description: 'Lập kế hoạch đào tạo, quản lý khóa học và theo dõi chứng chỉ',
    iconName: 'GraduationCap',
    category: 'Learning',
    inputs: ['Nhu cầu đào tạo'],
    outputs: ['Kết quả đánh giá khóa học'],
    sopBadge: 'SOP-DT-02'
  },
  {
    id: 'CF-06',
    code: 'CF-06',
    title: 'Đánh giá Hiệu suất',
    description: 'Thiết lập KPI/OKR hàng kỳ, theo dõi và đánh giá hoàn thành công việc',
    iconName: 'Target',
    category: 'Performance',
    inputs: ['Chỉ tiêu KPI'],
    outputs: ['Kết quả đánh giá kỳ'],
    sopBadge: 'SOP-ĐG-02'
  },
  {
    id: 'CF-07',
    code: 'CF-07',
    title: 'Phúc lợi & Y tế',
    description: 'Quản lý chính sách bảo hiểm tự nguyện, khám sức khỏe & quà lễ tết',
    iconName: 'HeartHandshake',
    category: 'Benefits',
    inputs: ['Danh sách đăng ký'],
    outputs: ['Chi phí phúc lợi'],
    sopBadge: 'SOP-PL-01'
  },
  {
    id: 'CF-08',
    code: 'CF-08',
    title: 'Công tác & Chi phí',
    description: 'Đăng ký lịch công tác, duyệt phụ cấp và thanh quyết toán công tác phí',
    iconName: 'Receipt',
    category: 'Travel & Expense',
    inputs: ['Lịch công tác'],
    outputs: ['Quyết toán chi phí'],
    sopBadge: 'SOP-NS-15'
  }
]
