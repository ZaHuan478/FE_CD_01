import React from 'react'
import {
  GitBranch,
  ArrowRight,
  UserCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText
} from 'lucide-react'
import type { SopSubProcess } from '../types'
import type { DetailItem } from '../../../../types/employee-lifecycle'
import { SopStepLegendBar } from './SopStepLegendBar'

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
              <span>LƯU ĐỒ SƠ ĐỒ WORKFLOW: {currentProcess.sopTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {currentProcess.description}
            </p>
          </div>

          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border shrink-0 ${isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
            {currentProcess.steps.length} Bước SOP Chuẩn
          </span>
        </div>

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
                    className={`w-[260px] shrink-0 p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${isStepSelected
                      ? isDarkMode
                        ? 'bg-blue-950/90 border-blue-500 ring-2 ring-blue-500/40 transform -translate-y-1 shadow-md'
                        : 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/30 transform -translate-y-1 shadow-md'
                      : isDarkMode
                        ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white'
                      }`}
                  >
                    <div>
                      {/* Step Header with Step Number & Code */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${isStepSelected
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isDarkMode
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-white text-slate-700 border-slate-200'
                            }`}>
                            {idx + 1}
                          </span>

                          <span className={`px-2 py-0.5 font-mono font-extrabold text-[11px] rounded-md border ${isStepSelected
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isDarkMode
                              ? 'bg-slate-800 text-blue-300 border-slate-700'
                              : 'bg-white text-blue-700 border-slate-200'
                            }`}>
                            {step.stepCode}
                          </span>
                        </div>

                        <span
                          title={
                            step.typeCode === 'N'
                              ? 'Loại N: Bước Nhập liệu / Khai báo'
                              : step.typeCode === 'M'
                                ? 'Loại M: Bước Thẩm định thủ công / Duyệt'
                                : step.typeCode === 'C'
                                  ? 'Loại C: Bước Thẩm định điều kiện'
                                  : 'Loại A: Bước Tự động hệ thống xử lý'
                          }
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded cursor-help ${step.typeCode === 'N'
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : step.typeCode === 'M'
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : step.typeCode === 'C'
                                ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                                : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            }`}>
                          Loại {step.typeCode}
                        </span>
                      </div>

                      {/* Step Title */}
                      <h4 className={`text-xs font-bold leading-snug mb-2.5 h-9 line-clamp-2 ${isStepSelected
                        ? isDarkMode ? 'text-white' : 'text-blue-950'
                        : isDarkMode ? 'text-slate-200' : 'text-slate-900'
                        }`}>
                        {step.title}
                      </h4>
                    </div>

                    {/* Step Actor & Location Footer */}
                    <div className="space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="truncate font-semibold">{step.actor}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="truncate">{step.location}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Visual Connecting Arrow between steps */}
                  {!isLastStep && (
                    <div className="flex items-center justify-center px-1 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
              <span className="text-slate-500 dark:text-slate-400">Thời gian:</span>
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
                Người thực hiện & Nơi thực hiện
              </span>
              <div className="space-y-1.5 text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-bold">{currentStep.actor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Nơi thực hiện: {currentStep.location}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Diễn giải Mô tả Yêu cầu */}
            <div className={`md:col-span-2 p-4 rounded-xl border space-y-2 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px] block">
                Mô tả Yêu cầu Nghiệp vụ Chi tiết
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
                Checklist Các Trường Thông tin & Nhóm Dữ liệu Khai báo
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
                <span>Mở Form UI Wireframe cho bước {currentStep.stepCode}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
