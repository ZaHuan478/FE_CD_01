import React from 'react'
import { ArrowLeft, FileText, Sun, Moon } from 'lucide-react'
import type { DetailItem } from '../../../../types/employee-lifecycle'
import type { SopSubProcess } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'
import { LanguageSelector } from '../../../common/LanguageSelector'

interface UniversalWorkflowHeaderProps {
  item: DetailItem
  currentProcess: SopSubProcess
  onBack: () => void
  onOpenWireframe?: (item: DetailItem) => void
  isDarkMode: boolean
  onToggleTheme: () => void
}

export const UniversalWorkflowHeader: React.FC<UniversalWorkflowHeaderProps> = ({
  item,
  currentProcess,
  onBack,
  onOpenWireframe,
  isDarkMode,
  onToggleTheme
}) => {
  const { language, t } = useLanguage()

  const stepCount = currentProcess.steps.length

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950/95 border-slate-800 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="w-[94%] max-w-[1920px] mx-auto px-2 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Back Button + Process Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 truncate">
          <button
            type="button"
            onClick={onBack}
            className={`p-2 px-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
            title={language === 'vi' ? 'Quay lại Bức tranh Tổng thể' : 'Back to Blueprint'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'vi' ? 'Quay lại' : 'Back'}
            </span>
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block shrink-0" />

          <div className="truncate flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-[11px] font-mono font-black bg-[#1f5f86] text-white rounded-md shrink-0">
              {currentProcess.sopCode || item.id}
            </span>

            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              {currentProcess.sopTitle || item.title}
            </h1>

            <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 shrink-0">
              📌 {item.id}: {item.title}
            </span>

            {stepCount > 0 && (
              <span className="hidden lg:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 rounded border border-emerald-200/80 dark:border-emerald-800 shrink-0">
                {stepCount} {language === 'vi' ? 'bước' : 'steps'}
              </span>
            )}
          </div>
        </div>

        {/* Right: Language, Dark mode & Exactly ONE Wireframe CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector isDarkTheme={isDarkMode} />

          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
              isDarkMode
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={
              isDarkMode
                ? t('header.themeLight', 'Bật Giao diện Sáng')
                : t('header.themeDark', 'Bật Giao diện Tối')
            }
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {onOpenWireframe && (
            <button
              type="button"
              onClick={() => onOpenWireframe(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1f5f86] hover:bg-[#174968] rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              title={t('common.viewWireframe', 'Mở màn hình mẫu')}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.viewWireframe', 'Mở màn hình mẫu')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
