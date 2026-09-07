import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { knowledgeApi, type KnowledgeSummary } from '../../../shared/api/knowledge.api'

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
  const globalSearchResults = (result.query === query ? result.items : []).filter(item => item.workflowId).map(item => ({
    workflowId: item.workflowId!, sopCode: item.code, title: item.title, description: item.summary
  }))

  const openGlobalSearchResult = (workflowId: string, sopCode: string) => {
    setGlobalSearchTerm('')
    setIsGlobalSearchOpen(false)
    navigate(`/employee-lifecycle/workflow/${encodeURIComponent(workflowId)}?sop=${encodeURIComponent(sopCode)}`)
  }


  return { globalSearchTerm, setGlobalSearchTerm, isGlobalSearchOpen, setIsGlobalSearchOpen, globalSearchResults, openGlobalSearchResult,
    searchLoading: Boolean(query && result.query !== query), searchError: result.query === query && result.error }
}
