import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import { graphqlService } from "@/services/graphql/graphqlService"

const mockedPost = vi.spyOn(axios, "post")

const mockCalifications = [
  { bookType: "COMUN", avgRating: 4.12 },
  { bookType: "CON DEDICATORIA", avgRating: 4.57 },
  { bookType: "COLECCIONABLE", avgRating: 4.83 },
]

describe("GraphQLService - getCalificationAnalisis", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("debería hacer POST al endpoint /graphql", async () => {
    mockedPost.mockResolvedValue({
      data: { data: { calificactionAnalisis: mockCalifications } },
    })
    await graphqlService.getCalificationAnalisis()
    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/graphql"),
      expect.objectContaining({ query: expect.stringContaining("calificactionAnalisis") }),
    )
  })

  it("debería retornar el array de calificaciones por tipo", async () => {
    mockedPost.mockResolvedValue({
      data: { data: { calificactionAnalisis: mockCalifications } },
    })
    const result = await graphqlService.getCalificationAnalisis()
    expect(result).toEqual(mockCalifications)
  })

  it("debería lanzar error si la respuesta GraphQL contiene errores", async () => {
    mockedPost.mockResolvedValue({
      data: { errors: [{ message: "campo no válido" }] },
    })
    await expect(graphqlService.getCalificationAnalisis()).rejects.toThrow(
      "Error en consulta GraphQL: campo no válido",
    )
  })

  it("debería lanzar error si axios falla", async () => {
    mockedPost.mockRejectedValue(new Error("Network error"))
    await expect(graphqlService.getCalificationAnalisis()).rejects.toThrow("Network error")
  })
})

describe("GraphQLService - getCatalogHealth", () => {
  const mockCatalogHealth = {
    total: 200,
    prestados: 42,
    disponiblesNuncaReservados: 88,
    disponiblesReservadosAFuturo: 30,
    disponiblesDevueltos: 40,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("debería hacer POST al endpoint /graphql con la query catalogHealth", async () => {
    mockedPost.mockResolvedValue({
      data: { data: { catalogHealth: mockCatalogHealth } },
    })
    await graphqlService.getCatalogHealth()
    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/graphql"),
      expect.objectContaining({ query: expect.stringContaining("catalogHealth") }),
    )
  })

  it("debería retornar el estado de salud del catálogo", async () => {
    mockedPost.mockResolvedValue({
      data: { data: { catalogHealth: mockCatalogHealth } },
    })
    const result = await graphqlService.getCatalogHealth()
    expect(result).toEqual(mockCatalogHealth)
  })

  it("debería lanzar error si la respuesta GraphQL contiene errores", async () => {
    mockedPost.mockResolvedValue({
      data: { errors: [{ message: "campo no válido" }] },
    })
    await expect(graphqlService.getCatalogHealth()).rejects.toThrow(
      "Error en consulta GraphQL: campo no válido",
    )
  })

  it("debería lanzar error si axios falla", async () => {
    mockedPost.mockRejectedValue(new Error("Network error"))
    await expect(graphqlService.getCatalogHealth()).rejects.toThrow("Network error")
  })
})
