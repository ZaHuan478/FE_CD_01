import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Layers, Database, FileText, X } from 'lucide-react'

import { MasterDataCard } from '../../components/employee-lifecycle/MasterDataCard'
import { MasterDataRelationshipModal } from '../../components/employee-lifecycle/MasterDataRelationshipModal'
import { LifecycleStepper } from '../../components/employee-lifecycle/LifecycleStepper'
import { OperationsGrid } from '../../components/employee-lifecycle/OperationsGrid'
import { SystemSupportBar } from '../../components/employee-lifecycle/SystemSupportBar'
import { SystemGuideBanner } from '../../components/employee-lifecycle/SystemGuideBanner'

import { masterData, lifecycleProcesses, crossFunctionalProcesses, sharedServices } from './data'
import type { MasterDataCategory, LifecycleStep, OperationModule, DetailItem } from '../../types/employee-lifecycle'

export const EmployeeLifecyclePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null)

  const isERDOpen = searchParams.get('view') === 'master-data-erd'

  const handleOpenERD = () => {
    setSearchParams({ view: 'master-data-erd' })
  }

  const handleCloseERD = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('view')
    setSearchParams(nextParams)
  }

  // Transform Master Data categories
  const masterDataCategories: MasterDataCategory[] = useMemo(() => {
    return masterData.map((item) => ({
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
      outputsCount: item.outputs.length
    }))
  }, [])

  // Transform Lifecycle steps (7 steps)
  const lifecycleSteps: LifecycleStep[] = useMemo(() => {
    return lifecycleProcesses.map((item, idx) => ({
      id: item.id,
      stepNumber: idx + 1,
      code: item.code,
      title: item.title,
      subtitle: item.subtitle,
      description: item.overview.description,
      inputs: item.inputs.map((inp) => inp.name),
      outputs: item.outputs.map((out) => out.name),
      actors: item.actors
    }))
  }, [])

  // Transform Operations modules (8 modules)
  const operationModules: OperationModule[] = useMemo(() => {
    return crossFunctionalProcesses.map((item) => ({
      id: item.id,
      code: item.id,
      title: item.title,
      description: item.subtitle,
      iconName: 'Clock',
      category: item.overview.phase || 'Cross Functional',
      inputs: item.inputs.map((inp) => inp.name),
      outputs: item.outputs.map((out) => out.name)
    }))
  }, [])

  // Handle Item Inspector
  const openItemDetails = (id: string) => {
    const rawNode =
      masterData.find((m) => m.id === id) ||
      lifecycleProcesses.find((l) => l.id === id) ||
      crossFunctionalProcesses.find((c) => c.id === id) ||
      sharedServices.find((s) => s.id === id)

    if (rawNode) {
      setSelectedItem({
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
        sopIds: rawNode.sopIds,
        uiFields: rawNode.wireframe.fields
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 pb-20">

      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                  Enterprise HR SaaS Architecture
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Production Ready
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
                QUẢN LÝ HỒ SƠ & VÒNG ĐỜI NHÂN VIÊN
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-slate-400">Model Standard:</span>
            <span className="font-semibold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Workday / SAP SuccessFactors Style
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Intro Eyebrow Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Bức tranh Tổng thể Quy trình Quản trị Nhân sự (Business Process Blueprint)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu trúc phân tầng tiêu chuẩn: Tầng 1 Master Data ➔ Tầng 2 Vòng đời Nhân viên ➔ Tầng 3 Nghiệp vụ Phát sinh ➔ Thanh Hỗ trợ Hệ thống
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              Route: <code className="text-blue-600 font-mono">/employee-lifecycle</code>
            </span>
          </div> */}
        </div>

        {/* Onboarding Guide & Concept Explainer Banner for Newcomers */}
        <SystemGuideBanner />

        {/* TẦNG 1: MASTER DATA CARD (Single-Entry Card) */}
        <MasterDataCard
          categories={masterDataCategories}
          onOpenERD={handleOpenERD}
          onSelectCategory={openItemDetails}
        />

        {/* TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (7-Step Horizontal Stepper Pipeline) */}
        <LifecycleStepper
          steps={lifecycleSteps}
          activeStepId={selectedItem?.id}
          onSelectStep={openItemDetails}
        />

        {/* TẦNG 3: NGHIỆP VỤ PHÁT SINH (Minimalist Cards Grid 4x2) */}
        <OperationsGrid
          modules={operationModules}
          onSelectModule={openItemDetails}
        />

        {/* TẦNG HỖ TRỢ XUYÊN SUỐT (System Support Sticky Bar) */}
        <SystemSupportBar
          onSelectUtility={openItemDetails}
        />

      </main>

      {/* ERD RELATIONSHIP DIAGRAM MODAL */}
      <MasterDataRelationshipModal
        isOpen={isERDOpen}
        onClose={handleCloseERD}
        onSelectNode={openItemDetails}
      />

      {/* NODE DETAIL INSPECTOR MODAL */}
      {selectedItem && (
        <DetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  )
}

/* Detail Drawer Modal for Node Inspection */
const DetailDrawer: React.FC<{ item: DetailItem; onClose: () => void }> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg font-mono text-xs font-bold">
              {item.id}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {item.category.toUpperCase()} NODE DETAILS
              </span>
              <h3 className="text-lg font-bold leading-tight">{item.title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-700">

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">01 · Mô tả nghiệp vụ</h4>
            <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800">
              {item.subtitle || 'Dữ liệu và quy trình tiêu chuẩn thuộc hệ thống Quản trị Nhân sự.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">02 · Input (Dữ liệu đầu vào)</h4>
            {item.inputs.length ? (
              <ul className="space-y-1.5">
                {item.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs border border-slate-200/70">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Không có dữ liệu đầu vào đặc thù.</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">03 · Output (Kết quả đầu ra)</h4>
            {item.outputs.length ? (
              <ul className="space-y-1.5">
                {item.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-200/70">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Không có dữ liệu đầu ra đặc thù.</p>
            )}
          </div>

          {item.actors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">04 · Tác nhân thực hiện</h4>
              <div className="space-y-2">
                {item.actors.map((actor, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{actor.name} ({actor.role})</div>
                    <div className="text-slate-500 mt-0.5">Hành động: {actor.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.process?.steps && item.process.steps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">05 · Các bước quy trình</h4>
              <ol className="space-y-2 list-decimal list-inside text-xs">
                {item.process.steps.map((step, idx) => (
                  <li key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200/70">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  )
}
