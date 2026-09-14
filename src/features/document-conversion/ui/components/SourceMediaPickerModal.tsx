import { useState } from 'react'
import { X, Check, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import type { SourceMedia, StepMediaRole, SopImportStep } from '../../model/documentConversionModel'

export interface SourceMediaPickerModalProps {
  mediaList?: SourceMedia[]
  availableMedia?: SourceMedia[]
  steps?: SopImportStep[]
  currentStepId?: string
  stepTitle?: string
  open?: boolean
  isOpen?: boolean
  onClose: () => void
  onAssign?: (selectedMedia: SourceMedia, role: StepMediaRole, caption?: string) => void
  onSelect?: (selectedMedia: SourceMedia, role: StepMediaRole, caption: string) => void
}

const roleLabels: Record<StepMediaRole, string> = {
  cover: 'Ảnh bìa (Cover)',
  illustration: 'Minh họa (Illustration)',
  screenshot: 'Ảnh chụp màn hình (Screenshot)',
  form: 'Biểu mẫu (Form)',
  diagram: 'Sơ đồ (Diagram)'
}

export function SourceMediaPickerModal({
  mediaList,
  availableMedia,
  steps = [],
  currentStepId,
  stepTitle,
  open,
  isOpen,
  onClose,
  onAssign,
  onSelect
}: SourceMediaPickerModalProps) {
  const isVisible = open ?? isOpen ?? true
  const list = availableMedia || mediaList || []
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(list[0]?.id ?? null)
  const [role, setRole] = useState<StepMediaRole>('illustration')
  const [caption, setCaption] = useState('')

  const selectedMedia = list.find(m => m.id === selectedMediaId)
  const currentStep = steps.find(s => s.id === currentStepId)
  const effectiveStepTitle = stepTitle || currentStep?.title || ''

  // Map each media to currently assigned step if any
  const mediaAssignmentMap = new Map<string, string>()
  for (const step of steps) {
    for (const sm of step.media ?? []) {
      if (sm.sourceMediaId) {
        mediaAssignmentMap.set(sm.sourceMediaId, step.title)
      }
    }
  }

  const handleConfirm = () => {
    if (!selectedMedia) return
    const finalCaption = caption.trim() || selectedMedia.caption || ''
    if (onSelect) {
      onSelect(selectedMedia, role, finalCaption)
    } else if (onAssign) {
      onAssign(selectedMedia, role, finalCaption)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chọn hình ảnh từ tài liệu nguồn"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] w-[95vw] max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-sky-400" />
            <h2 className="text-sm font-bold">Chọn hình ảnh từ tài liệu nguồn</h2>
            {effectiveStepTitle && (
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                Gắn vào: <span className="text-cyan-300 font-bold">{effectiveStepTitle}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Gallery Grid */}
          <div className="overflow-y-auto p-4">
            {list.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-slate-400">
                <ImageIcon className="size-10 opacity-30" />
                <p className="text-sm font-bold">Không tìm thấy hình ảnh nào trong tài liệu</p>
                <p className="text-xs text-slate-500">Tài liệu không có ảnh nhúng hoặc bạn có thể dùng tính năng cắt ảnh từ trang PDF.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {list.map(media => {
                  const isSelected = selectedMediaId === media.id
                  const assignedTo = mediaAssignmentMap.get(media.id)

                  return (
                    <div
                      key={media.id}
                      onClick={() => {
                        setSelectedMediaId(media.id)
                        if (media.caption) setCaption(media.caption)
                      }}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/50'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950'
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                        {media.previewUrl ? (
                          <img
                            src={media.previewUrl}
                            alt={media.caption || 'Thumbnail'}
                            className="size-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-slate-600">
                            <ImageIcon className="size-6" />
                          </div>
                        )}

                        {/* Page tag */}
                        {media.page && (
                          <span className="absolute left-1.5 top-1.5 rounded bg-slate-950/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-md">
                            Trang {media.page}
                          </span>
                        )}

                        {/* Selection check */}
                        {isSelected && (
                          <div className="absolute right-1.5 top-1.5 rounded-full bg-cyan-500 p-0.5 text-slate-950">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 text-left text-xs">
                        <p className="line-clamp-1 font-bold text-slate-200">
                          {media.caption || `Hình ảnh #${media.sortOrder}`}
                        </p>
                        {media.subPath && (
                          <p className="line-clamp-1 text-[10px] text-cyan-300">
                            {media.subPath}
                          </p>
                        )}
                        {assignedTo && (
                          <p className="mt-1 line-clamp-1 text-[10px] text-amber-400">
                            Đang gán: {assignedTo}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Config sidebar */}
          <div className="flex flex-col justify-between border-t border-slate-800 bg-slate-900 p-5 text-slate-200 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cấu hình gán vào bước
              </h3>

              {selectedMedia ? (
                <div className="space-y-3 text-xs">
                  <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950 aspect-video">
                    {selectedMedia.previewUrl && (
                      <img
                        src={selectedMedia.previewUrl}
                        alt="Selected"
                        className="size-full object-cover"
                      />
                    )}
                  </div>

                  <label className="block space-y-1">
                    <span className="font-bold text-slate-300">Vai trò trong bước này</span>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as StepMediaRole)}
                      className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      {Object.entries(roleLabels).map(([k, label]) => (
                        <option key={k} value={k}>{label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="font-bold text-slate-300">Chú thích hiển thị</span>
                    <input
                      type="text"
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                      placeholder={selectedMedia.caption || 'Nhập chú thích ảnh…'}
                      className="h-9 w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </label>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Vui lòng bấm chọn một hình ảnh từ danh sách bên trái.</p>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!selectedMedia}
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-cyan-500 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                Gán vào bước
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
