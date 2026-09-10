import React, { useEffect, useId, useState, useRef, useCallback } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Code2,
  Clipboard,
  Check,
  RotateCcw,
  Scan,
  ArrowDown,
  ArrowRight,
  FileCode,
  LoaderCircle,
  AlertCircle,
  X,
  GitBranch,
  MoreHorizontal
} from 'lucide-react'
import { getErrorMessage } from '../../lib/errors/apiError'
import { useToast } from '../toast'
import { prepareMermaidSvg } from '../../lib/mermaidSvg'

export interface MermaidDiagramProps {
  definition: string
  fileName?: string
  title?: string
  subtitle?: string
  stepCount?: number
  showSource?: boolean
  actionSlot?: React.ReactNode
  className?: string
  initialDirection?: 'TD' | 'LR'
}

export function MermaidDiagram({
  definition,
  fileName = 'flowchart.mmd',
  title = 'Lưu đồ quy trình',
  subtitle,
  stepCount,
  showSource = true,
  actionSlot,
  className = '',
  initialDirection = 'TD'
}: MermaidDiagramProps) {
  const toast = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgWrapperRef = useRef<HTMLDivElement>(null)

  const [sourceOpen, setSourceOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [diagramMenuOpen, setDiagramMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dark, setDark] = useState(false)

  // Watch dark mode changes on <html>
  useEffect(() => {
    const updateTheme = () => setDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Viewport transforms (pan & zoom)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })

  // Layout direction: TD (Top-Down) or LR (Left-Right)
  const [direction, setDirection] = useState<'TD' | 'LR'>(initialDirection)

  useEffect(() => {
    setDirection(initialDirection)
    setPan({ x: 0, y: 0 })
  }, [initialDirection])

  // Theme-aware definition rewrite
  const renderedDefinition = React.useMemo(() => {
    let text = definition.replace(/^(flowchart|graph)\s+(LR|RL|TD|TB|BT)/m, `$1 ${direction}`)
    // Normalize square task nodes to rounded node syntax id("...") if legacy square brackets are present
    text = text.replace(/(?<![[(\w])([a-zA-Z0-9_-]+)\["((?:\\.|[^"\\])*)"\]/g, '$1("$2")')
    if (dark) {
      text = text
        .replace(/classDef\s+startEnd\s+[^\n]+/g, 'classDef startEnd fill:#064e3b,stroke:#34d399,color:#ecfdf5,stroke-width:2px')
        .replace(/classDef\s+task\s+[^\n]+/g, 'classDef task fill:#0f2744,stroke:#38bdf8,color:#f0f9ff,stroke-width:1.5px')
        .replace(/classDef\s+decision\s+[^\n]+/g, 'classDef decision fill:#451a03,stroke:#fbbf24,color:#fef3c7,stroke-width:2px')
        .replace(/classDef\s+subprocess\s+[^\n]+/g, 'classDef subprocess fill:#3b0764,stroke:#c084fc,color:#faf5ff,stroke-width:2px')
    }
    return text
  }, [definition, direction, dark])

  const renderId = useId().replaceAll(':', '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Fullscreen state listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  // Fit to screen calculation
  const fitToScreen = useCallback(() => {
    if (!canvasRef.current || !svgWrapperRef.current) return
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const svgEl = svgWrapperRef.current.querySelector('svg')
    if (!svgEl) return

    const bbox = typeof svgEl.getBBox === 'function' ? svgEl.getBBox() : null
    const svgW = (bbox && bbox.width > 0) ? bbox.width : (svgEl.clientWidth || 800)
    const svgH = (bbox && bbox.height > 0) ? bbox.height : (svgEl.clientHeight || 500)

    const padding = 48
    const availW = Math.max(canvasRect.width - padding, 200)
    const availH = Math.max(canvasRect.height - padding, 200)

    const scaleX = availW / svgW
    const scaleY = availH / svgH
    const nextZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 1.6)

    setZoom(Math.round(nextZoom * 100) / 100)
    setPan({ x: 0, y: 0 })
  }, [])

  // Render Mermaid SVG
  useEffect(() => {
    let current = true
    setLoading(true)
    setSvg('')
    setError('')

    void import('mermaid')
      .then(async module => {
        const mermaid = module.default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: dark ? 'dark' : 'base',
          themeVariables: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            primaryColor: dark ? '#0f2744' : '#f0f9ff',
            primaryTextColor: dark ? '#f1f5f9' : '#0c4a6e',
            primaryBorderColor: dark ? '#38bdf8' : '#0284c7',
            lineColor: dark ? '#94a3b8' : '#64748b',
            edgeLabelBackground: dark ? '#1e293b' : '#ffffff',
            tertiaryColor: dark ? '#1e293b' : '#ffffff',
            mainBkg: dark ? '#0f172a' : '#ffffff',
            clusterBkg: dark ? '#1e293b' : '#f8fafc',
            titleColor: dark ? '#f1f5f9' : '#0f172a',
            nodeTextColor: dark ? '#f1f5f9' : '#0c4a6e',
            nodePadding: '14px'
          },
          flowchart: {
            curve: 'basis',
            htmlLabels: true,
            useMaxWidth: false,
            padding: 14
          }
        })

        const result = await mermaid.render(`sopFlow${renderId}${Date.now()}`, renderedDefinition)
        if (current) {
          const finalSvg = prepareMermaidSvg(result.svg, 10)
          setSvg(finalSvg)
        }
      })
      .catch(reason => {
        if (current) setError(getErrorMessage(reason, 'Không thể dựng lưu đồ Mermaid'))
      })
      .finally(() => {
        if (current) setLoading(false)
      })

    return () => {
      current = false
    }
  }, [renderedDefinition, renderId, dark, retryTrigger])

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, select, textarea, pre')) return

    setIsPanning(true)
    panStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    })
  }

  const handleMouseUp = () => setIsPanning(false)

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(3, Math.round((z + 0.15) * 100) / 100))
  const handleZoomOut = () => setZoom(z => Math.max(0.25, Math.round((z - 0.15) * 100) / 100))
  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
      setTimeout(fitToScreen, 150)
    } catch {
      toast.error('Trình duyệt không hỗ trợ hoặc chặn chế độ toàn màn hình.')
    }
  }

  // Download Mermaid definition
  const downloadMmd = () => {
    const url = URL.createObjectURL(new Blob([renderedDefinition], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName.endsWith('.mmd') ? fileName : `${fileName}.mmd`
    anchor.click()
    URL.revokeObjectURL(url)
    setDownloadMenuOpen(false)
    toast.success('Đã tải xuống file Mermaid (.mmd)')
  }

  // Download SVG
  const downloadSvg = () => {
    if (!svg) return
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = (fileName.replace(/\.mmd$/, '') || 'flowchart') + '.svg'
    anchor.click()
    URL.revokeObjectURL(url)
    setDownloadMenuOpen(false)
    toast.success('Đã tải xuống file SVG')
  }

  // Copy Mermaid source
  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(renderedDefinition)
      setCopied(true)
      toast.success('Đã sao chép mã nguồn Mermaid.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Trình duyệt không cho phép sao chép tự động.')
    }
  }

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown="download"]')) {
        setDownloadMenuOpen(false)
      }
      if (!target.closest('[data-dropdown="diagram-menu"]')) {
        setDiagramMenuOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDiagramMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const isEmpty = !definition.trim() || definition.includes('Chưa có bước nghiệp vụ')

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col rounded-2xl border border-slate-200/90 bg-white text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0' : 'h-[640px]'
      } ${className}`}
    >
      {/* HEADER & TOOLBAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 bg-slate-50/70 px-4 py-2.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90">
        {/* Left: Info badges */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#1f5f86]/10 text-[#1f5f86] dark:bg-sky-500/20 dark:text-sky-300">
            <GitBranch className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                {title}
              </span>
              {typeof stepCount === 'number' && stepCount > 0 && (
                <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {stepCount} bước
                </span>
              )}
            </div>
            {subtitle && (
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {actionSlot}

          {/* Direction toggle: TD / LR */}
          <div
            role="radiogroup"
            aria-label="Hướng lưu đồ"
            className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              type="button"
              role="radio"
              aria-checked={direction === 'TD'}
              aria-label="Hướng dọc"
              title="Hướng dọc (Trên xuống dưới)"
              onClick={() => {
                setDirection('TD')
                setPan({ x: 0, y: 0 })
              }}
              className={`flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-semibold transition-all cursor-pointer ${
                direction === 'TD'
                  ? 'bg-[#1f5f86] text-white shadow-xs dark:bg-sky-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <ArrowDown className="size-3.5" />
              <span className="hidden sm:inline">Dọc</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={direction === 'LR'}
              aria-label="Hướng ngang"
              title="Hướng ngang (Trái sang phải)"
              onClick={() => {
                setDirection('LR')
                setPan({ x: 0, y: 0 })
              }}
              className={`flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-semibold transition-all cursor-pointer ${
                direction === 'LR'
                  ? 'bg-[#1f5f86] text-white shadow-xs dark:bg-sky-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <ArrowRight className="size-3.5" />
              <span className="hidden sm:inline">Ngang</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Zoom controls */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Thu nhỏ"
              title="Thu nhỏ (-)"
              className="grid size-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <ZoomOut className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Đặt lại 100%"
              title="Đặt lại mức thu phóng 100%"
              className="px-1.5 text-xs font-bold text-slate-700 hover:text-[#1f5f86] cursor-pointer dark:text-slate-200 dark:hover:text-sky-300"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Phóng to"
              title="Phóng to (+)"
              className="grid size-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>

          {/* Fit to screen */}
          <button
            type="button"
            onClick={fitToScreen}
            aria-label="Vừa màn hình"
            title="Vừa màn hình (tự căn chỉnh tỷ lệ)"
            className="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Scan className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
            <span className="hidden md:inline">Vừa màn hình</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative" data-dropdown="download">
            <button
              type="button"
              disabled={!svg || loading || !!error}
              onClick={() => setDownloadMenuOpen(open => !open)}
              aria-label="Tùy chọn tải xuống"
              aria-expanded={downloadMenuOpen}
              title="Tải xuống lưu đồ (SVG hoặc Mermaid MMD)"
              className="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Tải xuống</span>
            </button>

            {downloadMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800 animate-fadeIn"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={downloadSvg}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Download className="size-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Tải ảnh SVG (.svg)</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={downloadMmd}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <FileCode className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tải mã Mermaid (.mmd)</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle View Source Code */}
          {showSource && (
            <button
              type="button"
              aria-expanded={sourceOpen}
              aria-label="Xem mã nguồn Mermaid"
              title="Xem mã nguồn Mermaid"
              onClick={() => setSourceOpen(open => !open)}
              className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                sourceOpen
                  ? 'border-[#1f5f86] bg-[#1f5f86] text-white dark:border-sky-600 dark:bg-sky-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Code2 className="size-3.5" />
              <span className="hidden md:inline">Mã Mermaid</span>
            </button>
          )}

          {/* Toggle Fullscreen */}
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình'}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {isFullscreen ? <Minimize className="size-3.5" /> : <Maximize className="size-3.5" />}
          </button>

          {/* Unified actions menu for existing SOP flowcharts */}
          <div className="relative" data-dropdown="diagram-menu">
            <button
              type="button"
              onClick={() => setDiagramMenuOpen(open => !open)}
              aria-label="Mở menu lưu đồ"
              aria-haspopup="menu"
              aria-expanded={diagramMenuOpen}
              title="Thao tác lưu đồ"
              className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                diagramMenuOpen
                  ? 'border-[#1f5f86] bg-[#1f5f86] text-white dark:border-sky-600 dark:bg-sky-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <MoreHorizontal className="size-3.5" />
              <span className="hidden sm:inline">Menu</span>
            </button>

            {diagramMenuOpen && (
              <div
                role="menu"
                aria-label="Thao tác lưu đồ"
                className="absolute right-0 top-full z-40 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-fadeIn dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="px-2.5 pb-1 pt-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Hiển thị</p>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setDirection('TD'); setPan({ x: 0, y: 0 }); setDiagramMenuOpen(false) }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowDown className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
                  Hướng dọc
                  {direction === 'TD' && <Check className="ml-auto size-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setDirection('LR'); setPan({ x: 0, y: 0 }); setDiagramMenuOpen(false) }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowRight className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
                  Hướng ngang
                  {direction === 'LR' && <Check className="ml-auto size-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { handleResetZoom(); setDiagramMenuOpen(false) }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Scan className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
                  Đặt lại khung nhìn
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <p className="px-2.5 pb-1 pt-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Tài liệu</p>
                {showSource && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setSourceOpen(true); setDiagramMenuOpen(false) }}
                    className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Code2 className="size-3.5 text-[#1f5f86] dark:text-sky-400" />
                    Xem mã Mermaid
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  disabled={!svg || loading || !!error}
                  onClick={() => { downloadSvg(); setDiagramMenuOpen(false) }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Download className="size-3.5 text-sky-600 dark:text-sky-400" />
                  Tải ảnh SVG
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { downloadMmd(); setDiagramMenuOpen(false) }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <FileCode className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Tải mã Mermaid
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setDiagramMenuOpen(false); void toggleFullscreen() }}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {isFullscreen ? <Minimize className="size-3.5 text-[#1f5f86] dark:text-sky-400" /> : <Maximize className="size-3.5 text-[#1f5f86] dark:text-sky-400" />}
                  {isFullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CANVAS VIEWPORT */}
      <div
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 overflow-hidden select-none bg-slate-50/50 dark:bg-slate-950/60 ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        } [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] dark:[background-image:radial-gradient(#334155_1px,transparent_1px)] [background-size:18px_18px]`}
      >
        {/* Loading State */}
        {loading && (
          <div
            role="status"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/75 backdrop-blur-2xs dark:bg-slate-950/75"
          >
            <LoaderCircle className="size-8 animate-spin text-[#1f5f86] dark:text-sky-400" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Đang dựng lưu đồ Mermaid…
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            role="alert"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md space-y-3 rounded-2xl border border-red-200 bg-red-50/90 p-5 dark:border-red-900/60 dark:bg-red-950/60">
              <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="size-5 shrink-0" />
                <strong className="text-sm font-bold">Không thể hiển thị lưu đồ</strong>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRetryTrigger(c => c + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-800 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  Thử lại
                </button>
                {showSource && (
                  <button
                    type="button"
                    onClick={() => setSourceOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 cursor-pointer dark:border-red-800 dark:bg-slate-900 dark:text-red-300"
                  >
                    <Code2 className="size-3.5" />
                    Xem mã lỗi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-slate-500 dark:text-slate-400">
            <GitBranch className="size-10 stroke-1 opacity-40" />
            <p className="text-sm font-semibold">Chưa có bước nghiệp vụ nào trong lưu đồ</p>
            <p className="text-xs max-w-sm opacity-80">
              Hãy thêm các bước và đường nối ở chế độ chỉnh sửa để tạo sơ đồ quy trình.
            </p>
          </div>
        )}

        {/* Rendered SVG with Pan & Zoom Transform */}
        {!error && (
          <div className="flex size-full items-center justify-center p-4">
            <div
              ref={svgWrapperRef}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.12s ease-out'
              }}
              className="inline-block [&_svg]:mx-auto [&_svg]:block [&_svg]:max-w-none [&_svg]:overflow-visible"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        )}

        {/* FLOATING LEGEND (Chú giải loại node) */}
        {!loading && !error && !isEmpty && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-[11px] font-medium shadow-2xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full border border-emerald-600 bg-emerald-100 dark:bg-emerald-950" />
              Bắt đầu / Kết thúc
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-xs border border-sky-600 bg-sky-100 dark:bg-sky-950" />
              Thao tác
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rotate-45 border border-amber-600 bg-amber-100 dark:bg-amber-950" />
              Điều kiện
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-xs border-2 border-purple-600 bg-purple-100 dark:bg-purple-950" />
              Quy trình con
            </span>
          </div>
        )}

        {/* Reset View Floating Button */}
        {(pan.x !== 0 || pan.y !== 0 || zoom !== 1) && (
          <button
            type="button"
            onClick={handleResetZoom}
            title="Đưa về giữa màn hình"
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xs hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="size-3" />
            <span>Căn giữa</span>
          </button>
        )}
      </div>

      {/* SLIDE-OVER CODE DRAWER (Mã nguồn Mermaid) */}
      {showSource && sourceOpen && (
        <aside
          role="region"
          aria-label="Ngăn chứa mã nguồn Mermaid"
          className="absolute inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-slate-200 bg-slate-900 text-slate-100 shadow-2xl transition-transform dark:border-slate-800"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Mã nguồn Mermaid
              </h4>
              <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                .mmd
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => void copySource()}
                aria-label="Sao chép mã nguồn"
                title="Sao chép mã nguồn Mermaid"
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
              >
                {copied ? <Check className="size-4 text-emerald-400" /> : <Clipboard className="size-4" />}
              </button>

              <button
                type="button"
                onClick={downloadMmd}
                aria-label="Tải file .mmd"
                title="Tải file .mmd"
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
              >
                <Download className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSourceOpen(false)}
                aria-label="Đóng ngăn xem mã"
                title="Đóng ngăn xem mã"
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-cyan-200 select-text">
            <pre className="whitespace-pre-wrap break-words">{renderedDefinition}</pre>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-800 bg-slate-950/60 px-4 py-2.5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{renderedDefinition.split('\n').length} dòng</span>
            <button
              type="button"
              onClick={() => void copySource()}
              className="text-sky-400 hover:underline cursor-pointer"
            >
              {copied ? 'Đã sao chép!' : 'Sao chép tất cả'}
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
