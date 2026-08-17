import React from 'react'
import {
  Layers,
  Database,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  FileText,
  Users,
  Clock,
  Briefcase,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react'

interface SystemOverviewDashboardProps {
  onSelectStep: (stepId: string) => void
  onOpenERD: () => void
}

export const SystemOverviewDashboard: React.FC<SystemOverviewDashboardProps> = ({
  onSelectStep,
  onOpenERD
}) => {
  return (
    <div className="space-y-6">

      {/* TOP KPI STATS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* METRIC 1: PIPELINE STAGES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              VÒNG ĐỜI NHÂN SỰ
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">7/7</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 100% SOP
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            7 Bước Pipeline liên hoàn từ Tuyển dụng đến Offboarding
          </p>
        </div>

        {/* METRIC 2: MASTER DATA CATALOGS */}
        <div
          onClick={onOpenERD}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              MASTER DATA TẦNG 1
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">10</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              G01 - G08 Groups
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            Danh mục Nền tảng Hồ sơ, Lương, Phép & BHXH (Xem ERD)
          </p>
        </div>

        {/* METRIC 3: OPERATIONAL GRID MODULES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              LƯỚI VẬN HÀNH TẦNG 3
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">8</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Modules Nghiệp vụ
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            Chấm công, Bổ nhiệm, Khen thưởng, Đào tạo, Phép, Công tác
          </p>
        </div>

        {/* METRIC 4: INTEGRATED SOPS & BUSINESS RULES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SOP SPECS & RULES
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">45</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              SOPs (EMP/ATT/INS/PAY/TAX)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            20 Quy tắc Nghiệp vụ (BR) & 26 Cảnh báo Tự động (CD)
          </p>
        </div>

      </div>

      {/* QUICK LAYER NAVIGATOR SHORTCUT BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-indigo-800/60 pb-3">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>ĐIỀU HƯỚNG NHANH CÁC TẦNG & CỤM QUY TRÌNH (QUICK LAYER NAVIGATOR)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Bấm chọn Cụm quy trình để mở nhanh màn hình Workflow chi tiết không cần cuộn trang dài.
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-700 text-indigo-200 shrink-0">
            Interactive Navigator
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Shortcut 1 */}
          <button
            type="button"
            onClick={() => onSelectStep('LIFE-01')}
            className="p-3 bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all text-left group cursor-pointer"
          >
            <div className="font-mono text-[10px] text-blue-400 group-hover:text-blue-200 font-bold mb-0.5">CỤM 1 (LIFE-01, 02)</div>
            <div className="font-extrabold truncate">Tiếp nhận & Hồ sơ</div>
          </button>

          {/* Shortcut 2 */}
          <button
            type="button"
            onClick={() => onSelectStep('LIFE-04')}
            className="p-3 bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all text-left group cursor-pointer"
          >
            <div className="font-mono text-[10px] text-emerald-400 group-hover:text-emerald-200 font-bold mb-0.5">CỤM 2 (LIFE-03..05)</div>
            <div className="font-extrabold truncate">Hợp đồng & Phục lợi</div>
          </button>

          {/* Shortcut 3 */}
          <button
            type="button"
            onClick={() => onSelectStep('LIFE-06')}
            className="p-3 bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all text-left group cursor-pointer"
          >
            <div className="font-mono text-[10px] text-amber-400 group-hover:text-amber-200 font-bold mb-0.5">CỤM 3 (LIFE-06, 07)</div>
            <div className="font-extrabold truncate">Biến động & Offboard</div>
          </button>

          {/* Shortcut 4 */}
          <button
            type="button"
            onClick={() => onSelectStep('CF-01')}
            className="p-3 bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all text-left group cursor-pointer"
          >
            <div className="font-mono text-[10px] text-indigo-400 group-hover:text-indigo-200 font-bold mb-0.5">TẦNG 3 (CF-01..08)</div>
            <div className="font-extrabold truncate">Lưới 8 Module</div>
          </button>

          {/* Shortcut 5 */}
          <button
            type="button"
            onClick={onOpenERD}
            className="p-3 bg-slate-800/90 hover:bg-purple-600 text-slate-200 hover:text-white rounded-xl border border-slate-700/80 transition-all text-left group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="font-mono text-[10px] text-purple-400 group-hover:text-purple-200 font-bold mb-0.5">TẦNG 1 (MD-01..10)</div>
            <div className="font-extrabold truncate">Sơ đồ ERD Master</div>
          </button>
        </div>
      </div>

      {/* MODULE SOP COVERAGE PROGRESS BARS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>TỶ LỆ PHỦ ĐẶC TẢ SOP THEO CÁC PHÂN HỆ DOANH NGHIỆP</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 45/45 SOPs Specs Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Module EMP */}
          <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex justify-between text-xs font-bold">
              <span>Core EMP (Hồ sơ)</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">15/15 SOPs</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-full" />
            </div>
            {/* <p className="text-[10px] text-slate-500 dark:text-slate-400">100% SOP Specs Phủ kín</p> */}
          </div>

          {/* Module ATT */}
          <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex justify-between text-xs font-bold">
              <span>ATT (Chấm công)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">15/15 SOPs</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
            {/* <p className="text-[10px] text-slate-500 dark:text-slate-400">100% SOP Specs Phủ kín</p> */}
          </div>

          {/* Module INS */}
          <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex justify-between text-xs font-bold">
              <span>INS (Bảo hiểm)</span>
              <span className="text-purple-600 dark:text-purple-400 font-mono">8/8 SOPs</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full w-full" />
            </div>
            {/* <p className="text-[10px] text-slate-500 dark:text-slate-400">100% SOP Specs Phủ kín</p> */}
          </div>

          {/* Module PAY */}
          <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex justify-between text-xs font-bold">
              <span>PAY (Tiền lương)</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">4/4 SOPs</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-full" />
            </div>
            {/* <p className="text-[10px] text-slate-500 dark:text-slate-400">100% SOP Specs Phủ kín</p> */}
          </div>

          {/* Module TAX */}
          <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex justify-between text-xs font-bold">
              <span>TAX (Thuế TNCN)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">3/3 SOPs</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-full" />
            </div>
            {/* <p className="text-[10px] text-slate-500 dark:text-slate-400">100% SOP Specs Phủ kín</p> */}
          </div>
        </div>
      </div>

    </div>
  )
}
