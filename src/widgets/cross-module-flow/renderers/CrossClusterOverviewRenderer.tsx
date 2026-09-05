import React from 'react'
import { ArrowRight, RefreshCw, ChevronRight, Layers, Building2, Users, GraduationCap } from 'lucide-react'
import type { CrossClusterOverviewConnection, FlowNode } from '../../../entities/process-flow/model/types'
import { FREQUENCY_METADATA } from '../../../entities/process-flow/lib/flowConstants'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

interface CrossClusterOverviewRendererProps {
  nodes?: FlowNode[]
  connections: CrossClusterOverviewConnection[]
  selectedConnectionId: string
  onSelectConnection: (id: string) => void
}

export const CrossClusterOverviewRenderer: React.FC<CrossClusterOverviewRendererProps> = ({
  connections,
  selectedConnectionId,
  onSelectConnection
}) => {
  const { language } = useLanguage()

  const clusterName = (clusterId: string) => {
    switch (clusterId) {
      case 'organization':
        return language === 'vi' ? 'Quản trị Tổ chức' : 'Organization Planning'
      case 'core':
        return language === 'vi' ? 'Vận hành Lõi' : 'Core HR & Operations'
      case 'people':
        return language === 'vi' ? 'Phát triển Con người' : 'People Development'
      case 'platform':
        return language === 'vi' ? 'Dịch vụ Nền tảng' : 'Platform Foundation'
      default:
        return clusterId
    }
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* 1. High-Level 4-Cluster Architectural Diagram */}
      <div className="w-full min-w-0 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1f5f86] dark:text-sky-400">
            Enterprise Architecture Top-Level
          </span>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            {language === 'vi' ? 'Mô hình Tương tác Dữ liệu Liên Cụm Nghiệp vụ' : 'Cross-Cluster Enterprise Data Interoperability'}
          </h4>
        </div>

        {/* Top 3 Business Clusters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Cụm 1: Quản trị tổ chức */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>{language === 'vi' ? '1. Quản trị Tổ chức' : '1. Organization Planning'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'vi' ? 'Hoạch định định biên, cơ cấu phòng ban, chức danh & chuẩn hóa vị trí ghế (Position).' : 'Headcount budgets, org hierarchy, and position seats.'}
            </p>
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>➔ Cung cấp vị trí cho Vận hành lõi</span>
            </div>
          </div>

          {/* Cụm 2: Vận hành lõi */}
          <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#1f5f86] dark:text-sky-300 font-bold text-xs">
              <Users className="w-4 h-4 text-[#1f5f86]" />
              <span>{language === 'vi' ? '2. Vận hành Lõi' : '2. Core Operations'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'vi' ? 'Vận hành tuyển dụng, hồ sơ nhân sự, chấm công, tiền lương, BHXH & thuế thu nhập.' : 'Hiring, core employee records, timekeeping, payroll, SI & PIT.'}
            </p>
            <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <span>➔ Cung cấp dữ liệu nhân sự cho Đánh giá</span>
            </div>
          </div>

          {/* Cụm 3: Phát triển con người */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>{language === 'vi' ? '3. Phát triển Con người' : '3. People Development'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'vi' ? 'Mục tiêu KPI, đánh giá hiệu suất, đào tạo IDP, ma trận 9-Box & quy hoạch kế nhiệm.' : 'KPIs, reviews, competency gaps, L&D, and 9-box talent benches.'}
            </p>
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>➔ Phản hồi kế nhiệm & thưởng cho Org & Core</span>
            </div>
          </div>
        </div>

        {/* Bottom Supporting Platform Layer */}
        <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                {language === 'vi' ? 'Dịch vụ Nền tảng Hỗ trợ Dùng chung (Platform Foundation)' : 'Platform Shared Service Mesh'}
              </h5>
              <p className="text-[11px] text-purple-700 dark:text-purple-400">
                {language === 'vi' ? 'Master Data · Cấu hình HRM · Workflow · Ký số · Thông báo · Tích hợp · Bảo mật · Audit log' : 'Master Data · HRM Config · Workflow · Digital Sign · Notification · Integration · Security · Audit'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 self-start sm:self-center">
            {language === 'vi' ? 'Hỗ trợ 3 Cụm Nghiệp vụ' : 'Supports All 3 Clusters'}
          </span>
        </div>
      </div>

      {/* 2. Interactive Cross-Cluster Connections List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
          <span>{language === 'vi' ? 'Các dòng chảy dữ liệu liên cụm chủ chốt:' : 'Key Cross-Cluster Data Connections:'}</span>
          <span className="text-[11px] font-normal text-slate-500">
            {language === 'vi' ? 'Chọn một luồng để xem gói dữ liệu bàn giao liên cụm' : 'Click to inspect cross-cluster payload'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {connections.map((c) => {
            const isSelected = c.id === selectedConnectionId
            const freqMeta = FREQUENCY_METADATA[c.frequency]
            const isFeedback = c.direction === 'feedback'

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectConnection(c.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#1f5f86] dark:border-sky-500 bg-[#1f5f86]/5 dark:bg-sky-950/40 ring-2 ring-[#1f5f86]/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-[#1f5f86] dark:text-sky-400">
                    <span>{clusterName(c.fromCluster)}</span>
                    {isFeedback ? (
                      <RefreshCw className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span>{clusterName(c.toCluster)}</span>
                  </div>

                  <p
                    className={`text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {language === 'vi' ? c.label : c.labelEn}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                    {isFeedback && (
                      <span className="px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold">
                        {language === 'vi' ? 'Vòng lặp Feedback' : 'Feedback Loop'}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded border ${freqMeta.bg} ${freqMeta.text} font-bold`}>
                      {language === 'vi' ? freqMeta.label : freqMeta.labelEn}
                    </span>
                    <span>{c.dataItems.length} {language === 'vi' ? 'nhóm dữ liệu' : 'data fields'}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#1f5f86] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
