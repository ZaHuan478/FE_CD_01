import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  FileSignature,
  FileText,
  GitMerge,
  History,
  Layers,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Sparkles,
  type LucideIcon
} from 'lucide-react'

export type PlatformCoverageMode = 'wheel' | 'matrix' | 'flow'

interface PlatformModule {
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

const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'shared',
    code: 'MD',
    label: 'Danh mục chung',
    sopCount: 8,
    workflowId: 'MODULE-PLT-MD',
    firstSopCode: 'MD-01',
    icon: Layers,
    receive: 'Yêu cầu chuẩn hóa từ các phân hệ, quy định pháp luật và danh mục đối tác.',
    transfer: 'Bộ danh mục dùng chung chuẩn hóa, có phiên bản và ngày hiệu lực trên toàn hệ thống.',
    meaning: 'Cung cấp từ điển dữ liệu quy chuẩn (quốc gia, tỉnh thành, ngân hàng, hợp đồng, lý do biến động) giúp toàn bộ HRMS không bị phân mảnh dữ liệu.',
    inputs: ['Quy chuẩn dữ liệu doanh nghiệp', 'Quy định pháp lý & cơ quan nhà nước', 'Mã phân loại cha-con'],
    outputs: ['Bộ danh mục dùng chung có hiệu lực', 'Snapshot phiên bản danh mục', 'API tham chiếu danh mục'],
    controls: ['Mã giá trị duy nhất trong danh mục', 'Không ghi đè dữ liệu lịch sử', 'Ngừng sử dụng phải kiểm tra ràng buộc']
  },
  {
    id: 'configuration',
    code: 'CFG',
    label: 'Cấu hình HRM',
    sopCount: 8,
    workflowId: 'MODULE-PLT-CFG',
    firstSopCode: 'CFG-01',
    icon: Sliders,
    receive: 'Chính sách vận hành, quy chế doanh nghiệp, lịch làm việc và kỳ đóng sổ nghiệp vụ.',
    transfer: 'Bộ tham số hiệu lực, công thức sinh mã, trường mở rộng và quy tắc kiểm tra dữ liệu.',
    meaning: 'Cho phép tùy biến linh hoạt hành vi của hệ thống theo từng pháp nhân và chu kỳ mà không cần can thiệp mã nguồn.',
    inputs: ['Chính sách tài chính & nhân sự', 'Chu kỳ chốt công, tính lương, đóng bảo hiểm', 'Quy tắc mã hóa và custom fields'],
    outputs: ['Bảng tham số vận hành có hiệu lực', 'Bộ quy tắc kiểm tra dữ liệu tự động', 'Phiên bản cấu hình đa pháp nhân'],
    controls: ['Mọi thay đổi cấu hình có ngày hiệu lực', 'Lưu snapshot phiên bản trước và sau', 'Phải kiểm thử trước khi lên Production']
  },
  {
    id: 'workflow',
    code: 'WFL',
    label: 'Workflow phê duyệt',
    sopCount: 9,
    workflowId: 'MODULE-PLT-WFL',
    firstSopCode: 'WFL-01',
    icon: GitMerge,
    receive: 'Giao dịch cần duyệt từ Vận hành lõi, Đánh giá, Kế nhiệm, Định biên và Cơ cấu tổ chức.',
    transfer: 'Kết quả phê duyệt, trạng thái hoàn tất, ý kiến phản hồi và nhật ký luân chuyển.',
    meaning: 'Tự động hóa dòng chảy phê duyệt đa cấp, rẽ nhánh theo hạn mức thẩm quyền và kiểm soát tiến độ SLA.',
    inputs: ['Ma trận thẩm quyền phê duyệt (DOA)', 'Điều kiện rẽ nhánh và hạn mức', 'Thời gian cam kết xử lý (SLA)'],
    outputs: ['Quyết định phê duyệt chính thức', 'Thông báo luân chuyển hồ sơ', 'Báo cáo hiệu suất SLA phê duyệt'],
    controls: ['Chặn phê duyệt vượt hạn mức thẩm quyền', 'Ủy quyền phải có thời hạn rõ ràng', 'Tự động escalation khi quá hạn SLA']
  },
  {
    id: 'document',
    code: 'DOC',
    label: 'Tài liệu',
    sopCount: 8,
    workflowId: 'MODULE-PLT-DOC',
    firstSopCode: 'DOC-01',
    icon: FileText,
    receive: 'Dữ liệu nhân sự để trộn template (hợp đồng, quyết định) và file scan đính kèm.',
    transfer: 'Kho hồ sơ số hóa tập trung, tài liệu chuẩn hóa PDF/A và trạng thái tuân thủ giấy tờ.',
    meaning: 'Quản lý toàn bộ vòng đời văn bản nhân sự từ sinh mẫu tự động, lưu trữ, kiểm tra hạn đến thu hồi.',
    inputs: ['Mẫu văn bản chuẩn (Template)', 'Dữ liệu nhân viên từ Core EMP', 'Checklist hồ sơ bắt buộc'],
    outputs: ['Tài liệu số hóa hoàn chỉnh', 'Cảnh báo giấy tờ thiếu/hết hạn', 'Kho lưu trữ hồ sơ bảo mật'],
    controls: ['Phân loại bảo mật theo loại tài liệu', 'Tài liệu chỉnh sửa phải lưu phiên bản', 'Khóa chỉnh sửa trước khi chuyển ký số']
  },
  {
    id: 'signature',
    code: 'SIG',
    label: 'Ký số',
    sopCount: 8,
    workflowId: 'MODULE-PLT-SIG',
    firstSopCode: 'SIG-01',
    icon: FileSignature,
    receive: 'Văn bản đã duyệt từ Workflow hoặc Tài liệu kèm danh sách và thứ tự người ký.',
    transfer: 'Văn bản điện tử có giá trị pháp lý, chứng thư số kiểm toán và trạng thái ký hoàn tất.',
    meaning: 'Kết nối chứng thư số doanh nghiệp và người lao động để ký kết hợp đồng, quyết định trực tuyến an toàn.',
    inputs: ['Tài liệu định dạng PDF/A chuẩn', 'Danh sách người ký & thứ tự luồng ký', 'Cổng chữ ký số Cloud CA / HSM'],
    outputs: ['Hợp đồng/văn bản đã ký số hợp pháp', 'Chứng chỉ kiểm toán phiên ký (Audit Certificate)', 'Bằng chứng mã hóa Timestamp'],
    controls: ['Xác thực người ký bắt buộc', 'Thứ tự ký không được đảo lộn', 'Bảo toàn hash và toàn vẹn file sau ký']
  },
  {
    id: 'notification',
    code: 'NTF',
    label: 'Thông báo',
    sopCount: 8,
    workflowId: 'MODULE-PLT-NTF',
    firstSopCode: 'NTF-01',
    icon: Bell,
    receive: 'Sự kiện kích hoạt từ toàn bộ các phân hệ (có đơn mới, có phiếu lương, sinh nhật, hết hạn).',
    transfer: 'Thông báo kịp thời tới người dùng qua Email, Web Portal và SMS kèm đường dẫn xử lý.',
    meaning: 'Kênh truyền tin và nhắc việc tức thời, giúp người dùng không bỏ sót bất kỳ nhiệm vụ hay sự kiện nào.',
    inputs: ['Mẫu thông báo đa kênh', 'Sự kiện nghiệp vụ kích hoạt', 'Danh sách người nhận theo vai trò'],
    outputs: ['Bản tin phát tán qua Email/Portal/SMS', 'Nhắc việc tự động trước hạn', 'Cảnh báo vượt cấp khi trễ hạn'],
    controls: ['Không làm lộ dữ liệu nhạy cảm trong tin nhắn', 'Tự động gửi lại tối đa 3 lần khi lỗi', 'Tôn trọng tùy chọn nhận tin của nhân viên']
  },
  {
    id: 'integration',
    code: 'INT',
    label: 'Tích hợp',
    sopCount: 10,
    workflowId: 'MODULE-PLT-INT',
    firstSopCode: 'INT-01',
    icon: Network,
    receive: 'Dữ liệu từ máy chấm công, ngân hàng, BHXH, thuế, ERP kế toán, Active Directory và Job Board.',
    transfer: 'Dữ liệu đồng bộ hai chiều chuẩn hóa, đối soát toàn vẹn và thông tin giao dịch an toàn.',
    meaning: 'Cầu nối mở rộng HRMS với toàn bộ hệ sinh thái phần mềm doanh nghiệp và cơ quan nhà nước.',
    inputs: ['API Contract / SFTP Credentials', 'Bản đồ ánh xạ dữ liệu (Data Mapping)', 'Lịch trình đồng bộ định kỳ & Real-time Webhooks'],
    outputs: ['Dữ liệu đồng bộ thông suốt giữa các hệ thống', 'Biên bản đối soát dữ liệu (Reconciliation)', 'Hàng đợi phục hồi giao dịch lỗi (DLQ)'],
    controls: ['Xác thực kết nối mTLS / OAuth 2.0', 'Tự động bắt lỗi và thử lại có kiểm soát', 'Không phát sinh giao dịch thật trong chế độ demo']
  },
  {
    id: 'security',
    code: 'SEC',
    label: 'Phân quyền',
    sopCount: 10,
    workflowId: 'MODULE-PLT-SEC',
    firstSopCode: 'SEC-01',
    icon: ShieldCheck,
    receive: 'Cơ cấu tổ chức, quyết định bổ nhiệm, vai trò người dùng và chính sách bảo vệ dữ liệu.',
    transfer: 'Quyền truy cập chức năng và phạm vi dữ liệu (Self, Direct Reports, Department, Company).',
    meaning: 'Thiết lập lá chắn bảo mật nghiêm ngặt, đảm bảo đúng người được xem và thao tác đúng phạm vi dữ liệu.',
    inputs: ['Mô hình phân quyền dựa trên vai trò (RBAC)', 'Phạm vi dữ liệu (Data Scope)', 'Ma trận chống xung đột quyền (SoD)'],
    outputs: ['Ma trận phân quyền chi tiết cho từng tài khoản', 'Quyền truy cập dữ liệu nhạy cảm có thời hạn', 'Tự động thu hồi quyền khi thôi việc/chuyển vị trí'],
    controls: ['Tách biệt quyền chức năng và quyền dữ liệu', 'Kiểm soát chặt chẽ tài khoản Super Admin (MFA)', 'Rà soát quyền định kỳ hàng quý']
  },
  {
    id: 'audit',
    code: 'AUD',
    label: 'Audit log',
    sopCount: 8,
    workflowId: 'MODULE-PLT-AUD',
    firstSopCode: 'AUD-01',
    icon: History,
    receive: 'Toàn bộ hành động đăng nhập, sửa đổi dữ liệu, phê duyệt, xem và xuất file trên toàn hệ thống.',
    transfer: 'Nhật ký kiểm toán bất biến, báo cáo tra cứu sự kiện và bằng chứng phục vụ kiểm tra/thanh tra.',
    meaning: 'Hộp đen ghi nhận mọi dấu vết vận hành, đảm bảo tính minh bạch, trách nhiệm giải trình và an toàn thông tin.',
    inputs: ['Dòng sự kiện thao tác người dùng (Event Stream)', 'Giá trị trước và sau khi thay đổi dữ liệu', 'Mã phiên và địa chỉ IP kết nối'],
    outputs: ['Nhật ký kiểm toán bất biến (Immutable Audit Trail)', 'Báo cáo phát hiện hoạt động bất thường', 'Bằng chứng số phục vụ kiểm toán nội bộ & độc lập'],
    controls: ['Log không thể bị xóa hoặc sửa đổi bởi bất kỳ ai', 'Ghi nhận Correlation ID xuyên suốt giao dịch', 'Lưu trữ lạnh có mã hóa theo chính sách Retention']
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

export const PlatformFoundationCoverage: React.FC<{ mode: PlatformCoverageMode }> = ({ mode }) => {
  const navigate = useNavigate()
  const [selectedModuleId, setSelectedModuleId] = useState('shared')
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const selectedModule = PLATFORM_MODULES.find((m) => m.id === selectedModuleId) ?? PLATFORM_MODULES[0]
  const inspectedModule = PLATFORM_MODULES.find((m) => m.id === hoveredModuleId) ?? selectedModule

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
        setRotationAngle((angle) => (angle + deltaSeconds * 3.2) % 360)
      }
      lastTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [hoveredModuleId, isPageVisible, isRotating, mode, prefersReducedMotion])

  const svgSize = 680
  const center = svgSize / 2
  const orbitRadius = 235

  const nodePositions = useMemo(() => {
    return PLATFORM_MODULES.map((module, index) => {
      const baseAngle = -90 + index * (360 / PLATFORM_MODULES.length)
      const angle = prefersReducedMotion ? baseAngle : baseAngle + rotationAngle
      const radians = (angle * Math.PI) / 180
      return {
        module,
        x: center + orbitRadius * Math.cos(radians),
        y: center + orbitRadius * Math.sin(radians)
      }
    })
  }, [prefersReducedMotion, rotationAngle, center, orbitRadius])

  const openModule = (module: PlatformModule) => {
    navigate(`/employee-lifecycle/infographic/${module.workflowId}?sop=${encodeURIComponent(module.firstSopCode)}`)
  }

  // 1. GÓC NHÌN ĐẦU VÀO VÀ KẾT QUẢ
  if (mode === 'matrix') {
    return (
      <section className="space-y-4">
        <header className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white shadow-2xs">
            <Cpu className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Đầu vào và kết quả của Nền tảng</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Chọn một dịch vụ nền tảng để xem dữ liệu tiếp nhận, kết quả cung cấp và các kiểm soát an toàn bắt buộc.
            </p>
          </div>
        </header>

        {/* Module Switcher Tabs */}
        <nav aria-label="Chọn dịch vụ Nền tảng" className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/50">
          {PLATFORM_MODULES.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setSelectedModuleId(module.id)}
              className={`rounded-md px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                selectedModule.id === module.id
                  ? 'bg-[#1f5f86] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {module.label}
            </button>
          ))}
        </nav>

        {/* 3-Column Input -> Process -> Output Flow */}
        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              Đầu vào cần có
            </h5>
            <CheckList items={selectedModule.inputs} />
          </article>

          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
          </div>

          <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">Dịch vụ nền tảng xử lý</p>
            <h5 className="mt-2 text-base font-black">{selectedModule.label}</h5>
            <p className="mt-1 text-xs text-sky-100">{selectedModule.sopCount} SOP chuẩn hóa</p>
            <button
              type="button"
              onClick={() => openModule(selectedModule)}
              className="mt-4 flex w-fit items-center gap-1 rounded border border-white/30 px-2.5 py-1.5 text-[11px] font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              Xem quy trình <ArrowRight className="h-3 w-3" />
            </button>
          </article>

          <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
            <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
          </div>

          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <h5 className="mb-3 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              Kết quả tạo ra
            </h5>
            <CheckList items={selectedModule.outputs} />
          </article>
        </div>

        {/* Kiểm soát bắt buộc */}
        <article className="rounded-lg border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
          <h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-[#2e8bbd]" />
            Kiểm soát bắt buộc của dịch vụ
          </h5>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
            <CheckList items={selectedModule.controls} />
          </div>
        </article>

        {/* Mối quan hệ với các cụm nghiệp vụ khác */}
        <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <h5 className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Mối quan hệ phục vụ các cụm nghiệp vụ
          </h5>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950 space-y-1">
              <span className="font-bold text-[#1f5f86] dark:text-sky-300 block">Vận hành lõi (Core)</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Sử dụng Workflow phê duyệt, Tài liệu, Ký số, Thông báo nhắc việc, Tích hợp máy chấm công/ngân hàng, Phân quyền hồ sơ và Audit log giao dịch.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950 space-y-1">
              <span className="font-bold text-[#1f5f86] dark:text-sky-300 block">Phát triển con người (People)</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Sử dụng Workflow duyệt mục tiêu/đánh giá, Thông báo lịch học, Tài liệu chứng chỉ, Phân quyền xem 9-Box và Audit log điểm số.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950 space-y-1">
              <span className="font-bold text-[#1f5f86] dark:text-sky-300 block">Quản trị tổ chức (Organization)</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Sử dụng Danh mục dùng chung, Cấu hình tham số, Workflow duyệt định biên, Phân quyền quản lý vị trí và Audit log tái cơ cấu.
              </p>
            </div>
          </div>
        </article>
      </section>
    )
  }

  // 2. GÓC NHÌN LUỒNG LIÊN PHÂN HỆ
  if (mode === 'flow') {
    return (
      <section className="space-y-5">
        <header className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f5f86] text-white shadow-2xs">
            <ArrowRight className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Luồng dữ liệu dịch vụ nền tảng</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Danh mục và Cấu hình chuẩn hóa đầu vào → Workflow và Tài liệu xử lý giao dịch → Ký số và Thông báo phát tán → Tích hợp, Phân quyền và Audit bảo vệ an toàn toàn diện.
            </p>
          </div>
        </header>

        {/* 9-Module Horizontal Flow Sequence */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-9">
          {PLATFORM_MODULES.map((module, index) => {
            const Icon = module.icon
            const active = module.id === selectedModule.id
            return (
              <div key={module.id} className="relative flex min-w-0 items-stretch">
                <button
                  type="button"
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`w-full rounded-lg border p-2.5 text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'border-[#1f5f86] bg-[#1f5f86] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded ${
                        active ? 'bg-white/15 text-white' : 'bg-sky-50 text-[#1f5f86] dark:bg-sky-950 dark:text-sky-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className={`text-[9px] font-bold font-mono ${active ? 'text-sky-100' : 'text-slate-400'}`}>
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h5 className="text-[11px] font-black leading-snug truncate">{module.label}</h5>
                    <p className={`mt-0.5 text-[9px] ${active ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {module.sopCount} SOP · {module.code}
                    </p>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Selected Module Detail Stream */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              {selectedModule.label} tiếp nhận
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.receive}</p>
          </article>
          <div className="flex items-center justify-center">
            <ArrowRight className="h-4 w-4 rotate-90 text-slate-300 lg:rotate-0" />
          </div>
          <article className="rounded-lg border border-sky-200 bg-white p-4 dark:border-sky-900 dark:bg-slate-900">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
              Dữ liệu & dịch vụ được bàn giao
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{selectedModule.transfer}</p>
          </article>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 lg:flex-row lg:items-center">
          <span className="font-bold text-slate-900 dark:text-white">Kiến trúc dùng chung:</span>
          <span>Dữ liệu & Cấu hình chuẩn</span>
          <ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
          <span className="font-semibold text-[#1f5f86] dark:text-sky-200">Xử lý giao dịch & Ký số</span>
          <ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
          <span>Bảo mật, Tích hợp & Kiểm toán bất biến</span>
        </div>
      </section>
    )
  }

  // 3. GÓC NHÌN QUAN HỆ PHÂN HỆ (VÒNG TRÒN 9 NODE)
  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/70 dark:border-blue-800">
              MỐI QUAN HỆ PHÂN HỆ
            </span>
          <h4 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
            Nền tảng vận hành và dịch vụ dùng chung HRMS
          </h4>
        </div>

        {!prefersReducedMotion && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsRotating((value) => !value)}
              aria-label={isRotating ? 'Tạm dừng chuyển động quỹ đạo' : 'Tiếp tục chuyển động quỹ đạo'}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isRotating
                  ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}
            >
              {isRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRotating ? 'Tạm dừng' : 'Chuyển động'}</span>
            </button>

            {rotationAngle !== 0 && (
              <button
                type="button"
                onClick={() => setRotationAngle(0)}
                aria-label="Đặt lại vị trí quỹ đạo"
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Desktop & Tablet: Interactive 9-Node Orbit SVG */}
      <div className="hidden flex-col items-center gap-6 md:flex xl:flex-row xl:items-center justify-between py-2">
        <div className="relative mx-auto aspect-square w-full max-w-[680px] shrink-0 select-none">
          <svg className="h-full w-full" viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none" aria-hidden="true">
            {/* Dashed Orbit Track - NO ARROWHEADS AS REQUIRED */}
            <circle
              cx={center}
              cy={center}
              r={orbitRadius}
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />

            {/* Radial Spokes from Center Hub to each node */}
            {nodePositions.map((position) => {
              const highlighted = hoveredModuleId === position.module.id || selectedModule.id === position.module.id
              return (
                <line
                  key={`spoke-${position.module.id}`}
                  x1={center}
                  y1={center}
                  x2={position.x}
                  y2={position.y}
                  className={`transition-all duration-300 ${
                    highlighted ? 'stroke-blue-600 dark:stroke-blue-500' : 'stroke-slate-200 dark:stroke-slate-800'
                  }`}
                  strokeWidth={highlighted ? 2.5 : 1.25}
                  strokeDasharray={highlighted ? undefined : '3 3'}
                />
              )
            })}
          </svg>

          {/* Central Platform Hub */}
          <div className="absolute left-1/2 top-1/2 z-10 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-blue-600/80 bg-white p-3 text-center shadow-md ring-4 ring-blue-50 dark:border-blue-500 dark:bg-slate-900 dark:ring-blue-950/40 select-none">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-400">
              <Cpu className="h-6 w-6" strokeWidth={2} />
            </span>
            <span className="mt-2 text-xs font-black text-slate-900 dark:text-white leading-tight">
              Nền tảng vận hành HRMS
            </span>
            <span className="mt-0.5 text-[9px] font-medium text-slate-500 dark:text-slate-400 max-w-[130px] leading-tight">
              Dịch vụ dùng chung và kiểm soát hệ thống
            </span>
          </div>

          {/* 9 Upright Orbit Module Cards */}
          {nodePositions.map(({ module, x, y }) => {
            const Icon = module.icon
            const active = module.id === selectedModule.id
            const highlighted = active || module.id === hoveredModuleId

            return (
              <div
                key={module.id}
                style={{
                  left: `${(x / svgSize) * 100}%`,
                  top: `${(y / svgSize) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20"
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedModuleId(module.id)}
                  onMouseEnter={() => setHoveredModuleId(module.id)}
                  onMouseLeave={() => setHoveredModuleId(null)}
                  onFocus={() => setHoveredModuleId(module.id)}
                  onBlur={() => setHoveredModuleId(null)}
                  className={`w-[145px] rounded-xl border p-2 text-left shadow-2xs transition-all duration-200 cursor-pointer motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 select-none ${
                    highlighted
                      ? 'scale-[1.05] border-blue-600 bg-blue-600 text-white ring-2 ring-blue-600/20 shadow-md'
                      : 'border-slate-200 bg-white text-slate-700 hover:scale-[1.02] hover:border-blue-400 hover:shadow-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                        highlighted
                          ? 'bg-white/20 text-white'
                          : 'border border-slate-200 bg-blue-50 text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-black">{module.label}</span>
                      <span className={`block text-[8.5px] font-mono ${highlighted ? 'text-blue-100' : 'text-slate-400'}`}>
                        {module.sopCount} SOP · {module.code}
                      </span>
                    </span>
                  </div>
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

      {/* Mobile Responsive View (< 768px): Vertical Module Sequence */}
      <div className="space-y-3 md:hidden">
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
            <Cpu className="h-5 w-5" />
          </span>
          <div>
            <h5 className="text-xs font-black text-slate-900 dark:text-white">Nền tảng vận hành HRMS</h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Chín dịch vụ dùng chung và kiểm soát hệ thống toàn diện.
            </p>
          </div>
        </div>

        {PLATFORM_MODULES.map((module, index) => {
          const Icon = module.icon
          const active = module.id === selectedModule.id
          return (
            <div key={module.id} className="space-y-1">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedModuleId(module.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                    active ? 'bg-white/20' : 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black">
                    {index + 1}. {module.label}
                  </span>
                  <span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                    {module.sopCount} SOP · {module.code}
                  </span>
                </span>
              </button>

              {active && (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] dark:border-slate-700 dark:bg-slate-800">
                  <p>
                    <strong>Nhận từ:</strong> {module.receive}
                  </p>
                  <p>
                    <strong>Chuyển sang:</strong> {module.transfer}
                  </p>
                  <button
                    type="button"
                    onClick={() => openModule(module)}
                    className="flex items-center gap-1 font-bold text-[#1f5f86] dark:text-sky-300 pt-1 cursor-pointer"
                  >
                    Xem quy trình <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Bottom Sequence */}
      <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-slate-400">
          Chuỗi dịch vụ dùng chung Nền tảng
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9">
          {PLATFORM_MODULES.map((module, index) => (
            <button
              key={module.id}
              type="button"
              onClick={() => setSelectedModuleId(module.id)}
              className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                selectedModule.id === module.id
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40'
                  : 'border-slate-200 bg-slate-50/80 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900'
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[10px] font-bold text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                  {module.label}
                </span>
                <span className="block truncate text-[9px] text-slate-500 dark:text-slate-400">
                  {module.sopCount} SOP
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
