export type EmployeeFormData = {
  avatar?: string; fullName: string; birthDate: string; genderId: string; identityType: 'CCCD' | 'PASSPORT'; identityNumber: string;
  ethnicityId: string; nationalityId: string; phone: string; email: string; currentAddress: string; startDate: string; departmentId: string; positionId: string; educationLevelId: string;
}
export type FormErrors = Partial<Record<keyof EmployeeFormData, string>>
export const initialFormData: EmployeeFormData = { fullName: '', birthDate: '', genderId: '', identityType: 'CCCD', identityNumber: '', ethnicityId: '', nationalityId: '6-VN', phone: '', email: '', currentAddress: '', startDate: '', departmentId: '', positionId: '', educationLevelId: '' }
export const demoEmployeeData: EmployeeFormData = { fullName: 'Trần Hoàng Nam', birthDate: '1998-04-15', genderId: '15-01', identityType: 'CCCD', identityNumber: '079198123456', ethnicityId: '4-01', nationalityId: '6-VN', phone: '0901234567', email: 'hoang.nam@example.com', currentAddress: 'Thành phố Thủ Đức, TP. Hồ Chí Minh', startDate: '2026-08-12', departmentId: '60-KT', positionId: '33-NV', educationLevelId: '9-DH' }
