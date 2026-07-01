import { ValidationMessage } from "@/validation/validationMessage"

export type UserJSONLoginRequest = {
  email: string
  password: string
}

export interface UserJSONResponse {
  accessToken: string
  refreshToken: string
  expirationTime: number
  email: string
  name: string
  id: string
}

export interface UserJSONRegisterRequest {
  name: string
  email: string
  password: string
  passwordRetry: string
}

export class UserType {
  errors: ValidationMessage[] = []

  public email: string = "".trim()
  public password: string = "".trim()
  public name: string = "nombre".trim()

  constructor(email: string, password: string, name: string) {
    this.email = email
    this.password = password
    this.name = name
  }

  static fromJson(userJSON: UserJSONResponse): UserType {
    return Object.assign(
      new UserType(userJSON.email, "", userJSON.name),
      userJSON,
      {},
    )
  }

  addError(field: string, message: string) {
    this.errors.push(new ValidationMessage(field, message))
  }

  validateLogin() {
    this.errors = []

    if (!this.email?.trim()) {
      this.addError("email", "Debe ingresar un email")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.addError("email", "El formato del email no es válido")
      }
    }

    if (!this.password) {
      this.addError("password", "Debe ingresar una contraseña")
    }

    return this.errors
  }

  validate() {
    this.errors = []

    if (!this.email?.trim()) {
      this.addError("email", "Debe ingresar un email")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.addError("email", "El formato del email no es válido")
      }
    }

    if (!this.password) {
      this.addError("password", "Debe ingresar una contraseña")
    }

    if (!this.name) {
      this.addError("name", "Debe ingresar un nombre")
    }

    return this.errors
  }
}
