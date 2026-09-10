import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastItem, ToastVariant } from './toast.types'

interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

const variantConfig: Record<
  ToastVariant,
  {
    icon: typeof CheckCircle2
    containerClass: string
    iconClass: string
    titleClass: string
    defaultTitle: string
  }
> = {
  success: {
    icon: CheckCircle2,
    containerClass:
      'border-emerald-200/80 bg-white/95 text-slate-900 shadow-lg shadow-emerald-950/5 ring-1 ring-emerald-500/10 dark:border-emerald-800/60 dark:bg-slate-900/95 dark:text-slate-100 dark:ring-emerald-500/20',
    iconClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    titleClass: 'text-emerald-900 dark:text-emerald-200',
    defaultTitle: 'Thành công'
  },
  error: {
    icon: AlertCircle,
    containerClass:
      'border-rose-200/80 bg-white/95 text-slate-900 shadow-lg shadow-rose-950/5 ring-1 ring-rose-500/10 dark:border-rose-800/60 dark:bg-slate-900/95 dark:text-slate-100 dark:ring-rose-500/20',
    iconClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
    titleClass: 'text-rose-900 dark:text-rose-200',
    defaultTitle: 'Lỗi'
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      'border-amber-200/80 bg-white/95 text-slate-900 shadow-lg shadow-amber-950/5 ring-1 ring-amber-500/10 dark:border-amber-800/60 dark:bg-slate-900/95 dark:text-slate-100 dark:ring-amber-500/20',
    iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    titleClass: 'text-amber-900 dark:text-amber-200',
    defaultTitle: 'Cảnh báo'
  },
  info: {
    icon: Info,
    containerClass:
      'border-cyan-200/80 bg-white/95 text-slate-900 shadow-lg shadow-cyan-950/5 ring-1 ring-[#155e75]/10 dark:border-cyan-800/60 dark:bg-slate-900/95 dark:text-slate-100 dark:ring-cyan-500/20',
    iconClass: 'text-[#155e75] dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60',
    titleClass: 'text-cyan-950 dark:text-cyan-200',
    defaultTitle: 'Thông tin'
  }
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null

  const hasError = toasts.some(t => t.variant === 'error')

  return (
    <aside
      aria-label="Thông báo hệ thống"
      aria-live={hasError ? 'assertive' : 'polite'}
      className="pointer-events-none fixed top-4 inset-x-4 z-[9999] flex flex-col gap-2.5 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-md"
    >
      {toasts.map((toast) => {
        const config = variantConfig[toast.variant]
        const IconComponent = config.icon
        const isError = toast.variant === 'error'

        return (
          <div
            key={toast.id}
            role={isError ? 'alert' : 'status'}
            className={`pointer-events-auto relative flex items-start gap-3 rounded-xl border p-3.5 backdrop-blur-md transition-all duration-200 ease-out motion-reduce:transition-none ${config.containerClass}`}
          >
            <div className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${config.iconClass}`}>
              <IconComponent className="size-4.5" />
            </div>

            <div className="min-w-0 flex-1 pr-1 pt-0.5">
              {toast.title && (
                <h4 className={`text-xs font-bold leading-tight ${config.titleClass}`}>
                  {toast.title}
                </h4>
              )}
              <p
                className={`text-xs leading-relaxed text-slate-700 dark:text-slate-300 ${
                  toast.title ? 'mt-1' : 'font-medium'
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Đóng thông báo"
              className="mt-0.5 inline-grid size-6 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155e75] dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </aside>
  )
}
