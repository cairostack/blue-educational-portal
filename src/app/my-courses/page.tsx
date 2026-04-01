"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { COURSES } from "@/data/courses"
import { getPurchasedIds, getProgress } from "@/lib/purchases/store"
import { Progress } from "@/components/ui/progress"
import type { Course } from "@/types/course"
import { BookOpen, PlayCircle } from "lucide-react"

interface CourseWithProgress {
  course: Course
  progress: number
}

export default function MyCoursesPage() {
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseWithProgress[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const ids = getPurchasedIds()
    const purchased = COURSES.filter((c) => ids.includes(c.id))
    const withProgress = purchased.map((course) => {
      const totalLessons = course.sections.reduce(
        (sum, s) => sum + s.lessons.length,
        0
      )
      return {
        course,
        progress: getProgress(course.id, totalLessons),
      }
    })
    setCoursesWithProgress(withProgress)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white animate-pulse overflow-hidden">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (coursesWithProgress.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-500 mb-12">Track your learning progress</p>
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No courses yet</h2>
          <p className="text-gray-500 mb-8">
            You haven&apos;t enrolled in any courses yet. Explore our catalog to get started.
          </p>
          <Link
            href="/courses"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">
          {coursesWithProgress.length} course{coursesWithProgress.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesWithProgress.map(({ course, progress }) => {
          const firstLesson = course.sections[0]?.lessons[0]
          const continueHref = firstLesson
            ? `/watch/${course.slug}/${firstLesson.slug}`
            : `/courses/${course.slug}`

          return (
            <div
              key={course.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {progress === 100 && (
                  <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-green-600 px-3 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 gap-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500">{course.instructor.name}</p>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{progress}% complete</span>
                    <span>
                      {course.sections.reduce((sum, s) => sum + s.lessons.length, 0)} lessons
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* CTA */}
                <Link
                  href={continueHref}
                  className="mt-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  {progress === 0 ? "Start Learning" : progress === 100 ? "Watch Again" : "Continue Learning"}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
