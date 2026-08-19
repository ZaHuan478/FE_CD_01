import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { Language } from '../../data/translations'

interface LanguageSelectorProps {
  className?: string
  isDarkTheme?: boolean
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  isDarkTheme = true
}) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: Array<{ code: Language; label: string; flag: string; badge: string }> = [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', badge: 'VN' },
    { code: 'en', label: 'English', flag: '🇬🇧', badge: 'GB' }
  ]

  const currentOption = options.find((opt) => opt.code === language) || options[0]

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs ${
          isDarkTheme
            ? 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-100 hover:border-blue-500/60'
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-500/60 shadow-2xs'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-blue-400 shrink-0" />
        <span className="flex items-center gap-1.5 font-bold">
          <span className="text-sm">{currentOption.flag}</span>
          <span>{currentOption.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {/* DROPDOWN MENU POPUP */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-48 rounded-2xl border shadow-2xl p-1.5 z-50 transition-all duration-200 animate-in fade-in zoom-in-95 ${
            isDarkTheme
              ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 backdrop-blur-xl shadow-slate-950/80'
              : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-xl shadow-slate-300/50'
          }`}
          role="listbox"
        >
          <div className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 mb-1">
            Chọn ngôn ngữ / Select Language
          </div>

          {options.map((option) => {
            const isSelected = option.code === language
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  setLanguage(option.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer group ${
                  isSelected
                    ? isDarkTheme
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : isDarkTheme
                    ? 'hover:bg-slate-800/90 text-slate-200 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{option.flag}</span>
                  <span className="font-bold">{option.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}
                  >
                    {option.badge}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
