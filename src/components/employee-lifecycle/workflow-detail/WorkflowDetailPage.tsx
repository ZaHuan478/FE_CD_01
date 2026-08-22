import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  GitBranch,
  FileText,
  Building2,
  ListCheck,
  UserCheck,
  CheckCircle2,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { WorkflowDetailPageProps } from './types'
import { SOP_DATABASE } from './data/sopDatabase'
import { ROLE_FLOW_DATABASE } from './data/roleFlowDatabase'
import { RoleFlowSection } from './components/RoleFlowSection'
import { WorkflowDiagramView } from './components/WorkflowDiagramView'
import { WorkflowTableView } from './components/WorkflowTableView'
import { SopInfographicFlowView } from './components/SopInfographicFlowView'
import { useLanguage } from '../../../context/LanguageContext'
import { LanguageSelector } from '../../common/LanguageSelector'

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({
  item,
  onBack,
  onOpenWireframe
}) => {
  const { language, t } = useLanguage()
  const location = useLocation()

  // Always scroll to top when opening or switching workflow detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [item.id])

  // Active top-level tab in workflow detail initialized from URL pathname
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'diagram' | 'roles' | 'specs'>(() => {
    if (location.pathname.startsWith('/employee-lifecycle/raci/')) return 'roles'
    if (location.pathname.startsWith('/employee-lifecycle/specs/')) return 'specs'
    return 'diagram'
  })

  // Theme state synced with global document dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('employee_lifecycle_theme') === 'dark'
  })

  useEffect(() => {
    const handleClassChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    const observer = new MutationObserver(handleClassChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('employee_lifecycle_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('employee_lifecycle_theme', 'light')
    }
  }

  const [activeRoleTab, setActiveRoleTab] = useState<'all' | 'candidate' | 'hr'>('all')
  const [isActorsExpanded, setIsActorsExpanded] = useState<boolean>(true)

  // Role flow state
  const availableRoleFlows = ROLE_FLOW_DATABASE[item.id] || [
    {
      roleType: 'candidate',
      roleTitle: 'Góc nhìn Ứng viên / Nhân viên (Candidate Perspective)',
      actorLabel: '🧑‍💻 Ứng viên / Nhân viên',
      badgeColorLight: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeColorDark: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      bgLight: 'bg-blue-50/40',
      bgDark: 'bg-blue-950/20',
      borderLight: 'border-blue-200/80',
      borderDark: 'border-blue-800/60',
      inputs: {
        title: 'Thông tin Ứng viên / Nhân viên nhập & khai báo',
        description: 'Dữ liệu cá nhân, giấy tờ scan & thông tin tài khoản do Nhân viên tự khai báo.',
        items: item.inputs && item.inputs.length > 0 ? item.inputs : ['CV & Thông tin cá nhân', 'Bằng cấp học vấn', 'Số tài khoản ngân hàng']
      },
      outputs: {
        title: 'Kết quả Ứng viên / Nhân viên nhận được',
        description: 'Thông báo, tài khoản đăng nhập & tài liệu văn hóa công ty.',
        items: item.outputs && item.outputs.length > 0 ? item.outputs : ['Tài khoản Portal', 'Lịch Đào tạo hội nhập', 'Bản gán KPI thử việc']
      }
    },
    {
      roleType: 'hr',
      roleTitle: 'Góc nhìn HR Admin & Quản lý (HR & Manager Perspective)',
      actorLabel: '💼 HR Admin / Quản lý',
      badgeColorLight: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeColorDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      bgLight: 'bg-emerald-50/40',
      bgDark: 'bg-emerald-950/20',
      borderLight: 'border-emerald-200/80',
      borderDark: 'border-emerald-800/60',
      inputs: {
        title: 'Thông tin HR & Quản lý thiết lập & thẩm định',
        description: 'Cấu hình định biên, chức danh, ngạch bậc lương & luồng duyệt.',
        items: ['Kiểm tra Định biên khả dụng (EMP01)', 'Chọn Chức danh & Level Job Grade', 'Dự thảo Mức lương & Phụ cấp']
      },
      outputs: {
        title: 'Kết quả Hệ thống HR tự động sinh & đồng bộ',
        description: 'Mã số nhân viên, Ticket IT/Hành chính & Báo tăng Bảo hiểm/Thuế.',
        items: ['Mã NV tự động sinh', 'Ticket cấp Email & Máy tính sang IT', 'Đồng bộ Báo tăng BHXH (INS02)']
      }
    }
  ]

  // SOP processes
  const availableSopProcesses = SOP_DATABASE[item.id] || [
    {
      sopCode: item.sopIds?.[0] || 'SOP STANDARD',
      sopTitle: `Quy trình Chuẩn SOP: ${item.title}`,
      sopCategory: 'Quy trình Nghiệp vụ Chuẩn',
      description: item.subtitle || 'Chi tiết các bước thực hiện nghiệp vụ theo chuẩn tài liệu đặc tả SOP.',
      steps: (item.process?.steps || [
        'Khởi tạo yêu cầu & kiểm tra tính hợp lệ danh mục',
        'Kiểm tra định biên & điều kiện kích hoạt nghiệp vụ',
        'Trưởng bộ phận / HR Manager thẩm định & phê duyệt',
        'Thực thi hệ thống, cấp phát quyền & lưu vết nhật ký'
      ]).map((stepTitle, idx) => ({
        stepCode: `${item.id}.${(idx + 1).toString().padStart(2, '0')}`,
        title: stepTitle,
        actor: item.actors?.[idx % (item.actors?.length || 1)]?.name || 'HR Admin / Quản lý',
        location: 'Portal / Hệ thống',
        timing: 'Theo chu kỳ nghiệp vụ',
        typeCode: idx === 0 ? 'N' : idx === 1 ? 'M' : 'A',
        description: `Thực hiện chi tiết bước ${stepTitle} theo quy định tài liệu đặc tả SOP hệ thống.`,
        fieldsChecklist: item.uiFields || ['Mã bản ghi', 'Người thực hiện', 'Thời gian kích hoạt', 'Trạng thái phê duyệt']
      }))
    }
  ]

  const [selectedProcessIdx, setSelectedProcessIdx] = useState<number>(0)
  const currentProcess = availableSopProcesses[selectedProcessIdx] || availableSopProcesses[0]

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0)

  // Check if current process has a dedicated 5-stage Infographic Blueprint
  const hasInfographic = ['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'].includes(item.id)

  const [viewMode, setViewMode] = useState<'infographic' | 'diagram' | 'table'>(() => {
    if (location.pathname.startsWith('/employee-lifecycle/flowchart/')) return 'diagram'
    if (location.pathname.startsWith('/employee-lifecycle/infographic/')) return 'infographic'
    if (['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'].includes(item.id)) return 'infographic'
    return 'diagram'
  })

  const storyCards = [
    {
      title: language === 'vi' ? 'Khi nào dùng quy trình này?' : 'When to use this process',
      icon: Building2,
      text: item.process?.steps?.[0] || item.subtitle || currentProcess.description
    },
    {
      title: language === 'vi' ? 'Hiểu đơn giản' : 'Plain-language summary',
      icon: Sparkles,
      text: language === 'vi'
        ? `Quy trình này hướng dẫn ai cần làm gì, dữ liệu nào phải nhập, bước nào cần duyệt và hệ thống sẽ tự động cập nhật gì cho ${item.title}.`
        : `This process shows who does what, which data must be entered, which approvals are needed, and what the system updates for ${item.title}.`
    },
    {
      title: language === 'vi' ? 'Kết quả cuối cùng' : 'Final outcome',
      icon: CheckCircle2,
      text: item.outputs?.[0] || currentProcess.steps[currentProcess.steps.length - 1]?.description || currentProcess.description
    }
  ]

  // Sync state when location.pathname or item.id changes
  useEffect(() => {
    if (location.pathname.startsWith('/employee-lifecycle/raci/')) {
      setActiveWorkflowTab('roles')
    } else if (location.pathname.startsWith('/employee-lifecycle/specs/')) {
      setActiveWorkflowTab('specs')
    } else {
      setActiveWorkflowTab('diagram')
      if (location.pathname.startsWith('/employee-lifecycle/flowchart/')) {
        setViewMode('diagram')
      } else if (location.pathname.startsWith('/employee-lifecycle/infographic/')) {
        setViewMode('infographic')
      }
    }
  }, [location.pathname, item.id])

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 animate-fadeIn ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
      }`}>

      {/* COMPACT TOP FIXED HEADER */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
        }`}>

        {/* Main Header Bar */}
        <div className="w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 py-2.5 flex items-center justify-between gap-3">

          {/* Left: Back Button & Step Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 truncate">
            <button
              type="button"
              onClick={onBack}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-extrabold cursor-pointer shrink-0 ${isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'vi' ? 'Quay lại Bức tranh Tổng thể' : 'Back to Blueprint'}
              </span>
            </button>

            <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block shrink-0" />

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-mono font-black bg-blue-600 text-white rounded-md shrink-0">
                  {item.id}
                </span>
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </h1>
                {item.sopIds && item.sopIds.length > 0 && (
                  <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-500/30 shrink-0">
                    📋 {item.sopIds.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Language, Theme & Action CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Custom Language Selection Popover */}
            <LanguageSelector isDarkTheme={isDarkMode} />

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              title={isDarkMode ? t('header.themeLight', 'Bật Giao diện Sáng') : t('header.themeDark', 'Bật Giao diện Tối')}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {onOpenWireframe && (
              <button
                type="button"
                onClick={() => onOpenWireframe(item)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.viewWireframe', 'Mở màn hình mẫu')}</span>
              </button>
            )}
          </div>
        </div>

        {/* WORKFLOW VIEW TABS */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60">
          <div className="w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1.5">

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveWorkflowTab('diagram')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${activeWorkflowTab === 'diagram'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                    : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('workflow.tab.diagram', 'Sơ đồ quy trình')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkflowTab('roles')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${activeWorkflowTab === 'roles'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                    : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                  }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('workflow.tab.roles', 'Vai trò & trách nhiệm')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkflowTab('specs')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${activeWorkflowTab === 'specs'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                    : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                  }`}
              >
                <ListCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('workflow.tab.specs', 'Bảng kiểm & quy định')}</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden md:inline shrink-0">
              Standardized Workflow Spec
            </span>
          </div>
        </div>
      </header>


      {/* Main Workflow Workspace Content (92% Screen Width) */}
      <main className="w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 py-5 space-y-5">
        <section className={`grid grid-cols-1 lg:grid-cols-3 gap-3 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          {storyCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className={`rounded-2xl border p-4 shadow-2xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h2>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                  {card.text}
                </p>
              </div>
            )
          })}
        </section>

        {/* TAB 1: SƠ ĐỒ QUY TRÌNH TRỰC QUAN (INFOGRAPHIC / FLOWCHART / COMPACT TABLE) */}
        {activeWorkflowTab === 'diagram' && (
          <div className="space-y-4 animate-fadeIn">

            {/* SUB-PROCESS SELECTOR (If multiple SOPs exist) */}
            {availableSopProcesses.length > 1 && (
              <div className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? 'Quy trình SOP tương ứng:' : 'SOP Process:'}
                </span>

                <div className="flex flex-wrap gap-2">
                  {availableSopProcesses.map((proc, idx) => {
                    const isProcSelected = selectedProcessIdx === idx
                    return (
                      <button
                        key={proc.sopCode}
                        type="button"
                        onClick={() => {
                          setSelectedProcessIdx(idx)
                          setSelectedStepIdx(0)
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer shadow-2xs ${isProcSelected
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                            : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                          }`}
                      >
                        <Building2 className={`w-3.5 h-3.5 ${isProcSelected ? 'text-blue-400 dark:text-blue-600' : 'text-blue-600 dark:text-blue-400'}`} />
                        <span>{proc.sopCode}: {proc.sopTitle}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isProcSelected
                              ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                        >
                          {proc.steps.length}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* WORKFLOW VIEW CONTROLLER SWITCHER */}
            <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
              }`}>
              <div className="flex flex-wrap items-center gap-1.5">
                {hasInfographic && (
                  <button
                    type="button"
                    onClick={() => setViewMode('infographic')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer shadow-2xs ${viewMode === 'infographic'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                        : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                      }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {language === 'vi' ? 'Sơ đồ 5 giai đoạn' : '5-stage visual guide'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewMode('diagram')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer shadow-2xs ${viewMode === 'diagram'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                      : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                    }`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {language === 'vi'
                      ? `Sơ đồ quy trình (${currentProcess.steps.length} bước)`
                      : `Flowchart (${currentProcess.steps.length} Steps)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer shadow-2xs ${viewMode === 'table'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                      : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
                    }`}
                >
                  <ListCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {language === 'vi' ? 'Bảng kiểm & quy định' : 'Checklist & rules'}
                  </span>
                </button>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                {language === 'vi' ? 'Đang hiển thị:' : 'Viewing:'} <strong className="text-blue-600 dark:text-blue-300">{currentProcess.sopCode}</strong>
              </span>
            </div>

            {/* VIEW MODE 1: INFOGRAPHIC 5-STAGE BLUEPRINT VIEW */}
            {viewMode === 'infographic' && (
              <SopInfographicFlowView
                sopCode={currentProcess.sopCode}
                workflowId={item.id}
                isDarkMode={isDarkMode}
                onOpenWireframe={onOpenWireframe ? () => onOpenWireframe(item) : undefined}
              />
            )}

            {/* VIEW MODE 2: VISUAL FLOWCHART DIAGRAM */}
            {viewMode === 'diagram' && (
              <WorkflowDiagramView
                currentProcess={currentProcess}
                selectedStepIdx={selectedStepIdx}
                setSelectedStepIdx={setSelectedStepIdx}
                isDarkMode={isDarkMode}
                item={item}
                onOpenWireframe={onOpenWireframe}
              />
            )}

            {/* VIEW MODE 3: FULL SOP SPECIFICATIONS TABLE */}
            {viewMode === 'table' && (
              <WorkflowTableView
                currentProcess={currentProcess}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        )}

        {/* TAB 2: PHÂN ĐỊNH VAI TRÒ & MA TRẬN RACI */}
        {activeWorkflowTab === 'roles' && (
          <div className="space-y-5 animate-fadeIn">
            {/* ROLE-BASED INPUT -> OUTPUT MAPPING MATRIX */}
            <RoleFlowSection
              availableRoleFlows={availableRoleFlows}
              activeRoleTab={activeRoleTab}
              setActiveRoleTab={setActiveRoleTab}
              isDarkMode={isDarkMode}
              itemId={item.id}
            />

            {/* ACTORS MATRIX BANNER */}
            {item.actors && item.actors.length > 0 && (
              <div className={`rounded-2xl p-5 border space-y-3 shadow-2xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>
                      {language === 'vi'
                        ? 'Ma trận Phân quyền & Vai trò Thực hiện (Actors Matrix)'
                        : 'Roles & Permissions Matrix (Actors Matrix)'}
                    </span>
                  </div>

                  {/* Collapse Dropdown Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsActorsExpanded(!isActorsExpanded)}
                    className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    title={isActorsExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
                  >
                    <span>{isActorsExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
                    {isActorsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isActorsExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn pt-1">
                    {item.actors.map((actor, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-xl p-3.5 flex items-start gap-3 transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${idx === 0
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : idx === 1
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                            {actor.role}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {actor.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {actor.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BẢNG ĐẶC TẢ SOP CHI TIẾT & CHECKLIST */}
        {activeWorkflowTab === 'specs' && (
          <div className="space-y-5 animate-fadeIn">
            <WorkflowTableView
              currentProcess={currentProcess}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

      </main>
    </div>
  )
}
