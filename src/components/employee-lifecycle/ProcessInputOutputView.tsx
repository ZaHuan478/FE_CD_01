import React, { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, CheckCircle2, Inbox, Send, Workflow } from 'lucide-react'
import { SOP_DATABASE } from './workflow-detail/data/sopDatabase'
import type { SopSubProcess } from './workflow-detail/types'

const MODULE_GROUPS = [
  { id: 'recruitment', label: 'Tuyển dụng', workflowIds: ['LIFE-01'] },
  { id: 'employee', label: 'Nhân sự', workflowIds: ['LIFE-00', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-07'] },
  { id: 'attendance', label: 'Chấm công', workflowIds: ['MODULE-ATT'] },
  { id: 'payroll', label: 'Lương', workflowIds: ['MODULE-PAY'] },
  { id: 'insurance', label: 'Bảo hiểm', workflowIds: ['MODULE-INS'] },
  { id: 'tax', label: 'Thuế', workflowIds: ['MODULE-TAX'] },
  { id: 'shared', label: 'Danh mục chung', workflowIds: ['MODULE-MD-FUNCTIONS', 'MODULE-MD'] }
]

const MissingData: React.FC = () => (
  <p className="text-xs italic text-slate-500 dark:text-slate-400">Chưa được mô tả trong dữ liệu hiện có.</p>
)

const ValueList: React.FC<{ values?: string[] }> = ({ values }) => {
  if (!values?.length) return <MissingData />
  return (
    <ul className="space-y-2">
      {values.map((value, index) => (
        <li key={`${value}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
          <span>{value}</span>
        </li>
      ))}
    </ul>
  )
}

export const ProcessInputOutputView: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState('employee')
  const [selectedProcessCode, setSelectedProcessCode] = useState<string | null>(null)
  const selectedGroup = MODULE_GROUPS.find((group) => group.id === selectedGroupId) || MODULE_GROUPS[0]
  const processes = useMemo(
    () => selectedGroup.workflowIds.flatMap((workflowId) => SOP_DATABASE[workflowId] ?? []),
    [selectedGroup]
  )
  const selectedProcess: SopSubProcess | undefined = processes.find((process) => process.sopCode === selectedProcessCode) || processes[0]

  const selectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
    setSelectedProcessCode(null)
  }

  return (
    <section className="space-y-4">
      <header className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white">
          <Workflow className="h-4 w-4" />
        </span>
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Đầu vào và kết quả theo từng quy trình</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Chọn phân hệ, sau đó chọn quy trình cần tra cứu. Màn hình chỉ hiển thị dữ liệu đã có trong nội dung nghiệp vụ.</p>
        </div>
      </header>

      <nav aria-label="Chọn phân hệ để tra cứu đầu vào và kết quả" className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/50">
        {MODULE_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => selectGroup(group.id)}
            className={`rounded-md px-3 py-2 text-xs font-bold transition-colors ${selectedGroupId === group.id
              ? 'bg-[#1f5f86] text-white'
              : 'text-slate-600 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-900'
            }`}
          >
            {group.label}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(270px,0.8fr)_minmax(0,1.5fr)]">
        <div className="max-h-[470px] space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/50">
          {processes.map((process) => {
            const isSelected = selectedProcess?.sopCode === process.sopCode
            return (
              <button
                key={`${process.sopCode}-${process.sopTitle}`}
                type="button"
                onClick={() => setSelectedProcessCode(process.sopCode)}
                className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${isSelected
                  ? 'border-[#1f5f86] bg-[#1f5f86] text-white'
                  : 'border-transparent bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-900'
                }`}
              >
                <span className={`block font-mono text-[9px] font-bold ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>{process.sopCode}</span>
                <span className="mt-1 block text-xs font-semibold leading-snug">{process.sopTitle}</span>
              </button>
            )
          })}
        </div>

        {selectedProcess ? (
          <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
              <p className="font-mono text-[10px] font-bold text-[#1f5f86] dark:text-sky-200">{selectedProcess.sopCode}</p>
              <h5 className="mt-1 text-base font-black text-slate-900 dark:text-white">{selectedProcess.sopTitle}</h5>
              {selectedProcess.description && <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{selectedProcess.description}</p>}
            </div>

            <div className="mt-4 grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <h6 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200"><Inbox className="h-3.5 w-3.5" />Đầu vào cần có</h6>
                <ValueList values={selectedProcess.inputs} />
              </section>
              <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowDown className="h-4 w-4 lg:hidden" /><ArrowRight className="hidden h-4 w-4 lg:block" /></div>
              <section className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white">
                <h6 className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">Quy trình xử lý</h6>
                <p className="mt-2 text-sm font-bold leading-snug">{selectedProcess.sopTitle}</p>
                <p className="mt-2 text-[11px] text-sky-100">{selectedProcess.steps.length} bước được mô tả</p>
              </section>
              <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowDown className="h-4 w-4 lg:hidden" /><ArrowRight className="hidden h-4 w-4 lg:block" /></div>
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <h6 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200"><Send className="h-3.5 w-3.5" />Kết quả tạo ra</h6>
                <ValueList values={selectedProcess.outputs} />
              </section>
            </div>
          </article>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><MissingData /></div>
        )}
      </div>
    </section>
  )
}
