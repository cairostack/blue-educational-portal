import type { Course } from "@/types/course"

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  }
  return `${minutes} min`
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatStudentCount(count: number): string {
  if (count >= 1_000_000) {
    const m = (count / 1_000_000).toFixed(1).replace(/\.0$/, "")
    return `${m}M students`
  }
  if (count >= 1_000) {
    const k = (count / 1_000).toFixed(0)
    return `${k}K students`
  }
  return `${count} students`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getTotalLessons(course: Course): number {
  return course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
}

export function getCourseDurationHours(course: Course): string {
  const hours = Math.round(course.duration / 3600)
  return `${hours} hour${hours !== 1 ? "s" : ""} total`
}
