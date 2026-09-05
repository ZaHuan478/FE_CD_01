import type { DetailItem } from '../../module/model/lifecycle.types'
import type { SopSubProcess, SopSubStep } from '../model/types'
import { SOP_DATABASE } from '../model/sopDatabase'
import { getCrossFunctionalModule } from '../cross-functional/index'

/**
 * Normalizes SOP code for fuzzy matching across parameters & DB entries.
 * E.g., 'SOP-EMP-01', 'SOP EMP01', 'sop_emp_01' -> 'EMP01'
 */
export const normalizeSopCode = (code?: string | null): string => {
  if (!code) return ''
  return code
    .toUpperCase()
    .replace(/^SOP[-_\s]*/, '')
    .replace(/[-_\s]/g, '')
    .trim()
}

/**
 * Resolves all available SOP SubProcesses for a given workflow ID / item.
 * Supports LIFE-00..07, CF-01..08, and any dynamically registered workflow.
 */
export const resolveWorkflowSops = (
  workflowId: string,
  item?: DetailItem | null
): SopSubProcess[] => {
  // 1. Direct match in SOP_DATABASE
  if (SOP_DATABASE[workflowId] && SOP_DATABASE[workflowId].length > 0) {
    return SOP_DATABASE[workflowId]
  }

  // 2. Canonical Cross-Functional Module match
  const cfMod = getCrossFunctionalModule(workflowId)
  if (cfMod && cfMod.sopProcesses && cfMod.sopProcesses.length > 0) {
    return cfMod.sopProcesses
  }

  // 3. Fallback from DetailItem process steps
  if (item && item.process && item.process.steps && item.process.steps.length > 0) {
    const processData = item.process
    return [
      {
        sopCode: item.sopIds?.[0] || workflowId,
        sopTitle: item.title || workflowId,
        sopCategory: processData.source || item.category || 'Quy trình chuẩn hóa',
        description: item.subtitle || 'Quy trình thực thi theo các bước tuần tự chuẩn.',
        inputs: item.inputs || [],
        outputs: item.outputs || [],
        steps: processData.steps.map((stepTitle, idx) => ({
          stepCode: `${workflowId.replace(/[^A-Z0-9]/gi, '')}.${String(idx + 1).padStart(2, '0')}`,
          title: stepTitle,
          actor: item.actors?.[idx]?.name || item.actors?.[0]?.name || 'Chuyên viên phụ trách',
          location: 'Hệ thống HRMS / Portal',
          timing: 'Theo kế hoạch nghiệp vụ',
          typeCode: idx === 0 ? 'N' : idx === processData.steps.length - 1 ? 'M' : 'C',
          description: `Thực hiện ${stepTitle.toLowerCase()} theo quy chuẩn vận hành.`
        }))
      }
    ]
  }

  // 4. Safe Empty State SubProcess (prevents UI crash)
  return [
    {
      sopCode: workflowId,
      sopTitle: item?.title || workflowId,
      sopCategory: 'Chưa có dữ liệu SOP chi tiết',
      description: 'Quy trình này hiện đang được chuẩn hóa tài liệu SOP.',
      inputs: item?.inputs || [],
      outputs: item?.outputs || [],
      steps: []
    }
  ]
}

/**
 * Resolves the selected SOP based on the URL query param `?sop=...`.
 * Returns the matched SopSubProcess and its index (or 0 as default).
 */
export const resolveSelectedSop = (
  sops: SopSubProcess[],
  targetSopCode?: string | null
): { selectedSop: SopSubProcess; selectedSopIdx: number } => {
  if (!sops || sops.length === 0) {
    return {
      selectedSop: {
        sopCode: 'SOP',
        sopTitle: 'Chưa có dữ liệu',
        sopCategory: '',
        description: 'Chưa có dữ liệu',
        steps: []
      },
      selectedSopIdx: 0
    }
  }

  if (!targetSopCode) {
    return { selectedSop: sops[0], selectedSopIdx: 0 }
  }

  const cleanTarget = normalizeSopCode(targetSopCode)
  const idx = sops.findIndex((s) => {
    const cleanSop = normalizeSopCode(s.sopCode)
    return cleanSop === cleanTarget || cleanSop.includes(cleanTarget) || cleanTarget.includes(cleanSop)
  })

  if (idx !== -1) {
    return { selectedSop: sops[idx], selectedSopIdx: idx }
  }

  return { selectedSop: sops[0], selectedSopIdx: 0 }
}

export interface BusinessBriefViewModel {
  when: string
  who: string
  inputs: string[]
  outputs: string[]
}

/**
 * Selects clean, non-redundant business brief 4-cards view model.
 * Does NOT repeat title or description verbatim if already present.
 */
