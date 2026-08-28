import React from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { FlowNode, FlowConnection } from '../types'
import { getFlowIcon, FREQUENCY_METADATA } from '../utils/flowConstants'
import { useLanguage } from '../../../../context/LanguageContext'

interface CorePipelineRendererProps {
  nodes: FlowNode[]
  connections: FlowConnection[]
  selectedConnectionId: string
  selectedNodeId?: string
  onSelectConnection: (id: string) => void
  onSelectNode: (id: string) => void
}

export const CorePipelineRenderer: React.FC<CorePipelineRendererProps> = ({
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
      {/* 1. Horizontal Scrollable Module Nodes Track */}
      <div className="w-full min-w-0 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            {language === 'vi' ? 'Chuỗi 9 phân hệ Vận hành lõi (Directed Pipeline):' : '9 Core Modules Directed Pipeline:'}
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {language === 'vi' ? 'Cuộn ngang ➔' : 'Scroll horizontal ➔'}
          </span>
        </div>

        <div className="w-full overflow-x-auto pb-1">
          <div className="flex items-center gap-2 w-max py-1">
            {nodes.map((node, index) => {
              const Icon = getFlowIcon(node.iconName)
              const isNodeSelected = selectedNodeId === node.id
              const isLast = index === nodes.length - 1

              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNode(node.id)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer shrink-0 ${
                      isNodeSelected
                        ? 'border-[#1f5f86] bg-sky-50 dark:bg-sky-950/60 dark:border-sky-500 shadow-xs ring-1 ring-[#1f5f86]/30'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isNodeSelected
                          ? 'bg-[#1f5f86] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-[#1f5f86] dark:text-sky-400 group-hover:bg-sky-100 dark:group-hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 block leading-tight">
                        {node.code}
                      </span>
                      <span
                        className={`text-[11px] font-bold block whitespace-nowrap leading-tight ${
                          isNodeSelected ? 'text-[#1f5f86] dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {language === 'vi' ? node.label : node.labelEn}
                      </span>
                    </div>
                  </button>

                  {!isLast && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Connections Grid / List with Max-Height Scrolling */}
      <div className="w-full min-w-0 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
          <span>{language === 'vi' ? `Danh sách 11 luồng bàn giao dữ liệu:` : `11 Pipeline Data Handoffs:`}</span>
          <span className="text-[11px] font-normal text-slate-500">
            {language === 'vi' ? 'Nhấn để xem chi tiết' : 'Click to inspect'}
          </span>
        </div>

        <div className="w-full min-w-0 max-h-[560px] overflow-y-auto space-y-2 pr-1">
          {connections.map((c, index) => {
            const isSelected = c.id === selectedConnectionId
            const fromNode = getNode(c.from)
            const toNode = getNode(c.to)
            const freqMeta = FREQUENCY_METADATA[c.frequency]

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConnection(c.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer min-w-0 ${
                  isSelected
                    ? 'border-[#1f5f86] dark:border-sky-500 bg-[#1f5f86]/5 dark:bg-sky-950/40 ring-2 ring-[#1f5f86]/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-[#1f5f86] dark:text-sky-400 truncate">
                    <span className="font-mono text-slate-400 font-bold mr-0.5">#{index + 1}</span>
                    <span className="truncate">{fromNode ? (language === 'vi' ? fromNode.label : fromNode.labelEn) : c.from}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{toNode ? (language === 'vi' ? toNode.label : toNode.labelEn) : c.to}</span>
                  </div>

                  <p
                    className={`text-xs font-bold leading-snug truncate ${
                      isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'vi' ? c.label : c.labelEn}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                    <span className={`px-2 py-0.5 rounded border ${freqMeta.bg} ${freqMeta.text} font-bold`}>
                      {language === 'vi' ? freqMeta.label : freqMeta.labelEn}
                    </span>
                    <span>{c.dataItems.length} {language === 'vi' ? 'trường dữ liệu' : 'fields'}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                    isSelected ? 'bg-[#1f5f86] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
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
