"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { CATEGORIES, LEVELS } from "@/data/courses"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CourseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentQ = searchParams.get("q") ?? ""
  const currentCategory = searchParams.get("category") ?? ""
  const currentLevel = searchParams.get("level") ?? ""

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      router.push(`/courses?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search courses..."
          defaultValue={currentQ}
          onChange={(e) => {
            const value = e.target.value
            // Debounce-style: update on each change
            updateParams({ q: value })
          }}
          className="pl-10"
        />
      </div>

      {/* Category */}
      <select
        value={currentCategory}
        onChange={(e) => updateParams({ category: e.target.value })}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[160px]"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat === "All Categories" ? "" : cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Level */}
      <select
        value={currentLevel}
        onChange={(e) => updateParams({ level: e.target.value })}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[140px]"
      >
        {LEVELS.map((lvl) => (
          <option key={lvl} value={lvl === "All Levels" ? "" : lvl}>
            {lvl}
          </option>
        ))}
      </select>
    </div>
  )
}
