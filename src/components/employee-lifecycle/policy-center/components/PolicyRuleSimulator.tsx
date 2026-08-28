import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  Calendar,
  Clock,
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  simulateLeavePolicy,
  simulateOvertimePolicy,
  simulateLateEarlyPolicy
} from '../utils/policySelectors'
import type {
  LeaveSimulatorInput,
  OvertimeSimulatorInput,
  LateEarlySimulatorInput
} from '../types'
import { useLanguage } from '../../../../context/LanguageContext'

interface PolicyRuleSimulatorProps {
  initialTab?: 'leave' | 'overtime' | 'late-early'
  onClose?: () => void
}

export const PolicyRuleSimulator: React.FC<PolicyRuleSimulatorProps> = ({
  initialTab = 'leave',
  onClose
}) => {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<'leave' | 'overtime' | 'late-early'>(initialTab)

  // 1. Leave State
  const initialLeaveInput: LeaveSimulatorInput = {
    days: 2,
    advanceNoticeDays: 5,
    isApproved: true
  }
  const [leaveInput, setLeaveInput] = useState<LeaveSimulatorInput>(initialLeaveInput)
  const leaveResult = useMemo(() => simulateLeavePolicy(leaveInput), [leaveInput])

  // 2. OT State
  const initialOtInput: OvertimeSimulatorInput = {
    hoursRequested: 2,
    dailyTotalHours: 1,
    monthlyTotalHours: 20,
    yearlyTotalHours: 80,
    isUrgent: false,
    hoursSinceUrgentEvent: 4,
    urgentRequestsThisMonth: 1
  }
  const [otInput, setOtInput] = useState<OvertimeSimulatorInput>(initialOtInput)
  const otResult = useMemo(() => simulateOvertimePolicy(otInput), [otInput])

  // 3. Late/Early State
  const initialLateEarlyInput: LateEarlySimulatorInput = {
    minutes: 25,
    hasApprovedRequest: true
  }
  const [lateEarlyInput, setLateEarlyInput] = useState<LateEarlySimulatorInput>(initialLateEarlyInput)
  const lateEarlyResult = useMemo(() => simulateLateEarlyPolicy(lateEarlyInput), [lateEarlyInput])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-[#1f5f86] to-sky-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {language === 'vi' ? 'Công cụ Mô phỏng Quy tắc HRMS (Rule Simulator)' : 'HRMS Policy Rule Simulator'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'vi'
                ? 'Thử nghiệm các tình huống nộp đơn để kiểm tra phản hồi tức thì của hệ thống kiểm soát.'
                : 'Test real-time system responses against various leave, overtime, and attendance scenarios.'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {language === 'vi' ? 'Đóng mô phỏng' : 'Close Simulator'}
          </button>
        )}
      </div>

      {/* Simulator Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('leave')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'leave'
              ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>POL-ATT-01: Nghỉ phép</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overtime')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'overtime'
              ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>POL-ATT-02: Tăng ca (OT)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('late-early')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
            activeTab === 'late-early'
              ? 'bg-[#1f5f86] text-white border-[#1f5f86] shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>POL-ATT-03: Đi trễ / Về sớm</span>
        </button>
      </div>

      {/* TAB A: LEAVE SIMULATOR */}
      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                1. Thông số đăng ký nghỉ phép
              </span>
              <button
                type="button"
                onClick={() => setLeaveInput(initialLeaveInput)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Số ngày muốn xin nghỉ (ngày):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="30"
                  value={leaveInput.days}
                  onChange={(e) => setLeaveInput({ ...leaveInput, days: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Khung quy định: ≤1 ngày: báo trước 24h; 1.5–3 ngày: báo trước 5 ngày; &gt;3 ngày: báo trước 15 ngày.
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Số ngày gửi đơn báo trước (ngày):
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="60"
                  value={leaveInput.advanceNoticeDays}
                  onChange={(e) => setLeaveInput({ ...leaveInput, advanceNoticeDays: parseInt(e.target.value, 10) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={leaveInput.isApproved}
                    onChange={(e) => setLeaveInput({ ...leaveInput, isApproved: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1f5f86] focus:ring-[#1f5f86] border-slate-300 dark:border-slate-600"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Quản lý đã phê duyệt đơn trước thời điểm nghỉ
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Kết quả kiểm soát của hệ thống
              </div>

              {/* Status Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  leaveResult.statusBadge === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : leaveResult.statusBadge === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {leaveResult.statusBadge === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-black text-xs sm:text-sm">
                    {leaveResult.statusText}
                  </div>
                  <div className="text-xs mt-1 space-y-1">
                    {leaveResult.messages.map((msg, idx) => (
                      <p key={idx} className="leading-relaxed font-medium">
                        • {msg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
              Quy tắc áp dụng: POL-ATT-01 (Mục 2: Thời hạn báo trước; Mục 3: Tự động hủy đơn chưa duyệt).
            </div>
          </div>
        </div>
      )}

      {/* TAB B: OVERTIME SIMULATOR */}
      {activeTab === 'overtime' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                1. Thông số đăng ký Tăng ca (OT)
              </span>
              <button
                type="button"
                onClick={() => setOtInput(initialOtInput)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Số giờ OT đăng ký lần này:
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12"
                    value={otInput.hoursRequested}
                    onChange={(e) => setOtInput({ ...otInput, hoursRequested: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    OT đã tích lũy trong ngày:
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="8"
                    value={otInput.dailyTotalHours}
                    onChange={(e) => setOtInput({ ...otInput, dailyTotalHours: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tổng OT tích lũy tháng (giờ):
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={otInput.monthlyTotalHours}
                    onChange={(e) => setOtInput({ ...otInput, monthlyTotalHours: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                  />
                  <span className="text-[10px] text-slate-500">Trần tối đa 40h/tháng</span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tổng OT tích lũy năm (giờ):
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="300"
                    value={otInput.yearlyTotalHours}
                    onChange={(e) => setOtInput({ ...otInput, yearlyTotalHours: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                  />
                  <span className="text-[10px] text-slate-500">Trần tối đa 200h/năm</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={otInput.isUrgent}
                    onChange={(e) => setOtInput({ ...otInput, isUrgent: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1f5f86] focus:ring-[#1f5f86] border-slate-300 dark:border-slate-600"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Đây là ca OT đột xuất / phát sinh ngoài kế hoạch
                  </span>
                </label>

                {otInput.isUrgent && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1 pl-6">
                    <div>
                      <label className="font-semibold text-[11px] text-slate-600 dark:text-slate-300 block mb-1">
                        Số giờ từ lúc phát sinh:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="72"
                        value={otInput.hoursSinceUrgentEvent}
                        onChange={(e) => setOtInput({ ...otInput, hoursSinceUrgentEvent: parseInt(e.target.value, 10) || 0 })}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-bold"
                      />
                      <span className="text-[10px] text-slate-500">Quy định ≤ 12 giờ</span>
                    </div>
                    <div>
                      <label className="font-semibold text-[11px] text-slate-600 dark:text-slate-300 block mb-1">
                        Số lần trễ trong tháng:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={otInput.urgentRequestsThisMonth}
                        onChange={(e) => setOtInput({ ...otInput, urgentRequestsThisMonth: parseInt(e.target.value, 10) || 0 })}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-bold"
                      />
                      <span className="text-[10px] text-slate-500">Giới hạn ≤ 3 lần</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Kết quả kiểm soát của hệ thống
              </div>

              {/* Status Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  otResult.isValid
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {otResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-black text-xs sm:text-sm">
                    {otResult.statusText}
                  </div>
                  <div className="text-xs mt-1 space-y-1">
                    {otResult.messages.map((msg, idx) => (
                      <p key={idx} className="leading-relaxed font-medium">
                        • {msg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
              Quy tắc áp dụng: POL-ATT-02 (Tối đa 4h/ngày, 40h/tháng, 200h/năm; OT đột xuất trong 12h, max 3 lần/tháng).
            </div>
          </div>
        </div>
      )}

      {/* TAB C: LATE / EARLY SIMULATOR */}
      {activeTab === 'late-early' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                1. Thông số đi trễ / về sớm
              </span>
              <button
                type="button"
                onClick={() => setLateEarlyInput(initialLateEarlyInput)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Số phút đi trễ hoặc về sớm (phút):
                </label>
                <input
                  type="number"
                  min="0"
                  max="240"
                  step="5"
                  value={lateEarlyInput.minutes}
                  onChange={(e) => setLateEarlyInput({ ...lateEarlyInput, minutes: parseInt(e.target.value, 10) || 0 })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#1f5f86]"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Thang điểm: 0-10m (1đ), &gt;10-30m (2đ), &gt;30-60m (4đ), &gt;60-120m (6đ), &gt;120m (Cảnh báo).
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lateEarlyInput.hasApprovedRequest}
                    onChange={(e) => setLateEarlyInput({ ...lateEarlyInput, hasApprovedRequest: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1f5f86] focus:ring-[#1f5f86] border-slate-300 dark:border-slate-600"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Đã tạo đơn xin phép và được Quản lý duyệt trước
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Kết quả tính mức tham chiếu KPI
              </div>

              {/* Status Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  lateEarlyResult.statusBadge === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : lateEarlyResult.statusBadge === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {lateEarlyResult.statusBadge === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-black text-xs sm:text-sm">
                    {lateEarlyResult.statusText}
                  </div>
                  <div className="text-xs mt-1 space-y-1">
                    {lateEarlyResult.messages.map((msg, idx) => (
                      <p key={idx} className="leading-relaxed font-medium">
                        • {msg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
              Quy tắc áp dụng: POL-ATT-03 (Mức tham chiếu theo quy định demo).
            </div>
          </div>
        </div>
      )}

      {/* Required Disclaimer */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-2 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-4 h-4 text-[#1f5f86] dark:text-sky-400 shrink-0 mt-0.5" />
        <span className="font-medium">
          {language === 'vi'
            ? 'Tuyên bố miễn trừ: Kết quả chỉ dùng để minh họa quy tắc trong bản demo, không phải quyết định nhân sự chính thức.'
            : 'Disclaimer: Results are for demonstration purposes only and do not represent formal HR disciplinary actions.'}
        </span>
      </div>
    </div>
  )
}
