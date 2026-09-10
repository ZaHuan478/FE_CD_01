import React from 'react'
import { CheckCircle2, Eye, EyeOff, FileCheck2, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react'
import type { SopSubProcess } from '../../../../entities/sop/model/types'

interface SopGovernancePanelProps {
  currentProcess: SopSubProcess
  isDarkMode: boolean
}

const classificationLabels = {
  internal: 'Nội bộ',
  restricted: 'Hạn chế theo vai trò',
  confidential: 'Mật',
  'highly-restricted': 'Hạn chế đặc biệt'
}

const ListBlock = ({ title, values, icon: Icon, tone }: {
  title: string
  values: string[]
  icon: React.ComponentType<{ className?: string }>
  tone: 'blue' | 'emerald' | 'rose'
}) => {
  const colors = tone === 'emerald'
    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20'
    : tone === 'rose'
      ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/20'
      : 'border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20'
  const iconColor = tone === 'emerald' ? 'text-emerald-600' : tone === 'rose' ? 'text-rose-600' : 'text-blue-600'
  return <div className={`rounded-xl border p-4 ${colors}`}>
    <div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${iconColor}`} /><h4 className="text-xs font-extrabold">{title}</h4></div>
    <ul className="mt-3 space-y-2">
      {values.map((value) => <li key={value} className="flex items-start gap-2 text-xs leading-5 text-slate-600 dark:text-slate-300"><CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${iconColor}`} /><span>{value}</span></li>)}
    </ul>
  </div>
}

export const SopGovernancePanel: React.FC<SopGovernancePanelProps> = ({ currentProcess, isDarkMode }) => {
  const { access, approvalFlow = [], documentControl } = currentProcess
  if (!access && approvalFlow.length === 0 && !documentControl) return null

  return <section className={`overflow-hidden rounded-2xl border shadow-sm ${isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
    <header className={`flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1f5f86] text-white"><ShieldCheck className="h-5 w-5" /></div>
        <div><p className="text-[11px] font-extrabold uppercase tracking-wide text-[#1f5f86] dark:text-sky-300">Quyền xem và phê duyệt</p><h2 className="mt-0.5 text-base font-black sm:text-lg">Ai được xem, ai xử lý và ai phê duyệt?</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Quyền xem hướng dẫn SOP được tách khỏi quyền xem hồ sơ nghiệp vụ phát sinh.</p></div>
      </div>
      {access && <span className="inline-flex self-start items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"><LockKeyhole className="h-3.5 w-3.5" />{classificationLabels[access.classification]}</span>}
    </header>

    {access && <div className="grid grid-cols-1 gap-3 p-4 sm:p-5 xl:grid-cols-3">
      <ListBlock title="Được xem hướng dẫn SOP" values={access.sopViewers} icon={Eye} tone="blue" />
      <ListBlock title="Được xem hồ sơ phát sinh" values={access.recordViewers} icon={UsersRound} tone="emerald" />
      <ListBlock title="Không được xem hồ sơ" values={access.excluded} icon={EyeOff} tone="rose" />
    </div>}

    {approvalFlow.length > 0 && <div className={`border-t p-4 sm:p-5 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-600" /><h3 className="text-sm font-extrabold">Luồng phê duyệt nghiệp vụ</h3></div>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {approvalFlow.map((stage) => <div key={`${stage.order}-${stage.actor}`} className={`rounded-xl border p-4 ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/70'}`}>
          <div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">{stage.order}</span><div><p className="text-xs font-black">{stage.actor}</p><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{stage.decision}</p>{stage.condition && <p className="mt-2 text-[11px] leading-5 text-amber-700 dark:text-amber-300"><strong>Điều kiện:</strong> {stage.condition}</p>}<p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400"><strong>Kết quả:</strong> {stage.outcome}</p></div></div>
        </div>)}
      </div>
    </div>}

    {documentControl && <div className={`border-t p-4 sm:p-5 ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/60'}`}>
      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /><h3 className="text-sm font-extrabold">Phê duyệt và quản trị tài liệu SOP</h3></div>
      <dl className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"><dt className="text-[10px] font-extrabold uppercase text-slate-500">Chủ sở hữu</dt><dd className="mt-1 text-xs font-bold">{documentControl.owner}</dd></div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"><dt className="text-[10px] font-extrabold uppercase text-slate-500">Người rà soát</dt><dd className="mt-1 text-xs font-bold">{documentControl.reviewers.join(' · ')}</dd></div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"><dt className="text-[10px] font-extrabold uppercase text-slate-500">Người duyệt công bố</dt><dd className="mt-1 text-xs font-bold">{documentControl.approver}</dd></div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"><dt className="text-[10px] font-extrabold uppercase text-slate-500">Chu kỳ rà soát</dt><dd className="mt-1 text-xs font-bold">{documentControl.reviewCycle}</dd></div>
      </dl>
    </div>}
  </section>
}
