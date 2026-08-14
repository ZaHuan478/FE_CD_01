import React from 'react'
import { ChevronRight, UserPlus, FileCheck, MapPin, FileSignature, CircleDollarSign, Activity, UserMinus, Sparkles } from 'lucide-react'
import type { LifecycleStep } from '../../types/employee-lifecycle'

interface LifecycleStepperProps {
  steps: LifecycleStep[]
  activeStepId?: string
  onSelectStep: (id: string) => void
}

const getStepIcon = (code: string) => {
  switch (code) {
    case '01': return <UserPlus className="w-4 h-4" />
    case '02': return <FileCheck className="w-4 h-4" />
    case '03': return <MapPin className="w-4 h-4" />
    case '04': return <FileSignature className="w-4 h-4" />
    case '05': return <CircleDollarSign className="w-4 h-4" />
    case '06': return <Activity className="w-4 h-4" />
    case '07': return <UserMinus className="w-4 h-4" />
    default: return <Sparkles className="w-4 h-4" />
  }
}

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  steps,
  activeStepId,
  onSelectStep
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 transition-all duration-300 hover:shadow-md">
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 rounded-md border border-blue-200/60">
              Layer 2 · Main Pipeline Flow
            </span>
            <span className="text-xs text-slate-500 font-medium">7 Tuần tự Nghiệp vụ</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (MAIN EMPLOYEE LIFECYCLE)
          </h2>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Tiếp nhận</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Tạo hồ sơ</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Nghỉ việc & Đóng HS</span>
        </div>
      </div>

      {/* Pipeline Stepper Container */}
      <div className="relative pt-2 pb-1 overflow-x-auto">
        
        {/* Continuous Pipeline Connector Line */}
        <div className="absolute top-[36px] left-[40px] right-[40px] h-[3px] bg-slate-200 -z-0 hidden md:block" />

        {/* Stepper Grid (7 steps) */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-w-[760px] md:min-w-0 relative z-10">
          {steps.map((step, idx) => {
            const isActive = activeStepId === step.id
            const stepIcon = getStepIcon(step.code)

            return (
              <div key={step.id} className="flex flex-col items-center group">
                <button
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`w-full flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform -translate-y-1'
                      : 'bg-slate-50/80 hover:bg-white text-slate-700 border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  {/* Step Number & Icon Circle */}
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs mb-2.5 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 border border-slate-200/80'
                    }`}
                  >
                    {stepIcon}
                  </div>

                  {/* Step Number Code */}
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${
                    isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-600'
                  }`}>
                    Bước {idx + 1} · {step.id}
                  </span>

                  {/* Title */}
                  <h3 className={`text-xs font-bold leading-tight mb-1 line-clamp-2 ${
                    isActive ? 'text-white' : 'text-slate-900 group-hover:text-blue-700'
                  }`}>
                    {step.title}
                  </h3>

                  {/* Subtitle */}
                  <span className={`text-[11px] leading-tight line-clamp-1 mb-2 ${
                    isActive ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {step.subtitle}
                  </span>

                  {/* SOP Badge Tag */}
                  {step.sopBadge && (
                    <span className={`mt-auto px-2 py-0.5 text-[9px] font-mono font-bold rounded border transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border-white/40'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100'
                    }`}>
                      📋 {step.sopBadge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400 font-medium italic">
          * Tiến trình diễn ra tuần tự từ Tiếp nhận (LIFE-01) ➔ Thiết lập Hồ sơ & Hợp đồng ➔ Theo dõi làm việc ➔ Nghỉ việc & Kết thúc (LIFE-07)
        </p>
      </div>
    </div>
  )
}
