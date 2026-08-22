import React from 'react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileCheck2,
  GitBranch,
  ShieldCheck,
  UserRoundCheck,
  UsersRound
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps } from '../types'

interface LifecycleFoundationFlowProps extends FlowStageProps {
  workflowId?: string
}

export const LifecycleFoundationFlow: React.FC<LifecycleFoundationFlowProps> = ({
  workflowId,
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()
  const isPlacementFlow = workflowId === 'LIFE-03'

  const stages = isPlacementFlow
    ? [
        {
          icon: BriefcaseBusiness,
          color: 'bg-blue-600',
          title: language === 'vi' ? 'Chon vi tri lam viec' : 'Select working position',
          desc: language === 'vi'
            ? 'Gan nhan vien vao phong ban, chuc danh, cost center va quan ly truc tiep.'
            : 'Assign department, job title, cost center, and direct manager.',
          checks: ['Position', 'Cost center', 'Line manager']
        },
        {
          icon: ShieldCheck,
          color: 'bg-indigo-600',
          title: language === 'vi' ? 'Kiem tra dinh bien' : 'Validate headcount slot',
          desc: language === 'vi'
            ? 'Doi chieu vi tri voi dinh bien da duyet de tranh vuot ngan sach nhan su.'
            : 'Match the position against approved headcount to avoid budget overflow.',
          checks: ['Headcount slot', 'Grade band', 'Budget owner']
        },
        {
          icon: GitBranch,
          color: 'bg-teal-600',
          title: language === 'vi' ? 'Phe duyet bo tri' : 'Approve placement',
          desc: language === 'vi'
            ? 'Quan ly va HR xac nhan noi lam viec, nguoi phu trach va ngay hieu luc.'
            : 'Manager and HR confirm work location, reporting line, and effective date.',
          checks: ['Manager approval', 'HR approval', 'Effective date']
        },
        {
          icon: DatabaseZap,
          color: 'bg-amber-600',
          title: language === 'vi' ? 'Dong bo he thong' : 'Sync HRMS systems',
          desc: language === 'vi'
            ? 'Cap nhat so do to chuc, cham cong, payroll va quyen truy cap lien quan.'
            : 'Update org chart, attendance, payroll, and related access rights.',
          checks: ['Org chart', 'Attendance', 'Payroll']
        },
        {
          icon: CheckCircle2,
          color: 'bg-emerald-600',
          title: language === 'vi' ? 'Hoan tat vi tri' : 'Placement completed',
          desc: language === 'vi'
            ? 'Nhan vien co vi tri chinh thuc, quan ly ro rang va du lieu san sang van hanh.'
            : 'Employee has an official position, clear manager, and operational data.',
          checks: ['Ready for work', 'Traceable owner', 'Audit log']
        }
      ]
    : [
        {
          icon: FileCheck2,
          color: 'bg-blue-600',
          title: language === 'vi' ? 'Thu thap ho so' : 'Collect employee profile',
          desc: language === 'vi'
            ? 'Nhan vien/HR cap nhat thong tin ca nhan, chung tu va tep dinh kem can thiet.'
            : 'Employee or HR updates personal information, documents, and attachments.',
          checks: ['Personal data', 'Identity files', 'Bank info']
        },
        {
          icon: ClipboardCheck,
          color: 'bg-indigo-600',
          title: language === 'vi' ? 'Doi soat thong tin' : 'Validate information',
          desc: language === 'vi'
            ? 'Kiem tra CCCD, ma so thue, tai khoan ngan hang va truong bat buoc.'
            : 'Check ID, tax code, bank account, and required fields.',
          checks: ['ID number', 'Tax code', 'Required fields']
        },
        {
          icon: UserRoundCheck,
          color: 'bg-teal-600',
          title: language === 'vi' ? 'HR xac nhan ho so' : 'HR confirms profile',
          desc: language === 'vi'
            ? 'HR duyet ho so, ghi nhan ngoai le va khoa ban ghi du dieu kien.'
            : 'HR approves the profile, records exceptions, and locks the approved record.',
          checks: ['HR approval', 'Exception note', 'Record lock']
        },
        {
          icon: DatabaseZap,
          color: 'bg-amber-600',
          title: language === 'vi' ? 'Dong bo danh muc lien quan' : 'Sync related systems',
          desc: language === 'vi'
            ? 'Day du lieu sang hop dong, cham cong, payroll, thue va bao hiem khi can.'
            : 'Send data to contract, attendance, payroll, tax, and insurance when needed.',
          checks: ['Contract', 'Payroll', 'Tax/insurance']
        },
        {
          icon: BadgeCheck,
          color: 'bg-emerald-600',
          title: language === 'vi' ? 'Ho so san sang su dung' : 'Profile ready to use',
          desc: language === 'vi'
            ? 'Tao employee master record day du de cac quy trinh tiep theo dung chung.'
            : 'Create a complete employee master record for downstream workflows.',
          checks: ['Employee record', 'Reusable data', 'Audit trail']
        }
      ]

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
    }`}>
      <div className="flex flex-col gap-1.5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-300">
          <UsersRound className="w-4 h-4" />
          <span>{isPlacementFlow ? 'LIFE-03' : 'LIFE-02'} Visual Guide</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          {isPlacementFlow
            ? (language === 'vi' ? 'Bo tri cong tac va vi tri lam viec' : 'Work placement and position assignment')
            : (language === 'vi' ? 'Hoan thien ho so nhan su so' : 'Employee profile digitization')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'vi'
            ? 'Ban do nay gom 5 moc de nguoi dung thay ro can nhap gi, ai xac nhan va du lieu se cap nhat vao dau.'
            : 'This guide shows what data is entered, who confirms it, and where the result is updated.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 pt-4">
        {stages.map((stage, idx) => {
          const stageNumber = idx + 1
          if (activeStageTab !== 0 && activeStageTab !== stageNumber) return null
          const Icon = stage.icon

          return (
            <div
              key={stage.title}
              className={`rounded-2xl border p-4 space-y-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl ${stage.color} text-white flex items-center justify-center shadow-xs`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500">
                  GĐ {stageNumber}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                  {stage.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5">
                  {stage.desc}
                </p>
              </div>

              <div className="space-y-1.5">
                {stage.checks.map((check) => (
                  <div key={check} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
