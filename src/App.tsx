import { AppRoutes } from './routes/AppRoutes'
import { LanguageProvider } from './context/LanguageContext'
import './styles/employee-form.css'

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  )
}