export const selectWorkflowBusinessBrief = (
  item: DetailItem,
  currentSop: SopSubProcess,
  language: string = 'vi'
): BusinessBriefViewModel => {
  const cfMod = getCrossFunctionalModule(item.id)

  // 1. When / Context Trigger
  let when = ''
  if (cfMod?.triggerSummary) {
    when = cfMod.triggerSummary
  } else if (currentSop.description && currentSop.description !== item.subtitle) {
    when = currentSop.description
  } else {
    when =
      language === 'vi'
        ? `Kích hoạt khi phát sinh nhu cầu "${item.title}" trong quá trình vận hành doanh nghiệp.`
        : `Activated when "${item.title}" arises during operations.`
  }

  // 2. Who / RACI Sequence
  let who = ''
  if (cfMod?.actorsMatrix) {
    who = `${cfMod.actorsMatrix.proposer.split('(')[0].trim()} (Tạo) ➔ ${cfMod.actorsMatrix.approver.split('(')[0].trim()} (Duyệt) ➔ ${cfMod.actorsMatrix.executor.split('(')[0].trim()} (Thực thi)`
  } else if (currentSop.steps.length > 0) {
    const uniqueActors = Array.from(new Set(currentSop.steps.map((s) => s.actor).filter(Boolean)))
    who = uniqueActors.slice(0, 3).join(' ➔ ')
  } else if (item.actors && item.actors.length > 0) {
    who = item.actors.map((a) => `${a.name} (${a.role})`).slice(0, 3).join(' ➔ ')
  } else {
    who = language === 'vi' ? 'Chuyên viên nhân sự & Quản lý phụ trách' : 'HR Specialist & Department Manager'
  }

  // 3. Inputs
  const rawInputs = currentSop.inputs && currentSop.inputs.length > 0
    ? currentSop.inputs
    : item.inputs && item.inputs.length > 0
      ? item.inputs
      : cfMod?.inputs && cfMod.inputs.length > 0
        ? cfMod.inputs
        : [language === 'vi' ? 'Hồ sơ yêu cầu & Chứng từ liên quan' : 'Request profile & Supporting documents']

  // 4. Outputs
  const rawOutputs = currentSop.outputs && currentSop.outputs.length > 0
    ? currentSop.outputs
    : item.outputs && item.outputs.length > 0
      ? item.outputs
      : cfMod?.outputs && cfMod.outputs.length > 0
        ? cfMod.outputs
        : [language === 'vi' ? 'Bản ghi kết quả cập nhật trên hệ thống' : 'Official updated record on system']

  return {
    when,
    who,
    inputs: rawInputs,
    outputs: rawOutputs
  }
}

/**
 * Step Type styling & label resolver
 * N = Nhập liệu, M = Duyệt / Thủ công, C = Kiểm tra / Thẩm định, A = Tự động
 */
export interface StepTypeStyle {
  code: string
  label: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  borderLight: string
  borderDark: string
}

export const selectStepTypeCode = (step?: SopSubStep): StepTypeStyle => {
  const code = step?.typeCode || 'M'

  switch (code) {
    case 'N':
      return {
        code: 'N',
        label: 'Nhập liệu',
        bgLight: 'bg-blue-100/90',
        bgDark: 'dark:bg-blue-950/90',
        textLight: 'text-blue-800',
        textDark: 'dark:text-blue-200',
        borderLight: 'border-blue-300',
        borderDark: 'dark:border-blue-800'
      }
    case 'A':
      return {
        code: 'A',
        label: 'Tự động',
        bgLight: 'bg-violet-100/90',
        bgDark: 'dark:bg-violet-950/90',
        textLight: 'text-violet-800',
        textDark: 'dark:text-violet-200',
        borderLight: 'border-violet-300',
        borderDark: 'dark:border-violet-800'
      }
    case 'C':
      return {
        code: 'C',
        label: 'Kiểm tra',
        bgLight: 'bg-amber-100/90',
        bgDark: 'dark:bg-amber-950/90',
        textLight: 'text-amber-800',
        textDark: 'dark:text-amber-200',
        borderLight: 'border-amber-300',
        borderDark: 'dark:border-amber-800'
      }
    case 'M':
    default:
      return {
        code: 'M',
        label: 'Thủ công / Duyệt',
        bgLight: 'bg-emerald-100/90',
        bgDark: 'dark:bg-emerald-950/90',
        textLight: 'text-emerald-800',
        textDark: 'dark:text-emerald-200',
        borderLight: 'border-emerald-300',
        borderDark: 'dark:border-emerald-800'
      }
  }
}
