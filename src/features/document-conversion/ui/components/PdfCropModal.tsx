import { useEffect, useRef, useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Crop,
  LoaderCircle,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react'
import { fetchSopSource, sopImportApi, type SourceMedia, type StepMedia, type StepMediaRole } from '../../model/documentConversionModel'
import { getDocument, type PDFDocumentProxy } from '../../../../shared/lib/documentPreview'
import { useToast } from '../../../../shared/ui/toast'
import { getErrorMessage } from '../../../../shared/lib/errors/apiError'

export interface PdfCropModalProps {
  open?: boolean
  isOpen?: boolean
  importId: string
  targetStepKey?: string
  targetStepStableKey?: string
  targetStepTitle?: string
  stepTitle?: string
  onClose: () => void
  onCropped?: (media: SourceMedia, stepMedia: StepMedia) => void
  onCropSuccess?: (media: SourceMedia, stepMedia: StepMedia) => void
}

export function PdfCropModal({
  open,
  isOpen,
  importId,
  targetStepKey,
  targetStepStableKey,
  targetStepTitle,
  stepTitle,
  onClose,
  onCropped,
  onCropSuccess
}: PdfCropModalProps) {
  const isVisible = Boolean(open ?? isOpen ?? true)
  const effectiveStepKey = targetStepKey || targetStepStableKey || ''
  const effectiveStepTitle = targetStepTitle || stepTitle || ''
  const notifySuccess = onCropSuccess || onCropped
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Selection state
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null)

  // Metadata inputs
  const [caption, setCaption] = useState('')
  const [role, setRole] = useState<StepMediaRole>('illustration')

  // Load PDF document only when modal is actively visible and importId is valid
  useEffect(() => {
    if (!isVisible || !importId?.trim()) {
      setPdfDoc(null)
      setLoadingPdf(false)
      return
    }

    let active = true
    async function load() {
      try {
        setLoadingPdf(true)
        const blob = await fetchSopSource(importId.trim())
        const arrayBuffer = await blob.arrayBuffer()
        const loadingTask = getDocument({ data: arrayBuffer })
        const doc = await loadingTask.promise
        if (!active) return
        setPdfDoc(doc)
        setTotalPages(doc.numPages)
        setCurrentPage(1)
      } catch (err) {
        if (!active) return
        toastRef.current.error(getErrorMessage(err, 'Không thể tải tài liệu PDF để cắt ảnh'))
      } finally {
        if (active) setLoadingPdf(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [isVisible, importId])

  // Render PDF page to canvas
  useEffect(() => {
    if (!isVisible || !pdfDoc || !canvasRef.current) return
    let active = true
    let renderTask: any = null

    async function renderPage() {
      try {
        const page = await pdfDoc!.getPage(currentPage)
        if (!active || !canvasRef.current) return

        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        renderTask = page.render({
          canvasContext: ctx,
          viewport,
          canvas
        })
        await renderTask.promise
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err)
        }
      }
    }

    renderPage()
    setCurrentBox(null)
    setCropPreviewUrl(null)

    return () => {
      active = false
      if (renderTask && typeof renderTask.cancel === 'function') {
        try {
          renderTask.cancel()
        } catch {}
      }
    }
  }, [isVisible, pdfDoc, currentPage])

  // Handle drawing crop bounding box
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setIsDrawing(true)
    setStartPos({ x, y })
    setCurrentBox({ x, y, width: 0, height: 0 })
    setCropPreviewUrl(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPos || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

    const x = Math.min(startPos.x, currentX)
    const y = Math.min(startPos.y, currentY)
    const width = Math.abs(currentX - startPos.x)
    const height = Math.abs(currentY - startPos.y)

    setCurrentBox({ x, y, width, height })
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (!currentBox || currentBox.width < 10 || currentBox.height < 10 || !canvasRef.current) {
      setCurrentBox(null)
      return
    }

    // Generate local crop preview from canvas
    const canvas = canvasRef.current
    const scaleX = canvas.width / canvas.getBoundingClientRect().width
    const scaleY = canvas.height / canvas.getBoundingClientRect().height

    const sx = currentBox.x * scaleX
    const sy = currentBox.y * scaleY
    const sw = currentBox.width * scaleX
    const sh = currentBox.height * scaleY

    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = Math.max(1, Math.round(sw))
    cropCanvas.height = Math.max(1, Math.round(sh))
    const ctx = cropCanvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, cropCanvas.width, cropCanvas.height)
      setCropPreviewUrl(cropCanvas.toDataURL('image/png'))
    }
  }

  // Submit crop to backend
  const handleSaveCrop = async () => {
    if (!currentBox || !canvasRef.current) return
    const canvas = canvasRef.current
    const scaleX = canvas.width / canvas.getBoundingClientRect().width
    const scaleY = canvas.height / canvas.getBoundingClientRect().height

    const boundingBox = {
      x: Math.round(currentBox.x * scaleX),
      y: Math.round(currentBox.y * scaleY),
      width: Math.round(currentBox.width * scaleX),
      height: Math.round(currentBox.height * scaleY)
    }

    try {
      setSubmitting(true)
      const res = await sopImportApi.cropMedia(importId, {
        page: currentPage,
        boundingBox,
        targetStepStableKey: effectiveStepKey,
        caption: caption.trim() || undefined,
        role,
        imageDataUrl: cropPreviewUrl || undefined
      })
      toast.success('Đã cắt và gắn ảnh vào bước thành công!')
      notifySuccess?.(res.data.media, res.data.stepMedia)
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi cắt ảnh từ tài liệu'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cắt ảnh từ trang PDF"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div className="flex h-[90vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <Crop className="size-5 text-cyan-400" />
            <h2 className="text-sm font-bold">Cắt ảnh minh họa từ trang PDF</h2>
            {effectiveStepTitle && (
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                Gắn vào: <span className="text-cyan-300 font-bold">{effectiveStepTitle}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main Area: PDF Page Viewer + Crop Box */}
          <div className="flex flex-col overflow-hidden border-b border-slate-800 lg:border-b-0 lg:border-r">
            {/* Page Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span>Trang {currentPage} / {totalPages}</span>
                <button
                  type="button"
                  disabled={currentPage <= 1 || loadingPdf}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-700 p-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  title="Trang trước"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages || loadingPdf}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-700 p-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  title="Trang sau"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <span className="text-slate-400">Kéo chuột để khoanh vùng hình ảnh cần cắt</span>
            </div>

            {/* Canvas Viewer with Crop Overlay */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-950 p-4 select-none cursor-crosshair"
            >
              {loadingPdf ? (
                <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                  <LoaderCircle className="size-6 animate-spin text-cyan-400" />
                  <span>Đang tải PDF…</span>
                </div>
              ) : (
                <div className="relative inline-block shadow-xl">
                  <canvas ref={canvasRef} className="block max-w-full rounded-sm bg-white" />
                  {currentBox && (
                    <div
                      style={{
                        left: `${currentBox.x}px`,
                        top: `${currentBox.y}px`,
                        width: `${currentBox.width}px`,
                        height: `${currentBox.height}px`
                      }}
                      className="pointer-events-none absolute border-2 border-cyan-400 bg-cyan-400/20 shadow-xs"
                    >
                      <span className="absolute -top-6 left-0 rounded bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                        {Math.round(currentBox.width)} × {Math.round(currentBox.height)} px
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Crop Preview & Metadata Form */}
          <div className="flex flex-col justify-between bg-slate-900 p-5 text-slate-200">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vùng ảnh đã chọn
              </h3>

              <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-2">
                {cropPreviewUrl ? (
                  <img
                    src={cropPreviewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full rounded object-contain shadow"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center text-xs text-slate-500">
                    <ImageIcon className="size-6 opacity-40" />
                    <span>Chưa khoanh vùng</span>
                  </div>
                )}
              </div>

              {/* Form inputs */}
              <div className="space-y-3 text-xs">
                <label className="block space-y-1">
                  <span className="font-bold text-slate-300">Vai trò hình ảnh</span>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as StepMediaRole)}
                    className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="cover">Ảnh bìa thẻ (Cover)</option>
                    <option value="illustration">Minh họa (Illustration)</option>
                    <option value="screenshot">Ảnh chụp màn hình (Screenshot)</option>
                    <option value="form">Biểu mẫu (Form)</option>
                    <option value="diagram">Sơ đồ (Diagram)</option>
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="font-bold text-slate-300">Chú thích ảnh (Caption)</span>
                  <input
                    type="text"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="VD: Giao diện tạo mới hợp đồng lao động"
                    className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-800 pt-4 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!cropPreviewUrl || submitting}
                onClick={handleSaveCrop}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-cyan-500 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Đang lưu…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Gắn vào bước
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
