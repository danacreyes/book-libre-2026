import type { ReservationJSON } from "@/json/reservationJSON"
import { Book } from "./book"
import { UserProfile } from "./userProfile"
import { BookReview } from "./review"
import { ReservationState } from "@/types/reservationState"

export class Reservation {
  id: number
  book: Book
  user: UserProfile
  review: BookReview
  pickUpDate: Date
  dropOffDate: Date
  state: ReservationState

  constructor(
    id: number = 0,
    book: Book = new Book(),
    user: UserProfile = new UserProfile(),
    review: BookReview = new BookReview(),
    pickUpDate: Date = new Date(),
    dropOffDate: Date = new Date(),
    state: ReservationState = ReservationState.AVAILABLE
  ) {
    this.id = id
    this.book = book
    this.user = user
    this.review = review
    this.pickUpDate = pickUpDate
    this.dropOffDate = dropOffDate
    this.state = state
  }

  // resto las fechas en milisegundos y convierto a días.
  reservationDays(): number {
    return Math.floor((this.dropOffDate.getTime() - this.pickUpDate.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  static fromJSON(reservationJSON: ReservationJSON): Reservation {
    const book = Object.assign(new Book(), reservationJSON.book, {})
    const user = Object.assign(new UserProfile(), reservationJSON.user, {})
    const review = Object.assign(new BookReview(), reservationJSON.review, {})
    const reservation = Object.assign(new Reservation(), reservationJSON, {})
    reservation.book = book
    reservation.user = user
    reservation.review = review
    return reservation
  }

}