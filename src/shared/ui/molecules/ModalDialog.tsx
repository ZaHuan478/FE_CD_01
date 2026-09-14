import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function ModalDialog({ title, description, onClose, children, maxWidthClass = 'max-w-lg' }: { title: string; description?: string; onClose: () => void; children: ReactNode; maxWidthClass?: string }) {
  const titleId = useId()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`max-h-[90dvh] w-full ${maxWidthClass} overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900`}>
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id={titleId} className="text-lg font-black">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div><button type="button" onClick={onClose} aria-label="Đóng hộp thoại" className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="size-4" /></button></div>
      {children}
    </div>
  </div>
}
