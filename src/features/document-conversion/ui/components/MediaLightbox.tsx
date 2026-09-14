import { useCallback, useEffect } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import type { SourceMedia } from '../../model/documentConversionModel'

export interface MediaLightboxProps {
  isOpen?: boolean
  imageUrl?: string
  media?: SourceMedia | null
  caption?: string
  sourcePage?: number
  subPath?: string
  role?: string
  allMedia?: SourceMedia[]
  onClose: () => void
  onSelectMedia?: (media: SourceMedia) => void
}

const roleLabels: Record<string, string> = {
  cover: 'Ảnh bìa',
  illustration: 'Minh họa',
  screenshot: 'Ảnh chụp màn hình',
  form: 'Biểu mẫu',
  diagram: 'Sơ đồ'
}

export function MediaLightbox({
  isOpen,
  imageUrl,
  media,
  caption,
  sourcePage,
  subPath,
  role,
  allMedia,
  onClose,
  onSelectMedia
}: MediaLightboxProps) {
  const isVisible = isOpen ?? Boolean(media || imageUrl)
  const displayUrl = media?.previewUrl || imageUrl || ''
  const displayCaption = media?.caption || caption || ''
  const displayPage = media?.page ?? sourcePage
  const displaySubPath = media?.subPath ?? subPath
  const displayRole = role || (media?.kind ? roleLabels[media.kind] : undefined)

  const currentIndex = allMedia && media ? allMedia.findIndex(m => m.id === media.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = allMedia ? currentIndex >= 0 && currentIndex < allMedia.length - 1 : false

  const handlePrev = useCallback(() => {
    if (hasPrev && allMedia && onSelectMedia) {
      onSelectMedia(allMedia[currentIndex - 1]!)
    }
  }, [hasPrev, allMedia, onSelectMedia, currentIndex])

  const handleNext = useCallback(() => {
    if (hasNext && allMedia && onSelectMedia) {
      onSelectMedia(allMedia[currentIndex + 1]!)
    }
  }, [hasNext, allMedia, onSelectMedia, currentIndex])

  useEffect(() => {
    if (!isVisible) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) handlePrev()
      else if (e.key === 'ArrowRight' && hasNext) handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, onClose, hasPrev, hasNext, handlePrev, handleNext])

  if (!isVisible || !displayUrl) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh lớn"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 text-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            {displayRole && (
              <span className="rounded-md bg-sky-500/20 px-2 py-0.5 text-sky-300 font-bold">
                {roleLabels[displayRole] || displayRole}
              </span>
            )}
            {displayPage && <span>Trang {displayPage}</span>}
            {displaySubPath && <span className="text-slate-400">· {displaySubPath}</span>}
            {allMedia && allMedia.length > 1 && currentIndex >= 0 && (
              <span className="text-slate-500 text-[11px]">({currentIndex + 1}/{allMedia.length})</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={displayUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              title="Mở ảnh gốc trong tab mới"
            >
              <ZoomIn className="size-3.5" />
              Mở tab mới
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Image Content with Prev/Next Navigation */}
        <div className="relative flex max-h-[75vh] items-center justify-center overflow-auto bg-slate-950 p-4">
          {hasPrev && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-lg cursor-pointer"
              title="Ảnh trước"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <img
            src={displayUrl}
            alt={displayCaption || 'Ảnh minh họa'}
            className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-md"
          />

          {hasNext && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-lg cursor-pointer"
              title="Ảnh tiếp theo"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>

        {/* Caption Footer */}
        {displayCaption && (
          <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 text-center text-xs font-medium text-slate-300">
            {displayCaption}
          </div>
        )}
      </div>
    </div>
  )
}
