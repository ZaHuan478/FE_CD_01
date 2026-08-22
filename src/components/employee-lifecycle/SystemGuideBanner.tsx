import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Database, FileText, Workflow, RefreshCw, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export const SystemGuideBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const { language } = useLanguage()

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-300">
      {/* Banner Header / Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/80 rounded border border-blue-700/60">
                Onboarding Guide
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {language === 'vi' ? 'Dành cho Người mới bắt đầu' : 'For New Users'}
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              {language === 'vi'
                ? 'HƯỚNG DẪN KHÁI NIỆM & MỐI QUAN HỆ KIẾN TRÚC (MASTER DATA · SOP · PROCESS · LIFE)'
                : 'CONCEPT & ARCHITECTURAL RELATIONSHIP GUIDE (MASTER DATA · SOP · PROCESS · LIFECYCLE)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
            {isExpanded
              ? (language === 'vi' ? 'Thu gọn hướng dẫn' : 'Collapse guide')
              : (language === 'vi' ? 'Xem giải thích chi tiết' : 'Expand detailed guide')}
          </span>
          <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300">
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

          {/* Section 2: Flow Diagrams / Architecture Relationship */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {language === 'vi' ? '2. Sơ đồ Mối quan hệ Luồng Dữ liệu' : '2. System Data Flow Relationship Diagram'}
            </h3>

            <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-xl text-white flex flex-col lg:flex-row items-center justify-between gap-4 border border-slate-800">

              {/* Step 1: Inputs */}
              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <Database className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-300">MASTER DATA (MD-01..10)</div>
                  <div className="text-[11px] text-slate-400">{language === 'vi' ? 'Danh mục & Cấu trúc tổ chức' : 'Catalogs & Org Structure'}</div>
                </div>
              </div>

              <div className="text-slate-500 font-bold hidden lg:block">+</div>

              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">SOP ({language === 'vi' ? 'Quy định & Luật' : 'Policies & Rules'})</div>
                  <div className="text-[11px] text-slate-400">{language === 'vi' ? 'Quy chuẩn thao tác nhân sự' : 'Standard HR procedures'}</div>
                </div>
              </div>

              <div className="text-blue-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0 transition-transform" />
              </div>

              {/* Step 2: Process */}
              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <Workflow className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-indigo-300">PROCESS ({language === 'vi' ? 'Quy trình' : 'Workflow'})</div>
                  <div className="text-[11px] text-slate-400">{language === 'vi' ? 'Nhập dữ liệu, Kiểm tra & Phê duyệt' : 'Data Entry, Validation & Approval'}</div>
                </div>
              </div>

              <div className="text-purple-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0 transition-transform" />
              </div>

              {/* Step 3: Life Output */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900 to-indigo-900 p-3 rounded-lg border border-purple-500/50 w-full lg:w-auto">
                <RefreshCw className="w-5 h-5 text-purple-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-purple-200">{language === 'vi' ? 'VÒNG ĐỜI NHÂN VIÊN' : 'EMPLOYEE LIFECYCLE'} (LIFE-00..07)</div>
                  <div className="text-[11px] text-purple-300">{language === 'vi' ? 'Cập nhật vào Hồ sơ Nhân viên Trung tâm' : 'Updates Central Employee Master Profile'}</div>
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              💡 <strong>{language === 'vi' ? 'Tóm tắt dễ hiểu:' : 'Summary:'}</strong> {language === 'vi' ? 'Khi thực hiện 1 bước trong Vòng đời nhân viên (ví dụ: LIFE-03 Bố trí công tác), phần mềm sẽ lấy Master Data (như MD-05 Phòng ban, MD-06 Chức danh) dựa theo quy tắc của SOP để xử lý thành Process chuẩn chỉnh.' : 'When carrying out a lifecycle step (e.g. LIFE-03 Job Placement), the software references Master Data (e.g. MD-05 Dept, MD-06 Job Title) guided by SOP policy rules to execute a standardized Process.'}
            </p>
          </div>

        </div>
      )}
    </div>
  )
}
