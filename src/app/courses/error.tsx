"use client"

import Link from "next/link"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isAuth = error.message.includes("401") || error.message.includes("403")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load courses</h2>
      <p className="text-gray-500 mb-2 max-w-md mx-auto">
        {isAuth
          ? "The API returned an authentication error. Please configure STRAPI_API_TOKEN."
          : "There was a problem fetching courses from the server."}
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-red-400 font-mono mb-6 max-w-lg mx-auto break-all">
          {error.message}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
