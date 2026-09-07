import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'

interface SelectProps extends ComponentProps<'select'> {
  visualSize?: 'default' | 'compact'
}

export function Select({ className = '', visualSize = 'default', children, multiple, ...props }: SelectProps) {
  const height = visualSize === 'compact' ? 'h-9 text-xs' : 'h-11 text-sm'
  return <span className="relative block min-w-0">
    <select
      {...props}
      multiple={multiple}
      className={`w-full rounded-xl border border-slate-300 bg-white px-3 font-semibold text-slate-800 shadow-sm outline-none transition-colors focus-visible:border-[#155e75] focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-cyan-900 ${height} ${multiple ? 'appearance-auto py-2' : 'appearance-none pr-10'} ${className}`}
    >{children}</select>
    {!multiple && <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />}
  </span>
}
