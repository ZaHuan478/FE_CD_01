import React from 'react'
import { Layers3, LoaderCircle } from 'lucide-react'

interface FullPageLoadingProps {
  message?: string
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = 'Đang xác thực phiên làm việc...'
}) => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-slate-50 px-4 text-slate-800">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174d70] text-white shadow-lg shadow-[#174d70]/20 ring-4 ring-[#174d70]/10">
          <Layers3 className="h-7 w-7" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900">HRM SOP Knowledge</h2>
          <p className="mt-1 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#174d70]" />
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
