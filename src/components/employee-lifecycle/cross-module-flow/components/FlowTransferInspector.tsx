import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  AlertTriangle,
  GitBranch,
  ExternalLink,
  Info
} from 'lucide-react'
import type { FlowConnection, CrossClusterOverviewConnection } from '../types'
import { FREQUENCY_METADATA, DIRECTION_METADATA } from '../utils/flowConstants'
import { useLanguage } from '../../../../context/LanguageContext'

interface FlowTransferInspectorProps {
  connection?: FlowConnection | CrossClusterOverviewConnection
  sourceNodeLabel?: string
  targetNodeLabel?: string
}

export const FlowTransferInspector: React.FC<FlowTransferInspectorProps> = ({
  connection,
  sourceNodeLabel,
  targetNodeLabel
}) => {
  const navigate = useNavigate()
  const { language } = useLanguage()

  if (!connection) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p>{language === 'vi' ? 'Vui lòng chọn một luồng dữ liệu trên sơ đồ để xem chi tiết gói bàn giao.' : 'Please select a data flow connection on the diagram to inspect.'}</p>
      </div>
    )
  }

  const freqMeta = FREQUENCY_METADATA[connection.frequency]
  const dirMeta = DIRECTION_METADATA[connection.direction]

  const dataItems = language === 'vi' ? connection.dataItems : connection.dataItemsEn
  const controls = language === 'vi' ? connection.controls : connection.controlsEn
  const exceptions = language === 'vi' ? connection.exceptions : connection.exceptionsEn

  const handleOpenWorkflow = (workflowId: string, sopCode?: string) => {
    const params = sopCode ? `?sop=${encodeURIComponent(sopCode)}` : ''
    navigate(`/employee-lifecycle/workflow/${workflowId}${params}`)
  }

  return (
    <article className="w-full min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="space-y-1.5">
          {/* Source -> Target Badges */}
          <div className="flex items-center gap-2 text-xs font-black text-[#1f5f86] dark:text-sky-400 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800">
              {sourceNodeLabel || ('from' in connection ? connection.from : connection.fromCluster)}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              {targetNodeLabel || ('to' in connection ? connection.to : connection.toCluster)}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
            {language === 'vi' ? connection.label : connection.labelEn}
          </h3>

          {connection.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'vi' ? connection.description : connection.descriptionEn}
            </p>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap self-start">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${dirMeta.bg} ${dirMeta.text}`}>
            {language === 'vi' ? dirMeta.label : dirMeta.labelEn}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${freqMeta.bg} ${freqMeta.text}`}>
            <freqMeta.icon className="w-3 h-3" />
            <span>{language === 'vi' ? freqMeta.label : freqMeta.labelEn}</span>
          </span>
        </div>
      </div>

      {/* 2. Dữ liệu được bàn giao (Transferred Data Items) */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'vi' ? 'Gói dữ liệu được bàn giao' : 'Transferred Data Package'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dataItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f5f86] dark:bg-sky-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sự kiện kích hoạt (Trigger Event) */}
      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 space-y-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'vi' ? 'Sự kiện kích hoạt chuyển giao (Trigger Event):' : 'Trigger Event:'}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 pl-5 leading-relaxed font-medium">
          {'trigger' in connection
            ? (language === 'vi' ? connection.trigger : connection.triggerEn)
            : (language === 'vi' ? 'Kích hoạt định kỳ hoặc khi phát sinh giao dịch liên cụm.' : 'Periodic or event-driven cross-cluster trigger.')}
        </p>
      </div>

      {/* 4. Điều kiện kiểm soát (Required Controls) */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
          <span>{language === 'vi' ? 'Điều kiện kiểm soát bắt buộc' : 'Required Governance Controls'}</span>
        </h4>

        <div className="space-y-1.5">
          {controls.map((ctrl, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
              <span className="leading-relaxed font-medium">{ctrl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Xử lý ngoại lệ (Exception Handling) */}
      {exceptions && exceptions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'vi' ? 'Xử lý ngoại lệ & Phương án dự phòng' : 'Exception Handling & Fallbacks'}</span>
          </h4>

          <div className="space-y-1.5">
            {exceptions.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                <span className="leading-relaxed font-medium">{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Quy trình liên quan & CTA */}
      {connection.relatedWorkflowIds && connection.relatedWorkflowIds.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {language === 'vi' ? 'Quy trình SOP liên quan:' : 'Related Workflows:'}
            </span>
            {connection.relatedWorkflowIds.map((wfId, idx) => (
              <span
                key={idx}
                className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#1f5f86] dark:text-sky-300 border border-slate-200 dark:border-slate-700"
              >
                {wfId}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleOpenWorkflow(
              connection.relatedWorkflowIds[0],
              'relatedSopCodes' in connection ? connection.relatedSopCodes?.[0] : undefined
            )}
            className="px-3.5 py-1.5 bg-[#1f5f86] hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-center shrink-0"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Xem chi tiết sơ đồ SOP' : 'View Workflow'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </article>
  )
}
