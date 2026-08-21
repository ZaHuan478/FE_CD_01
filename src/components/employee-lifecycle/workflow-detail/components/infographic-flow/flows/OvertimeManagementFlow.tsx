import React from 'react'
import {
  Percent,
  ShieldCheck,
  Smartphone,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  ShieldAlert,
  Clock
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps, ApprovalChainItem } from '../types'

export const OvertimeManagementFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const otApprovalChain: ApprovalChainItem[] = [
    { level: 'Cấp 1', title: 'Quản lý trực tiếp (TBP)', titleEn: 'Direct Line Manager', desc: 'Xét tính cấp thiết của công việc & ngân sách OT phòng ban', descEn: 'Assess urgency & department OT budget', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Quản lý kế tiếp / Quản lý ca', titleEn: 'Shift / Next Manager', desc: 'Phê duyệt điều phối nhân lực và ca làm việc', descEn: 'Approve manpower & shift scheduling', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Giám đốc Khối / Ban Giám Đốc', titleEn: 'Division Director / BOM', desc: 'Phê duyệt đơn OT ngày Lễ/Tết hoặc OT vượt 20h/tháng', descEn: 'Approve Holiday OT or OT > 20h/month', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Chuyên viên C&B Chấm công', titleEn: 'C&B Specialist', desc: 'Đối soát log quét vân tay thực tế & chốt bảng lương OT', descEn: 'Match physical biometric log & lock OT payroll', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU HỆ SỐ LƯƠNG LÀM THÊM GIỜ */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">GĐ 2</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG (AI RÀ SOÁT NGẦM)' : 'STAGE 2: AUTOMATED AI TECHNICAL GATES'}</span></h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kiểm soát trần giờ Luật Lao động, đối soát máy chấm công & chặn làm thêm tự phát' : 'Enforce legal hour caps, biometric log verification & prevent unauthorized overtime'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs"><Lock className="w-4 h-4 text-indigo-500" /><span>Luật Thép 1: Chặn Vi phạm Trần Luật Lao động</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động quét giờ OT lũy kế. <strong>Cảnh báo & chặn tạo đơn khi nhân viên đạt $\ge 40$ giờ/tháng hoặc $\ge 200$ giờ/năm</strong> để tuân thủ pháp luật.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs"><ShieldAlert className="w-4 h-4 text-amber-500" /><span>Luật Thép 2: In/Out Auto-Match Máy Chấm Công</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống chỉ tính công OT khi <strong>khớp với log quét vân tay / Face ID thực tế</strong> sau giờ làm việc. Giờ OT được tính = Min(Giờ đăng ký, Giờ quẹt thẻ thực tế).</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[11px] sm:text-xs"><Clock className="w-4 h-4 text-rose-500" /><span>Luật Thép 3: Đăng ký Trước Ca (Chặn Hồi Tố)</span></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Phải nộp đơn OT trước khi bắt đầu ca <strong>ít nhất 2 giờ</strong>. Nghiêm cấm tạo đơn hồi tố sau khi đã làm (trừ sự cố khẩn cấp có TBP xác nhận).</p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: THAO TÁC TRÊN APP */}
      {(activeStageTab === 0 || activeStageTab === 3) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở App HRMS -&gt; Đăng nhập tài khoản cá nhân</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn tính năng "Đăng ký Làm thêm giờ / Tăng ca (OT)"</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Khai báo 6 trường bắt buộc (Khung giờ, hình thức nhận)</span></div>
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra lại thông tin -&gt; Bấm Gửi Đơn</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
              <div className="grid grid-cols-2 gap-2">
                {['1. Loại ngày OT (Thường/CN/Lễ)', '2. Giờ Bắt đầu ca OT', '3. Giờ Kết thúc ca OT', '4. Tổng Số giờ dự kiến (Tự tính)', '5. Lý do & Nội dung công việc', '6. Hình thức: Lương OT / Nghỉ bù'].map((f, fIdx) => (
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

      {/* STAGE 4: CHUỖI PHÊ DUYỆT 4 CẤP */}
      {(activeStageTab === 0 || activeStageTab === 4) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
            <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Đơn làm thêm giờ lập tức Hủy, không tính tiền lương làm thêm giờ.' : '* If any level clicks [Reject]: Overtime request is immediately canceled, no overtime pay issued.'}</span>
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
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /><span>{language === 'vi' ? 'GIAI ĐOẠN 5: KẾT QUẢ & CẢNH BÁO TỐI QUAN TRỌNG' : 'STAGE 5: OUTCOMES & CRITICAL POLICY NOTICE'}</span></h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kết quả tính lương / nghỉ bù & quy định bắt buộc khi làm thêm giờ' : 'Final payment / comp-time outcome and mandatory compliance notice'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt & Khớp Log Quẹt Thẻ]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất chuỗi duyệt. Hệ thống tự động đẩy số giờ OT vào Bảng tính lương C&B tháng (áp hệ số 150/200/300%) hoặc cộng vào Quỹ ngày nghỉ bù (Comp-time).</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Không Khớp Giờ Quét Thẻ / Từ Chối]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Nếu giờ quét vân tay thực tế không đủ hoặc bị Quản lý từ chối -&gt; Đơn không hợp lệ, không phát sinh chi phí làm thêm giờ.</p>
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
  )
}
