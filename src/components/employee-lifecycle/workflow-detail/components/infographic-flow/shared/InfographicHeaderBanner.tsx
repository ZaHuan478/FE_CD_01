import React from 'react'
import { FileText } from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { SopSubProcess } from '../../../types'

interface InfographicHeaderBannerProps {
  sopCode: string
  process?: SopSubProcess
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

const getContentKind = (process?: SopSubProcess) => {
  if (!process) return 'overview'
  if (process.sopCategory === 'Danh mục dùng chung') return 'catalog'
  if (process.sopCategory === 'Chức năng quản lý danh mục') return 'function'
  return process.steps.length > 0 ? 'process' : 'overview'
}

export const InfographicHeaderBanner: React.FC<InfographicHeaderBannerProps> = ({
  sopCode,
  process,
  isDarkMode,
  onOpenWireframe
}) => {
  const { language } = useLanguage()
  const contentKind = getContentKind(process)

  const contextLabel = language === 'vi'
    ? contentKind === 'catalog'
      ? 'CHI TIẾT DANH MỤC'
      : contentKind === 'function'
        ? 'CHI TIẾT CHỨC NĂNG'
        : contentKind === 'process'
          ? 'CHI TIẾT QUY TRÌNH'
          : 'TỔNG QUAN NỘI DUNG'
    : contentKind === 'catalog'
      ? 'CATALOG DETAIL'
      : contentKind === 'function'
        ? 'FUNCTION DETAIL'
        : contentKind === 'process'
          ? 'PROCESS DETAIL'
          : 'CONTENT OVERVIEW'

  const subtitleText = language === 'vi'
    ? contentKind === 'catalog'
      ? 'Xem phạm vi áp dụng, loại dữ liệu và các thông tin cần khai báo.'
      : contentKind === 'function'
        ? 'Xem đầu vào, người thực hiện, kết quả và quy tắc xử lý.'
        : contentKind === 'process'
          ? 'Chọn từng bước để xem mô tả yêu cầu, người thực hiện, nơi thực hiện và thời điểm.'
          : 'Nội dung này chưa có các bước thao tác được mô tả riêng.'
    : contentKind === 'catalog'
      ? 'Review scope, data type, and required fields.'
      : contentKind === 'function'
        ? 'Review inputs, owner, outputs, and processing rules.'
        : contentKind === 'process'
          ? 'Select a step to review its requirement, owner, location, and timing.'
          : 'This item does not currently contain separately documented steps.'

  return (
    <div className={`relative overflow-hidden rounded-lg border p-5 shadow-sm sm:p-6 ${
      isDarkMode
        ? 'border-slate-800 bg-slate-900 text-white'
        : 'border-slate-300 bg-white text-slate-900'
    }`}>
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-extrabold text-[#1f5f86] dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
              {contextLabel}
            </span>
            <span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {process?.sopCode || sopCode}
            </span>
          </div>

          <h2 className="text-base font-black leading-snug tracking-tight sm:text-xl">
            {process?.sopTitle || sopCode}
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
            {subtitleText}
          </p>
        </div>

        {onOpenWireframe && (
          <button
            type="button"
            onClick={onOpenWireframe}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <FileText className="h-4 w-4" />
            <span>{language === 'vi' ? 'Mở màn hình mẫu' : 'Open sample screen'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
