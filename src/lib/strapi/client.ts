/**
 * Typed Strapi v4 API client — server-only.
 *
 * Environment variables (set in .env.local):
 *   STRAPI_API_URL    — Strapi API base URL (preferred), e.g. https://admin-blue-educational.com/api
 *   STRAPI_BASE_URL   — Alias for STRAPI_API_URL (legacy / backwards-compat)
 *   STRAPI_API_TOKEN  — Bearer token for authenticated requests (read-only)
 *
 * All vars are server-only (no NEXT_PUBLIC_ prefix) to keep the token out of
 * the client bundle. This file imports "server-only" to enforce that at build time.
 */

import "server-only"
import type { Course, Instructor, Lesson, Section } from "@/types/course"
import type {
  StrapiCollectionResponse,
  StrapiCourseAttributes,
  StrapiEntity,
  StrapiInstructorAttributes,
  StrapiLessonAttributes,
  StrapiSectionAttributes,
} from "./types"

// ── Config ─────────────────────────────────────────────────────────────────

const BASE_URL = (
  process.env.STRAPI_API_URL ??
  process.env.STRAPI_BASE_URL ??
  "https://admin-blue-educational.com/api"
).replace(/\/$/, "")

const API_TOKEN = process.env.STRAPI_API_TOKEN

/** Strip trailing /api to get the host for building media URLs */
const STRAPI_HOST = BASE_URL.replace(/\/api$/, "")

// ── Helpers ────────────────────────────────────────────────────────────────

/** Prefix relative Strapi media paths with the host URL */
function mediaUrl(path: string | undefined | null): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${STRAPI_HOST}${path}`
}

function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {}
  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`
  }
  return headers
}

/**
 * Build a query string without percent-encoding bracket characters in keys,
 * which is required by Strapi's qs-based query parser.
 */
function toQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&")
}

// ── Low-level fetch ─────────────────────────────────────────────────────────

export class StrapiAuthError extends Error {
  constructor(public readonly status: number) {
    super(
      `Strapi responded with ${status}. ` +
        "Set STRAPI_API_TOKEN in .env.local with a valid Strapi API token " +
        "and ensure the token has read access to the courses collection."
    )
    this.name = "StrapiAuthError"
  }
}

interface FetchOptions {
  /** ISR revalidate seconds (default: 3600) */
  revalidate?: number | false
  /** Next.js cache tags for on-demand revalidation */
  tags?: string[]
}

