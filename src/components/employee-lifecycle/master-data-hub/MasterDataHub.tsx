import React, { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  GitBranch,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-react'

import { DOCX_OPERATIONAL_SOP_DATABASE } from '../workflow-detail/data/docxOperationalSopDatabase'
import type { SopSubProcess, SopSubStep } from '../workflow-detail/types'

interface MasterDataHubProps {
  onOpenERD?: () => void
  isDarkMode: boolean
  sopCode?: string | null
  moduleId?: string | null
}

type HubTab = 'guide' | 'catalogs' | 'management'

const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('vi')

const allOperationalProcesses = Object.values(DOCX_OPERATIONAL_SOP_DATABASE).flat()
const commonCatalogs = DOCX_OPERATIONAL_SOP_DATABASE['MODULE-MD'] || []
const managementFunctions = DOCX_OPERATIONAL_SOP_DATABASE['MODULE-MD-FUNCTIONS'] || []

const getStepRequirement = (step: SopSubStep) => {
  if (step.fieldsChecklist?.length) return step.fieldsChecklist
  return step.description ? [step.description] : []
}

const getRelatedManagementFunctions = (process?: SopSubProcess) => {
  if (!process) return []

  const processText = normalize([
    process.sopTitle,
    process.description,
    ...(process.inputs || []),
    ...process.steps.flatMap((step) => [step.title, step.description, ...(step.fieldsChecklist || [])])
  ].join(' '))

  const rules: Array<{ code: string; matches: string[] }> = [
    { code: 'MD-05', matches: ['phong ban', 'don vi'] },
    { code: 'MD-06', matches: ['chuc vu', 'chuc danh', 'cap bac'] },
    { code: 'MD-08', matches: ['ca lam viec', 'ca ap dung', 'lich lam viec', 'lich di ca', 'nghi phep'] },
    { code: 'MD-07', matches: ['luong', 'thang bang luong'] },
    { code: 'MD-09', matches: ['bhxh', 'bhyt', 'kham chua benh'] }
  ]

  return rules
    .filter((rule) => rule.matches.some((term) => processText.includes(term)))
    .map((rule) => managementFunctions.find((item) => item.sopCode === rule.code))
    .filter((item): item is SopSubProcess => Boolean(item))
}

const getContextModuleName = (moduleId?: string | null, process?: SopSubProcess) => {
  if (process?.sopCategory) return process.sopCategory.replace('Phân hệ ', '')
  const moduleLabels: Record<string, string> = {
    ats: 'Tuyển dụng', emp: 'Nhân sự', att: 'Chấm công', pay: 'Lương', ins: 'Bảo hiểm', tax: 'Thuế'
  }
  return moduleLabels[moduleId || ''] || 'Toàn hệ thống HRM'
}

export const MasterDataHub: React.FC<MasterDataHubProps> = ({ onOpenERD, isDarkMode, sopCode, moduleId }) => {
  const contextProcess = useMemo(() => {
    const target = normalize(sopCode || '')
    return target ? allOperationalProcesses.find((item) => normalize(item.sopCode) === target) : undefined
  }, [sopCode])

  const [activeTab, setActiveTab] = useState<HubTab>(contextProcess ? 'guide' : 'catalogs')
  const [selectedStepCode, setSelectedStepCode] = useState(contextProcess?.steps[0]?.stepCode || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReference, setSelectedReference] = useState<SopSubProcess | null>(null)
  const [activeItem, setActiveItem] = useState<SopSubProcess | null>(null)
  const [catalogPage, setCatalogPage] = useState(1)

  useEffect(() => {
    if (!contextProcess) return
    setActiveTab('guide')
    setSelectedStepCode(contextProcess.steps[0]?.stepCode || '')
    setSelectedReference(null)
    setActiveItem(null)
  }, [contextProcess])

  const selectedStep = contextProcess?.steps.find((step) => step.stepCode === selectedStepCode) || contextProcess?.steps[0]
  const relatedManagementFunctions = useMemo(() => getRelatedManagementFunctions(contextProcess), [contextProcess])
  const allRequirements = useMemo(() => {
    if (!contextProcess) return []
    return Array.from(new Set(contextProcess.steps.flatMap(getStepRequirement))).slice(0, 12)
  }, [contextProcess])

  const searchableItems = activeTab === 'management' ? managementFunctions : commonCatalogs
  const filteredItems = useMemo(() => {
    const query = normalize(searchTerm.trim())
    if (!query) return searchableItems
    return searchableItems.filter((item) => normalize([
      item.sopCode,
      item.sopTitle,
      item.description,
      ...(item.inputs || []),
      ...(item.steps.flatMap(getStepRequirement))
    ].join(' ')).includes(query))
  }, [searchTerm, searchableItems])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const visibleItems = filteredItems.slice((catalogPage - 1) * pageSize, catalogPage * pageSize)

  useEffect(() => {
    setCatalogPage(1)
  }, [activeTab, searchTerm])

  useEffect(() => {
    if (catalogPage > totalPages) setCatalogPage(totalPages)
  }, [catalogPage, totalPages])

  const surface = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
  const subdued = isDarkMode ? 'text-slate-400' : 'text-slate-500'

  const openReference = (item: SopSubProcess) => {
    setSelectedReference(item)
    setActiveItem(item)
  }

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      <section className={`rounded-2xl border shadow-sm overflow-hidden ${surface}`}>
        <div className="p-5 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25">HƯỚNG DẪN NGHIỆP VỤ</span>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{getContextModuleName(moduleId, contextProcess)}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">{contextProcess ? contextProcess.sopTitle : 'Danh mục dùng chung và cách vận hành'}</h2>
              <p className={`text-sm mt-1.5 max-w-3xl ${subdued}`}>{contextProcess ? 'Xem lần lượt từng việc cần làm, thông tin cần chuẩn bị và danh mục hỗ trợ cho quy trình này.' : 'Chọn một quy trình để xem dữ liệu cần chuẩn bị trước khi thực hiện nghiệp vụ.'}</p>
            </div>
          </div>
          {onOpenERD && <button type="button" onClick={onOpenERD} className="self-start xl:self-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"><GitBranch className="w-4 h-4 text-emerald-500" />Xem quan hệ dữ liệu</button>}
        </div>

        <div className={`px-3 py-2 border-t flex flex-wrap gap-1.5 ${isDarkMode ? 'bg-slate-950/45 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          {[
            { id: 'guide' as const, label: 'Hướng dẫn theo quy trình', icon: ClipboardList, disabled: !contextProcess },
            { id: 'catalogs' as const, label: 'Danh mục dùng chung', icon: Database },
            { id: 'management' as const, label: 'Cách quản lý danh mục', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon
            return <button key={tab.id} type="button" disabled={tab.disabled} onClick={() => { setActiveTab(tab.id); setCatalogPage(1) }} className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'} ${tab.disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'}`}><Icon className="w-3.5 h-3.5" />{tab.label}</button>
          })}
        </div>
      </section>

      {activeTab === 'guide' && contextProcess && selectedStep && <section className={`rounded-2xl border shadow-sm overflow-hidden ${surface}`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between gap-4 mb-3"><div><h3 className="font-extrabold text-sm">Các bước thực hiện</h3><p className={`text-xs mt-0.5 ${subdued}`}>Chọn một bước để xem hướng dẫn tương ứng.</p></div><span className={`text-xs font-bold ${subdued}`}>{contextProcess.steps.length} bước</span></div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {contextProcess.steps.map((step, index) => {
              const selected = step.stepCode === selectedStep.stepCode
              return <button key={step.stepCode} type="button" onClick={() => setSelectedStepCode(step.stepCode)} className={`min-w-[188px] max-w-[260px] shrink-0 text-left px-3 py-2.5 rounded-xl border transition-colors cursor-pointer ${selected ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-100 dark:border-blue-400' : isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}><span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-black mr-1.5 ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{index + 1}</span><span className="text-xs font-bold leading-snug">{step.title}</span></button>
            })}
          </div>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] gap-5">
          <div>
            <div className="flex items-start gap-3"><span className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black">{contextProcess.steps.findIndex((item) => item.stepCode === selectedStep.stepCode) + 1}</span><div><p className="text-[11px] font-extrabold tracking-wide text-blue-600 uppercase">Việc cần thực hiện</p><h3 className="text-base sm:text-lg font-black mt-0.5">{selectedStep.title}</h3></div></div>
            <div className={`mt-4 rounded-xl p-4 ${isDarkMode ? 'bg-slate-950/55 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
              <div className="flex items-center gap-2 text-xs font-extrabold mb-2"><FileText className="w-4 h-4 text-blue-600" />Mô tả yêu cầu</div>
              <p className={`text-sm leading-6 ${subdued}`}>{selectedStep.description || 'Thực hiện theo các thông tin cần chuẩn bị ở bên dưới.'}</p>
              {getStepRequirement(selectedStep).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{getStepRequirement(selectedStep).map((item) => <span key={item} className={`px-2.5 py-1.5 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700 border border-slate-200'}`}>{item}</span>)}</div>}
            </div>
          </div>
          <aside className="space-y-3">
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/35' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-2 text-xs font-extrabold mb-1"><UserRound className="w-4 h-4 text-blue-600" />Người thực hiện</div><p className={`text-sm font-semibold ${subdued}`}>{selectedStep.actor || 'Chưa nêu trong quy trình'}</p></div>
            <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/35' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-2 text-xs font-extrabold mb-1"><MapPin className="w-4 h-4 text-blue-600" />Nơi thực hiện</div><p className={`text-sm font-semibold ${subdued}`}>{selectedStep.location || 'Chưa nêu trong quy trình'}</p></div>
            {selectedStep.timing && <div className={`p-3.5 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/35' : 'border-slate-200 bg-white'}`}><div className="flex items-center gap-2 text-xs font-extrabold mb-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" />Thời điểm</div><p className={`text-sm font-semibold ${subdued}`}>{selectedStep.timing}</p></div>}
          </aside>
        </div>

        <div className={`p-4 sm:p-5 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/70'}`}>
          <h3 className="font-extrabold text-sm">Thông tin và danh mục cần chuẩn bị</h3><p className={`text-xs mt-0.5 ${subdued}`}>Các thông tin này xuất hiện trong các bước của quy trình đang xem.</p>
          <div className="mt-3 flex flex-wrap gap-2">{allRequirements.map((requirement) => <span key={requirement} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-700'}`}>{requirement}</span>)}</div>
          {relatedManagementFunctions.length > 0 && <div className="mt-5"><h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Danh mục cần sẵn sàng</h4><div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2.5">{relatedManagementFunctions.map((item) => <button key={item.sopCode} type="button" onClick={() => openReference(item)} className={`p-3 text-left rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'}`}><div><p className="text-xs font-extrabold">{item.sopTitle}</p><p className={`text-[11px] mt-1 line-clamp-2 ${subdued}`}>{item.outputs?.[0] || item.inputs?.[0]}</p></div><ChevronRight className="w-4 h-4 shrink-0 text-blue-600" /></button>)}</div></div>}
        </div>
      </section>}

      {(activeTab === 'catalogs' || activeTab === 'management') && <section className={`rounded-2xl border shadow-sm p-4 sm:p-5 ${surface}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><h3 className="text-base font-black">{activeTab === 'management' ? 'Cách quản lý danh mục trong HRM' : 'Danh mục dùng chung trong HRM'}</h3><p className={`text-xs mt-1 ${subdued}`}>{activeTab === 'management' ? 'Chọn một nội dung để xem điều kiện và kết quả của thao tác quản lý.' : 'Chọn một danh mục để xem mục đích và các thông tin cần khai báo.'}</p></div><div className="relative w-full sm:w-80"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm danh mục..." className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} /></div></div>
        {selectedReference && activeTab === 'catalogs' && <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'border-blue-500/30 bg-blue-500/10' : 'border-blue-200 bg-blue-50'}`}><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300 uppercase">Danh mục hỗ trợ quy trình đang xem</p><h4 className="font-black mt-1">{selectedReference.sopTitle}</h4><p className={`text-xs leading-5 mt-1.5 ${subdued}`}>{selectedReference.outputs?.[0] || selectedReference.description}</p></div><button type="button" onClick={() => setSelectedReference(null)} className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer">Đóng</button></div></div>}
        <div className="mt-4 flex items-center justify-between gap-3 text-xs">
          <span className={subdued}>Hiển thị {filteredItems.length === 0 ? 0 : (catalogPage - 1) * pageSize + 1}-{Math.min(catalogPage * pageSize, filteredItems.length)} trong số {filteredItems.length} nội dung</span>
          <span className={`font-semibold ${subdued}`}>Mỗi trang 6 danh mục</span>
        </div>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {visibleItems.map((item) => (
            <button key={item.sopCode} type="button" onClick={() => setActiveItem(item)} className={`group text-left min-h-[108px] p-4 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${isDarkMode ? 'border-slate-800 bg-slate-950/25 hover:border-blue-500/70 hover:bg-slate-800' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40'}`}>
              <div className="min-w-0">
                <p className={`text-[11px] font-bold ${subdued}`}>{item.sopCategory}</p>
                <h4 className="text-sm font-extrabold mt-1 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-300">{item.sopTitle}</h4>
                <p className={`text-xs mt-2 line-clamp-2 ${subdued}`}>{item.outputs?.[0] || item.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-blue-600" />
            </button>
          ))}
        </div>
        {filteredItems.length === 0 && <p className={`py-10 text-center text-sm ${subdued}`}>Không tìm thấy nội dung phù hợp.</p>}
        {filteredItems.length > pageSize && <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" disabled={catalogPage === 1} onClick={() => setCatalogPage((page) => Math.max(1, page - 1))} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Trang trước</button>
          <span className={`text-xs font-bold ${subdued}`}>Trang {catalogPage}/{totalPages}</span>
          <button type="button" disabled={catalogPage === totalPages} onClick={() => setCatalogPage((page) => Math.min(totalPages, page + 1))} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Trang sau</button>
        </div>}
      </section>}

      {activeItem && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="master-data-detail-title" onMouseDown={() => setActiveItem(null)}>
        <div onMouseDown={(event) => event.stopPropagation()} className={`w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl shadow-2xl border ${surface}`}>
          <div className={`sticky top-0 z-10 p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div>
              <p className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300 uppercase">{activeItem.sopCategory}</p>
              <h3 id="master-data-detail-title" className="text-lg sm:text-xl font-black mt-1">{activeItem.sopTitle}</h3>
            </div>
            <button type="button" onClick={() => setActiveItem(null)} aria-label="Đóng chi tiết danh mục" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            {(activeItem.outputs?.[0] || activeItem.description) && <section><h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Mục đích và ý nghĩa</h4><p className={`text-sm leading-6 mt-2 ${subdued}`}>{activeItem.outputs?.[0] || activeItem.description}</p></section>}
            {activeItem.inputs?.length ? <section><h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Thông tin cần khai báo</h4><div className="mt-2 flex flex-wrap gap-2">{activeItem.inputs.map((input) => <span key={input} className={`px-2.5 py-1.5 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{input}</span>)}</div></section> : activeItem.steps.flatMap(getStepRequirement).length > 0 ? <section><h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Thông tin cần khai báo</h4><div className="mt-2 flex flex-wrap gap-2">{activeItem.steps.flatMap(getStepRequirement).map((input) => <span key={input} className={`px-2.5 py-1.5 rounded-lg text-xs ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>{input}</span>)}</div></section> : null}
            {activeItem.rules?.[0] && <section className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 text-amber-100' : 'bg-amber-50 text-amber-900'}`}><h4 className="text-xs font-extrabold">Điều kiện áp dụng</h4><p className="text-sm leading-6 mt-1.5">{activeItem.rules[0]}</p></section>}
          </div>
        </div>
      </div>}
    </div>
  )
}
