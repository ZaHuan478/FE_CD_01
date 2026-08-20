import React, { useState } from 'react'
import {
  Clock,
  ShieldCheck,
  Smartphone,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  ShieldAlert,
  DollarSign,
  Percent,
  Target,
  LogOut
} from 'lucide-react'
import { useLanguage } from '../../../../context/LanguageContext'

interface SopInfographicFlowViewProps {
  sopCode?: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const SopInfographicFlowView: React.FC<SopInfographicFlowViewProps> = ({
  sopCode = 'SOP REC01',
  isDarkMode,
  onOpenWireframe
}) => {
  const { language } = useLanguage()
  const [activeStageTab, setActiveStageTab] = useState<number>(0) // 0: All, 1..5: Specific stage

  // Identify Active SOP Workflow
  const isRecruitmentProcess = sopCode.includes('REC') || sopCode.includes('SOP-TD') || sopCode.includes('EMP01') || sopCode.includes('EMP02') || sopCode.includes('LIFE-01')
  const isProbationProcess = !isRecruitmentProcess && (sopCode.includes('PROB') || sopCode.includes('EVAL') || sopCode.includes('EMP05') || sopCode.includes('EMP06') || sopCode.includes('LIFE-04') || sopCode.includes('SOP-NS-06'))
  const isPromotionProcess = !isRecruitmentProcess && !isProbationProcess && (sopCode.includes('PROM') || sopCode.includes('EMP08') || sopCode.includes('EMP11') || sopCode.includes('LIFE-05') || sopCode.includes('LIFE-03') || sopCode.includes('SOP-NS-09'))
  const isOffboardingProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && (sopCode.includes('OFF') || sopCode.includes('EMP15') || sopCode.includes('LIFE-07') || sopCode.includes('SOP-NS-16'))
  const isOvertimeProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (sopCode.includes('ATT01') || sopCode.includes('SOP-CC-02') || sopCode.includes('OT'))
  const isLeaveProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && !isOvertimeProcess

  // Approval steps sequence for Recruitment Requisition (4 Cấp duyệt)
  const recApprovalChain = [
    { level: 'Cấp 1', title: 'Quản lý trực tiếp (TBP)', titleEn: 'Direct Department Head (TBP)', desc: 'Xác định nhu cầu, mô tả JD & dải lương đề xuất', descEn: 'Identify hiring needs, JD specs & salary range', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Trưởng phòng Nhân sự (HRM / HRD)', titleEn: 'Head of HR (HRM / HRD)', desc: 'Thẩm định định biên, nguồn cung ứng viên & kênh tuyển', descEn: 'Verify headcount quota, talent supply & hiring channels', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM)', titleEn: 'Board of Management (BOM)', desc: 'Phê duyệt hạn mức ngân sách People Cost vị trí mới', descEn: 'Approve People Cost budget cap for the requisition', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Chuyên viên Tuyển dụng (Recruiter PIC)', titleEn: 'Recruiter PIC', desc: 'Tiếp nhận Requisition ID & kích hoạt Job Posting đa kênh', descEn: 'Receive Requisition ID & publish multi-channel job posts', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  // Approval steps sequence for Probation & Renewal (3 Nhánh rẽ theo KPI)
  const probApprovalChain = [
    { level: 'Cấp 1', title: 'Đánh giá 360 & TBP Chấm Điểm', titleEn: '360 Evaluation & Line Manager', desc: 'Chấm điểm KPI thử việc & đề xuất: Tái ký / Gia hạn / Dừng', descEn: 'Score probation KPI & propose: Renewal / Extension / Terminate', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Trưởng phòng Nhân sự (HRM)', titleEn: 'HR Manager Review', desc: 'Thẩm định khung lương chính thức & phân luồng pháp lý', descEn: 'Review official pay grade & legal routing', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM) Ký Duyệt', titleEn: 'BOM Sign-off', desc: 'Ký số HĐLĐ chính thức 12/24M hoặc Quyết định chấm dứt', descEn: 'E-sign official 12/24M Labor Contract or Termination notice', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'C&B Báo Tăng BHXH (INS02)', titleEn: 'C&B / Insurance Specialist', desc: 'Kích hoạt hợp đồng chính thức & nộp hồ sơ Báo tăng BHXH', descEn: 'Activate official profile & submit Social Insurance registration', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
  ]

  // Approval steps sequence for Salary & Promotion (2 Nhánh rẽ)
  const promApprovalChain = [
    { level: 'Cấp 1', title: 'Trưởng bộ phận (TBP)', titleEn: 'Direct Department Head', desc: 'Lập đề xuất tăng lương hoặc bổ nhiệm vị trí quản lý mới', descEn: 'Propose merit increase or managerial appointment', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Chuyên viên C&B Thẩm định', titleEn: 'C&B Specialist', desc: 'Đối soát khung ngạch bậc (MD-07) & Quỹ lương phòng ban', descEn: 'Match salary scale (MD-07) & department budget cap', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM)', titleEn: 'Board of Management (BOM)', desc: 'Phê duyệt Tăng vượt khung / Quyết định Bổ nhiệm cán bộ', descEn: 'Approve Out-of-grade increase / Management Appointment', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'HR Cập nhật Org Chart & Bảng Lương', titleEn: 'HR Admin & Payroll Execution', desc: 'Phát hành Phụ lục HĐLĐ, đổi Org Chart & áp lương PAY01', descEn: 'Issue Contract Addendum, update Org Chart & lock PAY01 payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  // Handover 4-Stakeholder Sequence for Offboarding
  const offApprovalChain = [
    { level: 'Bên 1', title: 'Bàn giao Công việc (TBP)', titleEn: '1. Work Handover (Dept Head)', desc: 'Chuyển giao tài liệu, đầu việc & người nhận việc xác nhận', descEn: 'Transfer tasks, files & successor confirmation', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Bên 2', title: 'Thu hồi Tài sản IT (IT Admin)', titleEn: '2. IT Assets & Revoke Access', desc: 'Thu hồi Laptop, đóng tài khoản Email, VPN, Domain lúc 18h', descEn: 'Collect laptop, revoke Email, VPN, Domain at 18:00', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Bên 3', title: 'Hành chính & Công nợ (Admin/Fin)', titleEn: '3. Admin & Debt Clearance', desc: 'Thu thẻ NV, đồng phục, chốt quyết toán tạm ứng/công nợ', descEn: 'Collect ID card, uniform & clear financial advances', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Bên 4', title: 'Quyết toán C&B & Chốt Sổ BHXH', titleEn: '4. Final Pay & Social Insurance', desc: 'Tính tiền phép tồn, lập Báo giảm BHXH (INS04) & chốt sổ', descEn: 'Pay unused leave, file Social Insurance exit (INS04) & close book', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  // Approval steps sequence for Overtime (4 Cấp duyệt)
  const otApprovalChain = [
    { level: 'Cấp 1', title: 'Quản lý trực tiếp (TBP)', titleEn: 'Direct Line Manager', desc: 'Xét tính cấp thiết của công việc & ngân sách OT phòng ban', descEn: 'Assess urgency & department OT budget', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Quản lý kế tiếp / Quản lý ca', titleEn: 'Shift / Next Manager', desc: 'Phê duyệt điều phối nhân lực và ca làm việc', descEn: 'Approve manpower & shift scheduling', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Giám đốc Khối / Ban Giám Đốc', titleEn: 'Division Director / BOM', desc: 'Phê duyệt đơn OT ngày Lễ/Tết hoặc OT vượt 20h/tháng', descEn: 'Approve Holiday OT or OT > 20h/month', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Chuyên viên C&B Chấm công', titleEn: 'C&B Specialist', desc: 'Đối soát log quét vân tay thực tế & chốt bảng lương OT', descEn: 'Match physical biometric log & lock OT payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  // Approval steps sequence for Leave (5 Cấp duyệt)
  const leaveApprovalChain = [
    { level: 'Cấp 0', title: 'Người nhận bàn giao', titleEn: 'Delegated Person', desc: 'Đánh giá khả năng tiếp nhận bàn giao công việc', descEn: 'Evaluate handover capability', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 1', title: 'Quản lý trực tiếp', titleEn: 'Direct Line Manager', desc: 'Xét tính hợp lý & phân công công việc phòng ban', descEn: 'Assess validity & department workload', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 2', title: 'Quản lý kế tiếp', titleEn: 'Next Level Manager', desc: 'Phê duyệt thẩm định cấp quản lý cao hơn', descEn: 'Review & higher level approval', color: 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    { level: 'Cấp 3', title: 'Giám đốc', titleEn: 'Executive Director', desc: 'Kiểm soát đơn nghỉ dài ngày (> 3 ngày) hoặc trọng yếu', descEn: 'Control long-term or key leave requests', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Thư ký TT QLNS (Nhân sự)', titleEn: 'HR Admin / Secretary', desc: 'Chốt chặn cuối, cập nhật phép & ghi nhận chấm công', descEn: 'Final check, deduct leave & update payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-md relative overflow-hidden transition-colors duration-300 ${isDarkMode
        ? 'bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border-blue-900/50 text-white'
        : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-800 text-white'
        }`}>
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
                ? (language === 'vi' ? 'QUY TRÌNH YÊU CẦU & PHÊ DUYỆT TUYỂN DỤNG (RECRUITMENT REQUISITION)' : 'STANDARDIZED RECRUITMENT REQUISITION & APPROVAL PROCESS')
                : isProbationProcess
                  ? (language === 'vi' ? 'QUY TRÌNH ĐÁNH GIÁ THỬ VIỆC & TÁI KÝ HỢP ĐỒNG (PROBATION & RENEWAL)' : 'STANDARDIZED PROBATION EVALUATION & CONTRACT RENEWAL PROCESS')
                  : isPromotionProcess
                    ? (language === 'vi' ? 'QUY TRÌNH ĐIỀU CHỈNH LƯƠNG & BỔ NHIỆM THĂNG CHỨC (SALARY & PROMOTION)' : 'STANDARDIZED SALARY REVIEW & PROMOTION PROCESS')
                    : isOffboardingProcess
                      ? (language === 'vi' ? 'QUY TRÌNH THỦ TỤC THÔI VIỆC & BÀN GIAO 4 BÊN (OFFBOARDING & HANDOVER)' : 'STANDARDIZED OFFBOARDING & 4-PARTY HANDOVER PROCESS')
                      : isOvertimeProcess
                        ? (language === 'vi' ? 'QUY TRÌNH ĐĂNG KÝ LÀM THÊM GIỜ / TĂNG CA (OVERTIME - OT)' : 'STANDARDIZED OVERTIME (OT) REGISTRATION & APPROVAL PROCESS')
                        : (language === 'vi' ? 'QUY TRÌNH ĐĂNG KÝ NGHỈ PHÉP TRÊN HRMS' : 'STANDARDIZED HRMS LEAVE APPROVAL PROCESS')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isRecruitmentProcess
                ? (language === 'vi' ? 'Từng bước chuẩn hóa: Đối soát định biên, màng lọc trần People Cost & chuỗi duyệt 4 cấp kích hoạt Job Posting' : 'Headcount quota check, People Cost ceiling safeguard & 4-level approval chain to Job Posting')
                : isProbationProcess
                  ? (language === 'vi' ? 'Từng bước chuẩn hóa: Tự động cảnh báo trước 30 ngày, rẽ nhánh KPI (Đạt $\\ge 85%$, Gia hạn, Dừng) & Báo tăng BHXH' : 'Auto-alert 30 days prior, KPI 3-branch routing (>=85%, Extend, Exit) & Social Insurance enrollment')
                  : isPromotionProcess
                    ? (language === 'vi' ? 'Từng bước chuẩn hóa: Đối soát Khung Ngạch Bậc (MD-07), rẽ nhánh Tăng định kỳ vs Tăng vượt khung & cập nhật Org Chart' : 'Salary scale audit (MD-07), 2-branch routing (Merit vs Out-of-grade) & Org Chart sync')
                    : isOffboardingProcess
                      ? (language === 'vi' ? 'Từng bước chuẩn hóa: Kiểm tra cam kết đào tạo, chuỗi bàn giao 4 bên (TBP, IT, HC, C&B) & chốt sổ BHXH' : 'Training bond check, 4-stakeholder handover (Manager, IT, Admin, C&B) & Social Insurance exit')
                      : isOvertimeProcess
                        ? (language === 'vi' ? 'Từng bước chuẩn hóa: Hệ số tính lương luật định (150%-200%-300%), màng lọc trần giờ & đối soát vân tay' : 'Statutory pay rate (150%-200%-300%), legal cap safeguard & biometric log match')
                        : (language === 'vi' ? 'Từng bước chuẩn hóa, kiểm soát màng lọc kỹ thuật tự động & chuỗi phê duyệt 5 cấp' : 'Automated technical gates & 5-level approval chain')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenWireframe && (
              <button
                type="button"
                onClick={onOpenWireframe}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>{language === 'vi' ? 'Thử nghiệm Form trên App →' : 'Try App Form Wireframe →'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUICK STAGE FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveStageTab(0)}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeStageTab === 0
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          ⚡ {language === 'vi' ? 'Xem Toàn Bộ 5 Giai Đoạn' : 'Full 5-Stage Overview'}
        </button>
        {[
          {
            num: 1,
            label: isRecruitmentProcess ? 'GĐ 1: Định biên' : isProbationProcess ? 'GĐ 1: Hạn 30 ngày' : isPromotionProcess ? 'GĐ 1: Khung ngạch bậc' : isOffboardingProcess ? 'GĐ 1: Báo trước thôi việc' : isOvertimeProcess ? 'GĐ 1: Hệ số lương' : 'GĐ 1: Báo trước',
            labelEn: isRecruitmentProcess ? 'Stage 1: Headcount' : isProbationProcess ? 'Stage 1: 30D Window' : isPromotionProcess ? 'Stage 1: Salary Scale' : isOffboardingProcess ? 'Stage 1: Notice Period' : isOvertimeProcess ? 'Stage 1: Pay Rate' : 'Stage 1: Pre-notice'
          },
          { num: 2, label: 'GĐ 2: AI Màng lọc', labelEn: 'Stage 2: AI Gates' },
          { num: 3, label: 'GĐ 3: Thao tác Portal/App', labelEn: 'Stage 3: Inputs' },
          {
            num: 4,
            label: isOffboardingProcess ? 'GĐ 4: Bàn giao 4 Bên' : isProbationProcess ? 'GĐ 4: Rẽ nhánh KPI' : isPromotionProcess ? 'GĐ 4: Rẽ nhánh Duyệt' : isLeaveProcess ? 'GĐ 4: Duyệt 5 Cấp' : 'GĐ 4: Duyệt 4 Cấp',
            labelEn: isOffboardingProcess ? 'Stage 4: 4-Party Handover' : isProbationProcess ? 'Stage 4: KPI Branching' : isPromotionProcess ? 'Stage 4: Approval Route' : isLeaveProcess ? 'Stage 4: 5-Level Approval' : 'Stage 4: 4-Level Approval'
          },
          { num: 5, label: 'GĐ 5: Kết quả & Lưu ý', labelEn: 'Stage 5: Outcomes' }
        ].map((stg) => (
          <button
            key={stg.num}
            type="button"
            onClick={() => setActiveStageTab(stg.num)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeStageTab === stg.num
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <span>{language === 'vi' ? stg.label : stg.labelEn}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. RECRUITMENT REQUISITION (SOP REC01) CONTENT                           */}
      {/* ========================================================================= */}
      {isRecruitmentProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU ĐỊNH BIÊN NHÂN SỰ & HẠN MỨC NGÂN SÁCH */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 1: ĐỐI CHIẾU ĐỊNH BIÊN & HẠN MỨC NGÂN SÁCH (HEADCOUNT MATRIX)' : 'STAGE 1: HEADCOUNT & BUDGET MATRIX CHECK'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm tra tính khả dụng của Định biên nhân sự (EMP01) và nguồn ngân sách People Cost' : 'Verify Headcount availability (EMP01) and People Cost budget source'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Phân Loại Yêu Cầu Tuyển Dụng' : 'Requisition Category'}</th>
                      <th className="p-3 font-extrabold uppercase text-blue-600 dark:text-blue-400">{language === 'vi' ? 'Điều Kiện Kích Hoạt' : 'Trigger Condition'}</th>
                      <th className="p-3 font-extrabold uppercase text-emerald-600 dark:text-emerald-400">{language === 'vi' ? 'Luồng Phê Duyệt & SLA' : 'Approval Route & SLA'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">1. Tuyển dụng Trong Định Biên (Within Headcount)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Còn chỉ tiêu Available Headcount &gt; 0</span></td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Luồng duyệt nhanh (TBP $\rightarrow$ HRM duyệt trong 24h $\rightarrow$ Mở đăng tuyển)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">2. Tuyển Thay Thế Nhân Sự Nghỉ Việc (Replacement)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Đã có Đơn thôi việc được duyệt (EMP15)</span></td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Giữ nguyên Job Grade & khung dải lương cũ của nhân sự tiền nhiệm</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400">3. Tuyển Vượt Định Biên / Mở Rộng Dự Án Mới (Over Budget)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Vượt hạn mức định biên đầu năm</span></td>
                      <td className="p-3 text-amber-700 dark:text-amber-300 font-semibold">Bắt buộc nộp Tờ trình People Cost $\rightarrow$ Trình Ban Giám Đốc (BOM) phê duyệt</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Rà soát danh mục chức danh chuẩn, chặn vượt trần ngân sách lương & cảnh báo tỷ lệ biến động' : 'Validate job catalog, enforce salary ceiling & monitor turnover rate'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Luật Thép 1: Ràng buộc Chức Danh từ Job Catalog (MD-06)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Chức danh cần tuyển <strong>bắt buộc phải chọn từ Từ điển Khung Năng lực (MD-06)</strong> đã ban hành. Không cho phép tạo chức danh tự do ngoài danh mục.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Luật Thép 2: Chặn Vượt Trần Ngân Sách Quỹ Lương</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động so khớp dải lương đề xuất với <strong>Khung Ngạch Bậc Lương (MD-07)</strong>. Nếu vượt trần, hệ thống khóa và tự động leo thang lên Ban Giám Đốc duyệt.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Luật Thép 3: Cảnh Báo Tỷ Lệ Biến Động Phòng Ban</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Tự động cảnh báo nếu tỷ lệ nghỉ việc (Turnover Rate) của phòng ban vượt ngưỡng $\ge 15\%$, yêu cầu TBP giải trình nguyên nhân trước khi duyệt thêm định biên.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN PORTAL */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC TRÊN PORTAL HRMS (6 TRƯỜNG BẮT BUỘC)' : 'STAGE 3: REQUISITION DATA DECLARATION'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Trưởng bộ phận (TBP) hoàn tất 4 bước tạo yêu cầu tuyển dụng trên Manager Portal' : 'Department Head completes 4 steps on Manager Portal'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Thao tác trên Portal:' : '4 Portal Operating Steps:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở Manager Portal $\rightarrow$ Menu "Yêu cầu Tuyển dụng"</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn chức danh từ Job Catalog (Hệ thống load sẵn JD chuẩn)</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Nhập số lượng, ngày cần nhận việc & dải ngân sách lương đề xuất</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra đối soát định biên tự động $\rightarrow$ Bấm Gửi Trình Duyệt</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Chức danh tuyển dụng (Từ MD-06)', '2. Số lượng nhân sự cần tuyển', '3. Lý do tuyển (Mới / Thay thế)', '4. Ngày mục tiêu nhận việc (Target Date)', '5. Dải lương đề xuất (Min - Max)', '6. Bản mô tả công việc (JD đính kèm)'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI PHÊ DUYỆT 4 CẤP */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI PHÊ DUYỆT 4 CẤP (APPROVAL WORKFLOW CHAIN)' : 'STAGE 4: 4-LEVEL APPROVAL CHAIN'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Chuỗi rẽ nhánh 4 cấp từ Trưởng bộ phận tới Kích hoạt Job Posting' : '4-Tier approval chain from Line Manager to Job Posting launch'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {recApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Yêu cầu tuyển dụng lập tức đóng hoặc Trả về cho TBP để chỉnh sửa lại định biên/JD.' : '* If any level clicks [Reject]: Recruitment requisition is canceled or returned to Department Head for adjustment.'}</span>
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & CẢNH BÁO */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kích hoạt Ticket Requisition ID, phân công Recruiter & quy định pháp lý tuyển dụng' : 'Requisition ID generation, Recruiter assignment and legal compliance notice'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt & Mở Tuyển Dụng]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất chuỗi duyệt. Hệ thống tự động sinh <strong>Mã Requisition ID</strong>, gán Chuyên viên tuyển dụng PIC và đồng bộ tin tuyển dụng lên Career Portal & LinkedIn/TopCV.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Yêu Cầu Tờ Trình People Cost]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Yêu cầu tuyển dụng vượt định biên hoặc ngân sách chưa được chấp thuận $\rightarrow$ TBP cần bổ sung giải trình hiệu quả kinh doanh trước khi trình BOM duyệt lại.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider">
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>LƯU Ý TỐI QUAN TRỌNG VỀ QUY ĐỊNH TUYỂN DỤNG:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Nghiêm cấm đăng tin tuyển dụng hoặc mời ứng viên phỏng vấn khi Yêu cầu tuyển dụng CHƯA ĐƯỢC PHÊ DUYỆT 100% TRÊN HỆ THỐNG HRMS. Tuyển dụng tự phát = Không được duyệt ngân sách lương và từ chối cấp Mã số nhân viên.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. PROBATION & CONTRACT RENEWAL (SOP PROB01) CONTENT                      */}
      {/* ========================================================================= */}
      {isProbationProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU THỜI HẠN & CẢNH BÁO TỰ ĐỘNG TRƯỚC 30 NGÀY */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 1: QUÉT THỜI HẠN & CẢNH BÁO TRƯỚC 30 NGÀY (PROBATION ALERT)' : 'STAGE 1: 30-DAY ADVANCE PROBATION SCAN'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Hệ thống tự động quét HĐ Thử việc / HĐLĐ sắp đáo hạn và khởi tạo quy trình đánh giá' : 'Automated 30-day contract expiration scan & 360 evaluation activation'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Nhóm Nhân Sự & Cấp Bậc' : 'Job Level & Category'}</th>
                      <th className="p-3 font-extrabold uppercase text-blue-600 dark:text-blue-400">{language === 'vi' ? 'Thời Gian Thử Việc Luật Định' : 'Statutory Probation'}</th>
                      <th className="p-3 font-extrabold uppercase text-emerald-600 dark:text-emerald-400">{language === 'vi' ? 'Thời Điểm Hệ Thống Bắn Cảnh Báo' : 'Automated Trigger Point'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">1. Nhân viên Chuyên môn (Đại học / Cao đẳng)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Tối đa 60 Ngày</span></td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Tự động kích hoạt Đánh giá vào Ngày thứ 30 & 45</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">2. Cán bộ Quản lý Doanh nghiệp (Manager / C-Level)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">Tối đa 180 Ngày</span></td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Tự động kích hoạt Đánh giá trước ngày đáo hạn 30 ngày</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">3. Hợp đồng Lao động Xác định Thời hạn (12M / 24M)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">12 hoặc 24 Tháng</span></td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Tự động gửi thông báo tái ký HĐ trước 30 - 45 ngày</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm soát bắt buộc đánh giá 2 chiều & trần thời gian thử việc theo Luật Lao động' : 'Enforce mandatory 360 review & statutory probation length limit'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Luật Thép 1: Cảnh Báo Tự Động Trước 30 Ngày</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống <strong>tự động gửi thông báo nhắc nhở</strong> tới email & app của Quản lý và Nhân viên trước ngày hết hạn 30 ngày. Khóa chức năng duyệt nếu quá hạn.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Luật Thép 2: Bắt Buộc Đánh Giá 2 Chiều (360)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Bắt buộc nhân viên hoàn tất <strong>Form tự đánh giá</strong> trước khi Trưởng bộ phận chấm điểm KPI. Không thể ký HĐ chính thức nếu thiếu phiếu đánh giá.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Luật Thép 3: Khóa Gia Hạn Quá Trần Luật Định</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Chỉ cho phép <strong>Gia hạn thử việc tối đa 01 lần không quá 30 ngày</strong> (nếu vị trí đủ điều kiện). Chặn tuyệt đối việc kéo dài thử việc lần 2.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN PORTAL */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC ĐÁNH GIÁ TRÊN PORTAL (6 TRƯỜNG BẮT BUỘC)' : 'STAGE 3: EVALUATION INPUTS DECLARATION'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Trưởng bộ phận và nhân viên thực hiện đánh giá KPI thử việc trên hệ thống' : 'Department Head & Employee perform evaluation scoring on Portal'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Thực hiện Đánh giá:' : '4 Steps in Evaluation Process:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Nhân viên mở Employee Portal $\rightarrow$ Điền Phiếu tự đánh giá thử việc</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Trưởng bộ phận (TBP) chấm điểm KPI theo thang điểm 100</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>TBP chọn đề xuất: Đạt (Tái ký HĐLĐ) / Gia hạn / Không đạt</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Hệ thống tự động phân luồng rẽ nhánh trình duyệt HRD & BOM</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Điểm KPI tự đánh giá của NV', '2. Điểm KPI TBP chấm (Thang 100)', '3. Nhận xét ưu & nhược điểm', '4. Đề xuất: Đạt / Gia hạn / Dừng', '5. Mức lương chính thức 100%', '6. Thời hạn HĐ tái ký (12M/24M)'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI RẼ NHÁNH ĐIỀU KIỆN THEO ĐIỂM KPI (3 NHÁNH) */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI RẼ NHÁNH ĐIỀU KIỆN THEO ĐIỂM KPI (3 NHÁNH)' : 'STAGE 4: 3-BRANCH KPI DECISION MATRIX'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Hệ thống tự động rẽ nhánh hành động dựa trên kết quả điểm KPI đánh giá thử việc' : 'Automated 3-branch execution matrix based on final probation KPI score'}</p>
                  </div>
                </div>
              </div>

              {/* 3 Interactive KPI Decision Branch Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                {/* Branch 1: Pass */}
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-emerald-600 text-white">🟢 NHÁNH 1 (KPI &ge; 85%)</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">ĐẠT XUẤT SẮC / TỐT</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    Tự động sinh <strong>HĐLĐ chính thức 12 hoặc 24 tháng</strong> $\rightarrow$ Ban Giám Đốc ký số $\rightarrow$ Tự động trích xuất thông tin <strong>Báo tăng BHXH (INS02)</strong> và áp lương 100%.
                  </p>
                </div>

                {/* Branch 2: Extend */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-amber-600 text-white">🟡 NHÁNH 2 (KPI 70 - 84%)</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">CẦN CẢI THIỆN</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    Gia hạn thử việc thêm <strong>tối đa 30 ngày</strong> (nếu chức danh cho phép) $\rightarrow$ TBP lập Kế hoạch cải thiện hiệu suất (PIP) và tái đánh giá lần 2.
                  </p>
                </div>

                {/* Branch 3: Terminate */}
                <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-rose-600 text-white">🔴 NHÁNH 3 (KPI &lt; 70%)</span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400">KHÔNG ĐẠT</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    Ban hành <strong>Thông báo chấm dứt thử việc</strong> trước ngày hết hạn 03 ngày $\rightarrow$ Thanh toán 85% lương ngày công thực tế và đóng hồ sơ nhân viên.
                  </p>
                </div>
              </div>

              {/* Approval Chain Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {probApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & CẢNH BÁO */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Chuyển đổi trạng thái nhân sự chính thức, phát hành HĐLĐ & tham gia bảo hiểm xã hội' : 'Official status conversion, labor contract issuance & social insurance enrollment'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Tái Ký HĐLĐ Chính Thức]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Chuyển trạng thái hồ sơ sang <strong>"Nhân viên Chính thức"</strong>. Tự động áp 100% lương chính thức và đưa vào kỳ Báo tăng BHXH/BHYT/BHTN gần nhất.</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase"><XCircle className="w-4.5 h-4.5" /><span>Trạng thái [Dừng Thử Việc / Không Tái Ký]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Tự động phát hành Quyết định chấm dứt thử việc, thanh toán tiền ngày công thực tế và khóa tài khoản nhân viên.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider">
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>LƯU Ý TỐI QUAN TRỌNG VỀ QUY ĐỊNH THỬ VIỆC (LUẬT LAO ĐỘNG):</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Phải hoàn tất đánh giá và ký HĐLĐ chính thức TRƯỚC KHI HẾT HẠN THỬ VIỆC. Nếu để nhân viên tiếp tục làm việc mà không ký HĐ mới $\rightarrow$ HĐ mặc nhiên chuyển thành Hợp đồng lao động chính thức theo quy định pháp luật.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. SALARY REVIEW & PROMOTION (SOP PROM01) CONTENT                         */}
      {/* ========================================================================= */}
      {isPromotionProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU KHUNG NGẠCH BẬC & QUỸ LƯƠNG PHÒNG BAN */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 1: ĐỐI CHIẾU KHUNG NGẠCH BẬC & QUỸ LƯƠNG (SALARY SCALE MATRIX)' : 'STAGE 1: SALARY SCALE & BUDGET AUDIT'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Đối soát mức lương đề xuất với Khung Ngạch Bậc (MD-07) và Quỹ lương khả dụng phòng ban' : 'Audit proposed pay against Salary Grade (MD-07) and Department Budget cap'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Loại Hình Điều Chỉnh Thu Nhập' : 'Adjustment Category'}</th>
                      <th className="p-3 font-extrabold uppercase text-blue-600 dark:text-blue-400">{language === 'vi' ? 'Điều Kiện Tiêu Chuẩn' : 'Standard Criteria'}</th>
                      <th className="p-3 font-extrabold uppercase text-emerald-600 dark:text-emerald-400">{language === 'vi' ? 'Thẩm Quyền Phê Duyệt' : 'Approval Authority'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">1. Tăng Lương Định Kỳ theo Khung Bậc (Merit Increase)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Nằm trong khung ngạch bậc hiện tại & KPI $\ge$ B</span></td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">TBP $\rightarrow$ C&B thẩm định $\rightarrow$ HRD phê duyệt</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-amber-600 dark:text-amber-400">2. Tăng Lương Vượt Khung / Đột Xuất (Out-of-Grade)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Mức đề xuất vượt trần ngạch bậc hiện tại</span></td>
                      <td className="p-3 text-amber-700 dark:text-amber-300 font-semibold">Bắt buộc có Tờ trình People Cost $\rightarrow$ Ban Giám Đốc (BOM) phê duyệt</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">3. Bổ Nhiệm Thăng Chức Quản Lý (Promotion)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Chuyển nhóm Job Grade & Thêm Phụ cấp trách nhiệm</span></td>
                      <td className="p-3 text-purple-700 dark:text-purple-300 font-semibold">BOM phê duyệt Quyết định Bổ nhiệm $\rightarrow$ Tự động cập nhật Org Chart</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Khung Ngạch Bậc (MD-07), điều kiện thâm niên & kiểm soát trần quỹ lương phòng ban' : 'Salary scale validation, tenure condition & department budget ceiling'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Luật Thép 1: Đối Soát Khung Ngạch Bậc (MD-07)</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động so khớp mức lương mới với <strong>Bảng Thang Bảng Lương (MD-07)</strong>. Tự động cảnh báo nếu mức lương tăng không đúng bước bậc quy định.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Luật Thép 2: Ràng Buộc Thâm Niên & Điểm KPI</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Yêu cầu nhân sự có thâm niên tối thiểu <strong>$\ge 6$ tháng</strong> tại vị trí hiện tại và điểm KPI 2 kỳ gần nhất đạt <strong>Loại A hoặc B</strong> mới đủ điều kiện xét tăng lương.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Luật Thép 3: Khóa Vượt Quỹ Lương Phòng Ban</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Tự động khóa và chặn nộp đề xuất nếu tổng ngân sách lương tăng làm vượt <strong>Quỹ lương khả dụng (Available Budget)</strong> của phòng ban trong năm.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN PORTAL */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC ĐỀ XUẤT TRÊN PORTAL (6 TRƯỜNG BẮT BUỘC)' : 'STAGE 3: SALARY ADJUSTMENT INPUTS'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Trưởng bộ phận lập hồ sơ đề xuất điều chỉnh thu nhập / bổ nhiệm quản lý' : 'Department Head completes salary review & promotion form on Portal'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Lập Đề Xuất:' : '4 Steps to Submit Request:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở Manager Portal $\rightarrow$ Menu "Đề xuất Tăng lương / Bổ nhiệm"</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn nhân viên $\rightarrow$ Hệ thống tự load Mức lương hiện tại & Lịch sử KPI</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Nhập mức lương mới đề xuất, chọn chức vụ mới và ghi rõ thành tích</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra đối soát ngân sách quỹ lương $\rightarrow$ Bấm Gửi Trình Duyệt</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Mức lương cơ bản hiện tại', '2. Mức lương đề xuất mới', '3. Tỷ lệ % tăng lương (Tự tính)', '4. Chức danh bổ nhiệm mới (nếu có)', '5. Phụ cấp trách nhiệm mới', '6. Lý do thành tích & Đóng góp'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI RẼ NHÁNH ĐIỀU KIỆN (2 NHÁNH) */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI RẼ NHÁNH ĐIỀU KIỆN (2 NHÁNH THẨM QUYỀN)' : 'STAGE 4: 2-BRANCH APPROVAL ROUTING'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Rẽ nhánh thẩm quyền duyệt: Tăng lương định kỳ theo khung vs Tăng vượt khung / Bổ nhiệm quản lý' : 'Routing logic: In-grade merit increase vs Out-of-grade / Executive promotion'}</p>
                  </div>
                </div>
              </div>

              {/* 2 Decision Branch Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-emerald-600 text-white">🌿 NHÁNH 1: TĂNG LƯƠNG ĐỊNH KỲ (TRONG KHUNG)</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">LUỒNG NHANH</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    C&B thẩm định $\rightarrow$ <strong>Trưởng phòng Nhân sự (HRD) ký duyệt</strong> $\rightarrow$ Tự động sinh Phụ lục HĐLĐ và cập nhật mức lương mới vào Bảng lương PAY01 kỳ kế tiếp.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-amber-600 text-white">👑 NHÁNH 2: TĂNG VƯỢT KHUNG / BỔ NHIỆM QUẢN LÝ</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">TRÌNH DUYỆT BOM</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    TBP $\rightarrow$ C&B thẩm định $\rightarrow$ <strong>Ban Giám Đốc (BOM) ký Quyết định</strong> $\rightarrow$ Tự động cập nhật Sơ đồ tổ chức (Org Chart), phân quyền duyệt và áp lương mới.
                  </p>
                </div>
              </div>

              {/* Approval Chain Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {promApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & CẢNH BÁO */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Phát hành Phụ lục HĐLĐ, cập nhật Org Chart & đồng bộ Bảng tính lương PAY01' : 'Contract Addendum issuance, Org Chart update & payroll synchronization'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Duyệt & Áp Lương Mới]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Tự động phát hành <strong>Phụ lục HĐLĐ điều chỉnh lương</strong> gửi nhân viên qua App, cập nhật mức lương mới vào Bảng lương PAY01 và cập nhật vị trí trên Org Chart.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Vượt Ngân Sách]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Đề xuất chưa được chấp thuận do vượt ngân sách hoặc chưa đủ điều kiện thâm niên $\rightarrow$ Giữ nguyên mức thu nhập cũ.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider">
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>LƯU Ý TỐI QUAN TRỌNG VỀ ĐIỀU CHỈNH LƯƠNG & BỔ NHIỆM:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Việc tăng lương và bổ nhiệm chức vụ CHỈ CÓ HIỆU LỰC KHI ĐÃ CÓ QUYẾT ĐỊNH KÝ DUYỆT CỦA BOM HOẶC HRD TRÊN HỆ THỐNG. Mọi thỏa thuận miệng không có giá trị chi trả lương.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. OFFBOARDING & 4-PARTY HANDOVER (SOP OFF01) CONTENT                     */}
      {/* ========================================================================= */}
      {isOffboardingProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU THỜI HẠN BÁO TRƯỚC THÔI VIỆC (LUẬT LAO ĐỘNG ĐIỀU 35) */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 1: ĐỐI CHIẾU THỜI GIAN BÁO TRƯỚC THÔI VIỆC (LUẬT LAO ĐỘNG)' : 'STAGE 1: ADVANCE NOTICE COMPLIANCE CHECK'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm tra thời hạn báo trước theo Điều 35 Bộ luật Lao động 2019' : 'Verify advance notice compliance under Article 35 Vietnam Labor Code'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Loại Hợp Đồng Lao Động' : 'Labor Contract Type'}</th>
                      <th className="p-3 font-extrabold uppercase text-blue-600 dark:text-blue-400">{language === 'vi' ? 'Thời Hạn Báo Trước Tối Thiểu' : 'Minimum Notice Period'}</th>
                      <th className="p-3 font-extrabold uppercase text-amber-600 dark:text-amber-400">{language === 'vi' ? 'Chế Tài Xử Lý Nếu Vi Phạm' : 'Penalty for Breach'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">1. Hợp đồng Thử việc (Probation)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Trước ít nhất 03 Ngày làm việc</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">Không phạt vi phạm thời hạn báo trước</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">2. HĐLĐ Xác định thời hạn (12 Tháng &minus; 36 Tháng)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">Trước ít nhất 30 Ngày</span></td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">Bồi thường tiền lương tương ứng số ngày không báo trước</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">3. HĐLĐ Không xác định thời hạn (Vĩnh viễn)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Trước ít nhất 45 Ngày</span></td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">Bồi thường tiền lương tương ứng số ngày không báo trước</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Quét cam kết đào tạo, thu hồi công nợ tài chính & khóa tài khoản tự động' : 'Scan training bonds, settle financial advances & auto-revoke system access'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>Luật Thép 1: Rà Soát Cam Kết Đào Tạo</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống quét lịch sử đào tạo. Nếu nhân sự còn <strong>Hợp đồng cam kết phục vụ</strong> chưa hết hạn, hệ thống tự tính chi phí bồi hoàn trừ vào quyết toán.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Luật Thép 2: Chốt Công Nợ Tạm Ứng Tài Chính</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Chặn hoàn tất thủ tục nếu nhân sự còn <strong>khoản tạm ứng công tác phí / công nợ chưa hoàn ứng</strong> với Kế toán.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Luật Thép 3: Khóa Tự Động Tài Khoản lúc 18h00</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Đúng <strong>18h00 ngày làm việc cuối cùng</strong>, hệ thống tự động khóa tài khoản Email công ty, VPN, Domain và phân quyền truy cập phần mềm.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN PORTAL */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC NỘP ĐƠN THÔI VIỆC TRÊN PORTAL (6 TRƯỜNG)' : 'STAGE 3: RESIGNATION SUBMISSION INPUTS'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Nhân viên nộp đơn thôi việc & thực hiện khảo sát phỏng vấn nghỉ việc (Exit Interview)' : 'Employee submits resignation & completes Exit Interview survey'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Nộp Đơn & Khởi Động Bàn Giao:' : '4 Steps in Offboarding Process:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Nhân viên mở App/Portal $\rightarrow$ Menu "Đăng ký Thôi việc"</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn lý do nghỉ & chọn Ngày làm việc cuối cùng theo luật định</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Hoàn thành bài Khảo sát phỏng vấn nghỉ việc (Exit Interview)</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Hệ thống tự động kích hoạt Checklist Bàn giao 4 Bên</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Lý do thôi việc chi tiết', '2. Ngày làm việc cuối cùng (Last Day)', '3. Người tiếp nhận bàn giao công việc', '4. Khảo sát Exit Interview', '5. Danh mục tài sản IT đang mượn', '6. Thông tin nhận tiền quyết toán'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI BÀN GIAO 4 BÊN LIÊN PHÒNG BAN */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI BÀN GIAO 4 BÊN LIÊN PHÒNG BAN (4-STAKEHOLDER HANDOVER)' : 'STAGE 4: 4-PARTY INTER-DEPARTMENTAL HANDOVER'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? '4 phòng ban độc lập tuần tự xác nhận bàn giao công việc, tài sản IT, hành chính và quyết toán C&B' : '4 independent departments confirm task handover, IT assets, admin items & C&B final pay'}</p>
                  </div>
                </div>
              </div>

              {/* Visual 4 Handover Stakeholder Chain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {offApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{language === 'vi' ? '* Bắt buộc cả 4 bên đều phải bấm [Xác nhận Hoàn tất]: Hệ thống mới kích hoạt phát hành Quyết định Chấm dứt HĐLĐ.' : '* All 4 stakeholders must sign-off before Termination Decision and Final Pay can be released.'}</span>
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & CẢNH BÁO */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Quyết toán lương thôi việc, thanh toán phép tồn, báo giảm BHXH (INS04) & chốt sổ' : 'Final pay calculation, unused leave settlement, social insurance exit & book return'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Hoàn Tất Thôi Việc & Quyết Toán]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Ban hành <strong>Quyết định chấm dứt HĐLĐ</strong>, chi trả tiền lương và tiền ngày phép tồn chưa nghỉ vào đợt thanh toán Final Pay, nộp hồ sơ Báo giảm BHXH (INS04) và trả Sổ BHXH.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Treo Bàn Giao / Chưa Hoàn Tài Sản]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Nếu chưa bàn giao máy tính IT hoặc chưa hoàn ứng công nợ $\rightarrow$ Hệ thống tạm giữ khoản tiền quyết toán thôi việc cho đến khi có xác nhận bổ sung.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider">
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>LƯU Ý TỐI QUAN TRỌNG VỀ QUY ĐỊNH THÔI VIỆC:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Người lao động CHỈ ĐƯỢC NHẬN TIỀN QUYẾT TOÁN THÔI VIỆC VÀ TRẢ SỔ BẢO HIỂM XÃ HỘI sau khi cả 4 bên (Quản lý trực tiếp, IT, Hành chính, Kế toán) đã ký duyệt xác nhận bàn giao đầy đủ trên hệ thống HRMS.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 5. OVERTIME WORKFLOW (SOP ATT01) CONTENT                                 */}
      {/* ========================================================================= */}
      {isOvertimeProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU HỆ SỐ LƯƠNG LÀM THÊM GIỜ */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 1: ĐỐI CHIẾU HỆ SỐ LƯƠNG OT (QUY ĐỊNH LUẬT LAO ĐỘNG)' : 'STAGE 1: STATUTORY OVERTIME PAY RATE CHECK'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Hệ số tính lương làm thêm giờ theo Điều 98 Bộ luật Lao động 2019' : 'Overtime rate calculation under Article 98 Vietnam Labor Code'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Khung Thời Gian Làm Thêm (OT)' : 'Overtime Timeframe'}</th>
                      <th className="p-3 font-extrabold uppercase text-blue-600 dark:text-blue-400">{language === 'vi' ? 'Hệ Số Lương Luật Định' : 'Statutory Rate'}</th>
                      <th className="p-3 font-extrabold uppercase text-emerald-600 dark:text-emerald-400">{language === 'vi' ? 'Công Thức Tính Lương C&B' : 'C&B Pay Formula'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">1. Làm thêm vào Ngày Thường (Sau giờ hành chính)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-black text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">150% Lương</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-xs">Lương giờ thực tế &times; 150% &times; Số giờ OT</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">2. Làm thêm vào Ngày Nghỉ Hàng Tuần (Thứ Bảy / Chủ Nhật)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-black text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">200% Lương</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-xs">Lương giờ thực tế &times; 200% &times; Số giờ OT</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-rose-600 dark:text-rose-400">3. Làm thêm vào Ngày Lễ, Tết, Ngày Nghỉ Có Hưởng Lương</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-black text-xs bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">300% Lương</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-xs">Lương giờ thực tế &times; 300% (Chưa kể lương ngày nghỉ lễ)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">4. Phụ cấp Làm việc vào Ban Đêm (22h00 &minus; 06h00)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-black text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">+30% Ca Đêm</span></td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-xs">Cộng thêm tối thiểu 30% lương theo quy chế</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM OT */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm soát trần giờ Luật Lao động, đối soát máy chấm công & chặn làm thêm tự phát' : 'Enforce legal hour caps, biometric log verification & prevent unauthorized overtime'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs"><Lock className="w-4 h-4 text-indigo-500" /><span>Luật Thép 1: Chặn Vi phạm Trần Luật Lao động</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động quét giờ OT lũy kế. <strong>Cảnh báo & chặn tạo đơn khi nhân viên đạt $\ge 40$ giờ/tháng hoặc $\ge 200$ giờ/năm</strong> để tuân thủ pháp luật.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs"><ShieldAlert className="w-4 h-4 text-amber-500" /><span>Luật Thép 2: In/Out Auto-Match Máy Chấm Công</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống chỉ tính công OT khi <strong>khớp với log quét vân tay / Face ID thực tế</strong> sau giờ làm việc. Giờ OT được tính = Min(Giờ đăng ký, Giờ quẹt thẻ thực tế).</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs"><Clock className="w-4 h-4 text-rose-500" /><span>Luật Thép 3: Đăng ký Trước Ca (Chặn Hồi Tố)</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Phải nộp đơn OT trước khi bắt đầu ca <strong>ít nhất 2 giờ</strong>. Nghiêm cấm tạo đơn hồi tố sau khi đã làm (trừ sự cố khẩn cấp có TBP xác nhận).</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN APP */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC TRÊN APP HRMS (6 TRƯỜNG BẮT BUỘC)' : 'STAGE 3: HRMS MOBILE APP OVERTIME DECLARATION'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Nhân viên / Trưởng nhóm thực hiện 4 bước khai báo thông tin ca OT' : 'Employee or Team Lead completes 4 steps on Employee Self-Service Mobile App'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Thao tác trên App:' : '4 App Operating Steps:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở App HRMS $\rightarrow$ Đăng nhập tài khoản cá nhân</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn tính năng "Đăng ký Làm thêm giờ / Tăng ca (OT)"</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Khai báo 6 trường bắt buộc (Khung giờ, hình thức nhận)</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra lại thông tin $\rightarrow$ Bấm Gửi Đơn</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Loại ngày OT (Thường/CN/Lễ)', '2. Giờ Bắt đầu ca OT', '3. Giờ Kết thúc ca OT', '4. Tổng Số giờ dự kiến (Tự tính)', '5. Lý do & Nội dung công việc', '6. Hình thức: Lương OT / Nghỉ bù'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI PHÊ DUYỆT 4 CẤP */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI PHÊ DUYỆT 4 CẤP (APPROVAL WORKFLOW CHAIN)' : 'STAGE 4: 4-LEVEL APPROVAL CHAIN'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Chuỗi rẽ nhánh 4 tầng kiểm soát từ Quản lý phòng ban tới Chốt lương C&B' : '4-Tier approval chain from line manager to C&B payroll lock'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {otApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Đơn làm thêm giờ lập tức Hủy, không tính tiền lương làm thêm giờ.' : '* If any level clicks [Reject]: Overtime request is immediately canceled, no overtime pay issued.'}</span>
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & CẢNH BÁO */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kết quả tính lương / nghỉ bù & quy định bắt buộc khi làm thêm giờ' : 'Final payment / comp-time outcome and mandatory compliance notice'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt & Khớp Log Quẹt Thẻ]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất chuỗi duyệt. Hệ thống tự động đẩy số giờ OT vào Bảng tính lương C&B tháng (áp hệ số 150/200/300%) hoặc cộng vào Quỹ ngày nghỉ bù (Comp-time).</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Không Khớp Giờ Quét Thẻ / Từ Chối]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Nếu giờ quét vân tay thực tế không đủ hoặc bị Quản lý từ chối $\rightarrow$ Đơn không hợp lệ, không phát sinh chi phí làm thêm giờ.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider"><AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" /><span>LƯU Ý TỐI QUAN TRỌNG VỀ QUY ĐỊNH LÀM THÊM GIỜ (OT):</span></div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Làm thêm giờ CHỈ ĐƯỢC CÔNG NHẬN VÀ TRẢ LƯƠNG khi đơn đã hoàn tất phê duyệt trên hệ thống VÀ CÓ DỮ LIỆU CHẤM CÔNG THỰC TẾ TRÙNG KHỚP. Tự ý ở lại nơi làm việc mà không có đơn duyệt trước = Không tính làm thêm giờ.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 6. LEAVE WORKFLOW (SOP ATT02) CONTENT                                    */}
      {/* ========================================================================= */}
      {isLeaveProcess && (
        <>
          {/* STAGE 1: ĐỐI CHIẾU THỜI GIAN (QUY ĐỊNH BÁO TRƯỚC) */}
          {(activeStageTab === 0 || activeStageTab === 1) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 1</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 1: ĐỐI CHIẾU THỜI GIAN (QUY ĐỊNH BÁO TRƯỚC)' : 'STAGE 1: ADVANCE NOTICE RULE CHECK'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Đảm bảo thời gian nộp đơn đủ hạn mức trước khi xin nghỉ phép' : 'Validate minimum required advance notice before taking leave'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Tổng số ngày xin nghỉ' : 'Total Leave Days'}</th>
                      <th className="p-3 font-extrabold uppercase">{language === 'vi' ? 'Thời gian nộp đơn tối thiểu' : 'Minimum Advance Notice'}</th>
                      <th className="p-3 font-extrabold uppercase text-amber-600 dark:text-amber-400">{language === 'vi' ? 'Giải pháp xử lý nếu vi phạm' : 'Penalty / Fix Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">&le; 01 ngày (1 Ngày phép)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-md font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Trước 24 giờ</span></td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">Lùi ngày bắt đầu nghỉ tương ứng</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">Từ 1.5 đến 03 ngày</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-md font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">Trước 05 - 07 ngày</span></td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">Lùi ngày bắt đầu nghỉ tương ứng</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-bold text-purple-600 dark:text-purple-400">&gt; 03 ngày (Dài ngày)</td>
                      <td className="p-3"><span className="px-2.5 py-1 rounded-md font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Trước 15 ngày</span></td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">Lùi ngày bắt đầu nghỉ tương ứng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM */}
          {(activeStageTab === 0 || activeStageTab === 2) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Tự động kiểm tra & chặn ngay các đơn nghỉ vi phạm "Luật thép" của doanh nghiệp' : 'Auto-inspect and block requests violating core enterprise rules'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs"><Lock className="w-4 h-4 text-indigo-500" /><span>Luật Thép 1: Ràng buộc Người bàn giao</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Phải chọn người nhận bàn giao hợp lệ. <strong>Không được tự chọn chính mình</strong>, và người bàn giao không được trùng đơn nghỉ phép cùng thời gian.</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs"><ShieldAlert className="w-4 h-4 text-amber-500" /><span>Luật Thép 2: Chống lách luật "Băm nhỏ đơn"</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động quét lịch sử đơn nghỉ. <strong>Không cho phép nộp 2 đơn liên tiếp</strong> để tránh cấp duyệt cao hơn (Tự động ép gộp đơn).</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs"><XCircle className="w-4 h-4 text-rose-500" /><span>Luật Thép 3: Trùng Lịch Công ty / Ngày Lễ</span></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Tự động từ chối & chặn nộp đơn nếu ngày xin nghỉ trùng với Ngày Lễ công ty hoặc Ngày diễn ra sự kiện toàn công ty bắt buộc.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: THAO TÁC TRÊN APP HRMS */}
          {(activeStageTab === 0 || activeStageTab === 3) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 3</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 3: THAO TÁC TRÊN APP HRMS (6 TRƯỜNG BẮT BUỘC)' : 'STAGE 3: HRMS MOBILE APP DECLARATION'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Nhân viên thực hiện 4 bước khai báo thông tin đơn nghỉ trên Portal / App' : 'Employee completes 4 steps on Employee Self-Service Mobile App'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 block">{language === 'vi' ? '4 Bước Thao tác trên App:' : '4 App Operating Steps:'}</span>
                  <div className="space-y-1.5 font-medium">
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở App HRMS $\rightarrow$ Đăng nhập tài khoản</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn tính năng "Đăng ký nghỉ phép"</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Khai báo 6 trường bắt buộc (xem cột bên phải)</span></div>
                    <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra lại thông tin $\rightarrow$ Bấm Gửi Đơn</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['1. Loại phép nghỉ (Phép năm / KL)', '2. Ngày Bắt đầu', '3. Ngày Kết thúc', '4. Tổng Số ngày nghỉ (Tự tính)', '5. Lý do nghỉ chi tiết', '6. Người nhận bàn giao (Hợp lệ)'].map((f, fIdx) => (
                      <div key={fIdx} className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: CHUỖI PHÊ DUYỆT 5 CẤP */}
          {(activeStageTab === 0 || activeStageTab === 4) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 4</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 4: CHUỖI PHÊ DUYỆT 5 CẤP (APPROVAL WORKFLOW CHAIN)' : 'STAGE 4: 5-LEVEL APPROVAL CHAIN'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Chuỗi rẽ nhánh 5 tầng kiểm soát thẩm quyền phê duyệt từ Bàn giao tới HR Admin' : '5-Tier hierarchical approval chain from handover recipient to HR Admin'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {leaveApprovalChain.map((step, idx) => (
                  <div key={idx} className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold leading-tight">{language === 'vi' ? step.title : step.titleEn}</h4>
                      <p className="text-xs opacity-80 leading-relaxed mt-1">{language === 'vi' ? step.desc : step.descEn}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Đơn lập tức Hủy hoặc Trả về cho Người lao động kèm lý do cụ thể để chỉnh sửa nộp lại.' : '* If any level clicks [Reject]: Request is immediately canceled or returned to Employee with specific reasons.'}</span>
              </div>
            </div>
          )}

          {/* STAGE 5: KẾT QUẢ & LƯU Ý PHÁP LÝ */}
          {(activeStageTab === 0 || activeStageTab === 5) && (
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 5</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span></h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kết quả trạng thái đơn & quy định pháp lý bắt buộc khi xin nghỉ phép' : 'Final status outcome and mandatory compliance notice'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất 100% chuỗi 5 cấp duyệt. Nhân viên được nghỉ hợp lệ, hệ thống tự động trừ Quỹ phép năm & tính 100% lương ngày nghỉ vào Bảng lương C&B.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Yêu Cầu Chỉnh Sửa]</span></div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Xem chi tiết lý do từ chối trên App $\rightarrow$ Chỉnh sửa thông tin $\rightarrow$ Gửi lại chuỗi phê duyệt từ đầu.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm tracking-wider"><AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" /><span>LƯU Ý TỐI QUAN TRỌNG VỀ QUY ĐỊNH NGHỈ PHÉP:</span></div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-rose-100">
                  Việc nghỉ phép CHỈ HỢP LỆ khi đơn đã hoàn tất toàn bộ chuỗi phê duyệt trên hệ thống TRƯỚC KHI BẠN BẮT ĐẦU NGHỈ. Tự ý nghỉ khi đơn chưa duyệt xong = Vắng mặt không phép (KL).
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
