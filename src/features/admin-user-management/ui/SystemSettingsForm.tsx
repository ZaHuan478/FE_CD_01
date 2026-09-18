import { useEffect, useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { administrationGateway, type SystemSettings } from '../model/administrationGateway'
import { Feedback, Panel, TableSkeleton, adminInputClass, primaryButtonClass } from '../../../shared/ui/molecules/AdminSurface'
import { useToast } from '../../../shared/ui/toast'
import { getErrorMessage } from '../../../shared/lib/errors/apiError'

const defaults: SystemSettings = { portalName: 'SOP Management', defaultPageSize: 20, reviewDueDays: 5, requireReviewBeforePublish: true, allowOwnerSelfApproval: false }

export function SystemSettingsForm() {
  const toast = useToast()
  const [value, setValue] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    void administrationGateway.settings(controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setValue(result.data)
          setError('')
        }
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(reason, 'Không tải được cấu hình'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const result = await administrationGateway.updateSettings(value)
      setValue(result.data)
      toast.success('Đã lưu cấu hình hệ thống')
    } catch (reason) {
      const msg = getErrorMessage(reason, 'Không lưu được cấu hình')
      if (msg) toast.error(msg)
    } finally {
      setSaving(false)
    }
  }
  if (loading) return <TableSkeleton rows={6} />
  return <form onSubmit={submit}><Panel title="Thiết lập SOP Management" description="Các giá trị được lưu tại backend và có ghi Audit Log." action={<button disabled={saving} className={primaryButtonClass}><Save className="size-4" />{saving ? 'Đang lưu' : 'Lưu cấu hình'}</button>}>
    <div className="grid gap-5 p-5 lg:grid-cols-2">{error && <div className="lg:col-span-2"><Feedback type="error">{error}</Feedback></div>}
      <Field label="Tên cổng SOP"><input className={adminInputClass} value={value.portalName} onChange={event => setValue({ ...value, portalName: event.target.value })} /></Field>
      <Field label="Số bản ghi mặc định"><input type="number" min={10} max={100} className={adminInputClass} value={value.defaultPageSize} onChange={event => setValue({ ...value, defaultPageSize: Number(event.target.value) })} /></Field>
      <Field label="Số ngày rà soát mặc định"><input type="number" min={1} max={90} className={adminInputClass} value={value.reviewDueDays} onChange={event => setValue({ ...value, reviewDueDays: Number(event.target.value) })} /></Field>
      <div className="grid gap-3"><Toggle label="Bắt buộc rà soát trước khi công bố" checked={value.requireReviewBeforePublish} onChange={checked => setValue({ ...value, requireReviewBeforePublish: checked })} /><Toggle label="Cho phép Owner tự phê duyệt" checked={value.allowOwnerSelfApproval} onChange={checked => setValue({ ...value, allowOwnerSelfApproval: checked })} /></div>
    </div>
  </Panel></form>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-bold"><span>{label}</span>{children}</label> }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 text-sm font-bold dark:border-slate-700"><span>{label}</span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="size-5 accent-[#155e75]" /></label> }



