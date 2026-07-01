export const UserKind = {
  READER: "Lector",
  PUBLISHER: "Publicador",
  COMBINED: "Lector / Publicador",
  ADMIN: "Admin",
}

export type UserKind = (typeof UserKind)[keyof typeof UserKind]
