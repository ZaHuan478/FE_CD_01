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
      sopTitle: 'Quy trình Tăng nhân viên mới không qua Tuyển dụng (EMP02 Onboarding & KPI)',
      sopCategory: 'Tiếp nhận & Đánh giá Thử việc',
      description: 'Lưu đồ 6 phân làn: Tiếp nhận nhân sự, chuẩn bị IT/cơ sở vật chất, đào tạo hội nhập, quản trị KPI 60 ngày thử việc và rẽ nhánh Ký HĐLĐ hoặc Thanh lý.',
      steps: [
        {
          stepCode: 'EMP02.01',
          title: 'Danh sách nhân viên chờ nhận việc',
          actor: 'HRM - Tuyển dụng',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Khi có Offer xác nhận / Tiếp nhận trực tiếp',
          typeCode: 'N',
          description: 'Cập nhật danh sách nhân sự mới hoặc nhân sự cũ tái tuyển dụng cấp mã mới. Khởi tạo hồ sơ chờ nhận việc.',
          fieldsChecklist: ['Mã NV mới (EMP ID)', 'Họ tên', 'Vị trí công tác', 'Phòng ban', 'Ngày nhận việc', 'Dải lương & Loại HĐLĐ']
        },
        {
          stepCode: 'EMP02.02',
          title: 'Thông báo task đến các bộ phận (IT / Hành chính)',
          actor: 'BP (Bộ phận IT / Hành chính)',
          location: 'Ticket System / Portal',
          timing: 'Trước ngày nhận việc',
          typeCode: 'A',
          description: 'Tự động phân bổ task chuẩn bị cơ sở vật chất, cấp email, máy tính, thẻ từ ra vào & vị trí chỗ ngồi.',
          fieldsChecklist: ['Ticket cấp Email công ty', 'Ticket cấp Laptop/PC', 'Thẻ nhân viên & Thẻ từ', 'Vị trí bàn làm việc']
        },
        {
          stepCode: 'EMP02.03',
          title: 'Cập nhật kết quả Task chuẩn bị & Gửi mail thông báo',
          actor: 'BP (Bộ phận IT / Hành chính)',
          location: 'Portal',
          timing: 'Trước 08:30 Ngày 1',
          typeCode: 'M',
          description: 'Xác nhận đã bàn giao đầy đủ trang thiết bị và tài khoản làm việc. Gửi mail thông báo tới HRM Tuyển dụng.',
          fieldsChecklist: ['Trạng thái Task = Hoàn thành', 'Tài khoản Email/Domain đã kích hoạt', 'Gửi mail thông báo hoàn tất']
        },
        {
          stepCode: 'EMP02.04',
          title: 'Truy vấn kết quả thực hiện task chuẩn bị',
          actor: 'HRM - Tuyển dụng',
          location: 'Portal',
          timing: '08:30 Ngày 1',
          typeCode: 'A',
          description: 'Kiểm tra và xác nhận 100% cơ sở vật chất & tài khoản đã sẵn sàng đón nhân sự mới trong ngày đầu.',
          fieldsChecklist: ['Checklist Onboarding Ready', 'Xác nhận bàn giao thiết bị']
        },
        {
          stepCode: 'EMP02.05',
          title: 'Cập nhật hồ sơ nhân viên & Kích hoạt trạng thái',
          actor: 'HRM - Tuyển dụng',
          location: 'Core EMP',
          timing: 'Ngày 1 nhận việc',
          typeCode: 'A',
          description: 'Số hóa đầy đủ giấy tờ tùy thân, bằng cấp, thông tin thuế & chuyển trạng thái hồ sơ sang [Đang thử việc].',
          fieldsChecklist: ['Trạng thái: Đang thử việc', 'Hồ sơ pháp lý số hóa', 'Kích hoạt tài khoản Employee Portal']
        },
        {
          stepCode: 'EMP02.06',
          title: 'Giao mục tiêu KPI cho NV thử việc (TBP)',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Trong 03 ngày đầu',
          typeCode: 'M',
          description: 'Trưởng bộ phận thiết lập bộ chỉ tiêu đánh giá 60 ngày thử việc và gửi mail thông báo cho nhân viên mới.',
          fieldsChecklist: ['Bộ chỉ tiêu KPI thử việc', 'Trọng số đánh giá (%)', 'Tiêu chuẩn chất lượng công việc', 'Gửi mail thông báo']
        },
        {
          stepCode: 'EMP02.07',
          title: 'Truy vấn & Xác nhận mục tiêu KPI',
          actor: 'Nhân viên mới (NV)',
          location: 'Employee Mobile App / Portal',
          timing: 'Trong 05 ngày đầu',
          typeCode: 'N',
          description: 'Nhân viên truy cập ứng dụng HRMS để tiếp nhận, làm rõ và bấm cam kết thực hiện mục tiêu thử việc.',
          fieldsChecklist: ['Xác nhận cam kết KPI điện tử', 'Thời hạn hoàn thành']
        },
        {
          stepCode: 'EMP02.08',
          title: 'Danh sách NV tham gia đào tạo hội nhập',
          actor: 'HRM - Đào tạo',
          location: 'L&D Portal',
          timing: 'Tuần 1 - Tuần 2',
          typeCode: 'N',
          description: 'Lập danh sách và gửi thư mời tham gia khóa đào tạo văn hóa doanh nghiệp & quy chế công ty.',
          fieldsChecklist: ['Danh sách học viên', 'Lịch đào tạo Onboarding', 'Giảng viên nội bộ']
        },
        {
          stepCode: 'EMP02.09',
          title: 'Cập nhật kết quả đào tạo hội nhập',
          actor: 'HRM - Đào tạo',
          location: 'L&D Portal',
          timing: 'Sau khóa học 48h',
          typeCode: 'M',
          description: 'Chấm điểm bài test kiểm tra hội nhập và ghi nhận kết quả (Yêu cầu đạt >= 80% điểm). Gửi mail thông báo.',
          fieldsChecklist: ['Điểm bài test trắc nghiệm', 'Chứng chỉ hoàn thành Onboarding', 'Gửi mail thông báo kết quả']
        },
        {
          stepCode: 'EMP02.10',
          title: 'Cập nhật kết quả tự đánh giá KPI thử việc',
          actor: 'Nhân viên mới (NV)',
          location: 'Employee Portal',
          timing: 'Trước khi hết hạn 10 ngày',
          typeCode: 'N',
          description: 'Nhân viên tự chấm điểm và đính kèm báo cáo sản phẩm công việc thực tế trong 60 ngày. Gửi mail tới TBP.',
          fieldsChecklist: ['Báo cáo kết quả thử việc', 'Điểm tự đánh giá', 'Gửi mail nộp đánh giá']
        },
        {
          stepCode: 'EMP02.11',
          title: 'Đánh giá kết quả KPI & Quyết định nhân sự (Decision)',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Trước khi hết hạn 07 ngày',
          typeCode: 'M',
          description: 'TBP đánh giá, nhận xét và ra quyết định: ĐẠT (>= 85% điểm) chuyển Ký HĐLĐ hoặc KHÔNG ĐẠT chuyển Thanh lý.',
          fieldsChecklist: ['Điểm đánh giá chính thức của TBP', 'Quyết định: Đạt / Không đạt', 'Gửi mail thông báo & Trả kết quả đánh giá']
        },
        {
          stepCode: 'EMP02.12',
          title: 'Truy vấn & Xem kết quả đánh giá KPI',
          actor: 'Nhân viên mới (NV)',
          location: 'Employee App',
          timing: 'Trước khi hết hạn 05 ngày',
          typeCode: 'N',
          description: 'Nhân viên nhận thông báo kết quả đánh giá chính thức từ Quản lý trực tiếp trên ứng dụng.',
          fieldsChecklist: ['Xem phiếu kết quả đánh giá', 'Ý kiến phản hồi (nếu có)']
        },
        {
          stepCode: 'EMP02.13',
          title: 'Ký hợp đồng lao động chính thức (Luồng Đạt)',
          actor: 'HRM - C&B',
          location: 'Core HR & E-Sign',
          timing: 'Trước khi hết hạn 03 ngày',
          typeCode: 'M',
          description: 'Phát hành Hợp đồng lao động chính thức, ký số 2 bên, cập nhật Master Data sang [Chính thức] & báo tăng BHXH.',
          fieldsChecklist: ['HĐLĐ chính thức có chữ ký số', 'Báo tăng BHXH (INS01)', 'Quyết định tiếp nhận chính thức']
        },
        {
          stepCode: 'EMP02.14',
          title: 'Thanh lý hợp đồng lao động thử việc (Luồng Không đạt)',
          actor: 'HRM - C&B',
          location: 'Portal',
          timing: 'Trước khi hết hạn 03 ngày',
          typeCode: 'M',
          description: 'Quyết toán ngày công thử việc, lập biên bản thanh lý hợp đồng và gửi mail thông báo dừng hợp tác.',
          fieldsChecklist: ['Bảng thanh toán lương thử việc', 'Biên bản thanh lý HĐLĐ', 'Gửi mail thông báo không đạt']
        },
        {
          stepCode: 'EMP02.15',
          title: 'Giảm lao động & Khóa quyền truy cập hệ thống',
          actor: 'HRM - C&B',
          location: 'Core HR',
          timing: 'Ngày làm việc cuối',
          typeCode: 'A',
          description: 'Ban hành Quyết định thôi việc, thu hồi tài sản IT, khóa quyền truy cập hệ thống và chuyển trạng thái Inactive.',
          fieldsChecklist: ['In Quyết định nghỉ việc', 'Biên bản thu hồi máy tính/thẻ', 'Khóa tài khoản Domain/Email lúc 18h']
        }
      ]
    },
    {
      sopCode: 'SOP EMP03',
      sopTitle: 'Quy trình Tăng nhân viên từ nhân viên cũ (EMP03 Lấy lại mã NV cũ)',
      sopCategory: 'Tuyển lại & Tiếp nhận',
      description: 'Lưu đồ 6 phân làn: Tiếp nhận lại nhân sự cũ, mở lại tài khoản IT cũ, kế thừa lịch sử thâm niên, đào tạo cập nhật, quản lý KPI thử việc và ký HĐLĐ nối tiếp.',
      steps: [
        {
          stepCode: 'EMP03.01',
          title: 'Danh sách nhân viên chờ nhận việc (Lấy lại mã NV cũ)',
          actor: 'HRM - Tuyển dụng',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Khi tiếp nhận đơn đăng ký / Offer lại',
          typeCode: 'N',
          description: 'Tra cứu hồ sơ nhân sự cũ, giữ nguyên Mã nhân viên cũ và khôi phục thông tin trên hệ thống.',
          fieldsChecklist: ['Mã NV cũ (Legacy EMP ID)', 'Lịch sử công tác trước đây', 'Lý do nghỉ việc cũ', 'Trạng thái Blacklist (Pass)']
        },
        {
          stepCode: 'EMP03.02',
          title: 'Thông báo task đến các bộ phận (Mở lại tài khoản IT)',
          actor: 'BP (Bộ phận IT / Hành chính)',
          location: 'Ticket System / Portal',
          timing: 'Trước ngày nhận việc',
          typeCode: 'A',
          description: 'Tự động phân bổ task khôi phục tài khoản Domain/Email cũ, phân quyền mới và chuẩn bị máy tính.',
          fieldsChecklist: ['Ticket mở lại Email cũ', 'Ticket mở lại tài khoản Domain', 'Bàn giao Laptop & thẻ từ']
        },
        {
          stepCode: 'EMP03.03',
          title: 'Cập nhật kết quả Task chuẩn bị & Gửi mail thông báo',
          actor: 'BP (Bộ phận IT / Hành chính)',
          location: 'Portal',
          timing: 'Trước 08:30 Ngày 1',
          typeCode: 'M',
          description: 'Xác nhận đã mở lại nick cũ, cài đặt xong máy tính và gửi mail thông báo cho Tuyển dụng.',
          fieldsChecklist: ['Trạng thái Task = Hoàn thành', 'Tài khoản cũ đã Active', 'Gửi mail thông báo sẵn sàng']
        },
        {
          stepCode: 'EMP03.04',
          title: 'Truy vấn kết quả thực hiện task chuẩn bị',
          actor: 'HRM - Tuyển dụng',
          location: 'Portal',
          timing: '08:30 Ngày 1',
          typeCode: 'A',
          description: 'Kiểm tra 100% tài khoản cũ đã mở lại và trang thiết bị đã sẵn sàng đón nhân sự.',
          fieldsChecklist: ['Checklist Onboarding Ready cho người cũ', 'Xác nhận bàn giao thiết bị']
        },
        {
          stepCode: 'EMP03.05',
          title: 'Cập nhật hồ sơ nhân viên (Tái kích hoạt)',
          actor: 'HRM - Tuyển dụng',
          location: 'Core EMP',
          timing: 'Ngày 1 nhận việc',
          typeCode: 'A',
          description: 'Chuyển trạng thái hồ sơ từ [Đã nghỉ việc] sang [Đang thử việc] trên hệ thống Core EMP.',
          fieldsChecklist: ['Trạng thái: Đang thử việc', 'Kế thừa lịch sử công tác', 'Kích hoạt lại tài khoản Portal']
        },
        {
          stepCode: 'EMP03.06',
          title: 'Giao mục tiêu KPI cho NV thử việc (TBP)',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Trong 03 ngày đầu',
          typeCode: 'M',
          description: 'Trưởng bộ phận thiết lập mục tiêu công việc & chỉ tiêu KPI cho giai đoạn thử việc mới.',
          fieldsChecklist: ['Bộ chỉ tiêu KPI thử việc', 'Trọng số đánh giá (%)', 'Tiêu chuẩn chất lượng công việc', 'Gửi mail thông báo']
        },
        {
          stepCode: 'EMP03.07',
          title: 'Truy vấn & Xác nhận mục tiêu KPI',
          actor: 'Nhân viên cũ (NV)',
          location: 'Employee Mobile App / Portal',
          timing: 'Trong 05 ngày đầu',
          typeCode: 'N',
          description: 'Nhân viên đăng nhập ứng dụng HRMS bằng tài khoản cũ để xem và cam kết thực hiện KPI.',
          fieldsChecklist: ['Xác nhận cam kết KPI điện tử', 'Thời hạn hoàn thành']
        },
        {
          stepCode: 'EMP03.08',
          title: 'Danh sách NV tham gia đào tạo hội nhập',
          actor: 'HRM - Đào tạo',
          location: 'L&D Portal',
          timing: 'Tuần 1 - Tuần 2',
          typeCode: 'N',
          description: 'Xếp lịch đào tạo cập nhật các chính sách, quy chế và định hướng mới của doanh nghiệp.',
          fieldsChecklist: ['Danh sách học viên tái hòa nhập', 'Lịch đào tạo Refresh', 'Tài liệu cập nhật chính sách mới']
        },
        {
          stepCode: 'EMP03.09',
          title: 'Cập nhật kết quả đào tạo hội nhập',
          actor: 'HRM - Đào tạo',
          location: 'L&D Portal',
          timing: 'Sau khóa học 48h',
          typeCode: 'M',
          description: 'Chấm điểm bài test cập nhật quy chế và ghi nhận kết quả vào hồ sơ đào tạo tích lũy.',
          fieldsChecklist: ['Điểm bài test trắc nghiệm', 'Chứng chỉ hoàn thành', 'Gửi mail thông báo kết quả']
        },
        {
          stepCode: 'EMP03.10',
          title: 'Cập nhật kết quả tự đánh giá KPI thử việc',
          actor: 'Nhân viên cũ (NV)',
          location: 'Employee Portal',
          timing: 'Trước khi hết hạn 10 ngày',
          typeCode: 'N',
          description: 'Nhân viên tự chấm điểm và đính kèm báo cáo sản phẩm công việc trước khi hết hạn 10 ngày.',
          fieldsChecklist: ['Báo cáo kết quả thử việc', 'Điểm tự đánh giá', 'Gửi mail nộp đánh giá']
        },
        {
          stepCode: 'EMP03.11',
          title: 'Đánh giá kết quả KPI & Quyết định nhân sự (Decision)',
          actor: 'Trưởng bộ phận (TBP)',
          location: 'Manager Portal',
          timing: 'Trước khi hết hạn 07 ngày',
          typeCode: 'M',
          description: 'TBP đánh giá, nhận xét và ra quyết định: ĐẠT (>= 85% điểm) chuyển Ký HĐLĐ hoặc KHÔNG ĐẠT chuyển Thanh lý.',
          fieldsChecklist: ['Điểm đánh giá chính thức của TBP', 'Quyết định: Đạt / Không đạt', 'Gửi mail thông báo & Trả kết quả đánh giá']
        },
        {
          stepCode: 'EMP03.12',
          title: 'Truy vấn & Xem kết quả đánh giá KPI',
          actor: 'Nhân viên cũ (NV)',
          location: 'Employee App',
          timing: 'Trước khi hết hạn 05 ngày',
          typeCode: 'N',
          description: 'Nhân viên nhận thông báo kết quả đánh giá chính thức từ Quản lý trực tiếp trên ứng dụng.',
          fieldsChecklist: ['Xem phiếu kết quả đánh giá', 'Ý kiến phản hồi (nếu có)']
        },
        {
          stepCode: 'EMP03.13',
          title: 'Ký hợp đồng lao động chính thức (Luồng Đạt)',
          actor: 'HRM - C&B',
          location: 'Core HR & E-Sign',
          timing: 'Trước khi hết hạn 03 ngày',
          typeCode: 'M',
          description: 'Phát hành Hợp đồng lao động chính thức, ký số 2 bên & làm thủ tục đóng nối tiếp vào sổ BHXH cũ.',
          fieldsChecklist: ['HĐLĐ chính thức có chữ ký số', 'Báo tăng BHXH tiếp nối sổ cũ', 'Bảo lưu thâm niên cũ']
        },
        {
          stepCode: 'EMP03.14',
          title: 'Thanh lý hợp đồng lao động thử việc (Luồng Không đạt)',
          actor: 'HRM - C&B',
          location: 'Portal',
          timing: 'Trước khi hết hạn 03 ngày',
          typeCode: 'M',
          description: 'Quyết toán ngày công thử việc, lập biên bản thanh lý hợp đồng và gửi mail thông báo dừng hợp tác.',
          fieldsChecklist: ['Bảng thanh toán lương thử việc', 'Biên bản thanh lý HĐLĐ', 'Gửi mail thông báo không đạt']
        },
        {
          stepCode: 'EMP03.15',
          title: 'Giảm lao động & Khóa quyền truy cập hệ thống',
          actor: 'HRM - C&B',
          location: 'Core HR',
          timing: 'Ngày làm việc cuối',
          typeCode: 'A',
          description: 'Ban hành Quyết định thôi việc, thu hồi tài sản IT, khóa quyền truy cập hệ thống và chuyển trạng thái Inactive.',
          fieldsChecklist: ['In Quyết định nghỉ việc', 'Biên bản thu hồi máy tính/thẻ', 'Khóa tài khoản Domain/Email lúc 18h']
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

  // LIFE-03: BỐ TRÍ CÔNG TÁC & BỔ NHIỆM / ĐIỀU CHUYỂN
  'LIFE-03': [
    {
      sopCode: 'SOP EMP11',
      sopTitle: 'Quy trình Bố trí Công tác & Bổ nhiệm / Điều chuyển (Placement & Mobility)',
      sopCategory: 'Bố trí & Tổ chức (ORG)',
      description: 'Quy trình tiếp nhận đề xuất bổ nhiệm, điều động, luân chuyển hoặc kiêm nhiệm vị trí công tác mới trong tổ chức.',
      steps: [
        {
          stepCode: 'EMP11.01',
          title: 'Lập tờ trình đề xuất Bổ nhiệm / Điều động / Kiêm nhiệm',
          actor: 'Trưởng bộ phận & HRD',
          location: 'Manager Portal',
          timing: 'Khi có biến động vị trí',
          typeCode: 'N',
          description: 'Trưởng bộ phận lập đề xuất bổ nhiệm hoặc luân chuyển nhân sự, nêu rõ lý do, vị trí mới, phòng ban tiếp nhận và ngày hiệu lực.',
          fieldsChecklist: ['Mã NV & Tên NV', 'Vị trí hiện tại & Vị trí mới', 'Phòng ban chuyển giao & Tiếp nhận', 'Lý do & Tiêu chuẩn chức danh']
        },
        {
          stepCode: 'EMP11.02',
          title: 'Cổng Màng Lọc Tự Động: Đối soát Định biên & Khung năng lực',
          actor: 'Hệ thống HRM Engine (AI Auto-Gate)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động kiểm tra',
          typeCode: 'A',
          description: 'Hệ thống kiểm tra hạn mức Định biên nhân sự vị trí mới (MD-05), Khung tiêu chuẩn chức danh (MD-06) và lịch sử đánh giá năng lực.',
          fieldsChecklist: ['Số lượng định biên khả dụng', 'Khung năng lực chức danh mới', 'Lịch sử đánh giá KPI & Khen thưởng']
        },
        {
          stepCode: 'EMP11.03',
          title: 'Thẩm định nhân sự & Ban Giám Đốc phê duyệt ký số',
          actor: 'HRD & Ban Giám Đốc (BOM)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Trong 2-3 ngày làm việc',
          typeCode: 'M',
          description: 'HRD thẩm định phương án nhân sự, Ban Giám Đốc phê duyệt và ký số Quyết định Bổ nhiệm / Điều động nhân sự chính thức.',
          fieldsChecklist: ['Quyết định nhân sự chính thức', 'Mức phụ cấp chức vụ (nếu có)', 'Chữ ký số BOM']
        },
        {
          stepCode: 'EMP11.04',
          title: 'Tự động Cập nhật Sơ đồ tổ chức, Phân quyền & Phụ cấp',
          actor: 'Hệ thống HRM Engine (Auto Execution)',
          location: 'Bên trong / Core EMP',
          timing: 'Vào ngày hiệu lực quyết định',
          typeCode: 'A',
          description: 'Hệ thống tự động cập nhật Org Chart, chuyển cây quản lý phê duyệt, phân quyền tài nguyên IT và kích hoạt phụ cấp chức danh.',
          fieldsChecklist: ['Sơ đồ tổ chức Org Chart mới', 'Cây duyệt luồng phê duyệt (Approval Chain)', 'Phân quyền tài nguyên hệ thống', 'Đồng bộ phụ cấp sang Bảng lương PAY']
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

  // LIFE-05: TIỀN LƯƠNG, THANG BẢNG LƯƠNG 3P & ĐIỀU CHỈNH THU NHẬP
  'LIFE-05': [
    {
      sopCode: 'SOP PAY01',
      sopTitle: 'Quy trình Cấu hình Thang Bảng Lương & Công thức Tính Lương (Pay Grade & Formula Setup)',
      sopCategory: 'Tiền lương & Đãi ngộ (PAY/C&B)',
      description: 'Cấu hình khung ngạch bậc lương 3P, trần đóng BHXH, biểu thuế lũy tiến, phụ cấp cố định và công thức tính lương tự động.',
      steps: [
        {
          stepCode: 'PAY01.01',
          title: 'Thiết lập danh mục Ngạch bậc lương & Lương cơ bản tối thiểu',
          actor: 'Chuyên viên C&B & HR Manager',
          location: 'Master Data Hub / C&B Module',
          timing: 'Đầu năm tài chính hoặc khi có nghị định mới',
          typeCode: 'M',
          description: 'Khai báo hệ thống thang bảng lương, dải min-mid-max theo chức danh (MD-07), tỷ lệ đóng BHXH và mức giảm trừ gia cảnh thuế.',
          fieldsChecklist: ['Ngạch bậc lương (MD-07)', 'Mức lương cơ sở vùng', 'Hệ số lương & Dải lương Min-Max', 'Công thức tính Gross sang Net']
        },
        {
          stepCode: 'PAY01.02',
          title: 'Cổng Màng Lọc Tự Động: Kiểm tra Tuân thủ Luật & Ngân sách Quỹ lương',
          actor: 'Hệ thống HRM Engine (AI Policy Validator)',
          location: 'Bên trong (Hệ thống HRM)',
          timing: 'Tự động ngay khi thiết lập',
          typeCode: 'A',
          description: 'Hệ thống kiểm tra tuân thủ mức lương tối thiểu vùng, trần đóng BHXH/BHYT (20 lần lương cơ sở) và ngân sách People Cost được BOD duyệt.',
          fieldsChecklist: ['Mức trần BHXH 20 lần', 'Biểu thuế TNCN 7 bậc lũy tiến', 'Ngân sách People Cost được cấp']
        },
        {
          stepCode: 'PAY01.03',
          title: 'Thẩm định của Kế toán trưởng & Phê duyệt của Ban Giám Đốc (BOD)',
          actor: 'Kế toán trưởng, HRD & Ban Giám Đốc (BOD)',
          location: 'Portal / Ký số vẹn toàn',
          timing: 'Trong 3 ngày làm việc',
          typeCode: 'M',
          description: 'Thẩm định quy chế trả lương, ký số ban hành thang bảng lương mới và kích hoạt áp dụng trên toàn hệ thống.',
          fieldsChecklist: ['Quy chế lương thưởng chính thức', 'Chữ ký số BOD', 'Ngày hiệu lực thi hành']
        },
        {
          stepCode: 'PAY01.04',
          title: 'Tự động Kích hoạt Bảng tính Lương Payroll Engine & Đồng bộ App',
          actor: 'Hệ thống HRM Engine (Auto Execution)',
          location: 'Bên trong / Payroll Engine',
          timing: 'Đồng bộ tự động thời gian thực',
          typeCode: 'A',
          description: 'Kích hoạt bộ công thức tính lương tự động cho toàn bộ nhân sự, đồng bộ với bảng công ATT và sẵn sàng tính lương kỳ tới.',
          fieldsChecklist: ['Bộ công thức lương đã khóa', 'Đồng bộ dữ liệu hợp đồng Core EMP', 'Kênh phát hành Phiếu lương điện tử E-payslip']
        }
      ]
    },
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
