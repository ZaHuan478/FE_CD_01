import React, { useState, useMemo } from 'react'
import {
  Database,
  Search,
  Layers,
  GitFork,
  ArrowRight,
  Plus,
  Table,
  GitBranch,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  Clock,
  CircleDollarSign,
  Receipt,
  ShieldCheck,
  Target
} from 'lucide-react'

import { MASTER_DATA_HUB_DATABASE } from './data/masterDataHubDatabase'
import type { MasterCatalogItem, CatalogTier, CatalogModuleId } from './types'
import { CatalogDataInspectorModal } from './components/CatalogDataInspectorModal'
import { useLanguage } from '../../../context/LanguageContext'

interface MasterDataHubProps {
  onOpenERD?: () => void
  isDarkMode: boolean
}

export const MasterDataHub: React.FC<MasterDataHubProps> = ({ onOpenERD, isDarkMode }) => {
  const { language } = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<CatalogTier | 'ALL'>('ALL')
  const [selectedModule, setSelectedModule] = useState<CatalogModuleId | 'ALL'>('ALL')

  const [inspectingCatalog, setInspectingCatalog] = useState<MasterCatalogItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter catalogs based on search, tier and module
  const filteredCatalogs = useMemo(() => {
    return MASTER_DATA_HUB_DATABASE.filter((cat) => {
      // Search query filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchCode = cat.code.toLowerCase().includes(q)
        const matchTitle = cat.title.toLowerCase().includes(q) || cat.titleEn.toLowerCase().includes(q)
        const matchSubtitle = cat.subtitle.toLowerCase().includes(q) || cat.subtitleEn.toLowerCase().includes(q)
        const matchModule = cat.moduleName.toLowerCase().includes(q)
        if (!matchCode && !matchTitle && !matchSubtitle && !matchModule) return false
      }

      // Tier filter
      if (selectedTier !== 'ALL' && cat.tier !== selectedTier) return false

      // Module filter
      if (selectedModule !== 'ALL' && cat.moduleId !== selectedModule) return false

      return true
    })
  }, [searchTerm, selectedTier, selectedModule])

  const handleOpenInspector = (catalog: MasterCatalogItem) => {
    setInspectingCatalog(catalog)
    setIsModalOpen(true)
  }

  // Tier counts
  const globalCount = MASTER_DATA_HUB_DATABASE.filter((c) => c.tier === 'tier1_global').length
  const moduleCount = MASTER_DATA_HUB_DATABASE.filter((c) => c.tier === 'tier2_module').length
  const utilityCount = MASTER_DATA_HUB_DATABASE.filter((c) => c.tier === 'tier3_utility').length

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 🏛️ TOP HERO HEADER & ACTIONS */}
      {/* ========================================================================= */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                MASTER DATA SETTINGS HUB
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {MASTER_DATA_HUB_DATABASE.length} {language === 'vi' ? 'Danh mục Chuẩn hóa' : 'Standard Catalogs'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              {language === 'vi'
                ? 'Trung Tâm Quản Trị Danh Mục & Dữ Liệu Nền Tảng'
                : 'Enterprise Master Data Management Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              {language === 'vi'
                ? 'Không gian cấu hình dữ liệu nền tảng tập trung, phân tách độc lập giữa các phân hệ (Tuyển dụng, Nhân sự, Chấm công, Lương, Bảo hiểm, Thuế) nuôi sống toàn bộ quy trình vận hành.'
                : 'Centralized master data repository feeding independent operational sub-systems across Recruitment, Personnel, Timekeeping, Payroll, Insurance, and Tax.'}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          {onOpenERD && (
            <button
              type="button"
              onClick={onOpenERD}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Sơ Đồ Quan Hệ ERD' : 'View ERD Diagram'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (MASTER_DATA_HUB_DATABASE.length > 0) {
                handleOpenInspector(MASTER_DATA_HUB_DATABASE[0])
              }
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'vi' ? 'Thêm Danh Mục Mới' : 'Add New Catalog'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔍 SEARCH & 2-LEVEL FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 shadow-sm transition-colors ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Smart Live Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Tìm nhanh danh mục (ví dụ: Địa lý, Ngân hàng, Cơ cấu tổ chức, Thang bảng lương, Ca làm việc, BHXH, Thuế...)'
                : 'Quick search catalogs (e.g. Geography, Bank, Org Chart, Pay Scale, Shift, Insurance, Tax...)'
            }
            className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>

        {/* 2-LEVEL FILTER PILLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {/* Level 1: 3-Tier Classification Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              {language === 'vi' ? 'PHÂN TẦNG:' : 'TIER:'}
            </span>

            <button
              type="button"
              onClick={() => setSelectedTier('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTier === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {language === 'vi' ? 'Tất cả 3 Tầng' : 'All 3 Tiers'} ({MASTER_DATA_HUB_DATABASE.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('tier1_global')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTier === 'tier1_global'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              🏛️ {language === 'vi' ? 'Tầng 1: Toàn hệ thống (Global)' : 'Tier 1: Global'} ({globalCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('tier2_module')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTier === 'tier2_module'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              📦 {language === 'vi' ? 'Tầng 2: Theo Phân hệ' : 'Tier 2: Module-Specific'} ({moduleCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier('tier3_utility')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTier === 'tier3_utility'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              ⚙️ {language === 'vi' ? 'Tầng 3: Tiện ích' : 'Tier 3: Utility'} ({utilityCount})
            </button>
          </div>

          {/* Level 2: Subsystem Module Filter */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 mr-1">
              {language === 'vi' ? 'PHÂN HỆ:' : 'MODULE:'}
            </span>

            {[
              { id: 'ALL', label: 'Tất cả', labelEn: 'All', icon: <Layers className="w-3 h-3" /> },
              { id: 'ats', label: 'Tuyển dụng ATS', labelEn: 'ATS', icon: <Target className="w-3 h-3" /> },
              { id: 'emp', label: 'Core EMP', labelEn: 'EMP', icon: <Building2 className="w-3 h-3" /> },
              { id: 'att', label: 'Chấm công ATT', labelEn: 'ATT', icon: <Clock className="w-3 h-3" /> },
              { id: 'pay', label: 'Tiền lương PAY', labelEn: 'PAY', icon: <CircleDollarSign className="w-3 h-3" /> },
              { id: 'ins', label: 'Bảo hiểm INS', labelEn: 'INS', icon: <ShieldCheck className="w-3 h-3" /> },
              { id: 'tax', label: 'Thuế TAX', labelEn: 'TAX', icon: <Receipt className="w-3 h-3" /> }
            ].map((m) => {
              const isSelected = selectedModule === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModule(m.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m.icon}
                  <span>{language === 'vi' ? m.label : m.labelEn}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📦 MODERN SAAS MASTER CATALOG CARD GRID */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
          <span>
            {language === 'vi'
              ? `HIỂN THỊ ${filteredCatalogs.length} TRÊN TỔNG SỐ ${MASTER_DATA_HUB_DATABASE.length} DANH MỤC`
              : `SHOWING ${filteredCatalogs.length} OF ${MASTER_DATA_HUB_DATABASE.length} CATALOGS`}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {language === 'vi' ? 'Click vào thẻ để xem bảng dữ liệu & sơ đồ luồng' : 'Click card to view data table & flow'}
          </span>
        </div>

        {filteredCatalogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogs.map((catalog) => {
              return (
                <div
                  key={catalog.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between group shadow-xs hover:shadow-md ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-850'
                      : 'bg-white border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Module Badge + Record Count */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {catalog.code}
                        </span>

                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            catalog.tier === 'tier1_global'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                              : catalog.tier === 'tier2_module'
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                              : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                          }`}
                        >
                          {catalog.moduleName}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {catalog.recordCount} {language === 'vi' ? 'Bản ghi' : 'Rows'}
                      </span>
                    </div>

                    {/* Catalog Title & Subtitle */}
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {language === 'vi' ? catalog.title : catalog.titleEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {language === 'vi' ? catalog.subtitle : catalog.subtitleEn}
                      </p>
                    </div>

                    {/* Consuming / Feeds-into Modules Tags */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        {language === 'vi' ? '🔗 TIỀN ĐỀ NUÔI SỐNG (FEEDS INTO):' : '🔗 FEEDS INTO MODULES:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {catalog.feedsIntoModules.map((mod, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                            <span>{mod}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenInspector(catalog)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Xem Dữ Liệu' : 'View Data'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInspector(catalog)}
                      className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{language === 'vi' ? 'Sơ Đồ Luồng' : 'Data Flow'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
            <Database className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {language === 'vi'
                ? 'Không tìm thấy danh mục phù hợp với bộ lọc hiện tại'
                : 'No catalogs matched the current search criteria'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSelectedTier('ALL')
                setSelectedModule('ALL')
              }}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {language === 'vi' ? 'Xóa bộ lọc để xem lại toàn bộ' : 'Clear filters to view all'}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🔍 CATALOG DATA & FLOW INSPECTION MODAL */}
      {/* ========================================================================= */}
      <CatalogDataInspectorModal
        catalog={inspectingCatalog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
