import React, { useEffect } from 'react'
import { X, Network, UserCheck, Briefcase, FileText, ArrowRight, ShieldCheck, Database, Layers, ScrollText } from 'lucide-react'
import type { ERDCluster } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'

interface MasterDataRelationshipModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectNode?: (id: string) => void
}

import { erdClustersData as erdClusters } from './data/erdClustersData'

export const MasterDataRelationshipModal: React.FC<MasterDataRelationshipModalProps> = ({
  isOpen,
  onClose,
  onSelectNode
}) => {
  const { language } = useLanguage()

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-slate-900 text-slate-100 rounded-2xl sm:rounded-3xl border border-slate-700/60 shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
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
                {language === 'vi'
                  ? 'SƠ ĐỒ MỐI QUAN HỆ & PHỤ THUỘC DỮ LIỆU MASTER DATA · SOP'
                  : 'MASTER DATA & SOP DEPENDENCY RELATIONSHIP DIAGRAM'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>        {/* Modal Body / ERD Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-950/60 space-y-8">

          {/* Top Banner Explainer */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                {language === 'vi'
                  ? <>Tất cả 10 danh mục <strong>Master Data (Tầng 1)</strong> chuẩn hóa theo <strong>SOP Quy trình</strong> chảy trực tiếp qua các Visual Connectors để hội tụ vào <strong>Bảng Hồ sơ Nhân viên Trung tâm</strong>.</>
                  : <>All 10 <strong>Master Data (Layer 1)</strong> catalogs standardized by <strong>SOP Workflows</strong> flow directly via Visual Connectors into the <strong>Central Employee Profile Table</strong>.</>}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-emerald-300 font-medium">
              <ScrollText className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Gắn thẻ Quy trình SOP chuẩn' : 'Tagged with Standard SOPs'}</span>
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
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-800/80">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs ${cluster.badgeBg}`}>
                          {cluster.title}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {cluster.sopIds && cluster.sopIds.map((sop) => (
                            <span key={sop} className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-400 rounded-md border border-emerald-800/70 flex items-center gap-1 shrink-0 whitespace-nowrap">
                              <ScrollText className="w-3 h-3 text-emerald-400" />
                              {sop}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 font-medium">{cluster.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 shrink-0 shadow-xs">
                      <span className="text-slate-400 font-normal">Nguồn cho:</span>
                      <span className="text-blue-400 font-bold tracking-tight">{cluster.targetField}</span>
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

