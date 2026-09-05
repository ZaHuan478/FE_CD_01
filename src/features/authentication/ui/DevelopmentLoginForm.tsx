import React from 'react'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Layers3,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UsersRound
} from 'lucide-react'


import { useDevelopmentLogin } from '../hooks/useDevelopmentLogin'
import { DEMO_GROUPS, getRoleCode, getAccountIdentifier } from '../model/developmentAccounts'
import { Button } from '../../../shared/ui/atoms/Button'
import { Input } from '../../../shared/ui/atoms/Input'

export const DevelopmentLoginForm: React.FC = () => {
  const { accounts, accountsLoading, accountsError, identifier, password, showPassword, setShowPassword, submitting, loginError, sortedAccounts, selectedAccount, loadAccounts, handleIdentifierChange, handlePasswordChange, handleSelectDemoAccount, handleSubmit } = useDevelopmentLogin()

  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Brand, System Intro, Access Control Features */}
        <div className="flex flex-col justify-between bg-[#174d70] p-6 text-white sm:p-10 lg:p-12">
          {/* Header Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/20">
                <Layers3 className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-black tracking-tight text-white">HRM SOP Knowledge</p>
                <p className="text-xs font-medium text-sky-100">Nền tảng tri thức nghiệp vụ nhân sự</p>
              </div>
            </div>

            {/* Main Value Proposition */}
            <div className="mt-10 lg:mt-14">
              <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px]">
                Truy cập đúng quy trình theo vai trò của bạn
              </h1>
              <p className="mt-3.5 text-sm leading-6 text-sky-100">
                Cổng tra cứu quy trình nghiệp vụ SOP, danh mục dùng chung và chính sách nhân sự chuẩn hóa dành cho doanh nghiệp.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-bold text-white">Phân quyền theo vị trí công việc</p>
                    <p className="text-xs leading-5 text-sky-100">Menu và dữ liệu hiển thị tự động thích ứng theo trách nhiệm được giao.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-bold text-white">Phạm vi module rõ ràng</p>
                    <p className="text-xs leading-5 text-sky-100">Chỉ hiển thị các phân hệ và nghiệp vụ mà tài khoản có thẩm quyền truy cập.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-6 sm:mt-12">
            <div>
              <p className="text-2xl font-black text-white">9</p>
              <p className="mt-0.5 text-xs text-sky-100">Vai trò demo</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">9</p>
              <p className="mt-0.5 text-xs text-sky-100">Phân hệ HRM</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">RBAC</p>
              <p className="mt-0.5 text-xs text-sky-100">Kiểm soát bảo mật</p>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form & Quick Select */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#174d70] ring-1 ring-inset ring-sky-100">
              <ShieldCheck className="h-6 w-6" strokeWidth={2} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
              Đăng nhập hệ thống
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              Nhập email hoặc tên đăng nhập cùng mật khẩu để vào hệ thống.
            </p>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="demo-account" className="text-xs font-bold text-slate-700">
                  Chọn nhanh tài khoản demo
                </label>
                <span className="text-[11px] font-semibold text-slate-500">Mật khẩu: 123456</span>
              </div>

              <div className="relative">
                <UsersRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                <select
                  id="demo-account"
                  value={selectedAccount ? getAccountIdentifier(selectedAccount) : ''}
                  onChange={(event) => handleSelectDemoAccount(event.target.value)}
                  disabled={accountsLoading || Boolean(accountsError) || submitting}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-9 text-xs font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-[#174d70] focus:ring-3 focus:ring-[#174d70]/15 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <option value="">
                    {accountsLoading ? 'Đang tải tài khoản...' : 'Chọn vai trò để điền email'}
                  </option>
                  {DEMO_GROUPS.map((group) => (
                    <optgroup key={group.title} label={group.title}>
                      {sortedAccounts
                        .filter((account) => group.roles.includes(getRoleCode(account)))
                        .map((account) => (
                          <option key={account.id} value={getAccountIdentifier(account)}>
                            {account.roleTitle} - {getAccountIdentifier(account)}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {selectedAccount && (
                <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5">
                  <p className="truncate text-xs font-bold text-slate-900">{selectedAccount.fullName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-600">{selectedAccount.roleTitle}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedAccount.modules.map((module) => (
                      <span key={module.id} className="rounded-md bg-white px-1.5 py-1 font-mono text-[9px] font-black uppercase text-[#174d70] ring-1 ring-inset ring-sky-200">
                        {module.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {accountsError && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900" role="alert">
                  <span>{accountsError}</span>
                  <Button
                    type="button"
                    onClick={() => void loadAccounts()}
                    className="flex shrink-0 items-center gap-1 font-bold hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                    Tải lại
                  </Button>
                </div>
              )}

              {!accountsLoading && !accountsError && accounts.length === 0 && (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] text-slate-600">
                  Chưa có tài khoản demo. Bạn vẫn có thể nhập tài khoản được cấp bên dưới.
                </p>
              )}
            </div>

            {/* Actual Login Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              {/* Identifier field */}
              <div className="space-y-1.5">
                <label htmlFor="login-identifier" className="block text-xs font-bold text-slate-700">
                  Email hoặc tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                  <Input
                    id="login-identifier"
                    name="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => handleIdentifierChange(e.target.value)}
                    autoComplete="username"
                    placeholder="vd: admin.demo@hrm.local hoặc demo-admin"
                    disabled={submitting}
                    aria-invalid={Boolean(loginError && !identifier.trim())}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 text-xs font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#174d70] focus:ring-3 focus:ring-[#174d70]/15 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu của bạn"
                    disabled={submitting}
                    aria-invalid={Boolean(loginError && !password)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-xs font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#174d70] focus:ring-3 focus:ring-[#174d70]/15 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#174d70]"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
                  </Button>
                </div>
              </div>

              {/* Error alert */}
              {loginError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
                  <span className="font-medium leading-5">{loginError}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#174d70] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#113e5b] active:translate-y-px disabled:cursor-wait disabled:bg-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d70]"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
