import React from 'react'
import { useLanguage } from '../../../../context/LanguageContext'

export const SopStepLegendBar: React.FC = () => {
  const { language } = useLanguage()

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-1 text-xs sm:text-sm border-t border-slate-200/60 dark:border-slate-800">
      <span className="font-bold text-slate-600 dark:text-slate-300">
        {language === 'vi' ? 'Chú thích Phân loại Bước SOP:' : 'SOP Step Legend:'}
      </span>
      <span
        title={language === 'vi' ? 'Bước người dùng/thành viên nhập thông tin, khai báo dữ liệu ban đầu' : 'User data entry and declaration step'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold cursor-help"
      >
        <span className="font-mono font-extrabold text-blue-800 dark:text-blue-200">N</span> {language === 'vi' ? 'Nhập liệu / Khai báo (Input)' : 'Data Entry / Declaration (Input)'}
      </span>
      <span
        title={language === 'vi' ? 'Bước kiểm tra, thẩm định, xác minh hoặc ký duyệt thủ công bởi HR Admin / Manager' : 'Manual verification or approval by HR Admin / Manager'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-semibold cursor-help"
      >
        <span className="font-mono font-extrabold text-amber-800 dark:text-amber-200">M</span> {language === 'vi' ? 'Thẩm định thủ công / Duyệt (Manual Review)' : 'Manual Review / Approval'}
      </span>
      <span
        title={language === 'vi' ? 'Bước hệ thống tự động xử lý, tự động tính toán, lưu vết hoặc gửi thông báo' : 'Automated system processing, calculation or notification step'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold cursor-help"
      >
        <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-200">A</span> {language === 'vi' ? 'Tự động / Hệ thống (Automated Action)' : 'Automated / System Action'}
      </span>
    </div>
  )
}

