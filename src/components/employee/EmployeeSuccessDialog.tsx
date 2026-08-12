type Props = { fullName: string; department: string; position: string; onClose: () => void; onReset: () => void }
export function EmployeeSuccessDialog({ fullName, department, position, onClose, onReset }: Props) {
  return <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="success-title"><div className="dialog">
    <div className="success-icon">✓</div><p className="eyebrow">HỒ SƠ ĐÃ SẴN SÀNG</p><h2 id="success-title">Tạo hồ sơ thành công</h2>
    <p className="dialog-copy">Thông tin nhân viên đã được ghi nhận trong bản demo.</p><div className="summary"><p><span>Mã nhân viên</span><strong>NV0249</strong></p><p><span>Họ và tên</span><strong>{fullName}</strong></p><p><span>Phòng ban</span><strong>{department}</strong></p><p><span>Chức vụ</span><strong>{position}</strong></p></div>
    <div className="dialog-actions"><button className="button secondary" onClick={onClose}>Xem hồ sơ</button><button className="button primary" onClick={onReset}>Thêm nhân viên khác</button></div>
  </div></div>
}
