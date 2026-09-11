import { GlobalSopSearch } from '../../../features/sop-search/ui/GlobalSopSearch'
import React, { useMemo, useState, useEffect, useCallback, Suspense, useTransition } from 'react'
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Layers, Database, GitBranch, Sun, Moon, Loader2, ShieldCheck, FileUp, BookOpen, ScanText } from 'lucide-react'

import { MasterDataRelationshipModal } from '../../master-data-studio/ui/MasterDataRelationshipModal'
import { SystemSupportBar } from '../../app-support/ui/SystemSupportBar'
import { SystemGuideBanner } from '../../app-guide/ui/SystemGuideBanner'
import { LeftSidebarNav } from '../../app-sidebar/ui/LeftSidebarNav'
import { WorkflowDetailPage } from '../../../features/sop-viewer/index'
import type { BusinessClusterId } from '../../../entities/module/model/types'
import type { WorkspaceView } from '../../../entities/master-data/model/types'
import { MasterDataViewTabs } from '../../master-data-studio/ui/components/MasterDataViewTabs'

// ⚡ LAZY LOAD HEAVY COMPONENTS
const MasterDataStudio = React.lazy(() => import('../../master-data-studio/ui/MasterDataStudio').then(module => ({ default: module.MasterDataStudio })))
const LifecycleStepper = React.lazy(() => import('../../sop-stepper/ui/LifecycleStepper').then(module => ({ default: module.LifecycleStepper })))
const OperationsGrid = React.lazy(() => import('../../operations-grid/ui/OperationsGrid').then(module => ({ default: module.OperationsGrid })))
const SystemOverviewDashboard = React.lazy(() => import('../../module-explorer/ui/SystemOverviewDashboard').then(module => ({ default: module.SystemOverviewDashboard })))
const ProcessLibraryWorkspace = React.lazy(() => import('../../module-explorer/ui/ProcessLibraryWorkspace').then(module => ({ default: module.ProcessLibraryWorkspace })))
const EmployeeLifecycleJourneyView = React.lazy(() => import('../../lifecycle-journey/ui/EmployeeLifecycleJourneyView').then(module => ({ default: module.EmployeeLifecycleJourneyView })))
const PolicyCenterPage = React.lazy(() => import('../../../features/policy-browser/ui/PolicyCenterPage').then(module => ({ default: module.PolicyCenterPage })))
const MyDocumentsWorkspace = React.lazy(() => import('../../../features/my-documents/ui/MyDocumentsWorkspace').then(module => ({ default: module.MyDocumentsWorkspace })))
const DocumentConversionWorkspace = React.lazy(() => import('../../../features/document-conversion/ui/DocumentConversionWorkspace').then(module => ({ default: module.DocumentConversionWorkspace })))
const SopManagementWorkspace = React.lazy(() => import('../../../features/sop-management/ui/SopManagementWorkspace').then(module => ({ default: module.SopManagementWorkspace })))
const SopOperationGuide = React.lazy(() => import('../../../features/sop-management/ui/SopOperationGuide').then(module => ({ default: module.SopOperationGuide })))
const AdminWorkspace = React.lazy(() => import('../../admin-workspace/ui/AdminWorkspace').then(module => ({ default: module.AdminWorkspace })))
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector'
import { PageIntro } from '../../../shared/ui/molecules/AdminSurface'

import { getMasterData, getLifecycleProcesses, getCrossFunctionalProcesses, getSharedServices, findNodeById } from '../../../entities/business-node/model/businessNodes'
import { getWorkflowProcesses } from '../../../entities/sop/model/sopDatabase'
import { getSopDictionary } from '../../../entities/sop/model/sopDictionary'
import { getCROSS_FUNCTIONAL_REGISTRY } from '../../../entities/sop/cross-functional/index'
import type { LifecycleStep, OperationModule, DetailItem } from '../../../entities/module/model/lifecycle.types'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'
import { useSession } from '../../../features/authentication/model/session'
import { getCORE_OPERATIONS_STAGE_MAP } from '../../../entities/module/data/coreOperationsStageMap'
import { canAccessAnyModule, requiredModuleIdsForRoute } from '../../../entities/module/lib/moduleAccess'
import type { AdminWorkspaceSection } from '../../admin-workspace/ui/AdminWorkspace'
import { getCurrentWorkspacePath, resolveWorkspaceReturn, withWorkspaceReturn } from '../../../shared/lib/navigation/workspaceReturn'

