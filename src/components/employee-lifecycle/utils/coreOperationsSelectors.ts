import { SOP_DATABASE } from '../workflow-detail/data/sopDatabase'
import type { SopSubProcess, SopSubStep } from '../workflow-detail/types'
import {
  CORE_OPERATIONS_STAGE_MAP,
  WORKFLOW_ID_BY_SOP_CODE,
  KNOWN_WIREFRAME_IDS,
  type ModuleMetadata,
  type StageDefinition,
  type CoreOperationModuleId
} from '../data/coreOperationsStageMap'

export type StepTypeCode = 'N' | 'M' | 'C' | 'A'

export interface CoreOperationSop {
  sopCode: string
  canonicalCode: string
  sopTitle: string
  sopCategory: string
  description: string
  moduleId: CoreOperationModuleId
  stageId: string
  stageNumber: number
  stageTitle: string
  workflowId: string
  hasWireframe: boolean
  wireframeId?: string
  stepTypes: StepTypeCode[]
  primaryType: StepTypeCode
  primaryActor: string
  allActors: string[]
  inputs: string[]
  isInputsInferred?: boolean
  outputs: string[]
  isOutputsInferred?: boolean
  rules: string[]
  sourceNote?: string
  notes?: string[]
  steps: SopSubStep[]
  downstreamModule?: string
  downstreamHandoffNote?: string
}

export interface CoreOperationStageWithSops {
  stageId: string
  stageNumber: number
  stageTitle: string
  stageTitleEn: string
  description: string
  descriptionEn: string
  sopCount: number
  sops: CoreOperationSop[]
}

export interface CoreOperationModuleResolved extends ModuleMetadata {
  sopCount: number
  stagesWithSops: CoreOperationStageWithSops[]
  allSops: CoreOperationSop[]
}

export const canonicalizeSopCode = (rawCode?: string): string => {
  if (!rawCode) return ''
  const trimmed = rawCode.trim().toUpperCase()

  // Match pattern like SOP-REC-01, SOP REC01, SOP-EMP-02, SOPATT01, PAY-01, etc.
  const recMatch = trimmed.match(/(?:SOP[-_\s]*)?REC[-_\s]*(\d+)/i)
  if (recMatch) {
    return `SOP-REC-${recMatch[1].padStart(2, '0')}`
  }

  const empMatch = trimmed.match(/(?:SOP[-_\s]*)?EMP[-_\s]*(\d+)/i)
  if (empMatch) {
    return `SOP-EMP-${empMatch[1].padStart(2, '0')}`
  }

  const onbMatch = trimmed.match(/(?:SOP[-_\s]*)?ONB[-_\s]*(\d+)/i)
  if (onbMatch) {
    return `SOP-ONB-${onbMatch[1].padStart(2, '0')}`
  }

  const attMatch = trimmed.match(/(?:SOP[-_\s]*)?ATT[-_\s]*(\d+)/i)
  if (attMatch) {
    return `SOP-ATT-${attMatch[1].padStart(2, '0')}`
  }

  const payMatch = trimmed.match(/(?:SOP[-_\s]*)?PAY[-_\s]*(\d+)/i)
  if (payMatch) {
    return `SOP-PAY-${payMatch[1].padStart(2, '0')}`
  }

  const insMatch = trimmed.match(/(?:SOP[-_\s]*)?INS[-_\s]*(\d+)/i)
  if (insMatch) {
    return `SOP-INS-${insMatch[1].padStart(2, '0')}`
  }

  const taxMatch = trimmed.match(/(?:SOP[-_\s]*)?TAX[-_\s]*(\d+)/i)
  if (taxMatch) {
    return `SOP-TAX-${taxMatch[1].padStart(2, '0')}`
  }

  const essMatch = trimmed.match(/(?:SOP[-_\s]*)?ESS[-_\s]*(\d+)/i)
  if (essMatch) {
    return `SOP-ESS-${essMatch[1].padStart(2, '0')}`
  }

  const mssMatch = trimmed.match(/(?:SOP[-_\s]*)?MSS[-_\s]*(\d+)/i)
  if (mssMatch) {
    return `SOP-MSS-${mssMatch[1].padStart(2, '0')}`
  }

  return trimmed
}

