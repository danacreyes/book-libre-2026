export const ReservationState = {
  AVAILABLE: "Disponible",
  BORROWED: "Prestado",
  ENDED: "Devuelto",
}

export type ReservationState = (typeof ReservationState)[keyof typeof ReservationState]
