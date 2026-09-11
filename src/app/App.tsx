import { AppRoutes } from './router'
import { AppProviders } from './providers/AppProviders'
import { ChatAssistantDrawer } from '../features/chat-assistant/ui/ChatAssistantDrawer'

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <ChatAssistantDrawer />
    </AppProviders>
  )
}
