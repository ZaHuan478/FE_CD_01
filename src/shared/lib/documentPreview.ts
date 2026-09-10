import { renderAsync } from 'docx-preview'
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type RenderTask
} from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Resolve viewer dependencies when Vite starts instead of optimizing them on
// the first preview click. This prevents stale /node_modules/.vite/deps URLs.
GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export { getDocument, renderAsync }
export type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask }
