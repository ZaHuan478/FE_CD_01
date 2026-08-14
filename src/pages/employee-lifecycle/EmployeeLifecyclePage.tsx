import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Layers, Database, FileText, X, Layout } from 'lucide-react'

import { MasterDataCard } from '../../components/employee-lifecycle/MasterDataCard'
import { MasterDataRelationshipModal } from '../../components/employee-lifecycle/MasterDataRelationshipModal'
import { LifecycleStepper } from '../../components/employee-lifecycle/LifecycleStepper'
import { OperationsGrid } from '../../components/employee-lifecycle/OperationsGrid'
import { SystemSupportBar } from '../../components/employee-lifecycle/SystemSupportBar'
import { SystemGuideBanner } from '../../components/employee-lifecycle/SystemGuideBanner'
import { WireframeFormModal } from '../../components/employee-lifecycle/WireframeFormModal'
import { NodeDetailDrawer } from '../../components/employee-lifecycle/NodeDetailDrawer'

import { masterData, lifecycleProcesses, crossFunctionalProcesses, sharedServices } from './data'
import type { MasterDataCategory, LifecycleStep, OperationModule, DetailItem } from '../../types/employee-lifecycle'

// SOP Mapping Dictionary (Global Constant based on SOP - HRUX.xlsx)
const sopDictionary: Record<string, { badge: string; title: string }> = {
  // 7 Bước Vòng đời Nhân viên (Lifecycle)
  'LIFE-01': { badge: 'SOP-TD-04', title: 'Tiếp nhận nhân viên mới (Phân hệ Tuyển dụng)' },
  'LIFE-02': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Phân hệ Nhân sự)' },
  'LIFE-03': { badge: 'SOP-ĐG-04', title: 'Quy trình đánh giá thử việc & Điều động/điều chuyển (SOP-NS-12)' },
  'LIFE-04': { badge: 'SOP-NS-06', title: 'Ký hợp đồng với nhân viên mới (Phân hệ Nhân sự)' },
  'LIFE-05': { badge: 'SOP-L-01', title: 'Quản lý chính sách thu nhập theo đối tượng & Báo tăng bảo hiểm (SOP-BH-03)' },
  'LIFE-06': { badge: 'SOP-CC-08', title: 'Xử lý dữ liệu chấm công & Quá trình làm việc (Phân hệ Chấm công)' },
  'LIFE-07': { badge: 'SOP-NS-16', title: 'Giảm lao động & Quản lý báo giảm bảo hiểm (SOP-BH-04)' },

  // 8 Module Nghiệp vụ Phát sinh (Operations Grid - Aliases CF-xx & CROSS-xx)
  'CF-01': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'CF-02': { badge: 'SOP-NS-05', title: 'Tái ký hợp đồng lao động & Phụ lục hợp đồng (SOP-NS-07)' },
  'CF-03': { badge: 'SOP-NS-09', title: 'Bổ nhiệm, Kiêm nhiệm (SOP-NS-10) & Điều động/điều chuyển (SOP-NS-12)' },
  'CF-04': { badge: 'SOP-NS-13', title: 'Khen thưởng & Xử lý Kỷ luật (SOP-NS-14)' },
  'CF-05': { badge: 'SOP-DT-02', title: 'Quản lý kế hoạch đào tạo của Công ty (Phân hệ Đào tạo)' },
  'CF-06': { badge: 'SOP-ĐG-02', title: 'Quy trình đánh giá thành tích & Bộ tiêu chí KPI (SOP-ĐG-01)' },
  'CF-07': { badge: 'SOP-PL-01', title: 'Quản lý thông tin khám sức khoẻ định kỳ & Phúc lợi (SOP-PL-05)' },
  'CF-08': { badge: 'SOP-NS-15', title: 'Quản lý công tác (Phân hệ Nhân sự)' },

  'CROSS-01': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'CROSS-02': { badge: 'SOP-NS-05', title: 'Tái ký hợp đồng lao động & Phụ lục hợp đồng (SOP-NS-07)' },
  'CROSS-03': { badge: 'SOP-NS-09', title: 'Bổ nhiệm, Kiêm nhiệm (SOP-NS-10) & Điều động/điều chuyển (SOP-NS-12)' },
  'CROSS-04': { badge: 'SOP-NS-13', title: 'Khen thưởng & Xử lý Kỷ luật (SOP-NS-14)' },
  'CROSS-05': { badge: 'SOP-DT-02', title: 'Quản lý kế hoạch đào tạo của Công ty (Phân hệ Đào tạo)' },
  'CROSS-06': { badge: 'SOP-ĐG-02', title: 'Quy trình đánh giá thành tích & Bộ tiêu chí KPI (SOP-ĐG-01)' },
  'CROSS-07': { badge: 'SOP-PL-01', title: 'Quản lý thông tin khám sức khoẻ định kỳ & Phúc lợi (SOP-PL-05)' },
  'CROSS-08': { badge: 'SOP-NS-15', title: 'Quản lý công tác (Phân hệ Nhân sự)' },

  // Tầng 1: Master Data Categories
  'MD-01': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Danh mục Nền tảng)' },
  'MD-02': { badge: 'SOP-NS-04', title: 'Quản lý thông tin nhân viên (Học vấn, Trình độ)' },
  'MD-03': { badge: 'SOP-PIT-02', title: 'Quản lý thông tin thuế TNCN của nhân viên (Người phụ thuộc)' },
  'MD-04': { badge: 'SOP-NS-01', title: 'Định biên nhân sự (Đơn vị hành chính)' },
  'MD-05': { badge: 'SOP-NS-01', title: 'Định biên nhân sự (Cơ cấu tổ chức phòng ban)' },
  'MD-06': { badge: 'SOP-NS-09', title: 'Bổ nhiệm & Thiết lập tiêu chuẩn đào tạo chức danh (SOP-DT-01)' },
  'MD-07': { badge: 'SOP-L-02', title: 'Quản lý thang bảng lương (Phân hệ Lương)' },
  'MD-08': { badge: 'SOP-CC-01', title: 'Quản lý lịch đi ca & Quản lý nghỉ phép (SOP-CC-06)' },
  'MD-09': { badge: 'SOP-BH-01', title: 'Thiết lập và quản lý đối tượng/tỷ lệ và mức tham gia bảo hiểm' },
  'MD-10': { badge: 'SOP-NS-14', title: 'Quản lý Kỷ luật & Khen thưởng (SOP-NS-13)' }
}

