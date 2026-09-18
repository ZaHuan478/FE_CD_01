import { useParams } from 'react-router-dom'
import { CanonicalSopViewer } from './CanonicalSopViewer'

export { CanonicalSopViewer }

export function PublishedKnowledgeDocumentPage() {
  const { documentId } = useParams<{ documentId: string }>()

  return (
    <>
      <CanonicalSopViewer documentId={documentId} />
      {/* <MetroWorkflowPipeline is utilized inside CanonicalSopViewer for business-facing process views */}
    </>
  )
}

