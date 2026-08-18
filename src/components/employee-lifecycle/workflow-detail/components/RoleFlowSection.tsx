import React from 'react'
import { ArrowRightLeft, Database, CheckCircle2 } from 'lucide-react'
import type { RoleDataFlow } from '../types'

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
  return (
    <div className={`rounded-2xl p-5 sm:p-6 border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            <ArrowRightLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>LUỒNG ĐẦU VÀO ➔ ĐẦU RA THEO VAI TRÒ (DUAL ROLE INPUT-OUTPUT MAPPING)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Phân định rõ ràng: Ứng viên/Nhân viên nhập gì & nhận gì VS. HR Admin/Quản lý nhập gì & hệ thống tự động sinh ra gì.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
          <button
            type="button"
            onClick={() => setActiveRoleTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Tất cả Vai trò
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleTab('candidate')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'candidate'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            🧑‍💻 Ứng viên / NV
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleTab('hr')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'hr'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            💼 HR & Quản lý
          </button>
        </div>
      </div>

      {/* DUAL ROLE COMPARISON GRID */}
      <div className={`grid gap-5 ${activeRoleTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 w-full'}`}>
        {availableRoleFlows
          .filter((rFlow) => activeRoleTab === 'all' || activeRoleTab === rFlow.roleType)
          .map((rFlow, rIdx) => (
            <div
              key={rIdx}
              className={`border rounded-2xl transition-all w-full shadow-2xs ${activeRoleTab === 'all' ? 'p-4 sm:p-5 space-y-3.5' : 'p-5 sm:p-6 space-y-4'
                } ${isDarkMode
                  ? `${rFlow.bgDark} ${rFlow.borderDark}`
                  : `${rFlow.bgLight} ${rFlow.borderLight}`
                }`}
            >
              {/* Role Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-extrabold flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${isDarkMode ? rFlow.badgeColorDark : rFlow.badgeColorLight
                    }`}>
                    {rFlow.actorLabel}
                  </span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                  }`}>
                  {rFlow.roleType === 'candidate' ? 'Self-Service Portal' : 'HRM Core Engine'}
                </span>
              </div>

              {/* Dual Cards: Input Section vs Output Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                {/* INPUT CARD */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 flex flex-col justify-between ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}>
                  <div>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>ĐẦU VÀO (INPUTS)</span>
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug mb-2.5">
                      {rFlow.inputs.description}
                    </p>

                    <div className="space-y-1.5">
                      {rFlow.inputs.items.map((inpItem, iIdx) => (
                        <div
                          key={iIdx}
                          className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{inpItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* OUTPUT CARD */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 flex flex-col justify-between ${isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}>
                  <div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>ĐẦU RA (OUTPUTS)</span>
                    </span>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug mb-2.5">
                      {rFlow.outputs.description}
                    </p>

                    <div className="space-y-1.5">
                      {rFlow.outputs.items.map((outItem, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
