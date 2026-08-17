import React, { useState } from 'react'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  ShieldCheck,
  UserCheck,
  FileText,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
  ChevronRight,
  Cpu,
  Clock,
  ListCheck,
  Building2,
  UserPlus,
  FileCheck,
  Settings,
  ArrowRightLeft,
  Sun,
  Moon
} from 'lucide-react'
import type { DetailItem } from '../../types/employee-lifecycle'

interface WorkflowDetailPageProps {
  item: DetailItem
  onBack: () => void
  onOpenWireframe?: (item: DetailItem) => void
}

export interface SopSubStep {
  stepCode: string
  title: string
  actor: string
  location: string
  timing: string
  typeCode: 'N' | 'A' | 'C' | 'M'
  description: string
  fieldsChecklist?: string[]
}

export interface SopSubProcess {
  sopCode: string
  sopTitle: string
  sopCategory: string
  description: string
  steps: SopSubStep[]
}

export interface RoleDataFlow {
  roleType: 'candidate' | 'hr'
  roleTitle: string
  actorLabel: string
  badgeColorLight: string
  badgeColorDark: string
  bgLight: string
  bgDark: string
  borderLight: string
  borderDark: string
  inputs: {
    title: string
    description: string
    items: string[]
  }
  outputs: {
    title: string
    description: string
    items: string[]
  }
}

