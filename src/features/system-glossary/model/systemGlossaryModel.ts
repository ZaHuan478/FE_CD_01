import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  systemGlossaryApi,
  type CreateGlossaryTermInput,
  type GlossaryFilterParams,
  type GlossaryListResponse,
  type GlossaryStatus,
  type GlossaryTerm,
  type RelatedTermSummary,
  type UpdateGlossaryTermInput
} from '../../../shared/api/system-glossary.api'

export type {
  CreateGlossaryTermInput,
  GlossaryFilterParams,
  GlossaryListResponse,
  GlossaryStatus,
  GlossaryTerm,
  RelatedTermSummary,
  UpdateGlossaryTermInput
}

export const GLOSSARY_CATEGORIES = [
  'Tất cả',
  'Khái niệm SOP',
  'Phân hệ & Kiến trúc',
  'Vai trò & Trách nhiệm',
  'Vòng đời & Trạng thái',
  'Trực quan & Canvas',
  'Bảo mật & Phân quyền',
  'AI & RAG',
  'Kiểm soát & Nhật ký'
] as const

export const ALPHABET_LETTERS = [
  'Tất cả',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
] as const

export function useSystemGlossary(initialParams?: GlossaryFilterParams) {
  const [searchQuery, setSearchQuery] = useState(initialParams?.q ?? '')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams?.category ?? 'Tất cả')
  const [selectedLetter, setSelectedLetter] = useState<string>(initialParams?.letter ?? 'Tất cả')
  const [page, setPage] = useState(initialParams?.page ?? 1)
  const [limit, setLimit] = useState(initialParams?.limit ?? 12)

  const [data, setData] = useState<GlossaryListResponse>({ items: [], total: 0, page: 1, limit: 12 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerLoading, setDrawerLoading] = useState(false)

  const fetchList = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const params: GlossaryFilterParams = {
        page,
        limit,
        q: searchQuery.trim() ? searchQuery.trim() : undefined,
        category: selectedCategory !== 'Tất cả' ? selectedCategory : undefined,
        letter: selectedLetter !== 'Tất cả' ? selectedLetter : undefined
      }
      const res = await systemGlossaryApi.list(params, signal)
      setData(res.data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách thuật ngữ')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedLetter, page, limit])

  useEffect(() => {
    const controller = new AbortController()
    fetchList(controller.signal)
    return () => controller.abort()
  }, [fetchList])

  const openDrawer = useCallback(async (termOrSlug: GlossaryTerm | string) => {
    setIsDrawerOpen(true)
    if (typeof termOrSlug === 'object') {
      setSelectedTerm(termOrSlug)
      // If it already has relatedTerms or detailedDefinition, we can show it immediately
      if (termOrSlug.relatedTerms && termOrSlug.detailedDefinition) return
    }

    const slug = typeof termOrSlug === 'string' ? termOrSlug : termOrSlug.slug
    setDrawerLoading(true)
    try {
      const res = await systemGlossaryApi.detail(slug)
      setSelectedTerm(res.data)
    } catch (err) {
      console.error('Failed to load term detail:', err)
    } finally {
      setDrawerLoading(false)
    }
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setSelectedTerm(null)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedCategory('Tất cả')
    setSelectedLetter('Tất cả')
    setPage(1)
  }, [])

  // Available letters: allow navigating through all A-Z uppercase letters
  const availableLetters = useMemo(() => {
    const letters = new Set<string>()
    for (let code = 65; code <= 90; code++) {
      letters.add(String.fromCharCode(code))
    }
    return letters
  }, [])

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / (data.limit || limit || 12)))

  return {
    items: data.items,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages,
    loading,
    error,
    reload: fetchList,
    searchQuery,
    setSearchQuery: (q: string) => { setSearchQuery(q); setPage(1) },
    selectedCategory,
    setSelectedCategory: (c: string) => { setSelectedCategory(c); setPage(1) },
    selectedLetter,
    setSelectedLetter: (l: string) => { setSelectedLetter(l); setPage(1) },
    setPage,
    setLimit: (l: number) => { setLimit(l); setPage(1) },
    resetFilters,
    availableLetters,
    selectedTerm,
    isDrawerOpen,
    drawerLoading,
    openDrawer,
    closeDrawer
  }
}

export function useGlossaryTerm(slug?: string | null) {
  const [term, setTerm] = useState<GlossaryTerm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setTerm(null)
      return
    }
    let isCancelled = false
    setLoading(true)
    setError(null)
    systemGlossaryApi
      .detail(slug)
      .then(res => {
        if (!isCancelled) setTerm(res.data)
      })
      .catch(err => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Không thể tải chi tiết thuật ngữ')
      })
      .finally(() => {
        if (!isCancelled) setLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [slug])

  return { term, loading, error }
}

export function useGuideTerms(guideId?: string | null) {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!guideId) {
      setTerms([])
      return
    }
    let isCancelled = false
    setLoading(true)
    setError(null)
    systemGlossaryApi
      .byGuide(guideId)
      .then(res => {
        if (!isCancelled) setTerms(res.data)
      })
      .catch(err => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Không thể tải thuật ngữ của hướng dẫn')
      })
      .finally(() => {
        if (!isCancelled) setLoading(false)
      })
    return () => {
      isCancelled = true
    }
  }, [guideId])

  return { terms, loading, error }
}

export function useAdminSystemGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchAdminList = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const res = await systemGlossaryApi.adminList(
        {
          q: searchQuery.trim() || undefined,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        },
        signal
      )
      setTerms(res.data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách quản trị thuật ngữ')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, categoryFilter, statusFilter])

  useEffect(() => {
    const controller = new AbortController()
    fetchAdminList(controller.signal)
    return () => controller.abort()
  }, [fetchAdminList])

  const createTerm = useCallback(async (payload: CreateGlossaryTermInput) => {
    const res = await systemGlossaryApi.create(payload)
    await fetchAdminList()
    return res.data
  }, [fetchAdminList])

  const updateTerm = useCallback(async (id: string, payload: UpdateGlossaryTermInput) => {
    const res = await systemGlossaryApi.update(id, payload)
    await fetchAdminList()
    return res.data
  }, [fetchAdminList])

  const publishTerm = useCallback(async (id: string) => {
    const res = await systemGlossaryApi.publish(id)
    await fetchAdminList()
    return res.data
  }, [fetchAdminList])

  const archiveTerm = useCallback(async (id: string) => {
    const res = await systemGlossaryApi.archive(id)
    await fetchAdminList()
    return res.data
  }, [fetchAdminList])

  const associateTerms = useCallback(async (guideId: string, termIds: string[], versionNumber = 1) => {
    const res = await systemGlossaryApi.associateGuide({ guideId, guideVersionNumber: versionNumber, termIds })
    return res.data
  }, [])

  return {
    terms,
    loading,
    error,
    reload: fetchAdminList,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    createTerm,
    updateTerm,
    publishTerm,
    archiveTerm,
    associateTerms
  }
}
