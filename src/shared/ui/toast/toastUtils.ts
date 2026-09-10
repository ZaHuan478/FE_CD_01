let fallbackIdCounter = 0

export function generateToastId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  fallbackIdCounter += 1
  return `toast-${Date.now()}-${fallbackIdCounter}-${Math.random().toString(36).slice(2, 8)}`
}
