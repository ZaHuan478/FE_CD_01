import React from 'react'
import { useLanguage } from '../../../../../../context/LanguageContext'

interface InfographicStageNavTabsProps {
  sopCode: string
  workflowId?: string
  activeStageTab: number
  setActiveStageTab: (tab: number) => void
}

export const InfographicStageNavTabs: React.FC<InfographicStageNavTabsProps> = ({
  sopCode,
  workflowId,
  activeStageTab,
  setActiveStageTab
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

  const labels = isProfileProcess
    ? ['Thu thap ho so', 'Doi soat', 'HR xac nhan', 'Dong bo', 'Hoan tat']
    : isPlacementProcess
      ? ['Chon vi tri', 'Kiem tra dinh bien', 'Phe duyet', 'Dong bo', 'San sang lam viec']
      : isHeadcountProcess
        ? ['Thiet lap', 'Tham van', 'Dieu chinh', 'Phe duyet', 'Cap nhat']
        : isRehireProcess
          ? ['Giu ma cu', 'Mo lai IT', 'Giao KPI', 'Danh gia', 'Hop dong/BHXH']
          : isDirectOnboardingProcess
            ? ['Nhan viec', 'Co so & IT', 'Giao KPI', 'Danh gia', 'Hop dong']
            : isRecruitmentProcess
              ? ['Dinh bien', 'Yeu cau', 'Phe duyet', 'Tuyen chon', 'Nhan viec']
              : isProbationProcess
                ? ['Han danh gia', 'Nhap KPI', 'Quan ly duyet', 'Ket qua', 'Hop dong']
                : isPromotionProcess
                  ? ['De xuat', 'Doi chieu', 'Tham dinh', 'Phe duyet', 'Cap nhat']
                  : isOffboardingProcess
                    ? ['Thong bao', 'Kiem tra', 'Ban giao', 'Xac nhan', 'Dong ho so']
                    : isOvertimeProcess
                      ? ['Nhu cau OT', 'Dang ky', 'Quan ly duyet', 'Cham cong', 'Tinh luong']
                      : ['Bao truoc', 'Kiem tra', 'Nhap don', 'Phe duyet', 'Ket qua']

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold shadow-sm">
      <button
        type="button"
        onClick={() => setActiveStageTab(0)}
        className={`px-3 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap ${
          activeStageTab === 0
            ? 'bg-[#1f5f86] text-white border-[#1f5f86]'
            : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700'
        }`}
      >
        {language === 'vi' ? 'Xem toan bo 5 giai doan' : 'Full 5-stage overview'}
      </button>

      {labels.map((label, idx) => {
        const stageNum = idx + 1
        const isTabActive = activeStageTab === stageNum
        return (
          <button
            key={label}
            type="button"
            onClick={() => setActiveStageTab(stageNum)}
            className={`px-3 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap ${
              isTabActive
                ? 'bg-[#1f5f86] text-white border-[#1f5f86]'
                : 'bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-700'
            }`}
          >
            <span>{language === 'vi' ? `GD ${stageNum}: ${label}` : `S${stageNum}: ${label}`}</span>
          </button>
        )
      })}
    </div>
  )
}
