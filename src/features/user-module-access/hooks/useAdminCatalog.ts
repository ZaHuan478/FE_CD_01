import { useCallback, useEffect, useState } from 'react'
import { knowledgeApi, type CreateKnowledgeDocumentBody, type KnowledgeListParams, type KnowledgePage } from '../../../shared/api/knowledge.api'
import type { AdminModule, BusinessCluster, ModuleInput } from '../../../shared/api/admin-access.api'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

export type { AdminModule, BusinessCluster, ModuleInput }
export type AdminDocumentType = CreateKnowledgeDocumentBody['type']
export type AdminDocumentCreateInput = CreateKnowledgeDocumentBody

export function useAdminCatalog(params: KnowledgeListParams = {}) {
  const toast = useToast()
  const [result, setResult] = useState<KnowledgePage>({ data: [], pagination: { page: 1, pageSize: 20, total: 0 } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
    try {
      await knowledgeApi.createDocument(body)
      await load()
      toast.success('Đã tạo và công bố tài liệu')
      return true
    } catch (reason) {
      toast.error(getErrorMessage(reason, 'Không tạo được tài liệu'))
      return false
    } finally {
      setSaving(false)
    }
  }

  return { ...result, loading, saving, error, notice: null, load, createDocument }
}
