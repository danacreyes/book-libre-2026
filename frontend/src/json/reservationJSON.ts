import type { ReservationState } from "@/types/reservationState"
import type { BookJSON } from "./bookJSON"
import type { UserProfileJSON } from "./userProfileJSON"
import type { ReviewJSON } from "./reviewJSON"

export type ReservationJSON = {
  id: number
  book: BookJSON
  user: UserProfileJSON
  review: ReviewJSON
  pickUpDate: Date
  dropOffDate: Date
  state: ReservationState
}