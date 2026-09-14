import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Sparkles
} from 'lucide-react'
import { useSession } from '../../authentication/model/session'
import { getErrorMessage, systemGuideApi, type SystemGuide } from '../model/systemGuideModel'
import { GuideHero } from './GuideHero'
import { QuickStartPath } from './QuickStartPath'
import { UserIntentGrid } from './UserIntentGrid'
import { FeatureMap } from './FeatureMap'
import { GuideDetailDrawer } from './GuideDetailDrawer'
import { GuidedTourOverlay } from './GuidedTourOverlay'
import { GuideSkeleton } from './GuideSkeleton'
import { GuideEmptyState } from './GuideEmptyState'
import { SystemGlossaryWorkspace } from '../../system-glossary/ui/SystemGlossaryWorkspace'

function routeMatches(guideRoute: string | null, sourceRoute: string) {
  if (!guideRoute || !sourceRoute) return false
  return sourceRoute.startsWith(guideRoute.split('?')[0] ?? guideRoute)
}

export function SystemGuideWorkspace() {
  const session = useSession()
  const navigate = useNavigate()
  const { guideSlug } = useParams<{ guideSlug?: string }>()
  const [params, setParams] = useSearchParams()

  const [guides, setGuides] = useState<SystemGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('vi'))
  const [onlyMine, setOnlyMine] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'guides' | 'glossary'>(
    params.get('tab') === 'glossary' ? 'glossary' : 'guides'
  )

  const handleTabChange = (tab: 'guides' | 'glossary') => {
    setActiveTab(tab)
    const nextParams = new URLSearchParams(params)
    if (tab === 'glossary') {
      nextParams.set('tab', 'glossary')
    } else {
      nextParams.delete('tab')
    }
    setParams(nextParams, { replace: true })
  }

  // Drawer state: currently selected guide
  const [selectedGuide, setSelectedGuide] = useState<SystemGuide | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const reload = () => {
    setLoading(true)
    setError('')
    systemGuideApi
      .list()
      .then((response) => setGuides(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    reload()
  }, [])

  // Synchronize URL `:guideSlug` with drawer
  useEffect(() => {
    if (guideSlug && guides.length > 0) {
      const match = guides.find((item) => item.slug === guideSlug)
      if (match) {
        setSelectedGuide(match)
        setIsDrawerOpen(true)
      }
    }
  }, [guideSlug, guides])

  // Context recommendation based on `?from=` route
  const sourceRoute = params.get('from') ?? ''
  const recommended = useMemo(
    () => guides.find((item) => routeMatches(item.routePath, sourceRoute)),
    [guides, sourceRoute]
  )

  // Filter guides by search query and "onlyMine"
  const filteredGuides = useMemo(() => {
    return guides.filter((item) => {
      if (onlyMine && !item.available) return false
      if (!deferredQuery) return true
      const searchTarget = `${item.title} ${item.summary} ${item.category} ${item.content?.purpose || ''} ${item.content?.audience || ''}`.toLocaleLowerCase('vi')
      return searchTarget.includes(deferredQuery)
    })
  }, [guides, onlyMine, deferredQuery])

  // Counts for hero profile widget
  const accessibleCount = useMemo(() => guides.filter((g) => g.available).length, [guides])
  const totalCount = guides.length

  // Tour management
  const overview = guides.find((item) => item.slug === 'tong-quan-he-thong')
  const tourActive = params.get('tour') === '1' && Boolean(overview?.tour?.length)

  const handleStartTour = () => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.set('tour', '1')
        return next
      },
      { replace: true }
    )
  }

  const handleCloseTour = () => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete('tour')
        return next
      },
      { replace: true }
    )
  }

  const handleCompleteTour = async () => {
    if (overview) {
      try {
        const response = await systemGuideApi.saveProgress(overview.id, {
          completedSteps: overview.content?.steps.map((_, index) => index) ?? [],
          tourCompleted: true,
          dismissed: false
        })
        setGuides((items) =>
          items.map((item) => (item.id === overview.id ? { ...item, progress: response.data } : item))
        )
      } catch (err) {
        setError(getErrorMessage(err))
      }
    }
    handleCloseTour()
  }

  // Handle opening guide drawer
  const handleOpenGuide = (slug: string) => {
    const target = guides.find((item) => item.slug === slug)
    if (target) {
      setSelectedGuide(target)
      setIsDrawerOpen(true)
      // Update URL route to maintain deep linking without full reload
      navigate(`/employee-lifecycle/system-guide/${slug}`, { replace: true })
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    // Clear slug from route back to main hub
    navigate('/employee-lifecycle/system-guide', { replace: true })
  }

  // Handle toggling single step completion
  const handleToggleStep = async (guide: SystemGuide, stepIndex: number) => {
    const complete = new Set(guide.progress?.completedSteps ?? [])
    if (complete.has(stepIndex)) {
      complete.delete(stepIndex)
    } else {
      complete.add(stepIndex)
    }

    setSaving(true)
    try {
      const response = await systemGuideApi.saveProgress(guide.id, {
        completedSteps: [...complete],
        tourCompleted: guide.progress?.tourCompleted ?? false,
        dismissed: guide.progress?.dismissed ?? false
      })
      setGuides((items) =>
        items.map((item) => (item.id === guide.id ? { ...item, progress: response.data } : item))
      )
      if (selectedGuide?.id === guide.id) {
        setSelectedGuide((prev) => (prev ? { ...prev, progress: response.data } : null))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  // Handle marking all steps as completed (or unmarking if all done)
  const handleCompleteAllSteps = async (guide: SystemGuide) => {
    const total = guide.content?.steps?.length || 0
    const currentlyCompleted = guide.progress?.completedSteps || []
    const isAllDone = total > 0 && currentlyCompleted.length >= total

    const nextCompletedSteps = isAllDone ? [] : Array.from({ length: total }, (_, i) => i)

    setSaving(true)
    try {
      const response = await systemGuideApi.saveProgress(guide.id, {
        completedSteps: nextCompletedSteps,
        tourCompleted: true,
        dismissed: guide.progress?.dismissed ?? false
      })
      setGuides((items) =>
        items.map((item) => (item.id === guide.id ? { ...item, progress: response.data } : item))
      )
      if (selectedGuide?.id === guide.id) {
        setSelectedGuide((prev) => (prev ? { ...prev, progress: response.data } : null))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  // Smooth scroll helpers
  const handleScrollToQuickStart = () => {
    document.getElementById('quick-start-path')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollToFeatureMap = () => {
    document.getElementById('feature-map')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn space-y-6 pb-12">
      {/* Top Error Alert if API Fails */}
      {error && (
        <GuideEmptyState
          type="api-error"
          errorText={error}
          onRetry={reload}
        />
      )}

      {/* Top Learning Hub Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => handleTabChange('guides')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
              activeTab === 'guides'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="size-4 text-cyan-600 dark:text-cyan-400" />
            <span>Hướng dẫn thao tác</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('glossary')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
              activeTab === 'glossary'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookMarked className="size-4 text-cyan-600 dark:text-cyan-400" />
            <span>Từ điển thuật ngữ</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>Trung tâm kiến thức HRMS</span>
        </div>
      </div>

      {activeTab === 'glossary' ? (
        <SystemGlossaryWorkspace onOpenRoute={(route) => navigate(route)} />
      ) : (
        <>
          {/* Hero Header Section */}
          <GuideHero
        session={session}
        query={query}
        onQueryChange={setQuery}
        onlyMine={onlyMine}
        onToggleOnlyMine={setOnlyMine}
        accessibleCount={accessibleCount}
        totalCount={totalCount}
        onStartTour={overview?.tour?.length ? handleStartTour : undefined}
        onQuickStart={handleScrollToQuickStart}
        onViewAllFeatures={handleScrollToFeatureMap}
      />

      {/* Context Recommendation Banner if navigated from a business screen */}
      {recommended && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-cyan-200 bg-cyan-50/70 p-4 transition dark:border-cyan-900/60 dark:bg-cyan-950/30">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-cyan-600 text-white shadow-xs">
              <Sparkles className="size-4" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                Gợi ý cho chức năng bạn vừa xem
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {recommended.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenGuide(recommended.slug)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#155e75] shadow-xs hover:bg-slate-50 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700"
          >
            <span>Mở hướng dẫn</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Areas */}
      {loading ? (
        <GuideSkeleton />
      ) : guides.length === 0 ? (
        <GuideEmptyState type="empty" />
      ) : (
        <>
          {/* Section B: 5-Minute Quick Start Path */}
          <QuickStartPath
            guides={guides}
            onSelectGuide={handleOpenGuide}
            onStartTour={overview?.tour?.length ? handleStartTour : undefined}
          />

          {/* Section C: "Tôi muốn..." User Intent Grid */}
          <UserIntentGrid
            guides={guides}
            onSelectGuide={handleOpenGuide}
          />

          {/* Section D: Functional Map */}
          {filteredGuides.length > 0 ? (
            <FeatureMap
              guides={filteredGuides}
              selectedGuideId={selectedGuide?.id}
              onSelectGuide={(g) => handleOpenGuide(g.slug)}
              onOpenRoute={(route) => navigate(route)}
            />
          ) : (
            <GuideEmptyState
              type={query ? 'no-search-results' : 'no-permissions'}
              query={query}
              onResetSearch={() => setQuery('')}
              onViewAll={() => {
                setQuery('')
                setOnlyMine(false)
              }}
            />
          )}

          {/* FAQ Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="grid size-7 place-items-center rounded-lg bg-cyan-50 text-[#155e75] dark:bg-cyan-950 dark:text-cyan-300">
                <CircleHelp className="size-4" />
              </span>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                Câu hỏi thường gặp của người dùng mới
              </h2>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              <FaqItem
                question="Vì sao tôi thấy một số chức năng có biểu tượng ổ khóa hoặc bị ẩn?"
                answer="Hệ thống tự động lọc chức năng theo vai trò, quyền hạn và danh sách phân hệ được phân công cho tài khoản của bạn. Các chức năng hiển thị ổ khóa giúp bạn biết hệ thống có tính năng đó nhưng tài khoản cần quyền bổ sung (ví dụ: sop.create, sop.edit hoặc quyền ADMIN). Bạn có thể bấm vào thẻ để xem điều kiện và liên hệ quản trị viên."
              />
              <FaqItem
                question="Tiến độ học tập và hoàn thành các bước có được lưu lại không?"
                answer="Có. Khi bạn đánh dấu hoàn thành từng bước hoặc hoàn tất tour tham quan, tiến độ được lưu trực tiếp vào cơ sở dữ liệu backend và gắn liền với tài khoản của bạn. Lần sau đăng nhập, hệ thống sẽ tiếp tục ghi nhận tiến trình làm quen của bạn."
              />
              <FaqItem
                question="Làm thế nào để mở ngay chức năng nghiệp vụ từ trong hướng dẫn?"
                answer="Ở đầu mỗi hướng dẫn trong bảng chi tiết (Drawer), luôn có nút 'Mở chức năng này'. Bấm vào nút này sẽ đưa bạn trực tiếp tới màn hình nghiệp vụ tương ứng mà không cần phải tự tìm kiếm trên menu."
              />
              <FaqItem
                question="Vì sao một số SOP mới soạn thảo chưa xuất hiện khi tìm kiếm?"
                answer="Ô tìm kiếm và Thư viện quy trình chỉ hiển thị các SOP đã được phê duyệt và công bố chính thức (trạng thái Published). Các SOP đang ở trạng thái Nháp (Draft) hoặc Đang rà soát nằm trong khu vực Quản lý SOP dành cho các nhân sự có trách nhiệm soạn thảo và duyệt."
              />
            </div>
          </section>
        </>
      )}
        </>
      )}

      {/* Detail Slide-over Drawer */}
      <GuideDetailDrawer
        guide={selectedGuide}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onToggleStep={handleToggleStep}
        onCompleteAllSteps={handleCompleteAllSteps}
        onOpenRoute={(route) => navigate(route)}
        isSaving={saving}
      />

      {/* Guided Tour Interactive Overlay */}
      {tourActive && overview && overview.tour.length > 0 && (
        <GuidedTourOverlay
          steps={overview.tour}
          onComplete={() => void handleCompleteTour()}
          onClose={handleCloseTour}
        />
      )}
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group py-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-slate-900 dark:text-white hover:text-[#155e75] dark:hover:text-cyan-300 transition">
        <span>{question}</span>
        <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300 max-w-4xl">
        {answer}
      </p>
    </details>
  )
}
