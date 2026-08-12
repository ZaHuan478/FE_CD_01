export type SelectOption = { id: string; code: string; name: string; active: boolean }

export const genderOptions: SelectOption[] = [
  { id: '15-01', code: 'MALE', name: 'Nam', active: true },
  { id: '15-02', code: 'FEMALE', name: 'Nữ', active: true },
  { id: '15-03', code: 'OTHER', name: 'Khác', active: true },
]
export const identityTypeOptions: SelectOption[] = [
  { id: 'CCCD', code: 'CCCD', name: 'Căn cước công dân', active: true },
  { id: 'PASSPORT', code: 'PASSPORT', name: 'Hộ chiếu', active: true },
]
export const ethnicityOptions: SelectOption[] = [
  { id: '4-01', code: 'KINH', name: 'Kinh', active: true }, { id: '4-02', code: 'TAY', name: 'Tày', active: true },
  { id: '4-03', code: 'THAI', name: 'Thái', active: true }, { id: '4-04', code: 'HOA', name: 'Hoa', active: true },
]
export const nationalityOptions: SelectOption[] = [
  { id: '6-VN', code: 'VN', name: 'Việt Nam', active: true }, { id: '6-JP', code: 'JP', name: 'Nhật Bản', active: true },
  { id: '6-KR', code: 'KR', name: 'Hàn Quốc', active: true }, { id: '6-US', code: 'US', name: 'Hoa Kỳ', active: true },
]
export const departmentOptions: SelectOption[] = [
  { id: '60-KT', code: 'ENGINEERING', name: 'Phòng Kỹ thuật', active: true }, { id: '60-SP', code: 'PRODUCT', name: 'Phòng Sản phẩm', active: true },
  { id: '60-NS', code: 'HUMAN_RESOURCES', name: 'Phòng Nhân sự', active: true }, { id: '60-KD', code: 'SALES', name: 'Phòng Kinh doanh', active: true },
  { id: '60-OLD', code: 'OLD_DEPARTMENT', name: 'Phòng ban ngừng sử dụng', active: false },
]
export const positionOptions: SelectOption[] = [
  { id: '33-NV', code: 'EMPLOYEE', name: 'Nhân viên', active: true }, { id: '33-TN', code: 'TEAM_LEADER', name: 'Trưởng nhóm', active: true }, { id: '33-TP', code: 'MANAGER', name: 'Trưởng phòng', active: true },
]
export const educationLevelOptions: SelectOption[] = [
  { id: '9-THPT', code: 'HIGH_SCHOOL', name: 'Trung học phổ thông', active: true }, { id: '9-CD', code: 'COLLEGE', name: 'Cao đẳng', active: true },
  { id: '9-DH', code: 'UNIVERSITY', name: 'Đại học', active: true }, { id: '9-SDH', code: 'POSTGRADUATE', name: 'Sau đại học', active: true },
]
