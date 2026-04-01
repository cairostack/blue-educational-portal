import { notFound } from "next/navigation"
import Image from "next/image"
import { courseRepository } from "@/lib/courses/repository"
import {
  formatPrice,
  formatStudentCount,
  formatRating,
  getCourseDurationHours,
} from "@/lib/courses/helpers"
import StarRating from "@/components/courses/StarRating"
import PurchaseButton from "@/components/courses/PurchaseButton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle2,
  Users,
  Clock,
  Globe,
  BarChart2,
  PlayCircle,
  ChevronRight,
  Star,
} from "lucide-react"


export default async function CourseDetailPage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params
  const course = await courseRepository.getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const totalLessons = course.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {course.isBestseller && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    Bestseller
                  </span>
                )}
                {course.isFeatured && (
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                <Badge variant="secondary" className="text-xs">
                  {course.category}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">{course.shortDescription}</p>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap text-sm">
                <span className="font-bold text-yellow-400 text-base">
                  {formatRating(course.rating)}
                </span>
                <StarRating rating={course.rating} size="sm" />
                <span className="text-gray-400">({course.reviewCount.toLocaleString()} ratings)</span>
                <span className="text-gray-300">
                  {formatStudentCount(course.studentCount)}
                </span>
              </div>

              {/* Instructor */}
              <p className="text-sm text-gray-300">
                Created by{" "}
                <span className="text-blue-400 font-medium">{course.instructor.name}</span>
                {" — "}{course.instructor.title}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" />
                  {course.level}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {getCourseDurationHours(course)}
                </span>
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  {course.language}
                </span>
              </div>
            </div>

            {/* Right: sticky sidebar card (desktop) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-white text-gray-900 shadow-xl overflow-hidden sticky top-24">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayCircle className="w-14 h-14 text-white opacity-90" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                    {course.originalPrice && (
                      <span className="text-green-600 text-sm font-semibold">
                        {Math.round(
                          ((course.originalPrice - course.price) / course.originalPrice) * 100
                        )}
                        % off
                      </span>
                    )}
                  </div>
                  <PurchaseButton
                    courseId={course.id}
                    courseSlug={course.slug}
                    price={course.price}
                  />
                  <p className="text-xs text-gray-400 text-center">30-Day Money-Back Guarantee</p>
                  <Separator />
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {getCourseDurationHours(course)} of on-demand video
                    </li>
                    <li className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-gray-400" />
                      {totalLessons} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      {course.language}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      Full lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">What you&apos;ll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {course.requirements.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Course content */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Course Content</h2>
              <p className="text-sm text-gray-500 mb-5">
                {course.sections.length} sections &bull; {totalLessons} lessons &bull;{" "}
                {getCourseDurationHours(course)}
              </p>
              <div className="space-y-3">
                {course.sections.map((section) => (
                  <details key={section.id} className="group border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="font-semibold text-sm text-gray-800">{section.title}</span>
                      <span className="text-xs text-gray-500">
                        {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                      </span>
                    </summary>
                    <ul className="divide-y divide-gray-100">
                      {section.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex items-center justify-between px-4 py-3 text-sm text-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{lesson.title}</span>
                            {lesson.isPreview && (
                              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                                Preview
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {Math.round(lesson.duration / 60)} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{course.description}</p>
            </section>

            {/* Instructor */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Your Instructor</h2>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                  <AvatarFallback>
                    {course.instructor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900">{course.instructor.name}</h3>
                  <p className="text-sm text-blue-600">{course.instructor.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      {course.instructor.rating} Rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formatStudentCount(course.instructor.totalStudents)}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      {course.instructor.totalCourses} Courses
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pt-1">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Mobile sidebar */}
          <div className="lg:hidden">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {formatPrice(course.price)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-gray-400 line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>
                <PurchaseButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  price={course.price}
                />
                <p className="text-xs text-gray-400 text-center">30-Day Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

