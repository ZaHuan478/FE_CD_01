import React from 'react'
import { ArrowRight, Link2, CheckCircle2, FileQuestion } from 'lucide-react'
import type { LifecycleStep } from '../../../../types/employee-lifecycle'
import type { ModuleInfo } from '../types'

interface LifecycleStepDetailCanvasProps {
  activeStep: LifecycleStep
  activeModInfo: ModuleInfo
  currentStepIdx: number
  totalSteps: number
  onPrevStep: () => void
  onNextStep: () => void
  onOpenSopDetail: (stepId: string) => void
}

interface StepDetailContent {
  title: string
  description: string
  prerequisites: string[]
  deliverables: string[]
  relatedSystems: string[]
}

const STEP_DETAILS_MAP: Record<string, StepDetailContent> = {
  'LIFE-00': {
    title: 'Thiết lập định biên nhân sự',
    description: 'Hoạch định số lượng nhân sự, ngân sách quỹ lương và chỉ tiêu tuyển dụng cho từng phòng ban theo năm.',
    prerequisites: [
      'Kế hoạch sản xuất kinh doanh năm',
      'Cơ cấu tổ chức & chức danh chuẩn',
      'Ngân sách quỹ lương dự kiến (People Cost)',
      'Tỷ lệ biến động nhân sự năm trước'
    ],
    deliverables: [
      'Bản định biên nhân sự được phê duyệt',
      'Hạn mức tuyển dụng cho từng bộ phận',
      'Khung ngân sách lương theo phòng ban'
    ],
    relatedSystems: [
      'Cơ cấu tổ chức (Org Chart)',
      'Quản lý quỹ lương & Chi phí',
      'Tuyển dụng nhân sự'
    ]
  },
  'LIFE-01': {
    title: 'Tiếp nhận nhân viên mới',
    description: 'Tiếp nhận ứng viên trúng tuyển, khởi tạo mã nhân viên, cấp tài khoản và chuẩn bị trang thiết bị làm việc.',
    prerequisites: [
      'Thư mời nhận việc (Offer Letter) đã xác nhận',
      'Thông tin trúng tuyển từ Tuyển dụng',
      'Phiếu yêu cầu cấp phát thiết bị & tài khoản',
      'Ngày bắt đầu nhận việc chính thức'
    ],
    deliverables: [
      'Mã nhân viên (Employee ID) chính thức',
      'Tài khoản làm việc & Email công ty',
      'Biên bản bàn giao trang thiết bị ban đầu',
      'Kích hoạt kế hoạch thử việc'
    ],
    relatedSystems: [
      'Tuyển dụng nhân sự',
      'Hồ sơ nhân sự (Core EMP)',
      'Hành chính & Kỹ thuật IT'
    ]
  },
  'LIFE-02': {
    title: 'Tạo và hoàn thiện hồ sơ nhân viên',
    description: 'Thu thập, số hóa và lưu trữ đầy đủ hồ sơ lý lịch, giấy tờ pháp lý, người phụ thuộc và thông tin tài khoản ngân hàng.',
    prerequisites: [
      'Căn cước công dân / Hộ chiếu',
      'Sơ yếu lý lịch & Bằng cấp, chứng chỉ',
      'Hồ sơ người phụ thuộc giảm trừ gia cảnh',
      'Số tài khoản ngân hàng nhận lương'
    ],
    deliverables: [
      'Hồ sơ nhân sự số hóa hoàn chỉnh',
      'Mã số thuế thu nhập cá nhân',
      'Danh sách người phụ thuộc hợp lệ',
      'Thông tin chi trả lương đã xác thực'
    ],
    relatedSystems: [
      'Hồ sơ nhân sự (Core EMP)',
      'Khai báo thuế thu nhập cá nhân',
      'Lưu trữ tài liệu số'
    ]
  },
  'LIFE-03': {
    title: 'Bố trí công tác và vị trí',
    description: 'Gán nhân viên vào sơ đồ tổ chức, xác định phòng ban trực thuộc, chức vụ quản lý, tuyến báo cáo và địa điểm làm việc.',
    prerequisites: [
      'Đơn vị / Phòng ban tiếp nhận',
      'Chức danh chuyên môn & Cấp bậc',
      'Tuyến báo cáo & Quản lý trực tiếp',
      'Địa điểm làm việc & Vùng lương'
    ],
    deliverables: [
      'Vị trí công tác chính thức trên sơ đồ tổ chức',
      'Quy định nhóm phụ cấp & chế độ theo vị trí',
      'Phân ca làm việc & đối tượng chấm công',
      'Phân quyền nghiệp vụ trên hệ thống'
    ],
    relatedSystems: [
      'Cơ cấu tổ chức (Org Chart)',
      'Phân hệ Chấm công',
      'Phân hệ Tiền lương & C&B'
    ]
  },
  'LIFE-04': {
    title: 'Thiết lập hợp đồng',
    description: 'Soạn thảo, giao kết và quản lý hợp đồng lao động, theo dõi thời hạn hợp đồng và tự động cảnh báo tái ký.',
    prerequisites: [
      'Loại hợp đồng (Thử việc / Xác định / Không xác định)',
      'Mức lương cơ bản & Phụ cấp theo hợp đồng',
      'Thời hạn và ngày hiệu lực hợp đồng',
      'Mẫu hợp đồng theo quy định pháp luật'
    ],
    deliverables: [
      'Hợp đồng lao động ký kết chính thức',
      'Lịch nhắc cảnh báo trước ngày hết hạn',
      'Danh sách đăng ký tham gia Bảo hiểm xã hội'
    ],
    relatedSystems: [
      'Quản lý hợp đồng & Pháp lý',
      'Bảo hiểm xã hội',
      'Chữ ký số & Ký duyệt'
    ]
  },
  'LIFE-05': {
    title: 'Cấu hình lương và chế độ',
    description: 'Thiết lập ngạch bậc lương, các khoản phụ cấp chức vụ, biểu mẫu tính thuế và thủ tục đóng nộp BHXH, BHYT, BHTN.',
    prerequisites: [
      'Hợp đồng lao động đã ký kết',
      'Bảng ngạch bậc lương doanh nghiệp',
      'Danh mục phụ cấp được phê duyệt',
      'Mã số BHXH & Nơi đăng ký khám chữa bệnh'
    ],
    deliverables: [
      'Hồ sơ cấu hình lương cá nhân sẵn sàng tính lương',
      'Hồ sơ tham gia BHXH / BHYT / BHTN',
      'Biểu mẫu khấu trừ thuế thu nhập cá nhân'
    ],
    relatedSystems: [
      'Phân hệ Tiền lương & Thu nhập',
      'Hồ sơ Bảo hiểm xã hội',
      'Hệ thống Ngân hàng chi trả'
    ]
  },
  'LIFE-06': {
    title: 'Quá trình làm việc và biến động',
    description: 'Theo dõi toàn bộ lịch sử công tác, ghi nhận biến động điều chuyển, thăng tiến, tăng lương, ngày công và khen thưởng kỷ luật.',
    prerequisites: [
      'Quyết định điều chuyển / Bổ nhiệm / Tăng lương',
      'Dữ liệu chấm công & Nghỉ phép hàng tháng',
      'Kết quả đánh giá hiệu suất (KPI / OKR)'
    ],
    deliverables: [
      'Sổ theo dõi lịch sử quá trình làm việc',
      'Dữ liệu tổng hợp công và phép lũy kế',
      'Báo cáo biến động nhân sự định kỳ'
    ],
    relatedSystems: [
      'Phân hệ Chấm công & Nghỉ phép',
      'Đánh giá hiệu suất & Khen thưởng',
      'Báo cáo quản trị nhân sự'
    ]
  },
  'LIFE-07': {
    title: 'Nghỉ việc, bàn giao và đóng hồ sơ',
    description: 'Tiếp nhận yêu cầu thôi việc, kiểm soát bàn giao tài sản và công việc, quyết toán lương trợ cấp, báo giảm BHXH và lưu trữ hồ sơ.',
    prerequisites: [
      'Đơn xin thôi việc / Quyết định chấm dứt HĐLĐ',
      'Biên bản bàn giao công việc & tài sản thiết bị',
      'Xác nhận công nợ và tạm ứng (nếu có)'
    ],
    deliverables: [
      'Quyết định thôi việc chính thức',
      'Bảng quyết toán tiền lương & trợ cấp thôi việc',
      'Thủ tục báo giảm BHXH và chốt sổ bảo hiểm',
      'Đóng và lưu trữ hồ sơ nhân sự an toàn'
    ],
    relatedSystems: [
      'Quyết toán lương & Trợ cấp thôi việc',
      'Bàn giao tài sản & Thu hồi quyền',
      'Báo giảm Bảo hiểm xã hội'
    ]
  }
}

