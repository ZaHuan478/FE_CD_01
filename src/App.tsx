import { AppRoutes } from './routes/AppRoutes'
import { LanguageProvider } from './context/LanguageContext'
import { SessionProvider } from './auth/session'

export default function App() {
  return (
    <SessionProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </SessionProvider>
  )
}
