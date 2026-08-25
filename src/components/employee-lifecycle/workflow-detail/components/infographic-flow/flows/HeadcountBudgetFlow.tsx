import React, { useState, useEffect } from 'react'
import {
  Users,
  GitPullRequest,
  CheckCircle2,
  Database,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Printer,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  BookOpen,
  HelpCircle,
  Clock
} from 'lucide-react'
import { useLanguage } from '../../../../../../context/LanguageContext'
import type { FlowStageProps } from '../types'

interface StepDetail {
  code: string
  title: string
  titleEn: string
  role: string
  roleEn: string
  roleBadge: string
  action: string
  actionEn: string
  inputs: string[]
  outputs: string[]
  documents: string[]
  rules: string[]
  simpleExplain: string
  fromStep?: string
  toStep?: string
}

const STEP_DETAILS: Record<string, StepDetail> = {
  'EMP01.01': {
    code: 'EMP01.01',
    title: 'Thiết lập định biên nhân sự',
    titleEn: 'Headcount Budget Setup',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Lập kế hoạch nhu cầu nhân sự 12 tháng theo chiến lược phòng ban',
    actionEn: 'Plan 12-month headcount requirements based on departmental goals',
    inputs: ['Chiến lược kinh doanh năm', 'Cơ cấu tổ chức hiện tại', 'Chỉ tiêu KPI & Doanh thu'],
    outputs: ['Bản dự thảo Định biên nhân sự 12 tháng', 'File tính People Cost'],
    documents: ['Gửi mail / In file trình duyệt', 'Biểu mẫu BM-EMP-01'],
    rules: ['Bắt buộc đủ 6 trường dữ liệu chuẩn', 'Tuân thủ trần chi phí People Cost phân bổ'],
    simpleExplain: 'Trưởng phòng tính toán xem năm tới phòng mình cần bao nhiêu người, từng tháng cần tuyển ai và tốn bao nhiêu tiền lương.',
    toStep: 'Gửi bảng kế hoạch xuống cho Giám đốc Nhân sự (HRD) tham vấn (EMP01.02)'
  },
  'EMP01.02': {
    code: 'EMP01.02',
    title: 'Tham vấn định biên nhân sự',
    titleEn: 'Headcount Consultation & Verification',
    role: 'HRM - HRD (Trưởng phòng / GĐ Nhân sự)',
    roleEn: 'HR Manager / HR Director',
    roleBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    action: 'Thẩm định tính hợp lý, đối chiếu ngạch bậc & năng lực cung ứng ứng viên',
    actionEn: 'Assess feasibility, cross-check salary scales & talent market supply',
    inputs: ['Bản dự thảo từ TBP', 'Khung Ngạch Bậc MD-07', 'Báo cáo biến động nhân sự quá khứ'],
    outputs: ['Ý kiến thẩm định HR', 'Phiếu thẩm định định biên'],
    documents: ['Biên bản tham vấn nhân sự', 'Email phản hồi TBP'],
    rules: ['Nếu không đồng ý -> Yêu cầu TBP điều chỉnh (EMP01.03)', 'Nếu đồng ý -> Trình BOM phê duyệt (EMP01.04)'],
    simpleExplain: 'HRD xem xét kế hoạch có hợp lý không: Lương có đúng ngạch bậc không, thị trường có dễ tuyển không.',
    fromStep: 'Nhận từ Trưởng phòng nộp lên (EMP01.01)',
    toStep: 'Rẽ 2 nhánh: Nếu Đồng ý ➔ Trình Ban Giám Đốc (EMP01.04); Nếu Chưa ổn ➔ Trả lại Trưởng phòng sửa (EMP01.03)'
  },
  'EMP01.03': {
    code: 'EMP01.03',
    title: 'Điều chỉnh định biên nhân sự',
    titleEn: 'Headcount Adjustment',
    role: 'TBP (Trưởng bộ phận)',
    roleEn: 'Department Head',
    roleBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    action: 'Hiệu chỉnh số lượng nhân sự hoặc phân bổ các tháng theo góp ý của HRD',
    actionEn: 'Adjust headcount numbers or timeline allocations based on HRD feedback',
    inputs: ['Ý kiến thẩm định của HRD', 'Bản kế hoạch cũ'],
    outputs: ['Bản định biên đã điều chỉnh v2'],
    documents: ['Email giải trình điều chỉnh', 'File kế hoạch cập nhật'],
    rules: ['Gửi lại HRD tham vấn lần 2 trước khi chuyển BOM'],
    simpleExplain: 'Trưởng phòng tiếp thu ý kiến góp ý của HRD, sửa lại số lượng hoặc tháng cần tuyển rồi nộp lại.',
    fromStep: 'Nhận yêu cầu sửa từ HRD (EMP01.02)',
    toStep: 'Nộp lại bản đã sửa cho HRD xem xét lần 2 (EMP01.02)'
  },
  'EMP01.04': {
    code: 'EMP01.04',
    title: 'Duyệt định biên nhân sự (BOM Decision)',
    titleEn: 'Board of Management Approval',
    role: 'BOM (Ban Giám Đốc)',
    roleEn: 'Board of Management',
    roleBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    action: 'Ban Giám Đốc ra quyết định phê duyệt chính thức hạn mức ngân sách',
    actionEn: 'Executive board makes final approval on headcount quotas & budgets',
    inputs: ['Tờ trình thẩm định từ HRD', 'Tổng hợp People Cost toàn công ty'],
    outputs: ['Nghị quyết / Quyết định ban hành Định biên chính thức'],
    documents: ['Gửi mail thông báo phê duyệt', 'Chữ ký số phê duyệt BOM'],
    rules: ['Nếu Không duyệt -> Quay lại HRD tham vấn lại', 'Nếu Đồng ý -> Chuyển C&B cập nhật kết quả'],
    simpleExplain: 'Ban Giám Đốc họp quyết định phê duyệt ngân sách và số lượng người chính thức cho cả năm.',
    fromStep: 'Nhận từ HRD trình duyệt (EMP01.02)',
    toStep: 'Nếu Duyệt ➔ Chuyển C&B cài vào hệ thống (EMP01.05); Nếu Không duyệt ➔ Quay lại HRD tham vấn lại'
  },
  'EMP01.05': {
    code: 'EMP01.05',
    title: 'Cập nhật kết quả duyệt vào hệ thống',
    titleEn: 'Master Data Setup & Activation',
    role: 'HRM - Nhân sự (C&B / Quản trị Master Data)',
    roleEn: 'C&B / Master Data Admin',
    roleBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    action: 'Cấu hình chỉ tiêu vào Master Data HRMS làm trần chặn tuyển dụng & tính lương',
    actionEn: 'Configure approved quotas into HRMS Master Data as hiring & payroll cap',
    inputs: ['Quyết định phê duyệt BOM', 'File Master Định biên chuẩn'],
    outputs: ['Hệ số trần tuyển dụng khả dụng trên Portal', 'Master Data EMP01 Active'],
    documents: ['In File lưu trữ hồ sơ công ty', 'Biên bản khóa sổ định biên'],
    rules: ['Tuyệt đối không cấp mã NV nếu vượt trần định biên đã duyệt'],
    simpleExplain: 'C&B nhập số liệu đã duyệt vào phần mềm làm "trần chặn": Sau này phòng ban nào tuyển vượt số lượng sẽ bị phần mềm tự động từ chối.',
    fromStep: 'Nhận quyết định phê duyệt từ Ban Giám Đốc (EMP01.04)',
    toStep: 'Hoàn tất quy trình ➔ Khóa sổ định biên năm'
  }
}

