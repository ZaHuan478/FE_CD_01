import { useCallback, useEffect, useState } from 'react'
import {
  myDocumentsApi,
  type UserDocumentItem
} from '../../../shared/api/my-documents.api'
import { getErrorMessage, isAbortError } from '../../../shared/lib/errors/apiError'

interface UseDocumentConversionDocumentsOptions {
  search: string
  format: 'all' | 'docx' | 'pdf'
  page: number
  pageSize: number
}

export function useDocumentConversionDocuments({
  search,
  format,
  page,
  pageSize
}: UseDocumentConversionDocumentsOptions) {
  const [items, setItems] = useState<UserDocumentItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const requestTimer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      void myDocumentsApi.list({ tab: 'active', search, format, page, pageSize }, controller.signal)
        .then((response) => {
          setItems(response.data.items)
          setTotal(response.data.total)
          setTotalPages(response.data.totalPages)
        })
        .catch((reason) => {
          if (!isAbortError(reason)) {
            setError(getErrorMessage(reason, 'Không tải được tài liệu để chuyển hóa'))
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 0)

    return () => {
      window.clearTimeout(requestTimer)
      controller.abort()
    }
  }, [format, page, pageSize, reloadToken, search])

  const refresh = useCallback(() => setReloadToken(value => value + 1), [])

  return { items, total, totalPages, loading, error, refresh }
}

export type { UserDocumentItem }
