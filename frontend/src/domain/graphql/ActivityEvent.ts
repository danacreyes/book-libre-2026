export type ActivityEventType = "BOOK_REGISTERED" | "RESERVATION"

// Lista heterogénea del feed: el back expone una interface GraphQL con __typename.
export type ActivityEvent = {
  __typename: "NewBookEvent" | "NewReservationEvent"
  date: string // ISO-8601
  typeEvent: ActivityEventType
  user: string
  bookTitle: string
}
