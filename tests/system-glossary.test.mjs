import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (rel) => readFileSync(path.join(root, rel), 'utf8')

let server
before(async () => {
  server = await createServer({
    mode: 'test',
    cacheDir: 'node_modules/.vite-test-glossary',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom'
  })
})
after(async () => {
  await server?.close()
})

const mockTerm = {
  id: 'term-sop',
  termId: 'term-sop',
  slug: 'sop',
  term: 'SOP',
  vietnameseName: 'Quy trình thao tác chuẩn',
  category: 'workflow',
  routePath: '/employee-lifecycle/sop-management',
  status: 'published',
  currentPublishedVersion: 1,
  sortOrder: 1,
  isActive: true,
  shortDefinition: 'Quy trình thao tác chuẩn quy định các bước thực hiện nghiệp vụ.',
  detailedDefinition: 'SOP (Standard Operating Procedure) là tài liệu hướng dẫn từng bước chuẩn hóa...',
  aliases: ['Quy trình chuẩn', 'Standard Operating Procedure'],
  examples: ['SOP tuyển dụng', 'SOP quản lý hồ sơ nhân sự'],
  relatedTermSlugs: ['workflow', 'module'],
  versionNumber: 1,
  versionStatus: 'published',
  createdAt: '2026-09-13T00:00:00Z',
  updatedAt: '2026-09-13T00:00:00Z'
}

test('System Glossary components exist and follow feature-based structure', () => {
  const files = [
    'src/features/system-glossary/model/systemGlossaryModel.ts',
    'src/features/system-glossary/ui/SystemGlossaryWorkspace.tsx',
    'src/features/system-glossary/ui/GlossarySearch.tsx',
    'src/features/system-glossary/ui/GlossaryCategoryFilter.tsx',
    'src/features/system-glossary/ui/GlossaryAlphabetNav.tsx',
    'src/features/system-glossary/ui/GlossaryTermCard.tsx',
    'src/features/system-glossary/ui/GlossaryTermDrawer.tsx',
    'src/features/system-glossary/ui/GlossaryTermTooltip.tsx',
    'src/features/system-glossary/ui/GlossaryEmptyState.tsx',
    'src/features/admin-system-guides/ui/AdminGlossaryTab.tsx'
  ]
  for (const f of files) {
    assert(existsSync(path.join(root, f)), `File ${f} must exist`)
  }
})

test('GlossaryTermCard renders term, vietnameseName, category and shortDefinition', async () => {
  const { GlossaryTermCard } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryTermCard.tsx')
  const html = renderToStaticMarkup(
    React.createElement(GlossaryTermCard, {
      term: mockTerm,
      onClick: () => {}
    })
  )
  assert(html.includes('SOP'), 'Card must render term title')
  assert(html.includes('Quy trình thao tác chuẩn'), 'Card must render Vietnamese name')
  assert(html.includes('Quy trình thao tác chuẩn quy định các bước'), 'Card must render short definition')
  assert(html.includes('role="button"'), 'Card must have role="button" for accessibility')
  assert(html.includes('tabindex="0"'), 'Card must be keyboard focusable')
})

test('GlossarySearch and CategoryFilter render search inputs and categories', async () => {
  const { GlossarySearch } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossarySearch.tsx')
  const searchHtml = renderToStaticMarkup(
    React.createElement(GlossarySearch, {
      value: 'Mermaid',
      onChange: () => {},
      totalResults: 5
    })
  )
  assert(searchHtml.includes('value="Mermaid"'), 'Search input should reflect value')
  assert(searchHtml.includes('aria-label="Tìm kiếm thuật ngữ"'), 'Search input must have aria-label')

  const { GlossaryCategoryFilter } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryCategoryFilter.tsx')
  const filterHtml = renderToStaticMarkup(
    React.createElement(GlossaryCategoryFilter, {
      selectedCategory: 'all',
      onSelectCategory: () => {}
    })
  )
  assert(filterHtml.includes('Tất cả'), 'Filter should render "Tất cả"')
  assert(filterHtml.includes('Khái niệm SOP'), 'Filter should render category label')
})

test('GlossaryAlphabetNav renders A-Z letters and handles active selection', async () => {
  const { GlossaryAlphabetNav } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryAlphabetNav.tsx')
  const navHtml = renderToStaticMarkup(
    React.createElement(GlossaryAlphabetNav, {
      selectedLetter: 'S',
      availableLetters: new Set(['A', 'M', 'R', 'S']),
      onSelectLetter: () => {}
    })
  )
  assert(navHtml.includes('Tất cả'), 'Nav must render ALL button')
  assert(navHtml.includes('>S<'), 'Nav must render letter S')
  assert(navHtml.includes('aria-label'), 'Letter buttons must have aria-label')
})

