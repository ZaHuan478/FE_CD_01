import React, { useState } from 'react'
import {
  X,
  Database,
  ArrowRight,
  Plus,
  Search,
  CheckCircle2,
  Table,
  GitBranch,
  Layers,
  Sparkles
} from 'lucide-react'
import type { MasterCatalogItem } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface CatalogDataInspectorModalProps {
  catalog: MasterCatalogItem | null
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export const CatalogDataInspectorModal: React.FC<CatalogDataInspectorModalProps> = ({
  catalog,
  isOpen,
  onClose,
  isDarkMode
}) => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'data' | 'flow' | 'schema'>('data')
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen || !catalog) return null

  const filteredRecords = catalog.sampleRecords.filter((rec) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      (rec.code && rec.code.toLowerCase().includes(searchLower)) ||
      (rec.name && rec.name.toLowerCase().includes(searchLower)) ||
      (rec.nameEn && rec.nameEn.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* MODAL TOP HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {catalog.code}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {catalog.moduleName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {catalog.recordCount} {language === 'vi' ? 'Bản ghi' : 'Records'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {language === 'vi' ? catalog.title : catalog.titleEn}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-TAB CONTROLLER BAR */}
        <div className="px-4 sm:px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'data'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>{language === 'vi' ? '📋 Bảng Dữ Liệu Mẫu' : '📋 Sample Data Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'flow'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4 text-emerald-500" />
            <span>{language === 'vi' ? '🔄 Sơ Đồ Nuôi Sống Dữ Liệu' : '🔄 Data Dependency Flow'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-500" />
            <span>{language === 'vi' ? '⚙️ Cấu Trúc Thuộc Tính (Schema)' : '⚙️ Field Schema Dictionary'}</span>
          </button>
        </div>

        {/* MODAL BODY CONTENT (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DATA PREVIEW TABLE */}
          {activeTab === 'data' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Search & Add Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'vi' ? 'Tìm nhanh trong danh mục này...' : 'Quick search in this catalog...'}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    {filteredRecords.length} / {catalog.sampleRecords.length} {language === 'vi' ? 'bản ghi' : 'rows'}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Thêm Bản Ghi Mới' : 'Add New Record'}</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                        {catalog.fields.map((f) => (
                          <th key={f.key} className="p-3 font-extrabold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span>{language === 'vi' ? f.name : f.nameEn}</span>
                              {f.required && <span className="text-rose-500">*</span>}
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 block font-normal">{f.key}</span>
                          </th>
                        ))}
                        <th className="p-3 font-extrabold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap">
                          {language === 'vi' ? 'Trạng Thái' : 'Status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {filteredRecords.map((row, idx) => (
                        <tr
                          key={row.id || idx}
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {catalog.fields.map((f) => (
                            <td key={f.key} className="p-3 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                              {typeof row[f.key] === 'boolean' ? (
                                row[f.key] ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Có</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">Không</span>
                                )
                              ) : typeof row[f.key] === 'number' ? (
                                <span className="font-mono">{row[f.key].toLocaleString()}</span>
                              ) : (
                                row[f.key] || '—'
                              )}
                            </td>
                          ))}
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Đang hiệu lực
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA DEPENDENCY PIPELINE FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-blue-300">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{language === 'vi' ? 'DÒNG CHẢY DỮ LIỆU & NGUỒN TIỀN ĐỀ LIÊN PHÂN HỆ' : 'DATA FLOW & MODULE DEPENDENCY'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'vi' ? catalog.description : catalog.descriptionEn}
                </p>
              </div>

              {/* Visual Horizontal Pipeline Canvas */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Node 1: Origin / Master Creator */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-500/40 shadow-sm text-center w-full md:w-56 space-y-1.5 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    1. NGUỒN TẠO DỮ LIỆU (CREATOR)
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white pt-1">
                    {catalog.moduleName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    HR Admin / Chuyên viên nghiệp vụ thiết lập & phê duyệt
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-blue-500 animate-pulse hidden md:block" />
                  <span className="text-xs font-bold text-blue-500 md:hidden">↓ Đồng bộ dữ liệu sang</span>
                </div>

                {/* Node 2: Catalog Table Hub */}
                <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg text-center w-full md:w-60 space-y-1.5 shrink-0">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 text-white">
                    2. BẢNG DANH MỤC ({catalog.code})
                  </span>
                  <h4 className="text-xs sm:text-sm font-black pt-1">
                    {language === 'vi' ? catalog.title : catalog.titleEn}
                  </h4>
                  <p className="text-[11px] text-blue-100">
                    {catalog.recordCount} bản ghi chuẩn hóa sẵn sàng cấp phát
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-emerald-500 animate-pulse hidden md:block" />
                  <span className="text-xs font-bold text-emerald-500 md:hidden">↓ Nuôi sống nghiệp vụ</span>
                </div>

                {/* Node 3: Consuming Sub-systems */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-sm w-full md:w-64 space-y-2 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 block text-center">
                    3. CÁC PHÂN HỆ KẾ THỪA (CONSUMERS)
                  </span>

                  <ul className="space-y-1.5">
                    {catalog.feedsIntoModules.map((mod, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA ATTRIBUTE SPECIFICATIONS */}
          {activeTab === 'schema' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {language === 'vi'
                  ? `ĐẶC TẢ CHI TIẾT ${catalog.fields.length} TRƯỜNG THUỘC TÍNH BẢN GHI (DATA DICTIONARY)`
                  : `SPECIFICATIONS OF ${catalog.fields.length} FIELD ATTRIBUTES (DATA DICTIONARY)`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catalog.fields.map((fld) => (
                  <div
                    key={fld.key}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                          {fld.key}
                        </span>
                        {fld.required && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Bắt buộc (Required)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {fld.type}
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {language === 'vi' ? fld.name : fld.nameEn}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {language === 'vi' ? fld.description : fld.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="text-[11px] text-slate-400">
            {language === 'vi' ? 'Dữ liệu được chuẩn hóa theo kiến trúc Master Data SAP / Workday' : 'Standardized per SAP / Workday Master Data Architecture'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Đóng Cửa Sổ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
