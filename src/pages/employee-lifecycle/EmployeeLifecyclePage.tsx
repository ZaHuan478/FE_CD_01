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

          {/* SOP Governing Banner */}
          {item.sopIds && item.sopIds.length > 0 && (
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Quy trình SOP Điều phối (Governance)</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.sopIds.map((sop, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-mono text-xs font-bold shadow-xs">
                    📋 {sop}
                  </span>
                ))}
              </div>
              {item.sopTitles && item.sopTitles.length > 0 && (
                <p className="text-xs text-emerald-900 font-medium mt-2 leading-relaxed">
                  {item.sopTitles.join(', ')}
                </p>
              )}
            </div>
          )}

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
