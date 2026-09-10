import type { PropsWithChildren } from 'react'
import { SessionProvider } from '../../features/authentication/model/session'
import { LanguageProvider } from '../../shared/lib/i18n/LanguageContext'
import { ToastProvider } from '../../shared/ui/toast'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}

