import React from 'react'
import { ListCheck } from 'lucide-react'
import type { SopSubProcess } from '../types'

interface WorkflowTableViewProps {
  currentProcess: SopSubProcess
  isDarkMode: boolean
}

export const WorkflowTableView: React.FC<WorkflowTableViewProps> = ({
  currentProcess,
  isDarkMode
}) => {
  return (
    <div className={`rounded-2xl p-5 border space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <ListCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>BẢNG CHI TIẾT CÁC BƯỚC SOP: {currentProcess.sopTitle}</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
              <th className="p-3 w-24">Mã bước</th>
              <th className="p-3 w-56">Tên bước công việc</th>
              <th className="p-3 w-40">Người thực hiện</th>
              <th className="p-3">Mô tả chi tiết nghiệp vụ</th>
              <th className="p-3 w-32">Nơi thực hiện</th>
              <th className="p-3 w-32">Thời gian</th>
              <th className="p-3 w-16 text-center">Loại</th>
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
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  {step.location}
                </td>
                <td className="p-3 text-slate-500 dark:text-slate-400">
                  {step.timing}
                </td>
                <td className="p-3 text-center">
                  <span
                    title={
                      step.typeCode === 'N'
                        ? 'Loại N: Bước Nhập liệu / Khai báo'
                        : step.typeCode === 'M'
                          ? 'Loại M: Bước Thẩm định thủ công / Duyệt'
                          : step.typeCode === 'C'
                            ? 'Loại C: Bước Thẩm định điều kiện'
                            : 'Loại A: Bước Tự động hệ thống xử lý'
                    }
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-help ${step.typeCode === 'N'
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      : step.typeCode === 'M'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : step.typeCode === 'C'
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}>
                    {step.typeCode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
