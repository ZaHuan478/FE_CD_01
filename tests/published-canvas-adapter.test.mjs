import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/features/document-conversion/model/workflowCanvasPreview.ts', import.meta.url), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { workflowCanvasPreview } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)

test('existing SOP converts to a connected canvas without an import job or invented decision branches', () => {
  const steps = ['Tiếp nhận', 'Kiểm tra', 'Phê duyệt'].map((title, index) => ({ stepCode: `EMP-${index}`, title, actor: 'HR', location: 'HRMS', timing: 'Trong ngày', description: title, typeCode: index === 2 ? 'M' : 'N', fieldsChecklist: ['Hồ sơ'] }))
  const source = { sopCode: 'SOP-EMP-01', sopTitle: 'Quy trình', sopCategory: 'EMP', description: 'Mô tả', steps }
  const snapshot = JSON.stringify(source)
  const preview = workflowCanvasPreview(source)
  assert.equal(preview.steps.length, 3)
  assert.equal(preview.transitions.length, 2)
  assert.equal(new Set(preview.steps.map(step => step.id)).size, 3)
  for (const [index, edge] of preview.transitions.entries()) {
    assert.equal(edge.fromStepId, preview.steps[index].id)
    assert.equal(edge.toStepId, preview.steps[index + 1].id)
  }
  assert.equal(preview.steps[2].nodeKind, 'task')
  assert.equal(preview.steps[2].typeCode, 'M')
  assert.deepEqual(preview.steps[0].checklist, ['Hồ sơ'])
  assert.equal(JSON.stringify(source), snapshot)
})

test('empty SOP produces a safe empty canvas', () => {
  const preview = workflowCanvasPreview({ sopCode: 'EMPTY', sopTitle: 'Trống', sopCategory: '', description: '', steps: [] })
  assert.deepEqual(preview.steps, [])
  assert.deepEqual(preview.transitions, [])
})
