// Loading skeleton UI components

export function PlayerHeaderSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-[var(--surface-2)] animate-pulse sm:h-32 sm:w-32" />

        <div className="flex-1 space-y-3">
          <div className="h-4 w-20 rounded bg-[var(--surface-2)] animate-pulse" />
          <div className="h-8 w-48 rounded bg-[var(--surface-2)] animate-pulse" />
          <div className="h-4 w-32 rounded bg-[var(--surface-2)] animate-pulse" />

          <div className="mt-4 flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-1">
                <div className="h-6 w-16 rounded bg-[var(--surface-2)] animate-pulse" />
                <div className="h-3 w-12 rounded bg-[var(--surface-2)] animate-pulse" />
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
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-[var(--surface-2)] animate-pulse" />
              <div className="h-7 w-20 rounded bg-[var(--surface-2)] animate-pulse" />
              <div className="h-3 w-16 rounded bg-[var(--surface-2)] animate-pulse" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-[var(--surface-2)] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="mb-6 h-5 w-40 rounded bg-[var(--surface-2)] animate-pulse" />
      <div className="h-56 w-full rounded-xl bg-[var(--surface-2)] animate-pulse" />
    </div>
  );
}

export function TabSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="h-9 w-24 flex-shrink-0 rounded-lg bg-[var(--surface-2)] animate-pulse"
        />
      ))}
    </div>
  );
}