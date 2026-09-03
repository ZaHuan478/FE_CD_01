import { knowledgeDatabase } from './dbClient'
import type { DatabaseBootstrapResult, SqlValue } from './types'

export interface PublishedProcessRow extends Record<string, unknown> {
  id: string
  code: string
  title: string
  category: string
  definition: string
  purpose: string
  scope: string
  versionId: string
  versionNumber: number
  publishedAt: string | null
}

export interface ProcessStepRow extends Record<string, unknown> {
  id: string
  stableKey: string
  code: string
  title: string
  description: string
  actor: string
  location: string
  timing: string
  nodeKind: string
  typeCode: string
  sortOrder: number
  checklistJson: string
}

export interface PolicyAcknowledgement {
  acknowledged: boolean
  acknowledgedAt: string | null
}

export const knowledgeRepository = {
  listPublishedProcesses(searchTerm = ''): Promise<PublishedProcessRow[]> {
    const search = `%${searchTerm.trim()}%`
    return knowledgeDatabase.query<PublishedProcessRow>(`
      SELECT
        p.id,
        p.code,
        p.title,
        p.category,
        p.definition,
        p.purpose,
        p.scope,
        pv.id AS versionId,
        pv.version_number AS versionNumber,
        pv.published_at AS publishedAt
      FROM process p
      JOIN process_version pv ON pv.id = p.current_published_version_id
      WHERE pv.publication_status = 'published'
        AND (? = '%%' OR p.code LIKE ? COLLATE NOCASE OR p.title LIKE ? COLLATE NOCASE OR p.definition LIKE ? COLLATE NOCASE)
      ORDER BY p.code
    `, [search, search, search, search])
  },

  getProcessSteps(versionId: string): Promise<ProcessStepRow[]> {
    return knowledgeDatabase.query<ProcessStepRow>(`
      SELECT
        id,
        stable_key AS stableKey,
        code,
        title,
        description,
        actor,
        location,
        timing,
        node_kind AS nodeKind,
        type_code AS typeCode,
        sort_order AS sortOrder,
        checklist_json AS checklistJson
      FROM process_step
      WHERE process_version_id = ?
      ORDER BY sort_order, code
    `, [versionId])
  },

  query<T extends Record<string, unknown>>(sql: string, params?: SqlValue[]): Promise<T[]> {
    return knowledgeDatabase.query<T>(sql, params)
  },

  async replaceDataset(datasetKey: string, value: unknown): Promise<void> {
    await knowledgeDatabase.execute(
      'UPDATE app_dataset SET payload_json = ?, updated_at = ? WHERE dataset_key = ?',
      [JSON.stringify(value), new Date().toISOString(), datasetKey]
    )
  },

  async getPolicyAcknowledgement(policyId: string): Promise<PolicyAcknowledgement> {
    const [latest] = await knowledgeDatabase.query<{
      operation: string
      patchJson: string
    }>(`
      SELECT operation, patch_json AS patchJson
      FROM local_change
      WHERE entity_type = 'policy_acknowledgement' AND entity_id = ?
      ORDER BY id DESC
      LIMIT 1
    `, [policyId])

    if (!latest || latest.operation === 'delete') {
      return { acknowledged: false, acknowledgedAt: null }
    }

    try {
      const patch = JSON.parse(latest.patchJson) as { acknowledgedAt?: string }
      return { acknowledged: true, acknowledgedAt: patch.acknowledgedAt ?? null }
    } catch {
      return { acknowledged: false, acknowledgedAt: null }
    }
  },

  async setPolicyAcknowledgement(
    policyId: string,
    acknowledgedAt: string | null
  ): Promise<void> {
    await knowledgeDatabase.execute(`
      INSERT INTO local_change
        (entity_type, entity_id, operation, base_hash, patch_json, changed_at)
      VALUES ('policy_acknowledgement', ?, ?, NULL, ?, ?)
    `, [
      policyId,
      acknowledgedAt ? 'upsert' : 'delete',
      JSON.stringify(acknowledgedAt ? { acknowledgedAt } : {}),
      new Date().toISOString()
    ])
  }
}

export async function exportKnowledgeDatabase(): Promise<void> {
  const bytes = await knowledgeDatabase.exportFile()
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.sqlite3' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `hrm-knowledge-backup-${new Date().toISOString().slice(0, 10)}.sqlite`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importKnowledgeDatabase(file: File): Promise<DatabaseBootstrapResult> {
  const result = await knowledgeDatabase.importFile(await file.arrayBuffer())
  window.location.reload()
  return result
}

export async function resetKnowledgeDatabase(): Promise<DatabaseBootstrapResult> {
  const result = await knowledgeDatabase.reset()
  window.location.reload()
  return result
}
