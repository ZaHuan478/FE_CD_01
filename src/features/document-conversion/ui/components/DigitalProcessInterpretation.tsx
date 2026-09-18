import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  FileText,
  GitBranch,
  Link2,
  ShieldAlert,
  UserCheck
} from 'lucide-react'
import type { SopImportItem, SopImportPreview, SopImportStep } from '../../model/documentConversionModel'
import { Panel } from '../../../../shared/ui/molecules/AdminSurface'

interface DigitalProcessInterpretationProps {
  item: SopImportItem
  preview: SopImportPreview
}

type CheckStatus = 'pass' | 'warning' | 'error'

interface InterpretationCheck {
  label: string
  detail: string
  status: CheckStatus
}

const nodeKindLabels: Record<SopImportStep['nodeKind'], string> = {
  start: 'Bắt đầu',
  task: 'Thao tác',
  decision: 'Điều kiện',
  parallel_fork: 'Tách song song',
  parallel_join: 'Hợp nhất',
  subprocess: 'Quy trình con',
  end: 'Kết thúc'
}

const transitionKindLabels: Record<SopImportPreview['transitions'][number]['kind'], string> = {
  normal: 'Tiếp theo',
  conditional: 'Theo điều kiện',
  return: 'Quay lại',
  parallel_fork: 'Chạy song song',
  parallel_join: 'Hợp nhất',
  subprocess: 'Mở quy trình con'
}

function percent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0
}

function coverageCheck(label: string, count: number, total: number, missingDetail: string): InterpretationCheck {
  const coverage = percent(count, total)
  return coverage === 100
    ? { label, detail: `${count}/${total} bước đã có dữ liệu.`, status: 'pass' }
    : { label, detail: `${count}/${total} bước (${coverage}%). ${missingDetail}`, status: 'warning' }
}

