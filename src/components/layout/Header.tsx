"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BookOpen } from "lucide-react"

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <BookOpen className="w-6 h-6" />
            <span>Blue Educational</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/courses"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/my-courses"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              My Courses
            </Link>
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link
              href="/courses"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/my-courses"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              My Courses
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 text-center transition-colors"
            >
              Browse All Courses
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
