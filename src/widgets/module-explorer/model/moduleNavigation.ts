import { adminAccessApi, type AdminModule, type BusinessCluster } from '../../../shared/api/admin-access.api'
import { knowledgeApi, type KnowledgeSummary } from '../../../shared/api/knowledge.api'

export type { AdminModule, BusinessCluster, KnowledgeSummary }

export function visibleNavigationModules(modules: AdminModule[], cluster: BusinessCluster) {
  return modules.filter(module => module.status === 'published' && (module.businessCluster ?? 'core') === cluster)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, 'vi'))
}

export function publishedSopDestination(document: Pick<KnowledgeSummary, 'id' | 'code' | 'workflowId'>) {
  return `/employee-lifecycle/knowledge-documents/${encodeURIComponent(document.id)}`
}

export async function fetchPublishedSopsForModule(moduleId: string, signal?: AbortSignal): Promise<KnowledgeSummary[]> {
  const collected: KnowledgeSummary[] = []
  let page = 1
  do {
    const result = await knowledgeApi.catalogDocuments({ moduleId, type: 'procedure', page, pageSize: 50 }, signal)
    if (Array.isArray(result?.data)) {
      collected.push(...result.data)
    }
    const total = result?.pagination?.total ?? 0
    if (total <= 0 || collected.length >= total || !result?.data?.length) break
    page += 1
  } while (page <= 5)
  return collected
}

export async function fetchNavigationModules(signal?: AbortSignal): Promise<AdminModule[]> {
  const result = await adminAccessApi.modules(signal)
  return result.items
}

export async function fetchModuleDocuments(moduleId: string, signal?: AbortSignal): Promise<KnowledgeSummary[]> {
  const collected: KnowledgeSummary[] = []
  let page = 1
  do {
    const result = await knowledgeApi.catalogDocuments({ moduleId, type: 'procedure', page, pageSize: 100 }, signal)
    if (Array.isArray(result?.data)) {
      collected.push(...result.data)
    }
    const total = result?.pagination?.total ?? 0
    if (total <= 0 || collected.length >= total || !result?.data?.length) break
    page += 1
  } while (page <= 10)
  return collected
}
