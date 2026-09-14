/* oxlint-disable react/only-export-components */
import React, { useState, useMemo } from 'react'
import {
  Compass,
  FileText,
  Layers,
  Map,
  Search,
  Settings
} from 'lucide-react'
import type { SystemGuide } from '../model/systemGuideModel'
import { FeatureMapCard } from './FeatureMapCard'

export interface DomainGroup {
  id: string
  title: string
  subtitle: string
  icon: typeof Compass
  color: string
  slugs: string[]
}

export const featureMapDomains: DomainGroup[] = [
  {
    id: 'domain-explore',
    title: '1. Khám phá hệ thống',
    subtitle: 'Nền tảng, kiến trúc tổng thể, dữ liệu dùng chung và các luồng phát sinh',
    icon: Compass,
    color: 'text-cyan-700 dark:text-cyan-300',
    slugs: [
      'tong-quan-he-thong',
      'dieu-huong-va-tim-kiem',
      'tong-quan-kien-truc-hrms',
      'danh-muc-master-data',
      'hanh-trinh-vong-doi-nhan-vien',
      'nghiep-vu-phat-sinh'
    ]
  },
  {
    id: 'domain-docs',
    title: '2. Tài liệu',
    subtitle: 'Kho tài liệu nguồn cá nhân, upload và lưu trữ PDF/DOCX',
    icon: FileText,
    color: 'text-blue-700 dark:text-blue-300',
    slugs: ['tai-lieu-cua-toi']
  },
  {
    id: 'domain-sop',
    title: '3. SOP và lưu đồ',
    subtitle: 'Tra cứu quy trình chuẩn, chuyển hóa văn bản, xem canvas và quản lý vòng đời',
    icon: Layers,
    color: 'text-teal-700 dark:text-teal-300',
    slugs: [
      'thu-vien-quy-trinh',
      'xem-luu-do-va-canvas-sop',
      'chuyen-hoa-tai-lieu',
      'quan-ly-vong-doi-sop'
    ]
  },
  {
    id: 'domain-ai',
    title: '4. Tra cứu & AI',
    subtitle: 'Quy định tuân thủ toàn công ty và trợ lý hỏi đáp thông minh có trích dẫn',
    icon: Search,
    color: 'text-indigo-700 dark:text-indigo-300',
    slugs: ['quy-dinh-tuan-thu', 'tro-ly-ai-sop']
  },
  {
    id: 'domain-admin',
    title: '5. Quản trị',
    subtitle: 'Quản lý người dùng, phân quyền, cấu hình hệ thống và chỉ mục dữ liệu',
    icon: Settings,
    color: 'text-purple-700 dark:text-purple-300',
    slugs: ['quan-tri-he-thong']
  }
]

interface FeatureMapProps {
  guides: SystemGuide[]
  selectedGuideId?: string | null
  onSelectGuide: (guide: SystemGuide) => void
  onOpenRoute?: (routePath: string) => void
  className?: string
}

export const FeatureMap: React.FC<FeatureMapProps> = ({
  guides,
  selectedGuideId,
  onSelectGuide,
  onOpenRoute,
  className = ''
}) => {
  const [activeDomainTab, setActiveDomainTab] = useState<string>('all')

  // Filter groups according to selected tab
  const displayedDomains = useMemo(() => {
    if (activeDomainTab === 'all') return featureMapDomains
    return featureMapDomains.filter((d) => d.id === activeDomainTab)
  }, [activeDomainTab])

  return (
    <section id="feature-map" className={`space-y-5 ${className}`}>
      {/* Header and Domain Filter Pills */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#155e75]/10 text-[#155e75] dark:bg-cyan-950/60 dark:text-cyan-300">
            <Map className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">
              Bản đồ chức năng toàn hệ thống
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Khám phá theo 5 nhóm tính năng logic từ nền tảng đến vận hành
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveDomainTab('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeDomainTab === 'all'
                ? 'bg-white text-[#155e75] shadow-xs dark:bg-slate-900 dark:text-cyan-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Tất cả (5 nhóm)
          </button>
          {featureMapDomains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => setActiveDomainTab(domain.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                activeDomainTab === domain.id
                  ? 'bg-white text-[#155e75] shadow-xs dark:bg-slate-900 dark:text-cyan-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {domain.title.split('.')[1]?.trim() || domain.title}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Groups Container */}
      <div className="space-y-6">
        {displayedDomains.map((domain) => {
          // Collect guides belonging to this domain
          const domainGuides = domain.slugs
            .map((slug) => guides.find((g) => g.slug === slug))
            .filter((g): g is SystemGuide => Boolean(g))

          if (domainGuides.length === 0) return null

          const Icon = domain.icon

          return (
            <div
              key={domain.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Group Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`grid size-7 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800 ${domain.color}`}>
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white">
                      {domain.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {domain.subtitle}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-slate-400">
                  {domainGuides.filter((g) => g.available).length}/{domainGuides.length} khả dụng
                </span>
              </div>

              {/* Cards Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {domainGuides.map((guide) => (
                  <FeatureMapCard
                    key={guide.id}
                    guide={guide}
                    isSelected={selectedGuideId === guide.id || selectedGuideId === guide.slug}
                    onSelect={onSelectGuide}
                    onOpenRoute={onOpenRoute}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
