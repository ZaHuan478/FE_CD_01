import type { SopImportPreview, SopImportStep } from '../../../shared/api/sop-import.api'

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

function nodeMarkup(id: string, label: string, kind: SopImportStep['nodeKind']) {
  const safe = `"${label}"`
  if (kind === 'start' || kind === 'end') return `${id}([${safe}])`
  if (kind === 'decision') return `${id}{${safe}}`
  if (kind === 'subprocess') return `${id}[[${safe}]]`
  if (kind === 'parallel_fork' || kind === 'parallel_join') return `${id}{{${safe}}}`
  return `${id}(${safe})`
}

export function buildMermaidDefinition(preview: SopImportPreview) {
  const steps = [...preview.steps].sort((left, right) => left.sortOrder - right.sortOrder)
  if (!steps.length) return 'flowchart TD\n  empty("Chưa có bước nghiệp vụ")'

  const nodeIds = new Map(steps.map((step, index) => [step.id, `step${index + 1}`]))
  const lines = ['flowchart TD']
  for (const step of steps) {
    const safeCode = sanitizeText(step.code)
    const safeTitle = wrapLabel(sanitizeText(step.title), 26)
    const safeActor = step.actor?.trim() ? sanitizeText(step.actor) : ''
    const label = safeActor
      ? `${safeCode} · ${safeTitle}<br/><small style="opacity:0.8">${safeActor}</small>`
      : `${safeCode} · ${safeTitle}`
    lines.push(`  ${nodeMarkup(nodeIds.get(step.id)!, label, step.nodeKind)}`)
  }

  const transitions = [...preview.transitions]
    .filter(transition => transition.fromStepId && transition.toStepId && nodeIds.has(transition.fromStepId) && nodeIds.has(transition.toStepId))
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
  const incoming = new Map(steps.map(step => [step.id, 0]))
  const outgoing = new Map(steps.map(step => [step.id, 0]))
  for (const transition of transitions) {
    incoming.set(transition.toStepId!, (incoming.get(transition.toStepId!) ?? 0) + 1)
    outgoing.set(transition.fromStepId!, (outgoing.get(transition.fromStepId!) ?? 0) + 1)
    const label = sanitizeText(transition.branchLabel?.trim() || transition.condition?.trim() || '')
    const arrow = transition.kind === 'return'
      ? '-.->'
      : transition.kind === 'parallel_fork' || transition.kind === 'parallel_join' ? '==>' : '-->'
    lines.push(label
      ? `  ${nodeIds.get(transition.fromStepId!)} ${arrow}|${label}| ${nodeIds.get(transition.toStepId!)}`
      : `  ${nodeIds.get(transition.fromStepId!)} ${arrow} ${nodeIds.get(transition.toStepId!)}`)
  }

  const starts = steps.filter(step => step.nodeKind === 'start')
  const ends = steps.filter(step => step.nodeKind === 'end')
  if (!starts.length) {
    lines.push('  generatedStart(["Bắt đầu"])')
    const roots = steps.filter(step => (incoming.get(step.id) ?? 0) === 0)
    for (const root of roots.length ? roots : [steps[0]!]) lines.push(`  generatedStart --> ${nodeIds.get(root.id)}`)
  }
  if (!ends.length) {
    lines.push('  generatedEnd(["Kết thúc"])')
    const leaves = steps.filter(step => (outgoing.get(step.id) ?? 0) === 0)
    for (const leaf of leaves.length ? leaves : [steps.at(-1)!]) lines.push(`  ${nodeIds.get(leaf.id)} --> generatedEnd`)
  }

  lines.push('  classDef startEnd fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:2px')
  lines.push('  classDef task fill:#f0f9ff,stroke:#0284c7,color:#0c4a6e,stroke-width:1.5px')
  lines.push('  classDef decision fill:#fffbeb,stroke:#f59e0b,color:#92400e,stroke-width:2px')
  lines.push('  classDef subprocess fill:#faf5ff,stroke:#8b5cf6,color:#581c87,stroke-width:2px')
  const startEndIds = steps.filter(step => step.nodeKind === 'start' || step.nodeKind === 'end').map(step => nodeIds.get(step.id)!)
  if (!starts.length) startEndIds.push('generatedStart')
  if (!ends.length) startEndIds.push('generatedEnd')
  const taskIds = steps.filter(step => ['task', 'parallel_fork', 'parallel_join'].includes(step.nodeKind)).map(step => nodeIds.get(step.id)!)
  const decisionIds = steps.filter(step => step.nodeKind === 'decision').map(step => nodeIds.get(step.id)!)
  const subprocessIds = steps.filter(step => step.nodeKind === 'subprocess').map(step => nodeIds.get(step.id)!)
  if (startEndIds.length) lines.push(`  class ${startEndIds.join(',')} startEnd`)
  if (taskIds.length) lines.push(`  class ${taskIds.join(',')} task`)
  if (decisionIds.length) lines.push(`  class ${decisionIds.join(',')} decision`)
  if (subprocessIds.length) lines.push(`  class ${subprocessIds.join(',')} subprocess`)
  return lines.join('\n')
}

export function defaultStepPosition(index: number) {
  // Four compact columns make the editor feel like a canvas board and leave
  // enough room for the inspector panel on the right.
  return { x: (index % 4) * 255 + 36, y: Math.floor(index / 4) * 220 + 42 }
}
