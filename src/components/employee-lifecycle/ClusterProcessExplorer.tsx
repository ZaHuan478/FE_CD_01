import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  FileText,
  Filter,
  GitBranch,
  GraduationCap,
  History,
  Inbox,
  Info,
  Layers,
  Layers3,
  ListCheck,
  Network,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trophy,
  UserCheck,
  UserRoundCheck,
  UsersRound,
  Workflow,
  type LucideIcon
} from 'lucide-react'
import { SOP_DATABASE } from './workflow-detail/data/sopDatabase'
import type { SopSubProcess, SopSubStep } from './workflow-detail/types'
import { useLanguage } from '../../context/LanguageContext'

type ExplorerCluster = 'people' | 'organization' | 'platform'

interface ExplorerModule {
  id: string
  code: string
  label: string
  shortLabel?: string
  description: string
  workflowId: string
  icon: LucideIcon
  processCodes?: string[]
  receivesFrom?: string
  sendsTo?: string
}

interface ExplorerClusterConfig {
  label: string
  labelEn: string
  description: string
  descriptionEn: string
  modules: ExplorerModule[]
}

const CLUSTER_CONFIGS: Record<ExplorerCluster, ExplorerClusterConfig> = {
  people: {
    label: 'Phát triển con người',
    labelEn: 'People Development',
    description: 'Theo dõi mục tiêu, đánh giá, năng lực, học tập, nhân tài và trải nghiệm nhân viên.',
    descriptionEn: 'Track goals, performance appraisals, competencies, learning, talent succession, and employee engagement.',
    modules: [
      {
        id: 'kpi',
        code: 'KPI',
        label: 'KPI',
        shortLabel: 'KPI',
        description: 'Thiết lập mục tiêu và theo dõi tiến độ trong kỳ.',
        workflowId: 'MODULE-PFM',
        processCodes: ['PFM-02', 'PFM-03'],
        icon: Target,
        receivesFrom: 'Chiến lược, mục tiêu đơn vị, mô tả công việc và chu kỳ hiệu suất.',
        sendsTo: 'Mục tiêu đã duyệt, trọng số, target, tiến độ và bằng chứng thực hiện.'
      },
      {
        id: 'review',
        code: 'REV',
        label: 'Đánh giá',
        shortLabel: 'Đánh giá',
        description: 'Thiết lập kỳ, đánh giá kết quả, hiệu chỉnh và xử lý sau đánh giá.',
        workflowId: 'MODULE-PFM',
        processCodes: ['PFM-01', 'PFM-04', 'PFM-05', 'PFM-06'],
        icon: ClipboardCheck,
        receivesFrom: 'Mục tiêu, kết quả thực hiện, bằng chứng, phản hồi và thang điểm.',
        sendsTo: 'Kết quả hiệu suất đã hiệu chỉnh, phê duyệt và kế hoạch cải thiện.'
      },
      {
        id: 'competency',
        code: 'CMP',
        label: 'Năng lực và Kỹ năng',
        shortLabel: 'Năng lực',
        description: 'Xây dựng chuẩn năng lực, xác thực kỹ năng và phân tích khoảng trống.',
        workflowId: 'MODULE-CMP',
        icon: BrainCircuit,
        receivesFrom: 'Chức danh, từ điển năng lực, kết quả đánh giá và hồ sơ kỹ năng.',
        sendsTo: 'Mức năng lực xác thực, competency gap và kế hoạch phát triển cá nhân.'
      },
      {
        id: 'learning',
        code: 'LND',
        label: 'Đào tạo và Phát triển',
        shortLabel: 'Đào tạo',
        description: 'Lập kế hoạch, tổ chức học tập và đo hiệu quả đào tạo.',
        workflowId: 'MODULE-LND',
        icon: GraduationCap,
        receivesFrom: 'Competency gap, IDP, yêu cầu tuân thủ, nhu cầu đơn vị và ngân sách.',
        sendsTo: 'Lịch sử học tập, chứng chỉ, mức hoàn thành và hiệu quả sau đào tạo.'
      },
      {
        id: 'talent',
        code: 'TAL',
        label: 'Nghề nghiệp và Kế nhiệm',
        shortLabel: 'Kế nhiệm',
        description: 'Quản lý talent pool, lộ trình nghề nghiệp và nguồn kế nhiệm.',
        workflowId: 'MODULE-TAL',
        icon: Trophy,
        receivesFrom: 'Hiệu suất, năng lực, IDP, nguyện vọng nghề nghiệp và vị trí trọng yếu.',
        sendsTo: 'Talent pool, 9-Box, successor slate và mức sẵn sàng kế nhiệm.'
      },
      {
        id: 'engagement',
        code: 'ENG',
        label: 'Ghi nhận và Phúc lợi',
        shortLabel: 'Ghi nhận',
        description: 'Ghi nhận đóng góp, quản lý quyền lợi và cải thiện gắn kết.',
        workflowId: 'MODULE-ENG',
        icon: UsersRound,
        receivesFrom: 'Thành tích, chính sách ghi nhận, eligibility, ngân sách và phản hồi nhân viên.',
        sendsTo: 'Lịch sử ghi nhận, quyền lợi, dữ liệu PAY/TAX và action plan gắn kết.'
      }
    ]
  },
  organization: {
    label: 'Quản trị tổ chức',
    labelEn: 'Organization Management',
    description: 'Quản lý định biên, cơ cấu, chức danh, vị trí và báo cáo nhân sự theo ngày hiệu lực.',
    descriptionEn: 'Manage headcount, organizational structures, job architectures, positions, and workforce analytics.',
    modules: [
      {
        id: 'headcount',
        code: 'HC',
        label: 'Định biên',
        shortLabel: 'Định biên',
        description: 'Lập kế hoạch nhân lực, phê duyệt hạn mức và giám sát Actual so với Plan.',
        workflowId: 'MODULE-ORG-HC',
        icon: UsersRound,
        receivesFrom: 'Kế hoạch kinh doanh, ngân sách nhân sự, đề xuất từ các đơn vị.',
        sendsTo: 'Hạn mức định biên đã duyệt làm căn cứ tuyển dụng và tiếp nhận.'
      },
      {
        id: 'structure',
        code: 'OST',
        label: 'Cơ cấu tổ chức',
        shortLabel: 'Cơ cấu',
        description: 'Quản lý cây tổ chức, thay đổi đơn vị và các phương án tái cơ cấu.',
        workflowId: 'MODULE-ORG-ST',
        icon: Building2,
        receivesFrom: 'Quyết định thành lập, giải thể, sáp nhập và điều chỉnh đơn vị.',
        sendsTo: 'Cây cơ cấu tổ chức chuẩn hóa và phạm vi quản lý cho toàn hệ thống.'
      },
      {
        id: 'job',
        code: 'JOB',
        label: 'Chức danh',
        shortLabel: 'Chức danh',
        description: 'Quản lý kiến trúc nghề nghiệp, mô tả công việc, cấp bậc và vòng đời chức danh.',
        workflowId: 'MODULE-ORG-JOB',
        icon: BriefcaseBusiness,
        receivesFrom: 'Khung năng lực, chuẩn chức danh và ma trận phân cấp trách nhiệm.',
        sendsTo: 'Từ điển chức danh, bản mô tả công việc chuẩn và ngạch bậc lương.'
      },
      {
        id: 'position',
        code: 'POS',
        label: 'Vị trí',
        shortLabel: 'Vị trí',
        description: 'Quản lý từng vị trí cụ thể, người đảm nhiệm, FTE, vacancy và tuyến báo cáo.',
        workflowId: 'MODULE-ORG-POS',
        icon: UserRoundCheck,
        receivesFrom: 'Định biên được duyệt và chức danh thuộc từng phòng ban.',
        sendsTo: 'Mã vị trí công tác, tuyến báo cáo trực tiếp và trạng thái tuyển dụng.'
      },
      {
        id: 'report',
        code: 'RPT',
        label: 'Báo cáo nhân sự',
        shortLabel: 'Báo cáo',
        description: 'Chuẩn hóa chỉ số và cung cấp báo cáo quản trị lực lượng lao động.',
        workflowId: 'MODULE-ORG-RPT',
        icon: BarChart3,
        receivesFrom: 'Dữ liệu tổng hợp từ toàn bộ các phân hệ HRMS theo thời gian thực.',
        sendsTo: 'Dashboard quản trị, báo cáo tuân thủ nhà nước và chỉ số nhân sự.'
      }
    ]
  },
  platform: {
    label: 'Nền tảng',
    labelEn: 'Platform Foundation',
    description: 'Cung cấp dữ liệu chuẩn, cấu hình, phê duyệt, bảo mật và các dịch vụ dùng chung cho toàn HRMS.',
    descriptionEn: 'Provides master data, system configurations, workflow approvals, security, and shared services.',
    modules: [
      {
        id: 'shared',
        code: 'MD',
        label: 'Danh mục chung',
        shortLabel: 'Danh mục',
        description: 'Chuẩn hóa từ điển dữ liệu được dùng xuyên suốt hệ thống.',
        workflowId: 'MODULE-PLT-MD',
        icon: Layers3,
        receivesFrom: 'Yêu cầu chuẩn hóa danh mục từ các nghiệp vụ chuyên môn.',
        sendsTo: 'Bộ từ điển dữ liệu dùng chung (Tỉnh/thành, dân tộc, ngân hàng, chức vụ).'
      },
      {
        id: 'configuration',
        code: 'CFG',
        label: 'Cấu hình HRM',
        shortLabel: 'Cấu hình',
        description: 'Quản lý tham số và quy tắc vận hành theo từng pháp nhân và thời kỳ.',
        workflowId: 'MODULE-PLT-CFG',
        icon: SlidersHorizontal,
        receivesFrom: 'Chính sách quản trị nhân sự và quy định pháp luật hiện hành.',
        sendsTo: 'Bộ tham số tính toán và quy tắc nghiệp vụ tự động cho hệ thống.'
      },
      {
        id: 'workflow',
        code: 'WFL',
        label: 'Workflow phê duyệt',
        shortLabel: 'Quy trình',
        description: 'Cấu hình tuyến duyệt, thẩm quyền, ủy quyền và SLA xử lý.',
        workflowId: 'MODULE-PLT-WFL',
        icon: Workflow,
        receivesFrom: 'Ma trận thẩm quyền và sơ đồ phân cấp phê duyệt.',
        sendsTo: 'Tuyến duyệt tự động, SLA xử lý và ủy quyền phê duyệt hồ sơ.'
      },
      {
        id: 'document',
        code: 'DOC',
        label: 'Tài liệu',
        shortLabel: 'Tài liệu',
        description: 'Quản lý mẫu, phiên bản, lưu trữ và vòng đời hồ sơ số.',
        workflowId: 'MODULE-PLT-DOC',
        icon: FileText,
        receivesFrom: 'Biểu mẫu văn bản, hồ sơ nhân sự và chứng từ cần số hóa.',
        sendsTo: 'Kho tài liệu điện tử, kiểm soát phiên bản và liên kết lưu trữ.'
      },
      {
        id: 'signature',
        code: 'SIG',
        label: 'Ký số',
        shortLabel: 'Ký số',
        description: 'Điều phối phiên ký và bảo toàn bằng chứng của tài liệu điện tử.',
        workflowId: 'MODULE-PLT-SIG',
        icon: FileSignature,
        receivesFrom: 'Tài liệu cần ký (HĐLĐ, phụ lục, quyết định khen thưởng/kỷ luật).',
        sendsTo: 'Chứng thư số xác thực, chữ ký điện tử hợp pháp và biên bản phiên ký.'
      },
      {
        id: 'notification',
        code: 'NTF',
        label: 'Thông báo',
        shortLabel: 'Thông báo',
        description: 'Phát hành thông báo và nhắc việc theo sự kiện nghiệp vụ.',
        workflowId: 'MODULE-PLT-NTF',
        icon: Bell,
        receivesFrom: 'Sự kiện hệ thống (sắp hết hạn HĐLĐ, cần duyệt công/phép, nhắc việc).',
        sendsTo: 'Tin nhắn Email, Push Notification, Zalo ZNS và thông báo ứng dụng.'
      },
      {
        id: 'integration',
        code: 'INT',
        label: 'Tích hợp',
        shortLabel: 'Tích hợp',
        description: 'Đồng bộ, đối soát và phục hồi giao dịch giữa HRMS với hệ thống ngoài.',
        workflowId: 'MODULE-PLT-INT',
        icon: Network,
        receivesFrom: 'Dữ liệu từ ERP, phần mềm kế toán, máy chấm công, ngân hàng, bảo hiểm.',
        sendsTo: 'API kết nối hai chiều, log đồng bộ và gói dữ liệu chuẩn hóa.'
      },
      {
        id: 'security',
        code: 'SEC',
        label: 'Phân quyền',
        shortLabel: 'Phân quyền',
        description: 'Kiểm soát quyền chức năng, phạm vi dữ liệu và xung đột quyền.',
        workflowId: 'MODULE-PLT-SEC',
        icon: ShieldCheck,
        receivesFrom: 'Danh sách nhân viên, chức vụ, bộ phận và phân quyền vai trò (RBAC).',
        sendsTo: 'Token xác thực, ma trận quyền truy cập màn hình và phạm vi dữ liệu.'
      },
      {
        id: 'audit',
        code: 'AUD',
        label: 'Audit log',
        shortLabel: 'Nhật ký',
        description: 'Ghi nhận dấu vết bất biến phục vụ giải trình, kiểm tra và điều tra sự cố.',
        workflowId: 'MODULE-PLT-AUD',
        icon: History,
        receivesFrom: 'Mọi thao tác thêm/sửa/xóa/duyệt/xuất dữ liệu của người dùng.',
        sendsTo: 'Nhật ký kiểm toán bất biến (Audit Trail) phục vụ bảo mật và thanh tra.'
      }
    ]
  }
}

