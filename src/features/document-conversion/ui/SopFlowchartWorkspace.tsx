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
  Sparkles, LayoutDashboard, ArrowUp, ArrowDown, Star, Crop
} from 'lucide-react'
import {
  sopImportApi, type SopImportPreview, type SopImportStep,
  type SourceMedia, type StepMedia, type StepMediaRole
} from '../model/documentConversionModel'
import { MediaLightbox } from './components/MediaLightbox'
import { PdfCropModal } from './components/PdfCropModal'
import { SourceMediaPickerModal } from './components/SourceMediaPickerModal'
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
          media: step.media ?? [],
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [lightboxMedia, setLightboxMedia] = useState<SourceMedia | null>(null)

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

  const handleAddMediaFromSource = (sourceMedia: SourceMedia, role: StepMediaRole, caption: string) => {
    if (!selectedNode) return
    const currentMedia = selectedNode.media ?? []
    const newStepMedia: StepMedia = {
      id: `sm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sourceMediaId: sourceMedia.id,
      storageKey: sourceMedia.storageKey,
      url: sourceMedia.previewUrl,
      caption: caption || sourceMedia.caption,
      role,
      sourcePage: sourceMedia.page,
      sourceSubPath: sourceMedia.subPath,
      sortOrder: currentMedia.length + 1,
      confidence: sourceMedia.confidence
    }
    const updatedMedia = role === 'cover'
      ? [
          ...currentMedia.map(item => item.role === 'cover' ? { ...item, role: 'illustration' as StepMediaRole } : item),
          newStepMedia
        ]
      : [...currentMedia, newStepMedia]

    const updatedSourceMedia = (preview.sourceStructure?.media ?? []).map(item =>
      item.id === sourceMedia.id ? { ...item, assignmentStatus: 'assigned' as const } : item
    )

    commit({
      ...preview,
      sourceStructure: preview.sourceStructure
        ? { ...preview.sourceStructure, media: updatedSourceMedia }
        : preview.sourceStructure,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId
          ? {
              ...step,
              media: updatedMedia,
              imageUrl: role === 'cover' ? (newStepMedia.url ?? step.imageUrl) : step.imageUrl
            }
          : step
      )
    })
    toast.success(`Đã gắn ảnh vào bước "${selectedNode.title}".`)
  }

  const handleCropSuccess = (croppedMedia: SourceMedia, stepMedia: StepMedia) => {
    if (!selectedNode) return
    const currentMedia = selectedNode.media ?? []
    const updatedMedia = stepMedia.role === 'cover'
      ? [
          ...currentMedia.map(item => item.role === 'cover' ? { ...item, role: 'illustration' as StepMediaRole } : item),
          stepMedia
        ]
      : [...currentMedia, stepMedia]

    const existingSourceMedia = preview.sourceStructure?.media ?? []
    commit({
      ...preview,
      sourceStructure: preview.sourceStructure
        ? { ...preview.sourceStructure, media: [...existingSourceMedia, croppedMedia] }
        : preview.sourceStructure,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId
          ? {
              ...step,
              media: updatedMedia,
              imageUrl: stepMedia.role === 'cover' ? (stepMedia.url ?? step.imageUrl) : step.imageUrl
            }
          : step
      )
    })
    toast.success(`Đã cắt ảnh từ PDF và gắn vào bước "${selectedNode.title}".`)
  }

  const handleSetAsCover = (mediaId: string) => {
    if (!selectedNode) return
    const currentMedia = selectedNode.media ?? []
    const target = currentMedia.find(m => m.id === mediaId)
    if (!target) return

    const updatedMedia = currentMedia.map(m => ({
      ...m,
      role: m.id === mediaId ? ('cover' as StepMediaRole) : (m.role === 'cover' ? ('illustration' as StepMediaRole) : m.role)
    }))

    commit({
      ...preview,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId
          ? { ...step, media: updatedMedia, imageUrl: target.url ?? step.imageUrl }
          : step
      )
    })
    toast.success('Đã đặt làm ảnh bìa của bước.')
  }

  const handleRemoveMedia = (mediaId: string) => {
    if (!selectedNode) return
    const currentMedia = selectedNode.media ?? []
    const target = currentMedia.find(m => m.id === mediaId)
    const updatedMedia = currentMedia.filter(m => m.id !== mediaId)

    let updatedSourceMedia = preview.sourceStructure?.media
    if (target?.sourceMediaId && updatedSourceMedia) {
      const isUsedElsewhere = preview.steps.some(step =>
        step.id !== selectedNodeId && step.media?.some(m => m.sourceMediaId === target.sourceMediaId)
      )
      if (!isUsedElsewhere) {
        updatedSourceMedia = updatedSourceMedia.map(sm =>
          sm.id === target.sourceMediaId ? { ...sm, assignmentStatus: 'unassigned' as const } : sm
        )
      }
    }

    commit({
      ...preview,
      sourceStructure: preview.sourceStructure && updatedSourceMedia
        ? { ...preview.sourceStructure, media: updatedSourceMedia }
        : preview.sourceStructure,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId
          ? {
              ...step,
              media: updatedMedia,
              imageUrl: target?.role === 'cover' ? null : step.imageUrl
            }
          : step
      )
    })
    toast.success('Đã gỡ ảnh khỏi bước.')
  }

  const handleUpdateStepMedia = (mediaId: string, patch: Partial<StepMedia>) => {
    if (!selectedNode) return
    const currentMedia = selectedNode.media ?? []
    const updatedMedia = currentMedia.map(m => m.id === mediaId ? { ...m, ...patch } : m)
    commit({
      ...preview,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId ? { ...step, media: updatedMedia } : step
      )
    })
  }

  const handleMoveStepMedia = (index: number, direction: -1 | 1) => {
    if (!selectedNode) return
    const currentMedia = [...(selectedNode.media ?? [])]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= currentMedia.length) return
    const temp = currentMedia[index]!
    currentMedia[index] = currentMedia[targetIndex]!
    currentMedia[targetIndex] = temp
    const reordered = currentMedia.map((m, i) => ({ ...m, sortOrder: i + 1 }))
    commit({
      ...preview,
      steps: preview.steps.map(step =>
        step.id === selectedNodeId ? { ...step, media: reordered } : step
      )
    })
  }

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
                    {/* Visual Banner Preview & Media Gallery */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                          <ImageIcon className="size-3.5 text-sky-500" />
                          Ảnh bìa / Minh họa thẻ {selectedNode.media?.length ? `(${selectedNode.media.length})` : ''}
                        </span>
                        {selectedNode.media?.some(m => m.role === 'cover') ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            <Star className="size-3 fill-amber-500 text-amber-500" /> Có ảnh bìa
                          </span>
                        ) : selectedNode.imageUrl ? (
                          <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                            URL ảnh ngoài
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400">
                            Vector chủ đề
                          </span>
                        )}
                      </div>

                      {/* Mini Live Banner Preview */}
                      {(() => {
                        const coverMedia = selectedNode.media?.find(m => m.role === 'cover') || selectedNode.media?.[0]
                        const displayUrl = coverMedia?.url || (coverMedia?.sourceMediaId && importId?.trim() ? `/api/v1/sop-imports/${encodeURIComponent(importId.trim())}/media/${encodeURIComponent(coverMedia.sourceMediaId)}/preview` : null) || selectedNode.imageUrl
                        return (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-700">
                            {displayUrl ? (
                              <img
                                src={displayUrl}
                                alt={coverMedia?.caption ?? selectedNode.title}
                                className="size-full object-cover cursor-pointer"
                                onClick={() => {
                                  if (coverMedia?.sourceMediaId) {
                                    const sm = (preview.sourceStructure?.media ?? []).find(m => m.id === coverMedia.sourceMediaId)
                                    if (sm) setLightboxMedia(sm)
                                  }
                                }}
                              />
                            ) : (
                              renderPresetIllustration(inspectorPreset)
                            )}
                          </div>
                        )
                      })()}

                      {/* Action Buttons: Add from Source & Crop from PDF */}
                      {editable && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
                          >
                            <Plus className="size-3.5" />
                            Thêm từ tài liệu
                          </button>
                          <button
                            type="button"
                            disabled={!importId?.trim()}
                            title={!importId?.trim() ? 'Chưa có file gốc để cắt ảnh' : 'Cắt ảnh từ trang PDF'}
                            onClick={() => setCropModalOpen(true)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 cursor-pointer"
                          >
                            <Crop className="size-3.5" />
                            Cắt ảnh từ PDF
                          </button>
                        </div>
                      )}

                      {/* Attached Media Items List */}
                      {selectedNode.media && selectedNode.media.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Danh sách ảnh gắn vào bước:</p>
                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {selectedNode.media.map((m, mIndex) => {
                              const isCover = m.role === 'cover'
                              const previewUrl = m.url || (m.sourceMediaId && importId?.trim() ? `/api/v1/sop-imports/${encodeURIComponent(importId.trim())}/media/${encodeURIComponent(m.sourceMediaId)}/preview` : '')
                              return (
                                <div
                                  key={m.id}
                                  className={`rounded-lg border p-2 flex gap-2 items-start transition-colors ${
                                    isCover
                                      ? 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                                  }`}
                                >
                                  {/* Thumbnail */}
                                  <div
                                    className="relative size-12 shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                                    onClick={() => {
                                      const sm = (preview.sourceStructure?.media ?? []).find(x => x.id === m.sourceMediaId)
                                      if (sm) setLightboxMedia(sm)
                                    }}
                                  >
                                    {previewUrl ? (
                                      <img src={previewUrl} alt={m.caption ?? ''} className="size-full object-cover" />
                                    ) : (
                                      <div className="size-full flex items-center justify-center text-slate-400">
                                        <ImageIcon className="size-4" />
                                      </div>
                                    )}
                                    {isCover && (
                                      <div className="absolute top-0 right-0 bg-amber-500 text-white p-0.5 rounded-bl">
                                        <Star className="size-2.5 fill-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Info & Controls */}
                                  <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <Select
                                        value={m.role}
                                        disabled={!editable}
                                        className="h-6 text-[11px] py-0 px-1 font-bold"
                                        onChange={e => handleUpdateStepMedia(m.id, { role: e.target.value as StepMediaRole })}
                                      >
                                        <option value="cover">Ảnh bìa</option>
                                        <option value="illustration">Minh họa</option>
                                        <option value="screenshot">Chụp màn hình</option>
                                        <option value="form">Biểu mẫu</option>
                                        <option value="diagram">Sơ đồ</option>
                                      </Select>

                                      {editable && (
                                        <div className="flex items-center gap-0.5 shrink-0">
                                          {!isCover && (
                                            <button
                                              type="button"
                                              title="Đặt làm ảnh bìa"
                                              onClick={() => handleSetAsCover(m.id)}
                                              className="p-1 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded dark:hover:bg-amber-950/40"
                                            >
                                              <Star className="size-3" />
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            title="Di chuyển lên"
                                            disabled={mIndex === 0}
                                            onClick={() => handleMoveStepMedia(mIndex, -1)}
                                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                          >
                                            <ArrowUp className="size-3" />
                                          </button>
                                          <button
                                            type="button"
                                            title="Di chuyển xuống"
                                            disabled={mIndex === selectedNode.media!.length - 1}
                                            onClick={() => handleMoveStepMedia(mIndex, 1)}
                                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                          >
                                            <ArrowDown className="size-3" />
                                          </button>
                                          <button
                                            type="button"
                                            title="Gỡ khỏi bước"
                                            onClick={() => handleRemoveMedia(m.id)}
                                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-950/40"
                                          >
                                            <Trash2 className="size-3" />
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <input
                                      type="text"
                                      placeholder="Chú thích ảnh..."
                                      disabled={!editable}
                                      value={m.caption ?? ''}
                                      onChange={e => handleUpdateStepMedia(m.id, { caption: e.target.value })}
                                      className="h-6 w-full rounded border border-slate-200 bg-transparent px-1.5 text-[11px] outline-none focus:border-sky-500 dark:border-slate-700"
                                    />

                                    {(m.sourcePage || m.sourceSubPath) && (
                                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        {m.sourcePage && <span>Trang {m.sourcePage}</span>}
                                        {m.sourceSubPath && <span className="truncate">· {m.sourceSubPath}</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Collapsible Advanced: Preset & Custom URL */}
                      <details className="text-xs pt-1">
                        <summary className="cursor-pointer font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                          Tùy chọn nâng cao (URL ngoài & Vector)
                        </summary>
                        <div className="mt-2 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">
                            <span>Chủ đề minh họa vector (khi không có ảnh)</span>
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

                          <label className="block font-bold text-slate-700 dark:text-slate-300">
                            <span>Dán URL hình ảnh ngoài (tùy chọn)</span>
                            <input
                              type="url"
                              placeholder="https://... (ảnh đại diện)"
                              className={adminInputClass}
                              value={selectedNode.imageUrl ?? ''}
                              onChange={event => patchNode({ imageUrl: event.target.value.trim() ? event.target.value : null })}
                            />
                          </label>
                        </div>
                      </details>
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

      {/* Modal: Pick Media from Source Document */}
      <SourceMediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddMediaFromSource}
        availableMedia={preview.sourceStructure?.media ?? []}
        stepTitle={selectedNode?.title ?? ''}
      />

      {/* Modal: Crop image from PDF */}
      {cropModalOpen && selectedNode && importId?.trim() ? (
        <PdfCropModal
          open={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          importId={importId.trim()}
          targetStepKey={selectedNode.stableKey}
          onCropSuccess={handleCropSuccess}
        />
      ) : null}

      {/* Modal: Lightbox viewer */}
      <MediaLightbox
        media={lightboxMedia}
        onClose={() => setLightboxMedia(null)}
        allMedia={preview.sourceStructure?.media ?? []}
        onSelectMedia={setLightboxMedia}
      />
    </div>
  )
}
