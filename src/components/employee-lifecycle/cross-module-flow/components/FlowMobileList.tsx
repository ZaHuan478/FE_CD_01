import React from 'react'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { FlowConnection, CrossClusterOverviewConnection, FlowNode } from '../types'
import { FlowTransferInspector } from './FlowTransferInspector'
import { FREQUENCY_METADATA } from '../utils/flowConstants'
import { useLanguage } from '../../../../context/LanguageContext'

interface FlowMobileListProps {
  connections: (FlowConnection | CrossClusterOverviewConnection)[]
  nodes: FlowNode[]
  selectedConnectionId: string
  onSelectConnection: (id: string) => void
}

export const FlowMobileList: React.FC<FlowMobileListProps> = ({
  connections,
  nodes,
  selectedConnectionId,
  onSelectConnection
}) => {
  const { language } = useLanguage()

  const getNodeLabel = (id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return id
    return language === 'vi' ? node.label : node.labelEn
  }

  return (
    <div className="space-y-3 block md:hidden">
      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
        {language === 'vi' ? `Danh sách ${connections.length} luồng dữ liệu:` : `List of ${connections.length} data connections:`}
      </div>

      <div className="space-y-2.5">
        {connections.map((c) => {
          const isSelected = c.id === selectedConnectionId
          const sourceLabel = 'from' in c ? getNodeLabel(c.from) : c.fromCluster
          const targetLabel = 'to' in c ? getNodeLabel(c.to) : c.toCluster
          const freqMeta = FREQUENCY_METADATA[c.frequency]

          return (
            <div
              key={c.id}
              className={`rounded-2xl border transition-all ${
                isSelected
                  ? 'border-[#1f5f86] dark:border-sky-500 bg-sky-50/20 dark:bg-sky-950/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectConnection(c.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1f5f86] dark:text-sky-400 truncate">
                    <span>{sourceLabel}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{targetLabel}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {language === 'vi' ? c.label : c.labelEn}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className={`px-2 py-0.5 rounded border ${freqMeta.bg} ${freqMeta.text} font-bold`}>
                      {language === 'vi' ? freqMeta.label : freqMeta.labelEn}
                    </span>
                    <span>{c.dataItems.length} {language === 'vi' ? 'mục dữ liệu' : 'data fields'}</span>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isSelected && (
                <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <FlowTransferInspector
                    connection={c}
                    sourceNodeLabel={sourceLabel}
                    targetNodeLabel={targetLabel}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
