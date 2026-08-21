import React, { useState } from 'react'
import {
  Target,
  Users,
  Clock,
  CircleDollarSign,
  ShieldCheck,
  Receipt,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Database,
  Layers,
  CheckCircle2,
  X,
  Workflow
} from 'lucide-react'
import { useLanguage } from '../../../context/LanguageContext'
import {
  MATRIX_SUBSYSTEMS,
  CROSS_MODULE_FLOWS,
  type SubsystemNode,
  type MatrixCellFlow
} from './subsystemMatrixData'

export const SubsystemMatrixView: React.FC = () => {
  const { language } = useLanguage()
  const [selectedFlow, setSelectedFlow] = useState<MatrixCellFlow | null>(null)
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>('emp')
  const [viewMode, setViewMode] = useState<'matrix' | 'flow'>('matrix')

  // Helper icon renderer
  const renderIcon = (iconName: SubsystemNode['iconName'], className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Target':
        return <Target className={className} />
      case 'Users':
        return <Users className={className} />
      case 'Clock':
        return <Clock className={className} />
      case 'CircleDollarSign':
        return <CircleDollarSign className={className} />
      case 'ShieldCheck':
        return <ShieldCheck className={className} />
      case 'Receipt':
        return <Receipt className={className} />
    }
  }

  const selectedSubsystem =
    MATRIX_SUBSYSTEMS.find((s) => s.id === selectedSubsystemId) || MATRIX_SUBSYSTEMS[1]

  // Filter flows for the selected subsystem in deep-dive mode
  const incomingFlows = CROSS_MODULE_FLOWS.filter((f) => f.toModuleId === selectedSubsystemId)
  const outgoingFlows = CROSS_MODULE_FLOWS.filter((f) => f.fromModuleId === selectedSubsystemId)

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 🌟 BANNER GIỚI THIỆU MA TRẬN TƯƠNG QUAN ĐẦU VÀO - ĐẦU RA */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/60 border border-blue-500/30 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-600/90 rounded-2xl shadow-md shrink-0">
              <Workflow className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
                  {language === 'vi' ? 'KIẾN TRÚC ENTERPRISE HRMS' : 'ENTERPRISE ARCHITECTURE'}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {language === 'vi' ? '6 Phân Hệ Độc Lập & Mối Tương Quan I/O' : '6 Standalone Subsystems & I/O Relations'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {language === 'vi'
                  ? 'Bản Đồ Mối Tương Quan Đầu Vào - Đầu Ra (Cross-Subsystem I/O Matrix)'
                  : 'Cross-Subsystem Input-Output Interconnection Matrix'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                {language === 'vi'
                  ? 'Mỗi phân hệ hoạt động như 1 phần mềm độc lập, có đầu vào - đầu ra rõ ràng và là tiền đề nuôi sống các phân hệ khác.'
                  : 'Each subsystem functions as an independent modular engine with transparent inputs/outputs feeding the whole ecosystem.'}
              </p>
            </div>
          </div>

          {/* VIEW MODE TOGGLE PILLS */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Bảng Ma Trận 6x6' : '6x6 Matrix Board'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('flow')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'flow'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Dòng Chảy Phân Hệ' : 'Subsystem Flow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📊 CHẾ ĐỘ 1: BẢNG MA TRẬN 6X6 (INTERACTIVE GRID BOARD) */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className="p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {language === 'vi' ? 'MA TRẬN GIAO TIẾP DỮ LIỆU ĐẦU VÀO / ĐẦU RA' : 'CROSS-MODULE DATA EXCHANGE MATRIX'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'vi'
                  ? 'Hàng ngang (From) chuyển giao dữ liệu sang Cột dọc (To). Bấm vào ô có biểu tượng để xem chi tiết gói dữ liệu.'
                  : 'Horizontal rows (From) stream data to Vertical columns (To). Click any active cell to inspect payload.'}
              </p>
            </div>

            {/* LEGEND BADGES */}
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                {language === 'vi' ? 'Tự động đồng bộ' : 'Auto Sync'}
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {language === 'vi' ? 'Bắt buộc (Core)' : 'Mandatory'}
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                {language === 'vi' ? 'Theo sự kiện' : 'Event Trigger'}
              </span>
            </div>
          </div>

          {/* THE MATRIX TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-3 text-[11px] font-black uppercase text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 rounded-tl-2xl border border-slate-200 dark:border-slate-700">
                    {language === 'vi' ? 'Nguồn (From) ➔ Đích (To)' : 'From ➔ To'}
                  </th>
                  {MATRIX_SUBSYSTEMS.map((colMod) => (
                    <th
                      key={colMod.id}
                      className="p-3 text-center text-xs font-extrabold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-blue-600 dark:text-blue-400">
                          {renderIcon(colMod.iconName, 'w-3.5 h-3.5')}
                        </span>
                        <span>{colMod.code}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_SUBSYSTEMS.map((rowMod) => (
                  <tr key={rowMod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    {/* Row Header */}
                    <td className="p-3 font-bold text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-1 rounded-lg text-white shrink-0"
                          style={{ backgroundColor: rowMod.color }}
                        >
                          {renderIcon(rowMod.iconName, 'w-3.5 h-3.5')}
                        </div>
                        <div>
                          <span className="block font-black text-xs">{rowMod.code}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                            {language === 'vi' ? rowMod.name.split('(')[0].trim() : rowMod.nameEn.split('(')[0].trim()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Matrix Cells */}
                    {MATRIX_SUBSYSTEMS.map((colMod) => {
                      if (rowMod.id === colMod.id) {
                        return (
                          <td
                            key={colMod.id}
                            className="p-2 text-center bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700"
                          >
                            <span className="text-slate-300 dark:text-slate-700 font-mono text-sm">—</span>
                          </td>
                        )
                      }

                      const flow = CROSS_MODULE_FLOWS.find(
                        (f) => f.fromModuleId === rowMod.id && f.toModuleId === colMod.id
                      )

                      if (!flow) {
                        return (
                          <td
                            key={colMod.id}
                            className="p-2 text-center text-slate-300 dark:text-slate-700 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                          >
                            ·
                          </td>
                        )
                      }

                      const isSelected =
                        selectedFlow?.fromModuleId === rowMod.id &&
                        selectedFlow?.toModuleId === colMod.id

                      return (
                        <td
                          key={colMod.id}
                          className={`p-2 text-center border border-slate-200 dark:border-slate-700 transition-all ${
                            isSelected
                              ? 'bg-blue-100/80 dark:bg-blue-950/80 ring-2 ring-blue-500'
                              : 'hover:bg-blue-50 dark:hover:bg-blue-950/40'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedFlow(flow)}
                            className="w-full py-2 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer group"
                          >
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono font-extrabold rounded-md transition-transform group-hover:scale-105 shadow-2xs ${
                                flow.flowType === 'mandatory'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                  : flow.flowType === 'automated'
                                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {flow.sopRef.split('➔')[0].trim()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                              {flow.dataItems.length} gói tin
                            </span>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔄 CHẾ ĐỘ 2: DÒNG CHẢY PHÂN HỆ DEEP-DIVE (SUBSYSTEM FLOW VIEW) */}
      {/* ========================================================================= */}
      {viewMode === 'flow' && (
        <div className="space-y-4 animate-fadeIn">
          {/* SUBSYSTEM SELECTOR PILLS */}
          <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 mr-2">
              {language === 'vi' ? 'CHỌN PHÂN HỆ TRỌNG TÂM:' : 'SELECT FOCUS SUBSYSTEM:'}
            </span>
            {MATRIX_SUBSYSTEMS.map((sub) => {
              const isSelected = sub.id === selectedSubsystemId
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubsystemId(sub.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-2xl border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {renderIcon(sub.iconName, 'w-3.5 h-3.5')}
                  <span>{sub.code}</span>
                  <span className="text-[10px] font-mono opacity-80">({sub.sopCount} SOPs)</span>
                </button>
              )
            })}
          </div>

          {/* 3-COLUMN INFLOW ➔ MODULE ➔ OUTFLOW ARCHITECTURE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* 📥 CỘT TRÁI (4 COLS): CÁC ĐẦU VÀO NHẬN TỪ PHÂN HỆ KHÁC (INCOMING FLOWS) */}
            <div className="lg:col-span-4 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">
                    {language === 'vi' ? '📥 ĐẦU VÀO NHẬN TỪ CÁC PHÂN HỆ' : '📥 INCOMING INPUT DATA FEEDS'}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  {incomingFlows.length}
                </span>
              </div>

              {incomingFlows.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  {language === 'vi'
                    ? 'Là phân hệ đầu nguồn khởi tạo sơ khai (nhận yêu cầu từ người dùng)'
                    : 'Originating top-level module (receives direct user inputs)'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {incomingFlows.map((flow, idx) => {
                    const fromMod = MATRIX_SUBSYSTEMS.find((m) => m.id === flow.fromModuleId)
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedFlow(flow)}
                        className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            {fromMod && renderIcon(fromMod.iconName, 'w-3 h-3')}
                            {fromMod?.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {flow.sopRef}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {language === 'vi' ? flow.flowTitle : flow.flowTitleEn}
                        </h5>
                        <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pl-3 list-disc">
                          {flow.dataItems.slice(0, 2).map((item, i) => (
                            <li key={i} className="line-clamp-1">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 🏛️ CỘT GIỮA (4 COLS): BẢN THÂN PHÂN HỆ & MASTER DATA TIỀN ĐỀ */}
            <div className="lg:col-span-4 p-4 sm:p-5 rounded-3xl border-2 border-blue-500/40 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/60 dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-950 shadow-md space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-blue-500/20">
                <div
                  className="p-2.5 rounded-2xl text-white shadow-md shrink-0"
                  style={{ backgroundColor: selectedSubsystem.color }}
                >
                  {renderIcon(selectedSubsystem.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase text-blue-600 dark:text-blue-400">
                    {selectedSubsystem.code}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'vi' ? selectedSubsystem.name : selectedSubsystem.nameEn}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {language === 'vi' ? selectedSubsystem.shortDesc : selectedSubsystem.shortDescEn}
              </p>

              {/* Master Data Feeds Info */}
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-700 dark:text-blue-300">
                  <Database className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'DANH MỤC TIỀN ĐỀ NỀN TẢNG' : 'PREREQUISITE MASTER DATA'}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {language === 'vi'
                    ? `Phân hệ này liên kết và vận hành trực tiếp trên ${selectedSubsystem.masterCatalogsCount} bảng Master Data cốt lõi.`
                    : `Directly operates on top of ${selectedSubsystem.masterCatalogsCount} core Master Data catalog tables.`}
                </p>
              </div>
            </div>

            {/* 📤 CỘT PHẢI (4 COLS): CÁC ĐẦU RA CUNG CẤP CHO PHÂN HỆ KHÁC (OUTGOING FLOWS) */}
            <div className="lg:col-span-4 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">
                    {language === 'vi' ? '📤 ĐẦU RA NUÔI DƯỠNG CÁC PHÂN HỆ' : '📤 OUTGOING DATA FEEDS'}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                  {outgoingFlows.length}
                </span>
              </div>

              {outgoingFlows.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  {language === 'vi'
                    ? 'Là phân hệ đầu cuối hoàn tất báo cáo tài chính/thuế'
                    : 'Terminal endpoint module (financial/tax finalization)'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {outgoingFlows.map((flow, idx) => {
                    const toMod = MATRIX_SUBSYSTEMS.find((m) => m.id === flow.toModuleId)
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedFlow(flow)}
                        className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            {toMod && renderIcon(toMod.iconName, 'w-3 h-3')}
                            ➔ {toMod?.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {flow.sopRef}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {language === 'vi' ? flow.flowTitle : flow.flowTitleEn}
                        </h5>
                        <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pl-3 list-disc">
                          {flow.dataItems.slice(0, 2).map((item, i) => (
                            <li key={i} className="line-clamp-1">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔍 MODAL CHI TIẾT GÓI DỮ LIỆU CHUYỂN GIAO (DATA FLOW INSPECTOR MODAL) */}
      {/* ========================================================================= */}
      {selectedFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-lg bg-blue-600 text-white shadow-xs">
                    {selectedFlow.sopRef}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg border ${
                      selectedFlow.flowType === 'mandatory'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        : selectedFlow.flowType === 'automated'
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
                        : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {selectedFlow.flowType === 'mandatory'
                      ? 'Core Mandatory (Bắt buộc)'
                      : selectedFlow.flowType === 'automated'
                      ? 'Automated Stream (Tự động)'
                      : 'Event Trigger (Theo sự kiện)'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {language === 'vi' ? selectedFlow.flowTitle : selectedFlow.flowTitleEn}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFlow(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Module Connection Route */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 uppercase text-[10px]">TỪ:</span>
                <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black">
                  {MATRIX_SUBSYSTEMS.find((m) => m.id === selectedFlow.fromModuleId)?.name}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 animate-pulse" />
              <div className="flex items-center gap-2">
                <span className="text-slate-400 uppercase text-[10px]">SANG:</span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black">
                  {MATRIX_SUBSYSTEMS.find((m) => m.id === selectedFlow.toModuleId)?.name}
                </span>
              </div>
            </div>

            {/* Business Rationale */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
              <span className="font-extrabold uppercase block mb-1">
                {language === 'vi' ? 'Ý NGHĨA KẾ THỪA & TIỀN ĐỀ:' : 'BUSINESS PREREQUISITE:'}
              </span>
              {language === 'vi' ? selectedFlow.businessRationale : selectedFlow.businessRationaleEn}
            </div>

            {/* Data Items List */}
            <div className="space-y-2">
              <h5 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                {language === 'vi' ? 'CÁC TRƯỜNG DỮ LIỆU CHUYỂN GIAO:' : 'TRANSFERRED DATA FIELDS:'}
              </h5>
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                {(language === 'vi' ? selectedFlow.dataItems : selectedFlow.dataItemsEn).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample JSON Payload */}
            <div className="space-y-2">
              <h5 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">
                {language === 'vi' ? 'MẪU DỮ LIỆU ĐỒNG BỘ (SAMPLE PAYLOAD):' : 'SAMPLE SYNC PAYLOAD (JSON):'}
              </h5>
              <pre className="p-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedFlow.samplePayload, null, 2)}
              </pre>
            </div>

            {/* Footer Close */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFlow(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Đóng cửa sổ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
