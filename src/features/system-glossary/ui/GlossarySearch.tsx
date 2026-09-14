import React, { useEffect, useRef } from 'react'

interface GlossarySearchProps {
  value: string
  onChange: (value: string) => void
  totalResults: number
  placeholder?: string
}

export const GlossarySearch: React.FC<GlossarySearchProps> = ({
  value,
  onChange,
  totalResults,
  placeholder = 'Tìm thuật ngữ, bí danh, quy trình hoặc nội dung giải thích... (Nhấn / để tìm)'
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Tìm kiếm thuật ngữ"
          className="w-full pl-11 pr-24 py-3.5 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm font-medium"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800">
              /
            </kbd>
          )}

          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-2">
            {totalResults} từ
          </span>
        </div>
      </div>
    </div>
  )
}
