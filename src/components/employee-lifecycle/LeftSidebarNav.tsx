import React, { useState } from 'react'
import {
  LayoutDashboard,
  Database,
  Layers,
  GitBranch,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  LogOut,
  Settings
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth, useSession } from '../../auth/session'

interface LeftSidebarNavProps {
  activeSection: string
  onNavigateSection: (sectionId: string) => void
  onOpenERD: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export const LeftSidebarNav: React.FC<LeftSidebarNavProps> = ({
  activeSection,
  onNavigateSection,
  onOpenERD,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse
}) => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const session = useSession()
  const { roleTitle, logout } = useAuth()
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalIsCollapsed(!internalIsCollapsed)
    }
  }

  const allowedMenuCodes = new Set(session.menuItems.map((item) => item.code))
  const menuGroups = [
    {
      groupTitle: t('sidebar.group.overview', 'BẮT ĐẦU TỪ ĐÂY'),
      items: [
        {
          id: 'overview-dashboard',
          label: t('sidebar.item.dashboard', 'Tổng quan hệ thống'),
          icon: LayoutDashboard,
          badge: t('sidebar.item.dashboardBadge', 'Overview'),
          color: 'text-blue-600'
        }
      ]
    },
    {
      groupTitle: t('sidebar.group.architecture', 'NỘI DUNG CHÍNH'),
      items: [
        {
          id: 'layer-1-master-data',
          label: t('sidebar.item.layer1', 'Danh mục dùng chung'),
          icon: Database,
          badge: t('sidebar.item.layer1Badge', 'Nền tảng'),
          color: 'text-blue-600'
        },
        {
          id: 'layer-2-lifecycle',
          label: t('sidebar.item.layer2', 'Vòng đời nhân sự'),
          icon: Layers,
          badge: t('sidebar.item.layer2Badge', '8 giai đoạn'),
          color: 'text-blue-600'
        },
        {
          id: 'layer-3-operations',
          label: t('sidebar.item.layer3', 'Nghiệp vụ phát sinh'),
          icon: GitBranch,
          badge: t('sidebar.item.layer3Badge', '8 nhóm'),
          color: 'text-blue-600'
        },
        {
          id: 'system-support',
          label: t('sidebar.item.support', 'Tiện ích hỗ trợ'),
          icon: HelpCircle,
          badge: t('sidebar.item.supportBadge', 'Hỗ trợ'),
          color: 'text-blue-600'
        }
      ]
    },
    {
      groupTitle: t('sidebar.group.specs', 'TRA CỨU CHI TIẾT'),
      items: [
        {
          id: 'policy-center',
          label: t('sidebar.item.policies', 'Quy định & Tuân thủ'),
          icon: ShieldCheck,
          badge: '7 Quy định',
          color: 'text-emerald-600'
        },
        {
          id: 'open-erd-modal',
          label: t('sidebar.item.erd', 'Sơ đồ dữ liệu'),
          icon: Sparkles,
          badge: 'Sơ đồ',
          color: 'text-blue-600',
          onClick: onOpenERD
        },
        {
          id: 'sop-specs-matrix',
          label: t('sidebar.item.sopMatrix', 'Danh sách quy trình'),
          icon: HelpCircle,
          badge: 'Tra cứu',
          color: 'text-blue-600'
        }
      ]
    },
    {
      groupTitle: t('sidebar.group.administration', 'QUẢN TRỊ HỆ THỐNG'),
      items: [
        {
          id: 'ADMIN',
          label: t('sidebar.item.administration', 'Quản trị phân quyền'),
          icon: Settings,
          badge: 'RBAC',
          color: 'text-blue-600'
        }
      ]
    }
  ].map((group) => ({
    ...group,
    items: group.items.filter((item) => allowedMenuCodes.has(item.id))
  })).filter((group) => group.items.length > 0)

  const initials = session.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U'

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-white text-slate-800 border-r border-slate-200 transition-all duration-300 flex flex-col shadow-lg dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 ${isCollapsed ? 'w-12 sm:w-16' : 'w-56 sm:w-64'
        }`}
    >

      {/* SIDEBAR HEADER LOGO */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-black tracking-wider text-slate-900 dark:text-white truncate">
                BẢN ĐỒ HRMS
              </h2>
              <p className="text-[10px] font-bold text-blue-400 truncate">
                Tổng quan nghiệp vụ
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
            <div className="mx-auto p-2 bg-blue-600 text-white rounded-xl shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white"
          title={isCollapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* SIDEBAR MENU SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                {group.groupTitle}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick()
                      } else {
                        onNavigateSection(item.id)
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group relative ${isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : item.color
                        }`} />

                      {!isCollapsed && (
                        <span className="truncate leading-tight">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-extrabold shrink-0 border ${isActive
                        ? 'bg-blue-700 text-blue-100 border-blue-600'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700">
                        {item.label}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* SIDEBAR FOOTER ROLES & LOGOUT */}
      <div className="p-3 border-t border-slate-200 shrink-0 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
        {!isCollapsed ? (
          <div className="rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-extrabold leading-tight text-slate-700 dark:text-slate-100">{session.fullName}</h4>
                <p className="mt-0.5 truncate text-[10px] font-semibold text-[#174d70] dark:text-sky-300">{roleTitle || session.username}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:translate-y-px dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              title="Đăng xuất"
            >
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700"
              title={`${session.fullName} - ${roleTitle || session.username}`}
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-700 active:translate-y-px dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              title="Đăng xuất"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

    </aside>
  )
}