type StepTypeCode = 'N' | 'M' | 'C' | 'A'

const TYPE_FILTER_OPTIONS: { key: 'ALL' | StepTypeCode; vi: string; en: string; badge?: string }[] = [
  { key: 'ALL', vi: 'Tất cả', en: 'All' },
  { key: 'N', vi: 'Nhập liệu', en: 'Input', badge: 'N' },
  { key: 'M', vi: 'Duyệt', en: 'Approval', badge: 'M' },
  { key: 'C', vi: 'Kiểm soát', en: 'Control', badge: 'C' },
  { key: 'A', vi: 'Tự động', en: 'Auto', badge: 'A' }
]

const getTypeBadgeInfo = (type: StepTypeCode, lang: 'vi' | 'en') => {
  switch (type) {
    case 'N':
      return {
        label: lang === 'vi' ? 'Nhập liệu' : 'Data Entry',
        fullLabel: lang === 'vi' ? 'Nhập liệu / Khai báo' : 'Data Entry / Declaration',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
      }
    case 'M':
      return {
        label: lang === 'vi' ? 'Duyệt' : 'Approval',
        fullLabel: lang === 'vi' ? 'Thẩm định / Phê duyệt' : 'Review / Approval',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
      }
    case 'C':
      return {
        label: lang === 'vi' ? 'Kiểm soát' : 'Control',
        fullLabel: lang === 'vi' ? 'Kiểm soát / Đối soát' : 'Control / Validation',
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
      }
    case 'A':
      return {
        label: lang === 'vi' ? 'Tự động' : 'Automated',
        fullLabel: lang === 'vi' ? 'Tự động / Hệ thống' : 'Automated / System',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
      }
  }
}

