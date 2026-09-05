import React, { useState, useMemo } from 'react'
import {
  Clock,
  FileEdit,
  UserSquare2,
  Award,
  AlertTriangle,
  GraduationCap,
  Target,
  GitBranch,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  ArrowRight,
  Info
} from 'lucide-react'
import type { OperationModule } from '../../../entities/module/model/lifecycle.types'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'
import { CROSS_FUNCTIONAL_MODULES_LIST } from '../../../entities/sop/cross-functional/index'

interface OperationsGridProps {
  modules?: OperationModule[]
  onSelectModule: (id: string) => void
}

const DOMAIN_ICON_MAP: Record<string, React.ElementType> = {
  'CF-01': Clock,
  'CF-02': FileEdit,
  'CF-03': UserSquare2,
  'CF-04': Award,
  'CF-05': AlertTriangle,
  'CF-06': GraduationCap,
  'CF-07': Target,
  'CF-08': GitBranch
}

const DOMAIN_COLOR_MAP: Record<string, { light: string; dark: string; border: string; text: string }> = {
  time_leave: {
    light: 'bg-blue-50 text-blue-700 border-blue-200',
    dark: 'dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    border: 'group-hover:border-blue-400 dark:group-hover:border-blue-600',
    text: 'text-blue-600 dark:text-blue-400'
  },
  contract: {
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dark: 'dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    border: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-600',
    text: 'text-emerald-600 dark:text-emerald-400'
  },
  movement: {
    light: 'bg-purple-50 text-purple-700 border-purple-200',
    dark: 'dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    border: 'group-hover:border-purple-400 dark:group-hover:border-purple-600',
    text: 'text-purple-600 dark:text-purple-400'
  },
  reward: {
    light: 'bg-amber-50 text-amber-700 border-amber-200',
    dark: 'dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    border: 'group-hover:border-amber-400 dark:group-hover:border-amber-600',
    text: 'text-amber-600 dark:text-amber-400'
  },
  discipline: {
    light: 'bg-rose-50 text-rose-700 border-rose-200',
    dark: 'dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    border: 'group-hover:border-rose-400 dark:group-hover:border-rose-600',
    text: 'text-rose-600 dark:text-rose-400'
  },
  learning: {
    light: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dark: 'dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800',
    border: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-600',
    text: 'text-indigo-600 dark:text-indigo-400'
  },
  performance: {
    light: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dark: 'dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800',
    border: 'group-hover:border-cyan-400 dark:group-hover:border-cyan-600',
    text: 'text-cyan-600 dark:text-cyan-400'
  },
  talent: {
    light: 'bg-teal-50 text-teal-700 border-teal-200',
    dark: 'dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-800',
    border: 'group-hover:border-teal-400 dark:group-hover:border-teal-600',
    text: 'text-teal-600 dark:text-teal-400'
  }
}

