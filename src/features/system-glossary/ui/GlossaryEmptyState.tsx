import React from 'react'

interface GlossaryEmptyStateProps {
  type: 'search' | 'error' | 'empty'
  message?: string
  onAction?: () => void
  actionLabel?: string
}

export const GlossaryEmptyState: React.FC<GlossaryEmptyStateProps> = ({
  type,
  message,
  onAction,
  actionLabel
}) => {
  if (type === 'error') {
    return (
      <div className="p-8 sm:p-12 text-center rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Đã xảy ra sự cố
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
          {message || 'Không thể tải danh sách thuật ngữ từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'}
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>{actionLabel || 'Thử lại'}</span>
          </button>
        )}
      </div>
    )
  }

  if (type === 'search') {
    return (
      <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Không tìm thấy thuật ngữ phù hợp
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
          {message || 'Thử thay đổi từ khóa tìm kiếm, kiểm tra lỗi chính tả hoặc xóa bộ lọc danh mục và chữ cái.'}
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 shadow-sm transition-all"
          >
            <span>{actionLabel || 'Xóa tất cả bộ lọc'}</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
        Chưa có thuật ngữ nào
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Từ điển thuật ngữ đang được cập nhật bởi ban quản trị.
      </p>
    </div>
  )
}