export const HeadcountBudgetFlow: React.FC<FlowStageProps> = ({
  activeStageTab,
  isDarkMode
}) => {
  const { language } = useLanguage()

  const [selectedStep, setSelectedStep] = useState<string>('EMP01.01')
  // Story mode is the first view so a non-technical reader sees the business sequence first.
  // The detailed swimlane and data schema remain available as deliberate secondary views.
  const [activeTabMode, setActiveTabMode] = useState<'swimlane' | 'story' | 'specs'>('story')
  const [simulationScenario, setSimulationScenario] = useState<'happy' | 'adjust' | null>(null)
  const [simActiveStep, setSimActiveStep] = useState<string | null>(null)

  // Sync selectedStep with activeStageTab prop
  useEffect(() => {
    if (activeStageTab === 1) setSelectedStep('EMP01.01')
    else if (activeStageTab === 2) setSelectedStep('EMP01.02')
    else if (activeStageTab === 3) setSelectedStep('EMP01.03')
    else if (activeStageTab === 4) setSelectedStep('EMP01.04')
    else if (activeStageTab === 5) setSelectedStep('EMP01.05')
  }, [activeStageTab])

  // Simulation runner
  const runSimulation = (scenario: 'happy' | 'adjust') => {
    setSimulationScenario(scenario)
    if (scenario === 'happy') {
      const sequence = ['START', 'EMP01.01', 'EMP01.02', 'EMP01.04', 'EMP01.05', 'END']
      sequence.forEach((step, idx) => {
        setTimeout(() => {
          setSimActiveStep(step)
          if (step.startsWith('EMP')) setSelectedStep(step)
          if (idx === sequence.length - 1) {
            setTimeout(() => setSimulationScenario(null), 1500)
          }
        }, idx * 1200)
      })
    } else {
      const sequence = ['START', 'EMP01.01', 'EMP01.02', 'EMP01.03', 'EMP01.02', 'EMP01.04', 'EMP01.05', 'END']
      sequence.forEach((step, idx) => {
        setTimeout(() => {
          setSimActiveStep(step)
          if (step.startsWith('EMP')) setSelectedStep(step)
          if (idx === sequence.length - 1) {
            setTimeout(() => setSimulationScenario(null), 1500)
          }
        }, idx * 1200)
      })
    }
  }

  const currentStepData = STEP_DETAILS[selectedStep] || STEP_DETAILS['EMP01.01']

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TIMELINE SUMMARY BANNER */}
      <div className={`p-4 rounded-2xl border transition-colors shadow-2xs ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200/80'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'vi' ? 'TIẾN TRÌNH 4 BƯỚC THIẾT LẬP ĐỊNH BIÊN (DỄ HIỂU TRONG 30 GIÂY)' : '4-STEP HEADCOUNT BUDGET TIMELINE'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'vi' ? 'Trưởng phòng lập ➔ Nhân sự góp ý ➔ Ban Giám Đốc duyệt ➔ Cài trần chặn vào phần mềm' : 'Dept Head plans ➔ HR reviews ➔ Board approves ➔ System locks quotas'}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Simple Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-blue-600 dark:text-blue-400">BƯỚC 1 · TBP</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Lập kế hoạch 12 tháng</p>
            <span className="text-[10px] text-slate-400">Số lượng & Quỹ lương</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-purple-600 dark:text-purple-400">BƯỚC 2 · HRD</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Tham vấn & Thẩm định</p>
            <span className="text-[10px] text-slate-400">So khớp khung ngạch bậc</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-amber-600 dark:text-amber-400">BƯỚC 3 · BOM</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Ban Giám Đốc Phê duyệt</p>
            <span className="text-[10px] text-slate-400">Chốt ngân sách chính thức</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="font-mono font-black text-[10px] text-emerald-600 dark:text-emerald-400">BƯỚC 4 · C&B</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Khóa trần định biên</p>
            <span className="text-[10px] text-slate-400">Tự động chặn tuyển vượt</span>
          </div>
        </div>
      </div>

      {/* TOP CONTROL TOOLBAR: VIEW TOGGLE & SIMULATION CONTROLS */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTabMode('swimlane')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'swimlane'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'vi' ? 'Sơ Đồ Phân Làn 4 Cấp (Có Dây Nối Trực Quan)' : '4-Swimlane Flowchart View'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('story')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'story'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>{language === 'vi' ? '📖 Hướng Dẫn Kể Chuyện (Ai Đọc Cũng Hiểu)' : 'Plain Story Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('specs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTabMode === 'specs'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                : 'bg-white hover:bg-slate-100/80 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'vi' ? 'Đặc Tả 6 Trường Dữ Liệu & Quy Tắc' : 'Data Schema & 6 Fields'}</span>
          </button>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider mr-1 hidden sm:inline">
            {language === 'vi' ? 'Chạy Thử:' : 'Simulate:'}
          </span>
          <button
            type="button"
            onClick={() => runSimulation('happy')}
            disabled={simulationScenario !== null}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '▶ Luồng Thuận (Duyệt ngay)' : '▶ Happy Path'}</span>
          </button>
          <button
            type="button"
            onClick={() => runSimulation('adjust')}
            disabled={simulationScenario !== null}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? '🔄 Luồng Rẽ Nhánh (Có điều chỉnh)' : '🔄 Adjustment Loop'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 4-SWIMLANE FLOWCHART CANVAS */}
      {activeTabMode === 'swimlane' && (
        <div className="space-y-6">
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{language === 'vi' ? '(EMP01) LƯU ĐỒ QUY TRÌNH THIẾT LẬP ĐỊNH BIÊN NHÂN SỰ' : '(EMP01) HEADCOUNT BUDGET PLANNING FLOWCHART'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'vi' ? 'Sơ đồ phân làn 4 cấp trách nhiệm · Nhấp vào từng nút để xem chi tiết nghiệp vụ và giải thích bình dân' : '4-Role Swimlane layout · Click any node to view plain explanations'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Swimlane Engine Active</span>
              </div>
            </div>

            {/* SWIMLANE 4-LANE CONTAINER */}
            <div className="overflow-x-auto no-scrollbar pb-2">
              <div className="min-w-[860px] border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner">
                
                {/* LANE 1: TBP (TRƯỞNG BỘ PHẬN) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-blue-50/20 dark:bg-blue-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-blue-100/50 dark:bg-blue-900/30 text-center">
                    <span className="text-sm font-black text-blue-900 dark:text-blue-200 tracking-wider">1. TBP</span>
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mt-1">Trưởng Bộ Phận</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">Dept Head</span>
                  </div>

                  <div className="col-span-10 p-4 relative flex items-center justify-between gap-6">
                    {/* Node 1: Start Pill */}
                    <div className="flex items-center gap-3">
                      <div className={`px-3.5 py-1.5 rounded-full border-2 font-black text-xs transition-all shadow-xs ${
                        simActiveStep === 'START'
                          ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-300 animate-pulse'
                          : 'bg-emerald-600 text-white border-emerald-700'
                      }`}>
                        Bắt đầu
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                      {/* Node 2: EMP01.01 */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP01.01')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                            selectedStep === 'EMP01.01' || simActiveStep === 'EMP01.01'
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-4 ring-blue-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              EMP01.01
                            </span>
                            <Users className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Thiết lập định biên</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP01.01' ? 'text-blue-100' : 'text-slate-500'}`}>
                            Xây dựng kế hoạch 12 tháng
                          </p>
                        </button>

                        {/* Document Output Branch & Downward Connector label */}
                        <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                          <div className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-300 text-[10px] font-bold text-purple-800 dark:text-purple-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                            <ArrowDown className="w-3 h-3 text-purple-600" />
                            <span>Gửi mail trình HRD ⬇ (EMP01.02)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Node: EMP01.03 (Adjustment Step on Lane 1) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP01.03')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-52 shadow-xs ${
                          selectedStep === 'EMP01.03' || simActiveStep === 'EMP01.03'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-4 ring-purple-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            EMP01.03
                          </span>
                          <GitPullRequest className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Điều chỉnh định biên</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP01.03' ? 'text-purple-100' : 'text-slate-500'}`}>
                          Sửa lại theo góp ý của HRD
                        </p>
                      </button>

                      <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-300 text-[10px] font-bold text-blue-800 dark:text-blue-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                          <ArrowDown className="w-3 h-3 text-blue-600" />
                          <span>Gửi lại HRD xem ⬇ (EMP01.02)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 2: HRM - HRD (TRƯỞNG PHÒNG / GIÁM ĐỐC NHÂN SỰ) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-purple-50/20 dark:bg-purple-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-purple-100/50 dark:bg-purple-900/30 text-center">
                    <span className="text-sm font-black text-purple-900 dark:text-purple-200 tracking-wider">2. HRM - HRD</span>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 mt-1">Giám Đốc Nhân Sự</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">HR Director</span>
                  </div>

                  <div className="col-span-10 p-4 relative flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 pl-32">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSelectedStep('EMP01.02')}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-56 shadow-xs ${
                            selectedStep === 'EMP01.02' || simActiveStep === 'EMP01.02'
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-4 ring-indigo-300 scale-105'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:shadow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              EMP01.02 (Tham vấn)
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
                          </div>
                          <h4 className="text-xs font-black leading-tight">Tham vấn định biên</h4>
                          <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP01.02' ? 'text-indigo-100' : 'text-slate-500'}`}>
                            Đối soát ngân sách & ngạch bậc
                          </p>
                        </button>

                        <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                          <div className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                            <ArrowDown className="w-3 h-3 text-emerald-600" />
                            <span>Đồng ý ➔ Trình BOM ⬇ (EMP01.04)</span>
                          </div>
                        </div>
                      </div>

                      {/* Decision Branch: Không đồng ý -> Lên EMP01.03 */}
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 text-[11px] font-bold text-rose-700 dark:text-rose-300 shadow-2xs">
                        <ArrowUp className="w-3.5 h-3.5 text-rose-500" />
                        <span>Chưa đồng ý ➔ Trả TBP sửa ⬆ (EMP01.03)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LANE 3: BOM (BAN GIÁM ĐỐC) */}
                <div className="grid grid-cols-12 border-b-2 border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-amber-100/50 dark:bg-amber-900/30 text-center">
                    <span className="text-sm font-black text-amber-900 dark:text-amber-200 tracking-wider">3. BOM</span>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mt-1">Ban Giám Đốc</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">Board of Management</span>
                  </div>

                  <div className="col-span-10 p-4 relative flex items-center justify-start gap-8 pl-32">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP01.04')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left w-56 shadow-xs relative ${
                          selectedStep === 'EMP01.04' || simActiveStep === 'EMP01.04'
                            ? 'bg-amber-500 text-white border-amber-400 shadow-md ring-4 ring-amber-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            EMP01.04 (Phê duyệt)
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Duyệt định biên (Decision)</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP01.04' ? 'text-amber-100' : 'text-slate-500'}`}>
                          Chốt hạn mức ngân sách năm
                        </p>
                      </button>

                      {/* Notice Document Branch (Dashed) */}
                      <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                          <ArrowDown className="w-3 h-3 text-emerald-600" />
                          <span>Duyệt ➔ Chuyển C&B khóa Master ⬇ (EMP01.05)</span>
                        </div>
                      </div>
                    </div>

                    {/* Reject Loop Back Info */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 text-[11px] font-bold text-rose-700 dark:text-rose-300 shadow-2xs">
                      <ArrowUp className="w-3.5 h-3.5 text-rose-500" />
                      <span>Không duyệt ➔ Quay lại HRD tham vấn ⬆ (EMP01.02)</span>
                    </div>
                  </div>
                </div>

                {/* LANE 4: HRM - NHÂN SỰ (C&B / MASTER DATA) */}
                <div className="grid grid-cols-12 bg-emerald-50/20 dark:bg-emerald-950/10 min-h-[145px]">
                  <div className="col-span-2 border-r-2 border-slate-300 dark:border-slate-700 p-4 flex flex-col items-center justify-center bg-emerald-100/50 dark:bg-emerald-900/30 text-center">
                    <span className="text-sm font-black text-emerald-900 dark:text-emerald-200 tracking-wider">4. HRM-Nhân sự</span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">C&B / Quản trị Hệ Thống</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">Master Data Admin</span>
                  </div>

                  <div className="col-span-10 p-4 relative flex items-center justify-start gap-8 pl-32">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedStep('EMP01.05')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left w-56 shadow-xs ${
                          selectedStep === 'EMP01.05' || simActiveStep === 'EMP01.05'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-4 ring-emerald-300 scale-105'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            EMP01.05 (Hệ Thống)
                          </span>
                          <Database className="w-3.5 h-3.5 opacity-70" />
                        </div>
                        <h4 className="text-xs font-black leading-tight">Cập nhật kết quả duyệt</h4>
                        <p className={`text-[10px] mt-0.5 ${selectedStep === 'EMP01.05' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Khóa trần chặn tuyển dụng
                        </p>
                      </button>

                      <div className="absolute -bottom-8 left-2 flex items-center gap-1">
                        <div className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                          <Printer className="w-3 h-3 text-emerald-600" />
                          <span>In File lưu trữ hồ sơ công ty</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 shrink-0 ml-16" />

                    {/* Node End Pill */}
                    <div className={`px-4 py-2 rounded-full border-2 font-black text-xs transition-all shadow-xs ${
                      simActiveStep === 'END'
                        ? 'bg-rose-500 text-white border-rose-400 ring-4 ring-rose-300 animate-pulse'
                        : 'bg-slate-700 text-white border-slate-800'
                    }`}>
                      Kết thúc
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* STEP INSPECTOR DRAWER / DETAILS CARD */}
          {currentStepData && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 border-2 border-blue-500/40 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs shadow-2xs">
                    {currentStepData.code}
                  </span>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {language === 'vi' ? currentStepData.title : currentStepData.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? currentStepData.action : currentStepData.actionEn}
                    </p>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${currentStepData.roleBadge}`}>
                  👤 {language === 'vi' ? currentStepData.role : currentStepData.roleEn}
                </div>
              </div>

              {/* Plain-language explanation box */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200">
                    💡 {language === 'vi' ? 'Hiểu đơn giản về bước này:' : 'Plain Explanation:'}
                  </span>{' '}
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {currentStepData.simpleExplain}
                  </span>
                </div>
              </div>

              {/* Data Flow Direction */}
              {(currentStepData.fromStep || currentStepData.toStep) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {currentStepData.fromStep && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">⬅ Nhận từ:</span>
                      <span className="truncate">{currentStepData.fromStep}</span>
                    </div>
                  )}
                  {currentStepData.toStep && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">➡ Chuyển tới:</span>
                      <span className="truncate">{currentStepData.toStep}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                {/* Inputs */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{language === 'vi' ? 'Dữ liệu Đầu vào (Inputs)' : 'Inputs'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.inputs.map((inp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-500">•</span>
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs & Documents */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{language === 'vi' ? 'Kết quả & Biểu mẫu (Outputs)' : 'Outputs & Docs'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.outputs.map((out, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">✓</span>
                        <span>{out}</span>
                      </li>
                    ))}
                    {currentStepData.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                        <span>📄</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rules & Conditions */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-extrabold uppercase text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>{language === 'vi' ? 'Quy tắc Nghiệp vụ (Rules)' : 'Business Rules'}</span>
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {currentStepData.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-500">⚡</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PLAIN STORY MODE */}
      {activeTabMode === 'story' && (
        <div className={`p-5 sm:p-7 rounded-3xl border space-y-6 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span>{language === 'vi' ? 'QUY TRÌNH THIẾT LẬP ĐỊNH BIÊN NHÂN SỰ DƯỚI DẠNG KỂ CHUYỆN (4 BƯỚC)' : 'PLAIN LANGUAGE STORY: 4 SIMPLE STEPS'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi' ? 'Cách hiểu đơn giản nhất về việc lập kế hoạch người & tiền lương cho cả năm' : 'Easiest explanation of yearly headcount & budget planning'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  1
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Trưởng Phòng Lập Dự Thảo 12 Tháng
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Đầu năm, mỗi Trưởng phòng tính xem năm nay phòng mình cần bao nhiêu người, tuyển vào tháng nào và quỹ lương cần bao nhiêu tiền rồi gửi mail trình duyệt.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  2
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Giám Đốc Nhân Sự (HRD) Thẩm Định
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                HRD xem xét lại dải lương có đúng quy định công ty không và tư vấn điều chỉnh nếu có điểm chưa hợp lý trước khi trình Ban Giám Đốc.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  3
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Ban Giám Đốc Ra Quyết Định Duyệt
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Ban Giám Đốc họp xem xét tổng thể toàn công ty và ra quyết định phê duyệt chính thức hạn mức ngân sách tuyển dụng cho từng phòng ban.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                  4
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  C&B Khóa Trần Chặn Tuyển Dụng
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Số liệu đã duyệt được nạp vào phần mềm HRMS. Trong năm, nếu phòng ban nào yêu cầu tuyển thêm vượt quá số lượng này, phần mềm sẽ tự động chặn lại.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DATA SCHEMA & 6 MANDATORY FIELDS BREAKDOWN */}
      {activeTabMode === 'specs' && (
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>{language === 'vi' ? '6 TRƯỜNG DỮ LIỆU BẮT BUỘC TRONG ĐỊNH BIÊN NHÂN SỰ' : '6 MANDATORY FIELDS IN HEADCOUNT PLANNING'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'vi' ? 'Cấu trúc biểu mẫu chuẩn BM-EMP-01 theo tiêu chuẩn Enterprise' : 'Standard BM-EMP-01 form structure according to Enterprise HR standards'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            {[
              { num: '01', title: 'Năm xây dựng', titleEn: 'Planning Year', desc: 'Năm tài chính áp dụng kế hoạch định biên (Ví dụ: 2026)', icon: '📅' },
              { num: '02', title: 'Phòng ban / Đơn vị', titleEn: 'Department / Division', desc: 'Đơn vị hành chính cấp phòng ban/bộ phận trong Org Chart', icon: '🏢' },
              { num: '03', title: 'Chức vụ / Vị trí', titleEn: 'Job Position', desc: 'Danh mục vị trí công việc theo chuẩn Job Catalog của công ty', icon: '💼' },
              { num: '04', title: 'Cấp độ (Level / Grade)', titleEn: 'Job Grade Level', desc: 'Phân bậc trình độ (L1 -> L7) tương ứng Khung ngạch bậc MD-07', icon: '🎯' },
              { num: '05', title: 'Phân bổ 12 Tháng', titleEn: '12-Month Allocation', desc: 'Số lượng nhân sự kế hoạch chi tiết từ Tháng 1 đến Tháng 12', icon: '📊' },
              { num: '06', title: 'Thu nhập / People Cost', titleEn: 'Budget & People Cost', desc: 'Mức lương trần và tổng quỹ thu nhập dự kiến cho từng vị trí', icon: '💰' }
            ].map((f) => (
              <div key={f.num} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{f.icon}</span>
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Trường {f.num}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {language === 'vi' ? f.title : f.titleEn}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Hard Business Rules */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-amber-700 dark:text-amber-300 uppercase text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>3 NGUYÊN TẮC KIỂM SOÁT ĐỊNH BIÊN BẮT BUỘC (MÀNG LỌC TỰ ĐỘNG):</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">1.</span>
                <span><strong>Chặn tuyển dụng vượt hạn mức:</strong> Hệ thống tự động từ chối tạo Phiếu yêu cầu tuyển dụng (REC01) nếu số lượng nhân sự vượt quá định biên tháng đã được BOM phê duyệt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">2.</span>
                <span><strong>Khóa dải lương theo People Cost:</strong> Mức lương offer cho ứng viên không được vượt trần ngân sách thu nhập đã cấu hình trong Master Data EMP01.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">3.</span>
                <span><strong>Kiểm soát bổ sung ngoại lệ:</strong> Mọi nhu cầu tuyển ngoài định biên đều bắt buộc phải có Tờ trình điều chỉnh định biên (EMP01.03) được BOM phê duyệt trước khi đăng tuyển.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