export const EmployeeLifecyclePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null)
  const [wireframeItem, setWireframeItem] = useState<DetailItem | null>(null)

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

  // Handle Item Inspector
  const openItemDetails = (id: string) => {
    const rawNode =
      masterData.find((m) => m.id === id) ||
      lifecycleProcesses.find((l) => l.id === id) ||
      crossFunctionalProcesses.find((c) => c.id === id) ||
      sharedServices.find((s) => s.id === id)

    if (rawNode) {
      const sopInfo = sopDictionary[rawNode.id] || sopDictionary[id]
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
        sopIds: sopInfo ? [sopInfo.badge] : rawNode.sopIds,
        sopTitles: sopInfo ? [sopInfo.title] : [],
        uiFields: rawNode.wireframe.fields
      })
    } else {
      // Fallback for Operation Modules (e.g. CF-01, CF-02...)
      const opMod = operationModules.find((m) => m.id === id)
      const sopInfo = sopDictionary[id]
      if (opMod || sopInfo) {
        setSelectedItem({
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
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 pb-20">

      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-blue-600 rounded-xl text-white shadow-sm shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                  Enterprise HR SaaS Architecture
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Production Ready
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white mt-0.5 leading-snug">
                QUẢN LÝ HỒ SƠ & VÒNG ĐỜI NHÂN VIÊN
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs shrink-0">
            <span className="text-slate-400">Model Standard:</span>
            <span className="font-semibold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Workday / SAP SuccessFactors Style
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">

        {/* Intro Eyebrow Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Bức tranh Tổng thể Quy trình Quản trị Nhân sự (Business Process Blueprint)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                Cấu trúc phân tầng tiêu chuẩn: Tầng 1 Master Data ➔ Tầng 2 Vòng đời Nhân viên ➔ Tầng 3 Nghiệp vụ Phát sinh ➔ Thanh Hỗ trợ Hệ thống
              </p>
            </div>
          </div>
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

      {/* NODE DETAIL INSPECTOR DRAWER MODAL */}
      {selectedItem && (
        <NodeDetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onOpenWireframe={(itemToOpen) => setWireframeItem(itemToOpen)}
        />
      )}

      {/* INTERACTIVE UI WIREFRAME FORM MODAL */}
      <WireframeFormModal
        isOpen={!!wireframeItem}
        item={wireframeItem}
        onClose={() => setWireframeItem(null)}
      />

    </div>
  )
}
