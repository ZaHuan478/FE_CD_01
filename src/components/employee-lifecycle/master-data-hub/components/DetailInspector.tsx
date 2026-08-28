import React from 'react'
import {
  Info,
  ShieldCheck,
  ListChecks,
  Users,
  AlertTriangle
} from 'lucide-react'
import {
  TIER_LABELS,
  STATUS_LABELS,
  type CatalogViewModel
} from '../masterDataCatalogAdapter'
import type { SopSubProcess } from '../../workflow-detail/types'
import { colorBadge, statusIcon } from './DomainIcon'

export interface DetailInspectorProps {
  isDarkMode: boolean
  selectedCatalog: CatalogViewModel | null
  contextProcess?: SopSubProcess
  onNavigateToCatalog?: (id: string) => void
  subdued: string
}

export const DetailInspector: React.FC<DetailInspectorProps> = ({
  isDarkMode,
  selectedCatalog,
  subdued
}) => {
  if (!selectedCatalog) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div
          className={`
          w-12 h-12 rounded-2xl flex items-center justify-center mb-4
          ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}
        `}
          aria-hidden="true"
        >
          <Info className="w-6 h-6 text-slate-400" />
        </div>
        <p className={`text-sm font-semibold ${subdued} mb-1`}>Chưa chọn danh mục</p>
        <p className={`text-xs ${subdued} max-w-[220px] leading-relaxed`}>
          Chọn một danh mục ở giữa để xem mục đích, trường khai báo và phân hệ sử dụng.
        </p>
      </div>
    )
  }

  const tierInfo = TIER_LABELS[selectedCatalog.tier]
  const statusInfo = STATUS_LABELS[selectedCatalog.status]

  return (
    <div className="flex flex-col">
      {/* Inspector header */}
      <div
        className={`
        px-4 py-3 border-b
        ${
          isDarkMode
            ? 'border-slate-800 bg-slate-900/80 sticky top-0 z-10'
            : 'border-slate-100 bg-white/90 sticky top-0 z-10 backdrop-blur-sm'
        }
      `}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {selectedCatalog.code}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold ${
              statusInfo.color === 'emerald'
                ? 'text-emerald-600 dark:text-emerald-400'
                : statusInfo.color === 'amber'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-500'
            }`}
          >
            {statusIcon(selectedCatalog.status)} {statusInfo.label}
          </span>
        </div>
        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
          {selectedCatalog.title}
        </h3>
      </div>

      {/* Inspector body */}
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* 1. Tổng quan */}
        <InspectorSection title="Tổng quan" icon={Info} isDarkMode={isDarkMode}>
          <p className={`text-xs leading-relaxed ${subdued}`}>
            {selectedCatalog.summary || selectedCatalog.description.split('\n')[0]}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge(
                tierInfo.color
              )}`}
            >
              {tierInfo.label}
            </span>
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorBadge('slate')}`}>
              {selectedCatalog.catalogType}
            </span>
          </div>
        </InspectorSection>

        {/* Geo metadata note (địa giới hành chính) */}
        {selectedCatalog.geoMetadata && (
          <div
            className={`p-3 rounded-xl text-xs leading-relaxed ${
              selectedCatalog.status === 'legacy'
                ? isDarkMode
                  ? 'bg-amber-900/20 text-amber-300 border border-amber-800/50'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                : isDarkMode
                  ? 'bg-blue-900/20 text-blue-300 border border-blue-800/50'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {selectedCatalog.status === 'legacy' ? (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div>
                <p className="font-bold mb-1">Địa giới hành chính</p>
                <p>{selectedCatalog.geoMetadata.note || selectedCatalog.geoMetadata.legacyNote}</p>
                {selectedCatalog.geoMetadata.effectiveFrom && (
                  <p className="mt-1 font-medium">
                    Hiệu lực từ: {selectedCatalog.geoMetadata.effectiveFrom}
                  </p>
                )}
                {selectedCatalog.geoMetadata.effectiveTo && (
                  <p className="mt-0.5 font-medium">
                    Hết hiệu lực: {selectedCatalog.geoMetadata.effectiveTo}
                  </p>
                )}
                {selectedCatalog.geoMetadata.asOfDate && (
                  <p
                    className={`mt-1 text-[10px] ${
                      isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'
                    }`}
                  >
                    Dữ liệu tính đến: {selectedCatalog.geoMetadata.asOfDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Quản trị */}
        <InspectorSection title="Quản trị" icon={ShieldCheck} isDarkMode={isDarkMode}>
          <div className="space-y-2">
            <InspectorRow label="Data Owner" value={selectedCatalog.ownerRole} subdued={subdued} />
            <InspectorRow
              label="Phạm vi"
              value={TIER_LABELS[selectedCatalog.tier].description}
              subdued={subdued}
            />
          </div>
        </InspectorSection>

        {/* 3. Trường dữ liệu */}
        {selectedCatalog.fields.length > 0 && (
          <InspectorSection
            title={`Trường khai báo (${selectedCatalog.fieldCount})`}
            icon={ListChecks}
            isDarkMode={isDarkMode}
          >
            <div className="flex flex-wrap gap-1.5">
              {selectedCatalog.fields.slice(0, 20).map((f) => (
                <span
                  key={f}
                  className={`px-2 py-1 rounded-lg text-[11px] leading-snug ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {f}
                </span>
              ))}
              {selectedCatalog.fields.length > 20 && (
                <span className={`text-[11px] py-1 ${subdued}`}>
                  +{selectedCatalog.fields.length - 20} trường nữa
                </span>
              )}
            </div>
          </InspectorSection>
        )}

        {/* 4. Phân hệ sử dụng */}
        {selectedCatalog.consumerModules.length > 0 && (
          <InspectorSection title="Phân hệ sử dụng" icon={Users} isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-2">
              {selectedCatalog.consumerModules.map((mod) => (
                <span
                  key={mod}
                  className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold border
                  ${
                    isDarkMode
                      ? 'border-indigo-700/60 bg-indigo-900/30 text-indigo-300'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  }
                `}
                >
                  {mod}
                </span>
              ))}
            </div>
          </InspectorSection>
        )}

        {selectedCatalog.fields.length === 0 && selectedCatalog.consumerModules.length === 0 && (
          <p className={`text-xs ${subdued} text-center py-4`}>Chưa có dữ liệu mô tả chi tiết.</p>
        )}
      </div>
    </div>
  )
}

// ── Inspector helpers ─────────────────────────────────────────────────────────

interface InspectorSectionProps {
  title: string
  icon: React.ElementType
  isDarkMode: boolean
  children: React.ReactNode
}

export const InspectorSection: React.FC<InspectorSectionProps> = ({
  title,
  icon: Icon,
  isDarkMode,
  children
}) => (
  <div>
    <div
      className={`flex items-center gap-1.5 mb-2 pb-1.5 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
      <h4 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
        {title}
      </h4>
    </div>
    {children}
  </div>
)

interface InspectorRowProps {
  label: string
  value: string
  subdued: string
}

export const InspectorRow: React.FC<InspectorRowProps> = ({ label, value, subdued }) => (
  <div className="flex items-start gap-2">
    <span className={`text-[11px] font-bold shrink-0 w-24 ${subdued}`}>{label}</span>
    <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
      {value || '—'}
    </span>
  </div>
)