const headerBusinessClusters: Array<{ id: BusinessClusterId; label: string }> = [
  { id: 'core', label: 'Vận hành lõi' },
  { id: 'people', label: 'Phát triển con người' },
  { id: 'organization', label: 'Quản trị tổ chức' },
  { id: 'platform', label: 'Nền tảng' }
]

type EmployeeLifecycleTab = 'lifecycle' | 'masterdata' | 'reports' | 'process-library' | 'journey' | 'operations' | 'policies' | 'imports' | 'conversions' | 'management' | 'admin'

const adminWorkspaceSections = new Set<AdminWorkspaceSection>(['overview', 'users', 'access', 'catalog', 'imports', 'sop-approvals', 'master-data', 'indexing', 'audit', 'settings'])

const getAdminSectionFromLocation = (pathname: string, sectionParam: string | null): AdminWorkspaceSection => {
  if (adminWorkspaceSections.has(sectionParam as AdminWorkspaceSection)) return sectionParam as AdminWorkspaceSection
  if (pathname.endsWith('/users')) return 'users'
  if (pathname.endsWith('/access')) return 'access'
  if (pathname.endsWith('/catalog')) return 'catalog'
  if (pathname.endsWith('/imports')) return 'imports'
  if (pathname.endsWith('/sop-approvals')) return 'sop-approvals'
  if (pathname.endsWith('/indexing')) return 'indexing'
  if (pathname.endsWith('/audit')) return 'audit'
  if (pathname.endsWith('/master-data')) return 'master-data'
  if (pathname.endsWith('/settings')) return 'settings'
  return 'overview'
}

const isBusinessClusterId = (value: string | null): value is BusinessClusterId =>
  Boolean(value && headerBusinessClusters.some((cluster) => cluster.id === value))

const isMasterDataWorkspaceView = (value: string | null): value is WorkspaceView =>
  value === 'catalogs' || value === 'process' || value === 'relations'

const getSectionFromTab = (tab: EmployeeLifecycleTab, allowedMenuCodes?: Set<string>): string => {
  if (tab === 'imports') return 'SOP_IMPORT'
  if (tab === 'conversions') return 'DOCUMENT_CONVERSION'
  if (tab === 'management') return 'SOP_MANAGEMENT'
  if (tab === 'process-library') return 'process-library'
  if (tab === 'admin') return 'ADMIN'
  if (tab === 'policies') return 'policy-center'
  if (tab === 'operations') return allowedMenuCodes && !allowedMenuCodes.has('layer-3-operations') && allowedMenuCodes.has('system-support') ? 'system-support' : 'layer-3-operations'
  if (tab === 'journey' || tab === 'lifecycle') return 'layer-2-lifecycle'
  if (tab === 'masterdata') return 'layer-1-master-data'
  return 'overview-dashboard'
}

