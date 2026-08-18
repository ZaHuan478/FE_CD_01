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
  FileText
} from 'lucide-react'

import { FIVE_CORE_MODULES, type ModuleEcosystemItem } from './data/ecosystemModulesData.tsx'

export const RadialEcosystemChart: React.FC = () => {
  const [activeHoveredId, setActiveHoveredId] = useState<string | null>(null)

  const activeModule = FIVE_CORE_MODULES.find((m) => m.id === activeHoveredId) || null

  return (
    <div className="relative w-full overflow-hidden py-4 flex flex-col items-center justify-center">

      {/* TOP DESCRIPTIVE BANNER */}
      <div className="w-full max-w-2xl mb-4 text-center space-y-1">
        <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xs">
          Sơ đồ Vòng tròn 5 Phân hệ Chuẩn (45/45 SOPs Integrated)
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Đúng chuẩn 5 Phân hệ chính trong tài liệu đặc tả SOP hệ thống HRMS: <b>Phân hệ Nhân sự, Chấm công (ATT), Bảo hiểm (INS), Tiền lương (PAY), Thuế TNCN (TAX)</b>
        </p>
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
            {activeModule ? activeModule.name : 'Mô hình phân hệ vòng tròn đồng bộ dữ liệu trung tâm'}
          </p>

          {activeModule && (
            <span className="mt-0.5 sm:mt-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/30">
              {activeModule.sopCount}
            </span>
          )}
        </div>

        {/* 5 RADIAL MODULE CARDS POSITIONED PERFECTLY AROUND CIRCLE */}
        {FIVE_CORE_MODULES.map((mod) => {
          // Polar coordinates calculation
          const angleRad = (mod.angleDeg * Math.PI) / 180
          const radiusPct = 40 // Radius distance from center
          const x = 50 + radiusPct * Math.cos(angleRad)
          const y = 50 + radiusPct * Math.sin(angleRad)

          const isHovered = activeHoveredId === mod.id

          return (
            <div
              key={mod.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setActiveHoveredId(mod.id)}
              onMouseLeave={() => setActiveHoveredId(null)}
              className={`absolute z-30 transition-all duration-300 cursor-pointer group ${isHovered ? 'scale-110 z-40' : 'hover:scale-105'
                }`}
            >
              <div
                className={`p-1.5 min-[400px]:p-2 sm:p-3 rounded-2xl border shadow-md flex items-center gap-1.5 sm:gap-2.5 backdrop-blur-md transition-all duration-300 ${isHovered
                    ? `bg-white dark:bg-slate-900 ${mod.border} ring-4 ring-blue-500/20 shadow-xl`
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
                  <span className="text-[8px] sm:text-[9px] font-mono font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none mb-0.5 truncate">
                    {mod.code}
                  </span>
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate leading-tight">
                    {mod.name.split(' (')[0]}
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

            const isHovered = activeHoveredId === mod.id

            return (
              <line
                key={mod.id}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={isHovered ? mod.color : 'currentColor'}
                strokeWidth={isHovered ? 3 : 1.5}
                strokeDasharray={isHovered ? '0' : '5 3'}
                className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'text-slate-300 dark:text-slate-800 opacity-70'
                  }`}
              />
            )
          })}
        </svg>

      </div>

      {/* BOTTOM HOVER INSPECTION PANEL FOR THE 5 MODULES */}
      <div className="w-full max-w-3xl mt-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
        {activeModule ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-xl ${activeModule.bgLight} dark:${activeModule.bgDark} border ${activeModule.border} shrink-0`}>
                {activeModule.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${activeModule.bgLight} dark:${activeModule.bgDark} ${activeModule.textLight} dark:${activeModule.textDark} border ${activeModule.border}`}>
                    Mã Phân hệ: {activeModule.code}
                  </span>
                  {/* <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    📋 Số lượng SOPs đặc tả: {activeModule.sopCount}
                  </span> */}
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeModule.name}
                </h4>
                <div className="space-y-1 mt-2">
                  {activeModule.subFeatures.map((feat, idx) => (
                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Tỷ lệ phủ đặc tả SOP
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                100% SOPs
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400 dark:text-slate-500 font-medium italic flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Di chuyển chuột qua 5 phân hệ trên Vòng tròn (Core EMP, ATT, INS, PAY, TAX) để xem chi tiết các bước SOPs đặc tả</span>
          </div>
        )}
      </div>

    </div>
  )
}
