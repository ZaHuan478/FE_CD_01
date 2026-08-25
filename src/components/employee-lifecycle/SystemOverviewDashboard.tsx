import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, GitBranch, PieChart, Workflow } from 'lucide-react'
import { RadialEcosystemChart } from './RadialEcosystemChart'
import { ProcessInputOutputView } from './ProcessInputOutputView'
import { CompactDataFlowDiagram } from './data-flow/CompactDataFlowDiagram'
import { useLanguage } from '../../context/LanguageContext'
import { SOP_DATABASE } from './workflow-detail/data/sopDatabase'

type ModuleId = 'recruitment' | 'employee' | 'attendance' | 'payroll' | 'insurance' | 'tax' | 'shared' | 'configuration'
interface ModuleMenuItem { label: string; sopCode?: string; workflowId?: string; disabled?: boolean; groupHeader?: boolean }
interface ModuleMenu { id: ModuleId; label: string; code: string; count: number; items: ModuleMenuItem[] }

const processMenuItems = (workflowId: string): ModuleMenuItem[] =>
  (SOP_DATABASE[workflowId] ?? []).map((process) => ({
    label: process.sopTitle.replace(/^Quy trình\s+/i, ''),
    sopCode: process.sopCode,
    workflowId
  }))

let moduleMenus: ModuleMenu[] = [
  {
    id: 'recruitment', label: 'Tuyển dụng', code: 'REC', count: 4,
    items: [{ label: 'Chưa có quy trình chi tiết', disabled: true }]
  },
  {
    id: 'employee', label: 'Nhân sự', code: 'EMP', count: 15,
    items: [
      { label: 'EMP08 - Điều chỉnh thu nhập định kỳ', sopCode: 'SOP EMP08', workflowId: 'LIFE-05' },
      { label: 'EMP09 - Điều chỉnh thu nhập đột xuất', sopCode: 'SOP EMP09', workflowId: 'LIFE-05' },
      { label: 'EMP10 - Điều chỉnh thu nhập theo lương tối thiểu vùng', sopCode: 'SOP EMP10', workflowId: 'LIFE-05' },
      { label: 'EMP11 - Thay đổi quá trình công tác', sopCode: 'SOP EMP11', workflowId: 'LIFE-03' },
      { label: 'EMP12 - Quản lý thông tin kỷ luật', sopCode: 'SOP EMP12' },
      { label: 'EMP13 - Quản lý khen thưởng', sopCode: 'SOP EMP13' },
      { label: 'EMP14 - Quản lý công tác', sopCode: 'SOP EMP14' },
      { label: 'EMP15 - Giảm lao động', sopCode: 'SOP EMP15', workflowId: 'LIFE-07' }
    ]
  },
  {
    id: 'attendance', label: 'Chấm công', code: 'ATT', count: 15,
    items: processMenuItems('MODULE-ATT')
  },
  {
    id: 'payroll', label: 'Lương', code: 'PAY', count: 4,
    items: processMenuItems('MODULE-PAY')
  },
  {
    id: 'insurance', label: 'Bảo hiểm', code: 'INS', count: 8,
    items: processMenuItems('MODULE-INS')
  },
  {
    id: 'tax', label: 'Thuế', code: 'TAX', count: 3,
    items: processMenuItems('MODULE-TAX')
  },
  {
    id: 'shared', label: 'Danh mục chung', code: 'MD', count: 54,
    items: [
      { label: 'Chức năng quản lý danh mục', groupHeader: true },
      ...processMenuItems('MODULE-MD-FUNCTIONS'),
      { label: 'Dữ liệu danh mục dùng chung', groupHeader: true },
      ...processMenuItems('MODULE-MD')
    ]
  },
  {
    id: 'configuration', label: 'Cấu hình HRM', code: 'CFG', count: 2,
    items: [
      { label: 'Danh sách nhóm người dùng và vai trò' },
      { label: 'Danh sách cấu hình trong hệ thống HRM' }
    ]
  }
]

const lifecycleSummary = ['Định biên nhân sự', 'Tuyển dụng', 'Tiếp nhận và hội nhập', 'Hồ sơ và hợp đồng', 'Đào tạo và đánh giá', 'Lương, thưởng và phúc lợi', 'Chấm công và quản lý làm việc', 'Thuyên chuyển và thôi việc']

void lifecycleSummary

