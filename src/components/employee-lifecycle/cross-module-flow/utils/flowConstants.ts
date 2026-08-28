import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  CalendarCheck,
  DollarSign,
  Shield,
  Receipt,
  Smartphone,
  Target,
  ClipboardCheck,
  BrainCircuit,
  GraduationCap,
  Trophy,
  HeartHandshake,
  UsersRound,
  Network,
  BriefcaseBusiness,
  Building2,
  BarChart3,
  Layers,
  Sliders,
  GitMerge,
  FileText,
  FileSignature,
  Bell,
  ShieldCheck,
  History,
  Sparkles,
  Zap,
  RefreshCw,
  CalendarClock,
  type LucideIcon
} from 'lucide-react'
import type { FlowFrequency, FlowDirection, ConnectionKind, BusinessClusterId } from '../types'

export const FLOW_ICON_MAP: Record<string, LucideIcon> = {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  CalendarCheck,
  DollarSign,
  Shield,
  Receipt,
  Smartphone,
  Target,
  ClipboardCheck,
  BrainCircuit,
  GraduationCap,
  Trophy,
  HeartHandshake,
  UsersRound,
  Network,
  BriefcaseBusiness,
  Building2,
  BarChart3,
  Layers,
  Sliders,
  GitMerge,
  FileText,
  FileSignature,
  Bell,
  ShieldCheck,
  History,
  Sparkles,
  Zap,
  RefreshCw,
  CalendarClock
}

export const getFlowIcon = (iconName: string): LucideIcon => {
  return FLOW_ICON_MAP[iconName] || Layers
}

export const FREQUENCY_METADATA: Record<
  FlowFrequency,
  { label: string; labelEn: string; icon: LucideIcon; bg: string; text: string }
> = {
  realtime: {
    label: 'Thời gian thực',
    labelEn: 'Real-time',
    icon: Zap,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300'
  },
  'event-driven': {
    label: 'Theo sự kiện',
    labelEn: 'Event-driven',
    icon: Zap,
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300'
  },
  daily: {
    label: 'Hàng ngày',
    labelEn: 'Daily',
    icon: RefreshCw,
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300'
  },
  monthly: {
    label: 'Hàng tháng',
    labelEn: 'Monthly',
    icon: CalendarClock,
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300'
  },
  periodic: {
    label: 'Định kỳ chu kỳ',
    labelEn: 'Periodic',
    icon: CalendarClock,
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300'
  },
  'on-demand': {
    label: 'Theo yêu cầu',
    labelEn: 'On-demand',
    icon: RefreshCw,
    bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-300'
  }
}

export const DIRECTION_METADATA: Record<
  FlowDirection,
  { label: string; labelEn: string; bg: string; text: string }
> = {
  'one-way': {
    label: 'Luồng một chiều (Pipeline)',
    labelEn: 'One-way Pipeline',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300'
  },
  'two-way': {
    label: 'Đồng bộ hai chiều',
    labelEn: 'Two-way Sync',
    bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300'
  },
  feedback: {
    label: 'Vòng lặp phản hồi (Feedback Loop)',
    labelEn: 'Feedback Loop',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300'
  }
}

export const CONNECTION_KIND_METADATA: Record<
  ConnectionKind,
  { label: string; labelEn: string; color: string }
> = {
  'data-transfer': {
    label: 'Bàn giao dữ liệu',
    labelEn: 'Data Transfer',
    color: '#1f5f86'
  },
  dependency: {
    label: 'Quan hệ phụ thuộc',
    labelEn: 'Prerequisite Dependency',
    color: '#6366f1'
  },
  approval: {
    label: 'Phê duyệt chuyển tiếp',
    labelEn: 'Approval Routing',
    color: '#8b5cf6'
  },
  'shared-service': {
    label: 'Dịch vụ dùng chung',
    labelEn: 'Shared Service',
    color: '#0d9488'
  },
  feedback: {
    label: 'Phản hồi cải tiến',
    labelEn: 'Feedback Loop',
    color: '#d97706'
  }
}

export const CLUSTER_COLOR_THEMES: Record<
  BusinessClusterId,
  {
    primary: string
    accent: string
    bgLight: string
    bgDark: string
    borderLight: string
    borderDark: string
    tag: string
  }
> = {
  core: {
    primary: '#1f5f86',
    accent: '#0284c7',
    bgLight: 'bg-sky-50/50',
    bgDark: 'dark:bg-sky-950/20',
    borderLight: 'border-sky-200',
    borderDark: 'dark:border-sky-800',
    tag: 'Vận hành lõi'
  },
  people: {
    primary: '#059669',
    accent: '#10b981',
    bgLight: 'bg-emerald-50/50',
    bgDark: 'dark:bg-emerald-950/20',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800',
    tag: 'Phát triển con người'
  },
  organization: {
    primary: '#4f46e5',
    accent: '#6366f1',
    bgLight: 'bg-indigo-50/50',
    bgDark: 'dark:bg-indigo-950/20',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800',
    tag: 'Quản trị tổ chức'
  },
  platform: {
    primary: '#7c3aed',
    accent: '#8b5cf6',
    bgLight: 'bg-purple-50/50',
    bgDark: 'dark:bg-purple-950/20',
    borderLight: 'border-purple-200',
    borderDark: 'dark:border-purple-800',
    tag: 'Dịch vụ nền tảng'
  }
}