export function DigitalProcessInterpretation({ item, preview }: DigitalProcessInterpretationProps) {
  const steps = preview.steps
  const transitions = preview.transitions
  const stepById = new Map(steps.map(step => [step.id, step]))
  const outgoingByStep = new Map<string, typeof transitions>()
  for (const transition of transitions) {
    if (!transition.fromStepId) continue
    const outgoing = outgoingByStep.get(transition.fromStepId) ?? []
    outgoing.push(transition)
    outgoingByStep.set(transition.fromStepId, outgoing)
  }

  const actorCount = steps.filter(step => Boolean(step.actor?.trim())).length
  const timingCount = steps.filter(step => Boolean(step.timing?.trim())).length
  const describedCount = steps.filter(step => Boolean(step.description?.trim() || step.objective?.trim())).length
  const inputCount = steps.filter(step => Boolean(step.inputs?.length)).length
  const outputCount = steps.filter(step => Boolean(step.outputs?.length)).length
  const conditionalTransitions = transitions.filter(transition => transition.kind === 'conditional')
  const incompleteConditions = conditionalTransitions.filter(transition => !transition.condition?.trim() && !transition.branchLabel?.trim())
  const traceableSteps = steps.filter(step => Boolean(step.sourceRefs?.length)).length
  const sourceMediaCount = preview.sourceStructure?.media?.length ?? 0
  const linkedStepMediaCount = steps.reduce((total, step) => total + (step.media?.length ?? 0), 0)
  const expectedMinimumTransitions = Math.max(0, steps.length - 1)

  const checks: InterpretationCheck[] = [
    {
      label: 'Nhận diện quy trình',
      detail: preview.code.trim() && preview.title.trim() && preview.primaryModuleId.trim()
        ? 'Đã có mã, tên và phân hệ chính.'
        : 'Thiếu mã, tên hoặc phân hệ chính.',
      status: preview.code.trim() && preview.title.trim() && preview.primaryModuleId.trim() ? 'pass' : 'error'
    },
    {
      label: 'Mục đích và phạm vi',
      detail: preview.purpose?.trim() && preview.scope?.trim()
        ? 'Đã xác định mục đích và phạm vi áp dụng.'
        : 'Cần bổ sung mục đích và phạm vi áp dụng.',
      status: preview.purpose?.trim() && preview.scope?.trim() ? 'pass' : 'warning'
    },
    {
      label: 'Tính liên tục của workflow',
      detail: steps.length === 0
        ? 'Chưa có bước nghiệp vụ.'
        : transitions.length >= expectedMinimumTransitions
          ? `${steps.length} bước và ${transitions.length} liên kết chuyển tiếp.`
          : `Có ${steps.length} bước nhưng mới có ${transitions.length}/${expectedMinimumTransitions} liên kết tối thiểu.`,
      status: steps.length === 0 ? 'error' : transitions.length >= expectedMinimumTransitions ? 'pass' : 'warning'
    },
    coverageCheck('Vai trò thực hiện', actorCount, steps.length, 'Cần xác định chức danh chịu trách nhiệm cho các bước còn thiếu.'),
    coverageCheck('Thời hạn/SLA', timingCount, steps.length, 'Cần bổ sung thời điểm hoặc SLA cho các bước còn thiếu.'),
    coverageCheck('Mô tả thao tác', describedCount, steps.length, 'Cần diễn giải hành động hoặc mục tiêu của các bước còn thiếu.'),
    {
      label: 'Đầu vào và đầu ra',
      detail: inputCount > 0 && outputCount > 0
        ? `${inputCount} bước có đầu vào; ${outputCount} bước có đầu ra.`
        : 'Chưa mapping đầy đủ đầu vào và đầu ra ở cấp bước.',
      status: inputCount > 0 && outputCount > 0 ? 'pass' : 'warning'
    },
    {
      label: 'Điều kiện rẽ nhánh',
      detail: conditionalTransitions.length === 0
        ? 'Không phát hiện nhánh điều kiện.'
        : incompleteConditions.length === 0
          ? `${conditionalTransitions.length} nhánh điều kiện đều có nhãn hoặc biểu thức điều kiện.`
          : `${incompleteConditions.length}/${conditionalTransitions.length} nhánh chưa có điều kiện rõ ràng.`,
      status: incompleteConditions.length ? 'warning' : 'pass'
    },
    {
      label: 'Truy xuất về tài liệu nguồn',
      detail: traceableSteps > 0
        ? `${traceableSteps}/${steps.length} bước có tham chiếu dòng hoặc trang nguồn.`
        : 'Chưa có tham chiếu từ bước nghiệp vụ về vị trí trong tài liệu nguồn.',
      status: traceableSteps > 0 ? 'pass' : 'warning'
    }
  ]

  const passed = checks.filter(check => check.status === 'pass').length
  const warnings = checks.filter(check => check.status === 'warning').length
  const errors = checks.filter(check => check.status === 'error').length

  return (
    <div className="space-y-4">
      <Panel
        title="Kiểm tra diễn giải số hóa"
        description="Đọc workflow, nguồn tài liệu và các điểm dữ liệu còn thiếu trước khi tạo SOP Draft."
      >
        <div className="grid gap-px bg-slate-200 sm:grid-cols-3 dark:bg-slate-800">
          <SummaryCard icon={<GitBranch className="size-5" />} label="Workflow" value={`${steps.length} bước · ${transitions.length} liên kết`} />
          <SummaryCard icon={<FileText className="size-5" />} label="Tài liệu liên quan" value={`1 nguồn chính · ${sourceMediaCount + linkedStepMediaCount} tệp minh họa`} />
          <SummaryCard icon={<ClipboardCheck className="size-5" />} label="Kết quả kiểm tra" value={`${passed} đạt · ${warnings} cần bổ sung${errors ? ` · ${errors} lỗi` : ''}`} />
        </div>
      </Panel>

      <Panel title={`Workflow đã diễn giải (${steps.length} bước)`} description="Luồng đọc tuần tự; các liên kết điều kiện, quay lại và song song được ghi rõ bằng nhãn.">
        {steps.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">Chưa nhận diện được bước nghiệp vụ từ tài liệu nguồn.</p>
        ) : (
          <ol className="space-y-0 p-4" aria-label="Workflow đã diễn giải">
            {steps.map((step, index) => {
              const outgoing = outgoingByStep.get(step.id) ?? []
              return (
                <li key={step.id} className="relative pb-7 last:pb-0">
                  {index < steps.length - 1 && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-cyan-300 dark:bg-cyan-800" aria-hidden="true" />}
                  <article className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[40px_minmax(0,1fr)_minmax(220px,0.7fr)] dark:border-slate-800 dark:bg-slate-900">
                    <span className="grid size-10 place-items-center rounded-full bg-[#155e75] text-sm font-black text-white">{index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950 dark:text-white">{step.title}</h3>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{nodeKindLabels[step.nodeKind]}</span>
                      </div>
                      {(step.objective || step.description) && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.objective || step.description}</p>}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1"><UserCheck className="size-3.5" />{step.actor || 'Chưa xác định vai trò'}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{step.timing || 'Chưa có SLA'}</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Chuyển tiếp</p>
                      {outgoing.length ? <ul className="mt-2 space-y-2">{outgoing.map((transition, transitionIndex) => {
                        const target = transition.toStepId ? stepById.get(transition.toStepId) : undefined
                        return <li key={transition.id ?? `${step.id}-${transitionIndex}`} className="text-xs leading-5 text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-[#155e75] dark:text-cyan-300">{transitionKindLabels[transition.kind]}</span>
                          {transition.branchLabel || transition.condition ? ` · ${transition.branchLabel || transition.condition}` : ''}
                          {target ? ` → ${target.title}` : ''}
                        </li>
                      })}</ul> : <p className="mt-2 text-xs text-slate-500">{index === steps.length - 1 ? 'Kết thúc quy trình' : 'Chưa có liên kết được xác nhận'}</p>}
                    </div>
                  </article>
                  {index < steps.length - 1 && <ArrowDown className="absolute bottom-1 left-3.5 size-3 text-cyan-600" aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Tài liệu liên quan đến quy trình" description="Nguồn dùng để tạo và kiểm chứng nội dung SOP.">
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
              <FileCheck2 className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <div className="min-w-0"><p className="break-words text-sm font-black">{item.file.name}</p><p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Tài liệu nguồn chính · {item.file.mediaType} · SHA-256 {item.file.checksum.slice(0, 12)}…</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <Link2 className="mt-0.5 size-5 shrink-0 text-slate-400" />
              <div><p className="text-sm font-bold">Biểu mẫu, chính sách và quy trình liên quan</p><p className="mt-1 text-sm leading-6 text-slate-500">Mô hình hiện tại chưa có trường liên kết tài liệu liên quan ở bản chuyển hóa. Cần khai báo riêng để người dùng biết phải mở tài liệu nào cùng workflow.</p></div>
            </div>
            {(sourceMediaCount > 0 || linkedStepMediaCount > 0) && <p className="text-xs text-slate-500">Đã nhận diện {sourceMediaCount} ảnh từ nguồn và gắn {linkedStepMediaCount} ảnh vào các bước.</p>}
          </div>
        </Panel>

        <Panel title="Test diễn giải số hóa" description="Kiểm tra cấu trúc và độ đầy đủ; không tự khẳng định nội dung nghiệp vụ là đúng.">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {checks.map(check => <li key={check.label} className="flex items-start gap-3 p-4">
              <CheckIcon status={check.status} />
              <div><p className="text-sm font-black">{check.label}</p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{check.detail}</p></div>
            </li>)}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 bg-white p-4 dark:bg-slate-900"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-[#155e75] dark:bg-cyan-950 dark:text-cyan-300">{icon}</span><span><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><strong className="mt-1 block text-sm text-slate-950 dark:text-white">{value}</strong></span></div>
}

function CheckIcon({ status }: { status: CheckStatus }) {
  if (status === 'pass') return <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-label="Đạt" />
  if (status === 'error') return <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-600" aria-label="Lỗi" />
  return <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-label="Cần bổ sung" />
}
