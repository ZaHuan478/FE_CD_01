import type { ReactNode } from 'react'

export type IllustrationPresetId =
  | 'auto'
  | 'recruitment'
  | 'onboarding'
  | 'training'
  | 'contract'
  | 'approval'
  | 'operations'
  | 'system'
  | 'decision'
  | 'milestone'

export const ILLUSTRATION_PRESETS: ReadonlyArray<{ id: IllustrationPresetId; label: string }> = [
  { id: 'auto', label: 'Tự động theo nội dung bước' },
  { id: 'recruitment', label: 'Tuyển dụng & Ứng viên' },
  { id: 'onboarding', label: 'Tiếp nhận & Hội nhập' },
  { id: 'training', label: 'Đào tạo & Nâng cao kỹ năng' },
  { id: 'contract', label: 'Hợp đồng & Pháp lý' },
  { id: 'approval', label: 'Phê duyệt & Đánh giá' },
  { id: 'operations', label: 'Vận hành & Nghiệp vụ chuẩn' },
  { id: 'system', label: 'Hệ thống IT & Phần mềm' },
  { id: 'decision', label: 'Phân nhánh & Điều kiện' },
  { id: 'milestone', label: 'Cột mốc Bắt đầu / Kết thúc' }
]

function renderRecruitment() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="rec_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="0.5" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="rec_card" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#rec_bg)" />
      <circle cx="280" cy="20" r="70" fill="#38bdf8" fillOpacity="0.15" />
      <circle cx="40" cy="120" r="50" fill="#0284c7" fillOpacity="0.2" />
      <g transform="translate(60, 24)">
        <rect x="0" y="0" width="130" height="92" rx="10" fill="url(#rec_card)" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="28" cy="32" r="16" fill="#38bdf8" fillOpacity="0.3" stroke="#7dd3fc" strokeWidth="1.5" />
        <path d="M28 26a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="#e0f2fe" />
        <path d="M19 44a9 9 0 0 1 18 0" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
        <rect x="52" y="24" width="62" height="6" rx="3" fill="#bae6fd" />
        <rect x="52" y="36" width="44" height="5" rx="2.5" fill="#7dd3fc" fillOpacity="0.6" />
        <rect x="16" y="56" width="98" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
        <rect x="16" y="66" width="76" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
        <rect x="16" y="76" width="54" height="4" rx="2" fill="#38bdf8" fillOpacity="0.4" />
      </g>
      <g transform="translate(196, 36)">
        <circle cx="36" cy="36" r="32" fill="#0284c7" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="16" stroke="#ffffff" strokeWidth="3" />
        <line x1="44" y1="44" x2="56" y2="56" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="3" fill="#38bdf8" />
      </g>
    </svg>
  )
}

function renderOnboarding() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="onb_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064e3b" />
          <stop offset="0.6" stopColor="#0f766e" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#onb_bg)" />
      <circle cx="40" cy="20" r="60" fill="#34d399" fillOpacity="0.15" />
      <circle cx="290" cy="110" r="70" fill="#2dd4bf" fillOpacity="0.2" />
      <g transform="translate(75, 30)">
        <rect x="20" y="8" width="130" height="74" rx="6" fill="#134e4a" stroke="#5eead4" strokeWidth="1.5" />
        <rect x="28" y="16" width="114" height="54" rx="3" fill="#042f2e" />
        <path d="M50 42l12 12 28-28" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 82h150a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z" fill="#2dd4bf" fillOpacity="0.7" />
      </g>
      <g transform="translate(216, 24)">
        <rect x="0" y="12" width="60" height="82" rx="8" fill="#ffffff" fillOpacity="0.18" stroke="#a7f3d0" strokeWidth="1.2" />
        <circle cx="30" cy="36" r="14" fill="#a7f3d0" fillOpacity="0.4" />
        <rect x="12" y="58" width="36" height="5" rx="2.5" fill="#e6fffa" />
        <rect x="18" y="68" width="24" height="4" rx="2" fill="#5eead4" />
        <path d="M26 0h8v12h-8z" fill="#fcd34d" />
      </g>
    </svg>
  )
}

