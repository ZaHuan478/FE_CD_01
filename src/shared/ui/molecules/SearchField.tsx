import type { KeyboardEventHandler } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'

interface SearchFieldProps {
  value: string
  onValueChange: (value: string) => void
  onFocus: () => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
  onClear: () => void
  placeholder: string
  ariaLabel: string
}

export function SearchField({ value, onValueChange, onFocus, onKeyDown, onClear, placeholder, ariaLabel }: SearchFieldProps) {
  return <>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <Input type="search" value={value} onFocus={onFocus} onChange={(event) => onValueChange(event.target.value)}
      onKeyDown={onKeyDown} placeholder={placeholder} aria-label={ariaLabel}
      className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-900 xl:w-64" />
    {value && <Button type="button" onClick={onClear} aria-label="Xóa tìm kiếm" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"><X className="h-3.5 w-3.5" /></Button>}
  </>
}
