import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  ShieldCheck,
  RefreshCw,
  Sun,
  Moon,
  UploadCloud,
  File,
  X,
  AlertCircle,
  Clock,
  UserCheck,
  Database,
  Building2,
  GitBranch
} from 'lucide-react'
import type { DetailItem } from '../../types/employee-lifecycle'

interface WireframeFormDetailPageProps {
  item: DetailItem
  onBack: () => void
}

export const WireframeFormDetailPage: React.FC<WireframeFormDetailPageProps> = ({
  item,
  onBack
}) => {
  // Theme state synced with global document dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    const handleClassChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    const observer = new MutationObserver(handleClassChange)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDarkMode
    setIsDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('employee_lifecycle_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('employee_lifecycle_theme', 'light')
    }
  }

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([])
  const [isSaved, setIsSaved] = useState(false)
  const [isSubmittedAttempted, setIsSubmittedAttempted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Initialize form fields based on item & scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (item) {
      const initial: Record<string, string> = {}
      const fields = item.uiFields && item.uiFields.length > 0
        ? item.uiFields
        : ['Họ và tên', 'Mã nhân viên', 'Đơn vị / Phòng ban', 'Vị trí công tác', 'Ngày áp dụng hiệu lực', 'Mức lương điều chỉnh', 'Ghi chú nghiệp vụ']

      fields.forEach((field) => {
        if (field.toLowerCase().includes('ngày') || field.toLowerCase().includes('thời gian') || field.toLowerCase().includes('hiệu lực')) {
          initial[field] = new Date().toISOString().split('T')[0]
        } else {
          initial[field] = ''
        }
      })
      setFormData(initial)
      setIsSaved(false)
      setIsSubmittedAttempted(false)
      setValidationErrors({})
      setAttachedFiles([
        { name: `To-Trinh-${item.id}-De-Xuat.pdf`, size: '2.4 MB' }
      ])
    }
  }, [item])

  const fields = item.uiFields && item.uiFields.length > 0
    ? item.uiFields
    : ['Họ và tên', 'Mã nhân viên', 'Đơn vị / Phòng ban', 'Vị trí công tác', 'Ngày áp dụng hiệu lực', 'Mức lương điều chỉnh', 'Ghi chú nghiệp vụ']

  // const isFieldRequired = (fieldName: string) => {
  //   const lower = fieldName.toLowerCase()
  //   return lower.includes('mã') || lower.includes('họ và tên') || lower.includes('đề xuất') || lower.includes('ngày') || lower.includes('hiệu lực') || lower.includes('lương') || lower.includes('vị trí') || lower.includes('đơn vị') || lower.includes('hợp đồng') || lower.includes('nguồn')
  // }

  // Validate form fields
  const validateForm = () => {
    const errors: Record<string, string> = {}
    fields.forEach((field) => {
      if (isFieldRequired(field)) {
        const val = formData[field]
        if (!val || val.trim() === '') {
          errors[field] = `Vui lòng nhập trường "${field}"!`
        }
      }
    })
    return errors
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleReset = () => {
    const initial: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.toLowerCase().includes('ngày')) {
        initial[field] = new Date().toISOString().split('T')[0]
      } else {
        initial[field] = ''
      }
    })
    setFormData(initial)
    setIsSaved(false)
    setIsSubmittedAttempted(false)
    setValidationErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittedAttempted(true)
    const errors = validateForm()
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      setIsSaved(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 4000)
  }

  const handleAddMockFile = () => {
    const newFileNames = ['Phu-Luc-HDLD-Dinh-Kem.docx', 'Quyet-Dinh-Bo-Nhiem.pdf', 'Bang-De-Xuat-Chinh-Thuc.pdf']
    const randomName = newFileNames[Math.floor(Math.random() * newFileNames.length)]
    setAttachedFiles((prev) => [...prev, { name: randomName, size: '1.8 MB' }])
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Determine field type & options
  const getFieldType = (fieldName: string) => {
    const lower = fieldName.toLowerCase()
    if (lower.includes('ngày') || lower.includes('thời gian') || lower.includes('hiệu lực')) {
      return 'date'
    }
    if (lower.includes('loại') || lower.includes('vị trí') || lower.includes('đơn vị') || lower.includes('nguồn') || lower.includes('trạng thái') || lower.includes('chức danh') || lower.includes('hợp đồng') || lower.includes('phòng ban')) {
      return 'select'
    }
    if (lower.includes('ghi chú') || lower.includes('mô tả') || lower.includes('nguyên nhân') || lower.includes('lý do') || lower.includes('bàn giao')) {
      return 'textarea'
    }
    if (lower.includes('lương') || lower.includes('hệ số') || lower.includes('mức') || lower.includes('chi phí') || lower.includes('số lượng') || lower.includes('cccd')) {
      return 'number'
    }
    return 'text'
  }

  const getSelectOptions = (fieldName: string): string[] => {
    const lower = fieldName.toLowerCase()
    if (lower.includes('vị trí') || lower.includes('chức danh')) {
      return ['Chuyên viên HR', 'Trưởng phòng Nhân sự', 'Kế toán trưởng', 'Kỹ sư phần mềm Senior', 'Giám đốc Khối Operations']
    }
    if (lower.includes('đơn vị') || lower.includes('phòng ban')) {
      return ['Ban Giám Đốc', 'Khối Nhân sự (HR)', 'Khối Tài chính Kế toán', 'Khối Công nghệ Thông tin (IT)', 'Khối Vận hành']
    }
    if (lower.includes('nguồn')) {
      return ['Tuyển dụng trực tiếp', 'Nội bộ giới thiệu', 'Headhunter', 'Website Công ty', 'LinkedIn Jobs']
    }
    if (lower.includes('loại') || lower.includes('hợp đồng')) {
      return ['HĐLD Xác định thời hạn (12 tháng)', 'HĐLD Không xác định thời hạn', 'Hợp đồng Thử việc (2 tháng)', 'Phụ lục Hợp đồng Điều chỉnh']
    }
    if (lower.includes('trạng thái')) {
      return ['Khởi tạo mới', 'Chờ duyệt (Pending)', 'Đã phê duyệt (Approved)', 'Yêu cầu bổ sung thông tin']
    }
    return ['Tùy chọn A', 'Tùy chọn B', 'Tùy chọn C']
  }

  const isFieldRequired = (fieldName: string) => {
    const lower = fieldName.toLowerCase()
    return lower.includes('mã') || lower.includes('họ và tên') || lower.includes('ngày') || lower.includes('đề xuất') || lower.includes('hiệu lực')
  }

  // Count filled required fields
  const requiredFields = fields.filter(isFieldRequired)
  const filledRequiredCount = requiredFields.filter(f => !!formData[f]).length

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-900'
      }`}>

      {/* TOP FIXED NAVIGATION HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 py-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-2xs'
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all duration-200 group shadow-xs cursor-pointer ${isDarkMode
                ? 'bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white border-slate-700 hover:border-blue-500'
                : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border-slate-300 hover:border-blue-600'
                }`}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Quay lại Workflow</span>
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-600 text-white font-mono text-xs font-bold rounded-xl shadow-xs">
                {item.id}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    FORM INTERACTIVE WIREFRAME WORKSPACE
                  </span>
                  {item.sopIds && item.sopIds.length > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-500/30">
                      📋 {item.sopIds[0]}
                    </span>
                  )}
                </div>
                <h1 className={`text-sm sm:text-base font-extrabold truncate max-w-md ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Mô phỏng Giao diện Form Thực tế: {item.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              title="Chuyển đổi Chế độ Giao diện Sáng / Tối"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Giao diện Sáng' : 'Giao diện Tối'}</span>
            </button>

            {/* Top Primary Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu & Phê duyệt Form</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* GOVERNANCE SOP CONTEXT BANNER */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/60 text-slate-200'
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-slate-800 text-white'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CHUẨN BIỂU MẪU QUY TRÌNH (FORM COMPLIANCE SCHEMA)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold mt-0.5">
                Quy chuẩn Form tuân theo: <span className="text-white font-extrabold">{item.sopTitles?.[0] || 'Quy trình Chuẩn HR SaaS Enterprise'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-300 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              Field Schema v1.0
            </span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800">
              Approved Mode
            </span>
          </div>
        </div>

        {/* VALIDATION ERROR ALERT BANNER */}
        {isSubmittedAttempted && Object.keys(validationErrors).length > 0 && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Không thể Lưu & Phê duyệt Form!</h4>
                <p className="text-xs opacity-90">
                  Còn <strong>{Object.keys(validationErrors).length}</strong> trường thông tin bắt buộc chưa được điền. Vui lòng kiểm tra các ô có viền đỏ bên dưới!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValidationErrors({})}
              className="text-xs font-bold px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-800 dark:text-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        )}

        {/* SUCCESS TOAST NOTIFICATION */}
        {isSaved && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Lưu Dữ liệu & Phê duyệt Form Thành công!</h4>
                <p className="text-xs opacity-90">Bản ghi đã được hệ thống mã hóa và đồng bộ trực tiếp vào cơ sở dữ liệu Master Data HRMS.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSaved(false)}
              className="text-xs font-bold px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* 2-COLUMN MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: INTERACTIVE FORM INPUT FIELDS (2 COLS SPAN) */}
          <div className={`lg:col-span-2 rounded-2xl border p-6 space-y-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>CÁC TRƯỜNG DỮ LIỆU CẦN NHẬP (INPUT WIREFRAME FIELDS)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Vui lòng điền đầy đủ các thông tin có dấu đỏ (*).
                </p>
              </div>

              <span className="text-xs text-slate-400 font-semibold">
                * Các trường có dấu (*) là bắt buộc
              </span>
            </div>

            {/* FORM INPUT GRID */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((fieldName, idx) => {
                  const fieldType = getFieldType(fieldName)
                  const required = isFieldRequired(fieldName)
                  const value = formData[fieldName] || ''
                  const hasError = !!validationErrors[fieldName]

                  return (
                    <div
                      key={idx}
                      className={fieldType === 'textarea' ? 'sm:col-span-2' : ''}
                    >
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                        <span className={hasError ? 'text-rose-600 dark:text-rose-400' : ''}>
                          {fieldName} {required && <span className="text-rose-500 font-bold">*</span>}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {fieldType}
                        </span>
                      </label>

                      {fieldType === 'select' ? (
                        <select
                          value={value}
                          onChange={(e) => handleInputChange(fieldName, e.target.value)}
                          className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 ${hasError
                            ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                            : isDarkMode
                              ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500/30'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-blue-500/30'
                            }`}
                        >
                          <option value="">-- Chọn {fieldName} --</option>
                          {getSelectOptions(fieldName).map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : fieldType === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={value}
                          onChange={(e) => handleInputChange(fieldName, e.target.value)}
                          placeholder={`Nhập ${fieldName.toLowerCase()}...`}
                          className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 ${hasError
                            ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                            : isDarkMode
                              ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500/30'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-blue-500/30'
                            }`}
                        />
                      ) : (
                        <input
                          type={fieldType}
                          value={value}
                          onChange={(e) => handleInputChange(fieldName, e.target.value)}
                          placeholder={`Nhập ${fieldName.toLowerCase()}...`}
                          className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 ${hasError
                            ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                            : isDarkMode
                              ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500 focus:ring-blue-500/30'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-blue-500/30'
                            }`}
                        />
                      )}

                      {hasError && (
                        <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{validationErrors[fieldName]}</span>
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* FILE ATTACHMENT DROPZONE SECTION */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Đính kèm Tài liệu / Hồ sơ liên quan (SOP Attachment)
                </label>

                {/* Dropzone mockup */}
                <div
                  onClick={handleAddMockFile}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group ${isDarkMode
                    ? 'border-slate-800 hover:border-blue-500 bg-slate-950/60 hover:bg-slate-950'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/80 hover:bg-blue-50/40'
                    }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Kéo thả tệp vào đây hoặc <span className="text-blue-600 dark:text-blue-400 underline">Bấm để tải lên</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hỗ trợ định dạng PDF, DOCX, PNG (Tối đa 15MB)
                  </p>
                </div>

                {/* Attached File List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {attachedFiles.map((file, fIdx) => (
                      <div
                        key={fIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <File className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span className="font-semibold truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(fIdx)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: BUSINESS RULES & APPROVAL MATRIX SIDEBAR */}
          <div className="space-y-6">

            {/* CARD 1: FORM VALIDATION CHECKLIST */}
            <div className={`rounded-2xl border p-5 space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>KIỂM TRA BẮT BUỘC (VALIDATION)</span>
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Tiến độ nhập trường bắt buộc:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold font-mono">
                    {filledRequiredCount} / {requiredFields.length}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                    style={{ width: `${requiredFields.length > 0 ? (filledRequiredCount / requiredFields.length) * 100 : 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1">
                {requiredFields.map((f, rIdx) => {
                  const isFilled = !!formData[f]
                  return (
                    <div
                      key={rIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${isFilled
                        ? isDarkMode ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                    >
                      <span className="font-semibold truncate">{f}</span>
                      {isFilled ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CARD 2: APPROVAL WORKFLOW PATH */}
            <div className={`rounded-2xl border p-5 space-y-4 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>LUỒNG PHÊ DUYỆT WORKFLOW</span>
              </h3>

              <div className="space-y-3 relative">
                {/* Flow 1 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Khởi tạo Form (Self-Service)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ứng viên / Nhân viên nhập hồ sơ ban đầu</p>
                  </div>
                </div>

                {/* Flow 2 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Rà soát C&B / Trưởng phòng</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Kiểm tra thông tin HĐLĐ & Mức đóng BHXH</p>
                  </div>
                </div>

                {/* Flow 3 */}
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Ban Giám Đốc Ký duyệt (BOM)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ký số phê duyệt & Cấp hiệu lực chính thức</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: AUDIT TRAIL LOG */}
            <div className={`rounded-2xl border p-5 space-y-3 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>NHẬT KÝ THAO TÁC</span>
              </h3>

              <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Khởi tạo Form:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Today, 14:35</span>
                </div>
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">HR_ADMIN_01</span>
                </div>
                <div className="flex justify-between">
                  <span>Mã hóa CSDL:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">AES-256 Enabled</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM STICKY ACTION FOOTER */}
        <div className={`sticky bottom-4 z-30 p-4 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
          }`}>
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới Form</span>
          </button>

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onBack}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>Lưu & Phê duyệt Form</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}
