export interface ApiRelease {
  releaseId: string
  schemaVersion: number
  publishedAt: string
}

export interface DatabaseBootstrapResult {
  source: 'sql-server'
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
