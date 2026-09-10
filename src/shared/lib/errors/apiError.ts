export interface ApiClientErrorOptions {
  message?: string
  code?: string
  status?: number
  details?: unknown
  requestId?: string
  isTimeout?: boolean
  isNetworkError?: boolean
}

export class ApiClientError extends Error {
  status?: number
  code: string
  details?: unknown
  requestId?: string
  isTimeout: boolean
  isNetworkError: boolean

  constructor(
    messageOrOptions: string | ApiClientErrorOptions,
    maybeOptions?: ApiClientErrorOptions
  ) {
    const options: ApiClientErrorOptions =
      typeof messageOrOptions === 'string'
        ? { message: messageOrOptions, ...maybeOptions }
        : messageOrOptions
    super(options.message || 'API request error')
    this.name = 'ApiClientError'
    this.code = options.code || 'UNKNOWN_ERROR'
    this.status = options.status
    this.details = options.details
    this.requestId = options.requestId
    this.isTimeout = Boolean(options.isTimeout)
    this.isNetworkError = Boolean(options.isNetworkError)
  }
}

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if (error instanceof DOMException && error.name === 'AbortError') return true
  const maybeNamed = error as { name?: string; code?: string | number }
  return maybeNamed.name === 'AbortError' || maybeNamed.code === 20
}

export function cleanErrorMessage(rawMessage?: string | null): string {
  if (!rawMessage) return ''
  let msg = rawMessage.trim()
  // Remove technical prefixes like "Backend request failed: "
  msg = msg.replace(/^Backend request failed:\s*/i, '')
  msg = msg.replace(/^Error:\s*/i, '')
  // If backend returned raw internal error or unexpected error
  if (/^(INTERNAL_ERROR|An unexpected error occurred|Internal Server Error)/i.test(msg)) {
    return 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.'
  }
  return msg
}

export function getErrorMessage(error: unknown, fallback = 'Có lỗi xảy ra. Vui lòng thử lại.'): string {
  if (isAbortError(error)) {
    return ''
  }

  if (error instanceof ApiClientError) {
    if (error.isTimeout) {
      return 'Máy chủ phản hồi quá thời gian. Vui lòng thử lại.'
    }
    if (error.isNetworkError) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.'
    }
    if (error.status === 500 || error.code === 'INTERNAL_ERROR') {
      const cleaned = cleanErrorMessage(error.message)
      if (
        !cleaned ||
        cleaned === 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.' ||
        /internal|unexpected|server error/i.test(cleaned) ||
        cleaned.includes('500')
      ) {
        return 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.'
      }
      return cleaned
    }
    const cleaned = cleanErrorMessage(error.message)
    return cleaned || fallback
  }

  if (error instanceof Error) {
    if (error.name === 'TypeError' && /failed to fetch|networkerror|load failed/i.test(error.message)) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối và thử lại.'
    }
    const cleaned = cleanErrorMessage(error.message)
    return cleaned || fallback
  }

  if (typeof error === 'string') {
    const cleaned = cleanErrorMessage(error)
    return cleaned || fallback
  }

  return fallback
}

export interface BackendErrorResponse {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
  requestId?: string
}

export async function parseApiErrorResponse(response: Response): Promise<ApiClientError> {
  let body: BackendErrorResponse | null = null
  try {
    body = (await response.json()) as BackendErrorResponse
  } catch {
    // response is not json
  }

  const code = body?.error?.code || (response.status ? `HTTP_${response.status}` : 'REQUEST_FAILED')
  const rawMessage = body?.error?.message
  let friendlyMessage = cleanErrorMessage(rawMessage)

  if (!friendlyMessage) {
    if (response.status === 500) {
      friendlyMessage = 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.'
    } else if (response.status === 404) {
      friendlyMessage = 'Không tìm thấy dữ liệu hoặc đường dẫn yêu cầu.'
    } else if (response.status === 403) {
      friendlyMessage = 'Bạn không có quyền thực hiện thao tác này.'
    } else if (response.status === 401) {
      friendlyMessage = 'Phiên làm việc đã hết hạn hoặc chưa được xác thực.'
    } else {
      friendlyMessage = `Thao tác không thành công (HTTP ${response.status})`
    }
  }

  return new ApiClientError({
    message: friendlyMessage,
    code,
    status: response.status,
    details: body?.error?.details,
    requestId: body?.requestId
  })
}
