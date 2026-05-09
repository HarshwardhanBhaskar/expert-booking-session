export default function ExpertCardSkeleton() {
  return (
    <div className="premium-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 rounded-2xl shrink-0" />
          <div className="space-y-3">
            <div className="skeleton h-7 w-28 rounded-full" />
            <div className="skeleton h-5 w-40" />
          </div>
        </div>
        <div className="skeleton h-12 w-16 rounded-2xl" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-8/12" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>

      <div className="skeleton mt-6 h-12 w-full rounded-2xl" />
    </div>
  );
}
