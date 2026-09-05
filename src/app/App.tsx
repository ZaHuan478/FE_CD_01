import { AppRoutes } from './router'
import { AppProviders } from './providers/AppProviders'

export default function App() {
  return <AppProviders><AppRoutes /></AppProviders>
}
