import type { Policy } from '../types'

export const POLICY_REGISTRY: Policy[] = [
  // 1. POL-EMP-01
  {
    id: 'POL-EMP-01',
    code: 'POL-EMP-01',
    title: 'Quy định cập nhật & chuẩn hóa thông tin cá nhân',
    titleEn: 'Employee Profile Data Verification & Update Policy',
    summary:
      'Quy định trách nhiệm của nhân viên trong việc chủ động rà soát, cập nhật định kỳ và đảm bảo tính chính xác của dữ liệu hồ sơ cá nhân trên hệ thống HRMS.',
    summaryEn:
      'Mandatory policy requiring employees to periodically review and update personal profile records, including residence, dependents, and bank accounts on HRMS.',
    category: 'employee-profile',
    type: 'mandatory-action',
    status: 'active',
    severity: 'mandatory',
    effectiveFrom: '2025-01-01',
    issuingDepartment: 'POEC / Trung tâm Quản lý Nhân sự',
    applicableAudience: 'Toàn bộ nhân viên chính thức, thử việc và cộng tác viên',
    version: '2.1',
    lastUpdated: '2025-01-15',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi cam kết đã rà soát và thông tin hồ sơ cá nhân của tôi trên HRMS là chính xác.',
    tags: ['Hồ sơ nhân viên', 'Master Data', 'Thông tin cá nhân', 'POEC', 'Ngân hàng', 'Người phụ thuộc'],
    relatedProcessCodes: ['LIFE-02', 'MD-01', 'MD-02'],
    relatedSopCodes: ['SOP-EMP-03'],
    responsibilities: {
      employee: [
        'Chủ động rà soát định kỳ toàn bộ dữ liệu nhân thân, địa chỉ thường trú, tạm trú, số điện thoại khẩn cấp.',
        'Cập nhật kịp thời thông tin tài khoản ngân hàng nhận lương và thông tin người phụ thuộc giảm trừ gia cảnh.',
        'Đính kèm bản chụp chứng từ gốc (CCCD, sổ hộ khẩu, giấy khai sinh người phụ thuộc) khi có phát sinh thay đổi.',
        'Chịu trách nhiệm pháp lý về tính xác thực của dữ liệu đã kê khai trên hệ thống.'
      ],
      hr: [
        'Tiếp nhận, kiểm tra tính hợp lệ của hồ sơ minh chứng đính kèm trong vòng 48 giờ làm việc.',
        'Xác thực và phê duyệt đồng bộ dữ liệu vào Master Data nhân sự.'
      ]
    },
    rules: [
      {
        id: 'RULE-EMP-01',
        label: 'Thời hạn cập nhật khi phát sinh thay đổi',
        description: 'Nhân viên phải gửi yêu cầu cập nhật thông tin trên HRMS trong vòng 07 ngày làm việc kể từ khi có biến động.',
        condition: 'Phát sinh thay đổi CCCD, cư trú, người phụ thuộc, tài khoản ngân hàng',
        outcome: 'Gửi yêu cầu chỉnh sửa hồ sơ kèm minh chứng',
        unit: 'ngày làm việc',
        value: 7,
        ruleKind: 'deadline'
      },
      {
        id: 'RULE-EMP-02',
        label: 'Đính kèm tài liệu minh chứng hợp lệ',
        description: 'Mọi thay đổi thông tin định danh và tài chính bắt buộc phải có tài liệu đính kèm rõ nét, không tẩy xóa.',
        condition: 'Yêu cầu thay đổi CCCD, ngân hàng, người phụ thuộc',
        outcome: 'Bắt buộc đính kèm tệp chứng từ (PDF/Ảnh)',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-EMP-03',
        label: 'Thời gian phê duyệt hồ sơ của HR',
        description: 'Chuyên viên Nhân sự thẩm định và phản hồi yêu cầu cập nhật trong thời hạn quy định.',
        condition: 'Hồ sơ hợp lệ đầy đủ chứng từ',
        outcome: 'Phê duyệt và đồng bộ Master Data trong 48h',
        unit: 'giờ làm việc',
        value: 48,
        ruleKind: 'approval'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Truy cập Portal Hồ sơ cá nhân',
        description: 'Nhân viên đăng nhập vào HRMS, chọn phân hệ "Hồ sơ của tôi" (LIFE-02).',
        actor: 'Nhân viên',
        systemAction: 'Hiển thị dữ liệu nhân thân hiện hành từ Master Data'
      },
      {
        stepNumber: 2,
        title: 'Chỉnh sửa thông tin biến động & Tải minh chứng',
        description: 'Nhập thông tin mới và tải file đính kèm (ảnh CCCD mới, xác nhận cư trú, sao kê tài khoản).',
        actor: 'Nhân viên',
        systemAction: 'Kiểm tra định dạng file và kiểm tra trường dữ liệu bắt buộc'
      },
      {
        stepNumber: 3,
        title: 'Gửi yêu cầu phê duyệt',
        description: 'Xác nhận cam kết thông tin chính xác và gửi yêu cầu tới Chuyên viên Nhân sự phụ trách.',
        actor: 'Nhân viên',
        systemAction: 'Tạo phiếu yêu cầu điều chỉnh hồ sơ & gửi thông báo'
      },
      {
        stepNumber: 4,
        title: 'Thẩm định & Đồng bộ dữ liệu',
        description: 'Chuyên viên POEC/HR kiểm tra đối soát chứng từ và xác nhận duyệt.',
        actor: 'Chuyên viên POEC/HR',
        systemAction: 'Cập nhật Master Data nhân sự và ghi vết lịch sử thay đổi (Audit Log)'
      }
    ],
    consequences: [
      {
        id: 'CQ-EMP-01',
        type: 'system-block',
        title: 'Tạm khóa quyền nộp đơn chế độ khi thông tin bắt buộc còn thiếu',
        description: 'Hệ thống có thể tạm dừng xử lý đơn đăng ký giảm trừ gia cảnh hoặc thay đổi tài khoản nhận lương nếu thiếu chứng từ hợp lệ.',
        severity: 'medium'
      },
      {
        id: 'CQ-EMP-02',
        type: 'disciplinary-info',
        title: 'Trách nhiệm về quyền lợi cá nhân',
        description: 'Việc chậm trễ hoặc kê khai sai lệch thông tin có thể ảnh hưởng trực tiếp đến quyền lợi chi trả lương, thưởng và chế độ bảo hiểm của nhân viên (Nội dung tham chiếu theo quy định demo).',
        severity: 'low'
      }
    ],
    originalNotice: {
      noticeNumber: 'TB-HR/2025/01-POEC',
      issuedDate: '2025-01-01',
      subject: 'Thông báo về việc rà soát và chuẩn hóa dữ liệu hồ sơ nhân sự trên hệ thống HRMS',
      contentSections: [
        {
          heading: '1. Mục đích',
          paragraphs: [
            'Nhằm phục vụ công tác chuyển đổi số và đảm bảo tính chính xác trong việc quản lý hồ sơ nhân sự, chi trả thu nhập và giải quyết chế độ chính sách.',
            'Trung tâm Quản lý Nhân sự thông báo đến toàn thể Người lao động về việc chủ động rà soát, đối chiếu và cập nhật thông tin cá nhân trên hệ thống HRMS.'
          ]
        },
        {
          heading: '2. Nội dung rà soát trọng tâm',
          paragraphs: [
            '- Thông tin căn cước công dân gắn chip và nơi đăng ký thường trú, tạm trú hiện tại.',
            '- Số tài khoản ngân hàng chính chủ phục vụ thanh toán tiền lương.',
            '- Danh sách người phụ thuộc giảm trừ gia cảnh kèm hồ sơ chứng minh theo quy định thuế thu nhập cá nhân.'
          ]
        },
        {
          heading: '3. Trách nhiệm thực hiện',
          paragraphs: [
            '- Toàn thể Người lao động thực hiện cập nhật trước thời hạn được thông báo trên hệ thống.',
            '- Quản lý bộ phận có trách nhiệm đôn đốc nhân viên trực thuộc hoàn thành đúng tiến độ.'
          ]
        }
      ]
    }
  },

  // 2. POL-ATT-01
  {
    id: 'POL-ATT-01',
    code: 'POL-ATT-01',
    title: 'Quy định đăng ký & phê duyệt nghỉ phép',
    titleEn: 'Leave Request & Advance Notice Regulation',
    summary:
      'Quy định thời hạn tạo đơn báo trước theo số ngày nghỉ phép, điều kiện phê duyệt của Quản lý và cơ chế tự động hủy đơn khi quá hạn.',
    summaryEn:
      'Standard operating rules for advance notice requirements based on leave duration, manager pre-approval conditions, and automated cancellation safeguards.',
    category: 'attendance-leave',
    type: 'system-rule',
    status: 'active',
    severity: 'mandatory',
    effectiveFrom: '2025-01-01',
    issuingDepartment: 'Ban Quản lý Nhân sự & Vận hành',
    applicableAudience: 'Toàn thể Cán bộ - Nhân viên',
    version: '3.0',
    lastUpdated: '2025-01-10',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi đã hiểu quy tắc thời gian báo trước và điều kiện phê duyệt đơn nghỉ phép.',
    tags: ['Nghỉ phép', 'Phép năm', 'Báo trước', 'Hủy tự động', 'CF-01', 'Chấm công'],
    relatedProcessCodes: ['CF-01'],
    relatedSopCodes: ['SOP-ATT-01', 'SOP-CF-01'],
    responsibilities: {
      employee: [
        'Tạo đơn xin nghỉ phép trên hệ thống đúng thời hạn báo trước tương ứng với số ngày nghỉ.',
        'Theo dõi trạng thái đơn và đảm bảo đơn được Quản lý phê duyệt trước thời điểm bắt đầu nghỉ.',
        'Bàn giao công việc rõ ràng cho người phụ trách thay thế trong thời gian nghỉ.'
      ],
      manager: [
        'Xem xét, cân đối bố trí nhân sự và phê duyệt hoặc phản hồi đơn phép của nhân viên trong thời hạn quy định.',
        'Chỉ duyệt đơn khi đã có phương án phân công người thay thế phù hợp.'
      ]
    },
    rules: [
      {
        id: 'RULE-ATT-01',
        label: 'Nghỉ ngắn hạn (0.5 – 1 ngày)',
        description: 'Nhân viên phải nộp đơn xin nghỉ trước tối thiểu 24 giờ so với thời điểm ca làm việc bắt đầu.',
        condition: 'Số ngày nghỉ từ 0.5 đến 1.0 ngày',
        outcome: 'Báo trước tối thiểu 24 giờ (1 ngày)',
        unit: 'giờ',
        value: 24,
        ruleKind: 'deadline'
      },
      {
        id: 'RULE-ATT-02',
        label: 'Nghỉ trung hạn (1.5 – 3 ngày)',
        description: 'Nhân viên phải nộp đơn xin nghỉ trước tối thiểu 05 ngày làm việc.',
        condition: 'Số ngày nghỉ từ 1.5 đến 3.0 ngày',
        outcome: 'Báo trước tối thiểu 5 ngày',
        unit: 'ngày',
        value: 5,
        ruleKind: 'deadline'
      },
      {
        id: 'RULE-ATT-03',
        label: 'Nghỉ dài hạn (Trên 3 ngày)',
        description: 'Nhân viên phải nộp đơn xin nghỉ trước tối thiểu 15 ngày để phòng ban chủ động phương án nhân sự.',
        condition: 'Số ngày nghỉ lớn hơn 3.0 ngày',
        outcome: 'Báo trước tối thiểu 15 ngày',
        unit: 'ngày',
        value: 15,
        ruleKind: 'deadline'
      },
      {
        id: 'RULE-ATT-04',
        label: 'Điều kiện phê duyệt hợp lệ trước thời điểm nghỉ',
        description: 'Đơn nghỉ phép bắt buộc phải ở trạng thái "Đã duyệt" bởi Quản lý trực tiếp trước thời điểm bắt đầu nghỉ.',
        condition: 'Trước giờ bắt đầu ca làm việc',
        outcome: 'Trạng thái đơn: Đã duyệt (Approved)',
        ruleKind: 'approval'
      },
      {
        id: 'RULE-ATT-05',
        label: 'Tự động hủy đơn chưa phê duyệt',
        description: 'Đơn chưa được Quản lý duyệt đến thời điểm bắt đầu nghỉ sẽ bị hệ thống tự động hủy (Auto-Cancelled).',
        condition: 'Đến giờ vào ca mà trạng thái đơn vẫn là Chờ duyệt',
        outcome: 'Hệ thống chuyển trạng thái Hủy tự động',
        ruleKind: 'validation'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Kiểm tra quỹ phép khả dụng',
        description: 'Nhân viên tra cứu số ngày phép năm còn lại trên Portal Quản lý Thời gian (CF-01).',
        actor: 'Nhân viên',
        systemAction: 'Hiển thị Quỹ phép tồn và lịch ca phân công'
      },
      {
        stepNumber: 2,
        title: 'Tạo đơn xin nghỉ & Chọn người bàn giao',
        description: 'Chọn loại phép, khoảng thời gian nghỉ, lý do và chỉ định đồng nghiệp nhận bàn giao.',
        actor: 'Nhân viên',
        systemAction: 'Hệ thống tự động kiểm tra thời gian báo trước so với quy định'
      },
      {
        stepNumber: 3,
        title: 'Quản lý thẩm định & Phê duyệt',
        description: 'Quản lý nhận thông báo, đánh giá kế hoạch công việc và thực hiện Duyệt hoặc Từ chối.',
        actor: 'Quản lý trực tiếp',
        systemAction: 'Cập nhật trạng thái đơn và đồng bộ lịch vắng mặt vào bảng công'
      },
      {
        stepNumber: 4,
        title: 'Ghi nhận bảng công tự động',
        description: 'Hệ thống tự động đánh dấu ký hiệu nghỉ phép hưởng lương (AL) trên bảng công thực tế.',
        actor: 'Hệ thống HRMS',
        systemAction: 'Khóa giờ công chuẩn và trừ ngày phép vào sổ quỹ phép'
      }
    ],
    consequences: [
      {
        id: 'CQ-ATT-01',
        type: 'system-block',
        title: 'Tự động hủy đơn quá hạn phê duyệt',
        description: 'Nếu đến thời điểm ca làm việc bắt đầu mà đơn vẫn chưa được phê duyệt, hệ thống sẽ tự động hủy đơn và gửi thông báo cho cả nhân viên và quản lý.',
        severity: 'high'
      },
      {
        id: 'CQ-ATT-02',
        type: 'disciplinary-info',
        title: 'Ghi nhận vắng mặt không phép',
        description: 'Trường hợp nhân viên tự ý nghỉ việc khi đơn chưa được phê duyệt sẽ được ghi nhận là nghỉ không phép theo quy định chấm công demo.',
        severity: 'high'
      }
    ],
    originalNotice: {
      noticeNumber: 'QĐ-ATT/2025/02',
      issuedDate: '2025-01-01',
      subject: 'Quy định về thời hạn đăng ký và quy trình phê duyệt nghỉ phép nội bộ',
      contentSections: [
        {
          heading: '1. Nguyên tắc chung',
          paragraphs: [
            'Mọi trường hợp nghỉ phép (phép năm, phép không hưởng lương, phép việc riêng) đều phải thực hiện đăng ký trên phần mềm HRMS và tuân thủ thời gian báo trước.',
            'Việc nghỉ phép phải đảm bảo không làm gián đoạn hoạt động vận hành liên tục của bộ phận.'
          ]
        },
        {
          heading: '2. Khung thời gian báo trước bắt buộc',
          paragraphs: [
            '- Nghỉ từ 0.5 đến 1.0 ngày: Báo trước tối thiểu 24 giờ.',
            '- Nghỉ từ 1.5 đến 3.0 ngày: Báo trước tối thiểu 05 ngày.',
            '- Nghỉ trên 3.0 ngày: Báo trước tối thiểu 15 ngày.'
          ]
        },
        {
          heading: '3. Cơ chế kiểm soát tự động',
          paragraphs: [
            '- Hệ thống HRMS sẽ từ chối tiếp nhận các đơn không đáp ứng đủ thời gian báo trước trừ trường hợp nghỉ đột xuất bất khả kháng có xác nhận.',
            '- Đơn chưa được cấp quản lý phê duyệt trước thời điểm bắt đầu nghỉ sẽ tự động bị hủy hiệu lực.'
          ]
        }
      ]
    }
  },

  // 3. POL-ADM-01
  {
    id: 'POL-ADM-01',
    code: 'POL-ADM-01',
    title: 'Quy định tiêu chuẩn đeo bảng tên & tác phong làm việc',
    titleEn: 'Name Badge & Workplace Professional Standards Policy',
    summary:
      'Quy định bắt buộc về vị trí, hình thức và tiêu chuẩn đeo bảng tên nhận diện thương hiệu trong toàn bộ thời gian làm việc tại công ty.',
    summaryEn:
      'Workplace conduct standard defining mandatory requirements for wearing company name badges, placement on left chest, and replacement procedures.',
    category: 'workplace-conduct',
    type: 'internal-regulation',
    status: 'active',
    severity: 'warning',
    effectiveFrom: '2025-04-09',
    issuingDepartment: 'Khối Hành chính - Quản trị & Nhân sự',
    applicableAudience: 'Toàn bộ nhân viên tại văn phòng, chi nhánh và các dự án hiện trường',
    version: '1.2',
    lastUpdated: '2025-04-05',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi cam kết tuân thủ quy định đeo bảng tên đúng vị trí và quy cách trong giờ làm việc.',
    tags: ['Bảng tên', 'Tác phong', 'Nội quy lao động', 'Văn hóa doanh nghiệp', 'Hành chính'],
    relatedProcessCodes: ['CF-01', 'LIFE-01'],
    relatedSopCodes: ['SOP-REC-01', 'SOP-CF-01'],
    responsibilities: {
      employee: [
        'Đeo bảng tên nhận diện trong toàn bộ thời gian hiện diện tại khuôn viên công ty và khi làm việc với đối tác/khách hàng.',
        'Bảo quản bảng tên ngay ngắn, sạch sẽ, không che khuất hoặc tự ý dán đè/chỉnh sửa thông tin.',
        'Liên hệ ngay với bộ phận Nhân sự / Hành chính để được cấp lại khi bị mất hoặc hư hỏng.'
      ],
      manager: [
        'Đôn đốc, kiểm tra tác phong và văn hóa đeo bảng tên của các thành viên trong bộ phận.',
        'Ghi nhận phản hồi tác phong vào kỳ đánh giá định kỳ.'
      ]
    },
    rules: [
      {
        id: 'RULE-ADM-01',
        label: 'Thời gian bắt buộc đeo bảng tên',
        description: 'Bắt buộc đeo bảng tên trong toàn bộ thời gian làm việc chính thức và khi tham gia các sự kiện của công ty.',
        condition: 'Thời gian làm việc tại văn phòng/dự án',
        outcome: 'Bắt buộc đeo bảng tên nhận diện',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-ADM-02',
        label: 'Vị trí đeo đối với Nhân viên',
        description: 'Đeo bảng tên ở bên ngực trái, phía trên logo công ty khoảng 1 cm, đảm bảo nhìn rõ họ tên và chức danh.',
        condition: 'Nhân viên mặc áo đồng phục công ty',
        outcome: 'Ngực trái, cách mép trên logo ~1 cm',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-ADM-03',
        label: 'Vị trí đeo đối với Cấp quản lý',
        description: 'Cấp Quản lý khi mặc áo vest đeo bảng tên trên ve áo vest bên trái ngay ngắn.',
        condition: 'Quản lý mặc vest/trang phục công sở',
        outcome: 'Ve áo vest bên ngực trái',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-ADM-04',
        label: 'Quy trình cấp lại bảng tên khi mất/hỏng',
        description: 'Trường hợp mất hoặc hư hỏng, nhân viên tạo yêu cầu trên Portal Hành chính trong vòng 24h để được cấp phát mới.',
        condition: 'Mất hoặc hỏng bảng tên',
        outcome: 'Tạo phiếu yêu cầu cấp lại trên HRMS',
        ruleKind: 'validation'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Tiếp nhận bảng tên khi Onboarding',
        description: 'Nhân viên mới nhận bảng tên tiêu chuẩn từ phòng Nhân sự trong ngày đầu nhận việc (LIFE-01).',
        actor: 'Nhân viên mới & HR',
        systemAction: 'Cập nhật trạng thái cấp phát tài sản ban đầu'
      },
      {
        stepNumber: 2,
        title: 'Đeo bảng tên theo quy cách chuẩn',
        description: 'Gắn bảng tên bên ngực trái (cách logo 1cm với nhân viên, trên ve vest với cấp quản lý).',
        actor: 'Nhân viên',
        systemAction: 'Hệ thống ghi nhận hình ảnh điểm danh có kèm bảng tên'
      },
      {
        stepNumber: 3,
        title: 'Quy trình báo mất & Cấp lại',
        description: 'Khi phát sinh mất/hỏng, gửi phiếu cấp lại qua phân hệ Tiện ích hỗ trợ.',
        actor: 'Nhân viên',
        systemAction: 'Chuyển thông tin tới Hành chính in bảng tên mới'
      }
    ],
    consequences: [
      {
        id: 'CQ-ADM-01',
        type: 'verification-required',
        title: 'Nhắc nhở tác phong chuyên nghiệp',
        description: 'Các trường hợp không đeo bảng tên hoặc đeo sai quy cách sẽ được nhắc nhở và ghi nhận vào tiêu chí tác phong.',
        severity: 'low'
      },
      {
        id: 'CQ-ADM-02',
        type: 'disciplinary-info',
        title: 'Quy định tham chiếu nội bộ',
        description: 'Tuân thủ tác phong đeo bảng tên là tiêu chí tham chiếu trong đánh giá văn hóa doanh nghiệp định kỳ (Nội dung demo).',
        severity: 'low'
      }
    ],
    originalNotice: {
      noticeNumber: 'TB-HCNS/2025/09-BT',
      issuedDate: '2025-04-09',
      subject: 'Thông báo về việc chuẩn hóa quy cách và thực hiện nghiêm túc quy định đeo bảng tên nhân viên',
      contentSections: [
        {
          heading: '1. Mục đích & Phạm vi',
          paragraphs: [
            'Nhằm xây dựng hình ảnh chuyên nghiệp, tăng tính nhận diện thương hiệu và thuận tiện trong giao tiếp nội bộ cũng như với khách hàng, đối tác.',
            'Quy định áp dụng đối với toàn thể cán bộ công nhân viên trên toàn hệ thống kể từ ngày 09/04/2025.'
          ]
        },
        {
          heading: '2. Quy cách đeo chuẩn',
          paragraphs: [
            '- Vị trí: Đeo bên ngực trái của áo.',
            '- Nhân viên: Đeo ngay ngắn phía trên logo công ty khoảng 1 cm.',
            '- Cấp quản lý (khi mặc vest): Đeo trên ve áo vest bên trái.',
            '- Yêu cầu: Bảng tên phải giữ sạch đẹp, không bị che khuất bởi dây đeo thẻ hoặc phụ kiện khác.'
          ]
        },
        {
          heading: '3. Hỗ trợ cấp phát',
          paragraphs: [
            '- Trường hợp nhân viên mới chưa có bảng tên hoặc nhân viên bị mất/hư hỏng, vui lòng liên hệ Bộ phận Nhân sự để được hướng dẫn thủ tục cấp lại.'
          ]
        }
      ]
    }
  },

  // 4. POL-ATT-02
  {
    id: 'POL-ATT-02',
    code: 'POL-ATT-02',
    title: 'Quy định kiểm soát & hạn mức làm thêm giờ (OT)',
    titleEn: 'Overtime Policy & Threshold Control Regulations',
    summary:
      'Quy định về trần hạn mức làm thêm giờ (4h/ngày, 40h/tháng, 200h/năm), thời hạn đăng ký OT đột xuất trong 12h và cơ chế tự động chặn đơn vượt trần.',
    summaryEn:
      'Strict control policy on overtime caps (max 4h/day, 40h/month, 200h/year), 12-hour urgent registration window, and system-level hard limits.',
    category: 'overtime',
    type: 'system-rule',
    status: 'active',
    severity: 'critical',
    effectiveFrom: '2025-01-01',
    issuingDepartment: 'Ban Quản trị Nhân sự & Tiền lương (C&B)',
    applicableAudience: 'Toàn bộ nhân viên thuộc đối tượng tính làm thêm giờ',
    version: '2.5',
    lastUpdated: '2025-01-20',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi đã nắm rõ trần hạn mức làm thêm giờ và quy định nộp đơn OT đột xuất.',
    tags: ['Tăng ca', 'OT', 'Hạn mức', '40 giờ/tháng', '200 giờ/năm', 'C&B', 'Chặn hệ thống'],
    relatedProcessCodes: ['CF-01'],
    relatedSopCodes: ['SOP-ATT-02', 'SOP-CF-02'],
    responsibilities: {
      employee: [
        'Đăng ký kế hoạch OT trước khi làm thêm giờ hoặc gửi phiếu đăng ký OT đột xuất trong vòng 12 giờ.',
        'Tuân thủ tuyệt đối việc quẹt thẻ Check-in / Check-out thực tế khớp với khung giờ tăng ca.',
        'Không tự ý làm thêm giờ khi chưa có sự phân công hoặc phê duyệt của cấp Quản lý.'
      ],
      manager: [
        'Cân đối khối lượng công việc, chỉ phân công làm thêm giờ khi thực sự có nhu cầu sản xuất kinh doanh.',
        'Kiểm soát tổng quỹ giờ OT của bộ phận không vượt quá trần quy định của công ty và pháp luật.'
      ]
    },
    rules: [
      {
        id: 'RULE-OT-01',
        label: 'Hạn mức OT tối đa trong ngày',
        description: 'Tổng số giờ làm thêm trong 01 ngày làm việc không được vượt quá 04 giờ.',
        condition: 'Tổng giờ OT đăng ký trong ngày',
        outcome: 'Tối đa 4 giờ/ngày (Hệ thống chặn nếu vượt)',
        unit: 'giờ/ngày',
        value: 4,
        ruleKind: 'limit'
      },
      {
        id: 'RULE-OT-02',
        label: 'Hạn mức OT tối đa trong tháng',
        description: 'Tổng số giờ làm thêm tích lũy trong 01 tháng không được vượt quá 40 giờ.',
        condition: 'Tổng giờ OT tích lũy trong tháng',
        outcome: 'Tối đa 40 giờ/tháng (Hệ thống chặn nếu vượt)',
        unit: 'giờ/tháng',
        value: 40,
        ruleKind: 'limit'
      },
      {
        id: 'RULE-OT-03',
        label: 'Hạn mức OT tối đa trong năm',
        description: 'Tổng số giờ làm thêm tích lũy trong 01 năm dương lịch không được vượt quá 200 giờ (trừ các trường hợp đặc thù theo luật định).',
        condition: 'Tổng giờ OT tích lũy trong năm',
        outcome: 'Tối đa 200 giờ/năm (Hệ thống chặn nếu vượt)',
        unit: 'giờ/năm',
        value: 200,
        ruleKind: 'limit'
      },
      {
        id: 'RULE-OT-04',
        label: 'Thời hạn tạo đơn OT đột xuất',
        description: 'Đối với tăng ca phát sinh đột xuất, đơn phải được tạo trên HRMS trong vòng 12 giờ kể từ thời điểm phát sinh.',
        condition: 'OT đột xuất / phát sinh ngoài kế hoạch',
        outcome: 'Nộp đơn trong vòng 12 giờ',
        unit: 'giờ',
        value: 12,
        ruleKind: 'deadline'
      },
      {
        id: 'RULE-OT-05',
        label: 'Giới hạn số lần nộp đơn OT trễ trong tháng',
        description: 'Mỗi nhân viên chỉ được tạo tối đa 03 lần đơn OT đột xuất/nộp trễ trong một tháng dương lịch.',
        condition: 'Đơn OT đột xuất trong tháng',
        outcome: 'Tối đa 3 lần/tháng',
        unit: 'lần/tháng',
        value: 3,
        ruleKind: 'limit'
      },
      {
        id: 'RULE-OT-06',
        label: 'Bắt buộc quẹt thẻ chấm công thực tế',
        description: 'Dữ liệu tính công OT bắt buộc phải có đối soát với dữ liệu quẹt thẻ thực tế Check-in / Check-out trên máy chấm công.',
        condition: 'Tính lương làm thêm giờ',
        outcome: 'So khớp log chấm công thực tế',
        ruleKind: 'validation'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Lập kế hoạch & Tạo đơn OT',
        description: 'Nhân viên hoặc Quản lý ca tạo phiếu đăng ký làm thêm giờ, nhập khung giờ bắt đầu và kết thúc.',
        actor: 'Nhân viên / Quản lý',
        systemAction: 'Hệ thống tự động kiểm tra trần hạn mức ngày, tháng, năm'
      },
      {
        stepNumber: 2,
        title: 'Hệ thống kiểm soát hạn mức (Auto-Gate)',
        description: 'Hệ thống từ chối cho phép nộp đơn nếu các chỉ số vượt 4h/ngày, 40h/tháng hoặc 200h/năm.',
        actor: 'Hệ thống HRMS',
        systemAction: 'Cảnh báo vi phạm trần hạn mức và chặn hành động'
      },
      {
        stepNumber: 3,
        title: 'Phê duyệt của Quản lý & Giám đốc Khối',
        description: 'Quản lý trực tiếp thẩm định lý do và phê duyệt phiếu tăng ca.',
        actor: 'Cấp Quản lý',
        systemAction: 'Xác nhận kế hoạch làm thêm giờ vào ca làm việc'
      },
      {
        stepNumber: 4,
        title: 'Đối soát chấm công & Tính hệ số',
        description: 'Sau khi hoàn thành ca, hệ thống đối soát giờ quẹt thẻ thực tế và tính công OT theo hệ số (150%, 200%, 300%).',
        actor: 'Timekeeper Engine',
        systemAction: 'Tổng hợp số liệu chuyển sang bảng lương kỳ'
      }
    ],
    consequences: [
      {
        id: 'CQ-OT-01',
        type: 'system-block',
        title: 'Hệ thống tự động chặn đơn vượt trần',
        description: 'Hệ thống khóa chức năng gửi đơn nếu số giờ OT vượt quá 4h/ngày, 40h/tháng, 200h/năm hoặc nộp trễ quá 12 giờ đối với OT đột xuất.',
        severity: 'high'
      },
      {
        id: 'CQ-OT-02',
        type: 'disciplinary-info',
        title: 'Không thanh toán giờ OT chưa được duyệt',
        description: 'Các khoảng thời gian làm thêm không có đơn phê duyệt hợp lệ hoặc không có dữ liệu quẹt thẻ đối soát sẽ không được tính toán chi trả lương tăng ca trong demo.',
        severity: 'medium'
      }
    ],
    originalNotice: {
      noticeNumber: 'QĐ-CB/2025/08-OT',
      issuedDate: '2025-01-01',
      subject: 'Quy định về trần hạn mức và quy trình kiểm soát thời gian làm thêm giờ (Overtime)',
      contentSections: [
        {
          heading: '1. Hạn mức làm thêm giờ',
          paragraphs: [
            '- Tối đa không quá 04 giờ trong 01 ngày làm việc bình thường.',
            '- Tổng thời gian làm thêm không quá 40 giờ trong 01 tháng.',
            '- Tổng thời gian làm thêm không quá 200 giờ trong 01 năm dương lịch.'
          ]
        },
        {
          heading: '2. Quy tắc đăng ký và phê duyệt',
          paragraphs: [
            '- Làm thêm giờ có kế hoạch: Phải đăng ký và được duyệt trước 17h00 của ngày làm việc.',
            '- Làm thêm giờ đột xuất: Bắt buộc tạo đơn trên HRMS trong vòng 12 giờ kể từ thời điểm phát sinh. Giới hạn tối đa 03 lần tạo đơn trễ trong tháng.'
          ]
        },
        {
          heading: '3. Kiểm soát công nghệ trên HRMS',
          paragraphs: [
            '- Hệ thống được cài đặt khóa cứng tự động màng lọc ngăn chặn các đơn vi phạm trần hạn mức nhằm đảm bảo tuân thủ sức khỏe người lao động và luật lao động.'
          ]
        }
      ]
    }
  },

  // 5. POL-ATT-03
  {
    id: 'POL-ATT-03',
    code: 'POL-ATT-03',
    title: 'Quy định quản lý đi trễ, về sớm & điểm tham chiếu KPI',
    titleEn: 'Tardiness & Early Departure Regulation & KPI Reference',
    summary:
      'Quy định về thủ tục xin phép đi trễ/về sớm, hạn mức số lần trong tháng và bảng tính điểm trừ KPI tham chiếu theo số phút phát sinh.',
    summaryEn:
      'Standard attendance policy governing pre-approved tardiness, monthly frequency allowances, and progressive KPI reference deduction levels.',
    category: 'attendance-leave',
    type: 'system-rule',
    status: 'active',
    severity: 'warning',
    effectiveFrom: '2025-04-01',
    issuingDepartment: 'Ban Quản trị Nhân sự & Vận hành',
    applicableAudience: 'Toàn bộ nhân viên làm việc theo ca hoặc giờ hành chính chuẩn',
    version: '2.0',
    lastUpdated: '2025-03-25',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi đã hiểu quy định tạo đơn đi trễ/về sớm và bảng tham chiếu mức điểm KPI demo.',
    tags: ['Đi trễ', 'Về sớm', 'Chấm công', 'KPI', 'Kỷ luật', 'CF-01'],
    relatedProcessCodes: ['CF-01'],
    relatedSopCodes: ['SOP-ATT-03', 'SOP-CF-03'],
    responsibilities: {
      employee: [
        'Tạo đơn xin phép đi trễ hoặc về sớm và gửi phê duyệt trước giờ quy định của ca làm việc.',
        'Thực hiện quẹt thẻ chấm công thực tế tại thời điểm đến hoặc rời khỏi nơi làm việc.',
        'Hạn chế tối đa việc đi trễ về sớm để đảm bảo hiệu suất và tiến độ công việc chung.'
      ],
      manager: [
        'Xem xét lý do và phê duyệt đơn xin phép đi trễ/về sớm của nhân viên trước thời điểm phát sinh.',
        'Theo dõi báo cáo chuyên cần của phòng ban để có giải pháp hỗ trợ kịp thời.'
      ]
    },
    rules: [
      {
        id: 'RULE-LATE-01',
        label: 'Tạo đơn và được phê duyệt trước',
        description: 'Mọi trường hợp đi trễ hoặc về sớm phải có đơn xin phép gửi và được Quản lý duyệt trước trên phần mềm.',
        condition: 'Phát sinh nhu cầu đi trễ / về sớm',
        outcome: 'Đơn được duyệt trước thời điểm bắt đầu/kết thúc ca',
        ruleKind: 'approval'
      },
      {
        id: 'RULE-LATE-02',
        label: 'Giới hạn số lần có đơn trong tháng',
        description: 'Mỗi nhân viên được phép tạo tối đa 01 đơn đi trễ/về sớm có phép trong một tháng.',
        condition: 'Số đơn đi trễ / về sớm trong tháng',
        outcome: 'Tối đa 1 lần/tháng',
        unit: 'lần/tháng',
        value: 1,
        ruleKind: 'limit'
      },
      {
        id: 'RULE-LATE-03',
        label: 'Vẫn phải chấm công thực tế',
        description: 'Dù có đơn xin phép, nhân viên vẫn bắt buộc phải quẹt thẻ chấm công khi đến hoặc về để ghi nhận giờ thực tế.',
        condition: 'Thời điểm đến và rời văn phòng',
        outcome: 'Bắt buộc quẹt thẻ chấm công',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-LATE-04',
        label: 'Khung thời gian 0 – 10 phút',
        description: 'Đi trễ hoặc về sớm từ 0 đến 10 phút: Mức tham chiếu 1 điểm KPI.',
        condition: 'Thời gian từ 0 đến 10 phút',
        outcome: 'Mức tham chiếu 1 điểm KPI',
        unit: 'điểm',
        value: 1,
        ruleKind: 'penalty'
      },
      {
        id: 'RULE-LATE-05',
        label: 'Khung thời gian trên 10 – 30 phút',
        description: 'Đi trễ hoặc về sớm trên 10 đến 30 phút: Mức tham chiếu 2 điểm KPI.',
        condition: 'Thời gian trên 10 đến 30 phút',
        outcome: 'Mức tham chiếu 2 điểm KPI',
        unit: 'điểm',
        value: 2,
        ruleKind: 'penalty'
      },
      {
        id: 'RULE-LATE-06',
        label: 'Khung thời gian trên 30 – 60 phút',
        description: 'Đi trễ hoặc về sớm trên 30 đến 60 phút: Mức tham chiếu 4 điểm KPI.',
        condition: 'Thời gian trên 30 đến 60 phút',
        outcome: 'Mức tham chiếu 4 điểm KPI',
        unit: 'điểm',
        value: 4,
        ruleKind: 'penalty'
      },
      {
        id: 'RULE-LATE-07',
        label: 'Khung thời gian trên 60 – 120 phút',
        description: 'Đi trễ hoặc về sớm trên 60 đến 120 phút: Mức tham chiếu 6 điểm KPI.',
        condition: 'Thời gian trên 60 đến 120 phút',
        outcome: 'Mức tham chiếu 6 điểm KPI',
        unit: 'điểm',
        value: 6,
        ruleKind: 'penalty'
      },
      {
        id: 'RULE-LATE-08',
        label: 'Khung thời gian trên 120 phút',
        description: 'Đi trễ hoặc về sớm trên 120 phút: Có thể được xem là nghỉ không phép theo quy định demo.',
        condition: 'Thời gian phát sinh > 120 phút',
        outcome: 'Cảnh báo nguy cơ tính nghỉ không phép',
        ruleKind: 'penalty'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Tạo đơn xin đi trễ / về sớm',
        description: 'Nhân viên chọn ca làm việc, nhập số phút dự kiến trễ/sớm và nêu rõ lý do phát sinh.',
        actor: 'Nhân viên',
        systemAction: 'Kiểm tra hạn mức số lần trong tháng'
      },
      {
        stepNumber: 2,
        title: 'Quản lý phê duyệt trước',
        description: 'Quản lý nhận thông báo tức thì và thực hiện xem xét phê duyệt.',
        actor: 'Quản lý trực tiếp',
        systemAction: 'Ghi nhận trạng thái đơn đã duyệt'
      },
      {
        stepNumber: 3,
        title: 'Chấm công thực tế tại cổng',
        description: 'Nhân viên thực hiện quẹt thẻ khi đến/về.',
        actor: 'Nhân viên',
        systemAction: 'Ghi nhận thời gian thực tế và so khớp với đơn đã duyệt'
      },
      {
        stepNumber: 4,
        title: 'Tổng hợp mức tham chiếu định kỳ',
        description: 'Hệ thống tự động tổng hợp số phút phát sinh vào báo cáo chuyên cần định kỳ.',
        actor: 'Timekeeper Engine',
        systemAction: 'Tính mức điểm tham chiếu phục vụ báo cáo quản trị'
      }
    ],
    consequences: [
      {
        id: 'CQ-LATE-01',
        type: 'verification-required',
        title: 'Cần giải trình khi không có đơn duyệt trước',
        description: 'Trường hợp quẹt thẻ trễ/sớm mà chưa có đơn duyệt trước, bản ghi công sẽ được đánh dấu "Cần xác minh" và yêu cầu bổ sung giải trình.',
        severity: 'medium'
      },
      {
        id: 'CQ-LATE-02',
        type: 'disciplinary-info',
        title: 'Mức điểm tham chiếu theo quy định demo',
        description: 'Mức điểm trừ KPI chỉ mang tính chất tham chiếu theo quy tắc trong bản demo, không thay thế quyết định đánh giá nhân sự chính thức.',
        severity: 'low'
      }
    ],
    originalNotice: {
      noticeNumber: 'QĐ-ATT/2025/04-LC',
      issuedDate: '2025-04-01',
      subject: 'Quy định quản lý kỷ luật thời gian làm việc, thủ tục đi trễ về sớm và thang điểm tham chiếu',
      contentSections: [
        {
          heading: '1. Quy tắc tuân thủ giờ làm việc',
          paragraphs: [
            '- Toàn thể CBNV có nghĩa vụ tuân thủ đúng giờ giấc làm việc đã được phân công theo lịch ca.',
            '- Mọi trường hợp đến muộn hoặc về sớm vì lý do cá nhân đều phải tạo đơn xin phép trước.'
          ]
        },
        {
          heading: '2. Thang điểm tham chiếu KPI demo',
          paragraphs: [
            '- Dưới 10 phút: 1 điểm.',
            '- Từ trên 10 đến 30 phút: 2 điểm.',
            '- Từ trên 30 đến 60 phút: 4 điểm.',
            '- Từ trên 60 đến 120 phút: 6 điểm.',
            '- Trên 120 phút: Có thể được xem là nghỉ không phép theo quy định demo.'
          ]
        },
        {
          heading: '3. Lưu ý quản trị',
          paragraphs: [
            '- Số liệu trên được hệ thống tổng hợp tự động làm dữ liệu đầu vào phục vụ công tác quản lý chuyên cần của bộ phận.'
          ]
        }
      ]
    }
  },

  // 6. POL-ATT-04
  {
    id: 'POL-ATT-04',
    code: 'POL-ATT-04',
    title: 'Quy định tiêu chuẩn hình ảnh chấm công & nhận diện hiện trường',
    titleEn: 'Attendance Photo Standards & Field Verification Policy',
    summary:
      'Quy định tiêu chuẩn về hình ảnh chụp khi chấm công: rõ mặt, đúng đồng phục, mũ bảo hộ GPG cho nhân viên hiện trường, bảng tên và vị trí hợp lệ.',
    summaryEn:
      'Attendance photo compliance rules requiring clear face visibility, proper uniform, GPG safety helmets for field staff, name badges, and designated GPS locations.',
    category: 'attendance-leave',
    type: 'internal-regulation',
    status: 'active',
    severity: 'warning',
    effectiveFrom: '2025-01-01',
    issuingDepartment: 'Ban Giám sát Vận hành & An toàn Lao động',
    applicableAudience: 'Toàn bộ nhân viên chấm công qua thiết bị di động / Camera nhận diện',
    version: '1.4',
    lastUpdated: '2025-01-08',
    requiresAcknowledgement: true,
    acknowledgementLabel: 'Tôi cam kết thực hiện chấm công đúng hình ảnh, đúng vị trí và đầy đủ bảo hộ lao động.',
    tags: ['Chấm công', 'Hình ảnh', 'Đồng phục', 'Bảo hộ GPG', 'Hiện trường', 'Xác minh'],
    relatedProcessCodes: ['CF-01'],
    relatedSopCodes: ['SOP-ATT-01'],
    responsibilities: {
      employee: [
        'Chụp ảnh chân dung rõ mặt, ánh sáng đầy đủ khi thực hiện Check-in / Check-out trên ứng dụng.',
        'Mặc đúng trang phục quy định; nhân viên hiện trường/dự án bắt buộc phải đội mũ bảo hộ GPG và đeo thẻ/bảng tên.',
        'Chụp ảnh tại đúng tọa độ vị trí làm việc được phân công.'
      ],
      manager: [
        'Kiểm tra định kỳ tính trung thực của hình ảnh chấm công của nhân viên trực thuộc.',
        'Xử lý các bản ghi chấm công có trạng thái "Cần xác minh".'
      ]
    },
    rules: [
      {
        id: 'RULE-PHOTO-01',
        label: 'Nhìn rõ khuôn mặt',
        description: 'Ảnh chụp phải nhìn rõ khuôn mặt trực diện, không bị che khuất bởi kính râm hoặc khẩu trang kín khi quẹt thẻ.',
        condition: 'Chấm công khuôn mặt',
        outcome: 'Rõ nét, đủ ánh sáng, trực diện',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-PHOTO-02',
        label: 'Trang phục & Đồng phục công ty',
        description: 'Phải mặc đúng trang phục hoặc áo đồng phục công ty theo quy định của từng vị trí.',
        condition: 'Thời điểm chấm công',
        outcome: 'Đúng quy chuẩn đồng phục',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-PHOTO-03',
        label: 'Mũ bảo hộ GPG đối với nhân viên hiện trường',
        description: 'Nhân viên làm việc tại công trường, hiện trường hoặc nhà máy bắt buộc phải đội mũ bảo hộ GPG trong ảnh chấm công.',
        condition: 'Nhân viên công trường / hiện trường / nhà xưởng',
        outcome: 'Đội mũ bảo hộ lao động GPG',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-PHOTO-04',
        label: 'Hiển thị bảng tên hoặc thẻ đeo',
        description: 'Ảnh chụp cần nhận diện thấy bảng tên hoặc thẻ nhân viên đeo đúng vị trí.',
        condition: 'Ảnh quẹt thẻ điểm danh',
        outcome: 'Thấy rõ bảng tên / thẻ nhân viên',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-PHOTO-05',
        label: 'Đúng vị trí và thời gian quy định',
        description: 'Tọa độ GPS và thời gian trên ảnh phải khớp với địa điểm làm việc đã được phân công.',
        condition: 'Dữ liệu GPS & Timestamp',
        outcome: 'Trong bán kính Geofencing cho phép',
        ruleKind: 'validation'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Mở ứng dụng & Chuẩn bị tác phong',
        description: 'Nhân viên mở app HRMS, chỉnh trang trang phục, đội mũ bảo hộ GPG (nếu ở hiện trường) và đeo bảng tên.',
        actor: 'Nhân viên',
        systemAction: 'Kiểm tra tín hiệu GPS và kết nối camera'
      },
      {
        stepNumber: 2,
        title: 'Chụp ảnh Check-in / Check-out',
        description: 'Giữ camera thẳng khuôn mặt và thực hiện bấm chụp xác thực.',
        actor: 'Nhân viên',
        systemAction: 'Ghi nhận ảnh kèm dữ liệu thời gian và tọa độ vị trí'
      },
      {
        stepNumber: 3,
        title: 'Đối soát & Phân loại trạng thái',
        description: 'Hệ thống đối chiếu dữ liệu vị trí và lưu trữ hình ảnh; đánh dấu trạng thái "Hợp lệ" hoặc "Cần xác minh".',
        actor: 'Hệ thống HRMS',
        systemAction: 'Cập nhật trạng thái chấm công vào bảng công nhật ký'
      },
      {
        stepNumber: 4,
        title: 'Hậu kiểm xác minh (Nếu cần)',
        description: 'Quản lý hoặc Giám sát vận hành rà soát các bản ghi có cờ "Cần xác minh".',
        actor: 'Quản lý vận hành',
        systemAction: 'Xác nhận hợp lệ hoặc yêu cầu giải trình'
      }
    ],
    consequences: [
      {
        id: 'CQ-PHOTO-01',
        type: 'verification-required',
        title: 'Trạng thái "Cần xác minh"',
        description: 'Ảnh chụp bị mờ, không đúng vị trí hoặc chưa đầy đủ trang phục bảo hộ sẽ được hệ thống gắn nhãn "Cần xác minh" để Quản lý kiểm tra lại.',
        severity: 'medium'
      },
      {
        id: 'CQ-PHOTO-02',
        type: 'disciplinary-info',
        title: 'Lưu ý về công nghệ nhận diện',
        description: 'Hệ thống ghi nhận hình ảnh làm căn cứ lưu trữ và hậu kiểm; không tự động đưa ra kết luận kỷ luật trong phạm vi bản demo.',
        severity: 'low'
      }
    ],
    originalNotice: {
      noticeNumber: 'TB-GSVH/2025/03-CC',
      issuedDate: '2025-01-01',
      subject: 'Hướng dẫn tiêu chuẩn hình ảnh chấm công và an toàn lao động hiện trường',
      contentSections: [
        {
          heading: '1. Tiêu chuẩn hình ảnh hợp lệ',
          paragraphs: [
            '- Ảnh chụp rõ khuôn mặt, không đeo khẩu trang che kín mặt khi thao tác.',
            '- Nhân viên văn phòng: Mặc đồng phục hoặc trang phục công sở lịch sự.',
            '- Nhân viên hiện trường: Bắt buộc đội mũ bảo hộ GPG và trang bị đầy đủ bảo hộ lao động theo quy định.'
          ]
        },
        {
          heading: '2. Quy trình xử lý ngoại lệ',
          paragraphs: [
            '- Các trường hợp phát sinh lỗi kỹ thuật, vị trí ngoài bán kính hoặc hình ảnh không rõ nét sẽ được chuyển sang danh sách hậu kiểm xác minh của Quản lý bộ phận.'
          ]
        }
      ]
    }
  },

  // 7. COM-INT-01
  {
    id: 'COM-INT-01',
    code: 'COM-INT-01',
    title: 'Hướng dẫn cài đặt nhạc chờ doanh nghiệp (Ringback Tone)',
    titleEn: 'Corporate Ringback Tone Installation Guideline',
    summary:
      'Tài liệu hướng dẫn cán bộ nhân viên cài đặt bài hát truyền thống doanh nghiệp làm nhạc chờ trên các mạng di động Viettel, Vinaphone và Mobifone.',
    summaryEn:
      'Internal communication guideline detailing SMS syntax to set up the official corporate anthem as mobile ringback tone across Viettel, Vinaphone, and Mobifone networks.',
    category: 'internal-communications',
    type: 'communication',
    status: 'active',
    severity: 'info',
    effectiveFrom: '2025-01-01',
    issuingDepartment: 'Phòng Truyền thông & Văn hóa Doanh nghiệp',
    applicableAudience: 'Khuyến khích toàn thể Cán bộ - Nhân viên tham gia',
    version: '1.0',
    lastUpdated: '2025-01-05',
    requiresAcknowledgement: false,
    tags: ['Nhạc chờ', 'Truyền thông', 'Văn hóa doanh nghiệp', 'Viettel', 'Vinaphone', 'Mobifone', 'Khuyến nghị'],
    relatedProcessCodes: ['LIFE-01'],
    relatedSopCodes: ['SOP-REC-01'],
    responsibilities: {
      employee: [
        'Tùy chọn đăng ký nhạc chờ theo cú pháp của từng nhà mạng để lan tỏa văn hóa doanh nghiệp khi giao tiếp với khách hàng, đối tác.',
        'Lưu ý cước phí dịch vụ nhạc chờ hàng tháng phụ thuộc vào biểu phí quy định của từng nhà mạng viễn thông.'
      ]
    },
    rules: [
      {
        id: 'RULE-COM-01',
        label: 'Cú pháp mạng Viettel',
        description: 'Mã bài hát: 8252238. Soạn tin: Y BH 8252238 gửi 1221.',
        condition: 'Thuê bao di động mạng Viettel',
        outcome: 'Cú pháp: Y BH 8252238 gửi 1221',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-COM-02',
        label: 'Cú pháp mạng Vinaphone',
        description: 'Đăng ký dịch vụ: DK gửi 9194. Tải bài: TAI 9900123 gửi 9194 (hoặc 9907254). Phát luân phiên: NN gửi 9194.',
        condition: 'Thuê bao di động mạng Vinaphone',
        outcome: 'Mã bài 1: 9900123 / Mã bài 2: 9907254',
        ruleKind: 'validation'
      },
      {
        id: 'RULE-COM-03',
        label: 'Cú pháp mạng Mobifone',
        description: 'Đăng ký dịch vụ: DK gửi 9224. Chọn bài: CHON 666277 gửi 9224 (hoặc 6661682).',
        condition: 'Thuê bao di động mạng Mobifone',
        outcome: 'Mã bài 1: 666277 / Mã bài 2: 6661682',
        ruleKind: 'validation'
      }
    ],
    procedures: [
      {
        stepNumber: 1,
        title: 'Xác định nhà mạng viễn thông đang dùng',
        description: 'Kiểm tra thuê bao thuộc nhà mạng Viettel, Vinaphone hay Mobifone.',
        actor: 'Nhân viên',
        systemAction: 'Hiển thị cú pháp tương ứng'
      },
      {
        stepNumber: 2,
        title: 'Soạn tin nhắn SMS kích hoạt',
        description: 'Soạn tin nhắn SMS theo đúng cú pháp tương ứng của nhà mạng gửi đến tổng đài nhạc chờ.',
        actor: 'Nhân viên',
        systemAction: 'Thao tác trên điện thoại cá nhân'
      },
      {
        stepNumber: 3,
        title: 'Nhận tin nhắn xác nhận hoàn tất',
        description: 'Nhà mạng gửi SMS phản hồi cài đặt bài hát nhạc chờ doanh nghiệp thành công.',
        actor: 'Nhà mạng',
        systemAction: 'Kích hoạt phát nhạc chờ khi có cuộc gọi đến'
      }
    ],
    consequences: [
      {
        id: 'CQ-COM-01',
        type: 'disciplinary-info',
        title: 'Nội dung khuyến khích & Tự nguyện',
        description: 'Đây là nội dung truyền thông nội bộ mang tính chất khuyến nghị, không phải quy định bắt buộc và không áp dụng bất kỳ hình thức chế tài nào.',
        severity: 'low'
      },
      {
        id: 'CQ-COM-02',
        type: 'disciplinary-info',
        title: 'Lưu ý về cước phí nhà mạng',
        description: 'Cước phí dịch vụ nhạc chờ hàng tháng được trừ trực tiếp vào tài khoản thuê bao di động theo chính sách của từng nhà mạng.',
        severity: 'low'
      }
    ],
    originalNotice: {
      noticeNumber: 'HD-TT/2025/01-NC',
      issuedDate: '2025-01-01',
      subject: 'Hướng dẫn đăng ký bài hát truyền thống công ty làm nhạc chờ điện thoại',
      contentSections: [
        {
          heading: '1. Lời ngỏ',
          paragraphs: [
            'Nhằm lan tỏa nét đẹp văn hóa và niềm tự hào của doanh nghiệp đến khách hàng và đối tác khi liên hệ công tác.',
            'Phòng Truyền thông & Văn hóa Doanh nghiệp trân trọng gửi tới toàn thể Anh/Chị/Em hướng dẫn cài đặt bài hát truyền thống làm nhạc chờ di động.'
          ]
        },
        {
          heading: '2. Chi tiết cú pháp các nhà mạng',
          paragraphs: [
            '- Viettel: Soạn "Y BH 8252238" gửi 1221.',
            '- Vinaphone: Đăng ký "DK" gửi 9194 ➔ Tải bài "TAI 9900123" hoặc "TAI 9907254" gửi 9194 ➔ Bật luân phiên soạn "NN" gửi 9194.',
            '- Mobifone: Đăng ký "DK" gửi 9224 ➔ Chọn bài "CHON 666277" hoặc "CHON 6661682" gửi 9224.'
          ]
        },
        {
          heading: '3. Lưu ý',
          paragraphs: [
            '- Cước phí dịch vụ nhạc chờ phụ thuộc vào biểu giá hiện hành của từng nhà mạng cung cấp dịch vụ.'
          ]
        }
      ]
    }
  }
]
