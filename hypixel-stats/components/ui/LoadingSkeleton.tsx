// Loading skeleton UI components

export function PlayerHeaderSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar skeleton */}
        <div className="skeleton h-24 w-24 flex-shrink-0 rounded-2xl sm:h-32 sm:w-32" />

        <div className="flex-1 space-y-3">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="mt-4 flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-1">
                <div className="skeleton h-6 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-7 w-20 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="skeleton h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="skeleton h-5 w-40 rounded mb-6" />
      <div className="skeleton h-56 w-full rounded-xl" />
    </div>
  );
}

export function TabSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="skeleton h-9 w-24 rounded-lg flex-shrink-0" />
      ))}
    </div>
  );
}
