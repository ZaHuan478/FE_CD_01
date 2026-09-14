import React from 'react'
import { ALPHABET_LETTERS } from '../model/systemGlossaryModel'

interface GlossaryAlphabetNavProps {
  selectedLetter: string
  onSelectLetter: (letter: string) => void
  availableLetters: Set<string>
}

export const GlossaryAlphabetNav: React.FC<GlossaryAlphabetNavProps> = ({
  selectedLetter,
  onSelectLetter,
  availableLetters
}) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 px-1.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/80 scrollbar-none">
      {ALPHABET_LETTERS.map(letter => {
        const isAll = letter === 'Tất cả'
        const isActive = selectedLetter === letter
        const hasTerms = isAll || availableLetters.has(letter)

        return (
          <button
            key={letter}
            type="button"
            disabled={!hasTerms}
            onClick={() => onSelectLetter(letter)}
            aria-label={isAll ? 'Tất cả các chữ cái' : `Lọc chữ cái ${letter}`}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 shrink-0 ${
              isActive
                ? 'bg-cyan-600 text-white shadow-sm'
                : hasTerms
                ? 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400'
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
