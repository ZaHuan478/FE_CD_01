export interface ApprovalChainItem {
  level: string
  title: string
  titleEn: string
  desc: string
  descEn: string
  color: string
}

export interface FlowStageProps {
  activeStageTab: number
  isDarkMode: boolean
}

export interface InfographicFlowCommonProps {
  sopCode?: string
  isDarkMode: boolean
  onOpenWireframe?: () => void
}
