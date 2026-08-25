import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  GitBranch,
  FileText,
  Building2,
  UserCheck,
  CheckCircle2,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { WorkflowDetailPageProps } from './types'
import { SOP_DATABASE } from './data/sopDatabase'
import { RoleFlowSection } from './components/RoleFlowSection'
import { WorkflowDiagramView } from './components/WorkflowDiagramView'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const targetSopParam = searchParams.get('sop')
  const targetStepParam = Number(searchParams.get('step') || 0)

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

  const [isActorsExpanded, setIsActorsExpanded] = useState<boolean>(true)

  // SOP processes
  const availableSopProcesses = SOP_DATABASE[item.id] ?? []

  // Match process from targetSopParam if present
  const matchingProcessIdx = useMemo(() => {
    if (!targetSopParam) return 0
    const cleanParam = targetSopParam.toUpperCase().replace('SOP-', '').replace('-', '').trim()
    const idx = availableSopProcesses.findIndex(proc => {
      const cleanCode = proc.sopCode.toUpperCase().replace('SOP-', '').replace('-', '').replace(' ', '').trim()
      return cleanCode.includes(cleanParam) || cleanParam.includes(cleanCode)
    })
    return idx !== -1 ? idx : (targetSopParam ? -1 : 0)
  }, [targetSopParam, availableSopProcesses])

  const [selectedProcessIdx, setSelectedProcessIdx] = useState<number>(matchingProcessIdx)

  useEffect(() => {
    setSelectedProcessIdx(matchingProcessIdx)
  }, [matchingProcessIdx])

  const selectedProcess = selectedProcessIdx >= 0
    ? availableSopProcesses[selectedProcessIdx] || availableSopProcesses[0]
    : undefined

  const currentProcess = selectedProcess || {
      sopCode: targetSopParam || item.sopIds?.[0] || 'SOP',
      sopTitle: item.title,
      sopCategory: 'Chưa có dữ liệu SOP chi tiết',
      description: 'Tài liệu hiện chưa cung cấp các bước chi tiết cho quy trình này.',
      steps: []
    }

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0)

  // Check if current process has a dedicated 5-stage Infographic Blueprint
  const hasInfographic = ['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'].includes(item.id)

  const [viewMode, setViewMode] = useState<'infographic' | 'diagram' | 'table'>(() => {
    if (location.pathname.startsWith('/employee-lifecycle/flowchart/')) return 'diagram'
    if (location.pathname.startsWith('/employee-lifecycle/infographic/')) return 'infographic'
    if (['LIFE-00', 'LIFE-01', 'LIFE-02', 'LIFE-03', 'LIFE-04', 'LIFE-05', 'LIFE-06', 'LIFE-07'].includes(item.id)) return 'infographic'
    return 'diagram'
  })

  const isInfographicRoute = location.pathname.startsWith('/employee-lifecycle/infographic/')

  const storyCards = [
    {
      title: language === 'vi' ? 'Mục đích của quy trình' : 'Purpose',
      icon: Building2,
      text: item.subtitle || currentProcess.description
    },
    {
      title: language === 'vi' ? 'Đầu vào cần chuẩn bị' : 'Inputs to prepare',
      icon: Sparkles,
      text: item.inputs?.length ? item.inputs.join(' · ') : 'Chưa có dữ liệu đầu vào được khai báo.'
    },
    {
      title: language === 'vi' ? 'Đầu ra sau khi hoàn tất' : 'Outputs',
      icon: CheckCircle2,
      text: item.outputs?.length ? item.outputs.join(' · ') : currentProcess.steps[currentProcess.steps.length - 1]?.description || currentProcess.description
    }
  ]

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
                  {currentProcess.sopCode || item.id}
                </span>
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentProcess.sopTitle || item.title}
                </h1>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-500/30 shrink-0">
                  📌 {language === 'vi' ? `Chặng ${item.id}: ${item.title}` : `Stage ${item.id}: ${item.title}`}
                </span>
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1f5f86] hover:bg-[#174968] rounded-md shadow-sm transition-all cursor-pointer shrink-0"
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
                    ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('workflow.tab.diagram', 'Sơ đồ quy trình')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkflowTab('roles')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${activeWorkflowTab === 'roles'
                    ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700'
                  }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('workflow.tab.roles', 'Vai trò & trách nhiệm')}</span>
              </button>

              {/* <button
                type="button"
                onClick={() => setActiveWorkflowTab('specs')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${activeWorkflowTab === 'specs'
                    ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700'
                  }`}
              >
                <ListCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('workflow.tab.specs', 'Bảng kiểm & quy định')}</span>
              </button> */}
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
                          setSearchParams(prev => {
                            prev.set('sop', proc.sopCode)
                            prev.delete('step')
                            return prev
                          }, { replace: true })
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

            {/* WORKFLOW VIEW CONTROLLER SWITCHER. The infographic route is intentionally focused on one readable flow. */}
            {!isInfographicRoute && <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
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

                {/* <button
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
                </button> */}
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                {language === 'vi' ? 'Đang hiển thị:' : 'Viewing:'} <strong className="text-blue-600 dark:text-blue-300">{currentProcess.sopCode}</strong>
              </span>
            </div>}

            {/* VIEW MODE 1: INFOGRAPHIC 5-STAGE BLUEPRINT VIEW */}
            {viewMode === 'infographic' && (
              <SopInfographicFlowView
                sopCode={currentProcess.sopCode}
                workflowId={item.id}
                process={currentProcess}
                activeStep={targetStepParam}
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

          </div>
        )}

        {/* TAB 2: VAI TRÒ VÀ ĐIỂM PHỐI HỢP */}
        {activeWorkflowTab === 'roles' && (
          <div className="space-y-5 animate-fadeIn">
            <RoleFlowSection currentProcess={currentProcess} isDarkMode={isDarkMode} />

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
      </main>
    </div>
  )
}
