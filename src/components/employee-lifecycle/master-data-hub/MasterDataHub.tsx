import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Database,
  GitBranch,
  GitFork,
  Layers,
  Link2,
  PlayCircle,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Table,
  Target
} from 'lucide-react'

import { MASTER_DATA_HUB_DATABASE } from './data/masterDataHubDatabase'
import type { CatalogModuleId, CatalogTier, MasterCatalogItem } from './types'
import { CatalogDataInspectorModal } from './components/CatalogDataInspectorModal'
import { useLanguage } from '../../../context/LanguageContext'

interface MasterDataHubProps {
  onOpenERD?: () => void
  isDarkMode: boolean
}

type HubTab = 'catalogs' | 'erd' | 'tester'

const TIER_LABELS: Record<CatalogTier, string> = {
  tier1_global: 'Tầng 1: Global',
  tier2_module: 'Tầng 2: Phân hệ',
  tier3_utility: 'Tầng 3: Tiện ích',
  tier4_governance: 'Tầng 4: Governance'
}

const CORE_RELATIONS = [
  {
    title: 'Phân cấp địa lý',
    nodes: ['MD-01 Địa lý', 'MD-12 Thuế', 'MD-15 KCB'],
    detail: 'Tỉnh/Thành lọc cơ quan thuế và cơ sở KCB hợp lệ.'
  },
  {
    title: 'Chức danh -> Ngạch lương',
    nodes: ['MD-06 Chức danh', 'MD-07 Lương 3P', 'LIFE-04 Hợp đồng'],
    detail: 'Chọn chức danh sẽ khóa dải lương min/max được phép.'
  },
  {
    title: 'Phòng ban -> Cost Center',
    nodes: ['MD-05 Phòng ban', 'MD-13 Cost Center', 'ERP'],
    detail: 'Phòng ban hoạt động phải có Cost Center ERP còn hiệu lực.'
  },
  {
    title: 'Thuế -> Người phụ thuộc',
    nodes: ['MD-03 Quan hệ', 'MD-12 Cơ quan Thuế', 'LIFE-05 Thuế TNCN'],
    detail: 'Người phụ thuộc hợp lệ cần quan hệ được phép và cơ quan thuế quản lý.'
  },
  {
    title: 'Bàn giao tài sản -> Thôi việc',
    nodes: ['MD-18 Tài sản', 'LIFE-07 Thôi việc', 'Quyết toán'],
    detail: 'Không đóng hồ sơ thôi việc khi còn tài sản Issued hoặc Lost.'
  }
]

const PROVINCES = [
  { code: 'HCM', name: 'Thành phố Hồ Chí Minh', taxOffices: ['TAX-HCM', 'TAX-Q1-HCM'], healthcare: ['79024'] },
  { code: 'HN', name: 'Thành phố Hà Nội', taxOffices: ['TAX-HN'], healthcare: ['01001'] },
  { code: 'DN', name: 'Thành phố Đà Nẵng', taxOffices: ['TAX-DN'], healthcare: ['48015'] }
]

const JOBS = [
  { code: 'JOB-HR-SPEC', name: 'Chuyên viên Nhân sự', grade: 'GRD-OFFICER', min: 12000000, max: 24000000 },
  { code: 'JOB-SR-DEV', name: 'Kỹ sư Phần mềm Cao cấp', grade: 'GRD-SENIOR', min: 24000000, max: 42000000 },
  { code: 'JOB-DEPT-MGR', name: 'Trưởng phòng', grade: 'GRD-MANAGER', min: 42000000, max: 70000000 }
]

