import { ArrowDown, ArrowUp, GitBranch, Plus, Trash2 } from 'lucide-react'
import type { SopImportPreview } from '../model/sopManagementModel'
import type { SopImportStep } from '../../sop-import/model/sopImportModel'
import { Select } from '../../../shared/ui/atoms/Select'
import { Panel, adminInputClass, secondaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'

interface BusinessWorkflowEditorProps {
  preview: SopImportPreview
  editable: boolean
  onPreview: (preview: SopImportPreview) => void
}

function newStep(index: number): SopImportStep {
  const id = crypto.randomUUID()
  return {
    id,
    stableKey: id,
    code: `STEP-${String(index + 1).padStart(2, '0')}`,
    title: 'Bước mới',
    nodeKind: 'task',
    typeCode: 'N',
    description: '',
    actor: '',
    location: '',
    timing: '',
    sortOrder: index + 1,
    checklist: [],
    inputs: [],
    outputs: []
  }
}

export function BusinessWorkflowEditor({ preview, editable, onPreview }: BusinessWorkflowEditorProps) {
  const patchStep = (index: number, patch: Partial<SopImportStep>) => {
    onPreview({ ...preview, steps: preview.steps.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step) })
  }

  const addStep = () => {
    const step = newStep(preview.steps.length)
    const previous = preview.steps.at(-1)
    onPreview({
      ...preview,
      steps: [...preview.steps, step],
      transitions: previous ? [...preview.transitions, {
        id: crypto.randomUUID(),
        fromStepId: previous.id,
        toStepId: step.id,
        kind: 'normal',
        sortOrder: preview.transitions.length + 1
      }] : preview.transitions
    })
  }

  const removeStep = (index: number) => {
    const target = preview.steps[index]
    if (!target || !window.confirm(`Xóa bước “${target.title}” và các liên kết liên quan?`)) return
    onPreview({
      ...preview,
      steps: preview.steps.filter((_, stepIndex) => stepIndex !== index).map((step, stepIndex) => ({ ...step, sortOrder: stepIndex + 1 })),
      transitions: preview.transitions.filter(transition => transition.fromStepId !== target.id && transition.toStepId !== target.id)
    })
  }

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= preview.steps.length) return
    const steps = [...preview.steps]
    ;[steps[index], steps[target]] = [steps[target]!, steps[index]!]
    onPreview({ ...preview, steps: steps.map((step, stepIndex) => ({ ...step, sortOrder: stepIndex + 1 })) })
  }

  const addTransition = () => {
    if (preview.steps.length < 2) return
    onPreview({ ...preview, transitions: [...preview.transitions, {
      id: crypto.randomUUID(),
      fromStepId: preview.steps[0]!.id,
      toStepId: preview.steps[1]!.id,
      kind: 'normal',
      sortOrder: preview.transitions.length + 1
    }] })
  }

  const patchTransition = (index: number, patch: Partial<SopImportPreview['transitions'][number]>) => {
    onPreview({ ...preview, transitions: preview.transitions.map((transition, transitionIndex) => transitionIndex === index ? { ...transition, ...patch } : transition) })
  }

  const removeTransition = (index: number) => {
    onPreview({ ...preview, transitions: preview.transitions.filter((_, transitionIndex) => transitionIndex !== index).map((transition, transitionIndex) => ({ ...transition, sortOrder: transitionIndex + 1 })) })
  }

  return <div className="space-y-4">
    <Panel title={`Workflow nghiệp vụ (${preview.steps.length} bước)`} description="Hiệu chỉnh tuần tự các bước, vai trò và nội dung chuyển tiếp bằng biểu mẫu nghiệp vụ.">
      <div className="space-y-3 p-4">
        {preview.steps.map((step, index) => <article key={step.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-[#155e75] text-xs font-black text-white">{index + 1}</span>
            <strong className="min-w-0 flex-1 truncate text-sm">{step.title}</strong>
            {editable && <div className="flex gap-1">
              <IconButton label="Chuyển bước lên" disabled={index === 0} onClick={() => moveStep(index, -1)}><ArrowUp className="size-4" /></IconButton>
              <IconButton label="Chuyển bước xuống" disabled={index === preview.steps.length - 1} onClick={() => moveStep(index, 1)}><ArrowDown className="size-4" /></IconButton>
              <IconButton label="Xóa bước" danger onClick={() => removeStep(index)}><Trash2 className="size-4" /></IconButton>
            </div>}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Mã bước"><input disabled={!editable} value={step.code} onChange={event => patchStep(index, { code: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Tên bước" wide><input disabled={!editable} value={step.title} onChange={event => patchStep(index, { title: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Vai trò thực hiện"><input disabled={!editable} value={step.actor ?? ''} onChange={event => patchStep(index, { actor: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Nơi/kênh thực hiện"><input disabled={!editable} value={step.location ?? ''} onChange={event => patchStep(index, { location: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Thời hạn/SLA"><input disabled={!editable} value={step.timing ?? ''} onChange={event => patchStep(index, { timing: event.target.value })} className={adminInputClass} /></Field>
            <Field label="Loại bước"><Select disabled={!editable} value={step.nodeKind} onChange={event => patchStep(index, { nodeKind: event.target.value as SopImportStep['nodeKind'] })} className={adminInputClass}><option value="start">Bắt đầu</option><option value="task">Thao tác</option><option value="decision">Điều kiện quyết định</option><option value="parallel_fork">Tách song song</option><option value="parallel_join">Hợp nhất</option><option value="subprocess">Quy trình con</option><option value="end">Kết thúc</option></Select></Field>
            <Field label="Mục tiêu" wide><textarea disabled={!editable} rows={2} value={step.objective ?? ''} onChange={event => patchStep(index, { objective: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
            <Field label="Mô tả thao tác" wide><textarea disabled={!editable} rows={4} value={step.description ?? ''} onChange={event => patchStep(index, { description: event.target.value })} className={`${adminInputClass} h-auto py-2`} /></Field>
            <Field label="Checklist" wide><textarea disabled={!editable} rows={3} value={(step.checklist ?? []).join('\n')} onChange={event => patchStep(index, { checklist: event.target.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean) })} placeholder="Mỗi thao tác một dòng" className={`${adminInputClass} h-auto py-2`} /></Field>
          </div>
        </article>)}
        {!preview.steps.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">Chưa có bước nghiệp vụ.</p>}
        {editable && <button type="button" onClick={addStep} className={secondaryButtonClass}><Plus className="size-4" />Thêm bước</button>}
      </div>
    </Panel>

    <Panel title={`Liên kết và điều kiện (${preview.transitions.length})`} description="Chỉ dùng điều kiện khi workflow thực sự rẽ nhánh; luồng song song phải chọn đúng loại liên kết.">
      <div className="space-y-3 p-4">
        {preview.transitions.map((transition, index) => <article key={transition.id ?? index} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_1fr_auto] dark:border-slate-800">
          <Field label="Từ bước"><Select disabled={!editable} value={transition.fromStepId ?? ''} onChange={event => patchTransition(index, { fromStepId: event.target.value })} className={adminInputClass}>{preview.steps.map(step => <option key={step.id} value={step.id}>{step.code} · {step.title}</option>)}</Select></Field>
          <Field label="Đến bước"><Select disabled={!editable} value={transition.toStepId ?? ''} onChange={event => patchTransition(index, { toStepId: event.target.value })} className={adminInputClass}>{preview.steps.map(step => <option key={step.id} value={step.id}>{step.code} · {step.title}</option>)}</Select></Field>
          <Field label="Loại liên kết"><Select disabled={!editable} value={transition.kind} onChange={event => patchTransition(index, { kind: event.target.value as typeof transition.kind })} className={adminInputClass}><option value="normal">Tuần tự</option><option value="conditional">Có điều kiện</option><option value="return">Quay lại</option><option value="parallel_fork">Tách song song</option><option value="parallel_join">Hợp nhất</option><option value="subprocess">Quy trình con</option></Select></Field>
          <Field label="Nhãn/điều kiện"><input disabled={!editable} value={transition.branchLabel || transition.condition || ''} onChange={event => patchTransition(index, transition.kind === 'conditional' ? { condition: event.target.value } : { branchLabel: event.target.value })} placeholder={transition.kind === 'conditional' ? 'Ví dụ: Hồ sơ hợp lệ' : 'Tùy chọn'} className={adminInputClass} /></Field>
          {editable && <div className="flex items-end"><IconButton label="Xóa liên kết" danger onClick={() => removeTransition(index)}><Trash2 className="size-4" /></IconButton></div>}
        </article>)}
        {editable && <button type="button" disabled={preview.steps.length < 2} onClick={addTransition} className={secondaryButtonClass}><GitBranch className="size-4" />Thêm liên kết</button>}
      </div>
    </Panel>
  </div>
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`grid gap-1.5 text-sm font-bold ${wide ? 'md:col-span-2' : ''}`}><span>{label}</span>{children}</label>
}

function IconButton({ label, disabled, danger, onClick, children }: { label: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={label} className={`grid size-10 place-items-center rounded-lg disabled:opacity-30 ${danger ? 'text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{children}</button>
}
