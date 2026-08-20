export type Language = 'vi' | 'en'

export interface TranslationDict {
  [key: string]: {
    vi: string
    en: string
  }
}

export const translations: TranslationDict = {
  // Header
  'header.architecture': {
    vi: 'Enterprise HR SaaS Architecture',
    en: 'Enterprise HR SaaS Architecture'
  },
  'header.productionReady': {
    vi: 'Sẵn sàng Vận hành',
    en: 'Production Ready'
  },
  'header.title': {
    vi: 'QUẢN LÝ HỒ SƠ & VÒNG ĐỜI NHÂN VIÊN',
    en: 'EMPLOYEE PROFILE & LIFECYCLE MANAGEMENT'
  },
  'header.modelStandard': {
    vi: 'Quy chuẩn Mô hình:',
    en: 'Model Standard:'
  },
  'header.themeLight': {
    vi: 'Giao diện Sáng',
    en: 'Light Mode'
  },
  'header.themeDark': {
    vi: 'Giao diện Tối',
    en: 'Dark Mode'
  },
  'header.selectLanguage': {
    vi: 'Ngôn ngữ',
    en: 'Language'
  },

  // Sidebar Groups & Items
  'sidebar.group.overview': {
    vi: 'TỔNG QUAN',
    en: 'OVERVIEW'
  },
  'sidebar.group.architecture': {
    vi: 'KIẾN TRÚC PHÂN TẦNG',
    en: 'LAYERED ARCHITECTURE'
  },
  'sidebar.group.specs': {
    vi: 'TÀI LIỆU QUY CHUẨN',
    en: 'STANDARD SPECS'
  },
  'sidebar.item.dashboard': {
    vi: 'Dashboard Chỉ số KPI',
    en: 'Executive KPI Dashboard'
  },
  'sidebar.item.dashboardBadge': {
    vi: 'Tổng quan',
    en: 'Overview'
  },
  'sidebar.item.layer1': {
    vi: 'Tầng 1: Master Data',
    en: 'Layer 1: Master Data'
  },
  'sidebar.item.layer1Badge': {
    vi: '10 Catalog',
    en: '10 Catalogs'
  },
  'sidebar.item.layer2': {
    vi: 'Tầng 2: Vòng đời NV',
    en: 'Layer 2: Employee Lifecycle'
  },
  'sidebar.item.layer2Badge': {
    vi: '7 Bước',
    en: '7 Steps'
  },
  'sidebar.item.layer3': {
    vi: 'Tầng 3: Operational Grid',
    en: 'Layer 3: Operational Grid'
  },
  'sidebar.item.layer3Badge': {
    vi: '8 Module',
    en: '8 Modules'
  },
  'sidebar.item.support': {
    vi: 'Hỗ trợ Hệ thống',
    en: 'System Support'
  },
  'sidebar.item.supportBadge': {
    vi: 'Hỗ trợ',
    en: 'Support'
  },
  'sidebar.item.erd': {
    vi: 'Sơ đồ ERD Master Data',
    en: 'Master Data ERD Diagram'
  },
  'sidebar.item.sopMatrix': {
    vi: 'Ma trận 45 SOP Specs',
    en: '45 SOP Specs Matrix'
  },
  'sidebar.role': {
    vi: 'Kiến trúc sư HR Chính',
    en: 'Lead HR Architect'
  },

  // Intro Banner
  'banner.title': {
    vi: 'Bức tranh Tổng thể Quy trình Quản trị Nhân sự',
    en: 'Overall Business Process Blueprint for HR Management'
  },
  'banner.description': {
    vi: 'Cấu trúc phân tầng tiêu chuẩn: Tầng 1 Master Data ➔ Tầng 2 Vòng đời Nhân viên ➔ Tầng 3 Nghiệp vụ Phát sinh ➔ Thanh Hỗ trợ Hệ thống',
    en: 'Standard layered architecture: Layer 1 Master Data ➔ Layer 2 Employee Lifecycle ➔ Layer 3 Operational Grid ➔ System Support Bar'
  },

  // Guide Banner Tabs
  'guide.title': {
    vi: 'Hướng dẫn Kiến trúc Hệ thống & Quy chuẩn SOP',
    en: 'System Architecture & SOP Standard Guide'
  },
  'guide.tab.overview': {
    vi: 'Phân Tầng Hệ Thống',
    en: 'System Layers'
  },
  'guide.tab.masterdata': {
    vi: 'Master Data',
    en: 'Master Data'
  },
  'guide.tab.lifecycle': {
    vi: 'Vòng Đời Nhân Viên',
    en: 'Employee Lifecycle'
  },
  'guide.tab.sop': {
    vi: 'Quy chuẩn SOP',
    en: 'SOP Standard'
  },
  'guide.close': {
    vi: 'Đã hiểu',
    en: 'Got it'
  },

  // Dashboard Overview
  'dashboard.title': {
    vi: 'BẢNG ĐIỀU HÀNH CHỈ SỐ QUẢN TRỊ HRMS',
    en: 'HRMS MANAGEMENT EXECUTIVE DASHBOARD'
  },
  'dashboard.subtitle': {
    vi: 'Giám sát chỉ số thời gian thực, tiến độ quy trình vòng đời & sự phục thuộc dữ liệu',
    en: 'Real-time metric monitoring, lifecycle progress & data dependency mapping'
  },
  'dashboard.kpi.activeEmployees': {
    vi: 'Tổng nhân sự vận hành',
    en: 'Active Employees'
  },
  'dashboard.kpi.onboarding': {
    vi: 'Đang Onboarding',
    en: 'Onboarding In Progress'
  },
  'dashboard.kpi.masterDataCatalogs': {
    vi: 'Danh mục Master Data',
    en: 'Master Data Catalogs'
  },
  'dashboard.kpi.sopCoverage': {
    vi: 'Độ phủ Quy trình SOP',
    en: 'SOP Specs Coverage'
  },
  'dashboard.viewErdBtn': {
    vi: 'Xem Sơ Đồ Quan Hệ ERD',
    en: 'View ERD Relationship Diagram'
  },
  'dashboard.quickJump': {
    vi: 'Chuyển Nhanh Tới Tầng System:',
    en: 'Quick Jump To Layer:'
  },

  // Layer Titles & Badges
  'layer1.title': {
    vi: 'TẦNG 1: QUẢN LÝ DỮ LIỆU DÀNH CHO CƠ SỞ (MASTER DATA)',
    en: 'LAYER 1: MASTER DATA MANAGEMENT (FOUNDATION)'
  },
  'layer1.subtitle': {
    vi: '10 Danh mục Dữ liệu Dùng chung - Nền tảng Chuẩn hóa Toàn Hệ thống',
    en: '10 Core Shared Data Catalogs - System-wide Standardized Foundation'
  },
  'layer1.erdButton': {
    vi: 'Sơ đồ ERD Quan hệ Dữ liệu',
    en: 'Data Relationship ERD Diagram'
  },

  'layer2.title': {
    vi: 'TẦNG 2: VÒNG ĐỜI NHÂN VIÊN (7-STEP LIFECYCLE PIPELINE)',
    en: 'LAYER 2: EMPLOYEE LIFECYCLE (7-STEP PIPELINE)'
  },
  'layer2.subtitle': {
    vi: 'Hành trình 7 Bước Xuyên suốt từ Tuyển dụng đến Xử lý Thỉ việc',
    en: '7-Step End-to-End Journey from Recruitment to Offboarding'
  },

  'layer3.title': {
    vi: 'TẦNG 3: NGHIỆP VỤ PHÁT SINH VẬN HÀNH (OPERATIONAL GRID)',
    en: 'LAYER 3: OPERATIONAL GRID & PERIODIC BUSINESS'
  },
  'layer3.subtitle': {
    vi: '8 Module Nghiệp vụ Xử lý Định kỳ & Đột xuất Trong Quá trình Vận hành',
    en: '8 Operational Modules for Periodic & Event-Driven HR Business Operations'
  },

  'support.title': {
    vi: 'THANH HỖ TRỢ XUYÊN SUỐT HỆ THỐNG (SYSTEM SUPPORT & GOVERNANCE)',
    en: 'SYSTEM SUPPORT & GOVERNANCE (CROSS-CUTTING UTILITIES)'
  },
  'support.subtitle': {
    vi: 'Tiện ích Phân quyền, Nhật ký Audit, Báo cáo & Cấu hình Đã được Chuẩn hóa',
    en: 'Standardized RBAC, Audit Logging, Reporting & Configuration Utilities'
  },

  // Common Controls & Buttons
  'common.viewDetail': {
    vi: 'Xem Chi Tiết Quy Trình',
    en: 'View Process Detail'
  },
  'common.viewWireframe': {
    vi: 'Xem Giao Diện Form UI',
    en: 'View Wireframe Form UI'
  },
  'common.inputs': {
    vi: 'Dữ liệu Đầu vào:',
    en: 'Input Data:'
  },
  'common.outputs': {
    vi: 'Dữ liệu Đầu ra:',
    en: 'Output Data:'
  },
  'common.actors': {
    vi: 'Tác nhân thực hiện:',
    en: 'Key Actors:'
  },
  'common.back': {
    vi: 'Quay lại',
    en: 'Back'
  },
  'common.close': {
    vi: 'Đóng',
    en: 'Close'
  },
  'common.export': {
    vi: 'Xuất Tài liệu Spec',
    en: 'Export Spec Doc'
  },
  'common.search': {
    vi: 'Tìm kiếm...',
    en: 'Search...'
  },
  'common.statusOfficial': {
    vi: 'Quy chuẩn Chính thức',
    en: 'Official Standard'
  },
  'common.statusDraft': {
    vi: 'Bản thảo Review',
    en: 'Draft Review'
  },

  // Tabs Navigation
  'tabs.lifecycle': {
    vi: 'Vòng đời Nhân sự',
    en: 'Employee Lifecycle'
  },
  'tabs.masterdata': {
    vi: 'Master Data & ERD',
    en: 'Master Data & ERD'
  },
  'tabs.reports': {
    vi: 'Báo cáo & Độ phủ SOP',
    en: 'Reports & SOP Coverage'
  },
  'tabs.guideBtn': {
    vi: 'Hướng dẫn Kiến trúc',
    en: 'Architecture Guide'
  },
  'stepper.activeStepDetail': {
    vi: 'Chi tiết Bước được chọn',
    en: 'Selected Step Detail'
  },
  'stepper.quickActions': {
    vi: 'Hành động Nhanh',
    en: 'Quick Actions'
  },
  'stepper.openFullWorkflow': {
    vi: 'Mở Quy trình Chi tiết Toàn diện (SOP)',
    en: 'Open Full Workflow SOP Spec'
  },
  'stepper.coModules': {
    vi: 'Phân hệ Phối hợp',
    en: 'Associated Modules'
  },

  // Workflow Detail Tabs
  'workflow.tab.diagram': {
    vi: 'Sơ đồ Quy trình Trực quan',
    en: 'Visual Process Diagram'
  },
  'workflow.tab.roles': {
    vi: 'Phân định Vai trò & RACI',
    en: 'Role Mapping & RACI Matrix'
  },
  'workflow.tab.specs': {
    vi: 'Bảng Đặc tả & Checklist',
    en: 'SOP Specs & Checklist'
  }
}
