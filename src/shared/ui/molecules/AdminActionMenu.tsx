import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal, MoreVertical } from 'lucide-react'

export interface AdminActionMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'danger' | 'warning' | 'success'
  divider?: boolean
  description?: string
}

export interface AdminActionMenuProps {
  items: AdminActionMenuItem[]
  orientation?: 'horizontal' | 'vertical'
  align?: 'left' | 'right'
  title?: string
  className?: string
  triggerClassName?: string
  customTrigger?: React.ReactNode
}

interface Position {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export const AdminActionMenu: React.FC<AdminActionMenuProps> = ({
  items,
  orientation = 'horizontal',
  align = 'right',
  title = 'Thao tác',
  className = '',
  triggerClassName = '',
  customTrigger
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position>({})
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const spaceBelow = viewportHeight - rect.bottom
    const estimatedMenuHeight = Math.min(items.length * 40 + 20, 320)
    const openUpwards = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight

    const pos: Position = {}

    if (openUpwards) {
      pos.bottom = viewportHeight - rect.top + 6
    } else {
      pos.top = rect.bottom + 6
    }

    const menuWidth = Math.min(224, viewportWidth - 16)
    if (align === 'left') {
      pos.left = Math.max(8, Math.min(rect.left, viewportWidth - menuWidth - 8))
    } else {
      const rightDistance = viewportWidth - rect.right
      pos.right = Math.max(8, Math.min(rightDistance, viewportWidth - menuWidth - 8))
    }

    setPosition(pos)
  }, [align, items.length])

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isOpen) {
      updatePosition()
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      closeMenu()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    const handleScrollOrResize = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) {
        return
      }
      closeMenu()
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen, closeMenu])

  const visibleItems = items.filter(Boolean)
  if (visibleItems.length === 0) return null

  const Icon = orientation === 'vertical' ? MoreVertical : MoreHorizontal

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {customTrigger ? (
        <div ref={triggerRef as unknown as React.RefObject<HTMLDivElement>} onClick={toggleMenu}>
          {customTrigger}
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleMenu}
          title={title}
          aria-label={title}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={`grid size-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100 ${
            isOpen
              ? 'border-[#155e75] text-[#155e75] ring-2 ring-cyan-500/20 dark:border-cyan-400 dark:text-cyan-400'
              : ''
          } ${triggerClassName}`}
        >
          <Icon className="size-4 shrink-0" />
        </button>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            style={{
              position: 'fixed',
              top: position.top !== undefined ? `${position.top}px` : undefined,
              bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
              left: position.left !== undefined ? `${position.left}px` : undefined,
              right: position.right !== undefined ? `${position.right}px` : undefined,
              zIndex: 9999
            }}
            className="w-56 max-w-[calc(100vw-1rem)] animate-in fade-in zoom-in-95 duration-150 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const isDanger = item.variant === 'danger'
                const isWarning = item.variant === 'warning'
                const isSuccess = item.variant === 'success'

                let colorClasses =
                  'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                if (isDanger) {
                  colorClasses =
                    'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300'
                } else if (isWarning) {
                  colorClasses =
                    'text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/40 dark:hover:text-amber-300'
                } else if (isSuccess) {
                  colorClasses =
                    'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300'
                }

                return (
                  <React.Fragment key={item.id}>
                    {item.divider && (
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      disabled={item.disabled}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (item.disabled) return
                        closeMenu()
                        item.onClick?.()
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors text-left ${colorClasses} ${
                        item.disabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : 'cursor-pointer'
                      }`}
                    >
                      {item.icon && (
                        <span className="shrink-0 [&>svg]:size-4">{item.icon}</span>
                      )}
                      <span className="truncate flex-1">{item.label}</span>
                    </button>
                  </React.Fragment>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
