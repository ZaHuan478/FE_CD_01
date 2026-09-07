import { Suspense, useEffect, useState } from 'react'
import { MasterDataStudio } from '../../widgets/master-data-studio/ui/MasterDataStudio'
import { PageIntro, Panel, TableSkeleton } from '../../shared/ui/molecules/AdminSurface'

export function AdminMasterDataPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return <><PageIntro title="Master Data" description="Không gian tra cứu catalog, quan hệ dữ liệu và hướng dẫn quy trình được tái sử dụng từ hệ thống hiện có." /><Panel><Suspense fallback={<TableSkeleton rows={8} />}><MasterDataStudio isDarkMode={dark} /></Suspense></Panel></>
}
