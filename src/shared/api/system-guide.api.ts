import { apiRequest } from './httpClient'

export type GuideAudience = 'ALL' | 'AUTHORIZED' | 'ADMIN'
export type GuideStatus = 'draft' | 'published' | 'archived'

export interface SystemGuideContent {
  purpose: string
  audience: string
  accessPath: string
  prerequisites: string[]
  steps: Array<{ title: string; description: string }>
  result: string
  permissions: string[]
  commonErrors: string[]
  relatedRoutes: string[]
  support: string
}

export interface SystemGuideProgress {
  guideId: string
  completedSteps: number[]
  tourCompleted: boolean
  dismissed: boolean
  lastViewedAt: string
  completedAt: string | null
}

export interface SystemGuideTourStep {
  id: string
  anchor: string
  title: string
  description: string
  routePath: string
  sortOrder: number
}

export interface SystemGuide {
  id: string
  slug: string
  title: string
  summary: string
  category: string
  routePath: string | null
  requiredPermission: string | null
  audienceMode: GuideAudience
  status: GuideStatus
  sortOrder: number
  version: number
  versionStatus: GuideStatus | null
  content: SystemGuideContent | null
  updatedAt: string
  available: boolean
  progress: SystemGuideProgress | null
  tour: SystemGuideTourStep[]
}

export type SystemGuideInput = Pick<SystemGuide, 'slug' | 'title' | 'summary' | 'category' | 'audienceMode' | 'sortOrder'> & {
  routePath?: string | null
  requiredPermission?: string | null
  content: SystemGuideContent
  tour?: Array<Omit<SystemGuideTourStep, 'id'>>
}

export const systemGuideApi = {
  list: (signal?: AbortSignal) => apiRequest<{ data: SystemGuide[] }>('/system-guides', { signal }),
  detail: (slug: string, signal?: AbortSignal) => apiRequest<{ data: SystemGuide }>(`/system-guides/${encodeURIComponent(slug)}`, { signal }),
  saveProgress: (guideId: string, body: { completedSteps: number[]; tourCompleted: boolean; dismissed: boolean }) =>
    apiRequest<{ data: SystemGuideProgress }>(`/system-guides/${encodeURIComponent(guideId)}/progress`, { method: 'PUT', body: JSON.stringify(body) }),
  adminList: (signal?: AbortSignal) => apiRequest<{ data: SystemGuide[] }>('/admin/system-guides', { signal }),
  create: (body: SystemGuideInput) => apiRequest<{ data: { id: string } }>('/admin/system-guides', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<SystemGuideInput>) => apiRequest<{ data: { id: string } }>(`/admin/system-guides/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  publish: (id: string) => apiRequest<{ data: { id: string; status: 'published' } }>(`/admin/system-guides/${encodeURIComponent(id)}/publish`, { method: 'POST' }),
  archive: (id: string) => apiRequest<{ data: { id: string; status: 'archived' } }>(`/admin/system-guides/${encodeURIComponent(id)}/archive`, { method: 'POST' })
}
