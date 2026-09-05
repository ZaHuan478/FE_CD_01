import React from 'react'
import {
  Users,
  Clock,
  CircleDollarSign,
  ClipboardCheck,
  CalendarDays,
  PanelsTopLeft,
  Receipt,
  ShieldCheck,
  Target
} from 'lucide-react'
import {
  getCoreOperationsData,
  type CoreOperationModuleResolved,
  type CoreOperationSop,
  type CoreOperationStageWithSops
} from '../../sop/lib/coreOperationsSelectors'

export interface ModuleStage {
  stageId: string
  stageNumber: number
  stageTitle: string
  stageTitleEn: string
  description: string
  descriptionEn: string
  sopCodes: string[]
}

export interface SopDetailItem {
  code: string
  title: string
  titleEn?: string
  type: 'N' | 'M' | 'A' | 'C'
  stepTypes?: ('N' | 'M' | 'A' | 'C')[]
  stageNumber?: number
  stageTitle?: string
  stageId?: string
  actor?: string
  actorEn?: string
  scopeNote?: string
  scopeNoteEn?: string
  inputs?: string[]
  inputsEn?: string[]
  outputs?: string[]
  outputsEn?: string[]
  workflowId?: string
  wireframeId?: string
  hasWireframe?: boolean
  isInheritedFromATS?: boolean
  description?: string
  rules?: string[]
  sourceNote?: string
  notes?: string[]
}

export interface ModuleEcosystemItem {
  id: string
  code: string
  name: string
  nameEn: string
  shortLabel: string
  sopCount: string
  percentage: string
  subFeatures: string[]
  subFeaturesEn: string[]
  plainExplanation: string
  plainExplanationEn: string
  receivesFrom: string
  receivesFromEn: string
  sendsTo: string
  sendsToEn: string
  stages?: ModuleStage[]
  sopList: SopDetailItem[]
  color: string
  gradient: string
  border: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  icon: React.ReactNode
  angleDeg: number
}

const MODULE_VISUALS: Record<string, {
  color: string
  gradient: string
  border: string
  bgLight: string
  bgDark: string
  textLight: string
  textDark: string
  icon: React.ReactNode
  angleDeg: number
  subFeatures: string[]
  subFeaturesEn: string[]
}> = {
  ats: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <Target className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 0,
    subFeatures: ['Kế hoạch định biên và đăng tin', 'Sàng lọc CV và phỏng vấn', 'Phát hành Offer và chuẩn bị tiếp nhận'],
    subFeaturesEn: ['Requisition and job posting', 'CV screening and interviews', 'Offer generation and pre-onboarding']
  },
  emp: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <Users className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 40,
    subFeatures: ['Tiếp nhận nhân viên và hồ sơ', 'Hợp đồng lao động và thử việc', 'Điều động, thu nhập và nghỉ việc'],
    subFeaturesEn: ['Onboarding and profile management', 'Labor contracts and probation', 'Transfers, compensation and offboarding']
  },
  onb: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <ClipboardCheck className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 80,
    subFeatures: ['Chuẩn bị trước nhận việc', 'Tiếp nhận ngày đầu', 'Hội nhập và bàn giao vận hành'],
    subFeaturesEn: ['Pre-boarding preparation', 'First-day intake', 'Orientation and operational handoff']
  },
  att: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <Clock className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 120,
    subFeatures: ['Lịch làm việc và ca kíp', 'Làm thêm giờ và công bất thường', 'Đối soát và chốt bảng công'],
    subFeaturesEn: ['Shift scheduling and rosters', 'Overtime and clock exceptions', 'Punch reconciliation and timesheet lock']
  },
  leave: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <CalendarDays className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 160,
    subFeatures: ['Đăng ký và phê duyệt nghỉ', 'Theo dõi số dư phép', 'Quyết toán phép và chế độ đặc thù'],
    subFeaturesEn: ['Leave requests and approvals', 'Leave balance tracking', 'Leave finalization and special regimes']
  },
  pay: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <CircleDollarSign className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 200,
    subFeatures: ['Tạm ứng và lương tháng', 'Lương thôi việc và thưởng', 'Khấu trừ thuế và bảo hiểm'],
    subFeaturesEn: ['Salary advances and regular pay', 'Final settlement and bonuses', 'Tax and insurance deductions']
  },
  ins: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 240,
    subFeatures: ['Hồ sơ bảo hiểm và VssID', 'Báo tăng, giảm và điều chỉnh', 'Giải quyết chế độ ốm đau, thai sản'],
    subFeaturesEn: ['Insurance registration and VssID', 'Headcount increase/decrease', 'Sickness and maternity claims']
  },
  tax: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <Receipt className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 280,
    subFeatures: ['Đăng ký MST và người phụ thuộc', 'Khấu trừ và kê khai tạm nộp', 'Ủy quyền quyết toán thuế năm'],
    subFeaturesEn: ['Tax ID and dependent registration', 'Withholding and periodic returns', 'Annual PIT finalization']
  },
  ess: {
    color: '#1f5f86',
    gradient: 'from-[#1f5f86] to-[#2e8bbd]',
    border: 'border-sky-200 dark:border-sky-800',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-[#1f5f86]',
    textDark: 'dark:text-sky-300',
    icon: <PanelsTopLeft className="h-5 w-5" strokeWidth={1.8} />,
    angleDeg: 320,
    subFeatures: ['Nhân viên tự tra cứu và gửi yêu cầu', 'Quản lý phê duyệt và theo dõi đội ngũ', 'Điều phối giao dịch về phân hệ nguồn'],
    subFeaturesEn: ['Employee inquiries and requests', 'Manager approvals and team overview', 'Transaction routing to source modules']
  }
}

