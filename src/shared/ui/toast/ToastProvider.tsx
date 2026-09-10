import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from 'react'
import {
  DEFAULT_TOAST_DURATIONS,
  MAX_TOASTS_COUNT,
  type ToastContextValue,
  type ToastInput,
  type ToastItem,
  type ToastShowOptions,
  type ToastVariant
} from './toast.types'
import { ToastViewport } from './ToastViewport'
import { ToastContext } from './toastContext'
import { generateToastId } from './toastUtils'

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    const currentTimers = timersRef.current
    return () => {
      isMountedRef.current = false
      currentTimers.forEach((timer) => clearTimeout(timer))
      currentTimers.clear()
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    if (!isMountedRef.current) return
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current.clear()
    if (!isMountedRef.current) return
    setToasts([])
  }, [])

  const show = useCallback(
    (input: ToastInput): string => {
      if (!input.message || !input.message.trim()) {
        return ''
      }

      const id = generateToastId()
      const duration =
        typeof input.duration === 'number'
          ? input.duration
          : DEFAULT_TOAST_DURATIONS[input.variant] || 4000

      const newItem: ToastItem = {
        ...input,
        id,
        createdAt: Date.now()
      }

      if (!isMountedRef.current) return id

      setToasts((prev) => {
        // Newer toast appears at the top: prepend to list
        const next = [newItem, ...prev]
        // If exceeding MAX_TOASTS_COUNT, remove oldest (from the end of list)
        if (next.length > MAX_TOASTS_COUNT) {
          const removed = next.slice(MAX_TOASTS_COUNT)
          for (const item of removed) {
            const t = timersRef.current.get(item.id)
            if (t) {
              clearTimeout(t)
              timersRef.current.delete(item.id)
            }
          }
          return next.slice(0, MAX_TOASTS_COUNT)
        }
        return next
      })

      if (duration > 0) {
        const timer = setTimeout(() => {
          timersRef.current.delete(id)
          if (!isMountedRef.current) return
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }, duration)
        timersRef.current.set(id, timer)
      }

      return id
    },
    []
  )

  const createVariantHelper = useCallback(
    (variant: ToastVariant) => {
      return (message: string, options?: ToastShowOptions) => {
        return show({
          message,
          variant,
          title: options?.title,
          duration: options?.duration
        })
      }
    },
    [show]
  )

  const success = useMemo(() => createVariantHelper('success'), [createVariantHelper])
  const error = useMemo(() => createVariantHelper('error'), [createVariantHelper])
  const warning = useMemo(() => createVariantHelper('warning'), [createVariantHelper])
  const info = useMemo(() => createVariantHelper('info'), [createVariantHelper])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toasts,
      show,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll
    }),
    [toasts, show, success, error, warning, info, dismiss, dismissAll]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
