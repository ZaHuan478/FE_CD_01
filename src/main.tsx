import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { bootstrapKnowledgeDatabase } from './database/bootstrap'

const root = createRoot(document.getElementById('root')!)

async function startApplication() {
  try {
    await bootstrapKnowledgeDatabase()
    const { default: App } = await import('./App.tsx')
    root.render(
      <StrictMode>
        <BrowserRouter><App /></BrowserRouter>
      </StrictMode>,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    root.render(
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
        <section style={{ maxWidth: 640, border: '1px solid #fecaca', borderRadius: 16, padding: 24, background: '#fff7f7' }}>
          <h1 style={{ margin: 0, fontSize: 20, color: '#991b1b' }}>Không thể mở kho kiến thức HRM</h1>
          <p style={{ color: '#7f1d1d' }}>SQLite trong trình duyệt không khởi tạo được: {message}</p>
          <button type="button" onClick={() => window.location.reload()}>Tải lại</button>
        </section>
      </main>,
    )
  }
}

void startApplication()