const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '')

const extractStepTypes = (steps: SopSubStep[] = []): StepTypeCode[] => {
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

const getModuleProcesses = (module: ExplorerModule): SopSubProcess[] => {
  const processes = SOP_DATABASE[module.workflowId] ?? []
  if (!module.processCodes?.length) return processes
  const allowedCodes = new Set(module.processCodes.map(normalizeCode))
  return processes.filter((process) => allowedCodes.has(normalizeCode(process.sopCode)))
}

const uniqueValues = (values: Array<string | undefined>) => Array.from(new Set(values.filter(Boolean) as string[]))

const DataList: React.FC<{ items?: string[]; tone: 'input' | 'output' }> = ({ items, tone }) => {
  const { language } = useLanguage()
  if (!items?.length) {
    return (
      <p className="text-xs italic text-slate-500 dark:text-slate-400">
        {language === 'vi' ? 'Chưa được mô tả trong dữ liệu hiện có.' : 'Not described in available data.'}
      </p>
    )
  }
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          <CheckCircle2
            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === 'input' ? 'text-[#2e8bbd]' : 'text-[#1f5f86] dark:text-sky-400'}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const KNOWN_WIREFRAME_IDS = new Set<string>([
  'LIFE-00',
  'LIFE-01',
  'LIFE-02',
  'LIFE-03',
  'LIFE-04',
  'LIFE-05',
  'LIFE-06',
  'LIFE-07'
])

export const ClusterProcessExplorer: React.FC<{ cluster: ExplorerCluster }> = ({ cluster }) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const config = CLUSTER_CONFIGS[cluster]

  const [selectedModuleId, setSelectedModuleId] = useState(config.modules[0].id)
  const [selectedProcessCode, setSelectedProcessCode] = useState('')
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | StepTypeCode>('ALL')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setSelectedModuleId(config.modules[0].id)
    setSelectedProcessCode('')
    setActiveTypeFilter('ALL')
    setSearchValue('')
  }, [cluster, config.modules])

  const activeModule = config.modules.find((module) => module.id === selectedModuleId) ?? config.modules[0]
  const activeProcesses = useMemo(() => getModuleProcesses(activeModule), [activeModule])

  const filteredProcesses = useMemo(() => {
    let result = activeProcesses
    if (activeTypeFilter !== 'ALL') {
      result = result.filter(p => {
        const types = extractStepTypes(p.steps)
        return types.includes(activeTypeFilter)
      })
    }
    const query = searchValue.trim().toLocaleLowerCase('vi-VN')
    if (query) {
      result = result.filter((process) =>
        `${process.sopCode} ${process.sopTitle} ${process.sopCategory}`.toLocaleLowerCase('vi-VN').includes(query)
      )
    }
    return result
  }, [activeProcesses, activeTypeFilter, searchValue])

  const activeProcess = activeProcesses.find((process) => process.sopCode === selectedProcessCode) ?? filteredProcesses[0] ?? activeProcesses[0]

  useEffect(() => {
    if (activeProcesses.length && !activeProcesses.some((process) => process.sopCode === selectedProcessCode)) {
      setSelectedProcessCode(activeProcesses[0].sopCode)
    }
  }, [activeProcesses, selectedProcessCode])

  const selectModule = (module: ExplorerModule) => {
    setSelectedModuleId(module.id)
    setSelectedProcessCode(getModuleProcesses(module)[0]?.sopCode ?? '')
    setActiveTypeFilter('ALL')
    setSearchValue('')
  }

  const openDetail = (view: 'infographic' | 'flowchart' | 'raci' | 'specs') => {
    if (!activeProcess) return
    navigate(`/employee-lifecycle/${view}/${activeModule.workflowId}?sop=${encodeURIComponent(activeProcess.sopCode)}`)
  }

  const actors = activeProcess ? uniqueValues(activeProcess.steps.map((step) => step.actor)) : []
  const primaryActor = actors[0] || activeProcess?.steps[0]?.actor || 'Chuyên viên quản trị'
  const stepTypes = activeProcess ? extractStepTypes(activeProcess.steps) : []

  const hasWireframe = Boolean(activeModule.workflowId && KNOWN_WIREFRAME_IDS.has(activeModule.workflowId))

  const handleOpenWireframe = () => {
    if (hasWireframe && activeModule.workflowId) {
      navigate(`/employee-lifecycle/wireframe/${activeModule.workflowId}`)
    }
  }

  return (
    <section
      id={`${cluster}-process-explorer`}
      className="mx-auto w-[92%] max-w-[1920px] space-y-5 rounded-xl border border-slate-300 bg-white p-4 shadow-sm scroll-mt-28 dark:border-slate-700 dark:bg-slate-900 sm:p-6"
    >
      {/* SECTION HEADER */}
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {language === 'vi' ? `Khám phá quy trình ${config.label}` : `${config.labelEn} Process Explorer`}
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
            {language === 'vi'
              ? 'Chi tiết từng quy trình từ đầu vào đến kết quả'
              : 'Detailed Process Workbench & Operational Flows'}
          </h3>
        </div>
      </header>

      {/* TẦNG 1 — MODULE SWITCHER TABS */}
      <nav
        aria-label={`Chọn phân hệ ${config.label}`}
        role="tablist"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950/60"
      >
        {config.modules.map((module) => {
          const isSelected = module.id === activeModule.id
          const count = getModuleProcesses(module).length
          return (
            <button
              key={module.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => selectModule(module)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5f86] ${
                isSelected
                  ? 'bg-[#1f5f86] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span>{module.shortLabel || module.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </nav>

      {/* TẦNG 2 — MODULE SUMMARY & HANDOFF BANNER */}
      <article className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/60 dark:bg-sky-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Module identity */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-white text-[#1f5f86] shadow-2xs dark:border-sky-800 dark:bg-slate-900 dark:text-sky-300">
              <activeModule.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  {activeModule.label}
                </h4>
                <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-[#1f5f86] dark:bg-sky-900/80 dark:text-sky-200">
                  {activeProcesses.length} SOPs · {activeModule.code}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {activeModule.description}
              </p>
            </div>
          </div>

          {/* Right: Cross-module data handoff summary */}
          {(activeModule.receivesFrom || activeModule.sendsTo) && (
            <div className="flex shrink-0 flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-lg border border-sky-200/80 bg-white/90 p-2.5 text-xs text-slate-700 shadow-2xs dark:border-sky-900 dark:bg-slate-900/90 dark:text-slate-200 lg:max-w-[480px]">
              {activeModule.receivesFrom && (
                <div className="flex-1 min-w-0">
                  <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-slate-400">
                    {language === 'vi' ? 'Dữ liệu nhận vào:' : 'Inputs from:'}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] font-semibold" title={activeModule.receivesFrom}>
                    {activeModule.receivesFrom}
                  </span>
                </div>
              )}
              {activeModule.receivesFrom && activeModule.sendsTo && (
                <div className="hidden sm:flex items-center text-slate-300 dark:text-slate-600">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
              {activeModule.sendsTo && (
                <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-1 sm:pt-0 sm:pl-2">
                  <span className="block text-[9.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                    {language === 'vi' ? 'Bàn giao tiếp theo:' : 'Handoff to:'}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] font-semibold text-[#1f5f86] dark:text-sky-300" title={activeModule.sendsTo}>
                    {activeModule.sendsTo}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </article>

      {/* TẦNG 3 — WORKBENCH TWO COLUMNS (38% Left / 62% Right on desktop) */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[38%_62%] xl:gap-6">
        {/* CỘT TRÁI: DANH SÁCH QUY TRÌNH */}
        <aside className="w-full space-y-3.5 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60 sm:p-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5 dark:border-slate-800">
            <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Layers className="h-4 w-4 text-[#1f5f86] dark:text-sky-300" />
              <span>{language === 'vi' ? 'Các quy trình của phân hệ' : 'Module Processes'}</span>
            </h4>
            <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredProcesses.length}/{activeProcesses.length}
            </span>
          </div>

          {/* Type Filter Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {language === 'vi' ? 'Lọc loại thao tác:' : 'Filter by step type:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {TYPE_FILTER_OPTIONS.map((opt) => {
                const isActive = activeTypeFilter === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveTypeFilter(opt.key)}
                    className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1f5f86] ${
                      isActive
                        ? 'bg-[#1f5f86] text-white shadow-2xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {opt.badge && (
                      <span className={`font-mono text-[9px] font-black ${isActive ? 'text-sky-100' : 'text-[#1f5f86] dark:text-sky-300'}`}>
                        {opt.badge}
                      </span>
                    )}
                    <span>{language === 'vi' ? opt.vi : opt.en}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search Input */}
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={language === 'vi' ? 'Tìm mã hoặc tên quy trình' : 'Search by code or title'}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#1f5f86] focus:ring-1 focus:ring-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          {/* Process List */}
          <div className="max-h-[580px] space-y-1.5 overflow-y-auto pr-1" aria-label={`Danh sách quy trình ${activeModule.label}`}>
            {filteredProcesses.map((process) => {
              const isSelected = process.sopCode === activeProcess?.sopCode
              const types = extractStepTypes(process.steps)
              const firstActor = process.steps[0]?.actor

              return (
                <button
                  key={process.sopCode}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedProcessCode(process.sopCode)}
                  className={`flex w-full cursor-pointer items-start justify-between gap-2 rounded-md p-2.5 text-left transition-colors ${
                    isSelected
                      ? 'border-l-3 border-[#1f5f86] bg-sky-50/80 text-[#1f5f86] dark:bg-sky-950/40 dark:text-sky-200'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="font-mono text-[10px] font-bold text-[#1f5f86] dark:text-sky-300">
                        {process.sopCode}
                      </span>
                      {types.map(t => (
                        <span
                          key={t}
                          className="rounded bg-slate-100 px-1 py-0.2 font-mono text-[8.5px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h5 className="text-xs font-semibold leading-snug truncate">
                      {process.sopTitle}
                    </h5>
                    {firstActor && (
                      <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {firstActor}
                      </p>
                    )}
                  </div>

                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                      isSelected
                        ? 'bg-[#1f5f86] text-white'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {isSelected ? '✓' : '›'}
                  </span>
                </button>
              )
            })}

            {!filteredProcesses.length && (
              <div className="rounded-md border border-dashed border-slate-300 p-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {language === 'vi' ? 'Không tìm thấy quy trình phù hợp.' : 'No matching processes found.'}
              </div>
            )}
          </div>
        </aside>

        {/* CỘT PHẢI: CHI TIẾT QUY TRÌNH (IDENTICAL TO ECOSYSTEMSOPDETAIL) */}
        <main className="w-full min-w-0">
          {activeProcess ? (
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
              {/* HEADER */}
              <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-[#1f5f86] px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs">
                      {activeProcess.sopCode}
                    </span>
                    {stepTypes.map(t => {
                      const info = getTypeBadgeInfo(t, language)
                      return (
                        <span
                          key={t}
                          title={info.fullLabel}
                          className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold cursor-help ${info.bg}`}
                        >
                          <span className="font-mono font-black">{t}</span>
                          <span>{info.label}</span>
                        </span>
                      )
                    })}
                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {activeProcess.sopCategory || activeModule.label}
                    </span>
                  </div>

                  <h3 className="text-base font-black leading-snug text-slate-900 dark:text-white sm:text-lg">
                    {activeProcess.sopTitle}
                  </h3>
                </div>

                {/* Sample Screen Wireframe Button */}
                <div>
                  {hasWireframe ? (
                    <button
                      type="button"
                      onClick={handleOpenWireframe}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[#1f5f86] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-300" />
                      <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
                    </button>
                  ) : (
                    <div
                      title={language === 'vi' ? 'SOP này chưa có màn hình mẫu' : 'Sample screen not available for this SOP'}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600 cursor-not-allowed opacity-75"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
                    </div>
                  )}
                </div>
              </header>

              {/* PURPOSE & SCOPE */}
              {activeProcess.description && (
                <section className="rounded-lg border border-sky-100 bg-sky-50/60 p-3.5 dark:border-sky-900/60 dark:bg-sky-950/25">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    {language === 'vi' ? 'Mục đích và phạm vi' : 'Purpose and scope'}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                    {activeProcess.description}
                  </p>
                </section>
              )}

              {/* PARTICIPANTS & RBAC */}
              <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86] dark:text-sky-400" />
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? 'Người thực hiện / Chủ trì' : 'Process Owner'}
                    </h4>
                    <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                      {primaryActor}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <span>{language === 'vi' ? 'Thực hiện theo phân quyền RBAC' : 'Enforced by RBAC'}</span>
                </div>
              </section>

              {/* 3-BLOCK DATA FLOW */}
              <section
                aria-label={language === 'vi' ? 'Đầu vào, nội dung xử lý và kết quả' : 'Inputs, process, and outputs'}
                className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr]"
              >
                {/* INPUT BLOCK */}
                <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
                      <Inbox className="h-3.5 w-3.5" />
                      {language === 'vi' ? 'Đầu vào cần có' : 'Required inputs'}
                    </h4>
                    <DataList items={activeProcess.inputs} tone="input" />
                  </div>
                </article>

                {/* ARROW */}
                <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
                  <ArrowDown className="h-4 w-4 lg:hidden" />
                  <ArrowRight className="hidden h-4 w-4 lg:block" />
                </div>

                {/* PROCESS BLOCK */}
                <article className="flex flex-col justify-center rounded-lg border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white shadow-xs">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-sky-100">
                    {language === 'vi' ? 'Nội dung đang xử lý' : 'Current process'}
                  </h4>
                  <p className="mt-2 text-sm font-bold leading-snug">{activeProcess.sopTitle}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {stepTypes.map(t => (
                      <span key={t} className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>

                {/* ARROW */}
                <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
                  <ArrowDown className="h-4 w-4 lg:hidden" />
                  <ArrowRight className="hidden h-4 w-4 lg:block" />
                </div>

                {/* OUTPUT BLOCK */}
                <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-200">
                      <Send className="h-3.5 w-3.5" />
                      {language === 'vi' ? 'Kết quả tạo ra' : 'Outputs'}
                    </h4>
                    <DataList items={activeProcess.outputs} tone="output" />
                  </div>
                </article>
              </section>

              {/* 4 BUSINESS ACTIONS */}
              <section className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <h4 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <GitBranch className="h-3.5 w-3.5 text-[#1f5f86] dark:text-sky-400" />
                  {language === 'vi' ? 'Xem chi tiết nghiệp vụ' : 'Open business detail'}
                </h4>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      key: 'infographic' as const,
                      icon: <ListCheck className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
                      vi: 'Chi tiết từng bước',
                      en: 'Step details'
                    },
                    {
                      key: 'flowchart' as const,
                      icon: <GitBranch className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
                      vi: 'Sơ đồ luồng xử lý',
                      en: 'Process flowchart'
                    },
                    {
                      key: 'raci' as const,
                      icon: <UserCheck className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
                      vi: 'Vai trò và trách nhiệm',
                      en: 'Roles & RACI'
                    },
                    {
                      key: 'specs' as const,
                      icon: <FileText className="h-4 w-4 text-[#1f5f86] dark:text-sky-400" />,
                      vi: 'Điều kiện và quy định',
                      en: 'Specs & Rules'
                    }
                  ].map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      onClick={() => openDetail(action.key)}
                      className="group flex items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-left text-xs font-bold text-slate-700 transition-colors hover:border-[#2e8bbd] hover:bg-sky-50 hover:text-[#1f5f86] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                    >
                      <span className="flex items-center gap-2">
                        {action.icon}
                        <span>{language === 'vi' ? action.vi : action.en}</span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[#1f5f86] transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {language === 'vi' ? 'Phân hệ này chưa có dữ liệu quy trình.' : 'No process data for this module.'}
            </div>
          )}
        </main>
      </div>
    </section>
  )
}
