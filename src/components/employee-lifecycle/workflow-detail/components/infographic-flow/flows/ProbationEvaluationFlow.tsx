import React from 'react'
import {
  Clock,
  Smartphone,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  ShieldAlert
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps, ApprovalChainItem } from '../types'

export const ProbationEvaluationFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const probApprovalChain: ApprovalChainItem[] = [
    { level: 'Cấp 1', title: 'Đánh giá 360 & TBP Chấm Điểm', titleEn: '360 Evaluation & Line Manager', desc: 'Chấm điểm KPI thử việc & đề xuất: Tái ký / Gia hạn / Dừng', descEn: 'Score probation KPI & propose: Renewal / Extension / Terminate', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Trưởng phòng Nhân sự (HRM)', titleEn: 'HR Manager Review', desc: 'Thẩm định khung lương chính thức & phân luồng pháp lý', descEn: 'Review official pay grade & legal routing', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM) Ký Duyệt', titleEn: 'BOM Sign-off', desc: 'Ký số HĐLĐ chính thức 12/24M hoặc Quyết định chấm dứt', descEn: 'E-sign official 12/24M Labor Contract or Termination notice', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'C&B Báo Tăng BHXH (INS02)', titleEn: 'C&B / Insurance Specialist', desc: 'Kích hoạt hợp đồng chính thức & nộp hồ sơ Báo tăng BHXH', descEn: 'Activate official profile & submit Social Insurance registration', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU THỜI HẠN & CẢNH BÁO TỰ ĐỘNG TRƯỚC 30 NGÀY */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm soát bắt buộc đánh giá 2 chiều & trần thời gian thử việc theo Luật Lao động' : 'Enforce mandatory 360 review & statutory probation length limit'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Luật Thép 1: Cảnh Báo Tự Động Trước 30 Ngày</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống <strong>tự động gửi thông báo nhắc nhở</strong> tới email & app của Quản lý và Nhân viên trước ngày hết hạn 30 ngày. Khóa chức năng duyệt nếu quá hạn.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Luật Thép 2: Bắt Buộc Đánh Giá 2 Chiều (360)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Bắt buộc nhân viên hoàn tất <strong>Form tự đánh giá</strong> trước khi Trưởng bộ phận chấm điểm KPI. Không thể ký HĐ chính thức nếu thiếu phiếu đánh giá.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Nhân viên mở Employee Portal -&gt; Điền Phiếu tự đánh giá thử việc</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Trưởng bộ phận (TBP) chấm điểm KPI theo thang điểm 100</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>TBP chọn đề xuất: Đạt (Tái ký HĐLĐ) / Gia hạn / Không đạt</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Hệ thống tự động phân luồng rẽ nhánh trình duyệt HRD & BOM</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
              <div className="grid grid-cols-2 gap-2">
                {['1. Điểm KPI tự đánh giá của NV', '2. Điểm KPI TBP chấm (Thang 100)', '3. Nhận xét ưu & nhược điểm', '4. Đề xuất: Đạt / Gia hạn / Dừng', '5. Mức lương chính thức 100%', '6. Thời hạn HĐ tái ký (12M/24M)'].map((f, fIdx) => (
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

      {/* STAGE 4: CHUỖI RẼ NHÁNH ĐIỀU KIỆN THEO ĐIỂM KPI (3 NHÁNH) */}
      {(activeStageTab === 0 || activeStageTab === 4) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-emerald-600 text-white">🟢 NHÁNH 1 (KPI &ge; 85%)</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">ĐẠT XUẤT SẮC / TỐT</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                Tự động sinh <strong>HĐLĐ chính thức 12 hoặc 24 tháng</strong> -&gt; Ban Giám Đốc ký số -&gt; Tự động trích xuất thông tin <strong>Báo tăng BHXH (INS02)</strong> và áp lương 100%.
              </p>
            </div>

            {/* Branch 2: Extend */}
            <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-amber-600 text-white">🟡 NHÁNH 2 (KPI 70 - 84%)</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">CẦN CẢI THIỆN</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                Gia hạn thử việc thêm <strong>tối đa 30 ngày</strong> (nếu chức danh cho phép) -&gt; TBP lập Kế hoạch cải thiện hiệu suất (PIP) và tái đánh giá lần 2.
              </p>
            </div>

            {/* Branch 3: Terminate */}
            <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg font-black text-xs bg-rose-600 text-white">🔴 NHÁNH 3 (KPI &lt; 70%)</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">KHÔNG ĐẠT</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                Ban hành <strong>Thông báo chấm dứt thử việc</strong> trước ngày hết hạn 03 ngày -&gt; Thanh toán 85% lương ngày công thực tế và đóng hồ sơ nhân viên.
              </p>
            </div>
          </div>

          {/* Approval Chain Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {probApprovalChain.map((step, idx) => (
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Chuyển đổi trạng thái nhân sự chính thức, phát hành HĐLĐ & tham gia bảo hiểm xã hội' : 'Official status conversion, labor contract issuance & social insurance enrollment'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Tái Ký HĐLĐ Chính Thức]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Chuyển trạng thái hồ sơ sang <strong>"Nhân viên Chính thức"</strong>. Tự động áp 100% lương chính thức và đưa vào kỳ Báo tăng BHXH/BHYT/BHTN gần nhất.</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
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
              Phải hoàn tất đánh giá và ký HĐLĐ chính thức TRƯỚC KHI HẾT HẠN THỬ VIỆC. Nếu để nhân viên tiếp tục làm việc mà không ký HĐ mới -&gt; HĐ mặc nhiên chuyển thành Hợp đồng lao động chính thức theo quy định pháp luật.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
