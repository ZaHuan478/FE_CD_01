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

function Wireframe({ title, fields }: { title: string; fields: string[] }) {
  return <div className="wireframe">
    <b>{title.toUpperCase()}</b>
    {fields.slice(0, 4).map((field) => <div key={field}>{field}: <i>[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</i></div>)}
    <footer><button type="button">HỦY</button><button type="button">LƯU</button></footer>
  </div>
}

