/* oxlint-disable react/only-export-components */
import React from 'react'
import {
  ArrowRight,
  Bot,
  ClipboardList,
  Clock,
  FileUp,
  Layers,
  LockKeyhole,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target
} from 'lucide-react'
import type { SystemGuide } from '../model/systemGuideModel'

export interface UserIntentItem {
  id: string
  slug: string
  actionTitle: string
  description: string
  categoryBadge: string
  estimatedTime: string
  icon: typeof Search
  lockReasonFallback: string
}

export const defaultUserIntents: UserIntentItem[] = [
  {
    id: 'intent-search-sop',
    slug: 'thu-vien-quy-trinh',
    actionTitle: 'Tôi muốn tìm một quy trình',
    description: 'Tra cứu quy trình chuẩn đã công bố theo phân hệ và mã SOP.',
    categoryBadge: 'Tra cứu',
    estimatedTime: '1 phút',
    icon: Search,
    lockReasonFallback: 'Cần quyền đọc phân hệ liên quan'
  },
  {
    id: 'intent-my-documents',
    slug: 'tai-lieu-cua-toi',
    actionTitle: 'Tôi muốn lưu trữ tài liệu',
    description: 'Upload, xem trực tiếp PDF/DOCX và quản lý kho tài liệu cá nhân.',
    categoryBadge: 'Tài liệu',
    estimatedTime: '2 phút',
    icon: FileUp,
    lockReasonFallback: 'Cần quyền sop.read & ít nhất 1 phân hệ'
  },
  {
    id: 'intent-convert-sop',
    slug: 'chuyen-hoa-tai-lieu',
    actionTitle: 'Tôi muốn chuyển file thành SOP',
    description: 'Trích xuất nội dung từ PDF/DOCX, hiệu chỉnh bước và tạo lưu đồ.',
    categoryBadge: 'Chuyển hóa',
    estimatedTime: '3 phút',
    icon: Sparkles,
    lockReasonFallback: 'Yêu cầu quyền soạn thảo (sop.create)'
  },
  {
    id: 'intent-view-flowchart',
    slug: 'xem-luu-do-va-canvas-sop',
    actionTitle: 'Tôi muốn xem quy trình trực quan',
    description: 'Xem luồng nghiệp vụ, vai trò thực hiện và nội dung chi tiết của từng bước.',
    categoryBadge: 'Trực quan',
    estimatedTime: '2 phút',
    icon: Layers,
    lockReasonFallback: 'Cần quyền đọc quy trình'
  },
  {
    id: 'intent-compliance',
    slug: 'quy-dinh-tuan-thu',
    actionTitle: 'Tôi muốn tra cứu quy định',
    description: 'Đọc các chính sách, quy chế áp dụng toàn công ty và xác nhận đã đọc.',
    categoryBadge: 'Tuân thủ',
    estimatedTime: '1 phút',
    icon: ShieldCheck,
    lockReasonFallback: 'Cần tài khoản đã đăng nhập'
  },
  {
    id: 'intent-ai-assistant',
    slug: 'tro-ly-ai-sop',
    actionTitle: 'Tôi muốn hỏi trợ lý AI',
    description: 'Đặt câu hỏi bằng ngôn ngữ tự nhiên, nhận câu trả lời có trích dẫn SOP.',
    categoryBadge: 'Trợ lý AI',
    estimatedTime: '1 phút',
    icon: Bot,
    lockReasonFallback: 'Cần quyền đọc phân hệ liên quan'
  },
  {
    id: 'intent-manage-sops',
    slug: 'quan-ly-vong-doi-sop',
    actionTitle: 'Tôi muốn quản lý & duyệt SOP',
    description: 'Soạn thảo, gửi thẩm định, phê duyệt và công bố phiên bản SOP mới.',
    categoryBadge: 'Vận hành',
    estimatedTime: '3 phút',
    icon: ClipboardList,
    lockReasonFallback: 'Yêu cầu quyền Quản lý SOP (sop.edit)'
  },
  {
    id: 'intent-administration',
    slug: 'quan-tri-he-thong',
    actionTitle: 'Tôi muốn quản trị hệ thống',
    description: 'Cấu hình người dùng, phân quyền, danh mục chuẩn và chỉ mục AI.',
    categoryBadge: 'Quản trị',
    estimatedTime: '3 phút',
    icon: Settings,
    lockReasonFallback: 'Chỉ dành cho Quản trị viên (ADMIN)'
  }
]

interface UserIntentGridProps {
  guides: SystemGuide[]
  onSelectGuide: (slug: string) => void
  className?: string
}

export const UserIntentGrid: React.FC<UserIntentGridProps> = ({
  guides,
  onSelectGuide,
  className = ''
}) => {
  return (
    <section
      data-help-id="guide-task-shortcuts"
      className={`space-y-4 ${className}`}
    >
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950/60 dark:text-cyan-300">
            <Target className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-black text-slate-950 dark:text-white">
              Tôi muốn...
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chọn mục tiêu gần nhất với công việc bạn cần hoàn thành ngay lúc này
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {defaultUserIntents.map((intent) => {
          const guide = guides.find((g) => g.slug === intent.slug)
          const isAvailable = guide ? guide.available : false
          const Icon = intent.icon

          // Determine lock explanation
          let lockExplanation = ''
          if (!isAvailable) {
            if (guide?.requiredPermission) {
              lockExplanation = `Cần quyền: ${guide.requiredPermission}`
            } else if (guide?.audienceMode === 'ADMIN') {
              lockExplanation = 'Chỉ dành cho Quản trị viên'
            } else {
              lockExplanation = intent.lockReasonFallback
            }
          }

          return (
            <div
              key={intent.id}
              className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                isAvailable
                  ? 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700'
                  : 'border-slate-200/70 bg-slate-50/60 dark:border-slate-800/70 dark:bg-slate-900/40 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Card Top: Icon, Badge, Lock status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`grid size-9 place-items-center rounded-lg ${
                      isAvailable
                        ? 'bg-cyan-50 text-[#155e75] dark:bg-cyan-950/50 dark:text-cyan-300'
                        : 'bg-slate-200/60 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {intent.categoryBadge}
                    </span>
                    {!isAvailable && (
                      <span
                        className="grid size-5 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        title={lockExplanation}
                      >
                        <LockKeyhole className="size-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white leading-snug">
                  {intent.actionTitle}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
                  {intent.description}
                </p>

                {/* Lock explanation badge if locked */}
                {!isAvailable && (
                  <div className="mt-2.5 flex items-center gap-1 rounded-md bg-amber-50/80 px-2 py-1 text-[11px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    <LockKeyhole className="size-3 shrink-0" />
                    <span className="truncate">{lockExplanation}</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Estimated Time & Action Button */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <Clock className="size-3" />
                  {intent.estimatedTime}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectGuide(intent.slug)}
                  className={`inline-flex items-center gap-1 text-xs font-black transition ${
                    isAvailable
                      ? 'text-[#155e75] hover:text-[#164e63] dark:text-cyan-300 dark:hover:text-cyan-200 group-hover:translate-x-0.5'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{isAvailable ? 'Xem hướng dẫn' : 'Chi tiết điều kiện'}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
