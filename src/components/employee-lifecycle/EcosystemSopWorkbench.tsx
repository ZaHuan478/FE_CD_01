import React from 'react'
import { ChevronDown, ChevronUp, ListCheck, GitBranch } from 'lucide-react'
import { FIVE_CORE_MODULES, type SopDetailItem } from './data/ecosystemModulesData'
import { useLanguage } from '../../context/LanguageContext'

interface EcosystemSopWorkbenchProps {
  activeModule: any
  handleSelectModule: (id: string) => void
  isSopListExpanded: boolean
  setIsSopListExpanded: (val: boolean) => void
  activeTypeFilter: 'ALL' | 'N' | 'M' | 'A'
  setActiveTypeFilter: (val: 'ALL' | 'N' | 'M' | 'A') => void
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

export const EcosystemSopWorkbench: React.FC<EcosystemSopWorkbenchProps> = ({
  activeModule,
  handleSelectModule,
  isSopListExpanded,
  setIsSopListExpanded,
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

  return (
    <div className="mt-2 w-full space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      
      {/* QUICK MODULE SWITCHER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'vi' ? 'Phân hệ nghiệp vụ' : 'Business module'}
          </span>
          {FIVE_CORE_MODULES.map((mod) => {
            const isCurrSelected = activeModule.id === mod.id
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleSelectModule(mod.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold transition-colors ${isCurrSelected
                  ? 'border-[#1f5f86] bg-[#1f5f86] text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
              >
                <span>{language === 'vi' ? mod.name.replace(/^Phân hệ\s+/i, '').split('(')[0].trim() : mod.nameEn.replace(/^Module\s+/i, '').split('(')[0].trim()}</span>
                <span className="font-mono text-[10px] opacity-75">{mod.sopList.length}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsSopListExpanded(!isSopListExpanded)}
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <span>{isSopListExpanded ? (language === 'vi' ? 'Ẩn danh sách quy trình' : 'Hide process list') : (language === 'vi' ? `Hiện ${activeModule.sopList.length} quy trình` : `Show ${activeModule.sopList.length} processes`)}</span>
          {isSopListExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ACTIVE MODULE CONTEXT */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-md border border-sky-100 bg-sky-50 p-2 text-[#1f5f86] dark:border-sky-900 dark:bg-sky-950/40">
            {activeModule.icon}
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
              {language === 'vi' ? activeModule.name : activeModule.nameEn}
            </h4>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {language === 'vi' ? `${activeModule.sopList.length} quy trình có thể tra cứu` : `${activeModule.sopList.length} processes available`}
            </p>
          </div>
        </div>
      </div>

      {activeModule.id === 'emp' && activeSopItem.isInheritedFromATS && (
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-sky-200 bg-sky-50/70 p-3 text-slate-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-slate-200 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              {language === 'vi' ? 'Liên thông từ Tuyển dụng' : 'Recruitment handoff'}
            </p>
            <p className="mt-1 text-xs font-semibold">
              {language === 'vi'
                ? 'Quy trình này tiếp nhận dữ liệu ứng viên từ phân hệ Tuyển dụng để thực hiện nghiệp vụ nhân sự tiếp theo.'
                : 'This process receives candidate data from Recruitment for the next employee operation.'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-sky-200 bg-white px-3 py-1.5 text-[11px] font-semibold dark:border-sky-900 dark:bg-slate-900">
            <span>Tuyển dụng ATS</span>
            <span aria-hidden="true">→</span>
            <span>Nhân sự</span>
          </div>
        </div>
      )}

      {isSopListExpanded && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.5fr)]">
            
            {/* CỘT TRÁI (5 Cols): TIẾN TRÌNH CÁC CHẶNG NGHIỆP VỤ & DANH SÁCH SOPS */}
            <div className="relative space-y-3.5 lg:max-h-[720px] lg:overflow-y-auto lg:pr-1">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {language === 'vi'
                    ? `CÁC BƯỚC THAO TÁC THEO CHẶNG (${filteredSopList.length} SOPs)`
                    : `STAGE WORKFLOW STEPS (${filteredSopList.length} SOPs)`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                <span className="px-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {language === 'vi' ? 'Loại thao tác' : 'Operation type'}
                </span>
                {([
                  ['ALL', language === 'vi' ? 'Tất cả' : 'All'],
                  ['N', language === 'vi' ? 'Nhập liệu' : 'Input'],
                  ['M', language === 'vi' ? 'Duyệt' : 'Review'],
                  ['A', language === 'vi' ? 'Tự động' : 'Automated']
                ] as const).map(([filter, label]) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveTypeFilter(filter)}
                    className={`rounded px-2 py-1.5 text-[11px] font-semibold transition-colors ${activeTypeFilter === filter
                      ? 'bg-[#1f5f86] text-white'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    {label}{filter === 'ALL' ? ` (${activeModule.sopList.length})` : ''}
                  </button>
                ))}
              </div>

              {activeModule.stages && activeModule.stages.length > 0 && (
                <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/70 flex items-center justify-between gap-2 shadow-2xs relative z-30">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {language === 'vi' ? 'CHỌN CHẶNG:' : 'SELECT STAGE:'}
                    </span>
                  </div>

                  <div ref={stageDropdownRef} className="relative flex-1 max-w-[270px]">
                    <button
                      type="button"
                      onClick={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
                      className="flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <span className="truncate">
                        {selectedStageId === 'ALL'
                          ? (language === 'vi' ? `Tất cả (${activeModule.stages.length} chặng)` : `All (${activeModule.stages.length} stages)`)
                          : (() => {
                              const curr = activeModule.stages.find((s: any) => s.stageId === selectedStageId)
                              if (!curr) return 'Chọn chặng'
                              return language === 'vi' ? curr.stageTitle : curr.stageTitleEn
                            })()}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isStageDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isStageDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[290px] sm:w-[320px] p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl z-50 animate-fadeIn space-y-1 ring-1 ring-black/10 dark:ring-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStageId('ALL')
                            setIsStageDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            selectedStageId === 'ALL'
                              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{language === 'vi' ? 'Tất cả các chặng' : 'All Stages'}</span>
                          </div>
                          <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {activeModule.sopList.length} SOPs
                          </span>
                        </button>

                        {activeModule.stages.map((stg: any) => {
                          const isSelected = selectedStageId === stg.stageId
                          const count = activeModule.sopList.filter((s: any) => stg.sopCodes.includes(s.code)).length
                          const label = language === 'vi' ? stg.stageTitle : stg.stageTitleEn

                          return (
                            <button
                              key={stg.stageId}
                              type="button"
                              onClick={() => {
                                setSelectedStageId(stg.stageId)
                                setIsStageDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                  {stg.stageNumber}
                                </span>
                                <span className="truncate">{label}</span>
                              </div>
                              <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                {count} SOPs
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {activeModule.stages && activeModule.stages.length > 0 ? (
                activeModule.stages
                  .filter((stage: any) => selectedStageId === 'ALL' || stage.stageId === selectedStageId)
                  .map((stage: any) => {
                    const isCollapsed = collapsedStages[stage.stageId] || false
                    const stageSops = activeModule.sopList.filter((s: any) => stage.sopCodes.includes(s.code))
                    const filteredStageSops = stageSops.filter((s: any) => {
                      if (activeTypeFilter === 'ALL') return true
                      return s.type === activeTypeFilter
                    })

                    if (filteredStageSops.length === 0) return null

                    return (
                      <div
                        key={stage.stageId}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shadow-2xs overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleStageCollapse(stage.stageId)}
                          className="w-full p-3 flex items-center justify-between gap-2 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs">
                              {stage.stageNumber}
                            </span>
                            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                              {language === 'vi' ? stage.stageTitle : stage.stageTitleEn}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {filteredStageSops.length} SOPs
                            </span>
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {!isCollapsed && (
                          <div className="p-3 pt-0 space-y-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
                            {filteredStageSops.map((sopItem: any) => {
                              const isSelected = activeSopItem.code === sopItem.code
                              const sopTitle = language === 'vi' ? sopItem.title : sopItem.titleEn

                              return (
                                <button
                                  key={sopItem.code}
                                  type="button"
                                  onClick={() => setSelectedSopCode(sopItem.code)}
                                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${isSelected
                                    ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                                    }`}
                                >
                                  <span
                                    className="mt-0.5 shrink-0 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-extrabold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    title={sopItem.type === 'N' ? 'Nhập liệu' : sopItem.type === 'M' ? 'Phê duyệt' : 'Tự động'}
                                  >
                                    {sopItem.type}
                                  </span>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                                        {sopItem.code}
                                      </span>
                                      {sopItem.isInheritedFromATS && (
                                        <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-[#1f5f86] dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
                                          Nhận từ Tuyển dụng
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-xs font-bold line-clamp-2 leading-snug transition-colors ${isSelected
                                      ? 'text-blue-900 dark:text-blue-100'
                                      : 'text-slate-800 dark:text-slate-200'
                                      }`}>
                                      {sopTitle}
                                    </p>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })
              ) : (
                <div className="space-y-2">
                  {filteredSopList.map((sopItem: any) => {
                    const isSelected = activeSopItem.code === sopItem.code
                    const sopTitle = language === 'vi' ? sopItem.title : sopItem.titleEn
                    return (
                      <button
                        key={sopItem.code}
                        type="button"
                        onClick={() => setSelectedSopCode(sopItem.code)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                      >
                        <span
                          className="mt-0.5 shrink-0 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-extrabold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {sopItem.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400 block mb-0.5">
                            {sopItem.code}
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                            {sopTitle}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              </div>
            </div>

            {/* CỘT PHẢI (7 Cols): CHI TIẾT QUY TRÌNH (CHILDREN) */}
            <div className="min-w-0">
              {children}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
