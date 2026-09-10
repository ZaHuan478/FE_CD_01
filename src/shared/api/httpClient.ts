import { getAuthenticationHeaders } from '../lib/auth/authCredentials'
import { apiBaseUrl } from '../config/api'
import {
  ApiClientError,
  isAbortError,
  getErrorMessage,
  parseApiErrorResponse
} from '../lib/errors/apiError'

export {
  ApiClientError,
  isAbortError,
  getErrorMessage,
  parseApiErrorResponse
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
    const hasFormData = typeof FormData !== 'undefined' && requestInit.body instanceof FormData
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestInit,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...getAuthenticationHeaders(),
        ...(requestInit.body && !hasFormData ? { 'Content-Type': 'application/json' } : {}),
        ...requestInit.headers
      }
    })

    if (!response.ok) {
      throw await parseApiErrorResponse(response)
    }

    return await response.json() as T
  } catch (error) {
    if (timedOut) {
      throw new ApiClientError({
        message: 'Máy chủ phản hồi quá thời gian. Vui lòng thử lại.',
        code: 'REQUEST_TIMEOUT',
        isTimeout: true
      })
    }
    if (isAbortError(error) || error instanceof ApiClientError) {
      throw error
    }
    if (error instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(error.message)) {
      throw new ApiClientError({
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.',
        code: 'NETWORK_ERROR',
        isNetworkError: true
      })
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

