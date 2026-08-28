import type { OperationModule } from '../../../types/employee-lifecycle'
import { CROSS_FUNCTIONAL_MODULES_LIST } from '../cross-functional'

/**
 * defaultOperationsModules
 *
 * Đồng bộ 100% từ CANONICAL CROSS-FUNCTIONAL REGISTRY (crossFunctionalRegistry.ts).
 * Đảm bảo tính nhất quán giữa Title, Icon, Badge, Input/Output và SOP.
 */
export const defaultOperationsModules: OperationModule[] = CROSS_FUNCTIONAL_MODULES_LIST.map((mod) => ({
  id: mod.id,
  code: mod.code,
  title: mod.title,
  description: mod.subtitle,
  iconName: mod.iconName,
  category: mod.domainLabel,
  inputs: mod.inputs,
  outputs: mod.outputs,
  sopIds: mod.sopIds,
  sopBadge: mod.sopBadge
}))
