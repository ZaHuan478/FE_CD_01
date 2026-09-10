import { Component, Suspense, type PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { FullPageLoading } from '../../shared/ui/molecules/FullPageLoading'
import { getRuntimeDataset, resetRuntimeDatasets } from '../../shared/lib/runtime-datasets/runtimeData'
import { useSession } from '../../features/authentication/model/session'

interface ReadErrorBoundaryProps extends PropsWithChildren {
  resetKey: string
}

interface ReadErrorBoundaryState {
  failed: boolean
  retry: number
  resetKey: string
}

class ReadErrorBoundary extends Component<ReadErrorBoundaryProps, ReadErrorBoundaryState> {
  state = { failed: false, retry: 0, resetKey: this.props.resetKey }
  static getDerivedStateFromError() { return { failed: true } }
  static getDerivedStateFromProps(props: ReadErrorBoundaryProps, state: ReadErrorBoundaryState) {
    return props.resetKey !== state.resetKey ? { failed: false, resetKey: props.resetKey } : null
  }
  render() {
    if (this.state.failed) return <main role="alert" className="p-8 text-center">
      <p>Không tải được dữ liệu màn hình này. Vui lòng kiểm tra kết nối hoặc quyền truy cập.</p>
      <button type="button" className="mt-4 rounded bg-sky-800 px-4 py-2 text-white" onClick={() => {
        resetRuntimeDatasets()
        this.setState(state => ({ failed: false, retry: state.retry + 1 }))
      }}>Thử lại</button>
    </main>
    return <Suspense key={this.state.retry} fallback={<FullPageLoading message="Đang tải nội dung cần hiển thị..." />}>{this.props.children}</Suspense>
  }
}

export function KnowledgeBoundary({ children }: PropsWithChildren) {
  const session = useSession()
  const location = useLocation()
  const isAdminWorkspace = location.pathname.startsWith('/employee-lifecycle/admin')
    || new URLSearchParams(location.search).get('tab') === 'admin'
  const boundaryResetKey = `${location.pathname}:${location.search}`
  if (!session.modules.length && ['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole) && !isAdminWorkspace) {
    return <Navigate to="/employee-lifecycle/admin" replace />
  }
  if (!session.modules.length && !['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)) return <main className="p-8 text-center"><h1>Chưa được cấp quyền phân hệ</h1><p>Vui lòng liên hệ quản trị viên để được cấp quyền xem tài liệu phù hợp.</p></main>
  return <ReadErrorBoundary key={session.accountId} resetKey={boundaryResetKey}><TranslatedContent>{children}</TranslatedContent></ReadErrorBoundary>
}

function TranslatedContent({ children }: PropsWithChildren) {
  getRuntimeDataset('translations')
  return children
}

