import type { SopSubProcess } from '../../../entities/sop/model/types'
import type { SopImportPreview } from '../../../shared/api/sop-import.api'

/** Existing SOPs have ordered steps, but do not require an upload/import job. */
export function workflowCanvasPreview(sop: SopSubProcess): SopImportPreview {
  const steps = sop.steps.map((step, index) => ({
    id: `step-${index + 1}`, stableKey: `step-${index + 1}`,
    code: step.stepCode, title: step.title, description: step.description,
    actor: step.actor, location: step.location, timing: step.timing,
    typeCode: step.typeCode, nodeKind: 'task' as const, sortOrder: index + 1,
    checklist: step.fieldsChecklist ?? []
  }))
  return {
    code: sop.sopCode, title: sop.sopTitle, category: sop.sopCategory,
    purpose: sop.description, primaryModuleId: '', moduleIds: [], steps,
    transitions: steps.slice(1).map((step, index) => ({
      id: `edge-${index + 1}`, fromStepId: steps[index]!.id,
      toStepId: step.id, kind: 'normal', sortOrder: index + 1
    }))
  }
}
