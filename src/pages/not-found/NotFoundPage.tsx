import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'
import { useAuth } from '../../features/authentication/model/session'

export const NotFoundPage: React.FC = () => {
  const { status } = useAuth()
  const destination = status === 'authenticated' ? '/employee-lifecycle' : '/login'
  const buttonLabel = status === 'authenticated' ? 'Về trang quản trị' : 'Về trang đăng nhập'

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-slate-50 px-4 py-12 text-slate-800">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50 text-[#174d70] ring-1 ring-inset ring-sky-100">
          <FileQuestion className="h-10 w-10" strokeWidth={1.75} />
        </div>

        <span className="mt-6 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-600">
          MÃ LỖI 404
        </span>

        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Không tìm thấy trang yêu cầu
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được thay đổi cấu trúc trong hệ thống HRM SOP Knowledge.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>

          <Link
            to={destination}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#174d70] px-5 text-sm font-bold text-white transition hover:bg-[#113e5b]"
          >
            <Home className="h-4 w-4" />
            {buttonLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}
