import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, UserCheck } from 'lucide-react'
import type { SopSubProcess } from '../../../types'

interface SopProcessDetailViewProps {
  process: SopSubProcess
  activeStageTab: number
  isDarkMode: boolean
}

export const SopProcessDetailView: React.FC<SopProcessDetailViewProps> = ({ process, activeStageTab, isDarkMode }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(activeStageTab > 0 && activeStageTab <= process.steps.length ? activeStageTab - 1 : 0)
  }, [activeStageTab, process.sopCode, process.steps.length])

  if (process.steps.length === 0) {
    return (
      <section className={`rounded-xl border p-6 text-sm ${isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-white text-slate-600 shadow-sm'}`}>
        <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{process.sopTitle}</h2>
        <p className="mt-2">{process.description}</p>
      </section>
    )
  }

  const selectedStep = process.steps[selectedIndex] ?? process.steps[0]

  if (process.sopCategory === 'Danh mục dùng chung') {
    return (
      <section className={`space-y-4 rounded-xl border p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
        <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Danh mục dùng chung</p>
          <h2 className={`mt-1 text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{process.sopTitle}</h2>
          <p className="mt-2 max-w-5xl whitespace-pre-line text-xs leading-relaxed text-slate-600 dark:text-slate-300">{process.description}</p>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Phạm vi áp dụng</h3>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedStep.location || 'Không nêu trong bảng danh mục'}</p>
          </article>
          <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Loại dữ liệu</h3>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedStep.sourceTypeCode || 'Không nêu trong bảng danh mục'}</p>
          </article>
        </div>

        <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-sky-100 bg-sky-50/40'}`}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Thông tin cần khai báo</h3>
          {selectedStep.fieldsChecklist?.length ? (
            <ul className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-700 dark:text-slate-200 lg:grid-cols-2">
              {selectedStep.fieldsChecklist.map((field, index) => (
                <li key={`${field}-${index}`} className="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
                  <span className="leading-relaxed">{field}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-slate-500">Bảng danh mục không tách riêng danh sách trường khai báo.</p>
          )}
        </article>
      </section>
    )
  }

  if (process.sopCategory === 'Chức năng quản lý danh mục') {
    return (
      <section className={`space-y-4 rounded-xl border p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
        <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Chức năng quản lý danh mục</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{process.sopTitle}</h2>
            <span className="rounded-md bg-sky-50 px-2 py-1 font-mono text-[10px] font-semibold text-[#1f5f86] dark:bg-sky-950/50 dark:text-sky-200">{process.sopCode}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Đầu vào</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{process.inputs?.[0] || 'Không nêu trong đặc tả.'}</p>
          </article>
          <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Người thực hiện</h3>
            <p className="mt-2 flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200"><UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2e8bbd]" />{selectedStep.actor || 'Không nêu trong đặc tả.'}</p>
          </article>
          <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Đầu ra</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{process.outputs?.[0] || 'Không nêu trong đặc tả.'}</p>
          </article>
        </div>

        <article className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-sky-100 bg-sky-50/40'}`}>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Cách xử lý và quy tắc</h3>
          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-200">{process.rules?.[0] || selectedStep.description || 'Không nêu trong đặc tả.'}</p>
        </article>
      </section>
    )
  }

  const previousStep = process.steps[selectedIndex - 1]
  const nextStep = process.steps[selectedIndex + 1]
  const processDescription = process.description || 'SOP không tách mô tả tổng quan riêng; nội dung chi tiết được trình bày theo từng bước bên dưới.'

  return (
    <section className={`space-y-4 rounded-xl border p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">{process.sopCategory}</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{process.sopTitle}</h2>
            <p className="mt-1 max-w-4xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">{processDescription}</p>
            {process.sourceNote && <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">Lưu ý dữ liệu: {process.sourceNote}</p>}
            {process.notes && process.notes.length > 0 && (
              <details className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <summary className="cursor-pointer font-semibold">Lưu ý chung của quy trình ({process.notes.length})</summary>
                <div className="mt-2 space-y-2">
                  {process.notes.map((note, index) => <p key={`${note}-${index}`} className="leading-relaxed">{note}</p>)}
                </div>
              </details>
            )}
          </div>
          <span className="rounded-md bg-sky-50 px-2 py-1 text-[10px] font-semibold text-[#1f5f86] dark:bg-sky-950/50 dark:text-sky-200">{process.steps.length} bước</span>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {process.steps.map((step, index) => {
          const isSelected = index === selectedIndex
          return (
            <button
              key={`${step.stepCode}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`min-w-[190px] flex-1 rounded-lg border p-3 text-left transition-colors ${isSelected
                ? 'border-[#2e8bbd] bg-[#2e8bbd] text-white shadow-sm'
                : isDarkMode
                  ? 'border-slate-800 bg-slate-900 text-slate-200 hover:border-sky-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                }`}
            >
              <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-sky-100' : 'text-[#1f5f86]'}`}>{step.stepCode}</span>
              <span className="mt-1 block text-xs font-semibold leading-snug">{step.title}</span>
            </button>
          )
        })}
      </div>

      <div className={`rounded-lg border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-sky-100 bg-sky-50/40'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bước {selectedIndex + 1}/{process.steps.length}</p>
            <h3 className={`mt-1 text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedStep.title}</h3>
          </div>
          <span className="rounded-md bg-white px-2 py-1 text-[10px] font-mono font-semibold text-[#1f5f86] shadow-sm dark:bg-slate-950 dark:text-sky-200">{selectedStep.stepCode}</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className={`rounded-lg border p-3 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Mô tả yêu cầu</h4>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedStep.description || 'Bảng SOP không nêu mô tả riêng cho bước này.'}</p>
            {selectedStep.fieldsChecklist && selectedStep.fieldsChecklist.length > 0 && (
              <details open className="mt-3 rounded-md border border-sky-100 bg-sky-50/50 px-3 py-2 dark:border-sky-900/60 dark:bg-sky-950/30">
                <summary className="cursor-pointer text-[11px] font-semibold text-[#1f5f86] dark:text-sky-200">Thông tin và điều kiện chi tiết ({selectedStep.fieldsChecklist.length})</summary>
                <ul className="mt-2 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {selectedStep.fieldsChecklist.map((field, index) => <li key={`${field}-${index}`} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e8bbd]" /><span className="leading-relaxed">{field}</span></li>)}
                </ul>
              </details>
            )}
          </article>

          <article className={`rounded-lg border p-3 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Nơi thực hiện</h4>
            <div className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2e8bbd]" />{selectedStep.location || 'Không nêu trong bảng SOP'}</p>
              <p className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-[#2e8bbd]" />{selectedStep.actor || 'Không nêu trong bảng SOP'}</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2e8bbd]" />{selectedStep.timing || 'Không nêu trong bảng SOP'}</p>
            </div>
          </article>

          <article className={`rounded-lg border p-3 lg:col-span-2 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1f5f86]">Mục đích và ý nghĩa</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{processDescription}</p>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">SOP hiện mô tả mục đích ở cấp quy trình; nếu tài liệu chưa tách mục đích riêng cho bước này, hệ thống không tự bổ sung nội dung.</p>
          </article>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {previousStep && (
            <button type="button" onClick={() => setSelectedIndex(selectedIndex - 1)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span><span className="font-semibold">Bước trước:</span> {previousStep.title}</span>
            </button>
          )}
          {nextStep && (
            <button type="button" onClick={() => setSelectedIndex(selectedIndex + 1)} className="flex items-center justify-between gap-2 rounded-lg border border-sky-200 bg-white px-3 py-2 text-left text-xs text-[#1f5f86] hover:bg-sky-50 dark:border-sky-900 dark:bg-slate-950 dark:text-sky-200 dark:hover:bg-slate-900 sm:col-start-2">
              <span><span className="font-semibold">Bước tiếp theo:</span> {nextStep.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
