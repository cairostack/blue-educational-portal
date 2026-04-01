import Link from "next/link"
import { courseRepository } from "@/lib/courses/repository"
import CourseCard from "@/components/courses/CourseCard"
import {
  Code2,
  Brain,
  Cloud,
  Palette,
  Megaphone,
  Terminal,
  TrendingUp,
  Users,
  BookOpen,
  Star,
} from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Web Development": Code2,
  "Data Science": Brain,
  "Cloud Computing": Cloud,
  Design: Palette,
  Marketing: Megaphone,
  Programming: Terminal,
}

const STATS = [
  { icon: Users, label: "Students", value: "10M+" },
  { icon: BookOpen, label: "Courses", value: "1,000+" },
  { icon: TrendingUp, label: "Instructors", value: "500+" },
  { icon: Star, label: "Avg Rating", value: "4.8★" },
]

const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Cloud Computing",
  "Design",
  "Marketing",
  "Programming",
]

export default async function HomePage() {
  const [featuredCourses, bestsellerCourses] = await Promise.all([
    courseRepository.getFeaturedCourses(4),
    courseRepository.getBestsellerCourses(4),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Learn Without Limits
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Discover thousands of expert-led courses in web development, data science, design, and
            more. Start learning today and transform your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/courses"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-7 h-7 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-gray-500 mt-1">Handpicked top courses just for you</p>
            </div>
            <Link
              href="/courses"
              className="text-blue-600 font-medium hover:underline hidden sm:block"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Categories</h2>
            <p className="text-gray-500 mt-2">Find the perfect course in your area of interest</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category] ?? BookOpen
              return (
                <Link
                  key={category}
                  href={`/courses?category=${encodeURIComponent(category)}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-700 transition-colors">
                    {category}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bestseller Courses */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bestsellers</h2>
              <p className="text-gray-500 mt-1">Our most popular courses based on enrollment</p>
            </div>
            <Link
              href="/courses"
              className="text-blue-600 font-medium hover:underline hidden sm:block"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join millions of learners already growing with Blue Educational. Get unlimited access to
            our course library.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
