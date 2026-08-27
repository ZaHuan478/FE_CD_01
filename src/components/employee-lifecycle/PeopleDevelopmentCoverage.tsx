import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Database,
  GraduationCap,
  HeartHandshake,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  UserRound,
  type LucideIcon
} from 'lucide-react'

export type PeopleCoverageMode = 'wheel' | 'matrix' | 'flow'

interface PeopleDevelopmentModule {
  id: string
  code: string
  label: string
  shortLabel: string
  sopCount: number
  workflowId: string
  firstSopCode: string
  icon: LucideIcon
  receive: string
  transfer: string
  meaning: string
  inputs: string[]
  outputs: string[]
  controls: string[]
}

const PEOPLE_MODULES: PeopleDevelopmentModule[] = [
  {
    id: 'kpi',
    code: 'KPI',
    label: 'KPI',
    shortLabel: 'KPI',
    sopCount: 2,
    workflowId: 'MODULE-PFM',
    firstSopCode: 'PFM-02',
    icon: Target,
    receive: 'Chiến lược, mục tiêu đơn vị, mô tả công việc và chu kỳ hiệu suất.',
    transfer: 'Mục tiêu đã duyệt, trọng số, target, tiến độ và bằng chứng thực hiện.',
    meaning: 'Chuyển kỳ vọng của tổ chức thành cam kết công việc có thể đo lường cho từng nhân viên.',
    inputs: ['Mục tiêu công ty và phòng ban', 'Cơ cấu, chức danh và quản lý', 'Chu kỳ và chính sách KPI'],
    outputs: ['Phiếu mục tiêu đã duyệt', 'Baseline và trọng số KPI', 'Kết quả check-in giữa kỳ'],
    controls: ['Tổng trọng số hợp lệ', 'Mục tiêu có target và thời hạn', 'Thay đổi phải lưu phiên bản']
  },
  {
    id: 'review',
    code: 'REV',
    label: 'Đánh giá',
    shortLabel: 'Đánh giá',
    sopCount: 4,
    workflowId: 'MODULE-PFM',
    firstSopCode: 'PFM-04',
    icon: ClipboardCheck,
    receive: 'Mục tiêu, kết quả thực hiện, bằng chứng, phản hồi và thang điểm.',
    transfer: 'Kết quả hiệu suất đã hiệu chỉnh, phê duyệt và kế hoạch cải thiện.',
    meaning: 'Tạo kết quả hiệu suất có căn cứ để phản hồi, phát triển, tưởng thưởng và quản trị nhân tài.',
    inputs: ['Mục tiêu và kết quả KPI', 'Bằng chứng và phản hồi trong kỳ', 'Biểu mẫu, thang điểm và người đánh giá'],
    outputs: ['Kết quả đánh giá cuối kỳ', 'Biên bản hiệu chỉnh', 'Khiếu nại hoặc PIP nếu phát sinh'],
    controls: ['Tách tự đánh giá và quản lý đánh giá', 'Điều chỉnh điểm phải có căn cứ', 'Kết quả chỉ phát hành sau duyệt']
  },
  {
    id: 'competency',
    code: 'CMP',
    label: 'Năng lực và Kỹ năng',
    shortLabel: 'Năng lực',
    sopCount: 4,
    workflowId: 'MODULE-CMP',
    firstSopCode: 'CMP-01',
    icon: BrainCircuit,
    receive: 'Chức danh, từ điển năng lực, kết quả đánh giá và hồ sơ kỹ năng.',
    transfer: 'Mức năng lực xác thực, competency gap và kế hoạch phát triển cá nhân.',
    meaning: 'Cho biết nhân viên đang có gì, vai trò cần gì và khoảng trống nào phải được ưu tiên phát triển.',
    inputs: ['Từ điển và ma trận năng lực', 'Chức danh hiện tại hoặc mục tiêu', 'Bằng chứng kỹ năng và chứng chỉ'],
    outputs: ['Hồ sơ năng lực hiện tại', 'Báo cáo khoảng trống', 'Kế hoạch phát triển cá nhân IDP'],
    controls: ['Từ điển có phiên bản hiệu lực', 'Tách tự khai báo và mức xác thực', 'Chứng chỉ có ngày cấp và hết hạn']
  },
  {
    id: 'learning',
    code: 'LND',
    label: 'Đào tạo và Phát triển',
    shortLabel: 'Đào tạo',
    sopCount: 5,
    workflowId: 'MODULE-LND',
    firstSopCode: 'LND-01',
    icon: GraduationCap,
    receive: 'Competency gap, IDP, yêu cầu tuân thủ, nhu cầu đơn vị và ngân sách.',
    transfer: 'Lịch sử học tập, chứng chỉ, mức hoàn thành và hiệu quả sau đào tạo.',
    meaning: 'Biến nhu cầu phát triển thành chương trình, lớp học và bằng chứng áp dụng vào công việc.',
    inputs: ['Competency gap và IDP', 'Nhu cầu tuân thủ và đề xuất đơn vị', 'Catalog, lịch lớp và ngân sách'],
    outputs: ['Ghi danh và lịch học', 'Kết quả học tập và chứng chỉ', 'Báo cáo hiệu quả đào tạo'],
    controls: ['Kiểm tra eligibility và trùng lịch', 'Điểm danh và sửa điểm có audit', 'Cam kết đào tạo theo chính sách']
  },
  {
    id: 'talent',
    code: 'TAL',
    label: 'Nghề nghiệp và Kế nhiệm',
    shortLabel: 'Kế nhiệm',
    sopCount: 3,
    workflowId: 'MODULE-TAL',
    firstSopCode: 'TAL-01',
    icon: Trophy,
    receive: 'Hiệu suất, năng lực, IDP, nguyện vọng nghề nghiệp và vị trí trọng yếu.',
    transfer: 'Talent pool, 9-Box, successor slate và mức sẵn sàng kế nhiệm.',
    meaning: 'Giúp tổ chức chuẩn bị nguồn nhân tài cho các vị trí trọng yếu mà không biến điểm số thành quyết định tự động.',
    inputs: ['Kết quả hiệu suất đã duyệt', 'Hồ sơ năng lực và nguyện vọng', 'Danh mục vị trí trọng yếu'],
    outputs: ['Talent pool', 'Kết quả 9-Box đã hiệu chỉnh', 'Successor slate và readiness'],
    controls: ['Human review bắt buộc', 'Quyền xem dữ liệu riêng', 'Đề cử không đồng nghĩa bổ nhiệm']
  },
  {
    id: 'engagement',
    code: 'ENG',
    label: 'Ghi nhận và Phúc lợi',
    shortLabel: 'Ghi nhận',
    sopCount: 2,
    workflowId: 'MODULE-ENG',
    firstSopCode: 'ENG-01',
    icon: HeartHandshake,
    receive: 'Thành tích, chính sách ghi nhận, eligibility, ngân sách và phản hồi nhân viên.',
    transfer: 'Lịch sử ghi nhận, quyền lợi, dữ liệu PAY/TAX và action plan gắn kết.',
    meaning: 'Khép vòng phát triển bằng việc ghi nhận đóng góp, cung cấp quyền lợi và cải thiện trải nghiệm nhân viên.',
    inputs: ['Thành tích và bằng chứng', 'Chính sách phúc lợi và hạn mức', 'Khảo sát và dữ liệu eligibility'],
    outputs: ['Quyết định ghi nhận', 'Lịch sử hưởng phúc lợi', 'Kết quả gắn kết và action plan'],
    controls: ['Kiểm tra trùng và hạn mức', 'Phân loại quyền lợi chịu thuế', 'Bảo vệ dữ liệu sức khỏe và khảo sát']
  }
]

