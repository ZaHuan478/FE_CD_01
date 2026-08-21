import React from 'react'
import { useLanguage } from '../../../../../../context/LanguageContext'

interface InfographicStageNavTabsProps {
  sopCode: string
  activeStageTab: number
  setActiveStageTab: (tab: number) => void
}

export const InfographicStageNavTabs: React.FC<InfographicStageNavTabsProps> = ({
  sopCode,
  activeStageTab,
  setActiveStageTab
}) => {
  const { language } = useLanguage()

  const isRecruitmentProcess = sopCode.includes('REC') || sopCode.includes('SOP-TD') || sopCode.includes('EMP01') || sopCode.includes('EMP02') || sopCode.includes('LIFE-01')
  const isProbationProcess = !isRecruitmentProcess && (sopCode.includes('PROB') || sopCode.includes('EVAL') || sopCode.includes('EMP05') || sopCode.includes('EMP06') || sopCode.includes('LIFE-04') || sopCode.includes('SOP-NS-06'))
  const isPromotionProcess = !isRecruitmentProcess && !isProbationProcess && (sopCode.includes('PROM') || sopCode.includes('EMP08') || sopCode.includes('EMP11') || sopCode.includes('LIFE-05') || sopCode.includes('LIFE-03') || sopCode.includes('SOP-NS-09'))
  const isOffboardingProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && (sopCode.includes('OFF') || sopCode.includes('EMP15') || sopCode.includes('LIFE-07') || sopCode.includes('SOP-NS-16'))
  const isOvertimeProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && (sopCode.includes('ATT01') || sopCode.includes('SOP-CC-02') || sopCode.includes('OT'))
  const isLeaveProcess = !isRecruitmentProcess && !isProbationProcess && !isPromotionProcess && !isOffboardingProcess && !isOvertimeProcess

  const stagesList = [
    {
      num: 1,
      label: isRecruitmentProcess ? 'GĐ 1: Định biên' : isProbationProcess ? 'GĐ 1: Hạn 30 ngày' : isPromotionProcess ? 'GĐ 1: Khung ngạch bậc' : isOffboardingProcess ? 'GĐ 1: Báo trước thôi việc' : isOvertimeProcess ? 'GĐ 1: Hệ số lương' : 'GĐ 1: Báo trước',
      labelEn: isRecruitmentProcess ? 'Stage 1: Headcount' : isProbationProcess ? 'Stage 1: 30D Window' : isPromotionProcess ? 'Stage 1: Salary Scale' : isOffboardingProcess ? 'Stage 1: Notice Period' : isOvertimeProcess ? 'Stage 1: Pay Rate' : 'Stage 1: Pre-notice'
    },
    { num: 2, label: 'GĐ 2: AI Màng lọc', labelEn: 'Stage 2: AI Gates' },
    { num: 3, label: 'GĐ 3: Thao tác Portal/App', labelEn: 'Stage 3: Inputs' },
    {
      num: 4,
      label: isOffboardingProcess ? 'GĐ 4: Bàn giao 4 Bên' : isProbationProcess ? 'GĐ 4: Rẽ nhánh KPI' : isPromotionProcess ? 'GĐ 4: Rẽ nhánh Duyệt' : isLeaveProcess ? 'GĐ 4: Duyệt 5 Cấp' : 'GĐ 4: Duyệt 4 Cấp',
      labelEn: isOffboardingProcess ? 'Stage 4: 4-Party Handover' : isProbationProcess ? 'Stage 4: KPI Branching' : isPromotionProcess ? 'Stage 4: Approval Route' : isLeaveProcess ? 'Stage 4: 5-Level Approval' : 'Stage 4: 4-Level Approval'
    },
    { num: 5, label: 'GĐ 5: Kết quả & Lưu ý', labelEn: 'Stage 5: Outcomes' }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs">
      <button
        type="button"
        onClick={() => setActiveStageTab(0)}
        className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
          activeStageTab === 0
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        ⚡ {language === 'vi' ? 'Xem Toàn Bộ 5 Giai Đoạn' : 'Full 5-Stage Overview'}
      </button>
      {stagesList.map((stg) => (
        <button
          key={stg.num}
          type="button"
          onClick={() => setActiveStageTab(stg.num)}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeStageTab === stg.num
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>{language === 'vi' ? stg.label : stg.labelEn}</span>
        </button>
      ))}
    </div>
  )
}
