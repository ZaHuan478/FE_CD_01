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
  Info,
  Layers,
  ListCheck,
  Scale,
  Send,
  UserCheck
} from 'lucide-react'
import { type SopDetailItem } from '../../../entities/module/data/ecosystemModulesData'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'
import { CORE_OPERATIONS_LEGAL_REFS } from '../../../entities/module/data/coreOperationsLegalRefs'

interface EcosystemSopDetailProps {
  activeSopItem: SopDetailItem
  moduleId?: string
}

const EmptyValue: React.FC<{ text?: string }> = ({ text }) => (
  <p className="text-xs italic text-slate-500 dark:text-slate-400">
    {text || 'Chưa được mô tả trong dữ liệu hiện có.'}
  </p>
)

const DataList: React.FC<{ items?: string[]; tone: 'input' | 'output'; isInferred?: boolean }> = ({
  items,
  tone,
  isInferred
}) => {
  const { language } = useLanguage()

  if (!items?.length) return <EmptyValue />

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <CheckCircle2
              className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === 'input' ? 'text-[#2e8bbd]' : 'text-[#1f5f86] dark:text-sky-400'}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {isInferred && (
        <p className="pt-1 text-[10px] text-slate-600 dark:text-slate-400 italic">
          {language === 'vi' ? '*(Dữ liệu được tổng hợp từ cấu hình các bước trong quy trình)' : '*(Data synthesized from step configurations)'}
        </p>
      )}
    </div>
  )
}

const getTypeBadgeInfo = (type: 'N' | 'M' | 'A' | 'C', lang: 'vi' | 'en') => {
  switch (type) {
    case 'N':
      return {
        label: lang === 'vi' ? 'Nhập liệu' : 'Data Entry',
        fullLabel: lang === 'vi' ? 'Nhập liệu / Khai báo' : 'Data Entry / Declaration',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
      }
    case 'M':
      return {
        label: lang === 'vi' ? 'Duyệt' : 'Approval',
        fullLabel: lang === 'vi' ? 'Thẩm định / Phê duyệt' : 'Review / Approval',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
      }
    case 'C':
      return {
        label: lang === 'vi' ? 'Kiểm soát' : 'Control',
        fullLabel: lang === 'vi' ? 'Kiểm soát / Đối soát' : 'Control / Validation',
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
      }
    case 'A':
      return {
        label: lang === 'vi' ? 'Tự động' : 'Automated',
        fullLabel: lang === 'vi' ? 'Tự động / Hệ thống' : 'Automated / System',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
      }
  }
}

