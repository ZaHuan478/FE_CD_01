import React, { useState, useEffect } from 'react'
import { X, Save, CheckCircle2, FileText, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react'
import type { DetailItem } from '../../types/employee-lifecycle'

interface WireframeFormModalProps {
  isOpen: boolean
  onClose: () => void
  item: DetailItem | null
}

export const WireframeFormModal: React.FC<WireframeFormModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSaved, setIsSaved] = useState(false)

  // Reset form when item changes or modal opens
  useEffect(() => {
    if (item) {
      const initial: Record<string, string> = {}
      const fields = item.uiFields && item.uiFields.length > 0
        ? item.uiFields
        : ['Họ và tên', 'Mã nhân viên', 'Đơn vị / Phòng ban', 'Vị trí công tác', 'Ngày áp dụng', 'Ghi chú nghiệp vụ']

      fields.forEach((field) => {
        if (field.toLowerCase().includes('ngày')) {
          initial[field] = new Date().toISOString().split('T')[0]
        } else {
          initial[field] = ''
        }
      })
      setFormData(initial)
      setIsSaved(false)
    }
  }, [item, isOpen])

  if (!isOpen || !item) return null

  const fields = item.uiFields && item.uiFields.length > 0
    ? item.uiFields
    : ['Họ và tên', 'Mã nhân viên', 'Đơn vị / Phòng ban', 'Vị trí công tác', 'Ngày áp dụng', 'Ghi chú nghiệp vụ']

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 4000)
  }

  // Determine field type & options helper
  const getFieldType = (fieldName: string) => {
    const lower = fieldName.toLowerCase()
    if (lower.includes('ngày') || lower.includes('thời gian') || lower.includes('hiệu lực')) {
      return 'date'
    }
    if (lower.includes('loại') || lower.includes('vị trí') || lower.includes('đơn vị') || lower.includes('nguồn') || lower.includes('trạng thái') || lower.includes('chức danh') || lower.includes('mức độ') || lower.includes('hợp đồng') || lower.includes('phòng ban')) {
      return 'select'
    }
    if (lower.includes('ghi chú') || lower.includes('mô tả') || lower.includes('nguyên nhân') || lower.includes('hồ sơ bàn giao') || lower.includes('thay đổi')) {
      return 'textarea'
    }
    if (lower.includes('lương') || lower.includes('hệ số') || lower.includes('mức') || lower.includes('chi phí') || lower.includes('số lượng') || lower.includes('cccd') || lower.includes('ngày sinh')) {
      return 'number'
    }
    return 'text'
  }

  const getSelectOptions = (fieldName: string): string[] => {
    const lower = fieldName.toLowerCase()
    if (lower.includes('vị trí') || lower.includes('chức danh')) {
      return ['Chuyên viên HR', 'Trưởng phòng Nhân sự', 'Kế toán trưởng', 'Kỹ sư phần mềm', 'Giám đốc khối']
    }
    if (lower.includes('đơn vị') || lower.includes('phòng ban')) {
      return ['Ban Giám Đốc', 'Khối Nhân sự (HR)', 'Khối Tài chính Kế toán', 'Khối Công nghệ Thông tin', 'Khối Vận hành']
    }
    if (lower.includes('nguồn')) {
      return ['Tuyển dụng trực tiếp', 'Nội bộ giới thiệu', 'Headhunter', 'Website Công ty', 'LinkedIn']
    }
    if (lower.includes('loại') || lower.includes('hợp đồng')) {
      return ['HĐLD Xác định thời hạn (12 tháng)', 'HĐLD Không xác định thời hạn', 'Hợp đồng Thử việc (2 tháng)', 'Phụ lục Hợp đồng']
    }
    if (lower.includes('trạng thái')) {
      return ['Chờ duyệt (Pending)', 'Đã phê duyệt (Approved)', 'Yêu cầu bổ sung', 'Khởi tạo mới']
    }
    return ['Tùy chọn A', 'Tùy chọn B', 'Tùy chọn C']
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">

        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white font-mono text-xs font-bold shadow-xs">
              {item.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  FORM INTERACTIVE WIREFRAME MOCKUP
                </span>
                {item.sopIds && item.sopIds.length > 0 && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    📋 {item.sopIds[0]}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                Mô phỏng Giao diện Form Thực tế: {item.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Governance SOP Context Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 border-b border-slate-700/80 text-xs text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Quy chuẩn Form tuân theo: <strong className="text-white">{item.sopTitles?.[0] || 'Quy trình Chuẩn HR SaaS Enterprise'}</strong>
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
            Field Schema v1.0
          </span>
        </div>

        {/* Success Alert Toast */}
        {isSaved && (
          <div className="m-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-xs">Lưu dữ liệu mẫu thành công!</div>
                <div className="text-[11px] text-emerald-700">Đã cập nhật bản ghi sơ khảo cho nghiệp vụ {item.title}.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSaved(false)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Các trường dữ liệu cần nhập (Input Wireframe Fields)
            </div>
            <span className="text-xs text-slate-400 italic">* Các trường có dấu (*) là bắt buộc</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, idx) => {
              const fieldType = getFieldType(field)
              const isRequired = idx === 0 || idx === 1 || field.toLowerCase().includes('ngày')

              return (
                <div
                  key={idx}
                  className={`flex flex-col space-y-1.5 ${
                    fieldType === 'textarea' ? 'sm:col-span-2' : ''
                  }`}
                >
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      {field} {isRequired && <span className="text-rose-500">*</span>}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal uppercase">
                      {fieldType}
                    </span>
                  </label>

                  {/* Render based on field type */}
                  {fieldType === 'select' ? (
                    <select
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Chọn {field.toLowerCase()} --</option>
                      {getSelectOptions(field).map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : fieldType === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Nhập nội dung ${field.toLowerCase()}...`}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-800"
                    />
                  ) : fieldType === 'date' ? (
                    <div className="relative">
                      <input
                        type="date"
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-800"
                      />
                    </div>
                  ) : (
                    <input
                      type={fieldType === 'number' ? 'text' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Nhập ${field.toLowerCase()}...`}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-800"
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Form Upload & Attachment Mockup Section */}
          <div className="pt-3">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Đính kèm Tài liệu / Hồ sơ liên quan (SOP Attachment)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
              <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-700">Kéo thả tệp vào đây hoặc Bấm để tải lên</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ PDF, DOCX, PNG (Tối đa 15MB)</div>
            </div>
          </div>
        </form>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setFormData({})
              setIsSaved(false)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới Form</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu & Phê duyệt Form</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
