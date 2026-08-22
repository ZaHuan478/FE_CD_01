export interface WorkflowStory {
  whenToUse: { vi: string; en: string }
  simpleExplain: { vi: string; en: string }
  finalOutcome: { vi: string; en: string }
}

export const WORKFLOW_STORY_DATABASE: Record<string, WorkflowStory> = {
  'LIFE-00': {
    whenToUse: {
      vi: 'Dùng khi bắt đầu năm tài chính hoặc khi phòng ban cần lập kế hoạch tuyển dụng, kiểm soát quỹ lương và trần định biên nhân sự.',
      en: 'Use at fiscal year start or when departments plan hiring, payroll budget, and headcount caps.'
    },
    simpleExplain: {
      vi: 'Trưởng phòng lập kế hoạch cần bao nhiêu người → HR thẩm định → Ban Giám đốc duyệt → Hệ thống khóa hạn mức tuyển dụng.',
      en: 'Dept heads plan headcount → HR validates → BOD approves → System locks hiring limits.'
    },
    finalOutcome: {
      vi: 'Định biên nhân sự chính thức được phê duyệt, làm cơ sở mở yêu cầu tuyển dụng và kiểm soát chi phí.',
      en: 'Approved headcount plan becomes the basis for requisitions and cost control.'
    }
  },
  'LIFE-01': {
    whenToUse: {
      vi: 'Dùng khi ứng viên chấp nhận Offer Letter và sắp đến ngày nhận việc.',
      en: 'Use when a candidate accepts an offer and is about to start work.'
    },
    simpleExplain: {
      vi: 'HR tạo hồ sơ nhân viên, cấp mã NV, gửi yêu cầu IT/Hành chính chuẩn bị và lên lịch hội nhập.',
      en: 'HR creates employee record, assigns ID, triggers IT/admin setup and onboarding schedule.'
    },
    finalOutcome: {
      vi: 'Nhân viên mới có tài khoản Portal, mã nhân viên và lịch hội nhập tuần đầu.',
      en: 'New hire has Portal access, employee ID, and week-one onboarding plan.'
    }
  },
  'LIFE-02': {
    whenToUse: {
      vi: 'Dùng trong 7 ngày đầu sau khi nhận việc, khi nhân viên cần bổ sung hồ sơ pháp lý đầy đủ.',
      en: 'Use within the first 7 days after start when legal profile documents must be completed.'
    },
    simpleExplain: {
      vi: 'Nhân viên khai báo trên Portal → HR đối soát giấy tờ → Duyệt hồ sơ → Đồng bộ sang Thuế & BHXH.',
      en: 'Employee fills Portal → HR verifies documents → Profile approved → Sync to Tax & Insurance.'
    },
    finalOutcome: {
      vi: 'Hồ sơ nhân viên số hóa 100%, sẵn sàng cho bố trí công tác và ký hợp đồng.',
      en: 'Fully digitized employee profile ready for placement and contract signing.'
    }
  },
  'LIFE-03': {
    whenToUse: {
      vi: 'Dùng sau khi hoàn thiện hồ sơ, khi cần gán nhân viên vào phòng ban, chức danh và vị trí trên sơ đồ tổ chức.',
      en: 'Use after profile completion when assigning dept, job title, and org chart position.'
    },
    simpleExplain: {
      vi: 'Trưởng phòng chọn vị trí trong định biên → Gán chức danh & quản lý trực tiếp → HR kích hoạt trên Org Chart.',
      en: 'Manager picks position within quota → Assign title & manager → HR activates on Org Chart.'
    },
    finalOutcome: {
      vi: 'Nhân viên có vị trí công tác chính thức, Cost Center và ca làm việc mặc định.',
      en: 'Employee has official job placement, cost center, and default work shift.'
    }
  },
  'LIFE-04': {
    whenToUse: {
      vi: 'Dùng khi ký hợp đồng thử việc lần đầu hoặc đánh giá thử việc đạt để ký HĐLĐ chính thức.',
      en: 'Use for probation contract signing or converting to permanent contract after passing probation.'
    },
    simpleExplain: {
      vi: 'C&B dự thảo hợp đồng → Nhân viên ký xác nhận → BOD ký phê duyệt → Hệ thống cảnh báo hết hạn.',
      en: 'C&B drafts contract → Employee signs → BOD approves → System sets expiry alerts.'
    },
    finalOutcome: {
      vi: 'Hợp đồng lao động có hiệu lực pháp lý và danh sách báo tăng BHXH được kích hoạt.',
      en: 'Legally effective labor contract and insurance enrollment list activated.'
    }
  },
  'LIFE-05': {
    whenToUse: {
      vi: 'Dùng khi thiết lập lương, phụ cấp và chế độ bảo hiểm cho nhân viên mới hoặc khi điều chỉnh thu nhập.',
      en: 'Use when setting salary, allowances, and insurance for new hires or compensation changes.'
    },
    simpleExplain: {
      vi: 'C&B cấu hình ngạch bậc lương → Gán phụ cấp → Kiểm tra trần ngân sách → Báo tăng BHXH.',
      en: 'C&B sets pay grade → Assigns allowances → Checks budget cap → Reports insurance increase.'
    },
    finalOutcome: {
      vi: 'Bảng lương và mức đóng BHXH chính thức, sẵn sàng cho kỳ tính lương.',
      en: 'Official payroll and insurance contribution rates ready for pay run.'
    }
  },
  'LIFE-06': {
    whenToUse: {
      vi: 'Dùng hàng ngày cho chấm công, nghỉ phép, tăng ca và các biến động trong quá trình làm việc.',
      en: 'Use daily for attendance, leave, overtime, and in-service personnel changes.'
    },
    simpleExplain: {
      vi: 'Nhân viên chấm công/nộp đơn → Quản lý duyệt → Hệ thống tự kiểm tra quy tắc → Cập nhật bảng lương.',
      en: 'Employee clocks in/submits request → Manager approves → System validates rules → Updates payroll.'
    },
    finalOutcome: {
      vi: 'Dữ liệu chấm công và phúc lợi được ghi nhận chính xác cho kỳ lương.',
      en: 'Attendance and benefits data accurately recorded for payroll period.'
    }
  },
  'LIFE-07': {
    whenToUse: {
      vi: 'Dùng khi nhân viên nghỉ việc, cần bàn giao công việc, thu hồi tài sản và quyết toán lương/BHXH.',
      en: 'Use when an employee resigns and handover, asset return, and final settlement are needed.'
    },
    simpleExplain: {
      vi: 'Nộp đơn thôi việc → Bàn giao & thu hồi tài sản → Quyết toán lương phép → Báo giảm BHXH → Đóng hồ sơ.',
      en: 'Submit resignation → Handover & asset return → Leave settlement → Insurance decrease → Close file.'
    },
    finalOutcome: {
      vi: 'Hồ sơ nhân viên đóng hoàn tất, báo giảm BHXH và quyết toán cuối cùng được lưu vết.',
      en: 'Employee file closed with insurance decrease and final settlement recorded.'
    }
  }
}
