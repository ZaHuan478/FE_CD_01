import React from 'react'
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react'
import {
  CORE_OPERATION_MODULES,
  type ModuleEcosystemItem,
  type SopDetailItem
} from '../../../entities/module/data/ecosystemModulesData'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface EcosystemSopWorkbenchProps {
  activeModule: ModuleEcosystemItem
  handleSelectModule: (id: string) => void
  isSopListExpanded?: boolean
  setIsSopListExpanded?: (val: boolean) => void
  activeTypeFilter: 'ALL' | 'N' | 'M' | 'C' | 'A'
  setActiveTypeFilter: (val: 'ALL' | 'N' | 'M' | 'C' | 'A') => void
  filteredSopList: SopDetailItem[]
  setSelectedSopCode: (code: string) => void
  selectedStageId: string
  setSelectedStageId: (id: string) => void
  isStageDropdownOpen: boolean
  setIsStageDropdownOpen: (val: boolean) => void
  stageDropdownRef: React.RefObject<HTMLDivElement | null>
  collapsedStages: Record<string, boolean>
  toggleStageCollapse: (id: string) => void
  activeSopItem: SopDetailItem
  children: React.ReactNode
}

const TYPE_FILTER_OPTIONS: { key: 'ALL' | 'N' | 'M' | 'C' | 'A'; vi: string; en: string; badge?: string }[] = [
  { key: 'ALL', vi: 'Tất cả', en: 'All' },
  { key: 'N', vi: 'Nhập liệu', en: 'Input', badge: 'N' },
  { key: 'M', vi: 'Duyệt', en: 'Approval', badge: 'M' },
  { key: 'C', vi: 'Kiểm soát', en: 'Control', badge: 'C' },
  { key: 'A', vi: 'Tự động', en: 'Auto', badge: 'A' }
]

