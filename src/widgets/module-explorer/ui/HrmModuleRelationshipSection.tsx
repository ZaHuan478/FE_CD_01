import React, { useState, useEffect, useRef, useId, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus,
  FileText,
  ClipboardCheck,
  CalendarDays,
  PanelsTopLeft,
  Clock,
  Wallet,
  ShieldCheck,
  Receipt,
  UserCheck,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  LockKeyhole
} from 'lucide-react'
import { useSession } from '../../../features/authentication/model/session'

export interface HrmModuleRelationshipSectionProps {
  onSelectModule?: (moduleId: string) => void
  selectedModuleId?: string
  className?: string
}

interface ModuleNode {
  id: string
  code: string
  name: string
  outcome: string
  icon: React.ReactNode
  color: string
  receivesFrom: string
  sendsTo: string
  businessMeaning: string
  workflowPath: string
}

const CORE_MODULES: ModuleNode[] = [
  {
    id: 'ats',
    code: 'REC',
    name: 'Tuyển dụng',
    outcome: 'Hồ sơ ứng viên',
    icon: <UserPlus className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Kế hoạch định biên & hồ sơ ứng tuyển từ các kênh tuyển dụng',
    sendsTo: 'Hồ sơ ứng viên trúng tuyển chuyển sang phân hệ Nhân sự',
    businessMeaning: 'Thu hút nhân tài, sàng lọc đánh giá ứng viên và khởi tạo thông tin ban đầu cho nhân viên mới.',
    workflowPath: '/employee-lifecycle/infographic/LIFE-01'
  },
  {
    id: 'emp',
    code: 'EMP',
    name: 'Nhân sự',
    outcome: 'Thông tin nhân sự',
    icon: <FileText className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Hồ sơ trúng tuyển từ Tuyển dụng & các quyết định điều động',
    sendsTo: 'Phân ca sang Chấm công; Ngạch lương sang Lương; Thông tin sang Bảo hiểm',
    businessMeaning: 'Lưu trữ hồ sơ lý lịch, hợp đồng lao động, chức danh và vị trí trong cơ cấu tổ chức.',
    workflowPath: '/employee-lifecycle/infographic/LIFE-02'
  },
  {
    id: 'onb',
    code: 'ONB',
    name: 'Onboarding',
    outcome: 'Nhân viên sẵn sàng làm việc',
    icon: <ClipboardCheck className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Hồ sơ trúng tuyển, offer đã chấp thuận và ngày nhận việc từ Tuyển dụng',
    sendsTo: 'Hồ sơ đã kích hoạt, checklist hội nhập và tài khoản chuyển sang Nhân sự, Chấm công và ESS/MSS',
    businessMeaning: 'Chuẩn bị liên phòng ban, tiếp nhận ngày đầu, đào tạo hội nhập và bàn giao nhân viên mới sang vận hành thường xuyên.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-ONB'
  },
  {
    id: 'att',
    code: 'ATT',
    name: 'Chấm công',
    outcome: 'Dữ liệu công',
    icon: <Clock className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Phân ca làm việc, đối tượng chấm công từ phân hệ Nhân sự',
    sendsTo: 'Bảng tổng hợp ngày công và giờ OT chuyển sang Lương; vắng mặt đối soát với Nghỉ phép',
    businessMeaning: 'Ghi nhận thời gian làm việc thực tế, lịch ca, tăng ca và xử lý công bất thường trước khi chốt kỳ.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-ATT'
  },
  {
    id: 'leave',
    code: 'LEV',
    name: 'Nghỉ phép',
    outcome: 'Đơn nghỉ và số dư phép',
    icon: <CalendarDays className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Hồ sơ nhân viên, lịch làm việc, chính sách nghỉ và chứng từ nghỉ chế độ',
    sendsTo: 'Ngày nghỉ đã duyệt sang Chấm công; nghỉ không lương sang Lương; nghỉ chế độ sang Bảo hiểm',
    businessMeaning: 'Quản lý đơn nghỉ, luồng phê duyệt, số dư phép, quyết toán cuối năm và các chế độ nghỉ đặc thù.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-ATT?sop=SOP-ATT-06'
  },
  {
    id: 'pay',
    code: 'PAY',
    name: 'Lương',
    outcome: 'Kết quả lương',
    icon: <Wallet className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Mức lương hợp đồng từ Nhân sự & Dữ liệu ngày công từ Chấm công',
    sendsTo: 'Mức đóng bảo hiểm sang Bảo hiểm; Thu nhập chịu thuế sang Thuế; Lệnh chi trả sang Ngân hàng',
    businessMeaning: 'Tự động tính toán thu nhập, các khoản khấu trừ, thuế TNCN và phát hành phiếu lương.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-PAY'
  },
  {
    id: 'ins',
    code: 'INS',
    name: 'Bảo hiểm',
    outcome: 'Thông tin tham gia bảo hiểm',
    icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Mức lương trích nộp từ Lương & Thông tin nhân thân từ Nhân sự',
    sendsTo: 'Hồ sơ điện tử nộp Cơ quan BHXH & thực hiện chế độ bảo hiểm',
    businessMeaning: 'Quản lý thủ tục tăng giảm BHXH, BHYT, BHTN và giải quyết chế độ ốm đau thai sản.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-INS'
  },
  {
    id: 'tax',
    code: 'TAX',
    name: 'Thuế',
    outcome: 'Hồ sơ thuế & Nghĩa vụ',
    icon: <Receipt className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Thu nhập chịu thuế từ Lương & Thông tin người phụ thuộc từ Nhân sự',
    sendsTo: 'Hồ sơ kê khai điện tử & chứng từ khấu trừ nộp Cơ quan Thuế',
    businessMeaning: 'Quản lý mã số thuế, đăng ký người phụ thuộc, khấu trừ và quyết toán thuế TNCN.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-TAX'
  },
  {
    id: 'ess',
    code: 'ESS',
    name: 'ESS/MSS',
    outcome: 'Yêu cầu tự phục vụ',
    icon: <PanelsTopLeft className="w-4 h-4" strokeWidth={1.8} />,
    color: '#2563EB',
    receivesFrom: 'Hồ sơ, công, phép, lương, tài liệu, workflow và quan hệ quản lý từ HRMS',
    sendsTo: 'Yêu cầu và quyết định được định tuyến về đúng phân hệ nguồn, Workflow và Audit log',
    businessMeaning: 'Nhân viên tự tra cứu và gửi yêu cầu; quản lý phê duyệt, theo dõi đội ngũ và khởi tạo giao dịch theo thẩm quyền.',
    workflowPath: '/employee-lifecycle/infographic/MODULE-ESS'
  }
]

