import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'node:stream'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

let server
let store
const originals = Object.fromEntries(['window', 'document', 'localStorage', 'sessionStorage', '__knowledgeTestSession'].map(key => [key, globalThis[key]]))
const session = { accountId: 'test', modules: ['ats', 'emp', 'onb', 'att', 'leave', 'pay', 'ins', 'tax', 'ess'].map(id => ({ id, title: id })),
  menuItems: ['overview-dashboard', 'layer-1-master-data', 'layer-2-lifecycle', 'layer-3-operations', 'system-support', 'process-library', 'policy-center', 'ADMIN'].map(code => ({ code })), grants: [], capabilities: {}, systemRole: 'ADMIN', fullName: 'Test user', organization: {} }
before(async () => {
  const storage = new Map()
  globalThis.window = { setTimeout, clearTimeout }
  globalThis.document = { documentElement: { classList: { contains: () => false } } }
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) }
  globalThis.sessionStorage = globalThis.localStorage
  globalThis.__knowledgeTestSession = session
  server = await createServer({
    plugins: [{ name: 'test-auth-context', enforce: 'pre',
      resolveId(id) { if (id.includes('authentication/model/session')) return '\0test-session' },
      load(id) { if (id === '\0test-session') return 'export const useSession = () => globalThis.__knowledgeTestSession; export const useAuth = () => ({ session: globalThis.__knowledgeTestSession, status: "authenticated", roleTitle: "Test", logout() {} }); export const signOut = () => {}' }
    }],
    server: { middlewareMode: true, hmr: false }, appType: 'custom'
  })
  store = await server.ssrLoadModule('/src/shared/lib/runtime-datasets/runtimeData.ts')
})
after(async () => {
  await server?.close()
  for (const [key, value] of Object.entries(originals)) {
    if (value === undefined) delete globalThis[key]
    else globalThis[key] = value
  }
})

test('on-demand reads deduplicate and discard late data after logout', async () => {
  store.resetRuntimeDatasets()
  const resolvers = []
  let signal
  store.configureRuntimeLoader((_key, nextSignal) => { signal = nextSignal; return new Promise(resolve => resolvers.push(resolve)) })
  const first = store.loadRuntimeDataset('test')
  assert.equal(first, store.loadRuntimeDataset('test'))
  assert.equal(resolvers.length, 1)
  store.resetRuntimeDatasets()
  assert.equal(signal.aborted, true)
  resolvers[0]({ privateTo: 'old-user' })
  await first
  assert.equal(store.hasRuntimeDataset('test'), false)
  const second = store.loadRuntimeDataset('test')
  resolvers[1]({ privateTo: 'new-user' })
  await second
  assert.equal(store.getRuntimeDataset('test').privateTo, 'new-user')
})

test('failed reads surface an error and a reset permits retry', async () => {
  store.resetRuntimeDatasets()
  store.configureRuntimeLoader(async () => { throw new Error('test-read-failed') })
  await store.loadRuntimeDataset('failed')
  assert.throws(() => store.getRuntimeDataset('failed'), /test-read-failed/)
  store.resetRuntimeDatasets()
  store.configureRuntimeLoader(async () => ({ ok: true }))
  await store.loadRuntimeDataset('failed')
  assert.equal(store.getRuntimeDataset('failed').ok, true)
})

test('derived readers retain identity only for the current session', () => {
  store.resetRuntimeDatasets()
  let count = 0
  const read = store.memoRuntime(() => ({ count: ++count }))
  assert.equal(read(), read())
  store.resetRuntimeDatasets()
  assert.equal(read().count, 2)
})

test('importing the workspace does not fetch data or require bootstrap', async () => {
  store.resetRuntimeDatasets()
  let reads = 0
  store.configureRuntimeLoader(async () => { reads++; throw new Error('unexpected eager read') })
  await server.ssrLoadModule('/src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx')
  await server.ssrLoadModule('/src/widgets/module-explorer/ui/SystemOverviewDashboard.tsx')
  assert.equal(reads, 0)
  const source = readFileSync(new URL('../src/features/authentication/model/session.tsx', import.meta.url), 'utf8')
  assert(!source.includes('bootstrapKnowledge'))
})

async function render(element) {
  return new Promise((resolve, reject) => {
    let html = ''
    const output = new PassThrough()
    output.on('data', chunk => { html += chunk.toString() })
    const timeout = setTimeout(() => { stream.abort(); reject(new Error('Render timed out')) }, 15000)
    output.on('end', () => { clearTimeout(timeout); resolve(html) })
    const stream = renderToPipeableStream(element, {
      onAllReady() { stream.pipe(output) },
      onError(error) { clearTimeout(timeout); reject(error) }
    })
  })
}

test('home loads metadata only and a direct SOP URL loads its own workflow', async t => {
  let snapshot
  try { snapshot = JSON.parse(readFileSync(new URL('../../BackEnd/data/import/legacy-snapshot.json', import.meta.url), 'utf8')) }
  catch { t.skip('Local migration snapshot is not checked into Git'); return }
  const datasets = Object.fromEntries(snapshot.tables.AppConfig.filter(row => row.ConfigKey.startsWith('ui.dataset.')).map(row => [row.ConfigKey.slice(11), JSON.parse(row.ValueJson)]))
  const workflows = datasets['workflow.sopDatabase']
  const index = Object.fromEntries(Object.entries(workflows).map(([id, processes]) => [id, processes.map(process => ({
    ...process, steps: process.steps.map(({ stepCode, title, actor, typeCode, sourceTypeCode, fieldsChecklist }) => ({ stepCode, title, actor, typeCode, sourceTypeCode, fieldsChecklist }))
  }))]))
  const reads = []
  store.configureRuntimeLoader(async key => {
    reads.push(key)
    if (key === 'workflow.index') return index
    if (key.startsWith('workflow.detail:')) return workflows[key.slice('workflow.detail:'.length)]
    assert(key in datasets, key)
    return datasets[key]
  })
  const { EmployeeWorkspace } = await server.ssrLoadModule('/src/widgets/employee-workspace/ui/EmployeeWorkspace.tsx')
  const { LanguageProvider } = await server.ssrLoadModule('/src/shared/lib/i18n/LanguageContext.tsx')
  const tree = route => React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(LanguageProvider, null,
    React.createElement(React.Suspense, { fallback: 'loading' }, React.createElement(Routes, null,
      React.createElement(Route, { path: '/employee-lifecycle', element: React.createElement(EmployeeWorkspace) }),
      React.createElement(Route, { path: '/employee-lifecycle/workflow/:id', element: React.createElement(EmployeeWorkspace) })))))
  store.resetRuntimeDatasets()
  const home = await render(tree('/employee-lifecycle'))
  assert(home.length > 500)
  assert(!reads.includes('workflow.sopDatabase'))
  assert(!reads.includes('masterData.catalog'))
  assert(!reads.includes('policy.registry'))
  assert(!reads.some(key => key.startsWith('workflow.detail:')), reads.join(', '))
  reads.length = 0
  store.resetRuntimeDatasets()
  const detail = await render(tree('/employee-lifecycle/workflow/MODULE-PAY'))
  assert(detail.includes(workflows['MODULE-PAY'][0].sopTitle))
  assert(reads.includes('workflow.detail:MODULE-PAY'))
  assert.deepEqual(reads.filter(key => key.startsWith('workflow.detail:')), ['workflow.detail:MODULE-PAY'])
})
