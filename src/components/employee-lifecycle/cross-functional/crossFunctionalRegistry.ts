/**
 * crossFunctionalRegistry.ts
 *
 * CANONICAL SINGLE SOURCE OF TRUTH (Nguồn dữ liệu chuẩn duy nhất)
 * cho TẦNG 3: NGHIỆP VỤ PHÁT SINH TRONG QUÁ TRÌNH LÀM VIỆC (CF-01 -> CF-08).
 *
 * Chuẩn hóa 12 khía cạnh nghiệp vụ:
 * 1. Nghiệp vụ phát sinh
 * 2. Điều kiện kích hoạt (Trigger)
 * 3. Ma trận trách nhiệm (RACI: Proposer, Reviewer, Approver, Executor, Notified)
 * 4. Dữ liệu đầu vào cần chuẩn bị
 * 5. Các bước xử lý tuần tự (Step-by-step)
 * 6. Kết quả đầu ra
 * 7. Phân hệ tiếp nhận (Downstream)
 * 8. Master Data sử dụng
 * 9. SLA xử lý tiêu chuẩn
 * 10. Xử lý ngoại lệ (Từ chối, trả lại, quá hạn, hủy)
 * 11. Biểu mẫu / Wireframe form
 * 12. Audit log & Thông báo
 */

import type { CrossFunctionalModuleDefinition } from './types'

