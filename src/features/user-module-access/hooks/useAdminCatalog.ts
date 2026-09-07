import { useCallback, useEffect, useState } from 'react'
import { knowledgeApi, type CreateKnowledgeDocumentBody, type KnowledgeListParams, type KnowledgePage } from '../../../shared/api/knowledge.api'

export type AdminDocumentType = CreateKnowledgeDocumentBody['type']
export type AdminDocumentCreateInput = CreateKnowledgeDocumentBody

export function useAdminCatalog(params: KnowledgeListParams = {}) {
  const [result, setResult] = useState<KnowledgePage>({ data: [], pagination: { page: 1, pageSize: 20, total: 0 } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const { q = '', moduleId = '', type = 'all', page = 1, pageSize = 20 } = params

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      setResult(await knowledgeApi.catalogDocuments({ q, moduleId, type, page, pageSize }, signal))
    } catch (reason) {
      if (!signal?.aborted) setError(reason instanceof Error ? reason.message : 'Không tải được danh mục tài liệu')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [q, moduleId, type, page, pageSize])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const createDocument = async (body: CreateKnowledgeDocumentBody) => {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await knowledgeApi.createDocument(body)
      await load()
      setNotice('Đã tạo và công bố tài liệu')
      return true
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không tạo được tài liệu')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { ...result, loading, saving, error, notice, load, createDocument }
}
