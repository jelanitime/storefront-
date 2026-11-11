/** Grey placeholder shown for a split second while a page loads saved data. */
export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="animate-pulse py-6">
      <span className="sr-only">{label}</span>
      <div className="mb-4 h-8 w-64 max-w-full rounded-full bg-tile" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-square rounded-tile bg-tile" />
        ))}
      </div>
    </div>
  );
}
