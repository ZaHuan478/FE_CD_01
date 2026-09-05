import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

let server
const originals = { fetch: globalThis.fetch, window: globalThis.window, localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage, authMode: process.env.VITE_AUTH_MODE }
const storage = new Map()
const calls = []
let nextStatus = 200
before(async () => {
  process.env.VITE_AUTH_MODE = 'development'
  globalThis.window = { setTimeout, clearTimeout }
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) }
  globalThis.sessionStorage = globalThis.localStorage
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init })
    const payload = String(url).endsWith('/bootstrap')
      ? { source: 'mysql', datasets: { 'test.bootstrap': { title: 'Dữ liệu được phép xem' } }, release: { releaseId: 'test', schemaVersion: 1, publishedAt: '2026-01-01' }, stats: {} }
      : { items: [], acknowledged: true, acknowledgedAt: null }
    return new Response(JSON.stringify(nextStatus === 200 ? payload : { error: { message: 'Forbidden' } }), { status: nextStatus, headers: { 'content-type': 'application/json' } })
  }
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
})
after(async () => {
  await server?.close()
  for (const key of ['fetch', 'window', 'localStorage', 'sessionStorage']) {
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

test('feature bootstrap deduplicates requests and resets cached datasets on logout', async () => {
  const bootstrap = await server.ssrLoadModule('/src/features/authentication/model/bootstrap.ts')
  const store = await server.ssrLoadModule('/src/shared/lib/runtime-datasets/runtimeData.ts')
  bootstrap.resetKnowledgeBootstrap()
  const beforeCount = calls.filter((call) => call.url.endsWith('/bootstrap')).length
  const [first, second] = await Promise.all([bootstrap.bootstrapKnowledge(), bootstrap.bootstrapKnowledge()])
  assert.equal(first, second)
  assert.equal(calls.filter((call) => call.url.endsWith('/bootstrap')).length, beforeCount + 1)
  assert.equal(store.getRuntimeDataset('test.bootstrap').title, 'Dữ liệu được phép xem')
  bootstrap.resetKnowledgeBootstrap()
  assert.equal(store.hasRuntimeDataset('test.bootstrap'), false)
  await bootstrap.bootstrapKnowledge()
  assert.equal(calls.filter((call) => call.url.endsWith('/bootstrap')).length, beforeCount + 2)
  bootstrap.resetKnowledgeBootstrap()
})

test('protected workspace renders a loading gate before runtime datasets are installed', async () => {
  storage.set('hrm_demo_account_id', 'pending-user')
  const { default: App } = await server.ssrLoadModule('/src/app/App.tsx')
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: ['/employee-lifecycle'] }, React.createElement(App)))
  assert(html.includes('Đang xác thực quyền truy cập...'))
})
