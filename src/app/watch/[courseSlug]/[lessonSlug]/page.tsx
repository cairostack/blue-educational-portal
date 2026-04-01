"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { COURSES } from "@/data/courses"
import { isPurchased, updateProgress, getPurchases } from "@/lib/purchases/store"
import type { Course, Lesson, Section } from "@/types/course"
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  ArrowLeft,
} from "lucide-react"

interface FlatLesson {
  lesson: Lesson
  section: Section
  globalIndex: number
}

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()

  const courseSlug = typeof params.courseSlug === "string" ? params.courseSlug : ""
  const lessonSlug = typeof params.lessonSlug === "string" ? params.lessonSlug : ""

  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [flatLessons, setFlatLessons] = useState<FlatLesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const found = COURSES.find((c) => c.slug === courseSlug) ?? null

    if (!found) {
      router.replace("/courses")
      return
    }

    if (!isPurchased(found.id)) {
      router.replace(`/courses/${courseSlug}`)
      return
    }

    // Build flat lessons list
    const flat: FlatLesson[] = []
    let idx = 0
    for (const section of found.sections) {
      for (const lesson of section.lessons) {
        flat.push({ lesson, section, globalIndex: idx })
        idx++
      }
    }
    setFlatLessons(flat)
    setCourse(found)

    // Determine current lesson
    const foundFlat = flat.find((f) => f.lesson.slug === lessonSlug)
    if (foundFlat) {
      setCurrentLesson(foundFlat.lesson)
      setCurrentIndex(foundFlat.globalIndex)
    } else if (flat.length > 0) {
      setCurrentLesson(flat[0].lesson)
      setCurrentIndex(0)
    }

    // Load completed lessons
    const purchases = getPurchases()
    const purchase = purchases.find((p) => p.courseId === found.id)
    if (purchase) {
      setCompletedLessons(new Set(purchase.completedLessons))
    }
  }, [courseSlug, lessonSlug, router])

  const navigateToLesson = useCallback(
    (flat: FlatLesson) => {
      router.push(`/watch/${courseSlug}/${flat.lesson.slug}`)
    },
    [courseSlug, router]
  )

  const markComplete = useCallback(() => {
    if (!course || !currentLesson) return
    const isCompleted = completedLessons.has(currentLesson.id)
    updateProgress(course.id, currentLesson.id, !isCompleted)
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      if (isCompleted) {
        next.delete(currentLesson.id)
      } else {
        next.add(currentLesson.id)
      }
      return next
    })
  }, [course, currentLesson, completedLessons])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      navigateToLesson(flatLessons[currentIndex - 1])
    }
  }, [currentIndex, flatLessons, navigateToLesson])

  const goToNext = useCallback(() => {
    if (currentIndex < flatLessons.length - 1) {
      navigateToLesson(flatLessons[currentIndex + 1])
    }
  }, [currentIndex, flatLessons, navigateToLesson])

  if (!mounted || !course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isCurrentCompleted = completedLessons.has(currentLesson.id)
  const videoUrl = currentLesson.videoUrl ?? course.previewVideo

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <Link
          href={`/my-courses`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">My Courses</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{course.title}</p>
        </div>
        {/* Progress indicator */}
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {completedLessons.size} / {flatLessons.length} completed
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video + info (main area) */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Video player */}
          <div className="bg-black flex items-center justify-center" style={{ minHeight: "400px" }}>
            {videoUrl ? (
              <video
                key={currentLesson.id}
                controls
                className="w-full max-h-[60vh] outline-none"
                poster={course.thumbnail}
              >
                <source src={videoUrl} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-500 py-16">
                <PlayCircle className="w-16 h-16 text-gray-700" />
                <p className="text-sm">No video available for this lesson</p>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
            <div className="max-w-3xl">
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-white mb-1">{currentLesson.title}</h1>
                  <p className="text-sm text-gray-400">{currentLesson.description}</p>
                </div>
                <button
                  onClick={markComplete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 ${
                    isCurrentCompleted
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCurrentCompleted ? "Completed" : "Mark Complete"}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  {currentIndex + 1} of {flatLessons.length}
                </span>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === flatLessons.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: lesson list */}
        <div className="w-80 bg-gray-950 border-l border-gray-800 overflow-y-auto hidden lg:flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-semibold text-sm text-white">Course Content</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.sections.map((section) => (
              <div key={section.id}>
                <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <ul className="divide-y divide-gray-800/50">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentLesson.slug
                    const isCompleted = completedLessons.has(lesson.id)
                    const flatLesson = flatLessons.find((f) => f.lesson.id === lesson.id)

                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => flatLesson && navigateToLesson(flatLesson)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                            isActive
                              ? "bg-blue-900/50 border-l-2 border-blue-500"
                              : "hover:bg-gray-900 border-l-2 border-transparent"
                          }`}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle
                                className={`w-4 h-4 ${
                                  isActive ? "text-blue-400" : "text-gray-600"
                                }`}
                              />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs leading-snug ${
                                isActive ? "text-white font-semibold" : "text-gray-400"
                              }`}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {Math.round(lesson.duration / 60)} min
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
