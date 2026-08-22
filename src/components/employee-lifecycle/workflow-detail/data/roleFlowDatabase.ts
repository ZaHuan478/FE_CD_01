import type { RoleDataFlow } from '../types'

// Role-based Input -> Output Flow Mapping Dictionary
export const ROLE_FLOW_DATABASE: Record<string, RoleDataFlow[]> = {
  'LIFE-00': [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Trưởng bộ phận (Department Head Perspective)',
      actorLabel: '👔 Trưởng bộ phận (TBP)',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'TBP Lập kế hoạch & Khai báo gì? (Headcount Inputs)',
        description: 'Thông tin xây dựng định biên nhân sự phòng ban cho năm kế tiếp.',
        items: [
          'Năm kế hoạch định biên & Phòng ban phụ trách',
          'Danh mục Chức vụ & Cấp bậc (Job Grade Level)',
          'Nhu cầu nhân sự chi tiết 12 tháng',
          'Mức thu nhập & Chi phí nhân sự dự kiến (People Cost)'
        ]
      },
      outputs: {
        title: 'TBP Nhận được gì? (Headcount Outputs)',
        description: 'Kết quả phê duyệt và định biên chính thức làm cơ sở tuyển dụng.',
        items: [
          'Bản định biên phòng ban được BOD phê duyệt chính thức',
          'Chỉ tiêu và hạn mức mở Yêu cầu tuyển dụng mới trong năm',
          'Báo cáo tổng hợp chi phí nhân sự phòng ban'
        ]
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HRBP, C&B & BOD (HR & BOD Governance)',
      actorLabel: '💼 HRBP / C&B / Ban Giám Đốc (BOD)',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'HR & BOD Thẩm định & Phê duyệt gì?',
        description: 'Tham vấn tính khả thi, cân đối ngân sách và phê duyệt chính sách.',
        items: [
          'Kế hoạch định biên đệ trình từ các phòng ban',
          'Khung ngân sách chi phí nhân sự năm của công ty',
          'Đánh giá tính hợp lý và xu hướng biến động nhân sự'
        ]
      },
      outputs: {
        title: 'Kết quả Hệ thống HRM cập nhật tự động',
        description: 'Khóa trần định biên và đồng bộ dữ liệu vào hệ thống Master Data.',
        items: [
          'Cập nhật hạn mức định biên vào Master Data (MD-05/MD-06)',
          'Thiết lập màng lọc kiểm soát tuyển dụng tự động (ATS Filter)',
          'Báo cáo phân bổ chi phí People Cost toàn công ty'
        ]
      }
    }
  ],
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

import type { SwimlaneSequenceData } from '../types'

