import React from 'react'
import { ArrowRight, RefreshCw, ChevronRight } from 'lucide-react'
import type { FlowNode, FlowConnection } from '../../../entities/process-flow/model/types'
import { getFlowIcon, FREQUENCY_METADATA } from '../../../entities/process-flow/lib/flowConstants'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface PeopleFeedbackLoopRendererProps {
  nodes: FlowNode[]
  connections: FlowConnection[]
  selectedConnectionId: string
  selectedNodeId?: string
  onSelectConnection: (id: string) => void
  onSelectNode: (id: string) => void
}

export const PeopleFeedbackLoopRenderer: React.FC<PeopleFeedbackLoopRendererProps> = ({
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
      {/* 1. Circular / Closed-loop Visual Badge */}
      <div className="w-full min-w-0 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
              {language === 'vi' ? 'Chu trình Khép kín & Tái tạo Hiệu suất' : 'Closed-Loop Performance Cycle'}
            </h4>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {language === 'vi'
                ? 'Mỗi kết quả của một giai đoạn là căn cứ đầu vào cho bước tiếp theo, tạo thành vòng phản hồi liên tục.'
                : 'Each stage outcome feeds the next, culminating in continuous performance feedback.'}
            </p>
          </div>
        </div>

        {/* 6 Stage Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {nodes.map((node, index) => {
            const Icon = getFlowIcon(node.iconName)
            const isNodeSelected = selectedNodeId === node.id

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode(node.id)}
                className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                  isNodeSelected
                    ? 'border-emerald-600 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-emerald-200/60 dark:border-emerald-900/40 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  #{index + 1} {node.code}
                </span>

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isNodeSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {language === 'vi' ? node.label : node.labelEn}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Step Connections in the Loop */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
          <span>{language === 'vi' ? 'Các bước chuyển tiếp trong chu trình:' : 'Cycle Transition Stages:'}</span>
          <span className="text-[11px] font-normal text-slate-500">
            {language === 'vi' ? 'Chọn để xem gói bàn giao & điều kiện kiểm soát' : 'Click to inspect handoff payload & controls'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {connections.map((c) => {
            const isSelected = c.id === selectedConnectionId
            const fromNode = getNode(c.from)
            const toNode = getNode(c.to)
            const freqMeta = FREQUENCY_METADATA[c.frequency]
            const isFeedback = c.direction === 'feedback'

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConnection(c.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/40 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                    <span>{fromNode ? (language === 'vi' ? fromNode.label : fromNode.labelEn) : c.from}</span>
                    {isFeedback ? (
                      <RefreshCw className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
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
                    {isFeedback && (
                      <span className="px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold">
                        {language === 'vi' ? 'Vòng lặp Feedback' : 'Feedback Loop'}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded border ${freqMeta.bg} ${freqMeta.text} font-bold`}>
                      {language === 'vi' ? freqMeta.label : freqMeta.labelEn}
                    </span>
                    <span>{c.dataItems.length} {language === 'vi' ? 'mục dữ liệu' : 'fields'}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
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
