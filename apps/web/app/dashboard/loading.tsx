export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-pulse">
      {/* ─── Header Skeleton ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b-4 border-foreground/20">
        <div>
          <div className="h-16 w-64 bg-foreground/10 rounded-lg mb-2" />
          <div className="h-6 w-48 bg-foreground/10 rounded-lg" />
        </div>
        <div className="h-14 w-40 bg-foreground/10 rounded-xl hidden sm:block" />
      </div>

      {/* ─── Stats Cards Skeleton ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-4 border-foreground/20 rounded-2xl p-6 bg-white">
            <div className="h-12 w-12 bg-foreground/10 rounded-xl mb-4" />
            <div className="h-10 w-24 bg-foreground/10 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-foreground/10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* ─── Quick Actions Skeleton ─── */}
      <div>
        <div className="h-8 w-48 bg-foreground/10 rounded-lg mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white border-4 border-foreground/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-foreground/10" />
              <div className="h-5 w-24 bg-foreground/10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
