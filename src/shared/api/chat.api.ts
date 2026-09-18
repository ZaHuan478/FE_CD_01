import { apiRequest, parseApiErrorResponse } from './httpClient'
import { apiBaseUrl } from '../config/api'
import { getAuthenticationHeaders } from '../lib/auth/authCredentials'

export interface Citation {
  index: number
  sopId: string
  sopCode: string
  sopTitle: string
  stepId?: string
  stepCode?: string
  stepTitle?: string
  actor?: string
  timing?: string
  excerpt?: string
  routeUrl: string
}

export interface ChatMessageItem {
  messageId: string
  role: 'user' | 'assistant'
  content: string
  citations: Citation[]
  createdAt: string
}

export interface ChatSessionItem {
  sessionId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface ChatCompletionResponse {
  sessionId: string
  message: string
  citations: Citation[]
}

export interface IndexStatusItem {
  entityId: string
  entityType: string
  versionId: string
  title: string
  moduleId: string
  indexStatus: 'pending' | 'indexing' | 'synced' | 'failed' | 'stale'
  totalChunks: number
  indexedChunks: number
  errorMessage?: string | null
  triggerSource: string
  lastIndexedAt?: string | null
}

export interface IndexOverview {
  totalDocuments: number
  syncedDocuments: number
  pendingDocuments: number
  failedDocuments: number
  totalChunks: number
  items: IndexStatusItem[]
  latestJob: null | {
    jobId: string
    scope: 'all' | 'module' | 'sop'
    targetId: string | null
    status: 'pending' | 'running' | 'succeeded' | 'failed'
    totalItems: number
    succeededItems: number
    failedItems: number
    errorMessage: string | null
    requestedBy: string
    createdAt: string
    startedAt: string | null
    finishedAt: string | null
  }
}

export async function sendChatMessage(body: {
  message: string
  sessionId?: string
  moduleId?: string
}): Promise<ChatCompletionResponse> {
  const response = await apiRequest<{ data: ChatCompletionResponse }>('/chat/completions', {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return response.data
}

export async function streamChatMessage(
  body: { message: string; sessionId?: string; moduleId?: string },
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<ChatCompletionResponse> {
  const response = await fetch(`${apiBaseUrl}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      ...getAuthenticationHeaders()
    },
    body: JSON.stringify({ ...body, stream: true })
  })
  if (!response.ok) throw await parseApiErrorResponse(response)
  if (!response.body) throw new Error('Máy chủ không trả về luồng phản hồi AI.')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let message = ''
  let sessionId = body.sessionId || ''
  let citations: Citation[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    for (const event of events) {
      const payload = event.split('\n').find(line => line.startsWith('data: '))?.slice(6)
      if (!payload || payload === '[DONE]') continue
      const item = JSON.parse(payload) as { type: 'token' | 'done' | 'error'; token?: string; citations?: Citation[]; sessionId?: string; message?: string }
      if (item.type === 'token' && item.token) {
        message += item.token
        onToken(item.token)
      } else if (item.type === 'done') {
        citations = item.citations || []
        sessionId = item.sessionId || sessionId
      } else if (item.type === 'error') {
        if (item.sessionId) sessionId = item.sessionId
        const err = new Error(item.message || 'Lỗi dịch vụ AI') as Error & { sessionId?: string }
        err.sessionId = sessionId
        throw err
      }
    }
  }
  if (!sessionId) throw new Error('Phản hồi AI thiếu mã phiên trò chuyện.')
  return { sessionId, message, citations }
}

export async function fetchChatSessions(): Promise<ChatSessionItem[]> {
  const response = await apiRequest<{ data: ChatSessionItem[] }>('/chat/sessions')
  return response.data
}

export async function fetchSessionMessages(sessionId: string): Promise<ChatMessageItem[]> {
  const response = await apiRequest<{ data: ChatMessageItem[] }>(`/chat/sessions/${encodeURIComponent(sessionId)}`)
  return response.data
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await apiRequest(`/chat/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE'
  })
}

// === APIs Quản trị chỉ mục (Admin-only) ===

export async function fetchIndexingOverview(): Promise<IndexOverview> {
  const response = await apiRequest<{ data: IndexOverview }>('/admin/rag/status')
  return response.data
}

export async function triggerReindex(
  scope: 'all' | 'module' | 'sop',
  targetId?: string
): Promise<{ message: string; jobId: string; status: 'pending' | 'running' }> {
  const response = await apiRequest<{
    data: { message: string; jobId: string; status: 'pending' | 'running' }
  }>('/admin/rag/reindex', {
    method: 'POST',
    body: JSON.stringify({ scope, targetId })
  })
  return response.data
}
