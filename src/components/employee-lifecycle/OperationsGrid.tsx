import React, { useState } from 'react'
import { Clock, FileEdit, UserSquare2, Award, GraduationCap, Target, HeartHandshake, Receipt, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { OperationModule } from '../../types/employee-lifecycle'
import { useLanguage } from '../../context/LanguageContext'

interface OperationsGridProps {
  modules: OperationModule[]
  onSelectModule: (id: string) => void
}

import { defaultOperationsModules as defaultModules } from './data/operationsData'

const getModuleIcon = (id: string) => {
  switch (id) {
    case 'CF-01': return <Clock className="w-5 h-5" />
    case 'CF-02': return <FileEdit className="w-5 h-5" />
    case 'CF-03': return <UserSquare2 className="w-5 h-5" />
    case 'CF-04': return <Award className="w-5 h-5" />
    case 'CF-05': return <GraduationCap className="w-5 h-5" />
    case 'CF-06': return <Target className="w-5 h-5" />
    case 'CF-07': return <HeartHandshake className="w-5 h-5" />
    case 'CF-08': return <Receipt className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

export const OperationsGrid: React.FC<OperationsGridProps> = ({
  modules = defaultModules,
  onSelectModule
}) => {
  const { language, t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const displayModules = modules.length >= 8 ? modules : defaultModules

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5 transition-all duration-300 hover:shadow-md">
      {/* Header Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 rounded-md border border-blue-200/60 dark:border-blue-800">
              Nghiệp vụ phát sinh · 8 nhóm
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'vi' ? '8 Module Nghiệp vụ Phát sinh' : '8 Operational Modules'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {t('layer3.title', 'NGHIỆP VỤ PHÁT SINH TRONG QUÁ TRÌNH LÀM VIỆC')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {t('layer3.subtitle', '8 Module Nghiệp vụ Xử lý Định kỳ & Đột xuất Trong Quá trình Vận hành')}
          </p>
        </div>

        {/* Collapse Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0 self-start sm:self-center"
          title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
        >
          <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>


      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-blue-900/50 dark:bg-blue-950/25 dark:text-slate-200">
        <strong>Hiểu đơn giản:</strong> đây là các việc phát sinh trong lúc nhân viên làm việc, như nghỉ phép, tăng ca, điều chuyển, thưởng/phạt hoặc đào tạo; chúng không nhất thiết diễn ra theo thứ tự.
      </div>

      {/* EXPANDABLE BODY CONTENT */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fadeIn">
          {displayModules.slice(0, 8).map((mod) => {
            const icon = getModuleIcon(mod.id)
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className="bg-slate-50/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-800 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 text-left hover:-translate-y-1 transition-all duration-200 hover:shadow-md flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 rounded-lg border border-slate-200/70 dark:border-slate-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors shrink-0">
                      {icon}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {mod.sopBadge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 rounded group-hover:bg-emerald-100 transition-colors">
                          📋 {mod.sopBadge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-200/70 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-700 dark:text-slate-300 rounded transition-colors">
                        {mod.code}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>{mod.category || 'Operation'}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {language === 'vi' ? 'Chi tiết →' : 'Details →'}
                  </span>
                </div>
              </button>

            )
          })}
        </div>
      )}
    </div>
  )
}
