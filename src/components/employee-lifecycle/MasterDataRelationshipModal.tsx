/**
 * MasterDataRelationshipModal.tsx
 *
 * Wrapper modal cho MasterDataRelationshipView.
 * Giữ nguyên interface để không ảnh hưởng các import hiện có.
 * Nội dung được refactor sang MasterDataRelationshipView (mode="modal").
 */
import React, { useEffect } from 'react'
import { X, Network } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { MasterDataRelationshipView } from './master-data-hub/MasterDataRelationshipView'

interface MasterDataRelationshipModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectNode?: (id: string) => void
}

export const MasterDataRelationshipModal: React.FC<MasterDataRelationshipModalProps> = ({
  isOpen,
  onClose,
  onSelectNode
}) => {
  const { language } = useLanguage()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-md">
      <div
        className="bg-slate-900 text-slate-100 rounded-2xl sm:rounded-3xl border border-slate-700/60 shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[92vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={language === 'vi' ? 'Bản đồ quan hệ dữ liệu Master Data' : 'Master Data Relationship Map'}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Network className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60 uppercase tracking-wider">
                  Master Data
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {language === 'vi'
                  ? 'BẢN ĐỒ QUAN HỆ DỮ LIỆU MASTER DATA'
                  : 'MASTER DATA RELATIONSHIP MAP'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-950/60">
          <MasterDataRelationshipView
            isDarkMode={true}
            mode="modal"
            onSelectCatalog={(id) => {
              onSelectNode?.(id)
              onClose()
            }}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Mối quan hệ dữ liệu được cấu hình theo mô hình Enterprise HRMS SaaS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Đóng (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}
