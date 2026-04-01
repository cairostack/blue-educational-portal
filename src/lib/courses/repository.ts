/**
 * Course repository — data-access abstraction layer.
 *
 * Currently backed by local dummy data.
 * To switch to Strapi: replace the implementations below with
 * `fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses`, ...)`
 * calls and map the Strapi response to the Course type.
 */

import type { Course } from "@/types/course"
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

// Simulate async data fetching (replace body with real API calls)
async function simulateDelay<T>(data: T): Promise<T> {
  return data
}

export const courseRepository: CourseRepository = {
  async getCourses(filters?: CourseFilters): Promise<Course[]> {
    let courses = COURSES

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q)
      )
    }

    if (filters?.category && filters.category !== "All Categories") {
      courses = courses.filter((c) => c.category === filters.category)
    }

    if (filters?.level && filters.level !== "All Levels") {
      courses = courses.filter((c) => c.level === filters.level)
    }

    if (filters?.maxPrice !== undefined) {
      courses = courses.filter((c) => c.price <= filters.maxPrice!)
    }

    if (filters?.minRating !== undefined) {
      courses = courses.filter((c) => c.rating >= filters.minRating!)
    }

    return simulateDelay(courses)
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const course = COURSES.find((c) => c.slug === slug) ?? null
    return simulateDelay(course)
  },

  async getFeaturedCourses(limit = 4): Promise<Course[]> {
    return simulateDelay(COURSES.filter((c) => c.isFeatured).slice(0, limit))
  },

  async getBestsellerCourses(limit = 4): Promise<Course[]> {
    return simulateDelay(COURSES.filter((c) => c.isBestseller).slice(0, limit))
  },

  async getCoursesByIds(ids: string[]): Promise<Course[]> {
    return simulateDelay(COURSES.filter((c) => ids.includes(c.id)))
  },
}
