import { Users, UserPlus, FileText, Network, FileSignature, Wallet, TrendingUp, LogOut } from 'lucide-react'

export interface ClusterConfig {
  id: string
  title: string
  badgeText: string
  stepIds: string[]
  stepNumbers: number[]
  colSpan: string
  subGridCols: string
}

export const getStepIcon = (idOrCode: string) => {
  if (idOrCode.includes('00') || idOrCode.endsWith('0')) return <Users className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('01') || idOrCode.endsWith('1')) return <UserPlus className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('02') || idOrCode.endsWith('2')) return <FileText className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('03') || idOrCode.endsWith('3')) return <Network className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('04') || idOrCode.endsWith('4')) return <FileSignature className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('05') || idOrCode.endsWith('5')) return <Wallet className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('06') || idOrCode.endsWith('6')) return <TrendingUp className="w-5 h-5" strokeWidth={1.75} />
  if (idOrCode.includes('07') || idOrCode.endsWith('7')) return <LogOut className="w-5 h-5" strokeWidth={1.75} />
  return <FileText className="w-5 h-5" strokeWidth={1.75} />
}

export const CLUSTERS: ClusterConfig[] = [
  {
    id: 'cluster-0',
    title: 'HOẠCH ĐỊNH & ĐỊNH BIÊN',
    badgeText: '1 bước',
    stepIds: ['LIFE-00'],
    stepNumbers: [1],
    colSpan: 'xl:col-span-1',
    subGridCols: 'grid-cols-1'
  },
  {
    id: 'cluster-1',
    title: 'TIẾP NHẬN & HỒ SƠ',
    badgeText: '2 bước',
    stepIds: ['LIFE-01', 'LIFE-02'],
    stepNumbers: [2, 3],
    colSpan: 'xl:col-span-2',
    subGridCols: 'grid-cols-1 sm:grid-cols-2'
  },
  {
    id: 'cluster-2',
    title: 'HỢP ĐỒNG & CHẾ ĐỘ PHÚC LỢI',
    badgeText: '3 bước',
    stepIds: ['LIFE-03', 'LIFE-04', 'LIFE-05'],
    stepNumbers: [4, 5, 6],
    colSpan: 'xl:col-span-3',
    subGridCols: 'grid-cols-1 sm:grid-cols-3'
  },
  {
    id: 'cluster-3',
    title: 'BIẾN ĐỘNG & KẾT THÚC',
    badgeText: '2 bước',
    stepIds: ['LIFE-06', 'LIFE-07'],
    stepNumbers: [7, 8],
    colSpan: 'xl:col-span-2',
    subGridCols: 'grid-cols-1 sm:grid-cols-2'
  }
]

