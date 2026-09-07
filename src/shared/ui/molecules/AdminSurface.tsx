import type { ReactNode } from 'react'
import { AlertCircle, Inbox } from 'lucide-react'

export function PageIntro({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p></div>{actions && <div className="shrink-0">{actions}</div>}</div>
}

export function Panel({ title, description, action, children, className = '' }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}>
    {(title || action) && <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800"><div>{title && <h3 className="text-sm font-black text-slate-950 dark:text-white">{title}</h3>}{description && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>}</div>{action}</div>}
    {children}
  </section>
}

export function Feedback({ type, children, action }: { type: 'error' | 'success' | 'info'; children: ReactNode; action?: ReactNode }) {
  const style = type === 'error' ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200' : type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100'
  return <div role={type === 'error' ? 'alert' : 'status'} className={`mb-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${style}`}><span className="flex items-center gap-2"><AlertCircle className="size-4 shrink-0" />{children}</span>{action}</div>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="grid min-h-48 place-items-center px-5 py-10 text-center"><div><Inbox className="mx-auto size-7 text-slate-400" /><p className="mt-3 text-sm font-black">{title}</p><p className="mt-1 max-w-md text-sm text-slate-500">{description}</p></div></div>
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return <div className="animate-pulse p-4">{Array.from({ length: rows }, (_, index) => <div key={index} className="mb-3 h-10 rounded-lg bg-slate-100 last:mb-0 dark:bg-slate-800" />)}</div>
}

export const adminInputClass = 'h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#155e75] focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus-visible:ring-cyan-900'
export const primaryButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#155e75] px-3.5 text-sm font-bold text-white hover:bg-[#164e63] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50'
export const secondaryButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