function renderTraining() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="trn_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#31104b" />
          <stop offset="0.6" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#trn_bg)" />
      <circle cx="30" cy="30" r="50" fill="#c084fc" fillOpacity="0.15" />
      <circle cx="280" cy="120" r="80" fill="#a855f7" fillOpacity="0.2" />
      <g transform="translate(100, 22)">
        <polygon points="60,12 110,34 60,56 10,34" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1.5" />
        <polygon points="60,20 98,34 60,48 22,34" fill="#6b21a8" />
        <path d="M28 42v22c0 8 14 14 32 14s32-6 32-14V42" fill="#581c87" stroke="#e9d5ff" strokeWidth="1.2" />
        <path d="M106 36v32l-6-4" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 92c18-8 36-4 40 4 4-8 22-12 40-4v14c-18-8-36-4-40 4-4-8-22-12-40-4z" fill="#ffffff" fillOpacity="0.25" stroke="#e9d5ff" strokeWidth="1" />
      </g>
      <g transform="translate(225, 28)">
        <circle cx="24" cy="24" r="18" fill="#fbbf24" fillOpacity="0.25" />
        <circle cx="24" cy="24" r="10" fill="#fbbf24" />
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function renderContract() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ctr_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" />
          <stop offset="0.5" stopColor="#1e293b" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#ctr_bg)" />
      <circle cx="280" cy="30" r="70" fill="#94a3b8" fillOpacity="0.12" />
      <g transform="translate(85, 20)">
        <rect x="0" y="0" width="100" height="96" rx="6" fill="#f8fafc" fillOpacity="0.9" />
        <rect x="12" y="14" width="48" height="6" rx="3" fill="#0f172a" />
        <rect x="12" y="28" width="76" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="12" y="36" width="76" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="12" y="44" width="60" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="12" y="52" width="76" height="3" rx="1.5" fill="#cbd5e1" />
        <path d="M14 74c8-4 12 4 18 0s10-6 16 0" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="76" cy="72" r="12" fill="#ef4444" fillOpacity="0.85" />
        <circle cx="76" cy="72" r="8" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
      </g>
      <g transform="translate(200, 32)">
        <path d="M28 8L38 18 16 48 4 44z" fill="#38bdf8" />
        <polygon points="4,44 0,56 12,52" fill="#f59e0b" />
        <line x1="28" y1="8" x2="38" y2="18" stroke="#ffffff" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function renderApproval() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="app_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064e3b" />
          <stop offset="0.6" stopColor="#047857" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#app_bg)" />
      <circle cx="60" cy="30" r="50" fill="#a7f3d0" fillOpacity="0.15" />
      <circle cx="280" cy="110" r="70" fill="#6ee7b7" fillOpacity="0.2" />
      <g transform="translate(105, 18)">
        <circle cx="52" cy="52" r="44" fill="#ffffff" fillOpacity="0.15" stroke="#34d399" strokeWidth="3" />
        <circle cx="52" cy="52" r="36" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M34 52l12 12 24-24" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(225, 34)">
        <polygon points="20,2 24,12 35,13 26,20 29,30 20,24 11,30 14,20 5,13 16,12" fill="#fbbf24" />
      </g>
    </svg>
  )
}

