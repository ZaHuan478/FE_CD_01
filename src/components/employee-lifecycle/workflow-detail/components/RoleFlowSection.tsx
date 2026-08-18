import React, { useState } from 'react'
import { ArrowRightLeft, Database, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

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

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
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

          {/* Collapse Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isExpanded ? 'Thu gọn Luồng Vai trò' : 'Mở rộng Luồng Vai trò'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
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
            .map((roleFlow, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 sm:p-5 space-y-4 shadow-2xs transition-all ${
                  roleFlow.roleType === 'candidate'
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
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 ${
                        roleFlow.roleType === 'candidate'
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-emerald-600 text-white border-emerald-500'
                      }`}
                    >
                      {roleFlow.actorLabel || roleFlow.roleTitle}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    {roleFlow.roleType === 'candidate' ? 'Self-Service Portal' : 'HRM Core Engine'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* INPUTS COLUMN */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5" /> {roleFlow.inputs.title || 'ĐẦU VÀO (INPUTS)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {roleFlow.inputs.description}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {roleFlow.inputs.items.map((inItem, iIdx) => (
                        <div
                          key={iIdx}
                          className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
                            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{inItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OUTPUTS COLUMN */}
                  <div className={`p-3.5 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {roleFlow.outputs.title || 'ĐẦU RA (OUTPUTS)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {roleFlow.outputs.description}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {roleFlow.outputs.items.map((outItem, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
                            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
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
            ))}
        </div>
      )}
    </div>
  )
}