export const MasterDataHub: React.FC<MasterDataHubProps> = ({ onOpenERD, isDarkMode }) => {
  const { language } = useLanguage()

  const [activeTab, setActiveTab] = useState<HubTab>('catalogs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<CatalogTier | 'ALL'>('ALL')
  const [selectedModule, setSelectedModule] = useState<CatalogModuleId | 'ALL'>('ALL')
  const [inspectingCatalog, setInspectingCatalog] = useState<MasterCatalogItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [provinceCode, setProvinceCode] = useState('HCM')
  const [jobCode, setJobCode] = useState('JOB-SR-DEV')
  const [salary, setSalary] = useState(45000000)
  const [assetStatus, setAssetStatus] = useState<'Returned' | 'Issued' | 'Lost'>('Issued')

  const filteredCatalogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return MASTER_DATA_HUB_DATABASE.filter((cat) => {
      const matchesSearch = !q || [cat.code, cat.title, cat.titleEn, cat.subtitle, cat.subtitleEn, cat.moduleName].some((value) => value.toLowerCase().includes(q))
      const matchesTier = selectedTier === 'ALL' || cat.tier === selectedTier
      const matchesModule = selectedModule === 'ALL' || cat.moduleId === selectedModule
      return matchesSearch && matchesTier && matchesModule
    })
  }, [searchTerm, selectedTier, selectedModule])

  const tierCounts = useMemo(() => {
    return MASTER_DATA_HUB_DATABASE.reduce<Record<CatalogTier, number>>(
      (acc, catalog) => ({ ...acc, [catalog.tier]: acc[catalog.tier] + 1 }),
      { tier1_global: 0, tier2_module: 0, tier3_utility: 0, tier4_governance: 0 }
    )
  }, [])

  const selectedProvince = PROVINCES.find((province) => province.code === provinceCode) || PROVINCES[0]
  const selectedJob = JOBS.find((job) => job.code === jobCode) || JOBS[0]
  const salaryStatus = salary < selectedJob.min ? 'below' : salary > selectedJob.max ? 'above' : 'valid'
  const canCloseOffboarding = assetStatus === 'Returned'

  const handleOpenInspector = (catalog: MasterCatalogItem) => {
    setInspectingCatalog(catalog)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      <div className={`p-5 sm:p-6 rounded-2xl border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-black uppercase rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                MASTER DATA SETTINGS HUB
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {MASTER_DATA_HUB_DATABASE.length} {language === 'vi' ? 'Danh mục Enterprise' : 'Enterprise Catalogs'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              {language === 'vi' ? 'Trung Tâm Quản Trị Master Data & Ràng Buộc Quan Hệ' : 'Enterprise Master Data & Relational Validation Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              {language === 'vi'
                ? '18 danh mục chuẩn Enterprise với khóa ngoại, validation constraint và mô phỏng cascade/cảnh báo dữ liệu liên phân hệ.'
                : '18 enterprise catalogs with foreign keys, validation constraints and live cross-catalog rule simulation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenERD && (
            <button type="button" onClick={onOpenERD} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer">
              <GitFork className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Mở ERD tổng' : 'Open ERD'}</span>
            </button>
          )}
          <button type="button" onClick={() => handleOpenInspector(MASTER_DATA_HUB_DATABASE[0])} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>{language === 'vi' ? 'Thêm Danh Mục' : 'Add Catalog'}</span>
          </button>
        </div>
      </div>

      <div className={`p-2 rounded-2xl border flex flex-col md:flex-row gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {[
          { id: 'catalogs' as const, icon: Table, label: language === 'vi' ? 'Danh Mục Master Data (18 Catalogs)' : 'Master Data Catalogs (18)' },
          { id: 'erd' as const, icon: GitBranch, label: language === 'vi' ? 'Sơ Đồ Quan Hệ Dữ Liệu' : 'ERD & Cross-Catalog Rules' },
          { id: 'tester' as const, icon: PlayCircle, label: language === 'vi' ? 'Trình Giả Lập Ràng Buộc' : 'Live Validation Tester' }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'}`}>
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {activeTab === 'catalogs' && (
        <>
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={language === 'vi' ? 'Tìm nhanh danh mục, mã, phân hệ hoặc mô tả...' : 'Quick search catalogs, codes, modules or descriptions...'} className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'}`} />
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  {language === 'vi' ? 'Phân tầng:' : 'Tier:'}
                </span>
                <button type="button" onClick={() => setSelectedTier('ALL')} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${selectedTier === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}>
                  All ({MASTER_DATA_HUB_DATABASE.length})
                </button>
                {(Object.keys(TIER_LABELS) as CatalogTier[]).map((tier) => (
                  <button key={tier} type="button" onClick={() => setSelectedTier(tier)} className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${selectedTier === tier ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}>
                    {TIER_LABELS[tier]} ({tierCounts[tier]})
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: 'ALL', label: 'All', icon: <Layers className="w-3 h-3" /> },
                  { id: 'ats', label: 'ATS', icon: <Target className="w-3 h-3" /> },
                  { id: 'emp', label: 'EMP', icon: <Building2 className="w-3 h-3" /> },
                  { id: 'att', label: 'ATT', icon: <Clock className="w-3 h-3" /> },
                  { id: 'pay', label: 'PAY', icon: <CircleDollarSign className="w-3 h-3" /> },
                  { id: 'ins', label: 'INS', icon: <ShieldCheck className="w-3 h-3" /> },
                  { id: 'tax', label: 'TAX', icon: <Receipt className="w-3 h-3" /> },
                  { id: 'admin', label: 'ADMIN', icon: <BadgeCheck className="w-3 h-3" /> }
                ].map((m) => (
                  <button key={m.id} type="button" onClick={() => setSelectedModule(m.id as CatalogModuleId | 'ALL')} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${selectedModule === m.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
              <span>{language === 'vi' ? `Hiển thị ${filteredCatalogs.length}/${MASTER_DATA_HUB_DATABASE.length} danh mục` : `Showing ${filteredCatalogs.length}/${MASTER_DATA_HUB_DATABASE.length} catalogs`}</span>
              <span className="text-[11px] font-mono text-slate-400">{language === 'vi' ? 'Click thẻ để xem schema, sample và rules' : 'Click card to inspect schema, samples and rules'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCatalogs.map((catalog) => (
                <div key={catalog.id} className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between group shadow-xs hover:shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50' : 'bg-white border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/40'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">{catalog.code}</span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{catalog.recordCount.toLocaleString()} rows</span>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                        {language === 'vi' ? catalog.title : catalog.titleEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{language === 'vi' ? catalog.subtitle : catalog.subtitleEn}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2">
                        <div className="text-sm font-black">{catalog.fields.length}</div>
                        <div className="text-[10px] text-slate-400 font-bold">fields</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2">
                        <div className="text-sm font-black">{catalog.foreignKeys?.length || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold">FK</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2">
                        <div className="text-sm font-black">{catalog.validationConstraints?.length || 0}</div>
                        <div className="text-[10px] text-slate-400 font-bold">rules</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">{language === 'vi' ? 'Nuôi sống workflow:' : 'Feeds workflows:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {(catalog.feedsIntoWorkflows || []).slice(0, 6).map((workflow) => (
                          <span key={workflow} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">{workflow}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button type="button" onClick={() => handleOpenInspector(catalog)} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                      <Table className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Xem dữ liệu' : 'View Data'}</span>
                    </button>
                    <button type="button" onClick={() => setActiveTab('erd')} className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ERD</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'erd' && (
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
              <Link2 className="w-4 h-4 text-blue-500" />
              <span>{language === 'vi' ? 'Ma trận quan hệ ERD & ràng buộc chéo cốt lõi' : 'Core ERD Matrix & Cross-Catalog Rules'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'vi' ? 'Các luồng dưới đây là ràng buộc nghiệp vụ Enterprise được khai báo trong database và mô phỏng tại tab Validation Tester.' : 'These enterprise business relations are declared in the database and simulated in the Validation Tester tab.'}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {CORE_RELATIONS.map((relation) => (
              <div key={relation.title} className={`p-4 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3">{relation.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {relation.nodes.map((node, index) => (
                    <React.Fragment key={node}>
                      <div className="flex-1 min-h-20 p-3 rounded-xl border border-blue-500/20 bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-center text-xs font-black text-blue-700 dark:text-blue-300">
                        {node}
                      </div>
                      {index < relation.nodes.length - 1 && <ArrowRight className="w-4 h-4 text-slate-400 mx-auto rotate-90 sm:rotate-0" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{relation.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {MASTER_DATA_HUB_DATABASE.filter((catalog) => (catalog.foreignKeys?.length || 0) > 0 || (catalog.relationalRules?.length || 0) > 0).map((catalog) => (
              <div key={catalog.id} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">{catalog.code}</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{language === 'vi' ? catalog.title : catalog.titleEn}</div>
                <div className="mt-3 space-y-2">
                  {(catalog.relationalRules || []).map((rule) => (
                    <div key={rule.id} className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{rule.title}</div>
                      <div className="text-slate-500 dark:text-slate-400">{rule.description}</div>
                    </div>
                  ))}
                  {(catalog.foreignKeys || []).map((fk) => (
                    <div key={`${fk.field}-${fk.targetCatalogId}`} className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {fk.field} {'->'} {fk.targetCatalogId}.{fk.targetField}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{language === 'vi' ? 'Cascade Filter: Địa lý' : 'Cascade Filter: Geography'}</h3>
            <select value={provinceCode} onChange={(e) => setProvinceCode(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm">
              {PROVINCES.map((province) => <option key={province.code} value={province.code}>{province.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/20">
                <div className="font-black text-blue-700 dark:text-blue-300">Tax Offices</div>
                <div className="mt-1 font-mono">{selectedProvince.taxOffices.join(', ')}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="font-black text-emerald-700 dark:text-emerald-300">KCB</div>
                <div className="mt-1 font-mono">{selectedProvince.healthcare.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{language === 'vi' ? 'Range Guard: Lương theo chức danh' : 'Range Guard: Job Salary Band'}</h3>
            <select value={jobCode} onChange={(e) => setJobCode(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm">
              {JOBS.map((job) => <option key={job.code} value={job.code}>{job.name}</option>)}
            </select>
            <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono" />
            <div className={`p-3 rounded-xl border text-xs ${salaryStatus === 'valid' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/20 text-amber-700 dark:text-amber-300'}`}>
              <div className="font-black flex items-center gap-2">
                {salaryStatus === 'valid' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {salaryStatus === 'valid' ? 'Hợp lệ trong dải lương' : salaryStatus === 'above' ? 'Cảnh báo vượt trần lương' : 'Cảnh báo dưới sàn lương'}
              </div>
              <div className="mt-1 font-mono">{selectedJob.grade}: {selectedJob.min.toLocaleString()} - {selectedJob.max.toLocaleString()} VND</div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">{language === 'vi' ? 'Blocking Rule: Bàn giao tài sản' : 'Blocking Rule: Asset Handover'}</h3>
            <select value={assetStatus} onChange={(e) => setAssetStatus(e.target.value as 'Returned' | 'Issued' | 'Lost')} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm">
              <option value="Returned">Returned</option>
              <option value="Issued">Issued</option>
              <option value="Lost">Lost</option>
            </select>
            <div className={`p-3 rounded-xl border text-xs ${canCloseOffboarding ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
              <div className="font-black flex items-center gap-2">
                {canCloseOffboarding ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {canCloseOffboarding ? 'Cho phép hoàn tất LIFE-07' : 'Chặn hoàn tất LIFE-07'}
              </div>
              <div className="mt-1">{canCloseOffboarding ? 'Tài sản đã bàn giao đủ.' : 'Còn tài sản chưa bàn giao hoặc mất, cần xử lý trước quyết toán.'}</div>
            </div>
          </div>
        </div>
      )}

      <CatalogDataInspectorModal catalog={inspectingCatalog} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDarkMode={isDarkMode} />
    </div>
  )
}
