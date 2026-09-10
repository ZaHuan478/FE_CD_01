import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
  ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
const files = walk(path.join(root, 'src')).filter((file) => /\.tsx?$/.test(file))
const read = (file) => readFileSync(file, 'utf8')
const relative = (file) => path.relative(root, file).replaceAll('\\', '/')
function imports(file) {
  const tree = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true)
  const result = []
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) result.push(node.moduleSpecifier.text)
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) result.push(node.arguments[0].text)
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return result
}
const ranks = { shared: 0, entities: 1, features: 2, widgets: 3, pages: 4, app: 5 }

test('all relative imports resolve and layers do not import upward', () => {
  for (const file of files) {
    for (const spec of imports(file).filter((value) => value.startsWith('.'))) {
      const base = path.resolve(path.dirname(file), spec)
      const target = [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
        .find((candidate) => files.includes(candidate) || (candidate.endsWith('.css') && existsSync(candidate)))
      assert(target, relative(file) + ' cannot resolve ' + spec)
      const fromLayer = relative(file).split('/')[1]
      const toLayer = relative(target).split('/')[1]
      if (fromLayer in ranks && toLayer in ranks) assert(ranks[fromLayer] >= ranks[toLayer], relative(file) + ' imports higher layer ' + relative(target))
    }
  }
})

test('old database/component buckets have been removed', () => {
  for (const directory of ['database', 'components', 'api', 'auth', 'context', 'routes', 'data', 'types']) {
    assert.equal(existsSync(path.join(root, 'src', directory)), false, directory)
  }
  for (const directory of ['app', 'pages', 'features', 'entities', 'widgets', 'shared']) assert(existsSync(path.join(root, 'src', directory)))
})

test('atoms and molecules contain neither business-layer imports nor HTTP calls', () => {
  const uiFiles = files.filter((file) => relative(file).startsWith('src/shared/ui/'))
  assert(uiFiles.some((file) => file.includes('atoms')))
  assert(uiFiles.some((file) => file.includes('molecules')))
  for (const file of uiFiles) {
    assert(!/\b(fetch|apiRequest)\s*[(<]/.test(read(file)), relative(file))
    assert(!imports(file).some((spec) => /\b(api|entities|features|widgets|pages|app)\//.test(spec)), relative(file))
  }
})

test('page entrypoints compose UI; HTTP belongs to feature models/hooks and shared API', () => {
  for (const file of files.filter((file) => relative(file).startsWith('src/pages/'))) {
    assert(!/\b(apiRequest|fetch|getRuntimeDataset)\s*[(<]/.test(read(file)), relative(file))
  }
  for (const file of files.filter((file) => relative(file).includes('/ui/'))) {
    assert(!imports(file).some((spec) => /shared\/api\//.test(spec)), relative(file))
  }
})

test('public URLs and lazy workspace loading are preserved', () => {
  const router = read(path.join(root, 'src/app/router.tsx'))
  const paths = [...router.matchAll(/path="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(paths, [
    '/', '/login', '/employee-lifecycle/knowledge-documents/:documentId', '/employee-lifecycle/sop-imports', '/employee-lifecycle/document-conversions', '/employee-lifecycle', '/employee-lifecycle/journey', '/employee-lifecycle/lifecycle',
    '/employee-lifecycle/operations', '/employee-lifecycle/masterdata', '/employee-lifecycle/reports',
    '/employee-lifecycle/workbench', '/employee-lifecycle/infographic/:id', '/employee-lifecycle/flowchart/:id',
    '/employee-lifecycle/raci/:id', '/employee-lifecycle/workflow/:id',
    '/employee-lifecycle/erd', '/employee-lifecycle/policies', '/employee-lifecycle/policies/:id',
    '/employee-lifecycle/admin', '/employee-lifecycle/admin/users', '/employee-lifecycle/admin/access',
    '/employee-lifecycle/admin/catalog', '/employee-lifecycle/admin/imports', '/employee-lifecycle/admin/sop-approvals', '/employee-lifecycle/admin/master-data', '/employee-lifecycle/admin/settings', '*'
  ])
  assert(router.includes("import('../pages/employee-lifecycle/EmployeeLifecyclePage')"))
})

test('personal documents and document conversion have separate employee workspace destinations', () => {
  const router = read(path.join(root, 'src/app/router.tsx'))
  const workspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const sidebar = read(path.join(root, 'src/widgets/app-sidebar/ui/LeftSidebarNav.tsx'))
  assert(!router.includes("pages/admin-access/SopImportsPage"))
  assert(router.includes('path="/employee-lifecycle/sop-imports"'))
  assert(router.includes('path="/employee-lifecycle/document-conversions"'))
  assert(workspace.includes("activeTab === 'imports'"))
  assert(workspace.includes("activeTab === 'conversions'"))
  assert(workspace.includes('<MyDocumentsWorkspace />'))
  assert(workspace.includes('<DocumentConversionWorkspace />'))
  assert(sidebar.includes("id: 'DOCUMENT_CONVERSION'"))
  assert(sidebar.includes("label: 'Chuyển hóa tài liệu'"))
  assert(!sidebar.includes("navigate('/employee-lifecycle/sop-imports')"))
})

test('document conversion renders editable React Flow and derived Mermaid without duplicating source data', () => {
  const workspace = read(path.join(root, 'src/features/document-conversion/ui/DocumentConversionWorkspace.tsx'))
  const flowchart = read(path.join(root, 'src/features/document-conversion/ui/SopFlowchartWorkspace.tsx'))
  const mermaidFlow = read(path.join(root, 'src/features/document-conversion/model/mermaidFlow.ts'))
  const mermaidDiagram = read(path.join(root, 'src/shared/ui/diagrams/MermaidDiagram.tsx'))
  const publishedViewer = read(path.join(root, 'src/features/sop-viewer/ui/WorkflowDetailPage.tsx'))
  const api = read(path.join(root, 'src/shared/api/sop-import.api.ts'))
  assert(workspace.includes("'flow'"))
  assert(workspace.includes('Lưu đồ Mermaid'))
  assert(flowchart.includes('ReactFlow'))
  assert(mermaidDiagram.includes("import('mermaid')"))
  assert(flowchart.includes('validateFlow(importId, preview)'))
  assert(mermaidFlow.includes('buildMermaidDefinition'))
  assert(mermaidFlow.includes('generatedStart'))
  assert(api.includes('/flow/validate'))
  assert(publishedViewer.includes('Flowchart Mermaid'))
})

test('admin lands on the workspace and receives an admin-only sidebar destination', () => {
  const router = read(path.join(root, 'src/app/router.tsx'))
  const login = read(path.join(root, 'src/features/authentication/hooks/useDevelopmentLogin.ts'))
  const sidebar = read(path.join(root, 'src/widgets/app-sidebar/ui/LeftSidebarNav.tsx'))
  assert(!router.includes('session.modules.length === 0'))
  assert(login.includes("const rawRedirect = searchParams.get('redirect')"))
  assert(login.includes("target = decoded"))
  assert(!login.includes("target = '/employee-lifecycle/admin'"))
  assert(sidebar.includes("['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)"))
  assert(sidebar.includes("'Quản trị hệ thống'"))
  assert(sidebar.includes("id: 'ADMIN'"))
})

test('removed SOP specs matrix is absent from workspace navigation', () => {
  const workspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const sidebar = read(path.join(root, 'src/widgets/app-sidebar/ui/LeftSidebarNav.tsx'))
  assert(!workspace.includes('sop-specs-matrix'))
  assert(!sidebar.includes('sop-specs-matrix'))
  assert(!sidebar.includes('sidebar.item.sopMatrix'))
})

test('process library is separated from the overview and remains inside the employee workspace', () => {
  const workspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const sidebar = read(path.join(root, 'src/widgets/app-sidebar/ui/LeftSidebarNav.tsx'))
  const overview = read(path.join(root, 'src/widgets/module-explorer/ui/SystemOverviewDashboard.tsx'))
  const library = read(path.join(root, 'src/widgets/module-explorer/ui/ProcessLibraryWorkspace.tsx'))
  assert(sidebar.includes("id: 'process-library'"))
  assert(sidebar.includes("'Thư viện quy trình'"))
  assert(workspace.includes("activeTab === 'process-library'"))
  assert(workspace.includes('<ProcessLibraryWorkspace />'))
  assert(overview.includes('<RadialEcosystemChart view="complete" />'))
  assert(overview.includes('<ClusterProcessExplorer'))
  assert(library.includes('knowledgeApi.catalogDocuments'))
  assert(library.includes("type: 'procedure'"))
  assert(library.includes('Phân trang thư viện'))
})

test('full-page process details return to the workspace context that opened them', () => {
  const workspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const relationship = read(path.join(root, 'src/widgets/module-explorer/ui/HrmModuleRelationshipSection.tsx'))
  const coreDetail = read(path.join(root, 'src/widgets/module-explorer/ui/EcosystemSopDetail.tsx'))
  const clusterDetail = read(path.join(root, 'src/widgets/module-explorer/ui/ClusterProcessExplorer.tsx'))
  const returnHelper = read(path.join(root, 'src/shared/lib/navigation/workspaceReturn.ts'))
  assert(workspace.includes('navigate(resolveWorkspaceReturn(searchParams))'))
  assert(relationship.includes('withWorkspaceReturn(mod.workflowPath'))
  assert(coreDetail.includes('withWorkspaceReturn(target, getCurrentWorkspacePath(location))'))
  assert(clusterDetail.includes('withWorkspaceReturn(target, getCurrentWorkspacePath(location))'))
  assert(returnHelper.includes("returnTo.startsWith(`${employeeWorkspaceRoot}?`)"))
  assert(returnHelper.includes("returnTo.startsWith(`${employeeWorkspaceRoot}/`)"))
})

test('master data modes live in the workspace header and catalog pagination keeps URL state', () => {
  const workspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const studio = read(path.join(root, 'src/widgets/master-data-studio/ui/MasterDataStudio.tsx'))
  const studioHeader = read(path.join(root, 'src/widgets/master-data-studio/ui/components/StudioHeader.tsx'))
  const catalogWorkspace = read(path.join(root, 'src/widgets/master-data-studio/ui/components/CatalogWorkspace.tsx'))
  const viewTabs = read(path.join(root, 'src/widgets/master-data-studio/ui/components/MasterDataViewTabs.tsx'))

  assert(workspace.includes("activeTab === 'masterdata'"))
  assert(workspace.includes('<MasterDataViewTabs'))
  assert(workspace.includes("next.set('view', view)"))
  assert(studio.includes('const CATALOG_PAGE_SIZE = 6'))
  assert(studio.includes("searchParams.get('page')"))
  assert(studio.includes('filteredItems.slice('))
  assert(catalogWorkspace.includes('aria-label="Phân trang danh mục Master Data"'))
  assert(catalogWorkspace.includes('Hiển thị {(currentPage - 1) * pageSize + 1}'))
  assert(studioHeader.includes('lg:hidden'))
  for (const label of ['Danh mục', 'Theo quy trình', 'Bản đồ quan hệ']) {
    assert(viewTabs.includes(`label: '${label}'`))
  }
})

test('employee lifecycle context omits the legal reference panel', () => {
  const contextPanel = read(path.join(root, 'src/widgets/lifecycle-journey/ui/LifecycleStageContextPanel.tsx'))
  assert(!contextPanel.includes('Căn cứ pháp lý tham khảo'))
  assert(!contextPanel.includes('stage.legalReferences.map'))
  assert(contextPanel.includes('4. Phân hệ tham gia'))
})

test('admin tools render inside the employee workspace and keep legacy URLs available', () => {
  const router = read(path.join(root, 'src/app/router.tsx'))
  const employeeWorkspace = read(path.join(root, 'src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx'))
  const adminWorkspace = read(path.join(root, 'src/widgets/admin-workspace/ui/AdminWorkspace.tsx'))
  const knowledgeBoundary = read(path.join(root, 'src/app/layouts/KnowledgeBoundary.tsx'))
  const oldDashboard = path.join(root, 'src/features/user-module-access/ui/AdminDashboard.tsx')
  for (const route of ['/admin/users', '/admin/access', '/admin/catalog', '/admin/master-data', '/admin/settings']) assert(router.includes(route))
  assert(!router.includes('AdminLayout'))
  assert(router.includes('<EmployeeLifecycleAdminPage />'))
  assert(employeeWorkspace.includes('<AdminWorkspace activeSection={activeAdminSection} isDarkMode={isDarkMode} />'))
  assert(adminWorkspace.includes("['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)"))
  assert(adminWorkspace.includes('aria-label="Chức năng quản trị"'))
  assert(knowledgeBoundary.includes("!['ADMIN', 'SUPER_ADMIN'].includes(session.systemRole)"))
  assert(knowledgeBoundary.includes("isAdminWorkspace"))
  assert(knowledgeBoundary.includes("key={session.accountId}"))
  assert(knowledgeBoundary.includes("resetKey={boundaryResetKey}"))
  for (const section of ['overview', 'users', 'access', 'catalog', 'imports', 'master-data', 'audit', 'settings']) {
    assert(adminWorkspace.includes(`id: '${section}'`))
  }
  assert(adminWorkspace.includes('adminSection=${id}'))
  assert.equal(existsSync(oldDashboard), false)
})

test('admin catalog loads independently and does not invent unavailable persistence', () => {
  const api = read(path.join(root, 'src/shared/api/knowledge.api.ts'))
  const catalog = read(path.join(root, 'src/features/admin-catalog/ui/CatalogManagement.tsx'))
  const settings = read(path.join(root, 'src/widgets/admin-workspace/ui/AdminWorkspace.tsx'))
  assert(api.includes('catalogDocuments:'))
  assert(api.includes("apiRequest<KnowledgePage>(`/knowledge-documents?"))
  assert(api.includes("createDocument:"))
  assert(catalog.includes('Sửa và lưu trữ chưa có endpoint'))
  assert(settings.includes('<SystemSettingsForm />'))
  assert(settings.includes('<AuditLogPanel />'))
})



