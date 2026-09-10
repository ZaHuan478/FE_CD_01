import { Component, useEffect, useState, lazy, Suspense, type ReactNode } from 'react'
import { sopImportApi, type SopImportItem, type SopImportPreview } from '../model/documentConversionModel'
const SopFlowchartWorkspace = lazy(() => import('./SopFlowchartWorkspace').then(module => ({ default: module.SopFlowchartWorkspace })))
import { MermaidDiagram } from '../../../shared/ui/diagrams/MermaidDiagram'
import { buildMermaidDefinition } from '../model/mermaidFlow'
import { authApi } from '../model/documentConversionModel'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'
import { LayoutGrid, GitBranch, RefreshCw } from 'lucide-react'

interface CanvasErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface CanvasErrorBoundaryState {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('Canvas failed to load, falling back to Mermaid diagram:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function PublishedSopFlow({ code, fallback, fallbackPreview }: { code: string; fallback: string; fallbackPreview: SopImportPreview }) {
  const [accountId, setAccountId] = useState<string | null>(null)
  const toast = useToast()
  const reportError = toast.error
  const [item, setItem] = useState<SopImportItem | null>(null)
  const [draft, setDraft] = useState<SopImportItem | null>(null)
  const [preview, setPreview] = useState<SopImportPreview | null>(null)
  const [busy, setBusy] = useState(false)
  const [viewMode, setViewMode] = useState<'mermaid' | 'canvas'>('canvas')
  useEffect(() => {
    const controller = new AbortController()
    setItem(null); setDraft(null); setPreview(null)
    void authApi.getSession().then(session => { if (!controller.signal.aborted) setAccountId(session.accountId) }).catch(() => { if (!controller.signal.aborted) setAccountId(null) })
    void sopImportApi.list(controller.signal).then(result => {
      if (controller.signal.aborted) return
      const published = result.data.filter(value => value.preview.code === code && value.status === 'published').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
      setItem(published ?? null)
    }).catch(error => { if (!controller.signal.aborted) reportError(getErrorMessage(error, 'Không tải được lưu đồ nguồn')) })
    return () => controller.abort()
  }, [code, reportError])
  const revise = async () => {
    if (!item) return
    setBusy(true)
    try {
      const existing = (await sopImportApi.list()).data.find(value => value.preview.code === code && value.createdBy === accountId && value.status === 'needs_review')
      const next = existing ?? (await sopImportApi.revise(item.id)).data
      setDraft(next); setPreview(next.preview)
    } catch (error) { toast.error(getErrorMessage(error, 'Không tạo được bản chỉnh sửa')) }
    finally { setBusy(false) }
  }
  const save = async () => {
    if (!draft || !preview) return
    setBusy(true)
    try { const result = await sopImportApi.update(draft.id, preview); setDraft(result.data); setPreview(result.data.preview); toast.success('Đã lưu bản nháp. Bản công bố chỉ thay đổi sau khi duyệt lại.') }
    catch (error) { toast.error(getErrorMessage(error, 'Không lưu được lưu đồ')) }
    finally { setBusy(false) }
  }
  if (draft && preview) {
    return (
      <CanvasErrorBoundary fallback={<p className="p-6 text-sm text-red-500">Không thể tải trình chỉnh sửa lưu đồ. Vui lòng tải lại trang.</p>}>
        <Suspense fallback={<p className="p-6 text-sm text-slate-500">Đang mở trình chỉnh sửa lưu đồ…</p>}>
          <SopFlowchartWorkspace
            key={draft.id}
            importId={draft.id}
            preview={preview}
            onPreview={setPreview}
            editable={draft.createdBy === accountId && draft.status === 'needs_review'}
            onSave={save}
            saving={busy}
          />
        </Suspense>
      </CanvasErrorBoundary>
    )
  }

  const editAction = item?.createdBy === accountId ? (
    <button
      type="button"
      disabled={busy}
      onClick={() => void revise()}
      className="flex h-8 items-center gap-1.5 rounded-xl bg-[#1f5f86] px-3 text-xs font-bold text-white shadow-xs hover:bg-[#184b6a] disabled:opacity-50 cursor-pointer dark:bg-sky-600 dark:hover:bg-sky-700"
    >
      {busy ? 'Đang mở…' : 'Chỉnh sửa lưu đồ'}
    </button>
  ) : undefined

  const actionSlot = (
    <div className="flex items-center gap-2">
      {(
        <button
          type="button"
          onClick={() => setViewMode('canvas')}
          className="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
        >
          <LayoutGrid className="size-3.5 text-sky-500" />
          Xem Canvas đồ họa
        </button>
      )}
      {editAction}
    </div>
  )

  const canvasPreview = item?.preview ?? fallbackPreview
  if (viewMode === 'canvas') {
    const canvasFallback = (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <span>Canvas tương tác gặp lỗi nạp gói phụ thuộc từ cache trình duyệt. Đang chuyển sang hiển thị lưu đồ Mermaid.</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-lg bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 cursor-pointer"
          >
            <RefreshCw className="size-3" />
            Tải lại trang (F5)
          </button>
        </div>
        <MermaidDiagram
          definition={item ? buildMermaidDefinition(item.preview) : fallback}
          fileName={`${code}.mmd`}
          title={`Lưu đồ ${code}`}
          stepCount={item?.preview.steps.length}
          initialDirection="LR"
          actionSlot={actionSlot}
        />
      </div>
    )

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setViewMode('mermaid')}
            className="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <GitBranch className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
            Xem dạng Mermaid
          </button>
          {editAction}
        </div>
        <CanvasErrorBoundary fallback={canvasFallback}>
          <Suspense fallback={<p className="p-6 text-sm text-slate-500">Đang mở Canvas lưu đồ…</p>}>
            <SopFlowchartWorkspace
              key={item?.id ?? code}
              importId={item?.id ?? ''}
              preview={canvasPreview}
              onPreview={() => {}}
              editable={false}
              onSave={async () => {}}
              saving={false}
            />
          </Suspense>
        </CanvasErrorBoundary>
      </div>
    )
  }

  return (
    <MermaidDiagram
      definition={item ? buildMermaidDefinition(item.preview) : fallback}
      fileName={`${code}.mmd`}
      title={`Lưu đồ ${code}`}
      stepCount={item?.preview.steps.length}
      initialDirection="LR"
      actionSlot={actionSlot}
    />
  )
}
