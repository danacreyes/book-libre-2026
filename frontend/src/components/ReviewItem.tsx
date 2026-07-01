import type { BookReview } from "@/domain/review";
import { useState } from "react";
import { StarRating } from "./ReviewsModal";

export function ReviewItem({ review, i }: { review: BookReview; i: number }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.review.length > 90

  return (
    <div
      key={`${review.id}-${i}`}
      className="flex gap-4 rounded-xl border border-gray-100 bg-gray-100 p-4"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E0E7FF] text-sm font-bold text-[#26A67D]">
        {review.reviewerName.charAt(0).toUpperCase()}
        {review.reviewerName.charAt(1)?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {review.reviewerName}
          </span>
          <span className="text-xs text-gray-400">{review.timestamp}</span>
        </div>
        <StarRating rating={review.rating} />
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 italic break-words">
          "{expanded || !isLong ? review.review : review.review.slice(0, 90) + "..."}"
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-semibold text-[#26A67D] hover:underline"
          >
            {expanded ? "Ver menos ↑" : "Ver más ↓"}
          </button>
        )}
      </div>
    </div>
  )
}