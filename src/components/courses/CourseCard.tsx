import Link from "next/link"
import Image from "next/image"
import type { Course } from "@/types/course"
import { formatPrice, formatStudentCount, formatDuration, formatRating } from "@/lib/courses/helpers"
import StarRating from "./StarRating"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex gap-1">
            {course.isBestseller && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">
                Bestseller
              </span>
            )}
            {course.isFeatured && !course.isBestseller && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-gray-500">{course.instructor.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-yellow-600">{formatRating(course.rating)}</span>
            <StarRating rating={course.rating} size="sm" />
            <span className="text-xs text-gray-500">({course.reviewCount.toLocaleString()})</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatStudentCount(course.studentCount)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(course.duration)}
            </span>
          </div>

          {/* Level */}
          <div>
            <Badge variant="secondary" className="text-xs">
              {course.level}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(course.price)}</span>
            {course.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(course.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
