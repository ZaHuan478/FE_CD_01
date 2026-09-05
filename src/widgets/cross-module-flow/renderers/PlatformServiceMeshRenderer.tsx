import React from 'react'
import { Layers, ChevronRight, ArrowRight } from 'lucide-react'
import type { FlowNode, FlowConnection } from '../../../entities/process-flow/model/types'
import { getFlowIcon, FREQUENCY_METADATA } from '../../../entities/process-flow/lib/flowConstants'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface PlatformServiceMeshRendererProps {
  nodes: FlowNode[]
  connections: FlowConnection[]
  selectedConnectionId: string
  selectedNodeId?: string
  onSelectConnection: (id: string) => void
  onSelectNode: (id: string) => void
}

export const PlatformServiceMeshRenderer: React.FC<PlatformServiceMeshRendererProps> = ({
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
      {/* 1. Service Mesh Header Banner */}
      <div className="w-full min-w-0 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/60 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-purple-900 dark:text-purple-200">
            {language === 'vi' ? 'Lưới Dịch vụ Dùng chung (Enterprise Service Mesh)' : 'Enterprise Shared Service Mesh'}
          </h4>
          <p className="text-[11px] text-purple-700 dark:text-purple-400">
            {language === 'vi'
              ? 'Các module nền tảng cung cấp dịch vụ hạ tầng (Master Data, Config, Workflow, Ký số, Bảo mật) phục vụ toàn bộ các phân hệ trong hệ sinh thái.'
              : 'Shared platform components serving standard infrastructure capabilities across all business clusters.'}
          </p>
        </div>
      </div>

      {/* 2. Platform 9 Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
        {nodes.map((node) => {
          const Icon = getFlowIcon(node.iconName)
          const isNodeSelected = selectedNodeId === node.id

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode(node.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                isNodeSelected
                  ? 'border-purple-600 bg-white dark:bg-slate-900 ring-2 ring-purple-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isNodeSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                    {node.code}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {language === 'vi' ? node.label : node.labelEn}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {language === 'vi' ? node.description : node.descriptionEn}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 3. Service Interactions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
          <span>{language === 'vi' ? 'Các luồng điều phối dịch vụ nền tảng:' : 'Service Mesh Integrations:'}</span>
          <span className="text-[11px] font-normal text-slate-500">
            {language === 'vi' ? 'Chọn để xem chi tiết luồng dịch vụ' : 'Click to inspect service integration'}
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
                    ? 'border-purple-600 dark:border-purple-400 bg-purple-50/20 dark:bg-purple-950/40 ring-2 ring-purple-600/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-purple-700 dark:text-purple-400">
                    <span>{fromNode ? (language === 'vi' ? fromNode.label : fromNode.labelEn) : c.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                    <span>{c.dataItems.length} {language === 'vi' ? 'mục bàn giao' : 'payload items'}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
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
