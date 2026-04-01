"use client"

/**
 * Purchase store — client-side persistence with localStorage.
 *
 * All functions are client-safe (guarded by `typeof window`).
 * Server Components should use `getPurchasedCourseIds()` from
 * lib/purchases/server.ts (which returns empty array on server).
 */

import type { PurchasedCourse } from "@/types/course"

const STORAGE_KEY = "blue_edu_purchases"

function readStore(): PurchasedCourse[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PurchasedCourse[]) : []
  } catch {
    return []
  }
}

function writeStore(purchases: PurchasedCourse[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases))
}

export function getPurchases(): PurchasedCourse[] {
  return readStore()
}

export function isPurchased(courseId: string): boolean {
  return readStore().some((p) => p.courseId === courseId)
}

export function purchaseCourse(courseId: string): void {
  const store = readStore()
  if (!store.some((p) => p.courseId === courseId)) {
    store.push({
      courseId,
      purchasedAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
    })
    writeStore(store)
  }
}

export function updateProgress(
  courseId: string,
  lessonId: string,
  completed: boolean
): void {
  const store = readStore()
  const entry = store.find((p) => p.courseId === courseId)
  if (!entry) return

  if (completed && !entry.completedLessons.includes(lessonId)) {
    entry.completedLessons.push(lessonId)
  } else if (!completed) {
    entry.completedLessons = entry.completedLessons.filter((id) => id !== lessonId)
  }

  entry.lastWatchedLessonId = lessonId
  entry.lastWatchedAt = new Date().toISOString()
  writeStore(store)
}

export function getProgress(courseId: string, totalLessons: number): number {
  const entry = readStore().find((p) => p.courseId === courseId)
  if (!entry || totalLessons === 0) return 0
  return Math.round((entry.completedLessons.length / totalLessons) * 100)
}

export function getPurchasedIds(): string[] {
  return readStore().map((p) => p.courseId)
}