function renderDecision() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="dec_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#78350f" />
          <stop offset="0.5" stopColor="#b45309" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#dec_bg)" />
      <circle cx="40" cy="20" r="60" fill="#fde68a" fillOpacity="0.15" />
      <circle cx="280" cy="120" r="70" fill="#fbbf24" fillOpacity="0.2" />
      <g transform="translate(100, 16)">
        <polygon points="56,6 102,52 56,98 10,52" fill="#fffbeb" fillOpacity="0.2" stroke="#fef3c7" strokeWidth="2.5" />
        <polygon points="56,18 90,52 56,86 22,52" fill="#92400e" fillOpacity="0.4" />
        <text x="56" y="60" fill="#ffffff" fontSize="24" fontWeight="bold" textAnchor="middle">?</text>
        <path d="M102 52h32M134 52v-24h18M134 52v24h18" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function renderOperations() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="ops_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0c4a6e" />
          <stop offset="0.5" stopColor="#0369a1" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#ops_bg)" />
      <circle cx="40" cy="30" r="60" fill="#38bdf8" fillOpacity="0.15" />
      <circle cx="280" cy="110" r="70" fill="#7dd3fc" fillOpacity="0.2" />
      <g transform="translate(70, 24)">
        <circle cx="42" cy="44" r="28" fill="#075985" stroke="#7dd3fc" strokeWidth="2" />
        <circle cx="42" cy="44" r="12" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
        <path d="M42 10v6M42 72v6M8 44h6M70 44h6M18 20l4 4M62 64l4 4M18 68l4-4M62 24l4-4" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(160, 22)">
        <rect x="0" y="0" width="80" height="92" rx="8" fill="#ffffff" fillOpacity="0.18" stroke="#bae6fd" strokeWidth="1.5" />
        <rect x="12" y="16" width="16" height="4" rx="2" fill="#7dd3fc" />
        <rect x="34" y="16" width="34" height="4" rx="2" fill="#ffffff" />
        <rect x="12" y="32" width="16" height="4" rx="2" fill="#7dd3fc" />
        <rect x="34" y="32" width="34" height="4" rx="2" fill="#ffffff" />
        <rect x="12" y="48" width="16" height="4" rx="2" fill="#7dd3fc" />
        <rect x="34" y="48" width="34" height="4" rx="2" fill="#ffffff" />
        <path d="M14 68l8 8 20-20" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function renderSystem() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="sys_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="0.5" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#sys_bg)" />
      <circle cx="270" cy="30" r="70" fill="#60a5fa" fillOpacity="0.15" />
      <g transform="translate(90, 22)">
        <rect x="10" y="4" width="120" height="24" rx="5" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="24" cy="16" r="3" fill="#22c55e" />
        <circle cx="34" cy="16" r="3" fill="#38bdf8" />
        <line x1="50" y1="16" x2="114" y2="16" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        <rect x="10" y="34" width="120" height="24" rx="5" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="24" cy="46" r="3" fill="#22c55e" />
        <circle cx="34" cy="46" r="3" fill="#38bdf8" />
        <line x1="50" y1="46" x2="114" y2="46" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

        <rect x="10" y="64" width="120" height="24" rx="5" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="24" cy="76" r="3" fill="#22c55e" />
        <circle cx="34" cy="76" r="3" fill="#38bdf8" />
        <line x1="50" y1="76" x2="114" y2="76" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function renderMilestone() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="mls_bg" x1="0" y1="0" x2="320" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#065f46" />
          <stop offset="0.5" stopColor="#047857" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#mls_bg)" />
      <circle cx="50" cy="20" r="50" fill="#a7f3d0" fillOpacity="0.15" />
      <circle cx="280" cy="110" r="70" fill="#6ee7b7" fillOpacity="0.2" />
      <g transform="translate(115, 24)">
        <line x1="28" y1="12" x2="28" y2="92" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <polygon points="28,14 84,34 28,54" fill="#fbbf24" stroke="#fef3c7" strokeWidth="1.5" />
        <circle cx="28" cy="12" r="6" fill="#f59e0b" />
        <ellipse cx="28" cy="92" rx="18" ry="4" fill="#042f2e" fillOpacity="0.4" />
      </g>
    </svg>
  )
}

export function renderPresetIllustration(preset: IllustrationPresetId): ReactNode {
  switch (preset) {
    case 'recruitment':
      return renderRecruitment()
    case 'onboarding':
      return renderOnboarding()
    case 'training':
      return renderTraining()
    case 'contract':
      return renderContract()
    case 'approval':
      return renderApproval()
    case 'decision':
      return renderDecision()
    case 'system':
      return renderSystem()
    case 'milestone':
      return renderMilestone()
    case 'operations':
    default:
      return renderOperations()
  }
}

export function detectIllustrationPreset(step: {
  title?: string | null
  nodeKind?: string | null
  typeCode?: string | null
  actor?: string | null
  description?: string | null
  illustrationPreset?: string | null
}): IllustrationPresetId {
  if (step.illustrationPreset && step.illustrationPreset !== 'auto') {
    return step.illustrationPreset as IllustrationPresetId
  }

  if (step.nodeKind === 'start' || step.nodeKind === 'end') {
    return 'milestone'
  }
  if (step.nodeKind === 'decision') {
    return 'decision'
  }

  const text = `${step.title ?? ''} ${step.description ?? ''} ${step.actor ?? ''}`.toLowerCase()

  if (/tuyển dụng|ứng viên|phỏng vấn|\bcv\b|sơ tuyển|tiếp cận|tìm nguồn/i.test(text)) {
    return 'recruitment'
  }
  if (/tiếp nhận|hội nhập|onboarding|nhận việc|bàn giao|chào đón|thẻ nv|trang bị/i.test(text)) {
    return 'onboarding'
  }
  if (/đào tạo|huấn luyện|hướng dẫn|khóa học|kỹ năng|training|bài giảng|thi cử/i.test(text)) {
    return 'training'
  }
  if (/hợp đồng|pháp lý|ký kết|thỏa thuận|chữ ký|điều khoản|cam kết|lao động/i.test(text)) {
    return 'contract'
  }
  if (/duyệt|phê duyệt|xét duyệt|trình ký|thẩm định|kpi|đánh giá|kiểm tra|nghiệm thu/i.test(text)) {
    return 'approval'
  }
  if (/hệ thống|phần mềm|tài khoản|email|\bit\b|cài đặt|phân quyền|server|dữ liệu/i.test(text)) {
    return 'system'
  }

  return 'operations'
}
