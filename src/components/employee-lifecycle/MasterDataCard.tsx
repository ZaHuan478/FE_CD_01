import React from 'react'
import {
  Database,
  Network,
  ArrowRight,
  CheckCircle2,
  Building2,
  Coins,
  Clock,
  Layers,
  Wrench
} from 'lucide-react'
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
  // Separate into Sub-Layer 1A (System CRUD & Geography) and Sub-Layer 1B (Business Domains)
  const systemCrudCategories = categories.filter((c) =>
    ['MD-01', 'MD-02', 'MD-03', 'MD-04'].includes(c.id)
  )

  const orgCategories = categories.filter((c) =>
    ['MD-05', 'MD-06'].includes(c.id)
  )

  const compCategories = categories.filter((c) =>
    ['MD-07', 'MD-09'].includes(c.id)
  )

  const operationalCategories = categories.filter((c) =>
    ['MD-08', 'MD-10'].includes(c.id)
  )

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md space-y-6">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

      {/* HEADER SECTION */}
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Mô hình Phân tầng 2 Nhóm (Sub-Layers)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              TẦNG 1: DỮ LIỆU NỀN & THIẾT LẬP HỆ THỐNG (MASTER DATA)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              Phân tách rõ ràng giữa <b>Công cụ Quản trị Hệ thống (System Operations)</b> và các <b>Miền Thiết lập Nghiệp vụ Cốt lõi (Business Domains)</b>
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

      {/* SUB-LAYER 1A: SYSTEM OPERATIONS & DYNAMIC CATALOG CRUD */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs">
              <Wrench className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                SUB-LAYER 1A: CÔNG CỤ QUẢN TRỊ & DANH MỤC DÙNG CHUNG
              </h3>
              <p className="text-[11px] text-slate-500">
                Thao tác CRUD danh mục động (Thêm/Sửa/Khóa) & Địa giới hành chính
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
            System Operations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {systemCrudCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory?.(cat.id)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 transition-all text-left group shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white rounded transition-colors">
                  {cat.code}
                </span>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-900 truncate">
                  {cat.title}
                </span>
              </div>
              {cat.sopBadge && (
                <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0">
                  {cat.sopBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-LAYER 1B: BUSINESS DOMAIN MASTER DATA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                SUB-LAYER 1B: THIẾT LẬP NGHIỆP VỤ NỀN TẢNG (3 CỤM MIỀN)
              </h3>
              <p className="text-[11px] text-slate-500">
                Các thực thể Master Data quyết định luồng vận hành toàn hệ thống HR
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
            Business Domains
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DOMAIN 1: ORG & POSITIONS */}
          <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Cơ cấu & Chức danh
              </span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
                MD-05 & MD-06
              </span>
            </div>
            <div className="space-y-2">
              {orgCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory?.(cat.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-blue-100/50 border border-slate-200/80 hover:border-blue-300 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 rounded border border-blue-200">
                      {cat.code}
                    </span>
                    <span className="text-xs font-medium text-slate-800 group-hover:text-blue-900">
                      {cat.title}
                    </span>
                  </div>
                  {cat.sopBadge && (
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {cat.sopBadge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DOMAIN 2: C&B & BENEFIT */}
          <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                Lương, Phụ cấp & BHXH
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                MD-07 & MD-09
              </span>
            </div>
            <div className="space-y-2">
              {compCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory?.(cat.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-amber-100/50 border border-slate-200/80 hover:border-amber-300 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 rounded border border-amber-200">
                      {cat.code}
                    </span>
                    <span className="text-xs font-medium text-slate-800 group-hover:text-amber-900">
                      {cat.title}
                    </span>
                  </div>
                  {cat.sopBadge && (
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {cat.sopBadge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DOMAIN 3: TIME & COMPLIANCE */}
          <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-2.5">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                Ca, Phép & Quy định
              </span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
                MD-08 & MD-10
              </span>
            </div>
            <div className="space-y-2">
              {operationalCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory?.(cat.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-purple-100/50 border border-slate-200/80 hover:border-purple-300 transition-all text-left group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-purple-700 bg-purple-50 rounded border border-purple-200">
                      {cat.code}
                    </span>
                    <span className="text-xs font-medium text-slate-800 group-hover:text-purple-900">
                      {cat.title}
                    </span>
                  </div>
                  {cat.sopBadge && (
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {cat.sopBadge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

