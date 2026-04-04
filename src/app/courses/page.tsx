import type { Metadata } from "next"
import { Suspense } from "react"
import { courseRepository } from "@/lib/courses/repository"
import CourseCard from "@/components/courses/CourseCard"
import CourseFilters from "@/components/courses/CourseFilters"

export const metadata: Metadata = {
  title: "All Courses | Blue Educational",
  description: "Browse expert-led dentistry courses — anatomy, radiology, endodontics, prosthodontics, and more.",
}


export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : undefined
  const category = typeof params.category === "string" ? params.category : undefined
  const level = typeof params.level === "string" ? params.level : undefined

  const courses = await courseRepository.getCourses({ search: q, category, level })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
        <p className="text-gray-500 mt-1">Expand your skills with expert-led courses</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
          <CourseFilters />
        </Suspense>
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing <span className="font-semibold text-gray-900">{courses.length}</span>{" "}
        {courses.length === 1 ? "course" : "courses"}
        {q && (
          <>
            {" "}
            for{" "}
            <span className="font-semibold text-gray-900">&ldquo;{q}&rdquo;</span>
          </>
        )}
        {category && (
          <>
            {" "}
            in <span className="font-semibold text-gray-900">{category}</span>
          </>
        )}
        {level && (
          <>
            {" "}
            &mdash; <span className="font-semibold text-gray-900">{level}</span>
          </>
        )}
      </p>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-2xl font-semibold text-gray-700 mb-2">No courses found</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
