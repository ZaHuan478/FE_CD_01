import React from 'react'
import {
  Clock,
  ShieldCheck,
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

export const LeaveManagementFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const leaveApprovalChain: ApprovalChainItem[] = [
    { level: 'Cấp 0', title: 'Người nhận bàn giao', titleEn: 'Delegated Person', desc: 'Đánh giá khả năng tiếp nhận bàn giao công việc', descEn: 'Evaluate handover capability', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 1', title: 'Quản lý trực tiếp', titleEn: 'Direct Line Manager', desc: 'Xét tính hợp lý & phân công công việc phòng ban', descEn: 'Assess validity & department workload', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 2', title: 'Quản lý kế tiếp', titleEn: 'Next Level Manager', desc: 'Phê duyệt thẩm định cấp quản lý cao hơn', descEn: 'Review & higher level approval', color: 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    { level: 'Cấp 3', title: 'Giám đốc', titleEn: 'Executive Director', desc: 'Kiểm soát đơn nghỉ dài ngày (> 3 ngày) hoặc trọng yếu', descEn: 'Control long-term or key leave requests', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Thư ký TT QLNS (Nhân sự)', titleEn: 'HR Admin / Secretary', desc: 'Chốt chặn cuối, cập nhật phép & ghi nhận chấm công', descEn: 'Final check, deduct leave & update payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU THỜI GIAN (QUY ĐỊNH BÁO TRƯỚC) */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs"><Lock className="w-4 h-4 text-indigo-500" /><span>Luật Thép 1: Ràng buộc Người bàn giao</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Phải chọn người nhận bàn giao hợp lệ. <strong>Không được tự chọn chính mình</strong>, và người bàn giao không được trùng đơn nghỉ phép cùng thời gian.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs"><ShieldAlert className="w-4 h-4 text-amber-500" /><span>Luật Thép 2: Chống lách luật "Băm nhỏ đơn"</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động quét lịch sử đơn nghỉ. <strong>Không cho phép nộp 2 đơn liên tiếp</strong> để tránh cấp duyệt cao hơn (Tự động ép gộp đơn).</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs"><XCircle className="w-4 h-4 text-rose-500" /><span>Luật Thép 3: Trùng Lịch Công ty / Ngày Lễ</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Tự động từ chối & chặn nộp đơn nếu ngày xin nghỉ trùng với Ngày Lễ công ty hoặc Ngày diễn ra sự kiện toàn công ty bắt buộc.</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: THAO TÁC TRÊN APP HRMS */}
      {(activeStageTab === 0 || activeStageTab === 3) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở App HRMS -&gt; Đăng nhập tài khoản</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn tính năng "Đăng ký nghỉ phép"</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Khai báo 6 trường bắt buộc (xem cột bên phải)</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra lại thông tin -&gt; Bấm Gửi Đơn</span></div>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Đơn lập tức Hủy hoặc Trả về cho Người lao động kèm lý do cụ thể để chỉnh sửa nộp lại.' : '* If any level clicks [Reject]: Request is immediately canceled or returned to Employee with specific reasons.'}</span>
          </div>
        </div>
      )}

      {/* STAGE 5: KẾT QUẢ & LƯU Ý PHÁP LÝ */}
      {(activeStageTab === 0 || activeStageTab === 5) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất 100% chuỗi 5 cấp duyệt. Nhân viên được nghỉ hợp lệ, hệ thống tự động trừ Quỹ phép năm & tính 100% lương ngày nghỉ vào Bảng lương C&B.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Yêu Cầu Chỉnh Sửa]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Xem chi tiết lý do từ chối trên App -&gt; Chỉnh sửa thông tin -&gt; Gửi lại chuỗi phê duyệt từ đầu.</p>
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
  )
}