const CheckList: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
        <span>{item}</span>
      </div>
    ))}
  </div>
)

export const PeopleDevelopmentCoverage: React.FC<{ mode: PeopleCoverageMode }> = ({ mode }) => {
  const navigate = useNavigate()
  const [selectedModuleId, setSelectedModuleId] = useState('kpi')
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const selectedModule = PEOPLE_MODULES.find((module) => module.id === selectedModuleId) ?? PEOPLE_MODULES[0]
  const inspectedModule = PEOPLE_MODULES.find((module) => module.id === hoveredModuleId) ?? selectedModule

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
      if (mediaQuery.matches) setIsRotating(false)
    }
    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    const syncVisibility = () => setIsPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => document.removeEventListener('visibilitychange', syncVisibility)
  }, [])

  useEffect(() => {
    if (mode !== 'wheel' || prefersReducedMotion || !isRotating || hoveredModuleId || !isPageVisible) {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
      lastTimeRef.current = null
      return
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = (time - lastTimeRef.current) / 1000
        setRotationAngle((angle) => (angle + deltaSeconds * 4.8) % 360)
      }
      lastTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [hoveredModuleId, isPageVisible, isRotating, mode, prefersReducedMotion])

  const svgSize = 640
  const center = svgSize / 2
  const orbitRadius = 220
  const nodePositions = PEOPLE_MODULES.map((module, index) => {
    const baseAngle = -90 + index * 60
    const angle = prefersReducedMotion ? baseAngle : baseAngle + rotationAngle
    const radians = angle * Math.PI / 180
    return {
      module,
      x: center + orbitRadius * Math.cos(radians),
      y: center + orbitRadius * Math.sin(radians)
    }
  })

  const openModule = (module: PeopleDevelopmentModule) => {
    navigate(`/employee-lifecycle/infographic/${module.workflowId}?sop=${encodeURIComponent(module.firstSopCode)}`)
  }

  if (mode === 'matrix') {
    return (
      <section className="space-y-4">
        <header className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white"><Database className="h-4 w-4" /></span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Đầu vào và kết quả của Phát triển con người</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Chọn một module để biết dữ liệu cần có, kết quả được tạo ra và các kiểm soát nghiệp vụ chính.</p>
          </div>
        </header>

        <nav aria-label="Chọn module Phát triển con người" className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/50">
          {PEOPLE_MODULES.map((module) => (
            <button key={module.id} type="button" onClick={() => setSelectedModuleId(module.id)} className={`rounded-md px-3 py-2 text-xs font-bold transition-colors ${selectedModule.id === module.id ? 'bg-[#1f5f86] text-white' : 'text-slate-600 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-900'}`}>
              {module.label}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Đầu vào cần có</h5>
            <CheckList items={selectedModule.inputs} />
          </article>
          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" /></div>
          <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">Module xử lý</p>
            <h5 className="mt-2 text-base font-black">{selectedModule.label}</h5>
            <p className="mt-1 text-xs text-sky-100">{selectedModule.sopCount} SOP nghiệp vụ</p>
            <button type="button" onClick={() => openModule(selectedModule)} className="mt-4 flex w-fit items-center gap-1 rounded border border-white/30 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/10">Xem quy trình <ArrowRight className="h-3 w-3" /></button>
          </article>
          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" /></div>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Kết quả tạo ra</h5>
            <CheckList items={selectedModule.outputs} />
          </article>
        </div>

        <article className="rounded-lg border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
          <h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white"><ShieldCheck className="h-4 w-4 text-[#2e8bbd]" />Kiểm soát bắt buộc</h5>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3"><CheckList items={selectedModule.controls} /></div>
        </article>
      </section>
    )
  }

  if (mode === 'flow') {
    return (
      <section className="space-y-5">
        <header className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white"><ArrowRight className="h-4 w-4" /></span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Luồng dữ liệu xuyên suốt hành trình phát triển</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Mỗi module kế thừa kết quả từ bước trước và tiếp tục làm giàu hồ sơ phát triển của nhân viên.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-6">
          {PEOPLE_MODULES.map((module, index) => {
            const Icon = module.icon
            const active = module.id === selectedModule.id
            return (
              <div key={module.id} className="relative flex min-w-0 items-stretch">
                <button type="button" onClick={() => setSelectedModuleId(module.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${active ? 'border-[#1f5f86] bg-[#1f5f86] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-800'}`}>
                  <div className="flex items-center justify-between gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded ${active ? 'bg-white/15' : 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950 dark:text-sky-200'}`}><Icon className="h-4 w-4" /></span><span className={`text-[10px] font-bold ${active ? 'text-sky-100' : 'text-slate-400'}`}>0{index + 1}</span></div>
                  <h5 className="mt-3 text-xs font-black leading-snug">{module.label}</h5>
                  <p className={`mt-1 text-[10px] ${active ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>{module.sopCount} SOP</p>
                </button>
                {index < PEOPLE_MODULES.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-slate-300 xl:block" />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">{selectedModule.label} nhận dữ liệu</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.receive}</p>
          </article>
          <div className="flex items-center justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-slate-300 lg:rotate-0" /></div>
          <article className="rounded-lg border border-sky-200 bg-white p-4 dark:border-sky-900 dark:bg-slate-900">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Dữ liệu được bàn giao</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.transfer}</p>
          </article>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 lg:flex-row lg:items-center">
          <span className="font-bold text-slate-900 dark:text-white">Liên kết nền:</span>
          <span>EMP và Master Data</span><ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" /><span className="font-semibold text-[#1f5f86] dark:text-sky-200">Hồ sơ phát triển nhân viên</span><ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" /><span>PAY, TAX, Workflow, Notification và BI</span>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/70 dark:border-blue-800">
              MỐI QUAN HỆ PHÂN HỆ
            </span>
          <h4 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Dữ liệu phát triển nhân viên được làm giàu xuyên suốt</h4>
        </div>
        {!prefersReducedMotion && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setIsRotating((value) => !value)} aria-label={isRotating ? 'Tạm dừng chuyển động quỹ đạo' : 'Tiếp tục chuyển động quỹ đạo'} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${isRotating ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100' : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'}`}>
              {isRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRotating ? 'Tạm dừng' : 'Chuyển động'}</span>
            </button>
            {rotationAngle !== 0 && <button type="button" onClick={() => setRotationAngle(0)} aria-label="Đặt lại vị trí quỹ đạo" className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><RotateCcw className="h-3.5 w-3.5" /></button>}
          </div>
        )}
      </header>

      <div className="hidden flex-col items-center gap-6 md:flex xl:flex-row xl:items-center justify-between py-2">
        <div className="relative mx-auto aspect-square w-full max-w-[640px] shrink-0 select-none">
          <svg className="h-full w-full" viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none" aria-hidden="true">
            <circle cx={center} cy={center} r={orbitRadius} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" strokeDasharray="4 4" />
            {nodePositions.map((position, index) => {
              const nextPosition = nodePositions[(index + 1) % nodePositions.length]
              const highlighted = hoveredModuleId === position.module.id || hoveredModuleId === nextPosition.module.id || selectedModule.id === position.module.id
              return <path key={`arc-${position.module.id}`} d={`M ${position.x} ${position.y} A ${orbitRadius} ${orbitRadius} 0 0 1 ${nextPosition.x} ${nextPosition.y}`} className={`transition-all duration-300 ${highlighted ? 'stroke-blue-500 dark:stroke-blue-400' : 'stroke-slate-300 dark:stroke-slate-700'}`} strokeWidth={highlighted ? 2 : 1.5} strokeDasharray={highlighted ? undefined : '5 4'} />
            })}
            {nodePositions.map((position) => {
              const highlighted = hoveredModuleId === position.module.id || selectedModule.id === position.module.id
              return <line key={`spoke-${position.module.id}`} x1={center} y1={center} x2={position.x} y2={position.y} className={`transition-all duration-300 ${highlighted ? 'stroke-blue-600 dark:stroke-blue-500' : 'stroke-slate-200 dark:stroke-slate-800'}`} strokeWidth={highlighted ? 2.5 : 1.25} strokeDasharray={highlighted ? undefined : '3 3'} />
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-blue-600/80 bg-white p-2 text-center shadow-md ring-4 ring-blue-50 transition-shadow duration-300 dark:border-blue-500 dark:bg-slate-900 dark:ring-blue-950/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-400"><UserRound className="h-5 w-5" /></span>
            <span className="mt-2 text-xs font-black text-slate-900 dark:text-white">Hồ sơ phát triển</span>
            <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Dữ liệu xuyên suốt</span>
          </div>

          {nodePositions.map(({ module, x, y }) => {
            const Icon = module.icon
            const active = module.id === selectedModule.id
            const hovered = module.id === hoveredModuleId
            const highlighted = active || hovered
            return (
              <div key={module.id} style={{ left: `${x / svgSize * 100}%`, top: `${y / svgSize * 100}%`, transform: 'translate(-50%, -50%)' }} className="absolute z-20">
                <button type="button" aria-pressed={active} onClick={() => setSelectedModuleId(module.id)} onMouseEnter={() => setHoveredModuleId(module.id)} onMouseLeave={() => setHoveredModuleId(null)} onFocus={() => setHoveredModuleId(module.id)} onBlur={() => setHoveredModuleId(null)} className={`w-[158px] rounded-xl border p-2.5 text-left shadow-sm transition-all duration-200 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${highlighted ? 'scale-[1.04] border-blue-600 bg-blue-600 text-white ring-2 ring-blue-600/20' : 'border-slate-200 bg-white text-slate-700 hover:scale-[1.02] hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>
                  <div className="flex items-center gap-2"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${highlighted ? 'bg-white/20 text-white' : 'border border-slate-200 bg-blue-50 text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400'}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black">{module.shortLabel}</span><span className={`block text-[9px] ${highlighted ? 'text-blue-100' : 'text-slate-400'}`}>{module.sopCount} SOP · {module.code}</span></span></div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Right Inspector Panel */}
        <div className="w-full xl:w-[380px] bg-slate-50/80 dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 space-y-4 shrink-0 shadow-2xs">
          {/* Panel Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <inspectedModule.icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Phân hệ {inspectedModule.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {inspectedModule.label}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModule(inspectedModule)}
              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-200 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
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
                {inspectedModule.receive}
              </p>
            </div>

            {/* Chuyển sang */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Chuyển sang:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs leading-relaxed">
                {inspectedModule.transfer}
              </p>
            </div>

            {/* Ý nghĩa nghiệp vụ */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                Ý nghĩa nghiệp vụ:
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs leading-relaxed">
                {inspectedModule.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><UserRound className="h-5 w-5" /></span><div><h5 className="text-xs font-black text-slate-900 dark:text-white">Hồ sơ phát triển nhân viên</h5><p className="text-[11px] text-slate-600 dark:text-slate-300">Dữ liệu trung tâm được cập nhật xuyên suốt 6 module.</p></div></div>
        {PEOPLE_MODULES.map((module, index) => {
          const Icon = module.icon
          const active = module.id === selectedModule.id
          return <div key={`mobile-${module.id}`} className="space-y-1"><button type="button" aria-pressed={active} onClick={() => setSelectedModuleId(module.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-white/20' : 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-black">{index + 1}. {module.label}</span><span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400'}`}>{module.sopCount} SOP · {module.code}</span></span></button>{active && <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] dark:border-slate-700 dark:bg-slate-800"><p><strong>Nhận từ:</strong> {module.receive}</p><p><strong>Chuyển sang:</strong> {module.transfer}</p><button type="button" onClick={() => openModule(module)} className="flex items-center gap-1 font-bold text-[#1f5f86] dark:text-sky-300">Xem quy trình <ArrowRight className="h-3 w-3" /></button></div>}</div>
        })}
      </div>

      <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Luồng phát triển xuyên suốt 6 module</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">{PEOPLE_MODULES.map((module, index) => <button key={`summary-${module.id}`} type="button" onClick={() => setSelectedModuleId(module.id)} className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${selectedModule.id === module.id ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40' : 'border-slate-200 bg-slate-50/80 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900'}`}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">{module.shortLabel}</span><span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{module.transfer}</span></span>{index < PEOPLE_MODULES.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-400 xl:block" />}</button>)}</div>
      </div>
    </section>
  )
}
