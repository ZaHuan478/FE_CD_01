import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const processDiagramPath = resolve(import.meta.dirname, '../index.html')

function publishProcessDiagram(): Plugin {
  return {
    name: 'publish-process-diagram',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'quy-trinh.html',
        source: readFileSync(processDiagramPath, 'utf8'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), publishProcessDiagram()],
})
