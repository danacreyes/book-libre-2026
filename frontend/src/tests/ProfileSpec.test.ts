import { describe, it, expect } from "vitest"
import { UserProfile } from "@/domain/userProfile"
import { UserKind } from "@/types/userKind"
import { statusLabels, statusStyles } from "@/components/ProfileBook"

describe("ProfileBook: mapeo de estados del backend a etiquetas Disponible/Prestado", () => {
  describe('Estados que se muestran como "Prestado"', () => {
    it.each([
      ["ACTIVE", "Prestado"],
      ["BORROWED", "Prestado"],
      ["SOON_TO_END", "Prestado"],
    ])('El estado %s se muestra como "%s"', (state, expectedLabel) => {
      expect(statusLabels[state]).toBe(expectedLabel)
    })

    it.each([
      ["ACTIVE", "bg-orange-400 text-white"],
      ["BORROWED", "bg-orange-400 text-white"],
      ["SOON_TO_END", "bg-orange-400 text-white"],
    ])("El estado %s tiene estilo naranja", (state, expectedStyle) => {
      expect(statusStyles[state]).toBe(expectedStyle)
    })
  })

  describe('Estados que se muestran como "Disponible"', () => {
    it.each([
      ["AVAILABLE", "Disponible"],
      ["RESERVED", "Disponible"],
      ["RETURNED", "Disponible"],
    ])('El estado %s se muestra como "%s"', (state, expectedLabel) => {
      expect(statusLabels[state]).toBe(expectedLabel)
    })

    it.each([
      ["AVAILABLE", "bg-green-500 text-white"],
      ["RESERVED", "bg-green-500 text-white"],
      ["RETURNED", "bg-green-500 text-white"],
    ])("El estado %s tiene estilo verde", (state, expectedStyle) => {
      expect(statusStyles[state]).toBe(expectedStyle)
    })
  })

  it("Un estado desconocido no tiene etiqueta definida", () => {
    expect(statusLabels["UNKNOWN"]).toBeUndefined()
  })
})

describe("ProfileBook: la API devuelve reservas y se mapean correctamente", () => {
  it("Un libro con estado ACTIVE del backend se interpreta como Prestado", () => {
    const apiResponse = {
      items: [
        {
          id: 1,
          book: {
            id: 10,
            title: "1984",
            authorName: "Orwell",
            gender: "Drama",
            timestamp: "2026-01-15",
            imageSrc: "/img.jpg",
          },
          state: "ACTIVE",
        },
        {
          id: 2,
          book: {
            id: 20,
            title: "Rayuela",
            authorName: "Cortazar",
            gender: "Drama",
            timestamp: "2026-02-10",
            imageSrc: "/img2.jpg",
          },
          state: "AVAILABLE",
        },
      ],
      totalPages: 1,
      total: 2,
    }

    const prestados = apiResponse.items.filter(
      (item) => statusLabels[item.state] === "Prestado",
    )
    const disponibles = apiResponse.items.filter(
      (item) => statusLabels[item.state] === "Disponible",
    )

    expect(prestados).toHaveLength(1)
    expect(prestados[0].book.title).toBe("1984")

    expect(disponibles).toHaveLength(1)
    expect(disponibles[0].book.title).toBe("Rayuela")
  })

  it("Todos los libros devueltos por la API tienen un estado que mapea a Disponible o Prestado", () => {
    const apiResponse = {
      items: [
        {
          id: 1,
          book: {
            id: 10,
            title: "1984",
            authorName: "Orwell",
            gender: "Drama",
            timestamp: "2026-01-15",
            imageSrc: "/img.jpg",
          },
          state: "ACTIVE",
        },
        {
          id: 2,
          book: {
            id: 20,
            title: "Rayuela",
            authorName: "Cortazar",
            gender: "Drama",
            timestamp: "2026-02-10",
            imageSrc: "/img2.jpg",
          },
          state: "RETURNED",
        },
        {
          id: 3,
          book: {
            id: 30,
            title: "El Aleph",
            authorName: "Borges",
            gender: "Drama",
            timestamp: "2026-03-01",
            imageSrc: "/img3.jpg",
          },
          state: "SOON_TO_END",
        },
        {
          id: 0,
          book: {
            id: 40,
            title: "Ficciones",
            authorName: "Borges",
            gender: "Drama",
            timestamp: "2026-03-05",
            imageSrc: "/img4.jpg",
          },
          state: "AVAILABLE",
        },
      ],
      totalPages: 1,
      total: 4,
    }

    apiResponse.items.forEach((item) => {
      const label = statusLabels[item.state]
      expect(label).toBeDefined()
      expect(["Disponible", "Prestado"]).toContain(label)
    })
  })
})

