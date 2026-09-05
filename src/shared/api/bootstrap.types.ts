export interface ApiRelease {
  releaseId: string
  schemaVersion: number
  publishedAt: string
}

export interface KnowledgeBootstrapResult {
  source: 'mysql'
  datasets: Record<string, unknown>
  release: ApiRelease
  stats: {
    modules: number
    sops: number
    versions: number
    steps: number
    transitions: number
    articles: number
  }
}
