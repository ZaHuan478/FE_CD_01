import React from 'react'
import {
  LogOut,
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

export const OffboardingHandoverFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const offApprovalChain: ApprovalChainItem[] = [
    { level: 'Bên 1', title: 'Bàn giao Công việc (TBP)', titleEn: '1. Work Handover (Dept Head)', desc: 'Chuyển giao tài liệu, đầu việc & người nhận việc xác nhận', descEn: 'Transfer tasks, files & successor confirmation', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Bên 2', title: 'Thu hồi Tài sản IT (IT Admin)', titleEn: '2. IT Assets & Revoke Access', desc: 'Thu hồi Laptop, đóng tài khoản Email, VPN, Domain lúc 18h', descEn: 'Collect laptop, revoke Email, VPN, Domain at 18:00', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Bên 3', title: 'Hành chính & Công nợ (Admin/Fin)', titleEn: '3. Admin & Debt Clearance', desc: 'Thu thẻ NV, đồng phục, chốt quyết toán tạm ứng/công nợ', descEn: 'Collect ID card, uniform & clear financial advances', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Bên 4', title: 'Quyết toán C&B & Chốt Sổ BHXH', titleEn: '4. Final Pay & Social Insurance', desc: 'Tính tiền phép tồn, lập Báo giảm BHXH (INS04) & chốt sổ', descEn: 'Pay unused leave, file Social Insurance exit (INS04) & close book', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU THỜI HẠN BÁO TRƯỚC THÔI VIỆC (LUẬT LAO ĐỘNG ĐIỀU 35) */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Luật Thép 1: Rà Soát Cam Kết Đào Tạo</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống quét lịch sử đào tạo. Nếu nhân sự còn <strong>Hợp đồng cam kết phục vụ</strong> chưa hết hạn, hệ thống tự tính chi phí bồi hoàn trừ vào quyết toán.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Luật Thép 2: Chốt Công Nợ Tạm Ứng Tài Chính</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Chặn hoàn tất thủ tục nếu nhân sự còn <strong>khoản tạm ứng công tác phí / công nợ chưa hoàn ứng</strong> với Kế toán.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Nhân viên mở App/Portal -&gt; Menu "Đăng ký Thôi việc"</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn lý do nghỉ & chọn Ngày làm việc cuối cùng theo luật định</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Hoàn thành bài Khảo sát phỏng vấn nghỉ việc (Exit Interview)</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Hệ thống tự động kích hoạt Checklist Bàn giao 4 Bên</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
              <div className="grid grid-cols-2 gap-2">
                {['1. Lý do thôi việc chi tiết', '2. Ngày làm việc cuối cùng (Last Day)', '3. Người tiếp nhận bàn giao công việc', '4. Khảo sát Exit Interview', '5. Danh mục tài sản IT đang mượn', '6. Thông tin nhận tiền quyết toán'].map((f, fIdx) => (
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

      {/* STAGE 4: CHUỖI BÀN GIAO 4 BÊN LIÊN PHÒNG BAN */}
      {(activeStageTab === 0 || activeStageTab === 4) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <span>{language === 'vi' ? '* Bắt buộc cả 4 bên đều phải bấm [Xác nhận Hoàn tất]: Hệ thống mới kích hoạt phát hành Quyết định Chấm dứt HĐLĐ.' : '* All 4 stakeholders must sign-off before Termination Decision and Final Pay can be released.'}</span>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Quyết toán lương thôi việc, thanh toán phép tồn, báo giảm BHXH (INS04) & chốt sổ' : 'Final pay calculation, unused leave settlement, social insurance exit & book return'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Hoàn Tất Thôi Việc & Quyết Toán]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Ban hành <strong>Quyết định chấm dứt HĐLĐ</strong>, chi trả tiền lương và tiền ngày phép tồn chưa nghỉ vào đợt thanh toán Final Pay, nộp hồ sơ Báo giảm BHXH (INS04) và trả Sổ BHXH.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Treo Bàn Giao / Chưa Hoàn Tài Sản]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Nếu chưa bàn giao máy tính IT hoặc chưa hoàn ứng công nợ -&gt; Hệ thống tạm giữ khoản tiền quyết toán thôi việc cho đến khi có xác nhận bổ sung.</p>
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
  )
}
