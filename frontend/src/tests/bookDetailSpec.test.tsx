import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, vi, test } from "vitest"
import BookDetail from "@/pages/BookDetail"
import { bookService } from "@/services/bookService"
import { reserveService } from "@/services/reserveService"
import { Book } from "@/domain/book"
import { BookReview } from "@/domain/review"
import { MemoryRouter, Route, Routes } from "react-router"
import { type AxiosResponse, type InternalAxiosRequestConfig } from "axios"

vi.mock("@/context/AuthContext", () => ({ getId: () => 1 }))

vi.mock("@/context/UserProfileContext", () => ({
  useUserProfile: () => ({
    user: { id: 1 },
  }),
}))

const mockAxiosResponse = <T,>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {
    headers: {},
  } as InternalAxiosRequestConfig,
})

const mockBook = Object.assign(new Book(), {
  id: 1,
  title: "El Proceso",
  desc: "Una pesadilla burocrática.",
  author: { name: "Franz Kafka", avatar: "kafka.png" },
  bookType: "COMUN",
  gender: "DRAMA",
  numPages: 255,
  language: "SPANISH",
  editorial: "Alianza Editorial",
  isbn: "978-84-206-3667-2",
  publishDate: "1925-04-26",
  condition: "MUY BUENO",
  imageSrc: "https://imagen.com/proceso.jpg",
})

const mockReviews: BookReview[] = [
  Object.assign(new BookReview(), {
    id: 1,
    rating: 5,
    review: "Obra maestra.",
    reviewerName: "Valentina Sosa",
    timestamp: "2025-09-12",
  }),
  Object.assign(new BookReview(), {
    id: 2,
    rating: 4,
    review: "Brillante pero incómodo.",
    reviewerName: "Mateo López",
    timestamp: "2025-11-30",
  }),
]

const renderBookDetail = () =>
  render(
    <MemoryRouter initialEntries={["/book/1"]}>
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </MemoryRouter>,
  )

describe("Tests para BookDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(bookService, "getBookDetail").mockResolvedValue(mockBook)
    vi.spyOn(reserveService, "getReviews").mockResolvedValue(
      mockAxiosResponse(mockReviews),
    )
    vi.spyOn(reserveService, "getReservedDates").mockResolvedValue(
      mockAxiosResponse([]),
    )
    vi.spyOn(reserveService, "getBibliokarmas").mockResolvedValue(
      mockAxiosResponse(210),
    )
  })

  describe("Carga del libro", () => {
    test("muestra el estado de carga inicial", () => {
      renderBookDetail()
      expect(screen.findByText("Cargando...")).toBeTruthy()
    })

    test("muestra el título y autor cuando carga correctamente", async () => {
      renderBookDetail()
      await waitFor(() => {
        expect(
          screen.findByRole("heading", { name: "El Proceso" }),
        ).toBeTruthy()
        expect(screen.findByText("Franz Kafka")).toBeTruthy()
      })
    })

    test("muestra la sinopsis del libro", async () => {
      renderBookDetail()
      await waitFor(() =>
        expect(screen.findByText("Una pesadilla burocrática.")).toBeTruthy(),
      )
    })

    test('muestra "Libro no encontrado" si el servicio falla', async () => {
      vi.spyOn(bookService, "getBookDetail").mockRejectedValueOnce(
        new Error("Not found"),
      )
      renderBookDetail()
      await waitFor(() =>
        expect(screen.getByText("Libro no encontrado")).toBeTruthy(),
      )
    })
  })

  describe("Reseñas", () => {
    test("muestra el promedio de rating de las reseñas", async () => {
      renderBookDetail()
      // promedio de 5 y 4 = 4.5
      await waitFor(() => expect(screen.findByText("(4.5)")).toBeTruthy())
    })

    test("muestra las primeras dos reseñas", async () => {
      renderBookDetail()
      await waitFor(() => {
        expect(screen.findByText('"Obra maestra."')).toBeTruthy()
        expect(screen.findByText('"Brillante pero incómodo."')).toBeTruthy()
      })
    })

    test("muestra el botón ver más si hay 2 o más reseñas", async () => {
      renderBookDetail()
      await waitFor(() =>
        expect(screen.findByText("Ver todas las reseñas →")).toBeTruthy(),
      )
    })

    test("no muestra el botón ver más si hay menos de 2 reseñas", async () => {
      vi.spyOn(reserveService, "getReviews").mockResolvedValueOnce(
        mockAxiosResponse([mockReviews[0]]),
      )
      renderBookDetail()
      await waitFor(() => {
        expect(screen.queryByText("Ver todas las reseñas →")).toBeNull()
      })
    })

    test("muestra mensaje cuando el libro no tiene reseñas", async () => {
      vi.spyOn(reserveService, "getReviews").mockResolvedValueOnce(
        mockAxiosResponse([]),
      )
      renderBookDetail()
      await waitFor(() =>
        expect(
          screen.findByText("Este libro todavía no tiene reseñas."),
        ).toBeTruthy(),
      )
    })
  })
})
