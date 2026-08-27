import React from 'react'
import {
  AlertCircle,
  Building,
  Clock,
  ExternalLink,
  HelpCircle,
  Scale,
  Tag,
  Users
} from 'lucide-react'
import type { LifecycleStageDefinition } from './types'

interface LifecycleStageContextPanelProps {
  stage: LifecycleStageDefinition
}

export const LifecycleStageContextPanel: React.FC<LifecycleStageContextPanelProps> = ({ stage }) => {
  return (
    <aside aria-label="Thông tin ngữ cảnh và căn cứ pháp lý" className="space-y-4">
      {/* 1. MỤC ĐÍCH VÀ KHI NÀO PHÁT SINH */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
          <HelpCircle className="h-4 w-4" />
          <span>1. Chặng này giải quyết việc gì?</span>
        </h4>
        <p className="mt-2 text-xs leading-relaxed font-semibold text-slate-900 dark:text-white">
          {stage.purpose}
        </p>

        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <h5 className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Clock className="h-3.5 w-3.5 text-[#2e8bbd]" />
            <span>Khi nào phát sinh?</span>
          </h5>
          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
            {stage.triggerContext}
          </p>
        </div>
      </div>

      {/* 2. AI CHỊU TRÁCH NHIỆM CHÍNH (ACTORS MATRIX) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
          <Users className="h-4 w-4" />
          <span>2. Ai chịu trách nhiệm? (RBAC Matrix)</span>
        </h4>

        <div className="mt-2.5 space-y-2 text-xs">
          <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-950/40">
            <span className="shrink-0 rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
              Đề xuất
            </span>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{stage.primaryActor}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-950/40">
            <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Phê duyệt
            </span>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{stage.approverActor}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-950/40">
            <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Thực thi
            </span>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{stage.executorActor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRẠNG THÁI DỮ LIỆU THAY ĐỔI (MULTI-DIMENSION STATUS CHANGES) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
          <Tag className="h-4 w-4" />
          <span>3. Trạng thái dữ liệu thay đổi</span>
        </h4>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Các chiều trạng thái liên quan trực tiếp đến chặng này:
        </p>

        <div className="mt-2.5 space-y-2">
          {stage.statusTransitions.map((status, idx) => (
            <div
              key={`${status.dimension}-${idx}`}
              className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {status.dimension}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {status.from}
                </span>
                <span className="text-slate-400 font-bold">➔</span>
                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                  {status.to}
                </span>
              </div>
              {status.note && (
                <p className="mt-1 text-[10px] italic text-slate-500 dark:text-slate-400">
                  {status.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. PHÂN HỆ THAM GIA */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
          <Building className="h-4 w-4" />
          <span>4. Phân hệ tham gia</span>
        </h4>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#1f5f86] px-2 py-1 text-[11px] font-bold text-white shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Chính: {stage.primarySubsystem}</span>
          </span>
          {stage.relatedSubsystems.map((rel) => (
            <span
              key={rel}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <span>{rel}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5. CĂN CỨ PHÁP LÝ THAM KHẢO */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 shadow-2xs dark:border-sky-900/60 dark:bg-sky-950/20">
        <div className="flex items-center justify-between border-b border-sky-200/60 pb-2 dark:border-sky-900/60">
          <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
            <Scale className="h-4 w-4" />
            <span>5. Căn cứ pháp lý tham khảo</span>
          </h4>
        </div>

        {/* BẮT BUỘC: CHÚ THÍCH PHÁP LÝ DEMO */}
        <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10.5px] leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Thông tin pháp lý dùng để minh họa phạm vi nghiệp vụ. Doanh nghiệp cần được bộ phận pháp chế hoặc chuyên gia tư vấn xác nhận trước khi áp dụng.
          </span>
        </div>

        {/* DANH SÁCH VĂN BẢN QUY PHẠM */}
        <div className="mt-3 space-y-2.5">
          {stage.legalReferences.map((ref, idx) => (
            <div
              key={`${ref.lawDocument}-${idx}`}
              className="rounded-lg border border-white/80 bg-white/90 p-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-1">
                <p className="font-bold text-slate-900 dark:text-white leading-snug">
                  {ref.lawDocument}
                </p>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.2 text-[9px] font-bold ${
                    ref.status === 'Đã đối chiếu'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {ref.status}
                </span>
              </div>
              <p className="mt-0.5 font-semibold text-[#1f5f86] dark:text-sky-300 text-[11px]">
                {ref.articles}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {ref.contentSummary}
              </p>
              {ref.sourceUrl && (
                <a
                  href={ref.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#1f5f86] hover:underline dark:text-sky-300"
                >
                  <span>Xem văn bản gốc (vbpl/chinhphu)</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
