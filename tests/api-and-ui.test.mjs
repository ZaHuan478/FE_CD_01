import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

let server
const originals = { fetch: globalThis.fetch, window: globalThis.window, document: globalThis.document, localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage, authMode: process.env.VITE_AUTH_MODE }
const storage = new Map()
const calls = []
let nextStatus = 200
before(async () => {
  process.env.VITE_AUTH_MODE = 'development'
  globalThis.window = { setTimeout, clearTimeout }
  globalThis.document = { cookie: '' }
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) }
  globalThis.sessionStorage = globalThis.localStorage
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init })
    const payload = String(url).endsWith('/bootstrap')
      ? { source: 'mysql', datasets: { 'test.bootstrap': { title: 'Dữ liệu được phép xem' } }, release: { releaseId: 'test', schemaVersion: 1, publishedAt: '2026-01-01' }, stats: {} }
      : { items: [], acknowledged: true, acknowledgedAt: null }
    return new Response(JSON.stringify(nextStatus === 200 ? payload : { error: { message: 'Forbidden' } }), { status: nextStatus, headers: { 'content-type': 'application/json' } })
  }
  server = await createServer({
    mode: 'test',
    cacheDir: 'node_modules/.vite-test',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom'
  })
})
after(async () => {
  await server?.close()
  for (const key of ['fetch', 'window', 'document', 'localStorage', 'sessionStorage']) {
    if (originals[key] === undefined) delete globalThis[key]
    else globalThis[key] = originals[key]
  }
  if (originals.authMode === undefined) delete process.env.VITE_AUTH_MODE
  else process.env.VITE_AUTH_MODE = originals.authMode
})

test('auth API preserves endpoint paths and request bodies', async () => {
  const { authApi } = await server.ssrLoadModule('/src/shared/api/auth.api.ts')
  await authApi.getSession()
  assert(calls.at(-1).url.endsWith('/me'))
  await authApi.listDevelopmentAccounts()
  assert(calls.at(-1).url.endsWith('/auth/development-accounts'))
  await authApi.loginDevelopment('demo-user', 'test-only')
  assert(calls.at(-1).url.endsWith('/auth/development-login'))
  assert.equal(calls.at(-1).init.method, 'POST')
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { identifier: 'demo-user', password: 'test-only' })
})

test('HTTP client reads current identity for each request and propagates errors', async () => {
  const { apiRequest } = await server.ssrLoadModule('/src/shared/api/httpClient.ts')
  storage.set('hrm_demo_account_id', 'first-user')
  await apiRequest('/me')
  assert.equal(calls.at(-1).init.headers['x-user-id'], 'first-user')
  storage.set('hrm_demo_account_id', 'second-user')
  await apiRequest('/me')
  assert.equal(calls.at(-1).init.headers['x-user-id'], 'second-user')
  nextStatus = 403
  await assert.rejects(() => apiRequest('/me'), /Forbidden/)
  nextStatus = 200
})

test('development identity is synchronized to a same-origin API cookie', async () => {
  const auth = await server.ssrLoadModule('/src/shared/lib/auth/authCredentials.ts')
  auth.selectDevelopmentAccount('demo/admin')
  assert.match(globalThis.document.cookie, /hrm_demo_account_id=demo%2Fadmin/)
  assert.match(globalThis.document.cookie, /SameSite=Lax/)
  auth.clearAuthentication()
  assert.match(globalThis.document.cookie, /Max-Age=0/)
})

test('source viewer fetches a blob with current identity and fails closed on denied access', async () => {
  const { fetchSopSource } = await server.ssrLoadModule('/src/shared/api/sop-import.api.ts')
  storage.set('hrm_demo_account_id', 'document-owner')
  const controller = new AbortController()
  const file = await fetchSopSource('import/a b', controller.signal)
  assert(file instanceof Blob)
  assert(calls.at(-1).url.endsWith('/sop-imports/import%2Fa%20b/source'))
  assert.equal(calls.at(-1).init.headers['x-user-id'], 'document-owner')
  assert.equal(calls.at(-1).init.signal, controller.signal)
  assert.equal(calls.at(-1).init.cache, 'no-store')
  storage.set('hrm_demo_account_id', 'unrelated-user')
  nextStatus = 403
  try { await assert.rejects(() => fetchSopSource('private'), /Forbidden/) }
  finally { nextStatus = 200 }
})

test('policy acknowledgement encodes IDs and preserves PUT contract', async () => {
  const { policyAcknowledgementApi } = await server.ssrLoadModule('/src/shared/api/policy-acknowledgement.api.ts')
  await policyAcknowledgementApi.getPolicyAcknowledgement('POL/a?b')
  assert(calls.at(-1).url.endsWith('/policy-acknowledgements/POL%2Fa%3Fb'))
  await policyAcknowledgementApi.setPolicyAcknowledgement('POL-1', 'test-timestamp')
  assert.equal(calls.at(-1).init.method, 'PUT')
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { acknowledged: true })
  await policyAcknowledgementApi.setPolicyAcknowledgement('POL-1', null)
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { acknowledged: false })
})

test('runtime datasets still require bootstrap and can be reset at logout', async () => {
  const store = await server.ssrLoadModule('/src/shared/lib/runtime-datasets/runtimeData.ts')
  assert.throws(() => store.getRuntimeDataset('test'), /not been initialized/)
  store.installRuntimeDatasets({ test: { title: 'Quy trình tiếng Việt' } })
  assert.equal(store.getRuntimeDataset('test').title, 'Quy trình tiếng Việt')
  assert.throws(() => store.getRuntimeDataset('missing'), /missing/)
  store.resetRuntimeDatasets()
  assert.equal(store.hasRuntimeDataset('test'), false)
})

