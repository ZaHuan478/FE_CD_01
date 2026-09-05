import { GlobalSopSearch } from '../../../features/sop-search/ui/GlobalSopSearch'
import React, { useMemo, useState, useEffect, useCallback, Suspense, useTransition } from 'react'
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Layers, Database, GitBranch, Sun, Moon, Loader2, ShieldCheck } from 'lucide-react'

import { MasterDataRelationshipModal } from '../../master-data-studio/ui/MasterDataRelationshipModal'
import { SystemSupportBar } from '../../app-support/ui/SystemSupportBar'
import { SystemGuideBanner } from '../../app-guide/ui/SystemGuideBanner'
import { LeftSidebarNav } from '../../app-sidebar/ui/LeftSidebarNav'
import { WireframeFormDetailPage } from '../../../features/wireframe-viewer/ui/WireframeFormDetailPage'
import { WorkflowDetailPage } from '../../../features/sop-viewer/index'
import type { BusinessClusterId } from '../../module-explorer/ui/SystemOverviewDashboard'

// ⚡ LAZY LOAD HEAVY COMPONENTS
const MasterDataStudio = React.lazy(() => import('../../master-data-studio/ui/MasterDataStudio').then(module => ({ default: module.MasterDataStudio })))
const LifecycleStepper = React.lazy(() => import('../../sop-stepper/ui/LifecycleStepper').then(module => ({ default: module.LifecycleStepper })))
const OperationsGrid = React.lazy(() => import('../../operations-grid/ui/OperationsGrid').then(module => ({ default: module.OperationsGrid })))
const SystemOverviewDashboard = React.lazy(() => import('../../module-explorer/ui/SystemOverviewDashboard').then(module => ({ default: module.SystemOverviewDashboard })))
const EmployeeLifecycleJourneyView = React.lazy(() => import('../../lifecycle-journey/ui/EmployeeLifecycleJourneyView').then(module => ({ default: module.EmployeeLifecycleJourneyView })))
const PolicyCenterPage = React.lazy(() => import('../../../features/policy-browser/ui/PolicyCenterPage').then(module => ({ default: module.PolicyCenterPage })))
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector'

import { masterData, lifecycleProcesses, crossFunctionalProcesses, sharedServices, findNodeById } from '../../../entities/business-node/model/businessNodes'
import { SOP_DATABASE } from '../../../entities/sop/model/sopDatabase'
import { sopDictionary } from '../../../entities/sop/model/sopDictionary'
import { CROSS_FUNCTIONAL_REGISTRY } from '../../../entities/sop/cross-functional/index'
import type { LifecycleStep, OperationModule, DetailItem } from '../../../entities/module/model/lifecycle.types'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'
import { useSession } from '../../../features/authentication/model/session'
import { CORE_OPERATIONS_STAGE_MAP } from '../../../entities/module/data/coreOperationsStageMap'
import { canAccessAnyModule, requiredModuleIdsForRoute } from '../../../entities/module/lib/moduleAccess'

const headerBusinessClusters: Array<{ id: BusinessClusterId; label: string }> = [
  { id: 'core', label: 'Vận hành lõi' },
  { id: 'people', label: 'Phát triển con người' },
  { id: 'organization', label: 'Quản trị tổ chức' },
  { id: 'platform', label: 'Nền tảng' }
]

type EmployeeLifecycleTab = 'lifecycle' | 'masterdata' | 'reports' | 'journey' | 'operations' | 'policies' | 'admin'

const isBusinessClusterId = (value: string | null): value is BusinessClusterId =>
  Boolean(value && headerBusinessClusters.some((cluster) => cluster.id === value))