// 100% Complete SOP Database mapped for ALL 7 Lifecycle Steps & Cross-Functional Operations from 1.EMP.HRM.SOP.docx
const SOP_DATABASE: Record<string, SopSubProcess[]> = {
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

// Role-based Input -> Output Flow Mapping Dictionary
const ROLE_FLOW_DATABASE: Record<string, RoleDataFlow[]> = {
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
        description: 'Xem bản thảo HĐLĐ và thực hiện ký xác nhận.',
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

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({
  item,
  onBack,
  onOpenWireframe
}) => {
  // Theme state: default false (Light mode matching main page, toggleable to Dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  // Role flow state
  const availableRoleFlows = ROLE_FLOW_DATABASE[item.id] || [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Ứng viên / Nhân viên (Candidate Perspective)',
      actorLabel: '🧑‍💻 Ứng viên / Nhân viên',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'Thông tin Ứng viên / Nhân viên nhập & khai báo',
        description: 'Dữ liệu cá nhân, giấy tờ scan & thông tin tài khoản do Nhân viên tự khai báo.',
        items: item.inputs && item.inputs.length > 0 ? item.inputs : ['CV & Thông tin cá nhân', 'Bằng cấp học vấn', 'Số tài khoản ngân hàng']
      },
      outputs: {
        title: 'Kết quả Ứng viên / Nhân viên nhận được',
        description: 'Thông báo, tài khoản đăng nhập & tài liệu văn hóa công ty.',
        items: item.outputs && item.outputs.length > 0 ? item.outputs : ['Tài khoản Portal', 'Lịch Đào tạo hội nhập', 'Bản gán KPI thử việc']
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HR Admin & Quản lý (HR & Manager Perspective)',
      actorLabel: '💼 HR Admin / Quản lý',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'Thông tin HR & Quản lý thiết lập & thẩm định',
        description: 'Cấu hình định biên, chức danh, ngạch bậc lương & luồng duyệt.',
        items: ['Kiểm tra Định biên khả dụng (EMP01)', 'Chọn Chức danh & Level Job Grade', 'Dự thảo Mức lương & Phụ cấp']
      },
      outputs: {
        title: 'Kết quả Hệ thống HR tự động sinh & đồng bộ',
        description: 'Mã số nhân viên, Ticket IT/Hành chính & Báo tăng Bảo hiểm/Thuế.',
        items: ['Mã NV tự động sinh', 'Ticket cấp Email & Máy tính sang IT', 'Đồng bộ Báo tăng BHXH (INS02)']
      }
    }
  ]

  const [activeRoleTab, setActiveRoleTab] = useState<'all' | 'candidate' | 'hr'>('all')

  // SOP processes
  const availableSopProcesses = SOP_DATABASE[item.id] || [
    {
      sopCode: item.sopIds?.[0] || 'SOP STANDARD',
      sopTitle: `Quy trình Chuẩn SOP: ${item.title}`,
      sopCategory: 'Quy trình Nghiệp vụ Chuẩn',
      description: item.subtitle || 'Chi tiết các bước thực hiện nghiệp vụ theo chuẩn tài liệu đặc tả SOP.',
      steps: (item.process?.steps || [
        'Khởi tạo yêu cầu & kiểm tra tính hợp lệ danh mục',
        'Kiểm tra định biên & điều kiện kích hoạt nghiệp vụ',
        'Trưởng bộ phận / HR Manager thẩm định & phê duyệt',
        'Thực thi hệ thống, cấp phát quyền & lưu vết nhật ký'
      ]).map((stepTitle, idx) => ({
        stepCode: `${item.id}.${(idx + 1).toString().padStart(2, '0')}`,
        title: stepTitle,
        actor: item.actors?.[idx % (item.actors?.length || 1)]?.name || 'HR Admin / Quản lý',
        location: 'Portal / Hệ thống',
        timing: 'Theo chu kỳ nghiệp vụ',
        typeCode: idx === 0 ? 'N' : idx === 1 ? 'M' : 'A',
        description: `Thực hiện chi tiết bước ${stepTitle} theo quy định tài liệu đặc tả SOP hệ thống.`,
        fieldsChecklist: item.uiFields || ['Mã bản ghi', 'Người thực hiện', 'Thời gian kích hoạt', 'Trạng thái phê duyệt']
      }))
    }
  ]

  const [selectedProcessIdx, setSelectedProcessIdx] = useState<number>(0)
  const currentProcess = availableSopProcesses[selectedProcessIdx] || availableSopProcesses[0]

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0)
  const currentStep = currentProcess.steps[selectedStepIdx] || currentProcess.steps[0]

  const [viewMode, setViewMode] = useState<'diagram' | 'table'>('diagram')

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 animate-fadeIn ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}>
      {/* Top Fixed Header with Back Button & Theme Toggle */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/90 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'
        }`}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all duration-200 group shadow-xs cursor-pointer ${isDarkMode
              ? 'bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white border-slate-700 hover:border-blue-500'
              : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border-slate-300 hover:border-blue-600'
              }`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Quay lại Bức tranh Tổng thể Quy trình</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-300 dark:border-slate-800 pl-4">
            <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded border ${isDarkMode ? 'text-blue-400 bg-blue-950/80 border-blue-800/60' : 'text-blue-700 bg-blue-50 border-blue-200'
              }`}>
              {item.category === 'lifecycle' ? 'TẦNG 2 · VÒNG ĐỜI NHÂN VIÊN' : 'SOP SPECIFICATION'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">Mã: {item.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* THEME TOGGLE BUTTON (LIGHT / DARK MODE) */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${isDarkMode
              ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            title="Chuyển đổi Chế độ Giao diện Sáng / Tối"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Giao diện Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Giao diện Tối</span>
              </>
            )}
          </button>

          {item.sopIds && item.sopIds.length > 0 && (
            <span className={`px-3 py-1 text-xs font-mono font-bold rounded-xl border shadow-2xs ${isDarkMode ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
              📋 {item.sopIds.join(' · ')}
            </span>
          )}

          {onOpenWireframe && (
            <button
              type="button"
              onClick={() => onOpenWireframe(item)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl border border-blue-400 transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Mở Form UI Wireframe</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workflow Workspace Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Hero Banner Header */}
        <div className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden transition-colors duration-300 ${isDarkMode
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800'
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-800 text-white'
          }`}>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold uppercase bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                  Document Spec: 1.EMP.HRM.SOP.docx
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                  Role Mapping: Candidate vs. HR Engine
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                SƠ ĐỒ WORKFLOW QUY TRÌNH: {item.title.toUpperCase()}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            {onOpenWireframe && (
              <button
                type="button"
                onClick={() => onOpenWireframe(item)}
                className="self-start flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl border border-blue-400 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Xem UI Form Thao tác</span>
              </button>
            )}
          </div>
        </div>

        {/* ROLE-BASED INPUT -> OUTPUT MAPPING MATRIX */}
        <div className={`rounded-2xl p-5 sm:p-6 border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>LUỒNG ĐẦU VÀO ➔ ĐẦU RA THEO VAI TRÒ (DUAL ROLE INPUT-OUTPUT MAPPING)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Phân định rõ ràng: Ứng viên/Nhân viên nhập gì & nhận gì VS. HR Admin/Quản lý nhập gì & hệ thống tự động sinh ra gì.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
              <button
                type="button"
                onClick={() => setActiveRoleTab('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Tất cả Vai trò
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab('candidate')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'candidate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                🧑‍💻 Ứng viên / NV
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab('hr')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'hr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                💼 HR & Quản lý
              </button>
            </div>
          </div>

          {/* DUAL ROLE COMPARISON GRID */}
          <div className={`grid gap-5 ${activeRoleTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 w-full'}`}>
            {availableRoleFlows
              .filter((rFlow) => activeRoleTab === 'all' || activeRoleTab === rFlow.roleType)
              .map((rFlow, rIdx) => (
                <div
                  key={rIdx}
                  className={`border rounded-2xl transition-all w-full shadow-2xs ${activeRoleTab === 'all' ? 'p-4 sm:p-5 space-y-3.5' : 'p-5 sm:p-6 space-y-4'
                    } ${isDarkMode
                      ? `${rFlow.bgDark} ${rFlow.borderDark}`
                      : `${rFlow.bgLight} ${rFlow.borderLight}`
                    }`}
                >
                  {/* Role Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="text-xs font-extrabold flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${isDarkMode ? rFlow.badgeColorDark : rFlow.badgeColorLight
                        }`}>
                        {rFlow.actorLabel}
                      </span>
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                      }`}>
                      {rFlow.roleType === 'candidate' ? 'Self-Service Portal' : 'HRM Core Engine'}
                    </span>
                  </div>

                  {/* Dual Cards: Input Section vs Output Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                    {/* INPUT CARD */}
                    <div className={`p-3.5 rounded-xl border space-y-2.5 flex flex-col justify-between ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                      }`}>
                      <div>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>ĐẦU VÀO (INPUTS)</span>
                        </span>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug mb-2.5">
                          {rFlow.inputs.description}
                        </p>

                        <div className="space-y-1.5">
                          {rFlow.inputs.items.map((inpItem, iIdx) => (
                            <div
                              key={iIdx}
                              className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                              <span>{inpItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* OUTPUT CARD */}
                    <div className={`p-3.5 rounded-xl border space-y-2.5 flex flex-col justify-between ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                      }`}>
                      <div>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>ĐẦU RA (OUTPUTS)</span>
                        </span>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug mb-2.5">
                          {rFlow.outputs.description}
                        </p>

                        <div className="space-y-1.5">
                          {rFlow.outputs.items.map((outItem, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{outItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ACTORS MATRIX BANNER */}
        {item.actors && item.actors.length > 0 && (
          <div className={`rounded-2xl p-5 border space-y-3 shadow-2xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Ma trận Phân quyền & Vai trò Thực hiện (Actors Matrix)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {item.actors.map((actor, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-3.5 flex items-start gap-3 transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${idx === 0
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : idx === 1
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                      {actor.role}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {actor.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {actor.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-PROCESS SELECTOR TABS */}
        {availableSopProcesses.length > 1 && (
          <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Các Quy trình SOP Chi tiết trong file Word tương ứng với bước này:
            </span>

            <div className="flex flex-wrap gap-2.5">
              {availableSopProcesses.map((proc, idx) => {
                const isProcSelected = selectedProcessIdx === idx
                return (
                  <button
                    key={proc.sopCode}
                    type="button"
                    onClick={() => {
                      setSelectedProcessIdx(idx)
                      setSelectedStepIdx(0)
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${isProcSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm transform -translate-y-0.5'
                      : isDarkMode
                        ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{proc.sopCode}: {proc.sopTitle}</span>
                    <span className="text-[10px] font-mono opacity-80 bg-black/20 px-2 py-0.5 rounded-md">
                      {proc.steps.length} bước
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* WORKFLOW VIEW CONTROLLER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'diagram'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Sơ đồ Flowchart Trực quan ({currentProcess.steps.length} Bước SOP)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <ListCheck className="w-4 h-4" />
              <span>Bảng Chi tiết Các bước (SOP Specs Table)</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
            Đang xem: <strong className="text-blue-600 dark:text-blue-300">{currentProcess.sopCode}</strong>
          </span>
        </div>

        {/* VIEW MODE 1: VISUAL FLOWCHART DIAGRAM */}
        {viewMode === 'diagram' && (
          <div className="space-y-6">

            {/* Interactive Sequential Workflow Canvas */}
            <div className={`rounded-2xl p-6 border space-y-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                    <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>LƯU ĐỒ SƠ ĐỒ WORKFLOW: {currentProcess.sopTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {currentProcess.description}
                  </p>
                </div>

                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                  {currentProcess.steps.length} Bước SOP Chuẩn
                </span>
              </div>

              {/* Pure Horizontal Sequential Steps Timeline Flow */}
              <div className="relative pt-2 pb-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 min-w-max pb-2 px-1">
                  {currentProcess.steps.map((step, idx) => {
                    const isStepSelected = selectedStepIdx === idx
                    const isLastStep = idx === currentProcess.steps.length - 1

                    return (
                      <React.Fragment key={step.stepCode}>
                        {/* Step Card Node */}
                        <div
                          onClick={() => setSelectedStepIdx(idx)}
                          className={`w-[260px] shrink-0 p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${
                            isStepSelected
                              ? isDarkMode
                                ? 'bg-blue-950/90 border-blue-500 ring-2 ring-blue-500/40 transform -translate-y-1 shadow-md'
                                : 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/30 transform -translate-y-1 shadow-md'
                              : isDarkMode
                                ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800'
                                : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white'
                          }`}
                        >
                          <div>
                            {/* Step Header with Step Number & Code */}
                            <div className="flex items-center justify-between mb-2.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                                  isStepSelected
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : isDarkMode
                                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                                      : 'bg-white text-slate-700 border-slate-200'
                                }`}>
                                  {idx + 1}
                                </span>

                                <span className={`px-2 py-0.5 font-mono font-extrabold text-[11px] rounded-md border ${
                                  isStepSelected
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : isDarkMode
                                      ? 'bg-slate-800 text-blue-300 border-slate-700'
                                      : 'bg-white text-blue-700 border-slate-200'
                                }`}>
                                  {step.stepCode}
                                </span>
                              </div>

                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                step.typeCode === 'N'
                                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                  : step.typeCode === 'M'
                                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                              }`}>
                                Loại {step.typeCode}
                              </span>
                            </div>

                            {/* Step Title */}
                            <h4 className={`text-xs font-bold leading-snug mb-2.5 h-9 line-clamp-2 ${
                              isStepSelected
                                ? isDarkMode ? 'text-white' : 'text-blue-950'
                                : isDarkMode ? 'text-slate-200' : 'text-slate-900'
                            }`}>
                              {step.title}
                            </h4>
                          </div>

                          {/* Step Actor & Location Footer */}
                          <div className="space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span className="truncate font-semibold">{step.actor}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="truncate">{step.location}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </div>
                          </div>
                        </div>

                        {/* Visual Connecting Arrow between steps */}
                        {!isLastStep && (
                          <div className="flex items-center justify-center px-1 shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              {/* Decision Gateway Card */}
              <div className={`p-4 border rounded-xl space-y-3 ${isDarkMode
                ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-800/50'
                : 'bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border-indigo-200'
                }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Cổng Rẽ Nhánh Điều Kiện & Luồng Thẩm Định (Decision Gateway)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 border rounded-lg flex items-start gap-2.5 ${isDarkMode ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50/80 border-emerald-200'
                    }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-0.5">Trường hợp 1: Phê duyệt / Thống nhất</strong>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-200/80 leading-relaxed">
                        Chuyển tự động sang bước tiếp theo, cập nhật bản ghi chính thức và gửi thông báo qua mail/portal.
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 border rounded-lg flex items-start gap-2.5 ${isDarkMode ? 'bg-amber-950/40 border-amber-800/60' : 'bg-amber-50/80 border-amber-200'
                    }`}>
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-800 dark:text-amber-300 font-bold block mb-0.5">Trường hợp 2: Yêu cầu hiệu chỉnh / Trả lại</strong>
                      <p className="text-[11px] text-amber-700 dark:text-amber-200/80 leading-relaxed">
                        Trả về cho Người thực hiện trước đó để bổ túc thông tin hoặc họp giải trình lại với cấp có thẩm quyền.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Step Spec Card Detail */}
            {currentStep && (
              <div className={`rounded-2xl p-5 sm:p-6 border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-600 text-white font-mono font-extrabold text-xs rounded-xl shadow-xs">
                      {currentStep.stepCode}
                    </span>
                    <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {currentStep.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Thời gian:</span>
                    <span className={`font-semibold px-2.5 py-1 rounded-lg border ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                      {currentStep.timing}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">

                  {/* Card 1: Người thực hiện & Nơi thực hiện */}
                  <div className={`p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px] block">
                      Người thực hiện & Nơi thực hiện
                    </span>
                    <div className="space-y-1.5 text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="font-bold">{currentStep.actor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Nơi thực hiện: {currentStep.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Diễn giải Mô tả Yêu cầu */}
                  <div className={`md:col-span-2 p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px] block">
                      Mô tả Yêu cầu Nghiệp vụ Chi tiết
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Checklist Fields in Word Doc */}
                {currentStep.fieldsChecklist && currentStep.fieldsChecklist.length > 0 && (
                  <div className={`p-4 rounded-xl border space-y-2.5 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] block">
                      Checklist Các Trường Thông tin & Nhóm Dữ liệu Khai báo
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {currentStep.fieldsChecklist.map((fieldName, fIdx) => (
                        <div
                          key={fIdx}
                          className={`px-3 py-2 border rounded-lg text-xs font-medium flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{fieldName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 2: FULL SOP SPECIFICATIONS TABLE (MATCHING WORD DOC 100%) */}
        {viewMode === 'table' && (
          <div className={`rounded-2xl p-5 border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>BẢNG CHI TIẾT CÁC BƯỚC SOP: {currentProcess.sopTitle}</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">Ánh xạ chuẩn 100% từ 1.EMP.HRM.SOP.docx</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                    <th className="p-3 w-24">Mã bước</th>
                    <th className="p-3 w-48">Tên bước</th>
                    <th className="p-3 w-36">Người thực hiện</th>
                    <th className="p-3">Mô tả Yêu cầu nghiệp vụ chi tiết</th>
                    <th className="p-3 w-32">Nơi thực hiện</th>
                    <th className="p-3 w-32">Thời gian</th>
                    <th className="p-3 w-16 text-center">Loại</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'
                  }`}>
                  {currentProcess.steps.map((step) => (
                    <tr key={step.stepCode} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                      }`}>
                      <td className="p-3 font-mono font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {step.stepCode}
                      </td>
                      <td className={`p-3 font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {step.title}
                      </td>
                      <td className="p-3 font-medium text-amber-700 dark:text-amber-300">
                        {step.actor}
                      </td>
                      <td className="p-3 leading-relaxed">
                        {step.description}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">
                        {step.location}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">
                        {step.timing}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${step.typeCode === 'N'
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : step.typeCode === 'M'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          }`}>
                          {step.typeCode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
