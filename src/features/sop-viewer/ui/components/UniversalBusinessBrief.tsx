import React, { useState } from 'react'
import { Sparkles, Users, FileText, CheckCircle2, CircleHelp, ChevronDown, ChevronUp } from 'lucide-react'
import type { BusinessBriefViewModel } from '../../../../entities/sop/lib/workflowSelectors'
import { useLanguage } from '../../../../shared/lib/i18n/LanguageContext'

interface UniversalBusinessBriefProps {
  brief: BusinessBriefViewModel
  isDarkMode: boolean
}

export const UniversalBusinessBrief: React.FC<UniversalBusinessBriefProps> = ({
  brief,
  isDarkMode
}) => {
  const { language } = useLanguage()
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false)
  const [isBriefExpanded, setIsBriefExpanded] = useState(true)

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-colors duration-200 ${
        isDarkMode ? 'border-sky-900/60 bg-sky-950/20' : 'border-sky-200/80 bg-sky-50/60'
      }`}
    >
      {/* Header bar of Brief */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1f5f86] dark:text-sky-400 shrink-0" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {language === 'vi' ? 'Tóm lược Nghiệp vụ & Bối cảnh Thực thi' : 'Operational Brief & Execution Context'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGlossaryOpen(!isGlossaryOpen)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-sky-800 bg-slate-900 text-sky-200 hover:bg-slate-800'
                : 'border-sky-200 bg-white text-sky-800 hover:bg-sky-50'
            }`}
          >
            <CircleHelp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {language === 'vi' ? 'Giải thích thuật ngữ' : 'Terminology'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsBriefExpanded(!isBriefExpanded)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
            }`}
            title={isBriefExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isBriefExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 4 Essential Operational Dimensions */}
      {isBriefExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 animate-fadeIn">
          {/* 1. When */}
          <div
            className={`rounded-xl border p-3 flex flex-col justify-between ${
              isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-white bg-white/90'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[#1f5f86] dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{language === 'vi' ? '1. Khi nào kích hoạt?' : '1. Trigger Condition'}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                {brief.when}
              </p>
            </div>
          </div>

          {/* 2. Who */}
          <div
            className={`rounded-xl border p-3 flex flex-col justify-between ${
              isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-white bg-white/90'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[#1f5f86] dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider">
                <Users className="w-3 h-3 text-blue-500 shrink-0" />
                <span>{language === 'vi' ? '2. Ai tham gia & RACI?' : '2. Key Actors'}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                {brief.who}
              </p>
            </div>
          </div>

          {/* 3. Inputs */}
          <div
            className={`rounded-xl border p-3 flex flex-col justify-between ${
              isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-white bg-white/90'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[#1f5f86] dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider">
                <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                <span>{language === 'vi' ? '3. Đầu vào cần chuẩn bị' : '3. Inputs to Prepare'}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-3">
                {brief.inputs.join(' · ')}
              </p>
            </div>
          </div>

          {/* 4. Outputs */}
          <div
            className={`rounded-xl border p-3 flex flex-col justify-between ${
              isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-white bg-white/90'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[#1f5f86] dark:text-sky-300 font-extrabold text-[10px] uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{language === 'vi' ? '4. Kết quả bàn giao (Outputs)' : '4. Expected Deliverables'}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-3">
                {brief.outputs.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Glossary Popdown */}
      {isGlossaryOpen && (
        <div
          className={`mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-xl border p-3 text-xs animate-fadeIn ${
            isDarkMode ? 'border-slate-800 bg-slate-950/70 text-slate-300' : 'border-sky-100 bg-white text-slate-600'
          }`}
        >
          <p>
            <strong className="text-slate-900 dark:text-white">LIFE:</strong>{' '}
            {language === 'vi' ? '8 chặng vòng đời từ tuyển dụng đến thôi việc.' : '8 stages of employee journey.'}
          </p>
          <p>
            <strong className="text-slate-900 dark:text-white">CF / Operation:</strong>{' '}
            {language === 'vi' ? '8 nghiệp vụ phát sinh bất kỳ lúc nào.' : 'Cross-functional operational modules.'}
          </p>
          <p>
            <strong className="text-slate-900 dark:text-white">SOP:</strong>{' '}
            {language === 'vi' ? 'Quy chuẩn thao tác và kiểm tra trường dữ liệu.' : 'Standard Operating Procedures.'}
          </p>
          <p>
            <strong className="text-slate-900 dark:text-white">RACI:</strong>{' '}
            {language === 'vi' ? 'Trách nhiệm: Tạo ➔ Thẩm định ➔ Duyệt ➔ Thực thi.' : 'Role matrix: R, A, C, I.'}
          </p>
        </div>
      )}
    </section>
  )
}
