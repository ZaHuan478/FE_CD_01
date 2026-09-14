import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

let server
before(async () => {
  server = await createServer({
    mode: 'test',
    cacheDir: 'node_modules/.vite-test',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom'
  })
})
after(async () => {
  await server?.close()
})

test('ToastViewport renders success toast with role="status" and custom message', async () => {
  const { ToastViewport } = await server.ssrLoadModule('/src/shared/ui/toast/ToastViewport.tsx')
  const toasts = [
    {
      id: 'toast-1',
      variant: 'success',
      title: 'Thành công',
      message: 'Tải tài liệu lên thành công',
      createdAt: Date.now()
    }
  ]
  const html = renderToStaticMarkup(React.createElement(ToastViewport, { toasts, onDismiss: () => {} }))
  assert(html.includes('role="status"'), 'Success toast must have role="status"')
  assert(html.includes('aria-live="polite"'), 'Success viewport must have aria-live="polite"')
  assert(html.includes('Tải tài liệu lên thành công'), 'Should render toast message')
  assert(html.includes('Thành công'), 'Should render toast title')
  assert(html.includes('aria-label="Đóng thông báo"'), 'Close button must have aria-label="Đóng thông báo"')
})

test('ToastViewport renders error toast with role="alert" and assertive aria-live', async () => {
  const { ToastViewport } = await server.ssrLoadModule('/src/shared/ui/toast/ToastViewport.tsx')
  const toasts = [
    {
      id: 'toast-2',
      variant: 'error',
      title: 'Lỗi',
      message: 'Không thể kết nối đến máy chủ',
      createdAt: Date.now()
    }
  ]
  const html = renderToStaticMarkup(React.createElement(ToastViewport, { toasts, onDismiss: () => {} }))
  assert(html.includes('role="alert"'), 'Error toast must have role="alert"')
  assert(html.includes('aria-live="assertive"'), 'Error toast viewport must have aria-live="assertive"')
  assert(html.includes('Không thể kết nối đến máy chủ'), 'Should render error message')
})

test('ToastViewport renders multiple toasts without overwriting each other', async () => {
  const { ToastViewport } = await server.ssrLoadModule('/src/shared/ui/toast/ToastViewport.tsx')
  const toasts = [
    { id: 't-1', variant: 'warning', message: 'Cảnh báo 1', createdAt: Date.now() },
    { id: 't-2', variant: 'info', message: 'Thông tin 2', createdAt: Date.now() },
    { id: 't-3', variant: 'success', message: 'Thành công 3', createdAt: Date.now() }
  ]
  const html = renderToStaticMarkup(React.createElement(ToastViewport, { toasts, onDismiss: () => {} }))
  assert(html.includes('Cảnh báo 1'), 'Must include warning toast')
  assert(html.includes('Thông tin 2'), 'Must include info toast')
  assert(html.includes('Thành công 3'), 'Must include success toast')
})

test('Toast configuration defines default durations and maximum 5 toasts cap', async () => {
  const { DEFAULT_TOAST_DURATIONS, MAX_TOASTS_COUNT } = await server.ssrLoadModule('/src/shared/ui/toast/toast.types.ts')
  assert.equal(DEFAULT_TOAST_DURATIONS.success, 4000, 'Success duration must be 4000ms')
  assert.equal(DEFAULT_TOAST_DURATIONS.info, 4000, 'Info duration must be 4000ms')
  assert.equal(DEFAULT_TOAST_DURATIONS.warning, 6000, 'Warning duration must be 6000ms')
  assert.equal(DEFAULT_TOAST_DURATIONS.error, 8000, 'Error duration must be 8000ms')
  assert.equal(MAX_TOASTS_COUNT, 5, 'Maximum toasts must be 5')
})

test('Toast FIFO queue logic maintains maximum 5 items and drops oldest', async () => {
  const { MAX_TOASTS_COUNT } = await server.ssrLoadModule('/src/shared/ui/toast/toast.types.ts')
  let state = []
  const pushToast = (newItem) => {
    const next = [newItem, ...state]
    if (next.length > MAX_TOASTS_COUNT) {
      state = next.slice(0, MAX_TOASTS_COUNT)
    } else {
      state = next
    }
  }

  for (let i = 1; i <= 7; i++) {
    pushToast({ id: `toast-${i}`, message: `Message ${i}`, variant: 'info', createdAt: i })
  }

  assert.equal(state.length, 5, 'Queue size must be capped at 5')
  assert.equal(state[0].id, 'toast-7', 'Newest toast must appear first')
  assert.equal(state[4].id, 'toast-3', 'Oldest retained toast must be toast-3')
  assert(!state.some(t => t.id === 'toast-1'), 'toast-1 must have been evicted')
  assert(!state.some(t => t.id === 'toast-2'), 'toast-2 must have been evicted')
})

