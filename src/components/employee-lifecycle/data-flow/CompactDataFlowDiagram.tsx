import React, { useState } from 'react'
import { ArrowRight, CalendarClock, CheckCircle2, GitBranch, RefreshCw, Zap } from 'lucide-react'
import { useLanguage } from '../../../context/LanguageContext'
import { DATA_FLOW_CONNECTIONS, MODULE_NODES, type DataFlowConnection } from './DataFlowDiagram'

const frequencyIcon = {
  once: Zap,
  ongoing: RefreshCw,
  monthly: CalendarClock
}

export const CompactDataFlowDiagram: React.FC = () => {
  const { language } = useLanguage()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = DATA_FLOW_CONNECTIONS[selectedIndex]
  const getModule = (id: string) => MODULE_NODES.find((module) => module.id === id)

  const frequencyLabel = (connection: DataFlowConnection) => {
    if (language !== 'vi') return connection.frequency === 'once' ? 'One-time' : connection.frequency === 'monthly' ? 'Monthly' : 'Ongoing'
    return connection.frequency === 'once' ? 'Một lần' : connection.frequency === 'monthly' ? 'Hàng tháng' : 'Xuyên suốt'
  }

  return (
    <section className="space-y-4">
      <header className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white">
          <GitBranch className="h-4 w-4" />
        </span>
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            {language === 'vi' ? 'Luồng dữ liệu giữa các phân hệ' : 'Cross-module data flow'}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {language === 'vi'
              ? 'Chọn một luồng ở cột trái để xem chính xác gói dữ liệu được chuyển giao và tần suất cập nhật.'
              : 'Select a flow on the left to inspect its transferred data and update frequency.'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.4fr)]">
        <div className="max-h-[470px] space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/50">
          {DATA_FLOW_CONNECTIONS.map((connection, index) => {
            const isSelected = selectedIndex === index
            const Icon = frequencyIcon[connection.frequency]
            const from = getModule(connection.from)
            const to = getModule(connection.to)
            return (
              <button
                key={`${connection.from}-${connection.to}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${isSelected
                  ? 'border-[#1f5f86] bg-[#1f5f86] text-white'
                  : 'border-transparent bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-900'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <span>{from?.shortName || connection.from}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>{to?.shortName || connection.to}</span>
                  <span className={`ml-auto flex items-center gap-1 ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}><Icon className="h-3 w-3" />{frequencyLabel(connection)}</span>
                </div>
                <p className={`mt-1 text-xs font-semibold leading-snug ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {language === 'vi' ? connection.label : connection.labelEn}
                </p>
              </button>
            )
          })}
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
                <span>{getModule(selected.from)?.shortName || selected.from}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{getModule(selected.to)?.shortName || selected.to}</span>
              </p>
              <h5 className="mt-1 text-base font-black text-slate-900 dark:text-white">
                {language === 'vi' ? selected.label : selected.labelEn}
              </h5>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {frequencyLabel(selected)}
            </span>
          </div>

          <h6 className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'vi' ? 'Dữ liệu được bàn giao' : 'Transferred data'}
          </h6>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(language === 'vi' ? selected.dataItems : selected.dataItemsEn).map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
