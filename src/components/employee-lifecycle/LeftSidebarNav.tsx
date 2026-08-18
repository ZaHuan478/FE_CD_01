import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Database,
  Layers,
  GitBranch,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Sparkles,
  Users,
  Activity,
  Award
} from 'lucide-react'

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
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalIsCollapsed(!internalIsCollapsed)
    }
  }

  const menuGroups = [
    {
      groupTitle: 'TỔNG QUAN',
      items: [
        {
          id: 'overview-dashboard',
          label: 'Dashboard Chỉ số KPI',
          icon: LayoutDashboard,
          badge: 'Overview',
          color: 'text-blue-500'
        }
      ]
    },
    {
      groupTitle: 'KIẾN TRÚC PHÂN TẦNG',
      items: [
        {
          id: 'layer-1-master-data',
          label: 'Tầng 1: Master Data',
          icon: Database,
          badge: '10 Catalog',
          color: 'text-purple-500'
        },
        {
          id: 'layer-2-lifecycle',
          label: 'Tầng 2: Vòng đời NV',
          icon: Layers,
          badge: '7 Bước',
          color: 'text-emerald-500'
        },
        {
          id: 'layer-3-operations',
          label: 'Tầng 3: Operational Grid',
          icon: GitBranch,
          badge: '8 Module',
          color: 'text-amber-500'
        },
        {
          id: 'system-support',
          label: 'Hỗ trợ Hệ thống',
          icon: HelpCircle,
          badge: 'Support',
          color: 'text-indigo-500'
        }
      ]
    },
    {
      groupTitle: 'TÀI LIỆU QUY CHUẨN',
      items: [
        {
          id: 'open-erd-modal',
          label: 'Sơ đồ ERD Master Data',
          icon: Sparkles,
          badge: 'ERD View',
          color: 'text-pink-500',
          onClick: onOpenERD
        },
        {
          id: 'sop-specs-matrix',
          label: 'Ma trận 45 SOP Specs',
          icon: ShieldCheck,
          badge: '45 SOPs',
          color: 'text-cyan-500'
        }
      ]
    }
  ]

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 flex flex-col shadow-2xl ${isCollapsed ? 'w-16 sm:w-20' : 'w-64'
        }`}
    >

      {/* SIDEBAR HEADER LOGO */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h2 className="text-xs font-black tracking-wider text-white truncate">
                HRMS ARCHITECTURE
              </h2>
              <p className="text-[10px] font-bold text-blue-400 truncate">
                Workday / SAP Style
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto p-2 bg-blue-600 text-white rounded-xl shadow-md">
            <Layers className="w-5 h-5" />
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
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
              <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/90 mb-1">
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
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
                        ? 'bg-blue-700/80 text-blue-100 border-blue-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700">
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

      {/* SIDEBAR FOOTER ROLES & VERSION */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              HA
            </div>
            <div className="truncate">
              <h4 className="text-xs font-extrabold text-white truncate leading-tight">Lead HR Architect</h4>
              {/* <p className="text-[10px] text-slate-400 font-mono truncate">Audit & Design v2.5</p> */}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
            HA
          </div>
        )}
      </div>

    </aside>
  )
}
