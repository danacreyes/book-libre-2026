import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"
import { userService } from "../services/UserService"
import { UserType } from "@/domain/user"
// para correrlos pnpm exec vitest run

const mockedPost = vi.spyOn(axios, "post")

const mockUserResponse = {
  id: 1,
  name: "Juan",
  email: "juan@example.com",
}

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("login", () => {
    it("debería retornar un UserType al loguearse correctamente", async () => {
      mockedPost.mockResolvedValue({ data: mockUserResponse })

      const result = await userService.login("juan@example.com", "123456")

      expect(result).toBeInstanceOf(UserType)
      expect(result.email).toBe("juan@example.com")
      expect(result.name).toBe("Juan")
      expect(result.password).toBe("")
    })

    it("debería llamar al endpoint correcto con los datos correctos", async () => {
      mockedPost.mockResolvedValue({ data: mockUserResponse })

      await userService.login("juan@example.com", "123456")

      expect(mockedPost).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        { email: "juan@example.com", password: "123456" },
      )
    })

    it("debería lanzar un error si el login falla", async () => {
      mockedPost.mockRejectedValue(new Error("Credenciales inválidas"))

      await expect(
        userService.login("juan@example.com", "wrongpassword"),
      ).rejects.toThrow("Credenciales inválidas")
    })
  })

  describe("createUser", () => {
    it("debería llamar al endpoint correcto al registrar un usuario", async () => {
      mockedPost.mockResolvedValue({})

      const newUser = new UserType("juan@example.com", "123456", "Juan")
      await userService.createUser(newUser)

      expect(mockedPost).toHaveBeenCalledWith(
        expect.stringContaining("/register"),
        {
          name: "Juan",
          email: "juan@example.com",
          password: "123456",
          passwordRetry: "",
        },
      )
    })

    it("debería lanzar un error si el registro falla", async () => {
      mockedPost.mockRejectedValue(new Error("Email ya registrado"))

      const newUser = new UserType("juan@example.com", "123456", "Juan")

      await expect(userService.createUser(newUser)).rejects.toThrow(
        "Email ya registrado",
      )
    })
  })
})