test('GlossaryTermTooltip renders trigger chip with keyboard focusability and aria description', async () => {
  const { GlossaryTermTooltip } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryTermTooltip.tsx')
  const html = renderToStaticMarkup(
    React.createElement(
      GlossaryTermTooltip,
      {
        term: mockTerm,
        onClick: () => {}
      },
      React.createElement('span', null, mockTerm.term)
    )
  )
  assert(html.includes('SOP'), 'Tooltip trigger must render term text')
  assert(html.includes('aria-describedby'), 'Tooltip must have aria-describedby for screen readers')
  assert(html.includes('role="button"'), 'Trigger must be interactive')
  assert(html.includes('tabindex="0"'), 'Trigger must be keyboard focusable')
})

test('GlossaryEmptyState renders clear message and optional reset action', async () => {
  const { GlossaryEmptyState } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryEmptyState.tsx')
  const html = renderToStaticMarkup(
    React.createElement(GlossaryEmptyState, {
      type: 'search',
      onAction: () => {},
      actionLabel: 'Đặt lại bộ lọc'
    })
  )
  assert(html.includes('Không tìm thấy thuật ngữ phù hợp'), 'Empty state must render helpful title')
  assert(html.includes('Đặt lại bộ lọc'), 'Empty state must render reset filter button')
})

test('GlossaryTermDrawer renders full detailed definitions, examples, aliases, and route path', async () => {
  const { GlossaryTermDrawer } = await server.ssrLoadModule('/src/features/system-glossary/ui/GlossaryTermDrawer.tsx')
  const html = renderToStaticMarkup(
    React.createElement(GlossaryTermDrawer, {
      term: mockTerm,
      isOpen: true,
      onClose: () => {}
    })
  )
  assert(html.includes('role="dialog"'), 'Drawer must have role="dialog"')
  assert(html.includes('aria-modal="true"'), 'Drawer must have aria-modal="true"')
  assert(html.includes('Định nghĩa nhanh'), 'Drawer must render short definition heading')
  assert(html.includes('Giải thích chi tiết'), 'Drawer must render detailed definition heading')
  assert(html.includes('SOP (Standard Operating Procedure) là tài liệu'), 'Drawer must render detailed text')
  assert(html.includes('Bí danh / Tên gọi khác'), 'Drawer must render aliases heading')
  assert(html.includes('Quy trình chuẩn'), 'Drawer must render alias chips')
  assert(html.includes('Ví dụ thực tế trong hệ thống'), 'Drawer must render examples')
  assert(html.includes('Mở chức năng này'), 'Drawer must render route navigation button')
})

test('SystemGuideWorkspace integrates tabs for Hướng dẫn thao tác and Từ điển thuật ngữ', () => {
  const content = read('src/features/system-guide/ui/SystemGuideWorkspace.tsx')
  assert(content.includes('Hướng dẫn thao tác'), 'Must have Guide tab')
  assert(content.includes('Từ điển thuật ngữ'), 'Must have Glossary tab')
  assert(content.includes('SystemGlossaryWorkspace'), 'Must render SystemGlossaryWorkspace component')
  assert(content.includes("activeTab === 'glossary'"), 'Must switch activeTab to glossary')
})

test('GuideDetailDrawer renders associated "Thuật ngữ cần biết" chips and tooltips', () => {
  const content = read('src/features/system-guide/ui/GuideDetailDrawer.tsx')
  assert(content.includes('Thuật ngữ cần biết'), 'Must render "Thuật ngữ cần biết" section')
  assert(content.includes('useGuideTerms'), 'Must fetch associated guide terms')
  assert(content.includes('GlossaryTermTooltip'), 'Must render GlossaryTermTooltip for terms')
  assert(content.includes('GlossaryTermDrawer'), 'Must open GlossaryTermDrawer when clicked')
  // Confirm existing checklist/progress is intact
  assert(content.includes('onToggleStep'), 'Checklist step toggle must be preserved')
  assert(content.includes('onCompleteAllSteps'), 'Complete all steps must be preserved')
})

test('AdminSystemGuides integrates AdminGlossaryTab and guide-term associations', () => {
  const content = read('src/features/admin-system-guides/ui/AdminSystemGuides.tsx')
  assert(content.includes('AdminGlossaryTab'), 'Must include AdminGlossaryTab')
  assert(content.includes('Từ điển thuật ngữ'), 'Must render Glossary tab button')
  assert(content.includes('selectedTermIds'), 'Must support associating terms in guide editor')
  assert(content.includes('systemGlossaryApi.associateGuide'), 'Must associate guide with terms on save')

  const tabContent = read('src/features/admin-system-guides/ui/AdminGlossaryTab.tsx')
  assert(tabContent.includes('useAdminSystemGlossary'), 'Admin tab must use admin model hook')
  assert(tabContent.includes('handlePublish'), 'Admin tab must support publish')
  assert(tabContent.includes('handleArchive'), 'Admin tab must support archive')
  assert(tabContent.includes('duplicateWarning'), 'Admin tab must warn about duplicate slug/term/alias')
})
