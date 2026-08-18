import type { SopSubProcess } from '../types'

// 100% Complete SOP Database mapped for ALL 7 Lifecycle Steps & Cross-Functional Operations from 1.EMP.HRM.SOP.docx
export const SOP_DATABASE: Record<string, SopSubProcess[]> = {
  // LIFE-01: TIẾP NHẬN & HỒ SƠ
  'LIFE-01': [
    {
      sopCode: 'SOP EMP01',
      sopTitle: 'Quy trình Thiết lập Định biên Nhân sự (Headcount Planning)',
      sopCategory: 'Tiền đề & Định biên',
      description: 'Lập kế hoạch định biên nhân sự, xác định hạn mức số lượng & chi phí people cost cho 12 tháng.',
      steps: [
        {
          stepCode: 'EMP01.01',
          title: 'Xây dựng kế hoạch định biên phòng ban',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal',
          timing: 'Đầu năm',
          typeCode: 'N',
          description: 'TBP phụ trách xây dựng định biên cho phòng ban phụ trách (chi tiết 12 tháng, chức vụ, level job grade, thu nhập people cost). Gửi mail trình duyệt cho HRM/HRD.',
          fieldsChecklist: ['Năm xây dựng định biên', 'Phòng ban', 'Chức vụ', 'Cấp độ (Job grade)', 'Tháng định biên (12 tháng)', 'Thu nhập (People cost)']
        },
        {
          stepCode: 'EMP01.02',
          title: 'Tham vấn định biên & Hoạch định nhân sự',
          actor: 'HRM / HRD',
          location: 'Bên ngoài (Họp tham vấn)',
          timing: 'Sau khi nhận từ TBP',
          typeCode: 'M',
          description: 'HRM/HRD tham vấn định biên nhằm trao đổi định hướng phát triển của Công ty, hoạch định nhân sự phù hợp để TBP có góc nhìn chính xác.',
          fieldsChecklist: ['Định hướng phát triển công ty', 'Hạn mức ngân sách nhân sự', 'Gợi ý điều chỉnh định biên']
        },
        {
          stepCode: 'EMP01.03',
          title: 'Điều chỉnh kế hoạch định biên',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal',
          timing: 'Sau khi họp tham vấn',
          typeCode: 'M',
          description: 'TBP cập nhật thông tin thống nhất sau khi tham vấn với HRM/HRD. Gửi mail thông báo kế hoạch tới các cấp phê duyệt.',
          fieldsChecklist: ['Chức vụ điều chỉnh', 'Cấp độ level', 'Tháng định biên điều chỉnh', 'Tổng thu nhập đính kèm']
        },
        {
          stepCode: 'EMP01.04',
          title: 'Họp bảo vệ & Duyệt định biên',
          actor: 'Ban Giám Đốc (BOM)',
          location: 'Portal & Họp BOM',
          timing: 'Sau khi trình duyệt BOM',
          typeCode: 'M',
          description: 'TBP & HRM/HRD họp bảo vệ kế hoạch định biên trước Ban Giám Đốc. BOM xem xét và quyết định phê duyệt chính thức.',
          fieldsChecklist: ['Biên bản họp bảo vệ định biên', 'Quyết định phê duyệt BOM', 'Thông báo duyệt tới TBP/HRM']
        },
        {
          stepCode: 'EMP01.05',
          title: 'Cập nhật & Khóa dữ liệu định biên phê duyệt',
          actor: 'HRM - Nhân sự',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Sau khi BOM duyệt',
          typeCode: 'A',
          description: 'Kết quả duyệt của BOM được lưu trữ và khóa trên phần mềm, làm cơ sở kiểm soát hạn mức tuyển dụng (Available Headcount).',
          fieldsChecklist: ['Phòng ban xây dựng', 'Chức vụ & Level', 'Định biên 12 tháng', 'Tổng ngân sách People Cost phê duyệt']
        }
      ]
    },
    {
      sopCode: 'SOP EMP02',
      sopTitle: 'Quy trình Tiếp nhận Nhân viên Mới không qua Tuyển dụng (Onboarding)',
      sopCategory: 'Tiếp nhận & Onboarding',
      description: 'Quy trình tiếp nhận ứng viên trúng tuyển, chuẩn bị Onboarding và cấp phát tài khoản trang thiết bị.',
      steps: [
        {
          stepCode: 'EMP02.01',
          title: 'Cập nhật danh sách NV chờ nhận việc',
          actor: 'HRM - Tuyển dụng',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Khi có Offer Letter xác nhận',
          typeCode: 'N',
          description: 'Cập nhật CV và hồ sơ nhân viên vào danh sách chờ nhận việc: Thông tin cá nhân, liên hệ, vị trí công tác, HĐLĐ, BHXH, tài khoản ngân hàng.',
          fieldsChecklist: ['Mã NV (Auto-gen)', 'Họ tên', 'Vị trí công tác', 'Ngày vào làm', 'Loại HĐLĐ', 'Lương cơ bản & Phụ cấp', 'Bảo hiểm & MST']
        },
        {
          stepCode: 'EMP02.02',
          title: 'Phê duyệt kế hoạch tiếp nhận & giao việc',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal',
          timing: 'Sau khi nhận thông báo',
          typeCode: 'M',
          description: 'TBP xem xét kế hoạch tiếp nhận nhân viên mới, gán người hướng dẫn (Buddy/Mentor) và phê duyệt kế hoạch giao việc thử việc.',
          fieldsChecklist: ['Mã NV tiếp nhận', 'Người hướng dẫn (Buddy)', 'Kế hoạch công việc tuần 1', 'Tiêu chí đánh giá thử việc']
        },
        {
          stepCode: 'EMP02.03',
          title: 'Cấp phát tài khoản IT & Trang thiết bị Hành chính',
          actor: 'IT & Hành chính (PIC)',
          location: 'Ticket System / Portal',
          timing: '3-5 ngày trước khi vào làm',
          typeCode: 'A',
          description: 'Cấp email công ty, tài khoản domain, phần mềm làm việc (IT) và chuẩn bị thẻ nhân viên, bàn làm việc, đồng phục (Hành chính).',
          fieldsChecklist: ['Email công ty', 'Tài khoản Domain/VPN', 'Thẻ nhân viên', 'Vị trí bàn làm việc', 'Máy tính & Trang thiết bị']
        },
        {
          stepCode: 'EMP02.04',
          title: 'Khởi tạo Đào tạo hội nhập & Mục tiêu KPI thử việc',
          actor: 'HRM - Đào tạo / Evaluate',
          location: 'Portal',
          timing: 'Ngày đầu tiên nhận việc',
          typeCode: 'A',
          description: 'Tự động kích hoạt khóa Đào tạo hội nhập bắt buộc (EMP02.08) và gán bản tiêu chí mục tiêu thử việc (EMP02.06) trên Portal.',
          fieldsChecklist: ['Khóa học hội nhập', 'Tài liệu văn hóa doanh nghiệp', 'Bản mục tiêu KPI thử việc', 'Lịch họp Check-in tuần 1']
        },
        {
          stepCode: 'EMP02.05',
          title: 'Chốt hồ sơ nhận việc & Chuyển trạng thái Thử việc',
          actor: 'HRM - Admin',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Hoàn tất Onboarding',
          typeCode: 'A',
          description: 'Xác nhận nhân viên đã có mặt nhận việc chính thức, chuyển trạng thái hồ sơ từ "Chờ nhận việc" sang "Đang thử việc".',
          fieldsChecklist: ['Trạng thái: Đang thử việc', 'Mã chấm công', 'Hồ sơ pháp lý đính kèm', 'Kích hoạt tài khoản Employee Portal']
        }
      ]
    },
    {
      sopCode: 'SOP EMP03',
      sopTitle: 'Quy trình Tuyển lại Nhân viên Cũ (Re-hire Process)',
      sopCategory: 'Tuyển lại & Tiếp nhận',
      description: 'Tiếp nhận lại nhân sự đã từng làm việc tại doanh nghiệp (lấy lại Mã số nhân viên cũ & lịch sử thâm niên).',
      steps: [
        {
          stepCode: 'EMP03.01',
          title: 'Tra cứu hồ sơ nhân viên cũ trong quá khứ',
          actor: 'HRM - Tuyển dụng',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Khi tiếp nhận đơn đăng ký',
          typeCode: 'A',
          description: 'Tra cứu Mã NV cũ, lý do nghỉ việc trước đây, đánh giá hiệu suất cũ và kiểm tra danh sách Blacklist.',
          fieldsChecklist: ['Mã NV cũ', 'Lịch sử công tác trước đây', 'Lý do nghỉ việc cũ', 'Trạng thái Blacklist (Có/Không)']
        },
        {
          stepCode: 'EMP03.02',
          title: 'Kích hoạt lại bản ghi hồ sơ & Giữ nguyên Mã NV',
          actor: 'HRM - Admin',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Sau khi phê duyệt Re-hire',
          typeCode: 'M',
          description: 'Kích hoạt lại bản ghi hồ sơ nhân sự, giữ nguyên Mã NV cũ và nối tiếp chuỗi thâm niên hoặc tạo hợp đồng mới.',
          fieldsChecklist: ['Mã NV nối tiếp', 'Lịch sử HĐLĐ mới', 'Chức danh mới', 'Vùng lương & Bảo hiểm']
        }
      ]
    }
  ],

  // LIFE-02: QUẢN LÝ & SỐ HÓA HỒ SƠ
  'LIFE-02': [
    {
      sopCode: 'SOP EMP04',
      sopTitle: 'Quy trình Quản lý & Số hóa Hồ sơ Nhân viên (Employee Profile)',
      sopCategory: 'Hồ sơ & Dữ liệu',
      description: 'Số hóa, lưu trữ và đối soát 100% hồ sơ giấy tờ pháp lý nhân sự theo tiêu chuẩn Luật Lao động.',
      steps: [
        {
          stepCode: 'EMP04.01',
          title: 'Nhân viên khai báo lý lịch trên Portal Self-Service',
          actor: 'Nhân viên mới',
          location: 'Portal',
          timing: 'Ngày đầu tiên nhận việc',
          typeCode: 'N',
          description: 'Nhân viên cập nhật lý lịch, hộ khẩu, thông tin người phụ thuộc, bằng cấp và tài khoản ngân hàng trên Portal.',
          fieldsChecklist: ['CCCD / Hộ chiếu', 'Địa chỉ thường trú & tạm trú', 'Bằng cấp học vấn', 'Số TK ngân hàng', 'MST PIT']
        },
        {
          stepCode: 'EMP04.02',
          title: 'Đối soát chứng từ scan với hồ sơ bản cứng',
          actor: 'HRM - Admin',
          location: 'Bên ngoài / Portal',
          timing: 'Trong 7 ngày đầu tiên',
          typeCode: 'M',
          description: 'HR Admin đối soát các file scan upload với hồ sơ bản cứng nộp trực tiếp (Giấy khai sinh, CCCD, Bằng cấp chứng thực).',
          fieldsChecklist: ['Checklist hồ sơ cần nộp', 'Trạng thái chứng thực file scan', 'Phiếu hẹn bổ túc giấy tờ']
        },
        {
          stepCode: 'EMP04.03',
          title: 'Xác nhận & Duyệt hồ sơ chính thức',
          actor: 'HRM - Admin / C&B',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Sau khi đủ chứng từ',
          typeCode: 'A',
          description: 'Khóa duyệt hồ sơ chính thức, mã hóa lưu trữ số và phát hành mã hồ sơ nhân sự chuẩn.',
          fieldsChecklist: ['Trạng thái hồ sơ: Đã đối soát 100%', 'Ngày chốt hồ sơ', 'File đính kèm chứng thực']
        },
        {
          stepCode: 'EMP04.04',
          title: 'Đồng bộ dữ liệu sang Thuế PIT & Bảo hiểm',
          actor: 'Hệ thống HRM (Auto)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động sau khi duyệt',
          typeCode: 'A',
          description: 'Đồng bộ thông tin đăng ký Mã số thuế cá nhân (TAX01), Người phụ thuộc và tài khoản ngân hàng trả lương (BANK).',
          fieldsChecklist: ['Mã số thuế PIT', 'Danh sách người phụ thuộc', 'Tài khoản ngân hàng nhận lương']
        }
      ]
    }
  ],

  // LIFE-03: ĐÁNH GIÁ THỬ VIỆC & TÁI KÝ
  'LIFE-03': [
    {
      sopCode: 'SOP EMP05',
      sopTitle: 'Quy trình Tái ký Hợp đồng Lao động & Đánh giá Thử việc',
      sopCategory: 'Hợp đồng & Tái ký',
      description: 'Cảnh báo hết hạn HĐLĐ, đánh giá hiệu quả công tác và lập Hợp đồng tái ký kế tiếp.',
      steps: [
        {
          stepCode: 'EMP05.01',
          title: 'Cảnh báo tự động danh sách NV sắp hết hạn hợp đồng',
          actor: 'Hệ thống HRM (Auto)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Cảnh báo trước 30 - 45 ngày',
          typeCode: 'A',
          description: 'Hệ thống quét tự động danh sách hợp đồng sắp đáo hạn, gửi thông báo cảnh báo kèm báo cáo KPI đến TBP và C&B.',
          fieldsChecklist: ['Mã NV & Tên NV', 'Số hợp đồng hiện tại', 'Ngày hết hạn', 'Lịch sử KPI & Khen thưởng/Kỷ luật']
        },
        {
          stepCode: 'EMP05.02',
          title: 'Đánh giá tái ký HĐLĐ giữa TBP và Nhân viên',
          actor: 'Trưởng bộ phận & NV',
          location: 'Portal',
          timing: 'Khi nhận cảnh báo',
          typeCode: 'N',
          description: 'TBP làm việc cùng nhân viên, đánh giá kết quả công tác và chốt trạng thái: Tái ký (loại HĐ mới) hoặc Không tái ký.',
          fieldsChecklist: ['Kết quả đánh giá (Tái ký / Không tái ký)', 'Loại HĐ tái ký kế tiếp (12M/24M/Không thời hạn)', 'Ngày bắt đầu HĐ mới']
        },
        {
          stepCode: 'EMP05.03',
          title: 'Tham vấn pháp lý & Duyệt ngạch bậc lương mới',
          actor: 'HRM / HRD',
          location: 'Portal / Bên trong',
          timing: 'Sau khi nhận kết quả từ TBP',
          typeCode: 'M',
          description: 'HRM xem xét tham vấn về quy định pháp lý, điều chỉnh ngạch bậc lương hoặc phụ cấp nếu có thay đổi.',
          fieldsChecklist: ['Ngạch/Bậc lương mới', 'Mức lương cơ bản mới', 'Nhóm phụ cấp tái ký']
        },
        {
          stepCode: 'EMP05.04',
          title: 'Lập Hợp đồng lao động mới & Trình ký',
          actor: 'HRM - C&B',
          location: 'Bên trong / Ký số',
          timing: 'Sau khi phê duyệt',
          typeCode: 'N',
          description: 'C&B phát hành HĐLĐ mới từ mẫu chuẩn, trình Ban Giám Đốc ký số và gửi bản xem trước cho Nhân viên.',
          fieldsChecklist: ['Số HĐLĐ mới', 'Ngày hiệu lực', 'Thời hạn HĐ', 'File PDF hợp đồng đính kèm']
        }
      ]
    }
  ],

  // LIFE-04: HỢP ĐỒNG LAO ĐỘNG CHÍNH THỨC
  'LIFE-04': [
    {
      sopCode: 'SOP EMP06',
      sopTitle: 'Quy trình Ký Hợp đồng Lao động với Nhân viên Mới',
      sopCategory: 'Hợp đồng & Pháp lý',
      description: 'Lập dự thảo, trình ký và lưu trữ Hợp đồng lao động chính thức hoặc Thử việc.',
      steps: [
        {
          stepCode: 'EMP06.01',
          title: 'Dự thảo Hợp đồng lao động theo mẫu chuẩn',
          actor: 'HRM - C&B',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Khi tiếp nhận hoặc đạt thử việc',
          typeCode: 'N',
          description: 'C&B tạo dự thảo HĐLĐ từ Mẫu hợp đồng chuẩn (Word template), điền thời hạn, ngạch/bậc lương và phụ cấp cố định.',
          fieldsChecklist: ['Mã hợp đồng tự động', 'Loại HĐ (Thử việc/Xác định thời hạn)', 'Thời hạn HĐ', 'Mức lương chính thức & Phụ cấp']
        },
        {
          stepCode: 'EMP06.02',
          title: 'Thẩm định & Trình ký Ban Giám Đốc',
          actor: 'HRD / Ban Giám Đốc (BOM)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Sau khi dự thảo xong',
          typeCode: 'M',
          description: 'Đại diện pháp luật hoặc BOM xem xét ký duyệt HĐLĐ (ký giấy bản cứng hoặc Ký số vẹn toàn trên Portal).',
          fieldsChecklist: ['Chữ ký số BOM', 'Ngày ký hợp đồng', 'Trạng thái: Đã ký duyệt']
        },
        {
          stepCode: 'EMP06.03',
          title: 'Nhân viên ký xác nhận & Lưu trữ HĐLĐ',
          actor: 'Nhân viên & HRM - C&B',
          location: 'Portal / Hồ sơ cứng',
          timing: 'Trong 3 ngày làm việc',
          typeCode: 'A',
          description: 'Nhân viên ký xác nhận HĐLĐ. C&B bàn giao 01 bản cho nhân viên và lưu 01 bản vào hồ sơ pháp lý công ty.',
          fieldsChecklist: ['Biên bản bàn giao HĐ', 'Ngày hiệu lực HĐ', 'Lịch tự động cảnh báo đáo hạn HĐ (Trước 30/45 ngày)']
        },
        {
          stepCode: 'EMP06.04',
          title: 'Đưa vào danh sách Báo tăng BHXH (INS02)',
          actor: 'HRM - Bảo hiểm',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Theo chu kỳ bảo hiểm hàng tháng',
          typeCode: 'A',
          description: 'Tự động trích xuất thông tin HĐLĐ chính thức đưa vào danh sách Báo tăng BHXH/BHYT/BHTN hàng tháng.',
          fieldsChecklist: ['Mã số BHXH', 'Mức lương đóng BHXH', 'Tháng bắt đầu trích nộp']
        }
      ]
    }
  ],

  // LIFE-05: ĐIỀU CHỈNH LƯƠNG & CHẾ ĐỘ
  'LIFE-05': [
    {
      sopCode: 'SOP EMP08',
      sopTitle: 'Quy trình Điều chỉnh Thu nhập Cố định & Phụ cấp',
      sopCategory: 'Lương & Chế độ',
      description: 'Điều chỉnh lương định kỳ, tăng lương trước hạn hoặc thay đổi các khoản phụ cấp theo quy chế.',
      steps: [
        {
          stepCode: 'EMP08.01',
          title: 'Lập đề xuất điều chỉnh lương / phụ cấp',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal',
          timing: 'Kỳ đánh giá lương / Đột xuất',
          typeCode: 'N',
          description: 'TBP lập đề xuất tăng lương hoặc bổ sung phụ cấp cho nhân sự căn cứ vào thành tích công tác và ngân sách khả dụng.',
          fieldsChecklist: ['Mã NV & Chức danh', 'Mức lương hiện tại', 'Mức lương đề xuất mới', 'Tỷ lệ % tăng', 'Lý do đề xuất']
        },
        {
          stepCode: 'EMP08.02',
          title: 'Thẩm định ngân sách & Quy chế C&B',
          actor: 'HRM - C&B',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Sau khi nhận đề xuất',
          typeCode: 'M',
          description: 'C&B đối soát đề xuất với Thang bảng lương công ty, khung ngạch/bậc và ngân sách quỹ lương phòng ban.',
          fieldsChecklist: ['Khung ngạch/bậc tương ứng', 'Hạn mức ngân sách quỹ lương', 'Ý kiến thẩm định C&B']
        },
        {
          stepCode: 'EMP08.03',
          title: 'Phê duyệt Tăng lương từ Ban Giám Đốc',
          actor: 'Ban Giám Đốc (BOM)',
          location: 'Portal',
          timing: 'Sau khi C&B thẩm định',
          typeCode: 'M',
          description: 'BOM xem xét tờ trình tăng lương và đưa ra quyết định phê duyệt chính thức.',
          fieldsChecklist: ['Quyết định điều chỉnh lương', 'Ngày hiệu lực tính lương mới', 'Ký duyệt BOM']
        },
        {
          stepCode: 'EMP08.04',
          title: 'Cập nhật Master Data C&B & Ký Phụ lục HĐLĐ',
          actor: 'HRM - C&B',
          location: 'Bên trong / Portal',
          timing: 'Trước kỳ lương mới',
          typeCode: 'A',
          description: 'Cập nhật thông tin lương mới vào bản ghi C&B, phát hành Phụ lục HĐLĐ điều chỉnh lương gửi nhân viên.',
          fieldsChecklist: ['Phụ lục HĐLĐ điều chỉnh lương', 'Cập nhật Bảng lương tự động', 'Thông báo tới NV qua Mail/Portal']
        }
      ]
    }
  ],

  // LIFE-06: BIẾN ĐỘNG & ĐIỀU CHUYỂN
  'LIFE-06': [
    {
      sopCode: 'SOP EMP11',
      sopTitle: 'Quy trình Bổ nhiệm, Miễn nhiệm & Điều chuyển Nhân sự',
      sopCategory: 'Biến động & Quyết định',
      description: 'Điều chuyển vị trí công tác, thăng chức/bổ nhiệm hoặc miễn nhiệm chức vụ quản lý.',
      steps: [
        {
          stepCode: 'EMP11.01',
          title: 'Lập đề xuất Bổ nhiệm / Điều chuyển',
          actor: 'TBP / HRD',
          location: 'Portal',
          timing: 'Khi có nhu cầu quy hoạch',
          typeCode: 'N',
          description: 'Lập đề xuất điều chuyển phòng ban hoặc thăng chức bổ nhiệm vị trí quản lý mới.',
          fieldsChecklist: ['Vị trí hiện tại', 'Vị trí điều chuyển/bổ nhiệm mới', 'Phòng ban mới', 'Ngày hiệu lực dự kiến']
        },
        {
          stepCode: 'EMP11.02',
          title: 'Thẩm định định biên & Năng lực nhân sự',
          actor: 'HRD / Ban Giám Đốc',
          location: 'Bên trong / Họp BOM',
          timing: 'Trong 5 ngày làm việc',
          typeCode: 'M',
          description: 'HRD kiểm tra hạn mức định biên vị trí mới và kết quả đánh giá năng lực nhân sự.',
          fieldsChecklist: ['Hạn mức định biên vị trí mới', 'Báo cáo đánh giá năng lực', 'Biên bản họp thẩm định']
        },
        {
          stepCode: 'EMP11.03',
          title: 'Phát hành Quyết định Bổ nhiệm / Điều chuyển',
          actor: 'HRM - Admin',
          location: 'Bên trong / Portal',
          timing: 'Sau khi BOM phê duyệt',
          typeCode: 'N',
          description: 'Phát hành Quyết định bổ nhiệm/điều chuyển chính thức có chữ ký đại diện pháp luật.',
          fieldsChecklist: ['Số Quyết định', 'Ngày hiệu lực', 'Quyền hạn & Trách nhiệm mới', 'Phụ cấp trách nhiệm (nếu có)']
        },
        {
          stepCode: 'EMP11.04',
          title: 'Cập nhật Org Chart & Bàn giao công việc',
          actor: 'HR Admin & Bộ phận liên quan',
          location: 'System / Org Chart',
          timing: 'Vào ngày hiệu lực',
          typeCode: 'A',
          description: 'Tự động cập nhật Sơ đồ tổ chức (Org Chart), chuyển quản lý trực tiếp và hoàn tất biên bản bàn giao.',
          fieldsChecklist: ['Cập nhật Org Chart tự động', 'Chuyển đổi quyền duyệt Portal', 'Biên bản bàn giao công việc']
        }
      ]
    }
  ],

  // LIFE-07: BIẾN ĐỘNG & KẾT THÚC (OFFBOARDING)
  'LIFE-07': [
    {
      sopCode: 'SOP EMP15',
      sopTitle: 'Quy trình Giảm Lao động & Thanh lý HĐLĐ (Offboarding)',
      sopCategory: 'Biến động & Thôi việc',
      description: 'Xử lý đơn xin nghỉ việc, bàn giao công sản, quyết toán lương/phép và báo giảm BHXH.',
      steps: [
        {
          stepCode: 'EMP15.01',
          title: 'Nộp đơn xin nghỉ việc & Phỏng vấn nghỉ việc (Exit Interview)',
          actor: 'Nhân viên & HRM - Admin',
          location: 'Portal',
          timing: 'Trước 30 - 45 ngày theo luật',
          typeCode: 'N',
          description: 'Nhân viên nộp đơn xin nghỉ việc trên Portal. HR tiến hành phỏng vấn thôi việc (Exit Interview) để ghi nhận lý do.',
          fieldsChecklist: ['Lý do nghỉ việc', 'Ngày đăng ký thôi việc', 'Ngày làm việc cuối cùng', 'Biên bản Exit Interview']
        },
        {
          stepCode: 'EMP15.02',
          title: 'Phê duyệt đơn thôi việc & Thông báo bàn giao',
          actor: 'Trưởng bộ phận & HRD',
          location: 'Portal',
          timing: 'Trong 3-5 ngày sau khi nộp',
          typeCode: 'M',
          description: 'TBP và HRD duyệt đơn thôi việc, phát hành Check-list bàn giao công việc & trang thiết bị.',
          fieldsChecklist: ['Quyết định thôi việc', 'Người tiếp nhận bàn giao', 'Checklist tài sản IT/Hành chính cần nộp lại']
        },
        {
          stepCode: 'EMP15.03',
          title: 'Xác nhận hoàn tất bàn giao công sản',
          actor: 'IT / Hành chính / Tài chính',
          location: 'Portal',
          timing: 'Trước ngày làm việc cuối cùng',
          typeCode: 'A',
          description: 'Các bộ phận xác nhận nhân viên đã thu hồi máy tính, thẻ NV, thanh toán công nợ và hoàn tất bàn giao.',
          fieldsChecklist: ['Xác nhận thu hồi máy tính IT', 'Xác nhận trả thẻ NV & Đồng phục', 'Xác nhận công nợ tài chính']
        },
        {
          stepCode: 'EMP15.04',
          title: 'Quyết toán lương, phép tồn & Báo giảm BHXH (INS04)',
          actor: 'HRM - C&B & Bảo hiểm',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Kỳ lương nghỉ việc',
          typeCode: 'A',
          description: 'C&B tính toán trợ cấp thôi việc, thanh toán ngày phép tồn chưa nghỉ, HRM Bảo hiểm nộp hồ sơ Báo giảm BHXH và chốt sổ.',
          fieldsChecklist: ['Số ngày phép tồn trả bù', 'Lương quyết toán đến ngày nghỉ', 'Hồ sơ Báo giảm BHXH (INS04)', 'Quyết định chấm dứt HĐLĐ']
        }
      ]
    }
  ]
}
