import React from 'react'
import {
  AlertCircle,
  FileQuestion,
  RefreshCw,
  SearchX,
  ShieldAlert,
  X
} from 'lucide-react'

interface GuideEmptyStateProps {
  type: 'no-search-results' | 'api-error' | 'empty' | 'no-permissions'
  query?: string
  errorText?: string
  onResetSearch?: () => void
  onRetry?: () => void
  onViewAll?: () => void
  className?: string
}

export const GuideEmptyState: React.FC<GuideEmptyStateProps> = ({
  type,
  query,
  errorText,
  onResetSearch,
  onRetry,
  onViewAll,
  className = ''
}) => {
  if (type === 'api-error') {
    return (
      <div
        className={`rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-950 dark:bg-rose-950/25 ${className}`}
        role="alert"
      >
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="mt-3 text-base font-black text-rose-950 dark:text-rose-200">
          Không thể tải dữ liệu hướng dẫn
        </h3>
        <p className="mt-1 text-xs text-rose-800 dark:text-rose-300 max-w-md mx-auto">
          {errorText || 'Đã có lỗi xảy ra khi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền và thử lại.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm active:translate-y-px"
          >
            <RefreshCw className="size-3.5" />
            Thử tải lại
          </button>
        )}
      </div>
    )
  }

  if (type === 'no-search-results') {
    return (
      <div
        className={`rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 ${className}`}
      >
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <SearchX className="size-6" />
        </div>
        <h3 className="mt-3 text-base font-black text-slate-950 dark:text-white">
          Không tìm thấy hướng dẫn phù hợp
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Không có kết quả nào cho từ khóa{' '}
          {query && <strong className="text-slate-900 dark:text-white">"{query}"</strong>}.
          Thử tìm bằng từ khóa tổng quát hơn hoặc chuyển sang xem toàn bộ hệ thống.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {onResetSearch && (
            <button
              type="button"
              onClick={onResetSearch}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <X className="size-3.5" />
              Xóa từ khóa tìm kiếm
            </button>
          )}

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#155e75] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#164e63]"
            >
              Xem tất cả chức năng
            </button>
          )}
        </div>
      </div>
    )
  }

  if (type === 'no-permissions') {
    return (
      <div
        className={`rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center dark:border-amber-900/60 dark:bg-amber-950/20 ${className}`}
      >
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <ShieldAlert className="size-6" />
        </div>
        <h3 className="mt-3 text-base font-black text-amber-950 dark:text-amber-200">
          Chưa có chức năng khả dụng ở chế độ lọc này
        </h3>
        <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto">
          Tài khoản hiện tại chưa được cấp phân hệ nào phù hợp với bộ lọc riêng. Bạn có thể chuyển sang chế độ "Tổng quan hệ thống" để tìm hiểu thêm.
        </p>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#155e75] px-4 py-2 text-xs font-bold text-white hover:bg-[#164e63]"
          >
            Chuyển sang Tổng quan hệ thống
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <FileQuestion className="size-6" />
      </div>
      <h3 className="mt-3 text-base font-black text-slate-950 dark:text-white">
        Chưa có dữ liệu hướng dẫn
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Hiện tại chưa có nội dung hướng dẫn nào được công bố trên hệ thống.
      </p>
    </div>
  )
}
