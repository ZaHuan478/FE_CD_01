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
    '/', '/login', '/employee-lifecycle', '/employee-lifecycle/journey', '/employee-lifecycle/lifecycle',
    '/employee-lifecycle/operations', '/employee-lifecycle/masterdata', '/employee-lifecycle/reports',
    '/employee-lifecycle/workbench', '/employee-lifecycle/infographic/:id', '/employee-lifecycle/flowchart/:id',
    '/employee-lifecycle/raci/:id', '/employee-lifecycle/workflow/:id', '/employee-lifecycle/wireframe/:id',
    '/employee-lifecycle/erd', '/employee-lifecycle/policies', '/employee-lifecycle/policies/:id', '/employee-lifecycle/admin', '*'
  ])
  assert(router.includes("import('../pages/employee-lifecycle/EmployeeLifecyclePage')"))
})