const normalizeSopCode = (value?: string) => (value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')

const formatMenuLabel = (label: string) => label.replace(/^EMP\d+\s*-\s*/, '')

const workflowBySopCode: Record<string, string> = {
  'SOP EMP05': 'LIFE-04',
  'SOP EMP07': 'LIFE-04',
  'SOP EMP09': 'LIFE-05',
  'SOP EMP10': 'LIFE-05',
  'SOP EMP12': 'LIFE-05',
  'SOP EMP13': 'LIFE-05',
  'SOP EMP14': 'LIFE-03'
}

moduleMenus = moduleMenus.map((module) => ({
  ...module,
  items: (module.id === 'employee'
    ? [
        { label: 'EMP01 - Thiết lập định biên nhân sự', sopCode: 'SOP EMP01', workflowId: 'LIFE-00' },
        { label: 'EMP02 - Tăng nhân viên mới không qua quy trình tuyển dụng', sopCode: 'SOP EMP02', workflowId: 'LIFE-01' },
        { label: 'EMP03 - Tăng nhân viên từ nhân viên cũ không qua tuyển dụng', sopCode: 'SOP EMP03', workflowId: 'LIFE-01' },
        { label: 'EMP04 - Quản lý thông tin nhân viên', sopCode: 'SOP EMP04', workflowId: 'LIFE-02' },
        { label: 'EMP05 - Tái ký hợp đồng lao động', sopCode: 'SOP EMP05', workflowId: 'LIFE-04' },
        { label: 'EMP06 - Ký hợp đồng với nhân viên mới', sopCode: 'SOP EMP06', workflowId: 'LIFE-04' },
        { label: 'EMP07 - Ký phụ lục khi thay đổi lương/phụ cấp', sopCode: 'SOP EMP07', workflowId: 'LIFE-04' },
        ...module.items
      ]
    : module.items).map((item) => ({
      ...item,
      label: formatMenuLabel(item.label),
      workflowId: item.workflowId ?? workflowBySopCode[item.sopCode ?? '']
    }))
}))

const getProcessForMenuItem = (item: ModuleMenuItem) => {
  const processes = item.workflowId ? SOP_DATABASE[item.workflowId] ?? [] : []
  const wantedCode = normalizeSopCode(item.sopCode)
  return processes.find((process) => normalizeSopCode(process.sopCode) === wantedCode) ?? (processes.length === 1 ? processes[0] : undefined)
}

export const SystemOverviewDashboard: React.FC = () => {
  useLanguage()
  const navigate = useNavigate()
  const [openModule, setOpenModule] = useState<ModuleId | null>(null)
  const [openProcessKey, setOpenProcessKey] = useState<string | null>(null)
  const [openProcessTop, setOpenProcessTop] = useState(8)
  const [coverageViewMode, setCoverageViewMode] = useState<'wheel' | 'matrix' | 'flow'>('wheel')
  const [isCoverageExpanded, setIsCoverageExpanded] = useState(true)
  const closeMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const keepMenuOpen = () => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current)
      closeMenuTimer.current = null
    }
  }
  const scheduleMenuClose = () => {
    keepMenuOpen()
    closeMenuTimer.current = setTimeout(() => {
      setOpenModule(null)
      setOpenProcessKey(null)
      closeMenuTimer.current = null
    }, 700)
  }
  const openMenuItem = (item: ModuleMenuItem, stepNumber?: number) => {
    if (!item.workflowId) return
    const params = new URLSearchParams({ sop: item.sopCode ?? '' })
    if (stepNumber) params.set('step', String(stepNumber))
    navigate(`/employee-lifecycle/infographic/${item.workflowId}?${params.toString()}`)
  }

  return (
    <div className="space-y-5">
      <section className="relative z-20 overflow-visible rounded-lg border border-slate-300 bg-white shadow-sm">
        <div className="flex flex-wrap items-start gap-1 overflow-visible bg-[#1f5f86] px-2 py-1.5 text-white">
          {moduleMenus.map((module) => {
            const active = openModule === module.id
            return (
              <div key={module.id} className="relative shrink-0" onMouseEnter={() => { keepMenuOpen(); setOpenModule(module.id); setOpenProcessKey(null); setOpenProcessTop(8) }} onMouseLeave={scheduleMenuClose}>
                <button type="button" onClick={() => { setOpenModule(active ? null : module.id); setOpenProcessKey(null) }} aria-expanded={active} className={`flex items-center gap-1.5 border-r border-white/20 px-3 py-2 text-xs font-semibold transition-colors ${active ? 'bg-white/15' : 'hover:bg-white/10'}`}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-cyan-400 text-[10px] font-black text-white">{module.code.slice(0, 1)}</span><span>{module.label}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${active ? 'rotate-180' : ''}`} />
                </button>
                {active && (
                  <div onMouseEnter={keepMenuOpen} onMouseLeave={scheduleMenuClose} className="absolute left-0 top-full z-50 mt-1 w-[330px] max-w-[calc(100vw-2rem)] rounded-lg border border-slate-300 bg-white p-2 text-slate-700 shadow-xl">
                    <div className="relative max-h-64 overflow-y-auto" onScroll={() => setOpenProcessKey(null)}>
                      {module.items.map((item) => {
                        if (item.groupHeader) {
                          return <div key={`${module.id}-${item.label}`} className="sticky top-0 z-10 mt-1 border-b border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1f5f86] first:mt-0">{item.label}</div>
                        }
                        const process = getProcessForMenuItem(item)
                        const processKey = `${module.id}-${item.sopCode ?? item.label}`
                        const hasSteps = Boolean(process?.steps?.length)
                        return <button key={`${module.id}-${item.label}`} type="button" disabled={item.disabled} onMouseEnter={(event) => { if (hasSteps) { const listContainer = event.currentTarget.parentElement; const rowTop = event.currentTarget.offsetTop - (listContainer?.scrollTop ?? 0); setOpenProcessKey(processKey); setOpenProcessTop(Math.max(8, rowTop + 8)) } }} onClick={() => !item.disabled && openMenuItem(item)} className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors ${item.disabled ? 'cursor-not-allowed text-slate-400' : openProcessKey === processKey ? 'bg-[#2e8bbd] text-white' : 'text-slate-700 hover:bg-sky-50 hover:text-[#1f5f86]'}`}>
                          <span className="min-w-0">{item.label}</span><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${item.disabled ? 'bg-slate-100 text-slate-400' : openProcessKey === processKey ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#1f5f86]'}`}>{item.disabled ? '–' : hasSteps ? <ChevronRight className="h-3 w-3" /> : '›'}</span>
                        </button>
                      })}
                    </div>
                    {module.items.map((item) => {
                      const process = getProcessForMenuItem(item)
                      const processKey = `${module.id}-${item.sopCode ?? item.label}`
                      if (!process || openProcessKey !== processKey) return null
                      return <div key={`steps-${processKey}`} style={{ top: openProcessTop }} className="absolute left-[calc(100%+4px)] z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border border-slate-300 bg-white p-2 text-slate-700 shadow-xl">
                        <div className="max-h-64 overflow-y-auto">
                          {process.steps.map((step, stepIndex) => <button key={step.stepCode} type="button" onClick={() => openMenuItem({ label: step.title, sopCode: process.sopCode, workflowId: item.workflowId }, stepIndex + 1)} className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-[#1f5f86]"><span className="mt-0.5 rounded bg-sky-100 px-1 py-0.5 font-mono text-[9px] font-bold text-[#1f5f86]">{step.stepCode}</span><span>{step.title}</span></button>)}
                        </div>
                      </div>
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </section>

      <section id="coverage-wheel" className="rounded-lg border border-slate-300 bg-white shadow-sm scroll-mt-28">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><PieChart className="h-4 w-4 text-[#1f5f86]" /> Tổng quan phân hệ và dữ liệu</h3></div><div className="flex flex-wrap items-center gap-1 rounded border border-slate-200 bg-slate-50 p-1"><ViewButton active={coverageViewMode === 'wheel'} onClick={() => setCoverageViewMode('wheel')} icon={<PieChart className="h-3.5 w-3.5" />}>Quan hệ phân hệ</ViewButton><ViewButton active={coverageViewMode === 'matrix'} onClick={() => setCoverageViewMode('matrix')} icon={<Workflow className="h-3.5 w-3.5" />}>Đầu vào và kết quả</ViewButton><ViewButton active={coverageViewMode === 'flow'} onClick={() => setCoverageViewMode('flow')} icon={<GitBranch className="h-3.5 w-3.5" />}>Luồng liên phân hệ</ViewButton><button type="button" onClick={() => setIsCoverageExpanded((value) => !value)} className="px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">{isCoverageExpanded ? 'Thu gọn' : 'Mở rộng'}</button></div></div>
        {isCoverageExpanded && <div className="p-4">{coverageViewMode === 'wheel' && <RadialEcosystemChart />}{coverageViewMode === 'matrix' && <ProcessInputOutputView />}{coverageViewMode === 'flow' && <CompactDataFlowDiagram />}</div>}
      </section>
    </div>
  )
}

const SummaryTile: React.FC<{ icon: React.ReactNode; label: string; value: string; detail: string }> = ({ icon, label, value, detail }) => <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><span className="text-[#1f5f86]">{icon}</span>{label}</div><p className="mt-2 text-xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p></div>
void SummaryTile

const ViewButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => <button type="button" onClick={onClick} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold ${active ? 'bg-[#1f5f86] text-white' : 'text-slate-600 hover:bg-white'}`}>{icon}{children}</button>
