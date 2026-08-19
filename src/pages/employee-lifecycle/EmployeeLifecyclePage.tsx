import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Layers, Database, FileText, X, Layout, Sun, Moon, Globe } from 'lucide-react'

import { MasterDataCard } from '../../components/employee-lifecycle/MasterDataCard'
import { MasterDataRelationshipModal } from '../../components/employee-lifecycle/MasterDataRelationshipModal'
import { LifecycleStepper } from '../../components/employee-lifecycle/LifecycleStepper'
import { OperationsGrid } from '../../components/employee-lifecycle/OperationsGrid'
import { SystemSupportBar } from '../../components/employee-lifecycle/SystemSupportBar'
import { SystemGuideBanner } from '../../components/employee-lifecycle/SystemGuideBanner'
import { SystemOverviewDashboard } from '../../components/employee-lifecycle/SystemOverviewDashboard'
import { LeftSidebarNav } from '../../components/employee-lifecycle/LeftSidebarNav'
import { WireframeFormModal } from '../../components/employee-lifecycle/WireframeFormModal'
import { WireframeFormDetailPage } from '../../components/employee-lifecycle/WireframeFormDetailPage'
import { NodeDetailDrawer } from '../../components/employee-lifecycle/NodeDetailDrawer'
import { WorkflowDetailPage } from '../../components/employee-lifecycle/WorkflowDetailPage'
import { LanguageSelector } from '../../components/common/LanguageSelector'

import { masterData, lifecycleProcesses, crossFunctionalProcesses, sharedServices } from './data'
import { sopDictionary } from '../../components/employee-lifecycle/data/sopDictionary'
import type { MasterDataCategory, LifecycleStep, OperationModule, DetailItem } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'
import type { Language } from '../../data/translations'

export const EmployeeLifecyclePage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('overview-dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
  const isWorkflowRoute = location.pathname.startsWith('/employee-lifecycle/workflow/')
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
    if (sectionId === 'overview-dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        const headerOffset = 90 // Sticky header offset height
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  // Transform Master Data categories
  const masterDataCategories: MasterDataCategory[] = useMemo(() => {
    return masterData.map((item) => {
      const sopInfo = sopDictionary[item.id]
      return {
        id: item.id,
        code: item.id,
        title: item.title,
        subtitle: item.subtitle,
        clusterId: item.id === 'MD-04' || item.id === 'MD-01' || item.id === 'MD-02' || item.id === 'MD-03'
          ? 'personal'
          : item.id === 'MD-05' || item.id === 'MD-06'
            ? 'structure'
            : 'policy',
        inputsCount: item.inputs.length,
        outputsCount: item.outputs.length,
        sopBadge: sopInfo?.badge || 'SOP-NS-01'
      }
    })
  }, [])

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
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg text-white shadow-xs shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  {t('header.architecture', 'Enterprise HR SaaS Architecture')}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {t('header.productionReady', 'Production Ready')}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white mt-0.5 leading-snug">
                {t('header.title', 'QUẢN LÝ HỒ SƠ & VÒNG ĐỜI NHÂN VIÊN')}
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
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              title={isDarkMode ? t('header.themeLight', 'Bật Giao diện Sáng') : t('header.themeDark', 'Bật Giao diện Tối')}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-300" />
                </>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-2.5 text-xs shrink-0">
              <span className="text-slate-400 text-[11px]">{t('header.modelStandard', 'Model Standard:')}</span>
              <span className="font-semibold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-[11px]">
                Workday / SAP SuccessFactors Style
              </span>
            </div>
          </div>
        </div>
      </header>


      {/* Main Container Workspace (92% Screen Width for maximum viewability) */}
      <main className="w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">

        {/* Intro Eyebrow Banner */}
        <div className={`rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
          }`}>
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="p-2 sm:p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-900/50">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold leading-snug">
                {t('banner.title', 'Bức tranh Tổng thể Quy trình Quản trị Nhân sự (Business Process Blueprint)')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t('banner.description', 'Cấu trúc phân tầng tiêu chuẩn: Tầng 1 Master Data ➔ Tầng 2 Vòng đời Nhân viên ➔ Tầng 3 Nghiệp vụ Phát sinh ➔ Thanh Hỗ trợ Hệ thống')}
              </p>
            </div>
          </div>
        </div>


        {/* Onboarding Guide & Concept Explainer Banner for Newcomers */}
        <SystemGuideBanner />

        {/* HRMS EXECUTIVE SYSTEM DASHBOARD & QUICK LAYER NAVIGATOR */}
        <div id="overview-dashboard" className="scroll-mt-20">
          <SystemOverviewDashboard
            onSelectStep={handleOpenItemDetails}
            onOpenERD={handleOpenERD}
          />
        </div>

        {/* TẦNG 1: MASTER DATA CARD (Single-Entry Card) */}
        <div id="layer-1-master-data" className="scroll-mt-20">
          <MasterDataCard
            categories={masterDataCategories}
            onOpenERD={handleOpenERD}
            onSelectCategory={handleOpenItemDetails}
          />
        </div>

        {/* TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (7-Step Horizontal Stepper Pipeline) */}
        <div id="layer-2-lifecycle" className="scroll-mt-20">
          <LifecycleStepper
            steps={lifecycleSteps}
            activeStepId={selectedItem?.id}
            onSelectStep={handleOpenItemDetails}
          />
        </div>

        {/* TẦNG 3: NGHIỆP VỤ PHÁT SINH (Minimalist Cards Grid 4x2) */}
        <div id="layer-3-operations" className="scroll-mt-20">
          <OperationsGrid
            modules={operationModules}
            onSelectModule={handleOpenItemDetails}
          />
        </div>

        {/* TẦNG HỖ TRỢ XUYÊN SUỐT (System Support Sticky Bar) */}
        <div id="system-support" className="scroll-mt-20">
          <SystemSupportBar
            onSelectUtility={handleOpenItemDetails}
          />
        </div>

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

