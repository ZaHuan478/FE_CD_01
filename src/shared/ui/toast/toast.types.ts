export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastInput {
  title?: string
  message: string
  variant: ToastVariant
  duration?: number
}

export interface ToastItem extends ToastInput {
  id: string
  createdAt: number
}

export interface ToastShowOptions {
  title?: string
  duration?: number
}

export interface ToastContextValue {
  toasts: ToastItem[]
  show: (input: ToastInput) => string
  success: (message: string, options?: ToastShowOptions) => string
  error: (message: string, options?: ToastShowOptions) => string
  warning: (message: string, options?: ToastShowOptions) => string
  info: (message: string, options?: ToastShowOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

export const DEFAULT_TOAST_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 8000
}

export const MAX_TOASTS_COUNT = 5
