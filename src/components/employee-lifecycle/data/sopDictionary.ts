import { CROSS_FUNCTIONAL_REGISTRY } from '../cross-functional'

// SOP Mapping Dictionary (Global Constant based on SOP - HRUX.xlsx)
export const sopDictionary: Record<string, { badge: string; title: string }> = {
  // 8 Giai đoạn Vòng đời Nhân viên (Lifecycle), bắt đầu từ LIFE-00 Định biên
  'LIFE-00': { badge: 'SOP-EMP-01', title: 'Thiết lập định biên nhân sự (Headcount Budget Planning)' },
  'LIFE-01': { badge: 'SOP-TD-04', title: 'Tiếp nhận nhân viên mới (Phân hệ Tuyển dụng)' },
  'LIFE-02': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Phân hệ Nhân sự)' },
  'LIFE-03': { badge: 'SOP-ĐG-04', title: 'Quy trình đánh giá thử việc & Điều động/điều chuyển (SOP-NS-12)' },
  'LIFE-04': { badge: 'SOP-NS-06', title: 'Ký hợp đồng với nhân viên mới (Phân hệ Nhân sự)' },
  'LIFE-05': { badge: 'SOP-L-01', title: 'Quản lý chính sách thu nhập theo đối tượng & Báo tăng bảo hiểm (SOP-BH-03)' },
  'LIFE-06': { badge: 'SOP-CC-08', title: 'Xử lý dữ liệu chấm công & Quá trình làm việc (Phân hệ Chấm công)' },
  'LIFE-07': { badge: 'SOP-NS-16', title: 'Giảm lao động & Quản lý báo giảm bảo hiểm (SOP-BH-04)' },

  // 8 Module Nghiệp vụ Phát sinh (Đồng bộ trực tiếp từ Canonical Registry)
  'CF-01': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-01'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-01'].title },
  'CF-02': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-02'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-02'].title },
  'CF-03': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-03'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-03'].title },
  'CF-04': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-04'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-04'].title },
  'CF-05': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-05'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-05'].title },
  'CF-06': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-06'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-06'].title },
  'CF-07': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-07'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-07'].title },
  'CF-08': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-08'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-08'].title },

  // Aliases CROSS-01 .. CROSS-08
  'CROSS-01': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-01'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-01'].title },
  'CROSS-02': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-02'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-02'].title },
  'CROSS-03': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-03'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-03'].title },
  'CROSS-04': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-04'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-04'].title },
  'CROSS-05': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-05'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-05'].title },
  'CROSS-06': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-06'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-06'].title },
  'CROSS-07': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-07'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-07'].title },
  'CROSS-08': { badge: CROSS_FUNCTIONAL_REGISTRY['CF-08'].sopBadge, title: CROSS_FUNCTIONAL_REGISTRY['CF-08'].title },

  // Tầng 1: Master Data Categories
  'MD-01': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Danh mục Nền tảng)' },
  'MD-02': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Học vấn, Trình độ)' },
  'MD-03': { badge: 'SOP-PIT-02', title: 'Quản lý thông tin thuế TNCN của nhân viên (Người phụ thuộc)' },
  'MD-04': { badge: 'SOP-NS-01', title: 'Định biên nhân sự (Đơn vị hành chính)' },
  'MD-05': { badge: 'SOP-NS-01', title: 'Định biên nhân sự (Cơ cấu tổ chức phòng ban)' },
  'MD-06': { badge: 'SOP-NS-09', title: 'Bổ nhiệm & Thiết lập tiêu chuẩn đào tạo chức danh (SOP-DT-01)' },
  'MD-07': { badge: 'SOP-L-02', title: 'Quản lý thang bảng lương (Phân hệ Lương)' },
  'MD-08': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'MD-09': { badge: 'SOP-BH-01', title: 'Thiết lập và quản lý đối tượng/tỷ lệ và mức tham gia bảo hiểm' },
  'MD-10': { badge: 'SOP-NS-14', title: 'Quản lý Kỷ luật & Khen thưởng (SOP-NS-13)' }
}
