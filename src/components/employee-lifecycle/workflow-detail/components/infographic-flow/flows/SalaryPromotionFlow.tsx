import React from 'react'
import {
  DollarSign,
  Smartphone,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ShieldAlert
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps, ApprovalChainItem } from '../types'

export const SalaryPromotionFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const promApprovalChain: ApprovalChainItem[] = [
    { level: 'Cấp 1', title: 'Trưởng bộ phận (TBP)', titleEn: 'Direct Department Head', desc: 'Lập đề xuất tăng lương hoặc bổ nhiệm vị trí quản lý mới', descEn: 'Propose merit increase or managerial appointment', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Chuyên viên C&B Thẩm định', titleEn: 'C&B Specialist', desc: 'Đối soát khung ngạch bậc (MD-07) & Quỹ lương phòng ban', descEn: 'Match salary scale (MD-07) & department budget cap', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM)', titleEn: 'Board of Management (BOM)', desc: 'Phê duyệt Tăng vượt khung / Quyết định Bổ nhiệm cán bộ', descEn: 'Approve Out-of-grade increase / Management Appointment', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'HR Cập nhật Org Chart & Bảng Lương', titleEn: 'HR Admin & Payroll Execution', desc: 'Phát hành Phụ lục HĐLĐ, đổi Org Chart & áp lương PAY01', descEn: 'Issue Contract Addendum, update Org Chart & lock PAY01 payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU KHUNG NGẠCH BẬC & QUỸ LƯƠNG PHÒNG BAN */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">TBP -&gt; C&B thẩm định -&gt; HRD phê duyệt</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">2. Tăng Lương Vượt Khung / Đột Xuất (Out-of-Grade)</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Mức đề xuất vượt trần ngạch bậc hiện tại</span></td>
                  <td className="p-3 text-amber-700 dark:text-amber-300 font-semibold">Bắt buộc có Tờ trình People Cost -&gt; Ban Giám Đốc (BOM) phê duyệt</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-purple-600 dark:text-purple-400">3. Bổ Nhiệm Thăng Chức Quản Lý (Promotion)</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Chuyển nhóm Job Grade & Thêm Phụ cấp trách nhiệm</span></td>
                  <td className="p-3 text-purple-700 dark:text-purple-300 font-semibold">BOM phê duyệt Quyết định Bổ nhiệm -&gt; Tự động cập nhật Org Chart</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STAGE 2: 3 LUẬT THÉP AI RÀ SOÁT NGẦM */}
      {(activeStageTab === 0 || activeStageTab === 2) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Khung Ngạch Bậc (MD-07), điều kiện thâm niên & kiểm soát trần quỹ lương phòng ban' : 'Salary scale validation, tenure condition & department budget ceiling'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Luật Thép 1: Đối Soát Khung Ngạch Bậc (MD-07)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động so khớp mức lương mới với <strong>Bảng Thang Bảng Lương (MD-07)</strong>. Tự động cảnh báo nếu mức lương tăng không đúng bước bậc quy định.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Luật Thép 2: Ràng Buộc Thâm Niên & Điểm KPI</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Yêu cầu nhân sự có thâm niên tối thiểu <strong>$\ge 6$ tháng</strong> tại vị trí hiện tại và điểm KPI 2 kỳ gần nhất đạt <strong>Loại A hoặc B</strong> mới đủ điều kiện xét tăng lương.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở Manager Portal -&gt; Menu "Đề xuất Tăng lương / Bổ nhiệm"</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn nhân viên -&gt; Hệ thống tự load Mức lương hiện tại & Lịch sử KPI</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Nhập mức lương mới đề xuất, chọn chức vụ mới và ghi rõ thành tích</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra đối soát ngân sách quỹ lương -&gt; Bấm Gửi Trình Duyệt</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
              <div className="grid grid-cols-2 gap-2">
                {['1. Mức lương cơ bản hiện tại', '2. Mức lương đề xuất mới', '3. Tỷ lệ % tăng lương (Tự tính)', '4. Chức danh bổ nhiệm mới (nếu có)', '5. Phụ cấp trách nhiệm mới', '6. Lý do thành tích & Đóng góp'].map((f, fIdx) => (
                  <div key={fIdx} className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-emerald-600 text-white">🌿 NHÁNH 1: TĂNG LƯƠNG ĐỊNH KỲ (TRONG KHUNG)</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">LUỒNG NHANH</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                C&B thẩm định -&gt; <strong>Trưởng phòng Nhân sự (HRD) ký duyệt</strong> -&gt; Tự động sinh Phụ lục HĐLĐ và cập nhật mức lương mới vào Bảng lương PAY01 kỳ kế tiếp.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-amber-600 text-white">👑 NHÁNH 2: TĂNG VƯỢT KHUNG / BỔ NHIỆM QUẢN LÝ</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">TRÌNH DUYỆT BOM</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                TBP -&gt; C&B thẩm định -&gt; <strong>Ban Giám Đốc (BOM) ký Quyết định</strong> -&gt; Tự động cập nhật Sơ đồ tổ chức (Org Chart), phân quyền duyệt và áp lương mới.
              </p>
            </div>
          </div>

          {/* Approval Chain Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {promApprovalChain.map((step, idx) => (
              <div key={idx} className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between space-y-2 relative transition-all hover:-translate-y-1 ${step.color}`}>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg font-mono font-extrabold text-[10px] bg-white/80 dark:bg-slate-900/80 border">{step.level}</span>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Duyệt & Áp Lương Mới]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Tự động phát hành <strong>Phụ lục HĐLĐ điều chỉnh lương</strong> gửi nhân viên qua App, cập nhật mức lương mới vào Bảng lương PAY01 và cập nhật vị trí trên Org Chart.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Vượt Ngân Sách]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Đề xuất chưa được chấp thuận do vượt ngân sách hoặc chưa đủ điều kiện thâm niên -&gt; Giữ nguyên mức thu nhập cũ.</p>
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
  )
}
