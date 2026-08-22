// SOP Mapping Dictionary (Global Constant based on SOP - HRUX.xlsx)
export const sopDictionary: Record<string, { badge: string; title: string }> = {
  // 7 Bước Vòng đời Nhân viên (Lifecycle) + Bước 0 Định biên
  'LIFE-00': { badge: 'SOP-EMP-01', title: 'Thiết lập định biên nhân sự (Headcount Budget Planning)' },
  'LIFE-01': { badge: 'SOP-TD-04', title: 'Tiếp nhận nhân viên mới (Phân hệ Tuyển dụng)' },
  'LIFE-02': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Phân hệ Nhân sự)' },
  'LIFE-03': { badge: 'SOP-ĐG-04', title: 'Quy trình đánh giá thử việc & Điều động/điều chuyển (SOP-NS-12)' },
  'LIFE-04': { badge: 'SOP-NS-06', title: 'Ký hợp đồng với nhân viên mới (Phân hệ Nhân sự)' },
  'LIFE-05': { badge: 'SOP-L-01', title: 'Quản lý chính sách thu nhập theo đối tượng & Báo tăng bảo hiểm (SOP-BH-03)' },
  'LIFE-06': { badge: 'SOP-CC-08', title: 'Xử lý dữ liệu chấm công & Quá trình làm việc (Phân hệ Chấm công)' },
  'LIFE-07': { badge: 'SOP-NS-16', title: 'Giảm lao động & Quản lý báo giảm bảo hiểm (SOP-BH-04)' },

  // 8 Module Nghiệp vụ Phát sinh (Operations Grid - Aliases CF-xx & CROSS-xx)
  'CF-01': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'CF-02': { badge: 'SOP-NS-05', title: 'Tái ký hợp đồng lao động & Phụ lục hợp đồng (SOP-NS-07)' },
  'CF-03': { badge: 'SOP-NS-09', title: 'Bổ nhiệm, Kiêm nhiệm (SOP-NS-10) & Điều động/điều chuyển (SOP-NS-12)' },
  'CF-04': { badge: 'SOP-NS-13', title: 'Khen thưởng & Xử lý Kỷ luật (SOP-NS-14)' },
  'CF-05': { badge: 'SOP-DT-02', title: 'Quản lý kế hoạch đào tạo của Công ty (Phân hệ Đào tạo)' },
  'CF-06': { badge: 'SOP-ĐG-02', title: 'Quy trình đánh giá thành tích & Bộ tiêu chí KPI (SOP-ĐG-01)' },
  'CF-07': { badge: 'SOP-PL-01', title: 'Quản lý thông tin khám sức khoẻ định kỳ & Phúc lợi (SOP-PL-05)' },
  'CF-08': { badge: 'SOP-NS-15', title: 'Quản lý công tác (Phân hệ Nhân sự)' },

  'CROSS-01': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'CROSS-02': { badge: 'SOP-NS-05', title: 'Tái ký hợp đồng lao động & Phụ lục hợp đồng (SOP-NS-07)' },
  'CROSS-03': { badge: 'SOP-NS-09', title: 'Bổ nhiệm, Kiêm nhiệm (SOP-NS-10) & Điều động/điều chuyển (SOP-NS-12)' },
  'CROSS-04': { badge: 'SOP-NS-13', title: 'Khen thưởng & Xử lý Kỷ luật (SOP-NS-14)' },
  'CROSS-05': { badge: 'SOP-DT-02', title: 'Quản lý kế hoạch đào tạo của Công ty (Phân hệ Đào tạo)' },
  'CROSS-06': { badge: 'SOP-ĐG-02', title: 'Quy trình đánh giá thành tích & Bộ tiêu chí KPI (SOP-ĐG-01)' },
  'CROSS-07': { badge: 'SOP-PL-01', title: 'Quản lý thông tin khám sức khoẻ định kỳ & Phúc lợi (SOP-PL-05)' },
  'CROSS-08': { badge: 'SOP-NS-15', title: 'Quản lý công tác (Phân hệ Nhân sự)' },

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
