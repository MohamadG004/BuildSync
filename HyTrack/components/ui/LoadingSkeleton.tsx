export function PlayerHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="h-24 w-24 flex-shrink-0 rounded-2xl skeleton sm:h-32 sm:w-32" />
        <div className="flex-1 space-y-3">
          <div className="h-3.5 w-16 rounded-full skeleton" />
          <div className="h-8 w-52 rounded-xl skeleton" />
          <div className="h-3 w-36 rounded-full skeleton" />
          <div className="mt-4 flex gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="h-5 w-16 rounded skeleton" />
                <div className="h-2.5 w-12 rounded-full skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border)] bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2.5">
              <div className="h-2.5 w-24 rounded-full skeleton" />
              <div className="h-7 w-20 rounded-lg skeleton" />
              <div className="h-2.5 w-16 rounded-full skeleton" />
            </div>
            <div className="h-9 w-9 rounded-xl skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="mb-1 h-4 w-36 rounded-full skeleton" />
      <div className="mb-5 h-3 w-64 rounded-full skeleton" />
      <div className="h-52 w-full rounded-xl skeleton" />
    </div>
  );
}

export function TabSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-9 w-24 flex-shrink-0 rounded-lg skeleton" />
      ))}
    </div>
  );
}