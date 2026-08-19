import React, { useState } from 'react'
import {
  Database,
  Network,
  ArrowRight,
  CheckCircle2,
  Building2,
  Coins,
  Clock,
  Layers,
  Wrench,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { MasterDataCategory } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'

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
  const { language, t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 relative overflow-hidden transition-all duration-300 hover:shadow-md space-y-6">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100/60 dark:border-blue-900/50 shadow-xs shrink-0 mt-0.5">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
                Layer 1 · Ground Foundation
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {language === 'vi' ? 'Mô hình Phân tầng 2 Nhóm (Sub-Layers)' : '2-Sublayer Architecture'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {t('layer1.title', 'TẦNG 1: DỮ LIỆU NỀN & THIẾT LẬP HỆ THỐNG (MASTER DATA)')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {t('layer1.subtitle', '10 Danh mục Dữ liệu Dùng chung - Nền tảng Chuẩn hóa Toàn Hệ thống')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center">
          {/* CTA Button to trigger ERD Diagram */}
          <button
            type="button"
            onClick={onOpenERD}
            className="inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shrink-0 cursor-pointer group"
          >
            <Network className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>{t('layer1.erdButton', 'Xem Sơ đồ ERD')}</span>
            <ArrowRight className="w-4 h-4 text-blue-200 transition-transform group-hover:translate-x-1" />
          </button>


          {/* Collapse Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
            title={isExpanded ? (language === 'vi' ? 'Thu gọn Tầng 1 Master Data' : 'Collapse Layer 1 Master Data') : (language === 'vi' ? 'Mở rộng Tầng 1 Master Data' : 'Expand Layer 1 Master Data')}
          >
            <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EXPANDABLE BODY CONTENT */}
      {isExpanded && (
        <div className="space-y-6 animate-fadeIn">
          {/* SUB-LAYER 1A: SYSTEM OPERATIONS & DYNAMIC CATALOG CRUD */}
          <div className="bg-slate-50/80 dark:bg-slate-950/70 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs">
                  <Wrench className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                    {language === 'vi'
                      ? 'SUB-LAYER 1A: CÔNG CỤ QUẢN TRỊ & DANH MỤC DÙNG CHUNG'
                      : 'SUB-LAYER 1A: ADMIN TOOLS & COMMON CATALOGS'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'vi'
                      ? 'Thao tác CRUD danh mục động (Thêm/Sửa/Khóa) & Địa giới hành chính'
                      : 'Dynamic catalog CRUD operations (Add/Edit/Lock) & Administrative boundaries'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                System Operations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {systemCrudCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory?.(cat.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white rounded transition-colors">
                      {cat.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 truncate">
                      {cat.title}
                    </span>
                  </div>
                  {cat.sopBadge && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800 shrink-0">
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
                <span className="p-1.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                    {language === 'vi'
                      ? 'SUB-LAYER 1B: THIẾT LẬP NGHIỆP VỤ NỀN TẢNG (3 CỤM MIỀN)'
                      : 'SUB-LAYER 1B: FOUNDATION BUSINESS SETUPS (3 DOMAIN CLUSTERS)'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'vi'
                      ? 'Các thực thể Master Data quyết định luồng vận hành toàn hệ thống HR'
                      : 'Core Master Data entities controlling HR system workflows'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                Business Domains
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DOMAIN 1: ORG & POSITIONS */}
              <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2.5">
                <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/50 pb-2">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {language === 'vi' ? 'Cơ cấu & Chức danh' : 'Org Structure & Job Titles'}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                    MD-05 & MD-06
                  </span>
                </div>
                <div className="space-y-2">
                  {orgCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory?.(cat.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-100/50 dark:hover:bg-blue-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                          {cat.code}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-900 dark:group-hover:text-blue-300">
                          {cat.title}
                        </span>
                      </div>
                      {cat.sopBadge && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {cat.sopBadge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DOMAIN 2: C&B & BENEFIT */}
              <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-2.5">
                <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/50 pb-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {language === 'vi' ? 'Lương, Phụ cấp & BHXH' : 'Salary, Allowances & Insurance'}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                    MD-07 & MD-09
                  </span>
                </div>
                <div className="space-y-2">
                  {compCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory?.(cat.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-amber-100/50 dark:hover:bg-amber-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                          {cat.code}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-300">
                          {cat.title}
                        </span>
                      </div>
                      {cat.sopBadge && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {cat.sopBadge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DOMAIN 3: TIME & COMPLIANCE */}
              <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2.5">
                <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/50 pb-2">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    {language === 'vi' ? 'Ca, Phép & Quy định' : 'Shifts, Leave & Policies'}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                    MD-08 & MD-10
                  </span>
                </div>
                <div className="space-y-2">
                  {operationalCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory?.(cat.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-purple-100/50 dark:hover:bg-purple-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                          {cat.code}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-purple-900 dark:group-hover:text-purple-300">
                          {cat.title}
                        </span>
                      </div>
                      {cat.sopBadge && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
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
      )}

    </div>
  )
}
