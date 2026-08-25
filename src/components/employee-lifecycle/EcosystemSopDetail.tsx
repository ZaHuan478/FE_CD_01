import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  GitBranch,
  Inbox,
  ListCheck,
  Send,
  UserCheck
} from 'lucide-react'
import { type SopDetailItem } from './data/ecosystemModulesData'
import { useLanguage } from '../../context/LanguageContext'

interface EcosystemSopDetailProps {
  activeSopItem: SopDetailItem
  moduleId?: string
}

const getWorkflowIdForSop = (code: string, moduleId?: string): string => {
  if (moduleId === 'att') return 'MODULE-ATT'
  if (moduleId === 'pay') return 'MODULE-PAY'
  if (moduleId === 'ins') return 'MODULE-INS'
  if (moduleId === 'tax') return 'MODULE-TAX'
  if (code.includes('EMP-01') || code.includes('EMP01') || code.includes('ORG')) return 'LIFE-00'
  if (code.includes('REC') || code.includes('ATS') || code.includes('EMP-02') || code.includes('EMP02') || code.includes('EMP-03') || code.includes('EMP03')) return 'LIFE-01'
  if (code.includes('EMP-04') || code.includes('EMP04') || code.includes('DOC') || code.includes('PROFILE')) return 'LIFE-02'
  if (code.includes('EMP-11') || code.includes('EMP11') || code.includes('EMP-14') || code.includes('EMP14') || code.includes('MOBILITY') || code.includes('PLACEMENT') || code.includes('POSITION')) return 'LIFE-03'
  if (code.includes('PROB') || code.includes('EVAL') || code.includes('EMP-05') || code.includes('EMP05') || code.includes('EMP-06') || code.includes('EMP06') || code.includes('EMP-07') || code.includes('EMP07')) return 'LIFE-04'
  if (code.includes('SAL') || code.includes('PROM') || code.includes('TRAIN') || code.includes('EMP-08') || code.includes('EMP08') || code.includes('EMP-09') || code.includes('EMP09') || code.includes('EMP-10') || code.includes('EMP10') || code.includes('EMP-12') || code.includes('EMP12') || code.includes('EMP-13') || code.includes('EMP13')) return 'LIFE-05'
  if (code.includes('OFF') || code.includes('EMP-15') || code.includes('EMP15') || code.includes('EXIT') || code.includes('RESIGN')) return 'LIFE-07'
  return 'LIFE-01'
}

const EmptyValue: React.FC = () => (
  <p className="text-xs italic text-slate-500 dark:text-slate-400">Chưa được mô tả trong dữ liệu hiện có.</p>
)

const DataList: React.FC<{ items?: string[]; tone: 'input' | 'output' }> = ({ items, tone }) => {
  if (!items?.length) return <EmptyValue />

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === 'input' ? 'text-[#2e8bbd]' : 'text-[#1f5f86]'}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export const EcosystemSopDetail: React.FC<EcosystemSopDetailProps> = ({ activeSopItem, moduleId }) => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const workflowId = activeSopItem.workflowId || getWorkflowIdForSop(activeSopItem.code, moduleId)
  const wireframeId = activeSopItem.wireframeId || workflowId
  const title = language === 'vi' ? activeSopItem.title : activeSopItem.titleEn
  const actor = language === 'vi' ? activeSopItem.actor : activeSopItem.actorEn
  const inputs = language === 'vi' ? activeSopItem.inputs : activeSopItem.inputsEn
  const outputs = language === 'vi' ? activeSopItem.outputs : activeSopItem.outputsEn
  const scope = language === 'vi' ? activeSopItem.scopeNote : activeSopItem.scopeNoteEn
  const typeLabel = activeSopItem.type === 'N'
    ? (language === 'vi' ? 'Nhập liệu' : 'Data input')
    : activeSopItem.type === 'M'
      ? (language === 'vi' ? 'Thẩm định và duyệt' : 'Review and approval')
      : (language === 'vi' ? 'Hệ thống tự động' : 'System automation')

  const openDetailPage = (path: 'infographic' | 'flowchart' | 'raci' | 'specs') => {
    navigate(`/employee-lifecycle/${path}/${workflowId}?sop=${encodeURIComponent(activeSopItem.code)}`)
  }

  return (
    <div className="sticky top-20 space-y-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#1f5f86] px-2 py-1 font-mono text-[10px] font-bold text-white">{activeSopItem.code}</span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{typeLabel}</span>
            {activeSopItem.stageNumber && (
              <span className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {language === 'vi' ? `Chặng ${activeSopItem.stageNumber}` : `Stage ${activeSopItem.stageNumber}`}
              </span>
            )}
          </div>
          <h3 className="text-base font-black leading-snug text-slate-900 dark:text-white sm:text-lg">{title}</h3>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/employee-lifecycle/wireframe/${wireframeId}`)}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
        </button>
      </header>

      {scope && (
        <section className="rounded-lg border border-sky-100 bg-sky-50/60 p-3.5 dark:border-sky-900/60 dark:bg-sky-950/25">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
            {language === 'vi' ? 'Mục đích và phạm vi' : 'Purpose and scope'}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{scope}</p>
        </section>
      )}

      <section className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
        <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86]" />
        <div>
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'vi' ? 'Người thực hiện' : 'Owner'}
          </h4>
          {actor ? <p className="mt-1 font-semibold text-slate-900 dark:text-white">{actor}</p> : <EmptyValue />}
        </div>
      </section>

      <section aria-label={language === 'vi' ? 'Đầu vào, nội dung xử lý và kết quả' : 'Inputs, process, and outputs'} className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
            <Inbox className="h-3.5 w-3.5" />
            {language === 'vi' ? 'Đầu vào cần có' : 'Required inputs'}
          </h4>
          <DataList items={inputs} tone="input" />
        </article>

        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-4 w-4 lg:hidden" />
          <ArrowRight className="hidden h-4 w-4 lg:block" />
        </div>

        <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">
            {language === 'vi' ? 'Nội dung đang xử lý' : 'Current process'}
          </h4>
          <p className="mt-2 text-sm font-bold leading-snug">{title}</p>
          <p className="mt-2 text-[11px] text-sky-100">{typeLabel}</p>
        </article>

        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-4 w-4 lg:hidden" />
          <ArrowRight className="hidden h-4 w-4 lg:block" />
        </div>

        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
            <Send className="h-3.5 w-3.5" />
            {language === 'vi' ? 'Kết quả tạo ra' : 'Outputs'}
          </h4>
          <DataList items={outputs} tone="output" />
        </article>
      </section>

      <section className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <GitBranch className="h-3.5 w-3.5 text-[#1f5f86]" />
          {language === 'vi' ? 'Xem chi tiết nghiệp vụ' : 'Open business detail'}
        </h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { key: 'infographic' as const, icon: <ListCheck className="h-4 w-4" />, vi: 'Chi tiết từng bước', en: 'Step details' },
            { key: 'flowchart' as const, icon: <GitBranch className="h-4 w-4" />, vi: 'Sơ đồ luồng xử lý', en: 'Process flowchart' },
            { key: 'raci' as const, icon: <UserCheck className="h-4 w-4" />, vi: 'Vai trò và trách nhiệm', en: 'Roles and responsibilities' },
            { key: 'specs' as const, icon: <FileText className="h-4 w-4" />, vi: 'Điều kiện và quy định', en: 'Conditions and rules' }
          ].map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => openDetailPage(action.key)}
              className="group flex items-center justify-between gap-3 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-left text-xs font-bold text-slate-700 transition-colors hover:border-[#2e8bbd] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2">{action.icon}{language === 'vi' ? action.vi : action.en}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
