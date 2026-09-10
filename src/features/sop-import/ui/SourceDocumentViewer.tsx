import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, LoaderCircle, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { fetchSopSource, type SopImportItem } from '../model/sopImportModel'
import { Feedback, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import {
  getDocument,
  renderAsync,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type RenderTask
} from '../../../shared/lib/documentPreview'

export function SourceDocumentViewer({ item }: { item: SopImportItem }) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''
    setBlob(null); setUrl(''); setError(''); setLoading(true)
    void fetchSopSource(item.id, controller.signal).then(file => {
      if (controller.signal.aborted) return
      objectUrl = URL.createObjectURL(file)
      setBlob(file); setUrl(objectUrl)
    }).catch(reason => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được tài liệu')
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [item.id, attempt])
  useEffect(() => {
    if (!expanded) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [expanded])

  return <section aria-label="Trình xem file gốc" className={`${expanded ? 'fixed inset-3 z-[100] overflow-y-auto shadow-2xl' : ''} rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900`}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-700">
      <div className="min-w-0 flex-1"><h3 className="break-words text-sm font-bold">{item.file.name}</h3><p className="mt-1 text-xs text-slate-500">File nguồn đã lưu · Nội dung gốc có thể khác bản SOP đã hiệu chỉnh</p></div>
      <div className="flex flex-wrap gap-2">
        {url && <a href={url} download={item.file.name} className={secondaryButtonClass}><Download className="size-4" />Tải file gốc</a>}
        <button type="button" onClick={() => setExpanded(value => !value)} className={secondaryButtonClass}>{expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}{expanded ? 'Thu gọn' : 'Mở rộng'}</button>
      </div>
    </header>
    {loading && <div role="status" className="flex min-h-64 items-center justify-center gap-2"><LoaderCircle className="size-5 animate-spin" />Đang tải file gốc…</div>}
    {error && <div className="p-4"><Feedback type="error">{error}</Feedback><button type="button" onClick={() => setAttempt(value => value + 1)} className={`${secondaryButtonClass} mt-3`}><RotateCcw className="size-4" />Thử lại</button></div>}
    {blob && (item.file.mediaType === 'application/pdf'
      ? <PdfDocument blob={blob} />
      : <WordDocument blob={blob} />)}
  </section>
}

function PdfDocument({ blob }: { blob: Blob }) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [error, setError] = useState('')
  const [rendering, setRendering] = useState(true)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let disposed = false
    let task: PDFDocumentLoadingTask | undefined
    setDocument(null); setError(''); setPage(1)
    void (async () => {
      if (disposed) return
      const data = await blob.arrayBuffer()
      if (disposed) return
      task = getDocument({ data })
      const loaded = await task.promise
      if (!disposed) setDocument(loaded)
    })().catch(reason => { if (!disposed) setError(reason instanceof Error ? reason.message : 'Không đọc được PDF') })
    return () => { disposed = true; void task?.destroy() }
  }, [blob])
  useEffect(() => {
    if (!document) return
    let disposed = false
    let task: RenderTask | undefined
    setRendering(true); setError('')
    void (async () => {
      const pdfPage = await document.getPage(page)
      if (disposed || !canvas.current) return
      const viewport = pdfPage.getViewport({ scale })
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const target = canvas.current
      target.width = Math.ceil(viewport.width * ratio)
      target.height = Math.ceil(viewport.height * ratio)
      target.style.width = `${viewport.width}px`
      target.style.height = `${viewport.height}px`
      task = pdfPage.render({ canvas: target, viewport, transform: [ratio, 0, 0, ratio, 0, 0] })
      await task.promise
    })().catch(reason => { if (!disposed) setError(reason instanceof Error ? reason.message : 'Không hiển thị được trang PDF') })
      .finally(() => { if (!disposed) setRendering(false) })
    return () => { disposed = true; task?.cancel() }
  }, [document, page, scale])
  return <div>
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 p-3 dark:border-slate-700">
      <button type="button" aria-label="Trang PDF trước" disabled={!document || page <= 1} onClick={() => setPage(value => value - 1)} className={secondaryButtonClass}><ChevronLeft className="size-4" /></button>
      <span aria-live="polite" className="text-sm">Trang {page} / {document?.numPages ?? '…'}</span>
      <button type="button" aria-label="Trang PDF sau" disabled={!document || page >= document.numPages} onClick={() => setPage(value => value + 1)} className={secondaryButtonClass}><ChevronRight className="size-4" /></button>
      <div className="flex items-center gap-2 text-sm">
        <span>Thu phóng</span>
        <Select
          visualSize="compact"
          aria-label="Thu phóng PDF"
          value={scale}
          onChange={event => setScale(Number(event.target.value))}
          containerClassName="w-auto min-w-[95px]"
          className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(value => (
            <option key={value} value={value}>
              {value * 100}%
            </option>
          ))}
        </Select>
      </div>
    </div>
    {error && <div className="p-4"><Feedback type="error">Không xem được PDF: {error}. Bạn có thể tải file gốc để mở.</Feedback></div>}
    {rendering && !error && <p role="status" className="p-3 text-center text-sm text-slate-500">Đang hiển thị trang…</p>}
    <div className="max-h-[75vh] overflow-auto bg-slate-200 p-3 dark:bg-slate-950"><canvas ref={canvas} aria-label={`Nội dung PDF trang ${page}`} className="mx-auto bg-white shadow" /></div>
  </div>
}

function WordDocument({ blob }: { blob: Blob }) {
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    let disposed = false
    setHtml(''); setError('')
    void (async () => {
      const container = document.createElement('div')
      await renderAsync(blob, container, undefined, { useBase64URL: true, renderAltChunks: false, renderComments: false, breakPages: true })
      // Render in an isolated frame: no scripts, external requests, forms or navigation.
      for (const element of container.querySelectorAll('script,iframe,object,embed,form,base,link')) element.remove()
      for (const element of container.querySelectorAll('*')) {
        for (const attribute of [...element.attributes]) {
          if (/^on/i.test(attribute.name) || ['href', 'srcdoc', 'action', 'formaction', 'target'].includes(attribute.name.toLowerCase())) element.removeAttribute(attribute.name)
        }
      }
      const policy = "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data: blob:; base-uri 'none'; form-action 'none'"
      if (!disposed) setHtml(`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>body{margin:0;background:#e2e8f0}.docx-wrapper{padding:16px!important}section.docx{margin-bottom:16px!important}</style></head><body>${container.innerHTML}</body></html>`)
    })().catch(reason => { if (!disposed) setError(reason instanceof Error ? reason.message : 'Không đọc được Word') })
    return () => { disposed = true }
  }, [blob])
  if (error) return <div className="p-4"><Feedback type="error">Không xem được Word: {error}. Bạn có thể tải file gốc để mở.</Feedback></div>
  if (!html) return <p role="status" className="p-6 text-center text-sm text-slate-500">Đang dựng nội dung Word…</p>
  return <div><p className="px-4 py-2 text-xs text-slate-500">Bản xem Word trên web có thể khác đôi chút về font chữ và ngắt trang so với Microsoft Word.</p><iframe title="Nội dung file Word" sandbox="" referrerPolicy="no-referrer" srcDoc={html} className="h-[75vh] w-full border-0" /></div>
}
