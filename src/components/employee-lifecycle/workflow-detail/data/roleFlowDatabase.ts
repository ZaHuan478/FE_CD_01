import type { RoleDataFlow } from '../types'

// Role-based Input -> Output Flow Mapping Dictionary
export const ROLE_FLOW_DATABASE: Record<string, RoleDataFlow[]> = {
  'LIFE-01': [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Ứng viên / Nhân viên Mới (Candidate & Employee Self-Service)',
      actorLabel: '🧑‍💻 Ứng viên / Nhân viên mới',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'Ứng viên / Nhân viên Nhập & Khai báo gì? (Candidate Inputs)',
        description: 'Thông tin cá nhân & chứng từ do Ứng viên trực tiếp cung cấp trên Offer Portal.',
        items: [
          'File CV & Hồ sơ ứng tuyển (Họ tên, Ngày sinh, SĐT, Email cá nhân, Số CCCD/Hộ chiếu)',
          'Thông tin Hộ khẩu thường trú, Tạm trú & Người liên hệ khẩn cấp trong gia đình',
          'Tải lên file scan Chứng từ (Bằng cấp học vấn, Chứng chỉ ngoại ngữ/tin học)',
          'Khai báo Số tài khoản ngân hàng nhận lương & Mã số thuế cá nhân PIT'
        ]
      },
      outputs: {
        title: 'Ứng viên / Nhân viên Nhận & Thấy được gì? (Candidate Outputs & Views)',
        description: 'Kết quả & Quyền truy cập mà hệ thống cấp trực tiếp cho Ứng viên.',
        items: [
          'Thư mời nhận việc chính thức (Offer Letter) kèm mã xác nhận điện tử',
          'Tài khoản đăng nhập Portal Công ty & Mã nhân viên (Employee ID) khởi tạo',
          'Lịch trình & Check-list Đào tạo hội nhập (Onboarding Plan tuần 1)',
          'Bản gán Mục tiêu & Tiêu chí đánh giá thử việc (KPI Probation Sheet)'
        ]
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HR Admin, Tuyển dụng & Quản lý (HR & Management Engine)',
      actorLabel: '💼 HR Admin / Tuyển dụng / TBP',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'HR & Quản lý Nhập & Thiết lập gì? (HR & Management Inputs)',
        description: 'Thông tin định biên, cấu hình vị trí & mức lương do HR / Quản lý thiết lập.',
        items: [
          'Kiểm tra & Chọn slot Định biên phòng ban khả dụng (Headcount Check EMP01)',
          'Chọn Chức danh chuyên môn, Chức vụ quản lý, Level Job Grade & Cost Center',
          'Thiết lập Mức lương cơ bản, Thưởng hiệu quả & Các khoản phụ cấp cố định',
          'Phân công Trưởng bộ phận duyệt & Người hướng dẫn trực tiếp (Buddy/Mentor)'
        ]
      },
      outputs: {
        title: 'HR & Quản lý Nhận & Hệ thống Sinh ra gì? (HR Outputs & System Actions)',
        description: 'Kết quả tự động hóa & Thông báo bắn sang các hệ thống liên thông.',
        items: [
          'Mã nhân viên (Employee ID) duy nhất tự động sinh bởi hệ thống HRM Core',
          'Ticket tự động gửi sang IT (Cấp Email công ty, Domain Account, Phần mềm)',
          'Ticket tự động gửi sang Hành chính (Chuẩn bị Bàn làm việc, Thẻ NV, Đồng phục)',
          'Đồng bộ dữ liệu sang Phân hệ Bảo hiểm (Báo tăng INS02) & Thuế TNCN (TAX01)'
        ]
      }
    }
  ],

  'LIFE-02': [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Nhân viên (Employee Profile Self-Service)',
      actorLabel: '🧑‍💻 Nhân viên khai báo',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'Nhân viên Khai báo & Bổ túc những gì?',
        description: 'Thông tin số hóa hồ sơ cá nhân trên Employee Portal.',
        items: [
          'Cập nhật chi tiết Thông tin thân nhân, Danh sách Người phụ thuộc (kèm Giấy khai sinh/CCCD)',
          'Khai báo Kinh nghiệm làm việc quá khứ & Thông tin hợp đồng lao động cũ',
          'Upload file đính kèm chứng thực (Bằng đại học, Bằng thạc sĩ, Chứng chỉ hành nghề)'
        ]
      },
      outputs: {
        title: 'Nhân viên Xem & Nhận được kết quả gì?',
        description: 'Trạng thái phê duyệt và bộ hồ sơ số hóa hoàn chỉnh.',
        items: [
          'Trạng thái Hồ sơ: "Đã đối soát 100% & Khóa duyệt chính thức"',
          'Xác nhận Mã số thuế cá nhân & Số người phụ thuộc đã đăng ký giảm trừ gia cảnh',
          'Thẻ thông tin nhân viên điện tử (Digital ID Card) trên App Mobile'
        ]
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HR Admin & C&B (HR Validation Engine)',
      actorLabel: '💼 HR Admin / C&B Master',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'HR Admin Thẩm định & Thao tác gì?',
        description: 'Đối soát và kiểm tra tính pháp lý của hồ sơ.',
        items: [
          'Đối soát thông tin khai báo trực tuyến với Hồ sơ bản cứng chứng thực',
          'Xác minh điều kiện giảm trừ gia cảnh của Người phụ thuộc theo quy định Thuế',
          'Kiểm tra tính chính xác của Số tài khoản ngân hàng chi trả lương'
        ]
      },
      outputs: {
        title: 'Hệ thống HR Tự động Sinh & Đồng bộ gì?',
        description: 'Kết quả số hóa & Cập nhật Master Data toàn hệ thống.',
        items: [
          'Bản ghi Hồ sơ Nhân viên Số hóa (100% Compliance) khóa lưu trữ số',
          'Tự động đồng bộ dữ liệu Người phụ thuộc sang Phân hệ Thuế TNCN (TAX01)',
          'Cập nhật Số TK ngân hàng vào Bảng lương C&B tháng tiếp theo'
        ]
      }
    }
  ],

  'LIFE-04': [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Nhân viên (Contract Signing)',
      actorLabel: '🧑‍💻 Nhân viên ký hợp đồng',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'Nhân viên Xem & Kiểm tra những gì?',
        description: 'Xem bản dự thảo HĐLĐ và thực hiện ký xác nhận.',
        items: [
          'Xem bản dự thảo HĐLĐ (Loại HĐ, Thời hạn, Lương chính thức, Phụ cấp)',
          'Kiểm tra các điều khoản cam kết bảo mật & Quy định nội bộ',
          'Thực hiện Ký xác nhận HĐLĐ (Ký số điện tử hoặc Ký bản cứng)'
        ]
      },
      outputs: {
        title: 'Nhân viên Nhận được kết quả gì?',
        description: 'Hợp đồng lao động hợp pháp được xác lập.',
        items: [
          '01 Bản Hợp đồng lao động chính thức có đầy đủ chữ ký 2 bên (PDF/Bản in)',
          'Quyền lợi tham gia BHXH / BHYT / BHTN theo đúng mức lương hợp đồng'
        ]
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HR C&B & Ban Giám Đốc (Legal & Contract Engine)',
      actorLabel: '💼 HR C&B / Đại diện Pháp luật',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'HR C&B & BOD Thiết lập & Trình ký gì?',
        description: 'Dự thảo và thẩm định hợp đồng lao động.',
        items: [
          'Tạo dự thảo HĐLĐ từ Mẫu chuẩn (Word Template) điền ngạch bậc lương',
          'Trình duyệt Đại diện pháp luật / Ban Giám Đốc Ký số vẹn toàn',
          'Bàn giao HĐLĐ và lưu trữ bản cứng vào két hồ sơ pháp lý'
        ]
      },
      outputs: {
        title: 'Hệ thống HR Tự động Sinh & Kích hoạt gì?',
        description: 'Hiệu lực pháp lý hợp đồng & Cảnh báo tự động.',
        items: [
          'Mã số Hợp đồng lao động chính thức được sinh tự động trên hệ thống',
          'Tự động đưa vào danh sách Báo tăng BHXH hàng tháng (INS02)',
          'Kích hoạt Lịch tự động cảnh báo đáo hạn HĐLĐ trước 30/45 ngày'
        ]
      }
    }
  ]
}
