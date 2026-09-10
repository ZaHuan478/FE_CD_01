import type { SopSubProcess } from '../model/types'

function sanitizeText(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\n', ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wrapLabel(text: string, maxLen = 28): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (!currentLine) {
      currentLine = word
    } else if ((currentLine + ' ' + word).length <= maxLen) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines.join('<br/>')
}

export function buildPublishedWorkflowMermaid(process: SopSubProcess) {
  if (!process.steps.length) return 'flowchart TD\n  empty("Chưa có bước nghiệp vụ")'
  const lines = ['flowchart LR', '  generatedStart(["Bắt đầu"])']
  process.steps.forEach((step, index) => {
    const safeCode = sanitizeText(step.stepCode || `B${index + 1}`)
    const safeTitle = wrapLabel(sanitizeText(step.title), 26)
    const safeActor = step.actor?.trim() ? sanitizeText(step.actor) : ''
    const label = safeActor
      ? `${safeCode} · ${safeTitle}<br/><small style="opacity:0.8">${safeActor}</small>`
      : `${safeCode} · ${safeTitle}`
    lines.push(`  step${index + 1}("${label}")`)
    lines.push(index === 0 ? `  generatedStart --> step1` : `  step${index} --> step${index + 1}`)
  })
  lines.push('  generatedEnd(["Kết thúc"])')
  lines.push(`  step${process.steps.length} --> generatedEnd`)
  lines.push('  classDef startEnd fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:2px')
  lines.push('  classDef task fill:#f0f9ff,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px')
  lines.push('  class generatedStart,generatedEnd startEnd')
  lines.push(`  class ${process.steps.map((_, index) => `step${index + 1}`).join(',')} task`)
  return lines.join('\n')
}
