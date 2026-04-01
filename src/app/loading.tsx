export default function Loading() {
  return (
    <div className="flex flex-col min-h-[60vh] items-center justify-center gap-6">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

      {/* Skeleton cards */}
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
