import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
const originals = {
  fetch: globalThis.fetch,
  window: globalThis.window,
  document: globalThis.document,
  localStorage: globalThis.localStorage,
  sessionStorage: globalThis.sessionStorage
}
const storage = new Map()
const apiCalls = []

before(async () => {
  globalThis.window = {
    setTimeout,
    clearTimeout,
    history: { length: 2 },
    document: { documentElement: { classList: { contains: () => false } } }
  }
  globalThis.document = {
    cookie: '',
    documentElement: { classList: { contains: () => false } }
  }
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key)
  }
  globalThis.sessionStorage = globalThis.localStorage
  globalThis.fetch = async (url, init) => {
    apiCalls.push({ url: String(url), init })
    return new Response(JSON.stringify({ data: [], items: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
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
})

test('1. publishedSopDestination always navigates by documentId regardless of workflowId', async () => {
  const { publishedSopDestination } = await server.ssrLoadModule('/src/widgets/module-explorer/model/moduleNavigation.ts')

  // Case A: Document HAS workflowId
  const docWithWorkflow = {
    id: 'doc-rec-001',
    code: 'SOP-REC-01',
    title: 'Quy trình tuyển dụng',
    type: 'procedure',
    status: 'published',
    workflowId: 'WF-RECRUITMENT',
    moduleIds: ['MODULE-REC']
  }
  const destWithWorkflow = publishedSopDestination(docWithWorkflow)
  assert.equal(
    destWithWorkflow,
    '/employee-lifecycle/knowledge-documents/doc-rec-001',
    'Must route by documentId even when workflowId exists'
  )
  assert(
    !destWithWorkflow.includes('/workflow/'),
    'Must NOT route to /workflow/:workflowId'
  )

  // Case B: Document DOES NOT have workflowId
  const docWithoutWorkflow = {
    id: 'doc-onb-002',
    code: 'SOP-ONB-02',
    title: 'Quy trình hội nhập',
    type: 'procedure',
    status: 'published',
    moduleIds: ['MODULE-ONB']
  }
  const destWithoutWorkflow = publishedSopDestination(docWithoutWorkflow)
  assert.equal(
    destWithoutWorkflow,
    '/employee-lifecycle/knowledge-documents/doc-onb-002',
    'Must route by documentId when workflowId is absent'
  )
})

test('2. SOP with workflowId and SOP without workflowId map to unified preview schema', async () => {
  const { documentToPreview } = await server.ssrLoadModule('/src/features/sop-viewer/ui/CanonicalSopViewer.tsx')

  const docWithWf = {
    id: 'doc-with-wf',
    code: 'SOP-01',
    title: 'SOP Có Workflow',
    type: 'procedure',
    status: 'published',
    version: 2,
    moduleIds: ['MODULE-HR'],
    workflowId: 'WF-CORE-01',
    content: {
      category: 'Tuyển dụng',
      purpose: 'Mục đích tuyển dụng chuẩn',
      steps: [
        { id: 's1', code: 'STEP-01', title: 'Tiếp nhận nhu cầu', actor: 'HR Recruiter' },
        { id: 's2', code: 'STEP-02', title: 'Đăng tin tuyển dụng', actor: 'HR Lead' }
      ],
      transitions: [
        { fromStepId: 's1', toStepId: 's2', kind: 'normal' }
      ]
    }
  }

  const docWithoutWf = {
    id: 'doc-without-wf',
    code: 'SOP-02',
    title: 'SOP Không Có Workflow',
    type: 'procedure',
    status: 'published',
    version: 1,
    moduleIds: ['MODULE-HR'],
    content: {
      category: 'Tuyển dụng',
      purpose: 'Mục đích độc lập',
      steps: [
        { id: 's10', code: 'STEP-01', title: 'Khởi tạo hồ sơ', actor: 'Nhân viên' }
      ],
      transitions: []
    }
  }

  const previewWithWf = documentToPreview(docWithWf)
  const previewWithoutWf = documentToPreview(docWithoutWf)

  // Both have same preview shape
  assert.equal(previewWithWf.code, 'SOP-01')
  assert.equal(previewWithWf.steps.length, 2)
  assert.equal(previewWithWf.steps[0].actor, 'HR Recruiter')

  assert.equal(previewWithoutWf.code, 'SOP-02')
  assert.equal(previewWithoutWf.steps.length, 1)
  assert.equal(previewWithoutWf.steps[0].actor, 'Nhân viên')
})

test('3. SOP missing optional fields shows "Chưa được khai báo" and avoids fake boilerplate texts', async () => {
  const { selectWorkflowBusinessBrief } = await server.ssrLoadModule('/src/entities/sop/lib/workflowSelectors.ts')

  // Process with completely empty optional fields
  const emptyProcess = {
    sopCode: 'SOP-EMPTY',
    sopTitle: 'SOP Rỗng Tùy Chọn',
    sopCategory: 'Chung',
    description: '',
    steps: [
      {
        stepCode: 'B1',
        title: 'Bước không khai báo chi tiết',
        actor: '',
        location: '',
        timing: '',
        typeCode: 'N',
        description: ''
      }
    ]
  }

  const brief = selectWorkflowBusinessBrief(emptyProcess)

  // Must show "Chưa được khai báo"
  assert.equal(brief.when, 'Chưa được khai báo')
  assert.equal(brief.who, 'Chưa được khai báo')
  assert.deepEqual(brief.inputs, ['Chưa được khai báo'])
  assert.deepEqual(brief.outputs, ['Chưa được khai báo'])

  // MUST NOT contain forbidden fake boilerplate texts
  const forbiddenPhrases = [
    'Kích hoạt khi phát sinh nhu cầu',
    'Chuyên viên nhân sự & Quản lý phụ trách',
    'Hồ sơ yêu cầu & Chứng từ liên quan',
    'Bản ghi kết quả cập nhật trên hệ thống'
  ]

  for (const phrase of forbiddenPhrases) {
    assert(!brief.when.includes(phrase), `Brief 'when' must not contain fake text: "${phrase}"`)
    assert(!brief.who.includes(phrase), `Brief 'who' must not contain fake text: "${phrase}"`)
    for (const inp of brief.inputs) {
      assert(!inp.includes(phrase), `Brief input must not contain fake text: "${phrase}"`)
    }
    for (const out of brief.outputs) {
      assert(!out.includes(phrase), `Brief output must not contain fake text: "${phrase}"`)
    }
  }
})

test('4. Step inputs and outputs are strictly step-level and do not inherit distributed process-level inputs', async () => {
  const { documentToPreview } = await server.ssrLoadModule('/src/features/sop-viewer/ui/CanonicalSopViewer.tsx')

  const docWithMixedSteps = {
    id: 'doc-mixed',
    code: 'SOP-MIXED',
    title: 'SOP Test Inputs',
    type: 'procedure',
    status: 'published',
    moduleIds: ['MODULE-HR'],
    content: {
      inputs: ['Quyết định chung cấp công ty'],
      outputs: ['Báo cáo chung toàn hệ thống'],
      steps: [
        {
          id: 'step-1',
          title: 'Bước 1 có input riêng',
          inputs: [{ name: 'Phiếu yêu cầu tuyển dụng', required: true }]
        },
        {
          id: 'step-2',
          title: 'Bước 2 không có input riêng'
        }
      ]
    }
  }

  const preview = documentToPreview(docWithMixedSteps)

  assert.equal(preview.steps[0].inputs?.length, 1)
  assert.equal(preview.steps[0].inputs[0].name, 'Phiếu yêu cầu tuyển dụng')

  // Step 2 has no inputs, MUST be empty array, NOT inherited from process.inputs
  assert.deepEqual(preview.steps[1].inputs, [])
})

test('5. Sibling SOP selection queries catalog by moduleId and navigates by documentId', async () => {
  const { fetchPublishedSopsForModule } = await server.ssrLoadModule('/src/widgets/module-explorer/model/moduleNavigation.ts')

  apiCalls.length = 0
  const result = await fetchPublishedSopsForModule('MODULE-PAY')

  assert.equal(result.length, 0)
  assert(apiCalls.length > 0)
  const lastCall = apiCalls.at(-1)
  assert(lastCall.url.includes('/knowledge-documents'))
  assert(lastCall.url.includes('moduleId=MODULE-PAY'))
  assert(lastCall.url.includes('type=procedure'))
})

test('6. Real branching condition is preserved when kind is conditional or condition text exists', async () => {
  const { documentToPreview } = await server.ssrLoadModule('/src/features/sop-viewer/ui/CanonicalSopViewer.tsx')

  const docWithBranch = {
    id: 'doc-branch',
    code: 'SOP-BRANCH',
    title: 'SOP Rẽ nhánh',
    type: 'procedure',
    status: 'published',
    moduleIds: ['MODULE-HR'],
    content: {
      steps: [
        { id: 's1', title: 'Phỏng vấn chuyên môn' },
        { id: 's2', title: 'Thỏa thuận đề xuất việc làm' },
        { id: 's3', title: 'Gửi thư từ chối' }
      ],
      transitions: [
        {
          fromStepId: 's1',
          toStepId: 's2',
          kind: 'conditional',
          condition: 'Đạt yêu cầu phỏng vấn (Điểm >= 8)',
          branchLabel: 'Đạt'
        },
        {
          fromStepId: 's1',
          toStepId: 's3',
          kind: 'conditional',
          condition: 'Không đạt yêu cầu phỏng vấn (Điểm < 8)',
          branchLabel: 'Không đạt'
        }
      ]
    }
  }

  const preview = documentToPreview(docWithBranch)
  assert.equal(preview.transitions.length, 2)

  const passTransition = preview.transitions.find(t => t.toStepId === 's2')
  assert(passTransition)
  assert.equal(passTransition.kind, 'conditional')
  assert.equal(passTransition.condition, 'Đạt yêu cầu phỏng vấn (Điểm >= 8)')
  assert.equal(passTransition.branchLabel, 'Đạt')
})

test('7. Sequential normal transitions do not invent fake conditions or branches', async () => {
  const { documentToPreview } = await server.ssrLoadModule('/src/features/sop-viewer/ui/CanonicalSopViewer.tsx')

  const docSequential = {
    id: 'doc-seq',
    code: 'SOP-SEQ',
    title: 'SOP Tuyến tính',
    type: 'procedure',
    status: 'published',
    moduleIds: ['MODULE-HR'],
    content: {
      steps: [
        { id: 's1', title: 'Tiếp nhận bàn giao' },
        { id: 's2', title: 'Kiểm tra tài sản' },
        { id: 's3', title: 'Xác nhận ký biên bản' }
      ],
      transitions: [
        { fromStepId: 's1', toStepId: 's2', kind: 'normal' },
        { fromStepId: 's2', toStepId: 's3', kind: 'normal' }
      ]
    }
  }

  const preview = documentToPreview(docSequential)
  for (const t of preview.transitions) {
    assert.equal(t.kind, 'normal')
    assert.equal(t.condition, '')
    assert.equal(t.branchLabel, '')
  }
})
