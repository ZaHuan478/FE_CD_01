import React, { useState } from 'react'
import { ArrowRightLeft, Database, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import type { RoleDataFlow } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface RoleFlowSectionProps {
  availableRoleFlows: RoleDataFlow[]
  activeRoleTab: 'all' | 'candidate' | 'hr'
  setActiveRoleTab: (tab: 'all' | 'candidate' | 'hr') => void
  isDarkMode: boolean
}

export const RoleFlowSection: React.FC<RoleFlowSectionProps> = ({
  availableRoleFlows,
  activeRoleTab,
  setActiveRoleTab,
  isDarkMode
}) => {
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <div className={`rounded-2xl p-5 sm:p-6 border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className={`text-base sm:text-lg font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>
              {language === 'vi'
                ? 'LUỒNG ĐẦU VÀO ➔ ĐẦU RA THEO VAI TRÒ'
                : 'DUAL ROLE INPUT-OUTPUT MAPPING (CANDIDATE & HR)'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'vi'
              ? 'Phân định rõ ràng: Ứng viên/Nhân viên nhập gì & nhận gì VS. HR Admin/Quản lý nhập gì & hệ thống tự động sinh ra gì.'
              : 'Clear separation: What Candidate/Employee inputs & receives VS. What HR Admin/Manager inputs & system auto-generates.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {/* Filter Tabs */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
            <button
              type="button"
              onClick={() => setActiveRoleTab('all')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {language === 'vi' ? 'Tất cả Vai trò' : 'All Roles'}
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleTab('candidate')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'candidate'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              🧑‍💻 {language === 'vi' ? 'Ứng viên / NV' : 'Candidate / Employee'}
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleTab('hr')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'hr'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              💼 {language === 'vi' ? 'HR & Quản lý' : 'HR & Manager'}
            </button>
          </div>

          {/* Collapse Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs sm:text-sm font-bold transition-all cursor-pointer ${isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
          >
            <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* DUAL ROLE COMPARISON GRID */}
      {isExpanded && (
        <div className={`grid gap-5 animate-fadeIn ${activeRoleTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 w-full'}`}>
          {availableRoleFlows
            .filter((roleFlow) => {
              if (activeRoleTab === 'candidate') return roleFlow.roleType === 'candidate'
              if (activeRoleTab === 'hr') return roleFlow.roleType === 'hr'
              return true
            })
            .map((roleFlow, idx) => {
              const isCandidate = roleFlow.roleType === 'candidate'
              const actorDisplay = isCandidate
                ? (language === 'vi' ? '🧑‍💻 Ứng viên / Nhân viên' : '🧑‍💻 Candidate / Employee')
                : (language === 'vi' ? '💼 HR Admin / Quản lý' : '💼 HR Admin / Manager')

              const inputTitleDisplay = isCandidate
                ? (language === 'vi' ? 'THÔNG TIN ỨNG VIÊN / NHÂN VIÊN NHẬP & KHAI BÁO' : 'CANDIDATE / EMPLOYEE DECLARATION DATA')
                : (language === 'vi' ? 'THÔNG TIN HR & QUẢN LÝ THIẾT LẬP & THẨM ĐỊNH' : 'HR & MANAGER CONFIGURATION & REVIEW DATA')

              const inputDescDisplay = isCandidate
                ? (language === 'vi' ? 'Dữ liệu cá nhân, giấy tờ scan & thông tin tài khoản do Nhân viên tự khai báo.' : 'Personal data, scanned docs & self-declared account details.')
                : (language === 'vi' ? 'Cấu hình định biên, chức danh, ngạch bậc lương & luồng duyệt.' : 'Headcount budget, job titles, pay grades & approval workflows.')

              const outputTitleDisplay = isCandidate
                ? (language === 'vi' ? 'KẾT QUẢ ỨNG VIÊN / NHÂN VIÊN NHẬN ĐƯỢC' : 'RESULTS RECEIVED BY CANDIDATE / EMPLOYEE')
                : (language === 'vi' ? 'KẾT QUẢ HỆ THỐNG HR TỰ ĐỘNG SINH & ĐỒNG BỘ' : 'AUTOMATED SYSTEM GENERATED OUTPUTS')

              const outputDescDisplay = isCandidate
                ? (language === 'vi' ? 'Thông báo, tài khoản đăng nhập & tài liệu văn hóa công ty.' : 'Notifications, portal login credentials & onboarding guides.')
                : (language === 'vi' ? 'Mã số nhân viên, Ticket IT/Hành chính & Báo tăng Bảo hiểm/Thuế.' : 'Employee ID, IT/Admin provisioning tickets & Insurance sync.')

              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 sm:p-6 space-y-4 shadow-2xs transition-all ${isCandidate
                    ? isDarkMode
                      ? 'bg-blue-950/20 border-blue-900/50'
                      : 'bg-blue-50/40 border-blue-200/80'
                    : isDarkMode
                      ? 'bg-emerald-950/20 border-emerald-900/50'
                      : 'bg-emerald-50/40 border-emerald-200/80'
                    }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs sm:text-sm font-bold rounded-lg border flex items-center gap-1.5 ${isCandidate
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-emerald-600 text-white border-emerald-500'
                          }`}
                      >
                        {actorDisplay}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      {isCandidate ? 'Self-Service Portal' : 'HRM Core Engine'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* INPUTS COLUMN */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs sm:text-sm font-extrabold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <Database className="w-4 h-4" /> {inputTitleDisplay}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {inputDescDisplay}
                      </p>
                      <div className="space-y-2 pt-1">
                        {roleFlow.inputs.items.map((inItem, iIdx) => (
                          <div
                            key={iIdx}
                            className={`p-3 rounded-lg border text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2.5 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span>{inItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* OUTPUTS COLUMN */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs sm:text-sm font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {outputTitleDisplay}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {outputDescDisplay}
                      </p>
                      <div className="space-y-2 pt-1">
                        {roleFlow.outputs.items.map((outItem, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-lg border text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2.5 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{outItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
}

