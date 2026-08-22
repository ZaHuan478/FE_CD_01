import React from 'react'
import {
  Users,
  Target,
  GitPullRequest,
  CheckCircle2,
  Database,
  ArrowRight
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps } from '../types'

export const HeadcountBudgetFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  return (
    <>
      {/* GIAI ĐOẠN 1: THIẾT LẬP & THAM VẤN */}
      {(activeStageTab === 0 || activeStageTab === 1) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">1</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{language === 'vi' ? 'THIẾT LẬP & THAM VẤN (EMP01.01 - EMP01.02)' : 'SETUP & CONSULT (EMP01.01 - EMP01.02)'}</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EMP01.01 */}
            <div className="relative p-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">EMP01.01</span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{language === 'vi' ? 'Thiết lập định biên nhân sự' : 'Headcount Setup'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'TBP xây dựng định biên phòng ban. Yêu cầu: Năm, Phòng ban, Chức vụ, Cấp độ, Tháng chi tiết 12 tháng, Thu nhập.' : 'Dept Head plans headcount: Year, Dept, Roles, Grade, 12-month detail, Cost.'}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">Actor: TBP</div>
                </div>
              </div>
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-blue-400">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* EMP01.02 */}
            <div className="relative p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
              <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">EMP01.02</span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{language === 'vi' ? 'Tham vấn định biên' : 'Consult Headcount'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'HRBP phối hợp kiểm tra, đánh giá tính hợp lý của kế hoạch định biên theo ngân sách và chiến lược công ty.' : 'HRBP reviews and assesses rationality against budget and strategy.'}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">Actor: HRBP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIAI ĐOẠN 2: ĐIỀU CHỈNH & DUYỆT */}
      {(activeStageTab === 0 || activeStageTab === 2) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">2</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>{language === 'vi' ? 'ĐIỀU CHỈNH & PHÊ DUYỆT (EMP01.03 - EMP01.04)' : 'ADJUST & APPROVE (EMP01.03 - EMP01.04)'}</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EMP01.03 */}
            <div className="relative p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
              <span className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">EMP01.03</span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{language === 'vi' ? 'Điều chỉnh định biên' : 'Adjust Headcount'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'TBP tiếp nhận phản hồi từ HRBP và thực hiện điều chỉnh lại số liệu định biên (nếu có).' : 'Dept Head adjusts data based on HRBP feedback.'}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700">Actor: TBP</div>
                </div>
              </div>
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-purple-400">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* EMP01.04 */}
            <div className="relative p-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10">
              <span className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">EMP01.04</span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{language === 'vi' ? 'Duyệt định biên' : 'Approve Headcount'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'Ban Giám Đốc (BOD) xem xét và phê duyệt bản định biên cuối cùng của các phòng ban.' : 'BOD reviews and approves the final headcount plan.'}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700">Actor: BOD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIAI ĐOẠN 3: CẬP NHẬT HỆ THỐNG */}
      {(activeStageTab === 0 || activeStageTab === 3) && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">3</div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'vi' ? 'CẬP NHẬT KẾT QUẢ (EMP01.05)' : 'UPDATE RESULTS (EMP01.05)'}</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* EMP01.05 */}
            <div className="relative p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 max-w-2xl">
              <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">EMP01.05</span>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{language === 'vi' ? 'Cập nhật kết quả duyệt' : 'Update Approved Results'}</h4>
                  <p className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'Chuyên viên C&B cập nhật bản định biên đã duyệt vào hệ thống Master Data để làm trần giới hạn tuyển dụng và kiểm soát chi phí.' : 'C&B updates approved headcount into Master Data to set hiring limits and cost cap.'}</p>
                  <div className="mt-2 text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded inline-block text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">Actor: C&B</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