test('atomic wrappers preserve native markup, form types and accessibility props', async () => {
  const { Button } = await server.ssrLoadModule('/src/shared/ui/atoms/Button.tsx')
  const { Input } = await server.ssrLoadModule('/src/shared/ui/atoms/Input.tsx')
  for (const [Component, tag, props] of [
    [Button, 'button', { type: 'submit', disabled: true, className: 'original-button', 'aria-label': 'Đăng nhập', children: 'Lưu' }],
    [Input, 'input', { type: 'password', name: 'password', className: 'original-input', autoComplete: 'current-password', disabled: true }]
  ]) assert.equal(renderToStaticMarkup(React.createElement(Component, props)), renderToStaticMarkup(React.createElement(tag, props)))
})

test('select atom keeps native semantics with rounded and keyboard focus styling', async () => {
  const { Select } = await server.ssrLoadModule('/src/shared/ui/atoms/Select.tsx')
  const html = renderToStaticMarkup(React.createElement(Select, { 'aria-label': 'Mọi trạng thái', defaultValue: 'all' },
    React.createElement('option', { value: 'all' }, 'Mọi trạng thái')))
  assert(html.includes('<select'))
  assert(html.includes('rounded-xl'))
  assert(html.includes('focus-visible:ring-2'))
  assert(html.includes('aria-label="Mọi trạng thái"'))
})

test('knowledge API has separate encoded list, search and detail requests', async () => {
  const { knowledgeApi } = await server.ssrLoadModule('/src/shared/api/knowledge.api.ts')
  await knowledgeApi.documents('pay', 2)
  assert(calls.at(-1).url.includes('/knowledge-documents?moduleId=pay&page=2&pageSize=20'))
  await knowledgeApi.search('quy trình & thuế')
  const url = new URL(calls.at(-1).url, 'http://localhost')
  assert.equal(url.searchParams.get('q'), 'quy trình & thuế')
  await knowledgeApi.workflow('MODULE/PAY')
  assert(calls.at(-1).url.endsWith('/ui/workflows/MODULE%2FPAY'))
  assert(!calls.some(call => call.url.endsWith('/bootstrap')))
})

test('admin access API separates account, module and assignment operations', async () => {
  const { adminAccessApi } = await server.ssrLoadModule('/src/shared/api/admin-access.api.ts')
  await adminAccessApi.users()
  assert(calls.at(-1).url.endsWith('/admin/users'))
  await adminAccessApi.userModules('account/a?b')
  assert(calls.at(-1).url.endsWith('/admin/users/account%2Fa%3Fb/module-access'))
  await adminAccessApi.replaceUserModules('employee-1', ['emp', 'pay'])
  assert.equal(calls.at(-1).init.method, 'PUT')
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { moduleIds: ['emp', 'pay'] })
  await adminAccessApi.updateUser('employee-1', { active: false })
  assert.equal(calls.at(-1).init.method, 'PATCH')
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { active: false })
  await adminAccessApi.createUser({ username: 'new-user', fullName: 'Người dùng mới' })
  assert(calls.at(-1).url.endsWith('/accounts'))
  assert.equal(calls.at(-1).init.method, 'POST')
  await adminAccessApi.modules()
  assert(calls.at(-1).url.endsWith('/modules'))
})

test('protected workspace renders a loading gate before runtime datasets are installed', async () => {
  storage.set('hrm_demo_account_id', 'pending-user')
  const { default: App } = await server.ssrLoadModule('/src/app/App.tsx')
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/employee-lifecycle'] }, React.createElement(App)))
  assert(html.includes('Đang xác thực quyền truy cập...'))
})

test('my documents API encodes filters, pagination and mutation payloads', async () => {
  const { myDocumentsApi, fetchDocumentBlob } = await server.ssrLoadModule('/src/shared/api/my-documents.api.ts')
  storage.set('hrm_demo_account_id', 'doc-owner')

  await myDocumentsApi.list({ search: 'hướng dẫn', format: 'pdf', tab: 'active', page: 2, pageSize: 10 })
  assert(calls.at(-1).url.includes('/my-documents?search=h%C6%B0%E1%BB%9Bng+d%E1%BA%ABn&format=pdf&tab=active&page=2&pageSize=10'))

  await myDocumentsApi.rename('doc-123', 'Tên mới')
  assert.equal(calls.at(-1).init.method, 'PATCH')
  assert(calls.at(-1).url.endsWith('/my-documents/doc-123'))
  assert.deepEqual(JSON.parse(calls.at(-1).init.body), { displayName: 'Tên mới' })

  await myDocumentsApi.delete('doc-123')
  assert.equal(calls.at(-1).init.method, 'DELETE')
  assert(calls.at(-1).url.endsWith('/my-documents/doc-123'))

  await myDocumentsApi.restore('doc-123')
  assert.equal(calls.at(-1).init.method, 'POST')
  assert(calls.at(-1).url.endsWith('/my-documents/doc-123/restore'))

  const blob = await fetchDocumentBlob('doc-123')
  assert(blob instanceof Blob)
  assert(calls.at(-1).url.endsWith('/my-documents/doc-123/file'))
  assert.equal(calls.at(-1).init.headers['x-user-id'], 'doc-owner')
})
