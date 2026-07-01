import { ValidationMessage } from "@/validation/validationMessage"
import { UserKind } from "../types/userKind"
import type { UserProfileJSON } from "@/json/userProfileJSON"

export class UserProfile {
  DESC_MAX_CHARACTERS: number = 45
  NAME_MAX_CHARACTERS: number = 15
  errors: ValidationMessage[] = []

  id: string //cambio por el nuevo UUID
  name: string
  description: string
  img: string
  location: string = "Buenos Aires, ARG"
  timestamp: string 
  bibliokarmas: number
  email: string
  cel: string
  userType: UserKind

  constructor(
    id: string = "", //cambio por el nuevo UUID
    name: string = "",
    description: string = "",
    img: string = "",
    location: string = "",
    timestamp: string = "",
    bibliokarmas: number = 0,
    email: string = "",
    cel: string = "",
    userType: UserKind = UserKind.READER,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.img = img
    this.location = location
    this.timestamp = timestamp
    this.bibliokarmas = bibliokarmas
    this.email = email
    this.cel = cel
    this.userType = userType
  }

  static fromJSON(userJSON: UserProfileJSON): UserProfile {
    return Object.assign(new UserProfile(), {
    ...userJSON,
    location: userJSON.location || "Buenos Aires, ARG",
  })
  }

  static toJSON(user: UserProfile): UserProfileJSON {
    const userJSON: UserProfileJSON = {
      id: user.id,
      name: user.name,
      description: user.description,
      img: user.img,
      location: user.location,
      timestamp: user.timestamp,
      bibliokarmas: user.bibliokarmas,
      email: user.email,
      cel: user.cel,
      userType: user.userType,
    }
    return userJSON
  }

  addError(field: string, message: string) {
    this.errors.push(new ValidationMessage(field, message))
  }

  validateName() {
    if (this.name.length > this.NAME_MAX_CHARACTERS) {
      this.addError(
        "invalid-name",
        "El nombre no puede ser mayor a 15 caracteres",
      )
    } else if (this.name.length <= 1) {
      this.addError(
        "invalid-name",
        "El nombre no puede estar vacio, ni ser menor a 2 caracteres",
      )
    }
  }

  validateDescription() {
    if (this.description.length > this.DESC_MAX_CHARACTERS) {
      this.addError(
        "too-long-desc",
        "La descripcion no puede contener mas de 35 caracteres",
      )
    }
  }

  validateLocation() {
    const regex = /^[A-Za-z0-9._%+-\s]+,\s[A-Z]{1,3}$/
    if (!regex.test(this.location)) {
      this.addError(
        "invalid-format-loc",
        "Ingrese una ubicacion en formato valido: \'PROVINCIA, ARG\' ",
      )
    } else if (this.location.length == 0) {
      this.addError(
        "invalid-length-loc",
        "La ubicacion no puede estar vacia."
      )
    }
  }

  validateEmail() {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!regex.test(this.email)) {
      this.addError(
        "invalid-format-email",
        "Ingrese un mail en formato valido: example@example.com",
      )
    } else if (this.email.length == 0) {
      this.addError(
        "invalid-length-email",
        "El mail no puede estar vacio."
      )
    }
  }

  validateCel() {
    const regex = /^11\d{8}$/
    if (!regex.test(this.cel)) {
      this.addError(
        "invalid-format-cel",
        "Ingrese un telefono en formato valido: 1177889966",
      )
    }
  }

  validate() {
    this.errors = []
    this.validateName()
    this.validateDescription()
    this.validateLocation()
    this.validateEmail()
    this.validateCel()
  }
}
