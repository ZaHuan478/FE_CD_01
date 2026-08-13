import { useMemo, useState } from 'react'
import { crossFunctional, lifecycle, masterData, relationships, sharedServices } from '../../data'
import './employee-lifecycle.css'

type DetailItem = {
  id: string
  title: string
  subtitle: string
  category: 'master' | 'lifecycle' | 'cross' | 'support'
  sourceStatus?: string
  inputs: string[]
  outputs: string[]
  actors: Array<{ name: string; role: string; action: string }>
  rules?: string[]
  process?: { steps: string[]; source?: string; status?: string }
  sopIds: string[]
  usedBy?: string[]
  uiFields?: string[]
}

type Selected = DetailItem | null

const masterItems: DetailItem[] = masterData.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.usedBy[0] ?? 'Master data',
  category: 'master',
  sourceStatus: item.sourceStatus,
  inputs: [...item.inputs],
  outputs: [...item.outputs],
  actors: item.actors.map((actor) => ({ ...actor })),
  rules: [...item.rules],
  process: { ...item.process },
  sopIds: [...item.sopIds],
  usedBy: [...item.usedBy],
  uiFields: [...item.process.steps],
}))

const lifecycleItems: DetailItem[] = lifecycle.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  category: 'lifecycle',
  sourceStatus: item.sourceStatus,
  inputs: [...item.inputs],
  outputs: [...item.outputs],
  actors: item.actors.map((actor) => ({ ...actor })),
  process: { ...item.process },
  sopIds: [...item.sopIds],
  uiFields: [...item.uiFields],
}))

const crossItems: DetailItem[] = crossFunctional.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  category: 'cross',
  sourceStatus: item.sourceStatus,
  inputs: [...(item.inputs as readonly string[])],
  outputs: [...(item.outputs as readonly string[])],
  actors: item.actors.map((actor) => ({ ...actor })),
  rules: [...(item.rules as readonly string[])],
  process: { ...item.process, steps: [...(item.process.steps as readonly string[])] },
  sopIds: [...(item.sopIds as readonly string[])],
  uiFields: [...(item.inputs as readonly string[])],
}))

const supportItems: DetailItem[] = sharedServices.map((item) => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  category: 'support',
  sourceStatus: item.sourceStatus,
  inputs: [],
  outputs: [],
  actors: [],
  sopIds: [],
}))

const allDetails: DetailItem[] = [...masterItems, ...lifecycleItems, ...crossItems, ...supportItems]

export function EmployeeLifecyclePage() {
  const [selected, setSelected] = useState<Selected>(null)

  const mapNodes = useMemo(() => ({
    master: masterItems,
    lifecycle: lifecycleItems,
    cross: crossItems,
    support: supportItems,
  }), [])

  const openItemById = (id: string) => {
    const item = allDetails.find((entry) => entry.id === id)
    if (item) {
      setSelected(item)
    }
  }

  return <main className="lifecycle-page">
    <header className="lifecycle-header">
      <div className="lifecycle-eyebrow">Bức tranh tổng thể</div>
      <h1>Luồng nghiệp vụ quản lý vòng đời nhân viên</h1>
      <p>Business Process Map · Nhấp vào một node để xem chi tiết nghiệp vụ</p>
    </header>

    <div className="lifecycle-workspace">
      <section className="map-section">
        <SectionLabel>Tầng 1 · Master Data</SectionLabel>
        <div className="map-grid master-grid">{mapNodes.master.map((item) => <MapNode key={item.id} item={item} active={selected?.id === item.id} onClick={() => setSelected(item)} />)}</div>
      </section>

      <section className="map-section">
        <SectionLabel>Tầng 2 · Luồng nghiệp vụ chính — Vòng đời nhân viên</SectionLabel>
        <div className="lifecycle-flow">{mapNodes.lifecycle.map((item, index) => <div className="flow-entry" key={item.id}><MapNode item={item} active={selected?.id === item.id} onClick={() => setSelected(item)} />{index < mapNodes.lifecycle.length - 1 && <span className="flow-arrow">→</span>}</div>)}</div>
        <p className="flow-caption">Tiếp nhận → Hồ sơ → Bố trí → Hợp đồng → Lương → Làm việc → Nghỉ việc</p>
      </section>

      <section className="map-section cross-section">
        <SectionLabel>Tầng 3 · Các nghiệp vụ phát sinh trong quá trình làm việc</SectionLabel>
        <div className="map-grid cross-grid">{mapNodes.cross.map((item) => <MapNode key={item.id} item={item} active={selected?.id === item.id} onClick={() => setSelected(item)} />)}</div>
        <p className="map-note">Nét đứt biểu thị nghiệp vụ xuyên suốt, không phải bước tuần tự của lifecycle.</p>
      </section>

      <section className="map-section">
        <SectionLabel>Tầng 4 · Hỗ trợ xuyên suốt</SectionLabel>
        <div className="support-list">{mapNodes.support.map((item) => <span key={item.id}>{item.title}</span>)}</div>
      </section>
    </div>

    {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} onSelect={openItemById} />}
  </main>
}

