"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isPurchased } from "@/lib/purchases/store"
import { formatPrice } from "@/lib/courses/helpers"
import { PlayCircle, ShoppingCart } from "lucide-react"

interface PurchaseButtonProps {
  courseId: string
  courseSlug: string
  price: number
}

export default function PurchaseButton({ courseId, courseSlug, price }: PurchaseButtonProps) {
  const router = useRouter()
  const [purchased, setPurchased] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPurchased(isPurchased(courseId))
  }, [courseId])

  if (!mounted) {
    // SSR placeholder — same size to avoid layout shift
    return (
      <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
    )
  }

  if (purchased) {
    return (
      <button
        onClick={() => router.push(`/watch/${courseSlug}`)}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        <PlayCircle className="w-5 h-5" />
        Watch Course
      </button>
    )
  }

  return (
    <button
      onClick={() => router.push(`/checkout/${courseSlug}`)}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
    >
      <ShoppingCart className="w-5 h-5" />
      Enroll for {formatPrice(price)}
    </button>
  )
}
