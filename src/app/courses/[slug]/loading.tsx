export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-600 rounded" />
                <div className="h-5 w-24 bg-gray-600 rounded" />
              </div>
              <div className="h-10 bg-gray-600 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6" />
              <div className="flex gap-3">
                <div className="h-4 w-12 bg-gray-600 rounded" />
                <div className="h-4 w-28 bg-gray-600 rounded" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-gray-700 overflow-hidden">
                <div className="aspect-video bg-gray-600" />
                <div className="p-6 space-y-3">
                  <div className="h-8 w-24 bg-gray-600 rounded" />
                  <div className="h-10 bg-gray-600 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