const coreModuleOrder = ['ats', 'onb', 'emp', 'att', 'leave', 'pay', 'ins', 'tax', 'ess']
CORE_MODULES.sort((a, b) => coreModuleOrder.indexOf(a.id) - coreModuleOrder.indexOf(b.id))

const SUMMARY_STEPS = [
  { step: 'Tuyển người', desc: 'Thu hút & tuyển chọn' },
  { step: 'Onboarding', desc: 'Chuẩn bị & hội nhập' },
  { step: 'Quản lý hồ sơ', desc: 'Lưu trữ & bố trí' },
  { step: 'Ghi nhận thời gian làm việc', desc: 'Chấm công & phân ca' },
  { step: 'Quản lý nghỉ phép', desc: 'Đơn nghỉ & số dư' },
  { step: 'Tính lương', desc: 'Tổng hợp & chi trả' },
  { step: 'Thực hiện chế độ bảo hiểm', desc: 'Trích nộp & giải quyết chế độ' },
  { step: 'Khấu trừ & quyết toán thuế', desc: 'Kê khai & quyết toán TNCN' },
  { step: 'Tự phục vụ', desc: 'ESS & MSS' }
]

export const HrmModuleRelationshipSection: React.FC<HrmModuleRelationshipSectionProps> = ({
  onSelectModule,
  selectedModuleId,
  className = ''
}) => {
  const navigate = useNavigate()
  const session = useSession()
  const accessibleModuleIds = useMemo(() => new Set(session.modules.map((module) => module.id)), [session.modules])
  const firstAccessibleModule = CORE_MODULES.find((module) => accessibleModuleIds.has(module.id)) ?? CORE_MODULES[0]
  const arrowMarkerId = useId()
  const activeArrowMarkerId = useId()

  const [hoveredModule, setHoveredModule] = useState<ModuleNode | null>(null)
  const [activeModule, setActiveModule] = useState<ModuleNode>(
    CORE_MODULES.find((module) => module.id === selectedModuleId && accessibleModuleIds.has(module.id)) || firstAccessibleModule
  )
  const [isRotating, setIsRotating] = useState<boolean>(true)
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false)

  // Listen to prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    if (mediaQuery.matches) {
      setIsRotating(false)
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) {
        setIsRotating(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Sync active module with prop
  useEffect(() => {
    if (selectedModuleId) {
      const match = CORE_MODULES.find(m => m.id === selectedModuleId)
      if (match && accessibleModuleIds.has(match.id)) {
        setActiveModule(match)
      }
    }
  }, [selectedModuleId, accessibleModuleIds])

  useEffect(() => {
    if (!accessibleModuleIds.has(activeModule.id)) setActiveModule(firstAccessibleModule)
  }, [accessibleModuleIds, activeModule.id, firstAccessibleModule])

  // Continuous subtle calm rotation (1 full turn every 75 seconds = 360 / 75 = 4.8 deg/s)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion || !isRotating || hoveredModule !== null) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      lastTimeRef.current = null
      return
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000 // seconds
        setRotationAngle(prev => (prev + delta * 4.8) % 360)
      }
      lastTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRotating, hoveredModule, prefersReducedMotion])

  const handleModuleClick = (mod: ModuleNode) => {
    if (!accessibleModuleIds.has(mod.id)) return
    setActiveModule(mod)
    if (onSelectModule) {
      onSelectModule(mod.id)
    }
  }

  const handleOpenWorkflow = (mod: ModuleNode) => {
    if (accessibleModuleIds.has(mod.id) && mod.workflowPath) {
      navigate(mod.workflowPath)
    }
  }

  // Geometry dimensions for SVG orbit
  const svgSize = 640
  const center = svgSize / 2
  const orbitRadius = 235

  // Nodes spaced evenly starting at -90deg (top)
  const nodePositions = useMemo(() => {
    return CORE_MODULES.map((mod, idx) => {
      const baseAngle = -90 + idx * (360 / CORE_MODULES.length)
      const currentAngle = prefersReducedMotion ? baseAngle : baseAngle + rotationAngle
      const rad = (currentAngle * Math.PI) / 180
      const x = center + orbitRadius * Math.cos(rad)
      const y = center + orbitRadius * Math.sin(rad)
      return {
        mod,
        idx,
        angle: currentAngle,
        x,
        y
      }
    })
  }, [prefersReducedMotion, rotationAngle, center, orbitRadius])

  const currentInspectedModule = hoveredModule || activeModule
  const canOpenCurrentModule = accessibleModuleIds.has(currentInspectedModule.id)

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 sm:p-7 space-y-6 transition-all ${className}`}>
      {/* 1. Header khu vực */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/70 dark:border-blue-800">
              MỐI QUAN HỆ PHÂN HỆ
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dữ liệu nhân sự được kế thừa xuyên suốt
          </h2>
        </div>

        {/* Orbit Motion Controls (Accessibility & Inspection) */}
        {!prefersReducedMotion && (
          <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsRotating(prev => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${isRotating
                ? 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                }`}
              title={isRotating ? 'Tạm dừng chuyển động quỹ đạo' : 'Tiếp tục chuyển động quỹ đạo'}
            >
              {isRotating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chuyển động</span>
                </>
              )}
            </button>

            {rotationAngle !== 0 && (
              <button
                type="button"
                onClick={() => setRotationAngle(0)}
                className="p-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Đặt lại vị trí gốc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Desktop & Tablet: Interactive Orbit Diagram */}
      <div className="hidden md:flex flex-col xl:flex-row items-center justify-between gap-6 py-2">
        {/* SVG ORBIT CANVAS */}
        <div className="relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center select-none">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle directional arrow marker for normal state */}
              <marker
                id={arrowMarkerId}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94A3B8" />
              </marker>

              {/* Active directional arrow marker */}
              <marker
                id={activeArrowMarkerId}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563EB" />
              </marker>
            </defs>

            {/* Orbit Outer Track Circle */}
            <circle
              cx={center}
              cy={center}
              r={orbitRadius}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Directional Flow Arcs between consecutive nodes */}
            {nodePositions.map((pos, i) => {
              const nextPos = nodePositions[(i + 1) % nodePositions.length]
              const isHoveredFlow =
                hoveredModule?.id === pos.mod.id ||
                hoveredModule?.id === nextPos.mod.id ||
                activeModule.id === pos.mod.id

              // Calculate midpoint angle for curved arc
              return (
                <g key={`flow-${pos.mod.id}-${nextPos.mod.id}`}>
                  {/* Subtle directional connector line along orbit */}
                  <path
                    d={`M ${pos.x} ${pos.y} A ${orbitRadius} ${orbitRadius} 0 0 1 ${nextPos.x} ${nextPos.y}`}
                    className={`transition-colors duration-300 ${isHoveredFlow
                      ? 'stroke-blue-500/80 dark:stroke-blue-400'
                      : 'stroke-slate-300/80 dark:stroke-slate-700'
                      }`}
                    strokeWidth={isHoveredFlow ? '2' : '1.5'}
                    strokeDasharray={isHoveredFlow ? 'none' : '5 4'}
                    markerEnd={`url(#${isHoveredFlow ? activeArrowMarkerId : arrowMarkerId})`}
                  />
                </g>
              )
            })}

            {/* Radial Connection Lines from Center Hub to each Node */}
            {nodePositions.map((pos) => {
              const isHighlighted =
                hoveredModule?.id === pos.mod.id || activeModule.id === pos.mod.id

              return (
                <line
                  key={`spoke-${pos.mod.id}`}
                  x1={center}
                  y1={center}
                  x2={pos.x}
                  y2={pos.y}
                  className={`transition-all duration-300 ${isHighlighted
                    ? 'stroke-blue-600 dark:stroke-blue-500'
                    : 'stroke-slate-200 dark:stroke-slate-800'
                    }`}
                  strokeWidth={isHighlighted ? '2.5' : '1.25'}
                  strokeDasharray={isHighlighted ? 'none' : '3 3'}
                />
              )
            })}
          </svg>

          {/* Central Hub: Hồ sơ nhân viên */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-600/80 dark:border-blue-500 p-2 shadow-md flex flex-col items-center justify-center text-center z-10 select-none ring-4 ring-blue-50 dark:ring-blue-950/40"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-1.5 shadow-2xs">
              <UserCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
              Hồ sơ nhân viên
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 max-w-[110px] leading-tight">
              Dữ liệu nhân sự xuyên suốt
            </span>
          </div>

          {/* Orbit Module Nodes (Absolute positioned HTML cards over SVG for crisp typography & click/hover) */}
          {nodePositions.map(({ mod, x, y }) => {
            const isHovered = hoveredModule?.id === mod.id
            const isActive = activeModule.id === mod.id
            const isSelectedOrHovered = isHovered || isActive
            const isAccessible = accessibleModuleIds.has(mod.id)

            return (
              <div
                key={mod.id}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20"
              >
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => handleModuleClick(mod)}
                  onMouseEnter={() => setHoveredModule(mod)}
                  onMouseLeave={() => setHoveredModule(null)}
                  title={isAccessible ? undefined : 'Tài khoản của bạn chưa được phân quyền truy cập phân hệ này'}
                  className={`w-[142px] rounded-xl p-2 text-left transition-all duration-200 border select-none ${!isAccessible
                    ? 'cursor-not-allowed bg-slate-100/90 text-slate-400 border-slate-200 opacity-65 dark:bg-slate-950 dark:border-slate-800'
                    : isSelectedOrHovered
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-3 ring-blue-600/20 scale-105'
                    : 'cursor-pointer bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs hover:scale-102'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelectedOrHovered
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200/70 dark:border-slate-700'
                        }`}
                    >
                      {mod.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <span
                          className={`text-[11px] font-bold truncate ${isSelectedOrHovered ? 'text-white' : 'text-slate-900 dark:text-white'
                            }`}
                        >
                          {mod.name}
                        </span>
                        {!isAccessible && <LockKeyhole className="ml-1 h-3 w-3 shrink-0 text-slate-400" />}
                      </div>
                      <p
                        className={`text-[10px] leading-tight truncate mt-0.5 ${isSelectedOrHovered ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                      >
                        {mod.outcome}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Hover / Active Module Inspector Panel */}
        <div className="w-full xl:w-[380px] bg-slate-50/80 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 space-y-4 shrink-0 shadow-2xs">
          {/* Panel Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                {currentInspectedModule.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Phân hệ {currentInspectedModule.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {currentInspectedModule.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              disabled={!canOpenCurrentModule}
              onClick={() => handleOpenWorkflow(currentInspectedModule)}
              title={canOpenCurrentModule ? undefined : 'Tài khoản của bạn chưa được phân quyền truy cập phân hệ này'}
              className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg transition-colors flex items-center gap-1 shrink-0 ${canOpenCurrentModule
                ? 'cursor-pointer text-blue-700 dark:text-blue-200 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                : 'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-950 dark:border-slate-800'
                }`}
            >
              <span>Xem quy trình</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3 Information Blocks */}
          <div className="space-y-3 text-xs">
            {/* Nhận từ */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Nhận từ:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs leading-relaxed">
                {currentInspectedModule.receivesFrom}
              </p>
            </div>

            {/* Chuyển sang */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Chuyển sang:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs leading-relaxed">
                {currentInspectedModule.sendsTo}
              </p>
            </div>

            {/* Ý nghĩa nghiệp vụ */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Ý nghĩa nghiệp vụ:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs leading-relaxed">
                {currentInspectedModule.businessMeaning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Responsive View (< 768px): Vertical Connected Sequence */}
      <div className="md:hidden space-y-3 pt-1">
        {/* Mobile Top: Center Profile Hub */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
              Hồ sơ nhân viên (Dữ liệu trung tâm)
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Dữ liệu nhân sự được kế thừa và cập nhật xuyên suốt toàn bộ các phân hệ.
            </p>
          </div>
        </div>

        {/* Vertical Connected Flow */}
        <div className="space-y-2 relative">
          {CORE_MODULES.map((mod, idx) => {
            const isSelected = activeModule.id === mod.id
            const isAccessible = accessibleModuleIds.has(mod.id)
            return (
              <div key={mod.id} className="space-y-1">
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => handleModuleClick(mod)}
                  title={isAccessible ? undefined : 'Tài khoản của bạn chưa được phân quyền truy cập phân hệ này'}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-start gap-3 ${!isAccessible
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 opacity-65 dark:bg-slate-950 dark:border-slate-800'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'cursor-pointer bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                      }`}
                  >
                    {mod.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {idx + 1}. {mod.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                      >
                        {mod.code}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {mod.outcome}
                    </p>
                  </div>
                </button>

                {isSelected && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Nhận từ:</span>
                      <p className="text-slate-700 dark:text-slate-200 text-[11px]">{mod.receivesFrom}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase">Chuyển sang:</span>
                      <p className="text-slate-700 dark:text-slate-200 text-[11px]">{mod.sendsTo}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Supporting Content Below the Diagram: Compact Horizontal Flow Summary */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
            Luồng nghiệp vụ xuyên suốt {CORE_MODULES.length} phân hệ Vận hành lõi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-9">
          {SUMMARY_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50/80 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700"
            >
              <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1 truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.step}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {item.desc}
                </p>
              </div>
              {idx < SUMMARY_STEPS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