export const EmployeeWorkspace: React.FC = () => {
  const { t } = useLanguage()
  const session = useSession()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const getTabFromLocation = useCallback((): EmployeeLifecycleTab => {
    const tabParam = searchParams.get('tab')
    if (location.pathname.includes('/employee-lifecycle/admin') || tabParam === 'admin') return 'admin'
    if (location.pathname.includes('/employee-lifecycle/policies') || tabParam === 'policies') return 'policies'
    if (location.pathname.includes('/employee-lifecycle/operations') || tabParam === 'operations') return 'operations'
    if (location.pathname.includes('/employee-lifecycle/journey') || tabParam === 'journey') return 'journey'
    if (location.pathname.includes('/employee-lifecycle/masterdata') || tabParam === 'masterdata') return 'masterdata'
    if (location.pathname.includes('/employee-lifecycle/lifecycle') || tabParam === 'lifecycle') return 'lifecycle'
    if (location.pathname.includes('/employee-lifecycle/reports') || location.pathname.includes('/employee-lifecycle/workbench') || tabParam === 'reports') return 'reports'
    return 'reports'
  }, [location.pathname, searchParams])

  const [activeTab, setActiveTab] = useState<EmployeeLifecycleTab>(getTabFromLocation)
  const [activeBusinessCluster, setActiveBusinessCluster] = useState<BusinessClusterId>(() => {
    const clusterParam = searchParams.get('cluster')
    return isBusinessClusterId(clusterParam) ? clusterParam : 'core'
  })
  const [isGuideModalOpen] = useState(false)

  const [activeSection, setActiveSection] = useState('overview-dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [, startTransition] = useTransition()
  const allowedMenuCodes = useMemo(() => new Set(session.menuItems.map((item) => item.code)), [session.menuItems])
  const accessibleModuleIds = useMemo(() => new Set(session.modules.map((module) => module.id)), [session.modules])

  const visibleBusinessClusters = useMemo(() => headerBusinessClusters.filter((cluster) => {
    if (cluster.id === 'core') return accessibleModuleIds.size > 0
    if (cluster.id === 'people' || cluster.id === 'organization') return accessibleModuleIds.has('emp')
    return accessibleModuleIds.has('ess')
  }), [accessibleModuleIds])

  // Sync tab with URL search parameter & navigation
  const handleTabChange = (tab: EmployeeLifecycleTab) => {
    startTransition(() => {
      setActiveTab(tab)
    })
    if (tab === 'admin') {
      navigate('/employee-lifecycle/admin')
    } else if (tab === 'policies') {
      navigate('/employee-lifecycle/policies')
    } else if (tab === 'operations') {
      navigate('/employee-lifecycle/operations')
    } else if (tab === 'journey') {
      navigate('/employee-lifecycle/journey?stage=LIFE-00&scenario=all')
    } else if (tab === 'masterdata') {
      navigate('/employee-lifecycle/masterdata')
    } else if (tab === 'reports') {
      navigate('/employee-lifecycle')
    } else if (tab === 'lifecycle') {
      navigate('/employee-lifecycle/lifecycle')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBusinessClusterChange = (cluster: BusinessClusterId) => {
    setActiveBusinessCluster(cluster)
    if (activeTab !== 'reports') {
      startTransition(() => setActiveTab('reports'))
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tab', 'reports')
      next.set('cluster', cluster)
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
    if (tabFromUrl === 'admin' || location.pathname.includes('/employee-lifecycle/admin')) {
      setActiveSection('ADMIN')
    } else if (tabFromUrl === 'policies' || location.pathname.includes('/employee-lifecycle/policies')) {
      setActiveSection('policy-center')
    } else if (tabFromUrl === 'operations' || location.pathname.includes('/employee-lifecycle/operations')) {
      setActiveSection(allowedMenuCodes.has('layer-3-operations') ? 'layer-3-operations' : 'system-support')
    } else if (tabFromUrl === 'journey' || location.pathname.includes('/employee-lifecycle/journey')) {
      setActiveSection('layer-2-lifecycle')
    } else if (tabFromUrl === 'masterdata') {
      setActiveSection('layer-1-master-data')
    } else if (tabFromUrl === 'reports') {
      setActiveSection('overview-dashboard')
    } else if (tabFromUrl === 'lifecycle') {
      setActiveSection('layer-2-lifecycle')
    }
  }, [getTabFromLocation, activeTab, location.pathname, allowedMenuCodes])

  useEffect(() => {
    const menuCodesByTab: Record<typeof activeTab, string[]> = {
      reports: ['overview-dashboard', 'sop-specs-matrix'],
      masterdata: ['layer-1-master-data'],
      journey: ['layer-2-lifecycle'],
      lifecycle: ['layer-2-lifecycle'],
      operations: ['layer-3-operations', 'system-support'],
      policies: ['policy-center'],
      admin: ['ADMIN']
    }
    if (menuCodesByTab[activeTab].some((code) => allowedMenuCodes.has(code))) return

    const fallbackDestinations: Array<{ code: string; tab: typeof activeTab; path: string }> = [
      { code: 'overview-dashboard', tab: 'reports', path: '/employee-lifecycle' },
      { code: 'layer-1-master-data', tab: 'masterdata', path: '/employee-lifecycle/masterdata' },
      { code: 'layer-2-lifecycle', tab: 'journey', path: '/employee-lifecycle/journey?stage=LIFE-00&scenario=all' },
      { code: 'layer-3-operations', tab: 'operations', path: '/employee-lifecycle/operations' },
      { code: 'system-support', tab: 'operations', path: '/employee-lifecycle/operations' },
      { code: 'policy-center', tab: 'policies', path: '/employee-lifecycle/policies' },
      { code: 'sop-specs-matrix', tab: 'reports', path: '/employee-lifecycle' },
      { code: 'ADMIN', tab: 'admin', path: '/employee-lifecycle/admin' }
    ]
    const fallback = fallbackDestinations.find((destination) => allowedMenuCodes.has(destination.code))
    if (!fallback) return

    setActiveSection(fallback.code)
    setActiveTab(fallback.tab)
    navigate(fallback.path, { replace: true })
  }, [activeTab, allowedMenuCodes, navigate])

  useEffect(() => {
    const clusterFromUrl = searchParams.get('cluster')
    if (isBusinessClusterId(clusterFromUrl) && clusterFromUrl !== activeBusinessCluster) {
      setActiveBusinessCluster(clusterFromUrl)
    }
  }, [searchParams, activeBusinessCluster])

  useEffect(() => {
    if (visibleBusinessClusters.some((cluster) => cluster.id === activeBusinessCluster)) return
    const fallback = visibleBusinessClusters[0]?.id
    if (fallback) setActiveBusinessCluster(fallback)
  }, [activeBusinessCluster, visibleBusinessClusters])

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
    if (!allowedMenuCodes.has(sectionId)) return
    setActiveSection(sectionId)

    if (sectionId === 'policy-center') {
      handleTabChange('policies')
      return
    }

    if (sectionId === 'ADMIN') {
      handleTabChange('admin')
      return
    }

    if (sectionId === 'overview-dashboard' || sectionId === 'sop-specs-matrix') {
      handleTabChange('reports')
      return
    }

    if (sectionId === 'layer-1-master-data') {
      handleTabChange('masterdata')
      return
    }

    if (sectionId === 'layer-2-lifecycle') {
      handleTabChange('journey')
      return
    }

    if (sectionId === 'layer-3-operations' || sectionId === 'system-support') {
      handleTabChange('operations')
      return
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

  // Transform Operations modules (8 modules from Canonical Registry)
  const operationModules: OperationModule[] = useMemo(() => {
    const crossFunctionalModules = crossFunctionalProcesses.map((item) => {
      const cfDef = CROSS_FUNCTIONAL_REGISTRY[item.id]
      const sopInfo = sopDictionary[item.id]
      return {
        id: item.id,
        code: item.id,
        title: cfDef?.title || item.title,
        description: cfDef?.subtitle || item.subtitle,
        iconName: cfDef?.iconName || 'Clock',
        category: cfDef?.domainLabel || item.overview.phase || 'Cross Functional',
        inputs: cfDef?.inputs || item.inputs.map((inp) => inp.name),
        outputs: cfDef?.outputs || item.outputs.map((out) => out.name),
        sopBadge: cfDef?.sopBadge || sopInfo?.badge || 'SOP-CF-01',
        sopIds: cfDef?.sopIds || [sopInfo?.badge || 'SOP-CF-01']
      }
    })
    if (crossFunctionalModules.length > 0) return crossFunctionalModules

    return ['att', 'leave', 'pay', 'ins', 'tax']
      .filter((moduleId) => accessibleModuleIds.has(moduleId))
      .map((moduleId) => CORE_OPERATIONS_STAGE_MAP[moduleId])
      .filter((module): module is NonNullable<typeof module> => Boolean(module))
      .map((module) => ({
        id: module.id,
        code: module.code,
        title: module.name,
        description: module.shortDesc,
        iconName: 'Clock',
        category: 'Core Operations',
        inputs: [module.receivesFrom],
        outputs: [module.sendsTo],
        sopBadge: module.stages[0]?.sopCodes[0] || module.code,
        sopIds: module.stages.flatMap((stage) => stage.sopCodes)
      }))
  }, [accessibleModuleIds])

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

  const requiredRouteModuleIds = useMemo(
    () => requiredModuleIdsForRoute(routeId, searchParams.get('sop')),
    [routeId, searchParams]
  )
  const isDetailRoute = isWorkflowRoute || isWireframeRoute
  const isRouteAccessRestricted = Boolean(
    isDetailRoute
    && routeId
    && requiredRouteModuleIds.length > 0
    && !canAccessAnyModule(accessibleModuleIds, requiredRouteModuleIds)
  )

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

  const currentHeaderInfo = useMemo(() => {
    if (activeTab === 'admin' || activeSection === 'ADMIN') {
      return {
        subtitle: t('header.adminSubtitle', 'QUẢN TRỊ TRUY CẬP HỆ THỐNG'),
        title: t('header.adminTitle', 'Phân quyền và phạm vi hiện tại'),
        icon: ShieldCheck
      }
    }
    if (activeTab === 'policies' || activeSection === 'policy-center') {
      return {
        subtitle: t('header.policiesSubtitle', 'QUẢN TRỊ & TUÂN THỦ NỘI BỘ'),
        title: t('header.policiesTitle', 'Trung tâm Quy định & Tuân thủ'),
        icon: ShieldCheck
      }
    }
    if (activeTab === 'masterdata' || activeSection === 'layer-1-master-data') {
      return {
        subtitle: t('header.layer1Subtitle', 'TẦNG 1 · DỮ LIỆU NỀN TẢNG'),
        title: t('header.layer1Title', 'Trung tâm Master Data'),
        icon: Database
      }
    }
    if (activeTab === 'journey' || activeSection === 'layer-2-lifecycle') {
      return {
        subtitle: t('header.layer2Subtitle', 'TẦNG 2 · VÒNG ĐỜI NHÂN VIÊN'),
        title: t('header.layer2Title', 'Hành trình vòng đời nhân viên'),
        icon: Layers
      }
    }
    if (activeTab === 'operations' || activeSection === 'layer-3-operations') {
      return {
        subtitle: t('header.layer3Subtitle', 'TẦNG 3 · NGHIỆP VỤ PHÁT SINH'),
        title: t('header.layer3Title', 'Nghiệp vụ phát sinh & Vận hành (CF-01 ➔ CF-08)'),
        icon: GitBranch
      }
    }
    if (activeTab === 'lifecycle') {
      return {
        subtitle: t('header.layer3Subtitle', 'TẦNG 2 & TẦNG 3 · VẬN HÀNH TOÀN DIỆN'),
        title: t('header.layer3Title', 'Vòng đời nhân sự & Nghiệp vụ phát sinh'),
        icon: GitBranch
      }
    }
    return {
      subtitle: t('header.architecture', 'ENTERPRISE HR SAAS ARCHITECTURE'),
      title: t('header.title', 'QUẢN LÝ HỒ SƠ & VÒNG ĐỜI NHÂN VIÊN'),
      icon: Layers
    }
  }, [activeTab, activeSection, t])

  if (isRouteAccessRestricted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <section className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-7 text-center shadow-lg dark:border-amber-900/70 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">403 Access Restricted</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Quyền truy cập bị giới hạn</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Tài khoản hiện tại cần quyền đọc ít nhất một phân hệ: <strong>{requiredRouteModuleIds.map((id) => id.toUpperCase()).join(', ')}</strong>.
            Vui lòng liên hệ quản trị viên nếu bạn cần truy cập quy trình này.
          </p>
          <button
            type="button"
            onClick={() => navigate('/employee-lifecycle', { replace: true })}
            className="mt-6 rounded-lg bg-[#1f5f86] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#174d70]"
          >
            Trở về trang tổng quan
          </button>
        </section>
      </main>
    )
  }

  if (isDetailRoute && routeId && !selectedItem && !wireframeItem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Chưa có dữ liệu quy trình</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Quy trình <strong>{routeId}</strong> chưa có dữ liệu phù hợp với phạm vi hiện tại. Trang không tự chuyển hướng để bạn có thể kiểm tra lại mã quy trình hoặc quyền được cấp.
          </p>
          <button type="button" onClick={() => navigate('/employee-lifecycle', { replace: true })} className="mt-6 rounded-lg bg-[#1f5f86] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#174d70]">
            Trở về trang tổng quan
          </button>
        </section>
      </main>
    )
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

  const HeaderIcon = currentHeaderInfo.icon

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
        <div className="w-[96%] max-w-[1920px] mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-4">
          {/* CỘT TRÁI: LOGO VÀ TIÊU ĐỀ HỆ THỐNG */}
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="p-1.5 sm:p-2 bg-[#1f5f86] rounded-lg text-white shadow-xs shrink-0">
              <HeaderIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-[#1f5f86] dark:text-sky-300 uppercase tracking-widest">
                  {currentHeaderInfo.subtitle}
                </span>
              </div>
              <h1 className="text-xs sm:text-sm lg:text-base font-black tracking-tight text-slate-900 mt-0.5 leading-snug dark:text-white whitespace-nowrap">
                {currentHeaderInfo.title}
              </h1>
            </div>
          </div>

          {/* CỘT GIỮA: CỤM NGHIỆP VỤ HRM (CHỈ HIỂN THỊ KHI Ở MÀN HÌNH DASHBOARD CHỈ SỐ) */}
          {activeTab === 'reports' && (
            <nav
              className="hidden md:flex flex-1 items-center justify-center gap-1.5 max-w-[720px] rounded-xl animate-fadeIn"
              aria-label="Cụm nghiệp vụ HRM"
            >
              {visibleBusinessClusters.map((cluster) => {
                const active = activeBusinessCluster === cluster.id
                return (
                  <button
                    key={cluster.id}
                    type="button"
                    onClick={() => handleBusinessClusterChange(cluster.id)}
                    className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${active
                        ? 'bg-[#1f5f86] text-white shadow-2xs'
                        : 'text-slate-700 hover:bg-white hover:text-[#1f5f86] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                  >
                    {cluster.label}
                  </button>
                )
              })}
            </nav>
          )}

          {/* CỘT PHẢI: TÌM KIẾM, NGÔN NGỮ & GIAO DIỆN TỐI */}
          <div className="flex items-center gap-2.5 text-xs shrink-0">
            <GlobalSopSearch />
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
      </header>


      {/* Main Container Workspace (92% Screen Width for maximum viewability) */}
      <main className={`pb-5 sm:pb-6 ${activeTab === 'reports' || activeTab === 'masterdata' ? 'w-full max-w-none px-0 pt-0 sm:pt-0' : 'w-[92%] max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 pt-5 sm:pt-6'} space-y-6`}>

        {/* <section className={`rounded-2xl border p-4 sm:p-5 ${isDarkMode ? 'border-sky-900/70 bg-sky-950/25' : 'border-sky-200 bg-sky-50/70'}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl"><h2 className="mt-1 text-base font-black text-slate-900 dark:text-white">HRMS quản lý hành trình nhân viên: từ lúc cần người đến khi nghỉ việc.</h2><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Mô phỏng phạm vi, luồng xử lý và màn hình dự kiến; không kết nối dữ liệu hay phát sinh giao dịch thật.</p></div>
            <button type="button" onClick={() => setIsGuideModalOpen(!isGuideModalOpen)} className="shrink-0 self-start rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-800 transition-colors hover:bg-sky-100 dark:border-sky-800 dark:bg-slate-900 dark:text-sky-200 dark:hover:bg-slate-800">{isGuideModalOpen ? 'Ẩn giải thích thuật ngữ' : 'Giải thích LIFE · MD · SOP · RACI'}</button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ['1. Xem toàn hệ thống', 'Theo 8 chặng từ định biên, tiếp nhận, hồ sơ, hợp đồng đến nghỉ việc.', () => handleTabChange('lifecycle')],
              ['2. Xem một nghiệp vụ', 'Chọn một chặng hoặc nghiệp vụ phát sinh để biết khi nào dùng, ai làm và kết quả.', () => handleTabChange('lifecycle')],
              ['3. Xem dữ liệu & quy tắc', 'Tra cứu danh mục dùng chung, SOP, vai trò và quan hệ dữ liệu.', () => handleTabChange('masterdata')]
            ].map(([title, description, action]) => <button key={title as string} type="button" onClick={action as () => void} className={`rounded-xl border p-3 text-left transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/80 hover:border-sky-700' : 'border-white bg-white/90 hover:border-sky-300 hover:bg-white'}`}><p className="text-xs font-black text-slate-900 dark:text-white">{title as string}</p><p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{description as string}</p></button>)}
          </div>
        </section> */}

        {/* Collapsible Architecture Guide Banner */}
        {isGuideModalOpen && (
          <div className="animate-fadeIn">
            <SystemGuideBanner />
          </div>
        )}

        {/* TAB JOURNEY: HÀNH TRÌNH VÒNG ĐỜI NHÂN VIÊN (DEDICATED 8-STAGE STUDIO) */}
        {activeTab === 'journey' && (
          <div className="space-y-6 animate-fadeIn">
            <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang tải hành trình vòng đời...</span></div>}>
              <EmployeeLifecycleJourneyView />
            </Suspense>
          </div>
        )}

        {/* TAB OPERATIONS: TẦNG 3 - NGHIỆP VỤ PHÁT SINH (DEDICATED 8-MODULE WORKSPACE) */}
        {activeTab === 'operations' && (
          <div className="space-y-6 animate-fadeIn">
            <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /><span className="text-sm font-bold text-slate-500">Đang tải nghiệp vụ phát sinh...</span></div>}>
              <div id="layer-3-operations" className="scroll-mt-28">
                <OperationsGrid
                  modules={operationModules}
                  onSelectModule={handleOpenItemDetails}
                />
              </div>

              {allowedMenuCodes.has('system-support') && (
                <div id="system-support" className="scroll-mt-28">
                  <SystemSupportBar onSelectUtility={handleOpenItemDetails} />
                </div>
              )}
            </Suspense>
          </div>
        )}

        {/* TAB LIFECYCLE: VÒNG ĐỜI NHÂN SỰ & NGHIỆP VỤ VẬN HÀNH (ALL-IN-ONE CANVAS) */}
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
            {allowedMenuCodes.has('system-support') && (
              <div id="system-support" className="scroll-mt-28">
                <SystemSupportBar onSelectUtility={handleOpenItemDetails} />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MASTER DATA STUDIO — 3-panel layout */}
        {activeTab === 'masterdata' && (
          <div className="animate-fadeIn">
            <div id="layer-1-master-data" className="scroll-mt-28">
              <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /><span className="text-sm font-bold text-slate-500">Đang tải Master Data Studio...</span></div>}>
                <MasterDataStudio
                  isDarkMode={isDarkMode}
                  sopCode={searchParams.get('sop')}
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
                <SystemOverviewDashboard activeCluster={activeBusinessCluster} />
              </Suspense>
            </div>
          </div>
        )}

        {/* TAB 4: QUY ĐỊNH & TUÂN THỦ NỘI BỘ (POLICIES & COMPLIANCE CENTER) */}
        {activeTab === 'policies' && (
          <div className="space-y-6 animate-fadeIn">
            <div id="policy-center" className="scroll-mt-28">
              <Suspense fallback={<div className="h-96 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang tải Trung tâm Quy định & Tuân thủ...</span></div>}>
                <PolicyCenterPage />
              </Suspense>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Quyền truy cập của tài khoản</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Thông tin đọc trực tiếp từ phiên đăng nhập và scoped RBAC.</p>
              </div>
              <span className="self-start rounded-lg bg-sky-50 px-3 py-1.5 font-mono text-xs font-black text-sky-800 ring-1 ring-inset ring-sky-100 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20">
                {session.username}
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Phân hệ được truy cập</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {session.modules.map((module) => (
                    <span key={module.id} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {module.id.toUpperCase()} <span className="font-medium text-slate-400">{module.title}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Năng lực được cấp</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {session.capabilities.map((capability) => (
                    <span key={capability} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
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

