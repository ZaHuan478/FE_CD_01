import type { PropsWithChildren } from 'react'
import { SessionProvider } from '../../features/authentication/model/session'
import { LanguageProvider } from '../../shared/lib/i18n/LanguageContext'

export function AppProviders({ children }: PropsWithChildren) {
  return <SessionProvider><LanguageProvider>{children}</LanguageProvider></SessionProvider>
}