const getModuleIdByPrefix = (canonicalCode: string): CoreOperationModuleId | null => {
  if (canonicalCode.startsWith('SOP-REC-')) return 'ats'
  if (canonicalCode.startsWith('SOP-EMP-')) return 'emp'
  if (canonicalCode.startsWith('SOP-ONB-')) return 'onb'
  if (canonicalCode.startsWith('SOP-ATT-')) return 'att'
  if (canonicalCode.startsWith('SOP-PAY-')) return 'pay'
  if (canonicalCode.startsWith('SOP-INS-')) return 'ins'
  if (canonicalCode.startsWith('SOP-TAX-')) return 'tax'
  if (canonicalCode.startsWith('SOP-ESS-') || canonicalCode.startsWith('SOP-MSS-')) return 'ess'
  return null
}

const cleanTitle = (rawTitle: string): string => {
  return rawTitle
    .replace(/^Lưu đồ quy trình\s+/i, '')
    .replace(/^Quy trình\s+/i, '')
    .replace(/\s+&\s+/g, ' và ')
    .trim()
}

const extractStepTypes = (steps: SopSubStep[]): StepTypeCode[] => {
  const types = new Set<StepTypeCode>()
  for (const step of steps) {
    const raw = (step.typeCode || (step as any).sourceTypeCode || '').toUpperCase()
    if (raw === 'N') types.add('N')
    else if (raw === 'M') types.add('M')
    else if (raw === 'C') types.add('C')
    else if (raw === 'A') types.add('A')
  }
  if (types.size === 0) {
    types.add('N')
  }
  return Array.from(types)
}

const determinePrimaryType = (types: StepTypeCode[]): StepTypeCode => {
  if (types.includes('M')) return 'M'
  if (types.includes('C')) return 'C'
  if (types.includes('A')) return 'A'
  return 'N'
}

const getFallbackInputsForSop = (process: SopSubProcess, _canonicalCode?: string): { inputs: string[]; isInputsInferred: boolean } => {
  if (process.inputs && process.inputs.length > 0 && process.inputs.some(i => i && i.trim().length > 0)) {
    return { inputs: process.inputs.filter(Boolean), isInputsInferred: false }
  }

  // Derive from step fieldsChecklist
  const collectedFields: string[] = []
  for (const step of process.steps) {
    if (step.fieldsChecklist && step.fieldsChecklist.length > 0) {
      for (const field of step.fieldsChecklist) {
        if (field && field.trim().length > 0 && !collectedFields.includes(field)) {
          collectedFields.push(field)
        }
      }
    }
  }

  if (collectedFields.length > 0) {
    return {
      inputs: collectedFields.slice(0, 5),
      isInputsInferred: true
    }
  }

  // Default inferred context based on step title
  const firstStep = process.steps[0]
  if (firstStep) {
    return {
      inputs: [
        `Dữ liệu khởi tạo nghiệp vụ (${firstStep.title})`,
        `Quy định và phân quyền của ${firstStep.actor || 'người thực hiện'}`
      ],
      isInputsInferred: true
    }
  }

  return {
    inputs: ['Dữ liệu giao dịch phát sinh trong kỳ', 'Chính sách vận hành doanh nghiệp'],
    isInputsInferred: true
  }
}

const getFallbackOutputsForSop = (process: SopSubProcess, _canonicalCode?: string): { outputs: string[]; isOutputsInferred: boolean } => {
  if (process.outputs && process.outputs.length > 0 && process.outputs.some(o => o && o.trim().length > 0)) {
    return { outputs: process.outputs.filter(Boolean), isOutputsInferred: false }
  }

  const lastStep = process.steps[process.steps.length - 1]
  if (lastStep) {
    return {
      outputs: [
        `Kết quả hoàn tất: ${lastStep.title}`,
        'Dữ liệu được lưu vết và chuyển tiếp sang bước nghiệp vụ tiếp theo'
      ],
      isOutputsInferred: true
    }
  }

  return {
    outputs: ['Hồ sơ ghi nhận hệ thống', 'Nhật ký kiểm toán lưu vết'],
    isOutputsInferred: true
  }
}

let cachedCoreOperationsData: CoreOperationModuleResolved[] | null = null