function SectionLabel({ children }: { children: string }) { return <h2 className="map-section-label">{children}</h2> }

function MapNode({ item, active, onClick }: { item: DetailItem; active: boolean; onClick: () => void }) {
  return <button className={`map-node ${item.category} ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="map-node-code">{item.id}</span>
    <span className="map-node-icon">▣</span>
    <b>{item.title}</b>
    <small>{item.subtitle}</small>
  </button>
}

function DetailPanel({ item, onClose, onSelect }: { item: DetailItem; onClose: () => void; onSelect: (id: string) => void }) {
  const relatedMasterIds = relationships
    .filter((relationship) => relationship.source === item.id && relationship.target.startsWith('MD-'))
    .map((relationship) => relationship.target)
  const relatedSopNames = item.sopIds.length ? item.sopIds : []
  const processSteps = item.process?.steps ?? []
  const sourceLabel = item.category === 'master' ? 'MASTER DATA' : item.category === 'lifecycle' ? 'LIFECYCLE PROCESS' : item.category === 'cross' ? 'CROSS-FUNCTIONAL' : 'SHARED SERVICE'

  return <>
    <button className="detail-backdrop" aria-label="Đóng panel" onClick={onClose} />
    <aside className="detail-panel">
      <header className="detail-header">
        <span className="detail-icon">▣</span>
        <div>
          <span className="detail-kind">{sourceLabel}</span>
          <h2>{item.title}</h2>
          <p>{item.subtitle}</p>
        </div>
        <button onClick={onClose} className="detail-close" aria-label="Đóng">×</button>
      </header>

      <div className="detail-body">
        <DetailSection title="01 · Tổng quan">
          <p><b>Mục đích:</b> {item.category === 'master' ? 'Vận hành dữ liệu nền tảng để hỗ trợ các nghiệp vụ nhân sự.' : item.category === 'lifecycle' ? 'Bước chính trong vòng đời nhân viên.' : item.category === 'cross' ? 'Nghiệp vụ phát sinh xuyên suốt vòng đời.' : 'Dịch vụ hỗ trợ xuyên suốt hệ thống.'}</p>
          <p><b>Trạng thái nguồn:</b> {item.sourceStatus ?? 'official'}</p>
        </DetailSection>

        <DetailSection title="02 · Input">
          {item.inputs.length ? <DataBlocks values={item.inputs} /> : <Empty>Chưa có dữ liệu đầu vào.</Empty>}
        </DetailSection>

        <DetailSection title="03 · Output">
          {item.outputs.length ? <DataBlocks values={item.outputs} /> : <Empty>Chưa có dữ liệu đầu ra.</Empty>}
        </DetailSection>

        <DetailSection title="04 · Actor">
          {item.actors.length ? <table><thead><tr><th>Tác nhân</th><th>Vai trò</th><th>Hành động</th></tr></thead><tbody>{item.actors.map((actor) => <tr key={`${item.id}-${actor.name}`}><td><b>{actor.name}</b></td><td>{actor.role}</td><td>{actor.action}</td></tr>)}</tbody></table> : <Empty>Chưa có dữ liệu tác nhân.</Empty>}
        </DetailSection>

        {item.category === 'master' ? (
          <DetailSection title="05 · Dữ liệu liên quan">
            {relatedMasterIds.length ? <ReferenceList ids={relatedMasterIds} onSelect={onSelect} /> : <Empty>Master Data này chưa có dữ liệu liên quan khác.</Empty>}
          </DetailSection>
        ) : (
          <DetailSection title="05 · Master Data">
            {relatedMasterIds.length ? <ReferenceList ids={relatedMasterIds} onSelect={onSelect} /> : <Empty>Chưa có dữ liệu Master Data.</Empty>}
          </DetailSection>
        )}

        <DetailSection title="06 · SOP liên quan">
          {relatedSopNames.length ? <ReferenceList ids={relatedSopNames} onSelect={onSelect} /> : <Empty>Chưa có dữ liệu SOP.</Empty>}
        </DetailSection>

        <DetailSection title="07 · Quan hệ dữ liệu">
          <div className="data-relation">
            <span>{relatedMasterIds[0] ?? 'Input'}</span>
            <i>↓</i>
            <span>{item.title}</span>
            <i>↓</i>
            <span>{item.outputs[0] ?? 'Output'}</span>
          </div>
        </DetailSection>

        <DetailSection title="08 · Quy trình thực tế">
          {processSteps.length ? <StepList steps={processSteps} /> : <Empty>Chưa có quy trình.</Empty>}
        </DetailSection>

        <DetailSection title="09 · UI sơ khảo">
          <Wireframe title={item.title} fields={item.uiFields ?? item.inputs.slice(0, 4)} />
        </DetailSection>
      </div>
    </aside>
  </>
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="detail-section"><h3>{title}</h3>{children}</section> }

function DataBlocks({ values }: { values: string[] }) {
  return <div className="data-blocks">{values.map((value) => <div key={value}><b>Value</b>{value}<small>Nguồn/Người nhập: theo nghiệp vụ thực hiện</small></div>)}</div>
}

function ReferenceList({ ids, onSelect }: { ids: string[]; onSelect: (id: string) => void }) {
  return <div className="reference-list">{ids.map((id) => {
    const item = allDetails.find((entry) => entry.id === id || entry.title === id)
    return <button key={id} type="button" onClick={() => item && onSelect(item.id)}><b>{id}</b> {item?.title ?? id}</button>
  })}</div>
}

function Empty({ children }: { children: string }) { return <p className="empty-state">{children}</p> }

function StepList({ steps }: { steps: string[] }) { return <ol className="detail-steps">{steps.map((step) => <li key={step}>{step}</li>)}</ol> }

function Wireframe({ title }: { title: string; fields: string[] }) {
  const variant = getWireframeVariant(title)

  return <div className="wireframe-panel">
    <div className="wireframe-header">
      <span>{variant.badge}</span>
      <b>{variant.label}</b>
    </div>

    <div className={`wireframe-form ${variant.layout}`}>
      {variant.fields.map((item, index) => {
        const isSelect = item.type === 'select'
        const isTextarea = item.type === 'textarea'
        const isWide = item.wide

        return <label
          key={`${item.label}-${index}`}
          className={`wireframe-field ${isSelect ? 'is-select' : ''} ${isTextarea ? 'is-textarea' : ''} ${isWide ? 'wide' : ''}`}
        >
          <span>{item.label}</span>
          {isTextarea ? (
            <div className="wireframe-textarea" aria-label={item.label}><span>{item.placeholder}</span></div>
          ) : isSelect ? (
            <div className="wireframe-select" aria-label={item.label}>
              <span>{item.placeholder}</span>
              <i>▾</i>
            </div>
          ) : (
            <div className="wireframe-input" aria-label={item.label}>
              <span>{item.placeholder}</span>
            </div>
          )}
        </label>
      })}
    </div>

    {variant.summary && <div className="wireframe-summary">
      {variant.summary.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.value}</p></div>)}
    </div>}

    <div className="wireframe-actions">
      {variant.actions.map((action, index) => (
        <button key={`${action}-${index}`} type="button" className={index === 0 ? 'secondary' : ''}>{action}</button>
      ))}
    </div>
  </div>
}

type WireframeField = {
  label: string
  placeholder: string
  type: 'text' | 'select' | 'textarea'
  wide?: boolean
}

type WireframeVariant = {
  badge: string
  label: string
  layout: 'two-col' | 'three-col'
  fields: WireframeField[]
  summary: Array<{ title: string; value: string }>
  actions: string[]
}

function getWireframeVariant(title: string): WireframeVariant {
  const normalized = title.toLowerCase()

  if (normalized.includes('tiếp nhận') || normalized.includes('nhân viên mới')) {
    return {
      badge: 'Onboarding',
      label: 'Tiếp nhận nhân viên mới',
      layout: 'two-col',
      fields: [
        { label: 'Họ tên', placeholder: 'Nguyễn Văn A', type: 'text', wide: false },
        { label: 'Nguồn tuyển dụng', placeholder: 'LinkedIn / Referral / JobBoard', type: 'select', wide: false },
        { label: 'Vị trí dự kiến', placeholder: 'Nhân viên kinh doanh', type: 'select', wide: false },
        { label: 'Ngày bắt đầu', placeholder: '13/08/2026', type: 'text', wide: false },
        { label: 'Phòng ban', placeholder: 'Phòng Sales', type: 'select', wide: false },
        { label: 'Ghi chú', placeholder: 'Thông tin đặc biệt, ưu tiên, lịch trình...', type: 'textarea', wide: true }
      ],
      summary: [
        { title: 'Thông tin chính', value: 'Khởi tạo hồ sơ, xác nhận vị trí và lịch bắt đầu làm việc.' },
        { title: 'Phụ trách', value: 'HR Admin / Người quản lý / Phòng Tuyển dụng' }
      ],
      actions: ['Hủy', 'Lưu', 'Tiếp tục']
    }
  }

  if (normalized.includes('hợp đồng') || normalized.includes('lao động')) {
    return {
      badge: 'Contract',
      label: 'Thiết lập hợp đồng',
      layout: 'three-col',
      fields: [
        { label: 'Loại hợp đồng', placeholder: 'Hợp đồng xác định thời hạn', type: 'select', wide: false },
        { label: 'Ngày hiệu lực', placeholder: '13/08/2026', type: 'text', wide: false },
        { label: 'Ngày kết thúc', placeholder: '12/08/2027', type: 'text', wide: false },
        { label: 'Mức lương', placeholder: '18,000,000 VNĐ', type: 'text', wide: false },
        { label: 'Chức danh', placeholder: 'Nhân viên', type: 'select', wide: false },
        { label: 'Người phê duyệt', placeholder: 'Quản lý trực tiếp', type: 'select', wide: false },
        { label: 'Điều khoản đặc biệt', placeholder: 'Bảo mật, nghỉ phép, thời gian thử việc...', type: 'textarea', wide: true }
      ],
      summary: [
        { title: 'Điều kiện', value: 'Hợp đồng phải phù hợp với vị trí công tác và chính sách lao động.' },
        { title: 'Trạng thái', value: 'Đang chờ phê duyệt / Đã ký / Đã lưu' }
      ],
      actions: ['Hủy', 'Lưu', 'Ký']
    }
  }

  if (normalized.includes('lương') || normalized.includes('chế độ')) {
    return {
      badge: 'Payroll',
      label: 'Lương & chế độ',
      layout: 'two-col',
      fields: [
        { label: 'Mức lương cơ bản', placeholder: '18,000,000', type: 'text', wide: false },
        { label: 'Phụ cấp', placeholder: 'Ăn trưa / Đi lại / Công tác', type: 'select', wide: false },
        { label: 'Bảo hiểm', placeholder: 'BHXH / BHYT / BHTN', type: 'select', wide: false },
        { label: 'Hiệu lực', placeholder: '01/08/2026', type: 'text', wide: false },
        { label: 'Trạng thái', placeholder: 'Đang áp dụng', type: 'select', wide: false },
        { label: 'Ghi chú', placeholder: 'Phân bổ thu nhập theo chính sách C&B', type: 'textarea', wide: true }
      ],
      summary: [
        { title: 'Quyền lợi', value: 'Tính toán lương, bảo hiểm và phụ cấp theo cấu hình hiện hành.' },
        { title: 'Người xử lý', value: 'C&B / HR Admin / Quản lý trực tiếp' }
      ],
      actions: ['Hủy', 'Lưu', 'Phê duyệt']
    }
  }

  if (normalized.includes('nghỉ việc') || normalized.includes('đóng hồ sơ')) {
    return {
      badge: 'Separation',
      label: 'Nghỉ việc & đóng hồ sơ',
      layout: 'two-col',
      fields: [
        { label: 'Ngày nghỉ', placeholder: '25/08/2026', type: 'text', wide: false },
        { label: 'Nguyên nhân', placeholder: 'Kết thúc hợp đồng / Xin nghỉ', type: 'select', wide: false },
        { label: 'Phòng ban bàn giao', placeholder: 'Phòng Sales', type: 'select', wide: false },
        { label: 'Trạng thái hồ sơ', placeholder: 'Chờ bàn giao', type: 'select', wide: false },
        { label: 'Hồ sơ cần hoàn tất', placeholder: 'Chứng từ, BHXH, tài sản, giấy tờ', type: 'textarea', wide: true }
      ],
      summary: [
        { title: 'Khâu quyết toán', value: 'Đảm bảo hồ sơ, công nợ, bảo hiểm và tài sản đã được bàn giao.' },
        { title: 'Phụ trách', value: 'HR Admin / Quản lý / Bộ phận tài chính' }
      ],
      actions: ['Hủy', 'Lưu', 'Kết thúc']
    }
  }

  if (normalized.includes('phê duyệt')) {
    return {
      badge: 'Approval',
      label: 'Phê duyệt nghiệp vụ',
      layout: 'two-col',
      fields: [
        { label: 'Yêu cầu', placeholder: 'Duyệt điều chỉnh hợp đồng / vị trí / lương', type: 'select', wide: false },
        { label: 'Người duyệt', placeholder: 'Quản lý cấp trên', type: 'select', wide: false },
        { label: 'Trạng thái', placeholder: 'Chờ phê duyệt', type: 'select', wide: false },
        { label: 'Mức ưu tiên', placeholder: 'Bình thường / Cao / Khẩn cấp', type: 'select', wide: false },
        { label: 'Ghi chú', placeholder: 'Lý do duyệt / từ chối / điều kiện bổ sung', type: 'textarea', wide: true }
      ],
      summary: [
        { title: 'Quy trình', value: 'Các yêu cầu được xem xét theo quyền hạn và thời hạn hiệu lực.' },
        { title: 'Kết quả', value: 'Phê duyệt / từ chối / yêu cầu bổ sung thông tin' }
      ],
      actions: ['Từ chối', 'Yêu cầu bổ sung', 'Phê duyệt']
    }
  }

  return {
    badge: 'Form',
    label: title,
    layout: 'two-col',
    fields: [
      { label: 'Thông tin chính', placeholder: 'Nhập thông tin', type: 'text' },
      { label: 'Phòng ban', placeholder: 'Chọn phòng ban', type: 'select' },
      { label: 'Trạng thái', placeholder: 'Chọn trạng thái', type: 'select' },
      { label: 'Người xử lý', placeholder: 'Nhập người xử lý', type: 'text' },
      { label: 'Mức ưu tiên', placeholder: 'Chọn mức ưu tiên', type: 'select' },
      { label: 'Ghi chú', placeholder: 'Nhập ghi chú', type: 'textarea', wide: true }
    ],
    summary: [
      { title: 'Thông tin chính', value: 'Nhập dữ liệu đầu vào theo nghiệp vụ, kiểm tra ràng buộc và xác nhận quyền thao tác.' },
      { title: 'Phụ trách', value: 'HR Admin / Người quản lý / Bộ phận liên quan' }
    ],
    actions: ['Hủy', 'Lưu']
  }
}

