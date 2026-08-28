import React from 'react'
import {
  Globe,
  MapPin,
  Building2,
  Clock,
  Wallet,
  FileText,
  ShieldCheck,
  Search,
  Network,
  BookOpen,
  Database,
  Filter,
  ClipboardList,
  UserRound,
  GitBranch,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle
} from 'lucide-react'
import type { CatalogStatus } from '../masterDataCatalogAdapter'

// ────────────────────────────────────────────────────────────────────────────
// ICON MAP
// ────────────────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  MapPin,
  Building2,
  Clock,
  Wallet,
  FileText,
  ShieldCheck,
  Search,
  Network,
  BookOpen,
  Database,
  Filter,
  ClipboardList,
  UserRound,
  GitBranch
}

export function DomainIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Database
  return <Icon className={className} aria-hidden="true" />
}

// ────────────────────────────────────────────────────────────────────────────
// COLOR HELPERS
// ────────────────────────────────────────────────────────────────────────────

export type ColorKey = 'blue' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'purple' | 'slate' | 'red'

const BG_LIGHT: Record<ColorKey, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  red: 'bg-red-50 text-red-700 border-red-200'
}

const BG_DARK: Record<ColorKey, string> = {
  blue: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
  emerald: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  indigo: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
  amber: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  rose: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  purple: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
  slate: 'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  red: 'dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60'
}

export function colorBadge(color: string): string {
  const c = color as ColorKey
  return `${BG_LIGHT[c] ?? BG_LIGHT.slate} ${BG_DARK[c] ?? BG_DARK.slate}`
}

export function statusIcon(status: CatalogStatus) {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
    case 'upcoming':
      return <Clock3 className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
    case 'legacy':
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
    case 'deprecated':
      return <XCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
  }
}
