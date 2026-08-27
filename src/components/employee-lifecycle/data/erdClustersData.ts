import type { ERDCluster } from '../../../types/employee-lifecycle'

export const erdClustersData: ERDCluster[] = [
  {
    id: 'personal',
    title: 'CỤM 1: DANH MỤC CÁ NHÂN & ĐỊA LÝ',
    subtitle: 'Địa giới hành chính, trình độ, dân tộc, tôn giáo',
    targetField: 'SƠ YẾU LÝ LỊCH',
    color: 'from-[#1f5f86] to-[#2e8bbd]',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    sopIds: ['SOP-NS-04'],
    items: [
      { id: 'MD-04', code: 'MD-04', title: 'Đơn vị hành chính', subtitle: 'Tỉnh/Thành, Quận/Huyện, Xã/Phường', sopBadge: 'SOP-NS-01' },
      { id: 'MD-01', code: 'MD-01', title: 'Thêm giá trị danh mục', subtitle: 'Dân tộc, Tôn giáo, Quốc tịch', sopBadge: 'SOP-NS-04' },
      { id: 'MD-02', code: 'MD-02', title: 'Cập nhật giá trị danh mục', subtitle: 'Trình độ học vấn, Ngoại ngữ', sopBadge: 'SOP-NS-04' },
      { id: 'MD-03', code: 'MD-03', title: 'Khóa/Kích hoạt danh mục', subtitle: 'Trạng thái hiệu lực danh mục', sopBadge: 'SOP-NS-04' },
    ]
  },
  {
    id: 'structure',
    title: 'CỤM 2: CƠ CẤU & VỊ TRÍ CÔNG TÁC',
    subtitle: 'Đơn vị, phòng ban, chức danh, chức vụ, level',
    targetField: 'VỊ TRÍ CÔNG TÁC',
    color: 'from-[#1f5f86] to-[#2e8bbd]',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    sopIds: ['SOP-NS-01', 'SOP-NS-09'],
    items: [
      { id: 'MD-05', code: 'MD-05', title: 'Cơ cấu tổ chức', subtitle: 'Sơ đồ cây Đơn vị / Phòng ban', sopBadge: 'SOP-NS-01' },
      { id: 'MD-06', code: 'MD-06', title: 'Chức vụ / Chức danh', subtitle: 'Danh mục vị trí, Level, Định biên', sopBadge: 'SOP-NS-09' },
    ]
  },
  {
    id: 'policy',
    title: 'CỤM 3: CHÍNH SÁCH & CHẾ ĐỘ LABOUR',
    subtitle: 'Thang lương, ca làm việc, bảo hiểm & kỷ luật',
    targetField: 'HỢP ĐỒNG & CHẾ ĐỘ',
    color: 'from-[#1f5f86] to-[#2e8bbd]',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    sopIds: ['SOP-L-02', 'SOP-CC-01', 'SOP-BH-01', 'SOP-NS-14'],
    items: [
      { id: 'MD-07', code: 'MD-07', title: 'Thang / Bậc lương', subtitle: 'Mức lương cơ bản & Hệ số', sopBadge: 'SOP-L-02' },
      { id: 'MD-08', code: 'MD-08', title: 'Ca & Loại nghỉ', subtitle: 'Cấu hình ca kíp, phép năm', sopBadge: 'SOP-CC-01' },
      { id: 'MD-09', code: 'MD-09', title: 'Bảo hiểm & Y tế', subtitle: 'BHXH, BHYT, Nơi KCB', sopBadge: 'SOP-BH-01' },
      { id: 'MD-10', code: 'MD-10', title: 'Danh mục Kỷ luật', subtitle: 'Hình thức khen thưởng & kỷ luật', sopBadge: 'SOP-NS-14' },
    ]
  }
]
