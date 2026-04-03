export default function CoursesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="mb-6 flex gap-3">
        <div className="h-10 w-56 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Count skeleton */}
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-6" />

      {/* Course grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
