import Link from "next/link"
import { BookOpen, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6">
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s
          get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
