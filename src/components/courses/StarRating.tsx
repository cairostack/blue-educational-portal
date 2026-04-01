import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: "sm" | "md"
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5"
  const totalStars = 5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: totalStars }, (_, i) => {
        const filled = i + 1 <= Math.floor(rating)
        const partial = !filled && i < rating

        return (
          <span key={i} className="relative inline-block">
            {/* Background (empty) star */}
            <Star className={`${starSize} text-gray-300`} />
            {/* Filled overlay */}
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
              >
                <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