export const OperationsGrid: React.FC<OperationsGridProps> = ({
  onSelectModule
}) => {
  const { language, t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedDomain, setSelectedDomain] = useState<string>('all')

  const filterDomains: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'Tất cả (8)' },
    { id: 'time_leave', label: 'Công & Phép' },
    { id: 'contract', label: 'Hợp đồng' },
    { id: 'movement', label: 'Điều chuyển' },
    { id: 'reward', label: 'Khen thưởng' },
    { id: 'discipline', label: 'Kỷ luật' },
    { id: 'learning', label: 'Đào tạo' },
    { id: 'performance', label: 'Hiệu suất' },
    { id: 'talent', label: 'Nhân tài' }
  ]

  const filteredModules = useMemo(() => {
    return CROSS_FUNCTIONAL_MODULES_LIST.filter((mod) => {
      const matchDomain = selectedDomain === 'all' || mod.domain === selectedDomain
      const q = searchQuery.trim().toLowerCase()
      if (!q) return matchDomain

      const matchText =
        mod.code.toLowerCase().includes(q) ||
        mod.title.toLowerCase().includes(q) ||
        mod.shortTitle.toLowerCase().includes(q) ||
        mod.subtitle.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.sopBadge.toLowerCase().includes(q) ||
        mod.domainLabel.toLowerCase().includes(q) ||
        mod.inputs.some((i) => i.toLowerCase().includes(q)) ||
        mod.outputs.some((o) => o.toLowerCase().includes(q))

      return matchDomain && matchText
    })
  }, [selectedDomain, searchQuery])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5 transition-all duration-300 hover:shadow-md">
      {/* ── HEADER & COLLAPSE ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">

            {/* <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'vi' ? 'Cross-Functional Operations' : '8 Operational Modules'}
            </span> */}
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {t('layer3.title', 'NGHIỆP VỤ PHÁT SINH TRONG QUÁ TRÌNH LÀM VIỆC')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {t(
              'layer3.subtitle',
              '8 Module Nghiệp vụ Xử lý Định kỳ & Đột xuất (Không tuần tự) Trong Quá trình Công tác'
            )}
          </p>
        </div>

        {/* Collapse Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 self-start sm:self-center"
          title={
            isExpanded
              ? language === 'vi'
                ? 'Thu gọn'
                : 'Collapse'
              : language === 'vi'
                ? 'Mở rộng'
                : 'Expand'
          }
        >
          <span>
            {isExpanded
              ? language === 'vi'
                ? 'Thu gọn'
                : 'Collapse'
              : language === 'vi'
                ? 'Mở rộng'
                : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ── PLAIN-LANGUAGE GUIDE BANNER ───────────────────────────────────── */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 p-3.5 text-xs leading-relaxed text-slate-700 dark:border-blue-900/50 dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-slate-900 dark:text-slate-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="text-blue-900 dark:text-blue-300 font-bold">Hiểu đơn giản:</strong>{' '}
            Khác với Vòng đời nhân sự (Tầng 2) diễn ra tuần tự từ lúc vào làm đến khi nghỉ việc,{' '}
            <strong>Tầng 3 gồm các sự kiện phát sinh bất kỳ lúc nào</strong> (xin nghỉ phép, tăng ca,
            điều chuyển, nâng lương, khen thưởng, kỷ luật hoặc đào tạo).
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Mỗi card bên dưới cung cấp đầy đủ: <strong>Khi nào kích hoạt</strong>,{' '}
            <strong>Ai đề xuất / duyệt</strong>, <strong>Dữ liệu cần chuẩn bị</strong>,{' '}
            <strong>SLA xử lý</strong> và <strong>Phân hệ tiếp nhận</strong>. Click vào card để xem
            chi tiết quy trình & RACI matrix.
          </p>
        </div>
      </div>

      {/* ── EXPANDABLE BODY CONTENT ───────────────────────────────────────── */}
      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            {/* Domain Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {filterDomains.map((d) => {
                const active = selectedDomain === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDomain(d.id)}
                    className={`
                      px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all
                      ${active
                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nghiệp vụ, mã CF, SOP..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Cards Grid (4 columns desktop, 2 tablet, 1 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredModules.map((mod) => {
              const Icon = DOMAIN_ICON_MAP[mod.id] || Clock
              const colors = DOMAIN_COLOR_MAP[mod.domain] || DOMAIN_COLOR_MAP.time_leave

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onSelectModule(mod.id)}
                  className={`
                    bg-slate-50/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-800/90
                    p-4 rounded-xl border border-slate-200/80 dark:border-slate-800
                    ${colors.border}
                    text-left hover:-translate-y-1 transition-all duration-200 hover:shadow-md
                    flex flex-col justify-between group cursor-pointer relative overflow-hidden
                  `}
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Icon + Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`
                        p-2.5 rounded-lg border shrink-0 transition-colors
                        ${colors.light} ${colors.dark}
                      `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-black rounded transition-colors ${mod.code === 'CF-05'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:bg-blue-600 group-hover:text-white'
                              }`}
                          >
                            {mod.code}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded">
                          📋 {mod.sopBadge}
                        </span>
                      </div>
                    </div>

                    {/* Title & Domain */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {mod.domainLabel}
                        </span>
                        <span className="text-[10px] text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          ⏱ {mod.sla.split(';')[0]}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors leading-snug">
                        {mod.title}
                      </h3>
                    </div>

                    {/* Subtitle / Plain Trigger */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {mod.subtitle}
                    </p>

                    {/* Actors Mini Flow */}
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-[10px] space-y-1">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-bold">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>Trách nhiệm (RACI):</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight truncate">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Tạo:</span>{' '}
                        {mod.actorsMatrix.proposer.split('(')[0]} ➔{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Duyệt:
                        </span>{' '}
                        {mod.actorsMatrix.approver.split('(')[0]}
                      </p>
                    </div>

                    {/* Downstream badges */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Liên thông:</span>
                      {mod.downstreamModules.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Bar: Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {mod.frequencyLabel.split('&')[0]}
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-0.5">
                      Xem quy trình & RACI <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">Không tìm thấy nghiệp vụ phù hợp với từ khóa.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
