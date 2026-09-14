import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  LoaderCircle,
  Maximize2,
  Minimize2,
  RotateCcw,
  User,
  X
} from 'lucide-react'
import { fetchAdminDocumentBlob, getErrorMessage, type AdminUserDocumentItem } from '../model/useAdminDocuments'
import { Feedback, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { Select } from '../../../shared/ui/atoms/Select'
import {
  getDocument,
  renderAsync,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type RenderTask
} from '../../../shared/lib/documentPreview'
import { useToast } from '../../../shared/ui/toast'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AdminDocumentViewer({
  document: doc,
  onClose
}: {
  document: AdminUserDocumentItem
  onClose: () => void
}) {
  const { error: showError } = useToast()
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl = ''
    setBlob(null)
    setUrl('')
    setError('')
    setLoading(true)

    void fetchAdminDocumentBlob(doc.id, controller.signal)
      .then((file) => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(file)
        setBlob(file)
        setUrl(objectUrl)
      })
      .catch((reason) => {
        if (!controller.signal.aborted) {
          const msg = getErrorMessage(reason, 'Không tải được tài liệu')
          setError(msg)
          showError(msg)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [doc.id, attempt, showError])

  useEffect(() => {
    if (!expanded) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expanded])

  const downloadFileName = doc.displayName.endsWith(`.${doc.format}`)
    ? doc.displayName
    : `${doc.displayName}.${doc.format}`

  return (
    <section
      aria-label="Trình xem tài liệu người dùng (Admin)"
      className={`${
        expanded ? 'fixed inset-3 z-[100] overflow-y-auto shadow-2xl' : ''
      } rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  doc.format === 'pdf'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                }`}
              >
                {doc.format.toUpperCase()}
              </span>
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white" title={doc.displayName}>
                {doc.displayName}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="truncate">{doc.originalFileName}</span>
              <span>·</span>
              <span>{formatBytes(doc.fileSize)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <User className="size-3 text-slate-400" />
                {doc.uploader.fullName} ({doc.uploader.departmentName || 'Hệ thống'})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {url && (
            <a
              href={url}
              download={downloadFileName}
              className={`${secondaryButtonClass} inline-flex items-center gap-1.5`}
            >
              <Download className="size-4" />
              <span>Tải file gốc</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className={secondaryButtonClass}
            title={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            <span className="hidden md:inline">{expanded ? 'Thu gọn' : 'Mở rộng'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
            title="Đóng trình xem"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      {loading && (
        <div role="status" className="flex min-h-72 flex-col items-center justify-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="size-6 animate-spin text-[#1f5f86]" />
          <span>Đang tải tệp để xem trước...</span>
        </div>
      )}

      {error && (
        <div className="p-6">
          <Feedback type="error">{error}</Feedback>
          <button
            type="button"
            onClick={() => setAttempt((val) => val + 1)}
            className={`${secondaryButtonClass} mt-3 inline-flex items-center gap-2`}
          >
            <RotateCcw className="size-4" />
            Thử lại
          </button>
        </div>
      )}

      {blob &&
        (doc.format === 'pdf' ? (
          <AdminPdfViewer blob={blob} />
        ) : (
          <AdminWordViewer blob={blob} />
        ))}
    </section>
  )
}

function AdminPdfViewer({ blob }: { blob: Blob }) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [error, setError] = useState('')
  const [rendering, setRendering] = useState(true)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let disposed = false
    let task: PDFDocumentLoadingTask | undefined
    setPdfDoc(null)
    setError('')
    setPage(1)

    void (async () => {
      if (disposed) return
      const data = await blob.arrayBuffer()
      if (disposed) return
      task = getDocument({ data })
      const loaded = await task.promise
      if (!disposed) setPdfDoc(loaded)
    })().catch((reason) => {
      if (!disposed) {
        setError(reason instanceof Error ? reason.message : 'Không đọc được PDF')
      }
    })

    return () => {
      disposed = true
      void task?.destroy()
    }
  }, [blob])

  useEffect(() => {
    if (!pdfDoc) return
    let disposed = false
    let task: RenderTask | undefined
    setRendering(true)
    setError('')

    void (async () => {
      const pdfPage = await pdfDoc.getPage(page)
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
    })()
      .catch((reason) => {
        if (!disposed) {
          setError(reason instanceof Error ? reason.message : 'Không hiển thị được trang PDF')
        }
      })
      .finally(() => {
        if (!disposed) setRendering(false)
      })

    return () => {
      disposed = true
      task?.cancel()
    }
  }, [pdfDoc, page, scale])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <button
          type="button"
          aria-label="Trang PDF trước"
          disabled={!pdfDoc || page <= 1}
          onClick={() => setPage((val) => val - 1)}
          className={secondaryButtonClass}
        >
          <ChevronLeft className="size-4" />
        </button>
        <span aria-live="polite" className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Trang {page} / {pdfDoc?.numPages ?? '…'}
        </span>
        <button
          type="button"
          aria-label="Trang PDF sau"
          disabled={!pdfDoc || page >= (pdfDoc?.numPages ?? 1)}
          onClick={() => setPage((val) => val + 1)}
          className={secondaryButtonClass}
        >
          <ChevronRight className="size-4" />
        </button>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
          <span>Thu phóng:</span>
          <Select
            visualSize="compact"
            aria-label="Thu phóng PDF"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            containerClassName="w-auto min-w-[95px]"
            className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((val) => (
              <option key={val} value={val}>
                {val * 100}%
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <Feedback type="error">Không xem được PDF: {error}. Bạn có thể tải file gốc để mở.</Feedback>
        </div>
      )}

      {rendering && !error && (
        <p role="status" className="p-4 text-center text-xs text-slate-500">
          Đang kết xuất trang...
        </p>
      )}

      <div className="max-h-[75vh] overflow-auto bg-slate-200/80 p-4 dark:bg-slate-950 flex justify-center">
        <canvas ref={canvas} aria-label={`Nội dung PDF trang ${page}`} className="bg-white shadow-md rounded" />
      </div>
    </div>
  )
}

function AdminWordViewer({ blob }: { blob: Blob }) {
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let disposed = false
    setHtml('')
    setError('')

    void (async () => {
      const container = document.createElement('div')
      await renderAsync(blob, container, undefined, {
        useBase64URL: true,
        renderAltChunks: false,
        renderComments: false,
        breakPages: true
      })

      Array.from(container.querySelectorAll('script,iframe,object,embed,form,base,link')).forEach((element) => {
        element.remove()
      })
      Array.from(container.querySelectorAll('*')).forEach((element) => {
        for (const name of element.getAttributeNames()) {
          if (
            /^on/i.test(name) ||
            ['href', 'srcdoc', 'action', 'formaction', 'target'].includes(name.toLowerCase())
          ) {
            element.removeAttribute(name)
          }
        }
      })

      const policy =
        "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data: blob:; base-uri 'none'; form-action 'none'"
      const docHtml = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>body{margin:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif}.docx-wrapper{padding:24px!important}section.docx{margin:0 auto 20px auto!important;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);background:#fff!important}</style></head><body>${container.innerHTML}</body></html>`

      if (!disposed) setHtml(docHtml)
    })().catch((reason) => {
      if (!disposed) {
        setError(reason instanceof Error ? reason.message : 'Không đọc được file Word')
      }
    })

    return () => {
      disposed = true
    }
  }, [blob])

  if (error) {
    return (
      <div className="p-4">
        <Feedback type="error">Không xem được Word: {error}. Bạn có thể tải file gốc để mở.</Feedback>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-500">
        <LoaderCircle className="size-5 animate-spin text-[#1f5f86]" />
        <span>Đang dựng nội dung Word...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 flex items-center justify-between">
        <span>Bản xem trước trực tiếp trên web bằng docx-preview.</span>
        <span className="text-[11px] text-slate-400">Được hiển thị trong khung cách ly an toàn</span>
      </div>
      <iframe
        title="Nội dung file Word"
        sandbox=""
        referrerPolicy="no-referrer"
        srcDoc={html}
        className="h-[75vh] w-full border-0 bg-slate-100 dark:bg-slate-950"
      />
    </div>
  )
}
