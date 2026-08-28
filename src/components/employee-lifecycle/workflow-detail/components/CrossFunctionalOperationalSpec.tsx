import React from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Database,
  ArrowRight,
  Bell,
  RotateCcw,
  GitMerge,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import type { CrossFunctionalModuleDefinition } from '../../cross-functional'

interface CrossFunctionalOperationalSpecProps {
  module: CrossFunctionalModuleDefinition
  onOpenWireframe?: () => void
}

export const CrossFunctionalOperationalSpec: React.FC<CrossFunctionalOperationalSpecProps> = ({
  module,
  onOpenWireframe
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── 1. OPERATIONAL OVERVIEW & SLA LEAD TIME ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-950/40 dark:to-slate-900 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Bối cảnh & Điều kiện kích hoạt nghiệp vụ
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
            {module.triggerSummary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-bold block mb-0.5">
                Tần suất phát sinh:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {module.frequencyLabel}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-bold block mb-0.5">
                SLA xử lý cam kết:
              </span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                ⏱ {module.sla}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Master Data phụ thuộc (Tầng 1)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Các danh mục nền tảng cần chuẩn hóa trước khi thực thi nghiệp vụ này:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {module.masterDataIds.map((mdId: string) => (
                <span
                  key={mdId}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800"
                >
                  {mdId}
                </span>
              ))}
            </div>
          </div>

          {onOpenWireframe && (
            <button
              type="button"
              onClick={onOpenWireframe}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Xem biểu mẫu / Wireframe</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. RACI MATRIX & ACTORS ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Ma trận Phân quyền & Trách nhiệm (RACI)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Tác nhân tham gia</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
            <div className="flex items-center gap-1.5 mb-1 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>1. Người Đề xuất (R - Responsible)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {module.actorsMatrix.proposer}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1.5 mb-1 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>2. Người Phê duyệt (A - Accountable)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {module.actorsMatrix.approver}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
            <div className="flex items-center gap-1.5 mb-1 text-purple-700 dark:text-purple-300 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>3. Người Thực thi (S - Support/Execute)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {module.actorsMatrix.executor}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-1.5 mb-1 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>4. Thông báo & Lưu trữ (I - Informed)</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {module.actorsMatrix.notified || 'Hệ thống HRMS, Quản lý trực tiếp & Nhân viên liên quan'}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. INPUTS & OUTPUTS DUAL CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inputs */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Dữ liệu & Hồ sơ Đầu vào (Inputs)
            </h3>
          </div>
          <ul className="space-y-2">
            {module.inputs.map((inp: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{inp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outputs */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Kết quả & Bàn giao Đầu ra (Outputs)
            </h3>
          </div>
          <ul className="space-y-2">
            {module.outputs.map((out: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{out}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 4. DOWNSTREAM INTEGRATIONS ────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Liên thông phân hệ tiếp nhận (Downstream Modules)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {module.integrations.map((integ, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {integ.module}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {integ.moduleName}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {integ.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. EXCEPTION HANDLING MATRIX ─────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Quy tắc Xử lý Ngoại lệ (Exceptions & Escalation)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {module.exceptionHandling.map((rule, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{rule.scenario}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {rule.handling}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. AUDIT LOG & NOTIFICATIONS ─────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Nhật ký Kiểm toán (Audit Trail) & Thông báo tự động
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {module.auditAndNotification.map((item, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Bell className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{item.logEvent}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Gửi đến:</strong>{' '}
                {item.notificationTarget}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Kênh: {item.notificationChannel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
