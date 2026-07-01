export const Languages = {
  SPANISH: "ESPAÑOL",
  ENGLISH: "INGLES",
  FRENCH: "FRANCES",
  PORTUGUESE: "PORTUGUES",
}

export type Languages = (typeof Languages)[keyof typeof Languages]
