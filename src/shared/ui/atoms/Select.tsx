import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  type ComponentProps,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectProps extends ComponentProps<'select'> {
  visualSize?: 'default' | 'compact'
  containerClassName?: string
  popupClassName?: string
  popupAlign?: 'left' | 'right'
}

interface ParsedOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

function extractOptions(children: React.ReactNode): ParsedOption[] {
  const options: ParsedOption[] = []

  const parseChild = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) return

    if (child.type === 'option') {
      const p = child.props as { value?: string | number; children?: React.ReactNode; disabled?: boolean }
      const val = p.value !== undefined ? String(p.value) : (typeof p.children === 'string' ? p.children : '')
      options.push({
        value: val,
        label: p.children ?? val,
        disabled: p.disabled,
      })
    } else if (child.type === React.Fragment) {
      React.Children.forEach((child.props as any).children, parseChild)
    } else if (child.type === 'optgroup') {
      React.Children.forEach((child.props as any).children, parseChild)
    }
  }

  React.Children.forEach(children, parseChild)
  return options
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className = '',
    containerClassName = '',
    popupClassName = '',
    popupAlign = 'left',
    visualSize = 'default',
    children,
    multiple,
    ...props
  },
  forwardedRef
) {
  const { value: propValue, defaultValue, id: propId, ...restSelectProps } = props
  const options = useMemo(() => extractOptions(children), [children])
  const isControlled = propValue !== undefined

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
    if (defaultValue !== undefined) return String(defaultValue)
    return options[0]?.value ?? ''
  })

  const currentValue = isControlled ? String(propValue) : uncontrolledValue

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(currentValue)) || options[0]
  }, [options, currentValue])

  const displayLabel = selectedOption ? selectedOption.label : ''

  const ariaLabelProp = props['aria-label']
  const computedAriaLabel = useMemo(() => {
    if (!ariaLabelProp) return undefined
    const strDisplay = typeof displayLabel === 'string' ? displayLabel : String(displayLabel ?? '')
    if (!strDisplay) return ariaLabelProp
    const lowerDisplay = strDisplay.trim().toLowerCase()
    const lowerAria = ariaLabelProp.trim().toLowerCase()
    if (lowerAria.includes(lowerDisplay)) {
      return ariaLabelProp
    }
    return `${ariaLabelProp}: ${strDisplay}`
  }, [ariaLabelProp, displayLabel])

  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<React.CSSProperties>({})
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const internalSelectRef = useRef<HTMLSelectElement | null>(null)

  const setNativeRefs = useCallback(
    (node: HTMLSelectElement | null) => {
      internalSelectRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [forwardedRef]
  )

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const spaceBelow = viewportHeight - rect.bottom
    const estimatedHeight = Math.min(options.length * 36 + 20, 280)
    const openUpwards = spaceBelow < estimatedHeight && rect.top > estimatedHeight

    const minW = Math.max(rect.width, 160)
    const maxW = Math.max(rect.width, 360)
    let left = rect.left

    if (popupAlign === 'right') {
      left = rect.right - minW
    }

    if (left + minW > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - minW - 8)
    }
    if (left < 8) {
      left = 8
    }

    const pos: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      minWidth: `${minW}px`,
      maxWidth: `${maxW}px`,
      left: `${left}px`,
    }

    if (openUpwards) {
      pos.bottom = `${viewportHeight - rect.top + 4}px`
    } else {
      pos.top = `${rect.bottom + 4}px`
    }

    setPosition(pos)
  }, [options.length, popupAlign])

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val)
    }
    setIsOpen(false)

    if (internalSelectRef.current) {
      internalSelectRef.current.value = val
    }

    if (props.onChange) {
      const syntheticEvent = {
        target: {
          value: val,
          name: props.name || '',
        },
        currentTarget: {
          value: val,
          name: props.name || '',
        },
        bubbles: true,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>

      props.onChange(syntheticEvent)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setIsOpen(false)
    }

    const handleScroll = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setIsOpen(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (props.disabled) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!isOpen) {
        updatePosition()
        setIsOpen(true)
        const curIdx = options.findIndex((opt) => String(opt.value) === String(currentValue))
        setFocusedIndex(curIdx >= 0 ? curIdx : 0)
      } else {
        if (e.key === 'ArrowDown') {
          setFocusedIndex((prev) => (prev + 1) % options.length)
        } else if (e.key === 'ArrowUp') {
          setFocusedIndex((prev) => (prev - 1 + options.length) % options.length)
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (focusedIndex >= 0 && options[focusedIndex] && !options[focusedIndex].disabled) {
            handleSelect(options[focusedIndex].value)
          }
        }
      }
    }
  }

  if (multiple) {
    return (
      <span className={`relative block min-w-0 ${containerClassName}`}>
        <select
          ref={setNativeRefs}
          {...props}
          multiple
          className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 shadow-sm outline-none transition-colors focus-visible:border-[#155e75] focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-cyan-900 ${className}`}
        >
          {children}
        </select>
      </span>
    )
  }

  const height = visualSize === 'compact' ? 'h-9 text-xs' : 'h-11 text-sm'

  // If containerClassName is not specified, inherit any responsive width/shrink classes passed via className
  const widthClasses = !containerClassName
    ? className
        .split(/\s+/)
        .filter((c) => /^(sm:|md:|lg:|xl:)?(w-|min-w-|max-w-|shrink)/.test(c))
        .join(' ')
    : ''
  const resolvedContainerClass = containerClassName || (widthClasses ? `w-full ${widthClasses}` : 'w-full')

  return (
    <span className={`relative inline-block min-w-0 ${resolvedContainerClass}`}>
      {/* Hidden native select for form data, SSR & test assertions */}
      <select
        ref={setNativeRefs}
        {...restSelectProps}
        id={propId ? `${propId}-native-select` : undefined}
        {...(isControlled ? { value: currentValue } : { defaultValue: defaultValue ?? currentValue })}
        onChange={(e) => {
          if (!isControlled) setUncontrolledValue(e.target.value)
          props.onChange?.(e)
        }}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only rounded-xl focus-visible:ring-2"
      >
        {children}
      </select>

      {/* Custom styled trigger button with rounded-xl */}
      <button
        ref={triggerRef}
        type="button"
        id={propId}
        disabled={props.disabled}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (isOpen) {
            setIsOpen(false)
          } else {
            updatePosition()
            setIsOpen(true)
            const curIdx = options.findIndex((opt) => String(opt.value) === String(currentValue))
            setFocusedIndex(curIdx >= 0 ? curIdx : 0)
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-label={computedAriaLabel}
        aria-labelledby={props['aria-labelledby']}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-3 font-semibold text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-400 focus-visible:border-[#155e75] focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-cyan-900 ${height} ${className}`}
      >
        <span className="truncate text-left">{displayLabel || <span className="opacity-0">.</span>}</span>
        <ChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#155e75] dark:text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Floating custom dropdown menu with rounded-xl container & rounded-lg items */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={props['aria-label'] || 'Danh sách lựa chọn'}
            style={position}
            className={`animate-in fade-in zoom-in-95 duration-100 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50 ${popupClassName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-60 space-y-0.5 overflow-y-auto overscroll-contain py-0.5">
              {options.map((opt, idx) => {
                const isSelected = String(opt.value) === String(currentValue)
                const isHighlighted = idx === focusedIndex
                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors text-left ${
                      isSelected
                        ? 'bg-cyan-50 font-bold text-[#155e75] dark:bg-cyan-950/50 dark:text-cyan-300'
                        : isHighlighted
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                    } ${opt.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                  >
                    <span className="truncate flex-1">{opt.label}</span>
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 text-[#155e75] dark:text-cyan-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </span>
  )
})
