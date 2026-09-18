import { useState } from 'react'
import {
  UserCheck,
  MapPin,
  Clock,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn,
  Star,
  BookOpen,
  ArrowRight,
  Inbox,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import type { SopSubProcess, SopSubStep } from '../../../../entities/sop/model/types'
import { selectStepTypeCode } from '../../../../entities/sop/lib/workflowSelectors'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'
import { MediaLightbox } from '../../../document-conversion/ui/components/MediaLightbox'
import type { SourceMedia } from '../../../document-conversion/model/documentConversionModel'
import { FullSopGuideModal } from './FullSopGuideModal'

interface UniversalStepDetailCanvasProps {
  step?: SopSubStep
  stepIdx: number
  totalSteps: number
  onPreviousStep: () => void
  onNextStep: () => void
  isDarkMode: boolean
  process?: SopSubProcess
  onOpenFullGuide?: () => void
}

const roleLabels: Record<string, string> = {
  cover: 'Ảnh bìa',
  illustration: 'Minh họa',
  screenshot: 'Chụp màn hình',
  form: 'Biểu mẫu',
  diagram: 'Sơ đồ'
}

export const UniversalStepDetailCanvas: React.FC<UniversalStepDetailCanvasProps> = ({
  step,
  stepIdx,
  totalSteps,
  onPreviousStep,
  onNextStep,
  isDarkMode,
  process,
  onOpenFullGuide
}) => {
  const { language } = useLanguage()
  const [selectedLightboxMedia, setSelectedLightboxMedia] = useState<SourceMedia | null>(null)
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false)
  const [isChecklistExpanded, setIsChecklistExpanded] = useState<boolean>(true)
  const [isMediaExpanded, setIsMediaExpanded] = useState<boolean>(true)

  if (!step) {
    return null
  }

  const typeStyle = selectStepTypeCode(step)
  const hasChecklist = Boolean(step.fieldsChecklist && step.fieldsChecklist.length > 0)
  const hasMedia = Boolean((step.media && step.media.length > 0) || step.imageUrl)

  const mediaList: SourceMedia[] = (step.media ?? []).map(m => ({
    id: m.id,
    kind: 'embedded_image',
    page: m.sourcePage,
    subPath: m.sourceSubPath,
    storageKey: m.storageKey || '',
    previewUrl: m.url,
    mimeType: 'image/png',
    checksum: '',
    caption: m.caption,
    sortOrder: m.sortOrder,
    confidence: 1,
    assignmentStatus: 'assigned'
  }))

  if (mediaList.length === 0 && step.imageUrl) {
    mediaList.push({
      id: 'legacy-image',
      kind: 'embedded_image',
      storageKey: '',
      previewUrl: step.imageUrl,
      mimeType: 'image/png',
      checksum: '',
      caption: step.title,
      sortOrder: 1,
      confidence: 1,
      assignmentStatus: 'assigned'
    })
  }

  // 1. Next Step Resolution
  const nextStep = process?.steps && stepIdx < totalSteps - 1 ? process.steps[stepIdx + 1] : null

  // 2. Condition Resolution (Extract from data, do not invent)
  const approvalItem = process?.approvalFlow?.find(a => a.order === stepIdx + 1)
  const explicitCondition = step.condition || approvalItem?.condition
  const relatedRule = process?.rules?.[stepIdx] || (stepIdx === 0 ? process?.rules?.[0] : undefined)

  // 3. Inputs Resolution (Extract from step data only, do not guess or distribute from process)
  const stepInputs: string[] = []
  if (Array.isArray(step.inputs)) {
    step.inputs.forEach(inp => {
      const name = typeof inp === 'string' ? inp.trim() : inp?.name?.trim()
      if (name) stepInputs.push(name)
    })
  }

  // 4. Outputs Resolution (Extract from step data only, do not guess or distribute from process)
  const stepOutputs: string[] = []
  if (Array.isArray(step.outputs)) {
    step.outputs.forEach(out => {
      const name = typeof out === 'string' ? out.trim() : out?.name?.trim()
      if (name) stepOutputs.push(name)
    })
  }

  const handleOpenGuide = () => {
    if (onOpenFullGuide) {
      onOpenFullGuide()
    } else {
      setIsGuideModalOpen(true)
    }
  }

  // Fallback process for drawer if not passed
  const effectiveProcess: SopSubProcess = process || {
    sopCode: step.stepCode || 'SOP-DETAIL',
    sopTitle: step.title,
    sopCategory: 'Quy trình chuẩn hóa',
    description: step.description || '',
    steps: [step],
    inputs: stepInputs,
    outputs: stepOutputs
  }

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-5 transition-colors duration-200 animate-fadeIn ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Top Banner: Step Identity & Navigation Controls + Full SOP Button (Layer 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Friendly Step Number (No technical STEP-01) */}
          <span className="px-3 py-1 bg-[#1f5f86] text-white font-bold text-xs rounded-xl shadow-2xs">
            Bước {stepIdx + 1}
          </span>

          {/* Friendly Action Nature (No technical [N], [A]) */}
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${typeStyle.bgLight} ${typeStyle.bgDark} ${typeStyle.textLight} ${typeStyle.textDark} ${typeStyle.borderLight} ${typeStyle.borderDark}`}
          >
            {typeStyle.label}
          </span>

          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {step.title}
          </h3>
        </div>

        {/* Action Buttons: Step Navigator + Layer 3 Full Guide Button */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center flex-wrap">
          {/* LAYER 3 TRIGGER: Button to view full SOP / Guide */}
          <button
            type="button"
            onClick={handleOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1f5f86] to-[#155e75] text-white text-xs font-bold shadow-xs hover:from-[#184b6a] hover:to-[#0e485b] transition-all cursor-pointer"
            title="Xem toàn văn hướng dẫn quy trình và quy định chi tiết"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Xem hướng dẫn/SOP đầy đủ</span>
          </button>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={onPreviousStep}
              className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">{language === 'vi' ? 'Trước' : 'Prev'}</span>
            </button>

            <span className="text-xs font-bold font-mono px-1.5 text-slate-500 dark:text-slate-400">
              {stepIdx + 1} / {totalSteps}
            </span>

            <button
              type="button"
              disabled={stepIdx >= totalSteps - 1}
              onClick={onNextStep}
              className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Bước tiếp theo"
            >
              <span className="hidden md:inline">{language === 'vi' ? 'Tiếp' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LAYER 2: 7 OPERATIONAL ATTRIBUTES (LƯỚI THÔNG TIN CHI TIẾT NGHIỆP VỤ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Người thực hiện & Kênh xử lý */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <UserCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>1. Người thực hiện</span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {step.actor || <span className="text-slate-400 dark:text-slate-500 italic font-normal">Chưa được khai báo</span>}
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{step.location || <span className="italic">Chưa được khai báo</span>}</span>
            </div>
          </div>
        </div>

        {/* 2. Dữ liệu đầu vào (Inputs) */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Inbox className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>2. Đầu vào cần chuẩn bị</span>
          </div>

          <div className="space-y-1 text-xs">
            {stepInputs.length > 0 ? (
              stepInputs.map((inp, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{inp}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                Chưa được khai báo
              </p>
            )}
          </div>
        </div>

        {/* 3. SLA & Thời điểm */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>3. Thời gian thực hiện (SLA)</span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {step.timing || <span className="text-slate-400 dark:text-slate-500 italic font-normal">Chưa được khai báo</span>}
            </p>
          </div>
        </div>

        {/* 4. Điều kiện & Ràng buộc chuyển tiếp (Không tự tạo nhánh giả) */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>4. Điều kiện thực hiện</span>
          </div>

          <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {explicitCondition ? (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                {explicitCondition}
              </div>
            ) : relatedRule ? (
              <p className="leading-snug">
                <span className="font-semibold text-slate-900 dark:text-white">Quy chuẩn: </span>
                {relatedRule}
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                Theo luồng tuần tự tiêu chuẩn (Không có điều kiện rẽ nhánh)
              </p>
            )}
          </div>
        </div>

        {/* 5. Đầu ra bàn giao (Outputs) */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>5. Kết quả đầu ra (Outputs)</span>
          </div>

          <div className="space-y-1 text-xs">
            {stepOutputs.length > 0 ? (
              stepOutputs.map((out, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500 font-bold mt-0.5">•</span>
                  <span className="leading-snug">{out}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">
                Chưa được khai báo
              </p>
            )}
          </div>
        </div>

        {/* 6. Bước tiếp theo (Next Step & Transition) */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>6. Bước tiếp theo</span>
          </div>

          <div className="space-y-1 text-xs">
            {nextStep ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                    Bước {stepIdx + 2}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {nextStep.title}
                  </p>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Phụ trách: <span className="font-semibold text-slate-700 dark:text-slate-300">{nextStep.actor || 'Người thực hiện'}</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất quy trình & Bàn giao hồ sơ</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. Checklist Thao tác chi tiết (Checklist thao tác của trạm) */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 transition-all ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div
          onClick={() => setIsChecklistExpanded(prev => !prev)}
          className="flex items-center justify-between flex-wrap gap-2 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsChecklistExpanded(prev => !prev) } }}
        >
          <div className="flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              7. Checklist thao tác chi tiết (Bước {stepIdx + 1})
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              {hasChecklist ? `${step.fieldsChecklist!.length} thao tác cần thực hiện` : 'Thao tác chuẩn'}
            </span>
            <button
              type="button"
              className={`p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 transition-transform duration-200 cursor-pointer inline-flex items-center justify-center ${
                isChecklistExpanded ? 'rotate-180' : ''
              }`}
              aria-expanded={isChecklistExpanded}
              title={isChecklistExpanded ? 'Thu gọn' : 'Mở rộng'}
              aria-label={isChecklistExpanded ? 'Thu gọn' : 'Mở rộng'}
              onClick={(e) => { e.stopPropagation(); setIsChecklistExpanded(prev => !prev) }}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isChecklistExpanded && (
          hasChecklist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1 animate-fadeIn">
              {step.fieldsChecklist!.map((field, idx) => (
                <div
                  key={`${field}-${idx}`}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all hover:shadow-xs ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-600'
                      : 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-slate-400'
                  }`}
                >
                  <span className="shrink-0 mt-0.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700">
                    #{idx + 1}
                  </span>

                  <div className="min-w-0 space-y-0.5">
                    <span className="font-semibold block leading-snug">
                      {field}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">
                      Tiêu chí kiểm soát hoàn tất
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-xl border text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-2 ${
                isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200/60'
              }`}
            >
              <span className="text-slate-500 font-bold">○</span>
              <span>
                Thực hiện tuần tự theo quy chuẩn nghiệp vụ của biểu mẫu và tài liệu hướng dẫn.
              </span>
            </div>
          )
        )}
      </div>

      {/* Media Gallery / Hình ảnh minh họa & Giao diện thao tác */}
      {hasMedia && (
        <div
          className={`p-4 rounded-xl border space-y-3 transition-all ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div
            onClick={() => setIsMediaExpanded(prev => !prev)}
            className="flex items-center justify-between cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsMediaExpanded(prev => !prev) } }}
          >
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Hình ảnh minh họa & Giao diện thao tác</span>
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {mediaList.length}
              </span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Bấm vào ảnh để phóng to
              </span>
              <button
                type="button"
                className={`p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 transition-transform duration-200 cursor-pointer inline-flex items-center justify-center ${
                  isMediaExpanded ? 'rotate-180' : ''
                }`}
                aria-expanded={isMediaExpanded}
                title={isMediaExpanded ? 'Thu gọn' : 'Mở rộng'}
                aria-label={isMediaExpanded ? 'Thu gọn' : 'Mở rộng'}
                onClick={(e) => { e.stopPropagation(); setIsMediaExpanded(prev => !prev) }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isMediaExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 animate-fadeIn">
            {mediaList.map((m, idx) => {
              const originalStepMedia = step.media?.find(sm => sm.id === m.id)
              const role = originalStepMedia?.role || (idx === 0 ? 'cover' : 'illustration')
              const isCover = role === 'cover'

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedLightboxMedia(m)}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-600'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    {m.previewUrl ? (
                      <img
                        src={m.previewUrl}
                        alt={m.caption || step.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-bold text-white shadow">
                        <ZoomIn className="w-3.5 h-3.5" /> Xem lớn
                      </span>
                    </div>
                    {isCover && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-xs font-bold text-white shadow">
                        <Star className="w-3 h-3 fill-white" /> Ảnh bìa
                      </span>
                    )}
                    {role && !isCover && (
                      <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-xs font-semibold text-slate-200">
                        {roleLabels[role] || role}
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {m.caption || step.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      {m.page ? <span>Trang {m.page}</span> : <span />}
                      {m.subPath && <span className="truncate max-w-[60%]">{m.subPath}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <MediaLightbox
        media={selectedLightboxMedia}
        onClose={() => setSelectedLightboxMedia(null)}
        allMedia={mediaList}
        onSelectMedia={setSelectedLightboxMedia}
      />

      {/* LAYER 3: FULL SOP GUIDE MODAL */}
      <FullSopGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        process={effectiveProcess}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
