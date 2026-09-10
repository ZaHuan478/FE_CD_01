import { memo, useEffect, useState } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { UserRound, Clock3, CirclePlay, CircleStop, GitFork, GitBranch, ListChecks, CheckSquare2 } from 'lucide-react'
import type { SopImportStep } from '../../model/documentConversionModel'
import { detectIllustrationPreset, renderPresetIllustration } from './sopIllustrations'

export type FlowNodeData = Record<string, unknown> & {
  index: number
  code: string
  title: string
  actor: string
  description: string
  location: string
  timing: string
  typeCode: string
  kind: SopImportStep['nodeKind']
  imageUrl?: string | null
  illustrationPreset?: string | null
  checklistCount?: number
  inputsCount?: number
  outputsCount?: number
  confidence?: number
  sourceRefs?: Array<{ lineStart?: number; lineEnd?: number; page?: number; text: string }>
}

export type SopFlowNode = Node<FlowNodeData, 'sop'>

const kindLabels: Record<SopImportStep['nodeKind'], string> = {
  start: 'Bắt đầu',
  task: 'Thao tác',
  decision: 'Điều kiện',
  parallel_fork: 'Tách nhánh',
  parallel_join: 'Nhập nhánh',
  subprocess: 'Quy trình con',
  end: 'Kết thúc'
}

function SopFlowNodeCardComponent({ data, selected }: NodeProps<SopFlowNode>) {
  const isStart = data.kind === 'start'
  const isEnd = data.kind === 'end'
  const isDecision = data.kind === 'decision'
  const isSubprocess = data.kind === 'subprocess'
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => setImageFailed(false), [data.imageUrl])

  const preset = detectIllustrationPreset({
    title: data.title,
    nodeKind: data.kind,
    typeCode: data.typeCode,
    actor: data.actor,
    description: data.description,
    illustrationPreset: data.illustrationPreset
  })

  const kindBadgeClass = isDecision
    ? 'border-amber-400/40 bg-amber-500/90 text-white'
    : isStart || isEnd
      ? 'border-emerald-400/40 bg-emerald-600/90 text-white'
      : isSubprocess
        ? 'border-violet-400/40 bg-violet-600/90 text-white'
        : 'border-sky-400/40 bg-sky-600/90 text-white'

  const kindIcon = isStart ? (
    <CirclePlay className="size-3.5 text-emerald-500" />
  ) : isEnd ? (
    <CircleStop className="size-3.5 text-rose-500" />
  ) : isDecision ? (
    <GitFork className="size-3.5 text-amber-500" />
  ) : isSubprocess ? (
    <GitBranch className="size-3.5 text-violet-500" />
  ) : (
    <ListChecks className="size-3.5 text-sky-500" />
  )

  const cardBorder = selected
    ? 'border-cyan-500 dark:border-cyan-400 ring-4 ring-cyan-500/25 shadow-xl -translate-y-1'
    : isDecision
      ? 'border-amber-300/80 dark:border-amber-700/80 hover:border-amber-400 shadow-xs hover:shadow-md'
      : isStart || isEnd
        ? 'border-emerald-300/80 dark:border-emerald-700/80 hover:border-emerald-400 shadow-xs hover:shadow-md'
        : isSubprocess
          ? 'border-violet-300/80 dark:border-violet-700/80 hover:border-violet-400 shadow-xs hover:shadow-md'
          : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs hover:shadow-md'

  return (
    <div
      role="group"
      aria-label={`${kindLabels[data.kind]} ${data.code}: ${data.title}`}
      className={`group relative w-[230px] overflow-hidden rounded-2xl bg-white transition-all duration-200 dark:bg-slate-900 ${cardBorder}`}
    >
      {/* Target Handle (Left) */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="!size-3.5 !border-2 !border-white !bg-slate-600 shadow-md transition-transform group-hover:scale-125 dark:!border-slate-900 dark:!bg-sky-400"
          title="Điểm kết nối đến bước này"
        />
      )}

      {/* Top Banner Image or Thematic SVG Vector Illustration */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {data.imageUrl && !imageFailed ? (
          <img
            src={data.imageUrl}
            alt={data.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              // Use the thematic SVG when a remote image is unavailable.
              setImageFailed(true)
            }}
          />
        ) : (
          renderPresetIllustration(preset)
        )}

        {/* Top-Left Glassmorphic Step Code Badge */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-lg border border-white/20 bg-slate-950/60 px-2 py-0.5 text-[11px] font-black text-white shadow-sm backdrop-blur-md">
          <span className="text-cyan-300">#{data.index}</span>
          <span className="text-white/40">·</span>
          <span className="font-mono">{data.code}</span>
        </div>

        {/* Top-Right Node Kind / TypeCode Badge */}
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
          {data.typeCode && (
            <span
              className="rounded-md border border-white/20 bg-slate-950/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs backdrop-blur-md"
              title={`Mã phân loại: ${data.typeCode}`}
            >
              [{data.typeCode}]
            </span>
          )}
          <span
            className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-xs backdrop-blur-md ${kindBadgeClass}`}
          >
            {kindLabels[data.kind]}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3">
        {/* Title */}
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0">{kindIcon}</span>
          <h4
            className="line-clamp-2 text-[12px] font-black leading-snug text-slate-900 group-hover:text-[#1f5f86] dark:text-slate-100 dark:group-hover:text-sky-400"
            title={data.title}
          >
            {data.title}
          </h4>
        </div>

        {/* Description snippet */}
        {data.description ? (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {data.description}
          </p>
        ) : (
          <p className="mt-1.5 line-clamp-1 text-[11px] italic text-slate-400 dark:text-slate-500">
            Chưa có mô tả chi tiết
          </p>
        )}

        {/* Footer Metadata */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[10px] font-semibold dark:border-slate-800">
          <span
            className="flex min-w-0 max-w-[170px] items-center gap-1 truncate text-slate-600 dark:text-slate-300"
            title={`Người thực hiện: ${data.actor || data.location || 'Chưa gán'}`}
          >
            <UserRound className="size-3 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{data.actor || data.location || 'Người thực hiện'}</span>
          </span>

          <div className="flex shrink-0 items-center gap-2">
            {(data.checklistCount ?? 0) > 0 && (
              <span
                className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400"
                title={`${data.checklistCount} mục kiểm tra`}
              >
                <CheckSquare2 className="size-2.5" />
                <span>{data.checklistCount}</span>
              </span>
            )}
            {data.timing ? (
              <span
                className="flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                title={`Thời gian thực thi: ${data.timing}`}
              >
                <Clock3 className="size-2.5 shrink-0 text-slate-400" />
                <span>{data.timing.split(' ')[0]}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Source Handle (Right) */}
      {!isEnd && (
        <Handle
          type="source"
          position={Position.Right}
          className="!size-3.5 !border-2 !border-white !bg-[#1f5f86] shadow-md transition-transform group-hover:scale-125 dark:!border-slate-900 dark:!bg-sky-500"
          title="Kéo từ đây để kết nối đến bước tiếp theo"
        />
      )}
    </div>
  )
}

export const SopFlowNodeCard = memo(SopFlowNodeCardComponent)