export const getCoreOperationsData = (): CoreOperationModuleResolved[] => {
  if (cachedCoreOperationsData) {
    return cachedCoreOperationsData
  }

  // 1. Flatten all SOPs from SOP_DATABASE
  const rawSopMap = new Map<string, { process: SopSubProcess; sourceWorkflowId: string }>()

  for (const [workflowId, processes] of Object.entries(SOP_DATABASE)) {
    for (const process of processes) {
      const canonical = canonicalizeSopCode(process.sopCode)
      if (!canonical) continue
      const modId = getModuleIdByPrefix(canonical)
      if (!modId) continue

      if (!rawSopMap.has(canonical)) {
        rawSopMap.set(canonical, { process, sourceWorkflowId: workflowId })
      }
    }
  }

  // 2. Build map of stage definitions by canonical SOP code
  const sopToStageMap = new Map<string, { stage: StageDefinition; moduleId: CoreOperationModuleId }>()

  for (const [modKey, modMeta] of Object.entries(CORE_OPERATIONS_STAGE_MAP)) {
    const moduleId = modKey as CoreOperationModuleId
    for (const stage of modMeta.stages) {
      for (const rawCode of stage.sopCodes) {
        const canonical = canonicalizeSopCode(rawCode)
        sopToStageMap.set(canonical, { stage, moduleId })
      }
    }
  }

  // 3. Process each canonical SOP
  const resolvedSopsByModule: Record<string, CoreOperationSop[]> = {
    ats: [],
    emp: [],
    onb: [],
    att: [],
    leave: [],
    pay: [],
    ins: [],
    tax: [],
    ess: []
  }

  for (const [canonicalCode, { process: currentProcess, sourceWorkflowId }] of rawSopMap.entries()) {
    const stageInfo = sopToStageMap.get(canonicalCode)
    const moduleId = stageInfo?.moduleId ?? getModuleIdByPrefix(canonicalCode)
    if (!moduleId) continue
    const moduleMetadata = CORE_OPERATIONS_STAGE_MAP[moduleId]
    if (!moduleMetadata) continue
    const stageId = stageInfo?.stage.stageId || `${moduleId.toUpperCase()}_STG_UNASSIGNED`
    const stageNumber = stageInfo?.stage.stageNumber || 99
    const stageTitle = stageInfo?.stage.stageTitle || 'Chặng: Chưa phân loại'

    if (!stageInfo && import.meta.env.DEV) {
      console.warn(`[CoreOperations] SOP code ${canonicalCode} is not assigned to any stage in CORE_OPERATIONS_STAGE_MAP.`)
    }

    const workflowId = WORKFLOW_ID_BY_SOP_CODE[canonicalCode] || sourceWorkflowId || moduleMetadata.workflowIdDefault
    const hasWireframe = KNOWN_WIREFRAME_IDS.has(workflowId)
    const stepTypes = extractStepTypes(currentProcess.steps)
    const primaryType = determinePrimaryType(stepTypes)

    const actorsSet = new Set<string>()
    for (const step of currentProcess.steps) {
      if (step.actor && step.actor.trim().length > 0) {
        actorsSet.add(step.actor.trim())
      }
    }
    const allActors = Array.from(actorsSet)
    const primaryActor = allActors[0] || (currentProcess.steps[0]?.actor) || 'Chuyên viên Nhân sự'

    const { inputs, isInputsInferred } = getFallbackInputsForSop(currentProcess, canonicalCode)
    const { outputs, isOutputsInferred } = getFallbackOutputsForSop(currentProcess, canonicalCode)

    const resolvedSop: CoreOperationSop = {
      sopCode: canonicalCode,
      canonicalCode,
      sopTitle: cleanTitle(currentProcess.sopTitle || canonicalCode),
      sopCategory: currentProcess.sopCategory || moduleMetadata.name,
      description: currentProcess.description || `Quy trình thực hiện chi tiết nghiệp vụ ${cleanTitle(currentProcess.sopTitle || canonicalCode)}.`,
      moduleId,
      stageId,
      stageNumber,
      stageTitle,
      workflowId,
      hasWireframe,
      wireframeId: hasWireframe ? workflowId : undefined,
      stepTypes,
      primaryType,
      primaryActor,
      allActors,
      inputs,
      isInputsInferred,
      outputs,
      isOutputsInferred,
      rules: currentProcess.rules || [],
      sourceNote: currentProcess.sourceNote,
      notes: currentProcess.notes,
      steps: currentProcess.steps || []
    }

    resolvedSopsByModule[moduleId].push(resolvedSop)
  }

  // 4. Assemble the resolved modules in end-to-end operating order
  const moduleKeys = (['ats', 'emp', 'onb', 'att', 'leave', 'pay', 'ins', 'tax', 'ess'] as const)
    .filter((moduleId) => Boolean(CORE_OPERATIONS_STAGE_MAP[moduleId]))

  const result: CoreOperationModuleResolved[] = moduleKeys.map((modId) => {
    const meta = CORE_OPERATIONS_STAGE_MAP[modId]
    const allSopsForMod = resolvedSopsByModule[modId] || []

    // Sort SOPs by numerical code (e.g. SOP-REC-01 -> SOP-REC-11)
    allSopsForMod.sort((a, b) => {
      const numA = parseInt(a.canonicalCode.replace(/\D/g, ''), 10) || 0
      const numB = parseInt(b.canonicalCode.replace(/\D/g, ''), 10) || 0
      return numA - numB
    })

    // Group into defined stages
    const stagesWithSops: CoreOperationStageWithSops[] = meta.stages.map((stg) => {
      const stageCanonicalSet = new Set(stg.sopCodes.map(canonicalizeSopCode))
      const stageSops = allSopsForMod.filter(s => stageCanonicalSet.has(s.canonicalCode))
      return {
        stageId: stg.stageId,
        stageNumber: stg.stageNumber,
        stageTitle: stg.stageTitle,
        stageTitleEn: stg.stageTitleEn,
        description: stg.description,
        descriptionEn: stg.descriptionEn,
        sopCount: stageSops.length,
        sops: stageSops
      }
    })

    // Check for any unassigned SOPs
    const assignedCodes = new Set(meta.stages.flatMap(s => s.sopCodes.map(canonicalizeSopCode)))
    const unassignedSops = allSopsForMod.filter(s => !assignedCodes.has(s.canonicalCode))

    if (unassignedSops.length > 0) {
      stagesWithSops.push({
        stageId: `${modId.toUpperCase()}_STG_UNASSIGNED`,
        stageNumber: meta.stages.length + 1,
        stageTitle: `Chặng ${meta.stages.length + 1}: Quy trình bổ sung`,
        stageTitleEn: `Stage ${meta.stages.length + 1}: Additional Processes`,
        description: 'Các quy trình bổ sung thuộc phân hệ.',
        descriptionEn: 'Additional processes within the module.',
        sopCount: unassignedSops.length,
        sops: unassignedSops
      })
    }

    return {
      ...meta,
      sopCount: allSopsForMod.length,
      stagesWithSops,
      allSops: allSopsForMod
    }
  })

  cachedCoreOperationsData = result
  return result
}

export const getCoreOperationModuleById = (moduleId: string): CoreOperationModuleResolved => {
  const allMods = getCoreOperationsData()
  const found = allMods.find(m => m.id === moduleId)
  return found || allMods[0]
}

export const getCoreOperationSopByCode = (sopCode?: string, moduleId?: string): CoreOperationSop | null => {
  if (!sopCode) return null
  const canonical = canonicalizeSopCode(sopCode)
  const allMods = getCoreOperationsData()

  if (moduleId) {
    const mod = allMods.find(m => m.id === moduleId)
    const foundInMod = mod?.allSops.find(s => s.canonicalCode === canonical)
    if (foundInMod) return foundInMod
  }

  for (const mod of allMods) {
    const match = mod.allSops.find(s => s.canonicalCode === canonical)
    if (match) return match
  }

  return null
}

export const filterCoreOperationSops = (
  sops: CoreOperationSop[],
  typeFilter: 'ALL' | StepTypeCode,
  stageId?: string
): CoreOperationSop[] => {
  return sops.filter((sop) => {
    if (stageId && stageId !== 'ALL' && sop.stageId !== stageId) {
      return false
    }
    if (typeFilter === 'ALL') {
      return true
    }
    return sop.stepTypes.includes(typeFilter)
  })
}
