import React, { useMemo, useState, useEffect, useCallback, Suspense, useTransition } from 'react'
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Layers, Database, Sun, Moon, Loader2 } from 'lucide-react'

import { MasterDataRelationshipModal } from '../../components/employee-lifecycle/MasterDataRelationshipModal'
import { SystemSupportBar } from '../../components/employee-lifecycle/SystemSupportBar'
import { SystemGuideBanner } from '../../components/employee-lifecycle/SystemGuideBanner'
import { LeftSidebarNav } from '../../components/employee-lifecycle/LeftSidebarNav'
import { WireframeFormDetailPage } from '../../components/employee-lifecycle/WireframeFormDetailPage'
import { WorkflowDetailPage } from '../../components/employee-lifecycle/WorkflowDetailPage'

// ⚡ LAZY LOAD HEAVY COMPONENTS
const MasterDataHub = React.lazy(() => import('../../components/employee-lifecycle/master-data-hub/MasterDataHub').then(module => ({ default: module.MasterDataHub })))
const LifecycleStepper = React.lazy(() => import('../../components/employee-lifecycle/LifecycleStepper').then(module => ({ default: module.LifecycleStepper })))
const OperationsGrid = React.lazy(() => import('../../components/employee-lifecycle/OperationsGrid').then(module => ({ default: module.OperationsGrid })))
const SystemOverviewDashboard = React.lazy(() => import('../../components/employee-lifecycle/SystemOverviewDashboard').then(module => ({ default: module.SystemOverviewDashboard })))
import { LanguageSelector } from '../../components/common/LanguageSelector'

import { masterData, lifecycleProcesses, crossFunctionalProcesses, sharedServices, findNodeById } from './data'
import { SOP_DATABASE } from '../../components/employee-lifecycle/workflow-detail/data/sopDatabase'
import { sopDictionary } from '../../components/employee-lifecycle/data/sopDictionary'
import type { LifecycleStep, OperationModule, DetailItem } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'

