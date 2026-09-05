import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Database,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  UsersRound,
  type LucideIcon
} from 'lucide-react'

export type OrganizationCoverageMode = 'wheel' | 'matrix' | 'flow'

interface OrganizationModule {
  id: string
  code: string
  label: string
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

const ORGANIZATION_MODULES: OrganizationModule[] = [
  {
    id: 'headcount', code: 'HC', label: 'Định biên', sopCount: 8, workflowId: 'MODULE-ORG-HC', firstSopCode: 'HC-01', icon: UsersRound,
    receive: 'Chiến lược, kế hoạch kinh doanh, lực lượng hiện tại, dải lương và ngân sách.',
    transfer: 'Baseline Headcount, FTE, People Cost và hạn mức vị trí được phê duyệt.',
    meaning: 'Xác định doanh nghiệp cần bao nhiêu người, ở đâu, khi nào và trong giới hạn chi phí nào.',
    inputs: ['Kế hoạch kinh doanh và ngân sách', 'Headcount, FTE và biến động hiện tại', 'Chức danh, Grade và People Cost'],
    outputs: ['Định biên gốc và các phiên bản điều chỉnh', 'Hạn mức vị trí theo đơn vị', 'Actual so với Plan và cảnh báo'],
    controls: ['Tách Headcount và FTE', 'Mọi thay đổi có ngày hiệu lực', 'Không mở vị trí vượt hạn mức chưa duyệt']
  },
  {
    id: 'structure', code: 'OST', label: 'Cơ cấu tổ chức', sopCount: 8, workflowId: 'MODULE-ORG-ST', firstSopCode: 'OST-01', icon: Network,
    receive: 'Mô hình quản trị, quyết định tổ chức, pháp nhân, Cost Center và địa điểm.',
    transfer: 'Cây tổ chức hiện tại, tương lai và danh sách tác động khi tái cơ cấu.',
    meaning: 'Mô tả doanh nghiệp được chia thành các đơn vị nào, đơn vị thuộc cấp nào và ai chịu trách nhiệm.',
    inputs: ['Mô hình cấp tổ chức', 'Quyết định thành lập hoặc thay đổi', 'Đơn vị cha, quản lý và Cost Center'],
    outputs: ['Đơn vị và cây tổ chức có hiệu lực', 'Lịch sử tái cấu trúc', 'Danh sách vị trí, nhân viên bị ảnh hưởng'],
    controls: ['Không tạo vòng lặp cha con', 'Không ghi đè cơ cấu cũ', 'Tái cơ cấu phải đánh giá tác động lao động']
  },
  {
    id: 'job', code: 'JOB', label: 'Chức danh', sopCount: 5, workflowId: 'MODULE-ORG-JOB', firstSopCode: 'JOB-01', icon: BriefcaseBusiness,
    receive: 'Kiến trúc nghề nghiệp, nội dung công việc, yêu cầu năng lực và khung Grade.',
    transfer: 'Job Catalog, JD có phiên bản, Job Level, Grade và dải lương tham chiếu.',
    meaning: 'Chuẩn hóa một loại công việc dùng chung, độc lập với đơn vị cụ thể và người đang đảm nhiệm.',
    inputs: ['Job Family và Job Function', 'Mục tiêu, trách nhiệm và yêu cầu công việc', 'Phương pháp Job Evaluation'],
    outputs: ['Chức danh và JD có hiệu lực', 'Kết quả Job Evaluation', 'Ánh xạ Grade và năng lực'],
    controls: ['Chức danh không đại diện cho một nhân viên', 'JD thay đổi phải tạo phiên bản', 'Grade chỉ áp dụng sau phê duyệt']
  },
  {
    id: 'position', code: 'POS', label: 'Vị trí', sopCount: 6, workflowId: 'MODULE-ORG-POS', firstSopCode: 'POS-01', icon: Building2,
    receive: 'Định biên được duyệt, chức danh, đơn vị, FTE, địa điểm và Cost Center.',
    transfer: 'Position ID, trạng thái trống hoặc đã lấp đầy, người đảm nhiệm và Position Tree.',
    meaning: 'Biến định biên thành một ghế công việc cụ thể có thể tuyển, phân công, điều chuyển hoặc đóng.',
    inputs: ['Hạn mức định biên còn lại', 'Chức danh và đơn vị có hiệu lực', 'Tuyến báo cáo và tỷ lệ FTE'],
    outputs: ['Vị trí và lịch sử trạng thái', 'Người đảm nhiệm và Vacancy', 'Dữ liệu bàn giao Tuyển dụng, EMP và PAY'],
    controls: ['Tạo vị trí phải tiêu thụ định biên', 'Tổng FTE người đảm nhiệm không vượt cấu hình', 'Đóng vị trí phải xử lý người đang đảm nhiệm']
  },
  {
    id: 'reporting', code: 'RPT', label: 'Báo cáo nhân sự', sopCount: 8, workflowId: 'MODULE-ORG-RPT', firstSopCode: 'RPT-01', icon: BarChart3,
    receive: 'Dữ liệu tổ chức, nhân viên, định biên, vị trí, tuyển dụng, lương và biến động.',
    transfer: 'Chỉ số có định nghĩa, dashboard quản trị, báo cáo tuân thủ và audit truy cập.',
    meaning: 'Chuyển dữ liệu giao dịch thành thông tin quản trị có thể đối chiếu, giải thích và kiểm toán.',
    inputs: ['Metric Dictionary và quyền truy cập', 'Snapshot dữ liệu theo ngày hiệu lực', 'Biểu mẫu và lịch báo cáo'],
    outputs: ['Headcount, FTE và Actual so với Plan', 'Movement, Vacancy và Span of Control', 'Báo cáo tuân thủ và lịch sử phân phối'],
    controls: ['Một chỉ số có một định nghĩa được duyệt', 'Báo cáo nhạy cảm phải phân quyền', 'Số liệu xuất có snapshot và thời điểm chốt']
  }
]

const CheckList: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="space-y-2">
    {items.map((item) => <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" /><span>{item}</span></div>)}
  </div>
)

export const OrganizationManagementCoverage: React.FC<{ mode: OrganizationCoverageMode }> = ({ mode }) => {
  const navigate = useNavigate()
  const [selectedModuleId, setSelectedModuleId] = useState('headcount')
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const selectedModule = ORGANIZATION_MODULES.find((module) => module.id === selectedModuleId) ?? ORGANIZATION_MODULES[0]
  const inspectedModule = ORGANIZATION_MODULES.find((module) => module.id === hoveredModuleId) ?? selectedModule

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
        setRotationAngle((angle) => (angle + deltaSeconds * 3.6) % 360)
      }
      lastTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [hoveredModuleId, isPageVisible, isRotating, mode, prefersReducedMotion])

