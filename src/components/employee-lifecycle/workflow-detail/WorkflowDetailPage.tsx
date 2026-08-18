import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Sparkles,
  GitBranch,
  FileText,
  Building2,
  ListCheck,
  UserCheck,
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

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({
  item,
  onBack,
  onOpenWireframe
}) => {
  // Always scroll to top when opening or switching workflow detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [item.id])

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

  const [viewMode, setViewMode] = useState<'diagram' | 'table'>('diagram')

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 animate-fadeIn ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
      }`}>
      {/* Top Fixed Header with Back Button & Theme Toggle */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-2xs'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-extrabold cursor-pointer ${isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại Bức tranh Tổng thể Quy trình</span>
              <span className="sm:hidden">Quay lại</span>
            </button>

            <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-blue-600/10 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-600/20">
                SOP SPECIFICATION
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:inline">
                Mã: <strong className="text-slate-900 dark:text-white font-mono">{item.id}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              title={isDarkMode ? 'Bật Giao diện Sáng' : 'Bật Giao diện Tối'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {item.sopIds && item.sopIds.length > 0 && (
              <span className="hidden sm:inline-flex px-3 py-1 text-xs font-mono font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                📋 {item.sopIds.join(', ')}
              </span>
            )}

            {onOpenWireframe && (
              <button
                type="button"
                onClick={() => onOpenWireframe(item)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl border border-blue-400 transition-all shadow-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Mở Form UI Wireframe</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workflow Workspace Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Hero Banner Header */}
        <div className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden transition-colors duration-300 ${isDarkMode
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800'
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-800 text-white'
          }`}>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold uppercase bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                  Document Spec: 1.EMP.HRM.SOP.docx
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                  Role Mapping: Candidate vs. HR Engine
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                SƠ ĐỒ WORKFLOW QUY TRÌNH: {item.title.toUpperCase()}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            {onOpenWireframe && (
              <button
                type="button"
                onClick={() => onOpenWireframe(item)}
                className="self-start flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl border border-blue-400 shadow-md transition-all shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Xem UI Form Thao tác</span>
              </button>
            )}
          </div>
        </div>

        {/* ROLE-BASED INPUT -> OUTPUT MAPPING MATRIX */}
        <RoleFlowSection
          availableRoleFlows={availableRoleFlows}
          activeRoleTab={activeRoleTab}
          setActiveRoleTab={setActiveRoleTab}
          isDarkMode={isDarkMode}
        />

        {/* ACTORS MATRIX BANNER */}
        {item.actors && item.actors.length > 0 && (
          <div className={`rounded-2xl p-5 border space-y-3 shadow-2xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Ma trận Phân quyền & Vai trò Thực hiện (Actors Matrix)</span>
              </div>

              {/* Collapse Dropdown Toggle Button */}
              <button
                type="button"
                onClick={() => setIsActorsExpanded(!isActorsExpanded)}
                className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title={isActorsExpanded ? 'Thu gọn Actors Matrix' : 'Mở rộng Actors Matrix'}
              >
                <span>{isActorsExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                {isActorsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isActorsExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn pt-1">
                {item.actors.map((actor, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-3.5 flex items-start gap-3 transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200/80 hover:bg-white'
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

        {/* SUB-PROCESS SELECTOR TABS */}
        {availableSopProcesses.length > 1 && (
          <div className={`p-4 rounded-2xl border space-y-3 shadow-2xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Các Quy trình SOP Chi tiết trong file Word tương ứng với bước này:
            </span>

            <div className="flex flex-wrap gap-2.5">
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
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${isProcSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm transform -translate-y-0.5'
                      : isDarkMode
                        ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{proc.sopCode}: {proc.sopTitle}</span>
                    <span className="text-[10px] font-mono opacity-80 bg-black/20 px-2 py-0.5 rounded-md">
                      {proc.steps.length} bước
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* WORKFLOW VIEW CONTROLLER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('diagram')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'diagram'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Sơ đồ Flowchart Trực quan ({currentProcess.steps.length} Bước SOP)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <ListCheck className="w-4 h-4" />
              <span>Bảng Chi tiết Các bước (SOP Specs Table)</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
            Đang xem: <strong className="text-blue-600 dark:text-blue-300">{currentProcess.sopCode}</strong>
          </span>
        </div>

        {/* VIEW MODE 1: VISUAL FLOWCHART DIAGRAM */}
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

        {/* VIEW MODE 2: FULL SOP SPECIFICATIONS TABLE */}
        {viewMode === 'table' && (
          <WorkflowTableView
            currentProcess={currentProcess}
            isDarkMode={isDarkMode}
          />
        )}

      </main>
    </div>
  )
}
