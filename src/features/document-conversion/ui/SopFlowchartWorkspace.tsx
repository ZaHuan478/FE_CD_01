import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Background, BackgroundVariant, Controls, MarkerType, MiniMap, ReactFlow,
  addEdge, applyEdgeChanges, applyNodeChanges, reconnectEdge,
  type Connection, type Edge, type EdgeChange, type NodeChange, type NodeTypes
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowRight, CheckCircle2, GitBranch, LoaderCircle, RefreshCw, Trash2, TriangleAlert,
  Plus, Undo2, Redo2, Save, UserRound, Clock3, LayoutGrid, Image as ImageIcon,
  Sparkles, LayoutDashboard
} from 'lucide-react'
import { sopImportApi, type SopImportPreview, type SopImportStep } from '../model/documentConversionModel'
import { buildMermaidDefinition, defaultStepPosition } from '../model/mermaidFlow'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'
import { Select } from '../../../shared/ui/atoms/Select'
import { Panel, adminInputClass, primaryButtonClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { useToast } from '../../../shared/ui/toast'
import { MermaidDiagram } from '../../../shared/ui/diagrams/MermaidDiagram'
import { SopFlowNodeCard, type SopFlowNode } from './components/SopFlowNodeCard'
import { SopFlowHeaderCard, type SopFlowHeaderNode } from './components/SopFlowHeaderCard'
import {
  ILLUSTRATION_PRESETS,
  detectIllustrationPreset,
  renderPresetIllustration,
  type IllustrationPresetId
} from './components/sopIllustrations'

type CanvasNode = SopFlowNode | SopFlowHeaderNode
type SopFlowEdge = Edge<Record<string, unknown>>

const kindLabel: Record<SopImportStep['nodeKind'], string> = {
  start: 'Bắt đầu',
  task: 'Thao tác',
  decision: 'Điều kiện',
  parallel_fork: 'Tách nhánh',
  parallel_join: 'Nhập nhánh',
  subprocess: 'Quy trình con',
  end: 'Kết thúc'
}

const nodeTypes: NodeTypes = {
  sop: SopFlowNodeCard,
  sopHeader: SopFlowHeaderCard
}

function toNodes(preview: SopImportPreview, showHeader: boolean): CanvasNode[] {
  const result: CanvasNode[] = []

  if (showHeader && preview.title) {
    result.push({
      id: 'sop-root-header',
      type: 'sopHeader',
      position: { x: 72, y: 18 },
      selectable: false,
      draggable: false,
      data: {
        code: preview.code,
        title: preview.title,
        definition: preview.definition,
        purpose: preview.purpose,
        stepCount: preview.steps.length,
        primaryModuleId: preview.primaryModuleId
      }
    })
  }

  const stepNodes: SopFlowNode[] = [...preview.steps]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((step, index) => {
      const defaultPos = defaultStepPosition(index)
      const posX = typeof step.positionX === 'number' ? step.positionX : defaultPos.x
      const posY = typeof step.positionY === 'number' ? step.positionY : (showHeader ? defaultPos.y + 160 : defaultPos.y)

      return {
        id: step.id,
        type: 'sop',
        position: { x: posX, y: posY },
        data: {
          index: index + 1,
          code: step.code,
          title: step.title,
          actor: step.actor ?? '',
          description: step.description ?? '',
          location: step.location ?? '',
          timing: step.timing ?? '',
          typeCode: step.typeCode ?? '',
          kind: step.nodeKind,
          imageUrl: step.imageUrl ?? null,
          illustrationPreset: step.illustrationPreset ?? null,
          checklistCount: step.checklist?.length ?? 0,
          inputsCount: step.inputs?.length ?? 0,
          outputsCount: step.outputs?.length ?? 0,
          confidence: step.confidence,
          sourceRefs: step.sourceRefs
        }
      }
    })

  return [...result, ...stepNodes]
}

function toEdges(preview: SopImportPreview, showHeader: boolean): SopFlowEdge[] {
  const edges: SopFlowEdge[] = []
  const sortedSteps = [...preview.steps].sort((left, right) => left.sortOrder - right.sortOrder)

  if (showHeader && sortedSteps.length > 0) {
    edges.push({
      id: 'edge-header-to-start',
      source: 'sop-root-header',
      target: sortedSteps[0]!.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '6 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
    })
  }

  const stepEdges = preview.transitions.flatMap((transition, index) => {
    if (!transition.fromStepId || !transition.toStepId) return []
    const isReturn = transition.kind === 'return'
    const isDecision = transition.kind === 'conditional'
    const strokeColor = isReturn ? '#ef4444' : isDecision ? '#f59e0b' : '#0284c7'

    return [{
      id: transition.id ?? `transition-${index + 1}`,
      source: transition.fromStepId,
      target: transition.toStepId,
      label: transition.branchLabel || transition.condition || undefined,
      type: 'smoothstep',
      animated: isReturn,
      markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
      style: {
        stroke: strokeColor,
        strokeWidth: 2,
        strokeDasharray: '6 4'
      },
      data: { transitionIndex: index }
    }]
  })

  return [...edges, ...stepEdges]
}

export function SopFlowchartWorkspace({ importId, preview, editable, onPreview, onSave, saving }: {
  onSave: () => Promise<void>
  saving: boolean
  importId: string
  preview: SopImportPreview
  editable: boolean
  onPreview: (preview: SopImportPreview) => void
}) {
  const toast = useToast()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [past, setPast] = useState<SopImportPreview[]>([])
  const [future, setFuture] = useState<SopImportPreview[]>([])
  const [showHeader, setShowHeader] = useState(true)

  const commit = useCallback((next: SopImportPreview) => {
    if (!editable) return
    setPast(items => [...items.slice(-49), preview])
    setFuture([])
    onPreview(next)
  }, [editable, onPreview, preview])

  const selectedNode = preview.steps.find(step => step.id === selectedNodeId)
  const patchNode = (patch: Partial<SopImportStep>) => commit({
    ...preview,
    steps: preview.steps.map(step => step.id === selectedNodeId ? { ...step, ...patch } : step)
  })

  const addNode = () => {
    const id = crypto.randomUUID()
    const defaultPos = defaultStepPosition(preview.steps.length)
    commit({
      ...preview,
      steps: [
        ...preview.steps,
        {
          id,
          stableKey: id,
          code: `B-${id.slice(0, 8)}`,
          title: 'Bước mới',
          nodeKind: 'task',
          sortOrder: preview.steps.length + 1,
          positionX: defaultPos.x,
          positionY: showHeader ? defaultPos.y + 160 : defaultPos.y
        }
      ]
    })
    setSelectedNodeId(id)
    setMode('canvas')
  }

  const removeNode = () => {
    if (!selectedNode) return
    const related = preview.transitions.filter(edge => edge.fromStepId === selectedNode.id || edge.toStepId === selectedNode.id).length
    if (!window.confirm(`Xóa bước “${selectedNode.title}” và ${related} đường nối liên quan?`)) return
    commit({
      ...preview,
      steps: preview.steps.filter(step => step.id !== selectedNode.id).map((step, index) => ({ ...step, sortOrder: index + 1 })),
      transitions: preview.transitions.filter(edge => edge.fromStepId !== selectedNode.id && edge.toStepId !== selectedNode.id)
    })
    setSelectedNodeId(null)
  }

  const undo = () => {
    const previous = past.at(-1)
    if (!previous || !editable) return
    setPast(past.slice(0, -1))
    setFuture([...future, preview])
    onPreview(previous)
  }

  const redo = () => {
    const next = future.at(-1)
    if (!next || !editable) return
    setFuture(future.slice(0, -1))
    setPast([...past, preview])
    onPreview(next)
  }

  // Canvas is the primary editing surface. Mermaid remains available as a
  // secondary representation from the tabs above the workspace.
  const [mode, setMode] = useState<'canvas' | 'mermaid'>('canvas')
  const [nodes, setNodes] = useState<CanvasNode[]>(() => toNodes(preview, showHeader))
  const [edges, setEdges] = useState<SopFlowEdge[]>(() => toEdges(preview, showHeader))
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [issues, setIssues] = useState<Array<{ severity: 'error' | 'warning'; code: string; message: string }>>([])
  const mermaidDefinition = useMemo(() => buildMermaidDefinition(preview), [preview])

  useEffect(() => {
    setNodes(toNodes(preview, showHeader))
    setSelectedNodeId(current => preview.steps.some(step => step.id === current) ? current : preview.steps[0]?.id ?? null)
  }, [preview, showHeader])

  useEffect(() => {
    setEdges(toEdges(preview, showHeader))
  }, [preview, showHeader])

  const updateTransitions = useCallback((nextEdges: SopFlowEdge[]) => {
    const previousById = new Map(preview.transitions.map((transition, index) => [transition.id ?? `transition-${index + 1}`, transition]))
    const realEdges = nextEdges.filter(edge => edge.source !== 'sop-root-header')
    commit({
      ...preview,
      transitions: realEdges.map((edge, index) => {
        const previous = previousById.get(edge.id)
        return {
          id: edge.id,
          fromStepId: edge.source,
          toStepId: edge.target,
          kind: previous?.kind ?? 'normal',
          condition: previous?.condition ?? null,
          branchLabel: typeof edge.label === 'string' ? edge.label : previous?.branchLabel ?? null,
          targetSopId: previous?.targetSopId ?? null,
          sortOrder: index + 1
        }
      })
    })
  }, [commit, preview])

  const onNodesChange = useCallback((changes: NodeChange<CanvasNode>[]) => {
    setNodes(current => applyNodeChanges(changes, current))
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange<SopFlowEdge>[]) => {
    setEdges(current => applyEdgeChanges(changes, current))
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    if (!editable || !connection.source || !connection.target) return
    const edge: SopFlowEdge = {
      ...connection,
      id: `conversion-transition-${Date.now()}`,
      label: '',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      style: { stroke: '#0284c7', strokeWidth: 2, strokeDasharray: '6 4' }
    }
    const next = addEdge(edge, edges)
    setEdges(next)
    updateTransitions(next)
  }, [edges, editable, updateTransitions])

  const onReconnect = useCallback((oldEdge: SopFlowEdge, connection: Connection) => {
    if (!editable) return
    const next = reconnectEdge(oldEdge, connection, edges)
    setEdges(next)
    updateTransitions(next)
  }, [edges, editable, updateTransitions])

  const deleteEdges = useCallback((deleted: SopFlowEdge[]) => {
    if (!editable) return
    const deletedIds = new Set(deleted.map(edge => edge.id))
    const next = edges.filter(edge => !deletedIds.has(edge.id))
    setEdges(next)
    setSelectedEdgeId(null)
    updateTransitions(next)
  }, [edges, editable, updateTransitions])

  const selectedEdge = edges.find(edge => edge.id === selectedEdgeId) ?? null
  const selectedTransitionIndex = selectedEdge
    ? preview.transitions.findIndex((transition, index) => (transition.id ?? `transition-${index + 1}`) === selectedEdge.id)
    : -1

  const updateSelectedTransition = (patch: Partial<SopImportPreview['transitions'][number]>) => {
    if (selectedTransitionIndex < 0) return
    const transitions = preview.transitions.map((transition, index) => index === selectedTransitionIndex ? { ...transition, ...patch } : transition)
    commit({ ...preview, transitions })
  }

  const autoLayout = () => {
    const steps = [...preview.steps].sort((left, right) => left.sortOrder - right.sortOrder)
      .map((step, index) => {
        const pos = defaultStepPosition(index)
        return {
          ...step,
          positionX: pos.x,
          positionY: showHeader ? pos.y + 160 : pos.y
        }
      })
    commit({ ...preview, steps })
    toast.success('Đã sắp xếp lại các thẻ quy trình trên Canvas.')
  }

  const validate = async () => {
    setChecking(true)
    try {
      const result = await sopImportApi.validateFlow(importId, preview)
      setIssues(result.data.validation.issues)
      if (result.data.validation.valid) toast.success('Lưu đồ không có lỗi cấu trúc.')
      else toast.error('Lưu đồ còn lỗi cấu trúc cần sửa.')
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không kiểm tra được lưu đồ'))
    } finally { setChecking(false) }
  }

  const inspectorPreset = selectedNode ? detectIllustrationPreset({
    title: selectedNode.title,
    nodeKind: selectedNode.nodeKind,
    typeCode: selectedNode.typeCode,
    actor: selectedNode.actor,
    description: selectedNode.description,
    illustrationPreset: selectedNode.illustrationPreset
  }) : 'operations'

  return (
    <div className="space-y-4">
      <Panel title="Lưu đồ SOP" description="Sơ đồ được tạo từ các bước, vai trò và đường nối trong tài liệu; bạn có thể xem hoặc hiệu chỉnh trực tiếp.">
        {/* The sequence strip is useful for the Mermaid/read-only view, while
            the Canvas view already presents every step as an editable card. */}
        {mode === 'mermaid' && <section className="border-b border-slate-200 bg-white px-4 pb-4 pt-1 dark:border-slate-800 dark:bg-slate-900" aria-label="Các bước quy trình">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 pt-2 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <GitBranch className="size-4 text-[#1f5f86] dark:text-sky-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white sm:text-sm">Lưu đồ quy trình thực thi chuẩn</h3>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">({preview.steps.length} bước tuần tự)</span>
            </div>
            <span className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:inline">Bấm vào bước để nhảy đến thẻ trên Canvas</span>
          </div>
          <div className="relative overflow-x-auto pb-2 pt-3">
            <div className="flex min-w-max items-stretch gap-3 px-1">
              {[...preview.steps].sort((left, right) => left.sortOrder - right.sortOrder).map((step, index, sortedSteps) => {
                const isSelected = selectedNodeId === step.id
                const badge = step.typeCode || (step.nodeKind === 'decision' ? 'C' : step.nodeKind === 'start' || step.nodeKind === 'end' ? 'A' : 'N')
                const badgeClass = badge === 'M'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                  : badge === 'C'
                    ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300'
                    : badge === 'A'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300'
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setSelectedNodeId(step.id); setMode('canvas') }}
                      className={`flex min-h-[112px] w-[240px] shrink-0 flex-col justify-between rounded-xl border p-3.5 text-left shadow-xs transition-all duration-200 sm:w-[260px] ${isSelected ? '-translate-y-0.5 border-[#1f5f86] bg-[#1f5f86] text-white ring-2 ring-blue-300 shadow-md' : 'border-slate-200/90 bg-slate-50 text-slate-900 hover:border-blue-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80'}`}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-black ${isSelected ? 'border-white/30 bg-white/20 text-white' : 'border-slate-300 bg-slate-200/80 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>#{index + 1}</span>
                          <span className={`truncate rounded border px-1.5 py-0.5 font-mono text-[10px] font-black ${isSelected ? 'border-white/30 bg-white/20 text-white' : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-sky-300'}`}>{step.code}</span>
                        </span>
                        <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold ${isSelected ? 'border-white/30 bg-white/20 text-white' : badgeClass}`}>[{badge}]</span>
                      </span>
                      <strong className={`mt-2 line-clamp-2 text-xs leading-snug ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{step.title || kindLabel[step.nodeKind]}</strong>
                      <span className={`mt-2 flex w-full items-center justify-between gap-2 border-t pt-2 text-[10px] ${isSelected ? 'border-blue-400/60 text-blue-50' : 'border-slate-200/60 text-slate-500 dark:border-slate-800 dark:text-slate-400'}`}>
                        <span className="flex min-w-0 max-w-[150px] items-center gap-1 truncate font-bold"><UserRound className="size-3 shrink-0" /><span className="truncate">{step.actor || 'Người thực hiện'}</span></span>
                        {step.timing && <span className="flex shrink-0 items-center gap-0.5"><Clock3 className="size-2.5 shrink-0" /><span>{step.timing.split(' ')[0]}</span></span>}
                      </span>
                    </button>
                    {index < sortedSteps.length - 1 && <ArrowRight className="size-4 shrink-0 text-slate-300 dark:text-slate-700" aria-hidden="true" />}
                  </div>
                )
              })}
            </div>
          </div>
        </section>}

        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mr-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" role="tablist" aria-label="Chế độ lưu đồ">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'mermaid'}
              onClick={() => setMode('mermaid')}
              className={mode === 'mermaid' ? primaryButtonClass : secondaryButtonClass}
            >
              <GitBranch className="size-4" />
              Lưu đồ Mermaid
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'canvas'}
              onClick={() => setMode('canvas')}
              className={mode === 'canvas' ? primaryButtonClass : secondaryButtonClass}
            >
              <LayoutGrid className="size-4" />
              {editable ? 'Canvas đồ họa (Sửa)' : 'Canvas đồ họa'}
            </button>
          </div>

          {mode === 'canvas' && (
            <button
              type="button"
              onClick={() => setShowHeader(val => !val)}
              className={`${secondaryButtonClass} text-xs`}
              title="Bật/tắt thẻ tổng quan SOP trên Canvas"
            >
              <LayoutDashboard className="size-3.5" />
              {showHeader ? 'Ẩn tổng quan' : 'Hiện tổng quan'}
            </button>
          )}

          <div className="ml-auto flex flex-wrap gap-2">
            {editable && mode === 'canvas' && (
              <>
                <button type="button" onClick={addNode} className={secondaryButtonClass}>
                  <Plus className="size-4" />
                  Thêm bước
                </button>
                <button type="button" disabled={!past.length} onClick={undo} aria-label="Hoàn tác" title="Hoàn tác thay đổi" className={secondaryButtonClass}>
                  <Undo2 className="size-4" />
                </button>
                <button type="button" disabled={!future.length} onClick={redo} aria-label="Làm lại" title="Làm lại thay đổi" className={secondaryButtonClass}>
                  <Redo2 className="size-4" />
                </button>
                <button type="button" disabled={saving} onClick={() => void onSave()} className={primaryButtonClass}>
                  <Save className="size-4" />
                  {saving ? 'Đang lưu…' : 'Lưu bản nháp'}
                </button>
              </>
            )}

            {editable && mode === 'canvas' && (
              <button type="button" onClick={autoLayout} title="Tự động sắp xếp các thẻ theo hàng và lưới" className={secondaryButtonClass}>
                <RefreshCw className="size-4" />
                Tự sắp xếp
              </button>
            )}
            {editable && importId && <button type="button" disabled={checking} onClick={() => void validate()} className={secondaryButtonClass}>
              {checking ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Kiểm tra
            </button>}
          </div>
        </div>

        {/* Workspace Body: Mermaid vs Canvas */}
        {mode === 'mermaid' ? (
          <MermaidDiagram
            definition={mermaidDefinition}
            fileName={`${preview.code || 'sop'}.mmd`}
            title={preview.code ? `${preview.code}: ${preview.title || 'Lưu đồ'}` : 'Lưu đồ SOP'}
            stepCount={preview.steps.length}
            initialDirection="LR"
            className="border-0 rounded-none shadow-none"
          />
        ) : (
          <div className="bg-slate-50/40 dark:bg-slate-950/20">
            <div className="border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
                    <LayoutGrid className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-100">
                      Canvas quy trình trực quan
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {editable
                        ? 'Kéo thẻ để sắp xếp · Kéo cổng nối để tạo luồng · Chọn thẻ để sửa thuộc tính'
                        : 'Kéo vùng trống để xem toàn cảnh · Chọn thẻ để xem thông tin chi tiết'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 sm:inline dark:border-slate-700 dark:bg-slate-950">Lưới tự do</span>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 font-bold text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300">
                    {preview.steps.length} bước · {edges.length} đường nối
                  </span>
                </div>
              </div>
            </div>

            <div className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_340px]">
              {/* React Flow Canvas */}
              <div className="h-[720px] min-h-[560px] border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" aria-label="Trình chỉnh sửa lưu đồ SOP">
                <ReactFlow<CanvasNode, SopFlowEdge>
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onReconnect={onReconnect}
                  onEdgesDelete={deleteEdges}
                  onNodeClick={(_, node) => {
                    if (node.id !== 'sop-root-header') {
                      setSelectedNodeId(node.id)
                      setSelectedEdgeId(null)
                    }
                  }}
                  onEdgeClick={(_, edge) => {
                    setSelectedEdgeId(edge.id)
                    setSelectedNodeId(null)
                  }}
                  onPaneClick={() => setSelectedEdgeId(null)}
                  onNodeDragStop={(_, node) => {
                    if (!editable || node.id === 'sop-root-header') return
                    commit({
                      ...preview,
                      steps: preview.steps.map(step => step.id === node.id ? { ...step, positionX: node.position.x, positionY: node.position.y } : step)
                    })
                  }}
                  nodesDraggable={editable}
                  nodesConnectable={editable}
                  edgesReconnectable={editable}
                  elementsSelectable
                  deleteKeyCode={null}
                  fitView
                  fitViewOptions={{ padding: 0.16 }}
                  minZoom={0.2}
                  maxZoom={1.8}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#94a3b8" className="opacity-30" />
                  <MiniMap
                    pannable
                    zoomable
                    nodeColor={node => {
                      if (node.id === 'sop-root-header') return '#f59e0b'
                      const kind = (node.data as { kind?: string }).kind
                      return kind === 'decision'
                        ? '#f59e0b'
                        : kind === 'start' || kind === 'end'
                          ? '#10b981'
                          : kind === 'subprocess'
                            ? '#8b5cf6'
                            : '#0284c7'
                    }}
                    className="!bottom-4 !right-4 !m-0 !rounded-2xl !border !border-slate-200 !bg-white !shadow-lg dark:!border-slate-700 dark:!bg-slate-900"
                  />
                  <Controls
                    showInteractive={false}
                    position="bottom-left"
                    className="!bottom-4 !left-4 !m-0 !overflow-hidden !rounded-2xl !border !border-slate-200 !bg-white !shadow-lg dark:!border-slate-700 dark:!bg-slate-900"
                  />
                </ReactFlow>
              </div>

              {/* Inspector Aside Panel ("Thuộc tính bước") */}
              <aside className="max-h-[720px] space-y-4 overflow-y-auto bg-white p-4 dark:bg-slate-900" aria-label="Thuộc tính bước">
                <div className="sticky top-0 z-10 -mx-4 -mt-4 flex items-center justify-between border-b border-slate-200 bg-white px-4 pb-3 pt-4 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {selectedNode ? `Thuộc tính bước: ${selectedNode.code}` : 'Chọn một bước để xem'}
                  </h3>
                  {selectedNode && (
                    <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      #{preview.steps.findIndex(s => s.id === selectedNode.id) + 1}
                    </span>
                  )}
                </div>

                {!selectedNode ? (
                  <div className="space-y-2 py-8 text-center text-slate-400">
                    <Sparkles className="mx-auto size-8 opacity-40" />
                    <p className="text-xs">Bấm vào bất kỳ thẻ bước nào trên Canvas để chỉnh sửa tiêu đề, người thực hiện, minh họa và mô tả.</p>
                  </div>
                ) : (
                  <fieldset disabled={!editable} className="space-y-3.5">
                    {/* Visual Banner Preview & Controls */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-950/60">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
                          <ImageIcon className="size-3.5 text-sky-500" />
                          Ảnh bìa / Minh họa thẻ
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {selectedNode.imageUrl ? 'URL riêng' : 'Vector chủ đề'}
                        </span>
                      </div>

                      {/* Mini Live Banner Preview */}
                      <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                        {selectedNode.imageUrl ? (
                          <img src={selectedNode.imageUrl} alt="Preview" className="size-full object-cover" />
                        ) : (
                          renderPresetIllustration(inspectorPreset)
                        )}
                      </div>

                      {/* Preset Selector */}
                      <label className="mt-2.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Chủ đề minh họa vector</span>
                        <Select
                          className={adminInputClass}
                          value={selectedNode.illustrationPreset || 'auto'}
                          onChange={event => patchNode({ illustrationPreset: event.target.value as IllustrationPresetId })}
                        >
                          {ILLUSTRATION_PRESETS.map(preset => (
                            <option key={preset.id} value={preset.id}>{preset.label}</option>
                          ))}
                        </Select>
                      </label>

                      {/* Custom Image URL input */}
                      <label className="mt-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Hoặc dán URL hình ảnh riêng</span>
                        <input
                          type="url"
                          placeholder="https://... (ảnh đại diện)"
                          className={adminInputClass}
                          value={selectedNode.imageUrl ?? ''}
                          onChange={event => patchNode({ imageUrl: event.target.value.trim() ? event.target.value : null })}
                        />
                      </label>
                    </div>

                    {(typeof selectedNode.confidence === 'number' || selectedNode.sourceRefs?.length) && (
                      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 text-xs dark:border-sky-900 dark:bg-sky-950/30">
                        {typeof selectedNode.confidence === 'number' && (
                          <p className="font-bold text-sky-900 dark:text-sky-200">Độ tin cậy trích xuất: {Math.round(selectedNode.confidence * 100)}%</p>
                        )}
                        {selectedNode.sourceRefs?.[0] && (
                          <details className="mt-2">
                            <summary className="cursor-pointer font-bold text-sky-800 dark:text-sky-300">Đối chiếu nội dung nguồn</summary>
                            <blockquote className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap border-l-2 border-sky-300 pl-2 text-sky-900/80 dark:border-sky-700 dark:text-sky-200/80">
                              {selectedNode.sourceRefs[0].text}
                            </blockquote>
                          </details>
                        )}
                      </div>
                    )}

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Tên bước</span>
                      <input
                        maxLength={500}
                        className={adminInputClass}
                        value={selectedNode.title}
                        onChange={event => patchNode({ title: event.target.value })}
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Loại bước quy trình</span>
                      <Select
                        className={adminInputClass}
                        value={selectedNode.nodeKind}
                        onChange={event => patchNode({ nodeKind: event.target.value as SopImportStep['nodeKind'] })}
                      >
                        {Object.entries(kindLabel).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </Select>
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Vai trò thực hiện (Actor)</span>
                      <input
                        className={adminInputClass}
                        value={selectedNode.actor ?? ''}
                        placeholder="Ví dụ: Nhân viên nhân sự, Trưởng phòng..."
                        onChange={event => patchNode({ actor: event.target.value })}
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Thời gian thực hiện (SLA / Timing)</span>
                      <input
                        className={adminInputClass}
                        value={selectedNode.timing ?? ''}
                        placeholder="Ví dụ: 30 phút, 1 ngày làm việc..."
                        onChange={event => patchNode({ timing: event.target.value })}
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Mô tả chi tiết công việc</span>
                      <textarea
                        rows={3}
                        className={adminInputClass}
                        value={selectedNode.description ?? ''}
                        placeholder="Tóm tắt những việc cần làm tại bước này..."
                        onChange={event => patchNode({ description: event.target.value })}
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Đầu vào (mỗi dòng một mục)</span>
                      <textarea
                        rows={2}
                        className={adminInputClass}
                        value={(selectedNode.inputs ?? []).map(item => item.name).join('\n')}
                        onChange={event => patchNode({ inputs: event.target.value.split('\n').filter(Boolean).map((name, index) => ({ ...selectedNode.inputs?.[index], name })) })}
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Đầu ra (mỗi dòng một mục)</span>
                      <textarea
                        rows={2}
                        className={adminInputClass}
                        value={(selectedNode.outputs ?? []).map(item => item.name).join('\n')}
                        onChange={event => patchNode({ outputs: event.target.value.split('\n').filter(Boolean).map((name, index) => ({ ...selectedNode.outputs?.[index], name })) })}
                      />
                    </label>

                    {editable && (
                      <button
                        type="button"
                        onClick={removeNode}
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                      >
                        <Trash2 className="size-4" />
                        Xóa bước này
                      </button>
                    )}
                  </fieldset>
                )}
              </aside>
            </div>

            {/* Edge Condition Editor */}
            {editable && selectedEdge && selectedTransitionIndex >= 0 && (
              <div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-[1fr_220px_auto] md:items-end dark:border-slate-800">
                <label className="space-y-1 text-xs font-bold">
                  <span>Nhãn nhánh / Điều kiện rẽ</span>
                  <input
                    value={preview.transitions[selectedTransitionIndex]?.branchLabel ?? ''}
                    onChange={event => updateSelectedTransition({ branchLabel: event.target.value })}
                    placeholder="Ví dụ: Đạt / Không đạt, Có / Không"
                    className={adminInputClass}
                  />
                </label>
                <label className="space-y-1 text-xs font-bold">
                  <span>Loại đường nối</span>
                  <Select
                    value={preview.transitions[selectedTransitionIndex]?.kind ?? 'normal'}
                    onChange={event => updateSelectedTransition({ kind: event.target.value as SopImportPreview['transitions'][number]['kind'] })}
                    className={adminInputClass}
                  >
                    <option value="normal">Tuần tự</option>
                    <option value="conditional">Điều kiện (Rẽ nhánh)</option>
                    <option value="return">Quay lại (Vòng lặp)</option>
                    <option value="parallel_fork">Tách song song</option>
                    <option value="parallel_join">Nhập song song</option>
                    <option value="subprocess">Quy trình con</option>
                  </Select>
                </label>
                <button
                  type="button"
                  onClick={() => deleteEdges([selectedEdge])}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300"
                >
                  <Trash2 className="size-4" />
                  Xóa nối
                </button>
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* Validation Issues Alert */}
      {!!issues.length && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="font-black text-amber-950 dark:text-amber-100">Kết quả kiểm tra lưu đồ</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900 dark:text-amber-200">
                {issues.map((issue, index) => (
                  <li key={`${issue.code}-${index}`}>{issue.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
