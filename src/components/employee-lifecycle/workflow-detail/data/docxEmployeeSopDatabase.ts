import type { SopSubProcess } from '../types'

// Generated from 1.EMP.HRM.SOP.docx tables. Do not hand-edit process steps here.
export const DOCX_EMPLOYEE_SOP_DATABASE: Record<string, SopSubProcess[]> = {
  'LIFE-00': [
  {
    "sopCode": "SOP-EMP-01",
    "sopTitle": "Lưu đồ quy trình Thiết lập định biên nhân sự",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP01.01",
        "title": "Thiết lập định biên nhân sự",
        "actor": "TBP",
        "location": "Portal",
        "timing": "Đầu năm",
        "typeCode": "N",
        "description": "TBP phụ trách xây dựng định biên cho phòng ban mình phụ trách. Thông tin xây dựng đinh biên: Năm xây dựng định biên Phòng ban xây dựng định biên Chức vụ xây dựng định biên (từ danh mục Chức vụ) Cấp độ (level job grade) theo chức vụ Tháng định biên (chi tiết 12 tháng) Thu nhập (people cost) theo định biên Tổng thu nhập (people cost) trên tổng định biên (sum) à Gửi mail về HRM/HRD à In file trao đổi",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP01.02",
        "title": "Tham vấn định biên",
        "actor": "HRM/ HRD",
        "location": "Bên ngoài",
        "timing": "Sau khi nhận từ TBP",
        "typeCode": "M",
        "description": "Tham vấn định biên nhằm trao đổi, thông tin định hướng phát triển của Công ty và hoạch định nhân sự phù hợp, từ đó TBP có góc nhìn chính xác về nhân sự định biên của bộ phận mình. Kết quả sau khi trao đổi sẽ được TBP điều chỉnh lại trên kế hoạch định biên",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP01.03",
        "title": "Điều chỉnh định biên",
        "actor": "TBP",
        "location": "Portal",
        "timing": "Sau khi nhận từ HRM/HRD",
        "typeCode": "M",
        "description": "Kết quả thống nhất sau khi tham vấn với HRM/HRD được TBP điều chỉnh lại. Thông tin điều chỉnh gồm: Chức vụ xây dựng định biên (từ danh mục Chức vụ) Cấp độ (level job grade) theo chức vụ Tháng định biên (chi tiết 12 tháng) à Gửi mail đến các cấp duyệt",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP01.04",
        "title": "Duyệt định biên",
        "actor": "BOM",
        "location": "Portal",
        "timing": "Sau khi nhận từ HRM/HRD",
        "typeCode": "M",
        "description": "TBP & HRM/HRD sẽ họp cùng với BOM để giải trình và bảo vệ định biên. Thông tin làm cơ sở duyệt gồm: Chức vụ xây dựng định biên (từ danh mục Chức vụ) Cấp độ (level job grade) theo chức vụ Tháng định biên (chi tiết 12 tháng) Thu nhập (people cost) theo định biên à Gửi mail thông báo kết quả duyệt định biên đến TBP/HRM/HRD",
        "fieldsChecklist": [],
        "sourceRow": 5
      },
      {
        "stepCode": "EMP01.05",
        "title": "Cập nhật kết quả duyệt",
        "actor": "HRM-Nhân sự",
        "location": "Bên trong",
        "timing": "Sau khi BOM duyệt",
        "typeCode": "A",
        "description": "Kết quả duyệt của BOM được lưu trữ trên phần mềm, gồm các thông tin: Phòng ban xây dựng định biên Chức vụ xây dựng định biên (từ danh mục Chức vụ) Cấp độ (level job grade) theo chức vụ Tháng định biên (chi tiết 12 tháng) Thu nhập (people cost) theo định biên Tổng thu nhập (people cost) trên tổng định biên (sum) à In file để trình ký",
        "fieldsChecklist": [],
        "sourceRow": 6
      }
    ]
  }
],
  'LIFE-01': [
  {
    "sopCode": "SOP-EMP-02",
    "sopTitle": "Lưu đồ quy trình Tăng nhân viên mới không qua quy trình tuyển dụng (bao gồm cả nhân viên cũ nhưng lấy theo mã nhân viên mới)",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP02.01",
        "title": "Cập nhật danh sách nhân viên chờ nhận việc",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "Cập nhật CV của nhân viên vào danh sách nhân viên chờ nhận việc, mục đích để có thông tin chuẩn bị cho quá trình Onboarding. Các nhóm thông tin trong CV của nhân viên gồm: Nhóm thông tin cá nhân Tên nhân viên Mã nhân viên Tên tiếng Anh Là người nước ngoài (check mode, mặc định không check.) Tên thường gọi Ngày vào làm (dd/mm/yyyy) Ngày tính thâm niên (dd/mm/yyyy) Thời gian học việc (7-30-60 ngày – Khác, tự gõ vào) Ngày kết thúc học việc (dd/mm/yyyy) Thời gian thử việc (7-30-60 ngày – Khác, tự gõ vào) Ngày kết thúc thử việc (dd/mm/yyyy) Ngày sinh (dd/mm/yyyy) Nơi sinh (danh mục Tỉnh/Thành) Nguyên quán (danh mục Tỉnh/Thành) Giới tính (Nam/Nữ/Khác) Mã số thuế PIT Số CMND/CCCD (9 hoặc 12 số) Ngày cấp CMND/CCCD (dd/mm/yyyy) Nơi cấp CMND/CCCD (danh mục Tỉnh/Thành) Số Hộ chiếu Ngày cấp Hộ chiếu (dd/mm/yyyy) Ngày hết hạn Hộ chiếu (dd/mm/yyyy) Nơi cấp Hộ chiếu (danh mục Tỉnh/Thành) Tình trạng hôn nhân (Độc thân/Đã kết hôn/Ly hôn/Quá phụ/Quá vợ/Ly thân) Dân tộc (từ danh mục Dân tộc) Tôn giáo (từ danh mục Tôn giáo) Trình độ Văn hoá (1/12 à 12/12) Trình độ Học vấn (Tiểu học/Trung học cơ sở/Trung học phổ thông/Trung cấp/Cao đẵng/Đại học/Thạc sĩ/Tiến sĩ/Phó Giáo sư/Giáo sư) Chuyên ngành (từ danh mục chuyên ngành của Công ty đang có) Nhóm thông tin liên hệ + Thông tin liên hệ khẩn cấp: Địa chỉ Email Số mobile Người liên hệ khẩn cấp Số mobile người liên hệ khẩn cấp Mối quan hệ Địa chỉ Email người liên hệ khẩn cấp + Thông tin Hộ khẩu Tên chủ hộ Ngày sinh chủ hộ (dd/mm/yyyy) Mã hộ gia đình Số sổ hộ khẩu Mã số BHXH chủ hộ Quan hệ với chủ hộ (Vợ/Chồng/Bố/Mẹ/Anh/Chị/Con/Cháu/Ông/Bà/Cô/Dì/ Chú/Thím/Bác/Cậu/Mợ/Con dâu/Con rễ/Chắt) Số điện thoại chủ hộ + Địa chỉ thường trú Quốc gia (từ danh mục Quốc gia) Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã) Địa chỉ + Địa chỉ tạm trú Quốc gia (từ danh mục Quốc gia) Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã) Địa chỉ + Nơi cấp giấy khai sinh Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã Nhóm thông tin vị trí công tác Chức danh (từ danh mục Chức danh) Ngày hiệu lực của Chức danh (dd/mm/yyyy) Chức vụ (từ danh mục Chức vụ) Ngày hiệu lực của Chức vụ (dd/mm/yyyy) Khối/Phòng/Tổ/Nhóm (từ danh mục Khối/Phòng/Tổ/Nhóm) Địa điểm làm việc (từ danh mục Địa điểm làm việc mà Công ty đang có) Hình thức tính lương (Lương thời gian/Lương khoán cá nhân/Lương khoán theo nhóm) Hình thức lao động (Gián tiếp/Trực tiếp) Hình thức làm việc (Bán thời gian/Thử việc/Thời vụ/Chính thức) Khu vực bảo hiểm (từ KV1 đến KV4, theo quy định của Nhà nước làm cơ sở áp mức lương tối thiểu vùng) Ngạch lương (từ danh mục Ngạch lương) Bậc lương (từ danh mục bậc lương) Level theo Job grade (từ danh mục Level) Nhóm phụ cấp (từ danh mục Nhóm phụ cấp) Cost center (từ danh mục Cost center) Nhóm cơm (Có ăn cơm/Không ăn cơm) Kỹ năng tay nghề Hệ số tay nghề (tự nhập, chạy từ 0.1 đến vô cùng) Mô tả công việc (load mặc định từ danh mục Chức vụ đã thiết lập JD) Đối tượng phép (từ danh mục Đối tượng Phép, quy định phép năm định mức và các chính sách phép khác) Đối tượng chấm công (Không bắt buộc quẹt thẻ/Bắt buộc quẹt thẻ) Thông tin hợp đồng lao động Tổng lương (tự nhập) Lương cơ bản (xuất tự động từ danh mục thang bảng lương cùng vị trí chức danh kèm level đã cập nhật ở trên). Thưởng hiệu quả (thiết lập formula) Phụ cấp 01 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) Phụ cáp 02 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) … Phụ cấp 20 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) Thông tin bảo hiểm + Bảo hiểm xã hội (BHXH) Số sổ BHXH Ngày cấp sổ BHXH (dd/mm/yyyy) Ngày tham gia BHXH (dd/mm/yyyy) Nơi cấp sổ BHXH Nơi tham gia BHXH (đổ từ danh mục Tỉnh/Thành) + Bảo hiểm Y tế (BHYT) Số thẻ BHYT Ngày cấp thẻ BHYT (dd/mm/yyyy) Nơi đăng ký khám chữa bệnh (từ danh mục bệnh viện khám chữa bệnh của BHXH Việt Nam) Mã bệnh viện khám chữa bệnh (load tự động khi chọn Nơi đăng ký khám chữa bệnh) Thời gian đủ 5 năm liên tục + Bảo hiểm thất nghiệp (BHTN) Ngày tham gia BHTN (dd/mm/yyyy) Thời gian tham gia BHTN trước khi vào Công ty (tháng) Thông tin Tài khoản Phương thức thanh toán (Tiền mặt/Chuyển khoản) Ngân hàng chuyển khoản Chi nhánh ngân hàng/Phòng giao dịch Tên tài khoản Số tài khoản Thông tin có yếu tố người nước ngoài + Giấy phép lao động Số giấy phép Loại giấy phép Nơi cấp Ngày cấp (dd/mm/yyyy) Ngày hiệu lực (dd/mm/yyyy) Ngày hết hạn (dd/mm/yyyy) File đính kèm (.doc/docx, .gif, .jpeg) + Visa Tên Visa Số Visa Code Visa Loại Visa (Multiple/Single) Quốc gia (từ danh mục Quốc gia) + Thẻ cư trú Số giấy phép Loại Ngày cấp (dd/mm/yyyy) Nơi cấp Ngày bắt đầu (dd/mm/yyyy) Ngày kết thúc (dd/mm/yyyy) Thông tin người thân/Người phụ thuộc Tên người thân Loại quan hệ (Vợ/Chồng/Bố/Mẹ/Anh/Chị/Con/Cháu/Ông/Bà/Cô/Dì/ Chú/Thím/Bác/Cậu/Mợ/Con dâu/Con rễ/Chắt) Có làm cùng công ty (check mode) Giới tính (Nam/Nữ/Khác) Năm sinh (dd/mm/yyyy) Số CMND/CCCD Ngày cấp (dd/mm/yyyy) Nơi cấp (từ danh mục Tỉnh/Thành) Ngày hết hạn (dd/mm/yyyy) Quốc tịch Danh sách hồ sơ cần nộp (dựa theo Loại quan hệ) gồm: Giấy khai sinh/Giấy đăng ký kết hôn/Hộ khẩu/Xác nhận khuyết tật/CMND/CCCD Là người phụ thuộc (check mode) Tháng áp dụng tính phụ thuộc Tháng kết thúc tính phụ thuộc Mã số thuế người phụ thuộc Thông tin đào tạo trước khi vào Công ty Hình thức đào tạo (Tập trung/Từ xa) Hệ đào tạo (Chính quy/Tại chức) Đơn vị đào tạo Văn bằng/chứng chỉ Xếp loại Ngày tốt nghiệp (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Thông tin về trình độ ngoại ngữ Ngoại ngữ (từ danh mục ngoại ngữ) Kỹ năng nghe (Tốt/Khá/Trung bình/yếu) Kỹ năng nói (Tốt/Khá/Trung bình/yếu) Kỹ năng đọc (Tốt/Khá/Trung bình/yếu) Kỹ năng viết (Tốt/Khá/Trung bình/yếu) Cấp bậc (Starter/Pre-Intermediate/Intermediate/ Advance) Loại Văn bằng/Chứng chỉ Ngày cấp văn bằng/chứng chỉ (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Đơn vị đào tạo Thông tin về trình độ tin học Loại Văn bằng/Chứng chỉ Ngày cấp văn bằng/chứng chỉ (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Đơn vị đào tạo Kinh nghiệm làm việc trước khi vào Công ty Công ty Chức vụ Chức danh Số năm kinh nghiệm Thời gian giữ chức vụ (dd/mm/yyyy à dd/mm/yyyy) Mức lương theo từng chức vụ Kỹ năng mềm Kỹ năng Loại kỹ năng Cấp bậc Thông tin Đảng – Đoàn + Đảng Là Đảng viên (check mode) Ngày vào Đảng (dd/mm/yyyy) Ngày chính thức (dd/mm/yyyy) Số thẻ Đảng Chức vụ Đảng + Đoàn viên Là Đoàn viên (check mode) Ngày kết nạp (dd/mm/yyyy) Thông tin về đồng phục + Áo Size (từ danh mục size Áo) + Quần Size (từ danh mục size Quần) + Giày Size (từ danh mục size Giày) Thông tin khác Chiều cao (tự nhập nhưng đảm bảo tính thống kê) Cân nặng (tự nhập nhưng đảm bảo tính thống kê) Nhóm máu (từ danh mục nhóm máu) Loại phương tiện đi làm (Xe máy cá nhân/Ô tô cá nhân/Xe máy Công ty cấp/Xe Ô tô Công ty cấp/Xe buýt theo tuyến của Công ty)",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP02.02",
        "title": "Thông báo task đến các bộ phận",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "List task cần chuẩn bị cho quá trình Onboarding của nhân viên mới sẽ gửi về cho từng bộ phận liên quan, bao gồm: Thông tin ngày nhận việc của nhân viên mới (dd/mm/yyyy) Task list từng bộ phận cần chuẩn bị (từ danh mục chức vụ đã định nghĩa) Deadline đề nghị hoàn tất task list (dd/mm/yyyy) à Gửi mail thông báo task list cho các TBP liên quan",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP02.03",
        "title": "Cập nhật kết quả Task",
        "actor": "Bộ phận",
        "location": "Portal",
        "timing": "Sau khi hoàn thành xong task",
        "typeCode": "N",
        "description": "Từng bộ phận chủ động cập nhật kết quả hoàn thành task list hoặc deadline mới (nếu có), bao gồm: Task cần chuẩn bị Kết quả thực hiện (Done/Pending) Deadline mới, nếu Kết quả thực hiện là “Pending” à Gửi mail thông báo cho HRM-Tuyển dụng khi một task “done”",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP02.04",
        "title": "Truy vấn kết quả thực hiện task",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Bất kỳ thời điểm",
        "typeCode": "A",
        "description": "Tiến độ thực hiện task list của từng bộ phận được kiểm soát để đảm bảo đúng tiến độ hoàn thành đã đặt ra. Thông tin truy vấn gồm: Nhóm theo nhân viên mới Ngày nhận việc của nhân viên mới Bộ phận thực hiện task Task theo từng bộ phận Kết quả thực hiện task (Done/Pending) Deadline mới, nếu Kết quả thực hiện là “Pending”",
        "fieldsChecklist": [],
        "sourceRow": 5
      },
      {
        "stepCode": "EMP02.05",
        "title": "Cập nhật hồ sơ nhân viên",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Khi nhân viên đến nhận việc",
        "typeCode": "M",
        "description": "Thực hiện chuyển nhân viên chờ nhận việc sang hồ sơ nhân viên chính thức bằng cách cập nhật trường dữ liệu “Ngày vào làm” và lưu thông tin tại bước “Cập nhật danh sách nhân viên chờ nhận việc” vào Hồ sơ nhân viên.",
        "fieldsChecklist": [],
        "sourceRow": 6
      },
      {
        "stepCode": "EMP02.06",
        "title": "Giao mục tiệu KPI cho NV thử việc",
        "actor": "TBP",
        "location": "Portal",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "Bộ mục tiêu công việc trong thời gian thử việc được chuẩn bị trước khi nhân viên đến nhận việc, gồm: Nhân viên được giao bộ KPI Đầu mục công việc (từ danh mục KPI) Kết quả cần đạt được (tự cập nhật) Thời gian hoàn thành mong muốn (dd/mm/yyyy) à Gửi mail thông báo bộ mục tiêu KPI cho nhân viên",
        "fieldsChecklist": [],
        "sourceRow": 7
      },
      {
        "stepCode": "EMP02.07",
        "title": "Truy vấn mục tiêu KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi nhân viên đến nhận việc",
        "typeCode": "A",
        "description": "Nhân viên xem được mục tiêu được giao. Thông tin xem gồm: Đầu mục công việc được giao Mục tiêu cần đạt được Thời gian cần hoàn thành",
        "fieldsChecklist": [],
        "sourceRow": 8
      },
      {
        "stepCode": "EMP02.08",
        "title": "Thông báo danh sách nhân viên tham gia đào tạo hội nhập",
        "actor": "HRM-Đào tạo",
        "location": "Bên trong",
        "timing": "Sau khi nhân viên đến nhận việc",
        "typeCode": "M",
        "description": "Danh sách nhân viên mới được thông báo (*) đến bộ phận phụ trách đào tạo. Khoá đào tạo được tự động khởi tạo gồm các thông tin sau: Danh sách nhân viên Tên khoá đào tạo (từ danh mục Khoá đào tạo) Thời gian tổ chức (dd/mm/yyyy) Địa điểm tổ chức Giảng viên à (*) thông qua tính năng cảnh báo",
        "fieldsChecklist": [],
        "sourceRow": 9
      },
      {
        "stepCode": "EMP02.09",
        "title": "Cập nhật kết quả đào tạo hội nhập",
        "actor": "HRM-Đào tạo",
        "location": "Bên trong",
        "timing": "Sau khi kết thúc đào tạo",
        "typeCode": "M",
        "description": "Kết quả đào tạo được cập nhật vào chương trình, gồm các thông tin: Danh sách nhân viên tham gia đào tạo Khoá đào tạo Thời gian tổ chức (dd/mm/yyyy) Kết quả đào tạo (Điểm – Xếp loại) à Gửi mail thông báo kết quả đào tạo đến NV",
        "fieldsChecklist": [],
        "sourceRow": 10
      },
      {
        "stepCode": "EMP02.10",
        "title": "Cập nhật kết quả thực hiện KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Khi một mục tiêu cụ thể được hoàn thành",
        "typeCode": "M",
        "description": "Nhân viên chủ động cập nhật kết quả thực hiện mục tiêu, gồm các thông tin: Mục tiêu Kết quả thực hiện Thời gian hoàn thành à Gửi mail thông báo kết quả cập nhật đến TBP",
        "fieldsChecklist": [],
        "sourceRow": 11
      },
      {
        "stepCode": "EMP02.11",
        "title": "Đánh giá kết quả thực hiện KPI",
        "actor": "TBP",
        "location": "Portal",
        "timing": "Sau khi NV hoàn tất cập nhật kết quả thực hiện",
        "typeCode": "M",
        "description": "Hoàn thành tất cả các mục tiêu được giao và cập nhật hoàn tất, kết quả sẽ được TBP cùng với NV đánh giá lại, gồm: Mục tiêu được giao Kế hoạch giao Kết quả thực hiện Tỷ lệ hoàn thành mục tiêu Kết quả thử việc (Đạt/Không đạt) Hợp đồng lao động dự kiến sẽ ký (từ danh mục Loại hợp đồng lao động) Kết quả cuối cùng được TBP xác nhận là kết quả thử việc. Nếu kết quả là “Đạt” sẽ chuyển qua HRM-C&B ký hợp đồng lao động chính thức, ngược lại nếu kết quả là “không đạt” sẽ chuyển qua HRM-C&B làm thủ tục thanh lý hợp đồng. à Gửi mail thông báo kết quả đánh giá đến NV và HRM/HRD",
        "fieldsChecklist": [],
        "sourceRow": 12
      },
      {
        "stepCode": "EMP02.12",
        "title": "Truy vấn kết quả KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi TBP cập nhật kết quả",
        "typeCode": "A",
        "description": "Nhân viên có thể tham khảo kết quả đánh giá của họ, gồm các thông tin: Mục tiêu được giao Kế hoạch giao Kết quả thực hiện Tỷ lệ hoàn thành mục tiêu Kết quả đánh giá mục tiêu",
        "fieldsChecklist": [],
        "sourceRow": 13
      },
      {
        "stepCode": "EMP02.13",
        "title": "Ký hợp đồng lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi nhận được kết quả đánh giá từ TBP",
        "typeCode": "N",
        "description": "Từ thông tin của TBP với danh sách nhân viên có kết quả thử việc “Đạt” sẽ được lập hợp đồng lao động. Thông tin trên màn hình lập hợp đồng gồm: Danh sách nhân viên cần lập hợp đồng Mã nhân viên Chức vụ (từ profile nhân viên) Level của Job grade (từ profile nhân viên) Chức danh trên hợp đồng Phòng ban/Tổ/Nhóm (dùng để tạo hợp đồng hàng loạt) Loại hợp đồng lao động (theo danh mục Loại hợp đồng hiện có của Công ty) Số hợp đồng (tự sinh ra theo nguyên tắc thiết lập) Ngày bắt đầu (dd/mm/yyyy) Thời hạn hợp đồng Ngày kết thúc hợp đồng (dd/mm/yyyy) Ngày ký hợp đồng (dd/mm/yyyy) Ngạch lương Bậc lương Mức lương cơ bản (theo Chức danh và job grade) Nhóm phụ cấp (theo Chức danh và job grade) Người ký hợp đồng (từ danh mục Người ký hợp đồng)",
        "fieldsChecklist": [],
        "sourceRow": 14
      },
      {
        "stepCode": "EMP02.14",
        "title": "Thanh lý hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả đánh giá thử việc của TBP",
        "typeCode": "N",
        "description": "Từ thông tin của TBP, danh sách nhân viên có kết quả đánh giá “Không đạt” được gửi về các bộ phân xác nhận để làm thủ thanh lý hợp đồng. Màn hình thanh lý hợp đồng gồm các thông tin sau: Danh sách nhân viên nghỉ việc Phòng ban của nhân viên Danh sách các task cần hoàn tất trước khi nhân viên nghỉ việc, gồm: + Các trang thiết bị lao động nhân viên cần hoàn trả (dựa trên nghiệp vụ cấp phát trang thiết bị ở thời điểm nhân viên vào nhận việc) + Thẻ BHYT cần phải trả + Các khoản phải trả của nhân viên cần tất toán (các khoản tạm ứng, khoản vay,…) + Các công việc nhân viên cần bàn giao trước khi nghỉ việc (dựa trên check list bàn giao khi nghỉ việc) Sau khi bộ phận check “Done” các hạng mục trên, sẽ tiếp tục chuyển danh sách nhân viên hoàn tất thanh lý sang danh sách nhân viên chờ giảm lao động. à Gửi mail thông báo cho HRM-C&B những nhân viên “done” thủ tục thanh lý hợp đồng",
        "fieldsChecklist": [],
        "sourceRow": 15
      },
      {
        "stepCode": "EMP02.15",
        "title": "Giảm lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Nhân viên có kết quả thanh lý hợp đồng ở trạng thái “Done”",
        "typeCode": "N",
        "description": "Từ danh sách nhân viên hoàn tất thủ tục thanh lý, chọn nhân viên cần giảm lao động, cập nhật các thông tin gồm: Ngày nộp đơn xin nghỉ việc Ngày mong muốn nghỉ việc Hợp đồng lao động hiện tại Số ngày chênh lệch so với quy định (= Ngày mong muốn nghỉ việc - Ngày nộp đơn xin nghỉ việc). Nếu số ngày này > 3 (lao động thời vụ), 30 (hợp đồng có xác định thời hạn) hoặc 45 (hợp đồng không xác định thời hạn) thì không vi phạm. Ngày nghỉ việc được duyệt Mức trợ cấp thôi việc được hưởng (Mỗi năm làm việc được ½ tháng lương, là lương bình quân của 6 tháng liền kề trước khi nghỉ việc. Thời gian hưởng Bảo hiểm thất nghiệp thì không được tính trợ cấp thôi việc) Nếu vi phạm Số ngày chênh lệch so với quy định thì: Không thanh toán trợ cấp thôi việc (check mode, default check) Mức bồi thường số ngày vi phạm báo trước (= Số ngày vi phạm * Đơn giá 1 ngày lương) Mức bồi thường chi phí đào tạo (dựa theo quy định trong Hợp đồng đào tạo để tính ra mức phí này) Có giữ lương (check mode) Kỳ thanh toán lương nghỉ việc (7 ngày sau khi hoàn tất thủ tục nghỉ việc/Tính vào cuối kỳ lương hoặc xác định kỳ tính lương cụ thể nếu đã check vào mode Có giữ lương. Các thông tin này người dùng chủ động nhập hoặc load theo thông tin đã thiết lập trước đó) Đưa vào danh sách đen (check mode) Số quyết định nghỉ việc Ngày ra quyết định à In Quyết định nghỉ việc",
        "fieldsChecklist": [],
        "sourceRow": 16
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-03",
    "sopTitle": "Lưu đồ quy trình tăng nhân viên từ nhân viên cũ không qua tuyển dụng (lấy lại mã nhân viên cũ)",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP03.01",
        "title": "Cập nhật danh sách nhân viên chờ nhận việc",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "Màn hình danh sách nhân viên chờ nhận việc à chọn “Kế thừa từ nhân viên cũ” à Chọn nhân viên cũ cần kế thừa à Cập nhật tiếp các thông tin như ở bước EMP01.01",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP03.02",
        "title": "Thông báo task đến các bộ phận",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "List task cần chuẩn bị cho quá trình Onboarding của nhân viên mới sẽ gửi về cho từng bộ phận liên quan, bao gồm: Thông tin ngày nhận việc của nhân viên mới (dd/mm/yyyy) Task list từng bộ phận cần chuẩn bị (từ danh mục chức vụ đã định nghĩa) Deadline đề nghị hoàn tất task list (dd/mm/yyyy) à Gửi mail về cho các TBP task list cần chuẩn bị",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP03.03",
        "title": "Cập nhật kết quả Task",
        "actor": "Bộ phận",
        "location": "Bên trong",
        "timing": "Sau khi hoàn thành xong task",
        "typeCode": "N",
        "description": "Từng bộ phận chủ động cập nhật kết quả hoàn thành task list hoặc deadline mới (nếu có), bao gồm: Task cần chuẩn bị Kết quả thực hiện (Done/Pending) Deadline mới, nếu Kết quả thực hiện là “Pending” à Gửi mail cho HRM-Tuyển dụng các task có trạng thái “done”",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP03.04",
        "title": "Truy vấn kết quả thực hiện task",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Bất kỳ thời điểm",
        "typeCode": "A",
        "description": "Tiến độ thực hiện task list của từng bộ phận được kiểm soát để đảm bảo đúng tiến độ hoàn thành đã đặt ra. Thông tin truy vấn gồm: Nhóm theo nhân viên mới Ngày nhận việc của nhân viên mới Bộ phận thực hiện task Task theo từng bộ phận Kết quả thực hiện task (Done/Pending) Deadline mới, nếu Kết quả thực hiện là “Pending”",
        "fieldsChecklist": [],
        "sourceRow": 5
      },
      {
        "stepCode": "EMP03.05",
        "title": "Cập nhật hồ sơ nhân viên",
        "actor": "HRM-Tuyển dụng",
        "location": "Bên trong",
        "timing": "Khi nhân viên đến nhận việc",
        "typeCode": "M",
        "description": "Thực hiện chuyển nhân viên chờ nhận việc sang hồ sơ nhân viên chính thức bằng cách cập nhật trường dữ liệu “Ngày vào làm” và lưu thông tin tại bước “Cập nhật danh sách nhân viên chờ nhận việc” vào Hồ sơ nhân viên.",
        "fieldsChecklist": [],
        "sourceRow": 6
      },
      {
        "stepCode": "EMP03.06",
        "title": "Giao mục tiệu KPI cho NV thử việc",
        "actor": "TBP",
        "location": "Bên trong",
        "timing": "Trước khi nhân viên đến nhận việc",
        "typeCode": "N",
        "description": "Bộ mục tiêu công việc trong thời gian thử việc được chuẩn bị trước khi nhân viên đến nhận việc, gồm: Nhân viên được giao bộ KPI Đầu mục công việc (từ danh mục KPI) Kết quả cần đạt được Thời gian hoàn thành mong muốn (dd/mm/yyyy) à Gửi mail thông báo bộ mục tiêu KPI cho NV",
        "fieldsChecklist": [],
        "sourceRow": 7
      },
      {
        "stepCode": "EMP03.07",
        "title": "Truy vấn mục tiêu KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi nhân viên đến nhận việc",
        "typeCode": "A",
        "description": "Nhân viên xem được mục tiêu được giao. Thông tin xem gồm: Đầu mục công việc được giao Mục tiêu cần đạt được Thời gian cần hoàn thành",
        "fieldsChecklist": [],
        "sourceRow": 8
      },
      {
        "stepCode": "EMP03.08",
        "title": "Thông báo danh sách nhân viên tham gia đào tạo hội nhập",
        "actor": "HRM-Đào tạo",
        "location": "Bên trong",
        "timing": "Sau khi nhân viên đến nhận việc",
        "typeCode": "M",
        "description": "Danh sách nhân viên mới được thông báo (*) đến bộ phận phụ trách đào tạo. Khoá đào tạo được tự động khởi tạo gồm các thông tin sau: Danh sách nhân viên Tên khoá đào tạo (từ thiết lập khoá đào tạo bắt buộc ở danh mục Chức danh công việc) Thời gian tổ chức (dd/mm/yyyy) Địa điểm tổ chức Giảng viên (*) thông qua màn hình cảnh báo",
        "fieldsChecklist": [],
        "sourceRow": 9
      },
      {
        "stepCode": "EMP03.09",
        "title": "Cập nhật kết quả đào tạo hội nhập",
        "actor": "HRM-Đào tạo",
        "location": "Bên trong",
        "timing": "Sau khi kết thúc đào tạo",
        "typeCode": "M",
        "description": "Kết quả đào tạo được cập nhật vào chương trình, gồm các thông tin: Danh sách nhân viên tham gia đào tạo Khoá đào tạo Thời gian tổ chức (dd/mm/yyyy) Kết quả đào tạo (Điểm – Xếp loại) à Gửi mail thông báo kết quả đào tạo cho nhân viên và TBP",
        "fieldsChecklist": [],
        "sourceRow": 10
      },
      {
        "stepCode": "EMP03.10",
        "title": "Cập nhật kết quả thực hiện KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Khi một mục tiêu cụ thể được hoàn thành",
        "typeCode": "M",
        "description": "Nhân viên chủ động cập nhật kết quả thực hiện mục tiêu, gồm các thông tin: Mục tiêu Kết quả thực hiện Thời gian hoàn thành thực tế à Gửi email thông báo cho TBP các mục tiêu hoàn thành",
        "fieldsChecklist": [],
        "sourceRow": 11
      },
      {
        "stepCode": "EMP03.11",
        "title": "Đánh giá kết quả thực hiện KPI",
        "actor": "TBP",
        "location": "Portal",
        "timing": "Sau khi NV hoàn tất cập nhật kết quả thực hiện",
        "typeCode": "M",
        "description": "Khi cập nhật hoàn tất kết quả các mục tiêu thì TBP cùng với NV đánh giá lại, gồm: Mục tiêu được giao Kế hoạch giao Kết quả thực hiện Tỷ lệ hoàn thành mục tiêu Kết quả thử việc (Đạt/Không đạt) Kết quả cuối cùng được TBP xác nhận là kết quả thử việc. Nếu kết quả là “Đạt” sẽ chuyển qua HRM-C&B ký hợp đồng lao động chính thức, ngược lại nếu kết quả là “không đạt” sẽ chuyển qua HRM-C&B làm thủ tục thanh lý hợp đồng. à Gửi mail thông báo kết quả đánh giá cho NV và HRM/HRD",
        "fieldsChecklist": [],
        "sourceRow": 12
      },
      {
        "stepCode": "EMP03.12",
        "title": "Truy vấn kết quả KPI",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi TBP cập nhật kết quả",
        "typeCode": "A",
        "description": "Nhân viên có thể tham khảo kết quả đánh giá của họ, gồm các thông tin: Mục tiêu được giao Kế hoạch giao Kết quả thực hiện Tỷ lệ hoàn thành mục tiêu",
        "fieldsChecklist": [],
        "sourceRow": 13
      },
      {
        "stepCode": "EMP03.13",
        "title": "Ký hợp đồng lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi nhận được kết quả đánh giá từ TBP",
        "typeCode": "N",
        "description": "Từ thông tin của TBP, với danh sách nhân viên có kết quả thử việc “Đạt” sẽ được lập hợp đồng lao động. Thông tin màn hình lập hợp đồng gồm: Danh sách nhân viên cần lập hợp đồng (auto từ kết quả đánh giá “Đạt”) Chức vụ (theo profile) Level của Job grade (theo profile) Chức danh trên hợp đồng (theo Chức danh trong profile) Phòng ban/Tổ/Nhóm (dùng để tạo hợp đồng hàng loạt) Loại hợp đồng lao động (theo danh mục Loại hợp đồng hiện có của Công ty) Số hợp đồng (tự sinh ra theo nguyên tắc thiết lập) Ngày bắt đầu (dd/mm/yyyy) Thời hạn hợp đồng Ngày kết thúc hợp đồng (dd/mm/yyyy) Ngày ký hợp đồng (dd/mm/yyyy) Ngạch lương Bậc lương Mức lương cơ bản (theo Chức danh và job grade) Nhóm phụ cấp (theo Chức danh và job grade) Người ký hợp đồng (từ danh mục Người ký hợp đồng) à Gửi email đến NV thông báo ký hợp đồng và đính kèm file hợp đồng à In hợp đồng",
        "fieldsChecklist": [],
        "sourceRow": 14
      },
      {
        "stepCode": "EMP03.14",
        "title": "Thanh lý hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả đánh giá thử việc của TBP",
        "typeCode": "N",
        "description": "Danh sách nhân viên nghỉ việc được gửi về các bộ phân xác nhận để làm thủ thanh lý hợp đồng, cụ thể gồm các thông tin: Danh sách nhân viên nghỉ việc Phòng ban của nhân viên Danh sách các task cần hoàn tất trước khi nhân viên nghỉ việc, gồm: + Các trang thiết bị lao động nhân viên cần hoàn trả (dựa trên nghiệp vụ cấp phát trang thiết bị ở thời điểm nhân viên vào nhận việc) + Thẻ BHYT cần phải trả + Các khoản phải trả của nhân viên cần tất toán (các khoản tạm ứng, khoản vay,…) + Các công việc nhân viên cần bàn giao trước khi nghỉ việc (dựa trên check list bàn giao khi nghỉ việc) Sau khi bộ phận check “Done” các hạng mục trên, sẽ tiếp tục chuyển danh sách nhân viên hoàn tất thanh lý sang danh sách nhân viên chờ giảm lao động. à Gửi email thông báo cho HRM-C&B các task có trạng thái “done” à In form thanh lý hợp đồng",
        "fieldsChecklist": [],
        "sourceRow": 15
      },
      {
        "stepCode": "EMP03.15",
        "title": "Giảm lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Nhân viên có kết quả thanh lý hợp đồng ở trạng thái “Done”",
        "typeCode": "N",
        "description": "Từ danh sách nhân viên hoàn tất thủ tục thanh lý, chọn nhân viên cần giảm lao động, cập nhật các thông tin gồm: Ngày nộp đơn xin nghỉ việc Ngày mong muốn nghỉ việc Hợp đồng lao động hiện tại Số ngày chênh lệch so với quy định (= Ngày mong muốn nghỉ việc - Ngày nộp đơn xin nghỉ việc). Nếu số ngày này > 3 (lao động thời vụ), 30 (hợp đồng có xác định thời hạn) hoặc 45 (hợp đồng không xác định thời hạn) thì không vi phạm. Ngày nghỉ việc được duyệt Mức trợ cấp thôi việc được hưởng (Mỗi năm làm việc được ½ tháng lương, là lương bình quân của 6 tháng liền kề trước khi nghỉ việc. Thời gian hưởng Bảo hiểm thất nghiệp thì không được tính trợ cấp thôi việc) Nếu vi phạm Số ngày chênh lệch so với quy định thì: Không thanh toán trợ cấp thôi việc (check mode, default check) Mức bồi thường số ngày vi phạm báo trước (= Số ngày vi phạm * Đơn giá 1 ngày lương) Mức bồi thường chi phí đào tạo (dựa theo quy định trong Hợp đồng đào tạo để tính ra mức phí này) Có giữ lương (check mode) Kỳ thanh toán lương nghỉ việc (7 ngày kề từ ngày hoàn tất thanh lý/Cuối kỳ lương/Kỳ tính và trr lương khác nếu đã check vào mode Có giữ lương. Thông tin này người dùng chủ động nhập hoặc load theo thông tin đã thiết lập trước đó) Đưa vào danh sách đen (check mode) Số quyết định nghỉ việc Ngày ra quyết định à In Quyết định nghỉ việc (file word)",
        "fieldsChecklist": [],
        "sourceRow": 16
      }
    ]
  }
],
  'LIFE-02': [
  {
    "sopCode": "SOP-EMP-04",
    "sopTitle": "Quy trình quản lý thông tin nhân viên",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP04.01",
        "title": "Đề xuất thay đổi thông tin profile",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi profile được cập nhật vào chương trình",
        "typeCode": "M",
        "description": "Các nhóm thông tin trong profile của nhân viên có hai dạng: (*) là thông tin nhân viên không thể tự điều chỉnh Các thông tin còn lại NV có thể chủ động truy xuất và đề xuất thay đổi hoặc điều chỉnh. Cụ thể: Nhóm thông tin cá nhân Tên nhân viên (*) Mã nhân viên (*) Tên tiếng Anh Là người nước ngoài (check mode, mặc định không check) (*) Tên thường gọi Ngày vào làm (dd/mm/yyyy) (*) Ngày tính thâm niên (dd/mm/yyyy) (*) Thời gian thử việc (7-30-60 ngày – Khác, tự gõ vào) (*) Ngày kết thúc thử việc (dd/mm/yyyy) Ngày sinh (dd/mm/yyyy) Nơi sinh (danh mục Tỉnh/Thành) Nguyên quán (danh mục Tỉnh/Thành) Giới tính (Nam/Nữ/Khác) Mã số thuế PIT Số CMND/CCCD (9 hoặc 12 số) Ngày cấp CMND/CCCD (dd/mm/yyyy) Nơi cấp CMND/CCCD (danh mục Tỉnh/Thành) Số Hộ chiếu Ngày cấp Hộ chiếu (dd/mm/yyyy) Ngày hết hạn Hộ chiếu (dd/mm/yyyy) Nơi cấp Hộ chiếu (danh mục Tỉnh/Thành) Tình trạng hôn nhân (Độc thân/Đã kết hôn/Ly hôn/Quá phụ/Quá vợ/Ly thân) Dân tộc (từ danh mục Dân tộc) Tôn giáo (từ danh mục Tôn giáo) Trình độ Văn hoá (1/12 à 12/12) Trình độ Học vấn (Tiểu học/Trung học cơ sở/Trung học phổ thông/Trung cấp/Cao đẵng/Đại học/Thạc sĩ/Tiến sĩ/Phó Giáo sư/Giáo sư) Chuyên ngành (từ danh mục chuyên ngành của Công ty đang có) Nhóm thông tin liên hệ + Thông tin liên hệ khẩn cấp: Địa chỉ Email Số mobile Người liên hệ khẩn cấp Số mobile người liên hệ khẩn cấp Mối quan hệ Địa chỉ Email người liên hệ khẩn cấp + Thông tin Hộ khẩu Tên chủ hộ Ngày sinh chủ hộ (dd/mm/yyyy) Mã hộ gia đình Số sổ hộ khẩu Mã số BHXH chủ hộ Quan hệ với chủ hộ (Vợ/Chồng/Bố/Mẹ/Anh/Chị/Con/Cháu/Ông/Bà/Cô/Dì/ Chú/Thím/Bác/Cậu/Mợ/Con dâu/Con rễ/Chắt) Số điện thoại chủ hộ + Địa chỉ thường trú Quốc gia (từ danh mục Quốc gia) Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã) Địa chỉ + Địa chỉ tạm trú Quốc gia (từ danh mục Quốc gia) Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã) Địa chỉ + Nơi cấp giấy khai sinh Tỉnh/Thành (từ danh mục Tỉnh/Thành) Quận/Huyện (từ danh mục Quận/Huyện) Phường/Xã (từ danh mục Phường/Xã Nhóm thông tin vị trí công tác Chức danh (từ danh mục Chức danh) (*) Ngày hiệu lực của Chức danh (dd/mm/yyyy) (*) Chức vụ (từ danh mục Chức vụ) (*) Ngày hiệu lực của Chức vụ (dd/mm/yyyy) (*) Khối/Phòng/Tổ/Nhóm (từ danh mục Khối/Phòng/Tổ/Nhóm) (*) Địa điểm làm việc (từ danh mục Địa điểm làm việc mà Công ty đang có) Hình thức tính lương (Lương thời gian/Lương khoán cá nhân/Lương khoán theo nhóm) Hình thức lao động (Gián tiếp/Trực tiếp) Hình thức làm việc (Bán thời gian/Thử việc/Thời vụ/Chính thức) Khu vực bảo hiểm (từ KV1 đến KV4, theo quy định của Nhà nước làm cơ sở áp mức lương tối thiểu vùng) Ngạch lương (từ danh mục Ngạch lương) (*) Bậc lương (từ danh mục bậc lương) (*) Level theo Job grade (từ danh mục Level) (*) Nhóm phụ cấp (từ danh mục Nhóm phụ cấp) (*) Cost center (từ danh mục Cost center) Nhóm cơm (Có ăn cơm/Không ăn cơm) Kỹ năng tay nghề (từ danh mục kỹ năng tay nghề) Hệ số tay nghề (tự nhập, chạy từ 0.1 đến vô cùng) (*) Mô tả công việc (load mặc định từ danh mục Chức vụ đã thiết lập JD) (*) Đối tượng phép (từ danh mục Đối tượng Phép, quy định phép năm định mức và các chính sách phép khác) Đối tượng chấm công (Không bắt buộc quẹt thẻ/Bắt buộc quẹt thẻ) Thông tin hợp đồng lao động Tổng lương (tự nhập) Lương cơ bản (xuất tự động từ danh mục thang bảng lương cùng vị trí chức danh kèm level đã cập nhật ở trên) (*) Thưởng hiệu quả (thiết lập formula) (*) Phụ cấp 01 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) (*) Phụ cáp 02 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) (*) … Phụ cấp 20 (là một khoản phụ cấp riêng cho cá nhân ở vị trí này) (*) Thông tin bảo hiểm + Bảo hiểm xã hội (BHXH) Số sổ BHXH Ngày cấp sổ BHXH (dd/mm/yyyy) Ngày tham gia BHXH (dd/mm/yyyy) Nơi cấp sổ BHXH Nơi tham gia BHXH (đổ từ danh mục Tỉnh/Thành) + Bảo hiểm Y tế (BHYT) Số thẻ BHYT Ngày cấp thẻ BHYT (dd/mm/yyyy) Nơi đăng ký khám chữa bệnh (từ danh mục bệnh viện khám chữa bệnh của BHXH Việt Nam) Mã bệnh viện khám chữa bệnh (load tự động khi chọn Nơi đăng ký khám chữa bệnh) Thời gian đủ 5 năm liên tục + Bảo hiểm thất nghiệp (BHTN) Ngày tham gia BHTN (dd/mm/yyyy) Thời gian tham gia BHTN trước khi vào Công ty (tháng) Thông tin Tài khoản Phương thức thanh toán (Tiền mặt/Chuyển khoản) Ngân hàng chuyển khoản Chi nhánh ngân hàng/Phòng giao dịch Tên tài khoản Số tài khoản Thông tin có yếu tố người nước ngoài + Giấy phép lao động Số giấy phép Loại giấy phép Nơi cấp Ngày cấp (dd/mm/yyyy) Ngày hiệu lực (dd/mm/yyyy) Ngày hết hạn (dd/mm/yyyy) File đính kèm (.docx, .gif, .jpeg) + Visa Tên Visa Số Visa Code Visa Loại Visa (Multiple/Single) Quốc gia (từ danh mục Quốc gia) + Thẻ cư trú Số giấy phép Loại Ngày cấp (dd/mm/yyyy) Nơi cấp Ngày bắt đầu (dd/mm/yyyy) Ngày kết thúc (dd/mm/yyyy) Thông tin người thân/Người phụ thuộc Tên người thân Loại quan hệ (Vợ/Chồng/Bố/Mẹ/Anh/Chị/Con/Cháu/Ông/Bà/Cô/Dì/ Chú/Thím/Bác/Cậu/Mợ/Con dâu/Con rễ/Chắt) Có làm cùng công ty (check mode) Giới tính (Nam/Nữ/Khác) Năm sinh (dd/mm/yyyy) Số CMND/CCCD Ngày cấp (dd/mm/yyyy) Nơi cấp (từ danh mục Tỉnh/Thành) Ngày hết hạn (dd/mm/yyyy) Quốc tịch Danh sách hồ sơ cần nộp (dựa theo Loại quan hệ) gồm: Giấy khai sinh/Giấy đăng ký kết hôn/Hộ khẩu/Xác nhận khuyết tật/CMND/CCCD Là người phụ thuộc (check mode) Tháng áp dụng tính phụ thuộc Tháng kết thúc tính phụ thuộc Mã số thuế người phụ thuộc Thông tin đào tạo trước khi vào Công ty Hình thức đào tạo (Tập trung/Từ xa) Hệ đào tạo (Chính quy/Tại chức) Đơn vị đào tạo Văn bằng/chứng chỉ Xếp loại Ngày tốt nghiệp (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Thông tin về trình độ ngoại ngữ Ngoại ngữ (từ danh mục ngoại ngữ) Kỹ năng nghe (Tốt/Khá/Trung bình/yếu) Kỹ năng nói (Tốt/Khá/Trung bình/yếu) Kỹ năng đọc (Tốt/Khá/Trung bình/yếu) Kỹ năng viết (Tốt/Khá/Trung bình/yếu) Cấp bậc (Starter/Pre-Intermediate/Intermediate/ Advance) Loại Văn bằng/Chứng chỉ Ngày cấp văn bằng/chứng chỉ (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Đơn vị đào tạo Thông tin về trình độ tin học Loại Văn bằng/Chứng chỉ Ngày cấp văn bằng/chứng chỉ (dd/mm/yyyy) Ngày hết hạn chứng chỉ (dd/mm/yyyy) Đơn vị đào tạo Kinh nghiệm làm việc trước khi vào Công ty Công ty Chức vụ Chức danh Số năm kinh nghiệm Thời gian giữ chức vụ (dd/mm/yyyy à dd/mm/yyyy) Mức lương theo từng chức vụ Kỹ năng mềm Kỹ năng Loại kỹ năng Cấp bậc Thông tin Đảng – Đoàn + Đảng Là Đảng viên (check mode) Ngày vào Đảng (dd/mm/yyyy) Ngày chính thức (dd/mm/yyyy) Số thẻ Đảng Chức vụ Đảng + Đoàn viên Là Đoàn viên (check mode) Ngày kết nạp (dd/mm/yyyy) Thông tin về đồng phục + Áo Size (từ danh mục size Áo) + Quần Size (từ danh mục size Quần) + Giày Size (từ danh mục size Giày) Thông tin khác Chiều cao (tự nhập nhưng đảm bảo tính thống kê) Cân nặng (tự nhập nhưng đảm bảo tính thống kê) Nhóm máu (từ danh mục nhóm máu) Loại phương tiện đi làm (Xe máy cá nhân/Ô tô cá nhân/Xe máy Công ty cấp/Xe Ô tô Công ty cấp/Xe buýt theo tuyến của Công ty) à Gửi mail các đề xuất này về HRM",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP04.02",
        "title": "Duyệt đề xuất thay đổi thông tin profile",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi nhận được đề xuất của nhân viên",
        "typeCode": "M",
        "description": "Các trường thông tin duyệt gồm: Thông tin cũ Thông tin mới File đính kèm theo từng thông tin (file ảnh) Thông tin đề xuất của NV được xét duyệt: Nếu chính xác sẽ được cập nhật vào profile Nếu không chính xác sẽ thông báo cho nhân viên và không lưu trong profile. à Gửi mail thông báo kết quả thay đổi thông tin profile",
        "fieldsChecklist": [],
        "sourceRow": 3
      }
    ]
  }
],
  'LIFE-04': [
  {
    "sopCode": "SOP-EMP-05",
    "sopTitle": "Quy trình tái ký hợp đồng lao động",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP05.01",
        "title": "Cảnh báo danh sách nhân viên sắp hết hạn hợp đồng lao động",
        "actor": "HRM-C&B/ TBP/NV",
        "location": "Bên trong",
        "timing": "Trước thời hạn kết thúc hợp đồng lao động x ngày",
        "typeCode": "A",
        "description": "Từng loại hợp đồng lao động, thiết lập thời gian cảnh báo trước x ngày so với thời gian kết thúc hợp đồng. Thông tin của màn hình xuất cảnh báo gồm: Nhân viên sắp hết hạn hợp đồng lao động Phòng/Tổ/Nhóm Loại hợp đồng lao động sắp đến hạn (load thông tin từ hợp đồng lao động hiện có của từng nhân viên) Số hợp đồng lao động sắp đến hạn Ngày ký của hợp đồng sắp đến hạn Thời gian hết hạn hợp đồng lao động sắp đến hạn (load thông tin từ Hợp đồng lao động hiện có) Chức danh Chức vụ Ngạch lương hiện tại Bậc lương hiện tại Bộ phụ cấp hiện tại Kết quả đánh giá performance của năm trong thời gian của hợp đồng đến hạn (ví dụ: hợp đồng 3 năm thì kết quả đánh giá performance của 3 năm đó) Lịch sử khen thưởng trong thời hạn hợp đồng sắp đến hạn Lịch sử kỷ luật trong thời hạn hợp đồng sắp đến hạn à Email thông báo đính kèm danh sách nhân viên như trên",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP05.02",
        "title": "Cập nhật kết quả đánh giá hợp đồng lao động",
        "actor": "TBP/NV",
        "location": "Portal",
        "timing": "Sau khi đánh giá NV",
        "typeCode": "N",
        "description": "Từ danh sách cảnh báo nhân viên ở bước EMP05.01, TBP sắp xếp thời gian ngồi cùng NV để đánh giá tái ký hợp đồng. Kết quả đánh giá được cập nhật lại vào chương trình. Màn hình cập nhật kết quả đánh giá gồm các thông tin sau: Tên nhân viên Số hợp đồng lao động đến hạn Kết quả đánh giá hợp đồng (chọn trạng thái Tái ký hoặc Không tái ký) Hợp đồng tái ký kế tiếp (từ danh mục loại hợp đồng. Thông tin này chỉ nhập được trong trường hợp chọn trạng thái là “Tái ký” ở trường thông tin “Kết quả đánh giá hợp đồng lao động”). Ngày bắt đầu ký tiếp hợp đồng (dd/mm/yyyy, default = Ngày kết thúc hợp đồng + 1). Thông tin này chỉ có khi “Kết quả đánh giá hợp đồng” là “Tái ký” à Email thông báo kết quả đánh giá đến HRM/HRD và nhân viên HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP05.03",
        "title": "Tham vấn với HRM/ HRD",
        "actor": "HRM/ HRD",
        "location": "Bên trong",
        "timing": "Sau khi nhận được mail của TBP",
        "typeCode": "N",
        "description": "Kết quả đánh giá của TBP được chuyển về HRM/HRD tham vấn (ví dụ cần tham vấn về vấn đề pháp luật trong trường hợp không tái ký hợp đồng hoặc liên quan đến thu nhập điều chỉnh sau khi tái ký, loại hợp đồng ký tiếp,…)",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP05.03",
        "title": "Lập hợp đồng lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi có kết quả đánh giá từ TBP",
        "typeCode": "N",
        "description": "Nhân viên có trạng thái đánh giá hợp đồng là “Tái ký” sẽ được thực hiện ký tiếp hợp đồng mới. Thông tin màn hình tạo mới hợp đồng lao động gồm: Tên nhân viên Phòng ban/Tổ/Nhóm hiện tại Chức vụ hiện tại Chức danh hiện tại Ngạch lương mới (nếu có, chọn từ danh mục Ngạch lương; nếu không thì load Ngạch lương hiện tại) Bậc lương mới (nếu có, chọn từ danh mục Bậc lương; nếu không thì load Bậc lương hiện tại) Bộ phụ cấp mới (nếu có, chọn từ danh mục Nhóm phụ cấp; nếu không thì load Nhóm phụ cấp hiện tại) Mức lương cơ bản mới (nếu có, chương trình auto; nếu không thì load mức lương hiện tại) Loại hợp đồng mới (default theo bước EMP05.02) Thời hạn hợp đồng (auto theo Loạ hợp đồng, gồm 12 tháng/24 tháng/36 tháng/ Không xác định thời hạn) Ngày ký hợp đồng mới (dd/mm/yyyy) Ngày hiệu lực của hợp đồng mới (dd/mm/yyyy) Số hợp đồng mới (chương trình auto) Ngày kết thúc hợp đồng mới (chương trình auto, = Ngày hiệu lực hợp đồng mới + Thời hạn của hợp đồng mới) à Gửi mail đính kèm file Hợp đồng mới cho nhân viên à In hợp đồng",
        "fieldsChecklist": [],
        "sourceRow": 5
      },
      {
        "stepCode": "EMP05.04",
        "title": "Truy vấn thông tin hợp đồng",
        "actor": "NV",
        "location": "Portal",
        "timing": "Khi HRM-C&B hoàn tất bước lập hợp đồng",
        "typeCode": "A",
        "description": "Nhân viên review qua thông tin trên hợp đồng mới, thông tin chưa rõ sẽ trao đổi trực tiếp với HRM-C&B. Thông tin trên màn hình review gồm: Tên nhân viên Phòng ban/Tổ/Nhóm hiện tại Chức vụ hiện tại Chức danh hiện tại Ngạch lương mới (nếu có) Bậc lương mới (nếu có) Bộ phụ cấp mới (nếu có) Mức lương cơ bản mới (nếu có) Loại hợp đồng mới Thời hạn hợp đồng (auto theo Loại hợp đồng, gồm 12 tháng/24 tháng/36 tháng/ Không xác định thời hạn) Ngày ký hợp đồng mới (dd/mm/yyyy) Ngày hiệu lực của hợp đồng mới (dd/mm/yyyy) Số hợp đồng mới (chương trình auto) Ngày kết thúc hợp đồng mới (chương trình auto, = Ngày hiệu lực hợp đồng mới + Thời hạn của hợp đồng mới)",
        "fieldsChecklist": [],
        "sourceRow": 6
      },
      {
        "stepCode": "EMP05.05",
        "title": "Thanh lý hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả đánh giá thử việc của TBP",
        "typeCode": "N",
        "description": "HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 7
      },
      {
        "stepCode": "EMP05.06",
        "title": "Giảm lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Nhân viên có kết quả thanh lý hợp đồng ở trạng thái “Done”",
        "typeCode": "N",
        "description": "HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 8
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-06",
    "sopTitle": "Quy trình ký hợp đồng với nhân viên mới",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP06.01",
        "title": "Danh sách nhân viên pass probation",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả đánh giá thử việc từ TBP",
        "typeCode": "A",
        "description": "Danh sách nhân viên có kết quả đánh giá thử việc là “Đạt” (tham khảo bước EMP02.11 ở trên). Thông tin trên danh sách gồm: Tên nhân viên Phòng/Tổ/Nhóm Chức danh Chức vụ Loại hợp đồng đề xuất ký mới Kết quả đánh giá thử việc (Đạt) Thời gian thử việc từ (dd/mm/yyyy) Thời gian thử việc đến (dd/mm/yyyy)",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP06.02",
        "title": "Danh sách nhân viên chính thức chưa có hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi nhập profile nhân viên",
        "typeCode": "A",
        "description": "Danh sách nhân viên có Hình thức làm việc trong profile là “Chính thức” nhưng chưa có hợp đồng lao động. Thông tin trên danh sách gồm: Nhân viên Phòng ban/Tổ/Nhóm Ngày vào làm Chức danh Chức vụ",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP06.03",
        "title": "Lập hợp đồng lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi có nhân viên tồn tại trong hai danh sách ở trên",
        "typeCode": "N",
        "description": "Chọn nhân viên từ hai danh sách trên để thực hiện ký hợp đồng mới. Thông tin màn hình tạo mới hợp đồng lao động gồm: Tên nhân viên Phòng ban/Tổ/Nhóm hiện tại Chức vụ hiện tại Chức danh hiện tại Ngạch lương mới (nếu có, chọn từ danh mục Ngạch lương; nếu không thì load Ngạch lương hiện tại) Bậc lương mới (nếu có, chọn từ danh mục Bậc lương; nếu không thì load Bậc lương hiện tại) Bộ phụ cấp mới (nếu có, chọn từ danh mục Nhóm phụ cấp; nếu không thì load Nhóm phụ cấp hiện tại) Mức lương cơ bản mới (nếu có, chương trình auto; nếu không thì load mức lương hiện tại) Loại hợp đồng mới Thời hạn hợp đồng (auto theo Loại hợp đồng, gồm 12 tháng/24 tháng/36 tháng/ Không xác định thời hạn) Ngày ký hợp đồng mới (dd/mm/yyyy) Ngày hiệu lực của hợp đồng mới (dd/mm/yyyy) Số hợp đồng mới (chương trình auto) Ngày kết thúc hợp đồng mới (chương trình auto, = Ngày hiệu lực hợp đồng mới + Thời hạn của hợp đồng mới) à Gửi mail đính kèm file Hợp đồng mới cho nhân viên à In hợp đồng",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP06.04",
        "title": "Truy vấn thông tin hợp đồng",
        "actor": "NV",
        "location": "Portal",
        "timing": "Khi HRM-C&B hoàn tất bước lập hợp đồng",
        "typeCode": "A",
        "description": "Nhân viên review thông tin trên hợp đồng mới, thông tin chưa rõ sẽ trao đổi trực tiếp với HRM-C&B. Thông tin trên màn hình review gồm: Tên nhân viên Phòng ban/Tổ/Nhóm hiện tại Chức vụ hiện tại Chức danh hiện tại Ngạch lương mới (nếu có) Bậc lương mới (nếu có) Bộ phụ cấp mới (nếu có) Mức lương cơ bản mới (nếu có) Loại hợp đồng mới Thời hạn hợp đồng (auto theo Loại hợp đồng, gồm 12 tháng/24 tháng/36 tháng/ Không xác định thời hạn) Ngày ký hợp đồng mới (dd/mm/yyyy) Ngày hiệu lực của hợp đồng mới (dd/mm/yyyy) Số hợp đồng mới (chương trình auto) Ngày kết thúc hợp đồng mới (chương trình auto, = Ngày hiệu lực hợp đồng mới + Thời hạn của hợp đồng mới)",
        "fieldsChecklist": [],
        "sourceRow": 5
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-07",
    "sopTitle": "Quy trình ký phụ lục khi thay đổi mức lương/phụ cấp",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP07.01",
        "title": "Danh sách nhân viên có điều chỉnh",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có nghiệp vụ điều chỉnh thu nhập (định kỳ hoặc đột xuất)",
        "typeCode": "A",
        "description": "# Danh sách nhân viên có Điều chỉnh, gồm: Điều chỉnh mức lương cơ bản/phụ cấp tham gia bảo hiểm trên hợp đồng lao động (load kết quả từ Nghiệp vụ/Điều chỉnh thu nhập) Điều chỉnh địa điểm làm việc (load kết quả từ Nghiệp vụ/Điều chỉnh địa điểm làm việc) Điều chỉnh chức danh công việc (load kết quả từ Nghiệp vụ/Bổ nhiệm) Cả 03 điều chỉnh trên ở trên Thông tin trên màn hình danh sách này gồm: Tên nhân viên Phòng/Tổ/Nhóm Mã số hợp đồng lao động hiện tại Loại hợp đồng lao động hiện tại Ngày hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Ngày hết hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Chức danh hiện tại Chức danh mới Chức vụ hiện tại Chức vụ mới Địa điểm làm việc hiện tại (lấy từ profile nhân viên) Địa điểm làm việc mới Ngạch lương hiện tại Bậc lương hiện tại Mức lương hiện tại Nhóm phụ cấp hiện tại Ngạch lương mới Bậc lương mới Mức lương mới Nhóm phụ cấp mới",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP07.02",
        "title": "Lập phụ lục hợp đồng lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Có kết quả từ các nghiệp vụ Bổ nhiệm/Điều chỉnh thu nhập/Thay đổi địa điểm làm việc hoặc kết quả đanh giá tái ký hợp đồng lao động",
        "typeCode": "N",
        "description": "# Với nhân viên trong danh sách của bước EMP07.01 Chọn nhân viên từ danh sách cần lập phụ lục à Lập phụ lục hợp đồng. Thông tin cho màn hình lập phụ lục hợp đồng gồm: Tên nhân viên Phòng/Tổ/Nhóm Mã số hợp đồng lao động hiện tại Loại hợp đồng lao động hiện tại Ngày hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Ngày hết hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Chức danh hiện tại Chức danh mới Chức vụ hiện tại Chức vụ mới Địa điểm làm việc hiện tại (lấy từ profile nhân viên) Địa điểm làm việc mới Ngạch lương hiện tại Bậc lương hiện tại Mức lương hiện tại Nhóm phụ cấp hiện tại Ngạch lương mới Bậc lương mới Mức lương mới Nhóm phụ cấp mới Loại phụ lục (Điều chỉnh hoặc Gia hạn; ở đây chọn Điều chỉnh) Mã số phụ lục (auto theo thiết lập ban đầu của mã Phụ lục) Ngày hiệu lực (dd/mm/yyyy, ngày hiệu lực này load default theo các nghiệp vụ Bổ nhiệm/Điều chỉnh thu nhập/Thay đổi địa điểm làm việc) Ngày ký phụ lục # Với nhân viên gia hạn thời gian hợp đồng Màn hình lập phụ lục à chọn nhân viên cần gia hạn hợp đồng à lập phụ lục Thông tin màn hình lập phụ lục gồm: Tên nhân viên Phòng/Tổ/Nhóm Mã số hợp đồng lao động hiện tại Loại hợp đồng lao động hiện tại Ngày hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Ngày hết hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Chức danh hiện tại Chức vụ hiện tại Thời gian gia hạn hợp đồng (nhập số tháng cần gia hạn) Ngày hiệu lực (auto, = Ngày hết hạn hợp đồng + 1) Ngày hết hạn (auto, = Ngày hiệu lực + Thời gian gia hạn hợp đồng) Loại phụ lục (Điều chỉnh hoặc Gia hạn; ở đây chọn Gia hạn) Mã số phụ lục (auto theo thiết lập ban đầu của mã Phụ lục) Ngày ký phụ lục à In Phụ lục hợp đồng lao động à Gửi mail phụ lục hợp đồng lao động",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP07.03",
        "title": "Truy vấn thông tin phụ lục",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi HRM-C&B gửi mail thông báo",
        "typeCode": "A",
        "description": "Nhân viên review thông tin trên phụ lục hợp đồng, các thông tin chưa rõ sẽ trao đổi trực tiếp với HRM-C&B. Thông tin trên màn hình review gồm: Tên nhân viên Phòng/Tổ/Nhóm Mã số hợp đồng lao động hiện tại Loại hợp đồng lao động hiện tại Ngày hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Ngày hết hiệu lực hợp đồng lao động (lấy từ thông tin hợp đồng hiện tại) Chức danh hiện tại Chức vụ hiện tại Thời gian gia hạn hợp đồng (nhập số tháng cần gia hạn) Ngày hiệu lực (auto, = Ngày hết hạn hợp đồng + 1) Ngày hết hạn (auto, = Ngày hiệu lực + Thời gian gia hạn hợp đồng)",
        "fieldsChecklist": [],
        "sourceRow": 4
      }
    ]
  }
],
  'LIFE-05': [
  {
    "sopCode": "SOP-EMP-08",
    "sopTitle": "Quy trình điều chỉnh thu nhập định kỳ",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP08.01",
        "title": "Phân tích nhân viên thoả điều kiện điều chỉnh lương định kỳ",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Quý 1 hằng năm",
        "typeCode": "N",
        "description": "# Thiết lập template tìm kiếm Màn hình phân tích này hỗ trợ thiết lập một template các điều kiện tìm kiếm theo những toán tử sau: Theo vùng một thời gian (năm hiện tại/năm gần nhất trước năm hiện tại/ n năm gần nhất trước năm hiện tại) Theo bộ phận (Phòng ban/Tổ/Nhóm) Loại trừ (một hoặc nhiều thông tin trong profile nhân viên) Bao gồm (các thông tin trong profile nhân viên) Trong khoảng giá trị (từ à đến) Lớn hơn (một giá trị) Nhỏ hơn (một giá trị) Phạm vi tìm kiếm gồm: Tìm kiếm theo lịch sử vi phạm kỷ luật Tìm kiếm theo lịch sử kết quả đánh giá performance Tìm kiếm theo lịch sử khen thưởng Thông tin trả ra trên màn hình tìm kiếm này gồm: Nhân viên Phòng ban/Tổ/Nhóm Chức vụ hiện tại Chức danh hiện tại Ngạch lương hiện tại Bậc lương hiện tại Mức lương (theo Ngạch/Bậc) hiện tại Mức lương (gross) hiện tại Kết quả đánh giá performance Tỷ lệ điều chỉnh lương đề xuất (dựa trên bảng tham chiếu của kết quả đánh giá performance, ví dụ loại A được điều chỉnh 15%, loại B được điều chỉnh 10%) Mức lương (gross) sau điều chỉnh à Gửi mail danh sách à In danh sách nhân viên thoả điều kiện và mức lương được điều chỉnh",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP08.02",
        "title": "Duyệt mức điều chỉnh",
        "actor": "BOM",
        "location": "Portal",
        "timing": "Quý 1 hằng năm",
        "typeCode": "M",
        "description": "Danh sách nhân viên và mức điều chỉnh được trình lên BOM xét duyệt. Thông tin màn hinh xét duyệt gồm: Nhân viên Phòng ban/Tổ/Nhóm Chức vụ hiện tại Chức danh hiện tại Ngạch lương hiện tại Bậc lương hiện tại Mức lương (theo Ngạch/Bậc) hiện tại Mức lương (gross) hiện tại Kết quả đánh giá performance Tỷ lệ điều chỉnh lương đề xuất (dựa trên bảng tham chiếu của kết quả đánh giá performance, ví dụ loại A được điều chỉnh 15%, loại B được điều chỉnh 10%) Mức lương (gross) sau điều chỉnh Mức lương (gross) được duyệt Ngày hiệu lực áp dụng à Gửi mail thông báo kết quả duyệt",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP08.03",
        "title": "Thực hiện điều chỉnh thu nhập",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả duyệt của BOM",
        "typeCode": "A",
        "description": "# Điều chỉnh lương định kỳ Kế thừa kết quả duyệt của BOM để thực hiện nghiệp vụ điều chỉnh lương định kỳ. Các thông tin tại màn hình điều chỉnh lương định kỳ này gồm: Nhân viên được duyệt điều chỉnh Phòng ban/Tổ/Nhóm Chức vụ hiện tại Chức danh hiện tại Ngạch lương hiện tại Bậc lương hiện tại Mức lương (theo Ngạch/Bậc) hiện tại Mức lương gross được duyệt Ngày hiệu lực áp dụng mức lương mới à Gửi mail thông báo kết quả điều chỉnh lương định kỳ đến nhân viên à In Thông báo điều chỉnh thu nhập",
        "fieldsChecklist": [],
        "sourceRow": 4
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-09",
    "sopTitle": "Quy trình điều chỉnh thu nhập đột xuất",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP09.01",
        "title": "Danh sách nhân viên thay đổi quá trình công tác có điều chỉnh thu nhập",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Kết quả từ các nghiệp vụ liên quan",
        "typeCode": "A",
        "description": "Từ kết quả của nghiệp vụ “Thay đổi quá trình công tác”, lọc ra danh sách những nhân viên có thông tin lương thay đổi (thay đổi chức danh và cấp bậc dẫn đến thay đổi mức lương) Thông tin trên màn hình danh sách này gồm: Tên nhân viên Chức vụ hiện tại Chức danh hiện tại Cấp bậc hiện tại (level theo job grade) Ngạch lương hiện tại Bậc lương hiện tại Nhóm phụ cấp hiện tại Mức lương cơ bản hiện tại Mức lương gross hiện tại Chức vụ mới (từ nghiệp vụ bổ nhiệm) Chức danh mới (từ nghiệp vụ bổ nhiệm) Cấp bậc mới (level theo job grade) Ngạch lương mới (theo chức danh mới) Bậc lương mới (theo chức danh mới) Nhóm phụ cấp mới (theo chức danh mới) Mức lương gross mới (giá trị người dùng tự cập nhật)",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP09.02",
        "title": "Thực hiện điều chỉnh thu nhập",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi có nhân viên tồn tại trong danh sách cảnh báo",
        "typeCode": "N",
        "description": "Kế thừa danh sách nhân viên ở bước EMP09.01, chọn nhân viên được điều chỉnh thu nhập và thực hiện điều chỉnh. Thông tin trên màn hình điều chỉnh này gồm: Nhân viên được điều chỉnh Chức vụ hiện tại Chức danh hiện tại Cấp bậc hiện tại (level theo job grade) Ngạch lương hiện tại Bậc lương hiện tại Nhóm phụ cấp hiện tại Mức lương cơ bản hiện tại Mức lương gross hiện tại Chức vụ mới (từ nghiệp vụ bổ nhiệm) Chức danh mới (từ nghiệp vụ bổ nhiệm) Cấp bậc mới (level theo job grade) Ngạch lương mới (theo chức danh mới) Bậc lương mới (theo chức danh mới) Nhóm phụ cấp mới (theo chức danh mới) Mức lương gross mới (giá trị người dùng tự cập nhật) Ngày hiệu lực áp dụng (dd/mm/yyyy) à Gửi mail thông báo kết quả điều chỉnh lương đến nhân viên à In Thông báo điều chỉnh thu nhập",
        "fieldsChecklist": [],
        "sourceRow": 3
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-10",
    "sopTitle": "Quy trình điều chỉnh thu nhập theo lương tối thiểu vùng",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP10.01",
        "title": "Lọc danh sách nhân viên có mức lương cơ bản thấp hơn mức lương tối thiểu vùng + 7%",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Tháng 12 hằng năm",
        "typeCode": "A",
        "description": "Vào tháng 12 hằng năm, Nhà nước sẽ có thông báo mức lương tối thiểu vùng cho 04 vùng (từ vùng 1 đến vùng 4). Chương trình có màn hình lọc danh sách nhân viên đang có mức lương cơ bản (lương trên hợp đồng) hiện tại thấp hơn mức lương tối thiểu vùng mới + 7%. Màn hình danh sách nhân viên này gồm: Nhân viên Chức vụ hiện tại Chức danh hiện tại Cấp bậc hiện tại (level theo job grade) Ngạch lương hiện tại Bậc lương hiện tại Nhóm phụ cấp hiện tại Mức lương cơ bản hiện tại Mức lương tối thiểu vùng mới (= lương tối thiểu vùng mới + 7%)",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP10.02",
        "title": "Điều chỉnh mức lương cơ bản",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Tại tháng mà mức lương tối thiểu vùng có hiệu lực",
        "typeCode": "N",
        "description": "Kế thừa danh sách nhân viên ở bước EMP10.01, tiến hành điều chỉnh bậc lương phù hợp để đảm bảo mức lương cơ bản cao hơn mức lương tối thiểu vùng + 7%. Màn hình điều chỉnh mức lương cơ bản gồm các thông tin sau: Nhân viên Chức vụ hiện tại Chức danh hiện tại Cấp bậc hiện tại (level theo job grade) Ngạch lương hiện tại Bậc lương hiện tại Nhóm phụ cấp hiện tại Mức lương cơ bản hiện tại Bậc lương mới Nhóm phụ cấp mới (nếu có) Mức lương cơ bản mới Ngày hiệu lực áp dụng à Gửi mail thông báo về việc thay đổi mức lương tham gia bảo hiểm mới à In thông báo điều chỉnh mức lương cơ bản",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP10.03",
        "title": "Ký phụ lục hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi phát sinh danh sách nhân viên cần lập phụ lục",
        "typeCode": "N",
        "description": "Tham khảo Quy trình lập phụ lục hợp đồng EMP07, bước EMP07.02 trong tài liệu này",
        "fieldsChecklist": [],
        "sourceRow": 4
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-12",
    "sopTitle": "Quy trình quản lý thông tin kỷ luật",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP12.01",
        "title": "Xử lý kỷ luật",
        "actor": "Hội đồng kỷ luật",
        "location": "Bên ngoài",
        "timing": "Khi phát sinh sự vụ",
        "typeCode": "N",
        "description": "Hội đồng kỷ luật được lập ra để xử lý kỷ luật nhân viên. Hội đồng này gồm: Nhân viên vi phạm Công đoàn Phòng Nhân sự Trưởng bộ phận Đại diện BOM",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP12.02",
        "title": "Quản lý kết quả kỷ luật",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả họp của Hội đồng kỷ luật",
        "typeCode": "N",
        "description": "Kết quả kỷ luật sẽ được xử lý bên ngoài. Người dùng cập nhật kết quả này vào chương trình để theo dõi lịch sử và chính sách bị cắt giảm. Màn hình quản lý thông tin kỷ luật gồm: Nhân viên bị kỷ luật Lý do kỷ luật (lấy từ danh mục, gồm: Gây rối trật tự/Cố tình làm sai quy định/Không tuân thủ nội qua an toàn lao động/Làm việc riêng trong giờ làm việc/Nghỉ không lý do/Nghỉ không phép/Không tuân thủ nội quy an toàn thực phẩm,…) Cấp độ kỷ luật (Công ty hoặc Phòng ban) Hình thức kỷ luật (lấy từ danh mục, gồm: Khiển trách miệng/Khiển trách biên bản/Kéo dài thời hạn nâng lương x tháng/Chuyển công việc có mức lương thấp hơn/Sa thải) Ngày vi phạm kỷ luật Số lần vi phạm (nếu cùng một Lý do kỷ luật thì số lần sẽ tự động tăng, tăng liên tục) Ngày hiệu lực kỷ luật Ngày hết hiệu lực kỷ luật Số quyết định kỷ luật Số biên bản kỷ luật Chính sách bị cắt giảm đi kèm Thời gian cắt giảm chính sách Giá trị chính sách bị cắt giảm à In quyết định kỷ luật",
        "fieldsChecklist": [],
        "sourceRow": 3
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-13",
    "sopTitle": "Quy trình quản lý khen thưởng",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP13.01",
        "title": "Đề xuất khen thưởng",
        "actor": "Hội đồng khen thưởng",
        "location": "Bên ngoài",
        "timing": "Khi phát sinh sự vụ",
        "typeCode": "N",
        "description": "Hội đồng khen thưởng được lập ra để xét duyệt khen thưởng cho nhân viên. Hội đồng này gồm: Nhân viên được đề xuất Phòng Nhân sự Trưởng bộ phận các phòng ban liên quan Đại diện BOM",
        "fieldsChecklist": [],
        "sourceRow": 2,
        "sourceCode": "EMP12.01"
      },
      {
        "stepCode": "EMP13.02",
        "title": "Quản lý kết quả khen thưởng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả họp của Hội đồng kỷ luật",
        "typeCode": "N",
        "description": "Kết quả khen thưởng sẽ được xử lý bên ngoài. Người dùng cập nhật kết quả này vào chương trình để theo dõi lịch sử và chính sách hưởng của nhân viên. Màn hình quản lý thông tin khen thưởng gồm: Nhân viên/Phòng ban được khen thưởng Hình thức khen thưởng (Hiện vật/Hiện kim) Giá trị khen thưởng (trường hợp nếu là hiện kim hay hiện vật thì phải quy ra giá trị để tính thuế TNCN nếu mức thưởng > 10,000,000) Lý do khen thưởng (Đột xuất cá nhân/Kaizen/Đột xuất tập thể) Danh hiệu khen thưởng Số khen thưởng à In quyết định khen thưởng à Gửi mail chúc mừng",
        "fieldsChecklist": [],
        "sourceRow": 3,
        "sourceCode": "EMP12.02"
      }
    ],
    "sourceNote": "Tiêu đề mục là EMP13 nhưng các dòng trong bảng nguồn ghi EMP12; mã hiển thị được chuẩn hóa theo tiêu đề mục."
  }
],
  'LIFE-03': [
  {
    "sopCode": "SOP-EMP-11",
    "sopTitle": "Quy trình thay đổi quá trình công tác",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP11.01",
        "title": "Đề xuất thay đổi quá trình công tác",
        "actor": "TBP/NV",
        "location": "Portal",
        "timing": "Khi có nhu cầu",
        "typeCode": "N",
        "description": "Các thay đổi về quá trình công tác của nhân viên do TBP cho nhân viên hoặc nhân viên chủ đông đề xuất, gồm các thay đổi sau: Bổ nhiệm Kiêm nhiệm Điều chuyển Điều động Miễn nhiệm Địa điểm làm việc Các thông tin trên màn hình đề xuất gồm: Tên nhân viên Phòng ban/Tổ/nhóm Chức danh hiện tại Chức vụ hiện tại Chức danh mong muốn/Chức vụ mong muốn/Địa điểm làm việc mong muốn Ngày hiệu lực áp dụng (đề xuất) à Gửi mail đề xuất đến các cấp duyệt",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP11.02",
        "title": "Duyệt đề xuất",
        "actor": "HRM/ HRD/ BOM",
        "location": "Portal/ Bên trong",
        "timing": "Khi nhận được mail của TBP",
        "typeCode": "M",
        "description": "Thông tin đề xuất được chuyển đến các bộ phận liên đới xét duyệt. Với mỗi chức danh sẽ thiết lập quy trình xét duyệt với số cấp duyệt khác nhau (ví dụ Nhân viên thì đến cấp HRD duyệt cuối cùng; manager thì đến BOM duyệt cuối cùng). Màn hình của các cấp duyệt gồm các thông tin sau: Tên nhân viên Phòng ban/Tổ/nhóm Chức danh hiện tại Chức vụ hiện tại Ngạch lương hiện tại Bậc lương hiện tại Nhóm lương hiện tại Mức lương cơ bản hiện tại Mức lương gross hiện tại Chức danh mong muốn/Chức vụ mong muốn/Địa điểm làm việc mong muốn Ngạch lương thay đổi (theo chức danh mới) Bậc lương thay đổi (theo chức danh mới) Nhóm phụ cấp thay đổi (theo chức danh mới) Mức lương cơ bản mới (theo chức danh và thang lương mới) Mức lương gross mới (nếu có) Ngày hiệu lực áp dụng (đề xuất) Ngày hiệu lực áp dụng (thực tế) Ý kiến của cấp duyệt tương ứng à Gửi mail đến các cấp duyệt liền kề và cấp đề xuất à Với cấp duyệt cuối, gửi mail thông báo cho cấp đề xuất và HRM/HRD/HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP11.03",
        "title": "Thực hiện thay đổi quá trình công tác",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi có kết quả duyệt cấp cuối cùng",
        "typeCode": "M",
        "description": "Kế thừa kết quả duyệt của cấp cuối cùng và tiến hành thực hiên nghiệp vụ thay đổi quá trình công tác. Thông tin trên màn hình nghệp vụ thay đổi quá trình công tác này gồm: Tên nhân viên Phòng ban/Tổ/nhóm Chức danh được duyệt/Chức vụ được duyệt/Địa điểm làm việc được duyệt Chức vụ mới/Chức danh mới/Địa điểm làm việc mới Ngạch lương mới Bậc lương mới Nhóm phụ cấp mới Mức lương cơ bản mới (theo chức danh và thang lương mới) Mức lương gross mới Ngày hiệu lực áp dụng Lưu lại dữ liệu quá khứ trước khi thay đổi à Gửi mail thông báo cho nhân viên và TBP à In quyết định liên quan (Điều chuyển/Bổ nhiệm/Miễn nhiệm)",
        "fieldsChecklist": [],
        "sourceRow": 4
      }
    ]
  },
  {
    "sopCode": "SOP-EMP-14",
    "sopTitle": "Quy trình quản lý công tác",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP14.01",
        "title": "Đề xuất công tác",
        "actor": "NV",
        "location": "Portal",
        "timing": "Trước khi đi công tác",
        "typeCode": "N",
        "description": "Khi phát sinh đi công tác qua ngày, NV sẽ đăng ký lịch công tác. Thông tin màn hình đăng ký gồm: Thời gian bắt đầu (dd/mm/yyyy) Thời gian kết thúc (dd/mm/yyyy) Loại công tác (Nội tỉnh/Trong nước/Nước ngoài) Địa điểm công tác Phương tiện đi lại (tự túc/xe công ty/taxi/máy bay) Khoảng cách địa điểm công tác Số đêm ở khách sạn Số tiền ứng à Gửi mail đến các cấp duyệt",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP14.02",
        "title": "Duyệt đề xuất",
        "actor": "TBP/BOM",
        "location": "Portal",
        "timing": "Khi nhận được mail đăng ký từ nhân viên hoặc các cấp duyệt trước đó",
        "typeCode": "M",
        "description": "Thông tin trên màn hình duyệt qua từng cấp gồm: Thời gian bắt đầu (dd/mm/yyyy) Thời gian kết thúc (dd/mm/yyyy) Loại công tác (Nội tỉnh/Trong nước/Nước ngoài) Địa điểm công tác Phương tiện đi lại (tự túc/xe công ty/taxi/máy bay) Khoảng cách địa điểm công tác Số đêm ở khách sạn Số tiền ứng Duyệt/Ghi chú Không duyệt/Lý do à Gửi mail đến các cấp liên quan à Với cấp duyệt cuối cùng, sẽ gửi mail thông báo cho NV/TBP/HRM/HRD",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP14.03",
        "title": "Cập nhật kết quả công tác (chi phí và ngày công)",
        "actor": "NV",
        "location": "Portal",
        "timing": "Sau khi hoàn tất công tác",
        "typeCode": "M",
        "description": "Từ màn hình đăng ký công tác (ở bước EMP14.01) nhân viên sẽ cập nhật kết quả thực tế của các thông tin sau: Thời gian bắt đầu (dd/mm/yyyy) Thời gian kết thúc (dd/mm/yyyy) Loại công tác (Nội tỉnh/Trong nước/Nước ngoài) Địa điểm công tác Phương tiện đi lại (tự túc/xe công ty/taxi/máy bay) Khoảng cách địa điểm công tác Số đêm ở khách sạn Số tiền sử dụng # Nếu thời gian công tác thực tế ít hơn thời gian đã đăng ký và nhân viên sử dụng thời gian chênh lệch để nghỉ phép thì ngoài việc cập nhật kết quả công tác còn phải bổ sung đăng ký nghỉ phép # Nếu thời gian công tác thực tế ít hơn thời gian đã đăng ký và nhân viên đi làm lại ngay sau khi kết thúc công tác thì chỉ cần cập nhật kết quả công tác # Nếu thời gian công tác nhiều hơn thời gian đã đăng ký trước đó thì nhân viên cập nhật kết quả công tác kèm với bổ sung thời gian phát sinh và địa điểm phát sinh (nếu có) à Gửi mail đến các cấp duyệt",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP14.04",
        "title": "Duyệt kết quả công tác",
        "actor": "TBP/BOM",
        "location": "Portal",
        "timing": "Khi nhận được mail từ NV",
        "typeCode": "M",
        "description": "Kết quả công tác (thời gian/chi phí) được các cấp liên quan duyệt. Màn hình duyệt gồm các thông tin sau: + Thông tin đăng ký Thời gian bắt đầu (dd/mm/yyyy) Thời gian kết thúc (dd/mm/yyyy) Loại công tác (Nội tỉnh/Trong nước/Nước ngoài) Địa điểm công tác Phương tiện đi lại (tự túc/xe công ty/taxi/máy bay) Khoảng cách địa điểm công tác Số đêm ở khách sạn Số tiền sử dụng + Thông tin thực tế Thời gian bắt đầu (dd/mm/yyyy) Thời gian kết thúc (dd/mm/yyyy) Loại công tác (Nội tỉnh/Trong nước/Nước ngoài) Địa điểm công tác Phương tiện đi lại (tự túc/xe công ty/taxi/máy bay) Khoảng cách địa điểm công tác Số đêm ở khách sạn Số tiền sử dụng Thời gian phát sinh thêm ngoài kế hoạch (từ à đến) Chi phí phát sinh thêm ngoài kế hoạch Địa điểm công tác phát sinh ngoài kế hoạch à Gửi mail thông báo kết quả duyệt cho NV à Gửi thông báo ngày công đi công tác được tính lương cho HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 5
      },
      {
        "stepCode": "EMP14.05",
        "title": "Kết chuyển dữ liệu công phép",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Khi kết quả công tác được cấp duyệt cuối xác nhận",
        "typeCode": "A",
        "description": "Dữ liệu các ngày công tác được chuyển qua phân hệ Công.Phép để quản lý và sử dụng để tính lương của tháng.",
        "fieldsChecklist": [],
        "sourceRow": 6
      }
    ]
  }
],
  'LIFE-07': [
  {
    "sopCode": "SOP-EMP-15",
    "sopTitle": "Quy trình giảm lao động",
    "sopCategory": "Phân hệ Nhân sự",
    "description": "",
    "steps": [
      {
        "stepCode": "EMP15.01",
        "title": "Xin nghỉ việc",
        "actor": "NV",
        "location": "Portal",
        "timing": "Khi phát sinh",
        "typeCode": "N",
        "description": "Nhân viên chủ động đề xuất nghỉ việc. Thông tin trên màn hình đề xuất gồm: Tên nhân viên Loại hợp đồng lao động hiện tại Thời hạn hợp đồng (theo loại hợp đồng) Ngày kết thúc hợp đồng (lấy từ Loại hợp đồng hiện tại) Chức danh hiện tại Chức vụ hiện tại Ngày đăng ký nghỉ việc (load default theo ngày của window tại thời điểm đăng ký) Ngày mong muốn nghỉ việc (dd/mm/yyyy) Số ngày báo trước (=Ngày mong muốn nghỉ việc - Ngày đăng ký nghỉ việc) Số ngày vi phạm báo trước (Thời gian báo trước theo từng loại hợp đồng – Số ngày báo trước, lấy số dương) Lý do nghỉ việc à Gửi mail đến các cấp duyệt tương ứng",
        "fieldsChecklist": [],
        "sourceRow": 2
      },
      {
        "stepCode": "EMP15.02",
        "title": "Duyệt",
        "actor": "TBP/HRM/HRD/BOM",
        "location": "Portal",
        "timing": "Khi có mail từ nhân viên gửi đến",
        "typeCode": "M",
        "description": "Tuỳ theo từng chức danh mà số cấp duyệt được định nghĩa khác nhau. Màn hình duyệt của từng cấp duyệt có các thông tin sau: Tên nhân viên Loại hợp đồng lao động hiện tại Thời hạn hợp đồng (theo loại hợp đồng) Ngày kết thúc hợp đồng (lấy từ Loại hợp đồng hiện tại) Chức danh hiện tại Chức vụ hiện tại Ngày đăng ký nghỉ việc (load default theo ngày của window tại thời điểm đăng ký) Ngày mong muốn nghỉ việc (dd/mm/yyyy) Số ngày báo trước (=Ngày mong muốn nghỉ việc - Ngày đăng ký nghỉ việc) Số ngày vi phạm báo trước (Thời gian báo trước theo từng loại hợp đồng – Số ngày báo trước, lấy số dương) Lý do nghỉ việc Duyệt/Ý kiến Không duyệt/Lý do không duyệt à Gửi mail đến các cấp duyệt sau à Với cấp duyệt cuối, sẽ gửi mail lại cho Nhân viên/TBP/HRM/HRD và HRM-C&B",
        "fieldsChecklist": [],
        "sourceRow": 3
      },
      {
        "stepCode": "EMP15.02",
        "title": "Thanh lý hợp đồng",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Sau khi có kết quả đánh giá từ TBP hoặc khi nhân viên xin nghỉ",
        "typeCode": "N",
        "description": "Màn hình thanh lý hợp đồng bao gồm danh sách nhân viên nghỉ việc từ các nguồn: Nhân viên không đạt ở giai đoạn thử việc Nhân viên không được tái ký hợp đồng lao động Nhân viên chủ động xin nghỉ và được chấp thuận Nhân viên tự ý bỏ việc Công ty chủ động cho nghỉ trước thời hạn hợp đồng Danh sách này được gửi về các bộ phân xác nhận để làm thủ thanh lý hợp đồng, cụ thể gồm các thông tin: Danh sách nhân viên nghỉ việc Phòng ban của nhân viên Danh sách các task cần hoàn tất trước khi nhân viên nghỉ việc, gồm: + Các trang thiết bị lao động nhân viên cần hoàn trả (dựa trên nghiệp vụ cấp phát trang thiết bị ở thời điểm nhân viên vào nhận việc) + Thẻ BHYT cần phải trả + Các khoản phải trả của nhân viên cần tất toán (các khoản tạm ứng, khoản vay,…) + Các công việc nhân viên cần bàn giao trước khi nghỉ việc (dựa trên check list bàn giao khi nghỉ việc) Sau khi bộ phận check “Done” các hạng mục trên, sẽ tiếp tục chuyển danh sách nhân viên hoàn tất thanh lý sang danh sách nhân viên chờ giảm lao động.",
        "fieldsChecklist": [],
        "sourceRow": 4
      },
      {
        "stepCode": "EMP15.03",
        "title": "Giảm lao động",
        "actor": "HRM-C&B",
        "location": "Bên trong",
        "timing": "Nhân viên có kết quả thanh lý hợp đồng ở trạng thái “Done”",
        "typeCode": "N",
        "description": "Từ danh sách nhân viên hoàn tất thủ tục thanh lý, chọn nhân viên cần giảm lao động, cập nhật các thông tin gồm: Ngày nộp đơn xin nghỉ việc Ngày mong muốn nghỉ việc Hợp đồng lao động hiện tại Số ngày chênh lệch so với quy định (= Ngày mong muốn nghỉ việc - Ngày nộp đơn xin nghỉ việc). Nếu số ngày này > 3 (lao động thời vụ), 30 (hợp đồng có xác định thời hạn) hoặc 45 (hợp đồng không xác định thời hạn) thì không vi phạm. Ngày nghỉ việc được duyệt Mức trợ cấp thôi việc được hưởng (Mỗi năm làm việc được ½ tháng lương, là lương bình quân của 6 tháng liền kề trước khi nghỉ việc. Thời gian hưởng Bảo hiểm thất nghiệp thì không được tính trợ cấp thôi việc) Nếu vi phạm Số ngày chênh lệch so với quy định thì: Không thanh toán trợ cấp thôi việc (check mode, default check) Mức bồi thường số ngày vi phạm báo trước (= Số ngày vi phạm * Đơn giá 1 ngày lương) Mức bồi thường chi phí đào tạo (dựa theo quy định trong Hợp đồng đào tạo để tính ra mức phí này) Có giữ lương (check mode) Kỳ thanh toán lương nghỉ việc (nếu đã check vào mode Có giữ lương. Thông tin này người dùng chủ động nhập hoặc load theo thông tin đã thiết lập trước đó) Đưa vào danh sách đen (check mode) Số quyết định nghỉ việc Ngày ra quyết định à In Quyết định nghỉ việc",
        "fieldsChecklist": [],
        "sourceRow": 5
      }
    ],
    "sourceNote": "Dòng INS03.02 trong cùng bảng được loại khỏi quy trình EMP15 vì thuộc phân hệ Bảo hiểm."
  }
],
}