async function strapiGet<T>(
  path: string,
  params: Record<string, string>,
  opts: FetchOptions = {}
): Promise<T> {
  const qs = toQueryString(params)
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`

  const res = await fetch(url, {
    headers: buildHeaders(),
    // Next.js extended fetch options for ISR
    next: {
      revalidate: opts.revalidate ?? 3600,
      tags: opts.tags ?? ["courses"],
    },
  })

  if (res.status === 401 || res.status === 403) {
    throw new StrapiAuthError(res.status)
  }

  if (!res.ok) {
    throw new Error(`Strapi API error ${res.status} — ${url}`)
  }

  return res.json() as Promise<T>
}

// ── Entity mappers ──────────────────────────────────────────────────────────

function mapLesson(entity: StrapiEntity<StrapiLessonAttributes>): Lesson {
  const a = entity.attributes
  return {
    id: String(entity.id),
    slug: a.slug ?? String(entity.id),
    title: a.title ?? "",
    description: a.description ?? "",
    duration: a.duration ?? 0,
    videoUrl: a.videoUrl ?? undefined,
    isPreview: a.isPreview ?? false,
    order: a.order ?? 0,
  }
}

function mapSection(entity: StrapiEntity<StrapiSectionAttributes>): Section {
  const a = entity.attributes
  const lessons = (a.lessons?.data ?? [])
    .map((l) => mapLesson(l as StrapiEntity<StrapiLessonAttributes>))
    .sort((a, b) => a.order - b.order)
  return {
    id: String(entity.id),
    title: a.title ?? "",
    order: a.order ?? 0,
    lessons,
  }
}

function mapInstructor(entity: StrapiEntity<StrapiInstructorAttributes>): Instructor {
  const a = entity.attributes
  const avatarPath = a.avatar?.data?.attributes?.url
  return {
    id: String(entity.id),
    name: a.name ?? "",
    bio: a.bio ?? "",
    title: a.title ?? "",
    rating: a.rating ?? 0,
    totalStudents: a.totalStudents ?? 0,
    totalCourses: a.totalCourses ?? 0,
    avatar: mediaUrl(avatarPath),
  }
}

export function mapCourse(entity: StrapiEntity<StrapiCourseAttributes>): Course {
  const a = entity.attributes

  const coverPath = a.cover?.data?.attributes?.url
  const thumbnail = mediaUrl(coverPath)

  const instructor: Instructor = a.instructor?.data
    ? mapInstructor(a.instructor.data as StrapiEntity<StrapiInstructorAttributes>)
    : {
        id: "unknown",
        name: "Unknown Instructor",
        bio: "",
        title: "",
        rating: 0,
        totalStudents: 0,
        totalCourses: 0,
        avatar: "",
      }

  const category =
    (a.categories?.data ?? [])[0]?.attributes?.name ?? "General"

  const sections = (a.sections?.data ?? [])
    .map((s) => mapSection(s as StrapiEntity<StrapiSectionAttributes>))
    .sort((a, b) => a.order - b.order)

  return {
    id: String(entity.id),
    slug: a.slug ?? String(entity.id),
    title: a.title ?? "",
    description: a.description ?? "",
    shortDescription: a.shortDescription ?? "",
    thumbnail,
    previewVideo: a.previewVideo ?? undefined,
    instructor,
    price: a.price ?? 0,
    originalPrice: a.originalPrice ?? undefined,
    rating: a.rating ?? 0,
    reviewCount: a.reviewCount ?? 0,
    studentCount: a.studentCount ?? 0,
    level: a.level ?? "Beginner",
    category,
    tags: a.tags ?? [],
    language: a.language ?? "English",
    lastUpdated: a.lastUpdated ?? "",
    duration: a.duration ?? 0,
    lessonCount: a.lessonCount ?? 0,
    sections,
    whatYouLearn: a.whatYouLearn ?? [],
    requirements: a.requirements ?? [],
    isBestseller: a.isBestseller ?? false,
    isFeatured: a.isFeatured ?? false,
  }
}

// ── Populate presets ────────────────────────────────────────────────────────

/** Shallow populate for listing pages (no sections/lessons) */
const LIST_POPULATE: Record<string, string> = {
  "populate[instructor][populate]": "avatar",
  "populate[categories]": "*",
  "populate[cover]": "*",
}

/** Deep populate for detail page (includes sections → lessons) */
const DETAIL_POPULATE: Record<string, string> = {
  ...LIST_POPULATE,
  "populate[sections][populate][lessons]": "*",
}

// ── Public API ──────────────────────────────────────────────────────────────

export interface CourseFetchFilters {
  search?: string
  category?: string
  level?: string
  featured?: boolean
  bestseller?: boolean
  ids?: string[]
}

/**
 * Fetch courses from Strapi with optional filters.
 * Results are ISR-cached for 1 hour and tagged with "courses".
 */
export async function fetchCourses(
  filters: CourseFetchFilters = {},
  opts: FetchOptions = {}
): Promise<Course[]> {
  const params: Record<string, string> = {
    ...LIST_POPULATE,
    "pagination[pageSize]": "100",
    "pagination[page]": "1",
    "sort[0]": "createdAt:desc",
    "filters[hidden][$eq]": "false",
  }

  if (filters.category && filters.category !== "All Categories") {
    params["filters[categories][name][$eq]"] = filters.category
  }
  if (filters.level && filters.level !== "All Levels") {
    params["filters[level][$eq]"] = filters.level
  }
  if (filters.featured) {
    params["filters[isFeatured][$eq]"] = "true"
  }
  if (filters.bestseller) {
    params["filters[isBestseller][$eq]"] = "true"
  }
  if (filters.ids?.length) {
    filters.ids.forEach((id, i) => {
      params[`filters[id][$in][${i}]`] = id
    })
  }

  const data = await strapiGet<StrapiCollectionResponse<StrapiCourseAttributes>>(
    "/courses",
    params,
    { revalidate: opts.revalidate ?? 3600, tags: opts.tags ?? ["courses"] }
  )

  let courses = data.data.map(mapCourse)

  // Client-side search filter (Strapi $containsi across multiple fields requires OR)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    courses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    )
  }

  return courses
}

/**
 * Fetch a single course by slug with full section/lesson data.
 * Tagged with "courses" and "course:{slug}" for targeted revalidation.
 */
export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const params: Record<string, string> = {
    ...DETAIL_POPULATE,
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  }

  const data = await strapiGet<StrapiCollectionResponse<StrapiCourseAttributes>>(
    "/courses",
    params,
    { revalidate: 3600, tags: ["courses", `course:${slug}`] }
  )

  const entity = data.data[0]
  return entity ? mapCourse(entity) : null
}
