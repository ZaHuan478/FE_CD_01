import { useState, useMemo } from 'react'
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  Eye,
  Star,
  Unlink,
  ExternalLink,
  RefreshCw,
  Crop,
  Layers,
  Search
} from 'lucide-react'
import type {
  SourceMedia,
  SopImportItem,
  SopImportPreview,
  StepMediaRole,
  StepMedia
} from '../../model/documentConversionModel'
import { MediaLightbox } from './MediaLightbox'
import { PdfCropModal } from './PdfCropModal'
import { useToast } from '../../../../shared/ui/toast'
import { getErrorMessage } from '../../../../shared/lib/errors/apiError'
import { sopImportApi } from '../../model/documentConversionModel'

export interface SourceMediaPanelProps {
  item: SopImportItem
  preview: SopImportPreview
  editable: boolean
  busy: string | null
  onPreview: (value: SopImportPreview) => void
  onSave: (preview?: SopImportPreview) => Promise<void>
  onReprocess: () => Promise<void>
}

type MediaFilter = 'all' | 'assigned' | 'unassigned' | 'ignored'

export function SourceMediaPanel({
  item,
  preview,
  editable,
  busy,
  onPreview,
  onSave,
  onReprocess: _onReprocess
}: SourceMediaPanelProps) {
  const toast = useToast()
  const [filter, setFilter] = useState<MediaFilter>('all')
  const [pageFilter, setPageFilter] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [reextracting, setReextracting] = useState(false)

  // Lightbox state
  const [lightboxMedia, setLightboxMedia] = useState<SourceMedia | null>(null)

  // Crop modal state
  const [cropTargetStepKey, setCropTargetStepKey] = useState<string | null>(null)

  const mediaList: SourceMedia[] = useMemo(() => preview.sourceStructure?.media ?? [], [preview.sourceStructure?.media])

  // Map each media to the step it is assigned to
  const mediaToStepMap = useMemo(() => {
    const map = new Map<string, { stepId: string; stepStableKey: string; stepTitle: string; role: StepMediaRole }>()
    for (const step of preview.steps) {
      for (const sm of step.media ?? []) {
        if (sm.sourceMediaId) {
          map.set(sm.sourceMediaId, {
            stepId: step.id,
            stepStableKey: step.stableKey,
            stepTitle: step.title,
            role: sm.role
          })
        }
      }
    }
    return map
  }, [preview.steps])

  // Distinct pages for page filter
  const availablePages = useMemo(() => {
    const pages = new Set<number>()
    for (const m of mediaList) {
      if (m.page) pages.add(m.page)
    }
    return Array.from(pages).sort((a, b) => a - b)
  }, [mediaList])

  // Filtered media list
  const filteredMedia = useMemo(() => {
    return mediaList.filter(m => {
      const assignedInfo = mediaToStepMap.get(m.id)
      const isAssigned = m.assignmentStatus === 'assigned' || !!assignedInfo
      const isIgnored = m.assignmentStatus === 'ignored'

      if (filter === 'assigned' && !isAssigned) return false
      if (filter === 'unassigned' && (isAssigned || isIgnored)) return false
      if (filter === 'ignored' && !isIgnored) return false

      if (pageFilter !== 'all' && m.page !== pageFilter) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchCaption = m.caption?.toLowerCase().includes(query)
        const matchSubPath = m.subPath?.toLowerCase().includes(query)
        const matchStep = assignedInfo?.stepTitle.toLowerCase().includes(query)
        if (!matchCaption && !matchSubPath && !matchStep) return false
      }

      return true
    })
  }, [mediaList, mediaToStepMap, filter, pageFilter, searchQuery])

  // Counts for tabs
  const counts = useMemo(() => {
    let assigned = 0
    let unassigned = 0
    let ignored = 0
    for (const m of mediaList) {
      const isAssigned = m.assignmentStatus === 'assigned' || mediaToStepMap.has(m.id)
      const isIgnored = m.assignmentStatus === 'ignored'
      if (isIgnored) ignored += 1
      else if (isAssigned) assigned += 1
      else unassigned += 1
    }
    return { all: mediaList.length, assigned, unassigned, ignored }
  }, [mediaList, mediaToStepMap])

  // Action: Assign to step
  const handleAssignToStep = (media: SourceMedia, targetStepStableKey: string) => {
    const updatedMediaList = mediaList.map(m => {
      if (m.id === media.id) {
        return { ...m, assignmentStatus: 'assigned' as const }
      }
      return m
    })

    const updatedSteps = preview.steps.map(step => {
      const isTarget = step.stableKey === targetStepStableKey
      const filtered = (step.media ?? []).filter(sm => sm.sourceMediaId !== media.id)

      if (isTarget) {
        const role: StepMediaRole = filtered.length === 0 ? 'cover' : 'illustration'
        const newStepMedia: StepMedia = {
          id: `smed-${Date.now()}`,
          sourceMediaId: media.id,
          storageKey: media.storageKey,
          url: media.previewUrl || `/api/v1/sop-imports/${item.id}/media/${media.id}/preview`,
          caption: media.caption,
          role,
          sourcePage: media.page,
          sourceSubPath: media.subPath,
          sortOrder: filtered.length + 1,
          confidence: media.confidence
        }
        filtered.push(newStepMedia)
        return {
          ...step,
          media: filtered,
          imageUrl: role === 'cover' ? newStepMedia.url : step.imageUrl
        }
      }

      return {
        ...step,
        media: filtered
      }
    })

    const nextPreview: SopImportPreview = {
      ...preview,
      steps: updatedSteps,
      sourceStructure: preview.sourceStructure
        ? { ...preview.sourceStructure, media: updatedMediaList }
        : undefined
    }

    onPreview(nextPreview)
    void onSave(nextPreview)
    toast.success('Đã gắn hình ảnh vào bước thành công!')
  }

  // Action: Unassign from step
  const handleUnassign = (media: SourceMedia) => {
    const updatedMediaList = mediaList.map(m => {
      if (m.id === media.id) {
        return { ...m, assignmentStatus: 'unassigned' as const }
      }
      return m
    })

    const updatedSteps = preview.steps.map(step => {
      const filtered = (step.media ?? []).filter(sm => sm.sourceMediaId !== media.id)
      const newCover = filtered.find(sm => sm.role === 'cover')
      return {
        ...step,
        media: filtered,
        imageUrl: newCover ? newCover.url : (step.imageUrl?.includes(media.id) ? null : step.imageUrl)
      }
    })

    const nextPreview: SopImportPreview = {
      ...preview,
      steps: updatedSteps,
      sourceStructure: preview.sourceStructure
        ? { ...preview.sourceStructure, media: updatedMediaList }
        : undefined
    }

    onPreview(nextPreview)
    void onSave(nextPreview)
    toast.info('Đã gỡ ảnh khỏi bước.')
  }

  // Action: Set as Cover
  const handleSetAsCover = (media: SourceMedia) => {
    const assignedInfo = mediaToStepMap.get(media.id)
    if (!assignedInfo) return

    const updatedSteps = preview.steps.map(step => {
      if (step.stableKey !== assignedInfo.stepStableKey) return step

      const updatedStepMedia = (step.media ?? []).map(sm => {
        if (sm.sourceMediaId === media.id) {
          return { ...sm, role: 'cover' as const }
        }
        return sm.role === 'cover' ? { ...sm, role: 'illustration' as const } : sm
      })

      const coverMedia = updatedStepMedia.find(sm => sm.role === 'cover')
      return {
        ...step,
        media: updatedStepMedia,
        imageUrl: coverMedia?.url || step.imageUrl
      }
    })

    const nextPreview: SopImportPreview = { ...preview, steps: updatedSteps }
    onPreview(nextPreview)
    void onSave(nextPreview)
    toast.success('Đã đặt làm ảnh bìa bước!')
  }

  // Action: Toggle Ignore
  const handleToggleIgnore = (media: SourceMedia) => {
    const isCurrentlyIgnored = media.assignmentStatus === 'ignored'
    const nextStatus: 'unassigned' | 'ignored' = isCurrentlyIgnored ? 'unassigned' : 'ignored'

    const updatedMediaList = mediaList.map(m => {
      if (m.id === media.id) {
        return { ...m, assignmentStatus: nextStatus }
      }
      return m
    })

    // If ignoring, also remove from any steps
    let updatedSteps = preview.steps
    if (!isCurrentlyIgnored) {
      updatedSteps = preview.steps.map(step => ({
        ...step,
        media: (step.media ?? []).filter(sm => sm.sourceMediaId !== media.id)
      }))
    }

    const nextPreview: SopImportPreview = {
      ...preview,
      steps: updatedSteps,
      sourceStructure: preview.sourceStructure
        ? { ...preview.sourceStructure, media: updatedMediaList }
        : undefined
    }

    onPreview(nextPreview)
    void onSave(nextPreview)
    toast.info(isCurrentlyIgnored ? 'Đã khôi phục ảnh.' : 'Đã chuyển ảnh vào danh sách bỏ qua.')
  }

  // Action: Re-extract media from document
  const handleReextract = async () => {
    try {
      setReextracting(true)
      const res = await sopImportApi.reextractMedia(item.id)
      onPreview(res.data.preview)
      toast.success('Đã trích xuất lại hình ảnh từ tài liệu thành công!')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lỗi khi trích xuất lại hình ảnh'))
    } finally {
      setReextracting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="size-4 text-sky-500" />
            Hình ảnh trích xuất từ tài liệu ({counts.all})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Các hình ảnh được trích xuất trực tiếp từ file nguồn kèm số trang và phân cấp ngữ cảnh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {editable && (
            <>
              {item.file.mediaType === 'application/pdf' && (
                <button
                  type="button"
                  onClick={() => setCropTargetStepKey(preview.steps[0]?.stableKey || null)}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200 cursor-pointer"
                >
                  <Crop className="size-3.5" />
                  Cắt ảnh từ PDF
                </button>
              )}

              <button
                type="button"
                disabled={reextracting || busy !== null}
                onClick={() => void handleReextract()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                title="Trích xuất lại toàn bộ hình ảnh mà không làm mất các chỉnh sửa bước"
              >
                <RefreshCw className={`size-3.5 ${reextracting ? 'animate-spin' : ''}`} />
                Trích xuất lại ảnh
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Filter status tabs */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('assigned')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition ${
              filter === 'assigned'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="size-3.5" />
            Đã gán ({counts.assigned})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unassigned')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition ${
              filter === 'unassigned'
                ? 'bg-amber-600 text-white'
                : 'text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40'
            }`}
          >
            <AlertCircle className="size-3.5" />
            Chưa gán ({counts.unassigned})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ignored')}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition ${
              filter === 'ignored'
                ? 'bg-slate-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <EyeOff className="size-3.5" />
            Bị bỏ qua ({counts.ignored})
          </button>
        </div>

        {/* Page filter and search input */}
        <div className="flex flex-wrap items-center gap-2">
          {availablePages.length > 1 && (
            <select
              value={pageFilter}
              onChange={e => setPageFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">Tất cả trang</option>
              {availablePages.map(page => (
                <option key={page} value={page}>Trang {page}</option>
              ))}
            </select>
          )}

          <div className="relative min-w-44 flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo chú thích, bước…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Media Cards Grid */}
      {filteredMedia.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
          <ImageIcon className="size-12 text-slate-300 dark:text-slate-700" />
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Không có hình ảnh phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">Hãy thử đổi bộ lọc hoặc dùng tính năng cắt ảnh từ file PDF.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedia.map(media => {
            const assignedInfo = mediaToStepMap.get(media.id)
            const isAssigned = !!assignedInfo || media.assignmentStatus === 'assigned'
            const isIgnored = media.assignmentStatus === 'ignored'
            const isCover = assignedInfo?.role === 'cover'

            return (
              <div
                key={media.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition-all hover:shadow-md dark:bg-slate-900 ${
                  isCover
                    ? 'border-amber-400/80 ring-2 ring-amber-400/20'
                    : isAssigned
                      ? 'border-emerald-300 dark:border-emerald-800'
                      : isIgnored
                        ? 'border-slate-200 opacity-60 dark:border-slate-800'
                        : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Thumbnail Container */}
                <div
                  className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setLightboxMedia(media)}
                  title="Bấm để xem ảnh lớn"
                >
                  {media.previewUrl ? (
                    <img
                      src={media.previewUrl}
                      alt={media.caption || 'Source Media'}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-slate-600">
                      <ImageIcon className="size-8" />
                    </div>
                  )}

                  {/* Top-Left: Page Tag */}
                  {media.page && (
                    <span className="absolute left-2.5 top-2.5 rounded-lg border border-white/20 bg-slate-950/70 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
                      Trang {media.page}
                    </span>
                  )}

                  {/* Top-Right: Role / Status Badge */}
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
                    {isCover && (
                      <span className="flex items-center gap-1 rounded-lg border border-amber-400/40 bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md">
                        <Star className="size-3 fill-current" />
                        Ảnh bìa
                      </span>
                    )}
                    {media.confidence && (
                      <span
                        className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md ${
                          media.confidence >= 0.85
                            ? 'border-emerald-400/30 bg-emerald-600/90 text-white'
                            : media.confidence >= 0.75
                              ? 'border-amber-400/30 bg-amber-600/90 text-white'
                              : 'border-slate-400/30 bg-slate-700/90 text-slate-200'
                        }`}
                        title={`Độ tin cậy gán tự động: ${Math.round(media.confidence * 100)}%`}
                      >
                        {Math.round(media.confidence * 100)}%
                      </span>
                    )}
                  </div>

                  {/* View Fullscreen overlay hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md shadow-lg">
                      <ExternalLink className="size-3.5" />
                      Xem ảnh lớn
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-between p-3.5 space-y-3">
                  <div className="space-y-1.5">
                    <p className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {media.caption || `Hình ảnh #${media.sortOrder}`}
                    </p>

                    {media.subPath && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#155e75] dark:text-cyan-300">
                        <Layers className="size-3 shrink-0" />
                        <span className="truncate">{media.subPath}</span>
                      </div>
                    )}

                    {assignedInfo ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-2 text-[11px] text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                        <div className="flex items-center gap-1 font-bold">
                          <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                          <span className="truncate">Gán: {assignedInfo.stepTitle}</span>
                        </div>
                      </div>
                    ) : isIgnored ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                        <span>Đã bị bỏ qua (Logo hoặc ảnh lặp lại)</span>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-2 text-[11px] text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                        <div className="flex items-center gap-1 font-bold">
                          <AlertCircle className="size-3 shrink-0 text-amber-600" />
                          <span>Chưa gán vào bước</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  {editable && (
                    <div className="space-y-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                      {/* Step selector dropdown */}
                      <div className="flex items-center gap-1">
                        <select
                          value={assignedInfo?.stepStableKey || ''}
                          onChange={e => {
                            if (e.target.value) {
                              handleAssignToStep(media, e.target.value)
                            } else {
                              handleUnassign(media)
                            }
                          }}
                          className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-medium text-slate-700 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="">-- Chọn bước gán --</option>
                          {preview.steps.map((step, sIdx) => (
                            <option key={step.stableKey} value={step.stableKey}>
                              #{sIdx + 1}: {step.title.slice(0, 30)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action buttons row */}
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        {isAssigned && !isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(media)}
                            className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40 cursor-pointer"
                            title="Đặt làm ảnh bìa cho bước này"
                          >
                            <Star className="size-3" />
                            Làm ảnh bìa
                          </button>
                        )}

                        {isAssigned && (
                          <button
                            type="button"
                            onClick={() => handleUnassign(media)}
                            className="flex items-center gap-1 rounded-md px-2 py-1 font-bold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40 cursor-pointer ml-auto"
                            title="Gỡ ảnh khỏi bước"
                          >
                            <Unlink className="size-3" />
                            Gỡ
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleIgnore(media)}
                          className="flex items-center gap-1 rounded-md px-2 py-1 font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                          title={isIgnored ? 'Khôi phục lại ảnh' : 'Bỏ qua ảnh này'}
                        >
                          {isIgnored ? (
                            <>
                              <Eye className="size-3" />
                              Khôi phục
                            </>
                          ) : (
                            <>
                              <EyeOff className="size-3" />
                              Bỏ qua
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <MediaLightbox
          isOpen={!!lightboxMedia}
          imageUrl={lightboxMedia.previewUrl || ''}
          caption={lightboxMedia.caption}
          sourcePage={lightboxMedia.page}
          subPath={lightboxMedia.subPath}
          role={mediaToStepMap.get(lightboxMedia.id)?.role}
          onClose={() => setLightboxMedia(null)}
        />
      )}

      {/* PDF Crop Modal */}
      {cropTargetStepKey && item?.id?.trim() ? (
        <PdfCropModal
          open={true}
          importId={item.id.trim()}
          targetStepStableKey={cropTargetStepKey}
          targetStepTitle={preview.steps.find(s => s.stableKey === cropTargetStepKey)?.title || 'Bước'}
          onClose={() => setCropTargetStepKey(null)}
          onCropSuccess={(newMedia, newStepMedia) => {
            const updatedMedia = [...mediaList, newMedia]
            const updatedSteps = preview.steps.map(s => {
              if (s.stableKey === cropTargetStepKey) {
                const list = [...(s.media ?? []), newStepMedia]
                return {
                  ...s,
                  media: list,
                  imageUrl: newStepMedia.role === 'cover' ? newStepMedia.url : s.imageUrl
                }
              }
              return s
            })
            const nextPreview: SopImportPreview = {
              ...preview,
              steps: updatedSteps,
              sourceStructure: preview.sourceStructure
                ? { ...preview.sourceStructure, media: updatedMedia }
                : undefined
            }
            onPreview(nextPreview)
            void onSave(nextPreview)
          }}
        />
      ) : null}
    </div>
  )
}
