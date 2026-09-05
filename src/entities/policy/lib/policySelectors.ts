import type {
  Policy,
  PolicyFilterState,
  LeaveSimulatorInput,
  LeaveSimulatorResult,
  OvertimeSimulatorInput,
  OvertimeSimulatorResult,
  LateEarlySimulatorInput,
  LateEarlySimulatorResult
} from '../model/types'

/**
 * Remove Vietnamese accents and lowercase string for flexible search
 */
export const normalizeVietnameseText = (str: string): string => {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/**
 * Filter policies list based on search term and active dropdown filters
 */
export const filterPolicies = (
  policies: Policy[],
  filter: PolicyFilterState
): Policy[] => {
  const normSearch = normalizeVietnameseText(filter.searchTerm)

  return policies.filter((policy) => {
    // 1. Search term
    if (normSearch) {
      const matchCode = normalizeVietnameseText(policy.code).includes(normSearch)
      const matchTitle = normalizeVietnameseText(policy.title).includes(normSearch)
      const matchTitleEn = normalizeVietnameseText(policy.titleEn).includes(normSearch)
      const matchSummary = normalizeVietnameseText(policy.summary).includes(normSearch)
      const matchTags = policy.tags.some((tag) =>
        normalizeVietnameseText(tag).includes(normSearch)
      )
      const matchRules = policy.rules.some((rule) =>
        normalizeVietnameseText(rule.label + ' ' + rule.description).includes(normSearch)
      )

      if (!matchCode && !matchTitle && !matchTitleEn && !matchSummary && !matchTags && !matchRules) {
        return false
      }
    }

    // 2. Category filter
    if (filter.category !== 'all' && policy.category !== filter.category) {
      return false
    }

    // 3. Type filter
    if (filter.type !== 'all' && policy.type !== filter.type) {
      return false
    }

    // 4. Status filter
    if (filter.status !== 'all' && policy.status !== filter.status) {
      return false
    }

    // 5. Severity filter
    if (filter.severity !== 'all' && policy.severity !== filter.severity) {
      return false
    }

    return true
  })
}

/**
 * Get policies relevant to a specific Process ID or SOP code
 */
export const getPoliciesForProcess = (
  policies: Policy[],
  processOrSopCode: string
): Policy[] => {
  if (!processOrSopCode) return []
  const target = processOrSopCode.toUpperCase()
  return policies.filter((p) => {
    const hasProcess = p.relatedProcessCodes.some((code) => code.toUpperCase() === target)
    const hasSop = p.relatedSopCodes.some((code) => code.toUpperCase() === target)
    return hasProcess || hasSop
  })
}

/**
 * Find single policy by id or code
 */
export const getPolicyByIdOrCode = (
  policies: Policy[],
  idOrCode: string
): Policy | undefined => {
  if (!idOrCode) return undefined
  const target = idOrCode.toLowerCase()
  return policies.find(
    (p) => p.id.toLowerCase() === target || p.code.toLowerCase() === target
  )
}

/**
 * Compute Policy Metrics Summary
 */
export const calculatePolicyMetrics = (policies: Policy[]) => {
  const total = policies.length
  const active = policies.filter((p) => p.status === 'active').length
  const systemRules = policies.filter((p) => p.type === 'system-rule').length
  const mandatory = policies.filter((p) => p.severity === 'mandatory' || p.type === 'mandatory-action').length

  return { total, active, systemRules, mandatory }
}

/**
 * SIMULATOR A: Quy định đăng ký nghỉ phép (POL-ATT-01)
 * Rules:
 * - 0.5 - 1 ngày: báo trước tối thiểu 24 giờ (1 ngày)
 * - 1.5 - 3 ngày: báo trước tối thiểu 5 ngày
 * - Trên 3 ngày: báo trước tối thiểu 15 ngày
 * - Đơn bắt buộc được duyệt trước thời điểm nghỉ, nếu chưa duyệt đến ngày nghỉ sẽ tự hủy / nghỉ không phép
 */
export const simulateLeavePolicy = (input: LeaveSimulatorInput): LeaveSimulatorResult => {
  const { days, advanceNoticeDays, isApproved } = input
  const messages: string[] = []

  let requiredNoticeDays = 1
  if (days <= 0) {
    return {
      isValid: false,
      requiredNoticeDays: 0,
      noticeMet: false,
      approvalMet: false,
      autoCancelRisk: false,
      statusBadge: 'error',
      statusText: 'Số ngày nghỉ không hợp lệ',
      messages: ['Vui lòng nhập số ngày nghỉ lớn hơn 0.']
    }
  } else if (days <= 1) {
    requiredNoticeDays = 1 // 24 giờ
  } else if (days <= 3) {
    requiredNoticeDays = 5
  } else {
    requiredNoticeDays = 15
  }

  const noticeMet = advanceNoticeDays >= requiredNoticeDays
  const approvalMet = isApproved

  if (!noticeMet) {
    messages.push(
      `Chưa đủ thời gian báo trước: Cần tối thiểu ${requiredNoticeDays} ngày đối với đơn xin nghỉ ${days} ngày (thực tế báo trước ${advanceNoticeDays} ngày).`
    )
  } else {
    messages.push(`Thời gian báo trước hợp lệ (yêu cầu tối thiểu ${requiredNoticeDays} ngày).`)
  }

  let autoCancelRisk = false
  if (!approvalMet) {
    autoCancelRisk = true
    messages.push('Đơn chưa được phê duyệt: Nếu đến thời điểm bắt đầu nghỉ đơn vẫn chưa duyệt, hệ thống sẽ tự động hủy đơn.')
  } else {
    messages.push('Đơn đã được Quản lý phê duyệt hợp lệ trước thời điểm nghỉ.')
  }

  const isValid = noticeMet && approvalMet

  let statusBadge: 'success' | 'warning' | 'error' = 'success'
  let statusText = 'Đơn nghỉ phép đủ điều kiện hợp lệ'

  if (!isValid) {
    if (!noticeMet && !approvalMet) {
      statusBadge = 'error'
      statusText = 'Không hợp lệ (Thiếu thời gian báo trước & Chưa duyệt)'
    } else if (!noticeMet) {
      statusBadge = 'error'
      statusText = 'Không đủ điều kiện thời gian báo trước'
    } else {
      statusBadge = 'warning'
      statusText = 'Cần được Quản lý duyệt trước khi nghỉ'
    }
  }

  return {
    isValid,
    requiredNoticeDays,
    noticeMet,
    approvalMet,
    autoCancelRisk,
    statusBadge,
    statusText,
    messages
  }
}

/**
 * SIMULATOR B: Quy định & hạn mức tăng ca OT (POL-ATT-02)
 * Rules:
 * - Tối đa 4 giờ/ngày
 * - Tối đa 40 giờ/tháng
 * - Tối đa 200 giờ/năm
 * - OT đột xuất phải tạo đơn trong 12 giờ kể từ lúc phát sinh
 * - Tối đa 3 lần tạo đơn OT đột xuất/trễ mỗi tháng
 */
export const simulateOvertimePolicy = (input: OvertimeSimulatorInput): OvertimeSimulatorResult => {
  const {
    hoursRequested,
    dailyTotalHours,
    monthlyTotalHours,
    yearlyTotalHours,
    isUrgent,
    hoursSinceUrgentEvent,
    urgentRequestsThisMonth
  } = input

  const messages: string[] = []

  const totalDaily = dailyTotalHours + hoursRequested
  const totalMonthly = monthlyTotalHours + hoursRequested
  const totalYearly = yearlyTotalHours + hoursRequested

  const dailyLimitExceeded = totalDaily > 4
  const monthlyLimitExceeded = totalMonthly > 40
  const yearlyLimitExceeded = totalYearly > 200

  let urgentDeadlineExceeded = false
  let urgentCountExceeded = false

  if (isUrgent) {
    if (hoursSinceUrgentEvent > 12) {
      urgentDeadlineExceeded = true
      messages.push(`Quá thời hạn quy định: Đơn OT đột xuất phải tạo trong vòng 12 giờ (đã trôi qua ${hoursSinceUrgentEvent} giờ).`)
    }
    if (urgentRequestsThisMonth >= 3) {
      urgentCountExceeded = true
      messages.push(`Vượt giới hạn số lần: Đã tạo ${urgentRequestsThisMonth}/3 lần đăng ký OT trễ trong tháng này.`)
    }
  }

  if (dailyLimitExceeded) {
    messages.push(`Vượt trần ngày: Tổng ${totalDaily} giờ/ngày (Hạn mức tối đa 4 giờ/ngày). Hệ thống sẽ chặn tạo đơn.`)
  }
  if (monthlyLimitExceeded) {
    messages.push(`Vượt trần tháng: Tổng ${totalMonthly} giờ/tháng (Hạn mức tối đa 40 giờ/tháng). Hệ thống sẽ chặn tạo đơn.`)
  }
  if (yearlyLimitExceeded) {
    messages.push(`Vượt trần năm: Tổng ${totalYearly} giờ/năm (Hạn mức tối đa 200 giờ/năm). Hệ thống sẽ chặn tạo đơn.`)
  }

  const isValid =
    !dailyLimitExceeded &&
    !monthlyLimitExceeded &&
    !yearlyLimitExceeded &&
    !urgentDeadlineExceeded &&
    !urgentCountExceeded &&
    hoursRequested > 0

  let statusBadge: 'success' | 'warning' | 'error' = 'success'
  let statusText = 'Đủ điều kiện đăng ký tăng ca (Trong hạn mức)'

  if (!isValid) {
    statusBadge = 'error'
    statusText = 'Hệ thống chặn: Vi phạm hạn mức hoặc thời gian nộp đơn OT'
  } else {
    messages.push('Tất cả các chỉ số OT nằm trong hạn mức cho phép của hệ thống.')
  }

  return {
    isValid,
    dailyLimitExceeded,
    monthlyLimitExceeded,
    yearlyLimitExceeded,
    urgentDeadlineExceeded,
    urgentCountExceeded,
    statusBadge,
    statusText,
    messages
  }
}

/**
 * SIMULATOR C: Quy định đi trễ và về sớm (POL-ATT-03)
 * Rules:
 * - Phải có đơn được duyệt trước
 * - Tối đa 1 lần/tháng
 * - Mức tham chiếu KPI demo:
 *   + 0 - 10 phút: 1 điểm
 *   + >10 - 30 phút: 2 điểm
 *   + >30 - 60 phút: 4 điểm
 *   + >60 - 120 phút: 6 điểm
 *   + >120 phút: cảnh báo "Có thể được xem là nghỉ không phép theo quy định demo"
 */
export const simulateLateEarlyPolicy = (input: LateEarlySimulatorInput): LateEarlySimulatorResult => {
  const { minutes, hasApprovedRequest } = input
  const messages: string[] = []

  let kpiPoints = 0
  let warningText = ''

  if (minutes <= 0) {
    kpiPoints = 0
    messages.push('Không ghi nhận đi trễ hoặc về sớm.')
  } else if (minutes <= 10) {
    kpiPoints = 1
    messages.push('Thời gian trễ/sớm từ 0 - 10 phút: Mức tham chiếu 1 điểm KPI.')
  } else if (minutes <= 30) {
    kpiPoints = 2
    messages.push('Thời gian trễ/sớm trên 10 - 30 phút: Mức tham chiếu 2 điểm KPI.')
  } else if (minutes <= 60) {
    kpiPoints = 4
    messages.push('Thời gian trễ/sớm trên 30 - 60 phút: Mức tham chiếu 4 điểm KPI.')
  } else if (minutes <= 120) {
    kpiPoints = 6
    messages.push('Thời gian trễ/sớm trên 60 - 120 phút: Mức tham chiếu 6 điểm KPI.')
  } else {
    kpiPoints = 10
    warningText = 'Có thể được xem là nghỉ không phép theo quy định demo.'
    messages.push('Thời gian trên 120 phút: Có thể được xem là nghỉ không phép theo quy định demo.')
  }

  if (!hasApprovedRequest && minutes > 0) {
    messages.push('Cảnh báo: Chưa có đơn giải trình/đi trễ về sớm được Quản lý phê duyệt trước.')
  }

  let statusBadge: 'success' | 'warning' | 'error' = 'success'
  let statusText = 'Mức tham chiếu bình thường'

  if (minutes > 120) {
    statusBadge = 'error'
    statusText = 'Thời gian vượt 120 phút (Nguy cơ không phép)'
  } else if (!hasApprovedRequest && minutes > 0) {
    statusBadge = 'warning'
    statusText = 'Chưa có đơn duyệt trước'
  } else if (minutes > 30) {
    statusBadge = 'warning'
    statusText = `Mức tham chiếu ${kpiPoints} điểm KPI`
  }

  return {
    minutes,
    kpiPoints,
    hasApprovedRequest,
    warningText,
    statusBadge,
    statusText,
    messages
  }
}