export const SWIMLANE_DATABASE: Record<string, SwimlaneSequenceData> = {
  'LIFE-01': {
    summary: 'Quy trình phối hợp 3 giai đoạn giữa Ứng viên khai báo hồ sơ và Hệ thống HR tự động cấp phát tài nguyên.',
    summaryEn: '3-stage collaborative sequence flow between Candidate self-service and HR automated system provisioning.',
    candidateSteps: [
      {
        id: 'CAND-01',
        lane: 'candidate',
        stageIndex: 1,
        title: 'Khai báo Hồ sơ & Upload Chứng từ',
        titleEn: 'Submit Profile & Upload Documents',
        description: 'Nhập thông tin cá nhân, CCCD, số tài khoản ngân hàng & upload file bằng cấp trên Offer Portal.',
        descriptionEn: 'Enter personal info, National ID, bank account & upload degree certificates via portal.',
        actionTag: 'Tự khai báo (Self-service)',
        actionTagEn: 'Self-service',
        interactionType: 'upload_portal',
        interactionLabel: 'Gửi dữ liệu qua Candidate Portal ➔',
        interactionLabelEn: 'Submit data to HR Portal ➔',
        details: [
          'Thông tin cá nhân: Họ tên, Ngày sinh, Giới tính, Quê quán',
          'Số CCCD / Hộ chiếu & Ngày cấp',
          'Số tài khoản ngân hàng nhận lương',
          'File đính kèm: Bằng đại học, Chứng chỉ chuyên môn'
        ]
      },
      {
        id: 'CAND-02',
        lane: 'candidate',
        stageIndex: 2,
        title: 'Nhận Thư mời & Ký xác nhận Offer',
        titleEn: 'Receive & Electronically Sign Offer',
        description: 'Kiểm tra mức lương, phụ cấp, ngày nhận việc và ký số xác nhận đồng ý nhận việc.',
        descriptionEn: 'Review compensation, allowances, start date and electronically sign acceptance.',
        actionTag: 'Ký số điện tử (E-Sign)',
        actionTagEn: 'E-Sign',
        interactionType: 'confirm_accept',
        interactionLabel: 'Xác nhận đồng ý nhận việc ➔',
        interactionLabelEn: 'Confirm acceptance to HR ➔',
        details: [
          'Thư mời nhận việc chính thức (Offer Letter PDF)',
          'Chi tiết mức lương, phụ cấp & thời gian thử việc',
          'Chữ ký số xác thực thời gian thực (OTP / E-Signature)'
        ]
      },
      {
        id: 'CAND-03',
        lane: 'candidate',
        stageIndex: 3,
        title: 'Nhận Tài khoản IT & Lịch Onboarding',
        titleEn: 'Receive IT Credentials & Onboarding Plan',
        description: 'Nhận thông tin đăng nhập Email công ty, Mã nhân viên (EMP ID) & lịch đào tạo tuần đầu tiên.',
        descriptionEn: 'Receive corporate email credentials, Employee ID & first week orientation schedule.',
        actionTag: 'Kích hoạt tài khoản',
        actionTagEn: 'Account Activated',
        details: [
          'Mã số nhân viên (EMP ID)',
          'Tài khoản Email công ty & Domain login',
          'Lịch trình đào tạo hội nhập tuần 1 & Buddy hướng dẫn'
        ]
      }
    ],
    hrSteps: [
      {
        id: 'HR-01',
        lane: 'hr',
        stageIndex: 1,
        title: 'Kiểm tra Định biên & Cấu hình Vị trí',
        titleEn: 'Check Headcount & Configure Position',
        description: 'Kiểm tra slot định biên EMP01, chọn Chức danh, Level Job Grade và mức lương đề xuất.',
        descriptionEn: 'Validate headcount slot EMP01, assign Job Grade, department and compensation package.',
        actionTag: 'Thẩm định định biên',
        actionTagEn: 'Headcount Validation',
        details: [
          'Kiểm tra định biên phòng ban khả dụng (EMP01)',
          'Gán ngạch bậc lương & Cost Center quản lý',
          'Chỉ định Trưởng bộ phận duyệt & Buddy kèm cặp'
        ]
      },
      {
        id: 'HR-02',
        lane: 'hr',
        stageIndex: 2,
        title: 'Duyệt Hồ sơ & Phát hành Offer Letter',
        titleEn: 'Approve & Issue Formal Offer Letter',
        description: 'HR Manager phê duyệt và hệ thống tự động sinh Thư mời nhận việc gửi đến email ứng viên.',
        descriptionEn: 'HR Manager approves and system generates formal Offer Letter sent to candidate email.',
        actionTag: 'Phát hành tự động',
        actionTagEn: 'Auto-Issue',
        interactionType: 'send_offer',
        interactionLabel: 'Gửi Email Offer kèm Link Portal ➔',
        interactionLabelEn: 'Send Offer email with portal link ➔',
        details: [
          'Duyệt luồng phê duyệt 2 cấp (Tuyển dụng ➔ HR Manager)',
          'Template Offer Letter tự động điền dữ liệu',
          'Sinh mã token bảo mật cho link ký nhận việc'
        ]
      },
      {
        id: 'HR-03',
        lane: 'hr',
        stageIndex: 3,
        title: 'Tự động Sinh Mã NV & Bắn Ticket IT / BHXH',
        titleEn: 'Auto Generate EMP ID & Trigger IT / Ins Tickets',
        description: 'Core EMP tự động sinh Mã NV, bắn ticket sang IT cấp máy tính & đồng bộ báo tăng BHXH/Thuế.',
        descriptionEn: 'Core EMP issues EMP ID, fires IT provisioning ticket & syncs insurance and tax records.',
        actionTag: 'Liên thông đa hệ thống',
        actionTagEn: 'Cross-System Sync',
        interactionType: 'auto_ticket',
        interactionLabel: 'Bắn Ticket IT & Báo tăng BHXH ➔',
        interactionLabelEn: 'Dispatch IT Ticket & Insurance Sync ➔',
        details: [
          'Sinh mã nhân viên (Employee ID) duy nhất',
          'Ticket tự động gửi IT (Email công ty, Laptop, VPN)',
          'Ticket gửi Hành chính (Thẻ từ, Chỗ ngồi, Đồng phục)',
          'Đồng bộ Báo tăng Bảo hiểm xã hội (INS02)'
        ]
      }
    ]
  },

  'LIFE-02': {
    summary: 'Nhân viên cập nhật số hóa hồ sơ thân nhân và HR thẩm định, khóa sổ dữ liệu lưu trữ vĩnh viễn.',
    summaryEn: 'Employee digitizes profile data and HR verifies, locks master record permanently.',
    candidateSteps: [
      {
        id: 'CAND-01',
        lane: 'candidate',
        stageIndex: 1,
        title: 'Khai báo Thân nhân & Người phụ thuộc',
        titleEn: 'Declare Dependants & Family Info',
        description: 'Cập nhật danh sách người phụ thuộc kèm giấy khai sinh và thông tin hộ khẩu.',
        descriptionEn: 'Update family background, dependants list with birth certificates.',
        actionTag: 'Khai báo Portal',
        actionTagEn: 'Portal Declaration',
        interactionLabel: 'Gửi hồ sơ đối soát ➔',
        interactionLabelEn: 'Submit for review ➔',
        details: ['Thông tin Người phụ thuộc giảm trừ gia cảnh', 'Hộ khẩu thường trú, Tạm trú', 'Chứng chỉ chuyên môn bổ sung']
      },
      {
        id: 'CAND-02',
        lane: 'candidate',
        stageIndex: 2,
        title: 'Nhận Thẻ Nhân viên Số & Trạng thái Khóa sổ',
        titleEn: 'Receive Digital ID Card & Master Lock State',
        description: 'Nhận Thẻ ID Card điện tử trên App Mobile và xác nhận hồ sơ đã được đối soát 100%.',
        descriptionEn: 'View Digital Employee ID on mobile app and get confirmed 100% master verification.',
        actionTag: 'Hồ sơ hoàn tất',
        actionTagEn: 'Profile Complete',
        details: ['Thẻ ID Card điện tử', 'Xác nhận Mã số thuế cá nhân & Số người phụ thuộc', 'Trạng thái: "Đã khóa duyệt 100%"']
      }
    ],
    hrSteps: [
      {
        id: 'HR-01',
        lane: 'hr',
        stageIndex: 1,
        title: 'Đối soát Chứng từ & Đăng ký Thuế TNCN',
        titleEn: 'Verify Documents & Register PIT Dependants',
        description: 'HR kiểm tra tính hợp lệ bản scan và đăng ký người phụ thuộc lên cổng Cơ quan Thuế.',
        descriptionEn: 'HR audits digital attachments and registers dependants to Tax Authority portal.',
        actionTag: 'Kiểm tra & Đối soát',
        actionTagEn: 'Audit & Review',
        details: ['Đối chiếu CCCD và Giấy khai sinh', 'Đăng ký giảm trừ gia cảnh thuế TNCN', 'Kiểm tra tính trùng khớp dữ liệu']
      },
      {
        id: 'HR-02',
        lane: 'hr',
        stageIndex: 2,
        title: 'Khóa Sổ Hồ sơ & Lưu trữ Kho Dữ liệu Điện tử',
        titleEn: 'Lock Master Record & Digital Archiving',
        description: 'Khóa sổ hồ sơ nhân viên trong Core EMP và kích hoạt cây sơ đồ tổ chức toàn công ty.',
        descriptionEn: 'Lock employee record in Core EMP and update enterprise organizational chart.',
        actionTag: 'Khóa sổ Core EMP',
        actionTagEn: 'Core EMP Lock',
        details: ['Khóa chỉnh sửa thông tin nhạy cảm', 'Tạo bản snapshot lưu trữ lịch sử', 'Đồng bộ cây sơ đồ phòng ban']
      }
    ]
  },

  'LIFE-04': {
    summary: 'Quy trình ký kết Hợp đồng Lao động điện tử 3 bên: Nhân viên, HR C&B và Ban Giám Đốc.',
    summaryEn: '3-party E-signing contract workflow among Employee, HR C&B and Board of Directors.',
    candidateSteps: [
      {
        id: 'CAND-01',
        lane: 'candidate',
        stageIndex: 1,
        title: 'Xem Dự thảo HĐLĐ & Điều khoản',
        titleEn: 'Review Draft Contract & Clauses',
        description: 'Nhân viên xem chi tiết loại hợp đồng, mức lương đóng BHXH và các điều khoản cam kết.',
        descriptionEn: 'Review contract type, insurance salary base and non-disclosure clauses.',
        actionTag: 'Kiểm tra dự thảo',
        actionTagEn: 'Review Draft',
        details: ['Loại hợp đồng (Thử việc / 12 tháng / Không xác định)', 'Mức lương cơ bản & Phụ cấp', 'Quy định nội bộ & NDA']
      },
      {
        id: 'CAND-02',
        lane: 'candidate',
        stageIndex: 2,
        title: 'Ký số Hợp đồng & Nhận Bản sao PDF',
        titleEn: 'E-Sign Contract & Receive PDF Copy',
        description: 'Ký số điện tử và tải về 01 bản HĐLĐ có đầy đủ chữ ký 2 bên và dấu mộc số công ty.',
        descriptionEn: 'E-sign contract and download legally binding PDF copy with digital certificate.',
        actionTag: 'Ký hợp đồng hoàn tất',
        actionTagEn: 'Signed & Archived',
        details: ['Chữ ký số xác thực pháp lý', 'Bản PDF HĐLĐ có mã tra cứu', 'Quyền lợi BHXH được kích hoạt']
      }
    ],
    hrSteps: [
      {
        id: 'HR-01',
        lane: 'hr',
        stageIndex: 1,
        title: 'Tạo Dự thảo HĐLĐ & Trình ký Ban Giám Đốc',
        titleEn: 'Generate Draft Contract & Submit to BOD',
        description: 'Hệ thống tự động điền dữ liệu nhân sự vào template HĐLĐ và gửi BOD duyệt ký số.',
        descriptionEn: 'System auto-populates contract template and routes to CEO/BOD for digital signing.',
        actionTag: 'Tự động tạo HĐLĐ',
        actionTagEn: 'Auto Generate Contract',
        interactionLabel: 'Trình ký Giám đốc & Gửi Nhân viên ➔',
        interactionLabelEn: 'Submit to BOD & Employee ➔',
        details: ['Sinh mã số hợp đồng tự động', 'Tự động gán thang bảng lương chuẩn', 'Trình duyệt chữ ký số Ban Giám Đốc']
      },
      {
        id: 'HR-02',
        lane: 'hr',
        stageIndex: 2,
        title: 'Kích hoạt Lịch Cảnh báo Hạn HĐLĐ & Báo tăng BHXH',
        titleEn: 'Activate Expiry Alerts & Insurance Registry',
        description: 'Lưu hợp đồng vào két số, kích hoạt cảnh báo đáo hạn trước 30 ngày và đưa vào kỳ báo tăng BHXH.',
        descriptionEn: 'Archive to secure e-vault, set 30-day expiry alert & push to monthly insurance declaration.',
        actionTag: 'Kích hoạt cảnh báo tự động',
        actionTagEn: 'Automated Lifecycle Alert',
        details: ['Lưu vết két hồ sơ số (E-Vault)', 'Cảnh báo tái ký trước 30/45 ngày', 'Tự động đẩy vào kỳ Báo tăng INS02']
      }
    ]
  }
}

