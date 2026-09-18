import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { WorkflowDetailPageProps } from '../../../entities/sop/model/types'
import {
  resolveWorkflowSops,
  resolveSelectedSop
} from '../../../entities/sop/lib/workflowSelectors'
import { UniversalWorkflowHeader } from './components/UniversalWorkflowHeader'
import { MetroWorkflowPipeline } from './components/metro-pipeline/MetroWorkflowPipeline'
import { UniversalStepDetailCanvas } from './components/UniversalStepDetailCanvas'
import { CanonicalSopViewer } from './CanonicalSopViewer'
import { knowledgeApi } from '../model/knowledgeModel'

export const WorkflowDetailPage: React.FC<WorkflowDetailPageProps> = ({
  item,
  onBack
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const targetSopParam = searchParams.get('sop')
  const targetStepParam = searchParams.get('step')

  // Lookup published KnowledgeDocument for this workflow/sop
  const [publishedDocId, setPublishedDocId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    knowledgeApi.catalogDocuments({ type: 'procedure', pageSize: 100 }, controller.signal)
      .then(res => {
        if (!controller.signal.aborted) {
          const matched = res.data.find(d => {
            if (targetSopParam && (d.code.toLowerCase() === targetSopParam.toLowerCase() || d.id === targetSopParam)) {
              return true
            }
            return d.workflowId === item.id || d.code === item.id
          })
          if (matched) {
            setPublishedDocId(matched.id)
          }
        }
      })
      .catch(() => {
        // Fallback to item
      })
    return () => controller.abort()
  }, [item.id, targetSopParam])

  // Always scroll to top when opening or switching workflow detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [item.id])

  // Theme state synced with global document dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('employee_lifecycle_theme') === 'dark')
    )
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
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

  if (publishedDocId) {
    return <CanonicalSopViewer documentId={publishedDocId} onBack={onBack} />
  }

  // Resolve all available SOP SubProcesses dynamically from DB or module metadata
  const availableSopProcesses = useMemo(() => {
    return resolveWorkflowSops(item.id, item)
  }, [item])

  // Resolve currently active SOP
  const { selectedSop } = useMemo(() => {
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
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* 2. MAIN WORKFLOW WORKSPACE CONTENT */}
      <main className="w-[94%] max-w-[1920px] mx-auto px-2 sm:px-4 py-5 space-y-5">
        <MetroWorkflowPipeline
          process={selectedSop}
          selectedStepIdx={selectedStepIdx}
          onSelectStep={handleSelectStep}
          isDarkMode={isDarkMode}
        />

        {/* Selected Step Detail Canvas */}
        <UniversalStepDetailCanvas
          step={currentStep}
          stepIdx={selectedStepIdx}
          totalSteps={selectedSop.steps.length}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          isDarkMode={isDarkMode}
          process={selectedSop}
        />
      </main>
    </div>
  )
}
