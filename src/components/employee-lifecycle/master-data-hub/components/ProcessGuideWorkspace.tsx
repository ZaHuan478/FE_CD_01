import React from 'react'
import {
  Search,
  UserRound,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react'
import type { SopSubProcess } from '../../workflow-detail/types'
import type { CatalogViewModel } from '../masterDataCatalogAdapter'

export interface ProcessGuideWorkspaceProps {
  isDarkMode: boolean
  processSearch: string
  onProcessSearchChange: (v: string) => void
  filteredProcesses: SopSubProcess[]
  selectedProcessCode: string
  onSelectProcess: (code: string) => void
  contextProcess: SopSubProcess | undefined
  selectedStep: SopSubProcess['steps'][number] | undefined
  selectedStepCode: string
  onSelectStep: (code: string) => void
  governanceItems: CatalogViewModel[]
  subdued: string
}

export const ProcessGuideWorkspace: React.FC<ProcessGuideWorkspaceProps> = ({
  isDarkMode,
  processSearch,
  onProcessSearchChange,
  filteredProcesses,
  selectedProcessCode,
  onSelectProcess,
  contextProcess,
  selectedStep,
  selectedStepCode,
  onSelectStep,
  governanceItems,
  subdued
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className={`
        px-4 sm:px-5 py-3 border-b
        ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-white/80'}
        sticky top-0 z-10
      `}
      >
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
          Hướng dẫn theo quy trình
        </h3>
        <p className={`text-xs ${subdued} mb-3`}>
          Chọn một quy trình để xem từng bước thực hiện và danh mục Master Data liên quan.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={processSearch}
              onChange={(e) => onProcessSearchChange(e.target.value)}
              placeholder="Tìm quy trình (tên, mã SOP)..."
              aria-label="Tìm quy trình"
              className={`
                w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none transition-colors focus:border-blue-500
                ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }
              `}
            />
          </div>
          <label htmlFor="process-guide-select" className="sr-only">
            Chọn quy trình
          </label>
          <select
            id="process-guide-select"
            value={selectedProcessCode}
            onChange={(e) => onSelectProcess(e.target.value)}
            className={`
              flex-[1.4] rounded-lg border px-3 py-2 text-xs font-semibold outline-none
              focus:border-blue-500 cursor-pointer
              ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}
            `}
          >
            <option value="">— Chọn quy trình để xem hướng dẫn —</option>
            {filteredProcesses.map((p) => (
              <option key={p.sopCode} value={p.sopCode}>
                {p.sopCode} — {p.sopTitle}
              </option>
            ))}
            {filteredProcesses.length === 0 && (
              <option disabled>Không tìm thấy quy trình</option>
            )}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!contextProcess && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900/50 text-slate-300'
                : 'border-blue-100 bg-blue-50/70 text-slate-600'
            }`}
          >
            Hãy chọn một quy trình ở trên để xem danh sách bước hướng dẫn và danh mục Master Data
            liên quan.
          </div>
        )}

        {contextProcess && (
          <>
            {/* Step tabs */}
            <div
              className={`rounded-xl border overflow-hidden ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}
            >
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {contextProcess.sopTitle}
                  </h4>
                  <p className={`text-xs mt-0.5 ${subdued}`}>
                    {contextProcess.steps.length} bước thực hiện
                  </p>
                </div>
              </div>
              {/* Steps horizontal scroll */}
              <div className="flex gap-2 overflow-x-auto p-3 pb-2 [scrollbar-width:thin]">
                {contextProcess.steps.map((step, idx) => {
                  const active =
                    step.stepCode === selectedStepCode || (!selectedStepCode && idx === 0)
                  return (
                    <button
                      key={step.stepCode}
                      type="button"
                      onClick={() => onSelectStep(step.stepCode)}
                      className={`
                        min-w-[160px] max-w-[240px] shrink-0 text-left px-3 py-2.5
                        rounded-xl border transition-colors cursor-pointer
                        ${
                          active
                            ? isDarkMode
                              ? 'border-blue-500 bg-blue-600/20 text-blue-100'
                              : 'border-blue-500 bg-blue-50 text-blue-900'
                            : isDarkMode
                              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <span
                        className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-black mr-1.5 ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold">{step.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step detail */}
            {selectedStep && (
              <div
                className={`rounded-xl border ${
                  isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                      {contextProcess.steps.findIndex((s) => s.stepCode === selectedStep.stepCode) +
                        1}
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold tracking-wide text-blue-600 uppercase">
                        Việc cần thực hiện
                      </p>
                      <h4 className="text-base font-black mt-0.5 text-slate-900 dark:text-white">
                        {selectedStep.title}
                      </h4>
                    </div>
                  </div>
                  {selectedStep.description && (
                    <p className={`text-sm leading-6 ${subdued} mb-4`}>
                      {selectedStep.description.split('\n')[0]}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {selectedStep.actor && (
                      <div
                        className={`p-3 rounded-xl border ${
                          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <UserRound className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                          Người thực hiện
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>{selectedStep.actor}</p>
                      </div>
                    )}
                    {selectedStep.location && (
                      <div
                        className={`p-3 rounded-xl border ${
                          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                          Nơi thực hiện
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>
                          {selectedStep.location}
                        </p>
                      </div>
                    )}
                    {selectedStep.timing && (
                      <div
                        className={`p-3 rounded-xl border ${
                          isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold mb-1 text-slate-700 dark:text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                          Thời điểm
                        </div>
                        <p className={`text-xs font-semibold ${subdued}`}>{selectedStep.timing}</p>
                      </div>
                    )}
                  </div>

                  {selectedStep.fieldsChecklist && selectedStep.fieldsChecklist.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200 mb-2">
                        Thông tin / Danh mục cần chuẩn bị
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStep.fieldsChecklist.slice(0, 15).map((f) => (
                          <span
                            key={f}
                            className={`px-2.5 py-1 rounded-lg text-xs ${
                              isDarkMode
                                ? 'bg-slate-800 text-slate-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                        {selectedStep.fieldsChecklist.length > 15 && (
                          <span className={`text-xs ${subdued} py-1`}>
                            +{selectedStep.fieldsChecklist.length - 15} thêm
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Governance section */}
        {governanceItems.length > 0 && (
          <div>
            <div className={`flex items-center gap-2 mb-3 px-1`}>
              <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                Thao tác Quản trị Danh mục (tier4_governance)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {governanceItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border ${
                    isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${subdued}`}>{item.summary}</p>
                  {item.fields.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.fields.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            isDarkMode
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