export const EcosystemSopDetail: React.FC<EcosystemSopDetailProps> = ({ activeSopItem, moduleId }) => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const workflowId = activeSopItem.workflowId || 'LIFE-01'
  const hasWireframe = Boolean(activeSopItem.hasWireframe && activeSopItem.wireframeId)
  const wireframeId = activeSopItem.wireframeId

  const title = language === 'vi' ? activeSopItem.title : activeSopItem.titleEn || activeSopItem.title
  const actor = language === 'vi' ? activeSopItem.actor : activeSopItem.actorEn || activeSopItem.actor
  const inputs = language === 'vi' ? activeSopItem.inputs : activeSopItem.inputsEn || activeSopItem.inputs
  const outputs = language === 'vi' ? activeSopItem.outputs : activeSopItem.outputsEn || activeSopItem.outputs
  const scope = language === 'vi' ? activeSopItem.scopeNote || activeSopItem.description : activeSopItem.scopeNoteEn || activeSopItem.description

  const stepTypes = activeSopItem.stepTypes && activeSopItem.stepTypes.length > 0
    ? activeSopItem.stepTypes
    : [activeSopItem.type]

  const relevantLegalRefs = CORE_OPERATIONS_LEGAL_REFS.filter(ref => {
    if (!moduleId) return false
    const normalizedMod = moduleId.toLowerCase() as any
    return ref.affectedModules.includes(normalizedMod)
  })

  const openDetailPage = (path: 'infographic' | 'flowchart' | 'raci' | 'specs') => {
    navigate(`/employee-lifecycle/${path}/${workflowId}?sop=${encodeURIComponent(activeSopItem.code)}`)
  }

  const handleOpenWireframe = () => {
    if (hasWireframe && wireframeId) {
      navigate(`/employee-lifecycle/wireframe/${wireframeId}`)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      {/* SOP HEADER */}
      <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-[#1f5f86] px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs">
              {activeSopItem.code}
            </span>

            {/* Step types present */}
            {stepTypes.map(t => {
              const info = getTypeBadgeInfo(t, language)
              return (
                <span
                  key={t}
                  title={info.fullLabel}
                  className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold cursor-help ${info.bg}`}
                >
                  <span className="font-mono font-black">{t}</span>
                  <span>{info.label}</span>
                </span>
              )
            })}

            {activeSopItem.stageNumber && (
              <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {language === 'vi' ? `Chặng ${activeSopItem.stageNumber}` : `Stage ${activeSopItem.stageNumber}`}
              </span>
            )}
          </div>

          <h3 className="text-base font-black leading-snug text-slate-900 dark:text-white sm:text-lg">
            {title}
          </h3>

          {activeSopItem.stageTitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeSopItem.stageTitle}
            </p>
          )}
        </div>

        {/* Sample Screen Wireframe Button */}
        <div>
          {hasWireframe ? (
            <button
              type="button"
              onClick={handleOpenWireframe}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[#1f5f86] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
              <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
            </button>
          ) : (
            <div
              title={language === 'vi' ? 'SOP này chưa có màn hình mẫu' : 'Sample screen not available for this SOP'}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600 cursor-not-allowed opacity-75"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
            </div>
          )}
        </div>
      </header>

      {/* PURPOSE & SCOPE */}
      {scope && (
        <section className="rounded-lg border border-sky-100 bg-sky-50/60 p-3.5 dark:border-sky-900/60 dark:bg-sky-950/25">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            {language === 'vi' ? 'Mục đích và phạm vi' : 'Purpose and scope'}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{scope}</p>
        </section>
      )}

      {/* PARTICIPANTS & OWNERSHIP */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-2.5">
          <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86] dark:text-sky-400" />
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Người thực hiện / Chủ trì' : 'Process Owner'}
            </h4>
            {actor ? (
              <p className="mt-0.5 font-bold text-slate-900 dark:text-white">{actor}</p>
            ) : (
              <EmptyValue />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>{language === 'vi' ? 'Thực hiện theo phân quyền RBAC' : 'Enforced by RBAC'}</span>
        </div>
      </section>

      {/* 3-BLOCK DATA FLOW: INPUT -> PROCESS -> OUTPUT */}
      <section
        aria-label={language === 'vi' ? 'Đầu vào, nội dung xử lý và kết quả' : 'Inputs, process, and outputs'}
        className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"
      >
        {/* INPUT BLOCK */}
        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              <Inbox className="h-3.5 w-3.5" />
              {language === 'vi' ? 'Đầu vào cần có' : 'Required inputs'}
            </h4>
            <DataList items={inputs} tone="input" />
          </div>
        </article>

        {/* ARROW */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-4 w-4 lg:hidden" />
          <ArrowRight className="hidden h-4 w-4 lg:block" />
        </div>

        {/* PROCESS BLOCK */}
        <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white shadow-xs">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">
            {language === 'vi' ? 'Nội dung đang xử lý' : 'Current process'}
          </h4>
          <p className="mt-2 text-sm font-bold leading-snug">{title}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {stepTypes.map(t => (
              <span key={t} className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                {t}
              </span>
            ))}
          </div>
        </article>

        {/* ARROW */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-4 w-4 lg:hidden" />
          <ArrowRight className="hidden h-4 w-4 lg:block" />
        </div>

        {/* OUTPUT BLOCK */}
        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              <Send className="h-3.5 w-3.5" />
              {language === 'vi' ? 'Kết quả tạo ra' : 'Outputs'}
            </h4>
            <DataList items={outputs} tone="output" />
          </div>
        </article>
      </section>

      {/* LEGAL & COMPLIANCE REFERENCE NOTE */}
      {relevantLegalRefs.length > 0 && (
        <section className="rounded-lg border border-slate-200 bg-white p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
            <Scale className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-400" />
            <span>{language === 'vi' ? 'Cơ sở pháp lý tham chiếu:' : 'Legal References:'}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {relevantLegalRefs.map(ref => (
              <span
                key={ref.id}
                title={`${ref.title} (${ref.note})`}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-help"
              >
                {ref.documentNumber}
              </span>
            ))}
          </div>
          {/* <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
            *{language === 'vi'
              ? 'Quy tắc nghiệp vụ cần được cấu hình theo văn bản pháp luật có hiệu lực tại kỳ xử lý.'
              : 'Business rules must be configured in accordance with regulations effective at the processing period.'}
          </p> */}
        </section>
      )}

      {/* 4 BUSINESS ACTIONS ROUTING */}
      <section className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <h4 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <GitBranch className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-400" />
          {language === 'vi' ? 'Xem chi tiết nghiệp vụ' : 'Open business detail'}
        </h4>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              key: 'infographic' as const,
              icon: <ListCheck className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
              vi: 'Chi tiết từng bước',
              en: 'Step details'
            },
            {
              key: 'flowchart' as const,
              icon: <GitBranch className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
              vi: 'Sơ đồ luồng xử lý',
              en: 'Process flowchart'
            },
            {
              key: 'raci' as const,
              icon: <UserCheck className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
              vi: 'Vai trò và trách nhiệm',
              en: 'Roles & RACI'
            },
            {
              key: 'specs' as const,
              icon: <FileText className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
              vi: 'Điều kiện và quy định',
              en: 'Specs & Rules'
            }
          ].map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => openDetailPage(action.key)}
              className="group flex items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-left text-xs font-bold text-slate-700 transition-colors hover:border-[#2e8bbd] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-2">
                {action.icon}
                <span>{language === 'vi' ? action.vi : action.en}</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[#1f5f86] transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
