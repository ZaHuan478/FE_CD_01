import { UserPlus, FileCheck, MapPin, FileSignature, CircleDollarSign, Activity, UserMinus, Sparkles } from 'lucide-react'

export interface ClusterConfig {
  id: string
  title: string
  badgeText: string
  stepIds: string[]
  stepNumbers: number[]
  colSpan: string
  subGridCols: string
  bgClass: string
  borderClass: string
  headerTextClass: string
  headerBadgeClass: string
  sopBadgeColor: string
}

export const getStepIcon = (idOrCode: string) => {
  if (idOrCode.includes('00') || idOrCode.endsWith('0')) return <Sparkles className="w-4 h-4" />
  if (idOrCode.includes('01') || idOrCode.endsWith('1')) return <UserPlus className="w-4 h-4" />
  if (idOrCode.includes('02') || idOrCode.endsWith('2')) return <FileCheck className="w-4 h-4" />
  if (idOrCode.includes('03') || idOrCode.endsWith('3')) return <MapPin className="w-4 h-4" />
  if (idOrCode.includes('04') || idOrCode.endsWith('4')) return <FileSignature className="w-4 h-4" />
  if (idOrCode.includes('05') || idOrCode.endsWith('5')) return <CircleDollarSign className="w-4 h-4" />
  if (idOrCode.includes('06') || idOrCode.endsWith('6')) return <Activity className="w-4 h-4" />
  if (idOrCode.includes('07') || idOrCode.endsWith('7')) return <UserMinus className="w-4 h-4" />
  return <Sparkles className="w-4 h-4" />
}

export const CLUSTERS: ClusterConfig[] = [
  {
    id: 'cluster-0',
    title: 'HOẠCH ĐỊNH & ĐỊNH BIÊN',
    badgeText: 'CỤM 0 · 1 BƯỚC',
    stepIds: ['LIFE-00'],
    stepNumbers: [0],
    colSpan: 'lg:col-span-1',
    subGridCols: 'grid-cols-1',
    bgClass: 'bg-cyan-50/50 dark:bg-cyan-950/30',
    borderClass: 'border-cyan-200/80 dark:border-cyan-900/50',
    headerTextClass: 'text-cyan-900 dark:text-cyan-300',
    headerBadgeClass: 'bg-cyan-100/80 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border-cyan-200/90 dark:border-cyan-800',
    sopBadgeColor: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 group-hover:bg-cyan-100'
  },
  {
    id: 'cluster-1',
    title: 'TIẾP NHẬN & HỒ SƠ',
    badgeText: 'CỤM 1 · 2 BƯỚC',
    stepIds: ['LIFE-01', 'LIFE-02'],
    stepNumbers: [1, 2],
    colSpan: 'lg:col-span-2',
    subGridCols: 'grid-cols-1 min-[440px]:grid-cols-2',
    bgClass: 'bg-slate-50/70 dark:bg-slate-950/70',
    borderClass: 'border-slate-200/80 dark:border-slate-800',
    headerTextClass: 'text-slate-800 dark:text-slate-200',
    headerBadgeClass: 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/80 dark:border-slate-700',
    sopBadgeColor: 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 group-hover:bg-blue-100'
  },
  {
    id: 'cluster-2',
    title: 'HỢP ĐỒNG & CHẾ ĐỘ PHÚC LỢI',
    badgeText: 'CỤM 2 · 3 BƯỚC',
    stepIds: ['LIFE-03', 'LIFE-04', 'LIFE-05'],
    stepNumbers: [3, 4, 5],
    colSpan: 'lg:col-span-3',
    subGridCols: 'grid-cols-1 min-[480px]:grid-cols-3',
    bgClass: 'bg-emerald-50/40 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200/80 dark:border-emerald-900/40',
    headerTextClass: 'text-emerald-900 dark:text-emerald-300',
    headerBadgeClass: 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200/90 dark:border-emerald-800',
    sopBadgeColor: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 group-hover:bg-emerald-100'
  },
  {
    id: 'cluster-3',
    title: 'BIẾN ĐỘNG & KẾT THÚC',
    badgeText: 'CỤM 3 · 2 BƯỚC',
    stepIds: ['LIFE-06', 'LIFE-07'],
    stepNumbers: [6, 7],
    colSpan: 'lg:col-span-2',
    subGridCols: 'grid-cols-1 min-[440px]:grid-cols-2',
    bgClass: 'bg-amber-50/40 dark:bg-amber-950/30',
    borderClass: 'border-amber-200/80 dark:border-amber-900/40',
    headerTextClass: 'text-amber-900 dark:text-amber-300',
    headerBadgeClass: 'bg-amber-100/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-200/90 dark:border-amber-800',
    sopBadgeColor: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 group-hover:bg-amber-100'
  }
]
