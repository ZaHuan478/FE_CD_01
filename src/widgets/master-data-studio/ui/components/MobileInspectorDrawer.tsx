import React, { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { CatalogViewModel } from '../../../../entities/master-data/model/masterDataCatalogAdapter'
import { DetailInspector } from './DetailInspector'

export interface MobileInspectorDrawerProps {
  isDarkMode: boolean
  selectedCatalog: CatalogViewModel
  onClose: () => void
  subdued: string
}

export const MobileInspectorDrawer: React.FC<MobileInspectorDrawerProps> = ({
  isDarkMode,
  selectedCatalog,
  onClose,
  subdued
}) => {
  // Focus trap
  const drawerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    drawerRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[80] flex justify-end xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết: ${selectedCatalog.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={`
          relative z-10 w-full max-w-sm h-full overflow-y-auto flex flex-col
          ${isDarkMode ? 'bg-slate-900' : 'bg-white'}
        `}
      >
        <div
          className={`px-4 py-3 border-b flex items-center justify-between sticky top-0 z-10 ${
            isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Chi tiết danh mục
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1">
          <DetailInspector
            isDarkMode={isDarkMode}
            selectedCatalog={selectedCatalog}
            subdued={subdued}
          />
        </div>
      </div>
    </div>
  )
}