export const EmployeeLifecyclePage: React.FC = () => {
  const { t } = useLanguage()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const getTabFromLocation = useCallback((): 'lifecycle' | 'masterdata' | 'reports' => {
    if (location.pathname.includes('/employee-lifecycle/masterdata')) return 'masterdata'
    if (location.pathname.includes('/employee-lifecycle/reports') || location.pathname.includes('/employee-lifecycle/workbench')) return 'reports'
    if (location.pathname.includes('/employee-lifecycle/lifecycle')) return 'lifecycle'
    const tabParam = searchParams.get('tab') as 'lifecycle' | 'masterdata' | 'reports'
    if (tabParam && ['lifecycle', 'masterdata', 'reports'].includes(tabParam)) return tabParam
    return 'lifecycle'
  }, [location.pathname, searchParams])

  const [activeTab, setActiveTab] = useState<'lifecycle' | 'masterdata' | 'reports'>(getTabFromLocation)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)

  const [activeSection, setActiveSection] = useState('layer-2-lifecycle')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [, startTransition] = useTransition()

  // Sync tab with URL search parameter
  const handleTabChange = (tab: 'lifecycle' | 'masterdata' | 'reports') => {
    startTransition(() => {
      setActiveTab(tab)
    })
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tab', tab)
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Effect to sync URL back to state if navigate() or back button is called
  useEffect(() => {
    const tabFromUrl = getTabFromLocation()
    if (tabFromUrl && tabFromUrl !== activeTab) {
      startTransition(() => {
        setActiveTab(tabFromUrl)
      })
    }
  }, [getTabFromLocation, activeTab])

  // Effect to scroll to hash target after tab or hash change
  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(hashId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [location.hash, activeTab])

  // Theme state: dark / light mode toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('employee_lifecycle_theme') === 'dark'
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('employee_lifecycle_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('employee_lifecycle_theme', 'light')
    }
  }, [isDarkMode])

  // Sync state if class on html changes externally (e.g. from WorkflowDetailPage or WireframeFormDetailPage)
  useEffect(() => {
    const handleClassChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    const observer = new MutationObserver(handleClassChange)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Check route types
  const isWorkflowRoute =
    location.pathname.startsWith('/employee-lifecycle/workflow/') ||
    location.pathname.startsWith('/employee-lifecycle/infographic/') ||
    location.pathname.startsWith('/employee-lifecycle/flowchart/') ||
    location.pathname.startsWith('/employee-lifecycle/raci/') ||
    location.pathname.startsWith('/employee-lifecycle/specs/')
  const isWireframeRoute = location.pathname.startsWith('/employee-lifecycle/wireframe/')
  const isERDOpen = location.pathname === '/employee-lifecycle/erd'

  const handleOpenERD = () => {
    navigate('/employee-lifecycle/erd')
  }

  const handleCloseERD = () => {
    navigate('/employee-lifecycle')
  }

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId)

    if (sectionId === 'overview-dashboard' || sectionId === 'sop-specs-matrix') {
      handleTabChange('reports')
      return
    }

    if (sectionId === 'layer-1-master-data') {
      handleTabChange('masterdata')
      return
    }

    if (sectionId === 'layer-2-lifecycle' || sectionId === 'layer-3-operations' || sectionId === 'system-support') {
      handleTabChange('lifecycle')
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) {
          const headerOffset = 130
          const elementPosition = el.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 50)
    }
  }



  // Transform Lifecycle steps (7 steps)
  const lifecycleSteps: LifecycleStep[] = useMemo(() => {
    return lifecycleProcesses.map((item, idx) => {
      const sopInfo = sopDictionary[item.id]
      return {
        id: item.id,
        stepNumber: idx + 1,
        code: item.code,
        title: item.title,
        subtitle: item.subtitle,
        description: item.overview.description,
        inputs: item.inputs.map((inp) => inp.name),
        outputs: item.outputs.map((out) => out.name),
        actors: item.actors,
        sopBadge: sopInfo?.badge || 'SOP-NS-01',
        sopIds: [sopInfo?.badge || 'SOP-NS-01']
      }
    })
  }, [])

  // Transform Operations modules (8 modules)
  const operationModules: OperationModule[] = useMemo(() => {
    return crossFunctionalProcesses.map((item) => {
      const sopInfo = sopDictionary[item.id]
      return {
        id: item.id,
        code: item.id,
        title: item.title,
        description: item.subtitle,
        iconName: 'Clock',
        category: item.overview.phase || 'Cross Functional',
        inputs: item.inputs.map((inp) => inp.name),
        outputs: item.outputs.map((out) => out.name),
        sopBadge: sopInfo?.badge || 'SOP-CF-01',
        sopIds: [sopInfo?.badge || 'SOP-CF-01']
      }
    })
  }, [])

  // Build DetailItem from id
  const getItemById = useCallback((id: string): DetailItem | null => {
    const rawNode =
      findNodeById(id) ||
      masterData.find((m) => m.id === id) ||
      lifecycleProcesses.find((l) => l.id === id) ||
      crossFunctionalProcesses.find((c) => c.id === id) ||
      sharedServices.find((s) => s.id === id)

    if (rawNode) {
      const sopInfo = sopDictionary[rawNode.id] || sopDictionary[id]
      return {
        id: rawNode.id,
        title: rawNode.title,
        subtitle: rawNode.subtitle,
        category: rawNode.type as any,
        sourceStatus: rawNode.overview.status,
        inputs: rawNode.inputs.map((i) => i.name),
        outputs: rawNode.outputs.map((o) => o.name),
        actors: rawNode.actors,
        rules: [],
        process: { steps: rawNode.process.steps, source: rawNode.process.source, status: rawNode.process.status },
        sopIds: sopInfo ? [sopInfo.badge] : rawNode.sopIds,
        sopTitles: sopInfo ? [sopInfo.title] : [],
        uiFields: rawNode.wireframe.fields
      }
    }

    // Fallback for items configured in SOP_DATABASE (e.g. LIFE-00, SOP-EMP-01, etc.)
    const sopDbItem = SOP_DATABASE[id]?.[0]
    if (sopDbItem) {
      const sopInfo = sopDictionary[id]
      const firstStep = sopDbItem.steps[0]
      const lastStep = sopDbItem.steps[sopDbItem.steps.length - 1]
      const actors = Array.from(new Set(sopDbItem.steps.map((step) => step.actor).filter(Boolean)))
      return {
        id: id,
        title: sopInfo?.title || sopDbItem.sopTitle,
        subtitle: sopDbItem.description || 'Nội dung được trình bày theo từng bước chi tiết của quy trình.',
        category: 'lifecycle',
        sourceStatus: 'official',
        inputs: sopDbItem.inputs?.filter(Boolean) || (firstStep ? [firstStep.title] : []),
        outputs: sopDbItem.outputs?.filter(Boolean) || (lastStep ? [lastStep.title] : []),
        actors: actors.map((actor) => ({
          name: actor,
          role: 'Người thực hiện',
          action: sopDbItem.steps.find((step) => step.actor === actor)?.title || ''
        })),
        rules: [],
        process: {
          steps: sopDbItem.steps.map((s) => s.title),
          source: sopDbItem.sopCategory,
          status: 'official'
        },
        sopIds: sopInfo ? [sopInfo.badge] : [sopDbItem.sopCode],
        sopTitles: sopInfo ? [sopInfo.title] : [sopDbItem.sopTitle],
        uiFields: firstStep?.fieldsChecklist || []
      }
    }

    // Fallback for Operation Modules (e.g. CF-01, CF-02...)
    const opMod = operationModules.find((m) => m.id === id)
    const sopInfo = sopDictionary[id]
    if (opMod || sopInfo) {
      return {
        id: id,
        title: opMod?.title || sopInfo?.title || id,
        subtitle: opMod?.description || 'Nghiệp vụ phát sinh định kỳ hoặc đột xuất trong quá trình vận hành.',
        category: 'cross',
        sourceStatus: 'official',
        inputs: opMod?.inputs || ['Thông tin phát sinh', 'Yêu cầu nghiệp vụ'],
        outputs: opMod?.outputs || ['Dữ liệu ghi nhận hệ thống', 'Quyết định / Báo cáo'],
        actors: [
          { name: 'HR Admin / Quản lý', role: 'Vận hành', action: 'Tiếp nhận, xử lý và cập nhật thông tin' }
        ],
        rules: [],
        process: {
          steps: [
            'Phát sinh nhu cầu / sự kiện nghiệp vụ',
            'Kiểm tra tính hợp lệ & danh mục quy chuẩn',
            'Thực hiện xử lý & gửi phê duyệt (nếu có)',
            'Lưu vết lịch sử & cập nhật hồ sơ nhân sự'
          ],
          source: 'Quy trình vận hành HR Enterprise Standard',
          status: 'official'
        },
        sopIds: sopInfo ? [sopInfo.badge] : opMod?.sopIds || ['SOP-CF-01'],
        sopTitles: sopInfo ? [sopInfo.title] : [],
        uiFields: ['Mã phát sinh', 'Thời gian áp dụng', 'Người thực hiện', 'Trạng thái phê duyệt']
      }
    }

    return null
  }, [operationModules])

  // Active items derived from URL
  const selectedItem = useMemo(() => {
    if (isWorkflowRoute && routeId) {
      return getItemById(routeId)
    }
    return null
  }, [isWorkflowRoute, routeId, getItemById])

  const wireframeItem = useMemo(() => {
    if (isWireframeRoute && routeId) {
      return getItemById(routeId)
    }
    return null
  }, [isWireframeRoute, routeId, getItemById])

  // Navigation handlers
  const handleOpenItemDetails = (id: string) => {
    navigate(`/employee-lifecycle/workflow/${id}`)
  }

  const handleOpenWireframe = (itemToOpen: DetailItem) => {
    navigate(`/employee-lifecycle/wireframe/${itemToOpen.id}`)
  }

  const handleCloseWorkflow = () => {
    navigate('/employee-lifecycle')
  }

  const handleCloseWireframe = () => {
    if (routeId) {
      navigate(`/employee-lifecycle/workflow/${routeId}`)
    } else {
      navigate('/employee-lifecycle')
    }
  }

  // IF WIREFRAME ITEM IS OPENED, RENDER FULL-PAGE FORM UI WORKSPACE!
  if (isWireframeRoute && wireframeItem) {
    return (
      <WireframeFormDetailPage
        item={wireframeItem}
        onBack={handleCloseWireframe}
      />
    )
  }

  // IF AN ITEM IS SELECTED, RENDER FULL WORKFLOW DETAIL PAGE WITH BACK BUTTON!
  if (isWorkflowRoute && selectedItem) {
    return (
      <WorkflowDetailPage
        item={selectedItem}
        onBack={handleCloseWorkflow}
        onOpenWireframe={handleOpenWireframe}
      />
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 pb-20 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
      } ${isSidebarCollapsed ? 'pl-12 sm:pl-16' : 'pl-12 sm:pl-16 md:pl-64'
      }`}>

      {/* LEFT FIXED SIDEBAR NAVIGATION */}
      <LeftSidebarNav
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        onOpenERD={handleOpenERD}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Streamlined Compact Top Navigation Header */}
      <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50 shadow-sm dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg text-white shadow-xs shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                  {t('header.architecture', 'TỔNG QUAN NGHIỆP VỤ NHÂN SỰ')}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {t('header.productionReady', 'Tổng quan hệ thống')}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 mt-0.5 leading-snug dark:text-white">
                {t('header.title', 'QUẢN LÝ HỒ SƠ VÀ VÒNG ĐỜI NHÂN VIÊN')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs shrink-0">
            {/* Custom Language Selection Popover */}
            <LanguageSelector isDarkTheme={isDarkMode} />

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-2 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200'
                }`}
              title={isDarkMode ? t('header.themeLight', 'Bật Giao diện Sáng') : t('header.themeDark', 'Bật Giao diện Tối')}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* MODERNIZED SUB-HEADER: 3 MAIN TABS & ARCHITECTURE GUIDE BUTTON */}
        <div className="bg-slate-50 border-t border-slate-200 dark:bg-slate-950/75 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">

            {/* Tab Navigation Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 py-2">
              <button
                type="button"
                onClick={() => handleTabChange('lifecycle')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${activeTab === 'lifecycle'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t('tabs.lifecycle', 'Vòng đời nhân sự')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('masterdata')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${activeTab === 'masterdata'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
              >
                <Database className="w-4 h-4" />
                <span>{t('tabs.masterdata', 'Danh mục dùng chung')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('reports')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('tabs.reports', 'Báo cáo và quy trình')}</span>
              </button>
            </div>

            {/* Guide Explainer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(!isGuideModalOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${isGuideModalOpen
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('tabs.guideBtn', 'Hướng dẫn Kiến trúc')}</span>
            </button>
          </div>
        </div>
      </header>


      {/* Main Container Workspace (92% Screen Width for maximum viewability) */}
      <main className="w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-5 sm:py-6 space-y-6">

        <section className={`rounded-2xl border p-4 sm:p-5 ${isDarkMode ? 'border-sky-900/70 bg-sky-950/25' : 'border-sky-200 bg-sky-50/70'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">BẢN DEMO NGHIỆP VỤ · DÀNH CHO NGƯỜI MỚI</p><h2 className="mt-1 text-base font-black text-slate-900 dark:text-white">HRMS quản lý hành trình nhân viên: từ lúc cần người đến khi nghỉ việc.</h2><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Mô phỏng phạm vi, luồng xử lý và màn hình dự kiến; không kết nối dữ liệu hay phát sinh giao dịch thật.</p></div>
            <button type="button" onClick={() => setIsGuideModalOpen(!isGuideModalOpen)} className="shrink-0 self-start rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-800 transition-colors hover:bg-sky-100 dark:border-sky-800 dark:bg-slate-900 dark:text-sky-200 dark:hover:bg-slate-800">{isGuideModalOpen ? 'Ẩn giải thích thuật ngữ' : 'Giải thích LIFE · MD · SOP · RACI'}</button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ['1. Xem toàn hệ thống', 'Theo 8 chặng từ định biên, tiếp nhận, hồ sơ, hợp đồng đến nghỉ việc.', () => handleTabChange('lifecycle')],
              ['2. Xem một nghiệp vụ', 'Chọn một chặng hoặc nghiệp vụ phát sinh để biết khi nào dùng, ai làm và kết quả.', () => handleTabChange('lifecycle')],
              ['3. Xem dữ liệu & quy tắc', 'Tra cứu danh mục dùng chung, SOP, vai trò và quan hệ dữ liệu.', () => handleTabChange('masterdata')]
            ].map(([title, description, action]) => <button key={title as string} type="button" onClick={action as () => void} className={`rounded-xl border p-3 text-left transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/80 hover:border-sky-700' : 'border-white bg-white/90 hover:border-sky-300 hover:bg-white'}`}><p className="text-xs font-black text-slate-900 dark:text-white">{title as string}</p><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{description as string}</p></button>)}
          </div>
        </section>

        {/* Collapsible Architecture Guide Banner */}
        {isGuideModalOpen && (
          <div className="animate-fadeIn">
            <SystemGuideBanner />
          </div>
        )}

        {/* TAB 1: VÒNG ĐỜI NHÂN SỰ & NGHIỆP VỤ VẬN HÀNH (MAIN WORKSPACE) */}
        {activeTab === 'lifecycle' && (
          <div className="space-y-6 animate-fadeIn">
            <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /><span className="text-sm font-bold text-slate-500">Đang tải biểu đồ vòng đời...</span></div>}>
              {/* TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (Interactive Stepper & Detail Canvas) */}
              <div id="layer-2-lifecycle" className="scroll-mt-28">
                <LifecycleStepper
                  steps={lifecycleSteps}
                  activeStepId={selectedItem?.id}
                  onSelectStep={handleOpenItemDetails}
                />
              </div>

              {/* TẦNG 3: NGHIỆP VỤ PHÁT SINH (Minimalist Cards Grid 4x2) */}
              <div id="layer-3-operations" className="scroll-mt-28">
                <OperationsGrid
                  modules={operationModules}
                  onSelectModule={handleOpenItemDetails}
                />
              </div>
            </Suspense>

            {/* TẦNG HỖ TRỢ XUYÊN SUỐT (System Support Sticky Bar) */}
            <div id="system-support" className="scroll-mt-28">
              <SystemSupportBar
                onSelectUtility={handleOpenItemDetails}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MASTER DATA SETTINGS HUB & SƠ ĐỒ ERD */}
        {activeTab === 'masterdata' && (
          <div className="space-y-6 animate-fadeIn">
            {/* ENTERPRISE MASTER DATA HUB WITH 3 TIERS, SEARCH & MODULE FILTERS */}
            <div id="layer-1-master-data" className="scroll-mt-28">
              <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /><span className="text-sm font-bold text-slate-500">Đang tải Master Data...</span></div>}>
                <MasterDataHub
                  onOpenERD={handleOpenERD}
                  isDarkMode={isDarkMode}
                  sopCode={searchParams.get('sop')}
                  moduleId={searchParams.get('module')}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* TAB 3: BÁO CÁO & ĐỘ PHỦ SOP (EXECUTIVE DASHBOARD & RADIAL CHART) */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            {/* HRMS EXECUTIVE SYSTEM DASHBOARD & RADIAL ECOSYSTEM WHEEL */}
            <div id="overview-dashboard" className="scroll-mt-28">
              <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /><span className="text-sm font-bold text-slate-500">Đang khởi tạo Dashboard...</span></div>}>
                <SystemOverviewDashboard />
              </Suspense>
            </div>
          </div>
        )}

      </main>

      {/* ERD RELATIONSHIP DIAGRAM MODAL */}
      <MasterDataRelationshipModal
        isOpen={isERDOpen}
        onClose={handleCloseERD}
        onSelectNode={handleOpenItemDetails}
      />

    </div>
  )
}

