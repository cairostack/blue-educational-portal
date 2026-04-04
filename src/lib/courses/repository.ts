/**
 * Course repository — data-access abstraction layer.
 *
 * Backed by Strapi v4 (https://admin-blue-educational.com/api).
 * Falls back to local mock data when STRAPI_BASE_URL is not set,
 * enabling development without a live API.
 *
 * Required env vars (server-only, set in .env.local):
 *   STRAPI_BASE_URL   — Strapi API base, e.g. https://admin-blue-educational.com/api
 *   STRAPI_API_TOKEN  — (optional) API token if public reads require auth
 */

import type { Course } from "@/types/course"
import { fetchCourses, fetchCourseBySlug } from "@/lib/strapi/client"
import { COURSES } from "@/data/courses"

export interface CourseFilters {
  category?: string
  level?: string
  search?: string
  maxPrice?: number
  minRating?: number
}

export interface CourseRepository {
  getCourses(filters?: CourseFilters): Promise<Course[]>
  getCourseBySlug(slug: string): Promise<Course | null>
  getFeaturedCourses(limit?: number): Promise<Course[]>
  getBestsellerCourses(limit?: number): Promise<Course[]>
  getCoursesByIds(ids: string[]): Promise<Course[]>
}

/** True when a Strapi base URL is configured */
const USE_STRAPI = Boolean(process.env.STRAPI_API_URL ?? process.env.STRAPI_BASE_URL)

// ── Local fallback (development / no API configured) ──────────────────────

function filterLocal(courses: Course[], filters?: CourseFilters): Course[] {
  let result = courses

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    )
  }
  if (filters?.category && filters.category !== "All Categories") {
    result = result.filter((c) => c.category === filters.category)
  }
  if (filters?.level && filters.level !== "All Levels") {
    result = result.filter((c) => c.level === filters.level)
  }
  if (filters?.maxPrice !== undefined) {
    result = result.filter((c) => c.price <= filters.maxPrice!)
  }
  if (filters?.minRating !== undefined) {
    result = result.filter((c) => c.rating >= filters.minRating!)
  }

  return result
}

// ── Repository implementation ─────────────────────────────────────────────

export const courseRepository: CourseRepository = {
  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    if (!USE_STRAPI) {
      return filterLocal(COURSES, filters)
    }

    const courses = await fetchCourses({
      search: filters?.search,
      category: filters?.category,
      level: filters?.level,
    })

    // price/rating filters are not in Strapi query — apply locally
    let result = courses
    if (filters?.maxPrice !== undefined) {
      result = result.filter((c) => c.price <= filters.maxPrice!)
    }
    if (filters?.minRating !== undefined) {
      result = result.filter((c) => c.rating >= filters.minRating!)
    }
    return result
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (!USE_STRAPI) {
      return COURSES.find((c) => c.slug === slug) ?? null
    }
    return fetchCourseBySlug(slug)
  },

  async getFeaturedCourses(limit = 4): Promise<Course[]> {
    if (!USE_STRAPI) {
      return COURSES.filter((c) => c.isFeatured).slice(0, limit)
    }
    const courses = await fetchCourses({ featured: true })
    return courses.slice(0, limit)
  },

  async getBestsellerCourses(limit = 4): Promise<Course[]> {
    if (!USE_STRAPI) {
      return COURSES.filter((c) => c.isBestseller).slice(0, limit)
    }
    const courses = await fetchCourses({ bestseller: true })
    return courses.slice(0, limit)
  },

  async getCoursesByIds(ids: string[]): Promise<Course[]> {
    if (!USE_STRAPI) {
      return COURSES.filter((c) => ids.includes(c.id))
    }
    return fetchCourses({ ids })
  },
}
