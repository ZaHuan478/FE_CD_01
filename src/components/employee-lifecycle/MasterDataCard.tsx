import React from 'react'
import { Database, Network, ArrowRight, Layers, CheckCircle2 } from 'lucide-react'
import type { MasterDataCategory } from '../../types/employee-lifecycle'

interface MasterDataCardProps {
  categories: MasterDataCategory[]
  onOpenERD: () => void
  onSelectCategory?: (id: string) => void
}

export const MasterDataCard: React.FC<MasterDataCardProps> = ({
  categories,
  onOpenERD,
  onSelectCategory
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/60 shadow-xs shrink-0 mt-0.5">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 rounded-md border border-blue-200/60">
                Layer 1 · Ground Foundation
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 10 Master Categories
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              TẦNG 1: DỮ LIỆU NỀN & THIẾT LẬP HỆ THỐNG (MASTER DATA)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              Tập trung quản trị danh mục chính, cơ cấu tổ chức, thang lương và chính sách toàn hệ thống
            </p>
          </div>
        </div>

        {/* CTA Button to trigger ERD Diagram */}
        <button
          type="button"
          onClick={onOpenERD}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0 cursor-pointer group"
        >
          <Network className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span>Xem Sơ đồ Mối quan hệ Dữ liệu (ERD)</span>
          <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Categories Summary Pills / Chips */}
      <div className="mt-4 sm:mt-5">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Danh mục nền tảng đang áp dụng
          </span>
          <span className="text-[11px] sm:text-xs text-slate-400 hidden sm:inline-block">Click vào chip để xem chi tiết</span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium bg-slate-50 hover:bg-blue-50/80 text-slate-700 hover:text-blue-700 border border-slate-200/80 hover:border-blue-200 transition-all duration-150 cursor-pointer shadow-2xs group"
            >
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 bg-white group-hover:bg-blue-600 group-hover:text-white rounded border border-slate-200 group-hover:border-blue-600 transition-colors">
                {cat.code}
              </span>
              <span>{cat.title}</span>
              {cat.sopBadge && (
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded group-hover:bg-emerald-100 transition-colors">
                  📋 {cat.sopBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
