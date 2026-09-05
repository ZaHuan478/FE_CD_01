/**
 * MasterDataRelationshipView.tsx
 *
 * Bản đồ quan hệ dữ liệu Master Data — hỗ trợ hai chế độ:
 *   mode="embedded"  → hiển thị trong Center Workspace (không modal)
 *   mode="modal"     → hiển thị trong MasterDataRelationshipModal (backward compat)
 *
 * Không dùng animation mũi tên chạy liên tục.
 * Hỗ trợ prefers-reduced-motion.
 * Không gọi đây là ERD kỹ thuật vì chưa hiển thị cardinality đầy đủ.
 */
import React, { useState } from 'react'
import {
  Network,
  ArrowRight,
  Database,
  UserCheck,
  FileText,
  Briefcase,
  Layers,
  ScrollText,
  ShieldCheck,
  Info
} from 'lucide-react'
import { erdClustersData } from '../../../entities/module/data/erdClustersData'

// ────────────────────────────────────────────────────────────────────────────
// PROPS
// ────────────────────────────────────────────────────────────────────────────

export interface MasterDataRelationshipViewProps {
  isDarkMode?: boolean
  mode: 'embedded' | 'modal'
  selectedCatalogId?: string | null
  onSelectCatalog?: (id: string) => void
}

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export const MasterDataRelationshipView: React.FC<MasterDataRelationshipViewProps> = ({
  isDarkMode = false,
  mode,
  selectedCatalogId,
  onSelectCatalog
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const subdued = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const isEmbedded = mode === 'embedded'

  return (
    <div className={`${isEmbedded ? 'p-4 sm:p-5 space-y-5' : 'space-y-5'}`}>

      {/* Header (only in embedded mode) */}
      {isEmbedded && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Bản đồ quan hệ dữ liệu Master Data
            </h3>
          </div>
          <p className={`text-xs leading-relaxed ${subdued}`}>
            Hiển thị các nhóm danh mục Master Data và phân hệ nhận dữ liệu.
            Bấm vào một mục để xem chi tiết trong Inspector.
          </p>
        </div>
      )}

      {/* Banner explainer */}
      <div className={`rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs ${isDarkMode ? 'bg-slate-800/80 border border-slate-700 text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
        <Database className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
        <span className="flex-1">
          Các danh mục nền (phòng ban, chức danh, lương…) được các quy trình SOP sử dụng.
          Kết quả cuối cùng cập nhật vào <strong>hồ sơ nhân viên trung tâm</strong>.
        </span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shrink-0 font-medium ${isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          <ScrollText className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
          Gắn thẻ Quy trình SOP chuẩn
        </div>
      </div>

      {/* Accessibility note about motion */}
      {/* The relationship diagram uses hover effects only (no continuous animations) */}

      {/* Main diagram: 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

        {/* Left: ERD clusters */}
        <div className="lg:col-span-8 space-y-4">
          {erdClustersData.map((cluster) => (
            <div
              key={cluster.id}
              className={`rounded-xl border p-4 relative transition-shadow ${isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-sm'}`}
            >
              {/* Cluster header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border uppercase tracking-wide shrink-0 ${cluster.badgeBg}`}>
                    {cluster.title}
                  </span>
                  {cluster.sopIds?.map((sop) => (
                    <span key={sop} className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border shrink-0 flex items-center gap-1 ${isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      <ScrollText className="w-3 h-3" aria-hidden="true" />{sop}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span className={subdued}>Nguồn cho:</span>
                  <span className="text-blue-500 font-bold">{cluster.targetField}</span>
                </div>
              </div>

              <p className={`text-[11px] mb-3 ${subdued}`}>{cluster.subtitle}</p>

              {/* Cluster items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cluster.items.map((item) => {
                  const isSelected = selectedCatalogId === item.id
                  const isHovered = hoveredItem === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectCatalog?.(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      aria-pressed={isSelected}
                      aria-label={`Xem ${item.title}`}
                      className={`
                        flex items-start gap-2.5 p-2.5 rounded-xl border text-left
                        transition-colors cursor-pointer
                        focus-visible:outline-2 focus-visible:outline-blue-500
                        ${isSelected
                          ? isDarkMode ? 'border-blue-500/60 bg-blue-600/15' : 'border-blue-400 bg-blue-50/70'
                          : isHovered
                            ? isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-blue-300 bg-blue-50/30'
                            : isDarkMode ? 'border-slate-800 bg-slate-950/60 hover:bg-slate-800' : 'border-slate-200 bg-slate-50/50 hover:border-blue-300'
                        }
                      `}
                    >
                      <span className={`
                        px-2 py-0.5 text-[10px] font-mono font-bold rounded border shrink-0 mt-0.5 transition-colors
                        ${isSelected ? 'bg-blue-600 text-white border-blue-600' : isDarkMode ? 'bg-blue-950 text-blue-400 border-blue-800/50' : 'bg-blue-50 text-blue-700 border-blue-200'}
                      `}>
                        {item.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-xs font-semibold truncate ${isSelected || isHovered ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'} transition-colors`}>
                            {item.title}
                          </span>
                          {item.sopBadge && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${isDarkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                              {item.sopBadge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-0.5 truncate ${subdued}`}>{item.subtitle}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Desktop arrow indicator */}
              <div
                className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full items-center justify-center shadow-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-500"
                aria-hidden="true"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Central Employee Record */}
        <div className="lg:col-span-4 flex">
          <div className={`w-full rounded-xl border-2 p-5 flex flex-col justify-between relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900 border-blue-500/40' : 'bg-gradient-to-b from-slate-50 via-blue-50/40 to-white border-blue-300/60'}`}>
            {/* Background decorative icon */}
            <div className="absolute top-0 right-0 p-3 opacity-5 text-blue-500" aria-hidden="true">
              <UserCheck className="w-28 h-28" />
            </div>

            <div className="relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${isDarkMode ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Đích đến
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
                HỒ SƠ NHÂN VIÊN TRUNG TÂM
              </h4>
              <p className={`text-[11px] mb-5 leading-relaxed ${subdued}`}>
                Tập hợp toàn bộ thông tin định danh & vận hành nhân sự theo chuẩn SOP.
              </p>

              <div className="space-y-2.5">
                {[
                  { icon: FileText, color: 'text-sky-500', label: 'Sơ yếu Lý lịch', sub: 'Thông tin cá nhân & Địa lý', sop: 'SOP-NS-04', borderClass: isDarkMode ? 'border-sky-500/30' : 'border-sky-200' },
                  { icon: Briefcase, color: 'text-indigo-500', label: 'Vị trí Công tác', sub: 'Cơ cấu, Chức danh & Level', sop: 'SOP-NS-01/09', borderClass: isDarkMode ? 'border-indigo-500/30' : 'border-indigo-200' },
                  { icon: Layers, color: 'text-emerald-500', label: 'Hợp đồng & Chế độ', sub: 'Lương, Ca kíp & Bảo hiểm', sop: 'SOP-L/BH/CC', borderClass: isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200' }
                ].map(({ icon: Icon, color, label, sub, sop, borderClass }) => (
                  <div key={label} className={`p-2.5 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/90'} ${borderClass}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${color} shrink-0`} aria-hidden="true" />
                      <div>
                        <p className={`text-[11px] font-bold uppercase ${color}`}>{label}</p>
                        <p className={`text-[11px] ${subdued}`}>{sub}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {sop}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative z-10 mt-5 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} text-center`}>
              <span className={`text-[10px] font-medium ${subdued}`}>
                ✦ Cung cấp dữ liệu chuẩn SOP cho 8 giai đoạn Vòng đời Nhân viên (Tầng 2)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`flex flex-wrap items-center gap-3 text-[11px] ${subdued} p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
        <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="font-medium">Chú giải:</span>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" aria-hidden="true" />
            Danh mục được chọn
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" aria-hidden="true" />
            Mã SOP liên kết
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3 text-blue-400" aria-hidden="true" />
            Luồng dữ liệu
          </span>
        </div>
      </div>
    </div>
  )
}
