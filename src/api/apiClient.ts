import { getAuthenticationHeaders } from '../auth/authCredentials'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const apiBaseUrl = (configuredBaseUrl || '/api/v1').replace(/\/$/, '')

interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

export interface ApiRequestInit extends RequestInit {
  timeoutMs?: number
}

const defaultTimeoutMs = 30_000

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { timeoutMs = defaultTimeoutMs, signal, ...requestInit } = init
  const controller = new AbortController()
  let timedOut = false
  const abortFromCaller = () => controller.abort(signal?.reason)

  if (signal?.aborted) abortFromCaller()
  else signal?.addEventListener('abort', abortFromCaller, { once: true })

  const timeoutId = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestInit,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...getAuthenticationHeaders(),
        ...(requestInit.body ? { 'Content-Type': 'application/json' } : {}),
        ...requestInit.headers
      }
    })

    if (!response.ok) {
      let body: ApiErrorBody | null = null
      try { body = await response.json() as ApiErrorBody } catch { /* response is not JSON */ }
      const detail = body?.error?.message || `HTTP ${response.status}`
      throw new Error(`Backend request failed: ${detail}`)
    }

    return await response.json() as T
  } catch (error) {
    if (timedOut) {
      throw new Error(`Máy chủ phản hồi quá thời gian (${Math.round(timeoutMs / 1000)} giây). Vui lòng thử lại.`)
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}
