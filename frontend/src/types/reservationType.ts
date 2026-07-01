//! ESTO ES SOLO MOMEMTANEO

export type ReservationState =
  | "ACTIVE"
  | "AVAILABLE"
  | "BORROWED"
  | "RESERVED"
  | "SOON_TO_END"
  | "RETURNED"

export interface ReservationDTO {
  id: number
  bookTitle: string
  bookAuthor: string
  bookCover: string
  rating: number
  loanedBy: string
  loanedTo: string
  pickUpDate: string
  dropOffDate: string
  bibliokarmas: number
  state: ReservationState
  soonToEnd: boolean
  canRate: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapReservation = (res: any): ReservationDTO => ({
  id: res.id,
  bookTitle: res.book.title,
  bookAuthor: res.book.authorName,
  bookCover: res.book.imageSrc ?? "",
  rating: res.review ?? 0, // la puntuacion es de la reserva no de el libro
  loanedBy: res.loanedBy,
  loanedTo: res.loanedTo,
  pickUpDate: res.pickUpDate,
  dropOffDate: res.dropOffDate,
  bibliokarmas: res.bibliokarmas,
  state: res.state as ReservationState,
  soonToEnd: res.state === "SOON_TO_END",
  canRate: res.canRate,
})
