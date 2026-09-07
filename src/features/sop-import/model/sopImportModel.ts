import { useEffect, useState } from 'react'
import { apiRequest } from '../../../shared/api/httpClient'
import { sopImportApi } from '../../../shared/api/sop-import.api'

export type { SopImportItem, SopImportPreview, SopImportStep } from '../../../shared/api/sop-import.api'
export { sopImportApi }

export interface SopImportModule {
  id: string
  code: string
  title: string
  status: 'draft' | 'published' | 'archived'
}

export function useSopImportModules() {
  const [modules, setModules] = useState<SopImportModule[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    void apiRequest<{ items: SopImportModule[] }>('/modules', { signal: controller.signal })
      .then(result => setModules(result.items.filter(module => module.status === 'published')))
      .catch(reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được phân hệ') })
    return () => controller.abort()
  }, [])
  return { modules, error }
}
