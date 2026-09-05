import React, { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import type { Policy } from '../../../../entities/policy/model/types'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface PolicyOriginalNoticeProps {
  policy: Policy
}

export const PolicyOriginalNotice: React.FC<PolicyOriginalNoticeProps> = ({ policy }) => {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const notice = policy.originalNotice
  if (!notice) return null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {language === 'vi' ? 'Xem nội dung văn bản thông báo gốc' : 'Original Notice Document'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {notice.noticeNumber ? `${notice.noticeNumber} · ` : ''}{language === 'vi' ? `Ban hành ngày ${notice.issuedDate}` : `Issued ${notice.issuedDate}`}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-5 sm:p-6 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-4 text-xs animate-fadeIn">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="font-mono text-[11px] text-[#1f5f86] dark:text-sky-400 font-bold">
              {notice.noticeNumber || policy.code}
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
              {notice.subject}
            </h4>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Đơn vị ban hành: {policy.issuingDepartment} · Ngày {notice.issuedDate}
            </div>
          </div>

          <div className="space-y-3.5 text-slate-700 dark:text-slate-300 leading-relaxed font-serif sm:font-sans">
            {notice.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                {sec.heading && (
                  <h5 className="font-bold text-slate-900 dark:text-white font-sans text-xs">
                    {sec.heading}
                  </h5>
                )}
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
