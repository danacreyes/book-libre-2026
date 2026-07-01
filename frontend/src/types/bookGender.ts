export const BookGender = {
  DRAMA: "Drama",
  SCIENCE_FICTION: "Ciencia Ficcion",
  ROMANCE: "Romance",
  SELF_HELP: "Auto Ayuda",
  DESIGN: "Diseño",
  CLASSIC_LITERATURE: "Literatura Clasica",
}

export type BookGender = (typeof BookGender)[keyof typeof BookGender]
