import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { GitBranch, Layers, Sparkles } from 'lucide-react'

export type FlowHeaderNodeData = Record<string, unknown> & {
  code: string
  title: string
  definition?: string | null
  purpose?: string | null
  stepCount: number
  primaryModuleId?: string | null
}

export type SopFlowHeaderNode = Node<FlowHeaderNodeData, 'sopHeader'>

function SopFlowHeaderCardComponent({ data, selected }: NodeProps<SopFlowHeaderNode>) {
  return (
    <div
      role="region"
      aria-label={`Tổng quan SOP: ${data.code} - ${data.title}`}
      className={`group relative flex w-[min(76vw,860px)] min-w-[520px] max-w-[860px] items-start gap-3.5 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 dark:bg-slate-900 ${
        selected
          ? 'border-amber-500 ring-4 ring-amber-500/25 shadow-lg'
          : 'border-amber-400/80 bg-linear-to-r from-amber-50/50 via-white to-white hover:shadow-md dark:border-amber-600/70 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900'
      }`}
    >
      {/* Brand Icon Box */}
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
        <GitBranch className="size-6" />
      </div>

      {/* Overview Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-black text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {data.code || 'SOP'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="size-3" />
            Lưu đồ thực thi chuẩn
          </span>
        </div>

        <h3 className="mt-1 line-clamp-1 text-sm font-black text-slate-900 dark:text-white" title={data.title}>
          {data.title || 'Quy trình vận hành'}
        </h3>

        {data.purpose || data.definition ? (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {data.purpose || data.definition}
          </p>
        ) : (
          <p className="mt-1 line-clamp-1 text-xs text-slate-400 dark:text-slate-500">
            Quy trình chuẩn hóa các bước thực thi nghiệp vụ
          </p>
        )}

        {/* Stats Row */}
        <div className="mt-2.5 flex items-center gap-2 pt-2 text-[11px] font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
            <Layers className="size-3 text-slate-400" />
            {data.stepCount} bước tuần tự
          </span>
          {data.primaryModuleId && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Phân hệ: {data.primaryModuleId}
            </span>
          )}
        </div>
      </div>

      {/* Outgoing connector handle to first step */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-3.5 !border-2 !border-white !bg-amber-500 shadow-md dark:!border-slate-900"
        title="Bắt đầu từ quy trình này"
      />
    </div>
  )
}

export const SopFlowHeaderCard = memo(SopFlowHeaderCardComponent)
