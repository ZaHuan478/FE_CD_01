export interface LegalReference {
  id: string
  documentNumber: string
  title: string
  titleEn: string
  effectiveFrom: string
  effectiveTo?: string
  officialUrl?: string
  affectedModules: ('ats' | 'emp' | 'att' | 'pay' | 'ins' | 'tax')[]
  note: string
  noteEn: string
  status: 'active' | 'superseded' | 'upcoming'
}

export const CORE_OPERATIONS_LEGAL_REFS: LegalReference[] = [
  {
    id: 'LL-45-2019',
    documentNumber: 'Bộ luật Lao động 45/2019/QH14',
    title: 'Bộ luật Lao động nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
    titleEn: 'Labor Code of the Socialist Republic of Vietnam (No. 45/2019/QH14)',
    effectiveFrom: '2021-01-01',
    affectedModules: ['ats', 'emp', 'att', 'pay'],
    note: 'Quy định khung về tuyển dụng, hợp đồng lao động, thời giờ làm việc, nghỉ ngơi, tiền lương, kỷ luật lao động và chấm dứt HĐLĐ.',
    noteEn: 'Framework law governing recruitment, labor contracts, working hours, rest periods, wages, labor discipline, and termination.',
    status: 'active'
  },
  {
    id: 'ND-145-2020',
    documentNumber: 'Nghị định 145/2020/NĐ-CP',
    title: 'Quy định chi tiết và hướng dẫn thi hành một số điều của Bộ luật Lao động',
    titleEn: 'Decree 145/2020/ND-CP detailing the implementation of the Labor Code',
    effectiveFrom: '2021-02-01',
    affectedModules: ['emp', 'att', 'pay'],
    note: 'Hướng dẫn chi tiết về quản lý lao động, hợp đồng lao động, thời giờ làm việc, làm thêm giờ, tiền lương và trợ cấp thôi việc.',
    noteEn: 'Detailed guidance on workforce management, labor contracts, working time, overtime limits, wages, and severance allowances.',
    status: 'active'
  },
  {
    id: 'BHXH-41-2024',
    documentNumber: 'Luật Bảo hiểm xã hội 41/2024/QH15',
    title: 'Luật Bảo hiểm xã hội năm 2024',
    titleEn: 'Law on Social Insurance 2024 (No. 41/2024/QH15)',
    effectiveFrom: '2025-07-01',
    affectedModules: ['emp', 'pay', 'ins'],
    note: 'Quy định chế độ, chính sách BHXH bắt buộc, tự nguyện; tiền lương làm căn cứ đóng BHXH; chế độ ốm đau, thai sản, hưu trí, tử tuất.',
    noteEn: 'Governs statutory and voluntary social insurance regimes, salary base for contributions, sick leave, maternity, pension, and survivorship.',
    status: 'active'
  },
  {
    id: 'VL-74-2025',
    documentNumber: 'Luật Việc làm 74/2025/QH15',
    title: 'Luật Việc làm (sửa đổi)',
    titleEn: 'Law on Employment (Amended No. 74/2025/QH15)',
    effectiveFrom: '2026-01-01',
    affectedModules: ['ats', 'emp', 'ins'],
    note: 'Quy định chính sách việc làm, bảo hiểm thất nghiệp (BHTN), đăng ký lao động và thông báo biến động lao động định kỳ.',
    noteEn: 'Regulates employment support policies, unemployment insurance (BHTN), employee registration, and statutory labor reporting.',
    status: 'active'
  },
  {
    id: 'TNCN-109-2025',
    documentNumber: 'Luật Thuế TNCN 109/2025/QH15',
    title: 'Luật Thuế thu nhập cá nhân (sửa đổi)',
    titleEn: 'Law on Personal Income Tax (Amended No. 109/2025/QH15)',
    effectiveFrom: '2026-01-01',
    affectedModules: ['emp', 'pay', 'tax'],
    note: 'Quy định thu nhập chịu thuế từ tiền lương, tiền công; các khoản giảm trừ gia cảnh; biểu thuế lũy tiến từng phần và quyết toán thuế năm.',
    noteEn: 'Governs taxable salary income, family circumstance deductions, progressive tax rate brackets, and annual personal tax finalization.',
    status: 'active'
  },
  {
    id: 'QLT-108-2025',
    documentNumber: 'Luật Quản lý thuế 108/2025/QH15',
    title: 'Luật Quản lý thuế (sửa đổi, bổ sung)',
    titleEn: 'Law on Tax Administration (No. 108/2025/QH15)',
    effectiveFrom: '2026-01-01',
    affectedModules: ['pay', 'tax'],
    note: 'Quy định đăng ký thuế, cấp mã số thuế (MST), kê khai tạm nộp hàng tháng/quý, khấu trừ thuế tại nguồn và hóa đơn/chứng từ điện tử.',
    noteEn: 'Governs tax registration, tax ID issuance, monthly/quarterly provisional declarations, withholding tax, and electronic tax records.',
    status: 'active'
  },
  {
    id: 'BVDL-91-2025',
    documentNumber: 'Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15',
    title: 'Luật Bảo vệ dữ liệu cá nhân (kế thừa Nghị định 13/2023/NĐ-CP)',
    titleEn: 'Personal Data Protection Law (No. 91/2025/QH15)',
    effectiveFrom: '2026-01-01',
    affectedModules: ['ats', 'emp', 'att', 'pay', 'ins', 'tax'],
    note: 'Bảo vệ dữ liệu cá nhân của người lao động (CCCD, sinh trắc học vân tay/GPS, thông tin sức khỏe, thu nhập và tài khoản ngân hàng).',
    noteEn: 'Protects employees personal data (ID numbers, biometric clock-in data, medical records, earnings, and bank account credentials).',
    status: 'active'
  },
  {
    id: 'ISO-30405-2023',
    documentNumber: 'ISO 30405:2023',
    title: 'Human Resource Management — Guidelines on Recruitment',
    titleEn: 'ISO 30405:2023 Human Resource Management — Guidelines on Recruitment',
    effectiveFrom: '2023-01-01',
    affectedModules: ['ats', 'emp'],
    note: 'Tiêu chuẩn quốc tế về quy trình tuyển dụng nhân sự chuẩn mực, tính minh bạch, đánh giá ứng viên công bằng và bàn giao tiếp nhận.',
    noteEn: 'International standard on recruitment governance, sourcing integrity, fair candidate evaluation, and onboarding readiness.',
    status: 'active'
  }
]
