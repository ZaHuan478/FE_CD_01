import React from 'react'
import { ArrowDown, ChevronRight, CheckSquare } from 'lucide-react'
import type { FlowNode, FlowConnection } from '../../../entities/process-flow/model/types'
import { getFlowIcon, FREQUENCY_METADATA } from '../../../entities/process-flow/lib/flowConstants'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface OrganizationDependencyRendererProps {
  nodes: FlowNode[]
  connections: FlowConnection[]
  selectedConnectionId: string
  selectedNodeId?: string
  onSelectConnection: (id: string) => void
  onSelectNode: (id: string) => void
}

export const OrganizationDependencyRenderer: React.FC<OrganizationDependencyRendererProps> = ({
  nodes,
  connections,
  selectedConnectionId,
  selectedNodeId,
  onSelectConnection,
  onSelectNode
}) => {
  const { language } = useLanguage()

  const getNode = (id: string) => nodes.find((n) => n.id === id)

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* 1. Header Banner */}
      <div className="w-full min-w-0 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <CheckSquare className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200">
            {language === 'vi' ? 'Chuỗi Ràng buộc & Tiền đề Nghiệp vụ' : 'Sequential Dependency & Prerequisite Chain'}
          </h4>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
            {language === 'vi'
              ? 'Từng bước kế thừa và tiêu thụ dữ liệu từ bước trước: Định biên ➔ Cơ cấu ➔ Chức danh ➔ Vị trí ➔ Báo cáo.'
              : 'Output of previous stage strictly becomes the required input for the subsequent step.'}
          </p>
        </div>
      </div>

      {/* 2. Stepper Track */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {nodes.map((node, idx) => {
          const Icon = getFlowIcon(node.iconName)
          const isNodeSelected = selectedNodeId === node.id

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isNodeSelected
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  Tầng #{idx + 1}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">{node.code}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isNodeSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {language === 'vi' ? node.label : node.labelEn}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* 3. Dependency Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
          <span>{language === 'vi' ? 'Các mối quan hệ ràng buộc và bàn giao:' : 'Dependency Constraints & Data Handoffs:'}</span>
          <span className="text-[11px] font-normal text-slate-500">
            {language === 'vi' ? 'Chọn để xem chi tiết kiểm soát' : 'Click to inspect control gates'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {connections.map((c) => {
            const isSelected = c.id === selectedConnectionId
            const fromNode = getNode(c.from)
            const toNode = getNode(c.to)
            const freqMeta = FREQUENCY_METADATA[c.frequency]

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConnection(c.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-indigo-700 dark:text-indigo-400">
                    <span>{fromNode ? (language === 'vi' ? fromNode.label : fromNode.labelEn) : c.from}</span>
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{toNode ? (language === 'vi' ? toNode.label : toNode.labelEn) : c.to}</span>
                  </div>

                  <p
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'vi' ? c.label : c.labelEn}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className={`px-2 py-0.5 rounded border ${freqMeta.bg} ${freqMeta.text} font-bold`}>
                      {language === 'vi' ? freqMeta.label : freqMeta.labelEn}
                    </span>
                    <span>{c.dataItems.length} {language === 'vi' ? 'mục bàn giao' : 'items'}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
