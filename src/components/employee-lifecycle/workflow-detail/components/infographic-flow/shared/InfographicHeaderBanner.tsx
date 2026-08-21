import React from 'react'
import { Smartphone } from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'

interface InfographicHeaderBannerProps {
  sopCode: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const InfographicHeaderBanner: React.FC<InfographicHeaderBannerProps> = ({
  sopCode,
  isDarkMode,
  onOpenWireframe
}) => {
  const { language } = useLanguage()

  const isRecruitmentProcess = sopCode.includes('REC') || sopCode.includes('SOP-TD') || sopCode.includes('EMP01') || sopCode.includes('EMP02') || sopCode.includes('LIFE-01')
  const isProbationProcess = !isRecruitmentProcess && (sopCode.includes('PROB') || sopCode.includes('EVAL') || sopCode.includes('EMP05') || sopCode.includes('EMP06') || sopCode.includes('LIFE-04') || sopCode.includes('SOP-NS-06'))
  const isPromotionProcess = !isRecruitmentProcess && !isProbationProcess && (sopCode.includes('PROM') || sopCode.includes('EMP08') || sopCode.includes('EMP11') || sopCode.includes('LIFE-05') || sopCode.includes('LIFE-03') || sopCode.includes('SOP-NS-09'))
  const isOffboardingProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && (sopCode.includes('OFF') || sopCode.includes('EMP15') || sopCode.includes('LIFE-07') || sopCode.includes('SOP-NS-16'))
  const isOvertimeProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (sopCode.includes('ATT01') || sopCode.includes('SOP-CC-02') || sopCode.includes('OT'))

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border shadow-md relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border-blue-900/50 text-white'
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-800 text-white'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 text-xs font-mono font-extrabold bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/40">
              SOP INFOGRAPHIC GRAPHIC BLUEPRINT
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/30 text-amber-200 rounded-full border border-amber-400/40">
              {isRecruitmentProcess
                ? 'SOP REC01 · RECRUITMENT REQUISITION'
                : isProbationProcess
                ? 'SOP PROB01 · PROBATION & CONTRACT RENEWAL'
                : isPromotionProcess
                ? 'SOP PROM01 · SALARY REVIEW & PROMOTION'
                : isOffboardingProcess
                ? 'SOP OFF01 · OFFBOARDING & 4-PARTY HANDOVER'
                : isOvertimeProcess
                ? 'SOP ATT01 · OVERTIME (OT) MANAGEMENT'
                : 'SOP ATT02 · HRMS LEAVE MANAGEMENT'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {isRecruitmentProcess
              ? language === 'vi'
                ? 'QUY TRÌNH YÊU CẦU & PHÊ DUYỆT TUYỂN DỤNG (RECRUITMENT REQUISITION)'
                : 'STANDARDIZED RECRUITMENT REQUISITION & APPROVAL PROCESS'
              : isProbationProcess
              ? language === 'vi'
                ? 'QUY TRÌNH ĐÁNH GIÁ THỬ VIỆC & TÁI KÝ HỢP ĐỒNG (PROBATION & RENEWAL)'
                : 'STANDARDIZED PROBATION EVALUATION & CONTRACT RENEWAL PROCESS'
              : isPromotionProcess
              ? language === 'vi'
                ? 'QUY TRÌNH ĐIỀU CHỈNH LƯƠNG & BỔ NHIỆM THĂNG CHỨC (SALARY & PROMOTION)'
                : 'STANDARDIZED SALARY REVIEW & PROMOTION PROCESS'
              : isOffboardingProcess
              ? language === 'vi'
                ? 'QUY TRÌNH THỦ TỤC THÔI VIỆC & BÀN GIAO 4 BÊN (OFFBOARDING & HANDOVER)'
                : 'STANDARDIZED OFFBOARDING & 4-PARTY HANDOVER PROCESS'
              : isOvertimeProcess
              ? language === 'vi'
                ? 'QUY TRÌNH ĐĂNG KÝ LÀM THÊM GIỜ / TĂNG CA (OVERTIME - OT)'
                : 'STANDARDIZED OVERTIME (OT) REGISTRATION & APPROVAL PROCESS'
              : language === 'vi'
              ? 'QUY TRÌNH ĐĂNG KÝ NGHỈ PHÉP TRÊN HRMS'
              : 'STANDARDIZED HRMS LEAVE APPROVAL PROCESS'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {isRecruitmentProcess
              ? language === 'vi'
                ? 'Từng bước chuẩn hóa: Đối soát định biên, màng lọc trần People Cost & chuỗi duyệt 4 cấp kích hoạt Job Posting'
                : 'Headcount quota check, People Cost ceiling safeguard & 4-level approval chain to Job Posting'
              : isProbationProcess
              ? language === 'vi'
                ? 'Từng bước chuẩn hóa: Tự động cảnh báo trước 30 ngày, rẽ nhánh KPI (Đạt >= 85%, Gia hạn, Dừng) & Báo tăng BHXH'
                : 'Auto-alert 30 days prior, KPI 3-branch routing (>=85%, Extend, Exit) & Social Insurance enrollment'
              : isPromotionProcess
              ? language === 'vi'
                ? 'Từng bước chuẩn hóa: Đối soát Khung Ngạch Bậc (MD-07), rẽ nhánh Tăng định kỳ vs Tăng vượt khung & cập nhật Org Chart'
                : 'Salary scale audit (MD-07), 2-branch routing (Merit vs Out-of-grade) & Org Chart sync'
              : isOffboardingProcess
              ? language === 'vi'
                ? 'Từng bước chuẩn hóa: Kiểm tra cam kết đào tạo, chuỗi bàn giao 4 bên (TBP, IT, HC, C&B) & chốt sổ BHXH'
                : 'Training bond check, 4-stakeholder handover (Manager, IT, Admin, C&B) & Social Insurance exit'
              : isOvertimeProcess
              ? language === 'vi'
                ? 'Từng bước chuẩn hóa: Hệ số tính lương luật định (150%-200%-300%), màng lọc trần giờ & đối soát vân tay'
                : 'Statutory pay rate (150%-200%-300%), legal cap safeguard & biometric log match'
              : language === 'vi'
              ? 'Từng bước chuẩn hóa, kiểm soát màng lọc kỹ thuật tự động & chuỗi phê duyệt 5 cấp'
              : 'Automated technical gates & 5-level approval chain'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenWireframe && (
            <button
              type="button"
              onClick={onOpenWireframe}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>{language === 'vi' ? 'Thử nghiệm Form trên App →' : 'Try App Form Wireframe →'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
