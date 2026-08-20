import React, { useState } from 'react'
import {
  ArrowRightLeft,
  Database,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Sparkles,
  Zap,
  ArrowDown,
  ArrowUp,
  Layers,
  FileCheck,
  Send
} from 'lucide-react'
import type { RoleDataFlow, SwimlaneStep } from '../types'
import { SWIMLANE_DATABASE } from '../data/roleFlowDatabase'
import { useLanguage } from '../../../../context/LanguageContext'

interface RoleFlowSectionProps {
  availableRoleFlows: RoleDataFlow[]
  activeRoleTab: 'all' | 'candidate' | 'hr'
  setActiveRoleTab: (tab: 'all' | 'candidate' | 'hr') => void
  isDarkMode: boolean
  itemId?: string
}

export const RoleFlowSection: React.FC<RoleFlowSectionProps> = ({
  availableRoleFlows,
  activeRoleTab,
  setActiveRoleTab,
  isDarkMode,
  itemId = 'LIFE-01'
}) => {
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [viewStyle, setViewStyle] = useState<'swimlane' | 'matrix'>('swimlane')

  // Retrieve swimlane sequence data for current process
  const swimlaneData = SWIMLANE_DATABASE[itemId] || SWIMLANE_DATABASE['LIFE-01']

  const [selectedSwimlaneStep, setSelectedSwimlaneStep] = useState<SwimlaneStep | null>(
    swimlaneData.candidateSteps[0] || null
  )

  const candidateSteps = swimlaneData.candidateSteps
  const hrSteps = swimlaneData.hrSteps
  const totalStages = Math.max(candidateSteps.length, hrSteps.length)
  const stagesArray = Array.from({ length: totalStages }, (_, i) => i + 1)

  return (
    <div className={`rounded-2xl p-5 sm:p-6 border space-y-5 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
      
      {/* SECTION HEADER & CONTROLLER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
              Interactive Sequence Architecture
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'vi' ? 'Sơ đồ Tương tác 2 Làn (Dual-Swimlane)' : 'Dual-Swimlane Sequence Flow'}
            </span>
          </div>

          <h2 className={`text-base sm:text-lg font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>
              {language === 'vi'
                ? 'SƠ ĐỒ TƯƠNG TÁC 2 LÀN: ỨNG VIÊN ⮂ HR & HỆ THỐNG'
                : 'DUAL-SWIMLANE SEQUENCE FLOW: CANDIDATE ⮂ HR & SYSTEM'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'vi'
              ? swimlaneData.summary
              : swimlaneData.summaryEn}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          
          {/* View Style Switcher (Swimlane Diagram vs Text Matrix) */}
          <div className={`flex items-center p-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
            <button
              type="button"
              onClick={() => setViewStyle('swimlane')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewStyle === 'swimlane'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Sơ đồ 2 Làn' : 'Swimlane Flow'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewStyle('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${viewStyle === 'matrix'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Bảng Dữ liệu Matrix' : 'Data Matrix'}</span>
            </button>
          </div>

          {/* Collapse Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${isDarkMode
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

      {/* EXPANDABLE BODY */}
      {isExpanded && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* MODE 1: DUAL-SWIMLANE INTERACTIVE SEQUENCE DIAGRAM */}
          {viewStyle === 'swimlane' && (
            <div className="space-y-5">
              
              {/* Main Swimlane Grid Container */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs bg-slate-50/50 dark:bg-slate-950/60">
                
                {/* Horizontal Timeline Stage Header Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-400">
                  <div className="md:col-span-3 p-3 flex items-center gap-2 uppercase tracking-wider border-r border-slate-200 dark:border-slate-800">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span>{language === 'vi' ? 'PHÂN LÀN VAI TRÒ (SWIMLANE)' : 'ROLE SWIMLANE'}</span>
                  </div>
                  <div className="md:col-span-9 p-3 grid grid-cols-3 gap-2 text-center uppercase tracking-wider">
                    {stagesArray.map((stageNum) => (
                      <div key={stageNum} className="flex items-center justify-center gap-1.5 font-bold">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                          {stageNum}
                        </span>
                        <span>
                          {language === 'vi' ? `Giai đoạn ${stageNum}` : `Stage ${stageNum}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SWIMLANE 1: CANDIDATE & EMPLOYEE LANE (TOP) */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-blue-200/60 dark:border-blue-950/80 bg-blue-50/30 dark:bg-blue-950/20 items-stretch">
                  
                  {/* Lane Title & Actor Card */}
                  <div className="md:col-span-3 p-4 border-r border-blue-200/60 dark:border-blue-950/80 flex flex-col justify-between bg-blue-100/40 dark:bg-blue-950/40">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Làn trên (Top Lane)
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {language === 'vi' ? 'Ứng viên / Nhân viên mới' : 'Candidate / Employee'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {language === 'vi'
                          ? 'Thao tác tự phục vụ (Self-service): Khai báo hồ sơ, upload chứng từ và ký xác nhận điện tử.'
                          : 'Self-service actions: Submit profile data, upload certificates and e-sign acceptance.'}
                      </p>
                    </div>

                    <span className="mt-2 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-200/50 dark:bg-blue-900/50 px-2 py-1 rounded-md border border-blue-300/60 dark:border-blue-800 self-start">
                      Portal & Mobile App
                    </span>
                  </div>

                  {/* Lane Steps Cards Grid */}
                  <div className="md:col-span-9 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                    {candidateSteps.map((step) => {
                      const isSelected = selectedSwimlaneStep?.id === step.id
                      return (
                        <div key={step.id} className="flex flex-col justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedSwimlaneStep(step)}
                            className={`w-full h-full p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 relative ${isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/50 transform -translate-y-1'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-blue-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs'
                              }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                  }`}>
                                  {step.id}
                                </span>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${isSelected ? 'border-white/30 bg-white/10 text-white' : 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                                  }`}>
                                  {language === 'vi' ? step.actionTag : step.actionTagEn}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold leading-snug">
                                {language === 'vi' ? step.title : step.titleEn}
                              </h4>
                              
                              <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                {language === 'vi' ? step.description : step.descriptionEn}
                              </p>
                            </div>

                            {step.interactionLabel && (
                              <div className={`text-[10px] font-bold flex items-center gap-1 pt-1.5 border-t ${isSelected ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400'
                                }`}>
                                <Send className="w-3 h-3" />
                                <span className="truncate">{language === 'vi' ? step.interactionLabel : step.interactionLabelEn}</span>
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                </div>

                {/* INTERACTION CONNECTOR ROW (MIDDLE INTERACTION ARROWS) */}
                <div className="bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-1.5 px-4 hidden md:flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
                    <span>{language === 'vi' ? 'LUỒNG GIAO TIẾP & ĐỒNG BỘ REAL-TIME (API & NOTIFICATION)' : 'REAL-TIME DATA SYNC & API TRIGGERS'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                      <ArrowDown className="w-3 h-3" /> Ứng viên gửi ➔ Hệ thống
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <ArrowUp className="w-3 h-3" /> Hệ thống phản hồi ➔ Ứng viên
                    </span>
                  </div>
                </div>

                {/* SWIMLANE 2: HR ADMIN & SYSTEM AUTOMATION LANE (BOTTOM) */}
                <div className="grid grid-cols-1 md:grid-cols-12 bg-emerald-50/20 dark:bg-emerald-950/10 items-stretch">
                  
                  {/* Lane Title & Actor Card */}
                  <div className="md:col-span-3 p-4 border-r border-emerald-200/60 dark:border-emerald-950/80 flex flex-col justify-between bg-emerald-100/30 dark:bg-emerald-950/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Làn dưới (Bottom Lane)
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {language === 'vi' ? 'HR Admin & Hệ thống Tự động' : 'HR Admin & System Engine'}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {language === 'vi'
                          ? 'Nghiệp vụ thẩm định, phê duyệt và liên thông tự động cấp Email IT, Thẻ từ & Báo tăng BHXH.'
                          : 'Validation, approval and automatic cross-system provisioning (IT, Access Card, Social Insurance).'}
                      </p>
                    </div>

                    <span className="mt-2 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-200/50 dark:bg-emerald-900/50 px-2 py-1 rounded-md border border-emerald-300/60 dark:border-emerald-800 self-start">
                      HR Core & Cross-System API
                    </span>
                  </div>

                  {/* Lane Steps Cards Grid */}
                  <div className="md:col-span-9 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                    {hrSteps.map((step) => {
                      const isSelected = selectedSwimlaneStep?.id === step.id
                      return (
                        <div key={step.id} className="flex flex-col justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedSwimlaneStep(step)}
                            className={`w-full h-full p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 relative ${isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/50 transform -translate-y-1'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-emerald-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs'
                              }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  }`}>
                                  {step.id}
                                </span>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${isSelected ? 'border-white/30 bg-white/10 text-white' : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                                  }`}>
                                  {language === 'vi' ? step.actionTag : step.actionTagEn}
                                </span>
                              </div>

                              <h4 className="text-xs font-bold leading-snug">
                                {language === 'vi' ? step.title : step.titleEn}
                              </h4>
                              
                              <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                {language === 'vi' ? step.description : step.descriptionEn}
                              </p>
                            </div>

                            {step.interactionLabel && (
                              <div className={`text-[10px] font-bold flex items-center gap-1 pt-1.5 border-t ${isSelected ? 'border-white/20 text-emerald-100' : 'border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span className="truncate">{language === 'vi' ? step.interactionLabel : step.interactionLabelEn}</span>
                              </div>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                </div>

              </div>

              {/* DYNAMIC NODE DETAIL INSPECTOR CANVAS */}
              {selectedSwimlaneStep && (
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all animate-fadeIn ${selectedSwimlaneStep.lane === 'candidate'
                  ? 'bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/20 border-blue-300 dark:border-blue-800/80'
                  : 'bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                  }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-mono font-black rounded-md text-white ${selectedSwimlaneStep.lane === 'candidate' ? 'bg-blue-600' : 'bg-emerald-600'
                          }`}>
                          {selectedSwimlaneStep.id} · Giai đoạn {selectedSwimlaneStep.stageIndex}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${selectedSwimlaneStep.lane === 'candidate'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}>
                          {selectedSwimlaneStep.lane === 'candidate' ? '🧑‍💻 Phân làn: Ứng viên / NV' : '💼 Phân làn: HR & Hệ thống'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {language === 'vi' ? selectedSwimlaneStep.title : selectedSwimlaneStep.titleEn}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'vi' ? selectedSwimlaneStep.description : selectedSwimlaneStep.descriptionEn}
                      </p>
                    </div>

                    {/* Step Detailed Checklist Pill List */}
                    {selectedSwimlaneStep.details && selectedSwimlaneStep.details.length > 0 && (
                      <div className="bg-white/80 dark:bg-slate-900/90 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 shrink-0 md:min-w-[280px]">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                          {language === 'vi' ? 'Chứng từ & Dữ liệu liên quan:' : 'Data & Documents:'}
                        </span>
                        <ul className="space-y-1 text-xs">
                          {selectedSwimlaneStep.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* MODE 2: CLASSIC TEXT COMPARISON MATRIX */}
          {viewStyle === 'matrix' && (
            <div className="space-y-4">
              {/* Filter Tabs for Matrix View */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                    }`}
                >
                  {language === 'vi' ? 'Tất cả Vai trò' : 'All Roles'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('candidate')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'candidate'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                    }`}
                >
                  🧑‍💻 {language === 'vi' ? 'Ứng viên / NV' : 'Candidate / Employee'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('hr')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeRoleTab === 'hr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                    }`}
                >
                  💼 {language === 'vi' ? 'HR & Quản lý' : 'HR & Manager'}
                </button>
              </div>

              <div className={`grid gap-5 ${activeRoleTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 w-full'}`}>
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
            </div>
          )}

        </div>
      )}

    </div>
  )
}


