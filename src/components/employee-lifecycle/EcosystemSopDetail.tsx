import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GitBranch,
  FileText,
  UserCheck,
  CheckCircle2,
  Inbox,
  Send,
  Sparkles,
  ListCheck,
  ArrowUpRight
} from 'lucide-react'
import { type SopDetailItem } from './data/ecosystemModulesData'
import { useLanguage } from '../../context/LanguageContext'

interface EcosystemSopDetailProps {
  activeSopItem: SopDetailItem
}

export const EcosystemSopDetail: React.FC<EcosystemSopDetailProps> = ({ activeSopItem }) => {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const workflowId = activeSopItem.workflowId || 'LIFE-01'
  const wireframeId = activeSopItem.wireframeId || activeSopItem.workflowId || 'LIFE-01'

  return (
    <div className="sticky top-20 bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm animate-fadeIn">

      {/* 1. INSPECTOR TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-lg bg-blue-600 text-white shadow-xs">
              {activeSopItem.code}
            </span>

            <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg border ${
              activeSopItem.type === 'N'
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30'
                : activeSopItem.type === 'M'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            }`}>
              {activeSopItem.type === 'N'
                ? (language === 'vi' ? 'N: Nhập liệu & Khai báo' : 'N: Data Input')
                : activeSopItem.type === 'M'
                  ? (language === 'vi' ? 'M: Thẩm định & Phê duyệt' : 'M: Review & Approval')
                  : (language === 'vi' ? 'A: Tự động hóa hệ thống' : 'A: Automated Engine')}
            </span>

            {activeSopItem.stageNumber && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {language === 'vi' ? `Chặng ${activeSopItem.stageNumber}` : `Stage ${activeSopItem.stageNumber}`}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
            {language === 'vi' ? activeSopItem.title : activeSopItem.titleEn}
          </h3>
        </div>

        {/* QUICK FORM UI BUTTON */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => navigate(`/employee-lifecycle/wireframe/${wireframeId}`)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Mở giao diện Form mẫu"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'vi' ? 'Mở Form UI' : 'Form UI'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>

      {/* 2. SCOPE & CONTEXT CALLOUT BOX */}
      {activeSopItem.scopeNote && (
        <div className={`p-4 rounded-2xl border ${
          activeSopItem.code === 'SOP-EMP-02'
            ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
            : activeSopItem.code === 'SOP-EMP-03'
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200'
              : 'bg-slate-100/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wide block mb-0.5">
                {language === 'vi' ? 'Ý NGHĨA & PHẠM VI NGHIỆP VỤ (SCOPE):' : 'BUSINESS SCOPE & OBJECTIVE:'}
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {language === 'vi' ? activeSopItem.scopeNote : activeSopItem.scopeNoteEn || activeSopItem.scopeNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTOR / RACI ROW */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
        <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
          {language === 'vi' ? 'VAI TRÒ THỰC HIỆN:' : 'ACTOR & RACI:'}
        </span>
        <span className="font-bold text-slate-900 dark:text-white">
          {language === 'vi' ? activeSopItem.actor || 'Chuyên viên Nhân sự & Hệ thống' : activeSopItem.actorEn || 'HR Specialist & System'}
        </span>
      </div>

      {/* 4. 2-BOX GRID: INPUTS & OUTPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* INPUTS BOX */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 dark:text-blue-400 pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <Inbox className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '📥 DỮ LIỆU ĐẦU VÀO (INPUTS)' : '📥 INPUT REQUIREMENTS'}</span>
          </div>

          <ul className="space-y-1.5">
            {(activeSopItem.inputs && activeSopItem.inputs.length > 0
              ? activeSopItem.inputs
              : ['Hồ sơ yêu cầu hợp lệ', 'Thông tin định danh nhân sự', 'Quy chế công ty liên quan']
            ).map((inp, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{inp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OUTPUTS BOX */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '📤 KẾT QUẢ ĐẦU RA (OUTPUTS)' : '📤 OUTPUT DELIVERABLES'}</span>
          </div>

          <ul className="space-y-1.5">
            {(activeSopItem.outputs && activeSopItem.outputs.length > 0
              ? activeSopItem.outputs
              : ['Bản ghi dữ liệu được cập nhật', 'Thông báo xác nhận qua Email/Portal', 'Lưu vết Audit Log hệ thống']
            ).map((out, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{out}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DEDICATED DIRECT NAVIGATION ACTION BAR (4 NÚT MỞ TỪNG TRANG CHUYÊN BIỆT) */}
      {/* ========================================================================= */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {language === 'vi' ? 'XEM SƠ ĐỒ WORKFLOW (MỞ TRANG CHUYÊN BIỆT):' : 'OPEN DEDICATED WORKFLOW PAGES:'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* NÚT 1: SƠ ĐỒ INFOGRAPHIC */}
          <button
            type="button"
            onClick={() => navigate(`/employee-lifecycle/infographic/${workflowId}`)}
            className="p-3 bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-2 border-slate-900 dark:border-slate-200 rounded-2xl text-xs font-black flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
              <span>{language === 'vi' ? 'Sơ đồ Infographic (5 Giai đoạn)' : '5-Stage Infographic Blueprint'}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>

          {/* NÚT 2: SƠ ĐỒ FLOWCHART */}
          <button
            type="button"
            onClick={() => navigate(`/employee-lifecycle/flowchart/${workflowId}`)}
            className="p-3 bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-2 border-slate-900 dark:border-slate-200 rounded-2xl text-xs font-black flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
              <span>{language === 'vi' ? 'Sơ đồ Flowchart (Chi tiết các bước)' : 'Step-by-Step Flowchart'}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>

          {/* NÚT 3: PHÂN ĐỊNH VAI TRÒ & RACI */}
          <button
            type="button"
            onClick={() => navigate(`/employee-lifecycle/raci/${workflowId}`)}
            className="p-3 bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-2 border-slate-900 dark:border-slate-200 rounded-2xl text-xs font-black flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
              <span>{language === 'vi' ? 'Phân định Vai trò & RACI Matrix' : 'Roles & RACI Matrix'}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>

          {/* NÚT 4: BẢNG SOP SPECS */}
          <button
            type="button"
            onClick={() => navigate(`/employee-lifecycle/specs/${workflowId}`)}
            className="p-3 bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-2 border-slate-900 dark:border-slate-200 rounded-2xl text-xs font-black flex items-center justify-between shadow-2xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <ListCheck className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
              <span>{language === 'vi' ? 'Bảng Đặc tả SOP Specs' : 'SOP Specifications Table'}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        </div>
      </div>

    </div>
  )
}
