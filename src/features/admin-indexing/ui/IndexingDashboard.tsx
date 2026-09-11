import React, { useCallback, useState, useEffect } from 'react'
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import {
  fetchIndexingOverview,
  triggerReindex,
  type IndexOverview,
  type IndexStatusItem
} from '../model/indexingModel'

export const IndexingDashboard: React.FC = () => {
  const [data, setData] = useState<IndexOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null)

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const overview = await fetchIndexingOverview()
      setData(overview)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu chỉ mục'
      setMessage({ text: msg, isError: true })
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const jobActive = data?.latestJob?.status === 'pending' || data?.latestJob?.status === 'running'

  useEffect(() => {
    if (!jobActive) return
    const intervalId = window.setInterval(() => { void loadData(true) }, 2_000)
    return () => window.clearInterval(intervalId)
  }, [jobActive, loadData])

  const handleReindexAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn lập chỉ mục lại toàn bộ quy trình và chính sách trong hệ thống?')) return

    setActionLoading(true)
    setMessage(null)
    try {
      const res = await triggerReindex('all')
      setMessage({ text: `${res.message} Bạn có thể theo dõi tiến độ ngay bên dưới.` })
      await loadData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Quá trình lập chỉ mục thất bại'
      setMessage({ text: msg, isError: true })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReindexSingle = async (entityId: string) => {
    setActionLoading(true)
    setMessage(null)
    try {
      const res = await triggerReindex('sop', entityId)
      setMessage({ text: `${res.message} Tài liệu: ${entityId}.` })
      await loadData()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lập chỉ mục tài liệu'
      setMessage({ text: msg, isError: true })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: IndexStatusItem['indexStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Đã đồng bộ
          </span>
        )
      case 'indexing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            Đang xử lý
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            Lỗi
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Chờ xử lý
          </span>
        )
    }
  }

  const describeIndexError = (message: string): string => {
    if (/fetch failed|không thể kết nối gemini api/i.test(message)) {
      return 'Lần lập chỉ mục trước không kết nối được Gemini. Chọn “Index lại” để thử lại.'
    }
    if (/429|quota|resource_exhausted/i.test(message)) {
      return 'Gemini đã đạt giới hạn lượt gọi. Hãy chờ quota được cấp lại rồi chọn “Index lại”.'
    }
    return message
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Quản trị Chỉ mục Ngữ nghĩa (RAG Index)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý quá trình trích xuất, băm ngữ nghĩa, sinh vector embedding và trạng thái sẵn sàng của AI
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading || actionLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={() => void handleReindexAll()}
            disabled={loading || actionLoading || jobActive}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
            Lập chỉ mục lại toàn bộ
          </button>
        </div>
      </div>

      {/* Thông báo */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            message.isError
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {data?.latestJob && (
        <div className={`rounded-xl border p-4 ${
          data.latestJob.status === 'failed'
            ? 'border-red-200 bg-red-50'
            : data.latestJob.status === 'succeeded'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-indigo-200 bg-indigo-50'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-800">
                Tác vụ gần nhất · {data.latestJob.scope === 'all' ? 'Toàn bộ tài liệu' : data.latestJob.targetId}
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {data.latestJob.status === 'pending' && 'Đang chờ xử lý'}
                {data.latestJob.status === 'running' && 'Đang sinh vector và cập nhật chỉ mục'}
                {data.latestJob.status === 'succeeded' && 'Đã hoàn tất lập chỉ mục'}
                {data.latestJob.status === 'failed' && 'Tác vụ hoàn tất nhưng có lỗi'}
              </div>
            </div>
            <div className="font-mono text-xs text-slate-700">
              {data.latestJob.succeededItems}/{data.latestJob.totalItems} thành công
              {data.latestJob.failedItems > 0 ? ` · ${data.latestJob.failedItems} lỗi` : ''}
            </div>
          </div>
          {data.latestJob.totalItems > 0 && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className={`h-full transition-all ${data.latestJob.failedItems > 0 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                style={{
                  width: `${Math.min(100, ((data.latestJob.succeededItems + data.latestJob.failedItems) / data.latestJob.totalItems) * 100)}%`
                }}
              />
            </div>
          )}
          {data.latestJob.errorMessage && (
            <div className="mt-2 text-xs text-red-700">{data.latestJob.errorMessage}</div>
          )}
        </div>
      )}

      {/* Thẻ thống kê KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Tổng tài liệu</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{data?.totalDocuments ?? 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-medium">Đã đồng bộ</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{data?.syncedDocuments ?? 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-medium">Đang xử lý/Chờ</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{data?.pendingDocuments ?? 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-red-600 mb-1">
            <span className="text-xs font-medium">Lỗi chỉ mục</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-700">{data?.failedDocuments ?? 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-medium">Tổng Chunks</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{data?.totalChunks ?? 0}</div>
        </div>
      </div>

      {/* Bảng danh sách trạng thái từng tài liệu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800">Danh sách Tài liệu & Quy trình</h3>
          <span className="text-xs text-slate-400">
            Hiển thị {data?.items?.length ?? 0} tài liệu mới nhất
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold">
                <th className="py-3 px-4">Tài liệu / Quy trình</th>
                <th className="py-3 px-4">Phân hệ</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Số Chunk</th>
                <th className="py-3 px-4">Nguồn kích hoạt</th>
                <th className="py-3 px-4">Lần cập nhật cuối</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!data?.items || data.items.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Chưa có tài liệu nào được lập chỉ mục. Bấm nút "Lập chỉ mục lại toàn bộ" để bắt đầu.
                  </td>
                </tr>
              )}

              {data?.items.map((item) => (
                <tr key={`${item.entityId}-${item.versionId}`} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{item.title || item.entityId}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.entityId} ({item.versionId})
                    </div>
                    {item.errorMessage && (
                      <div
                        className="text-[11px] text-red-600 mt-1 max-w-md truncate"
                        title={describeIndexError(item.errorMessage)}
                      >
                        Lỗi: {describeIndexError(item.errorMessage)}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                      {item.moduleId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.indexStatus)}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {item.indexedChunks} / {item.totalChunks}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.triggerSource === 'auto_publish' ? 'Tự động (Publish)' : 'Thủ công'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.lastIndexedAt ? new Date(item.lastIndexedAt).toLocaleString('vi-VN') : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => void handleReindexSingle(item.entityId)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Lập chỉ mục lại tài liệu này"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Index lại
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
