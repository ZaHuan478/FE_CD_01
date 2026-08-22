import type { SopSubProcess } from '../types'

// 100% Complete SOP Database mapped for ALL 7 Lifecycle Steps & Cross-Functional Operations from 1.EMP.HRM.SOP.docx
export const SOP_DATABASE: Record<string, SopSubProcess[]> = {
  // LIFE-00: ĐỊNH BIÊN NHÂN SỰ (HEADCOUNT BUDGET PLANNING)
  'LIFE-00': [
    {
      sopCode: 'SOP-EMP-01',
      sopTitle: 'Quy trình Thiết lập định biên nhân sự (Headcount Budget Planning)',
      sopCategory: 'Hoạch định & Ngân sách Nhân sự',
      description: 'Quy trình lập kế hoạch định biên nhân sự hàng năm, tham vấn HRBP, điều chỉnh số liệu, phê duyệt BOD và cập nhật Master Data kiểm soát tuyển dụng.',
      steps: [
        {
          stepCode: 'EMP01.01',
          title: 'Thiết lập định biên nhân sự',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal Quản lý',
          timing: 'Đầu năm / Kế hoạch năm',
          typeCode: 'N',
          description: 'TBP xây dựng định biên phòng ban: Năm, Phòng ban, Chức vụ, Cấp độ, Tháng chi tiết 12 tháng, Thu nhập.',
          fieldsChecklist: ['Năm xây dựng', 'Phòng ban', 'Chức vụ', 'Cấp độ (Level)', 'Kế hoạch 12 tháng', 'Thu nhập / People Cost']
        },
        {
          stepCode: 'EMP01.02',
          title: 'Tham vấn định biên',
          actor: 'HRBP',
          location: 'Portal',
          timing: 'Sau khi TBP nộp',
          typeCode: 'M',
          description: 'HRBP phối hợp kiểm tra, đánh giá tính hợp lý của kế hoạch định biên theo ngân sách và chiến lược công ty.',
          fieldsChecklist: ['Đánh giá tính hợp lý', 'So khớp khung năng lực', 'Ý kiến tham vấn HRBP']
        },
        {
          stepCode: 'EMP01.03',
          title: 'Điều chỉnh định biên',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Portal Quản lý',
          timing: 'Khi nhận phản hồi HRBP',
          typeCode: 'N',
          description: 'TBP tiếp nhận phản hồi từ HRBP và thực hiện điều chỉnh lại số liệu định biên (nếu có).',
          fieldsChecklist: ['Số liệu điều chỉnh', 'Ghi chú giải trình', 'Bản định biên hoàn thiện']
        },
        {
          stepCode: 'EMP01.04',
          title: 'Duyệt định biên',
          actor: 'Ban Giám Đốc (BOD)',
          location: 'Portal & Họp BOD',
          timing: 'Hạn chót duyệt quý 1',
          typeCode: 'M',
          description: 'Ban Giám Đốc (BOD) xem xét và phê duyệt bản định biên cuối cùng của các phòng ban.',
          fieldsChecklist: ['Quyết định phê duyệt BOD', 'Chữ ký số phê duyệt', 'Trần ngân sách People Cost']
        },
        {
          stepCode: 'EMP01.05',
          title: 'Cập nhật kết quả duyệt',
          actor: 'Chuyên viên C&B',
          location: 'HRM Core Engine',
          timing: 'Tức thì sau khi BOD duyệt',
          typeCode: 'A',
          description: 'Chuyên viên C&B cập nhật bản định biên đã duyệt vào hệ thống Master Data để làm trần giới hạn tuyển dụng và kiểm soát chi phí.',
          fieldsChecklist: ['Trần hạn mức tuyển dụng ATS', 'Khung định biên phòng ban Master Data', 'Báo cáo tổng hợp People Cost']
        }
      ]
    }
  ],
  // LIFE-01: TIẾP NHẬN & TUYỂN DỤNG (RECRUITMENT & ONBOARDING)
  'LIFE-01': [
    {
      sopCode: 'SOP REC01',
      sopTitle: 'Quy trình Yêu cầu & Phê duyệt Tuyển dụng (Recruitment Requisition)',
      sopCategory: 'Tuyển dụng & Định biên',
      description: 'Quy trình tạo yêu cầu tuyển dụng, đối soát hạn mức định biên phòng ban, thẩm định ngân sách People Cost và phê duyệt đăng tuyển.',
      steps: [
        {
          stepCode: 'REC01.01',
          title: 'Trưởng bộ phận (TBP) lập Yêu cầu tuyển dụng trên Portal',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Khi phát sinh nhu cầu tuyển dụng',
          typeCode: 'N',
          description: 'TBP chọn chức danh từ Job Catalog (MD-06), số lượng cần tuyển, lý do tuyển (Mới/Thay thế/Dự án), ngày cần nhận việc và dải lương đề xuất.',
          fieldsChecklist: ['Mã phòng ban', 'Chức danh tuyển dụng (Từ Job Catalog)', 'Số lượng tuyển', 'Lý do tuyển', 'Ngày mục tiêu nhận việc', 'Dải lương đề xuất']
        },
        {
          stepCode: 'REC01.02',
          title: 'Cổng Màng Lọc Tự Động: Đối soát Hạn mức Định biên & Ngân sách',
          actor: 'Hệ thống HRM Engine (AI Auto-Gate)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra ngay khi nộp',
          typeCode: 'A',
          description: 'Hệ thống tự động so khớp với Bản kế hoạch định biên (EMP01) và Khung ngạch bậc lương (MD-07). Tự động phân loại: Trong định biên (Luồng nhanh) hoặc Vượt định biên (Trình BOM).',
          fieldsChecklist: ['Chỉ tiêu định biên khả dụng', 'Trần ngân sách lương vị trí', 'Tỷ lệ biến động nhân sự phòng ban', 'Phân loại luồng rẽ nhánh duyệt']
        },
        {
          stepCode: 'REC01.03',
          title: 'Thẩm định của Trưởng phòng Nhân sự (HRM / HRD)',
          actor: 'HRM / HRD',
          location: 'Portal',
          timing: 'Trong 24h - 48h làm việc',
          typeCode: 'M',
          description: 'HRM thẩm định tính khả thi của nguồn ứng viên trên thị trường, rà soát lại JD tiêu chuẩn và xác nhận nguồn ngân sách tuyển dụng.',
          fieldsChecklist: ['Bản mô tả công việc (JD chuẩn)', 'Nguồn ngân sách tuyển dụng', 'Kênh đăng tuyển dự kiến (Job Site/Headhunt)']
        },
        {
          stepCode: 'REC01.04',
          title: 'Phê duyệt Yêu cầu Tuyển dụng & Ngân sách People Cost',
          actor: 'Ban Giám Đốc (BOM) / HRD',
          location: 'Portal & Họp BOM',
          timing: 'Sau khi HRM thẩm định',
          typeCode: 'M',
          description: 'Ban Giám đốc (hoặc HRD theo ủy quyền) xem xét tờ trình tuyển dụng và đưa ra quyết định phê duyệt chính thức.',
          fieldsChecklist: ['Quyết định phê duyệt tuyển dụng', 'Hạn mức chi phí tuyển dụng', 'Chữ ký số phê duyệt BOM']
        },
        {
          stepCode: 'REC01.05',
          title: 'Phát hành Ticket Tuyển dụng & Kích hoạt Đăng tuyển (Job Posting)',
          actor: 'Hệ thống HRM - Tuyển dụng (Auto Execution)',
          location: 'Bên trong / Career Portal',
          timing: 'Sau khi được duyệt 100%',
          typeCode: 'A',
          description: 'Tự động sinh Mã Requisition ID, phân công Chuyên viên tuyển dụng (Recruiter PIC) và tự động đồng bộ tin tuyển dụng lên Career Portal và các Job Sites.',
          fieldsChecklist: ['Mã Requisition ID', 'Chuyên viên tuyển dụng phụ trách (PIC)', 'Trạng thái: Đang mở tuyển dụng (Open)', 'Đồng bộ Career Portal & LinkedIn/TopCV']
        }
      ]
    },
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

  // LIFE-04: HỢP ĐỒNG LAO ĐỘNG & ĐÁNH GIÁ THỬ VIỆC
  'LIFE-04': [
    {
      sopCode: 'SOP PROB01',
      sopTitle: 'Quy trình Đánh giá Thử việc & Tái ký Hợp đồng (Probation & Renewal)',
      sopCategory: 'Hợp đồng & Đánh giá (EVAL)',
      description: 'Hệ thống tự động cảnh báo trước 30 ngày, phân luồng rẽ nhánh KPI: Đạt (Tái ký chính thức 12/24M & Báo tăng BHXH), Gia hạn tối đa 30 ngày hoặc Dừng thử việc.',
      steps: [
        {
          stepCode: 'PROB01.01',
          title: 'Hệ thống tự động quét & Gửi cảnh báo trước 30 ngày',
          actor: 'Hệ thống HRM Engine (AI Auto-Scan)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: '30 ngày trước khi hết hạn HĐ Thử việc / HĐLĐ',
          typeCode: 'A',
          description: 'Hệ thống tự động quét và kích hoạt phiếu Đánh giá thử việc 360 trên Portal, gửi thông báo nhắc tới Nhân viên và Trưởng bộ phận.',
          fieldsChecklist: ['Mã NV & Tên NV', 'Số HĐ Thử việc hiện tại', 'Ngày hết hạn hợp đồng', 'Biểu mẫu đánh giá năng lực & KPI']
        },
        {
          stepCode: 'PROB01.02',
          title: 'Nhân viên tự đánh giá & Trưởng bộ phận chấm điểm KPI',
          actor: 'Nhân viên & Trưởng bộ phận (TBP)',
          location: 'Employee / Manager Portal',
          timing: 'Trước khi hết hạn 15 ngày',
          typeCode: 'N',
          description: 'Nhân viên tự đánh giá kết quả công việc. TBP chấm điểm KPI theo thang điểm chuẩn, đưa ra nhận xét năng lực và đề xuất xử lý.',
          fieldsChecklist: ['Điểm KPI tự đánh giá', 'Điểm KPI TBP chấm', 'Nhận xét ưu/nhược điểm', 'Đề xuất: Đạt / Gia hạn / Không đạt']
        },
        {
          stepCode: 'PROB01.03',
          title: 'Cổng Màng Lọc Tự Động: Rẽ nhánh Quyết định theo Điểm KPI',
          actor: 'Hệ thống HRM Engine (AI Decision Matrix)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động ngay khi có điểm KPI',
          typeCode: 'A',
          description: 'Phân luồng quyết định: Nhánh 1 (KPI >= 85%: Tái ký HĐ chính thức 12/24M), Nhánh 2 (KPI 70-84%: Gia hạn tối đa 30 ngày), Nhánh 3 (KPI < 70%: Dừng thử việc).',
          fieldsChecklist: ['Điểm KPI tổng hợp', 'Nhánh điều kiện phân luồng', 'Loại hợp đồng kế tiếp (12M/24M/Không thời hạn)', 'Khung lương chính thức 100%']
        },
        {
          stepCode: 'PROB01.04',
          title: 'Phê duyệt Tái ký của Trưởng phòng Nhân sự & Ban Giám Đốc',
          actor: 'HRM / Ban Giám Đốc (BOM)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Trước khi hết hạn 7 ngày',
          typeCode: 'M',
          description: 'HRM thẩm định hồ sơ, Ban Giám đốc phê duyệt ký số Hợp đồng lao động chính thức hoặc Thông báo chấm dứt thử việc.',
          fieldsChecklist: ['Quyết định phê duyệt tái ký', 'Hạn mức lương chính thức', 'Chữ ký số BOM']
        },
        {
          stepCode: 'PROB01.05',
          title: 'Phát hành HĐLĐ Chính thức & Tự động Báo tăng BHXH (INS02)',
          actor: 'Hệ thống HRM Engine (Auto Execution)',
          location: 'Bên trong / C&B Module',
          timing: 'Vào ngày bắt đầu HĐ chính thức',
          typeCode: 'A',
          description: 'Tự động phát hành HĐLĐ chính thức, cập nhật trạng thái nhân viên sang "Chính thức", trích xuất dữ liệu tự động Báo tăng BHXH.',
          fieldsChecklist: ['Số HĐLĐ mới', 'Trạng thái: Nhân viên chính thức', 'Mức lương đóng BHXH', 'Đồng bộ danh sách Báo tăng BHXH (INS02)']
        }
      ]
    },
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

  // LIFE-05: ĐIỀU CHỈNH LƯƠNG & BỔ NHIỆM THĂNG CHỨC
  'LIFE-05': [
    {
      sopCode: 'SOP PROM01',
      sopTitle: 'Quy trình Điều chỉnh Lương & Bổ nhiệm Thăng chức (Salary & Promotion)',
      sopCategory: 'Lương & Đãi ngộ (C&B)',
      description: 'Quy trình tăng lương định kỳ/vượt khung và bổ nhiệm quản lý: Thẩm định khung ngạch bậc, ngân sách quỹ lương và phê duyệt của BOM.',
      steps: [
        {
          stepCode: 'PROM01.01',
          title: 'Trưởng bộ phận lập Đề xuất Tăng lương / Bổ nhiệm Thăng chức',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Kỳ đánh giá định kỳ hoặc đột xuất',
          typeCode: 'N',
          description: 'TBP khai báo mức lương hiện tại, mức lương đề xuất mới, % tăng, chức danh bổ nhiệm mới và lý do thành tích đóng góp.',
          fieldsChecklist: ['Mã NV & Chức danh', 'Mức lương hiện tại', 'Mức lương đề xuất mới', 'Tỷ lệ % tăng', 'Chức vụ bổ nhiệm mới', 'Lý do & Thành tích KPI']
        },
        {
          stepCode: 'PROM01.02',
          title: 'Cổng Màng Lọc Tự Động: Đối soát Thang Bảng Lương & Quỹ Lương',
          actor: 'Hệ thống HRM Engine (AI Auto-Gate)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra ngay khi nộp',
          typeCode: 'A',
          description: 'Hệ thống đối soát mức lương đề xuất với Khung Ngạch Bậc (MD-07), kiểm tra số dư Quỹ lương khả dụng của phòng ban và thâm niên nhân sự.',
          fieldsChecklist: ['Khung ngạch bậc tương ứng (MD-07)', 'Hạn mức ngân sách quỹ lương khả dụng', 'Điều kiện thâm niên & Lịch sử KPI', 'Phân loại luồng rẽ nhánh duyệt']
        },
        {
          stepCode: 'PROM01.03',
          title: 'Thẩm định của Chuyên viên C&B và Trưởng phòng Nhân sự',
          actor: 'HRM - C&B & HRD',
          location: 'Portal',
          timing: 'Trong 2-3 ngày làm việc',
          typeCode: 'M',
          description: 'C&B thẩm định tính công bằng nội bộ, rà soát lại phụ cấp trách nhiệm và xác nhận tính hợp lệ của nguồn ngân sách.',
          fieldsChecklist: ['Bảng so sánh mặt bằng lương nội bộ', 'Cơ cấu phụ cấp trách nhiệm mới', 'Ý kiến thẩm định của C&B / HRD']
        },
        {
          stepCode: 'PROM01.04',
          title: 'Phê duyệt Điều chỉnh Lương / Bổ nhiệm của Ban Giám Đốc (BOM)',
          actor: 'Ban Giám Đốc (BOM)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Sau khi HRD thẩm định',
          typeCode: 'M',
          description: 'Ban Giám đốc xem xét phê duyệt Quyết định tăng lương hoặc Quyết định bổ nhiệm thăng chức cán bộ quản lý.',
          fieldsChecklist: ['Quyết định tăng lương / Bổ nhiệm', 'Ngày hiệu lực áp dụng', 'Chữ ký số BOM']
        },
        {
          stepCode: 'PROM01.05',
          title: 'Tự động Cập nhật Org Chart, Bảng lương PAY01 & Sinh Phụ lục HĐLĐ',
          actor: 'Hệ thống HRM Engine (Auto Execution)',
          location: 'Bên trong / C&B Module',
          timing: 'Trước kỳ tính lương mới',
          typeCode: 'A',
          description: 'Tự động cập nhật mức lương mới vào Bảng lương PAY01, cập nhật Sơ đồ tổ chức Org Chart (nếu bổ nhiệm) và phát hành Phụ lục HĐLĐ.',
          fieldsChecklist: ['Phụ lục HĐLĐ điều chỉnh lương', 'Cập nhật Bảng lương PAY01 tự động', 'Cập nhật Sơ đồ tổ chức Org Chart', 'Thông báo gửi nhân viên qua App']
        }
      ]
    },
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

  // LIFE-06: CHẤM CÔNG & QUẢN LÝ LÀM VIỆC (ATTENDANCE & TIME TRACKING)
  'LIFE-06': [
    {
      sopCode: 'SOP ATT01',
      sopTitle: 'Quy trình Đăng ký & Phê duyệt Làm Thêm Giờ (Overtime - OT Management)',
      sopCategory: 'Chấm công & Tăng ca',
      description: 'Quy trình đăng ký kế hoạch làm thêm giờ, đối soát hạn mức luật lao động, kiểm tra dữ liệu chấm công in/out thực tế và tính lương/nghỉ bù.',
      steps: [
        {
          stepCode: 'ATT01.01',
          title: 'Nhân viên / Trưởng nhóm nộp Đăng ký Làm thêm giờ (OT) trước ca',
          actor: 'Nhân viên / Team Lead',
          location: 'Employee Portal / Mobile App',
          timing: 'Trước khi bắt đầu ca OT ít nhất 2 giờ',
          typeCode: 'N',
          description: 'Khai báo loại ngày làm thêm (Ngày thường / Cuối tuần / Lễ tết), giờ bắt đầu - kết thúc, tổng số giờ OT dự kiến, lý do công việc và danh sách nhân sự tham gia.',
          fieldsChecklist: ['Mã NV / Danh sách nhóm', 'Loại ngày OT (Thường/CN/Lễ)', 'Khung giờ bắt đầu - kết thúc', 'Tổng số giờ OT dự kiến', 'Lý do & Nhiệm vụ cần làm', 'Hình thức: Nhận lương OT / Nghỉ bù']
        },
        {
          stepCode: 'ATT01.02',
          title: 'Cổng Màng Lọc Tự Động: Rà soát Trần Giờ OT theo Luật Lao Động',
          actor: 'Hệ thống HRM Engine (AI Auto-Gate)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra ngay khi nộp',
          typeCode: 'A',
          description: 'Hệ thống tự động kiểm tra tổng số giờ OT lũy kế trong tháng (Hạn mức 40h/tháng) và trong năm (Hạn mức 200h/năm). Chặn nộp nếu vi phạm luật lao động hoặc chưa có đơn duyệt trước.',
          fieldsChecklist: ['Số giờ OT lũy kế trong tháng', 'Số giờ OT lũy kế trong năm', 'Cảnh báo vi phạm trần 40h/tháng', 'Trạng thái màng lọc: Hợp lệ / Cảnh báo / Khóa']
        },
        {
          stepCode: 'ATT01.03',
          title: 'Thẩm định & Phê duyệt của Trưởng bộ phận (TBP)',
          actor: 'Trưởng bộ phận (Line Manager)',
          location: 'Manager Portal / App',
          timing: 'Trước khi bắt đầu làm thêm',
          typeCode: 'M',
          description: 'TBP xem xét tính cấp thiết của công việc, kiểm tra ngân sách chi phí làm thêm giờ của bộ phận và phê duyệt đơn OT.',
          fieldsChecklist: ['Ý kiến phê duyệt TBP', 'Hạn mức ngân sách OT phòng ban', 'Xác nhận khối lượng công việc hoàn thành']
        },
        {
          stepCode: 'ATT01.04',
          title: 'Đối soát Dữ liệu Quẹt Thẻ / Chấm Công Thực Tế (In/Out Auto-Match)',
          actor: 'Hệ thống HRM Engine (Attendance Matcher)',
          location: 'Hệ thống Chấm công',
          timing: 'Sau khi kết thúc ca làm thêm',
          typeCode: 'A',
          description: 'Tự động đối soát thời gian quét vân tay / Face ID thực tế với khung giờ đăng ký trên đơn OT. Hệ thống chỉ ghi nhận giờ OT thực tế nhỏ hơn hoặc bằng giờ được duyệt.',
          fieldsChecklist: ['Giờ quẹt thẻ vào (In)', 'Giờ quẹt thẻ ra (Out)', 'Số giờ OT thực tế được công nhận', 'Sai số thời gian (<= 15 phút)']
        },
        {
          stepCode: 'ATT01.05',
          title: 'Đồng bộ Dữ liệu vào Bảng Lương C&B hoặc Quỹ Nghỉ Bù',
          actor: 'Hệ thống HRM - C&B (Auto Sync)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Kỳ chốt công hàng tháng',
          typeCode: 'A',
          description: 'Tự động áp hệ số tính lương làm thêm giờ (150% ngày thường, 200% ngày nghỉ tuần, 300% ngày lễ) vào Bảng lương PAY01 hoặc cộng dồn vào Quỹ ngày nghỉ bù (Comp-time).',
          fieldsChecklist: ['Tổng giờ OT 150%', 'Tổng giờ OT 200%', 'Tổng giờ OT 300%', 'Lương làm thêm giờ thực nhận', 'Số giờ chuyển đổi nghỉ bù']
        }
      ]
    },
    {
      sopCode: 'SOP ATT02',
      sopTitle: 'Quy trình Đăng ký & Phê duyệt Đơn Nghỉ Phép (Leave Management)',
      sopCategory: 'Chấm công & Quản lý Nghỉ phép',
      description: 'Quy trình tạo đơn xin nghỉ phép, thẩm định điều kiện quỹ phép tồn, kiểm tra thời gian báo trước và chuỗi 5 cấp phê duyệt.',
      steps: [
        {
          stepCode: 'ATT02.01',
          title: 'Nhân viên nộp Đơn xin nghỉ phép trên Mobile App / Portal',
          actor: 'Nhân viên',
          location: 'Employee Portal / Mobile App',
          timing: 'Trước khi nghỉ phép theo quy định',
          typeCode: 'N',
          description: 'Nhân viên chọn loại phép (Phép năm, Phép việc riêng, Nghỉ bù, Nghỉ không lương), nhập thời gian bắt đầu - kết thúc & lý do nghỉ phép.',
          fieldsChecklist: ['Mã NV', 'Loại phép nghỉ', 'Từ ngày - Đến ngày', 'Tổng số ngày nghỉ', 'Lý do nghỉ', 'File chứng từ đính kèm (nếu có)']
        },
        {
          stepCode: 'ATT02.02',
          title: 'Cổng kiểm tra Điều kiện 1: Thời gian báo trước & Quỹ phép tồn',
          actor: 'Hệ thống HRM Engine (Auto Gate 1)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra ngay khi nộp',
          typeCode: 'A',
          description: 'Hệ thống tự động tính số ngày nghỉ, kiểm tra thời gian nộp đơn theo ma trận báo trước (24h / 5-7 ngày / 15 ngày) và đối soát số dư Quỹ phép năm.',
          fieldsChecklist: ['Số ngày nghỉ khả dụng', 'Số dư quỹ phép năm', 'Thời gian nộp trước hạn', 'Phân loại luồng duyệt']
        },
        {
          stepCode: 'ATT02.03',
          title: 'Người nhận bàn giao & Trưởng bộ phận thẩm định',
          actor: 'Người nhận bàn giao & TBP',
          location: 'Manager Portal / App',
          timing: 'Trong 24h làm việc',
          typeCode: 'M',
          description: 'Người nhận bàn giao xác nhận tiếp nhận việc, Trưởng bộ phận xem xét kế hoạch công việc phòng ban và phê duyệt đơn.',
          fieldsChecklist: ['Xác nhận Người nhận bàn giao', 'Trạng thái duyệt TBP', 'Ghi chú thẩm định']
        },
        {
          stepCode: 'ATT02.04',
          title: 'Phê duyệt bổ sung của HR Manager / Giám Đốc (Nếu > 3 ngày)',
          actor: 'HR Manager / Ban Giám Đốc (Auto Gate 2)',
          location: 'Portal',
          timing: 'Khi nghỉ từ 3 ngày trở lên',
          typeCode: 'M',
          description: 'Nếu nghỉ từ 3 ngày trở lên hoặc trường hợp đặc biệt, hệ thống tự động chuyển tiếp đơn lên HR Manager hoặc Ban Giám đốc xem xét phê duyệt.',
          fieldsChecklist: ['Phê duyệt HR Manager', 'Quyết định Giám đốc (Nghỉ > 3 ngày)', 'Biên bản thống nhất nhân sự thay thế']
        },
        {
          stepCode: 'ATT02.05',
          title: 'Trừ quỹ phép năm & Đồng bộ Bảng chấm công C&B',
          actor: 'Hệ thống HRM Engine (Auto Execution)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Sau khi đơn được duyệt 100%',
          typeCode: 'A',
          description: 'Tự động trừ số ngày phép vào Quỹ phép năm (hoặc ghi nhận Nghỉ không hưởng lương), cập nhật ký hiệu công phép vào Bảng chấm công C&B (ATT01).',
          fieldsChecklist: ['Số ngày phép đã trừ', 'Số phép còn lại', 'Ký hiệu công: P (Phép năm) / KL (Không lương)', 'Đồng bộ Bảng lương C&B']
        }
      ]
    },
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

  // LIFE-07: BIẾN ĐỘNG, THÔI VIỆC & BÀN GIAO 4 BÊN (OFFBOARDING)
  'LIFE-07': [
    {
      sopCode: 'SOP OFF01',
      sopTitle: 'Quy trình Thủ tục Thôi việc & Bàn giao 4 Bên (Offboarding & Handover)',
      sopCategory: 'Biến động & Thôi việc (EMP/INS)',
      description: 'Quy trình thôi việc chuẩn hóa: Bàn giao công việc, thu hồi tài sản IT, quyết toán tài chính hành chính và chốt sổ bảo hiểm xã hội.',
      steps: [
        {
          stepCode: 'OFF01.01',
          title: 'Nhân viên nộp Đơn thôi việc & Thực hiện Exit Interview',
          actor: 'Nhân viên & HR Admin',
          location: 'Employee Portal',
          timing: 'Trước 30 - 45 ngày theo quy định HĐLĐ',
          typeCode: 'N',
          description: 'Nhân viên nộp đơn thôi việc trên Portal, chọn lý do nghỉ việc, ngày làm việc cuối cùng và thực hiện khảo sát phỏng vấn nghỉ việc (Exit Interview).',
          fieldsChecklist: ['Mã NV & Chức danh', 'Lý do thôi việc', 'Ngày nộp đơn', 'Ngày làm việc cuối cùng', 'Khảo sát Exit Interview']
        },
        {
          stepCode: 'OFF01.02',
          title: 'Cổng Màng Lọc Tự Động: Rà soát Cam kết Đào tạo & Thời hạn Báo trước',
          actor: 'Hệ thống HRM Engine (AI Auto-Gate)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra ngay khi nộp',
          typeCode: 'A',
          description: 'Hệ thống đối soát thời hạn báo trước theo luật định (30d/45d), kiểm tra các hợp đồng đào tạo có cam kết hoàn phí và công nợ tạm ứng.',
          fieldsChecklist: ['Số ngày báo trước thực tế', 'Hợp đồng cam kết đào tạo (nếu có)', 'Công nợ tạm ứng tài chính', 'Phân loại luồng bàn giao']
        },
        {
          stepCode: 'OFF01.03',
          title: 'Chuỗi Bàn Giao 4 Bên Liên Phòng Ban (Liên phòng ban xác nhận)',
          actor: '4 Bên: TBP / IT / Hành chính / Kế toán',
          location: 'Manager Portal / Task Center',
          timing: 'Trong 7 ngày trước khi nghỉ',
          typeCode: 'M',
          description: '❶ Bàn giao công việc (TBP xác nhận) ➔ ❷ Thu hồi Laptop/Quyền truy cập IT ➔ ❸ Thu hồi thẻ/Đồng phục ➔ ❹ Quyết toán công nợ tài chính.',
          fieldsChecklist: ['Xác nhận Bàn giao công việc', 'Xác nhận Thu hồi thiết bị IT & Khóa tài khoản', 'Xác nhận Thu hồi thẻ NV & Hành chính', 'Xác nhận Hoàn ứng tài chính']
        },
        {
          stepCode: 'OFF01.04',
          title: 'Phê duyệt Quyết định Thôi việc của Ban Giám Đốc (BOM)',
          actor: 'Ban Giám Đốc (BOM)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Trước ngày làm việc cuối cùng',
          typeCode: 'M',
          description: 'Ban Giám đốc phê duyệt ký số Quyết định chấm dứt hợp đồng lao động và thanh lý hợp đồng.',
          fieldsChecklist: ['Quyết định chấm dứt HĐLĐ', 'Ngày hiệu lực thanh lý', 'Chữ ký số BOM']
        },
        {
          stepCode: 'OFF01.05',
          title: 'Quyết toán Lương/Phép, Báo giảm BHXH (INS04) & Chốt sổ',
          actor: 'Hệ thống HRM Engine & C&B',
          location: 'Bên trong / C&B Module',
          timing: 'Kỳ thanh toán quyết toán thôi việc',
          typeCode: 'A',
          description: 'Tự động tính tiền phép tồn chưa nghỉ, tính trợ cấp thôi việc (nếu có), xuất dữ liệu Báo giảm BHXH và khóa tài khoản vĩnh viễn.',
          fieldsChecklist: ['Bảng tính quyết toán thôi việc (Final Pay)', 'Thanh toán tiền ngày phép tồn', 'Hồ sơ Báo giảm BHXH (INS04)', 'Khóa tài khoản vĩnh viễn lúc 18h00']
        }
      ]
    },
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
