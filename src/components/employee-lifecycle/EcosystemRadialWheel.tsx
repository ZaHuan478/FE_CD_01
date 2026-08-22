import React from 'react'
import { MousePointerClick, Layers } from 'lucide-react'
import { FIVE_CORE_MODULES } from './data/ecosystemModulesData'
import { useLanguage } from '../../context/LanguageContext'

interface EcosystemRadialWheelProps {
  hoveredModuleId: string | null
  setHoveredModuleId: (id: string | null) => void
  selectedModuleId: string
  handleSelectModule: (id: string) => void
  activeModule: any
}

export const EcosystemRadialWheel: React.FC<EcosystemRadialWheelProps> = ({
  hoveredModuleId,
  setHoveredModuleId,
  selectedModuleId,
  handleSelectModule,
  activeModule
}) => {
  const { language } = useLanguage()

  return (
    <>
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

      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-full border border-amber-500/20 text-[11px] font-medium animate-pulse">
        <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
        <span>
          {language === 'vi'
            ? 'Bấm chọn vào Phân hệ trên Vòng tròn để Ghim xem trọn bộ danh sách SOPs chi tiết'
            : 'Click any module node to pin & inspect its complete detailed SOP list'}
        </span>
      </div>

      <div className="relative w-[300px] h-[300px] min-[400px]:w-[340px] min-[400px]:h-[340px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[720px] lg:h-[720px] my-6 sm:my-10 flex items-center justify-center">

        <div className="absolute inset-0 rounded-full border border-blue-500/20 dark:border-blue-400/10 animate-pulse pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />

        <div className="absolute z-10 w-32 h-32 min-[400px]:w-36 min-[400px]:h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center p-3 sm:p-4 transition-all duration-300 transform hover:scale-105">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500 opacity-20 blur-md pointer-events-none" />

          <div className="p-2 sm:p-3 md:p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl md:rounded-3xl shadow-md mb-1.5 sm:mb-2 shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>

          <h3 className="text-[10px] min-[400px]:text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            HRMS 6 CORE MODULES
          </h3>
          <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 sm:mt-1.5">
            50/50 SOP Specs
          </span>

          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1 md:mt-2 line-clamp-2 leading-tight hidden sm:block">
            {language === 'vi' ? activeModule.name : activeModule.nameEn}
          </p>

          <span className="mt-1 sm:mt-1.5 md:mt-2 px-2.5 py-0.5 md:px-3 md:py-1 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
            {activeModule.sopCount}
          </span>
        </div>

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
                className={`w-28 min-[400px]:w-32 sm:w-40 md:w-48 lg:w-56 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all text-center shadow-lg backdrop-blur-md ${isActive
                  ? `${mod.bgLight} dark:${mod.bgDark} ${mod.border} ring-2 ring-blue-500/30 shadow-xl`
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800'
                  }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                  <div className="p-1 md:p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    <div className="scale-75 sm:scale-100 md:scale-125 lg:scale-150 transform transition-transform">
                      {mod.icon}
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black uppercase tracking-tight text-slate-800 dark:text-slate-200 truncate">
                    {mod.code}
                  </span>
                </div>

                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
                  {language === 'vi' ? mod.name.split('(')[0].trim() : mod.nameEn.split('(')[0].trim()}
                </div>

                <div className="mt-1 md:mt-2 flex items-center justify-center gap-1">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-mono font-extrabold px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {mod.sopCount}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

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
    </>
  )
}
