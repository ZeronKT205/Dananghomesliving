export default function AdminLoading() {
  return (
    <div className="animate-fade-in flex flex-col gap-5 p-4 lg:p-6">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-72 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-slate-100 bg-white p-4 shadow-xs flex flex-col justify-between">
            <div className="h-8 w-8 rounded-md bg-slate-100 animate-pulse" />
            <div className="h-7 w-20 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 rounded-xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="flex-1 rounded-lg bg-slate-50 animate-pulse" />
        </div>
        <div className="h-80 rounded-xl border border-slate-100 bg-white p-5 shadow-xs flex flex-col gap-4">
          <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="flex-1 rounded-lg bg-slate-50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