export const LifecycleStepDetailCanvas: React.FC<LifecycleStepDetailCanvasProps> = ({
  activeStep,
  currentStepIdx,
  totalSteps,
  onPrevStep,
  onNextStep,
  onOpenSopDetail
}) => {
  const detailData = STEP_DETAILS_MAP[activeStep.id] || {
    title: activeStep.title,
    description: activeStep.subtitle || 'Theo dõi và thực hiện các bước trong quy trình nghiệp vụ.',
    prerequisites: activeStep.inputs || [],
    deliverables: activeStep.outputs || [],
    relatedSystems: ['Hồ sơ nhân sự', 'Tiền lương & Phúc lợi']
  }

  const stepNumber = currentStepIdx + 1

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 animate-fadeIn">
      {/* Detail Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3.5">
          {/* Step Number Circle */}
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
            {stepNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                {`Bước ${stepNumber} / ${totalSteps}`}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {detailData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
              {detailData.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIdx === 0}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            ← Bước trước
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={currentStepIdx === totalSteps - 1}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              currentStepIdx === totalSteps - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            Bước tiếp →
          </button>

          <button
            type="button"
            onClick={() => onOpenSopDetail(activeStep.id)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 ml-1"
          >
            <span>Mở chi tiết quy trình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Detail Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Zone 1: Thông tin cần có trước khi thực hiện */}
        <div className="bg-slate-50/70 dark:bg-slate-850/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <FileQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Thông tin cần có trước khi thực hiện</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detailData.prerequisites.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Zone 2: Kết quả nhận được sau khi hoàn tất */}
        <div className="bg-slate-50/70 dark:bg-slate-850/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Kết quả nhận được sau khi hoàn tất</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detailData.deliverables.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Zone 3: Hệ thống hoặc phân hệ liên quan */}
        <div className="bg-slate-50/70 dark:bg-slate-850/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Hệ thống hoặc phân hệ liên quan</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detailData.relatedSystems.map((sys, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

