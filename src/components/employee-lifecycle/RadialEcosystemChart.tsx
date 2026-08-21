import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  ListCheck,
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  ArrowRight,
  Sparkles,
  GitBranch,
  FileText,
  UserCheck,
  CheckCircle2,
  Inbox,
  Send,
  HelpCircle,
  Briefcase
} from 'lucide-react'

import { FIVE_CORE_MODULES, type SopDetailItem } from './data/ecosystemModulesData.tsx'
import { useLanguage } from '../../context/LanguageContext'

export const RadialEcosystemChart: React.FC = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>('emp')
  const [isSopListExpanded, setIsSopListExpanded] = useState<boolean>(true)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'N' | 'M' | 'A'>('ALL')
  const [selectedSopCode, setSelectedSopCode] = useState<string>('SOP-EMP-02')
  const [selectedStageId, setSelectedStageId] = useState<string>('ALL')
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState<boolean>(false)
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({})

  const stageDropdownRef = useRef<HTMLDivElement>(null)

  // Click outside to close stage dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stageDropdownRef.current && !stageDropdownRef.current.contains(event.target as Node)) {
        setIsStageDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId]
    }))
  }

  // Hover overrides selected module, otherwise stick with selected module
  const activeModuleId = hoveredModuleId || selectedModuleId
  const activeModule = FIVE_CORE_MODULES.find((m) => m.id === activeModuleId) || FIVE_CORE_MODULES[0]

  // Filter SOP items based on activeTypeFilter
  const filteredSopList = activeModule.sopList.filter((item) => {
    if (activeTypeFilter === 'ALL') return true
    return item.type === activeTypeFilter
  })

  // Selected SOP item for the live detail inspector
  const activeSopItem: SopDetailItem =
    activeModule.sopList.find((s) => s.code === selectedSopCode) ||
    filteredSopList[0] ||
    activeModule.sopList[0]

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId)
    setSelectedStageId('ALL')
    const targetMod = FIVE_CORE_MODULES.find((m) => m.id === modId) || FIVE_CORE_MODULES[0]
    if (targetMod.sopList.length > 0) {
      if (modId === 'emp') {
        setSelectedSopCode('SOP-EMP-02')
      } else {
        setSelectedSopCode(targetMod.sopList[0].code)
      }
    }
  }

  return (
    <div className="relative w-full overflow-hidden py-4 flex flex-col items-center justify-center space-y-4">

      {/* TOP DESCRIPTIVE BANNER */}
      <div className="w-full max-w-2xl text-center space-y-1">
        <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xs">
          {language === 'vi'
            ? 'Sơ đồ Vòng tròn 5 Phân hệ Chuẩn (45/45 SOPs Integrated)'
            : 'Radial Wheel of 5 Standard Modules (45/45 SOPs Integrated)'}
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          {language === 'vi' ? (
            <>Đúng chuẩn 5 Phân hệ chính trong tài liệu đặc tả SOP hệ thống HRMS: <b>Phân hệ Nhân sự, Chấm công (ATT), Bảo hiểm (INS), Tiền lương (PAY), Thuế TNCN (TAX)</b></>
          ) : (
            <>Fully compliant with 5 Core Modules in HRMS SOP Specification: <b>Personnel, Timekeeping (ATT), Insurance (INS), Payroll (PAY), Personal Tax (TAX)</b></>
          )}
        </p>
      </div>

      {/* CLICK HINT BADGE */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-full border border-amber-500/20 text-[11px] font-medium animate-pulse">
        <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
        <span>
          {language === 'vi'
            ? 'Bấm chọn vào Phân hệ trên Vòng tròn để Ghim xem trọn bộ danh sách SOPs chi tiết'
            : 'Click any module node to pin & inspect its complete detailed SOP list'}
        </span>
      </div>

      {/* MAIN RADIAL WHEEL CONTAINER */}
      <div className="relative w-[300px] h-[300px] min-[400px]:w-[340px] min-[400px]:h-[340px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px] my-4 sm:my-6 flex items-center justify-center">

        {/* OUTER CIRCULAR GUIDE LINES */}
        <div className="absolute inset-0 rounded-full border border-blue-500/20 dark:border-blue-400/10 animate-pulse pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />

        {/* CENTER CORE ENGINE HUB */}
        <div className="absolute z-10 w-32 h-32 min-[400px]:w-36 min-[400px]:h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center p-2.5 sm:p-3 transition-all duration-300 transform hover:scale-105">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500 opacity-20 blur-md pointer-events-none" />

          <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md mb-1 sm:mb-1.5 shrink-0">
            <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <h3 className="text-[10px] min-[400px]:text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            HRMS 6 CORE MODULES
          </h3>
          <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5 sm:mt-1">
            50/50 SOP Specs
          </span>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight hidden sm:block">
            {language === 'vi' ? activeModule.name : activeModule.nameEn}
          </p>

          <span className="mt-0.5 sm:mt-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
            {activeModule.sopCount}
          </span>
        </div>

        {/* 5 RADIAL MODULE CARDS POSITIONED PERFECTLY AROUND CIRCLE */}
        {FIVE_CORE_MODULES.map((mod) => {
          const angleRad = (mod.angleDeg * Math.PI) / 180
          const radiusPct = 36
          const x = 50 + radiusPct * Math.cos(angleRad)
          const y = 50 + radiusPct * Math.sin(angleRad)

          const isHovered = hoveredModuleId === mod.id
          const isSelected = selectedModuleId === mod.id
          const isActive = isHovered || (hoveredModuleId === null && isSelected)

          return (
            <div
              key={mod.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute transition-all duration-300 cursor-pointer ${isActive ? 'scale-110 z-20' : 'scale-95 opacity-80 hover:opacity-100 z-10'
                }`}
              onMouseEnter={() => setHoveredModuleId(mod.id)}
              onMouseLeave={() => setHoveredModuleId(null)}
              onClick={() => handleSelectModule(mod.id)}
            >
              <div
                className={`w-28 min-[400px]:w-32 sm:w-36 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-center shadow-lg backdrop-blur-md ${isActive
                  ? `${mod.bgLight} dark:${mod.bgDark} ${mod.border} ring-2 ring-blue-500/30 shadow-xl`
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800'
                  }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight text-slate-800 dark:text-slate-200 truncate">
                    {mod.code}
                  </span>
                </div>

                <div className="text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate">
                  {language === 'vi' ? mod.name.split('(')[0].trim() : mod.nameEn.split('(')[0].trim()}
                </div>

                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-[8px] sm:text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {mod.sopCount}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* CONNECTING RADIUS SVG LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-0">
          {FIVE_CORE_MODULES.map((mod) => {
            const angleRad = (mod.angleDeg * Math.PI) / 180
            const radiusPct = 36
            const x2 = 50 + radiusPct * Math.cos(angleRad)
            const y2 = 50 + radiusPct * Math.sin(angleRad)
            const x1 = 50
            const y1 = 50

            const isHovered = hoveredModuleId === mod.id
            const isSelected = selectedModuleId === mod.id
            const isActive = isHovered || (hoveredModuleId === null && isSelected)

            return (
              <line
                key={mod.id}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={isActive ? mod.color : 'currentColor'}
                strokeWidth={isActive ? 3 : 1.5}
                strokeDasharray={isActive ? '0' : '5 3'}
                className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'text-slate-300 dark:text-slate-800 opacity-70'
                  }`}
              />
            )
          })}
        </svg>

      </div>

      {/* ========================================================================= */}
      {/* 🌟 2-COLUMN MASTER-DETAIL WORKBENCH */}
      {/* ========================================================================= */}
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

        {/* ⚡ CỔNG KẾ THỪA DỮ LIỆU ĐẦU VÀO TỪ PHÂN HỆ TUYỂN DỤNG (ATS INGESTION BANNER) */}
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

              {/* Sequential Flow Badge */}
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

        {/* ========================================================================= */}
        {/* 🌟 2-COLUMN MASTER-DETAIL WORKBENCH */}
        {/* ========================================================================= */}
        {isSopListExpanded && (
          <div className="pt-2 animate-fadeIn space-y-4">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* ========================================================================= */}
              {/* 📋 CỘT TRÁI (38% / 5 Cols): TIẾN TRÌNH CÁC CHẶNG NGHIỆP VỤ & DANH SÁCH SOPS */}
              {/* ========================================================================= */}
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

                {/* 🎯 CUSTOM STAGE DROPDOWN SELECTOR (BO GÓC ROUNDED-2XL CAO CẤP) */}
                {activeModule.stages && activeModule.stages.length > 0 && (
                  <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/70 flex items-center justify-between gap-2 shadow-2xs relative z-30">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {language === 'vi' ? 'CHỌN CHẶNG:' : 'SELECT STAGE:'}
                      </span>
                    </div>

                    {/* Custom Dropdown Trigger & Floating Menu */}
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
                                const curr = activeModule.stages.find((s) => s.stageId === selectedStageId)
                                if (!curr) return 'Chọn chặng'
                                return language === 'vi' ? curr.stageTitle : curr.stageTitleEn
                              })()}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isStageDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Floating Dropdown Menu (Bo Góc Tròn rounded-2xl 100% - Không bao giờ bị cắt) */}
                      {isStageDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-[290px] sm:w-[320px] p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl z-50 animate-fadeIn space-y-1 ring-1 ring-black/10 dark:ring-white/10">
                          {/* Option: ALL */}
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

                          {/* Individual Stages */}
                          {activeModule.stages.map((stg) => {
                            const isSelected = selectedStageId === stg.stageId
                            const count = activeModule.sopList.filter((s) => stg.sopCodes.includes(s.code)).length
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

                {/* Render Stages Accordions inside scrollable container */}
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {activeModule.stages && activeModule.stages.length > 0 ? (
                  activeModule.stages
                    .filter((stage) => selectedStageId === 'ALL' || stage.stageId === selectedStageId)
                    .map((stage) => {
                      const isCollapsed = collapsedStages[stage.stageId] || false
                      const stageSops = activeModule.sopList.filter((s) => stage.sopCodes.includes(s.code))
                      const filteredStageSops = stageSops.filter((s) => {
                        if (activeTypeFilter === 'ALL') return true
                        return s.type === activeTypeFilter
                      })

                      if (filteredStageSops.length === 0) return null

                      return (
                        <div
                          key={stage.stageId}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shadow-2xs overflow-hidden transition-all"
                        >
                          {/* Stage Header with Collapse/Expand Toggle */}
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

                          {/* Stage SOP Items List (collapsible) */}
                          {!isCollapsed && (
                            <div className="p-3 pt-0 space-y-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
                              {filteredStageSops.map((sopItem) => {
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
                    {filteredSopList.map((sopItem) => {
                      const isSelected = activeSopItem.code === sopItem.code
                      const sopTitle = language === 'vi' ? sopItem.title : sopItem.titleEn
                      return (
                        <button
                          key={sopItem.code}
                          type="button"
                          onClick={() => setSelectedSopCode(sopItem.code)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                            }`}
                        >
                          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/10 text-blue-600 rounded">
                            {sopItem.type}
                          </span>
                          <div>
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{sopItem.code}</span>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{sopTitle}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* 🔍 CỘT PHẢI (62% / 7 Cols): KHUNG LIVE INSPECTION CHI TIẾT (LIVE CANVAS) */}
              {/* ========================================================================= */}
              <div className="lg:col-span-7 sticky top-20 bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-fadeIn">

                {/* INSPECTOR TOP HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-lg bg-blue-600 text-white shadow-xs">
                        {activeSopItem.code}
                      </span>

                      <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg border ${activeSopItem.type === 'N'
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
                        : activeSopItem.type === 'M'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}>
                        {activeSopItem.type === 'N'
                          ? (language === 'vi' ? 'N: Nhập liệu & Khai báo' : 'N: Data Input')
                          : activeSopItem.type === 'M'
                            ? (language === 'vi' ? 'M: Thẩm định & Phê duyệt' : 'M: Review & Approval')
                            : (language === 'vi' ? 'A: Tự động hóa hệ thống' : 'A: Automated Engine')}
                      </span>

                      {activeSopItem.stageNumber && (
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {language === 'vi' ? `Chặng ${activeSopItem.stageNumber}` : `Stage ${activeSopItem.stageNumber}`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {language === 'vi' ? activeSopItem.title : activeSopItem.titleEn}
                    </h3>
                  </div>

                  {/* QUICK ACTION BUTTONS */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/employee-lifecycle/workflow/${activeSopItem.workflowId || 'LIFE-01'}`)}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      title="Mở sơ đồ quy trình chi tiết"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Xem Sơ đồ Workflow' : 'View Workflow'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/employee-lifecycle/wireframe/${activeSopItem.wireframeId || 'LIFE-01'}`)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      title="Mở giao diện Form mẫu"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'vi' ? 'Mở Form UI' : 'Form UI'}</span>
                    </button>
                  </div>
                </div>

                {/* 💡 SCOPE & CONTEXT CALLOUT BOX (HIGHLIGHTS SOP-02 ONBOARDING VS SOP-03 MASTER DATA) */}
                {activeSopItem.scopeNote && (
                  <div className={`p-4 rounded-2xl border ${activeSopItem.code === 'SOP-EMP-02'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
                    : activeSopItem.code === 'SOP-EMP-03'
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200'
                      : 'bg-slate-100/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}>
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wide block mb-0.5">
                          {language === 'vi' ? 'Ý NGHĨA & PHẠM VI NGHIỆP VỤ (SCOPE):' : 'BUSINESS SCOPE & OBJECTIVE:'}
                        </span>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                          {language === 'vi' ? activeSopItem.scopeNote : activeSopItem.scopeNoteEn || activeSopItem.scopeNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTOR / RACI ROW */}
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                    {language === 'vi' ? 'VAI TRÒ THỰC HIỆN:' : 'ACTOR & RACI:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {language === 'vi' ? activeSopItem.actor || 'Chuyên viên Nhân sự & Hệ thống' : activeSopItem.actorEn || 'HR Specialist & System'}
                  </span>
                </div>

                {/* 2-BOX GRID: INPUTS (ĐẦU VÀO) & OUTPUTS (ĐẦU RA) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

                  {/* INPUTS BOX */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 dark:text-blue-400 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <Inbox className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? '📥 DỮ LIỆU ĐẦU VÀO (INPUTS)' : '📥 INPUT REQUIREMENTS'}</span>
                    </div>

                    <ul className="space-y-1.5">
                      {(activeSopItem.inputs && activeSopItem.inputs.length > 0
                        ? activeSopItem.inputs
                        : ['Hồ sơ yêu cầu hợp lệ', 'Thông tin định danh nhân sự', 'Quy chế công ty liên quan']
                      ).map((inp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* OUTPUTS BOX */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? '📤 KẾT QUẢ ĐẦU RA (OUTPUTS)' : '📤 OUTPUT DELIVERABLES'}</span>
                    </div>

                    <ul className="space-y-1.5">
                      {(activeSopItem.outputs && activeSopItem.outputs.length > 0
                        ? activeSopItem.outputs
                        : ['Bản ghi dữ liệu được cập nhật', 'Thông báo xác nhận qua Email/Portal', 'Lưu vết Audit Log hệ thống']
                      ).map((out, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* QUICK FOOTER TIPS */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    {language === 'vi'
                      ? 'Quy trình đã được chuẩn hóa theo tài liệu 1.EMP.HRM.SOP'
                      : 'Standardized according to 1.EMP.HRM.SOP specification'}
                  </span>
                  <span className="font-mono font-semibold text-slate-400">
                    HRMS Architecture v2.0
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}
