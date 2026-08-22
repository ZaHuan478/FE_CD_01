import React from 'react'
import { FileText } from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'

interface InfographicHeaderBannerProps {
  sopCode: string
  workflowId?: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}

export const InfographicHeaderBanner: React.FC<InfographicHeaderBannerProps> = ({
  sopCode,
  workflowId,
  isDarkMode,
  onOpenWireframe
}) => {
  const { language } = useLanguage()
  const flowKey = `${workflowId ?? ''} ${sopCode}`.toUpperCase()

  const isHeadcountProcess = flowKey.includes('LIFE-00') || flowKey.includes('EMP01') || flowKey.includes('SOP-EMP-01')
  const isRehireProcess = !isHeadcountProcess && (flowKey.includes('EMP03') || flowKey.includes('SOP-EMP-03') || flowKey.includes('REHIRE'))
  const isDirectOnboardingProcess = !isHeadcountProcess && !isRehireProcess && (flowKey.includes('EMP02') || flowKey.includes('SOP-EMP-02') || flowKey.includes('DIRECT'))
  const isRecruitmentProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && (flowKey.includes('LIFE-01') || flowKey.includes('REC') || flowKey.includes('ATS') || flowKey.includes('SOP-TD'))
  const isProfileProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && (flowKey.includes('LIFE-02') || flowKey.includes('EMP04') || flowKey.includes('SOP-NS-04') || flowKey.includes('PROFILE'))
  const isPlacementProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && (flowKey.includes('LIFE-03') || flowKey.includes('EMP11') || flowKey.includes('EMP14') || flowKey.includes('PLACEMENT') || flowKey.includes('POSITION') || flowKey.includes('MOBILITY'))
  const isProbationProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && (flowKey.includes('LIFE-04') || flowKey.includes('PROB') || flowKey.includes('EVAL') || flowKey.includes('EMP05') || flowKey.includes('EMP06') || flowKey.includes('EMP07') || flowKey.includes('INS') || flowKey.includes('SOP-NS-06'))
  const isPromotionProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && (flowKey.includes('LIFE-05') || flowKey.includes('PAY') || flowKey.includes('TAX') || flowKey.includes('SAL') || flowKey.includes('PROM') || flowKey.includes('EMP08') || flowKey.includes('EMP09') || flowKey.includes('EMP10') || flowKey.includes('EMP12') || flowKey.includes('EMP13') || flowKey.includes('SOP-NS-09'))
  const isOffboardingProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && !isPromotionProcess && (flowKey.includes('LIFE-07') || flowKey.includes('OFF') || flowKey.includes('EMP15') || flowKey.includes('EXIT') || flowKey.includes('RESIGN') || flowKey.includes('SOP-NS-16'))
  const isOvertimeProcess = !isHeadcountProcess && !isRehireProcess && !isDirectOnboardingProcess && !isRecruitmentProcess && !isProfileProcess && !isPlacementProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (flowKey.includes('ATT01') || flowKey.includes('SOP-CC-02') || flowKey.includes('OT'))

  const badgeText = isHeadcountProcess
    ? 'LIFE-00 · Headcount Planning'
    : isProfileProcess
      ? 'LIFE-02 · Employee Profile'
      : isPlacementProcess
        ? 'LIFE-03 · Work Placement'
        : isRehireProcess
          ? 'SOP EMP03 · Rehire'
          : isDirectOnboardingProcess
            ? 'SOP EMP02 · Direct Onboarding'
            : isRecruitmentProcess
              ? 'LIFE-01 · Recruitment'
              : isProbationProcess
                ? 'LIFE-04 · Probation & Contract'
                : isPromotionProcess
                  ? 'LIFE-05 · Salary & Promotion'
                  : isOffboardingProcess
                    ? 'LIFE-07 · Offboarding'
                    : isOvertimeProcess
                      ? 'SOP ATT01 · Overtime'
                      : 'SOP LEAVE01 · Leave'

  const titleText = isHeadcountProcess
    ? (language === 'vi' ? 'Quy trinh lap va phe duyet dinh bien nhan su 12 thang' : '12-month headcount planning and approval')
    : isProfileProcess
      ? (language === 'vi' ? 'Quy trinh hoan thien ho so nhan su so' : 'Employee profile digitization workflow')
      : isPlacementProcess
        ? (language === 'vi' ? 'Quy trinh bo tri cong tac va vi tri lam viec' : 'Work placement and position assignment workflow')
        : isRehireProcess
          ? (language === 'vi' ? 'Quy trinh tuyen lai nhan vien cu voi ma nhan vien cu' : 'Rehire former employee with legacy employee ID')
          : isDirectOnboardingProcess
            ? (language === 'vi' ? 'Quy trinh tiep nhan truc tiep va danh gia thu viec' : 'Direct onboarding and probation evaluation')
            : isRecruitmentProcess
              ? (language === 'vi' ? 'Quy trinh yeu cau va phe duyet tuyen dung' : 'Recruitment requisition and approval')
              : isProbationProcess
                ? (language === 'vi' ? 'Quy trinh danh gia thu viec va tai ky hop dong' : 'Probation evaluation and contract renewal')
                : isPromotionProcess
                  ? (language === 'vi' ? 'Quy trinh dieu chinh luong va bo nhiem thang chuc' : 'Salary review and promotion workflow')
                  : isOffboardingProcess
                    ? (language === 'vi' ? 'Quy trinh thoi viec va ban giao 4 ben' : 'Offboarding and four-party handover')
                    : isOvertimeProcess
                      ? (language === 'vi' ? 'Quy trinh dang ky va phe duyet tang ca' : 'Overtime registration and approval')
                      : (language === 'vi' ? 'Quy trinh dang ky nghi phep tren HRMS' : 'HRMS leave approval workflow')

  const subtitleText = language === 'vi'
    ? 'Huong dan 5 giai doan: can nhap gi, ai xac nhan, he thong cap nhat dau va ket qua cuoi cung la gi.'
    : 'Five-stage guide: required data, approvers, updated systems, and final outcome.'

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border shadow-md relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border-blue-900/50 text-white'
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-800 text-white'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 text-xs font-mono font-extrabold bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/40">
              SOP VISUAL GUIDE
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/30 text-amber-200 rounded-full border border-amber-400/40">
              {badgeText}
            </span>
          </div>

          <h2 className="text-base sm:text-xl font-black tracking-tight leading-snug">
            {titleText}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {subtitleText}
          </p>
        </div>

        {onOpenWireframe && (
          <button
            type="button"
            onClick={onOpenWireframe}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white transition-colors shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'vi' ? 'Mo man hinh mau' : 'Open sample screen'}</span>
          </button>
        )}
      </div>
    </div>
  )
}
