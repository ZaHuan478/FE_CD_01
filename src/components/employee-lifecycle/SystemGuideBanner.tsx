import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Database, FileText, Workflow, RefreshCw, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react'

export const SystemGuideBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <div className="bg-white rounded-2xl border border-blue-200/80 shadow-xs overflow-hidden transition-all duration-300">
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
              <span className="text-xs text-slate-300 font-medium">Dành cho Người mới bắt đầu</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              HƯỚNG DẪN KHÁI NIỆM & MỐI QUAN HỆ KIẾN TRÚC (MASTER DATA · SOP · PROCESS · LIFE)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
            {isExpanded ? 'Thu gọn hướng dẫn' : 'Xem giải thích chi tiết'}
          </span>
          <div className="p-1.5 bg-slate-800 rounded-lg text-slate-300">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Guide Content */}
      {isExpanded && (
        <div className="p-6 bg-slate-50/60 space-y-6 animate-in fade-in duration-200">
          
          {/* Section 1: 4 Core Definitions */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              1. Bốn Khái niệm Cốt lõi trong Hệ thống HR Enterprise
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Master Data */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Database className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Master Data (MD)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Dữ liệu Nền tảng:</strong> Tập hợp các danh mục dùng chung cố định (như Đơn vị hành chính, Cơ cấu tổ chức, Chức danh, Thang/bậc lương, Bảo hiểm...).
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-blue-600 font-semibold">
                  👉 Đóng vai trò: Cung cấp ô chọn & quy tắc nền
                </div>
              </div>

              {/* SOP */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>SOP (Standard Procedure)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Quy trình Thao tác Chuẩn:</strong> Bộ văn bản/quy định chuẩn hóa hướng dẫn con người thực hiện công việc đúng luật lao động và chính sách công ty.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-emerald-600 font-semibold">
                  👉 Đóng vai trò: Căn cứ pháp lý & Chuẩn vận hành
                </div>
              </div>

              {/* Process / Workflow */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Workflow className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span>Process / Workflow</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Quy trình Nghiệp vụ:</strong> Chuỗi các bước thao tác trên phần mềm (ai nhập thông tin gì, kiểm tra điều kiện gì, ai phê duyệt và chuyển tiếp cho ai).
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-indigo-600 font-semibold">
                  👉 Đóng vai trò: Động cơ xử lý dữ liệu
                </div>
              </div>

              {/* LIFE */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
                  <div className="p-1.5 bg-purple-50 rounded-lg">
                    <RefreshCw className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>LIFE (Vòng đời Nhân viên)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Hành trình Nhân sự (7 Bước):</strong> Chuỗi giai đoạn tuần tự từ khi nhân viên Tiếp nhận (LIFE-01) ➔ Bố trí ➔ Hợp đồng ➔ Lương ➔ Nghỉ việc (LIFE-07).
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-purple-600 font-semibold">
                  👉 Đóng vai trò: Trục thời gian chính của nhân sự
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Flow Diagrams / Architecture Relationship */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              2. Sơ đồ Mối quan hệ Luồng Dữ liệu (System Relationship Flow)
            </h3>

            <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Step 1: Inputs */}
              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <Database className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-300">MASTER DATA (MD-01..10)</div>
                  <div className="text-[11px] text-slate-400">Danh mục & Cấu trúc tổ chức</div>
                </div>
              </div>

              <div className="text-slate-500 font-bold hidden lg:block">+</div>

              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">SOP (Quy định & Luật)</div>
                  <div className="text-[11px] text-slate-400">Quy chuẩn thao tác nhân sự</div>
                </div>
              </div>

              <div className="text-blue-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0 transition-transform" />
              </div>

              {/* Step 2: Process */}
              <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700 w-full lg:w-auto">
                <Workflow className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-indigo-300">PROCESS (Quy trình)</div>
                  <div className="text-[11px] text-slate-400">Nhập dữ liệu, Kiểm tra & Phê duyệt</div>
                </div>
              </div>

              <div className="text-purple-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0 transition-transform" />
              </div>

              {/* Step 3: Life Output */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-900 to-indigo-900 p-3 rounded-lg border border-purple-500/50 w-full lg:w-auto">
                <RefreshCw className="w-5 h-5 text-purple-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-purple-200">VÒNG ĐỜI NHÂN VIÊN (LIFE-01..07)</div>
                  <div className="text-[11px] text-purple-300">Cập nhật vào Hồ sơ Nhân viên Trung tâm</div>
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-500 italic mt-2">
              💡 <strong>Tóm tắt dễ hiểu:</strong> Khi thực hiện 1 bước trong Vòng đời nhân viên (ví dụ: <code>LIFE-03 Bố trí công tác</code>), phần mềm sẽ lấy <strong>Master Data</strong> (như <code>MD-05 Phòng ban</code>, <code>MD-06 Chức danh</code>) dựa theo quy tắc của <strong>SOP</strong> để xử lý thành <strong>Process</strong> chuẩn chỉnh.
            </p>
          </div>

        </div>
      )}
    </div>
  )
}
