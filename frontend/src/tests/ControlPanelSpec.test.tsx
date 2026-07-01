import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ControlPanel from "@/pages/ControlPanel"
import { graphqlService } from "@/services/graphql/graphqlService"
import { showToast } from "@/utils/toast"
import type { BookTypeCalification } from "@/domain/graphql/BookTypeCalification"
import type { CatalogHealth } from "@/domain/graphql/CatalogHealth"

vi.mock("@/utils/toast", () => ({
  showToast: { httpError: vi.fn() },
}))

const mockCalifications: BookTypeCalification[] = [
  { bookType: "COMUN", avgRating: 4.12 },
  { bookType: "CON DEDICATORIA", avgRating: 4.57 },
  { bookType: "COLECCIONABLE", avgRating: 4.83 },
]

const mockCatalogHealth: CatalogHealth = {
  total: 200,
  prestados: 42,
  disponiblesNuncaReservados: 88,
  disponiblesReservadosAFuturo: 30,
  disponiblesDevueltos: 40,
}

describe("ControlPanel - Calificación por tipo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(graphqlService, "getConversionRate").mockResolvedValue([])
    vi.spyOn(graphqlService, "getCalificationAnalisis").mockResolvedValue(mockCalifications)
    vi.spyOn(graphqlService, "getCatalogHealth").mockResolvedValue(mockCatalogHealth)
  })

  it("llama a getCalificationAnalisis al montar el componente", async () => {
    render(<ControlPanel />)
    await waitFor(() => {
      expect(graphqlService.getCalificationAnalisis).toHaveBeenCalledOnce()
    })
  })

  it("muestra la etiqueta de cada tipo de libro", async () => {
    render(<ControlPanel />)
    await waitFor(() => {
      expect(screen.getByText("Común")).toBeTruthy()
      expect(screen.getByText("Con Dedicatoria")).toBeTruthy()
      expect(screen.getByText("Coleccionable")).toBeTruthy()
    })
  })

  it("muestra el avgRating de cada tipo", async () => {
    render(<ControlPanel />)
    await waitFor(() => {
      expect(screen.getByText("4.12")).toBeTruthy()
      expect(screen.getByText("4.57")).toBeTruthy()
      expect(screen.getByText("4.83")).toBeTruthy()
    })
  })

  it("muestra toast de error si falla la carga de calificaciones", async () => {
    const error = new Error("Error de red")
    vi.spyOn(graphqlService, "getCalificationAnalisis").mockRejectedValueOnce(error)
    render(<ControlPanel />)
    await waitFor(() => {
      expect(showToast.httpError).toHaveBeenCalledWith(error)
    })
  })

  it("no muestra filas de calificación si el servicio devuelve array vacío", async () => {
    vi.spyOn(graphqlService, "getCalificationAnalisis").mockResolvedValueOnce([])
    render(<ControlPanel />)
    await waitFor(() => {
      expect(screen.queryByText("Común")).toBeNull()
      expect(screen.queryByText("Con Dedicatoria")).toBeNull()
      expect(screen.queryByText("Coleccionable")).toBeNull()
    })
  })
})

describe("ControlPanel - Estado del catálogo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(graphqlService, "getConversionRate").mockResolvedValue([])
    vi.spyOn(graphqlService, "getCalificationAnalisis").mockResolvedValue([])
    vi.spyOn(graphqlService, "getCatalogHealth").mockResolvedValue(mockCatalogHealth)
  })

  it("llama a getCatalogHealth al montar el componente", async () => {
    render(<ControlPanel />)
    await waitFor(() => {
      expect(graphqlService.getCatalogHealth).toHaveBeenCalledOnce()
    })
  })

  it("muestra el total y los valores de cada bucket del catálogo", async () => {
    render(<ControlPanel />)
    await waitFor(() => {
      expect(screen.getByText("200")).toBeTruthy()  // total
      expect(screen.getByText("42")).toBeTruthy()   // prestados
      expect(screen.getByText("88")).toBeTruthy()   // nunca reservados
      expect(screen.getByText("30")).toBeTruthy()   // reserva a futuro
      expect(screen.getByText("40")).toBeTruthy()   // devueltos
    })
  })

  it("muestra toast de error si falla la carga del estado del catálogo", async () => {
    const error = new Error("Error de red")
    vi.spyOn(graphqlService, "getCatalogHealth").mockRejectedValueOnce(error)
    render(<ControlPanel />)
    await waitFor(() => {
      expect(showToast.httpError).toHaveBeenCalledWith(error)
    })
  })
})