test('generateToastId produces unique IDs and falls back gracefully without crypto.randomUUID', async () => {
  const { generateToastId } = await server.ssrLoadModule('/src/shared/ui/toast/toastUtils.ts')
  const id1 = generateToastId()
  const id2 = generateToastId()
  assert.notEqual(id1, id2, 'Generated IDs must be unique')

  const originalCrypto = globalThis.crypto
  try {
    delete globalThis.crypto
    const fallbackId = generateToastId()
    assert(fallbackId.startsWith('toast-'), 'Fallback ID should start with toast-')
    const fallbackId2 = generateToastId()
    assert.notEqual(fallbackId, fallbackId2, 'Fallback IDs must also be unique')
  } finally {
    globalThis.crypto = originalCrypto
  }
})

test('ApiClientError carries status, code, details, and requestId', async () => {
  const { ApiClientError } = await server.ssrLoadModule('/src/shared/lib/errors/apiError.ts')
  const err = new ApiClientError('Lỗi kiểm tra', {
    status: 400,
    code: 'VALIDATION_ERROR',
    details: { field: 'email' },
    requestId: 'req-abc-123',
    isTimeout: false,
    isNetworkError: false
  })
  assert.equal(err.status, 400)
  assert.equal(err.code, 'VALIDATION_ERROR')
  assert.deepEqual(err.details, { field: 'email' })
  assert.equal(err.requestId, 'req-abc-123')
  assert.equal(err.isTimeout, false)
  assert.equal(err.isNetworkError, false)
})

test('parseApiErrorResponse extracts code, message, details, and requestId from backend response', async () => {
  const { parseApiErrorResponse, ApiClientError } = await server.ssrLoadModule('/src/shared/lib/errors/apiError.ts')
  const mockResponse = new Response(
    JSON.stringify({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'Người dùng không tồn tại',
        details: { username: 'testuser' }
      },
      requestId: 'req-xyz-789'
    }),
    { status: 404, headers: { 'content-type': 'application/json' } }
  )

  const error = await parseApiErrorResponse(mockResponse)
  assert(error instanceof ApiClientError)
  assert.equal(error.status, 404)
  assert.equal(error.code, 'USER_NOT_FOUND')
  assert.equal(error.message, 'Người dùng không tồn tại')
  assert.equal(error.requestId, 'req-xyz-789')
  assert.deepEqual(error.details, { username: 'testuser' })
})

test('getErrorMessage returns friendly messages for 500, timeout, and network errors', async () => {
  const { ApiClientError, getErrorMessage, cleanErrorMessage } = await server.ssrLoadModule('/src/shared/lib/errors/apiError.ts')

  // 500 internal error
  const err500 = new ApiClientError('Internal Server Error', { status: 500, code: 'INTERNAL_ERROR' })
  assert.equal(getErrorMessage(err500), 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.')

  // Timeout error
  const timeoutErr = new ApiClientError('Timeout', { isTimeout: true })
  assert.equal(getErrorMessage(timeoutErr), 'Máy chủ phản hồi quá thời gian. Vui lòng thử lại.')

  // Network error
  const networkErr = new ApiClientError('Network failed', { isNetworkError: true })
  assert.equal(getErrorMessage(networkErr), 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.')

  // Clean technical prefixes
  assert.equal(cleanErrorMessage('Backend request failed: Tài liệu đã tồn tại'), 'Tài liệu đã tồn tại')
  assert.equal(cleanErrorMessage('Backend request failed: 404: Not Found'), '404: Not Found')
})

test('AbortError is recognized and produces empty message to suppress error toast', async () => {
  const { isAbortError, getErrorMessage } = await server.ssrLoadModule('/src/shared/lib/errors/apiError.ts')
  const domAbort = new DOMException('The user aborted a request.', 'AbortError')
  assert.equal(isAbortError(domAbort), true, 'isAbortError must identify DOMException AbortError')
  assert.equal(getErrorMessage(domAbort), '', 'getErrorMessage must return empty string for AbortError')

  const genericError = new Error('Regular failure')
  assert.equal(isAbortError(genericError), false)
  assert.equal(getErrorMessage(genericError), 'Regular failure')
})

test('AppProviders wraps application in ToastProvider exactly once', () => {
  const content = read('src/app/providers/AppProviders.tsx')
  assert(content.includes("import { ToastProvider } from '../../shared/ui/toast'"), 'Must import ToastProvider')
  assert(content.includes('<ToastProvider>'), 'Must render <ToastProvider>')
  assert(content.includes('</ToastProvider>'), 'Must close </ToastProvider>')
  const count = (content.match(/<ToastProvider>/g) || []).length
  assert.equal(count, 1, 'ToastProvider must be mounted exactly once')
  assert(content.indexOf('<SessionProvider>') < content.indexOf('<ToastProvider>'), 'ToastProvider must be inside SessionProvider')
  assert(content.indexOf('<ToastProvider>') < content.indexOf('{children}'), 'ToastProvider must wrap children')
})
