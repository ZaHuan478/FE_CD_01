import React, { useState } from 'react'
import { ListCheck, ChevronDown, ChevronUp } from 'lucide-react'
import type { SopSubProcess } from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface WorkflowTableViewProps {
  currentProcess: SopSubProcess
  isDarkMode: boolean
}

export const WorkflowTableView: React.FC<WorkflowTableViewProps> = ({
  currentProcess,
  isDarkMode
}) => {
  const { language } = useLanguage()
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <div className={`rounded-2xl p-5 border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>
            {language === 'vi' ? 'BẢNG CHI TIẾT CÁC BƯỚC SOP:' : 'DETAILED SOP STEPS SPECIFICATIONS:'} {currentProcess.sopTitle}
          </span>
        </h3>

        {/* Collapse Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}
        >
          <span>{isExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Mở rộng' : 'Expand')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                <th className="p-3 w-24">{language === 'vi' ? 'Mã bước' : 'Step Code'}</th>
                <th className="p-3 w-56">{language === 'vi' ? 'Tên bước công việc' : 'Step Name'}</th>
                <th className="p-3 w-40">{language === 'vi' ? 'Người thực hiện' : 'Actor'}</th>
                <th className="p-3">{language === 'vi' ? 'Mô tả chi tiết nghiệp vụ' : 'Business Requirement Description'}</th>
                <th className="p-3 w-32">{language === 'vi' ? 'Nơi thực hiện' : 'Location/Channel'}</th>
                <th className="p-3 w-32">{language === 'vi' ? 'Thời gian' : 'Timing'}</th>
                <th className="p-3 w-16 text-center">{language === 'vi' ? 'Loại' : 'Type'}</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-200 text-slate-700'
              }`}>

              {currentProcess.steps.map((step) => (
                <tr key={step.stepCode} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                  }`}>
                  <td className="p-3 font-mono font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {step.stepCode}
                  </td>
                  <td className={`p-3 font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {step.title}
                  </td>
                  <td className="p-3 font-medium text-amber-700 dark:text-amber-300">
                    {step.actor}
                  </td>
                  <td className="p-3 leading-relaxed">
                    {step.description}
                  </td>
                  <td className="p-3 font-medium text-slate-500 dark:text-slate-400">
                    {step.location}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {step.timing}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded font-mono border ${step.typeCode === 'N'
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : step.typeCode === 'M'
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                      }`}>
                      {step.typeCode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
