import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SOP_DATABASE } from '../../../entities/sop/model/sopDatabase'

export function useGlobalSopSearch() {
  const navigate = useNavigate()
  const [globalSearchTerm, setGlobalSearchTerm] = useState('')
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false)
  const globalSearchResults = useMemo(() => {
    const query = globalSearchTerm.trim().toLocaleLowerCase('vi-VN')
    if (!query) return []

    const seen = new Set<string>()
    return Object.entries(SOP_DATABASE).flatMap(([workflowId, processes]) => processes.map((process) => ({
      workflowId,
      sopCode: process.sopCode,
      title: process.sopTitle,
      description: process.description
    }))).filter((process) => {
      const key = `${process.workflowId}-${process.sopCode}`
      if (seen.has(key)) return false
      seen.add(key)
      return [process.sopCode, process.title, process.description].some((value) => value?.toLocaleLowerCase('vi-VN').includes(query))
    }).slice(0, 6)
  }, [globalSearchTerm])

  const openGlobalSearchResult = (workflowId: string, sopCode: string) => {
    setGlobalSearchTerm('')
    setIsGlobalSearchOpen(false)
    navigate(`/employee-lifecycle/workflow/${workflowId}?sop=${encodeURIComponent(sopCode)}`)
  }


  return { globalSearchTerm, setGlobalSearchTerm, isGlobalSearchOpen, setIsGlobalSearchOpen, globalSearchResults, openGlobalSearchResult }
}
