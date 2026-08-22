import React, { useState } from 'react'
import {
  GitBranch,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { SopSubProcess } from '../types'
import type { DetailItem } from '../../../../types/employee-lifecycle'
import { SopStepLegendBar } from './SopStepLegendBar'
import { useLanguage } from '../../../../context/LanguageContext'

interface WorkflowDiagramViewProps {
  currentProcess: SopSubProcess
  selectedStepIdx: number
  setSelectedStepIdx: (idx: number) => void
  isDarkMode: boolean
  item: DetailItem
  onOpenWireframe?: (item: DetailItem) => void
}

export const WorkflowDiagramView: React.FC<WorkflowDiagramViewProps> = ({
  currentProcess,
  selectedStepIdx,
  setSelectedStepIdx,
  isDarkMode,
  item,
  onOpenWireframe
}) => {
  const { language } = useLanguage()
  const [isDiagramExpanded, setIsDiagramExpanded] = useState<boolean>(true)
  const currentStep = currentProcess.steps[selectedStepIdx] || currentProcess.steps[0]

  return (
    <div className="space-y-6">
      {/* Interactive Sequential Workflow Canvas */}
      <div className={`rounded-2xl p-6 border space-y-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
              <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {language === 'vi' ? 'Sơ đồ quy trình:' : 'Workflow diagram:'} {currentProcess.sopTitle}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {currentProcess.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
              {currentProcess.steps.length} {language === 'vi' ? 'Bước SOP Chuẩn' : 'Standard SOP Steps'}
            </span>

            {/* Collapse Dropdown Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDiagramExpanded(!isDiagramExpanded)}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDiagramExpanded ? (language === 'vi' ? 'Thu gọn Sơ đồ' : 'Collapse Diagram') : (language === 'vi' ? 'Mở rộng Sơ đồ' : 'Expand Diagram')}
            >
              <span>{isDiagramExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
              {isDiagramExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>


        {/* EXPANDABLE DIAGRAM WORKFLOW BODY */}
        {isDiagramExpanded && (
          <div className="space-y-6 animate-fadeIn">
            {/* SOP Step Types Legend Bar */}
            <SopStepLegendBar />

            {/* Pure Horizontal Sequential Steps Timeline Flow */}
            <div className="relative pt-2 pb-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-3 min-w-max pb-2 px-1">
                {currentProcess.steps.map((step, idx) => {
                  const isStepSelected = selectedStepIdx === idx
                  const isLastStep = idx === currentProcess.steps.length - 1

                  return (
                    <React.Fragment key={step.stepCode}>
                      {/* Step Card Node */}
                      <div
                        onClick={() => setSelectedStepIdx(idx)}
                        className={`w-[280px] shrink-0 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${isStepSelected
                          ? isDarkMode
                            ? 'bg-blue-950 border-blue-500 text-white ring-2 ring-blue-500/40 transform -translate-y-1 shadow-md'
                            : 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-400 transform -translate-y-1 shadow-md'
                          : isDarkMode
                            ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-mono font-black px-2 py-0.5 rounded border ${isStepSelected
                                ? 'bg-white/20 text-white border-white/30'
                                : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800'
                                }`}
                            >
                              {step.stepCode}
                            </span>

                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${isStepSelected
                                ? 'bg-white/20 text-white border-white/30'
                                : step.typeCode === 'N'
                                  ? 'bg-blue-100/80 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 border-blue-200'
                                  : step.typeCode === 'M'
                                    ? 'bg-emerald-100/80 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-200'
                                    : 'bg-purple-100/80 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 border-purple-200'
                                }`}
                            >
                              [{step.typeCode}]
                            </span>
                          </div>

                          <h4
                            className={`text-sm font-extrabold leading-tight mb-2 line-clamp-2 ${isStepSelected
                              ? 'text-white'
                              : isDarkMode
                                ? 'text-slate-100'
                                : 'text-slate-900'
                              }`}
                          >
                            {step.title}
                          </h4>

                          <p
                            className={`text-xs leading-relaxed line-clamp-3 mb-3 ${isStepSelected
                              ? isDarkMode ? 'text-blue-200' : 'text-blue-100'
                              : isDarkMode
                                ? 'text-slate-400'
                                : 'text-slate-500'
                              }`}
                          >
                            {step.description}
                          </p>
                        </div>

                        <div
                          className={`pt-2.5 border-t flex items-center justify-between text-xs ${isStepSelected
                            ? isDarkMode ? 'border-blue-800 text-blue-200' : 'border-blue-500/60 text-blue-100'
                            : 'border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                          <span className="font-semibold flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" />
                            {step.actor}
                          </span>
                          <span>{step.timing}</span>
                        </div>
                      </div>

                      {/* Directional Arrow Divider */}
                      {!isLastStep && (
                        <div className="flex items-center justify-center shrink-0 text-slate-300 dark:text-slate-700">
                          <ArrowRight className="w-5 h-5 animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* Decision Gateway Card */}
            <div className={`p-4 border rounded-xl space-y-3 ${isDarkMode
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-800/50'
              : 'bg-gradient-to-r from-slate-50 via-indigo-50/50 to-slate-50 border-indigo-200'
              }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Cổng Rẽ Nhánh Điều Kiện & Luồng Thẩm Định (Decision Gateway)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 border rounded-lg flex items-start gap-2.5 ${isDarkMode ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50/80 border-emerald-200'
                  }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-0.5">Trường hợp 1: Phê duyệt / Thống nhất</strong>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-200/80 leading-relaxed">
                      Chuyển tự động sang bước tiếp theo, cập nhật bản ghi chính thức và gửi thông báo qua mail/portal.
                    </p>
                  </div>
                </div>

                <div className={`p-3 border rounded-lg flex items-start gap-2.5 ${isDarkMode ? 'bg-amber-950/40 border-amber-800/60' : 'bg-amber-50/80 border-amber-200'
                  }`}>
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-800 dark:text-amber-300 font-bold block mb-0.5">Trường hợp 2: Yêu cầu hiệu chỉnh / Trả lại</strong>
                    <p className="text-[11px] text-amber-700 dark:text-amber-200/80 leading-relaxed">
                      Trả về cho Người thực hiện trước đó để bổ túc thông tin hoặc họp giải trình lại với cấp có thẩm quyền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Step Spec Card Detail */}
      {currentStep && (
        <div className={`rounded-2xl p-5 sm:p-6 border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-600 text-white font-mono font-extrabold text-xs rounded-xl shadow-xs">
                {currentStep.stepCode}
              </span>
              <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentStep.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">{language === 'vi' ? 'Thời gian:' : 'Timing:'}</span>
              <span className={`font-semibold px-2.5 py-1 rounded-lg border ${isDarkMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                {currentStep.timing}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Card 1: Người thực hiện & Nơi thực hiện */}
            <div className={`p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px] block">
                {language === 'vi' ? 'Người thực hiện & Nơi thực hiện' : 'Actor & Execution Channel'}
              </span>
              <div className="space-y-1.5 text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-bold">{currentStep.actor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{language === 'vi' ? 'Nơi thực hiện:' : 'Channel:'} {currentStep.location}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Diễn giải Mô tả Yêu cầu */}
            <div className={`md:col-span-2 p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px] block">
                {language === 'vi' ? 'Mô tả Yêu cầu Nghiệp vụ Chi tiết' : 'Detailed Business Requirement Description'}
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Checklist Fields in Word Doc */}
          {currentStep.fieldsChecklist && currentStep.fieldsChecklist.length > 0 && (
            <div className={`p-4 rounded-xl border space-y-2.5 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
              }`}>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] block">
                {language === 'vi'
                  ? 'Checklist Các Trường Thông tin & Nhóm Dữ liệu Khai báo'
                  : 'Form Fields & Data Group Checklist'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {currentStep.fieldsChecklist.map((fieldName, fIdx) => (
                  <div
                    key={fIdx}
                    className={`px-3 py-2 border rounded-lg text-xs font-medium flex items-center gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{fieldName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wireframe Button CTA */}
          {onOpenWireframe && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => onOpenWireframe(item)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {language === 'vi'
                    ? `Mở màn hình thao tác mẫu cho bước ${currentStep.stepCode}`
                    : `Open sample screen for step ${currentStep.stepCode}`}
                </span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
