import type { ReviewJSON } from "@/json/reviewJSON"
import { ValidationMessage } from "../validation/validationMessage"

export class BookReview {
  MAX_CHARACTERS: number = 250

  errors: ValidationMessage[] = []
  id: number
  rating: number
  review: string
  reviewerName: string
  timestamp: string

  constructor(
    id: number = 0,
    rating: number = 0,
    review: string = "",
    reviewerName: string = "",
    timestamp: string = "",
  ) {
    this.id = id
    this.rating = rating
    this.review = review
    this.reviewerName = reviewerName
    this.timestamp = timestamp
  }

  invalidReviewLength(): boolean {
    return this.review.length > this.MAX_CHARACTERS
  }

  addError(field: string, message: string) {
    this.errors.push(new ValidationMessage(field, message))
  }

  static averageRating(reviews: BookReview[]): number {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }

  validate() {
    this.errors = []

    if (this.invalidReviewLength()) {
      this.addError(
        "book-review-too-long",
        "La reseña debe tener menos de 250 caracteres",
      )
    }
  }

  static fromJSON(bookReviewJSON: ReviewJSON): BookReview {
    return Object.assign(new BookReview(), bookReviewJSON, {})
  }
}