export const EmployeeWorkspace: React.FC = () => {
  const { t } = useLanguage()
  const session = useSession()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const masterDataViewParam = searchParams.get('view')
  const activeMasterDataView: WorkspaceView = isMasterDataWorkspaceView(masterDataViewParam)
    ? masterDataViewParam
    : 'catalogs'

  const getTabFromLocation = useCallback((): EmployeeLifecycleTab => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'conversions') return 'conversions'
    if (tabParam === 'management') return 'management'
    if (tabParam === 'imports') return 'imports'
    if (tabParam === 'process-library') return 'process-library'
    if (tabParam === 'admin') return 'admin'
    if (tabParam === 'policies') return 'policies'
    if (tabParam === 'operations') return 'operations'
    if (tabParam === 'journey') return 'journey'
    if (tabParam === 'masterdata') return 'masterdata'
    if (tabParam === 'lifecycle') return 'lifecycle'
    if (tabParam === 'reports') return 'reports'

    if (location.pathname.includes('/employee-lifecycle/document-conversions')) return 'conversions'
    if (location.pathname.includes('/employee-lifecycle/sop-management') || location.pathname.includes('/employee-lifecycle/operation-guide')) return 'management'
    if (location.pathname.includes('/employee-lifecycle/sop-imports')) return 'imports'
    if (location.pathname.includes('/employee-lifecycle/admin')) return 'admin'
    if (location.pathname.includes('/employee-lifecycle/policies')) return 'policies'
    if (location.pathname.includes('/employee-lifecycle/operations')) return 'operations'
    if (location.pathname.includes('/employee-lifecycle/journey')) return 'journey'
    if (location.pathname.includes('/employee-lifecycle/masterdata')) return 'masterdata'
    if (location.pathname.includes('/employee-lifecycle/lifecycle')) return 'lifecycle'
    if (location.pathname.includes('/employee-lifecycle/reports') || location.pathname.includes('/employee-lifecycle/workbench')) return 'reports'
    return 'reports'
  }, [location.pathname, searchParams])

  const [activeTab, setActiveTab] = useState<EmployeeLifecycleTab>(getTabFromLocation)
  const activeAdminSection = useMemo(
    () => getAdminSectionFromLocation(location.pathname, searchParams.get('adminSection')),
    [location.pathname, searchParams]
  )
  const [activeBusinessCluster, setActiveBusinessCluster] = useState<BusinessClusterId>(() => {
    const clusterParam = searchParams.get('cluster')
    return isBusinessClusterId(clusterParam) ? clusterParam : 'core'
  })
  const [isGuideModalOpen] = useState(false)

  const allowedMenuCodes = useMemo(() => new Set([
    ...session.menuItems.map((item) => item.code),
    // Admin navigation is role-gated in the workspace. Keep the local alias
    // so older sessions/databases that omit the menu row do not bounce an
    // authorized Admin back to the employee dashboard.
    ...(['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole) || session.capabilities.includes('rag.manage') ? ['ADMIN'] : []),
    // Company policies are available to every authenticated employee.
    'policy-center'
  ]), [session.capabilities, session.menuItems, session.systemRole])
  const [activeSection, setActiveSection] = useState(() => getSectionFromTab(getTabFromLocation(), allowedMenuCodes))
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [, startTransition] = useTransition()
  const canManageOwnDocuments = Array.isArray(session.capabilities)
    && session.capabilities.includes('sop.read')
    && session.modules.length > 0
  const canManageSops = ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)
    || session.capabilities.some((code) => ['sop.create', 'sop.edit', 'sop.review', 'sop.publish'].includes(code))
  const canOpenAdministration = ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)
    || session.capabilities.includes('rag.manage')
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
      navigate(['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)
        ? '/employee-lifecycle/admin'
        : '/employee-lifecycle/admin/indexing')
    } else if (tab === 'imports') {
      navigate('/employee-lifecycle/sop-imports')
    } else if (tab === 'conversions') {
      navigate('/employee-lifecycle/document-conversions')
    } else if (tab === 'management') {
      navigate('/employee-lifecycle/sop-management')
    } else if (tab === 'process-library') {
      navigate(`/employee-lifecycle?tab=process-library&cluster=${activeBusinessCluster}`)
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
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleBusinessClusterChange = (cluster: BusinessClusterId) => {
    setActiveBusinessCluster(cluster)
    const destinationTab = activeTab === 'process-library' ? 'process-library' : 'reports'
    if (activeTab !== 'reports' && activeTab !== 'process-library') {
      startTransition(() => setActiveTab('reports'))
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tab', destinationTab)
      next.set('cluster', cluster)
      next.delete('module')
      next.delete('sop')
      next.delete('stage')
      next.delete('type')
      return next
    })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleMasterDataViewChange = useCallback((view: WorkspaceView) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('view', view)
      next.delete('catalog')
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  // Effect to sync URL back to state if navigate() or back button is called
  useEffect(() => {
    const tabFromUrl = getTabFromLocation()
    if (tabFromUrl && tabFromUrl !== activeTab) {
      startTransition(() => {
        setActiveTab(tabFromUrl)
      })
    }
    if (tabFromUrl === 'imports') {
      setActiveSection('SOP_IMPORT')
    } else if (tabFromUrl === 'conversions') {
      setActiveSection('DOCUMENT_CONVERSION')
    } else if (tabFromUrl === 'management') {
      setActiveSection('SOP_MANAGEMENT')
    } else if (tabFromUrl === 'process-library') {
      setActiveSection('process-library')
    } else if (tabFromUrl === 'admin' || location.pathname.includes('/employee-lifecycle/admin')) {
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
      reports: ['overview-dashboard'],
      'process-library': ['process-library'],
      masterdata: ['layer-1-master-data'],
      journey: ['layer-2-lifecycle'],
      lifecycle: ['layer-2-lifecycle'],
      operations: ['layer-3-operations', 'system-support'],
      policies: ['policy-center'],
      imports: ['SOP_IMPORT'],
      conversions: ['DOCUMENT_CONVERSION'],
      management: ['SOP_MANAGEMENT'],
      admin: ['ADMIN']
    }
    if ((activeTab === 'imports' || activeTab === 'conversions') && canManageOwnDocuments) return
    if (activeTab === 'management' && canManageSops) return
    if (menuCodesByTab[activeTab].some((code) => allowedMenuCodes.has(code))) return

    const fallbackDestinations: Array<{ code: string; tab: typeof activeTab; path: string }> = [
      { code: 'overview-dashboard', tab: 'reports', path: '/employee-lifecycle' },
      { code: 'process-library', tab: 'process-library', path: '/employee-lifecycle?tab=process-library&cluster=core' },
      { code: 'DOCUMENT_CONVERSION', tab: 'conversions', path: '/employee-lifecycle/document-conversions' },
      { code: 'SOP_MANAGEMENT', tab: 'management', path: '/employee-lifecycle/sop-management' },
      { code: 'layer-1-master-data', tab: 'masterdata', path: '/employee-lifecycle/masterdata' },
      { code: 'layer-2-lifecycle', tab: 'journey', path: '/employee-lifecycle/journey?stage=LIFE-00&scenario=all' },
      { code: 'layer-3-operations', tab: 'operations', path: '/employee-lifecycle/operations' },
      { code: 'system-support', tab: 'operations', path: '/employee-lifecycle/operations' },
      { code: 'policy-center', tab: 'policies', path: '/employee-lifecycle/policies' },
      { code: 'ADMIN', tab: 'admin', path: '/employee-lifecycle/admin' }
    ]
    const fallback = fallbackDestinations.find((destination) => allowedMenuCodes.has(destination.code))
    if (!fallback) return

    setActiveSection(fallback.code)
    setActiveTab(fallback.tab)
    navigate(fallback.path, { replace: true })
  }, [activeTab, allowedMenuCodes, canManageOwnDocuments, canManageSops, navigate])

  useEffect(() => {
    if (activeTab === 'admin' && !canOpenAdministration) {
      navigate('/employee-lifecycle', { replace: true })
    }
  }, [activeTab, canOpenAdministration, navigate])

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

  // Sync state if class on html changes externally (e.g. from WorkflowDetailPage)
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
  const isERDOpen = location.pathname === '/employee-lifecycle/erd'

  const handleOpenERD = () => {
    navigate('/employee-lifecycle/erd')
  }

  const handleCloseERD = () => {
    navigate('/employee-lifecycle')
  }

  const handleNavigateSection = (sectionId: string) => {
    if (['SOP_IMPORT', 'DOCUMENT_CONVERSION'].includes(sectionId) && !canManageOwnDocuments) return
    if (sectionId === 'SOP_MANAGEMENT' && !canManageSops) return
    if (!['SOP_IMPORT', 'DOCUMENT_CONVERSION', 'SOP_MANAGEMENT'].includes(sectionId) && !allowedMenuCodes.has(sectionId)) return
    setActiveSection(sectionId)

    if (sectionId === 'SOP_IMPORT') {
      handleTabChange('imports')
      return
    }

    if (sectionId === 'DOCUMENT_CONVERSION') {
      handleTabChange('conversions')
      return
    }

    if (sectionId === 'SOP_MANAGEMENT') {
      handleTabChange('management')
      return
    }

    if (sectionId === 'policy-center') {
      handleTabChange('policies')
      return
    }

    if (sectionId === 'process-library') {
      handleTabChange('process-library')
      return
    }

    if (sectionId === 'ADMIN') {
      handleTabChange('admin')
      return
    }

    if (sectionId === 'overview-dashboard') {
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
    return getLifecycleProcesses().map((item, idx) => {
      const sopInfo = getSopDictionary()[item.id]
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
    const crossFunctionalModules = getCrossFunctionalProcesses().map((item) => {
      const cfDef = getCROSS_FUNCTIONAL_REGISTRY()[item.id]
      const sopInfo = getSopDictionary()[item.id]
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
      .map((moduleId) => getCORE_OPERATIONS_STAGE_MAP()[moduleId])
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
      getMasterData().find((m) => m.id === id) ||
      getLifecycleProcesses().find((l) => l.id === id) ||
      getCrossFunctionalProcesses().find((c) => c.id === id) ||
      getSharedServices().find((s) => s.id === id)

    if (rawNode) {
      const sopInfo = getSopDictionary()[rawNode.id] || getSopDictionary()[id]
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
      }
    }

    // Fallback for items configured in SOP_DATABASE (e.g. LIFE-00, SOP-EMP-01, etc.)
    const sopDbItem = getWorkflowProcesses(id)[0]
    if (sopDbItem) {
      const sopInfo = getSopDictionary()[id]
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
        fieldsChecklist: firstStep?.fieldsChecklist || []
      }
    }

    // Fallback for Operation Modules (e.g. CF-01, CF-02...)
    const opMod = operationModules.find((m) => m.id === id)
    const sopInfo = getSopDictionary()[id]
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

  const requiredRouteModuleIds = useMemo(
    () => requiredModuleIdsForRoute(routeId, searchParams.get('sop')),
    [routeId, searchParams]
  )
  const isDetailRoute = isWorkflowRoute
  const isRouteAccessRestricted = Boolean(
    isDetailRoute
    && routeId
    && requiredRouteModuleIds.length > 0
    && !canAccessAnyModule(accessibleModuleIds, requiredRouteModuleIds)
  )

  // Navigation handlers
  const handleOpenItemDetails = (id: string) => {
    navigate(withWorkspaceReturn(`/employee-lifecycle/workflow/${id}`, getCurrentWorkspacePath(location)))
  }

  const handleCloseWorkflow = () => {
    navigate(resolveWorkspaceReturn(searchParams))
  }

  const currentHeaderInfo = useMemo(() => {
    if (activeTab === 'conversions' || activeSection === 'DOCUMENT_CONVERSION') {
      return {
        subtitle: 'XƯỞNG CHUYỂN HÓA SOP',
        title: 'Chuyển hóa tài liệu',
        icon: ScanText
      }
    }
    if (activeTab === 'imports' || activeSection === 'SOP_IMPORT') {
      return {
        subtitle: 'KHO TÀI LIỆU CÁ NHÂN',
        title: 'Tài liệu của tôi',
        icon: FileUp
      }
    }
    if (activeTab === 'admin' || activeSection === 'ADMIN') {
      return {
        subtitle: t('header.adminSubtitle', 'KHU VỰC QUẢN TRỊ'),
        title: t('header.adminTitle', 'Quản trị hệ thống'),
        icon: ShieldCheck
      }
    }
    if (activeTab === 'process-library' || activeSection === 'process-library') {
      return {
        subtitle: t('header.processLibrarySubtitle', 'THƯ VIỆN SOP'),
        title: t('header.processLibraryTitle', 'Tra cứu quy trình nghiệp vụ'),
        icon: BookOpen
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

  if (isDetailRoute && routeId && !selectedItem) {
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

  // IF AN ITEM IS SELECTED, RENDER FULL WORKFLOW DETAIL PAGE WITH BACK BUTTON!
  if (isWorkflowRoute && selectedItem) {
    return (
      <WorkflowDetailPage
        item={selectedItem}
        onBack={handleCloseWorkflow}
      />
    )
  }

  const HeaderIcon = currentHeaderInfo.icon

  return (
    <div className={`min-h-screen transition-[padding-left] duration-300 pb-20 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
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
        <div className="w-[96%] max-w-[1920px] mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
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

          {activeTab === 'masterdata' && (
            <MasterDataViewTabs
              value={activeMasterDataView}
              onChange={handleMasterDataViewChange}
              className="order-3 hidden w-full justify-center lg:flex 2xl:order-none 2xl:w-auto 2xl:max-w-[520px] 2xl:flex-1"
            />
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

        {activeTab === 'process-library' && (
          <section id="process-library" className="space-y-5 animate-fadeIn scroll-mt-28">
            <Suspense fallback={<div className="flex h-96 flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang mở thư viện quy trình...</span></div>}>
              <ProcessLibraryWorkspace />
            </Suspense>
          </section>
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

        {activeTab === 'imports' && canManageOwnDocuments && (
          <section id="SOP_IMPORT" className="space-y-5 animate-fadeIn scroll-mt-28">
            <PageIntro
              title="Tài liệu của tôi"
              description="Upload, lưu trữ và tra cứu tài liệu cá nhân."
            />
            <Suspense fallback={<div className="flex h-96 flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang mở kho tài liệu cá nhân...</span></div>}>
              <MyDocumentsWorkspace />
            </Suspense>
          </section>
        )}

        {activeTab === 'conversions' && canManageOwnDocuments && (
          <section id="DOCUMENT_CONVERSION" className="space-y-5 animate-fadeIn scroll-mt-28">
            <PageIntro
              title="Chuyển hóa tài liệu"
              description="Chọn tài liệu đang lưu để chuẩn bị trích xuất nội dung và cấu trúc thành các bước nghiệp vụ."
            />
            <Suspense fallback={<div className="flex h-96 flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang tải tài liệu nguồn...</span></div>}>
              <DocumentConversionWorkspace />
            </Suspense>
          </section>
        )}

        {activeTab === 'management' && canManageSops && (
          <section id="SOP_MANAGEMENT" className="space-y-5 animate-fadeIn scroll-mt-28">
            <Suspense fallback={<div className="flex h-96 flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang mở khu vực quản lý SOP...</span></div>}>
              {location.pathname.includes('/operation-guide') ? <SopOperationGuide /> : <SopManagementWorkspace />}
            </Suspense>
          </section>
        )}

        {activeTab === 'admin' && canOpenAdministration && (
          <Suspense fallback={<div className="flex h-96 flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#1f5f86]" /><span className="text-sm font-bold text-slate-500">Đang mở khu vực quản trị...</span></div>}>
            <AdminWorkspace activeSection={activeAdminSection} isDarkMode={isDarkMode} />
          </Suspense>
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


