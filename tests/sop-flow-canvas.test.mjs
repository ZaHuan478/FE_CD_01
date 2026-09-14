import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

test('Rich Process Card and Header Node components exist and adhere to architecture rules', () => {
  const cardPath = 'src/features/document-conversion/ui/components/SopFlowNodeCard.tsx'
  const headerPath = 'src/features/document-conversion/ui/components/SopFlowHeaderCard.tsx'
  const illuPath = 'src/features/document-conversion/ui/components/sopIllustrations.tsx'

  assert.equal(existsSync(path.join(root, cardPath)), true)
  assert.equal(existsSync(path.join(root, headerPath)), true)
  assert.equal(existsSync(path.join(root, illuPath)), true)

  const cardContent = read(cardPath)
  assert(cardContent.includes('export const SopFlowNodeCard'))
  assert(cardContent.includes('detectIllustrationPreset'))
  assert(cardContent.includes('renderPresetIllustration'))
  assert(cardContent.includes('Handle'))
  assert(cardContent.includes('Position.Left'))
  assert(cardContent.includes('Position.Right'))
  assert(!cardContent.includes("from '../../../../shared/api/")) // Architecture constraint: no direct import from shared/api

  const headerContent = read(headerPath)
  assert(headerContent.includes('export const SopFlowHeaderCard'))
  assert(headerContent.includes('Position.Bottom'))
  assert(headerContent.includes('Lưu đồ thực thi chuẩn'))

  const illuContent = read(illuPath)
  assert(illuContent.includes('export const ILLUSTRATION_PRESETS'))
  assert(illuContent.includes('export function renderPresetIllustration'))
  assert(illuContent.includes('export function detectIllustrationPreset'))
})

test('SopFlowchartWorkspace integrates Rich Cards, Header Card, and modern dashed connectors', () => {
  const workspacePath = 'src/features/document-conversion/ui/SopFlowchartWorkspace.tsx'
  const content = read(workspacePath)

  assert(content.includes('SopFlowNodeCard'))
  assert(content.includes('SopFlowHeaderCard'))
  assert(content.includes('nodeTypes: NodeTypes = {'))
  assert(content.includes('strokeDasharray: \'6 4\''))
  assert(content.includes('BackgroundVariant.Dots'))
  assert(content.includes('Lưu đồ Mermaid'))
  assert(content.includes('Canvas đồ họa'))
  assert(content.includes('Ảnh bìa / Minh họa thẻ'))
  assert(content.includes('Tự sắp xếp'))
  assert(content.includes("useState<'canvas' | 'mermaid'>('canvas')"))
  assert(content.includes('aria-label="Thuộc tính bước"'))
  assert(content.includes('<MiniMap'))
  assert(content.includes('h-[720px]'))
})

test('PublishedSopFlow supports view mode toggle between Mermaid and Canvas', () => {
  const publishedPath = 'src/features/document-conversion/ui/PublishedSopFlow.tsx'
  const content = read(publishedPath)

  assert(content.includes("const [viewMode, setViewMode] = useState<'mermaid' | 'canvas'>('canvas')"))
  assert(content.includes('Xem Canvas đồ họa'))
  assert(content.includes('Xem dạng Mermaid'))
  assert(content.includes('<SopFlowchartWorkspace'))
})

test('document outline keeps nested instructions inside explicit major steps', () => {
  const content = read('src/features/document-conversion/ui/DocumentConversionWorkspace.tsx')

  assert(content.includes("const mainSteps = outline.filter(item => item.semanticKind === 'main_step')"))
  assert(content.includes('if (mainSteps.length) return mainSteps'))
  assert(content.includes('if (operationalKinds.has(parent.semanticKind)) return false'))
  assert(content.includes('supporting.push(candidate)'))
  assert(content.includes('Node tổng quan'))
  assert(content.includes('chỉ các bước chính trở thành node tổng quan'))
  assert(content.includes('Tạo bản chỉnh sửa & phân tích lại'))
  assert(content.includes('const result = await sopImportApi.reprocess(revision.id)'))
  assert(!content.includes('if (!operationalKinds.has(candidate.semanticKind)) supporting.push(candidate)'))
})

test('shared Mermaid diagram exposes a keyboard-friendly actions menu', () => {
  const content = read('src/shared/ui/diagrams/MermaidDiagram.tsx')

  assert(content.includes('data-dropdown="diagram-menu"'))
  assert(content.includes('aria-label="Mở menu lưu đồ"'))
  assert(content.includes('role="menu"'))
  assert(content.includes('Hướng dọc'))
  assert(content.includes('Hướng ngang'))
  assert(content.includes('Xem mã Mermaid'))
  assert(content.includes('document.addEventListener(\'keydown\''))
})
