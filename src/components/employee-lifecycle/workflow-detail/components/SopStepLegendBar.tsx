import React from 'react'

export const SopStepLegendBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-1 text-[11px] border-t border-slate-200/60 dark:border-slate-800">
      <span className="font-semibold text-slate-500 dark:text-slate-400">Chú thích Phân loại Bước SOP:</span>
      <span title="Bước người dùng/thành viên nhập thông tin, khai báo dữ liệu ban đầu" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium cursor-help">
        <span className="font-mono font-bold text-blue-800 dark:text-blue-200">N</span> Nhập liệu / Khai báo (Input)
      </span>
      <span title="Bước kiểm tra, thẩm định, xác minh hoặc ký duyệt thủ công bởi HR Admin / Manager" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium cursor-help">
        <span className="font-mono font-bold text-amber-800 dark:text-amber-200">M</span> Thẩm định thủ công / Duyệt (Manual Review)
      </span>
      <span title="Bước hệ thống tự động xử lý, tự động tính toán, lưu vết hoặc gửi thông báo" className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium cursor-help">
        <span className="font-mono font-bold text-emerald-800 dark:text-emerald-200">A</span> Tự động / Hệ thống (Automated Action)
      </span>
    </div>
  )
}
