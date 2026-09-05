import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  UserCheck,
  ListCheck
} from 'lucide-react'
import type { WorkflowDetailPageProps } from '../../../entities/sop/model/types'
import {
  resolveWorkflowSops,
  resolveSelectedSop,
  selectWorkflowBusinessBrief
} from '../../../entities/sop/lib/workflowSelectors'
import { UniversalWorkflowHeader } from './components/UniversalWorkflowHeader'
import { UniversalBusinessBrief } from './components/UniversalBusinessBrief'
import { UniversalWorkflowStepper } from './components/UniversalWorkflowStepper'
import { UniversalStepDetailCanvas } from './components/UniversalStepDetailCanvas'
import { RoleFlowSection } from './components/RoleFlowSection'
import { CrossFunctionalOperationalSpec } from './components/CrossFunctionalOperationalSpec'
import { getCrossFunctionalModule } from '../../../entities/sop/cross-functional/index'
import { RelatedPoliciesWidget } from '../../policy-browser/ui/components/RelatedPoliciesWidget'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({
  item,
  onBack,
  onOpenWireframe
}) => {
  const { language, t } = useLanguage()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const targetSopParam = searchParams.get('sop')
  const targetStepParam = searchParams.get('step')

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
    return (
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('employee_lifecycle_theme') === 'dark'
    )
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

  // Canonical Cross-Functional Module Definition (if viewing CF-01 .. CF-08)
  const cfModule = useMemo(() => getCrossFunctionalModule(item.id), [item.id])

  // Resolve all available SOP SubProcesses dynamically from DB or module metadata
  const availableSopProcesses = useMemo(() => {
    return resolveWorkflowSops(item.id, item)
  }, [item])

  // Resolve currently active SOP
  const { selectedSop, selectedSopIdx } = useMemo(() => {
    return resolveSelectedSop(availableSopProcesses, targetSopParam)
  }, [availableSopProcesses, targetSopParam])

  // Resolve Selected Step Index from URL `?step=...` or default to 0
  const initialStepIdx = useMemo(() => {
    if (!targetStepParam || !selectedSop.steps.length) return 0
    const numIdx = Number(targetStepParam)
    if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= selectedSop.steps.length) {
      return numIdx - 1
    }
    const codeIdx = selectedSop.steps.findIndex(
      (s) => s.stepCode.toLowerCase() === targetStepParam.toLowerCase()
    )
    return codeIdx !== -1 ? codeIdx : 0
  }, [targetStepParam, selectedSop.steps])

  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(initialStepIdx)

  // Sync state when SOP changes
  useEffect(() => {
    setSelectedStepIdx(initialStepIdx)
  }, [initialStepIdx, selectedSop.sopCode])

  // Unified non-redundant business brief
  const businessBrief = useMemo(() => {
    return selectWorkflowBusinessBrief(item, selectedSop, language)
  }, [item, selectedSop, language])

  // Handlers for switching SOP & Steps with URL query syncing
  const handleSelectSop = (sopCode: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sop', sopCode)
      next.delete('step')
      return next
    })
    setSelectedStepIdx(0)
  }

  const handleSelectStep = (idx: number) => {
    setSelectedStepIdx(idx)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('step', String(idx + 1))
      return next
    })
  }

  const handlePreviousStep = () => {
    if (selectedStepIdx > 0) {
      handleSelectStep(selectedStepIdx - 1)
    }
  }

  const handleNextStep = () => {
    if (selectedStepIdx < selectedSop.steps.length - 1) {
      handleSelectStep(selectedStepIdx + 1)
    }
  }

  const currentStep = selectedSop.steps[selectedStepIdx] || selectedSop.steps[0]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-20 animate-fadeIn ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-800'
      }`}
    >
      {/* 1. UNIVERSAL COMPACT TOP HEADER */}
      <UniversalWorkflowHeader
        item={item}
        currentProcess={selectedSop}
        onBack={onBack}
        onOpenWireframe={onOpenWireframe}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* 2. UNIVERSAL VIEW TABS */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60">
        <div className="w-[94%] max-w-[1920px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('diagram')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                activeWorkflowTab === 'diagram'
                  ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('workflow.tab.diagram', 'Sơ đồ quy trình')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('roles')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                activeWorkflowTab === 'roles'
                  ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('workflow.tab.roles', 'Vai trò & trách nhiệm')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkflowTab('specs')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                activeWorkflowTab === 'specs'
                  ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
              }`}
            >
              <ListCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {cfModule
                  ? 'Đặc tả Vận hành & RACI (Tầng 3)'
                  : t('workflow.tab.specs', 'Bảng kiểm & quy định')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKFLOW WORKSPACE CONTENT */}
      <main className="w-[94%] max-w-[1920px] mx-auto px-2 sm:px-4 py-5 space-y-5">
        {/* SUB-PROCESS SOP SELECTOR BAR (Only if workflow has multiple SOPs) */}
        {availableSopProcesses.length > 1 && (
          <div
            className={`p-3 rounded-2xl border flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xs ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1f5f86] dark:text-sky-300 shrink-0 pl-1">
              {language === 'vi' ? 'Chọn SOP quy trình:' : 'Select SOP:'}
            </span>

            <div className="flex items-center gap-2">
              {availableSopProcesses.map((proc, idx) => {
                const isSelected = selectedSopIdx === idx
                return (
                  <button
                    key={proc.sopCode}
                    type="button"
                    onClick={() => handleSelectSop(proc.sopCode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-80">{proc.sopCode}</span>
                    <span>{proc.sopTitle}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. TAB 1: SƠ ĐỒ QUY TRÌNH TRỰC QUAN */}
        {activeWorkflowTab === 'diagram' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Unified 4-Grid Business Brief Card (Replaces redundant multiple cards) */}
            <UniversalBusinessBrief brief={businessBrief} isDarkMode={isDarkMode} />

            {/* Dynamic Horizontal Workflow Stepper with Actor Pills */}
            <UniversalWorkflowStepper
              steps={selectedSop.steps}
              selectedStepIdx={selectedStepIdx}
              onSelectStep={handleSelectStep}
              isDarkMode={isDarkMode}
            />

            {/* Selected Step Detail Canvas (Positioned immediately below stepper in plain view) */}
            <UniversalStepDetailCanvas
              step={currentStep}
              stepIdx={selectedStepIdx}
              totalSteps={selectedSop.steps.length}
              onPreviousStep={handlePreviousStep}
              onNextStep={handleNextStep}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* 5. TAB 2: VAI TRÒ & PHÂN ĐỊNH RACI */}
        {activeWorkflowTab === 'roles' && (
          <div className="space-y-5 animate-fadeIn">
            <RoleFlowSection currentProcess={selectedSop} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* 6. TAB 3: BẢNG KIỂM & ĐẶC TẢ VẬN HÀNH */}
        {activeWorkflowTab === 'specs' && (
          <div className="space-y-5 animate-fadeIn">
            {cfModule ? (
              <CrossFunctionalOperationalSpec
                module={cfModule}
                onOpenWireframe={onOpenWireframe ? () => onOpenWireframe(item) : undefined}
              />
            ) : (
              <div
                className={`rounded-2xl border p-5 shadow-xs space-y-4 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ListCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {language === 'vi' ? 'Bảng kiểm & Quy định vận hành' : 'Verification Checklist & Controls'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'vi'
                        ? 'Danh mục các trường thông tin và điều kiện kiểm soát khi thực hiện quy trình.'
                        : 'List of data fields and control conditions during workflow execution.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.uiFields && item.uiFields.length > 0 ? (
                    item.uiFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        ✓ {field}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      {language === 'vi'
                        ? 'Chưa có danh mục trường dữ liệu riêng biệt. Tuân thủ theo các bước SOP chuẩn.'
                        : 'No custom fields defined. Follow standard SOP steps.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Linked Policies & Compliance Widget */}
            <RelatedPoliciesWidget processId={item.id} sopCode={selectedSop.sopCode} />
          </div>
        )}
      </main>
    </div>
  )
}