describe("UserProfile: validacion del perfil rechaza datos invalidos", () => {
  const validProfile = () =>
    new UserProfile(
      1,
      "Carlos",
      "Amante de los libros",
      "/img.jpg",
      "Buenos Aires, ARG",
      "2026-01-01",
      100,
      "carlos@mail.com",
      "1122334455",
      UserKind.READER,
    )

  it("Un perfil con datos validos no tiene errores", () => {
    const profile = validProfile()
    profile.validate()
    expect(profile.errors).toHaveLength(0)
  })

  it("Nombre mayor a 15 caracteres genera error", () => {
    const profile = validProfile()
    profile.name = "NombreDemasiadoLargoParaElCampo"
    profile.validate()
    const nameError = profile.errors.find((e) => e.field === "invalid-name")
    expect(nameError).toBeDefined()
  })

  it("Nombre vacio o de 1 caracter genera error", () => {
    const profile = validProfile()
    profile.name = "A"
    profile.validate()
    const nameError = profile.errors.find((e) => e.field === "invalid-name")
    expect(nameError).toBeDefined()
  })

  it("Descripcion mayor a 45 caracteres genera error", () => {
    const profile = validProfile()
    profile.description =
      "Esta descripcion tiene mas de cuarenta y cinco caracteres y deberia fallar"
    profile.validate()
    const descError = profile.errors.find((e) => e.field === "too-long-desc")
    expect(descError).toBeDefined()
  })

  it("Telefono con formato invalido genera error", () => {
    const profile = validProfile()
    profile.cel = "12345"
    profile.validate()
    const celError = profile.errors.find(
      (e) => e.field === "invalid-format-cel",
    )
    expect(celError).toBeDefined()
  })

  it("Telefono valido con formato 11XXXXXXXX no genera error", () => {
    const profile = validProfile()
    profile.cel = "1198765432"
    profile.validate()
    const celError = profile.errors.find(
      (e) => e.field === "invalid-format-cel",
    )
    expect(celError).toBeUndefined()
  })

  it("Email con formato invalido genera error", () => {
    const profile = validProfile()
    profile.email = "correo-invalido"
    profile.validate()
    const emailError = profile.errors.find(
      (e) => e.field === "invalid-format-email",
    )
    expect(emailError).toBeDefined()
  })

  it("Ubicacion con formato invalido genera error", () => {
    const profile = validProfile()
    profile.location = "lugar cualquiera"
    profile.validate()
    const locError = profile.errors.find(
      (e) => e.field === "invalid-format-loc",
    )
    expect(locError).toBeDefined()
  })

  it('Ubicacion con formato valido "Ciudad, ARG" no genera error', () => {
    const profile = validProfile()
    profile.location = "Cordoba, ARG"
    profile.validate()
    const locError = profile.errors.find(
      (e) => e.field === "invalid-format-loc",
    )
    expect(locError).toBeUndefined()
  })

  it("Multiples campos invalidos generan multiples errores", () => {
    const profile = validProfile()
    profile.name = ""
    profile.email = "invalido"
    profile.cel = "abc"
    profile.location = "sin formato"
    profile.validate()
    expect(profile.errors.length).toBeGreaterThanOrEqual(4)
  })
})
