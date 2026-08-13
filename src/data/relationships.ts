export type RelationshipType = 'used-by' | 'contains' | 'supports' | 'feeds' | 'related-to'

export type Relationship = {
  source: string
  target: string
  type: RelationshipType
}

export const relationships: Relationship[] = [
  { source: 'MD-05', target: 'LIFE-01', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-02', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-03', type: 'used-by' },
  { source: 'MD-05', target: 'LIFE-07', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-01', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-03', type: 'used-by' },
  { source: 'MD-06', target: 'LIFE-04', type: 'used-by' },
  { source: 'MD-07', target: 'LIFE-05', type: 'used-by' },
  { source: 'MD-08', target: 'LIFE-06', type: 'used-by' },
  { source: 'MD-09', target: 'LIFE-05', type: 'used-by' },
  { source: 'MD-10', target: 'LIFE-06', type: 'used-by' },

  { source: 'LIFE-01', target: 'Tiếp nhận nhân viên mới', type: 'contains' },
  { source: 'LIFE-02', target: 'Quản lý thông tin nhân viên', type: 'contains' },
  { source: 'LIFE-03', target: 'Điều động/điều chuyển', type: 'contains' },
  { source: 'LIFE-03', target: 'Bổ nhiệm', type: 'contains' },
  { source: 'LIFE-04', target: 'Ký hợp đồng với nhân viên mới', type: 'contains' },
  { source: 'LIFE-04', target: 'Tái ký hợp đồng lao động', type: 'contains' },
  { source: 'LIFE-05', target: 'Quản lý thang bảng lương', type: 'contains' },
  { source: 'LIFE-05', target: 'Quản lý hồ sơ bảo hiểm', type: 'contains' },
  { source: 'LIFE-06', target: 'Quản lý nghỉ phép (có portal)', type: 'contains' },
  { source: 'LIFE-06', target: 'Kỷ luật', type: 'contains' },
  { source: 'LIFE-07', target: 'Giảm lao động', type: 'contains' },

  { source: 'MD-05', target: 'Điều động/điều chuyển', type: 'supports' },
  { source: 'MD-05', target: 'Bổ nhiệm', type: 'supports' },
  { source: 'MD-05', target: 'Miễn nhiệm', type: 'supports' },
  { source: 'MD-06', target: 'Bổ nhiệm', type: 'supports' },
  { source: 'MD-07', target: 'Điều chỉnh thu nhập', type: 'supports' },
  { source: 'MD-08', target: 'Quản lý lịch đi ca (có portal)', type: 'supports' },
  { source: 'MD-10', target: 'Khen thưởng', type: 'supports' },
  { source: 'MD-10', target: 'Kỷ luật', type: 'supports' },
  { source: 'LIFE-03', target: 'MD-05', type: 'feeds' },
  { source: 'LIFE-04', target: 'MD-06', type: 'feeds' },
  { source: 'LIFE-05', target: 'MD-07', type: 'feeds' },
  { source: 'LIFE-06', target: 'MD-08', type: 'feeds' },
]
