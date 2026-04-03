/**
 * Strapi v4 response envelope types.
 *
 * Strapi v4 wraps every entity in { id, attributes: {...} }.
 * Relations are wrapped in { data: StrapiEntity | StrapiEntity[] }.
 * Media files have a `url` field (relative) inside attributes.
 */

export interface StrapiMeta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export interface StrapiEntity<T> {
  id: number
  attributes: T
}

/** Single-item response */
export interface StrapiResponse<T> {
  data: StrapiEntity<T>
  meta: Record<string, unknown>
}

/** Collection response */
export interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[]
  meta: StrapiMeta
}

/** Single relation */
export interface StrapiRelation<T> {
  data: StrapiEntity<T> | null
}

/** Many relation */
export interface StrapiRelationMany<T> {
  data: StrapiEntity<T>[]
}

// ── Media ──────────────────────────────────────────────────────────────────
export interface StrapiMediaAttributes {
  url: string
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

// ── Domain attribute shapes ────────────────────────────────────────────────

export interface StrapiLessonAttributes {
  slug: string
  title: string
  description: string
  duration: number // seconds
  videoUrl?: string
  isPreview: boolean
  order: number
}

export interface StrapiSectionAttributes {
  title: string
  order: number
  lessons: StrapiRelationMany<StrapiLessonAttributes>
}

export interface StrapiInstructorAttributes {
  name: string
  bio: string
  title: string
  rating: number
  totalStudents: number
  totalCourses: number
  avatar: StrapiRelation<StrapiMediaAttributes>
}

export interface StrapiCategoryAttributes {
  name: string
  slug?: string
}

export interface StrapiCourseAttributes {
  slug: string
  title: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  studentCount: number
  level: "Beginner" | "Intermediate" | "Advanced"
  language: string
  lastUpdated: string
  duration: number // total seconds
  lessonCount: number
  whatYouLearn: string[]
  requirements: string[]
  isBestseller?: boolean
  isFeatured?: boolean
  hidden?: boolean
  previewVideo?: string
  tags?: string[]
  instructor: StrapiRelation<StrapiInstructorAttributes>
  categories: StrapiRelationMany<StrapiCategoryAttributes>
  cover: StrapiRelation<StrapiMediaAttributes>
  sections: StrapiRelationMany<StrapiSectionAttributes>
}
