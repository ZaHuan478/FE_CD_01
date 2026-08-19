import React, { useState } from 'react'
import {
  Users,
  Clock,
  CircleDollarSign,
  Receipt,
  ShieldCheck,
  Sparkles,
  Layers,
  CheckCircle2,
  ListCheck,
  ChevronDown,
  ChevronUp,
  MousePointerClick
} from 'lucide-react'

import { FIVE_CORE_MODULES, type ModuleEcosystemItem, type SopDetailItem } from './data/ecosystemModulesData.tsx'
import { useLanguage } from '../../context/LanguageContext'

export const RadialEcosystemChart: React.FC = () => {
  const { language } = useLanguage()
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>('emp')
  const [isSopListExpanded, setIsSopListExpanded] = useState<boolean>(true)
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | 'N' | 'M' | 'A'>('ALL')

  // Hover overrides selected module, otherwise stick with selected module
  const activeModuleId = hoveredModuleId || selectedModuleId
  const activeModule = FIVE_CORE_MODULES.find((m) => m.id === activeModuleId) || FIVE_CORE_MODULES[0]

  const filteredSopList = activeModule.sopList.filter((item) => {
    if (activeTypeFilter === 'ALL') return true
    return item.type === activeTypeFilter
  })

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
      <div className="relative w-[300px] h-[300px] min-[400px]:w-[350px] min-[400px]:h-[350px] sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] flex items-center justify-center">

        {/* OUTER CIRCULAR GUIDE LINES */}
        <div className="absolute inset-0 rounded-full border border-blue-500/20 dark:border-blue-400/10 animate-pulse pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />

        {/* CENTER CORE ENGINE HUB */}
        <div className="absolute z-20 w-32 h-32 min-[400px]:w-36 min-[400px]:h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center p-2.5 sm:p-3 transition-all duration-300 transform hover:scale-105">
          {/* Subtle Core Background Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500 opacity-20 blur-md pointer-events-none" />

          <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md mb-1 sm:mb-1.5 shrink-0">
            <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <h3 className="text-[10px] min-[400px]:text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            HRMS 5 CORE MODULES
          </h3>
          <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5 sm:mt-1">
            45/45 SOP Specs
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
          // Polar coordinates calculation
          const angleRad = (mod.angleDeg * Math.PI) / 180
          const radiusPct = 40 // Radius distance from center
          const x = 50 + radiusPct * Math.cos(angleRad)
          const y = 50 + radiusPct * Math.sin(angleRad)

          const isHovered = hoveredModuleId === mod.id
          const isSelected = selectedModuleId === mod.id
          const isActive = isHovered || (hoveredModuleId === null && isSelected)
          const modName = language === 'vi' ? mod.name : mod.nameEn

          return (
            <div
              key={mod.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredModuleId(mod.id)}
              onMouseLeave={() => setHoveredModuleId(null)}
              onClick={() => setSelectedModuleId(mod.id)}
              className={`absolute z-30 transition-all duration-300 cursor-pointer group ${isActive ? 'scale-110 z-40' : 'hover:scale-105'
                }`}
            >
              <div
                className={`p-1.5 min-[400px]:p-2 sm:p-3 rounded-2xl border shadow-md flex items-center gap-1.5 sm:gap-2.5 backdrop-blur-md transition-all duration-300 ${isActive
                    ? `bg-white dark:bg-slate-900 ${mod.border} ring-4 ring-blue-500/30 shadow-xl`
                    : `bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-800`
                  }`}
              >
                {/* Module Icon Badge */}
                <div
                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${mod.bgLight
                    } dark:${mod.bgDark} ${mod.border}`}
                >
                  {mod.icon}
                </div>

                {/* Module Details */}
                <div className="text-left max-w-[70px] min-[400px]:max-w-[85px] sm:max-w-[120px] md:max-w-[130px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] sm:text-[9px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none truncate">
                      {mod.code}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    )}
                  </div>
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate leading-tight mt-0.5">
                    {modName.split(' (')[0]}
                  </h4>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hidden min-[400px]:block mt-0.5">
                    📋 {mod.sopCount}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* SVG RADIATING CONNECTOR LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {FIVE_CORE_MODULES.map((mod) => {
            const angleRad = (mod.angleDeg * Math.PI) / 180
            const innerR = 24
            const outerR = 35
            const x1 = 50 + innerR * Math.cos(angleRad)
            const y1 = 50 + innerR * Math.sin(angleRad)
            const x2 = 50 + outerR * Math.cos(angleRad)
            const y2 = 50 + outerR * Math.sin(angleRad)

            const isActive = (hoveredModuleId === mod.id) || (hoveredModuleId === null && selectedModuleId === mod.id)

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

      {/* INSPECTION & DETAILED SOP SPECIFICATIONS PANEL FOR THE ACTIVE MODULE */}
      <div className="w-full mt-2 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all duration-300 space-y-4">

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
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${isCurrSelected
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
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <span>{isSopListExpanded ? (language === 'vi' ? 'Thu gọn Danh sách' : 'Collapse List') : (language === 'vi' ? 'Mở rộng 15 SOPs' : 'Expand 15 SOPs')}</span>
            {isSopListExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* MODULE SUMMARY HEADER & STATS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className={`p-3.5 rounded-xl ${activeModule.bgLight} dark:${activeModule.bgDark} border ${activeModule.border} shrink-0`}>
              {activeModule.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-extrabold uppercase px-2.5 py-0.5 rounded ${activeModule.bgLight} dark:${activeModule.bgDark} ${activeModule.textLight} dark:${activeModule.textDark} border ${activeModule.border}`}>
                  {language === 'vi' ? 'MÁ PHÂN HỆ:' : 'MODULE CODE:'} {activeModule.code}
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
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTypeFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTypeFilter === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {language === 'vi' ? 'Tất cả' : 'All'} ({activeModule.sopList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('N')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTypeFilter === 'N' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              title="Nhập liệu / Khai báo"
            >
              N (Input)
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('M')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTypeFilter === 'M' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              title="Thẩm định thủ công / Duyệt"
            >
              M (Review)
            </button>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('A')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTypeFilter === 'A' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              title="Tự động / Hệ thống"
            >
              A (Auto)
            </button>
          </div>
        </div>

        {/* FULL 15 SOPS EXPANDABLE GRID LIST */}
        {isSopListExpanded && (
          <div className="pt-2 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {language === 'vi'
                  ? `DANH SÁCH CHI TIẾT CÁC BƯỚC SOP ĐẶC TẢ (${filteredSopList.length}/${activeModule.sopList.length} SOPs)`
                  : `DETAILED SOP SPECIFICATIONS LIST (${filteredSopList.length}/${activeModule.sopList.length} SOPs)`}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {language === 'vi' ? 'N: Nhập liệu | M: Duyệt | A: Tự động' : 'N: Data Entry | M: Review | A: Automated'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] sm:max-h-[700px] overflow-y-auto pr-1.5">
              {filteredSopList.map((sopItem) => {
                const sopTitle = language === 'vi' ? sopItem.title : sopItem.titleEn
                return (
                  <div
                    key={sopItem.code}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-950 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-start gap-3 group shadow-2xs"
                  >
                    <span
                      className={`px-2.5 py-1 text-xs font-mono font-extrabold rounded-md shrink-0 mt-0.5 ${sopItem.type === 'N'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                          : sopItem.type === 'M'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                        }`}
                      title={sopItem.type === 'N' ? 'Bước Nhập liệu' : sopItem.type === 'M' ? 'Bước Phê duyệt' : 'Bước Tự động'}
                    >
                      {sopItem.type}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-extrabold text-xs text-blue-600 dark:text-blue-400">
                          {sopItem.code}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {sopTitle}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  )
}


