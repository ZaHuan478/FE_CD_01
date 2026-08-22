import React, { useEffect } from 'react'
import {
  X,
  Target,
  Users,
  CheckCircle2,
  Share2,
  FileText,
  Layout,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Cog,
  Database,
  Sparkles
} from 'lucide-react'
import type { DetailItem } from '../../types/employee-lifecycle'
import { lifecycleMockNodes, type IntegrationModule } from '../../data/lifecycle-mock-data'

interface NodeDetailDrawerProps {
  item: DetailItem
  onClose: () => void
  onOpenWireframe?: (item: DetailItem) => void
}

// Module Tag color mapping helper
const getModuleBadgeStyle = (color: string) => {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    case 'blue':
    case 'sky':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    case 'indigo':
    case 'purple':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800'
    case 'rose':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    case 'amber':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  item,
  onClose,
  onOpenWireframe
}) => {
  // ESC key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Retrieve mock node data if available
  const sopNodeData = lifecycleMockNodes[item.id]

  // Fallbacks for node details
  const contextTrigger = sopNodeData?.contextTrigger || item.subtitle || 'Dữ liệu và quy trình vận hành theo tiêu chuẩn Quản trị Nhân sự.'
  const actorsMatrix = sopNodeData?.actorsMatrix || {
    proposer: item.actors[0]?.name || 'HR Admin',
    approver: item.actors[1]?.name || 'Trưởng bộ phận / BOM',
    executor: item.actors[2]?.name || item.actors[0]?.name || 'HRM Engine'
  }
  const inputsList = sopNodeData?.inputs || (item.inputs.length > 0 ? item.inputs : ['Thông tin phát sinh theo quy định', 'Hồ sơ tài liệu kèm theo'])
  const outputsList = sopNodeData?.outputs || (item.outputs.length > 0 ? item.outputs : ['Bản ghi lưu vết hệ thống', 'Quyết định / Báo cáo ban hành'])
  const integrationsList: IntegrationModule[] = sopNodeData?.integrations || [
    {
      module: 'PROFILE',
      moduleName: 'Hồ sơ Nhân sự',
      color: 'blue',
      description: 'Lưu vết cập nhật vào Hồ sơ nhân viên & Nhật ký hệ thống.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="px-3 py-1.5 bg-blue-600 rounded-xl font-mono text-xs font-bold text-white shadow-sm border border-blue-400/30">
              {item.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {item.category.toUpperCase()} NODE SPECIFICATION
                </span>
                {sopNodeData?.sopBadge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    {sopNodeData.sopBadge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold leading-snug text-white mt-0.5">
                {sopNodeData?.title || item.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-700 dark:text-slate-300">

          {/* SOP Governing Banner */}
          {item.sopIds && item.sopIds.length > 0 && (
            <div className="p-4 bg-emerald-50/90 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1.5">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Quy trình SOP Chuẩn Điều phối (Governance & Compliance)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.sopIds.map((sop, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-mono text-xs font-semibold shadow-xs">
                    📋 {sop}
                  </span>
                ))}
              </div>
              {item.sopTitles && item.sopTitles.length > 0 && (
                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium mt-2 leading-relaxed">
                  {item.sopTitles.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* CARD 1: 🎯 BỐI CẢNH & ĐIỀU KIỆN KÍCH HOẠT (TRIGGER) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-800/80 dark:to-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                <Target className="w-4 h-4" />
              </div>
              <span>Card 1 · 🎯 Bối cảnh & Điều kiện kích hoạt (Trigger)</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-100/80 dark:border-indigo-900/40">
              {contextTrigger}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* CARD 2: 👥 TÁC NHÂN THỰC HIỆN (ACTORS MATRIX) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span>Card 2 · 👥 Tác nhân thực hiện (Actors Matrix)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Badge 1: Proposer */}
              <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Người đề xuất</span>
                </div>
                <div className="text-xs font-medium text-amber-950 dark:text-amber-100 leading-snug">
                  {actorsMatrix.proposer}
                </div>
              </div>

              {/* Badge 2: Approver */}
              <div className="p-3 bg-blue-50/90 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Người phê duyệt</span>
                </div>
                <div className="text-xs font-medium text-blue-950 dark:text-blue-100 leading-snug">
                  {actorsMatrix.approver}
                </div>
              </div>

              {/* Badge 3: Executor */}
              <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                  <Cog className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Người thực thi</span>
                </div>
                <div className="text-xs font-medium text-emerald-950 dark:text-emerald-100 leading-snug">
                  {actorsMatrix.executor}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 3: 📥 DỮ LIỆU ĐẦU VÀO (INPUT DATA CHECKLIST) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                <div className="p-1.5 bg-sky-600 text-white rounded-lg">
                  <Database className="w-4 h-4" />
                </div>
                <span>Card 3 · 📥 Dữ liệu Đầu vào (Input Data Checklist)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                {inputsList.length} Items
              </span>
            </div>

            <ul className="space-y-2">
              {inputsList.map((inputItem: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-2xs hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 leading-snug font-medium">
                    {inputItem}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* CARD 4: 📤 KẾT QUẢ ĐẦU RA & LIÊN THÔNG (OUTPUT & INTEGRATION) */}
          {/* ========================================================================= */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <Share2 className="w-4 h-4" />
              </div>
              <span>Card 4 · 📤 Kết quả Đầu ra & Liên thông Phân hệ</span>
            </div>

            {/* Sub-section: Output Documents */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Văn bản & Kết quả sinh ra:
              </span>
              <ul className="space-y-2">
                {outputsList.map((outputItem: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-medium"
                  >
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{outputItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub-section: Module Integration Badges */}
            {integrationsList.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-slate-200/70 dark:border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Liên thông Phân hệ Thực tế:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {integrationsList.map((integ: IntegrationModule, idx: number) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${getModuleBadgeStyle(integ.color)}`}
                    >
                      <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-mono font-bold rounded uppercase shrink-0 mt-0.5 shadow-2xs">
                        [{integ.module}] {integ.moduleName}
                      </span>
                      <div className="leading-relaxed font-medium">
                        {integ.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SOP Process Steps (Optional / Detailed Workflow) */}
          {item.process?.steps && item.process.steps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">05 · Các bước thực hiện quy trình chuẩn</h4>
              <ol className="space-y-1.5 list-none text-xs">
                {item.process.steps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Form Wireframe Preview Button */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <Layout className="w-4 h-4 text-blue-400" />
                <span>Mẫu Form nhập liệu sơ khảo UI Wireframe ({item.id})</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">Form Schema</span>
            </div>

            {item.uiFields && item.uiFields.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {item.uiFields.map((field, idx) => (
                  <div key={idx} className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate">{field}</span>
                    <span className="text-[9px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40 shrink-0">Input</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenWireframe?.(item)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>🖥️ Mở Xem & Thao tác Form UI Sơ Khảo (Interactive Form Modal)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenWireframe?.(item)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Mở Form UI Sơ khảo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  )
}
