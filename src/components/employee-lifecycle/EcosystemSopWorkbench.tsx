import React from 'react'
import { ChevronDown, ChevronUp, ListCheck, GitBranch, Briefcase, ArrowRight } from 'lucide-react'
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
    <div className="w-full mt-2 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all duration-300 space-y-4">
      
      {/* QUICK MODULE SWITCHER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 mr-1">
            {language === 'vi' ? 'CHỌN PHÂN HỆ:' : 'SELECT MODULE:'}
          </span>
          {FIVE_CORE_MODULES.map((mod) => {
            const isCurrSelected = activeModule.id === mod.id
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => handleSelectModule(mod.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer ${isCurrSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
              >
                <span>{mod.code}</span>
                <span className="text-xs font-mono opacity-80">({mod.sopList.length})</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsSopListExpanded(!isSopListExpanded)}
          className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <span>{isSopListExpanded ? (language === 'vi' ? 'Thu gọn Bảng điều khiển' : 'Collapse Workbench') : (language === 'vi' ? `Mở rộng ${activeModule.sopList.length} SOPs` : `Expand ${activeModule.sopList.length} SOPs`)}</span>
          {isSopListExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* MODULE SUMMARY HEADER & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-start gap-3">
          <div className={`p-3.5 rounded-2xl ${activeModule.bgLight} dark:${activeModule.bgDark} border ${activeModule.border} shrink-0`}>
            {activeModule.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg ${activeModule.bgLight} dark:${activeModule.bgDark} ${activeModule.textLight} dark:${activeModule.textDark} border ${activeModule.border}`}>
                {language === 'vi' ? 'MÃ PHÂN HỆ:' : 'MODULE CODE:'} {activeModule.code}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
                {activeModule.sopCount}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {language === 'vi' ? activeModule.name : activeModule.nameEn}
            </h4>
          </div>
        </div>

        {/* TYPE FILTER PILLS */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTypeFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTypeFilter === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {language === 'vi' ? 'Tất cả' : 'All'} ({activeModule.sopList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('N')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTypeFilter === 'N' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            title="Nhập liệu / Khai báo"
          >
            N (Input)
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('M')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTypeFilter === 'M' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            title="Thẩm định thủ công / Duyệt"
          >
            M (Review)
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('A')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTypeFilter === 'A' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            title="Tự động / Hệ thống"
          >
            A (Auto)
          </button>
        </div>
      </div>

      {/* ATS INGESTION BANNER */}
      {activeModule.id === 'emp' && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-white shadow-inner animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md shrink-0">
                <Briefcase className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                    {language === 'vi' ? '⚡ CỔNG LIÊN THÔNG ĐẦU VÀO' : '⚡ RECRUITMENT INGESTION GATEWAY'}
                  </span>
                  <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                    {language === 'vi' ? 'Kiểm soát hồ sơ ứng viên đầu vào' : 'Candidate Intake Control'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                  {language === 'vi'
                    ? 'Dữ liệu ứng viên Trúng tuyển & Ký Offer từ Phân hệ Tuyển dụng (ATS) được TỰ ĐỘNG ĐỒNG BỘ sang Phân hệ Nhân sự (Core EMP) để tiếp nhận Onboarding.'
                    : 'Passed candidate & signed Offer data from ATS is AUTOMATICALLY INGESTED into Core EMP for Onboarding intake.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start md:self-auto bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono shrink-0">
              <span className="text-blue-400 font-bold">1. Tuyển dụng (ATS)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">2. Core EMP (SOP-02)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
              <span className="text-purple-400 font-bold">3. Master Data (SOP-03)</span>
            </div>
          </div>
        </div>
      )}

      {isSopListExpanded && (
        <div className="pt-2 animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* CỘT TRÁI (5 Cols): TIẾN TRÌNH CÁC CHẶNG NGHIỆP VỤ & DANH SÁCH SOPS */}
            <div className="lg:col-span-5 space-y-3.5 relative">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {language === 'vi'
                    ? `CÁC BƯỚC THAO TÁC THEO CHẶNG (${filteredSopList.length} SOPs)`
                    : `STAGE WORKFLOW STEPS (${filteredSopList.length} SOPs)`}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {language === 'vi' ? 'Click để xem Live Preview' : 'Click to inspect'}
                </span>
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
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-between gap-1.5 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer"
                    >
                      <span className="truncate">
                        {selectedStageId === 'ALL'
                          ? (language === 'vi' ? `📂 Tất cả (${activeModule.stages.length} Chặng)` : `📂 All (${activeModule.stages.length} Stages)`)
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
                            <span>📂</span>
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
                                    className={`px-2 py-0.5 text-[11px] font-mono font-extrabold rounded shrink-0 mt-0.5 ${sopItem.type === 'N'
                                      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                                      : sopItem.type === 'M'
                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                                      }`}
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
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                                          ⚡ Kế thừa ATS
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
                          className={`px-2 py-0.5 text-[11px] font-mono font-extrabold rounded shrink-0 mt-0.5 ${sopItem.type === 'N'
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                            : sopItem.type === 'M'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            }`}
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
            <div className="lg:col-span-7">
              {children}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
