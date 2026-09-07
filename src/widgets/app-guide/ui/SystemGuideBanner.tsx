import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Database, FileText, Workflow, RefreshCw, HelpCircle } from 'lucide-react'
import { useLanguage } from '../../../shared/lib/i18n/LanguageContext'

export const SystemGuideBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { language } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-300">
      {/* Banner Header / Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-white text-slate-900 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 rounded border border-blue-200">
                Hướng dẫn
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'vi' ? 'Dành cho Người mới bắt đầu' : 'For New Users'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight mt-0.5 dark:text-white">
              {language === 'vi'
                ? 'HƯỚNG DẪN KHÁI NIỆM & MỐI QUAN HỆ KIẾN TRÚC (MASTER DATA · SOP · PROCESS · LIFE)'
                : 'CONCEPT & ARCHITECTURAL RELATIONSHIP GUIDE (MASTER DATA · SOP · PROCESS · LIFECYCLE)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
            {isExpanded
              ? (language === 'vi' ? 'Thu gọn hướng dẫn' : 'Collapse guide')
              : (language === 'vi' ? 'Xem giải thích chi tiết' : 'Expand detailed guide')}
          </span>
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Guide Content */}
      {isExpanded && (
        <div className="p-6 bg-slate-50/60 dark:bg-slate-950/60 space-y-6 animate-in fade-in duration-200">

          {/* Section 1: 4 Core Definitions */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {language === 'vi' ? '1. Bốn Khái niệm Cốt lõi trong Hệ thống HR Enterprise' : '1. Four Core Concepts in Enterprise HR System'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Master Data */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-950/80 rounded-lg">
                    <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Master Data (MD)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Dữ liệu Nền tảng:' : 'Foundation Data:'}</strong> {language === 'vi' ? 'Tập hợp các danh mục dùng chung cố định (như Đơn vị hành chính, Cơ cấu tổ chức, Chức danh, Thang/bậc lương...).' : 'Set of core shared catalogs (such as Org Units, Jobs, Pay Grades, Insurance...).'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  👉 {language === 'vi' ? 'Đóng vai trò: Cung cấp ô chọn & quy tắc nền' : 'Role: Provides picklists & baseline rules'}
                </div>
              </div>

              {/* SOP */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/80 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>SOP (Standard Procedure)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Quy trình Thao tác Chuẩn:' : 'Standard Operating Procedure:'}</strong> {language === 'vi' ? 'Bộ văn bản/quy định chuẩn hóa hướng dẫn con người thực hiện công việc đúng luật lao động và chính sách công ty.' : 'Standardized policy docs guiding compliance with labor laws and company regulations.'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  👉 {language === 'vi' ? 'Đóng vai trò: Căn cứ pháp lý & Chuẩn vận hành' : 'Role: Legal basis & Governance standard'}
                </div>
              </div>

              {/* Process / Workflow */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg">
                    <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span>Process / Workflow</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Quy trình Nghiệp vụ:' : 'Business Workflow:'}</strong> {language === 'vi' ? 'Chuỗi các bước thao tác trên phần mềm (ai nhập thông tin gì, kiểm tra điều kiện gì, ai phê duyệt và chuyển tiếp).' : 'Sequential step-by-step software actions (data entry, validation rules, multi-stage approvals).'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  👉 {language === 'vi' ? 'Đóng vai trò: Động cơ xử lý dữ liệu' : 'Role: Data processing execution engine'}
                </div>
              </div>

              {/* LIFE */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-purple-50 dark:bg-purple-950/80 rounded-lg">
                    <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>LIFE ({language === 'vi' ? 'Vòng đời Nhân viên' : 'Employee Lifecycle'})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">{language === 'vi' ? 'Hành trình Nhân sự (8 Giai đoạn):' : 'HR Lifecycle Journey (8 Stages):'}</strong> {language === 'vi' ? 'Chuỗi giai đoạn tuần tự từ Định biên (LIFE-00) ➔ Tiếp nhận (LIFE-01) ➔ Bố trí ➔ Hợp đồng ➔ Lương ➔ Nghỉ việc (LIFE-07).' : 'End-to-end employee stages from Planning (LIFE-00) ➔ Onboarding (LIFE-01) ➔ Placement ➔ Contract ➔ Payroll ➔ Offboarding (LIFE-07).'}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                  👉 {language === 'vi' ? 'Đóng vai trò: Trục thời gian chính của nhân sự' : 'Role: Master HR timeline & milestone axis'}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  )
}
