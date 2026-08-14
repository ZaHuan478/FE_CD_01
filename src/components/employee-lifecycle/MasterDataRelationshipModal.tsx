import React, { useEffect } from 'react'
import { X, Network, UserCheck, Briefcase, FileText, ArrowRight, ShieldCheck, Database, Layers, ScrollText } from 'lucide-react'
import type { ERDCluster } from '../../types/employee-lifecycle'

interface MasterDataRelationshipModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectNode?: (id: string) => void
}

const erdClusters: ERDCluster[] = [
  {
    id: 'personal',
    title: 'CỤM 1: DANH MỤC CÁ NHÂN & ĐỊA LÝ',
    subtitle: 'Địa giới hành chính, trình độ, dân tộc, tôn giáo',
    targetField: 'SƠ YẾU LÝ LỊCH',
    color: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    sopIds: ['SOP-NS-04'],
    items: [
      { id: 'MD-04', code: 'MD-04', title: 'Đơn vị hành chính', subtitle: 'Tỉnh/Thành, Quận/Huyện, Xã/Phường', sopBadge: 'SOP-NS-01' },
      { id: 'MD-01', code: 'MD-01', title: 'Thêm giá trị danh mục', subtitle: 'Dân tộc, Tôn giáo, Quốc tịch', sopBadge: 'SOP-NS-04' },
      { id: 'MD-02', code: 'MD-02', title: 'Cập nhật giá trị danh mục', subtitle: 'Trình độ học vấn, Ngoại ngữ', sopBadge: 'SOP-NS-04' },
      { id: 'MD-03', code: 'MD-03', title: 'Khóa/Kích hoạt danh mục', subtitle: 'Trạng thái hiệu lực danh mục', sopBadge: 'SOP-NS-04' },
    ]
  },
  {
    id: 'structure',
    title: 'CỤM 2: CƠ CẤU & VỊ TRÍ CÔNG TÁC',
    subtitle: 'Đơn vị, phòng ban, chức danh, chức vụ, level',
    targetField: 'VỊ TRÍ CÔNG TÁC',
    color: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    sopIds: ['SOP-NS-01', 'SOP-NS-09'],
    items: [
      { id: 'MD-05', code: 'MD-05', title: 'Cơ cấu tổ chức', subtitle: 'Sơ đồ cây Đơn vị / Phòng ban', sopBadge: 'SOP-NS-01' },
      { id: 'MD-06', code: 'MD-06', title: 'Chức vụ / Chức danh', subtitle: 'Danh mục vị trí, Level, Định biên', sopBadge: 'SOP-NS-09' },
    ]
  },
  {
    id: 'policy',
    title: 'CỤM 3: CHÍNH SÁCH & CHẾ ĐỘ LABOUR',
    subtitle: 'Thang lương, ca làm việc, bảo hiểm & kỷ luật',
    targetField: 'HỢP ĐỒNG & CHẾ ĐỘ',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sopIds: ['SOP-L-02', 'SOP-CC-01', 'SOP-BH-01', 'SOP-NS-14'],
    items: [
      { id: 'MD-07', code: 'MD-07', title: 'Thang / Bậc lương', subtitle: 'Mức lương cơ bản & Hệ số', sopBadge: 'SOP-L-02' },
      { id: 'MD-08', code: 'MD-08', title: 'Ca & Loại nghỉ', subtitle: 'Cấu hình ca kíp, phép năm', sopBadge: 'SOP-CC-01' },
      { id: 'MD-09', code: 'MD-09', title: 'Bảo hiểm & Y tế', subtitle: 'BHXH, BHYT, Nơi KCB', sopBadge: 'SOP-BH-01' },
      { id: 'MD-10', code: 'MD-10', title: 'Danh mục Kỷ luật', subtitle: 'Hình thức khen thưởng & kỷ luật', sopBadge: 'SOP-NS-14' },
    ]
  }
]

export const MasterDataRelationshipModal: React.FC<MasterDataRelationshipModalProps> = ({
  isOpen,
  onClose,
  onSelectNode
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-700/60 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60 uppercase tracking-wider">
                  Data & SOP Dependency Flow
                </span>
                <span className="text-xs text-slate-400">ERD Diagram</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                SƠ ĐỒ MỐI QUAN HỆ & PHỤ THUỘC DỮ LIỆU MASTER DATA · SOP
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / ERD Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-950/60 space-y-8">

          {/* Top Banner Explainer */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                Tất cả 10 danh mục <strong>Master Data (Tầng 1)</strong> chuẩn hóa theo <strong>SOP Quy trình</strong> chảy trực tiếp qua các Visual Connectors để hội tụ vào <strong>Bảng Hồ sơ Nhân viên Trung tâm</strong>.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-emerald-300 font-medium">
              <ScrollText className="w-4 h-4 text-emerald-400" />
              <span>Gắn thẻ Quy trình SOP chuẩn</span>
            </div>
          </div>

          {/* Interactive ERD Diagram Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Left Side: 3 Input Clusters (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              {erdClusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-md relative group"
                >
                  {/* Cluster Header */}
                  <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${cluster.badgeBg}`}>
                          {cluster.title}
                        </span>
                        {cluster.sopIds && cluster.sopIds.map((sop) => (
                          <span key={sop} className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 rounded border border-emerald-800/60 flex items-center gap-1">
                            <ScrollText className="w-3 h-3 text-emerald-400" />
                            {sop}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{cluster.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                      <span>Nguồn cho:</span>
                      <span className="text-blue-400 font-bold">{cluster.targetField}</span>
                    </div>
                  </div>

                  {/* Cluster Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {cluster.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectNode?.(item.id)
                          onClose()
                        }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/90 hover:border-blue-500/50 text-left transition-all group/item cursor-pointer"
                      >
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-950 text-blue-400 rounded border border-blue-800/50 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors shrink-0">
                          {item.code}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-slate-200 group-hover/item:text-blue-300 transition-colors truncate">
                              {item.title}
                            </span>
                            {item.sopBadge && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 rounded border border-emerald-800/60 shrink-0">
                                {item.sopBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Flow Arrow to Center */}
                  <div className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-blue-400 shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Central Employee Record (4 Cols) */}
            <div className="lg:col-span-4 flex">
              <div className="w-full bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900 rounded-2xl p-6 border-2 border-blue-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 text-blue-400">
                  <UserCheck className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30 mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Central Hub
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                    BẢNG HỒ SƠ NHÂN VIÊN TRUNG TÂM
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Central Employee Master Record (Tập hợp toàn bộ thông tin định danh & vận hành nhân sự theo chuẩn SOP)
                  </p>

                  {/* 3 Core Fields Converging */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-sky-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                        <div>
                          <div className="text-[11px] text-sky-400 font-bold uppercase">Sơ yếu Lý lịch</div>
                          <div className="text-xs text-slate-300">Thông tin cá nhân & Địa lý</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                        SOP-NS-04
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div className="text-[11px] text-indigo-400 font-bold uppercase">Vị trí Công tác</div>
                          <div className="text-xs text-slate-300">Cơ cấu, Chức danh & Level</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                        SOP-NS-01/09
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-[11px] text-emerald-400 font-bold uppercase">Hợp đồng & Chế độ</div>
                          <div className="text-xs text-slate-300">Lương, Ca kíp & Bảo hiểm</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                        SOP-L/BH/CC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    ✦ Sẵn sàng cung cấp dữ liệu chuẩn SOP cho 7 bước Vòng đời Nhân viên (Tầng 2)
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Mối quan hệ dữ liệu & Quy định SOP được cấu hình chuẩn mực theo mô hình Enterprise SaaS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng sơ đồ (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}