export const CROSS_FUNCTIONAL_REGISTRY: Record<string, CrossFunctionalModuleDefinition> = {
  'CF-01': {
    id: 'CF-01',
    code: 'CF-01',
    title: 'Quản lý Thời gian, Chấm công & Nghỉ phép',
    shortTitle: 'Công & Phép',
    subtitle: 'Chấm công tự động, đăng ký ca, giải trình công, nghỉ phép & tăng ca',
    description:
      'Quản lý toàn bộ thời gian làm việc thực tế của nhân viên: từ phân ca làm việc, điểm danh sinh trắc học/FaceID/GPS, nộp đơn nghỉ phép năm/ốm đau, giải trình quên quẹt thẻ, đăng ký làm thêm giờ (OT) đến tổng hợp bảng công chốt kỳ tính lương.',
    businessPurpose:
      'Đảm bảo ghi nhận trung thực, tự động hóa 100% dữ liệu thời gian làm việc của người lao động; đối soát tuân thủ Luật Lao động (giờ làm tối đa, giờ nghỉ ngơi, trần làm thêm giờ) và cung cấp dữ liệu đầu vào chuẩn xác cho bảng lương.',
    triggerSummary:
      'Kích hoạt hàng ngày khi nhân viên điểm danh, hoặc phát sinh nhu cầu xin nghỉ phép, đổi ca, tăng ca (OT), giải trình công; kích hoạt định kỳ vào cuối tháng để chốt bảng công tổng hợp.',
    iconName: 'Clock',
    domain: 'time_leave',
    domainLabel: 'Thời gian & Nghỉ phép',
    frequency: 'daily',
    frequencyLabel: 'Hàng ngày & Định kỳ tháng',
    sla: '24h duyệt đơn phép/OT; Chốt công trước ngày 03 hàng tháng',
    actorsMatrix: {
      proposer: 'Nhân viên (Nộp đơn trên Portal / App Mobile) hoặc Quản lý ca (Lập lịch ca)',
      reviewer: 'Trưởng bộ phận / Quản lý trực tiếp (Thẩm định lý do & cân đối nhân sự ca)',
      approver: 'Trưởng phòng / Giám đốc Khối (Duyệt OT & Đơn phép dài ngày > 3 ngày)',
      executor: 'Timekeeper Engine (Tính toán công tự động) ➔ Chuyên viên C&B (Khóa công)',
      notified: 'Nhân viên nộp đơn & Người nhận bàn giao công việc'
    },
    inputs: [
      'Dữ liệu quẹt thẻ máy chấm công (FaceID / Vân tay / GPS Geofencing)',
      'Lịch phân ca làm việc đã phê duyệt của bộ phận (SOP-ATT-01)',
      'Đơn xin nghỉ phép (Nghỉ năm, Nghỉ không lương, Nghỉ ốm đau có giấy BV)',
      'Phiếu đăng ký làm thêm giờ (OT) có xác nhận nhu cầu sản xuất/kinh doanh'
    ],
    outputs: [
      'Bảng tổng hợp công chi tiết theo ngày (Công chuẩn, Công thực tế, Đi trễ/Về sớm)',
      'Bảng tổng hợp giờ làm thêm OT (Ngày thường 150%, Cuối tuần 200%, Lễ tết 300%)',
      'Sổ theo dõi quỹ phép năm tồn (Annual Leave Balance)',
      'Dữ liệu công chốt chuyển sang Phân hệ Tính lương (MODULE-PAY) và Báo BHXH (MODULE-INS)'
    ],
    upstreamModules: ['MD-08', 'MD-CAT-08', 'MD-CAT-09', 'LIFE-04'],
    downstreamModules: ['MODULE-PAY', 'MODULE-INS', 'BI'],
    integrations: [
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Đồng bộ số ngày công thực tế, giờ OT và ngày nghỉ trừ lương vào Payroll Engine (PAY03).'
      },
      {
        module: 'INS',
        moduleName: 'Bảo hiểm',
        color: 'rose',
        description: 'Tự động lọc các trường hợp nghỉ ốm đau/thai sản/không lương >= 14 ngày/tháng để báo giảm đóng BHXH (INS04).'
      },
      {
        module: 'BI',
        moduleName: 'Phân tích nhân sự',
        color: 'purple',
        description: 'Cung cấp báo cáo tỷ lệ đi trễ, về sớm, vắng mặt và chi phí làm thêm giờ theo phòng ban.'
      }
    ],
    masterDataIds: ['MD-08', 'MD-CAT-08', 'MD-CAT-09', 'MD-CAT-10'],
    sopBadge: 'SOP-ATT-01 ➔ 06',
    sopIds: ['SOP-ATT-01', 'SOP-ATT-03', 'SOP-ATT-06', 'SOP-CC-01', 'SOP-CC-06'],
    sopTitles: [
      'Quy trình Phân ca & Điều chỉnh lịch làm việc',
      'Quy trình Đăng ký & Phê duyệt Nghỉ phép',
      'Quy trình Đăng ký & Phê duyệt Làm thêm giờ (OT)',
      'Quy trình Giải trình công & Xử lý dữ liệu chấm công tháng'
    ],
    exceptionHandling: [
      {
        scenario: 'Đơn bị Quản lý từ chối (Reject)',
        handling: 'Hệ thống gửi thông báo push kèm lý do từ chối; nhân viên cập nhật lại thông tin hoặc trao đổi trực tiếp với quản lý.'
      },
      {
        scenario: 'Quá hạn phê duyệt SLA (24h)',
        handling: 'Tự động gửi email nhắc việc khẩn cấp (Escalation) lên Quản lý cấp trên trực tiếp (Next Level Manager).'
      },
      {
        scenario: 'Nhân viên hủy đơn sau khi đã được duyệt',
        handling: 'Phải tạo yêu cầu Hủy đơn (Cancel Request) kèm giải trình; hệ thống hoàn trả số ngày phép vào quỹ phép tồn sau khi TBP duyệt hủy.'
      },
      {
        scenario: 'Chấm công thiếu quẹt thẻ do lỗi thiết bị',
        handling: 'Lập đơn giải trình công (Attendance Adjustment) kèm xác nhận của đồng nghiệp cùng ca hoặc ảnh chụp camera an ninh.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Tạo đơn mới (Leave / OT / Adjust)',
        notificationTarget: 'Quản lý trực tiếp',
        notificationChannel: 'Email + Push App Mobile + Notification Center'
      },
      {
        logEvent: 'Duyệt / Từ chối đơn',
        notificationTarget: 'Nhân viên nộp đơn',
        notificationChannel: 'Push App Mobile + Email'
      },
      {
        logEvent: 'Khóa bảng công tháng',
        notificationTarget: 'Toàn bộ nhân viên & Bộ phận C&B',
        notificationChannel: 'Email thông báo tra cứu phiếu công'
      }
    ],
    uiFields: [
      'Kỳ chấm công',
      'Loại hình đăng ký (Nghỉ phép / OT / Giải trình)',
      'Từ ngày - Đến ngày',
      'Số giờ / Số ngày đăng ký',
      'Người bàn giao công việc',
      'Lý do chi tiết',
      'Minh chứng đính kèm (Giấy khám bệnh, Giấy ra viện)'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-ATT-01',
        sopTitle: 'Quy trình tạo và điều chỉnh lịch làm việc qua portal',
        sopCategory: 'Phân hệ Chấm công · Lịch làm việc',
        description: 'Quy trình phân ca làm việc, đăng ký lịch xoay ca và điều chỉnh ca linh hoạt theo nhu cầu vận hành của bộ phận.',
        steps: [
          {
            stepCode: 'ATT01.01',
            title: 'Tạo lịch phân ca làm việc',
            actor: 'Trưởng bộ phận (TBP)',
            location: 'Portal Quản lý',
            timing: 'Đầu tuần hoặc trước ngày 25 hàng tháng',
            typeCode: 'N',
            description: 'TBP chọn danh sách nhân viên thuộc bộ phận, gán mã ca làm việc chuẩn (MD-08) theo chu kỳ tuần/tháng.',
            fieldsChecklist: ['Phòng ban', 'Mã nhân viên', 'Mã ca làm việc', 'Từ ngày đến ngày', 'Chu kỳ lặp ca']
          },
          {
            stepCode: 'ATT01.02',
            title: 'Truy vấn & Tra cứu lịch ca',
            actor: 'Nhân viên',
            location: 'Portal / Mobile App',
            timing: 'Sau khi TBP công bố lịch ca',
            typeCode: 'A',
            description: 'Nhân viên xem ca làm việc của mình, xác nhận thời gian bắt đầu và kết thúc ca.',
            fieldsChecklist: ['Ngày làm việc', 'Tên ca', 'Giờ vào - Giờ ra', 'Thời gian nghỉ giữa ca']
          },
          {
            stepCode: 'ATT01.03',
            title: 'Đề xuất đổi ca / Điều chỉnh ca',
            actor: 'Nhân viên',
            location: 'Portal / Mobile App',
            timing: 'Trước thời điểm bắt đầu ca tối thiểu 12h',
            typeCode: 'M',
            description: 'Nhân viên nộp đề xuất đổi ca với đồng nghiệp hoặc xin đổi sang ca khác do lý do cá nhân chính đáng.',
            fieldsChecklist: ['Ngày cần đổi ca', 'Ca hiện tại', 'Ca mong muốn', 'Nhân viên đổi ca chéo', 'Lý do đổi']
          },
          {
            stepCode: 'ATT01.04',
            title: 'Duyệt đề xuất đổi ca',
            actor: 'Trưởng bộ phận (TBP)',
            location: 'Portal Quản lý',
            timing: 'Trong vòng 12h trước ca làm việc',
            typeCode: 'M',
            description: 'TBP kiểm tra định biên ca, đảm bảo không thiếu người vận hành và phê duyệt đề xuất.',
            fieldsChecklist: ['Đồng ý / Từ chối', 'Lý do phê duyệt', 'Cập nhật lại lịch ca hệ thống']
          }
        ]
      },
      {
        sopCode: 'SOP-ATT-06',
        sopTitle: 'Quy trình Đăng ký & Phê duyệt Nghỉ phép năm / Nghỉ chế độ',
        sopCategory: 'Phân hệ Chấm công · Quản lý nghỉ phép',
        description: 'Quy trình tạo đơn nghỉ phép trực tuyến, tự động kiểm tra số dư phép tồn, phân luồng phê duyệt và ghi nhận bảng công.',
        steps: [
          {
            stepCode: 'ATT06.01',
            title: 'Tạo đơn xin nghỉ phép trên Portal',
            actor: 'Nhân viên',
            location: 'Portal / Mobile App',
            timing: 'Trước ngày nghỉ (nghỉ ngắn hạn trước 1-2 ngày, nghỉ dài hạn trước 7 ngày)',
            typeCode: 'N',
            description: 'Nhân viên chọn loại nghỉ phép (Phép năm, Nghỉ bù, Nghỉ không lương, Kết hôn, Tang chế), chọn thời gian và người bàn giao việc.',
            fieldsChecklist: ['Loại nghỉ phép', 'Số dư phép hiện tại', 'Từ ngày - Đến ngày', 'Số ngày nghỉ', 'Người nhận bàn giao', 'Lý do nghỉ']
          },
          {
            stepCode: 'ATT06.02',
            title: 'Kiểm tra hạn mức & Người bàn giao xác nhận',
            actor: 'Hệ thống HRM Engine & Người bàn giao',
            location: 'Hệ thống tự động',
            timing: 'Tức thì ngay khi nộp',
            typeCode: 'A',
            description: 'Hệ thống tự động kiểm tra số dư ngày phép có đủ hay không; gửi thông báo cho người nhận bàn giao công việc xác nhận.',
            fieldsChecklist: ['Kiểm tra quỹ phép khả dụng', 'Xác nhận tiếp nhận bàn giao việc', 'Phát hiện trùng lịch trực ca']
          },
          {
            stepCode: 'ATT06.03',
            title: 'Trưởng bộ phận phê duyệt đơn phép',
            actor: 'Trưởng bộ phận (TBP)',
            location: 'Portal Quản lý / Mobile App',
            timing: 'Trong vòng 24h kể từ khi nhận đơn',
            typeCode: 'M',
            description: 'TBP xem xét tính chất công việc bộ phận và bấm Duyệt hoặc Từ chối kèm lý do.',
            fieldsChecklist: ['Phê duyệt / Từ chối / Yêu cầu giải trình thêm', 'Ý kiến quản lý', 'Ghi chú công việc']
          },
          {
            stepCode: 'ATT06.04',
            title: 'Trừ quỹ phép & Cập nhật ký hiệu công',
            actor: 'Hệ thống HRM Engine',
            location: 'Hệ thống tự động',
            timing: 'Tức thì sau khi TBP duyệt',
            typeCode: 'A',
            description: 'Hệ thống trừ trực tiếp số ngày nghỉ vào Quỹ phép năm và tự động điền ký hiệu công (P, O, RO, TS) vào bảng chấm công tháng.',
            fieldsChecklist: ['Trừ Quỹ phép năm', 'Ký hiệu công tự động', 'Gửi email xác nhận cho nhân viên']
          }
        ]
      }
    ]
  },

  'CF-02': {
    id: 'CF-02',
    code: 'CF-02',
    title: 'Tái ký Hợp đồng & Phụ lục Hợp đồng Lao động',
    shortTitle: 'Tái ký & Phụ lục HĐ',
    subtitle: 'Đánh giá gia hạn hợp đồng, ký hợp đồng mới & lập phụ lục điều chỉnh',
    description:
      'Quản lý toàn bộ quy trình tái ký HĐLĐ khi hợp đồng xác định thời hạn sắp đáo hạn (cảnh báo trước 30/45 ngày); lập phụ lục hợp đồng điều chỉnh mức lương, chức danh, địa điểm làm việc hoặc các điều khoản đãi ngộ.',
    businessPurpose:
      'Đảm bảo 100% quan hệ lao động có căn cứ pháp lý hợp lệ theo Bộ luật Lao động; phòng ngừa rủi ro pháp lý về hợp đồng vô hiệu hoặc quá hạn tái ký; tự động kích hoạt điều chỉnh mức đóng BHXH.',
    triggerSummary:
      'Kích hoạt tự động khi HĐLĐ xác định thời hạn còn 30/45 ngày trước ngày hết hạn; hoặc phát sinh quyết định tăng lương, thăng chức, điều chuyển cần ban hành Phụ lục HĐLĐ.',
    iconName: 'FileEdit',
    domain: 'contract',
    domainLabel: 'Hợp đồng & Pháp chế',
    frequency: 'event',
    frequencyLabel: 'Theo sự kiện đáo hạn / Điều chỉnh',
    sla: 'Hoàn tất ký trước ngày hết hạn HĐ tối thiểu 15 ngày',
    actorsMatrix: {
      proposer: 'Hệ thống tự động (Cảnh báo HĐ hết hạn) / Chuyên viên C&B Specialist',
      reviewer: 'Trưởng bộ phận (Đánh giá hiệu suất & Đề xuất loại HĐ mới/Mức lương)',
      approver: 'Giám đốc Nhân sự (HRD) & Tổng Giám Đốc (CEO / Đại diện pháp luật ký duyệt)',
      executor: 'Chuyên viên C&B (Sinh hợp đồng số & Trình ký) ➔ Nhân viên (Ký số / Ký giấy)',
      notified: 'Nhân viên, TBP & Bộ phận Quản lý hồ sơ C&B'
    },
    inputs: [
      'Thông báo cảnh báo hợp đồng sắp hết hạn từ hệ thống',
      'Hồ sơ hợp đồng lao động hiện tại (Số HĐ, Loại HĐ, Thời hạn, Mức lương)',
      'Bản đánh giá kết quả hoàn thành công việc của Trưởng bộ phận',
      'Đề xuất loại hợp đồng mới (12 tháng, 24 tháng, 36 tháng hoặc Không xác định thời hạn)'
    ],
    outputs: [
      'Hợp đồng lao động mới hoặc Phụ lục HĐLĐ điện tử có chữ ký số 2 bên',
      'Hồ sơ HĐ mới chuyển trạng thái "Đang hiệu lực", HĐ cũ chuyển "Lịch sử"',
      'Lệnh tự động cập nhật mức đóng BHXH sang Phân hệ Bảo hiểm (INS04)',
      'Cập nhật thông số thu nhập mới vào Hồ sơ tính lương (PAY01)'
    ],
    upstreamModules: ['MD-07', 'MD-06', 'MD-05', 'LIFE-04'],
    downstreamModules: ['MODULE-INS', 'MODULE-PAY', 'Hồ sơ nhân sự'],
    integrations: [
      {
        module: 'INS',
        moduleName: 'Bảo hiểm xã hội',
        color: 'rose',
        description: 'Tự động tạo hồ sơ điều chỉnh mức lương đóng BHXH (Mẫu D02-LT) sang INS04 khi mức lương HĐ thay đổi.'
      },
      {
        module: 'PAY',
        moduleName: 'Bảng lương',
        color: 'emerald',
        description: 'Cập nhật mức lương căn bản mới và các khoản phụ cấp vào kỳ lương có hiệu lực.'
      }
    ],
    masterDataIds: ['MD-07', 'MD-06', 'MD-05', 'MD-CAT-04'],
    sopBadge: 'SOP-NS-05, 07',
    sopIds: ['SOP-NS-05', 'SOP-NS-07', 'SOP-EMP-05', 'SOP-EMP-07'],
    sopTitles: [
      'Quy trình Tái ký Hợp đồng lao động khi hết hạn',
      'Quy trình Lập và Ký Phụ lục Hợp đồng lao động'
    ],
    exceptionHandling: [
      {
        scenario: 'Doanh nghiệp quyết định không tái ký HĐLĐ',
        handling: 'Phải ra Thông báo chấm dứt HĐLĐ trước 30/45 ngày; tự động chuyển nhân viên sang quy trình Nghỉ việc & Bàn giao (LIFE-07 / SOP EMP15).'
      },
      {
        scenario: 'Nhân viên từ chối ký HĐ mới do không đồng ý điều khoản',
        handling: 'TBP và HRBP tổ chức buổi đối thoại thỏa thuận; nếu không thống nhất, lập biên bản ghi nhận và tiến hành thanh lý hợp đồng đúng hạn.'
      },
      {
        scenario: 'Quá hạn 30 ngày kể từ ngày hết hạn HĐ mà chưa ký HĐ mới',
        handling: 'Hệ thống cảnh báo đỏ rủi ro pháp lý (HĐ tự động chuyển thành HĐ Không xác định thời hạn theo Điều 20 Bộ luật Lao động 2019).'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Cảnh báo HĐ hết hạn (30/45 ngày)',
        notificationTarget: 'Chuyên viên C&B & Trưởng bộ phận',
        notificationChannel: 'Dashboard Cảnh báo + Email định kỳ'
      },
      {
        logEvent: 'Trình ký HĐ mới / Phụ lục',
        notificationTarget: 'Ban Giám Đốc & Nhân viên',
        notificationChannel: 'Cổng Ký số điện tử (E-Sign Portal) + Email'
      },
      {
        logEvent: 'Ký hoàn tất & Lưu trữ hồ sơ',
        notificationTarget: 'Nhân viên & HRM C&B',
        notificationChannel: 'Email gửi file PDF có chữ ký số + Lưu kho hồ sơ'
      }
    ],
    uiFields: [
      'Mã hợp đồng hiện tại',
      'Loại hợp đồng đề xuất tái ký',
      'Thời hạn hợp đồng mới (Tháng / Không thời hạn)',
      'Ngày bắt đầu hiệu lực',
      'Mức lương căn bản mới (VNĐ)',
      'Các khoản phụ cấp điều chỉnh',
      'Phương thức ký kết (Chữ ký số SmartCA / Ký giấy văn bản)'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-NS-05',
        sopTitle: 'Quy trình Đánh giá & Tái ký Hợp đồng lao động',
        sopCategory: 'Phân hệ Nhân sự · Hợp đồng lao động',
        description: 'Quy trình tiếp nhận cảnh báo hết hạn HĐ, TBP đánh giá đề xuất gia hạn, phê duyệt thẩm quyền và thực hiện ký hợp đồng số.',
        steps: [
          {
            stepCode: 'NS05.01',
            title: 'Hệ thống cảnh báo HĐLĐ sắp hết hạn',
            actor: 'Hệ thống HRM Engine',
            location: 'Hệ thống tự động',
            timing: 'Trước ngày hết hạn 45 ngày',
            typeCode: 'A',
            description: 'Hệ thống tự động quét danh sách HĐLĐ sắp đáo hạn và phát sinh thông báo cho C&B và Trưởng bộ phận.',
            fieldsChecklist: ['Mã nhân viên', 'Họ tên', 'Số HĐ hiện tại', 'Ngày hết hạn', 'Đơn vị công tác']
          },
          {
            stepCode: 'NS05.02',
            title: 'TBP đánh giá hiệu suất & Đề xuất tái ký',
            actor: 'Trưởng bộ phận (TBP)',
            location: 'Portal Quản lý',
            timing: 'Trong vòng 7 ngày kể từ khi nhận thông báo',
            typeCode: 'M',
            description: 'TBP đánh giá kết quả làm việc của nhân viên và chọn phương án: Tái ký HĐ mới / Không tái ký.',
            fieldsChecklist: ['Ý kiến đánh giá', 'Đề xuất tái ký (Có/Không)', 'Thời hạn HĐ mới', 'Đề xuất điều chỉnh lương (nếu có)']
          },
          {
            stepCode: 'NS05.03',
            title: 'Phê duyệt phương án tái ký',
            actor: 'Giám đốc Nhân sự (HRD) / Ban Giám Đốc',
            location: 'Portal Phê duyệt',
            timing: 'Trong vòng 5 ngày làm việc',
            typeCode: 'M',
            description: 'HRD kiểm tra tính phù hợp với định biên và ngân sách, phê duyệt văn bản tái ký.',
            fieldsChecklist: ['Quyết định phê duyệt', 'Chữ ký số duyệt chủ trương']
          },
          {
            stepCode: 'NS05.04',
            title: 'Sinh HĐLĐ mới & Ký số 2 bên',
            actor: 'Chuyên viên C&B & Nhân viên & Đại diện pháp luật',
            location: 'E-Sign Portal',
            timing: 'Trước ngày hết hạn HĐ cũ tối thiểu 15 ngày',
            typeCode: 'N',
            description: 'Chuyên viên C&B sinh hợp đồng từ template chuẩn, gửi trình ký số Đại diện pháp luật và Nhân viên.',
            fieldsChecklist: ['File HĐLĐ số hóa', 'Chữ ký số Doanh nghiệp', 'Chữ ký số Nhân viên', 'Mã hash lưu trữ']
          }
        ]
      }
    ]
  },

  'CF-03': {
    id: 'CF-03',
    code: 'CF-03',
    title: 'Biến động Nhân sự, Bổ nhiệm & Điều chuyển',
    shortTitle: 'Bổ nhiệm & Điều chuyển',
    subtitle: 'Bổ nhiệm chức danh, miễn nhiệm, kiêm nhiệm, điều chuyển phòng ban & chi nhánh',
    description:
      'Quản lý toàn bộ diễn biến biến động nhân sự trong quá trình công tác: bổ nhiệm cán bộ quản lý, miễn nhiệm, phân công kiêm nhiệm, điều chuyển nhân sự giữa các phòng ban/chi nhánh, thay đổi cấp quản lý trực tiếp (Reporting Line) và trung tâm chi phí (Cost Center).',
    businessPurpose:
      'Duy trì tính chính xác của sơ đồ cây tổ chức (Org Chart) và luồng phân quyền hệ thống; đảm bảo hạch toán đúng chi phí nhân công theo Cost Center và kịp thời cập nhật phụ cấp trách nhiệm/chức vụ.',
    triggerSummary:
      'Kích hoạt khi phát sinh nhu cầu bổ nhiệm vị trí quản lý, tái cấu trúc phòng ban, luân chuyển nhân sự giữa các đơn vị hoặc phân công nhiệm vụ kiêm nhiệm mới.',
    iconName: 'UserSquare2',
    domain: 'movement',
    domainLabel: 'Tổ chức & Điều động',
    frequency: 'event',
    frequencyLabel: 'Theo sự kiện điều động',
    sla: '3-5 ngày làm việc; Hiệu lực vào ngày 01 hoặc 15 hàng tháng',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận đề xuất hoặc HR Business Partner (HRBP)',
      reviewer: 'Trưởng bộ phận tiếp nhận & Hội đồng Nhân sự thẩm định năng lực',
      approver: 'Tổng Giám Đốc (CEO) / Giám đốc Khối ký Quyết định bổ nhiệm/điều chuyển',
      executor: 'HR Admin (Ban hành Quyết định, cập nhật Org Chart & Phân quyền hệ thống)',
      notified: 'Nhân viên được điều chuyển, 2 Đơn vị liên quan, IT & C&B Payroll'
    },
    inputs: [
      'Tờ trình đề xuất bổ nhiệm / điều động nhân sự (SOP-NS-09 / SOP-NS-12)',
      'Hồ sơ năng lực cá nhân, kết quả KPI 2 năm gần nhất và chứng chỉ chuyên môn',
      'Mô tả công việc (JD) của vị trí mới và Khung ngạch bậc lương áp dụng',
      'Ý kiến đồng thuận của Đơn vị chuyển đi và Đơn vị tiếp nhận'
    ],
    outputs: [
      'Quyết định Bổ nhiệm / Điều chuyển / Kiêm nhiệm chính thức có số hiệu',
      'Cập nhật vị trí mới trên Sơ đồ tổ chức (Org Chart) và Cây phân quyền hệ thống',
      'Tự động điều chỉnh Nhóm phân ca (ATT01) và Trạm chi phí lương Cost Center (PAY01)',
      'Ghi nhận bản ghi lịch sử công tác (Job History Log) không ghi đè dữ liệu cũ'
    ],
    upstreamModules: ['MD-04', 'MD-05', 'MD-06', 'MD-CAT-03'],
    downstreamModules: ['MODULE-ATT', 'MODULE-PAY', 'Hệ thống Phân quyền IT'],
    integrations: [
      {
        module: 'ORG',
        moduleName: 'Cơ cấu tổ chức',
        color: 'purple',
        description: 'Tự động cập nhật Reporting Line, Trưởng đơn vị trên Sơ đồ tổ chức và luồng duyệt Approval Workflow.'
      },
      {
        module: 'ATT',
        moduleName: 'Chấm công',
        color: 'blue',
        description: 'Chuyển đổi nhóm chấm công, đối tượng ngày lễ và cấu hình ngày nghỉ phép theo địa bàn chi nhánh mới.'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Cập nhật Cost Center hạch toán chi phí lương và gán phụ cấp chức vụ/trách nhiệm mới.'
      }
    ],
    masterDataIds: ['MD-04', 'MD-05', 'MD-06', 'MD-CAT-03'],
    sopBadge: 'SOP-NS-09, 12',
    sopIds: ['SOP-NS-09', 'SOP-NS-10', 'SOP-NS-12', 'SOP-EMP-11'],
    sopTitles: [
      'Quy trình Bổ nhiệm & Miễn nhiệm cán bộ quản lý',
      'Quy trình Phân công Kiêm nhiệm vị trí',
      'Quy trình Điều động & Luân chuyển nhân sự nội bộ'
    ],
    exceptionHandling: [
      {
        scenario: 'Đơn vị tiếp nhận từ chối tiếp nhận nhân sự điều chuyển',
        handling: 'HRBP tổ chức phiên họp đối thoại giữa 2 bên; nếu không đạt thỏa thuận, trình Ban Giám Đốc ra quyết định điều phối cuối cùng.'
      },
      {
        scenario: 'Nhân viên khiếu nại quyết định điều động công tác xa',
        handling: 'HRBP xem xét hoàn cảnh gia đình và quy định hợp đồng lao động; áp dụng chính sách trợ cấp điều động hoặc bố trí vị trí tương đương phù hợp.'
      },
      {
        scenario: 'Miễn nhiệm chức vụ quản lý',
        handling: 'Ban hành Quyết định miễn nhiệm, thu hồi phụ cấp chức vụ và phân quyền quản lý; bố trí vị trí chuyên môn phù hợp.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Ban hành Quyết định Bổ nhiệm / Điều chuyển',
        notificationTarget: 'Toàn thể CBNV công ty hoặc nội bộ khối',
        notificationChannel: 'Email thông báo vinh danh / điều động + Bảng tin nội bộ'
      },
      {
        logEvent: 'Cập nhật phân quyền & Chức danh hệ thống',
        notificationTarget: 'IT Helpdesk & Quản trị hệ thống',
        notificationChannel: 'Ticket tự động phân quyền tài nguyên'
      }
    ],
    uiFields: [
      'Hình thức biến động (Bổ nhiệm / Miễn nhiệm / Kiêm nhiệm / Điều chuyển)',
      'Đơn vị cũ ➔ Đơn vị mới',
      'Chức danh cũ ➔ Chức danh mới',
      'Quản lý trực tiếp mới (Reporting Line)',
      'Cost Center mới',
      'Phụ cấp trách nhiệm / Chức vụ mới (VNĐ)',
      'Ngày có hiệu lực'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-NS-09',
        sopTitle: 'Quy trình Bổ nhiệm Cán bộ quản lý',
        sopCategory: 'Phân hệ Nhân sự · Bổ nhiệm',
        description: 'Quy trình rà soát tiêu chuẩn chức danh, lập tờ trình bổ nhiệm, lấy phiếu tín nhiệm và ban hành quyết định.',
        steps: [
          {
            stepCode: 'NS09.01',
            title: 'Lập tờ trình đề xuất bổ nhiệm',
            actor: 'Trưởng bộ phận / HRBP',
            location: 'Portal Quản lý',
            timing: 'Khi phát sinh vị trí quản lý cần kiện toàn',
            typeCode: 'N',
            description: 'Đề xuất nhân sự đáp ứng tiêu chuẩn khung năng lực chức danh (MD-06), có kết quả KPI xuất sắc.',
            fieldsChecklist: ['Chức danh bổ nhiệm', 'Họ tên nhân sự', 'Đơn vị', 'Lý do bổ nhiệm', 'Hồ sơ năng lực đính kèm']
          },
          {
            stepCode: 'NS09.02',
            title: 'Thẩm định & Lấy phiếu tín nhiệm',
            actor: 'Hội đồng Nhân sự & Cán bộ chủ chốt',
            location: 'Họp Hội đồng Nhân sự',
            timing: 'Trong vòng 5 ngày làm việc',
            typeCode: 'M',
            description: 'Hội đồng nhân sự họp đánh giá, kiểm tra điều kiện tiêu chuẩn và tổ chức bỏ phiếu tín nhiệm.',
            fieldsChecklist: ['Biên bản họp Hội đồng', 'Tỷ lệ phiếu tín nhiệm đạt', 'Kết luận thẩm định']
          },
          {
            stepCode: 'NS09.03',
            title: 'Tổng Giám Đốc phê duyệt & Ký quyết định',
            actor: 'Tổng Giám Đốc (CEO)',
            location: 'Portal Phê duyệt',
            timing: 'Trong vòng 3 ngày làm việc',
            typeCode: 'M',
            description: 'CEO xem xét biên bản của Hội đồng và ký Quyết định bổ nhiệm chính thức.',
            fieldsChecklist: ['Quyết định bổ nhiệm số', 'Ngày hiệu lực', 'Thời hạn bổ nhiệm (nhiệm kỳ)']
          },
          {
            stepCode: 'NS09.04',
            title: 'Cập nhật phân quyền & Truyền thông vinh danh',
            actor: 'HR Admin & IT Support',
            location: 'Hệ thống HRM Core',
            timing: 'Tức thì khi quyết định có hiệu lực',
            typeCode: 'A',
            description: 'Hệ thống tự động cập nhật sơ đồ tổ chức, mở quyền duyệt Manager Portal và gửi email chúc mừng toàn công ty.',
            fieldsChecklist: ['Cập nhật Org Chart', 'Cấp quyền duyệt Workflow', 'Email truyền thông']
          }
        ]
      }
    ]
  },

  'CF-04': {
    id: 'CF-04',
    code: 'CF-04',
    title: 'Quản lý Khen thưởng & Vinh danh Thành tích',
    shortTitle: 'Khen thưởng & Vinh danh',
    subtitle: 'Khen thưởng định kỳ, đột xuất, sáng kiến Kaizen & vinh danh cá nhân/tập thể xuất sắc',
    description:
      'Quản lý toàn diện các chương trình thi đua khen thưởng: từ tiếp nhận đề xuất khen thưởng đột xuất (hoàn thành dự án xuất sắc, vượt chỉ tiêu doanh số, cứu hộ an toàn), sáng kiến cải tiến Kaizen đến bình xét danh hiệu nhân viên xuất sắc quý/năm.',
    businessPurpose:
      'Ghi nhận kịp thời và tôn vinh nỗ lực cống hiến của nhân viên, tạo động lực làm việc tích cực; tự động chuyển số tiền thưởng vào bảng lương và xử lý khấu trừ thuế TNCN theo quy định.',
    triggerSummary:
      'Kích hoạt khi cá nhân/tập thể hoàn thành xuất sắc nhiệm vụ đột xuất, có sáng kiến Kaizen được nghiệm thu mang lại giá trị kinh tế, hoặc vào các kỳ bình xét thi đua định kỳ (Quý/Năm).',
    iconName: 'Award',
    domain: 'reward',
    domainLabel: 'Thành tích & Khen thưởng',
    frequency: 'mixed',
    frequencyLabel: 'Đột xuất & Định kỳ Quý/Năm',
    sla: '3-5 ngày làm việc từ khi trình đề xuất',
    actorsMatrix: {
      proposer: 'Trưởng bộ phận hoặc Hội đồng Sáng kiến Kaizen',
      reviewer: 'Hội đồng Thi đua Khen thưởng & Bộ phận C&B (Thẩm định ngân sách & tiêu chí)',
      approver: 'Tổng Giám Đốc (CEO) / Chủ tịch Hội đồng Khen thưởng ký duyệt',
      executor: 'HRM-C&B (Chi trả qua bảng lương) & Truyền thông nội bộ (Tổ chức vinh danh)',
      notified: 'Cá nhân/Tập thể được khen thưởng & Toàn thể CBNV'
    },
    inputs: [
      'Tờ trình đề xuất khen thưởng kèm báo cáo thành tích / Sáng kiến cải tiến',
      'Số liệu chứng minh hiệu quả đóng góp (Doanh thu tăng, Chi phí tiết giảm, Tiến độ dự án)',
      'Danh hiệu khen thưởng (Ngôi sao tháng, Chiến binh xuất sắc, Sáng kiến vàng)',
      'Hình thức khen thưởng: Tiền mặt, Cổ phiếu thưởng ESOP, Chuyến du lịch, Bằng khen'
    ],
    outputs: [
      'Quyết định khen thưởng chính thức có chữ ký số của Tổng Giám Đốc',
      'Khoản tiền thưởng chi trả qua kỳ lương gần nhất (PAY03)',
      'Chứng từ khấu trừ thuế TNCN tạm nộp nếu giá trị thưởng > 10.000.000 VNĐ (TAX02)',
      'Bản ghi thành tích lưu vào Hồ sơ năng lực thăng tiến (Employee Profile History)'
    ],
    upstreamModules: ['MD-10', 'MD-CAT-10', 'MD-05'],
    downstreamModules: ['MODULE-PAY', 'MODULE-TAX', 'Hồ sơ nhân lực'],
    integrations: [
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Tự động đẩy số tiền thưởng vào Bảng thanh toán thu nhập kỳ lương gần nhất.'
      },
      {
        module: 'TAX',
        moduleName: 'Thuế TNCN',
        color: 'amber',
        description: 'Áp dụng biểu thuế TNCN khấu trừ đối với các khoản thưởng theo quy định pháp luật (TAX02).'
      },
      {
        module: 'PROFILE',
        moduleName: 'Hồ sơ nhân sự',
        color: 'blue',
        description: 'Ghi nhận danh hiệu khen thưởng vào Profile phục vụ quy hoạch cán bộ nguồn và xét nâng ngạch bậc.'
      }
    ],
    masterDataIds: ['MD-10', 'MD-CAT-10', 'MD-05'],
    sopBadge: 'SOP-NS-13',
    sopIds: ['SOP-NS-13', 'SOP-EMP-13'],
    sopTitles: ['Quy trình Xét duyệt Khen thưởng & Vinh danh Thành tích'],
    exceptionHandling: [
      {
        scenario: 'Đề xuất không đủ tiêu chí hoặc thiếu minh chứng số liệu',
        handling: 'Hội đồng Khen thưởng trả lại tờ trình kèm văn bản góp ý để đơn vị bổ sung số liệu minh chứng.'
      },
      {
        scenario: 'Vượt hạn mức ngân sách khen thưởng của khối',
        handling: 'Phải trình Tổng Giám Đốc phê duyệt bổ sung nguồn quỹ khen thưởng đặc biệt trước khi ban hành.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Ban hành Quyết định khen thưởng',
        notificationTarget: 'Toàn thể công ty',
        notificationChannel: 'Email vinh danh + Bảng tin trang chủ Portal'
      },
      {
        logEvent: 'Chi trả tiền thưởng qua bảng lương',
        notificationTarget: 'Nhân viên nhận thưởng',
        notificationChannel: 'Phiếu lương điện tử (Payslip)'
      }
    ],
    uiFields: [
      'Danh hiệu khen thưởng',
      'Cá nhân / Tập thể được khen thưởng',
      'Hình thức khen thưởng (Hiện kim / Hiện vật / Bằng khen)',
      'Giá trị phần thưởng (VNĐ)',
      'Căn cứ thành tích / Sáng kiến',
      'Hội đồng phê duyệt'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-NS-13',
        sopTitle: 'Quy trình Xét duyệt Khen thưởng & Vinh danh Thành tích',
        sopCategory: 'Phân hệ Nhân sự · Khen thưởng',
        description: 'Quy trình lập đề xuất, thẩm định thành tích, họp hội đồng khen thưởng, ký quyết định và chi trả.',
        steps: [
          {
            stepCode: 'NS13.01',
            title: 'Lập đề xuất khen thưởng',
            actor: 'Trưởng bộ phận / Quản lý dự án',
            location: 'Portal Quản lý',
            timing: 'Khi phát sinh thành tích hoặc theo kỳ thi đua',
            typeCode: 'N',
            description: 'TBP nộp hồ sơ thành tích, mô tả chi tiết đóng góp vượt trội và đề xuất hình thức khen thưởng.',
            fieldsChecklist: ['Tên thành tích', 'Cá nhân/Tập thể', 'Mô tả đóng góp', 'Đề xuất mức thưởng']
          },
          {
            stepCode: 'NS13.02',
            title: 'Hội đồng Khen thưởng thẩm định',
            actor: 'Hội đồng Thi đua Khen thưởng',
            location: 'Portal Phê duyệt / Họp thẩm định',
            timing: 'Trong vòng 5 ngày làm việc',
            typeCode: 'M',
            description: 'Hội đồng đối soát tiêu chí khen thưởng (MD-10) và ngân sách khả dụng, thông qua danh sách.',
            fieldsChecklist: ['Biên bản họp Hội đồng', 'Mức thưởng chính thức', 'Ý kiến thẩm định']
          },
          {
            stepCode: 'NS13.03',
            title: 'Tổng Giám Đốc ký Quyết định khen thưởng',
            actor: 'Tổng Giám Đốc (CEO)',
            location: 'E-Sign Portal',
            timing: 'Trong vòng 2 ngày làm việc',
            typeCode: 'M',
            description: 'CEO ký số Quyết định khen thưởng chính thức.',
            fieldsChecklist: ['Số quyết định', 'Ngày ký', 'Chữ ký số CEO']
          },
          {
            stepCode: 'NS13.04',
            title: 'Chi trả qua bảng lương & Vinh danh truyền thông',
            actor: 'C&B Specialist & Ban Truyền thông',
            location: 'HRM Core Engine & Portal',
            timing: 'Kỳ chi trả lương gần nhất',
            typeCode: 'A',
            description: 'C&B đẩy số tiền thưởng vào bảng lương, Ban truyền thông đăng bài vinh danh trên trang chủ.',
            fieldsChecklist: ['Đồng bộ Payroll PAY03', 'Lưu vết Profile', 'Bài viết vinh danh']
          }
        ]
      }
    ]
  },

  'CF-05': {
    id: 'CF-05',
    code: 'CF-05',
    title: 'Quản lý Kỷ luật Lao động & Xử lý Vi phạm',
    shortTitle: 'Kỷ luật Lao động',
    subtitle: 'Xử lý vi phạm nội quy lao động, quy trình an toàn & bồi thường thiệt hại',
    description:
      'Quản lý chặt chẽ toàn bộ trình tự thủ tục xử lý kỷ luật lao động theo đúng quy định của Bộ luật Lao động 2019: từ lập biên bản sự việc vi phạm, xác minh bằng chứng, mời họp Hội đồng kỷ luật có sự tham gia của Công đoàn, ban hành Quyết định xử lý và theo dõi bồi thường thiệt hại.',
    businessPurpose:
      'Đảm bảo kỷ cương, kỷ luật doanh nghiệp và môi trường làm việc an toàn, bình đẳng; tuân thủ 100% trình tự thủ tục luật định để phòng ngừa rủi ro tranh chấp lao động và khiếu kiện pháp lý.',
    triggerSummary:
      'Kích hoạt khi nhân viên có hành vi vi phạm Nội quy lao động, Quy định an toàn lao động, gian lận dữ liệu, hoặc gây thất thoát, hư hỏng tài sản công ty.',
    iconName: 'AlertTriangle',
    domain: 'discipline',
    domainLabel: 'Kỷ luật & Tuân thủ',
    frequency: 'event',
    frequencyLabel: 'Theo sự kiện phát sinh vi phạm',
    sla: 'Họp xử lý trong vòng 15-30 ngày kể từ khi lập biên bản; Thông báo trước 5 ngày',
    actorsMatrix: {
      proposer: 'Trưởng đơn vị phát hiện vi phạm hoặc Ban Kiểm soát nội bộ',
      reviewer: 'Hội đồng Kỷ luật lao động & Ban Chấp hành Công đoàn cơ sở',
      approver: 'Người đại diện theo pháp luật / Tổng Giám Đốc ký Quyết định kỷ luật',
      executor: 'HR Legal / HR Admin (Tống đạt quyết định, ghi nhận hồ sơ & khấu trừ lương)',
      notified: 'Nhân viên vi phạm, Đại diện Công đoàn, Quản lý đơn vị & C&B'
    },
    inputs: [
      'Biên bản ghi nhận sự việc vi phạm nội quy lao động có chữ ký người làm chứng',
      'Bản giải trình của người lao động vi phạm',
      'Tài liệu, chứng cứ, biên bản kiểm kê thiệt hại tài sản (nếu có)',
      'Hồ sơ kiểm tra điều kiện miễn trừ (mang thai, nuôi con nhỏ < 12 tháng, đang điều trị bệnh)'
    ],
    outputs: [
      'Biên bản họp Hội đồng Xử lý kỷ luật lao động có chữ ký các thành phần luật định',
      'Quyết định xử lý kỷ luật lao động (Khiển trách, Kéo dài thời hạn nâng lương, Cách chức, Sa thải)',
      'Quyết định bồi thường thiệt hại tài sản (khấu trừ lương tối đa 30% lương tháng)',
      'Cập nhật Blacklist tuyển dụng nếu hình thức là Sa thải; Ghi nhận vết vi phạm vào Profile'
    ],
    upstreamModules: ['MD-10', 'MD-CAT-10', 'MD-05'],
    downstreamModules: ['MODULE-PAY', 'Tuyển dụng ATS', 'Hồ sơ nhân sự'],
    integrations: [
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'emerald',
        description: 'Thực hiện khấu trừ tiền bồi thường thiệt hại tài sản (tối đa 30% lương thực nhận/tháng) hoặc tạm dừng nâng lương.'
      },
      {
        module: 'RECRUIT',
        moduleName: 'Tuyển dụng ATS',
        color: 'rose',
        description: 'Tự động đưa CCCD/Số điện thoại nhân sự bị Sa thải vào Blacklist tuyển dụng của toàn hệ thống.'
      },
      {
        module: 'PROFILE',
        moduleName: 'Hồ sơ nhân sự',
        color: 'blue',
        description: 'Lưu vết lịch sử vi phạm, tự động xóa vết kỷ luật sau khi hết thời hiệu theo quy định pháp luật (3 tháng/6 tháng/3 năm).'
      }
    ],
    masterDataIds: ['MD-10', 'MD-CAT-10', 'MD-05'],
    sopBadge: 'SOP-NS-14',
    sopIds: ['SOP-NS-14', 'SOP-EMP-12'],
    sopTitles: ['Quy trình Xử lý Kỷ luật Lao động & Trách nhiệm vật chất'],
    exceptionHandling: [
      {
        scenario: 'Thuộc đối tượng miễn trừ kỷ luật (Mang thai, Nuôi con nhỏ < 12 tháng, Đang nghỉ ốm)',
        handling: 'Tạm hoãn tiến hành phiên họp xử lý kỷ luật cho đến khi hết thời gian nuôi con hoặc hết đợt điều trị bệnh theo Điều 122 BLLĐ 2019.'
      },
      {
        scenario: 'Người lao động vắng mặt không lý do tại phiên họp',
        handling: 'Gửi giấy mời họp hợp lệ lần 2 và lần 3; nếu sau 03 lần thông báo vẫn vắng mặt không lý do chính đáng, Hội đồng tiến hành họp vắng mặt.'
      },
      {
        scenario: 'Vụ việc có tính chất phức tạp cần điều tra',
        handling: 'Ban hành Quyết định Tạm đình chỉ công việc (tối đa 90 ngày) và tạm ứng 50% tiền lương trong thời gian đình chỉ theo Điều 128 BLLĐ.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Gửi Giấy mời họp Hội đồng kỷ luật',
        notificationTarget: 'Người lao động & Đại diện Công đoàn',
        notificationChannel: 'Thư bảo đảm có ký nhận + Email + Tống đạt trực tiếp'
      },
      {
        logEvent: 'Ban hành Quyết định xử lý kỷ luật',
        notificationTarget: 'Người lao động & Các đơn vị liên quan',
        notificationChannel: 'Giao quyết định trực tiếp có biên bản bàn giao + Email'
      }
    ],
    uiFields: [
      'Hành vi vi phạm nội quy',
      'Số biên bản vi phạm',
      'Ngày xảy ra sự việc',
      'Hình thức kỷ luật áp dụng (Khiển trách / Kéo dài nâng lương / Cách chức / Sa thải)',
      'Số tiền bồi thường thiệt hại (VNĐ)',
      'Thời hiệu xóa vết kỷ luật'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-NS-14',
        sopTitle: 'Quy trình Xử lý Kỷ luật Lao động',
        sopCategory: 'Phân hệ Nhân sự · Kỷ luật & Tuân thủ',
        description: 'Trình tự lập biên bản, chuẩn bị hồ sơ chứng cứ, tổ chức họp có công đoàn, ban hành quyết định và tống đạt.',
        steps: [
          {
            stepCode: 'NS14.01',
            title: 'Lập biên bản vi phạm & Thu thập chứng cứ',
            actor: 'Trưởng đơn vị / Ban Kiểm soát nội bộ',
            location: 'Hiện trường sự việc',
            timing: 'Ngay khi phát hiện hành vi vi phạm',
            typeCode: 'N',
            description: 'Lập biên bản ghi nhận hành vi vi phạm, thu thập vật chứng, dữ liệu camera và lấy bản giải trình của người vi phạm.',
            fieldsChecklist: ['Biên bản vi phạm', 'Lời khai nhân chứng', 'Vật chứng/Hình ảnh', 'Bản giải trình của NLĐ']
          },
          {
            stepCode: 'NS14.02',
            title: 'Gửi thông báo mời họp Hội đồng kỷ luật',
            actor: 'HR Legal / HR Admin',
            location: 'Văn thư / Email',
            timing: 'Trước phiên họp tối thiểu 5 ngày làm việc',
            typeCode: 'M',
            description: 'Gửi giấy mời họp bằng văn bản cho Người lao động, Đại diện Ban chấp hành Công đoàn cơ sở và người làm chứng.',
            fieldsChecklist: ['Giấy mời họp số', 'Thời gian, địa điểm họp', 'Nội dung vi phạm', 'Xác nhận ký nhận thư mời']
          },
          {
            stepCode: 'NS14.03',
            title: 'Tổ chức phiên họp Hội đồng Xử lý kỷ luật',
            actor: 'Hội đồng Kỷ luật & Đại diện Công đoàn & NLĐ',
            location: 'Phòng họp Hội đồng',
            timing: 'Theo lịch trong giấy mời họp',
            typeCode: 'M',
            description: 'Hội đồng lắng nghe các bên trình bày, tranh luận dân chủ và biểu quyết hình thức kỷ luật phù hợp.',
            fieldsChecklist: ['Biên bản họp kỷ luật có chữ ký đầy đủ', 'Ý kiến của đại diện Công đoàn', 'Biểu quyết hình thức xử lý']
          },
          {
            stepCode: 'NS14.04',
            title: 'Ban hành Quyết định kỷ luật & Tống đạt',
            actor: 'Đại diện pháp luật & HR Admin',
            location: 'HRM Core Engine',
            timing: 'Trong thời hiệu xử lý kỷ luật',
            typeCode: 'A',
            description: 'Đại diện pháp luật ký Quyết định; HR Admin tống đạt quyết định cho NLĐ và cập nhật dữ liệu khấu trừ lương/blacklist.',
            fieldsChecklist: ['Quyết định kỷ luật số', 'Biên bản tống đạt', 'Cập nhật Payroll & Blacklist']
          }
        ]
      }
    ]
  },

  'CF-06': {
    id: 'CF-06',
    code: 'CF-06',
    title: 'Đào tạo, Hội nhập & Phát triển Năng lực',
    shortTitle: 'Đào tạo & Phát triển',
    subtitle: 'Đào tạo tân tuyển hội nhập, nâng cao tay nghề, cấp chứng chỉ & cam kết đào tạo',
    description:
      'Quản lý toàn diện hoạt động đào tạo phát triển nguồn nhân lực: từ khóa đào tạo hội nhập bắt buộc cho nhân viên mới (Onboarding Training), các khóa nâng cao kỹ năng nghiệp vụ định kỳ theo khung chức danh, sát hạch cấp chứng chỉ số đến quản lý Hợp đồng cam kết đào tạo và bồi hoàn chi phí.',
    businessPurpose:
      'Chuẩn hóa năng lực đội ngũ đáp ứng yêu cầu sản xuất kinh doanh; số hóa chứng chỉ năng lực phục vụ đánh giá quy hoạch; ràng buộc nghĩa vụ cống hiến qua cam kết đào tạo đúng luật.',
    triggerSummary:
      'Kích hoạt khi nhân viên mới tiếp nhận cần hoàn thành chương trình hội nhập trong 14 ngày đầu, hoặc theo Kế hoạch đào tạo năm đã phê duyệt, hoặc khi phát sinh nhu cầu đào tạo chứng chỉ chuyên môn.',
    iconName: 'GraduationCap',
    domain: 'learning',
    domainLabel: 'Đào tạo & Phát triển (L&D)',
    frequency: 'mixed',
    frequencyLabel: 'Theo đợt tân tuyển & Kế hoạch năm',
    sla: 'Khóa hội nhập hoàn thành trong 14 ngày đầu; Kế hoạch đào tạo duyệt trước 30/11',
    actorsMatrix: {
      proposer: 'Chuyên viên L&D hoặc Trưởng bộ phận có nhu cầu cử đi học',
      reviewer: 'HRBP & Trưởng phòng L&D (Thẩm định sự phù hợp với khung năng lực)',
      approver: 'Giám đốc Nhân sự (HRD) / Ban Giám Đốc phê duyệt ngân sách và cử đi học',
      executor: 'Chuyên viên Đào tạo & Giảng viên (Tổ chức lớp, điểm danh LMS & sát hạch)',
      notified: 'Học viên được cử đi học, Quản lý trực tiếp & Kế toán chi phí'
    },
    inputs: [
      'Danh sách nhân viên mới tiếp nhận cần học hội nhập (tự động từ LIFE-01/02)',
      'Nhu cầu đào tạo theo Khung tiêu chuẩn chức danh (MD-06 / Job Competency)',
      'Đề xuất khóa học bên ngoài hoặc chương trình đào tạo nội bộ kèm dự toán chi phí',
      'Hợp đồng cam kết đào tạo (kèm chi phí tài trợ và thời gian cam kết phục vụ)'
    ],
    outputs: [
      'Bảng điểm danh, kết quả bài thi sát hạch cuối khóa (Pass / Fail)',
      'Chứng chỉ số hóa gắn trực tiếp vào Hồ sơ năng lực nhân viên (Employee Profile)',
      'Bản cam kết đào tạo lưu trữ điện tử, tự động kích hoạt điều khoản bồi hoàn nếu nghỉ việc trước hạn',
      'Báo cáo hiệu quả đào tạo theo mô hình Kirkpatrick (Reaction, Learning, Behavior, Results)'
    ],
    upstreamModules: ['MD-06', 'MD-CAT-06', 'LIFE-01', 'LIFE-02'],
    downstreamModules: ['Hồ sơ năng lực', 'LIFE-07', 'BI'],
    integrations: [
      {
        module: 'PROFILE',
        moduleName: 'Hồ sơ năng lực',
        color: 'blue',
        description: 'Tự động cập nhật bằng cấp, chứng chỉ và điểm năng lực chuyên môn vào hồ sơ nhân viên.'
      },
      {
        module: 'OFFBOARD',
        moduleName: 'Nghỉ việc & Bàn giao',
        color: 'rose',
        description: 'Tự động phát cảnh báo tính tiền bồi hoàn chi phí đào tạo nếu nhân viên nộp đơn thôi việc trong thời gian cam kết phục vụ (LIFE-07).'
      }
    ],
    masterDataIds: ['MD-06', 'MD-CAT-06', 'MD-05'],
    sopBadge: 'SOP-DT-01, 02',
    sopIds: ['SOP-DT-01', 'SOP-DT-02', 'SOP-EMP-02.08'],
    sopTitles: [
      'Quy trình Đào tạo Hội nhập Nhân viên mới',
      'Quy trình Quản lý Kế hoạch Đào tạo & Cam kết Phục vụ'
    ],
    exceptionHandling: [
      {
        scenario: 'Học viên không đạt bài thi sát hạch cuối khóa (Fail)',
        handling: 'Tổ chức ôn tập và cho thi lại lần 2 trong vòng 7 ngày; nếu tiếp tục không đạt, báo cáo TBP để xem xét bố trí lại công việc hoặc không thông qua thử việc.'
      },
      {
        scenario: 'Nhân viên nghỉ việc trước hạn cam kết đào tạo',
        handling: 'Tính toán chi phí đào tạo khấu trừ theo công thức: Chi phí bồi hoàn = (Tổng chi phí đào tạo / Thời gian cam kết) x Thời gian chưa phục vụ.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Mở lớp đào tạo & Gửi thư triệu tập',
        notificationTarget: 'Học viên & Quản lý bộ phận',
        notificationChannel: 'Email thông báo triệu tập + Lịch Calendar + LMS Notification'
      },
      {
        logEvent: 'Cấp chứng chỉ hoàn thành khóa học',
        notificationTarget: 'Học viên',
        notificationChannel: 'Chứng chỉ điện tử PDF có mã QR xác thực'
      }
    ],
    uiFields: [
      'Tên khóa đào tạo',
      'Mã khóa học',
      'Thời lượng (Giờ học / Ngày học)',
      'Hình thức (Online E-learning / Offline)',
      'Chi phí đào tạo (VNĐ)',
      'Thời hạn cam kết phục vụ (Tháng)',
      'Điểm sát hạch cuối khóa'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-DT-02',
        sopTitle: 'Quy trình Quản lý Kế hoạch Đào tạo & Cam kết Phục vụ',
        sopCategory: 'Phân hệ Đào tạo · Kế hoạch đào tạo',
        description: 'Lập danh sách học viên, ký cam kết đào tạo, tổ chức đào tạo, sát hạch cấp chứng chỉ và theo dõi cam kết.',
        steps: [
          {
            stepCode: 'DT02.01',
            title: 'Lập danh sách học viên & Ký cam kết đào tạo',
            actor: 'Chuyên viên L&D & Học viên',
            location: 'LMS Portal',
            timing: 'Trước khi bắt đầu khóa học tối thiểu 3 ngày',
            typeCode: 'N',
            description: 'Lập danh sách học viên triệu tập, sinh Hợp đồng cam kết đào tạo và yêu cầu nhân viên ký số.',
            fieldsChecklist: ['Danh sách học viên', 'Chi phí khóa học', 'Thời gian cam kết phục vụ', 'Ký số hợp đồng cam kết']
          },
          {
            stepCode: 'DT02.02',
            title: 'Tổ chức đào tạo & Điểm danh LMS',
            actor: 'Giảng viên & Học viên',
            location: 'LMS / Phòng đào tạo',
            timing: 'Theo thời khóa biểu khóa học',
            typeCode: 'M',
            description: 'Giảng viên giảng dạy, điểm danh học viên qua QR Code/FaceID trên LMS.',
            fieldsChecklist: ['Tỷ lệ chuyên cần', 'Bài tập thực hành', 'Nhật ký lớp học']
          },
          {
            stepCode: 'DT02.03',
            title: 'Kiểm tra sát hạch & Đánh giá cuối khóa',
            actor: 'Học viên & Ban Khảo thí',
            location: 'LMS Testing Portal',
            timing: 'Cuối buổi học / Cuối khóa',
            typeCode: 'M',
            description: 'Học viên làm bài kiểm tra sát hạch trực tuyến, hệ thống chấm điểm tự động.',
            fieldsChecklist: ['Điểm bài thi', 'Xếp loại (Xuất sắc, Giỏi, Khá, Đạt, Không đạt)']
          },
          {
            stepCode: 'DT02.04',
            title: 'Cấp chứng chỉ số & Cập nhật Hồ sơ năng lực',
            actor: 'Hệ thống HRM Engine',
            location: 'Hệ thống tự động',
            timing: 'Tức thì sau khi có điểm thi',
            typeCode: 'A',
            description: 'Hệ thống tự động sinh chứng chỉ số hóa (Digital Certificate) gắn vào hồ sơ nhân viên.',
            fieldsChecklist: ['Cấp Chứng chỉ số', 'Cập nhật Profile', 'Gửi email chúc mừng']
          }
        ]
      }
    ]
  },

  'CF-07': {
    id: 'CF-07',
    code: 'CF-07',
    title: 'Đánh giá Thử việc & Hiệu suất KPI/OKR',
    shortTitle: 'Đánh giá KPI & Thử việc',
    subtitle: 'Nghiệm thu kết quả thử việc, đánh giá hiệu suất định kỳ & xếp loại thành tích',
    description:
      'Quản lý toàn bộ chu trình đánh giá kết quả công tác: từ đánh giá kết thúc thời gian thử việc (30 ngày/60 ngày) để quyết định ký HĐLĐ chính thức, đến chu kỳ đánh giá hiệu suất làm việc định kỳ (Tháng/Quý/Năm) theo mục tiêu KPI/OKR và năng lực cốt lõi.',
    businessPurpose:
      'Đo lường chính xác mức độ hoàn thành mục tiêu công việc của từng cá nhân; cung cấp cơ sở khách quan để chi trả lương thưởng hiệu suất (Performance Bonus), xét nâng ngạch bậc lương và quyết định tiếp nhận chính thức.',
    triggerSummary:
      'Kích hoạt trước ngày kết thúc thử việc 7-10 ngày; hoặc kích hoạt định kỳ vào cuối mỗi tháng/quý/năm khi mở chu kỳ đánh giá hiệu suất toàn công ty.',
    iconName: 'Target',
    domain: 'performance',
    domainLabel: 'Hiệu suất & Đánh giá',
    frequency: 'mixed',
    frequencyLabel: 'Kết thúc thử việc & Định kỳ Tháng/Quý/Năm',
    sla: 'Hoàn tất đánh giá thử việc trước ngày hết hạn 5 ngày; Đánh giá kỳ hoàn thành trước ngày 05 tháng kế tiếp',
    actorsMatrix: {
      proposer: 'Nhân viên (Thực hiện Tự đánh giá KPI trên Portal)',
      reviewer: 'Trưởng bộ phận (Chấm điểm, nhận xét, phỏng vấn nghiệm thu & đề xuất kết quả)',
      approver: 'Giám đốc Khối / Giám đốc Nhân sự (HRD) phê duyệt kết quả cuối cùng',
      executor: 'Chuyên viên C&B (Xử lý hợp đồng chính thức hoặc thưởng hiệu suất)',
      notified: 'Nhân viên được đánh giá, TBP & Ban Giám Đốc'
    },
    inputs: [
      'Bản mục tiêu KPI thử việc / Mục tiêu KPI quý đã được phê duyệt đầu kỳ',
      'Số liệu kết quả thực hiện thực tế (doanh thu, tiến độ dự án, tỷ lệ lỗi)',
      'Bản tự chấm điểm và giải trình kết quả của Nhân viên (Self-Assessment)',
      'Bộ tiêu chuẩn đánh giá năng lực theo chức danh (MD-06 / Job Competency)'
    ],
    outputs: [
      'Phiếu đánh giá hiệu suất hoàn chỉnh có đầy đủ nhận xét và điểm số của Quản lý',
      'Kết luận đánh giá thử việc: "Đạt" (Kích hoạt ký HĐ chính thức LIFE-04/CF-02) hoặc "Không đạt" (Thanh lý HĐ thử việc)',
      'Hệ số hiệu suất (Performance Factor) phục vụ tính thưởng lương kỳ PAY03',
      'Đề xuất tăng bậc lương hoặc kế hoạch cải thiện hiệu suất (PIP) nếu không đạt'
    ],
    upstreamModules: ['MD-06', 'MD-CAT-06', 'LIFE-01', 'LIFE-02'],
    downstreamModules: ['CF-02', 'MODULE-PAY', 'LIFE-07', 'BI'],
    integrations: [
      {
        module: 'CONTRACT',
        moduleName: 'Hợp đồng lao động',
        color: 'emerald',
        description: 'Nếu kết quả Thử việc Đạt ➔ Tự động kích hoạt Luồng Ký Hợp đồng lao động chính thức (SOP EMP06 / CF-02).'
      },
      {
        module: 'PAY',
        moduleName: 'Tiền lương',
        color: 'amber',
        description: 'Đồng bộ hệ số xếp loại A/B/C/D vào công thức tính Thưởng hiệu suất KPI tháng/quý/năm (PAY03).'
      },
      {
        module: 'OFFBOARD',
        moduleName: 'Chấm dứt thử việc',
        color: 'rose',
        description: 'Nếu kết quả Thử việc Không đạt ➔ Chuyển sang luồng thanh lý hợp đồng thử việc theo đúng luật định (LIFE-07).'
      }
    ],
    masterDataIds: ['MD-06', 'MD-CAT-06', 'MD-07'],
    sopBadge: 'SOP-ĐG-01, 02, 04',
    sopIds: ['SOP-ĐG-01', 'SOP-ĐG-02', 'SOP-ĐG-04', 'SOP-EMP-02.06', 'PFM-01'],
    sopTitles: [
      'Quy trình Đánh giá Kết quả Thử việc',
      'Quy trình Thiết lập Mục tiêu & Đánh giá Hiệu suất KPI định kỳ'
    ],
    exceptionHandling: [
      {
        scenario: 'Kết quả thử việc Không đạt (Fail)',
        handling: 'TBP tiến hành buổi phỏng vấn phản hồi; HR ban hành Thông báo không đạt thử việc trước ngày hết hạn và tiến hành thanh lý hợp đồng.'
      },
      {
        scenario: 'Nhân viên khiếu nại kết quả đánh giá KPI của quản lý',
        handling: 'Nộp đơn khiếu nại lên HRBP; HRBP thành lập Hội đồng phúc khảo đánh giá độc lập để xem xét lại minh chứng số liệu.'
      },
      {
        scenario: 'Xếp loại D liên tục 2 kỳ đánh giá',
        handling: 'Áp dụng Kế hoạch cải thiện hiệu suất bắt buộc (Performance Improvement Plan - PIP) trong 30-60 ngày.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Mở đợt tự đánh giá KPI',
        notificationTarget: 'Nhân viên & Quản lý',
        notificationChannel: 'Email + Push App Mobile nhắc hoàn thành trước hạn'
      },
      {
        logEvent: 'Phê duyệt kết quả đánh giá thử việc / KPI',
        notificationTarget: 'Nhân viên',
        notificationChannel: 'Email thông báo kết quả + Mở xem chi tiết phiếu nhận xét'
      }
    ],
    uiFields: [
      'Kỳ đánh giá (Thử việc / Tháng / Quý / Năm)',
      'Tổng điểm mục tiêu KPI (%)',
      'Điểm đánh giá năng lực',
      'Điểm tổng hợp cuối cùng',
      'Xếp loại hiệu suất (Xuất sắc / Tốt / Đạt / Cần cải thiện)',
      'Kết luận thử việc (Đạt tiếp nhận chính thức / Không đạt)',
      'Ý kiến nhận xét của Quản lý'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-ĐG-04',
        sopTitle: 'Quy trình Đánh giá Kết quả Thử việc',
        sopCategory: 'Phân hệ Hiệu suất · Thử việc',
        description: 'Quy trình nhân viên tự đánh giá, quản lý trực tiếp chấm điểm phỏng vấn nghiệm thu, HRD phê duyệt và chuyển luồng ký HĐ.',
        steps: [
          {
            stepCode: 'DG04.01',
            title: 'Nhân viên thực hiện tự đánh giá thử việc',
            actor: 'Nhân viên thử việc',
            location: 'Portal / Mobile App',
            timing: 'Trước ngày hết hạn thử việc 10 ngày',
            typeCode: 'N',
            description: 'Nhân viên đối soát với bản giao mục tiêu ban đầu, tự chấm điểm và nêu các kết quả đạt được.',
            fieldsChecklist: ['Bản tự chấm điểm', 'Báo cáo kết quả công việc', 'Nguyện vọng gắn bó']
          },
          {
            stepCode: 'DG04.02',
            title: 'Quản lý chấm điểm & Phỏng vấn nghiệm thu',
            actor: 'Trưởng bộ phận (TBP)',
            location: 'Portal Quản lý & Phòng họp',
            timing: 'Trong vòng 3 ngày sau khi nhân viên nộp',
            typeCode: 'M',
            description: 'TBP chấm điểm độc lập, phỏng vấn nghiệm thu kết quả và đưa ra kết luận: Đạt / Không đạt.',
            fieldsChecklist: ['Điểm quản lý chấm', 'Nhận xét ưu nhược điểm', 'Kết luận Đạt/Không đạt', 'Đề xuất mức lương chính thức']
          },
          {
            stepCode: 'DG04.03',
            title: 'Giám đốc Nhân sự (HRD) phê duyệt kết quả',
            actor: 'Giám đốc Nhân sự (HRD)',
            location: 'Portal Phê duyệt',
            timing: 'Trước ngày hết hạn thử việc 5 ngày',
            typeCode: 'M',
            description: 'HRD xem xét phiếu đánh giá, duyệt kết quả và kích hoạt luồng hợp đồng tương ứng.',
            fieldsChecklist: ['Quyết định duyệt', 'Chuyển luồng Ký HĐLĐ chính thức (nếu Đạt)']
          },
          {
            stepCode: 'DG04.04',
            title: 'Tự động kích hoạt luồng Ký Hợp đồng chính thức',
            actor: 'Hệ thống HRM Engine',
            location: 'Hệ thống tự động',
            timing: 'Tức thì sau khi HRD duyệt',
            typeCode: 'A',
            description: 'Hệ thống sinh task cho C&B lập HĐLĐ chính thức (SOP EMP06 / CF-02), gửi email chúc mừng cho nhân viên.',
            fieldsChecklist: ['Tạo Draft HĐLĐ chính thức', 'Gửi email chúc mừng vượt qua thử việc']
          }
        ]
      }
    ]
  },

  'CF-08': {
    id: 'CF-08',
    code: 'CF-08',
    title: 'Phát triển Nhân tài, Lộ trình Thăng tiến & Kế nhiệm',
    shortTitle: 'Nhân tài & Kế nhiệm',
    subtitle: 'Rà soát nhân tài (Talent Review), ma trận 9-Box, lộ trình thăng tiến (IDP) & cán bộ nguồn',
    description:
      'Quản lý chiến lược phát triển nhân tài dài hạn của doanh nghiệp: thực hiện rà soát nhân tài hàng năm (Talent Review), phân loại nhân sự vào Ma trận 9 ô (9-Box Talent Matrix), xây dựng Kế hoạch phát triển cá nhân (Individual Development Plan - IDP) và quy hoạch cán bộ kế thừa cho các vị trí quản lý trọng yếu (Key Positions).',
    businessPurpose:
      'Chủ động chuẩn bị đội ngũ lãnh đạo kế cận, giảm thiểu rủi ro gián đoạn kinh doanh khi cán bộ chủ chốt rời đi; giữ chân nhân sự tài năng qua lộ trình phát triển nghề nghiệp rõ ràng.',
    triggerSummary:
      'Kích hoạt định kỳ hàng năm vào Quý 3/Quý 4 trong kỳ Talent Review toàn công ty; hoặc kích hoạt khi có sự thay đổi quy hoạch vị trí lãnh đạo trọng yếu.',
    iconName: 'GitBranch',
    domain: 'talent',
    domainLabel: 'Quản trị Nhân tài (Talent)',
    frequency: 'annual',
    frequencyLabel: 'Định kỳ Hàng năm (Quý 3/Quý 4)',
    sla: 'Hoàn tất đợt rà soát Talent Matrix trong Quý 3 hàng năm',
    actorsMatrix: {
      proposer: 'HR Business Partner (HRBP) phối hợp cùng Trưởng bộ phận',
      reviewer: 'Hội đồng Quản trị Nhân tài (Talent Review Committee)',
      approver: 'Tổng Giám Đốc (CEO) & Hội đồng Quản trị (BOD) phê duyệt danh sách nguồn',
      executor: 'Chuyên viên Phát triển Nhân tài (Talent Management Specialist)',
      notified: 'Cán bộ được quy hoạch nguồn & Lãnh đạo các khối'
    },
    inputs: [
      'Dữ liệu đánh giá hiệu suất KPI liên tục 2-3 năm gần nhất',
      'Khung năng lực lãnh đạo và chuyên môn cốt lõi (Leadership Competency Model - MD-06)',
      'Đánh giá tiềm năng phát triển (Potential Assessment) và mức độ gắn kết',
      'Danh mục các vị trí trọng yếu cần quy hoạch kế thừa (Key Positions Catalog)'
    ],
    outputs: [
      'Bản đồ phân loại nhân tài toàn doanh nghiệp trên Ma trận 9 ô (9-Box Matrix)',
      'Danh sách Cán bộ quy hoạch nguồn (Succession Pool) kèm mức độ sẵn sàng (Ready Now / 1-2 năm)',
      'Kế hoạch phát triển cá nhân (IDP) gắn liền với các dự án thử thách và đào tạo lãnh đạo',
      'Gói chính sách giữ chân nhân tài trọng yếu (Talent Retention Program)'
    ],
    upstreamModules: ['MD-06', 'MD-CAT-06', 'MD-05', 'CF-07'],
    downstreamModules: ['CF-06', 'CF-03', 'BI', 'Hồ sơ nhân lực'],
    integrations: [
      {
        module: 'TRN',
        moduleName: 'Đào tạo lãnh đạo',
        color: 'purple',
        description: 'Tự động đưa nhân sự thuộc Succession Pool vào chương trình đào tạo Cán bộ nguồn (Leadership Acceleration / Mentoring).'
      },
      {
        module: 'MOVEMENT',
        moduleName: 'Bổ nhiệm cán bộ',
        color: 'emerald',
        description: 'Ưu tiên tự động đề xuất nhân sự trong Succession Pool khi vị trí quản lý tương ứng phát sinh nhu cầu bổ nhiệm (CF-03).'
      }
    ],
    masterDataIds: ['MD-06', 'MD-CAT-06', 'MD-05'],
    sopBadge: 'SOP-NS-15',
    sopIds: ['SOP-NS-15', 'SOP-EMP-01', 'IDP-01'],
    sopTitles: [
      'Quy trình Rà soát Nhân tài & Ma trận 9-Box',
      'Quy trình Quy hoạch Cán bộ Kế thừa & Kế hoạch Phát triển Cá nhân (IDP)'
    ],
    exceptionHandling: [
      {
        scenario: 'Nhân sự nguồn có nguy cơ nghỉ việc (Flight Risk)',
        handling: 'HRBP kích hoạt phiên trao đổi 1-on-1 bảo mật; áp dụng gói chính sách đãi ngộ giữ chân nhân tài (Retention Bonus / Cổ phiếu ESOP).'
      },
      {
        scenario: 'Nhân sự quy hoạch không đạt tiến độ mục tiêu phát triển IDP',
        handling: 'Người cố vấn (Mentor) rà soát nguyên nhân, điều chỉnh kế hoạch hành động hoặc đưa ra khỏi danh sách nguồn sau 2 kỳ đánh giá không cải thiện.'
      }
    ],
    auditAndNotification: [
      {
        logEvent: 'Phê duyệt Danh sách Quy hoạch Kế nhiệm',
        notificationTarget: 'Thành viên Hội đồng Quản trị & CEO',
        notificationChannel: 'Báo cáo bảo mật cấp cao (Confidential Executive Report)'
      },
      {
        logEvent: 'Ban hành Kế hoạch phát triển cá nhân IDP',
        notificationTarget: 'Nhân sự được quy hoạch & Mentor',
        notificationChannel: 'Portal Kế hoạch phát triển IDP cá nhân'
      }
    ],
    uiFields: [
      'Vị trí chức danh quy hoạch (Key Position)',
      'Phân loại trên Ma trận 9-Box (Ngôi sao, Tiềm năng cao, Cốt cán)',
      'Mức độ sẵn sàng đảm nhiệm (Ready Now / 1 năm / 2 năm)',
      'Người kèm cặp cố vấn (Mentor / Coach)',
      'Mục tiêu phát triển năng lực IDP trong năm'
    ],
    sopProcesses: [
      {
        sopCode: 'SOP-NS-15',
        sopTitle: 'Quy trình Rà soát Nhân tài & Quy hoạch Kế nhiệm',
        sopCategory: 'Phân hệ Nhân tài · Quy hoạch cán bộ',
        description: 'Thu thập dữ liệu hiệu suất và tiềm năng, họp Talent Review, xếp ma trận 9-box và phê duyệt kế hoạch kế thừa.',
        steps: [
          {
            stepCode: 'NS15.01',
            title: 'Thu thập dữ liệu Hiệu suất & Đánh giá Tiềm năng',
            actor: 'HRBP & Trưởng bộ phận',
            location: 'Talent Management Portal',
            timing: 'Đầu Quý 3 hàng năm',
            typeCode: 'N',
            description: 'Tổng hợp điểm KPI 2 năm liên tiếp và chấm điểm bộ câu hỏi đánh giá tiềm năng lãnh đạo (Potential Scale).',
            fieldsChecklist: ['Điểm KPI lịch sử', 'Điểm Tiềm năng lãnh đạo', 'Mức độ khát vọng nghề nghiệp']
          },
          {
            stepCode: 'NS15.02',
            title: 'Họp Hội đồng Rà soát Nhân tài (Talent Review Meeting)',
            actor: 'Hội đồng Nhân tài & Ban Giám Đốc',
            location: 'Phòng họp Điều hành',
            timing: 'Trong tháng 8 hàng năm',
            typeCode: 'M',
            description: 'Hội đồng thảo luận, hiệu chỉnh và xếp vị trí của từng nhân sự vào Ma trận 9 ô (9-Box Matrix).',
            fieldsChecklist: ['Ma trận 9-Box Matrix', 'Phân loại nhóm nhân tài', 'Đánh giá nguy cơ nghỉ việc (Flight Risk)']
          },
          {
            stepCode: 'NS15.03',
            title: 'Xây dựng Lộ trình Kế nhiệm & Kế hoạch IDP',
            actor: 'Talent Specialist & Nhân sự được quy hoạch',
            location: 'IDP Portal',
            timing: 'Trong tháng 9 hàng năm',
            typeCode: 'M',
            description: 'Xây dựng bản kế hoạch phát triển năng lực cá nhân (IDP) với các dự án luân chuyển và khóa học đào tạo lãnh đạo.',
            fieldsChecklist: ['Vị trí kế nhiệm mục tiêu', 'Kế hoạch hành động 70-20-10', 'Người kèm cặp Mentor']
          },
          {
            stepCode: 'NS15.04',
            title: 'CEO & Hội đồng Quản trị phê duyệt Danh sách Kế nhiệm',
            actor: 'Tổng Giám Đốc (CEO) & BOD',
            location: 'Executive Dashboard',
            timing: 'Trước 30/10 hàng năm',
            typeCode: 'M',
            description: 'Phê duyệt danh sách cán bộ nguồn chính thức và phê duyệt ngân sách đãi ngộ giữ chân nhân tài.',
            fieldsChecklist: ['Phê duyệt Succession Pool', 'Ngân sách giữ chân nhân tài', 'Bảo mật thông tin']
          }
        ]
      }
    ]
  }
}

/** Danh sách mảng 8 module chuẩn hóa phục vụ hiển thị */
export const CROSS_FUNCTIONAL_MODULES_LIST: CrossFunctionalModuleDefinition[] = [
  CROSS_FUNCTIONAL_REGISTRY['CF-01'],
  CROSS_FUNCTIONAL_REGISTRY['CF-02'],
  CROSS_FUNCTIONAL_REGISTRY['CF-03'],
  CROSS_FUNCTIONAL_REGISTRY['CF-04'],
  CROSS_FUNCTIONAL_REGISTRY['CF-05'],
  CROSS_FUNCTIONAL_REGISTRY['CF-06'],
  CROSS_FUNCTIONAL_REGISTRY['CF-07'],
  CROSS_FUNCTIONAL_REGISTRY['CF-08']
]

/** Helper lấy thông tin module theo ID */
export function getCrossFunctionalModule(id: string): CrossFunctionalModuleDefinition | undefined {
  return CROSS_FUNCTIONAL_REGISTRY[id] || CROSS_FUNCTIONAL_REGISTRY[id.replace('CROSS-', 'CF-')]
}