const mapCoreSopToDetailItem = (sop: CoreOperationSop): SopDetailItem => ({
  code: sop.canonicalCode,
  title: sop.sopTitle,
  titleEn: sop.sopTitle,
  type: sop.primaryType,
  stepTypes: sop.stepTypes,
  stageNumber: sop.stageNumber,
  stageTitle: sop.stageTitle,
  stageId: sop.stageId,
  actor: sop.primaryActor,
  actorEn: sop.primaryActor,
  scopeNote: sop.description,
  scopeNoteEn: sop.description,
  inputs: sop.inputs,
  inputsEn: sop.inputs,
  outputs: sop.outputs,
  outputsEn: sop.outputs,
  workflowId: sop.workflowId,
  wireframeId: sop.wireframeId,
  hasWireframe: sop.hasWireframe,
  isInheritedFromATS: sop.canonicalCode === 'SOP-EMP-02' || sop.canonicalCode === 'SOP-EMP-03',
  description: sop.description,
  rules: sop.rules,
  sourceNote: sop.sourceNote,
  notes: sop.notes
})

const buildCoreOperationModules = (): ModuleEcosystemItem[] => {
  const resolvedModules = getCoreOperationsData()

  return resolvedModules.map((mod: CoreOperationModuleResolved) => {
    const visual = MODULE_VISUALS[mod.id] || MODULE_VISUALS.emp

    const stages: ModuleStage[] = mod.stagesWithSops.map((stg: CoreOperationStageWithSops) => ({
      stageId: stg.stageId,
      stageNumber: stg.stageNumber,
      stageTitle: stg.stageTitle,
      stageTitleEn: stg.stageTitleEn,
      description: stg.description,
      descriptionEn: stg.descriptionEn,
      sopCodes: stg.sops.map((s: CoreOperationSop) => s.canonicalCode)
    }))

    const sopList: SopDetailItem[] = mod.allSops.map(mapCoreSopToDetailItem)

    return {
      id: mod.id,
      code: mod.code,
      name: mod.name,
      nameEn: mod.nameEn,
      shortLabel: mod.shortLabel,
      sopCount: `${mod.sopCount} SOPs`,
      percentage: '100%',
      subFeatures: visual.subFeatures,
      subFeaturesEn: visual.subFeaturesEn,
      plainExplanation: mod.plainExplanation,
      plainExplanationEn: mod.plainExplanationEn,
      receivesFrom: mod.receivesFrom,
      receivesFromEn: mod.receivesFromEn,
      sendsTo: mod.sendsTo,
      sendsToEn: mod.sendsToEn,
      stages,
      sopList,
      color: visual.color,
      gradient: visual.gradient,
      border: visual.border,
      bgLight: visual.bgLight,
      bgDark: visual.bgDark,
      textLight: visual.textLight,
      textDark: visual.textDark,
      icon: visual.icon,
      angleDeg: visual.angleDeg
    }
  })
}

// Single source of truth dynamically resolved from SOP_DATABASE
export const CORE_OPERATION_MODULES: ModuleEcosystemItem[] = buildCoreOperationModules()

// Backwards compatibility aliases
export const SIX_CORE_MODULES: ModuleEcosystemItem[] = CORE_OPERATION_MODULES
export const FIVE_CORE_MODULES: ModuleEcosystemItem[] = CORE_OPERATION_MODULES
