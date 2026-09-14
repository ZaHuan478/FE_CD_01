import React from 'react'

export const GuideSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Đang tải dữ liệu hướng dẫn...">
      {/* Hero Banner Skeleton */}
      <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      {/* Quick Start Path Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="grid gap-3 md:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-36 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          ))}
        </div>
      </div>

      {/* User Intent Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-200/70 dark:bg-slate-800" />
          ))}
        </div>
      </div>

      {/* Feature Map Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-40 rounded-xl bg-slate-200/70 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    </div>
  )
}
