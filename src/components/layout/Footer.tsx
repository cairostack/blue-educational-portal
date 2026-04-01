import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Blue Educational</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering learners worldwide with high-quality online education. Learn at your own
              pace, anytime, anywhere.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/my-courses"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  My Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {["Web Development", "Data Science", "Design", "Cloud Computing", "Marketing"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/courses?category=${encodeURIComponent(cat)}`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Blue Educational. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