export const EcosystemSopWorkbench: React.FC<EcosystemSopWorkbenchProps> = ({
  activeModule,
  handleSelectModule,
  activeTypeFilter,
  setActiveTypeFilter,
  filteredSopList,
  setSelectedSopCode,
  selectedStageId,
  setSelectedStageId,
  isStageDropdownOpen,
  setIsStageDropdownOpen,
  stageDropdownRef,
  collapsedStages,
  toggleStageCollapse,
  activeSopItem,
  children
}) => {
  const { language } = useLanguage()

  // Calculate dynamic SOP counts for stage dropdown
  const stages = activeModule.stages || []
  const totalSopsInModule = activeModule.sopList.length

  return (
    <section className="w-full space-y-5 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">

      {/* SECTION HEADER */}
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {language === 'vi' ? 'Khám phá quy trình Vận hành lõi' : 'Core Operations Process Explorer'}
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
            {language === 'vi'
              ? 'Chi tiết từng quy trình từ đầu vào đến kết quả'
              : 'Detailed Process Workbench & Operational Flows'}
          </h3>
          {/* <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'vi'
              ? 'Chọn phân hệ, chặng và SOP để xem toàn bộ nghiệp vụ từ đầu vào, các bước xử lý đến kết quả bàn giao.'
              : 'Select a business module, operational stage, and SOP to inspect complete end-to-end data flows and responsibilities.'}
          </p> */}
        </div>
      </header>

      {/* TẦNG 1 — CONTEXTUAL MODULE SWITCHER TABS */}
      <nav
        aria-label={language === 'vi' ? 'Chọn phân hệ Vận hành lõi' : 'Select Core Operations Module'}
        role="tablist"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/60"
      >
        {CORE_OPERATION_MODULES.map((mod) => {
          const isSelected = activeModule.id === mod.id
          return (
            <button
              key={mod.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelectModule(mod.id)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5f86] ${isSelected
                ? 'bg-[#1f5f86] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
            >
              <span>{language === 'vi' ? mod.shortLabel : mod.nameEn.split('&')[0].trim()}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
              >
                {mod.sopList.length}
              </span>
            </button>
          )
        })}
      </nav>

      {/* TẦNG 2 — MODULE SUMMARY & INTER-MODULE HANDOFF BANNER */}
      <article className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Left: Module identity and plain explanation */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-white text-[#1f5f86] shadow-2xs dark:border-sky-800 dark:bg-slate-900 dark:text-sky-300">
              {activeModule.icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  {language === 'vi' ? activeModule.name : activeModule.nameEn}
                </h4>
                <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-[#1f5f86] dark:bg-sky-900/80 dark:text-sky-200">
                  {activeModule.sopList.length} SOPs · {stages.length} {language === 'vi' ? 'chặng' : 'stages'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {language === 'vi' ? activeModule.plainExplanation : activeModule.plainExplanationEn}
              </p>
            </div>
          </div>

          {/* Right: Cross-module data handoff summary */}
          <div className="flex shrink-0 flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-lg border border-sky-200/80 bg-white/90 p-2.5 text-xs text-slate-700 shadow-2xs dark:border-sky-900 dark:bg-slate-900/90 dark:text-slate-200 lg:max-w-[480px]">
            <div className="flex-1 min-w-0">
              <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-slate-400">
                {language === 'vi' ? 'Dữ liệu nhận vào:' : 'Inputs from:'}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-semibold" title={activeModule.receivesFrom}>
                {activeModule.receivesFrom}
              </span>
            </div>
            <div className="hidden sm:flex items-center text-slate-300 dark:text-slate-600">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-1 sm:pt-0 sm:pl-2">
              <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                {language === 'vi' ? 'Bàn giao tiếp theo:' : 'Handoff to:'}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-semibold text-[#1f5f86] dark:text-sky-300" title={activeModule.sendsTo}>
                {activeModule.sendsTo}
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* TẦNG 3 — WORKBENCH TWO COLUMNS (38% Left / 62% Right on desktop) */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[38%_62%] xl:gap-6">

        {/* CỘT TRÁI: DANH SÁCH QUY TRÌNH THEO CHẶNG */}
        <aside className="w-full space-y-3.5 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60 sm:p-4">

          {/* Header & Collapse toggle */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5 dark:border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Layers className="h-4 w-4 text-[#1f5f86] dark:text-sky-300" />
              <span>{language === 'vi' ? 'Các quy trình theo chặng' : 'Processes by Stage'}</span>
            </h4>
            <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredSopList.length}/{totalSopsInModule}
            </span>
          </div>

          {/* Type Filter Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {language === 'vi' ? 'Lọc loại thao tác:' : 'Filter by step type:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {TYPE_FILTER_OPTIONS.map((opt) => {
                const isActive = activeTypeFilter === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveTypeFilter(opt.key)}
                    className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f5f86] ${isActive
                      ? 'bg-[#1f5f86] text-white shadow-2xs'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                  >
                    {opt.badge && (
                      <span className={`font-mono text-[9px] font-black ${isActive ? 'text-sky-100' : 'text-[#1f5f86] dark:text-sky-300'}`}>
                        {opt.badge}
                      </span>
                    )}
                    <span>{language === 'vi' ? opt.vi : opt.en}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stage Selector Dropdown */}
          <div className="relative" ref={stageDropdownRef}>
            <button
              type="button"
              onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 shadow-2xs"
            >
              <span className="truncate">
                {selectedStageId === 'ALL'
                  ? (language === 'vi' ? `Tất cả các chặng (${stages.length} chặng)` : `All stages (${stages.length} stages)`)
                  : stages.find(s => s.stageId === selectedStageId)?.stageTitle || selectedStageId}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isStageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStageDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-300 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStageId('ALL')
                    setIsStageDropdownOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${selectedStageId === 'ALL'
                    ? 'bg-[#1f5f86] text-white'
                    : 'text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                >
                  <span>{language === 'vi' ? 'Tất cả các chặng' : 'All stages'}</span>
                  <span className="text-[10px] font-mono opacity-80">{totalSopsInModule} SOPs</span>
                </button>
                {stages.map((stg) => (
                  <button
                    key={stg.stageId}
                    type="button"
                    onClick={() => {
                      setSelectedStageId(stg.stageId)
                      setIsStageDropdownOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${selectedStageId === stg.stageId
                      ? 'bg-[#1f5f86] text-white'
                      : 'text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="truncate pr-2">{stg.stageTitle}</span>
                    <span className="text-[10px] font-mono opacity-80">{stg.sopCodes.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stage Accordion & SOP List */}
          <div className="space-y-2.5 pt-1">
            {stages
              .filter(stg => selectedStageId === 'ALL' || stg.stageId === selectedStageId)
              .map((stg) => {
                const stageSopItems = filteredSopList.filter(s => stg.sopCodes.includes(s.code))
                const isCollapsed = Boolean(collapsedStages[stg.stageId])

                if (stageSopItems.length === 0 && activeTypeFilter !== 'ALL') {
                  return null
                }

                return (
                  <div
                    key={stg.stageId}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs"
                  >
                    {/* Stage Header */}
                    <button
                      type="button"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleStageCollapse(stg.stageId)}
                      className="flex w-full cursor-pointer items-center justify-between bg-slate-50/90 px-3 py-2 text-left transition-colors hover:bg-sky-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                          {language === 'vi' ? stg.stageTitle : stg.stageTitleEn}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {stageSopItems.length} {language === 'vi' ? 'quy trình' : 'processes'}
                        </span>
                      </div>
                      <span className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                        {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    {/* Stage SOP Rows */}
                    {!isCollapsed && (
                      <div className="divide-y divide-slate-100 p-1 dark:divide-slate-800">
                        {stageSopItems.map((sop) => {
                          const isSelected = activeSopItem.code === sop.code
                          const types = sop.stepTypes || [sop.type]

                          return (
                            <button
                              key={sop.code}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setSelectedSopCode(sop.code)}
                              className={`flex w-full cursor-pointer items-start justify-between gap-2 rounded-md p-2 text-left transition-colors ${isSelected
                                ? 'border-l-3 border-[#1f5f86] bg-sky-50/80 text-[#1f5f86] dark:bg-sky-950/40 dark:text-sky-200'
                                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                                }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                  <span className="font-mono text-[10px] font-bold text-[#1f5f86] dark:text-sky-300">
                                    {sop.code}
                                  </span>
                                  {types.map(t => (
                                    <span
                                      key={t}
                                      className="rounded bg-slate-100 px-1 py-0.2 font-mono text-[8.5px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                                <h5 className="text-xs font-semibold leading-snug truncate">
                                  {sop.title}
                                </h5>
                                {sop.actor && (
                                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                    {sop.actor}
                                  </p>
                                )}
                              </div>

                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${isSelected
                                  ? 'bg-[#1f5f86] text-white'
                                  : 'text-slate-300 dark:text-slate-600'
                                  }`}
                              >
                                {isSelected ? '✓' : '›'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </aside>

        {/* CỘT PHẢI: CHI TIẾT SOP ĐƯỢC CHỌN (CHILDREN) */}
        <main className="w-full min-w-0">
          {children}
        </main>

      </div>
    </section>
  )
}
