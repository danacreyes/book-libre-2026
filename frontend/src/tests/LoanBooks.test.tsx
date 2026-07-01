import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BookCard from "@/components/BookCard"
import type { ReservationDTO, ReservationState } from "@/types/reservationType"

vi.mock("@/components/RatingModal", () => ({
  default: ({ bookTitle }: { bookTitle: string }) => (
    <div data-testid="rating-modal">{bookTitle}</div>
  ),
}))

const makeDTO = (overrides: Partial<ReservationDTO> = {}): ReservationDTO => ({
  id: 1,
  bookTitle: "1984",
  bookAuthor: "Orwell",
  bookCover: "/img.jpg",
  rating: 4,
  loanedBy: "Juan",
  loanedTo: "Carlos",
  pickUpDate: "2026-03-01",
  dropOffDate: "2026-03-15",
  bibliokarmas: 10,
  state: "ACTIVE" as ReservationState,
  soonToEnd: false,
  canRate: false,
  ...overrides,
})

describe("BookCard", () => {
  it("muestra el boton de calificar y aparece el modal", async () => {
    // rerender se pone asi para solo usar la utilidad render, y abajo pones rerender devuelta para usar el mismo "nodo" en el DOM
    const { rerender } = render(
      <BookCard
        book={makeDTO({ canRate: false })}
        activeTab="prestados-a-mi"
        onRated={vi.fn()}
      />,
    )
    expect(
      screen.queryByRole("button", { name: /calificar/i }),
    ).not.toBeInTheDocument()

    rerender(
      <BookCard
        book={makeDTO({ canRate: true })}
        activeTab="prestados-a-mi"
        onRated={vi.fn()}
      />,
    )
    const btn = screen.getByRole("button", { name: /calificar/i }) // case insensitive
    expect(btn).toBeInTheDocument()

    await userEvent.click(btn)
    expect(screen.getByTestId("rating-modal")).toBeInTheDocument()
  })

  it("mustra prestado por o prestado a segun el tab'", () => {
    const book = makeDTO({ loanedBy: "Maria", loanedTo: "Pedro" })

    const { rerender } = render(
      <BookCard book={book} activeTab="prestados-a-mi" onRated={vi.fn()} />,
    )
    expect(screen.getByText("Prestado por:")).toBeInTheDocument()
    expect(screen.getByText("Maria")).toBeInTheDocument()

    rerender(
      <BookCard book={book} activeTab="prestados-por-mi" onRated={vi.fn()} />,
    )
    expect(screen.getByText("Prestado a:")).toBeInTheDocument()
    expect(screen.getByText("Pedro")).toBeInTheDocument()
  })

  it("muestra titulo, autor y badge", () => {
    render(
      <BookCard
        book={makeDTO({
          bookTitle: "Rayuela",
          bookAuthor: "Cortázar",
          state: "RETURNED" as ReservationState,
        })}
        activeTab="prestados-a-mi"
        onRated={vi.fn()}
      />,
    )
    expect(screen.getByText("Rayuela")).toBeInTheDocument()
    expect(screen.getByText("Cortázar")).toBeInTheDocument()
    expect(screen.getByText("DEVUELTO")).toBeInTheDocument()
  })
})
