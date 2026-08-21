import React from 'react'
import {
  Target,
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

export const RecruitmentRequisitionFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const recApprovalChain: ApprovalChainItem[] = [
    { level: 'Cấp 1', title: 'Quản lý trực tiếp (TBP)', titleEn: 'Direct Department Head (TBP)', desc: 'Xác định nhu cầu, mô tả JD & dải lương đề xuất', descEn: 'Identify hiring needs, JD specs & salary range', color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { level: 'Cấp 2', title: 'Trưởng phòng Nhân sự (HRM / HRD)', titleEn: 'Head of HR (HRM / HRD)', desc: 'Thẩm định định biên, nguồn cung ứng viên & kênh tuyển', descEn: 'Verify headcount quota, talent supply & hiring channels', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { level: 'Cấp 3', title: 'Ban Giám Đốc (BOM)', titleEn: 'Board of Management (BOM)', desc: 'Phê duyệt hạn mức ngân sách People Cost vị trí mới', descEn: 'Approve People Cost budget cap for the requisition', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { level: 'Cấp 4', title: 'Chuyên viên Tuyển dụng (Recruiter PIC)', titleEn: 'Recruiter PIC', desc: 'Tiếp nhận Requisition ID & kích hoạt Job Posting đa kênh', descEn: 'Receive Requisition ID & publish multi-channel job posts', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ]

  return (
    <>
      {/* STAGE 1: ĐỐI CHIẾU ĐỊNH BIÊN NHÂN SỰ & HẠN MỨC NGÂN SÁCH */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Luồng duyệt nhanh (TBP -&gt; HRM duyệt trong 24h -&gt; Mở đăng tuyển)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">2. Tuyển Thay Thế Nhân Sự Nghỉ Việc (Replacement)</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Đã có Đơn thôi việc được duyệt (EMP15)</span></td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">Giữ nguyên Job Grade & khung dải lương cũ của nhân sự tiền nhiệm</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">3. Tuyển Vượt Định Biên / Mở Rộng Dự Án Mới (Over Budget)</td>
                  <td className="p-3"><span className="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Vượt hạn mức định biên đầu năm</span></td>
                  <td className="p-3 text-amber-700 dark:text-amber-300 font-semibold">Bắt buộc nộp Tờ trình People Cost -&gt; Trình Ban Giám Đốc (BOM) phê duyệt</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STAGE 2: VƯỢT QUA MÀNG LỌC KỸ THUẬT TỰ ĐỘNG */}
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Rà soát danh mục chức danh chuẩn, chặn vượt trần ngân sách lương & cảnh báo tỷ lệ biến động' : 'Validate job catalog, enforce salary ceiling & monitor turnover rate'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>Luật Thép 1: Ràng buộc Chức Danh từ Job Catalog (MD-06)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Chức danh cần tuyển <strong>bắt buộc phải chọn từ Từ điển Khung Năng lực (MD-06)</strong> đã ban hành. Không cho phép tạo chức danh tự do ngoài danh mục.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase text-[11px] sm:text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Luật Thép 2: Chặn Vượt Trần Ngân Sách Quỹ Lương</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Hệ thống tự động so khớp dải lương đề xuất với <strong>Khung Ngạch Bậc Lương (MD-07)</strong>. Nếu vượt trần, hệ thống khóa và tự động leo thang lên Ban Giám Đốc duyệt.</p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-2 relative ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
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
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span><span>Mở Manager Portal -&gt; Menu "Yêu cầu Tuyển dụng"</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span><span>Chọn chức danh từ Job Catalog (Hệ thống load sẵn JD chuẩn)</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span><span>Nhập số lượng, ngày cần nhận việc & dải ngân sách lương đề xuất</span></div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}><span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span><span>Kiểm tra đối soát định biên tự động -&gt; Bấm Gửi Trình Duyệt</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold uppercase text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 block">{language === 'vi' ? '6 Trường Thông tin Bắt buộc Khai báo:' : '6 Mandatory Input Fields:'}</span>
              <div className="grid grid-cols-2 gap-2">
                {['1. Chức danh tuyển dụng (Từ MD-06)', '2. Số lượng nhân sự cần tuyển', '3. Lý do tuyển (Mới / Thay thế)', '4. Ngày mục tiêu nhận việc (Target Date)', '5. Dải lương đề xuất (Min - Max)', '6. Bản mô tả công việc (JD đính kèm)'].map((f, fIdx) => (
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
            <span>{language === 'vi' ? '* Bất kỳ cấp nào bấm [Từ chối]: Yêu cầu tuyển dụng lập tức đóng hoặc Trả về cho TBP để chỉnh sửa lại định biên/JD.' : '* If any level clicks [Reject]: Recruitment requisition is canceled or returned to Department Head for adjustment.'}</span>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Kích hoạt Ticket Requisition ID, phân công Recruiter & quy định pháp lý tuyển dụng' : 'Requisition ID generation, Recruiter assignment and legal compliance notice'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase"><CheckCircle2 className="w-4.5 h-4.5" /><span>Trạng thái [Đã Phê Duyệt & Mở Tuyển Dụng]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Hoàn tất chuỗi duyệt. Hệ thống tự động sinh <strong>Mã Requisition ID</strong>, gán Chuyên viên tuyển dụng PIC và đồng bộ tin tuyển dụng lên Career Portal & LinkedIn/TopCV.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold uppercase"><AlertTriangle className="w-4.5 h-4.5" /><span>Trạng thái [Từ Chối / Yêu Cầu Tờ Trình People Cost]</span></div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">Yêu cầu tuyển dụng vượt định biên hoặc ngân sách chưa được chấp thuận -&gt; TBP cần bổ sung giải trình hiệu quả kinh doanh trước khi trình BOM duyệt lại.</p>
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
  )
}
