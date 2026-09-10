import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { knowledgeApi, type KnowledgeSummary } from '../../../shared/api/knowledge.api'

export interface GlobalSearchResult {
  documentId: string
  workflowId: string | null
  sopCode: string
  title: string
  description: string
}

export function useGlobalSopSearch() {
  const navigate = useNavigate()
  const [globalSearchTerm, setGlobalSearchTerm] = useState('')
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false)
  const [result, setResult] = useState<{ query: string; items: KnowledgeSummary[]; error: boolean }>({ query: '', items: [], error: false })
  const query = globalSearchTerm.trim()
  useEffect(() => {
    if (!query || !isGlobalSearchOpen) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      void knowledgeApi.search(query, controller.signal).then(response => {
        if (!controller.signal.aborted) setResult({ query, items: response.data, error: false })
      }).catch(() => {
        if (!controller.signal.aborted) setResult({ query, items: [], error: true })
      })
    }, 300)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [query, isGlobalSearchOpen])
  const normalizedQuery = query.toLocaleLowerCase()
  const globalSearchResults: GlobalSearchResult[] = (result.query === query ? result.items : [])
    .map((item): GlobalSearchResult => ({
      documentId: item.id,
      workflowId: item.workflowId,
      sopCode: item.code,
      title: item.title,
      description: item.summary || ''
    }))
    .sort((left, right) => scoreResult(right, normalizedQuery) - scoreResult(left, normalizedQuery))
    .slice(0, 8)

  const openGlobalSearchResult = (item: GlobalSearchResult) => {
    setGlobalSearchTerm('')
    setIsGlobalSearchOpen(false)
    if (item.workflowId) {
      navigate(`/employee-lifecycle/workflow/${encodeURIComponent(item.workflowId)}?sop=${encodeURIComponent(item.sopCode)}`)
    } else {
      navigate(`/employee-lifecycle/knowledge-documents/${encodeURIComponent(item.documentId)}`)
    }
  }

  const openDraftWorkspace = () => {
    setGlobalSearchTerm('')
    setIsGlobalSearchOpen(false)
    navigate('/employee-lifecycle/document-conversions')
  }


  return { globalSearchTerm, setGlobalSearchTerm, isGlobalSearchOpen, setIsGlobalSearchOpen, globalSearchResults, openGlobalSearchResult, openDraftWorkspace,
    searchLoading: Boolean(query && result.query !== query), searchError: result.query === query && result.error }
}

function scoreResult(item: GlobalSearchResult, query: string) {
  if (!query) return 0
  const code = item.sopCode.toLocaleLowerCase()
  const title = item.title.toLocaleLowerCase()
  if (code === query || title === query) return 40
  if (title.includes(query)) return 30
  if (code.includes(query)) return 25
  if ((item.description || '').toLocaleLowerCase().includes(query)) return 10
  return 0
}
