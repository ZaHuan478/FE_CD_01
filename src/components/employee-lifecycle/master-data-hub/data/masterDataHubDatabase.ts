import type { MasterCatalogItem } from '../types'

/**
 * MASTER DATA HUB DATABASE - 100% CĂN CỨ THEO BỘ TÀI LIỆU ĐẶC TẢ SOP DOANH NGHIỆP:
 * - 1.EMP.HRM.SOP.docx (Mục 5: Danh mục dùng chung toàn bộ HRM & Mục 6: Cấu hình hệ thống)
 * - 2.ATT.HRM.SOP.docx (Chấm công, Ca kíp & Chứng từ nghỉ phép)
 * - 3.INS.HRM.SOP.docx (Bảo hiểm Xã hội, Y tế & Cơ sở KCB)
 * - 4.PAY.HRM.SOP.docx (Thang bảng lương 3P & 20 Loại Phụ cấp)
 * - 5.TAX.HRM.SOP.docx (Mã số Thuế & Người phụ thuộc)
 */
export const MASTER_DATA_HUB_DATABASE: MasterCatalogItem[] = [
  // =========================================================================
  // 🏛️ TẦNG 1: DANH MỤC DÙNG CHUNG CHO TOÀN BỘ HỆ THỐNG HRM (DOCX SECTION 5)
  // =========================================================================
  {
    id: 'MD-GEO-PROV',
    code: 'MD-01.01',
    title: 'Danh mục Tỉnh / Thành Phố',
    titleEn: 'Provinces & Cities Catalog',
    subtitle: 'Mã BHXH, Mã Thuế, Tên Tiếng Việt & Tiếng Anh (Mục 5.1 DOCX)',
    subtitleEn: 'Insurance Code, Tax Code, Bilingual Names',
    tier: 'tier1_global',
    moduleId: 'global',
    moduleName: 'Toàn hệ thống (Global)',
    moduleNameEn: 'Enterprise Global',
    recordCount: 63,
    color: 'blue',
    iconName: 'Globe',
    feedsIntoModules: ['Nhân sự Core EMP (EMP02, EMP04)', 'Bảo hiểm INS', 'Thuế TAX'],
    feedsIntoWorkflows: ['LIFE-01', 'LIFE-02', 'SOP-INS-02', 'SOP-TAX-01'],
    description: 'Trích xuất chính xác từ Mục 5.1 tài liệu 1.EMP.HRM.SOP.docx: Quản lý danh sách Tỉnh/Thành phố kèm đồng bộ Mã BHXH và Mã cơ quan Thuế.',
    descriptionEn: 'Official Section 5.1 from 1.EMP.HRM.SOP.docx: Provinces directory mapped to Social Insurance and Tax Office regional codes.',
    fields: [
      { name: 'Mã Tỉnh/Thành phố', nameEn: 'Province Code', key: 'code', type: 'string', required: true, description: 'Mã định danh tỉnh thành theo chuẩn', descriptionEn: 'Official province code' },
      { name: 'Mã theo BHXH', nameEn: 'Social Insurance Code', key: 'bhxhCode', type: 'string', required: true, description: 'Mã tỉnh quy chuẩn bên cơ quan BHXH', descriptionEn: 'Social insurance authority province code' },
      { name: 'Mã theo cơ quan Thuế', nameEn: 'Tax Authority Code', key: 'taxCode', type: 'string', required: true, description: 'Mã tỉnh quy chuẩn bên Tổng cục Thuế', descriptionEn: 'Tax department province code' },
      { name: 'Tên Tỉnh/Thành (Tiếng Việt)', nameEn: 'Province Name (VN)', key: 'name', type: 'string', required: true, description: 'Tên đầy đủ tiếng Việt', descriptionEn: 'Vietnamese province name' },
      { name: 'Tên Tỉnh/Thành (Tiếng Anh)', nameEn: 'Province Name (EN)', key: 'nameEn', type: 'string', required: false, description: 'Tên tiếng Anh chuẩn quốc tế', descriptionEn: 'English province name' }
    ],
    sampleRecords: [
      { id: 'PROV-01', code: '01', bhxhCode: '001', taxCode: '101', name: 'Thành phố Hà Nội', nameEn: 'Ha Noi City', status: 'active' },
      { id: 'PROV-02', code: '79', bhxhCode: '079', taxCode: '105', name: 'Thành phố Hồ Chí Minh', nameEn: 'Ho Chi Minh City', status: 'active' },
      { id: 'PROV-03', code: '48', bhxhCode: '048', taxCode: '104', name: 'Thành phố Đà Nẵng', nameEn: 'Da Nang City', status: 'active' },
      { id: 'PROV-04', code: '74', bhxhCode: '074', taxCode: '107', name: 'Tỉnh Bình Dương', nameEn: 'Binh Duong Province', status: 'active' }
    ]
  },
  {
    id: 'MD-GEO-DIST',
    code: 'MD-01.02',
    title: 'Danh mục Quận / Huyện & Phường / Xã',
    titleEn: 'Districts & Wards Directory',
    subtitle: 'Phân cấp hành chính cấp Quận/Huyện và Phường/Xã (Mục 5.2-5.3 DOCX)',
    subtitleEn: 'Constituent Administrative Districts & Wards',
    tier: 'tier1_global',
    moduleId: 'global',
    moduleName: 'Toàn hệ thống (Global)',
    moduleNameEn: 'Enterprise Global',
    recordCount: 705,
    color: 'blue',
    iconName: 'Building2',
    feedsIntoModules: ['Nhân sự Core EMP (EMP04)', 'Khai báo Thường trú / Tạm trú'],
    feedsIntoWorkflows: ['LIFE-02'],
    description: 'Trích xuất từ Mục 5.2 và 5.3 tài liệu 1.EMP.HRM.SOP.docx: Danh sách Quận/Huyện và Phường/Xã trực thuộc Tỉnh/Thành phố.',
    descriptionEn: 'Extracted from Sections 5.2 and 5.3 of 1.EMP.HRM.SOP.docx for employee permanent and temporary addresses.',
    fields: [
      { name: 'Mã Quận/Huyện', nameEn: 'District Code', key: 'code', type: 'string', required: true, description: 'Mã định danh quận/huyện', descriptionEn: 'District code' },
      { name: 'Tên Quận/Huyện (Tiếng Việt)', nameEn: 'District Name (VN)', key: 'name', type: 'string', required: true, description: 'Tên tiếng Việt', descriptionEn: 'Vietnamese district name' },
      { name: 'Tỉnh/Thành phố Trực thuộc', nameEn: 'Parent Province', key: 'province', type: 'lookup', required: true, description: 'Thuộc tỉnh/thành nào', descriptionEn: 'Parent province reference' }
    ],
    sampleRecords: [
      { id: 'DST-01', code: 'Q1-HCM', name: 'Quận 1', province: 'Thành phố Hồ Chí Minh', status: 'active' },
      { id: 'DST-02', code: 'Q-BD-HN', name: 'Quận Ba Đình', province: 'Thành phố Hà Nội', status: 'active' },
      { id: 'DST-03', code: 'Q-HC-DN', name: 'Quận Hải Châu', province: 'Thành phố Đà Nẵng', status: 'active' }
    ]
  },
  {
    id: 'MD-ETHNIC-RELIGION',
    code: 'MD-02',
    title: 'Danh mục Dân tộc, Tôn giáo & Quốc tịch',
    titleEn: 'Ethnicity, Religion & Nationality',
    subtitle: '54 Dân tộc, Các Tôn giáo & Quốc tịch có Check Default (Mục 5.4-5.6 DOCX)',
    subtitleEn: '54 Ethnic Groups, Religions & Nations with Default Mode',
    tier: 'tier1_global',
    moduleId: 'global',
    moduleName: 'Toàn hệ thống (Global)',
    moduleNameEn: 'Enterprise Global',
    recordCount: 54,
    color: 'indigo',
    iconName: 'Users2',
    feedsIntoModules: ['Nhân sự Core EMP (EMP04)', 'Bảo hiểm INS', 'Báo cáo Lao động Nhà nước'],
    feedsIntoWorkflows: ['LIFE-02', 'SOP-INS-02'],
    description: 'Trích xuất chính xác Mục 5.4, 5.5, 5.6 tài liệu 1.EMP.HRM.SOP.docx: Khai báo 54 dân tộc, tôn giáo và quốc tịch kèm chế độ Check Mode giá trị mặc định khi nhập profile.',
    descriptionEn: 'Section 5.4-5.6 from 1.EMP.HRM.SOP.docx: Ethnicities, religions and nationalities with auto-default check mode.',
    fields: [
      { name: 'Mã Dân tộc', nameEn: 'Ethnic Code', key: 'code', type: 'string', required: true, description: 'Mã số dân tộc chuẩn', descriptionEn: 'Ethnic code' },
      { name: 'Tên Dân tộc', nameEn: 'Ethnic Name', key: 'name', type: 'string', required: true, description: 'Tên dân tộc', descriptionEn: 'Official name' },
      { name: 'Giá trị Mặc định (Default)', nameEn: 'Default Flag', key: 'isDefault', type: 'boolean', required: true, description: 'Check mode dùng load default khi tạo hồ sơ', descriptionEn: 'Auto-load default in profile creation' }
    ],
    sampleRecords: [
      { id: 'ETH-01', code: '01', name: 'Kinh (Việt)', isDefault: true, status: 'active' },
      { id: 'ETH-02', code: '02', name: 'Tày', isDefault: false, status: 'active' },
      { id: 'ETH-03', code: '03', name: 'Thái', isDefault: false, status: 'active' },
      { id: 'ETH-04', code: '04', name: 'Mường', isDefault: false, status: 'active' }
    ]
  },
  {
    id: 'MD-FAMILY-RELATION',
    code: 'MD-03',
    title: 'Danh mục Loại Quan Hệ Gia Đình (26 Mối Quan Hệ)',
    titleEn: 'Family Relationship Types (26 Relations)',
    subtitle: 'Con, Ba, Mẹ, Vợ, Chồng, Ba/Mẹ chồng, Ba/Mẹ vợ... (Mục 5.10 DOCX)',
    subtitleEn: 'Father, Mother, Spouse, Children, In-laws (Section 5.10)',
    tier: 'tier1_global',
    moduleId: 'global',
    moduleName: 'Toàn hệ thống (Global)',
    moduleNameEn: 'Enterprise Global',
    recordCount: 26,
    color: 'indigo',
    iconName: 'HeartHandshake',
    feedsIntoModules: ['Nhân sự Core EMP (EMP04)', 'Người phụ thuộc Thuế TNCN (TAX01)'],
    feedsIntoWorkflows: ['LIFE-02', 'SOP-TAX-01'],
    description: 'Trích xuất chính xác Mục 5.10 tài liệu 1.EMP.HRM.SOP.docx: Danh sách chuẩn 26 mối quan hệ gia đình phục vụ đăng ký liên hệ khẩn cấp và hồ sơ giảm trừ gia cảnh Thuế.',
    descriptionEn: 'Section 5.10 from 1.EMP.HRM.SOP.docx: Standard 26 family relationship types for emergency contacts and tax dependents.',
    fields: [
      { name: 'Mã Quan hệ', nameEn: 'Relationship Code', key: 'code', type: 'string', required: true, description: 'Mã định danh quan hệ', descriptionEn: 'Relation identifier' },
      { name: 'Loại Quan hệ', nameEn: 'Relationship Name', key: 'name', type: 'string', required: true, description: 'Tên mối quan hệ', descriptionEn: 'Relation title' },
      { name: 'Số Thứ Tự Hiển Thị', nameEn: 'Display Order', key: 'sortOrder', type: 'number', required: true, description: 'Thứ tự ưu tiên trên dropdown', descriptionEn: 'Sort order in dropdown' }
    ],
    sampleRecords: [
      { id: 'REL-01', code: 'REL-CON', name: 'Con', sortOrder: 1, status: 'active' },
      { id: 'REL-02', code: 'REL-BA', name: 'Ba', sortOrder: 2, status: 'active' },
      { id: 'REL-03', code: 'REL-ME', name: 'Mẹ', sortOrder: 3, status: 'active' },
      { id: 'REL-04', code: 'REL-VO', name: 'Vợ', sortOrder: 4, status: 'active' },
      { id: 'REL-05', code: 'REL-CHONG', name: 'Chồng', sortOrder: 5, status: 'active' },
      { id: 'REL-06', code: 'REL-ME-CHONG', name: 'Mẹ chồng', sortOrder: 6, status: 'active' },
      { id: 'REL-07', code: 'REL-ME-VO', name: 'Mẹ vợ', sortOrder: 7, status: 'active' }
    ]
  },
  {
    id: 'MD-EDUCATION-SKILLS',
    code: 'MD-04',
    title: 'Danh mục Trình độ Học vấn, Tin học & Ngoại ngữ',
    titleEn: 'Education Levels, IT & Language Proficiencies',
    subtitle: 'Học vấn (Tiểu học-Tiến sĩ), Tin học (A/B), Ngoại ngữ (Mục 5.8-5.14 DOCX)',
    subtitleEn: 'Education, IT Levels, Language Skills (Section 5.8-5.14)',
    tier: 'tier1_global',
    moduleId: 'global',
    moduleName: 'Toàn hệ thống (Global)',
    moduleNameEn: 'Enterprise Global',
    recordCount: 18,
    color: 'blue',
    iconName: 'GraduationCap',
    feedsIntoModules: ['Tuyển dụng ATS', 'Nhân sự Core EMP (EMP04)', 'Đào tạo L&D'],
    feedsIntoWorkflows: ['LIFE-01', 'LIFE-02'],
    description: 'Trích xuất Mục 5.8, 5.9, 5.11, 5.12, 5.13, 5.14 tài liệu 1.EMP.HRM.SOP.docx: Quản lý học vấn từ 1/12 đến Tiến sĩ, kỹ năng Tin học và Ngoại ngữ (Nghe/Nói/Đọc/Viết).',
    descriptionEn: 'Section 5.8-5.14 from 1.EMP.HRM.SOP.docx: Education levels (Primary to PhD), Computer Skills (A/B/C) and Languages (Listening/Speaking/Reading/Writing).',
    fields: [
      { name: 'Mã Trình độ', nameEn: 'Skill/Edu Code', key: 'code', type: 'string', required: true, description: 'Mã định danh trình độ', descriptionEn: 'Qualification code' },
      { name: 'Tên Trình độ Học vấn / Kỹ năng', nameEn: 'Qualification Name', key: 'name', type: 'string', required: true, description: 'Tên hiển thị', descriptionEn: 'Qualification title' },
      { name: 'Phân loại', nameEn: 'Category', key: 'category', type: 'select', required: true, description: 'Học vấn / Tin học / Ngoại ngữ', descriptionEn: 'Education / IT / Language' }
    ],
    sampleRecords: [
      { id: 'EDU-01', code: 'EDU-UNI', name: 'Đại học (Cử nhân / Kỹ sư)', category: 'Trình độ Học vấn', status: 'active' },
      { id: 'EDU-02', code: 'EDU-MAS', name: 'Thạc sĩ (Master)', category: 'Trình độ Học vấn', status: 'active' },
      { id: 'EDU-03', code: 'IT-ADV', name: 'Tin học Cao cấp / Chuyên ngành', category: 'Cấp độ Tin học', status: 'active' },
      { id: 'EDU-04', code: 'ENG-ADV', name: 'Tiếng Anh Cấp độ Advance (IELTS 7.0+)', category: 'Kỹ năng Ngoại ngữ', status: 'active' }
    ]
  },

  // =========================================================================
  // 👥 TẦNG 2: PHÂN HỆ NHÂN SỰ CORE EMP (DOCX SECTION 5 & 6)
  // =========================================================================
  {
    id: 'MD-05',
    code: 'MD-05',
    title: 'Cơ Cấu Tổ Chức & Sơ Đồ Cây Phòng Ban',
    titleEn: 'Organizational Structure & Department Hierarchy',
    subtitle: 'Khối, Ban, Phòng, Bộ phận & Reporting Line (Mục 6 Cấu hình DOCX)',
    subtitleEn: 'Division, Dept, Team & Managerial Reporting Lines',
    tier: 'tier2_module',
    moduleId: 'emp',
    moduleName: 'Nhân sự (Core EMP)',
    moduleNameEn: 'Personnel Core (EMP)',
    recordCount: 28,
    color: 'blue',
    iconName: 'GitFork',
    feedsIntoModules: ['Thiết lập Định biên (EMP01)', 'Điều chuyển Bổ nhiệm (EMP11)', 'Chấm công (ATT)'],
    feedsIntoWorkflows: ['LIFE-01', 'LIFE-03', 'LIFE-05', 'SOP-EMP-06', 'SOP-EMP-07', 'SOP-EMP-11'],
    description: 'Trích xuất từ Mục 6 tài liệu 1.EMP.HRM.SOP.docx: Cây cơ cấu tổ chức phân cấp cha-con, quy định Chức vụ quản lý trực tiếp và lộ trình phê duyệt.',
    descriptionEn: 'Section 6 configuration from 1.EMP.HRM.SOP.docx: Parent-child organization tree governing direct managers and approval paths.',
    fields: [
      { name: 'Mã Đơn vị', nameEn: 'Dept Code', key: 'code', type: 'string', required: true, description: 'Mã phòng ban', descriptionEn: 'Unique department code' },
      { name: 'Tên Phòng ban', nameEn: 'Dept Name', key: 'name', type: 'string', required: true, description: 'Tên chính thức trên cây tổ chức', descriptionEn: 'Official organizational title' },
      { name: 'Cấp Tổ chức', nameEn: 'Org Level', key: 'level', type: 'string', required: true, description: 'Ban Giám đốc / Khối / Phòng', descriptionEn: 'Level hierarchy' },
      { name: 'Mã Đơn vị Cấp Trên', nameEn: 'Parent Code', key: 'parentCode', type: 'string', required: false, description: 'Phòng ban cha', descriptionEn: 'Parent code' }
    ],
    sampleRecords: [
      { id: 'ORG-01', code: 'BOM', name: 'Ban Giám Đốc (Board of Management)', level: 'Cấp 1 - Ban Điều Hành', parentCode: 'ROOT', status: 'active' },
      { id: 'ORG-02', code: 'TECH-DIV', name: 'Khối Công Nghệ & Kỹ Thuật', level: 'Cấp 2 - Khối', parentCode: 'BOM', status: 'active' },
      { id: 'ORG-03', code: 'HR-DIV', name: 'Khối Quản Trị Nguồn Nhân Lực', level: 'Cấp 2 - Khối', parentCode: 'BOM', status: 'active' },
      { id: 'ORG-04', code: 'HR-CB-DEPT', name: 'Phòng Tiền Lương & Đãi Ngộ (C&B)', level: 'Cấp 3 - Phòng', parentCode: 'HR-DIV', status: 'active' }
    ]
  },
  {
    id: 'MD-06',
    code: 'MD-06',
    title: 'Danh Mục Chức Danh & Chức Vụ Quản Lý',
    titleEn: 'Job Titles & Managerial Positions Catalog',
    subtitle: 'Chức danh chuyên môn, Chức vụ liên đới & Tiêu chuẩn công việc (Mục 5.24 DOCX)',
    subtitleEn: 'Professional Titles, Associated Roles & Job Specs (Section 5.24)',
    tier: 'tier2_module',
    moduleId: 'emp',
    moduleName: 'Nhân sự (Core EMP)',
    moduleNameEn: 'Personnel Core (EMP)',
    recordCount: 65,
    color: 'blue',
    iconName: 'BadgeCheck',
    feedsIntoModules: ['Ký Hợp đồng mới (EMP06)', 'Bổ nhiệm Điều chuyển (EMP11)', 'Định biên (EMP01)'],
    feedsIntoWorkflows: ['LIFE-01', 'LIFE-04', 'LIFE-05', 'SOP-EMP-04', 'SOP-EMP-11'],
    description: 'Trích xuất chính xác Mục 5.24 tài liệu 1.EMP.HRM.SOP.docx: Danh mục Chức danh, Chức vụ quản lý trực tiếp và Tiêu chuẩn công việc mặc định load sang hợp đồng.',
    descriptionEn: 'Section 5.24 from 1.EMP.HRM.SOP.docx: Job titles, managerial roles and job specification templates loaded into employee contracts.',
    fields: [
      { name: 'Mã Chức danh', nameEn: 'Job Code', key: 'code', type: 'string', required: true, description: 'Mã chức danh', descriptionEn: 'Job code' },
      { name: 'Tên Chức danh', nameEn: 'Job Title', key: 'name', type: 'string', required: true, description: 'Tên chuyên môn ghi trên HĐLĐ', descriptionEn: 'Contractual job title' },
      { name: 'Chức vụ Quản lý Liên đới', nameEn: 'Managerial Role', key: 'role', type: 'string', required: false, description: 'Load từ danh mục Chức vụ', descriptionEn: 'Managerial position association' }
    ],
    sampleRecords: [
      { id: 'JOB-01', code: 'DEV-SENIOR', name: 'Kỹ Sư Phần Mềm Cao Cấp (Senior Developer)', role: 'Không giữ chức vụ quản lý', status: 'active' },
      { id: 'JOB-02', code: 'HR-CB-SPEC', name: 'Chuyên Viên Tiền Lương & Chính Sách (C&B)', role: 'Không giữ chức vụ quản lý', status: 'active' },
      { id: 'JOB-03', code: 'MGT-LEAD', name: 'Trưởng Nhóm Kỹ Thuật (Tech Lead)', role: 'Trưởng nhóm / Leader', status: 'active' }
    ]
  },
  {
    id: 'MD-OFFBOARDING-TYPES',
    code: 'MD-OFFBOARD',
    title: 'Danh Mục Loại Nghỉ Việc & Lý Do Nghỉ Việc',
    titleEn: 'Termination Types & Exit Reasons',
    subtitle: 'Nhóm nghỉ: Mất / Nghỉ hưu / Nghỉ việc & Lý do Exit Interview (Mục 5.18-5.19 DOCX)',
    subtitleEn: 'Retirement, Resignation, Exit Interview Reasons (Section 5.18-5.19)',
    tier: 'tier2_module',
    moduleId: 'emp',
    moduleName: 'Nhân sự (Core EMP)',
    moduleNameEn: 'Personnel Core (EMP)',
    recordCount: 12,
    color: 'blue',
    iconName: 'DoorOpen',
    feedsIntoModules: ['Giảm lao động (EMP15)', 'Báo giảm Bảo hiểm (INS04)', 'Quyết toán nghỉ việc'],
    feedsIntoWorkflows: ['LIFE-07', 'SOP-EMP-15', 'SOP-INS-04'],
    description: 'Trích xuất chính xác Mục 5.18 và 5.19 tài liệu 1.EMP.HRM.SOP.docx: Phân loại 6 nhóm lý do nghỉ việc (Cơ hội khác, Lý do chủ quan, Chế độ phúc lợi, Môi trường làm việc, Áp lực...) phục vụ phỏng vấn thôi việc (Exit Interview).',
    descriptionEn: 'Section 5.18-5.19 from 1.EMP.HRM.SOP.docx: Exit reason categories (Better opportunity, Compensation, Work pressure, Relationships) for exit interviews.',
    fields: [
      { name: 'Mã Loại Nghỉ Việc', nameEn: 'Exit Code', key: 'code', type: 'string', required: true, description: 'Mã loại thôi việc', descriptionEn: 'Exit code' },
      { name: 'Tên Loại Nghỉ Việc', nameEn: 'Exit Category Name', key: 'name', type: 'string', required: true, description: 'Lý do chính thức', descriptionEn: 'Exit category title' },
      { name: 'Nhóm Nghỉ Việc', nameEn: 'Exit Group', key: 'group', type: 'select', required: true, description: 'Mất / Nghỉ hưu / Nghỉ việc (Dữ liệu ngầm)', descriptionEn: 'Retirement / Resignation / Deceased' }
    ],
    sampleRecords: [
      { id: 'OFF-01', code: 'OFF-CAREER', name: 'Có cơ hội nghề nghiệp khác', group: 'Nghỉ việc tự nguyện', status: 'active' },
      { id: 'OFF-02', code: 'OFF-BENEFIT', name: 'Do chế độ chính sách phúc lợi', group: 'Nghỉ việc tự nguyện', status: 'active' },
      { id: 'OFF-03', code: 'OFF-RETIRE', name: 'Đến tuổi nghỉ hưu theo quy định', group: 'Nghỉ hưu', status: 'active' },
      { id: 'OFF-04', code: 'OFF-DISCIPLINE', name: 'Xử lý kỷ luật sa thải', group: 'Chấm dứt HĐLĐ', status: 'active' }
    ]
  },

  // =========================================================================
  // ⏰ TẦNG 2: PHÂN HỆ CHẤM CÔNG (2.ATT.HRM.SOP.DOCX)
  // =========================================================================
  {
    id: 'MD-08',
    code: 'MD-08',
    title: 'Danh Mục Ca Làm Việc & Loại Tăng Ca (Overtime)',
    titleEn: 'Work Shifts & Overtime Rate Classifications',
    subtitle: 'Loại ca, Khung giờ & Loại tăng ca gán theo từng ca (Mục 5.20 DOCX ATT)',
    subtitleEn: 'Shifts, Punch Windows & Overtime multipliers per shift',
    tier: 'tier2_module',
    moduleId: 'att',
    moduleName: 'Chấm công (ATT)',
    moduleNameEn: 'Attendance (ATT)',
    recordCount: 12,
    color: 'emerald',
    iconName: 'Clock',
    feedsIntoModules: ['Phân ca làm việc', 'Tổng hợp Bảng công (ATT11)', 'Tính lương (PAY)'],
    feedsIntoWorkflows: ['LIFE-06', 'SOP-ATT-01', 'SOP-ATT-02'],
    description: 'Trích xuất từ Mục 5.20 tài liệu 2.ATT.HRM.SOP.docx: Danh mục loại tăng ca được gán trực tiếp theo từng Loại ca làm việc và hệ số công.',
    descriptionEn: 'Section 5.20 from 2.ATT.HRM.SOP.docx: Shift definitions with embedded overtime rate rules and working hour windows.',
    fields: [
      { name: 'Mã Ca', nameEn: 'Shift Code', key: 'code', type: 'string', required: true, description: 'Mã ca', descriptionEn: 'Shift code' },
      { name: 'Tên Ca Làm Việc', nameEn: 'Shift Name', key: 'name', type: 'string', required: true, description: 'Tên ca phân công', descriptionEn: 'Shift title' },
      { name: 'Khung Giờ Vào - Ra', nameEn: 'Hours', key: 'timeWindow', type: 'string', required: true, description: 'Giờ bắt đầu - Giờ kết thúc', descriptionEn: 'In - Out timing' },
      { name: 'Số Công Chuẩn', nameEn: 'Man-days', key: 'mandays', type: 'number', required: true, description: 'Số ngày công quy đổi', descriptionEn: 'Standard man-day value' }
    ],
    sampleRecords: [
      { id: 'SFT-01', code: 'CA-HC', name: 'Ca Hành Chính Văn Phòng (Thứ 2 - Thứ 6)', timeWindow: '08:30 - 17:30', mandays: 1.0, status: 'active' },
      { id: 'SFT-02', code: 'CA-KIP-SANG', name: 'Ca Kíp Sản Xuất Sáng (Kíp 1)', timeWindow: '06:00 - 14:00', mandays: 1.0, status: 'active' },
      { id: 'SFT-03', code: 'CA-KIP-DEM', name: 'Ca Kíp Đêm (Hưởng phụ cấp ca đêm 30%)', timeWindow: '22:00 - 06:00', mandays: 1.3, status: 'active' }
    ]
  },
  {
    id: 'MD-LEAVE-DOCS',
    code: 'MD-LEAVE-DOC',
    title: 'Danh Mục Chứng Từ Cần Nộp Khi Nghỉ Phép',
    titleEn: 'Required Leave Attachments & Justification Documents',
    subtitle: 'Giấy ra viện, Giấy kết hôn, Giấy chứng tử... (Mục 5.21 DOCX ATT)',
    subtitleEn: 'Hospital Discharge, Marriage Cert, Death Cert (Section 5.21)',
    tier: 'tier2_module',
    moduleId: 'att',
    moduleName: 'Chấm công (ATT)',
    moduleNameEn: 'Attendance (ATT)',
    recordCount: 8,
    color: 'emerald',
    iconName: 'FileText',
    feedsIntoModules: ['Đăng ký nghỉ phép Portal', 'Hồ sơ thanh toán Chế độ BHXH (INS05)'],
    feedsIntoWorkflows: ['LIFE-06', 'SOP-ATT-04', 'SOP-INS-05'],
    description: 'Trích xuất chính xác Mục 5.21 tài liệu 2.ATT.HRM.SOP.docx: Danh mục chứng từ bắt buộc phải đính kèm tương ứng với từng loại nghỉ phép.',
    descriptionEn: 'Section 5.21 from 2.ATT.HRM.SOP.docx: Mandatory verification documents required when submitting leave requests on Employee Portal.',
    fields: [
      { name: 'Mã Chứng Từ', nameEn: 'Doc Code', key: 'code', type: 'string', required: true, description: 'Mã chứng từ', descriptionEn: 'Document code' },
      { name: 'Tên Chứng Từ Bắt Buộc', nameEn: 'Document Name', key: 'name', type: 'string', required: true, description: 'Tên giấy tờ cần nộp', descriptionEn: 'Document title' },
      { name: 'Loại Nghỉ Áp Dụng', nameEn: 'Leave Type Applicable', key: 'leaveType', type: 'string', required: true, description: 'Áp dụng cho loại nghỉ nào', descriptionEn: 'Target leave policy' }
    ],
    sampleRecords: [
      { id: 'DOC-01', code: 'DOC-HOSPITAL-CERT', name: 'Giấy Chứng Nhận Nghỉ Việc Hưởng BHXH (C70a-HD)', leaveType: 'Nghỉ Ốm đau / Thai sản', status: 'active' },
      { id: 'DOC-02', code: 'DOC-MARRIAGE-CERT', name: 'Bản Sao Giấy Đăng Ký Kết Hôn', leaveType: 'Nghỉ Kết Hôn (Hưởng nguyên lương)', status: 'active' },
      { id: 'DOC-03', code: 'DOC-DEATH-CERT', name: 'Giấy Báo Tử Tứ Thân Phụ Mẫu', leaveType: 'Nghỉ Tang Chế (Hưởng nguyên lương)', status: 'active' }
    ]
  },

  // =========================================================================
  // 💰 TẦNG 2: PHÂN HỆ TIỀN LƯƠNG & PHỤ CẤP (4.PAY.HRM.SOP.DOCX)
  // =========================================================================
  {
    id: 'MD-07',
    code: 'MD-07',
    title: 'Thang Bảng Lương 3P (Thành Tố P1 - Pay for Position)',
    titleEn: '3P Salary Scale & Pay Bands (P1 Component)',
    subtitle: 'Ngạch bậc lương, Bậc 1 đến Bậc 10 & Mức lương tối thiểu vùng (Mục 5.22 DOCX)',
    subtitleEn: 'Pay Grades, Step Multipliers & Regional Wage Minimums (Section 5.22)',
    tier: 'tier2_module',
    moduleId: 'pay',
    moduleName: 'Tiền lương (PAY)',
    moduleNameEn: 'Payroll (PAY)',
    recordCount: 15,
    color: 'amber',
    iconName: 'CircleDollarSign',
    feedsIntoModules: ['Ký Hợp đồng mới (EMP06)', 'Điều chỉnh Lương (EMP08/09/10)', 'Tính lương (PAY)'],
    feedsIntoWorkflows: ['LIFE-04', 'LIFE-05', 'SOP-EMP-08', 'SOP-EMP-09', 'SOP-EMP-10', 'SOP-PAY-02'],
    description: 'Trích xuất chính xác Mục 5.22 tài liệu 4.PAY.HRM.SOP.docx: Danh mục thang bảng lương P1 trong mô hình đãi ngộ 3P, làm căn cứ điều chỉnh thu nhập định kỳ và theo lương tối thiểu vùng (EMP10).',
    descriptionEn: 'Section 5.22 from 4.PAY.HRM.SOP.docx: 3P salary scale (P1 - Position pay) serving as the foundation for periodic salary adjustments and regional wage compliance.',
    fields: [
      { name: 'Mã Ngạch/Bậc', nameEn: 'Grade Code', key: 'code', type: 'string', required: true, description: 'Mã ngạch bậc', descriptionEn: 'Grade code' },
      { name: 'Tên Ngạch Bậc Lương', nameEn: 'Grade Name', key: 'name', type: 'string', required: true, description: 'Tên ngạch lương 3P', descriptionEn: '3P grade title' },
      { name: 'Mức Lương Sàn (Min)', nameEn: 'Min Base', key: 'minPay', type: 'number', required: true, description: 'Lương tối thiểu ngạch', descriptionEn: 'Minimum pay floor' },
      { name: 'Mức Lương Trần (Max)', nameEn: 'Max Base', key: 'maxPay', type: 'number', required: true, description: 'Lương tối đa ngạch', descriptionEn: 'Maximum pay ceiling' }
    ],
    sampleRecords: [
      { id: 'P1-01', code: 'GRD-P1-OFFICER', name: 'Ngạch Chuyên viên Nghiệp vụ (Officer Band)', minPay: 15000000, maxPay: 25000000, status: 'active' },
      { id: 'P1-02', code: 'GRD-P1-SENIOR', name: 'Ngạch Chuyên gia / Chuyên viên Cao cấp', minPay: 25000000, maxPay: 42000000, status: 'active' },
      { id: 'P1-03', code: 'GRD-P1-MANAGER', name: 'Ngạch Quản lý Phòng ban (Manager Band)', minPay: 42000000, maxPay: 68000000, status: 'active' }
    ]
  },
  {
    id: 'MD-ALLOWANCES-20',
    code: 'MD-ALLOWANCE',
    title: 'Danh Mục 20 Loại Phụ Cấp & Nhóm Phụ Cấp',
    titleEn: '20 Standard Allowance Types & Categories',
    subtitle: 'Loại phụ cấp 1 đến 20, Tính chất Chịu Thuế / Miễn Thuế (Mục 5.23 DOCX PAY)',
    subtitleEn: '20 Allowance Types, Taxable vs Non-Taxable rules (Section 5.23)',
    tier: 'tier2_module',
    moduleId: 'pay',
    moduleName: 'Tiền lương (PAY)',
    moduleNameEn: 'Payroll (PAY)',
    recordCount: 20,
    color: 'amber',
    iconName: 'BadgePercent',
    feedsIntoModules: ['Phụ lục Lương (EMP07)', 'Bảng lương hàng tháng (PAY02)', 'Thuế TNCN'],
    feedsIntoWorkflows: ['LIFE-04', 'LIFE-05', 'SOP-EMP-07', 'SOP-PAY-02'],
    description: 'Trích xuất chính xác Mục 5.23 tài liệu 4.PAY.HRM.SOP.docx: Cấu hình chuẩn 20 Loại phụ cấp (từ Phụ cấp 1 đến Phụ cấp 20) kèm quy định miễn thuế TNCN hay chịu thuế.',
    descriptionEn: 'Section 5.23 from 4.PAY.HRM.SOP.docx: Standard 20 allowance types (Allowance 1 to 20) with strict PIT taxability classifications.',
    fields: [
      { name: 'Mã Phụ Cấp', nameEn: 'Allowance Code', key: 'code', type: 'string', required: true, description: 'Mã phụ cấp', descriptionEn: 'Allowance code' },
      { name: 'Tên Loại Phụ Cấp', nameEn: 'Allowance Name', key: 'name', type: 'string', required: true, description: 'Tên phụ cấp (1 -> 20)', descriptionEn: 'Allowance title' },
      { name: 'Tính Chịu Thuế TNCN?', nameEn: 'Taxable PIT?', key: 'isTaxable', type: 'boolean', required: true, description: 'Có tính thuế TNCN không?', descriptionEn: 'Subject to PIT' }
    ],
    sampleRecords: [
      { id: 'ALW-01', code: 'PC-01-AN-TRUA', name: 'Phụ cấp Ăn trưa (Miễn thuế tối đa 730k/tháng)', isTaxable: false, status: 'active' },
      { id: 'ALW-02', code: 'PC-02-DIEN-THOAI', name: 'Phụ cấp Điện thoại / Liên lạc công vụ', isTaxable: false, status: 'active' },
      { id: 'ALW-03', code: 'PC-03-XANG-XE', name: 'Phụ cấp Xăng xe / Đi lại công tác', isTaxable: false, status: 'active' },
      { id: 'ALW-04', code: 'PC-04-TRACH-NHIEM', name: 'Phụ cấp Trách nhiệm Quản lý (Chịu thuế)', isTaxable: true, status: 'active' },
      { id: 'ALW-05', code: 'PC-05-KIEM-NHIEM', name: 'Phụ cấp Kiêm nhiệm chức vụ (Chịu thuế)', isTaxable: true, status: 'active' }
    ]
  },

  // =========================================================================
  // 🛡️ TẦNG 2: PHÂN HỆ BẢO HIỂM XÃ HỘI (3.INS.HRM.SOP.DOCX)
  // =========================================================================
  {
    id: 'MD-09',
    code: 'MD-09',
    title: 'Tỷ Lệ Đóng & Khung Mức Đóng Bảo Hiểm (BHXH/BHYT/BHTN)',
    titleEn: 'Social Insurance Contribution Rates & Ceilings',
    subtitle: 'BHXH (25.5%), BHYT (4.5%), BHTN (2.0%), BHTNLD-BNN (0.5%) (Mục 5 DOCX INS)',
    subtitleEn: 'Statutory Rates per 3.INS.HRM.SOP.docx Section 5',
    tier: 'tier2_module',
    moduleId: 'ins',
    moduleName: 'Bảo hiểm (INS)',
    moduleNameEn: 'Insurance (INS)',
    recordCount: 4,
    color: 'purple',
    iconName: 'ShieldCheck',
    feedsIntoModules: ['Báo tăng BHXH (INS02)', 'Tính lương (PAY02)', 'In Mẫu 05-HBS'],
    feedsIntoWorkflows: ['LIFE-04', 'SOP-INS-01', 'SOP-INS-02', 'SOP-PAY-02'],
    description: 'Trích xuất từ tài liệu 3.INS.HRM.SOP.docx: Cấu hình 4 quỹ bảo hiểm bắt buộc theo luật Việt Nam và in mẫu 05-HBS gửi Cơ quan Bảo hiểm.',
    descriptionEn: 'Official specs from 3.INS.HRM.SOP.docx: Statutory insurance funds configuration and automated generation of 05-HBS claim forms.',
    fields: [
      { name: 'Tên Quỹ Bảo Hiểm', nameEn: 'Fund Name', key: 'name', type: 'string', required: true, description: 'Tên quỹ bảo hiểm', descriptionEn: 'Insurance fund title' },
      { name: 'Tỷ lệ Doanh nghiệp', nameEn: 'Employer Rate', key: 'employerRate', type: 'string', required: true, description: '% Doanh nghiệp đóng', descriptionEn: 'Employer contribution' },
      { name: 'Tỷ lệ Người lao động', nameEn: 'Employee Rate', key: 'employeeRate', type: 'string', required: true, description: '% NLĐ trích nộp', descriptionEn: 'Employee contribution' },
      { name: 'Tổng Tỷ lệ', nameEn: 'Total Rate', key: 'totalRate', type: 'string', required: true, description: 'Tổng cộng', descriptionEn: 'Total rate' }
    ],
    sampleRecords: [
      { id: 'INS-01', code: 'SI-BHXH', name: 'Bảo hiểm Xã hội (Hưu trí, Tử tuất, Ốm đau, Thai sản)', employerRate: '17.5%', employeeRate: '8.0%', totalRate: '25.5%', status: 'active' },
      { id: 'INS-02', code: 'HI-BHYT', name: 'Bảo hiểm Y tế (KCB)', employerRate: '3.0%', employeeRate: '1.5%', totalRate: '4.5%', status: 'active' },
      { id: 'INS-03', code: 'UI-BHTN', name: 'Bảo hiểm Thất nghiệp', employerRate: '1.0%', employeeRate: '1.0%', totalRate: '2.0%', status: 'active' },
      { id: 'INS-04', code: 'OAI-BNN', name: 'Bảo hiểm Tai nạn Lao động & Bệnh Nghề nghiệp (BHTNLD&BNN)', employerRate: '0.5%', employeeRate: '0.0%', totalRate: '0.5%', status: 'active' }
    ]
  }
]