  const svgSize = 620
  const center = svgSize / 2
  const orbitRadius = 210
  const nodePositions = useMemo(() => {
    return ORGANIZATION_MODULES.map((module, index) => {
      const baseAngle = -90 + index * (360 / ORGANIZATION_MODULES.length)
      const angle = prefersReducedMotion ? baseAngle : baseAngle + rotationAngle
      const radians = angle * Math.PI / 180
      return { module, x: center + orbitRadius * Math.cos(radians), y: center + orbitRadius * Math.sin(radians) }
    })
  }, [prefersReducedMotion, rotationAngle, center, orbitRadius])

  const openModule = (module: OrganizationModule) => navigate(`/employee-lifecycle/infographic/${module.workflowId}?sop=${encodeURIComponent(module.firstSopCode)}`)

  if (mode === 'matrix') {
    return (
      <section className="space-y-4">
        <header className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white"><Database className="h-4 w-4" /></span><div><h4 className="text-sm font-black text-slate-900 dark:text-white">Đầu vào và kết quả của Quản trị tổ chức</h4><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Chọn một module để xem dữ liệu cần có, kết quả tạo ra và các kiểm soát bắt buộc.</p></div></header>
        <nav aria-label="Chọn module Quản trị tổ chức" className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/50">
          {ORGANIZATION_MODULES.map((module) => <button key={module.id} type="button" onClick={() => setSelectedModuleId(module.id)} className={`rounded-md px-3 py-2 text-xs font-bold transition-colors ${selectedModule.id === module.id ? 'bg-[#1f5f86] text-white' : 'text-slate-600 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-900'}`}>{module.label}</button>)}
        </nav>
        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"><h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Đầu vào cần có</h5><CheckList items={selectedModule.inputs} /></article>
          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" /></div>
          <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white"><p className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">Module xử lý</p><h5 className="mt-2 text-base font-black">{selectedModule.label}</h5><p className="mt-1 text-xs text-sky-100">{selectedModule.sopCount} SOP nghiệp vụ</p><button type="button" onClick={() => openModule(selectedModule)} className="mt-4 flex w-fit items-center gap-1 rounded border border-white/30 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/10">Xem quy trình <ArrowRight className="h-3 w-3" /></button></article>
          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700"><ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" /></div>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"><h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Kết quả tạo ra</h5><CheckList items={selectedModule.outputs} /></article>
        </div>
        <article className="rounded-lg border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/20"><h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white"><ShieldCheck className="h-4 w-4 text-[#2e8bbd]" />Kiểm soát bắt buộc</h5><div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3"><CheckList items={selectedModule.controls} /></div></article>
      </section>
    )
  }

  if (mode === 'flow') {
    return (
      <section className="space-y-5">
        <header className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white"><ArrowRight className="h-4 w-4" /></span><div><h4 className="text-sm font-black text-slate-900 dark:text-white">Luồng dữ liệu quản trị tổ chức</h4><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Định biên tạo hạn mức, cơ cấu xác định nơi làm việc, chức danh chuẩn hóa công việc, vị trí tạo ghế cụ thể và báo cáo khép vòng kiểm soát.</p></div></header>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
          {ORGANIZATION_MODULES.map((module, index) => { const Icon = module.icon; const active = module.id === selectedModule.id; return <div key={module.id} className="relative flex min-w-0 items-stretch"><button type="button" onClick={() => setSelectedModuleId(module.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${active ? 'border-[#1f5f86] bg-[#1f5f86] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><div className="flex items-center justify-between gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded ${active ? 'bg-white/15' : 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950 dark:text-sky-200'}`}><Icon className="h-4 w-4" /></span><span className={`text-[10px] font-bold ${active ? 'text-sky-100' : 'text-slate-400'}`}>0{index + 1}</span></div><h5 className="mt-3 text-xs font-black leading-snug">{module.label}</h5><p className={`mt-1 text-[10px] ${active ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>{module.sopCount} SOP</p></button>{index < ORGANIZATION_MODULES.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-slate-300 xl:block" />}</div> })}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]"><article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">{selectedModule.label} nhận dữ liệu</p><p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.receive}</p></article><div className="flex items-center justify-center"><ArrowRight className="h-4 w-4 rotate-90 text-slate-300 lg:rotate-0" /></div><article className="rounded-lg border border-sky-200 bg-white p-4 dark:border-sky-900 dark:bg-slate-900"><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">Dữ liệu được bàn giao</p><p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.transfer}</p></article></div>
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 lg:flex-row lg:items-center"><span className="font-bold text-slate-900 dark:text-white">Liên kết vận hành:</span><span>Chiến lược và ngân sách</span><ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" /><span className="font-semibold text-[#1f5f86] dark:text-sky-200">Mô hình tổ chức và vị trí</span><ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" /><span>Tuyển dụng, EMP, PAY, Phát triển con người và BI</span></div>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"><div> 
        <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/70 dark:border-blue-800">
              MỐI QUAN HỆ PHÂN HỆ
        </span>
        <h4 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Từ chiến lược nhân lực đến từng vị trí trong tổ chức</h4></div>{!prefersReducedMotion && <div className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => setIsRotating((value) => !value)} aria-label={isRotating ? 'Tạm dừng chuyển động quỹ đạo' : 'Tiếp tục chuyển động quỹ đạo'} className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${isRotating ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100' : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'}`}>{isRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}<span>{isRotating ? 'Tạm dừng' : 'Chuyển động'}</span></button>{rotationAngle !== 0 && <button type="button" onClick={() => setRotationAngle(0)} aria-label="Đặt lại vị trí quỹ đạo" className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><RotateCcw className="h-3.5 w-3.5" /></button>}</div>}</header>
      <div className="hidden flex-col items-center gap-6 md:flex xl:flex-row xl:items-center justify-between py-2">
        <div className="relative mx-auto aspect-square w-full max-w-[620px] shrink-0 select-none">
          <svg className="h-full w-full" viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none" aria-hidden="true"><circle cx={center} cy={center} r={orbitRadius} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" strokeDasharray="5 5" />{nodePositions.map((position) => { const highlighted = hoveredModuleId === position.module.id || selectedModule.id === position.module.id; return <line key={`spoke-${position.module.id}`} x1={center} y1={center} x2={position.x} y2={position.y} className={`transition-all duration-300 ${highlighted ? 'stroke-blue-600 dark:stroke-blue-500' : 'stroke-slate-200 dark:stroke-slate-800'}`} strokeWidth={highlighted ? 2.5 : 1.25} strokeDasharray={highlighted ? undefined : '3 3'} /> })}</svg>
          <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-blue-600/80 bg-white p-3 text-center shadow-md ring-4 ring-blue-50 dark:border-blue-500 dark:bg-slate-900 dark:ring-blue-950/40"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-400"><Building2 className="h-5 w-5" /></span><span className="mt-2 text-xs font-black text-slate-900 dark:text-white">Mô hình tổ chức và vị trí</span><span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">Dữ liệu theo ngày hiệu lực</span></div>
          {nodePositions.map(({ module, x, y }) => { const Icon = module.icon; const active = module.id === selectedModule.id; const highlighted = active || module.id === hoveredModuleId; return <div key={module.id} style={{ left: `${x / svgSize * 100}%`, top: `${y / svgSize * 100}%`, transform: 'translate(-50%, -50%)' }} className="absolute z-20"><button type="button" aria-pressed={active} onClick={() => setSelectedModuleId(module.id)} onMouseEnter={() => setHoveredModuleId(module.id)} onMouseLeave={() => setHoveredModuleId(null)} onFocus={() => setHoveredModuleId(module.id)} onBlur={() => setHoveredModuleId(null)} className={`w-[152px] rounded-xl border p-2.5 text-left shadow-sm transition-all duration-200 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${highlighted ? 'scale-[1.04] border-blue-600 bg-blue-600 text-white ring-2 ring-blue-600/20' : 'border-slate-200 bg-white text-slate-700 hover:scale-[1.02] hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><div className="flex items-center gap-2"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${highlighted ? 'bg-white/20 text-white' : 'border border-slate-200 bg-blue-50 text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400'}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black">{module.label}</span><span className={`block text-[9px] ${highlighted ? 'text-blue-100' : 'text-slate-400'}`}>{module.sopCount} SOP · {module.code}</span></span></div></button></div> })}
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
      <div className="space-y-3 md:hidden"><div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Building2 className="h-5 w-5" /></span><div><h5 className="text-xs font-black text-slate-900 dark:text-white">Mô hình tổ chức và vị trí</h5><p className="text-[11px] text-slate-600 dark:text-slate-300">Năm module dùng chung dữ liệu theo ngày hiệu lực.</p></div></div>{ORGANIZATION_MODULES.map((module, index) => { const Icon = module.icon; const active = module.id === selectedModule.id; return <div key={module.id} className="space-y-1"><button type="button" aria-pressed={active} onClick={() => setSelectedModuleId(module.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-white/20' : 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-black">{index + 1}. {module.label}</span><span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400'}`}>{module.sopCount} SOP · {module.code}</span></span></button>{active && <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] dark:border-slate-700 dark:bg-slate-800"><p><strong>Nhận từ:</strong> {module.receive}</p><p><strong>Chuyển sang:</strong> {module.transfer}</p><button type="button" onClick={() => openModule(module)} className="flex items-center gap-1 font-bold text-[#1f5f86] dark:text-sky-300">Xem quy trình <ArrowRight className="h-3 w-3" /></button></div>}</div> })}</div>
      <div className="border-t border-slate-100 pt-3 dark:border-slate-800"><p className="mb-2 text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">Chuỗi dữ liệu Quản trị tổ chức</p><div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">{ORGANIZATION_MODULES.map((module, index) => <button key={module.id} type="button" onClick={() => setSelectedModuleId(module.id)} className={`flex items-center gap-2 rounded-lg border p-2.5 text-left ${selectedModule.id === module.id ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40' : 'border-slate-200 bg-slate-50/80 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900'}`}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">{module.label}</span><span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{module.transfer}</span></span>{index < ORGANIZATION_MODULES.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-400 xl:block" />}</button>)}</div></div>
    </section>
  )
}
