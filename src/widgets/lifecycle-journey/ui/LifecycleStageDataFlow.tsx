import React from 'react'
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Inbox,
  Send,
  Sparkles,
  Workflow
} from 'lucide-react'
import type { LifecycleStageDefinition } from '../../../entities/lifecycle/model/journey/types'

interface LifecycleStageDataFlowProps {
  stage: LifecycleStageDefinition
}

export const LifecycleStageDataFlow: React.FC<LifecycleStageDataFlowProps> = ({ stage }) => {
  return (
    <section aria-label="Luồng dữ liệu 3 khối" className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <h4 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-800 dark:text-white">
          <Workflow className="h-4 w-4 text-[#1f5f86] dark:text-sky-300" />
          <span>Dòng chảy dữ liệu từ đầu vào đến sản phẩm bàn giao:</span>
        </h4>
        <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400">
          Mô hình 3 khối chuẩn hóa
        </span>
      </div>

      {/* 3-BLOCK FLOW GRID */}
      <div className="grid grid-cols-1 items-stretch gap-2.5 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
        {/* KHỐI 1: CẦN CHUẨN BỊ GÌ? (ĐẦU VÀO) */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <h5 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                <Inbox className="h-4 w-4" />
                <span>1. Cần chuẩn bị gì? (Đầu vào)</span>
              </h5>
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                {stage.prerequisites.length} mục
              </span>
            </div>
            <ul className="space-y-2">
              {stage.prerequisites.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2e8bbd]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-2 text-[10.5px] italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Dữ liệu tiên quyết trước khi thực hiện
          </p>
        </article>

        {/* MŨI TÊN 1 */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-5 w-5 lg:hidden" />
          <ArrowRight className="hidden h-5 w-5 lg:block" />
        </div>

        {/* KHỐI 2: HR VÀ HỆ THỐNG LÀM GÌ? (XỬ LÝ - NỀN XANH THƯƠNG HIỆU) */}
        <article className="flex flex-col justify-between rounded-xl border border-[#2e8bbd] bg-[#1f5f86] p-4 text-white shadow-sm">
          <div>
            <div className="mb-2.5 flex items-center justify-between border-b border-white/20 pb-2">
              <h5 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-sky-100">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>2. HR & Hệ thống làm gì? (Xử lý)</span>
              </h5>
              <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold">
                {stage.id}
              </span>
            </div>
            <ul className="space-y-2">
              {stage.processActions.map((action, idx) => (
                <li key={`${action}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-sky-50">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9.5px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 border-t border-white/15 pt-2 text-[10.5px] text-sky-200">
            Thao tác chuẩn hóa theo từng bước quy trình SOP
          </p>
        </article>

        {/* MŨI TÊN 2 */}
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-700">
          <ArrowDown className="h-5 w-5 lg:hidden" />
          <ArrowRight className="hidden h-5 w-5 lg:block" />
        </div>

        {/* KHỐI 3: KẾT QUẢ BÀN GIAO LÀ GÌ? (ĐẦU RA) */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <h5 className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">
                <Send className="h-4 w-4" />
                <span>3. Kết quả bàn giao là gì? (Đầu ra)</span>
              </h5>
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9.5px] font-bold text-[#1f5f86] dark:bg-sky-950 dark:text-sky-300">
                {stage.deliverables.length} mục
              </span>
            </div>
            <ul className="space-y-2">
              {stage.deliverables.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1f5f86] dark:text-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-2 text-[10.5px] italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Sẵn sàng bàn giao cho các phân hệ liên quan
          </p>
        </article>
      </div>
    </section>
  )
}
